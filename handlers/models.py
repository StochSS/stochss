'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import os.path

from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication
from handlers.db_util import checkUserOrRaise

from kubernetes.stream import stream
import ast # for eval_literal to use with kube response
import json
import uuid

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
    async def get(self, model_path):
        '''
        Retrieve model data from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        model_path : str
            Path to selected model within user pod container.
        '''
        
        checkUserOrRaise(self) # User Validation
        log.debug(model_path)
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        model_path = model_path.replace(" ", "\ ")
        full_path = '/home/jovyan/{0}'.format(model_path) #full path to model
        try:
            to_write = stochss_kubernetes.read_from_pod(client, 
                user_pod, full_path) # Use cat to read json file
        except:
            new_path ='/stochss/model_templates/nonSpatialModelTemplate.json'
            with open(new_path, 'r') as json_file:
                data = json_file.read()
                to_write = json.loads(str(data))
                stochss_kubernetes.write_to_pod(client,
                    user_pod, full_path, to_write)

        self.write(to_write) # Send data to client
                

    @web.authenticated
    async def post(self, model_path):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        model_path : str
            Path to target  model within user pod container.
        '''
        checkUserOrRaise(self) # User validation
        user = self.current_user.name # Get User Name
        model_path = model_path.replace(" ", "\ ")
        full_path = '/home/jovyan/{0}'.format(model_path) #full path to model
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load Kube client
        stochss_kubernetes.write_to_pod(client,
            user_pod, full_path, self.request.body.decode())



class RunModelAPIHandler(BaseHandler):
    '''
    ########################################################################
    Handler for running a model from the model editor.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, run_cmd, outfile, model_path):
        '''
        Run the model with a 5 second timeout.  Only the data from the first
        trajectory is transferred to the hub container.  Data is transferred
        to hub container as JSON string.

        Attributes
        ----------
        run_cmd : str
            command to be executed by the run model script (start) for running
            a model, (read) for reading the results of a model run.
        outfile : str
            The temporary file for the results
        model_path : str
            Path to target model within user pod container.
        '''

        checkUserOrRaise(self) # User validation
        user = self.current_user.name # Get User Name
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load Kube client
        model_path = model_path.replace(" ", "\ ")
        self.set_header('Content-Type', 'application/json')
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile_uuid = uuid.uuid4()
            outfile = "{0}".format(outfile_uuid)
            outfile = outfile.replace("-", "_")
        log.warn(str(outfile))
        exec_cmd = ['run_model.py', model_path, '{}.tmp'.format(outfile)] # Script commands for read run_cmd
        exec_cmd.append(''.join(['--', run_cmd]))
        if run_cmd == 'start':
            exec_cmd = ['screen', '-d', '-m'] + exec_cmd # Add screen cmd to Script commands for start run_cmd
        log.warning(exec_cmd)
        results = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(str(results))
        # Send data back to client
        if results == '' or results == 'running':
            self.write("running->" + outfile)
        else:
            self.write(results)


