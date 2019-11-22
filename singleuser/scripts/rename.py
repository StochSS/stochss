#!/usr/bin/env python3

import os
import sys
import json
import argparse


user_dir = '/home/jovyan'


def rename(old_path, new_name, dir_path):
    exists = new_name in os.listdir(path=dir_path)
    i = 1
    while exists:
        if '.' in new_name:
            ext = "." + new_name.split('.').pop()
            name = new_name.split(ext)[0]
            new_name = ''.join([name, "({0})".format(i), ext])
        else:
            new_name += "({0})".format(i)
        exists = new_name in os.listdir(path=dir_path)
        i += 1

    new_path = os.path.join(dir_path, new_name)
    os.rename(old_path, new_path)
    
    if i > 1:
        message = "A file already exists with that name, {0} was renamed to {1} in order to prevent a file from being overwriten.".format(old_path.split('/').pop(), new_name)
    else:
        message = 'Success! {0} was renamed to {1}'.format(old_path.split('/').pop(), new_name)

    resp = {"message":message, "_path":new_path}
    return json.dumps(resp)


def get_parsed_args():
    parser = argparse.ArgumentParser(description="Rename a file or directory, prints an error if a file or directory already has that name.")
    parser.add_argument('path', help="Path to the file or directory to be renamed.")
    parser.add_argument('new_name', help="New name for the file or directory")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    old_path = os.path.join(user_dir, args.path)
    old_name = old_path.split('/').pop()
    dir_path = old_path.split(old_name)[0]
    new_name = args.new_name
    resp = rename(old_path, new_name, dir_path)
    print(resp)