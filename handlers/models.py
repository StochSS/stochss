'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication
from handlers.db_util import checkUserOrRaise

from kubernetes.stream import stream
import ast # for eval_literal to use with kube response
import json

import logging
log = logging.getLogger()
from handlers import stochss_kubernetes

class ModelFileAPIHandler(BaseHandler):
    '''
    ########################################################################
    Base Handler for interacting with Model file Get/Post Requests.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, modelPath):
        '''
        Retrieve model data from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        modelPath : str
            Path to selected model within user pod container.
        '''
        
        checkUserOrRaise(self) # User Validation
        log.debug(modelPath)
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        full_path = '/home/jovyan/{0}'.format(modelPath) #full path to model
        try:
            json_data = stochss_kubernetes.read_from_pod(client, 
                user_pod, full_path) # Use cat to read json file
        except:
            new_path ='/srv/jupyterhub/model_templates/nonSpatialModelTemplate.json'
            with open(new_path, 'r') as json_file:
                data = json_file.read()
                json_data = json.loads(str(data))
                stochss_kubernetes.write_to_pod(client,
                    user_pod, full_path, to_write)

        self.write(json_data) # Send data to client
                

    @web.authenticated
    async def post(self, modelPath):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        modelPath : str
            Path to target  model within user pod container.
        '''
        checkUserOrRaise(self) # User validation
        user = self.current_user.name # Get User Name
        full_path = '/home/jovyan/{0}'.format(modelPath) #full path to model
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load Kube client
        stochss_kubernetes.write_to_pod(client,
            user_pod, full_path, self.request.body.decode())



class ModelToNotebookHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self, path):
        checkUserOrRaise(self)
        #client = docker.from_env()
        user = self.current_user.name
        #container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        #file_path = '/home/jovyan{0}'.format(path)
        #fcode, _fslist = container.exec_run(cmd='convert_to_notebook.py {0}'.format(path))
        #fslist = _fslist.decode()
        #self.write(fslist)


class ModelBrowserFileList(BaseHandler):
    '''
    ##############################################################################
    Handler for interacting with the Model File Browser list with File System data 
    from remote user pod.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self, path):
        '''
        Send Get request for fetching file system data in user container.  This
        method utilizes the kubernetes python api to invoke the ls.py module of
        the user container (stored in [UserPod]:/usr/local/bin).  The response 
        is used to populate the Model File Browser js-tree.

        Attributes
        ----------
        path : str
            Path to user directory within user pod container.

        '''

        checkUserOrRaise(self) # Authenticate User
        user = self.current_user.name # Get User Name
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Get Kubernetes API+UserPod
        file_path = '/home/jovyan{0}'.format(path) # User file system path
        exec_cmd = ['ls.py', file_path, path] # /usr/local/bin/ls.py in UserPod

        # Utilize Kubernetes API to execute exec_cmd on user pod and return
        # response to variable to populate the js-tree
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)

        # Then dump to JSON and write out
        self.write(json.dumps(resp))
