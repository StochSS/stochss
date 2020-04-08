'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import os
import subprocess

from notebook.base.handlers import APIHandler

import ast # for eval_literal to use with kube response
import uuid
import json
from json.decoder import JSONDecodeError

import logging
log = logging.getLogger()


class JsonFileAPIHandler(APIHandler):
    '''
    ########################################################################
    Base Handler for interacting with Model file Get/Post Requests and 
    downloading json formatted files.
    ########################################################################
    '''
    async def get(self, file_path):
        '''
        Retrieve model data from User's file system if it exists and 
        create new models using a model template if they don't.  Also
        retrieves JSON files for download.

        Attributes
        ----------
        model_path : str
            Path to json file from the user directory.
        '''
        # log.setLevel(logging.DEBUG)
        log.setLevel(logging.WARNING)
        log.debug("Path to the file: {0}\n".format(file_path))
        full_path = os.path.join('/home/jovyan', file_path)
        log.debug("Full path to the file: {0}\n".format(full_path))
        self.set_header('Content-Type', 'application/json')
        if os.path.exists(full_path):
            with open(full_path, 'r') as f:
                data = json.load(f)
            log.debug("Contents of the json file: {0}\n".format(data))
            self.write(data)
        else:
            new_path ='/stochss/model_templates/nonSpatialModelTemplate.json'
            log.debug("Path to the model template: {0}\n".format(new_path))
            try:
                with open(new_path, 'r') as json_file:
                    template = json.load(json_file)
                log.debug("Contents of the model template: {0}\n".format(template))
                directories = os.path.dirname(full_path)
                log.debug("Path of parent directories: {0}\n".format(directories))
                try:
                    os.makedirs(directories)
                except FileExistsError:
                    log.debug("The directories in the path to the model already exists.")
                full_path = full_path.replace(" ", "\ ")
                log.debug("Full path with escape char spaces: {0}\n".format(full_path))
                with open(full_path, 'w') as f:
                    json.dump(template, f)
                self.write(template)
            except FileNotFoundError as err:
                self.set_status(404)
                error = {"Reason":"Model Template Not Found","Message":"Could not find the model template file: "+str(err)}
                log.error("Exception information: {0}\n".format(error))
                self.write(error)
            except JSONDecodeError as err:
                self.set_status(406)
                error = {"Reason":"Template Data Not JSON Format","Message":"Template data is not JSON decodeable: "+str(err)}
                log.error("Exception information: {0}\n".format(error))
                self.write(error)
        self.finish()


    async def post(self, model_path):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        model_path : str
            Path to target  model within user pod container.
        '''
        # log.setLevel(logging.DEBUG)
        log.setLevel(logging.WARNING)
        log.debug("Path to the model: {0}\n".format(model_path))
        model_path = model_path.replace(" ", "\ ")
        log.debug("Path with escape char spaces: {0}\n".format(model_path))
        full_path = os.path.join('/home/jovyan', model_path)
        log.debug("Full path to the model: {0}\n".format(full_path))
        data = self.request.body.decode()
        log.debug("Model data to be saved: {0}\n".format(data))
        with open(full_path, 'w') as f:
            f.write(data)
        self.finish()


class RunModelAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running a model from the model editor.
    ########################################################################
    '''
    async def get(self, run_cmd, outfile, model_path):
        '''
        Run the model with a 5 second timeout.  Results are sent to the 
        client as a JSON object.

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
        # log.setLevel(logging.DEBUG)
        log.setLevel(logging.WARNING)
        log.debug("Run command sent to the script: {0}\n".format(run_cmd))
        log.debug("Path to the model: {0}\n".format(model_path))
        self.set_header('Content-Type', 'application/json')
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile = str(uuid.uuid4()).replace("-", "_")
        log.debug("Temporary outfile: {0}\n".format(outfile))
        exec_cmd = ['/stochss/stochss-pkg/handlers/util/run_model.py', '{0}'.format(model_path), '{}.tmp'.format(outfile)] # Script commands for read run_cmd
        exec_cmd.append(''.join(['--', run_cmd]))
        log.debug("Exec command sent to the subprocess: {0}\n".format(exec_cmd))
        resp = {"Running":False,"Outfile":outfile,"Results":""}
        if(run_cmd == "start"):
            pipe = subprocess.Popen(exec_cmd)
            resp['Running'] = True
            log.debug("Response to the start command: {0}\n".format(resp))
            self.write(resp)
        else:
            pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
            results, error = pipe.communicate()
            log.debug("Results for the model preview: {0}\n".format(results))
            log.error("Errors thrown by the subprocess: {0}\n".format(error))
            # Send data back to client
            if results:
                resp['Results'] = json.loads(results)
                if 'errors' in resp['Results'].keys():
                    self.set_status(406)
            else:
                resp['Running'] = True
            log.debug("Response to the read command: {0}\n".format(resp))
            self.write(resp)
        self.finish()

