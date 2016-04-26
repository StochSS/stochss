from stochssapp import BaseHandler
from modeleditor import ModelManager, StochKitModelWrapper
import stochss
import exportimport
import backend.backendservice

from google.appengine.ext import db

import copy
import csv
import StringIO
import fileserver
import json
import sys
import os
import re
import signal
import pprint
import shlex
import shutil
import subprocess
import pickle
import tempfile
import time
import logging
import traceback
from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobConfig

import mesheditor

import molns

from db_models.parameter_sweep_job import ParameterSweepJobWrapper

import status
logging.getLogger().setLevel(logging.DEBUG)

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class ParameterSweepPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('parameter_sweep.html', **{ 'initialData' : json.dumps(ModelManager.getModels(self)) })

    def post(self):
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == 'newJob':
            data = json.loads(self.request.get('data'))

            job = db.GqlQuery("SELECT * FROM ParameterSweepJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(),
                              data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                result = self.runMolns(data = data)

                return self.response.write(json.dumps({
                    "status": True,
                    "msg": "Job launched",
                    "id": result.key().id()
                }))
            except Exception as e:
                logging.exception(e)
                result = {'status':False,
                          'msg':'Error: {0}'.format(e)}
                self.response.write(json.dumps(result))
                return
        elif reqType == 'delJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = ParameterSweepJobWrapper.get_by_id(jobID)

            if job.user_id == self.user.user_id():
                job.delete(self)
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return

        elif reqType == 'getDataCloud':
            try:
                jobID = json.loads(self.request.get('id'))
                job = ParameterSweepJobWrapper.get_by_id(int(jobID))

                molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()

                if not molnsConfigDb:
                    return

                molnsConfig = molns.MOLNSConfig(config_dir = molnsConfigDb.folder)
                try:
                    log = molns.MOLNSExec.job_logs([job.molnsPID], molnsConfig)
                    with open(os.path.join(job.outData, 'stdout'), 'w') as f:
                        f.write(log['msg'])
                    molns.MOLNSExec.fetch_job_results([job.molnsPID, "results", os.path.join(job.outData, 'results')], molnsConfig)
                    job.output_stored = True
                except (IOError, molns.MOLNSException) as e:
                    logging.info('Could not fetch results: {0}'.format(e))
                


                # Save the updated status
                job.put()
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : True,
                                                 'msg' : 'Job downloaded'}))
                return
            except Exception as e:
                traceback.print_exc()
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Error: {0}".format(e)}))
                return

        elif reqType == 'getDataLocal':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = ParameterSweepJobWrapper.get_by_id(jobID)

            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.name + "_")
                
                job.zipFileName = szip.getFileName()

                szip.addParameterSweepJob(job, True)
                
                szip.close()

                # Save the updated status
                job.put()
            
            relpath = '/' + os.path.relpath(job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job prepared',
                                             'url' : relpath }))
            return


        self.response.write(json.dumps({ 'status' : True,
                                         'msg' : 'Success'}))

    def runMolns(self, data):
        modelDb = StochKitModelWrapper.get_by_id(data["modelID"])

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = ParameterSweepJobWrapper()
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = data["jobName"]
        job.inData = json.dumps(data)
        job.modelName = modelDb.name
        job.outData = dataDir
        job.status = "Pending"
        job.output_stored = False

        # # execute cloud task
        try:
            with open(os.path.join(path, 'parametersweep_template.py'), 'r') as f:
                template = f.read()

            templateData = {
                "name" : modelDb.name,
                "modelType" : modelDb.type,
                "species" : modelDb.species,
                "parameters" : modelDb.parameters,
                "reactions" : modelDb.reactions,
                "speciesSelect" : data['speciesSelect'],
                "maxTime" : data['maxTime'],
                "increment" : data['increment'],
                "trajectories" : data['trajectories'],
                "seed" : data['seed'],
                "parameterA" : data['parameterA'],
                "minValueA" : data['minValueA'],
                "maxValueA" : data['maxValueA'],
                "stepsA" : data['stepsA'],
                "logA" : data['logA'],
                "parameterB" : data['parameterB'],
                "minValueB" : data['minValueB'],
                "maxValueB" : data['maxValueB'],
                "stepsB" : data['stepsB'],
                "logB" : data['logB'],
                "variableCount" : data['variableCount'],
                "isSpatial" : modelDb.isSpatial
            }

            if modelDb.isSpatial:
                try:
                    meshWrapperDb = mesheditor.MeshWrapper.get_by_id(modelDb.spatial["mesh_wrapper_id"])
                except Exception as e:
                    raise Exception("No Mesh file set. Choose one in the Mesh tab of the Model Editor")

                try:
                    meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId, noFile = False)
                    templateData["mesh"] = meshFileObj["data"]
                except IOError as e: 
                    raise Exception("Mesh file inaccessible. Try another mesh")

                templateData['reaction_subdomain_assigments'] = modelDb.spatial["reactions_subdomain_assignments"]
                templateData['species_subdomain_assigments'] = modelDb.spatial["species_subdomain_assignments"]
                templateData['species_diffusion_coefficients'] = modelDb.spatial["species_diffusion_coefficients"]
                templateData['initial_conditions'] = modelDb.spatial["initial_conditions"]
                templateData['subdomains'] = meshWrapperDb.subdomains

            program = os.path.join(dataDir, 'program.py')
            with open(program, 'w') as f:
                jsonString = json.dumps(templateData)
                f.write(template.replace('___JSON_STRING___', jsonString))
            
            molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()
            if not molnsConfigDb:
                raise Exception("Molns not initialized")

            config = molns.MOLNSConfig(config_dir=molnsConfigDb.folder)
            result = molns.MOLNSExec.start_job(['EC2_controller', "python {0}".format(program)], config)

            job.resource = "molns"
            job.molnsPID = result['id']
            job.put()
        except Exception as e:
            job.status='Failed'
            job.delete(self)
            raise

        return job

class ParameterSweepVisualizationPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self, jobID = None):
        
        jobID = int(jobID)

        initialData = {}
        
        jobDb = ParameterSweepJobWrapper.get_by_id(jobID)

        initialData = jobDb.getJSON()

        try:
            with open(os.path.join(jobDb.outData, 'stdout'), 'r') as f:
                initialData['stdout'] = f.read()
        except IOError as e:
            molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()
            initialData['data'] = {}
            if not molnsConfigDb:
                initialData['stdout'] = 'ERROR: could not lookup molnsConfigDb'
            molnsConfig = molns.MOLNSConfig(config_dir = molnsConfigDb.folder)
            #TODO: Check if the molns service is active
            try:
                log = molns.MOLNSExec.job_logs([jobDb.molnsPID], molnsConfig)
                initialData['stdout'] = log['msg']
            except (IOError, molns.MOLNSException) as e:
                initialData['stdout'] = str(e)

                
        if jobDb.output_stored:
            try:
                with open(os.path.join(jobDb.outData, 'results'), 'r') as f:
                    initialData['data'] = pickle.load(f)
            except IOError as e:
                initialData['data'] = {}

        self.render_response('parameter_sweep_visualization.html', **{'initialData' : json.dumps(initialData)})

    def post(self, queryType, jobID):
        job = StochOptimJobWrapper.get_by_id(int(jobID))

        data = json.loads(self.request.get('data'));

        parameters = data["parameters"]
        modelName = job.modelName
        proposedName = data["proposedName"]
        
        model = ModelManager.getModelByName(self, modelName);

        del model["id"]

        if ModelManager.getModelByName(self, proposedName):
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model name must be unique"}))
            return

        if not model:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model '{0}' does not exist anymore. Possibly deleted".format(modelName) }))
            return

        model["name"] = proposedName

        parameterByName = {}
        for parameter in model["parameters"]:
            parameterByName[parameter["name"]] = parameter

        for parameter in parameters:
            parameterByName[parameter]["value"] = str(parameters[parameter])

        if ModelManager.updateModel(self, model):
            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Model created",
                                            "url" : "/modeleditor?model_edited={0}".format(proposedName) }))
            return
        else:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model failed to be created, check logs"}))
            return
    
