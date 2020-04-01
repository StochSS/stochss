#!/usr/bin/env python3

import os
import json
from .rename import get_unique_file_name


def upload_file(path, body):
    op = 'wb' if isinstance(body, bytes) else 'w'
    with open(path, op) as file:
        if isinstance(body, dict):
            json.dump(body, file)
        else:
            file.write(body)
    dst = os.path.dirname(path)
    filename = path.split('/').pop()
    resp = {"message":"{0} was successfully uploaded to {1}".format(filename, dst),"path":dst,"file":filename,"errors":""}
    return resp


def upload(file_data, file_info):
    user_dir = "/home/jovyan"

    ext = file_data['filename'].split('.').pop()
    body = file_data['body']
    if not ext == 'zip':
        body = body.decode()
    dir_path = os.path.join(user_dir, file_info['path'], os.path.dirname(file_info['name']))
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    file_type = file_info['type']

    exts = {"model":['mdl', 'json'],"sbml":['sbml','xml'],"notebook":['ipynb','json'],"zip":['zip']}
    if (file_type == "model" and ext in exts[file_type]) or ext == 'mdl':
        name = file_info['name'].split('/').pop() if file_info['name'] else file_data['filename'].split('.')[0]
        # resp = upload_model(dir_path, name, ext, body)
    elif (file_type == "sbml" and ext in exts[file_type]) or ext == 'sbml':
        # TODO
    elif (file_type == "notebook" and ext in exts[file_type]) or ext == 'ipynb':
        # TODO
    elif (file_type == "zip" and ext in exts[file_type]) or ext == 'zip':
        # TODO
    else:
        if file_info['name']:
            file_name = '.'.join([file_info['name'].split('/').pop(), ext])
        else:
            file_name = file_data['filename']
        full_path = get_unique_file_name(file_name, dir_path)[0]
        resp upload_file(full_path, body)
    return resp