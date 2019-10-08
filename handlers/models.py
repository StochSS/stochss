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
                #container.exec_run(cmd="mkdir -p {0}/.versions/".format(_modelPath))
                tarData = self.convertToTarData(data.encode('utf-8'), modelPath)
                container.put_archive("/home/jovyan/", tarData)
                #container.exec_run(cmd="ln -s {0} {1}".format(verPath, modelPath))
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

class ModelToNotebookHandler(BaseHandler):
    @web.authenticated
    async def get(self, path):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        file_path = '/home/jovyan{0}'.format(path)
        fcode, _fslist = container.exec_run(cmd='convert_to_notebook.py {0}'.format(path))
        fslist = _fslist.decode()
        self.write(fslist)


class ModelBrowserFileList(BaseHandler):

    @web.authenticated
    async def get(self, path):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        file_path = '/home/jovyan{0}'.format(path)
        fcode, _fslist = container.exec_run(cmd='ls.py {0} {1}'.format(file_path, path))
        fslist = _fslist.decode()
        self.write(fslist)



class MoveFileAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, data):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        old_path = "/home/jovyan{0}".format(data.split('/<--MoveTo-->')[0])
        new_path = "/home/jovyan{0}".format(data.split('/<--MoveTo-->').pop())
        code, _message = container.exec_run(cmd='mv {0} {1}'.format(old_path, new_path))
        if not len(_message):
            self.write("Success! {0} was moved to {1}.")
        else:
            message = _message.decode()
            self.write(message)