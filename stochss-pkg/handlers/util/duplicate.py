#!/usr/bin/env python3

import os
from os import path
from shutil import copyfile, copytree
from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError


user_dir = '/home/jovyan'


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
    unique_file_name : str
        File name to use for the copied file.
    '''
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
    return "The model {0} has been successfully copied as {1}".format(original, copy)

