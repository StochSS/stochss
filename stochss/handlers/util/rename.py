#!/usr/bin/env python3

import os
import json
import shutil
import traceback
try:
    from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError
except:
    from stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError


def get_unique_file_name(new_name, dir_path):
    '''
    Get a unique new name for the target file.

    Attributes
    ----------
    new_name : str
        Name that the target file wants changing to.
    dir_path : str
        Path to the parent directory of the target file.
    '''
    exists = new_name in os.listdir(path=dir_path)

    i = 1
    if exists:
        ext = "." + new_name.split('.').pop()
        name = new_name.split(ext)[0]
        if "(" in name and ")" in name:
            _i = name.split('(').pop().split(')')[0]
            if _i.isdigit():
                name = name.replace("({0})".format(_i), "")
                if int(_i) == 1:
                    i = 2

    while exists:
        if '.' in new_name:
            proposed_name = ''.join([name, "({0})".format(i), ext])
        else:
            proposed_name = name + "({0})".format(i)
        exists = proposed_name in os.listdir(path=dir_path)
        i += 1

    changed = i > 1 # did the name change
    if changed:
        new_name = proposed_name

    return os.path.join(dir_path, new_name), changed


def rename(path, new_name):
    '''
    Rename the target file with a unique name.

    Attributes
    ----------
    old_path : str
        Path to the target file.
    new_name : str
        Name that the target file wants changing to.
    dir_path : str
        Path to the parent directory of the target file.
    '''
    user_dir = '/home/jovyan'
    old_path = os.path.join(user_dir, path)
    old_name = old_path.split('/').pop()
    if os.path.isdir(old_path):
        old_path += "/"
        new_name += "/"
        old_name += "/"
    dir_path = old_path.split(old_name)[0]
    new_path, changed = get_unique_file_name(new_name, dir_path)
    
    try:
        shutil.move(old_path, new_path)
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not read the file or directory: " + str(err), traceback.format_exc())
    except PermissionError as err:
        raise StochSSPermissionsError("You do not have permission to copy this file or directory: " + str(err), traceback.format_exc())
    
    if old_path.endswith('/'):
        new_path = new_path[:-1]
    old_name = old_name.replace('/','')
    new_name = new_name.replace('/','')
    new_path = new_path.replace(user_dir + '/', '')

    if path.endswith('.wkfl') and "RUNNING" in os.listdir(path=new_path):
        with open(os.path.join(new_path, "info.json"), 'r+') as info_file:
            info = json.load(info_file)
            info['wkfl_model'] = info['wkfl_model'].replace(path, new_path)
            info_file.seek(0)
            json.dump(info, info_file)
            info_file.truncate()

    if changed:
        message = "A file already exists with that name, {0} was renamed to {1} in order to prevent a file from being overwriten.".format(old_path.split('/').pop(), new_name)
    else:
        message = 'Success! {0} was renamed to {1}'.format(old_name, new_name)

    resp = {"message":message, "_path":new_path, "changed":changed}
    return resp

