'''
This file contains API Handlers and methods for executing
model simulations.
'''

# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

#import docker
#client = docker.from_env()

from handlers.db_util import checkUserOrRaise

import sys
import logging
import json

from handlers import stochss_kubernetes


class RunModelAPIHandler(BaseHandler):
    '''
    Handler class for running model simulations.
    '''

    async def get(self, model_path):
        checkUserOrRaise(self) # Validate user
        log = logging.getLogger() # Create logger
        user = self.current_user.name # Get User Name
        #Load Kube API
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        exec_cmd = ['run_model.py', model_path] # command to be sent
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(str(resp))
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps(resp)) # Send resp as json string


class OpenModeNotebookAPIHandler(BaseHandler):
    async def get(self, model_id, version):
        checkUserOrRaise(self)
        
