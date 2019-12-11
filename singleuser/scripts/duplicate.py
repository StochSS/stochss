#!/usr/bin/env python3

import os
import sys
import argparse
from os import path
from shutil import copyfile


user_dir = '/home/jovyan'


def get_unqiue_file_name(_path):
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
    else:
        name = file.split(ext)[0]

    # Check if the file is an original of at least the second copy
    if not '-copy' in file or '-copy(' in file:
        copy_file = ''.join([name, '-copy', ext])
        # Check a copy exist with '-copy' in the name
        if not check_for_file(copy_file, dir_path):
            return _path.replace(file, copy_file)

    i = 2
    copy_file = ''.join([name, '-copy({0})'.format(i), ext])
    # Check if a copy exists with '-copy(2)' in the name
    exists = check_for_file(copy_file, dir_path)

    # If copy_file is still not unique iterate i until a unique name is found
    while exists:
        i += 1
        copy_file = ''.join([name, '-copy({0})'.format(i), ext])
        exists = check_for_file(copy_file, dir_path)

    return _path.replace(file, copy_file)


def duplicate(_path, unique_file_name):
    '''
    Copies the target file with a unique file name in the same directory 
    as the target file.

    Attributes
    ----------
    _path : str
        Path to the target file.
    unique_file_name : str
        File name to use for the copied file.
    '''
    copyfile(_path, unique_file_name)
    return "The model {0} has been successfully copied as {1}".format(_path, unique_file_name)


def check_for_file(file, dir_path):
    '''
    Checkes the  directory for a file.  Returns True if a file with that
    name is found.

    Attributes
    ----------
    file : str
        File to search for.
    dir_path : str
        Path to the directory to be searched.
    '''
    if file in os.listdir(path=dir_path):
        return True
    return False


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Copy the file with a '-copy' added before the file extension.")
    parser.add_argument('file_path', help="The path from the user directory to the file being duplicated.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    full_path = path.join(user_dir, args.file_path)
    unique_file_path = get_unqiue_file_name(full_path)
    message = duplicate(full_path, unique_file_path)
    print(message)