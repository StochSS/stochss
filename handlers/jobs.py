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
        model_path, job = data.split('/<--GillesPy2Job-->/')
        args = "/home/jovyan/{0} {1} {2}".format(model_path, job, opt_type)
        code, _message = container.exec_run(cmd='bash -c "run_job.py {0} &"'.format(args), stream=True)
        if code == 0:
            self.write("Success! the job has started running.")
        else:
            self.write("Oops! something went wrong.")


class SaveJobAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, opt_type, data):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        model_path, job = data.split('/<--GillesPy2Job-->/')
        args = "/home/jovyan/{0} {1} {2}".format(model_path, job, opt_type)
        log.warn(args)
        code, _message = container.exec_run(cmd='bash -c "run_job.py {0} &"'.format(args), stream=True)
        if code == 0:
            self.write("Success! the job has been saved.")
        else:
            self.write("Oops! something went wrong.")


class JobStatusAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, data):
        checkUserOrRaise(self)
        client = docker.from_env()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        code, _status = container.exec_run(cmd='job_status.py /home/jovyan{0}'.format(data))
        status = _status.decode()
        self.write(status.strip())

