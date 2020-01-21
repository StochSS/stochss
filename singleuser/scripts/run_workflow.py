#!/usr/bin/env python3


import os
import sys 
import json
import pickle
import plotly
import argparse
import logging

from gillespy2.core import log

from shutil import copyfile
from run_model import ModelFactory, run_solver
from datetime import datetime, timezone, timedelta


user_dir = "/home/jovyan"


def save_new_workflow(workflow_path, model_path, workflow_model, **kwargs):
    '''
    Create and save a new workflow in the same directory as the model 
    used for it.

    Attributes
    ----------
    workflow_path : str
        Path to the workflow directory.
    model_path : str
        Path to the model file.
    workflow_model : str
        Path to the model file in the workflow directory.
    kwargs : {
        results_path : str
            Path to the workflow's results directory.
    }
    '''
    results_path = kwargs['results_path']
    os.mkdir(results_path) # make the workflow's result directory
    try:
        copyfile(model_path, workflow_model) # copy the model into the workflow directory
    except FileNotFoundError as error:
        log.error("Failed to copy the model into the directory: {0}".format(error))
    model_info = {"model":"{0}".format(model_path), } # workflow info
    info_path = os.path.join(workflow_path, 'info.json') # path to the workflows info file
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(model_info)) # write the workflow info file
    return model_info, None, None


def save_existing_workflow(workflow_path, model_path, workflow_model, **kwargs):
    '''
    Save an existing workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the workflow directory.
    model_path : str
        Path to the model file.
    workflow_model : str
        Path to the model file in the workflow directory.
    kwargs : {
        model_file : str
            Name of the model file.
    }
    '''
    model_file = kwargs['model_file']
    info_path = os.path.join(workflow_path, 'info.json') # path to the workflows info file
    old_model_path = os.path.join(workflow_path, model_file) # path to the old model
    os.remove(old_model_path) # remove the old model
    try:
        copyfile(model_path, workflow_model) # copy the new model into the workflow directory
    except FileNotFoundError as error:
        log.error("Failed to copy the model into the directory: {0}".format(error))
    model_info = {"model":"{0}".format(model_path), } # updated workflow info
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(model_info)) # update the workflow info file
    return model_info, None, None


def run_new_workflow(workflow_path, model_path, workflow_model, **kwargs):
    '''
    Save and run a new workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the workflow directory.
    model_path : str
        Path to the model file.
    workflow_model : str
        Path to the model file in the workflow directory.
    kwargs : {
        results_path ; str
            Path to the workflow's results directory.
        model_file : str
            Name of the model file.
    }
    '''
    results_path = kwargs['results_path']
    model_file = kwargs['model_file']
    info_path = os.path.join(workflow_path, 'info.json') # path to the workflows info file
    save_new_workflow(workflow_path, model_path, workflow_model, results_path=results_path) # save the workflow
    return run_workflow(workflow_model, model_file, info_path, workflow_path)


def run_existing_workflow(workflow_path, model_path, workflow_model, **kwargs):
    '''
    Save and run an existing workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the workflow directory.
    model_path : str
        Path to the model file.
    workflow_model : str
        Path to the model file in the workflow directory.
    kwargs : {
        model_file : str
            Name of the model file.
    }
    '''
    model_file = kwargs['model_file']
    info_path = os.path.join(workflow_path, 'info.json') # path to the workflows info file
    save_existing_workflow(workflow_path, model_path, workflow_model, model_file=model_file) # save the workflow
    return run_workflow(workflow_model, model_file, info_path, workflow_path)


def run_workflow(workflow_model, model_file, info_path, workflow_path):
    '''
    Run the workflow and return the results, number of trajectories, and is_stochastic.
    Records when the workflow was start and updates the model path in the workflow info file.
    Updates status with status files and logs warnings and errors in the log file.
    Errors are logged to the console.

    Attributes
    ----------
    workflow_model : str
        Path to the model file in the workflow directory.
    model_file : str
        Name of the model file.
    info_path : str
        Path to the workflows info file.
    workflow_path : str
        Path to the workflow directory.
    '''
    # Get the model data from the file and create the model object
    try:
        with open(workflow_model, 'r') as json_file:
            _data = json_file.read()
    except FileNotFoundError as error:
        log.critical("Failed to copy the model into the directory: {0}".format(error))
        open(os.path.join(workflow_path, 'ERROR'), 'w').close() # update status to error
    data = json.loads(str(_data))
    data['name'] = model_file.split('.')[0]
    try:
        _model = ModelFactory(data) # build GillesPy2 model
    except Exception as error:
        log.error(str(error))
    # Add the start time to the workflow info file
    with open(info_path, 'r') as info_file:
        _info_data = info_file.read()
        info_data = json.loads(_info_data)
    today = datetime.now() # workflow run start time
    str_datetime = today.strftime("%b. %d, %Y  %I:%M %p UTC") # format timestamp
    info_data['start_time'] = str_datetime # add start time to workflow info
    # Update the location of the model
    info_data['model'] = workflow_model
    # Update the workflow info file
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(info_data))
    # Update workflow status to running
    open(os.path.join(workflow_path, 'RUNNING'), 'w').close()
    # run the workflow
    try:
        results = run_solver(_model.model, data['simulationSettings'], 0)
    except:
        # update workflow status to error if GillesPy2 throws an exception
        open(os.path.join(workflow_path, 'ERROR'), 'w').close()
        return None, None, None
    else:
        open(os.path.join(workflow_path, 'COMPLETE'), 'w').close() # update status to complete
        return results, data['simulationSettings']['realizations'], (not data['simulationSettings']['algorithm'] == "ODE")


def plot_results(results, results_path, trajectories, is_stochastic):
    '''
    Create the set of result plots and write them to file in the results directory.

    Attributes
    ----------
    results : GillesPy2 ResultsEnsemble or GillesPy2 Results
        Results of a workflow run.
    results_path : str
        Path to the results directory.
    trajectories : int
        Number of trajectories for the workflow.
    is_stochastic : bool
        Was the workflow a stochastic simulation?.
    '''
    if is_stochastic and trajectories > 1:
        stddevrange_plot = results.plotplotly_std_dev_range(return_plotly_figure=True)
        stddevrange_plot["config"] = {"responsive": True,}
        with open(os.path.join(results_path, 'std_dev_range_plot.json'), 'w') as json_file:
            json.dump(stddevrange_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        stddev_plot = results.stddev_ensemble().plotplotly(return_plotly_figure=True)
        stddev_plot["config"] = {"responsive": True,}
        with open(os.path.join(results_path, 'stddev_ensemble_plot.json'), 'w') as json_file:
            json.dump(stddev_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        avg_plot = results.average_ensemble().plotplotly(return_plotly_figure=True)
        avg_plot["config"] = {"responsive": True,}
        with open(os.path.join(results_path, 'ensemble_average_plot.json'), 'w') as json_file:
            json.dump(avg_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
    plot = results.plotplotly(return_plotly_figure=True)
    plot["config"] = {"responsive": True,}
    with open(os.path.join(results_path, 'plotplotly_plot.json'), 'w') as json_file:
            json.dump(plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)


def setup_logger(workflow_path):
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
        fh = logging.FileHandler(os.path.join(workflow_path, "logs.txt")) # initialize file handler
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
    parser.add_argument('-n', '--new', action="store_true", help="Specifies a new workflow.")
    parser.add_argument('-e', '--existing', action="store_true", help="Specifies an existing workflow.")
    parser.add_argument('-s', '--save', action="store_true", help="Save the workflow.")
    parser.add_argument('-r', '--run', action="store_true", help="Run the workflow.")
    args = parser.parse_args()
    if not (args.new or args.existing):
        parser.error("Please specify new (-n) or existing (-e).")
    if not (args.save or args.run):
        parser.error("No action requested, please add -s (save) or -r (run).")
    return args


if __name__ == "__main__":
    args = get_parsed_args()
    model_path = os.path.join(user_dir, args.model_path)
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
        workflow_name = args.workflow
        _workflow_dir = "{0}.wkfl".format(workflow_name)
        model_file = model_path.split('/').pop()
        dir_path = model_path.split(model_file)[0]
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
        model_file = model_path.split('/').pop()
    
    results_path = os.path.join(workflow_path, 'results')
    workflow_model = os.path.join(workflow_path, model_file)

    if not workflow_name in os.listdir(path=dir_path):
        os.mkdir(workflow_path) # make the workflow directory
    setup_logger(workflow_path)

    opts = { "sn":save_new_workflow, "rn":run_new_workflow, "se":save_existing_workflow, "re":run_existing_workflow, }

    data, trajectories, is_stochastic = opts[opt_type](workflow_path, model_path, workflow_model, results_path=results_path, model_file=model_file)
    
    if args.run and data:
        if not 'results' in os.listdir(path=workflow_path):
            os.mkdir(results_path)
        with open("{0}/results.p".format(results_path), 'wb') as results_file:
            pickle.dump(data, results_file, protocol=pickle.HIGHEST_PROTOCOL)
        plot_results(data, results_path, trajectories, is_stochastic)
        
    # print(data)
    
