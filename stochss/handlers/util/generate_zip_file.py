#!/usr/bin/env python3

'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

import os
import shutil
import traceback
from .rename import get_unique_file_name, get_file_name
from .stochss_errors import StochSSFileNotFoundError, StochSSWorkflowError, StochSSWorkflowNotCompleteError


def generate_zip_file(file_path, file_directory, target):
    file_name = ".".join(file_path.split('/').pop().split('.')[:-1])
    target = target.split('/').pop()

    shutil.make_archive(os.path.join(file_directory, file_name), 'zip', file_directory, target)

    
def get_zip_file_data(file_path):
    with open(file_path, "rb") as zip_file:
        data = zip_file.read()
    return data


def get_results_csv_dir(file, path):
    file_path = os.path.join(path, file)
    if "results_csv" in file and os.path.isdir(file_path):
        return file


def download_zip(path, action):
    user_dir = "/home/jovyan"

    target = os.path.join(user_dir, path)

    if not os.path.exists(target):
        raise StochSSFileNotFoundError("Could not find the file or directory: " + target, traceback.format_exc())

    if action == "generate":
        full_path = "{0}.zip".format(os.path.join(os.path.dirname(target), get_file_name(target)))

        file_directory = os.path.dirname(full_path)
        file_name = full_path.split('/').pop()
        full_path = get_unique_file_name(file_name, file_directory)[0]

        generate_zip_file(full_path, file_directory, target)
        resp = {"Message":"Successfully created {0}".format(full_path),"Path":full_path.replace(user_dir+"/", "")}
        return resp
    elif action == "resultscsv":
        error_status = os.path.join(target, "ERROR")
        if os.path.exists(error_status):
            raise StochSSWorkflowError("The workflow experienced an error during run: " + error_status, traceback.format_exc())
        complete_status = os.path.join(target, "COMPLETE")
        if not os.path.exists(complete_status):
            raise StochSSWorkflowNotCompleteError("The workflow has not finished running: {0} not found.".format(complete_status), traceback.format_exc())

        results_path = os.path.join(target, "results")
        try:
            csv_results_dir = list(filter(lambda file: get_results_csv_dir(file, results_path), os.listdir(results_path)))[0]
        except IndexError as err:
            raise StochSSFileNotFoundError("Could not find the workflow results csv directory: " + str(err), traceback.format_exc())
        
        target_path = os.path.join(results_path, csv_results_dir)
        zip_path = "{0}.zip".format(target_path)

        if os.path.exists(zip_path):
            resp = {"Message":"{0} already exists.".format(zip_path),"Path":zip_path.replace(user_dir+"/", "")}
        else:
            generate_zip_file(zip_path, results_path, target_path)
            resp = {"Message":"Successfully created {0}".format(zip_path),"Path":zip_path.replace(user_dir+"/", "")}
        return resp
    else:
        data = get_zip_file_data(target)
        return data

