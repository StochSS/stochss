# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json
import docker
from io import BytesIO, StringIO
import tarfile
import tempfile
import time

from handlers.db_util import checkUserOrRaise

import logging
log = logging.getLogger()
 

class ModelFileAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, modelPath):
        checkUserOrRaise(self)
        log.debug(modelPath)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        #modelPath = self.getModelPath(_modelPath)
        try:
            bits, stat = container.get_archive("/home/jovyan/{0}".format(modelPath))
        except:
            filePath = "/srv/jupyterhub/model_templates/nonSpatialModelTemplate.json"
            with open(filePath, 'r') as jsonFile:
                data = jsonFile.read()
                jsonData = json.loads(str(data))
                #verPath = self.getVerPath(modelPath)
                tarData = self.convertToTarData(data.encode('utf-8'), modelPath)
                container.put_archive("/home/jovyan/", tarData)
                self.write(jsonData)
        else:
            jsonData = self.getModelData(bits, modelPath)
            self.write(jsonData)

    @web.authenticated
    async def post(self, modelPath):
        checkUserOrRaise(self)
        client = docker.from_env()   
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        tarData = self.convertToTarData(self.request.body, modelPath)
        container.put_archive("/home/jovyan/", tarData)
        bits, stat = container.get_archive("/home/jovyan/{0}".format(modelPath))
        jsonData = self.getModelData(bits, modelPath)
        #self.write(jsonData)


    def getModelPath(self, _modelPath):
        dir_el = _modelPath.split('/')
        file = dir_el.pop()
        dirPath = '/'.join(dir_el)
        return "{0}/{1}/{1}".format(dirPath, file)

    def getVerPath(self, modelPath):
        dir_el = modelPath.split('/')
        file_el = dir_el.pop().split('.')
        dirPath = '/'.join(dir_el)
        ver_tag = "_v1."
        file = ver_tag.join(file_el)
        return "{0}/.version/{1}".format(dirPath, file)


    def getModelData(self, bits, modelPath):
        modelName = modelPath.split('/').pop()
        f = tempfile.TemporaryFile()
        for data in bits:
            f.write(data)
        f.seek(0)
        tarData = tarfile.TarFile(fileobj=f)
        d = tempfile.TemporaryDirectory()
        tarData.extractall(d.name)
        f.close()
        filePath = "{0}/{1}".format(d.name, modelName)
        with open(filePath, 'r') as jsonFile:
            data = jsonFile.read()
            log.debug(data)
            jsonData = json.loads(str(data))
            return jsonData
        

    def convertToTarData(self, data, modelPath):
        tarData = BytesIO()
        tar_file = tarfile.TarFile(fileobj=tarData, mode='w')
        tar_info = tarfile.TarInfo(name='{0}'.format(modelPath))
        tar_info.size = len(data)
        tar_info.mtime = time.time()
        tar_info.tobuf()
        tar_file.addfile(tar_info, BytesIO(data))
        tar_file.close()
        tarData.seek(0)
        return tarData    


class ModelBrowserFileList(BaseHandler):

    @web.authenticated
    async def get(self, path):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        file_path = '/home/jovyan{0}'.format(path)
        fcode, _fslist = container.exec_run(cmd='ls {0}'.format(file_path))
        _children = _fslist.decode().rstrip().split("\n")
        children = []
        if not _children[0] == '':
            for child in _children:
                if self.checkExtension(child, ".job"):
                    children.append(self.buildChild(text=child, ftype="job", ppath=path))
                elif self.checkExtension(child, ".nsmdl"):
                    children.append(self.buildChild(text=child, ftype="nonspatial", ppath=path))
                elif self.checkExtension(child, ".smdl"):
                    children.append(self.buildChild(text=child, ftype="spatial", ppath=path))
                elif self.checkExtension(child, ".mesh"):
                    children.append(self.buildChild(text=child, ftype="mesh", ppath=path))
                elif self.checkExtension(child, ".ipynb"):
                    children.append(self.buildChild(text=child, ftype="notebook", ppath=path))
                else:
                    children.append(self.buildChild(text=child, isDir=True, ppath=path))
            self.write(json.dumps(children))
        else:
            self.write(json.dumps(children))


    def checkExtension(self, data, target):
        if data.endswith(target):
            return True
        else:
            return False


    def buildChild(self, text, ppath, ftype="folder", isDir=False):
        if ppath == "/":
            ppath = ""
        child = {'text':text, 'type':ftype, '_path':'{0}/{1}'.format(ppath, text)}
        child['children'] = isDir
        return child

