import sys, os, json


def getFileSystemData(dirPath, ppath):
    _children = os.listdir(path=dirPath)
    if len(_children) == 0:
        return _children
    children = []
    for child in _children:
        if os.path.isdir(child) and not child.startswith('.'):
            children.append(buildChild(text=child, isDir=True, ppath=ppath))
        elif checkExtension(child, ".job"):
            children.append(buildChild(text=child, ftype="job", ppath=ppath))
        elif checkExtension(child, ".mdl"):
            children.append(buildChild(text=child, ftype="nonspatial", ppath=ppath))
        elif checkExtension(child, ".smdl"):
            children.append(buildChild(text=child, ftype="spatial", ppath=ppath))
        elif checkExtension(child, ".mesh"):
            children.append(buildChild(text=child, ftype="mesh", ppath=ppath))
        elif checkExtension(child, ".ipynb"):
            children.append(buildChild(text=child, ftype="notebook", ppath=ppath))
        elif not child.startswith('.'):
            children.append(buildChild(text=child, ftype="other", ppath=ppath))
    return children


def buildChild(text, ppath, ftype="folder", isDir=False):
    if ppath == "/":
        ppath = ""
    child = {'text':text, 'type':ftype, '_path':'{0}/{1}'.format(ppath, text)}
    child['children'] = isDir
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