#!/usr/bin/env python3

import os
import json
from .rename import get_unique_file_name


def validate_model(body, file_name):
    try:
        body = json.loads(body)
    except json.decoder.JSONDecodeError:
        return False, "The file {0} is not in JSON format.".format(file_name)
    test_keys = ["is_spatial","defaultID","defaultMode","modelSettings","simulationSettings",
                 "parameterSweepSettings","species","parameters","reactions","eventsCollection",
                 "rules","functionDefinitions","meshSettings","initialConditions"]
    other_keys = []
    keys = list(body.keys())
    for key in keys:
        if key in test_keys:
            test_keys.remove(key)
        else:
            other_keys.append(key)
    if len(other_keys):
        return False, "The following keys were found in {0} that don't exist within a StochSS model: {1}".format(file_name, ', '.join(other_keys))
    if len(test_keys):
        return False, "The following keys are missing from {0}: {1}".format(file_name, ', '.join(test_keys))
    return True, ""


def upload_file(path, body, is_valid, original_file, file_type):
    op = 'wb' if isinstance(body, bytes) else 'w'
    with open(path, op) as file:
        if isinstance(body, dict):
            json.dump(body, file)
        else:
            file.write(body)
    dst = os.path.dirname(path)
    filename = path.split('/').pop()
    if is_valid:
        message = "{0} was successfully uploaded to {1}".format(filename, dst)
    else:
        message = "{0} could not be validated as a {1} file, so was uploaded as {2}".format(original_file, file_type, filename)
    resp = {"message":message,"path":dst,"file":filename}
    return resp


def upload(file_data, file_info):
    user_dir = "/home/jovyan"

    file_name = file_data['filename']
    ext = file_name.split('.').pop()
    body = file_data['body']
    if not ext == 'zip':
        body = body.decode()
    # build the directory path
    dir_path = os.path.join(user_dir, file_info['path'], os.path.dirname(file_info['name']))
    # make the directoies if they don't exist
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    # get the name for the file
    if file_info['name'] and not file_info['name'].endswith('/'):
        name = file_info['name'].split('/').pop()
    else:
        name = file_name.split('.')[0]
    file_type = file_info['type']

    exts = {"model":['mdl', 'json'],"sbml":['sbml','xml'],"zip":['zip']}
    if (file_type == "model" and ext in exts[file_type]) or ext == 'mdl':
        # validate the file as a StochSS Model
        is_valid, errors = validate_model(body, file_name)
        if is_valid:
            file_ext = "mdl"
            body = json.loads(body)
        else:
            file_ext = "json"
        file_name = '.'.join([name, file_ext])
        if not file_type == "model":
            file_type = "model"
    elif (file_type == "sbml" and ext in exts[file_type]) or ext == 'sbml':
        # TODO
        if not file_type == "sbml":
            file_type = "sbml"
    elif (file_type == "zip" and ext in exts[file_type]) or ext == 'zip':
        # TODO
        if not file_type == "zip":
            file_type = "zip"
    else:
        is_valid = file_type == "file"
        errors = "" if is_valid else "{0} was not a {1} file and could not be validated."
        file_name = '.'.join([name, ext])

    full_path = get_unique_file_name(file_name, dir_path)[0]
    resp = upload_file(full_path, body, is_valid, file_data['filename'], file_type)
    resp['errors'] = errors
    
    return resp

