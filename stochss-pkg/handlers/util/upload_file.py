#!/usr/bin/env python3

import os
import json
from .rename import get_unique_file_name
from .convert_sbml_to_model import convert_to_gillespy_model, convert_to_stochss_model


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


def validate_sbml(path, file_name):
    try:
        model, errors = convert_to_gillespy_model(path)
    except AttributeError:
        return False, "The file {0} is not in SBML format.".format(file_name), None
    errors = list(map(lambda error: error[0], errors))
    if len(errors):
        return False, errors, None
    return True, "", model


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
    ext = file_name.split('.').pop() if '.' in file_name else ""
    body = file_data['body']
    try:
        body = body.decode()
    except:
        pass
    # build the directory path
    parent_dir = file_info['path']
    if parent_dir.startswith('/'):
        parent_dir = parent_dir[1:]
    target_dir = os.path.dirname(file_info['name'])
    if target_dir.startswith('/'):
        target_dir = target_dir[1:]
    dir_path = os.path.join(user_dir, parent_dir, target_dir)
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
        sbml_file_name = '.'.join([name,"sbml"])
        sbml_path = get_unique_file_name(sbml_file_name, dir_path)[0]
        if not file_type == "sbml":
            file_type = "sbml"
        resp = upload_file(sbml_path, body, True, file_name, file_type)
        is_valid, errors, model = validate_sbml(sbml_path, file_name)
        resp['errors'] = errors
        if is_valid:
            template_path = "/stochss/model_templates/nonSpatialModelTemplate.json"
            with open(template_path, "r") as template_file:
                template = json.load(template_file)
            convert_to_stochss_model(template, model, sbml_path, name)
            return resp
        os.remove(sbml_path)
        file_name = sbml_file_name.replace('sbml','xml')
    else:
        is_valid = file_type == "file"
        errors = "" if is_valid else "{0} was not a {1} file and could not be validated.".format(file_name, file_type)
        file_name = '.'.join([name, ext]) if ext else name

    full_path = get_unique_file_name(file_name, dir_path)[0]
    resp = upload_file(full_path, body, is_valid, file_data['filename'], file_type)
    resp['errors'] = errors

    if ext == "zip":
        import zipfile
        import shutil

        with zipfile.ZipFile(full_path, "r") as zip_file:
            zip_file.extractall(dir_path)
        shutil.rmtree(os.path.join(dir_path, "__MACOSX"))
    
    return resp

