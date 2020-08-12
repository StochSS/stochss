#!/usr/bin/env python3

import os
import json
import traceback
from os import path
from .workflow_status import get_status
from .stochss_errors import StochSSFileNotFoundError


def get_file_system_data(full_path, p_path):
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
    try:
        _children = os.listdir(path=full_path)
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not find the directory: " + str(err),
                                       traceback.format_exc())

    if len(_children) == 0:
        return _children
    return get_children(_children, p_path, full_path)


def get_children(_children, p_path, full_path):
    children = []
    for child in filter(lambda x: not x.startswith('.'), _children):
        if check_extension(child, ".wkfl"):
            children.append(build_child(text=child, f_type="workflow", p_path=p_path))
        elif check_extension(child, ".proj"):
            children.append(build_child(text=child, f_type="project", p_path=p_path))
        elif check_extension(child, ".exp"):
            children.append(build_child(text=child, f_type="experiment", p_path=p_path))
        elif check_extension(child, ".mdl"):
            children.append(build_child(text=child, f_type="nonspatial", p_path=p_path))
        elif check_extension(child, ".smdl"):
            children.append(build_child(text=child, f_type="spatial", p_path=p_path))
        elif check_extension(child, ".mesh"):
            children.append(build_child(text=child, f_type="mesh", p_path=p_path))
        elif check_extension(child, ".ipynb"):
            children.append(build_child(text=child, f_type="notebook", p_path=p_path))
        elif check_extension(child, ".sbml"):
            children.append(build_child(text=child, f_type="sbml-model", p_path=p_path))
        elif path.isdir(path.join(full_path, child)):
            children.append(build_child(text=child, f_type="folder", p_path=p_path))
        else:
            children.append(build_child(text=child, f_type="other", p_path=p_path))
    return children


def build_child(text, f_type, p_path):
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
    if p_path == "none": # The child in the top level of the JSTree
        _path = text
    else:
        _path = path.join(p_path, text) # The child is in a sub-leve of the tree
    child = {'text' : text, 'type' : f_type, '_path' : _path}
    child['children'] = f_type == "folder" or f_type == "experiment"
    if f_type == "workflow":
        status = get_status(_path)
        child['_status'] = status
    return child


def build_root(children, _path="/", text="/"):
    root = {"text":text, "type":"root", "_path":_path}
    root["children"] = children
    root["state"] = {"opened":True}
    return [root]


def check_extension(child, target):
    '''
    Check to see if the child's extension matchs the target extension.

    Attributes
    ----------
    target : str
        The extension being checked for.
    '''
    return child.endswith(target)


def list_files(p_path, is_root=False):
    '''
    Format the path to the target directory to an absolute path.
    Retreive the JSTree children nodes and add them to a root node
    if the target directory is the User directory

    Attributes
    ----------
    p_path : str
        The path from the user directory to the target directory.
    '''
    user_dir = '/home/jovyan'

    if p_path == "none":
        full_path = user_dir
    else:
        full_path = path.join(user_dir, p_path)
    data = get_file_system_data(full_path, p_path)
    if p_path == "none":
        data = build_root(data)
    elif is_root:
        text = p_path.split('/').pop().split('.')[0]
        data = build_root(data, _path=p_path, text=text)
    return json.dumps(data)
