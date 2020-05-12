#!/usr/bin/env python3

import os
import json
from .rename import get_unique_file_name
from .convert_sbml_to_model import convert_to_gillespy_model, convert_to_stochss_model, write_stochss_model


def validate_model(body, file_name):
    try:
        body = json.loads(body)
    except json.decoder.JSONDecodeError:
        return False, False, "The file {0} is not in JSON format.".format(file_name)

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
        return False, True, "The following keys were found in {0} that don't exist within a StochSS model: {1}".format(file_name, ', '.join(other_keys))
    if len(test_keys):
        return False, True, "The following keys are missing from {0}: {1}".format(file_name, ', '.join(test_keys))
    return True, True, ""


def upload_model_file(dir_path, _file_name, name, body):
    errors = []
    is_valid, is_json, error = validate_model(body, _file_name)
    file_ext = "mdl" if is_valid else "json"
    if is_json:
        body = json.loads(body)
    file_name = '.'.join([name, file_ext])
    full_path, changed = get_unique_file_name(file_name, dir_path)
    with open(full_path, "w") as model_file:
        json.dump(body, model_file)
    dir_path = dir_path.replace("/home/jovyan", "")
    if changed:
        file_name = full_path.split('/').pop()
    if is_valid:
        message = "{0} was successfully uploaded to {1}".format(file_name, dir_path)
    else:
        message = "{0} could not be validated as a Model file and was uploaded as {1} to {2}".format(_file_name, file_name, dir_path)
        errors.append(error)
    return {"message":message, "path":dir_path, "file":file_name, "errors":errors}


def validate_sbml(path, file_name):
    model, errors = convert_to_gillespy_model(path)
    if model is None:
        return False, "The file {0} is not in SBML format.".format(file_name), None
    errors = list(map(lambda error: error[0], errors))
    if len(errors):
        return False, errors, None
    return True, "", model
    

def upload_sbml_file(dir_path, _file_name, name, body):
    errors = []
    file_name = '.'.join([name,"sbml"])
    sbml_path, changed = get_unique_file_name(file_name, dir_path)
    with open(sbml_path, "w") as sbml_file:
        sbml_file.write(body)
    is_valid, error, model = validate_sbml(sbml_path, file_name)
    if is_valid:
        template_path = "/stochss/model_templates/nonSpatialModelTemplate.json"
        with open(template_path, "r") as template_file:
            template = json.load(template_file)
        mdl, msg, errs, path = convert_to_stochss_model(template, model, sbml_path, name)
        write_stochss_model(mdl, path)
        message = "{0} was successfully uploaded to {1}".format(file_name, dir_path.replace("/home/jovyan", ""))
    else:
        file_name = '.'.join([name,"xml"])
        xml_path, changed = get_unique_file_name(file_name, dir_path)
        os.rename(sbml_path, xml_path)
        message = "{0} could not be validated as a SBML file and was uploaded as {1} to {2}".format(_file_name, file_name, dir_path.replace("/home/jovyan", ""))
        if isinstance(error, list):
            errors.extend(error)
        else:
            errors.append(error)
    full_path = sbml_path if is_valid else xml_path
    if changed:
        file_name = full_path.split('/').pop()
    return {"message":message, "path":dir_path.replace("/home/jovyan", ""), "file":file_name, "errors":errors}


def unzip_file(full_path, dir_path):
    import zipfile
    import shutil

    with zipfile.ZipFile(full_path, "r") as zip_file:
        zip_file.extractall(dir_path)
    shutil.rmtree(os.path.join(dir_path, "__MACOSX"))
    

def upload_file(dir_path, file_name, name, ext, body, file_type, exts):
    errors = []
    is_valid = file_type == "file"
    if not is_valid:
        errors.append("{0} did not match one of the {1} file types: {2}.".format(file_name, file_type, ', '.join(exts[file_type])))
    file_name = '.'.join([name, ext]) if ext else name
    full_path, changed = get_unique_file_name(file_name, dir_path)
    if changed:
        file_name = full_path.split('/').pop()
    op = 'wb' if isinstance(body, bytes) else 'w'
    with open(full_path, op) as file:
        if isinstance(body, dict):
            json.dump(body, file)
        else:
            file.write(body)
    if ext == "zip":
        unzip_file(full_path, dir_path)
    dir_path = dir_path.replace("/home/jovyan", "")
    if is_valid:
        message = "{0} was successfully uploaded to {1}".format(file_name, dir_path)
    else:
        message = "{0} was uploaded to {1}".format(file_name, dir_path)
    return {"message":message, "path":dir_path, "file":file_name, "errors":errors}
    

def get_directory_path(path, name):
    user_dir = "/home/jovyan"

    if path.startswith('/'):
        path = path[1:]
    target_dir = os.path.dirname(name)
    if target_dir.startswith('/'):
        target_dir = target_dir[1:]
    dir_path = os.path.join(user_dir, path, target_dir)

    return dir_path


def get_file_name(new_name, old_name):
    if new_name and not new_name.endswith('/'):
        return new_name.split('/').pop()
    return old_name.split('.')[0]


def upload(file_data, file_info):
    file_name = file_data['filename']
    ext = file_name.split('.').pop() if '.' in file_name else ""
    body = file_data['body']
    try:
        body = body.decode()
    except:
        pass
    # build the directory path
    dir_path = get_directory_path(file_info['path'], file_info['name'])
    # make the directoies if they don't exist
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    # get the name for the file
    name = get_file_name(file_info['name'], file_name)
    file_type = file_info['type']

    exts = {"model":['mdl', 'json'],"sbml":['sbml','xml']}
    if  ext == 'mdl' or (file_type == "model" and ext in exts[file_type]):
        resp = upload_model_file(dir_path, file_name, name, body)
    elif ext == 'sbml' or (file_type == "sbml" and ext in exts[file_type]):
        resp = upload_sbml_file(dir_path, file_name, name, body)
    else:
        resp = upload_file(dir_path, file_name, name, ext, body, file_type, exts)
    
    return resp

