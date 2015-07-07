from stochssapp import BaseHandler
from modeleditor import ModelManager, StochKitModelWrapper
import stochss
import pprint
import exportimport

from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobConfig, JobDatabaseConfig
#from backend.storage.s3_storage import S3StorageAgent
#from backend.storage.flex_storage import FlexStorageAgent
#from backend.databases.flex_db import FlexDB
#from backend.databases.dynamo_db import DynamoDB

import mesheditor

from google.appengine.ext import db

import copy
import fileserver
import json
import h5py
import os
import sys
import re
import signal
import shlex
import subprocess
import tempfile
import time
import logging
import numbers
import random
import zipfile

import pyurdme
import pickle
import numpy
import traceback
import shutil
import boto
from boto.dynamodb import condition
#sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))
#from s3_helper import *
#import s3_helper

import matplotlib.cm

cm = matplotlib.cm.ScalarMappable()

from db_models.spatial_job import SpatialJobWrapper

class SpatialPage(BaseHandler):
    # This tells the big server that a user must be logged in to view this page
    def authentication_required(self):
        return True
    
    def get(self):
        logging.debug('GET self.request.body = {}'.format(self.request.body))
        reqType = self.request.get('reqType')

        if reqType == 'getJobInfo':
            job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))

            if self.user.user_id() != job.user_id:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write({ "status" : False, "msg" : "Not the right user" })

            result = {}
            stdout = ''
            stderr = ''
            complete = ''
            if job.outData is None:
                complete = 'yes'
            else:
                try:
                    fstdoutHandle = open(str(job.outData + '/stdout.log'), 'r')
                    stdout = fstdoutHandle.read()
                    fstdoutHandle.close()
                    fstderrHandle = open(str(job.outData + '/stderr.log'), 'r')
                    stderr = fstderrHandle.read()
                    fstderrHandle.close()
                    if os.path.exists("{0}/results/complete".format(job.outData)):
                        complete = 'yes'
                except IOError as e:
                    traceback.print_exc()
                    result['status'] = False
                    result['msg'] = 'Error running the simulation: stdout/stderr outputs missing.'

            result.update({"id" : int(self.request.get('id')),
                           "jobStatus" : job.status,
                           "complete" : complete,
                           "resource" : job.resource,
                           "modelName" : job.modelName,
                           "outData" : job.outData,
                           "name" : job.name,
                           "uuid": job.cloudDatabaseID,
                           "output_stored": job.output_stored,
                           "stdout" : stdout,
                           "stderr" : stderr,
                           "indata" : json.loads(job.indata) })

            logging.debug("result =\n\n{}".format(pprint.pformat(result)))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
            return

        elif reqType == 'timeData':
            try:
                job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))

                data = json.loads(self.request.get('data'))

                logging.debug("data = {}".format(data))

                trajectory = data["trajectory"]
                timeIdx = data["timeIdx"]                
                resultJS = {}

                #if not job.preprocessed or not os.path.exists(job.preprocessedDir):
                job.preprocess(trajectory)

                indir = job.preprocessedDir
                    
                with open(os.path.join(indir, 'mesh.json') ,'r') as meshfile:
                    mesh = json.load(meshfile)

                f = os.path.join(indir, 'result{0}'.format(trajectory))
                
                with h5py.File(f, 'r') as dataFile:
                    species = dataFile.keys()

                self.response.content_type = 'application/json'
                self.response.write(json.dumps({ "mesh" : mesh, "species" : species }))
            
            except Exception as e:
                traceback.print_exc()
                result = {}
                result['status'] = False
                result['msg'] = 'Error: error fetching results {0}'.format(e)
                self.response.headers['Content-Type'] = 'application/json'

                self.response.write(json.dumps(result))
            return
        
        elif reqType == 'onlyColorRange':
            try:
                job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))
                data = json.loads(self.request.get('data'))
                logging.debug('patial.get(onlyColorRange): data={0}'.format(data))
                trajectory = data["trajectory"]
                sTime= data["timeStart"]
                eTime = data["timeEnd"]
                #TODO: what is the right value here?
                if eTime is None:
                    eTime = 0
                dataType = "population" if "showPopulation" in data and data["showPopulation"] else "concentration"

                resultJS = {}
                data = {}

                if job.preprocessed is None or trajectory not in job.preprocessed or not os.path.exists(job.preprocessedDir):
                    job.preprocess(trajectory)

                f = os.path.join(job.preprocessedDir, 'result{0}'.format(trajectory))

                limits = {}

                logging.debug('Spatial.get(onlyColorRange): sTime={0} eTime={0}'.format(sTime,eTime))

                with h5py.File(f, 'r') as dataFile:
                    dataTmp = {}

                    for specie in dataFile.keys():
                        data2 = dataFile[specie][dataType][sTime:eTime + 1]
                        
                        limits[specie] = { 'min' : dataFile[specie][dataType].attrs['min'],
                                           'max' : dataFile[specie][dataType].attrs['max'] }

                        cm.set_clim(dataFile[specie][dataType].attrs['min'], dataFile[specie][dataType].attrs['max'])
                        rgbas = cm.to_rgba(data2, bytes = True).astype('uint32')

                        rgbas = numpy.left_shift(rgbas[:, :, 0], 16) + numpy.left_shift(rgbas[:, :, 1], 8) + rgbas[:, :, 2]

                        #rgbaInts = numpy.zeros((rgbas.shape[0], rgbas.shape[1]))

                        #for i in range(rgbas.shape[0]):
                        #    for j in range(rgbas.shape[1]):
                        #        rgbaInts[i, j] = int('0x%02x%02x%02x' % tuple(rgbas[i, j][0:3]), 0)

                        dataTmp[specie] = []
                        for i in range(rgbas.shape[0]):
                            dataTmp[specie].append(list(rgbas[i].astype('int')))

                    for i in range(len(dataTmp.values()[0])):
                        data[sTime + i] = {}
                        for specie in dataFile.keys():
                            data[sTime + i][specie] = dataTmp[specie][i]

                self.response.content_type = 'application/json'
                self.response.write(json.dumps( { "colors" : data, "limits" : limits } ))

            except Exception as e:
                traceback.print_exc()
                result = {}
                result['status'] = False
                result['msg'] = 'Error: error fetching results {0}'.format(e)
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(result))

            return
        
        self.render_response('spatial.html')

    def post(self):
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == 'newJob':
            data = json.loads(self.request.get('data'))
            logging.debug('data =\n{}'.format(pprint.pformat(data)))
            job = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                if data["resource"] == "local":
                    result = self.runLocal(data)
                elif data["resource"] == "cloud":
                    result = self.runCloud(data)
                else:
                    raise Exception("Unknown resource {0}".format(data["resource"]))
                self.response.write(json.dumps({"status" : True,
                                                "msg" : "Job launched",
                                                "id" : result.key().id()}))
                return
            except Exception as e:
                logging.exception(e)
                result = {'status':False,
                          'msg':'Error: {0}'.format(e)}
                self.response.write(json.dumps(result))
                return


        elif reqType == 'stopJob':
            jobID = json.loads(self.request.get('id'))
            jobID = int(jobID)
            job = SpatialJobWrapper.get_by_id(jobID)
            try:
                job.stop(self)
            except Exception as e:
                logging.execption(e)
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Error: {0}".format(e)}))
                return

        elif reqType == 'delJob':
            jobID = json.loads(self.request.get('id'))
            jobID = int(jobID)
            job = SpatialJobWrapper.get_by_id(jobID)
            try:
                job.delete(self)
            except Exception as e:
                logging.exception(e)
                self.response.write(json.dumps({"status" : False,
                                                    "msg" : "Error: {0}".format(e)}))
                return

        elif reqType == 'getDataCloud':
            try:
                jobID = json.loads(self.request.get('id'))
                job = SpatialJobWrapper.get_by_id(int(jobID))
                service = backendservices(self.user_data)
                # Fetch
                service.fetchOutput(job)
                # Unpack
                os.system('tar -xf' +job.uuid+'.tar')
                # Record location
                job.outData = os.path.abspath(os.path.dirname(__file__))+'/../output/'+job.uuid
                # Clean up
                os.remove(job.uuid+'.tar')
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
            job = SpatialJobWrapper.get_by_id(jobID)
            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.name + "_")
                job.zipFileName = szip.getFileName()
                szip.addSpatialJob(job, True)
                szip.close()
                # Save the updated status
                job.put()
            relpath = '/' + os.path.relpath(job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return
        elif reqType == 'getVtkLocal':
            def zipdir(path, ziph, prefix):
                # ziph is zipfile handle
                for root, dirs, files in os.walk(path):
                    for file in files:
                        ziph.write(os.path.join(root, file), os.path.join(prefix, os.path.relpath(os.path.join(root, file), path)))

            jobID = json.loads(self.request.get('id'))
            jobID = int(jobID)
            job = SpatialJobWrapper.get_by_id(jobID)
            if not job.vtkFileName:
                try:
                    tmpDir = None
                    indata = json.loads(job.indata)
                    tmpDir = tempfile.mkdtemp(dir = os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'))
                    for trajectory in range(indata["realizations"]):
                        resultFile = open(str(job.outData + '/results/result{0}'.format(trajectory)))
                        result = pickle.load(resultFile)
                        resultFile.close()
                        for specie in result.model.listOfSpecies:
                            result.export_to_vtk(specie, os.path.join(tmpDir, "trajectory_{0}".format(trajectory), "species_{0}".format(specie)))

                    tmpFile = tempfile.NamedTemporaryFile(dir = os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'),
                                                          prefix = job.name + "_",
                                                          suffix = '.zip', delete = False)

                    zipf = zipfile.ZipFile(tmpFile, "w")
                    zipdir(tmpDir, zipf, os.path.basename(tmpFile.name))
                    zipf.close()
                    job.vtkFileName = tmpFile.name
                    tmpFile.close()
                    # Save the updated status
                    job.put()
                finally:
                    if tmpDir and os.path.exists(tmpDir):
                        logging.info("Getting cleaned up")
                        shutil.rmtree(tmpDir)
            
            relpath = '/' + os.path.relpath(job.vtkFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return
        elif reqType == 'getCsvLocal':
            def zipdir(path, ziph, prefix):
                # ziph is zipfile handle
                for root, dirs, files in os.walk(path):
                    for file in files:
                        ziph.write(os.path.join(root, file), os.path.join(prefix, os.path.relpath(os.path.join(root, file), path)))

            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = SpatialJobWrapper.get_by_id(jobID)

            if not job.csvFileName:
                try:
                    tmpDir = None

                    indata = json.loads(job.indata)

                    tmpDir = tempfile.mkdtemp(dir=os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'))

                    for trajectory in range(indata["realizations"]):
                        resultFile = open(str(job.outData + '/results/result{0}'.format(trajectory)))
                        result = pickle.load(resultFile)
                        resultFile.close()

                        result.export_to_csv(os.path.join(tmpDir, "trajectory_{0}".format(trajectory)).encode('ascii', 'ignore'))

                    tmpFile = tempfile.NamedTemporaryFile(dir = os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'),
                                                          prefix = job.name + "_",
                                                          suffix = '.zip', delete = False)

                    zipf = zipfile.ZipFile(tmpFile, "w")
                    zipdir(tmpDir, zipf, os.path.basename(tmpFile.name))
                    zipf.close()

                    job.csvFileName = tmpFile.name
                    
                    tmpFile.close()

                    # Save the updated status
                    job.put()
                finally:
                    if tmpDir and os.path.exists(tmpDir):
                        logging.info("Getting cleaned up")
                        shutil.rmtree(tmpDir)
            
            relpath = '/' + os.path.relpath(job.csvFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return


        self.response.write(json.dumps({ 'status' : False,
                                         'msg' : 'Unknown Error processing request: no handler called'}))
   
    def construct_pyurdme_model(self, data):
        '''
        '''
        json_model_refs = ModelManager.getModel(self, data["id"]) # data["id"] is the model id of the selected model I think

        stochkit_model_obj = StochKitModelWrapper.get_by_id(data["id"]).createStochKitModel()
        #print 'json_model_refs["spatial"]["mesh_wrapper_id"]:', json_model_refs["spatial"]["mesh_wrapper_id"]
        try:
            meshWrapperDb = mesheditor.MeshWrapper.get_by_id(json_model_refs["spatial"]["mesh_wrapper_id"])
        except Exception as e:
            raise Exception("No Mesh file set. Choose one in the Mesh tab of the Model Editor")

        try:
            meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId)
            mesh_filename = meshFileObj["storePath"]
        except IOError as e: 
            #blowup here, need a mesh
            #self.response.write(json.dumps({"status" : False,
            #                                "msg" : "No Mesh file given"}))
            #return
            raise Exception("Mesh file inaccessible. Try another mesh")
            #TODO: if we get advanced options, we don't need a mesh

        reaction_subdomain_assigments = json_model_refs["spatial"]["reactions_subdomain_assignments"]  #e.g. {'R1':[1,2,3]}
        species_subdomain_assigments = json_model_refs["spatial"]["species_subdomain_assignments"]  #e.g. {'S1':[1,2,3]}
        species_diffusion_coefficients = json_model_refs["spatial"]["species_diffusion_coefficients"] #e.g. {'S1':0.5}
        initial_conditions = json_model_refs["spatial"]["initial_conditions"] #e.g.  { ic0 : { type : "place", species : "S0",  x : 5.0, y : 10.0, z : 1.0, count : 5000 }, ic1 : { type : "scatter",species : "S0", subdomain : 1, count : 100 }, ic2 : { type : "distribute",species : "S0", subdomain : 2, count : 100 } }

        for species in stochkit_model_obj.listOfSpecies:
            if species not in species_diffusion_coefficients:
                raise Exception("Species '{0}' does not have a diffusion coefficient set. Please do that in the Species tab of the Model Editor".format(species))
        
        simulation_end_time = data['time']
        simulation_time_increment = data['increment']
        simulation_algorithm = data['algorithm'] # Don't trust this! I haven't implemented the algorithm selection for this yet
        simulation_exec_type = data['execType'] # This should contain 'spatial' -- Not that you really need it, only spatial requests will be routed here 
        simulation_realizations = data['realizations']
        simulation_seed = data['seed'] # If this is set to -1, it means choose a seed at random! (Whatever that means)
        
        #### Construct the PyURDME object from the Stockkit model and mesh and other inputs
        try:
            # model
            pymodel = pyurdme.URDMEModel(name=stochkit_model_obj.name)
            # mesh
            pymodel.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(mesh_filename))
            # timespan
            pymodel.timespan(numpy.arange(0,simulation_end_time+simulation_time_increment, simulation_time_increment))
            # subdomains
            if len(meshWrapperDb.subdomains) > 0:
                pymodel.set_subdomain_vector(numpy.array(meshWrapperDb.subdomains))

            # species
            for s in stochkit_model_obj.listOfSpecies:
                pymodel.add_species(pyurdme.Species(name=s, diffusion_constant=float(species_diffusion_coefficients[s])))
            # species subdomain restriction
            for s, sd_list in species_subdomain_assigments.iteritems():
                spec = pymodel.listOfSpecies[s]
                pymodel.restrict(spec, sd_list)
            # parameters
            for p_name, p in stochkit_model_obj.listOfParameters.iteritems():
                pymodel.add_parameter(pyurdme.Parameter(name=p_name, expression=p.expression))
            # reactions
            for r_name, r in stochkit_model_obj.listOfReactions.iteritems():
                if r.massaction:
                    pymodel.add_reaction(pyurdme.Reaction(name=r_name, reactants=r.reactants, products=r.products, rate=r.marate, massaction=True))
                else:
                    pymodel.add_reaction(pyurdme.Reaction(name=r_name, reactants=r.reactants, products=r.products, propensity_function=r.propensity_function))
            # reaction subdomain restrictions
            for r in reaction_subdomain_assigments:
                pymodel.listOfReactions[r].restrict_to = reaction_subdomain_assigments[r]
            # Initial Conditions
            # initial_conditions = json_model_refs["spatial"]["initial_conditions"] #e.g.  { ic0 : { type : "place", species : "S0",  x : 5.0, y : 10.0, z : 1.0, count : 5000 }, ic1 : { type : "scatter",species : "S0", subdomain : 1, count : 100 }, ic2 : { type : "distribute",species : "S0", subdomain : 2, count : 100 } }
            for ic in initial_conditions:
                spec = pymodel.listOfSpecies[ic['species']]
                if ic['type'] == "place":
                    pymodel.set_initial_condition_place_near({spec:int(ic['count'])}, point=[float(ic['x']),float(ic['y']),float(ic['z'])])
                elif ic['type'] == "scatter":
                    pymodel.set_initial_condition_scatter({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
                elif ic['type'] == "distribute":
                    pymodel.set_initial_condition_distribute_uniformly({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
                else:
                    #self.response.write(json.dumps({"status" : False,
                    #                                "msg" : "Unknown initial condition type {0}".format(ic['type'])}))
                    #return
                    raise Exception("Unknown initial condition type {0}".format(ic['type']))
        except Exception as e:
            raise Exception("Error while assembling the model: {0}".format(e))

        return pymodel

    def runLocal(self, data):
        ''' Run a PyURDME run using local compute recources. '''
        #####
        pymodel = self.construct_pyurdme_model(data)
        #####
        simulation_algorithm = data['algorithm'] # Don't trust this! I haven't implemented the algorithm selection for this yet
        simulation_realizations = data['realizations']

        # If the seed is negative, this means choose a seed >= 0 randomly
        if int(data['seed']) < 0:
            random.seed()
            data['seed'] = random.randint(0, 2147483647)

        simulation_seed = data['seed']
        #####

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = SpatialJobWrapper()
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = dataDir
        job.modelName = pymodel.name
        job.resource = "local"

        job.status = "Running"

        model_file_pkl = "{0}/model_file.pkl".format(dataDir)
        result_dir = "{0}/results/".format(dataDir)
        os.makedirs(result_dir)

        # searilize the model and write it to a file in the data dir
        with open(model_file_pkl, 'w') as fd:
            pickle.dump(pymodel, fd)

        cmd = "{0}/../../pyurdme/pyurdme_wrapper.py {1} {2} {3} {4} {5}".format(path, model_file_pkl, result_dir, simulation_algorithm, simulation_realizations, simulation_seed)
        logging.info("cmd =\n{}".format(cmd))
        exstring = '{0}/backend/wrapper.py {1}/stdout.log {1}/stderr.log {1}/return_code {2}'.format(basedir, dataDir, cmd)
        handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
        
        job.pid = int(handle.pid)
        job.put()
        return job
    
    # This takes in the unserialized JSON object data and runs a model!
    def runCloud(self, data):
        service = backendservices(self.user_data)
        if not service.isOneOrMoreComputeNodesRunning():
            raise Exception('No cloud computing resources found')

        # If the seed is negative, this means choose a seed >= 0 randomly
        if int(data['seed']) < 0:
            random.seed()
            data['seed'] = random.randint(0, 2147483647)

        pymodel = self.construct_pyurdme_model(data)
        #logging.info('DATA: {0}'.format(data))
        #####
        cloud_params = {
            "job_type": "spatial",
            "simulation_algorithm" : data['algorithm'],
            "simulation_realizations" : data['realizations'],
            "simulation_seed" : data['seed'],
#            "bucketname" : self.user_data.getBucketName(),  #implys EC2, should be in backendservices
            "paramstring" : '',
        }

        logging.debug('cloud_params = {}'.format(pprint.pformat(cloud_params)))

        cloud_params['document'] = pickle.dumps(pymodel)
        #logging.debug('PYURDME: {0}'.format(cloud_params['document']))

        # Send the task to the backend
        cloud_result = service.submit_cloud_task(params=cloud_params)

        if not cloud_result["success"]:
            e = cloud_result["exception"]
            raise Exception("Cloud execution failed: {0}".format(e))
        
        celery_task_id = cloud_result["celery_pid"]
        taskid = cloud_result["db_id"]

        job = SpatialJobWrapper()
        job.type = 'PyURDME Ensemble'
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = None  # This is where the data should be locally, when we get data from cloud, it must be put here
        job.modelName = pymodel.name
        job.resource = cloud_result['resource']
        job.cloudDatabaseID = taskid
        job.celeryPID = celery_task_id
        job.status = "Running"
        job.output_stored = "True"
        job.put()

        return job

