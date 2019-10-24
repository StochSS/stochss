# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json
#import docker
from io import BytesIO, StringIO
import tarfile
import tempfile
import time

from handlers.db_util import checkUserOrRaise

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
    '''

    config.load_incluster_config()
    user_pod = 'jupyter-{0}'.format(user)
    return core_v1_api.CoreV1Api(), user_pod

def write_tar_to_container(client, pod, data):
    client.connect_get_namespaced_pod_exec(pod, 'jhub',
        command=['tar', 'cvf', data], tty=False)

def read_tar_from_container(client, pod, file_name):
    data = client.connect_get_namespaced_pod_exec(pod, 'jhub',
        command=['tar', 'cvf', data], tty=False)

    

class ModelFileAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, modelPath):
        checkUserOrRaise(self)
        log.debug(modelPath)
        #client = docker.from_env()
        user = self.current_user.name
        client, user_pod = load_kube_client(user)
        try:
            bits, stat = container.get_archive("/home/jovyan/{0}".format(modelPath))
        except:
            filePath = "/srv/jupyterhub/model_templates/nonSpatialModelTemplate.json"
            with open(filePath, 'r') as jsonFile:
                data = jsonFile.read()
                #jsonData = json.loads(str(data))
                #tarData = self.convertToTarData(data.encode('utf-8'), modelPath)
                #container.put_archive("/home/jovyan/", tarData)
                #self.write(jsonData)
        else:
            jsonData = self.getModelData(bits, modelPath)
            self.write(jsonData)

    @web.authenticated
    async def post(self, modelPath):
        checkUserOrRaise(self)
        #client = docker.from_env()   
        user = self.current_user.name
        #client, user_pod = load_kube_client(user)

        #container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        #tarData = self.convertToTarData(self.request.body, modelPath)
        #container.put_archive("/home/jovyan/", tarData)
        #bits, stat = container.get_archive("/home/jovyan/{0}".format(modelPath))
        #jsonData = self.getModelData(bits, modelPath)


    def getModelPath(self, _modelPath):
        dir_el = _modelPath.split('/')
        file = dir_el.pop()
        dirPath = '/'.join(dir_el)
        return "{0}/{1}/{1}".format(dirPath, file)

    def getVerPath(self, modelPath):
        dir_el = modelPath.split('/')
        file_el = dir_el.pop().split('.')
        dirPath = '/'.join(dir_el)
        ver_tag = "_v1."
        file = ver_tag.join(file_el)
        return "{0}/.version/{1}".format(dirPath, file)


    def getModelData(self, bits, modelPath):
        modelName = modelPath.split('/').pop()
        f = tempfile.TemporaryFile()
        for data in bits:
            f.write(data)
        f.seek(0)
        tarData = tarfile.TarFile(fileobj=f)
        d = tempfile.TemporaryDirectory()
        tarData.extractall(d.name)
        f.close()
        filePath = "{0}/{1}".format(d.name, modelName)
        with open(filePath, 'r') as jsonFile:
            data = jsonFile.read()
            log.debug(data)
            jsonData = json.loads(str(data))
            return jsonData
        

    def convertToTarData(self, data, modelPath):
        tarData = BytesIO()
        tar_file = tarfile.TarFile(fileobj=tarData, mode='w')
        tar_info = tarfile.TarInfo(name='{0}'.format(modelPath))
        tar_info.size = len(data)
        tar_info.mtime = time.time()
        tar_info.tobuf()
        tar_file.addfile(tar_info, BytesIO(data))
        tar_file.close()
        tarData.seek(0)
        return tarData

class ModelToNotebookHandler(BaseHandler):
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
    Handler for interacting with the Model File Browser list with File System data 
    from remote user pod.
    '''

    @web.authenticated
    async def get(self, path):
        '''
        ########################################################################
        Send Get request for fetching file system data in user container.  This
        method utilizes the kubernetes python api to invoke the ls.py module of
        the user container (stored in [UserPod]:/usr/local/bin).  The response 
        is used to populate the Model File Browser js-tree.
        ########################################################################

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
                                command=exec_cmd, stderr=True, stdin=False, stdout=True, tty=False)
        self.write(resp)
