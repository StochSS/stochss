'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import os
import subprocess
import traceback

from notebook.base.handlers import APIHandler
from tornado import web

import ast # for eval_literal to use with kube response
import uuid
import json
from json.decoder import JSONDecodeError

import logging

log = logging.getLogger('stochss')

workdir="/home/jovyan/stochss"

class JsonFileAPIHandler(APIHandler):
    '''
    ########################################################################
    Base Handler for interacting with Model file Get/Post Requests and 
    downloading json formatted files.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve model data from User's file system if it exists and 
        create new models using a model template if they don't.  Also
        retrieves JSON files for download.

        Attributes
        ----------
        '''
        purpose = self.get_query_argument(name="for")
        log.debug("Purpose of the handler: %s", purpose)
        file_path = self.get_query_argument(name="path")
        log.debug("Path to the file: {0}".format(file_path))
        if file_path.startswith('/'):
            file_path = file_path.replace('/', '', 1)
        full_path = os.path.join(workdir, file_path)
        log.debug("Full path to the file: {0}".format(full_path))
        self.set_header('Content-Type', 'application/json')
        if os.path.exists(full_path):
            with open(full_path, 'r') as f:
                data = json.load(f)
            log.debug("Contents of the json file: {0}".format(data))
            if full_path.endswith(".mdl"):
                self.update_model_data(data)
            self.write(data)
        elif purpose == "edit":
            new_path ='/stochss/stochss_templates/nonSpatialModelTemplate.json'
            log.debug("Path to the model template: {0}".format(new_path))
            try:
                with open(new_path, 'r') as json_file:
                    template = json.load(json_file)
                log.debug("Contents of the model template: {0}".format(template))
                directories = os.path.dirname(full_path)
                log.debug("Path of parent directories: {0}".format(directories))
                try:
                    os.makedirs(directories)
                except FileExistsError:
                    log.debug("The directories in the path to the model already exists.")
                with open(full_path, 'w') as f:
                    json.dump(template, f)
                self.write(template)
            except FileNotFoundError as err:
                self.set_status(404)
                error = {"Reason":"Model Template Not Found","Message":"Could not find the model template file: "+str(err)}
                trace = traceback.format_exc()
                log.error("Exception information: {0}\n{1}".format(error, trace))
                error['Traceback'] = trace
                self.write(error)
            except JSONDecodeError as err:
                self.set_status(406)
                error = {"Reason":"Template Data Not JSON Format","Message":"Template data is not JSON decodeable: "+str(err)}
                trace = traceback.format_exc()
                log.error("Exception information: {0}\n{1}".format(error, trace))
                error['Traceback'] = trace
                self.write(error)
        else:
            self.set_status(404)
            error = {"Reason":"Model Not Found","Message":"Could not find the model file: "+file_path}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


    @classmethod
    def update_model_data(cls, data):
        param_ids = []
        for param in data['parameters']:
            param_ids.append(param['compID'])
            if isinstance(param['expression'], str):
                try:
                    param['expression'] = ast.literal_eval(param['expression'])
                except ValueError:
                    pass
        for reaction in data['reactions']:
            if reaction['rate'].keys() and isinstance(reaction['rate']['expression'], str):
                try:
                    reaction['rate']['expression'] = ast.literal_eval(reaction['rate']['expression'])
                except ValueError:
                    pass
        for event in data['eventsCollection']:
            for assignment in event['eventAssignments']:
                if assignment['variable']['compID'] in param_ids:
                    try:
                        assignment['variable']['expression'] = ast.literal_eval(assignment['variable']['expression'])
                    except ValueError:
                        pass
        for rule in data['rules']:
            if rule['variable']['compID'] in param_ids:
                try:
                    rule['variable']['expression'] = ast.literal_eval(rule['variable']['expression'])
                except ValueError:
                    pass

        
    @web.authenticated
    async def post(self):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        '''
        purpose = self.get_query_argument(name="for")
        model_path = self.get_query_argument(name="path")
        if model_path.startswith('/'):
            model_path = model_path.replace('/', '', 1)
        log.debug("Path to the model: {0}".format(model_path))
        log.debug("Path with escape char spaces: {0}".format(model_path))
        full_path = os.path.join(workdir, model_path)
        log.debug("Full path to the model: {0}".format(full_path))
        data = self.request.body.decode()
        log.debug("Model data to be saved: {0}".format(data))
        if os.path.exists(full_path):
            with open(full_path, 'w') as f:
                f.write(data)
            log.debug("Saved the model: {0}".format(full_path.split('/').pop().split('.')[0]))
        else:
            self.set_status(404)
            error = {"Reason":"Model Not Found","Message":"Could not find the model file: {0}".format(model_path)}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class RunModelAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running a model from the model editor.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Run the model with a 5 second timeout.  Results are sent to the 
        client as a JSON object.

        Attributes
        ----------
        '''
        run_cmd = self.get_query_argument(name="cmd")
        outfile = self.get_query_argument(name="outfile")
        model_path = self.get_query_argument(name="path")
        log.debug("Run command sent to the script: {0}".format(run_cmd))
        log.debug("Path to the model: {0}".format(model_path))
        self.set_header('Content-Type', 'application/json')
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile = str(uuid.uuid4()).replace("-", "_")
        log.debug("Temporary outfile: {0}".format(outfile))
        exec_cmd = ['/stochss/stochss/handlers/util/run_model.py', '{0}'.format(model_path), '{}.tmp'.format(outfile)] # Script commands for read run_cmd
        exec_cmd.append(''.join(['--', run_cmd]))
        log.debug("Exec command sent to the subprocess: {0}".format(exec_cmd))
        resp = {"Running":False,"Outfile":outfile,"Results":""}
        if(run_cmd == "start"):
            pipe = subprocess.Popen(exec_cmd)
            resp['Running'] = True
            log.debug("Response to the start command: {0}".format(resp))
            self.write(resp)
        else:
            pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
            results, error = pipe.communicate()
            log.debug("Results for the model preview: {0}".format(results))
            log.error("Errors thrown by the subprocess: {0}".format(error))
            # Send data back to client
            if results:
                resp['Results'] = json.loads(results)
                if 'errors' in resp['Results'].keys():
                    self.set_status(406)
            else:
                resp['Running'] = True
            log.debug("Response to the read command: {0}".format(resp))
            self.write(resp)
        self.finish()


class ModelExistsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for checking if a model already exists.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Check if the model already exists.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        file_path = os.path.join(workdir, self.get_query_argument(name="path"))
        log.debug("Path to the file: %s", file_path)
        resp = {"exists":os.path.exists(file_path)}
        log.debug("Response: %s", resp)
        self.write(resp)
        self.finish()

        
