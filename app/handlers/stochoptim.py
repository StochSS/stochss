from stochssapp import BaseHandler
from modeleditor import ModelManager
import stochss
import exportimport
import backend.backendservice

from google.appengine.ext import db

import copy
import fileserver
import json
import sys
import os
import re
import signal
import shlex
import subprocess
import tempfile
import time
import logging

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class StochOptimModel(stochss.model.Model):
    def __init__(self, *args, **kwargs):
        super(StochOptimModel, self).__init__(*args, **kwargs)

        self.units = "population"

    # This function returns a succes integer and a list of error strings which can be passed on to the user
    def fromStochKitModel(self, model):
        msgs = []

        if model.units.lower() == "concentration":
            msgs.append("StochOptimModel cannot be based on a concentration model")
            return False, msgs

        self.annotation = model.annotation
        
        # Species
        # Any species can be converted to StochOptim format
        self.listOfSpecies = copy.deepcopy(model.listOfSpecies)
                
        # Parameters
        # Any parameter can be converted to StochOptim format
        self.listOfParameters = copy.deepcopy(model.listOfParameters)

        exprParameters = []
        for pname in self.listOfParameters:
            if hasattr(self.listOfParameters[pname], 'expression'):
                exprParameters.append(pname)

            #self.listOfParameters[pname].evaluate()
        if(len(exprParameters) > 0):
            msgs.append(" * Parameter(s) [{0}] are expressed in terms of other variables (not valid for StochOptim)".format(", ".join(exprParameters)))

        success = True
        # Reactions
        self.listOfReactions = copy.deepcopy(model.listOfReactions)
        nonMassActionReactions = []
        for rname in self.listOfReactions:
            if self.listOfReactions[rname].massaction == False:
                nonMassActionReactions.append(rname)
                success = False

        if(len(nonMassActionReactions) > 0):
            msgs.append(" * Reaction(s) [{0}] are not mass-action".format(", ".join(nonMassActionReactions)))

        return success, msgs
    
    # Even though this second argument seems weird, it's necessary to interpret the output
    # of the program correctly
    def serialize(self, activate = None, returnParameterToIndexMap = False):
        initialConditionsLine1 = ['Time', 'Rep', 'Weight']
        initialConditionsLine2 = ['0', '1', '1']

        species = self.listOfSpecies.items()
        reactions = self.listOfReactions.items()
        parameters = self.listOfParameters.items()

        initialConditionsLine1.extend([name for name, specie in species])
        initialConditionsLine2.extend([repr(specie.initial_value) for name, specie in species])

        initialConditionsText = os.linesep.join(["\t".join(initialConditionsLine1), "\t".join(initialConditionsLine2)])

        reactionMatrix = []
        productMatrix = []
        for s in species:
            reactionMatrix.append(len(reactions) * [0])
            productMatrix.append(len(reactions) * [0])
        
        for j, (rname, reaction) in enumerate(reactions):
            reactants = dict(reaction.reactants)
            products = dict(reaction.products)
            for i, (sname, specie) in enumerate(species):
                if sname in reactants:
                    reactionMatrix[i][j] = reactants[sname]

                if sname in products:
                    productMatrix[i][j] = products[sname]

        rnu = "r.nu <- rbind("

        for i, row in enumerate(reactionMatrix):
            rnu += "c({0})".format(", ".join([repr(x) for x in row]))
            if i < len(reactionMatrix) - 1:
                rnu += ", "
                
        rnu += ")"

        pnu = "p.nu <- rbind("

        for i, row in enumerate(productMatrix):
            pnu += "c({0})".format(", ".join([repr(x) for x in row]))
            if i < len(productMatrix) - 1:
                pnu += ", "
                
        pnu += ")"

        snames = "s.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, specie in species]))
        rnames = "r.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, reaction in reactions]))

        rparms = "r.parms <- c({0})".format(", ".join([repr(parameter.value) for name, parameter in parameters]))
        rknames = "rk.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, reaction in parameters]))
        
        if activate:
            rconstant = "r.constant <- c({0})".format(", ".join([("FALSE" if activate[name] else "TRUE") for name, parameter in parameters]))
        else:
            rconstant = "r.constant <- c({0})".format(", ".join(["FALSE" for name, parameter in parameters]))
        
        parameterNameToIndex = {}

        for i, (name, parameter) in enumerate(parameters):
            parameterNameToIndex[name] = i

        rkind = "rk.ind <- c({0})".format(", ".join([repr(parameterNameToIndex[reaction.marate.name] + 1) for name, reaction in reactions]))

        print os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind])

        if returnParameterToIndexMap:
            return os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind]), parameterNameToIndex
        else:
            return os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind])

class StochOptimJobWrapper(db.Model):
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty()
    indata = db.TextProperty()
    nameToIndex = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    
    resource = db.StringProperty()
    outputURL = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    pollProcessPID = db.IntegerProperty()

    def delete(self):
        service = backend.backendservice.backendservices()
        
        if self.zipFileName:
            if os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        self.stop()
        #service.deleteTaskLocal([self.pid])

        super(StochOptimJobWrapper, self).delete()

    def stop(self, credentials=None):
        if self.status == "Running" or self.status == "Pending":
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

class StochOptimPage(BaseHandler):
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
                # This function takes full responsibility for writing responses out to the world. This is probably a bad design mechanism
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
                    try:
                        logging.info("KILL TASK {0}".format(job.pollProcessPID))
                        os.kill(job.pollProcessPID, signal.SIGTERM)
                    except Exceptoin as e:
                        logging.error("StochOptimPage.post.stopJob(): exception during kill process: {0}".format(e))
                    if not self.user_data.valid_credentials:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+job.jobName +'. Invalid credentials.'
                        }))
                    credentials = self.user_data.getCredentials()
                    success = job.stop(credentials={
                        'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                        'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY']
                    })
                    if not success:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+job.jobName +'. Unexpected error.'
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
                                             'msg' : 'Job prepared',
                                             'url' : relpath }))
            return


        self.response.write(json.dumps({ 'status' : True,
                                         'msg' : 'Success'}))
    
    def runLocal(self, data):
        '''
        '''
        model = ModelManager.getModel(self, data["modelID"], modelAsString = False)

        berniemodel = StochOptimModel()

        success, msgs = berniemodel.fromStochKitModel(model["model"])

        if not success:
            self.response.content_type = 'application/json'
            self.response.write(json.dumps({"status" : False,
                                            "msg" : msgs }))
            return

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

        exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, cmd)

        handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
        
        job.pid = handle.pid

        job.put()
        
        self.response.write(json.dumps({"status" : True,
                                        "msg" : "Job launched",
                                        "id" : job.key().id()}))
    
    def runCloud(self, data):
        '''
        '''
        model = ModelManager.getModel(self, data["modelID"], modelAsString = False)
        berniemodel = StochOptimModel()
        success, msgs = berniemodel.fromStochKitModel(model["model"])
        result = {
            "success": success
        }
        if not success:
            result["msg"] = os.linesep.join(msgs)
            return result

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = StochOptimJobWrapper()
        job.userId = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.indata = json.dumps(data)
        job.modelName = model["name"]
        job.outData = dataDir
        job.status = "Pending"
        job.resource = "cloud"

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
        cloud_result = service.executeTask(cloud_params, "ec2", os.environ["AWS_ACCESS_KEY_ID"], os.environ["AWS_SECRET_ACCESS_KEY"])
        if not cloud_result["success"]:
            result = {
                "success": False,
                "msg": cloud_result["reason"]
            }
            try:
                result["poll_process_pid"] = cloud_result["poll_process_pid"]
                result["exception"] = cloud_result["exception"]
                result["traceback"] = cloud_result["traceback"]
            except KeyError:
                pass
            return result
        
        job.cloudDatabaseID = cloud_result["db_id"]
        job.celeryPID = cloud_result["celery_pid"]
        job.pollProcessPID = int(cloud_result["poll_process_pid"])
        # job.pid = handle.pid
        job.put()
        result["job"] = job
        result["id"] = job.key().id()
        return result
        

class StochOptimVisualization(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self, queryType = None, jobID = None):
        jobID = int(jobID)

        output = { "jobID" : jobID }

        if queryType == None:
            self.render_response('stochoptimvisualization.html', **output)
            return

        optimization = StochOptimJobWrapper.get_by_id(jobID)
        # Might need to download the cloud data
        if optimization.resource == "cloud":
            if optimization.status == "Finished":
                if optimization.has_final_cloud_data():
                    # Nothing to do here
                    pass
                else:
                    # Download the final data and mark it finished
                    cloud_result = self.__fetch_cloud_output(optimization)
                    if cloud_result["status"]:
                        optimization.mark_final_cloud_data()
                    else:
                        logging.info("Failed to download final output data of {0} with reason {1}".format(
                            optimization.jobName,
                            cloud_result["msg"]
                        ))
            else:
                # Just assume we need to re-download the data...
                cloud_result = self.__fetch_cloud_output(optimization)
                if not cloud_result["status"]:
                    #TODO: Display message to user?
                    logging.info("Failed to download output data of {0} with reason {1}".format(
                        optimization.jobName,
                        cloud_result["msg"]
                    ))

        try:
            fd = os.open("{0}/stdout".format(optimization.outData), os.O_RDONLY)
            f = os.fdopen(fd)
            output["stdout"] = f.read().strip()
            f.close()
        except:
            output["stdout"] = ""

        if len(output["stdout"]) == 0:
            if optimization.status == 'Running':
                output["stdout"] = "(Job running, no output available yet)"
            else:
                output["stdout"] = "(empty)"

        if queryType.lower() == "debug":
            try:
                fd = os.open("{0}/stderr".format(optimization.outData), os.O_RDONLY)
                f = os.fdopen(fd)
                output["stderr"] = f.read().strip()
                f.close()
            except:
                output["stderr"] = ""

            if len(output["stderr"]) == 0:
                output["stderr"] = "(empty)"

#        print optimization.nameToIndex
#        print optimization.indata

        output["nameToIndex"] = json.loads(optimization.nameToIndex)
        output["status"] = optimization.status
        output["jobName"] = optimization.jobName
        output["modelName"] = optimization.modelName
        output["resource"] = optimization.resource
        output["activate"] = json.loads(optimization.indata)["activate"]
            
        self.response.content_type = 'application/json'
        self.response.write(json.dumps(output))
        return

    def post(self, queryType, jobID):
        job = StochOptimJobWrapper.get_by_id(int(jobID))

        data = json.loads(self.request.get('data'));

        #print data
        #print "================================================="
        parameters = data["parameters"]
        modelName = job.modelName
        proposedName = data["proposedName"]
        
        model = ModelManager.getModelByName(self, modelName, modelAsString = False);

        if ModelManager.getModelByName(self, proposedName):
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model name must be unique"}))
            return

        if not model:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model '{0}' does not exist anymore. Possibly deleted".format(modelName) }))
            return

        model["name"] = proposedName

        for parameter in parameters:
            model["model"].getParameter(parameter).value = parameters[parameter]
            model["model"].getParameter(parameter).expression = str(parameters[parameter])

        if ModelManager.createModel(self, model, modelAsString = False):
            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Model created",
                                            "url" : "/modeleditor?model_edited={0}".format(proposedName) }))
            return
        else:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "Model failed to be created, check logs"}))
            return
    
    def __fetch_cloud_output(self, job_wrapper):
        '''
        '''
        try:
            result = {}
            service = backend.backendservice.backendservices()
            # check if the outputURL is empty, if so, update it from the DB
            if job_wrapper.outputURL is None:
                logging.info("stochoptim.outputURL is None")
                # Retrive credentials from the datastore
                if not self.user_data.valid_credentials:
                    return {'status':False,'msg':'Could not retrieve the status of job '+job_wrapper.jobName +'. Invalid credentials.'}
                credentials = self.user_data.getCredentials()
                # Check the status from backend
                taskparams = {
                    'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                    'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
                    'taskids': [job_wrapper.cloudDatabaseID]
                }
                task_status = service.describeTask(taskparams)
                logging.info("job_status = task_status[job.cloudDatabaseID={0}] = {1}".format(job_wrapper.cloudDatabaseID, task_status))
                job_status = task_status[job_wrapper.cloudDatabaseID]
                logging.info("job_status = {0}".format(job_status))
                job_wrapper.outputURL = job_status['output']
            # Grab the remote files
            service.fetchOutput(job_wrapper.cloudDatabaseID, job_wrapper.outputURL)
            # Unpack it to its local output location...
            os.system('tar -xf' +job_wrapper.cloudDatabaseID+'.tar')
            job_wrapper.outData = os.path.abspath(
                os.path.dirname(os.path.abspath(__file__))+'/../output/'+job_wrapper.cloudDatabaseID
            )
            # Clean up
            os.remove(job_wrapper.cloudDatabaseID+'.tar')
            # Save the updated status
            job_wrapper.put()
            result['status']=True
            result['msg'] = "Successfully fetched the remote output files."
        except Exception,e:
            logging.info('************************************* {0}'.format(e))
            result['status']=False
            result['msg'] = "Failed to fetch the remote files."
        return result

