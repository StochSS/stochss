# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

import docker
client = docker.from_env()

from handlers.db_util import checkUserOrRaise

import uuid
import sys
import logging


class RunModelAPIHandler(BaseHandler):

    async def get(self, run_cmd, outfile, modelPath):
        checkUserOrRaise(self)
        log = logging.getLogger()
        user = self.current_user.name
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        self.set_header('Content-Type', 'application/json')
        if outfile == 'none':
            outfile_uuid = uuid.uuid4()
            outfile = "{0}".format(outfile_uuid)
            outfile = outfile.replace("-", "_")
        log.warn(str(outfile))
        code, _results = container.exec_run(cmd="bash -c 'run_model.py {0} {1} {2} &'".format(modelPath, "/home/jovyan/." + outfile + ".tmp", run_cmd))
        results = _results.decode()
        log.warn(str(results))
        if results == '' or results == 'running':
            self.write("running->" + outfile)
        else:
            self.write(results)


class OpenModeNotebookAPIHandler(BaseHandler):
    async def get(self, model_id, version):
        checkUserOrRaise(self)
        
