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
    from .parameter_sweep import ParameterSweep
    from .run_model import GillesPy2Workflow, ModelFactory, run_solver


def save_new_workflow(wkfl, wkfl_type, initialize):
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
    # Update the workflow info file
    update_info_file(wkfl, wkfl_type, initialize)
    # Update workflow settings file
    wkfl.save()
    if initialize:
        # Update workflow status to running
        open(os.path.join(wkfl.wkfl_path, 'RUNNING'), 'w').close()
    return "Successfully saved the new workflow: {0}".format(wkfl.wkfl_path)
    

def save_existing_workflow(wkfl, wkfl_type, initialize):
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
    # Update the workflow info file
    update_info_file(wkfl, wkfl_type, initialize)
    # Update workflow settings file
    wkfl.save()
    if initialize:
        # Update workflow status to running
        open(os.path.join(wkfl.wkfl_path, 'RUNNING'), 'w').close()
    return "Successfully saved the existing workflow: {0}".format(wkfl.wkfl_path)
    

def get_models(full_path, name, wkfl_path, is_ode):
    try:
        with open(full_path, "r") as model_file:
            stochss_model = json.loads(model_file.read())
            stochss_model['name'] = name
    except FileNotFoundError as error:
        log.critical("Failed to copy the model into the directory: {0}".format(error))
        open(os.path.join(wkfl_path, 'ERROR'), 'w').close() # update status to error
    
    try:
        _model = ModelFactory(stochss_model, is_ode) # build GillesPy2 model
        gillespy2_model = _model.model
    except Exception as error:
        log.error("GillesPy2 Model Errors: "+str(error))
        gillespy2_model = None
    
    return gillespy2_model, stochss_model


def update_info_file(wkfl, wkfl_type, initialize):
    user_dir = "/home/jovyan"

    info_data = {"source_model":"{0}".format(wkfl.mdl_path.replace(user_dir+'/',"")), "wkfl_model":None,
                  "type":"{0}".format(wkfl_type), "start_time":None} # updated workflow info
    
    if initialize:
        # Update workflow info file with start time and permanent model file location
        today = datetime.now() # workflow run start time
        # If this format is not something Javascript's Date.parse() method
        # understands then the workflow status page will be unable to correctly create a
        # Date object from the datestring parsed from the workflow's info.json file
        str_datetime = today.strftime("%b %d, %Y  %I:%M %p UTC") # format timestamp
        
        info_data['start_time'] = str_datetime # add start time to workflow info
        info_data['wkfl_model'] = wkfl.wkfl_mdl_path.replace(user_dir+'/',"") # Update the location of the model

    # Update the workflow info file
    with open(wkfl.info_path, "w") as info_file:
        info_file.write(json.dumps(info_data))
    

def run_workflow(wkfl, verbose):
    '''
    Run the workflow and return the results, number of trajectories, and is_stochastic.
    Records when the workflow was start and updates the model path in the workflow info file.
    Updates status with status files and logs warnings and errors in the log file.
    Errors are logged to the console.

    Attributes
    ----------
    wkfl : StochSS Workflow
        The workflow object being worked with.
    verbose : boolean
        Print progress statements.
    '''
    is_ode = wkfl.settings['simulationSettings']['algorithm'] == "ODE"
    # Get the model data from the file and create the model object
    gillespy2_model, stochss_model = get_models(wkfl.wkfl_mdl_path, wkfl.mdl_file.split('.')[0], wkfl.wkfl_path, is_ode)
    # run the workflow
    try:
        wkfl.run(gillespy2_model, verbose)
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
    parser.add_argument('workflow_path', help="The path from the user directory to the workflow.")
    parser.add_argument('type', help="The type of the workflow.")
    parser.add_argument('-n', '--new', action="store_true", help="Specifies a new workflow.")
    parser.add_argument('-e', '--existing', action="store_true", help="Specifies an existing workflow.")
    parser.add_argument('-s', '--save', action="store_true", help="Save the workflow.")
    parser.add_argument('-r', '--run', action="store_true", help="Run/initialize the workflow.")
    parser.add_argument('-v', '--verbose', action="store_true", help="Print results as the are stored.")
    args = parser.parse_args()
    if not (args.new or args.existing):
        parser.error("Please specify new (-n) or existing (-e).")
    if not (args.save or args.run):
        parser.error("No action requested, please add -s (save) or -r (run).")
    return args


def initialize(mdl_path, wkfl_path, wkfl_type, settings=None, new=False, existing=False, save=False, run=False, verbose=False):
    user_dir = "/home/jovyan"

    model_path = os.path.join(user_dir, mdl_path)
    workflow_path = os.path.join(user_dir, wkfl_path)
    workflow_name = workflow_path.split('/').pop()
    dir_path = os.path.dirname(workflow_path)
    if new:
        from .rename import get_unique_file_name
        workflow_path, changed = get_unique_file_name(workflow_name, dir_path)
        if changed:
             workflow_name = workflow_path.split('/').pop()
    
    if not workflow_name in os.listdir(path=dir_path):
        os.mkdir(workflow_path) # make the workflow directory

    workflows = {"gillespy":GillesPy2Workflow, "parameterSweep":ParameterSweep}

    workflow = workflows[wkfl_type](workflow_path, model_path, settings)

    setup_logger(workflow.log_path)

    if save and new:
        resp = save_new_workflow(workflow, wkfl_type, run)
        return resp
    elif save and existing:
        resp = save_existing_workflow(workflow, wkfl_type, run)
        return resp
    else:
        run_workflow(workflow, verbose)    


if __name__ == "__main__":
    args = get_parsed_args()
    initialize(args.model_path, args.workflow_path, args.type, run=args.run, verbose=args.verbose)
    
