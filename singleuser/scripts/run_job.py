#!/usr/bin/env python3


import os, sys, json, pickle
from shutil import copyfile
from run_model import *


def run_job(job_model, model_file):
    with open(job_model, 'r') as json_file:
        _data = json_file.read()
        data = json.loads(str(_data))
        data['name'] = model_file.split('.')[0]
        _model = ModelFactory(data)
        open("{0}/RUNNING".format(job_path), 'w').close()
        results = run_solver(_model.model, data['simulationSettings'])
        for result in results:
            for key in result.keys():
                if not isinstance(result[key], list):
                    # Assume it's an ndarray, use tolist()
                    result[key] = result[key].tolist()
        open("{0}/COMPLETE".format(job_path), 'w').close()
        return results

def set_up_job(job_path, model_path, job_model, results_path):
    os.mkdir(job_path)
    os.mkdir(results_path)
    copyfile(model_path, job_model)
    model_info = { "model":"{0}".format(job_model), }
    info_path = "{0}/info.json".format(job_path)
    with open(info_path, 'w') as info_file:
        info_file.write(json.dumps(model_info))


if __name__ == "__main__":
    model_path = sys.argv[1]
    job_name = sys.argv[2]
    _dir_path = model_path.split('/')
    model_file = _dir_path.pop()
    dir_path = '/'.join(_dir_path)
    _job_dir = "{0}.job".format(job_name)
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
    results_path = "{0}/results".format(job_path)
    job_model = "{0}/{1}".format(job_path, model_file)
    set_up_job(job_path, model_path, job_model, results_path)
    results = run_job(job_model, model_file)
    with open("{0}/results.p".format(results_path), 'wb') as results_file:
        results_file.write(pickle.dumps(results))
    print(json.dumps(results))