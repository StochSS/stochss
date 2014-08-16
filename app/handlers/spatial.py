from stochssapp import BaseHandler
from modeleditor import ModelManager
import stochss
import exportimport
import backend.backendservice

import mesheditor

from google.appengine.ext import db

import copy
import fileserver
import json
import os
import re
import signal
import shlex
import subprocess
import tempfile
import time
import logging

import pyurdme
import pickle
import numpy
import traceback

class SpatialJobWrapper(db.Model):
    # These are all the attributes of a job we use for local storage
    userId = db.StringProperty()
    pid = db.StringProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty() # This is a reference to the model. I should probably use a modelId instead. I'm not sure why I store it as a name
    indata = db.TextProperty() # This is a dump of the json data sent from the html/js that was used to start the job. We save it
    outData = db.StringProperty() # THis is a path to the output data on the filesystem
    status = db.StringProperty()
    zipFileName = db.StringProperty() # This is a temporary file that the server uses to store a zipped up copy of the output
    
    # These are the cloud attributes
    resource = db.StringProperty()
    uuid = db.StringProperty()
    output_url = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    exception_message = db.StringProperty()

    # More attributes can obvs. be added
    # The delete operator here is a little fancy. When the item gets deleted from the GOogle db, we need to go clean up files stored locally and remotely
    def delete(self):
        service = backend.backendservice.backendservices()
        
        if self.zipFileName:
            if os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        self.stop()
        
        #service.deleteTaskLocal([self.pid])

        super(SpatialJobWrapper, self).delete()

    # Stop the job!
    def stop(self, credentials=None):
        if self.status == "Running":
            if self.resource.lower() == "local":
                try:
                    os.killpg(int(self.pid), signal.SIGTERM)
                except:
                    pass
            elif self.resource.lower() == "cloud":
                service = backend.backendservice.backendservices()
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
                    print '**************************************************************************************'
                    print result
                    print '**************************************************************************************'
                    return False
    
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
        reqType = self.request.get('reqType')

        if reqType == 'getJobInfo':
            job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))

            if self.user.user_id() != job.userId:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write({ "status" : False, "msg" : "Not the right user" })

            result = {}
            stdout = ''
            stderr = ''
            if job.outData is not None:
                print job.outData
                try:
                    fstdoutHandle = open(str(job.outData + '/stdout.log'), 'r')
                    stdout = fstdoutHandle.read()
                    fstdoutHandle.close()
                    fstderrHandle = open(str(job.outData + '/stderr.log'), 'r')
                    stderr = fstderrHandle.read()
                    fstderrHandle.close()
                except IOError as e:
                    traceback.print_exc()
                    result['status'] = False
                    result['msg'] = 'Error running the simulation: stdout/stderr outputd missing.'

            result.update({ "id" : int(self.request.get('id')),
                                "jobStatus" : job.status,
                                             "resource" : job.resource,
                                             "modelName" : job.modelName,
                                             "outData" : job.outData,
                                             "name" : job.jobName,
                                             "stdout" : stdout,
                                             "stderr" : stderr,
                                             "indata" : json.loads(job.indata) })

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
            return
        elif reqType == 'timeData':
            try:
                job = SpatialJobWrapper.get_by_id(int(self.request.get('id')))

                data = json.loads(self.request.get('data'))

                trajectory = data["trajectory"]
                timeIdx = data["timeIdx"]

                with open(str(job.outData + '/results/result{0}'.format(trajectory))) as fd:
                    result = pickle.load(fd)
        
                    species = result.model.get_species_map().keys()

                    threeJS = {}
                    print "exporting ", timeIdx
                    for specie in species:
                        threeJS[specie] = result.export_to_three_js(specie, timeIdx)
                        
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

            job = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE userId = :1 AND jobName = :2", self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            if data["resource"] == "local":
                # This function (runLocal) takes full responsibility for writing responses out to the world. This is probably a bad design mechanism
                self.runLocal(data)
                return
            else:
                backend_services = backend.backendservice.backendservices()
                compute_check_params = {
                    "infrastructure": "ec2",
                    "credentials": self.user_data.getCredentials(),
                    "key_prefix": self.user.user_id()
                }
                if self.user_data.valid_credentials and backend_services.isOneOrMoreComputeNodesRunning(compute_check_params):
                    self.runCloud(data)
                    return
                else:
                    self.response.write(json.dumps({
                        'status': False,
                        'msg': 'You must have at least one active compute node to run in the cloud.'
                    }))
                    return
        elif reqType == 'stopJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = SpatialJobWrapper.get_by_id(jobID)

            if job.userId == self.user.user_id():
                if job.resource.lower() == "cloud":
                    if not self.user_data.valid_credentials:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+stochkit_job.name +'. Invalid credentials.'
                        }))
                    credentials = self.user_data.getCredentials()
                    success = job.stop(credentials={
                        'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                        'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY']
                    })
                    if not success:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+stochkit_job.name +'. Unexpected error.'
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
                job.delete()
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return
        elif reqType == 'getDataCloud':
            try:
                jobID = json.loads(self.request.get('id'))
                job = SpatialJobWrapper.get_by_id(int(jobID))

                service = backend.backendservice.backendservices()
                # Fetch
                service.fetchOutput(job.pid, job.output_url)
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


        self.response.write(json.dumps({ 'status' : False,
                                         'msg' : 'Unknown Error processing request: no handler called'}))
   
    def construct_pyurdme_model(self, data):
        '''
        '''
        json_model_refs = ModelManager.getModel(self, data["id"], modelAsString = False) # data["id"] is the model id of the selected model I think
        
        stochkit_model_obj = json_model_refs["model"]
        #print 'json_model_refs["spatial"]["mesh_wrapper_id"]:', json_model_refs["spatial"]["mesh_wrapper_id"]
        meshWrapperDb = mesheditor.MeshWrapper.get_by_id(json_model_refs["spatial"]["mesh_wrapper_id"])

        try:
            meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId)
            mesh_filename = meshFileObj["storePath"]
        except IOError as e: 
            #blowup here, need a mesh
            #self.response.write(json.dumps({"status" : False,
            #                                "msg" : "No Mesh file given"}))
            #return
            raise Exception("No Mesh file given")
            #TODO: if we get advanced options, we don't need a mesh

        try:    
            subdomainFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.subdomainsFileId)
            mesh_subdomain_filename = subdomainFileObj["storePath"]
        except IOError as e:
            mesh_subdomain_filename = None

        reaction_subdomain_assigments = json_model_refs["spatial"]["reactions_subdomain_assignments"]  #e.g. {'R1':[1,2,3]}
        species_subdomain_assigments = json_model_refs["spatial"]["species_subdomain_assignments"]  #e.g. {'S1':[1,2,3]}
        species_diffusion_coefficients = json_model_refs["spatial"]["species_diffusion_coefficients"] #e.g. {'S1':0.5}
        initial_conditions = json_model_refs["spatial"]["initial_conditions"] #e.g.  { ic0 : { type : "place", species : "S0",  x : 5.0, y : 10.0, z : 1.0, count : 5000 }, ic1 : { type : "scatter",species : "S0", subdomain : 1, count : 100 }, ic2 : { type : "distribute",species : "S0", subdomain : 2, count : 100 } }
        
        
        simulation_end_time = data['time']
        simulation_time_increment = data['increment']
        simulation_algorithm = data['algorithm'] # Don't trust this! I haven't implemented the algorithm selection for this yet
        simulation_exec_type = data['execType'] # This should contain 'spatial' -- Not that you really need it, only spatial requests will be routed here 
        simulation_realizations = data['realizations']
        simulation_seed = data['seed'] # If this is set to -1, it means choose a seed at random! (Whatever that means)
        
        #### Construct the PyURDME object from the Stockkit model and mesh and other inputs
        # model
        pymodel = pyurdme.URDMEModel(name=stochkit_model_obj.name)
        # mesh
        pymodel.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(mesh_filename))
        # timespan
        pymodel.timespan(numpy.arange(0,simulation_end_time+simulation_time_increment, simulation_time_increment))
        # subdomains
        if mesh_subdomain_filename is not None:
            #if we get a 'mesh_subdomain_filename' read it in and use model.set_subdomain_vector() to set the subdomain
            try:
                with open(mesh_subdomain_filename) as fd:
                    input_sd = numpy.zeros(len(pymodel.mesh.coordinates()))
                    for line in fd:
                        ndx, val = line.split(',', 2)
                        input_sd[int(ndx)] = int(float((val.strip())))
                    pymodel.set_subdomain_vector(input_sd)
            except IOError as e:
                #self.response.write(json.dumps({"status" : False,
                #                                "msg" : "Mesh subdomain file specified, but file not found: {0}".format(e)}))
                #return
                raise Exception("Mesh subdomain file specified, but file not found: {0}".format(e))
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
        for ic_name, ic in initial_conditions.iteritems():
            spec = pymodel.listOfSpecies[ic['species']]
            if ic['type'] == "place":
                pymodel.self.set_initial_condition_place_near({spec:int(ic['count'])}, point=[float(ic['x']),float(ic['y']),float(ic['z'])])
            elif ic['type'] == "scatter":
                pymodel.set_initial_condition_scatter({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
            elif ic['type'] == "distribute":
                pymodel.set_initial_condition_distribute_uniformly({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
            else:
                #self.response.write(json.dumps({"status" : False,
                #                                "msg" : "Unknown initial condition type {0}".format(ic['type'])}))
                #return
                raise Exception("Unknown initial condition type {0}".format(ic['type']))

        return pymodel

    def runLocal(self, data):
        ''' Run a PyURDME run using local compute recources. '''
        try:
            #####
            pymodel = self.construct_pyurdme_model(data)
            #####
            simulation_algorithm = data['algorithm'] # Don't trust this! I haven't implemented the algorithm selection for this yet
            simulation_realizations = data['realizations']
            simulation_seed = data['seed'] # If this is set to -1, it means choose a seed at random! (Whatever that means)
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
            print cmd
            exstring = '{0}/backend/wrapper.sh {1}/stdout.log {1}/stderr.log {2}'.format(basedir, dataDir, cmd)
            handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
            
            job.pid = str(handle.pid)

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
    def runCloud(self, data):
        '''
        '''
        try:
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

            # Set the environmental variables
            os.environ["AWS_ACCESS_KEY_ID"] = self.user_data.getCredentials()['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = self.user_data.getCredentials()['EC2_SECRET_KEY']
            service = backend.backendservice.backendservices()
            cloud_result = service.executeTask(cloud_params)
            if not cloud_result["success"]:
                e = cloud_result["exception"]
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Cloud execution failed: {0}".format(e)}))
                return
            
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
            job.resource = "cloud"
            job.pid = taskid
            job.celery_pid = celery_task_id
            job.status = "Running"
            job.put()

            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Job launched",
                                            "id" : job.key().id()}))
            return

        except Exception as e: 
            traceback.print_exc()
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "{0}".format(e)}))
                                            #"msg" : "{0}: {1}".format(type(e).__name__, e)}))
            return

