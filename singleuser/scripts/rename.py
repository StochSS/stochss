#!/usr/bin/env python3

import os
import sys
import argparse
from os import path


USER_DIR = '/home/jovyan'


def rename(old, new, dir_path):
    if new.split('/').pop() in os.listdir(path=dir_path):
        return "ERROR: A file already exists with the name {0}".format(new)
    else:
        os.rename(old, new)
        return 'Success! {0} was changed to {1}'.format(old, new)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Rename a file or directory, prints an error if a file or directory already has that name.")
    parser.add_argument('path', help="Path to the file or directory to be renamed.")
    parser.add_argument('new_name', help="New name for the file or directory")
    args = parser.parse_args()
    old_path = path.join(USER_DIR, args.path)
    dir_path = old_path.split('/')
    dir_path.pop()
    dir_path = '/'.join(dir_path)
    new_path = path.join(dir_path, args.new_name)
    results = rename(old_path, new_path, dir_path)
    print(results)