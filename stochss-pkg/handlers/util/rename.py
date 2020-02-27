#!/usr/bin/env python3

import os
import shutil
import sys
import json
import argparse


user_dir = '/home/jovyan'


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
    old_path = os.path.join(user_dir, path)
    old_name = old_path.split('/').pop()
    if os.path.isdir(old_path):
        old_path += "/"
        new_name += "/"
        old_name += "/"
    dir_path = old_path.split(old_name)[0]
    resp = rename(old_path, new_name, dir_path)
    print(resp)
    new_path, changed = get_unique_file_name(new_name, dir_path)
    shutil.move(old_path, new_path)
    
    if changed:
        message = "A file already exists with that name, {0} was renamed to {1} in order to prevent a file from being overwriten.".format(old_path.split('/').pop(), new_name)
    else:
        message = 'Success! {0} was renamed to {1}'.format(old_path.split('/').pop(), new_name)

    resp = {"message":message, "_path":new_path}
    return resp

