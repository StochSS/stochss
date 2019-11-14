#!/usr/bin/env python3


import os, sys, json, pickle
import plotly
from shutil import copyfile
from run_model import ModelFactory, run_solver
from datetime import datetime, timezone, timedelta


def save_new_job(job_path, model_path, job_model, **kwargs):
    results_path = kwargs['results_path']
    os.mkdir(job_path)
    os.mkdir(results_path)
    copyfile(model_path, job_model)
    model_info = {"model":"{0}".format(model_path), }
    info_path = "{0}/info.json".format(job_path)
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(model_info))
    return model_info, None


def save_existing_job(job_path, model_path, job_model, **kwargs):
    model_file = kwargs['model_file']
    info_path = "{0}/info.json".format(job_path)
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
    info_path = "{0}/info.json".format(job_path)
    save_new_job(job_path, model_path, job_model, results_path=results_path)
    return run_job(job_model, model_file, info_path)


def run_existing_job(job_path, model_path, job_model, **kwargs):
    model_file = kwargs['model_file']
    info_path = "{0}/info.json".format(job_path)
    save_existing_job(job_path, model_path, job_model, model_file=model_file)
    return run_job(job_model, model_file, info_path)


def run_job(job_model, model_file, info_path):
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
    if today.strftime("%Z"):
        str_datetime = today.strftime("%b. %d, %Y  %I:%M%p %Z")
    else:
        str_datetime = today.strftime("%b. %d, %Y  %I:%M%p UTC")
    info_data['start_time'] = str_datetime
    # Update the location of the model
    info_data['model'] = job_model
    # Update the job info file
    with open(info_path, "w") as info_file:
        info_file.write(json.dumps(info_data))
    # Update job status to running
    open("{0}/RUNNING".format(job_path), 'w').close()
    # run the job
    try:
        results = run_solver(_model.model, data['simulationSettings'])
    except:
        # update job status to error if GillesPy2 throws an exception
        open("{0}/ERROR".format(job_path), 'w').close()
    else:
        # for result in results:
        #     for key in result.keys():
        #         if not isinstance(result[key], list):
        #             # Assume it's an ndarray, use tolist()
        #             result[key] = result[key].tolist()
        # update job status to complete
        open("{0}/COMPLETE".format(job_path), 'w').close()
        plt_fig = results.plotplotly(return_plotly_figure=True)
        return results, data['simulationSettings']['stochasticSettings']['realizations'], data['simulationSettings']['is_stochastic']


def plot_results(results, results_path, trajectories, is_stochastic):
    if is_stochastic and trajectories > 1:
        stddevrange_plot = results.plotplotly_std_dev_range(return_plotly_figure=True)
        with open("{0}/std_dev_range_plot.json".format(results_path), 'w') as json_file:
            json.dump(stddevrange_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        stddev_plot = results.stddev_ensemble().plotplotly(return_plotly_figure=True)
        with open("{0}/stddev_ensemble_plot.json".format(results_path), 'w') as json_file:
            json.dump(stddev_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
        avg_plot = results.average_ensemble().plotplotly(return_plotly_figure=True)
        with open("{0}/ensemble_average_plot.json".format(results_path), 'w') as json_file:
            json.dump(avg_plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)
    plot = results.plotplotly(return_plotly_figure=True)
    with open("{0}/plotplotly_plot.json".format(results_path), 'w') as json_file:
            json.dump(plot, json_file, cls=plotly.utils.PlotlyJSONEncoder)


if __name__ == "__main__":
    model_path = sys.argv[1]
    opt_type = sys.argv[3]
    if "n" in opt_type:
        job_name = sys.argv[2]
        _job_dir = "{0}.job".format(job_name)
        _dir_path = model_path.split('/')
        model_file = _dir_path.pop()
        dir_path = '/'.join(_dir_path)
        i = 2
        exists = _job_dir in os.listdir(path=dir_path)
        while exists:
            job_dir = '({0}).'.format(i).join(_job_dir.split('.'))
            exists = job_dir in os.listdir(path=dir_path)
            i += 1
        try:
            job_path = "{0}/{1}".format(dir_path, job_dir)
        except:
            job_path = "{0}/{1}".format(dir_path, _job_dir)
    else:
        job_path = sys.argv[2]
        model_file = model_path.split('/').pop()
    
    results_path = "{0}/results".format(job_path)
    job_model = "{0}/{1}".format(job_path, model_file)

    opts = { "sn":save_new_job, "rn":run_new_job, "se":save_existing_job, "re":run_existing_job, }

    data, trajectories, is_stochastic = opts[opt_type](job_path, model_path, job_model, results_path=results_path, model_file=model_file)
    
    if "r" in opt_type:
        with open("{0}/results.p".format(results_path), 'wb') as results_file:
            pickle.dump(data, results_file, protocol=pickle.HIGHEST_PROTOCOL)
        plot_results(data, results_path, trajectories, is_stochastic)
        
    print(data)
    
