#!/usr/bin/env python3

import os, sys

def rename(old, new, dir_path):
    if new.split('/').pop() in os.listdir(path=dir_path):
        return "ERROR: A file already exists with the name {0}".format(new)
    else:
        os.rename(old, new)
        return 'Success! {0} was changed to {1}'.format(old_path, new_path)


if __name__ == "__main__":
    old_path = "/home/jovyan{0}".format(sys.argv[1])
    new_path = "/home/jovyan{0}".format(sys.argv[2])
    _dir_path = new_path.split('/')
    _dir_path.pop()
    dir_path = '/'.join(_dir_path)
    results = rename(old_path, new_path, dir_path)
    print(results)