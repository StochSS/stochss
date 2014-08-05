from stochssapp import BaseHandler
from modeleditor import ModelManager
import stochss
import exportimport
import backend.backendservice

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

class SpatialJobWrapper(db.Model):
    # These are all the attributes of a job we use for local storage
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty() # This is a reference to the model. I should probably use a modelId instead. I'm not sure why I store it as a name
    indata = db.TextProperty() # This is a dump of the json data sent from the html/js that was used to start the job. We save it
    outData = db.StringProperty() # THis is a path to the output data on the filesystem
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    
    # These are the cloud attributes Chris adds
    resource = db.StringProperty()
    outputURL = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()

    # More attributes can obvs. be added

    # The delete operator here is a little fancy. When the item gets deleted from the GOogle db, we need to go clean up files stored locally and remotely
    def delete(self):
        service = backend.backendservice.backendservices()
        
        if self.zipFileName:
            if os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        self.stop()
        
        #service.deleteTaskLocal([self.pid])

        super(StochOptimJobWrapper, self).delete()

    # Stop the job!
    def stop(self, credentials=None):
        if self.status == "Running":
            if self.resource.lower() == "local":
                try:
                    os.killpg(self.pid, signal.SIGTERM)
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
        self.render_response('stochoptim.html')

    def post(self):
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == 'newJob':
            data = json.loads(self.request.get('data'))

            job = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1 AND jobName = :2", self.user.user_id(), data["jobName"].strip()).get()

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
                    result = self.runCloud(data)
                    logging.info("Run cloud finished with result: {0}, generating JSON response".format(result))
                    if not result["success"]:
                        return self.response.write(json.dumps({
                            "status": False,
                            "msg": result["msg"]
                        }))
                    else:
                        return self.response.write(json.dumps({
                            "status": True,
                            "msg": "Job launched",
                            "id": result["job"].key().id()
                        }))
                else:
                    return self.response.write(json.dumps({
                        'status': False,
                        'msg': 'You must have at least one active compute node to run in the cloud.'
                    }))
        elif reqType == 'stopJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

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

            job = StochOptimJobWrapper.get_by_id(jobID)

            if job.userId == self.user.user_id():
                job.delete()
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return
        elif reqType == 'getDataLocal':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.jobName + "_")
                
                job.zipFileName = szip.getFileName()

                szip.addStochOptimJob(job, True)
                
                szip.close()

                # Save the updated status
                job.put()
            
            relpath = '/' + os.path.relpath(job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return


        self.response.write(json.dumps({ 'status' : True,
                                         'msg' : 'Job downloaded'}))
    
    def runLocal(self, data):
        '''
        '''
        json_model_refs = ModelManager.getModel(self, data["id"], modelAsString = False) # data["id"] is the model id of the selected model I think
        
        stochkit_model_obj = json_model_refs["model"]
        mesh_filename = json_model_refs["spatial"]["mesh_filename"]
        if "mesh_subdomain_filename" in json_model_refs["spatial"]:
            mesh_subdomain_filename = json_model_refs["spatial"]["mesh_subdomain_filename"]  # this can be optional

            meshWrapperDb = mesheditor.MeshWrapper.get_by_id(json_model_refs["spatial"]["mesh_wrapper_id"])

            meshFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId)
            subdomainFileObj = fileserver.FileManager.getFile(self, meshWrapperDb.subdomainFileId)

            fhandle = open(meshFileObj["storePath"], 'r')
            fhandle.read()
            fhandle.close()

            fhandle = open(subdomainFileObj["storePath"], 'r')
            fhandle.read()
            fhandle.close()
        else:
            mesh_subdomain_filename = None
        reaction_subdomain_assigments = json_model_refs["spatial"]["reaction_subdomain_assigments"]  #e.g. {'R1':[1,2,3]}
        species_subdomain_assigments = json_model_refs["spatial"]["species_subdomain_assigments"]  #e.g. {'S1':[1,2,3]}
        species_diffusion_coefficients = json_model_refs["spatial"]["species_diffusion_coefficients"] #e.g. {'S1':0.5}
        
        #TODO:  if we get a 'mesh_subdomain_filename' read it in and use model.set_subdomain_vector() to set the subdomain
        
        
        simulation_end_time = data['time']
        simulation_time_increment = data['increment']
        simulation_algorithm = data['algorithm'] # Don't trust this! I haven't implemented the algorithm selection for this yet
        simulation_exec_type = data['exec_type'] # This should contain 'spatial' -- Not that you really need it, only spatial requests will be routed here 
        simulation_realizations = data['realizations']
        simulation_seed = data['seed'] # If this is set to -1, it means choose a seed at random! (Whatever that means)
        
        
        #### Construct the PyURDME object from the Stockkit model and mesh
        #### and other
        
        

        #####

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = StochOptimJobWrapper()
        job.userId = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = dataDir
        job.modelName = model["name"]
        job.resource = "local"

        job.status = "Running"

        # Convert model and write to file
        model_file_file = tempfile.mktemp(prefix = 'modelFile', suffix = '.R', dir = dataDir)
        mff = open(model_file_file, 'w')
        stringModel, nameToIndex = berniemodel.serialize(data["activate"], True)
        job.nameToIndex = json.dumps(nameToIndex)
        mff.write(stringModel)
        mff.close()
        data["model_file_file"] = model_file_file

        model_data_file = tempfile.mktemp(prefix = 'dataFile', suffix = '.txt', dir = dataDir)
        mdf = open(model_data_file, 'w')
        jFileData = fileserver.FileManager.getFile(self, data["trajectoriesID"], noFile = False)
        mdf.write(jFileData["data"])
        mdf.close()
        data["model_data_file"] = model_data_file

        model_initial_data_file = tempfile.mktemp(prefix = 'dataFile', suffix = '.txt', dir = dataDir)
        midf = open(model_initial_data_file, 'w')
        iFileData = fileserver.FileManager.getFile(self, data["initialDataID"], noFile = False)
        midf.write(iFileData["data"])
        midf.close()
        data["model_initial_data_file"] = model_initial_data_file

        data["exec"] = "\"bash&\""

        data["steps"] = ("C" if data["crossEntropyStep"] else "") + ("E" if data["emStep"] else "") + ("U" if data["uncertaintyStep"] else "")

        try:
            import multiprocessing

            data["cores"] = multiprocessing.cpu_count()
        except:
            data["cores"] = 1

        data["options"] = ""
        data["path"] = path

        cmd = "Rscript --vanilla {path}/../../stochoptim/exec/mcem2.r --model {model_file_file} --data {model_initial_data_file} --finalData {model_data_file} --steps {steps} --seed {seed} --cores {cores} --K.ce {Kce} --K.em {Kem} --K.lik {Klik} --K.cov {Kcov} --rho {rho} --perturb {perturb} --alpha {alpha} --beta {beta} --gamma {gamma} --k {k} --pcutoff {pcutoff} --qcutoff {qcutoff} --numIter {numIter} --numConverge {numConverge} --command {exec}".format(**data)

        print cmd

        exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, cmd)

        handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
        
        job.pid = handle.pid

        job.put()
        
        self.response.write(json.dumps({"status" : True,
                                        "msg" : "Job launched",
                                        "id" : job.key().id()}))
    
    # This takes in the unserialized JSON object data and runs a model!
    def runCloud(self, data):
        '''
        '''
        # Load the model up from the db
        model = ModelManager.getModel(self, data["modelID"], modelAsString = False)
        berniemodel = StochOptimModel()
        success, msgs = berniemodel.fromStochKitModel(model["model"])
        result = {
            "success": success
        }
        if not success:
            result["msg"] = os.linesep.join(msgs)
            return result

        # Figure out where in the filesystem we need to store output
        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        # Create a db object to track the running job
        job = StochOptimJobWrapper()
        job.userId = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.indata = json.dumps(data)
        job.modelName = model["name"]
        job.outData = dataDir
        job.status = "Pending"
        job.resource = "cloud"

        # Put together the command line stuff to actually execute the job
        data["exec"] = "'bash'"

        data["steps"] = ("C" if data["crossEntropyStep"] else "") + ("E" if data["emStep"] else "") + ("U" if data["uncertaintyStep"] else "")

        # data["cores"] = 4
        data["options"] = ""

        cmd = "exec/mcem2.r --steps {steps} --seed {seed} --K.ce {Kce} --K.em {Kem} --K.lik {Klik} --K.cov {Kcov} --rho {rho} --perturb {perturb} --alpha {alpha} --beta {beta} --gamma {gamma} --k {k} --pcutoff {pcutoff} --qcutoff {qcutoff} --numIter {numIter} --numConverge {numConverge} --command {exec}".format(**data)
        # cmd = "exec/mcem2.r --K.ce 1000 --K.em 100 --rho .01 --pcutoff .05"
        stringModel, nameToIndex = berniemodel.serialize(data["activate"], True)
        job.nameToIndex = json.dumps(nameToIndex)

        jFileData = fileserver.FileManager.getFile(self, data["trajectoriesID"], noFile = False)
        iFileData = fileserver.FileManager.getFile(self, data["initialDataID"], noFile = False)

        cloud_params = {
            "job_type": "mcem2",
            # "cores": data["cores"],
            "paramstring": cmd,
            "model_file": stringModel,
            "model_data": {
                "content": iFileData["data"],
                "extension": "txt"
            },
            "final_data": {
                "content": jFileData["data"],
                "extension": "txt"
            },
            "key_prefix": self.user.user_id(),
            "credentials": self.user_data.getCredentials(),
            "bucketname": self.user_data.getBucketName()
        }
        # Set the environmental variables 
        os.environ["AWS_ACCESS_KEY_ID"] = self.user_data.getCredentials()['EC2_ACCESS_KEY']
        os.environ["AWS_SECRET_ACCESS_KEY"] = self.user_data.getCredentials()['EC2_SECRET_KEY']
        service = backend.backendservice.backendservices()
        cloud_result = service.executeTask(cloud_params)
        if not cloud_result["success"]:
            result = {
                "success": False,
                "msg": cloud_result["reason"]
            }
            try:
                result["exception"] = cloud_result["exception"]
                result["traceback"] = cloud_result["traceback"]
            except KeyError:
                pass
            return result

        # Update the db object a little and return
        job.cloudDatabaseID = cloud_result["db_id"]
        job.celeryPID = cloud_result["celery_pid"]
        # job.pid = handle.pid
        job.put()
        result["job"] = job
        result["id"] = job.key().id()
        return result
