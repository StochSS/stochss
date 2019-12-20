#!/usr/bin/env python3

import sys
import json
import os
import argparse
from os import path


user_dir = '/home/jovyan/'


def getFileSystemData(full_path, p_path):
    '''
    Builds a list of children for the JSTree using the contents 
    of the target directory.  Returns an empty list if the target
    directory is empty.

    Attribute
    ---------
    full_path : str
        Full path to the parent directory.
    p_path : str
        Path from the user directory to the target directory.
    '''
    _children = os.listdir(path=full_path)
    if len(_children) == 0:
        return _children
    children = []
    for child in filter(lambda x: not x.startswith('.'), _children):
        if checkExtension(child, ".job"):
            children.append(buildChild(text=child, f_type="job", p_path=p_path))
        elif checkExtension(child, ".mdl"):
            children.append(buildChild(text=child, f_type="nonspatial", p_path=p_path))
        elif checkExtension(child, ".smdl"):
            children.append(buildChild(text=child, f_type="spatial", p_path=p_path))
        elif checkExtension(child, ".mesh"):
            children.append(buildChild(text=child, f_type="mesh", p_path=p_path))
        elif checkExtension(child, ".ipynb"):
            children.append(buildChild(text=child, f_type="notebook", p_path=p_path))
        elif checkExtension(child, ".sbml"):
            children.append(buildChild(text=child, f_type="sbml-model", p_path=p_path))
        elif path.isdir(path.join(full_path, child)):
            children.append(buildChild(text=child, f_type="folder", p_path=p_path))
        else:
            children.append(buildChild(text=child, f_type="other", p_path=p_path))
    return children


def buildChild(text, f_type, p_path):
    '''
    Builds a JSON represntation of a JSTree child with the added 
    attribute '_path'.

    Attribute
    ---------
    text : str
        Text to be diplayed for the child.
    f_type : str
        The childs type.
    p_path : str
        Path from the user directory to the child's parent
    '''
    if p_path == "/": # The child in the top level pf the JSTree
        _path = text
    else:
        _path = path.join(p_path, text) # The child is in a sub-leve of the tree
    child = { 'text' : text, 'type' : f_type, '_path' : _path }
    child['children'] = f_type == "folder"
    return child


def checkExtension(child, target):
    '''
    Check to see if the child's extension matchs the target extension.

    Attributes
    ----------
    target : str
        The extension being checked for.
    '''
    if child.endswith(target):
        return True
    else:
        return False


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Get the content of a directory and create JSTree nodes for item that are not hidden.")
    parser.add_argument('path', help="The path from the user directory to the target directory.")
    return parser.parse_args()
    

if __name__ == "__main__":    
    args = get_parsed_args()
    p_path = args.path
    if p_path == "/":
        full_path = user_dir
    else:
        full_path = path.join(user_dir, p_path)
    data = getFileSystemData(full_path, p_path)
    print(json.dumps(data))
    
