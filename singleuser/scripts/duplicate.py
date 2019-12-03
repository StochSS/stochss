#!/usr/bin/env python3

import os
import sys
import argparse
from os import path
from shutil import copyfile


user_dir = '/home/jovyan'


def get_unqiue_file_name(_path, dir_path):
    '''
    Gets a unique name for a file to be copied.  Accounts for a copy
    as the target file.

    Attributes
    ----------
    _path : str
        Path to the file being copied.
    dir_path : str
        Path to the parent directory of the file being copied.
    '''
    i = 2
    # Case 1: copying an original file
    if len(_path.split('-copy.')) < 2 and len(_path.split('-copy(')) < 2:
        split_str = "."
        copy_path = '-copy.'.join(_path.split(split_str))
        file_path = _path
    # Case 2: copying a copy of a file with '-copy' in the name
    elif len(_path.split('-copy.')) == 2:
        split_str = "-copy."
        copy_path = '-copy({0}).'.format(i).join(_path.split(split_str))
        file_path = _path
        i += 1
    # Case 3: copying a copy of a file with '-cpoy("x")' in the name
    else:
        split_str = "-copy."
        _file_path = _path.split('-copy(')[0]
        ext = _path.split('.').pop()
        file_path = "{0}-copy.{1}".format(_file_path, ext)
        _file = file_path.split('/').pop()
        # Check if a copy already exists with '-copy' in the name
        _exists = check_for_file(_file, dir_path)
        if not _exists:
            copy_path = file_path
        else:
            copy_path = '-copy({0}).'.format(i).join(file_path.split(split_str))
        i += 1
    file = copy_path.split('/').pop()
    # Check in the name for the copy is unique
    exists = check_for_file(file, dir_path)
    # If the name is not unique increment the name until a unique name is found
    while exists:
        copy_path = '-copy({0}).'.format(i).join(file_path.split(split_str))
        file = copy_path.split('/').pop()
        exists = check_for_file(file, dir_path)
        i += 1
    return copy_path


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
    file = full_path.split('/').pop()
    dir_path = full_path.split(file)[0]
    unique_file_name = get_unqiue_file_name(full_path, dir_path)
    message = duplicate(full_path, unique_file_name)
    print(message)