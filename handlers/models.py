'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication
from handlers.db_util import checkUserOrRaise

import ast # for eval_literal to use with kube response
import json

import logging
log = logging.getLogger()

# Imports for interacting with kubernetes cluster
from kubernetes import config
from kubernetes.client.apis import core_v1_api
from kubernetes.client.rest import ApiException
from kubernetes.stream import stream


def load_kube_client(user):
    '''
    This function loads kubernetes configuration and returns a reference
    to the Kubernetes API client, used for interacting within the cluster.

    Attributes
    ----------
    user : str
        string representation of user name for setting target user pod
    '''

    config.load_incluster_config()
    user_pod = 'jupyter-{0}'.format(user)
    return core_v1_api.CoreV1Api(), user_pod


def read_file_from_container(client, pod, file_path):
    '''
    This function uses kubernetes API to read target file with cat. This
    is a helper function for use with data get/pull requests.

    Attributes
    ----------
    client : CoreV1Api
        Kubernetes API client to handle read.
    pod : str
        name of target user pod to read from.
    file_path : str
        top level path to target file to read.
    '''

    exec_cmd = ['cat', file_path]
    resp = stream(client.connect_get_namespaced_pod_exec, pod, 'jhub',
                            command=exec_cmd, stderr=True, 
                            stdin=False, stdout=True, tty=False)
    resp = ast.literal_eval(resp)
    return json.dumps(resp)

    
def write_file_to_container(client, pod, file_path, to_write):
    '''
    This function uses kubernetes API to write target file with echo. This
    is a helper function for use with data get/pull requests.

    Attributes
    ----------
    client : CoreV1Api
        Kubernetes API client to handle write.
    pod : str
        name of target user pod to write from.
    file_path : str
        top level path to target file to write.
    to_write : str
        data to be written to target file
    '''

    # Open shell
    exec_cmd = ['bash']
    # Pipe everything, set preload to false for use with interactive shell
    resp = stream(client.connect_get_namespaced_pod_exec, pod, 'jhub',
                            command=exec_cmd, stderr=True, 
                            stdin=True, stdout=True, 
                            tty=False, _preload_content=False)

    # List of commands to pass to remote pod shell
    # Uses cat to write to_write data to file_path
    commands = ["cat <<'EOF' >" + file_path + "\n"]
    commands.append(to_write)

    # While shell is running, update and check stdout/stderr
    while resp.is_open():
        resp.update(timeout=1)
        if resp.peek_stdout():
            print("STDOUT: %s" % resp.read_stdout())
        if resp.peek_stderr():
            print("STDERR: %s" % resp.read_stderr())
    
    # Feed all commands to remote pod shell
        if commands:
            c = commands.pop(0)
            resp.write_stdin(str(c))
        else:
            break

    # End connection to pod
    resp.close()

    

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
        client, user_pod = load_kube_client(user) # Load kube client
        full_path = '/home/jovyan/{0}'.format(modelPath) #full path to model
        try:
            json_data = read_file_from_container(client, 
                user_pod, full_path) # Use cat to read json file
        except:
            new_path ='/srv/jupyterhub/model_templates/nonSpatialModelTemplate.json'
            with open(new_path, 'r') as json_file:
                data = json_file.read()
                json_data = json.loads(str(data))
                write_file_to_container(client,
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
        client, user_pod = load_kube_client(user) # Load Kube client
        write_file_to_container(client,
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
        client, user_pod = load_kube_client(user) # Get Kubernetes API+UserPod
        file_path = '/home/jovyan{0}'.format(path) # User file system path
        exec_cmd = ['ls.py', file_path, path] # /usr/local/bin/ls.py in UserPod

        # Utilize Kubernetes API to execute exec_cmd on user pod and return
        # response to variable to populate the js-tree
        resp = stream(client.connect_get_namespaced_pod_exec, user_pod, 'jhub',
                                command=exec_cmd, stderr=True, 
                                stdin=False, stdout=True, tty=False)
        # The Kubernetes library will convert this to a string representation
        # of a Python dictionary.  This is incompatible with json.loads.

        # Use AST library to perform literal eval of response
        resp = ast.literal_eval(resp)

        # Then dump to JSON and write out
        self.write(json.dumps(resp))
