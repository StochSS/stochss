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
        '''
        Sends request to server to run convert_to_notebook.py on target mdl
        file.

        Attributes
        ----------
        path : str
            Path to target model within user pod container.
        '''
        checkUserOrRaise(self) # Validate User
        user = self.current_user.name # Get User Name
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Kube API
        exec_cmd = ['convert_to_notebook.py', path] # Script commands
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)


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


class RunJobAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for interacting with the Model File Browser list with File System data 
    from remote user pod.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, data):
        '''
        Send Get request for initiating job on target model.  This
        method utilizes the kubernetes python api to invoke the run_job.py module 
        of the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        data : str
            data string containing job information.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        file_path = '"/home/jovyan{0}"'.format(model_path)
        model_path, job_name = data.split('/<--GillesPy2Job-->/')
        exec_cmd = ['run_job.py', file_path, job_name]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)
        
  
class DeleteFileAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for removing files from remote user pod.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, path):
        '''
        Send Get request for removing file from user file system.  This
        method utilizes the kubernetes python api to invoke rm -R on target
        file in remote user pod.

        Attributes
        ----------
        path : str
            Path to removal target.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        file_path = '/home/jovyan{0}'.format(path)
        exec_cmd = ['rm', '-R', file_path]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        if len(resp):
            self.write(json.dumps(resp))
        else:
            self.write("{0} was successfully deleted.".format(path.split('/').pop()))


class MoveFileAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler moving file locations in remote user pod.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, data):
        '''
        Send Get request to change location of target file in remote user file
        system.  This method utilizes the kubernetes python api to invoke mv on
        target file in remote user pod.

        Attributes
        ----------
        data : str
            Data string containing old and new locations of target file.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        old_path = "/home/jovyan{0}".format(data.split('/<--MoveTo-->')[0])
        new_path = "/home/jovyan{0}".format(data.split('/<--MoveTo-->').pop())
        exec_cmd = ['mv', old_path, new_path]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        if not len(resp):
            self.write("Success! {0} was moved to {1}.")
        else:
            message = resp
            self.write(message)     

 
class DuplicateModelHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for creating model duplicates in user pod.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, path):
        '''
        Send Get request for duplicating target file in user pod.  This method 
        utilizes the kubernetes python api to invoke the duplicate.py module of
        the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path to target model within user pod container.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        file_path = '/home/jovyan{0}'.format(path)
        exec_cmd = ['duplicate.py', file_path]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(json.dumps(resp))

        
class MoveRenameAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for renaming model files.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, _path):
        '''
        Send Get request to rename target file in user pod.  This method
        utilizes the kubernetes python api to invoke the rename.py module of
        the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        _path : str
            string of data containing rename information.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        old_path, new_name = _path.split('/<--change-->/')
        dir_path = old_path.split('/')
        dir_path.pop()
        dir_path.append(new_name)
        new_path = '/'.join(dir_path)
        exec_cmd = ['rename.py', old_path, new_path]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write("{0}<-_path->{1}".format(resp, new_path))
