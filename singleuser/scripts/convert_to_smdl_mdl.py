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
    from rename import get_unique_file_name

    file_name = path.split('/').pop()
    dir_path = path.split(file_name)[0]
    return get_unique_file_name(file_name, dir_path)[0]


def convert_to_mdl(path, model_data):
    '''
    Copies a spatial model and converts the copy to a model with a unique name.

    Attributes
    ----------
    path : str
        The path to the model file.
    model_data : json dict
        The original model data
    '''
    path = path.replace('.smdl', '.mdl')
    path = is_unique(path)
    model_data['is_spatial'] = False
    with open(path, 'w') as model_file:
        json.dump(model_data, model_file)


def convert_to_smdl(path, model_data):
    '''
    Copies a model and converts the copy to a spatial model with a unique name.

    Attributes
    ----------
    path : str
        The path to the model file.
    model_data : json dict
        The original model data
    '''
    path = path.replace('.mdl', '.smdl')
    path = is_unique(path)
    model_data['is_spatial'] = True
    with open(path, 'w') as model_file:
        json.dump(model_data, model_file)


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


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Convert a model to spatial model or a spatial model to a model.")
    parser.add_argument('path', help="The path form the user directory to the target model.")
    parser.add_argument('type', help="The type of model to be converted to.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    model_path = os.path.join(user_dir, args.path)
    new_type = args.type
    model_data = get_model_data(model_path)
    if new_type.lower() == "spatial":
        convert_to_smdl(model_path, model_data)
    else:
        convert_to_mdl(model_path, model_data)