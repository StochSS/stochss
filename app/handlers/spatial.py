from stochssapp import BaseHandler
from modeleditor import ModelManager, StochKitModelWrapper
import stochss
import pprint
import exportimport

from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobConfig

import mesheditor

from google.appengine.ext import db

import copy
import fileserver
import json
import os, sys
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
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))
from s3_helper import *

class SpatialJobWrapper(db.Model):
    FLEX_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.FLEX)
    EC2_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.EC2)
    SUPPORTED_CLOUD_RESOURCES = [EC2_CLOUD_RESOURCE, FLEX_CLOUD_RESOURCE]

    # These are all the attributes of a job we use for local storage
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    cloud_id = db.StringProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty() # This is a reference to the model. I should probably use a modelId instead. I'm not sure why I store it as a name
    indata = db.TextProperty() # This is a dump of the json data sent from the html/js that was used to start the job. We save it
    outData = db.StringProperty() # THis is a path to the output data on the filesystem
    status = db.StringProperty()
    zipFileName = db.StringProperty() # This is a temporary file that the server uses to store a zipped up copy of the output
    vtkFileName = db.StringProperty()
    csvFileName = db.StringProperty()

    # These are the cloud attributes
    resource = db.StringProperty()
    uuid = db.StringProperty()
    output_url = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    exception_message = db.StringProperty()
    output_stored = db.StringProperty()

    # More attributes can obvs. be added
    # The delete operator here is a little fancy. When the item gets deleted from the GOogle db, we need to go clean up files stored locally and remotely
    def delete(self, credentials=None):
        service = backendservices()
        
        if self.zipFileName:
            if os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        if self.vtkFileName:
            if os.path.exists(self.vtkFileName):
                os.remove(self.vtkFileName)

        self.stop(credentials=credentials)        
        #service.deleteTaskLocal([self.pid])
        super(SpatialJobWrapper, self).delete()
        
        #delete the local output
        output_path = os.path.join(os.path.dirname(__file__), '../output/')

        if self.uuid:
            if os.path.exists(str(output_path) + self.uuid):
                shutil.rmtree(str(output_path) + self.uuid)
        
        if self.resource in SpatialJobWrapper.SUPPORTED_CLOUD_RESOURCES:
            try:
                user_data = db.GqlQuery("SELECT * FROM UserData WHERE ec2_access_key = :1 AND ec2_secret_key = :2",
                                            credentials['AWS_ACCESS_KEY_ID'],
                                            credentials['AWS_SECRET_ACCESS_KEY']
                                        ).get()
                
                bucketname = user_data.S3_bucket_name
                logging.info(bucketname)
                #delete the folder that contains the replay sources
                delete_folder(bucketname, self.cloud_id, credentials['AWS_ACCESS_KEY_ID'], credentials['AWS_SECRET_ACCESS_KEY'])
                logging.info('delete the rerun source folder {1} in bucket {0}'.format(bucketname, self.cloud_id))
                #delete the output tar file
                delete_file(bucketname, 'output/'+self.cloud_id+'.tar', credentials['AWS_ACCESS_KEY_ID'], credentials['AWS_SECRET_ACCESS_KEY'])
                logging.info('delete the output tar file output/{1}.tar in bucket {0}'.format(bucketname, self.cloud_id))
                
                #delete dynamodb entries
                dynamo=boto.connect_dynamodb(aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"], aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])
                table = dynamo.get_table("stochss_cost_analysis")
                results = table.scan(scan_filter={'uuid' :condition.EQ(self.cloud_id)})
                for result in results:
                    result.delete()
                    
            except:
                raise Exception('fail to delete cloud output or rerun sources.')
        else:
            raise Exception('Job Resource {0} not supported!'.format(self.resource))
        

    # Stop the job!
    def stop(self, credentials=None):
        if self.status == "Running":
            if self.resource.lower() == "local":
                try:
                    os.killpg(int(self.pid), signal.SIGTERM)
                except:
                    pass

            elif self.resource in SpatialJobWrapper.SUPPORTED_CLOUD_RESOURCES:
                service = backendservices()
                stop_params = {
                    'credentials': credentials,
                    'ids': [(self.celeryPID, self.cloudDatabaseID)]
                }
                result = service.stopTasks(stop_params)
                if result and result[self.cloudDatabaseID]:
                    final_cloud_result = result[self.cloudDatabaseID]
                    try:
                        self.outputURL = final_cloud_result['output']
                    except KeyError:
                        pass
                    self.status = "Finished"
                    self.put()
                    return True
                else:
                    # Something went wrong
                    logging.info('*' * 80)
                    logging.info(result)
                    logging.info('*' * 80)
                    return False
            else:
                logging.error('Job Resource {0} not supported!'.format(self.resource))
    
    def mark_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        os.system("touch {0}".format(flag_file))
    
    def has_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        return os.path.exists(flag_file)

class SpatialPage(BaseHandler):
    # This tells the big server that a user must be logged in to view this page
    def authentication_required(self):
        return True
    
    def get(self):
        logging.debug('GET self.request.body = {}'.format(self.request.body))
        reqType = self.request.get('reqType')

        if reqType == 'getJobInfo':
            job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))

            if self.user.user_id() != job.userId:
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
                           "name" : job.jobName,
                           "uuid": job.cloud_id,
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

                filename = '{0}/results/result{1}'.format(job.outData, trajectory)
                logging.info('filename = {}'.format(filename))

                with open(filename) as fd:
                    result = pickle.load(fd)
        
                    species = result.model.get_species_map().keys()

                    threeJS = {}
                    #print "exporting ", timeIdx

                    
                    for specie in species:
                        concVals = result.get_species(specie, timeIdx, concentration=True)
                        popVals = result.get_species(specie, timeIdx, concentration=False)

                        minIdx = numpy.argmin(concVals)
                        maxIdx = numpy.argmax(concVals)

                        threeJS[specie] = { "mesh" : json.loads(result.export_to_three_js(specie, timeIdx)),
                                            "max" : int(popVals[maxIdx]),
                                            "min" : int(popVals[minIdx]) }

                self.response.content_type = 'application/json'
                self.response.write(json.dumps( threeJS ))

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

            job = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE userId = :1 AND jobName = :2",
                              self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            if data["resource"] == "local":
                # This function (runLocal) takes full responsibility for writing responses out to the world. This is probably a bad design mechanism
                self.runLocal(data)
                return

            elif data["resource"] == "cloud":
                if self.user_data.valid_flex_cloud_info:
                    logging.info('Valid Flex Cloud Configured: Using it in preference')
                    data['resource'] = '{0}-cloud'.format(AgentTypes.FLEX)
                    result = self.runCloud(data=data, agent_type=AgentTypes.FLEX)
                    self.response.write(json.dumps(result))
                    return

                else:
                    compute_check_params = {
                        "infrastructure": AgentTypes.EC2,
                        "credentials": self.user_data.getCredentials(),
                        "key_prefix": self.user.user_id()
                    }
                    service = backendservices()
                    if self.user_data.valid_credentials and \
                            service.isOneOrMoreComputeNodesRunning(compute_check_params):

                        data['resource'] = '{0}-cloud'.format(AgentTypes.EC2)
                        result = self.runCloud(data=data, agent_type=AgentTypes.EC2)
                        self.response.write(json.dumps(result))
                        return

                    else:
                        result = {'status': False,
                                  'msg': 'You must have at least one active EC2 compute node to run in the EC2 cloud.'}
                        self.response.write(json.dumps(result))
                        return

            else:
                result = {'status':False,
                          'msg':'There was an error processing your request. Job resource selected was invalid!'}
                self.response.write(json.dumps(result))
                return

        elif reqType == 'stopJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = SpatialJobWrapper.get_by_id(jobID)

            if job.userId == self.user.user_id():
                if job.resource in SpatialJobWrapper.SUPPORTED_CLOUD_RESOURCES:
                    if not self.user_data.valid_credentials:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+ job.jobName +'. Invalid credentials.'
                        }))
                    credentials = self.user_data.getCredentials()
                    success = job.stop(credentials={
                        'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                        'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY']
                    })
                    if not success:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+ job.jobName +'. Unexpected error.'
                        }))
                else:
                    job.stop()
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return

        elif reqType == 'delJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = SpatialJobWrapper.get_by_id(jobID)

            if job.userId == self.user.user_id():
                credentials = self.user_data.getCredentials()
                job.delete(credentials={
                        'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                        'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY']
                    })
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return

        elif reqType == 'getDataCloud':
            try:
                jobID = json.loads(self.request.get('id'))
                job = SpatialJobWrapper.get_by_id(int(jobID))

                service = backendservices()
                # Fetch
                service.fetchOutput(job.cloud_id, job.output_url)
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
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.jobName + "_")
                
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
                                                          prefix = job.jobName + "_",
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
                                                          prefix = job.jobName + "_",
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
        try:
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
            job.userId = self.user.user_id()
            job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            job.jobName = data["jobName"]
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
            exstring = '{0}/backend/wrapper.sh {1}/stdout.log {1}/stderr.log {2}'.format(basedir, dataDir, cmd)
            handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
            
            job.pid = int(handle.pid)

            job.put()
            
            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Job launched",
                                            "id" : job.key().id()}))
        except Exception as e:
            traceback.print_exc()
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "{0}".format(e)}))
                                            #"msg" : "{0}: {1}".format(type(e).__name__, e)}))
            return
    
    # This takes in the unserialized JSON object data and runs a model!
    def runCloud(self, data, agent_type):
        logging.info('agent_type = {}'.format(agent_type))
        try:
            # If the seed is negative, this means choose a seed >= 0 randomly
            if int(data['seed']) < 0:
                random.seed()
                data['seed'] = random.randint(0, 2147483647)

            db_credentials = self.user_data.getCredentials()
            # Set the environmental variables 
            os.environ["AWS_ACCESS_KEY_ID"] = db_credentials['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = db_credentials['EC2_SECRET_KEY']

            if os.environ["AWS_ACCESS_KEY_ID"] == '':
                result = {'status':False,'msg':'Access Key not set. Check : Settings > Cloud Computing'}
                return self.response.write(json.dumps(result))

            if os.environ["AWS_SECRET_ACCESS_KEY"] == '':
                result = {'status':False,'msg':'Secret Key not set. Check : Settings > Cloud Computing'}
                return self.response.write(json.dumps(result))
                    ####
            pymodel = self.construct_pyurdme_model(data)
            #logging.info('DATA: {0}'.format(data))
            #####

            cloud_params = {
                "job_type": "spatial",
                "simulation_algorithm" : data['algorithm'],
                "simulation_realizations" : data['realizations'],
                "simulation_seed" : data['seed'],
                "bucketname" : self.user_data.getBucketName(),
                "paramstring" : '',
            }

            cloud_params['document'] = pickle.dumps(pymodel)
            #logging.info('PYURDME: {0}'.format(cloud_params['document']))
            # Set the environmental variables

            ec2_credentials = self.user_data.getCredentials()
            logging.info('ec2_credentials = {}'.format(ec2_credentials))

            os.environ["AWS_ACCESS_KEY_ID"] = ec2_credentials['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = ec2_credentials['EC2_SECRET_KEY']

            service = backendservices()

            if agent_type == AgentTypes.EC2:
                # Send the task to the backend
                cloud_result = service.submit_cloud_task(params=cloud_params, agent_type=agent_type,
                                               ec2_access_key=ec2_credentials['EC2_ACCESS_KEY'],
                                               ec2_secret_key=ec2_credentials['EC2_SECRET_KEY'])

            elif agent_type == AgentTypes.FLEX:
                queue_head_machine = self.user_data.get_flex_queue_head_machine()
                logging.info('queue_head_machine = {}'.format(queue_head_machine))

                flex_credentials = {
                    'flex_db_password': self.user_data.flex_db_password,
                    'flex_queue_head': queue_head_machine,
                }

                # Send the task to the backend
                cloud_result = service.submit_cloud_task(params=cloud_params, agent_type=agent_type,
                                                         flex_credentials=flex_credentials,
                                                         ec2_access_key=ec2_credentials['EC2_ACCESS_KEY'],
                                                         ec2_secret_key=ec2_credentials['EC2_SECRET_KEY'])

            else:
                raise Exception('Invalid agent type!')


            if not cloud_result["success"]:
                e = cloud_result["exception"]
                result = {"status" : False,
                          "msg" : "Cloud execution failed: {0}".format(e)}
                return result
            
            celery_task_id = cloud_result["celery_pid"]
            taskid = cloud_result["db_id"]

            job = SpatialJobWrapper()
            job.type = 'PyURDME Ensemble'
            job.userId = self.user.user_id()
            job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            job.jobName = data["jobName"]
            job.indata = json.dumps(data)
            job.outData = None  # This is where the data should be locally, when we get data from cloud, it must be put here
            job.modelName = pymodel.name
            job.resource = "{0}-cloud".format(agent_type)
            job.cloud_id = taskid
            job.celeryPID = celery_task_id
            job.status = "Running"
            job.output_stored = "True"
            job.put()

            result = {"status" : True,
                      "msg" : "Job launched",
                      "id" : job.key().id()}
            return result

        except Exception as e: 
            traceback.print_exc()
            result = {"status" : False,
                      "msg" : "{0}".format(e)}
                      #"msg" : "{0}: {1}".format(type(e).__name__, e)}))
            return result

