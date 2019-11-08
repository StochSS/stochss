# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from handlers.db_util import checkUserOrRaise
from handlers import stochss_kubernetes

import uuid
import sys
import logging


class RunModelAPIHandler(BaseHandler):

    async def get(self, run_cmd, outfile, modelPath):
        checkUserOrRaise(self)
        log = logging.getLogger()
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        self.set_header('Content-Type', 'application/json')
        if outfile == 'none':
            outfile_uuid = uuid.uuid4()
            outfile = "{0}".format(outfile_uuid)
            outfile = outfile.replace("-", "_")
        log.warn(str(outfile))
        exec_cmd = ['run_model.py', modelPath, '/home/jovyan/.{}.tmp'.format(outfile), run_cmd]
        results = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(str(results))
        if results == '' or results == 'running':
            self.write("running->" + outfile)
        else:
            self.write(results)

