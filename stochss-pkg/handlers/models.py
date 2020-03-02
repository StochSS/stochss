'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import os
import subprocess

from notebook.base.handlers import APIHandler
from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication

import ast # for eval_literal to use with kube response
import json
import uuid

import logging
log = logging.getLogger()


class JsonFileAPIHandler(APIHandler):
    '''
    ########################################################################
    Base Handler for interacting with Model file Get/Post Requests.
    ########################################################################
    '''
    async def get(self, model_path):
        '''
        Retrieve model data from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        model_path : str
            Path to selected model within user pod container.
        '''
        log.debug(model_path)
        full_path = '/home/jovyan/{0}'.format(model_path) #full path to model
        try:
            with open(full_path, 'r') as f:
                to_write = f.read()
        except:
            new_path ='/stochss/model_templates/nonSpatialModelTemplate.json'
            with open(new_path, 'r') as json_file:
                data = json_file.read()
                to_write = json.loads(str(data))
            directories = os.path.dirname(full_path)
            os.makedirs(directories)
            full_path = full_path.replace(" ", "\ ")
            with open(full_path, 'w') as f:
                f.write(to_write)
        self.write(to_write) # Send data to client


    async def post(self, model_path):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        model_path : str
            Path to target  model within user pod container.
        '''
        model_path = model_path.replace(" ", "\ ")
        full_path = '/home/jovyan/{0}'.format(model_path) #full path to model
        data = self.request.body.decode()
        with open(full_path, 'w') as f:
            f.write(data)


class RunModelAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running a model from the model editor.
    ########################################################################
    '''
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
        self.set_header('Content-Type', 'application/json')
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile_uuid = uuid.uuid4()
            outfile = "{0}".format(outfile_uuid)
            outfile = outfile.replace("-", "_")
        log.warn(str(outfile))
        # Use Popen instead? Can we orphan/detach the process somehow?
        exec_cmd = ['stochss-pkg/handlers/util/run_model.py', '{0}'.format(model_path), '{}.tmp'.format(outfile)] # Script commands for read run_cmd
        exec_cmd.append(''.join(['--', run_cmd]))
        log.warning(exec_cmd)
        if(run_cmd == "start"):
            pipe = subprocess.Popen(exec_cmd)
            self.write("running->{0}".format(outfile))
        else:
            pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
            results, error = pipe.communicate()
            log.warning(results)
            log.error(error)
            # Send data back to client
            if results:
                self.write(results)
            else:
                self.write("running->{0}".format(outfile))

