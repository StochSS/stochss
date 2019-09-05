# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

import docker
client = docker.from_env()

from handlers.db_util import checkUserOrRaise

import sys
import logging


class RunModelAPIHandler(BaseHandler):

    async def get(self, modelPath):
        checkUserOrRaise(self)
        log = logging.getLogger()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        self.set_header('Content-Type', 'application/json')
        code, _results = container.exec_run(cmd="python3 /home/run_model.py {0}".format(modelPath))
        results = _results.decode()
        log.warn(str(results))
        self.write(results)


class OpenModeNotebookAPIHandler(BaseHandler):
    async def get(self, model_id, version):
        checkUserOrRaise(self)
        
