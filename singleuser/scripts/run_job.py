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


def save_new_job(job_path, model_path, job_model, **kwargs):
    results_path = kwargs['results_path']
    os.mkdir(job_path)
    os.mkdir(results_path)
    copyfile(model_path, job_model)
    model_info = {"model":"{0}".format(model_path), }
    info_path = os.path.join(job_path, 'info.json')
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(model_info))
    return model_info, None


def save_existing_job(job_path, model_path, job_model, **kwargs):
    model_file = kwargs['model_file']
    info_path = os.path.join(job_path, 'info.json')
    old_model_path = "{0}/{1}".format(job_path, model_file)
    os.remove(old_model_path)
    copyfile(model_path, job_model)
    model_info = {"model":"{0}".format(model_path), }
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(model_info))
    return model_info, None


def run_new_job(job_path, model_path, job_model, **kwargs):
    results_path = kwargs['results_path']
    model_file = kwargs['model_file']
    info_path = os.path.join(job_path, 'info.json')
    save_new_job(job_path, model_path, job_model, results_path=results_path)
    return run_job(job_model, model_file, info_path, job_path)


def run_existing_job(job_path, model_path, job_model, **kwargs):
    model_file = kwargs['model_file']
    info_path = os.path.join(job_path, 'info.json')
    save_existing_job(job_path, model_path, job_model, model_file=model_file)
    return run_job(job_model, model_file, info_path, job_path)


def run_job(job_model, model_file, info_path, job_path):
    setup_logger(job_path)
    # Get the model data from the file and create the model object
    with open(job_model, 'r') as json_file:
        _data = json_file.read()
    data = json.loads(str(_data))
    data['name'] = model_file.split('.')[0]
    _model = ModelFactory(data)
    # Add the start time to the job info file
    with open(info_path, 'r') as info_file:
        _info_data = info_file.read()
        info_data = json.loads(_info_data)
    today = datetime.now()
    str_datetime = today.strftime("%b. %d, %Y  %I:%M %p UTC")
    info_data['start_time'] = str_datetime
    # Update the location of the model
    info_data['model'] = job_model
    # Update the job info file
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(info_data))
    # Update job status to running
    open(os.path.join(job_path, 'RUNNING'), 'w').close()
    # run the job
    try:
        results = run_solver(_model.model, data['simulationSettings'], 0)
    except:
        # update job status to error if GillesPy2 throws an exception
        open(os.path.join(job_path, 'ERROR'), 'w').close()
    else:
        open(os.path.join(job_path, 'COMPLETE'), 'w').close()
        return results, data['simulationSettings']['stochasticSettings']['realizations'], data['simulationSettings']['is_stochastic']


def plot_results(results, results_path, trajectories, is_stochastic):
    if is_stochastic and trajectories > 1:
        stddevrange_plot = results.plotplotly_std_dev_range(return_plotly_figure=True)
        with open(os.path.join(results_path, 'std_dev_range_plot.json'), 'w') as json_file:
            json.dump(stddevrange_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        stddev_plot = results.stddev_ensemble().plotplotly(return_plotly_figure=True)
        with open(os.path.join(results_path, 'stddev_ensemble_plot.json'), 'w') as json_file:
            json.dump(stddev_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        avg_plot = results.average_ensemble().plotplotly(return_plotly_figure=True)
        with open(os.path.join(results_path, 'ensemble_average_plot.json'), 'w') as json_file:
            json.dump(avg_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
    plot = results.plotplotly(return_plotly_figure=True)
    with open(os.path.join(results_path, 'plotplotly_plot.json'), 'w') as json_file:
            json.dump(plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)


def setup_logger(job_path):
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
        fh = logging.FileHandler(os.path.join(job_path, "logs.txt")) # initialize file handler
        fh.setLevel(logging.WARNING) # log warning, error, and critical logs to file
        fh.setFormatter(formatter) # add gillespy2 log formatter
        log.addHandler(fh) # add file handler to log


def get_parsed_args():
    description = "Run and/or Save (-r or -s) a new or existing (-n or -e) job.\n Creates a job directory with a model, info, logs, and status files and a directory for results."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('model_path', help="The path from the user directory to the  model.")
    parser.add_argument('job', help="The name of a new job or the path from the user directory to an existing job.")
    parser.add_argument('-n', '--new', action="store_true", help="Specifies a new job.")
    parser.add_argument('-e', '--existing', action="store_true", help="Specifies an existing job.")
    parser.add_argument('-s', '--save', action="store_true", help="Save the job.")
    parser.add_argument('-r', '--run', action="store_true", help="Run the job.")
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
        job_name = args.job
        _job_dir = "{0}.job".format(job_name)
        model_file = model_path.split('/').pop()
        dir_path = model_path.split(model_file)[0]
        i = 2
        exists = _job_dir in os.listdir(path=dir_path)
        while exists:
            job_dir = '({0}).'.format(i).join(_job_dir.split('.'))
            exists = job_dir in os.listdir(path=dir_path)
            i += 1
        try:
            job_path = os.path.join(dir_path, job_dir)
        except:
            job_path = os.path.join(dir_path, _job_dir)
    else:
        job_path = os.path.join(user_dir, args.job)
        model_file = model_path.split('/').pop()
    
    results_path = os.path.join(job_path, 'results')
    job_model = os.path.join(job_path, model_file)

    opts = { "sn":save_new_job, "rn":run_new_job, "se":save_existing_job, "re":run_existing_job, }

    data, trajectories, is_stochastic = opts[opt_type](job_path, model_path, job_model, results_path=results_path, model_file=model_file)
    
    if args.run:
        with open("{0}/results.p".format(results_path), 'wb') as results_file:
            pickle.dump(data, results_file, protocol=pickle.HIGHEST_PROTOCOL)
        plot_results(data, results_path, trajectories, is_stochastic)
        
    # print(data)
    
