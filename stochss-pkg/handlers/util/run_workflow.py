#!/usr/bin/env python3


import os
import sys 
import json
import pickle
import plotly
import argparse
import logging

from shutil import copyfile
from datetime import datetime, timezone, timedelta
from gillespy2.core import log

try:
    from parameter_sweep import ParameterSweep
    from run_model import GillesPy2Workflow, ModelFactory, run_solver
except ModuleNotFoundError:
    pass


user_dir = "/home/jovyan"


def save_new_workflow(wkfl, wkfl_type, is_new, verbose):
    '''
    Create and save a new workflow in the same directory as the model 
    used for it.

    Attributes
    ----------
    wkfl : StochSS Workflow
        The workflow object being worked with.
    wkfl_type : str
        The type of workflow to be used.
    is_new : boolean
        Represents whether the workflow is new or not.
    '''
    os.mkdir(wkfl.res_path) # make the workflow's result directory
    try:
        copyfile(wkfl.mdl_path, wkfl.wkfl_mdl_path) # copy the model into the workflow directory
    except FileNotFoundError as error:
        log.error("Failed to copy the model into the directory: {0}".format(error))
    model_info = {"model":"{0}".format(wkfl.mdl_path), "type":"{0}".format(wkfl_type)} # workflow info
    with open(wkfl.info_path, "w") as info_file:
        info_file.write(json.dumps(model_info)) # write the workflow info file
    print(model_info)


def save_existing_workflow(wkfl, wkfl_type, is_new, verbose):
    '''
    Save an existing workflow.

    Attributes
    ----------
    wkfl : StochSS Workflow
        The workflow object being worked with.
    wkfl_type : str
        The type of workflow to be used.
    is_new : boolean
        Represents whether the workflow is new or not.
    '''
    old_model_path = os.path.join(wkfl.wkfl_path, wkfl.mdl_file) # path to the old model
    os.remove(old_model_path) # remove the old model
    try:
        copyfile(wkfl.mdl_path, wkfl.wkfl_mdl_path) # copy the new model into the workflow directory
    except FileNotFoundError as error:
        log.error("Failed to copy the model into the directory: {0}".format(error))
    model_info = {"model":"{0}".format(wkfl.mdl_path), "type":"{0}".format(wkfl_type)} # updated workflow info
    with open(wkfl.info_path, "w") as info_file:
        info_file.write(json.dumps(model_info)) # update the workflow info file
    print(model_info)


def get_models(full_path, name, wkfl_path):
    try:
        with open(full_path, "r") as model_file:
            stochss_model = json.loads(model_file.read())
            stochss_model['name'] = name
    except FileNotFoundError as error:
        log.critical("Failed to copy the model into the directory: {0}".format(error))
        open(os.path.join(wkfl_path, 'ERROR'), 'w').close() # update status to error
    

    try:
        _model = ModelFactory(stochss_model) # build GillesPy2 model
    except Exception as error:
        log.error(str(error))
    gillespy2_model = _model.model

    return gillespy2_model, stochss_model


def update_info_file(info_path, wkfl_mdl_path):
    today = datetime.now() # workflow run start time
    # If this format is not something Javascript's Date.parse() method
    # understands then the workflow status page will be unable to correctly create a
    # Date object from the datestring parsed from the workflow's info.json file
    str_datetime = today.strftime("%b %d, %Y  %I:%M %p UTC") # format timestamp
    
    with open(info_path, 'r') as info_file:
        info_data = json.loads(info_file.read())

    info_data['source_model'] = info_data['model'] # preserve path to source model
    info_data['start_time'] = str_datetime # add start time to workflow info
    info_data['model'] = wkfl_mdl_path # Update the location of the model

    # Update the workflow info file
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(info_data))
    

def run_workflow(wkfl, wkfl_type, is_new, verbose):
    '''
    Run the workflow and return the results, number of trajectories, and is_stochastic.
    Records when the workflow was start and updates the model path in the workflow info file.
    Updates status with status files and logs warnings and errors in the log file.
    Errors are logged to the console.

    Attributes
    ----------
    wkfl : StochSS Workflow
        The workflow object being worked with.
    wkfl_type : str
        The type of workflow to be used.
    is_new : boolean
        Represents whether the workflow is new or not.
    '''
    # save the workflow
    if is_new:
        save_new_workflow(wkfl, wkfl_type, is_new, verbose)
    else:
        save_existing_workflow(wkfl, wkfl_type, is_new, verbose)
    # Get the model data from the file and create the model object
    gillespy2_model, stochss_model = get_models(wkfl.wkfl_mdl_path, wkfl.mdl_file.split('.')[0], wkfl.wkfl_path)
    # Update workflow info file with start time and permanent model file location
    update_info_file(wkfl.info_path, wkfl.wkfl_mdl_path)
    # Update workflow status to running
    open(os.path.join(wkfl.wkfl_path, 'RUNNING'), 'w').close()
    # run the workflow
    try:
        wkfl.run(gillespy2_model, stochss_model, verbose)
    except Exception as error:
        # update workflow status to error if GillesPy2 throws an exception
        log.error("Workflow errors: {0}".format(error))
        open(os.path.join(wkfl.wkfl_path, 'ERROR'), 'w').close()
    else:
        open(os.path.join(wkfl.wkfl_path, 'COMPLETE'), 'w').close() # update status to complete
        

def setup_logger(log_path):
    '''
    Changer the GillesPy2 logger to record only error level logs and higher
    to the console and to log warning level logs and higher to a log file in
    the workflow directory.

    Attributes
    ----------
    workflow_path : str
        Path to the workflow directory
    '''
    formatter = log.handlers[0].formatter # gillespy2 log formatter
    fh_is_needed = True
    for handler in log.handlers:
        if type(handler) is logging.StreamHandler:
            handler.stream = sys.stderr # Reset the stream to stderr
            handler.setLevel(logging.ERROR) # Only log error and critical logs to console 
        elif type(handler) is logging.FileHandler:
            fh_is_needed = False # File Handler was already added to the log
    # Add the file handler if it not in the log already
    if fh_is_needed:
        fh = logging.FileHandler(log_path) # initialize file handler
        fh.setLevel(logging.WARNING) # log warning, error, and critical logs to file
        fh.setFormatter(formatter) # add gillespy2 log formatter
        log.addHandler(fh) # add file handler to log


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    description = "Run and/or Save (-r or -s) a new or existing (-n or -e) workflow.\n Creates a workflow directory with a model, info, logs, and status files and a directory for results."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('model_path', help="The path from the user directory to the  model.")
    parser.add_argument('workflow', help="The name of a new workflow or the path from the user directory to an existing workflow.")
    parser.add_argument('type', help="The type of the workflow.")
    parser.add_argument('-n', '--new', action="store_true", help="Specifies a new workflow.")
    parser.add_argument('-e', '--existing', action="store_true", help="Specifies an existing workflow.")
    parser.add_argument('-s', '--save', action="store_true", help="Save the workflow.")
    parser.add_argument('-r', '--run', action="store_true", help="Run the workflow.")
    parser.add_argument('-v', '--verbose', action="store_true", help="Print results as the are stored.")
    args = parser.parse_args()
    if not (args.new or args.existing):
        parser.error("Please specify new (-n) or existing (-e).")
    if not (args.save or args.run):
        parser.error("No action requested, please add -s (save) or -r (run).")
    return args


if __name__ == "__main__":
    args = get_parsed_args()
    model_path = os.path.join(user_dir, args.model_path)
    wkfl_type = args.type
    opt_type = ""
    if args.save:
        opt_type += 's'
    else:
        opt_type += 'r'
    if args.new:
        opt_type += 'n'
    else:
        opt_type += 'e'
    if args.new:
        workflow_name = args.workflow.split('/').pop()
        _workflow_dir = "{0}.wkfl".format(workflow_name)
        model_file = model_path.split('/').pop()
        dir_path = model_path.split(model_file)[0]
        if len(args.workflow.split('/')) > 1:
            dir_path = os.path.join(dir_path, args.workflow.split(workflow_name)[0])
            os.makedirs(dir_path)
        i = 2
        exists = _workflow_dir in os.listdir(path=dir_path)
        while exists:
            workflow_dir = '({0}).'.format(i).join(_workflow_dir.split('.'))
            exists = workflow_dir in os.listdir(path=dir_path)
            i += 1
        try:
            workflow_path = os.path.join(dir_path, workflow_dir)
        except:
            workflow_path = os.path.join(dir_path, _workflow_dir)
    else:
        workflow_path = os.path.join(user_dir, args.workflow)
        workflow_name = workflow_path.split('/').pop()
        dir_path = workflow_path.split(workflow_name)[0]
        
    if not workflow_name in os.listdir(path=dir_path):
        os.mkdir(workflow_path) # make the workflow directory

    opts = { "sn":save_new_workflow, "rn":run_workflow, "se":save_existing_workflow, "re":run_workflow }
    workflows = {"gillespy":GillesPy2Workflow, "parameterSweep":ParameterSweep}

    workflow = workflows[wkfl_type](workflow_path, model_path)

    setup_logger(workflow.log_path)

    opts[opt_type](workflow, wkfl_type, args.new, args.verbose)
    
    
