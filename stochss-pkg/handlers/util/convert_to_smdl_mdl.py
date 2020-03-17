#!/usr/bin/env python3

import argparse
import os
import json


user_dir = "/home/jovyan"


def is_unique(path):
    '''
    Checks if the new files name is unique and return a unique path.

    Attributes
    ----------
    path : str
        The path to the model file.
    '''
    from .rename import get_unique_file_name

    file_name = path.split('/').pop()
    dir_path = path.split(file_name)[0]
    return get_unique_file_name(file_name, dir_path)[0]


def get_model_data(path):
    '''
    Read the model data from the file and return it in json format.

    Attributes
    ----------
    path : str
        The path to the model file.
    '''
    with open(path, 'r') as model_file:
        model_data = json.loads(model_file.read())
    return model_data


def convert_model(path, to_spatial):
    model_path = os.path.join(user_dir, path)
    model_data = get_model_data(model_path)
    from_ext = '.mdl' if to_spatial else '.smdl'
    to_ext = '.smdl' if to_spatial else '.mdl'
    model_path = is_unique(model_path.replace(from_ext, to_ext))
    model_data['is_spatial'] = to_spatial
    with open(model_path, 'w') as model_file:
        json.dump(model_data, model_file)

