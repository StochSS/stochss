#!/usr/bin/env python3

import os
from .rename import get_unique_file_name
from .stochss_errors import StochSSFileNotFoundError


def generate_zip_file(file_path, file_directory, target):
    file_name = file_path.split('/').pop()
    target = target.split('/').pop()

    zip_file = os.popen("cd '{0}' && zip -r '{1}' '{2}'".format(file_directory, file_name, target), 'r', 1)

    done = file_name in os.listdir(file_directory)
    while not done:
        done = file_name in os.listdir(file_directory)

    if done:
        zip_file.close()


def get_zip_file_data(file_path):
    with open(file_path, "rb") as zip_file:
        data = zip_file.read()
    return data


def download_zip(path, generate):
    user_dir = "/home/jovyan"

    target = os.path.join(user_dir, path)

    if not os.path.exists(target):
        raise StochSSFileNotFoundError("Could not find the file or directory: " + target)

    if generate:
        full_path = "{0}.zip".format(target.split('.')[0])

        file_directory = os.path.dirname(full_path)
        file_name = full_path.split('/').pop()
        full_path = get_unique_file_name(file_name, file_directory)[0]

        generate_zip_file(full_path, file_directory, target)
        resp = {"Message":"Successfully created {0}".format(full_path),"Path":full_path.replace(user_dir+"/", "")}
        return resp
    else:
        data = get_zip_file_data(target)
        return data

