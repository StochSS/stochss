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
    while exists:
        if '.' in new_name: # assume file has an extension
            ext = "." + new_name.split('.').pop()
            name = new_name.split(ext)[0]
            new_name = ''.join([name, "({0})".format(i), ext])
        else: # file has no extension
            new_name += "({0})".format(i)
        exists = new_name in os.listdir(path=dir_path)
        i += 1
    changed = i > 1 # did the file change
    return os.path.join(dir_path, new_name), changed


def rename(old_path, new_name, dir_path):
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
    new_path, changed = get_unique_file_name(new_name, dir_path)
    shutil.move(old_path, new_path)
    
    if changed:
        message = "A file already exists with that name, {0} was renamed to {1} in order to prevent a file from being overwriten.".format(old_path.split('/').pop(), new_name)
    else:
        message = 'Success! {0} was renamed to {1}'.format(old_path.split('/').pop(), new_name)

    resp = {"message":message, "_path":new_path}
    return json.dumps(resp)


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Rename a file or directory, prints an error if a file or directory already has that name.")
    parser.add_argument('path', help="Path to the file or directory to be renamed.")
    parser.add_argument('new_name', help="New name for the file or directory")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    old_path = os.path.join(user_dir, args.path)
    new_name = args.new_name
    old_name = old_path.split('/').pop()
    if os.path.isdir(old_path):
        old_path += "/"
        new_name += "/"
        old_name += "/"
    dir_path = old_path.split(old_name)[0]
    resp = rename(old_path, new_name, dir_path)
    print(resp)