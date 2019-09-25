#!/usr/bin/env python3

import sys, os, json

def getFileSystemData(dirPath, ppath):
    _children = os.listdir(path=dirPath)
    if len(_children) == 0:
        return _children
    children = []
    for child in filter(lambda x: not x.startswith('.'), _children):
        if checkExtension(child, ".job"):
            children.append(buildChild(text=child, ftype="job", ppath=ppath))
        elif checkExtension(child, ".mdl"):
            children.append(buildChild(text=child, ftype="nonspatial", ppath=ppath))
        elif checkExtension(child, ".smdl"):
            children.append(buildChild(text=child, ftype="spatial", ppath=ppath))
        elif checkExtension(child, ".mesh"):
            children.append(buildChild(text=child, ftype="mesh", ppath=ppath))
        elif checkExtension(child, ".ipynb"):
            children.append(buildChild(text=child, ftype="notebook", ppath=ppath))
        elif os.path.isdir(os.path.join(dirPath, child)):
            children.append(buildChild(text=child, ftype="folder", ppath=ppath))
        else:
            children.append(buildChild(text=child, ftype="other", ppath=ppath))
    return children


def buildChild(text, ftype, ppath):
    if ppath == "/":
        ppath = ""
    child = { 'text' : text, 'type' : ftype, '_path' : '{0}/{1}'.format(ppath, text) }
    child['children'] = ftype == "folder"
    return child


def checkExtension(data, target):
    if data.endswith(target):
        return True
    else:
        return False


if __name__ == "__main__":
    dirPath = sys.argv[1]
    ppath = sys.argv[2]
    data = getFileSystemData(dirPath, ppath)
    print(json.dumps(data))
