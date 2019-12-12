'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication
from handlers.db_util import checkUserOrRaise

import json

import logging
log = logging.getLogger()
from handlers import stochss_kubernetes


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
            Path to target directory within user pod container.

        '''

        checkUserOrRaise(self) # Authenticate User
        user = self.current_user.name # Get User Name
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Get Kubernetes API+UserPod
        path = path.replace(" ", "\ ")
        exec_cmd = ['ls.py', path] # /usr/local/bin/ls.py in UserPod

        # Utilize Kubernetes API to execute exec_cmd on user pod and return
        # response to variable to populate the js-tree
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)

        # Then dump to JSON and write out
        self.write(json.dumps(resp))

  
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
        log.warning(path)
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
        old_path = "/home/jovyan/{0}".format(data.split('/<--MoveTo-->')[0])
        new_path = "/home/jovyan/{0}".format(data.split('/<--MoveTo-->').pop())
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
        exec_cmd = ['duplicate.py', path]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(json.dumps(resp))

        
class RenameAPIHandler(BaseHandler):
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
        path, new_name = _path.split('/<--change-->/')
        exec_cmd = ['rename.py', path, new_name]
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)


class ConvertToSpatialAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for converting a model to a spatial model.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, path):
        '''
        Send Get request to convert a target model to a spatial model in user pod.  
        This method utilizes the kubernetes python api to invoke the 
        convert_to_smdl_mdl.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the model.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        exec_cmd = ['convert_to_smdl_mdl.py', path, 'spatial']
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)


class ConvertToModelAPIHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for converting a spatial model to a model.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self, path):
        '''
        Send Get request to convert a target spatial model to a model in user pod.  
        This method utilizes the kubernetes python api to invoke the 
        convert_to_smdl_mdl.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the model.

        '''
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        exec_cmd = ['convert_to_smdl_mdl.py', path, 'model']
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)

