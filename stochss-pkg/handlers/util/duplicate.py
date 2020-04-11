#!/usr/bin/env python3

import os
from os import path
from shutil import copyfile, copytree
from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError


def get_unique_file_name(_path):
    '''
    Gets a unique name for a file to be copied.  Accounts for a copy
    as the target file.

    Attributes
    ----------
    _path : str
        Path to the file being copied.
    '''
    file = _path.split('/').pop()
    dir_path = _path.split(file)[0]
    ext = '.' + file.split('.').pop()
    if '-copy' in file:
        name = file.split('-copy')[0]
    elif '.' in file:
        name = file.split(ext)[0]
    else:
        name = file
        ext = ""

    # Check if the file is an original of at least the second copy
    if not '-copy' in file or '-copy(' in file:
        copy_file = ''.join([name, '-copy', ext])
        # Check a copy exist with '-copy' in the name
        if copy_file not in os.listdir(dir_path):
            return _path.replace(file, copy_file)

    i = 2
    copy_file = ''.join([name, '-copy({0})'.format(i), ext])
    # Check if a copy exists with '-copy(2)' in the name
    # If copy_file is still not unique iterate i until a unique name is found
    while copy_file in os.listdir(dir_path):
        i += 1
        copy_file = ''.join([name, '-copy({0})'.format(i), ext])

    return _path.replace(file, copy_file)


def duplicate(file_path, is_directory=False):
    '''
    Copies the target file with a unique file name in the same directory 
    as the target file.

    Attributes
    ----------
    _path : str
        Path to the target file.
    is_directory : bool
        Flag for determining the type of object to be copied.
    '''
    user_dir = '/home/jovyan'

    full_path = path.join(user_dir, file_path)
    unique_file_path = get_unique_file_name(full_path)
    try:
        if is_directory:
            copytree(full_path, unique_file_path)
        else:
            copyfile(full_path, unique_file_path)
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not read the file or directory: " + str(err))
    except PermissionError as err:
        raise StochSSPermissionsError("You do not have permission to copy this file or directory: " + str(err))

    original = full_path.split('/').pop()
    copy = unique_file_path.split('/').pop()
    return {"Message":"The file {0} has been successfully copied as {1}".format(original, copy),"File":copy}


def extract_wkfl_model(only_model, model_file, mdl_parent_path, data):
    # Get unique path for the new model path
    if only_model:
        model_path = get_unique_file_name(model_file, mdl_parent_dir)[0]
    # Copy workflow model into parent directory
    try:
        copyfile(data['model'], model_path)
    except FileNotFoundError as err:
        raise ModelNotFoundError("Could not read the StochSS model file: " + str(err))
    except PermissionError as err:
        raise StochSSPermissionsError("You do not have permission to copy this file or directory: " + str(err))


def get_wkfl_model_parent_path(wkfl_parent_path, model_only, data):
    if model_only:
        return wkfl_parent_path
    if "source_model" in data.keys():
        mdl_parent_dir = path.dirname(data['source_model'])
    else:
        mdl_parent_dir = path.dirname(data['model'])
    if not path.exists(mdl_parent_dir):
        return wkfl_parent_path
    return mdl_parent_dir


def get_model_path(wkfl_parent_path, mdl_parent_path, mdl_file, only_model):
    model_path = path.join(wkfl_parent_path, mdl_file)
    if only_model:
        return model_path
    if wkfl_parent_path == mdl_parent_path:
        return model_path
    if mdl_file in os.listdir(path=wkfl_parent_path):
        return model_path
    return path.join(mdl_parent_path, mdl_file)


def duplicate_wkfl_as_new(wkfl_path, only_model):
    '''
    Copies the target workflow as a new workflow in the same parent directory.
    Copies the model of the target workflow in the same parent directory.

    Attributes
    ----------
    path : str
        Path to the target workflow.
    '''
    import json
    from json.decoder import JSONDecodeError
    from datetime import datetime
    from .rename import get_unique_file_name
    from .run_model import GillesPy2Workflow
    from .parameter_sweep import ParameterSweep
    from .run_workflow import save_new_workflow
    from .stochss_errors import ModelNotFoundError, FileNotJSONFormatError

    user_dir = '/home/jovyan'

    full_path = path.join(user_dir, wkfl_path)
    # Get parent directory
    parent_dir = path.dirname(full_path)
    # Read workflow info file for model path and workflow type
    try:
        with open(path.join(full_path, 'info.json'), 'r') as info_file:
            data = json.load(info_file)
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not read the workflow info file: " + str(err))
    except JSONDecodeError as err:
        raise FileNotJSONFormatError("The workflow info file is not JSON decodable: "+str(err))
    # Get model file from wkfl info
    model_file = data['model'].split('/').pop()
    # Set model parent path
    mdl_parent_dir = get_wkfl_model_parent_path(parent_dir, only_model, data, only_model)
    # Make new model path in model parent directory
    model_path = get_model_path(parent_dir, mdl_parent_dir, model_file)
    if only_model or not path.exists(model_path):
        # copy wkfl model if user only wants the model or if the model can't be found in original dir or wkfl dir
        extract_wkfl_model(only_model, model_file, mdl_parent_path, data)
    if only_model:
        resp = {"message":"A copy of the model in {0} has been created".format(wkfl_path),"mdlPath":model_path}
    else:
        # Get base name for new workflow name (current workflow name - timestamp)
        wkfl_base_name = '_'.join(full_path.split('/').pop().split('_')[:-2])
        # Get formatted timestamp for new workflow
        today = datetime.now()
        time_stamp = today.strftime("_%m%d%Y_%H%M%S")
        # Make new workflow path in parent directory
        new_wkfl_path = path.join(parent_dir, ''.join([wkfl_base_name, time_stamp, ".wkfl"]))

        workflows = {"gillespy":GillesPy2Workflow,"psweep":ParameterSweep}
        wkfl = workflows[data['type']](new_wkfl_path, model_path)
        os.mkdir(new_wkfl_path)
        save_new_workflow(wkfl, data['type'], True, False)

        resp = {"message":"A new workflow has been created from {0}".format(wkfl_path),"wkflPath":new_wkfl_path,"mdlPath":model_path}
    return resp