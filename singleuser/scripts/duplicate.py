#!/usr/bin/env python3

import os
import sys
import argparse
from os import path
from shutil import copyfile


USER_DIR = '/home/jovyan'


def duplicate(_path, dir_path):
    i = 2
    if len(_path.split('-copy.')) < 2 and len(_path.split('-copy(')) < 2:
        split_str = "."
        copy_path = '-copy.'.join(_path.split(split_str))
        file_path = _path
    elif len(_path.split('-copy.')) == 2:
        split_str = "-copy."
        copy_path = '-copy({0}).'.format(i).join(_path.split(split_str))
        file_path = _path
        i += 1
    else:
        split_str = "-copy."
        _file_path = _path.split('-copy(')[0]
        ext = _path.split('.').pop()
        file_path = "{0}-copy.{1}".format(_file_path, ext)
        _file = file_path.split('/').pop()
        _exists = check_for_file(_file, dir_path)
        if not _exists:
            copy_path = file_path
        else:
            copy_path = '-copy({0}).'.format(i).join(file_path.split(split_str))
        i += 1
    file = copy_path.split('/').pop()
    exists = check_for_file(file, dir_path)
    while exists:
        copy_path = '-copy({0}).'.format(i).join(file_path.split(split_str))
        file = copy_path.split('/').pop()
        exists = check_for_file(file, dir_path)
        i += 1
    copyfile(_path, copy_path)
    return "The model {0} has been successfully copied as {1}".format(_path, copy_path)


def check_for_file(file, dir_path):
    if file in os.listdir(path=dir_path):
        return True
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Copy the file with a '-copy' added before the file extension.")
    parser.add_argument('file_path', help="The path from the user directory to the file being duplicated.")
    args = parser.parse_args()
    file_path = path.join(USER_DIR, args.file_path)
    _dir_path = file_path.split('/')
    _dir_path.pop()
    dir_path = '/'.join(_dir_path)
    message = duplicate(file_path, dir_path)
    print(message)