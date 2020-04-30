#!/usr/bin/env python3

import os
import json
from os import path
from .workflow_status import get_status
from .stochss_errors import StochSSFileNotFoundError


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
    try:
        _children = os.listdir(path=full_path)
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not find the directory: " + str(err))
        
    if len(_children) == 0:
        return _children
    children = []
    for child in filter(lambda x: not x.startswith('.'), _children):
        if checkExtension(child, ".wkfl"):
            children.append(buildChild(text=child, f_type="workflow", p_path=p_path))
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
    if p_path == "none": # The child in the top level of the JSTree
        _path = text
    else:
        _path = path.join(p_path, text) # The child is in a sub-leve of the tree
    child = { 'text' : text, 'type' : f_type, '_path' : _path }
    child['children'] = f_type == "folder"
    if f_type == "workflow":
        status = get_status(_path)
        child['_status'] = status
    return child


def buildRoot(children):
    root = {"text":"/", "type":"root", "_path":"/"}
    root["children"] = children
    root["state"] = {"opened":True}
    return [root]


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


def ls(p_path):
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
    data = getFileSystemData(full_path, p_path)
    if p_path == "none":
        data = buildRoot(data)
    return json.dumps(data)
    
