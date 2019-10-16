from jupyterhub.handlers.base import BaseHandler

import docker

from handlers.db_util import checkUserOrRaise
from tornado import web

import tarfile
import tempfile
import json
import sys
import logging
log = logging.getLogger()

class JobInfoAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, infoPath):
        checkUserOrRaise(self)
        log.debug(infoPath)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        bits, stat = container.get_archive("/home/jovyan{0}".format(infoPath))
        jsonData = self.getModelData(bits, infoPath)
        self.write(jsonData)


    def getModelData(self, bits, infoPath):
        fileName = infoPath.split('/').pop()
        f = tempfile.TemporaryFile()
        for data in bits:
            f.write(data)
        f.seek(0)
        tarData = tarfile.TarFile(fileobj=f)
        d = tempfile.TemporaryDirectory()
        tarData.extractall(d.name)
        f.close()
        filePath = "{0}/{1}".format(d.name, fileName)
        with open(filePath, 'r') as jsonFile:
            data = jsonFile.read()
            log.debug(data)
            jsonData = json.loads(str(data))
            return jsonData


class RunJobAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, opt_type, data):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        model_path, job_name = data.split('/<--GillesPy2Job-->/')
        code, _message = container.exec_run(cmd='run_job.py "/home/jovyan/{0}" "{1}" "{2}"'.format(model_path, job_name, opt_type))
        message = _message.decode()
        self.write(message)


class SaveJobAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, _opt_type, data):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        model_path, job_name = data.split('/<--GillesPy2Job-->/')
        code, _message = container.exec_run(cmd='run_job.py "/home/jovyan/{0}" "{1}" "{2}"'.format(model_path, job_name, opt_type))
        message = _message.decode()
        self.write(message)

