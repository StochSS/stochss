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
import parametersweep_qsub

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
        context = self.__get_context()
        self.render_response('parameter_sweep.html', **context)

    def __get_context(self):
        context = {}
        result = {}

        context['resources'] = []
        # Important for UI, do not change key_file_id.
        context['resources'].append(dict(json="{'uuid':0, 'key_file_id':0}", uuid=0, name="Default (local resources)"))
        for resource in self.user_data.get_cluster_node_info():
            resource['json'] = json.dumps(resource)
            resource['name'] = 'Cluster: '+resource['username']+'@'+resource['ip']
            context['resources'].append(resource)
        context['selected'] = self.user_data.get_selected()
        logging.info("context['selected'] = {0}".format(context['selected']))
        context['initialData'] = json.dumps(ModelManager.getModels(self))
        context = dict(result, **context)
        # logging.debug("Parametersweep.py\n" + str(context))
        return context

    def post(self):
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == 'newJob':
            # Run via Molns cloud
            data = json.loads(self.request.get('data'))
            
            self.user_data.set_selected(2)


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
        elif reqType == 'newJobLocal':
            logging.error("*"*80)
            logging.error("parametersweep.newJobLocal")
            logging.error("*"*80)
            data = json.loads(self.request.get('data'))

            self.user_data.set_selected(0)

            job = db.GqlQuery("SELECT * FROM ParameterSweepJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(),
                              data["jobName"].strip()).get()

            if job != None:
                logging.error("parametersweep.newJobLocal: error: Job name must be unique")
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                result = self.runLocal(data = data)

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
        elif reqType == 'newJobQsub':
            logging.error("*"*80)
            logging.error("parametersweep.newJobQsub")
            logging.error("*"*80)
            data = json.loads(self.request.get('data'))

            # cluster_node_info = self.user_data.get_cluster_node_info()[0]
            # files = fileserver.FileManager.getFiles(self, 'clusterKeyFiles')
            # cluster_ssh_key_info = {f['id']: {'id': f['id'], 'keyname': f['path']} for f in files}

            cluster_info = dict()
            received_cluster_info = json.loads(self.request.get('cluster_info'))
            cluster_info['ip_address'] = received_cluster_info['ip']
            cluster_info['username'] = received_cluster_info['username']
            cluster_info['ssh_key'] = fileserver.FileWrapper.get_by_id(received_cluster_info['key_file_id']).storePath

            self.user_data.set_selected(received_cluster_info['uuid'])

            #logging.info("PARAMETER_SWEEP_CLUSTER_INFO = {0}".format(cluster_info))
            #cluster_info = json.loads(self.request.get('cluster_info'))

            job = db.GqlQuery("SELECT * FROM ParameterSweepJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(),
                              data["jobName"].strip()).get()

            if job != None:
                logging.error("parametersweep.newJobQsub: error: Job name must be unique")
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                result = self.runQsub(data=data, cluster_info=cluster_info)

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

    def runLocal(self, data):
        self.user_data.set_selected(0)
        logging.error("*"*80)
        logging.error("parametersweep.runLocal() modelType={0}".format(data['modelType']))
        logging.error("*"*80)
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
        # # execute local task
        try:
            template_filename = 'parametersweep_template_{0}.py'.format(data['modelType'])
            logging.error("parametersweep.runLocal() template_filename={0}".format(template_filename))
            logging.error("*"*80)
            with open(os.path.join(path,template_filename ), 'r') as f:
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
                "isSpatial" : modelDb.isSpatial,
                "isLocal" : True
            }
            if modelDb.isSpatial:
                try:
                    meshWrapperDb = mesheditor.MeshWrapper.get_by_id(modelDb.spatial["mesh_wrapper_id"])
                except Exception as e:
                    logging.exception(e)
                    logging.error("No Mesh file set. Choose one in the Mesh tab of the Model Editor")
                    raise Exception("No Mesh file set. Choose one in the Mesh tab of the Model Editor")
                try:
                    meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId, noFile = False)
                    templateData["mesh"] = meshFileObj["data"]
                except IOError as e:
                    logging.exception(e)
                    logging.error("Mesh file inaccessible. Try another mesh")
                    raise Exception("Mesh file inaccessible. Try another mesh")

                templateData['reaction_subdomain_assignments'] = modelDb.spatial["reactions_subdomain_assignments"]
                templateData['species_subdomain_assignments'] = modelDb.spatial["species_subdomain_assignments"]
                templateData['species_diffusion_coefficients'] = modelDb.spatial["species_diffusion_coefficients"]
                templateData['initial_conditions'] = modelDb.spatial["initial_conditions"]
                templateData['subdomains'] = meshWrapperDb.subdomains

            program = os.path.join(dataDir, 'stochss_parametersweep_program.py')

            with open(program, 'w') as f:
                jsonString = json.dumps(templateData, indent = 4, sort_keys = True)

                # We've got to double escape the strings here cause of how we're substituting the JSON data in a source file
                jsonString = jsonString.replace('\\', '\\\\')

                f.write(template.replace('___JSON_STRING___', jsonString))
            
#?            molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()
#?            if not molnsConfigDb:
#?                raise Exception("Molns not initialized")
#?
#?            config = molns.MOLNSConfig(config_dir=molnsConfigDb.folder)
#?            result = molns.MOLNSExec.start_job(['EC2_controller', "python {0}".format(program)], config)
            cmd = "python {0}".format(program)
            logging.info('parametersweep.runLocal(): cmd={0}'.format(cmd))
            logging.info('*'*80)
            exstring = '{0}/backend/wrapper.py {1}/stdout {1}/stderr {1}/return_code {2}'.format(basedir, dataDir, cmd)
            logging.info('parametersweep.runLocal(): exstring={0}'.format(exstring))
            logging.info('*'*80)
            handle = subprocess.Popen(exstring.split(), preexec_fn=os.setsid)
            job.pid = handle.pid
            logging.info("parametersweep.runLocal() job started pid={0}".format(job.pid))
            logging.info('*'*80)

            job.resource = "local"
            job.put()
        except Exception as e:
            logging.exception(e)
            job.status='Failed'
            job.delete(self)
            raise

        return job

    def runQsub(self, data, cluster_info):
        logging.error("*"*80)
        logging.error("parametersweep.runQsub() modelType={0}".format(data['modelType']))
        logging.error("*"*80)

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

        try:
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
                "isSpatial" : modelDb.isSpatial,
                "isLocal" : True
            }

            if modelDb.isSpatial:
                try:
                    meshWrapperDb = mesheditor.MeshWrapper.get_by_id(modelDb.spatial["mesh_wrapper_id"])
                except Exception as e:
                    logging.exception(e)
                    logging.error("No Mesh file set. Choose one in the Mesh tab of the Model Editor")
                    raise Exception("No Mesh file set. Choose one in the Mesh tab of the Model Editor")
                try:
                    meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId, noFile = False)
                    templateData["mesh"] = meshFileObj["data"]
                except IOError as e:
                    logging.exception(e)
                    logging.error("Mesh file inaccessible. Try another mesh")
                    raise Exception("Mesh file inaccessible. Try another mesh")

                templateData['reaction_subdomain_assignments'] = modelDb.spatial["reactions_subdomain_assignments"]
                templateData['species_subdomain_assignments'] = modelDb.spatial["species_subdomain_assignments"]
                templateData['species_diffusion_coefficients'] = modelDb.spatial["species_diffusion_coefficients"]
                templateData['initial_conditions'] = modelDb.spatial["initial_conditions"]
                templateData['subdomains'] = meshWrapperDb.subdomains

            if data['modelType'] == "stochastic":
                job.qsubHandle = pickle.dumps(parametersweep_qsub.stochastic(templateData, cluster_info))
            elif data['modelType'] == "deterministic":
                job.qsubHandle = pickle.dumps(parametersweep_qsub.deterministic(templateData, cluster_info))
            elif data['modelType'] == "spatial":
                job.qsubHandle = pickle.dumps(parametersweep_qsub.spatial(templateData, cluster_info))
            else:
                raise Exception("Trying to runQsub on unsupported modelType {0}".format(data['modelType']))

            job.resource = "qsub"
            job.put()
        except Exception as e:
            logging.exception(e)
            job.status='Failed'
            job.delete(self)
            raise

        return job

    def runMolns(self, data):
        self.user_data.set_selected(2)
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
            template_filename = 'parametersweep_template_{0}.py'.format(data['modelType'])
            logging.error("parametersweep.runMolns() template_filename={0}".format(template_filename))
            logging.error("*"*80)
            with open(os.path.join(path,template_filename ), 'r') as f:
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
                "isSpatial" : modelDb.isSpatial,
                "isLocal" : False
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

                templateData['reaction_subdomain_assignments'] = modelDb.spatial["reactions_subdomain_assignments"]
                templateData['species_subdomain_assignments'] = modelDb.spatial["species_subdomain_assignments"]
                templateData['species_diffusion_coefficients'] = modelDb.spatial["species_diffusion_coefficients"]
                templateData['initial_conditions'] = modelDb.spatial["initial_conditions"]
                templateData['subdomains'] = meshWrapperDb.subdomains

            program = os.path.join(dataDir, 'program.py')

            with open(program, 'w') as f:
                jsonString = json.dumps(templateData, indent = 4, sort_keys = True)

                # We've got to double escape the strings here cause of how we're substituting the JSON data in a source file
                jsonString = jsonString.replace('\\', '\\\\')

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
        logging.info("ParameterSweepVisualizationPage.get() jobID={0} path={1}".format(jobID, jobDb.outData))

        initialData = jobDb.getJSON()

        if jobDb.resource == 'qsub':
            initialData['stdout'] = ""
            initialData['stderr'] = ""
        else:
            try:
                with open(os.path.join(jobDb.outData, 'stdout'), 'r') as f:
                    initialData['stdout'] = f.read()
                with open(os.path.join(jobDb.outData, 'stderr'), 'r') as f:
                    initialData['stderr'] = f.read()
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
                
        if jobDb.resource == 'local' or jobDb.resource == 'qsub' or jobDb.output_stored:
            try:
                with open(os.path.join(jobDb.outData, 'results'), 'r') as f:
                    initialData['data'] = pickle.load(f)

                initialData['status'] = 'Finished'
            except IOError as e:
                initialData['data'] = {}
        #logging.error('*'*80)
        #logging.error("{0}".format(**{'initialData' : json.dumps(initialData)}))
        #logging.error("{0}".format(initialData))
        #logging.error('*'*80)
        self.render_response('parameter_sweep_visualization.html', **{'initialData' : json.dumps(initialData)})

    def post(self, jobID=None):
        job = ParameterSweepJobWrapper.get_by_id(int(jobID))
        logging.info("ParameterSweepVisualizationPage.post() jobID={0} path={1}".format(jobID, job.outData))

        reqType = self.request.get('reqType')
        if reqType == 'redirectJupyterNotebook':
            try:
                #Check if notebook already exists, if not create one
                notebook_filename = "{0}.ipynb".format(job.name)
                local_path = os.path.relpath(os.path.abspath(job.outData), os.path.abspath(__file__+'/../../../'))
                notebook_file_path =  os.path.abspath(job.outData) + "/" + notebook_filename
                if not os.path.isfile(notebook_file_path):
                    modelType = self.request.get('modelType')
                    if modelType ==  'deterministic':
                        notebook_template_path = os.path.abspath(__file__+'/../../../jupyter_notebook_templates')+"/ParameterSweep_deterministic.ipynb"
                    elif modelType ==  'stochastic':
                        notebook_template_path = os.path.abspath(__file__+'/../../../jupyter_notebook_templates')+"/ParameterSweep_stochastic.ipynb"
                    elif modelType ==  'spatial':
                        notebook_template_path = os.path.abspath(__file__+'/../../../jupyter_notebook_templates')+"/ParameterSweep_spatial.ipynb"
                    else:
                        raise Exception("Error, '{0}' is not a valid modelType".format(modelType))
                    logging.info("Creating {0} from {1}".format(notebook_file_path,notebook_template_path))
                    shutil.copyfile(notebook_template_path, notebook_file_path)

                if self.request.get('hostname') is not None:
                    logging.info('hostname = {0}'.format(self.request.get('hostname')))
                    host = self.request.get('hostname')
                else:
                    logging.info('hostname = localhost (default)')
                    host = 'localhost'
                port = 9999
                proto = 'http'
                #
                # return the url of the notebook
                notebook_url = '{0}://{1}:{2}/notebooks/{3}/{4}'.format(proto,host,port,local_path,notebook_filename)
                self.redirect(notebook_url)
            except Exception as e:
                logging.error("Error in openJupyterNotebook: {0}".format(e))
                self.response.write('Error: {0}'.format(e))
            return
        else:
            self.get(int(jobID))
