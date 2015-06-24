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
import tempfile
import time
import logging
import traceback
from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobConfig

from db_models.stochoptim_job import StochOptimJobWrapper

import status

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
            msgs.append(" * Parameter(s) [{0}] must be simple numbers".format(", ".join(exprParameters)))

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

        if returnParameterToIndexMap:
            return os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind]), parameterNameToIndex
        else:
            return os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind])


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

            job = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(),
                              data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                if data["resource"] == "local":
                    # This function takes full responsibility for writing responses out to the world. This is probably a bad design mechanism
                    result = self.runLocal(data)
                else:
                    # cloud
                    result = self.runCloud(data=data)

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

        elif reqType == 'stopJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

            if job.user_id == self.user.user_id():
                if job.resource.lower() in backendservices.SUPPORTED_CLOUD_RESOURCES:
                    try:
                        logging.info("Stopping StochOptim poll task pid={0}".format(job.pollProcessPID))
                        os.kill(job.pollProcessPID, signal.SIGTERM)
                    except Exception as e:
                        logging.error("StochOptimPage.post.stopJob(): exception during kill process: {0}".format(e))
                    success = job.stop(self)
                    if not success:
                        return self.response.write(json.dumps({
                            'status': False,
                            'msg': 'Could not stop the job '+job.name +'. Unexpected error.'
                        }))
                else:
                    job.stop(self)
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return
        elif reqType == 'delJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

            if job.user_id == self.user.user_id():
                job.delete(self)
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return
        elif reqType == 'getDataLocal':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.name + "_")
                
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

    def addWeightColumnIfNecessary(self, string):
        data = list(csv.reader(StringIO.StringIO(string), delimiter='\t'))

        if 'weight' == data[0][2].strip().lower():
            return string
        else:
            data[0].insert(2, 'Weight')

            for row in data[1:]:
                row.insert(2, '1')

            output = []

            for row in data:
                output.append("\t".join(row))

            return os.linesep.join(output)

    def runLocal(self, data):
        '''
        '''
        modelDb = StochKitModelWrapper.get_by_id(data["modelID"])

        berniemodel = StochOptimModel()

        success, msgs = berniemodel.fromStochKitModel(modelDb.createStochKitModel())

        if not success:
            raise Exception(msgs)

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = StochOptimJobWrapper()
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = dataDir
        job.modelName = modelDb.name
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
        mdf.write(self.addWeightColumnIfNecessary(jFileData["data"]))
        mdf.close()
        data["model_data_file"] = model_data_file

        model_initial_data_file = tempfile.mktemp(prefix = 'dataFile', suffix = '.txt', dir = dataDir)
        midf = open(model_initial_data_file, 'w')
        iFileData = fileserver.FileManager.getFile(self, data["initialDataID"], noFile = False)
        midf.write(self.addWeightColumnIfNecessary(iFileData["data"]))
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

        exstring = '{0}/backend/wrapper.py {1}/stdout {1}/stderr {1}/return_code {2}'.format(basedir, dataDir, cmd)

        handle = subprocess.Popen(exstring, shell=True, preexec_fn=os.setsid)
        
        job.pid = handle.pid

        job.put()
        
        return job

    def runCloud(self, data):
        modelDb = StochKitModelWrapper.get_by_id(data["modelID"])

        berniemodel = StochOptimModel()

        success, msgs = berniemodel.fromStochKitModel(modelDb.createStochKitModel())

        if not success:
            raise Exception(msgs)

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = StochOptimJobWrapper()
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = data["jobName"]
        job.indata = json.dumps(data)
        job.modelName = modelDb.name
        job.outData = dataDir
        job.status = "Pending"

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

        job.put()

        cloud_params = {
            "job_id" : job.key().id(),
            "job_type": "mcem2",
            # "cores": data["cores"],
            "paramstring": cmd,
            "model_file": stringModel,
            "model_data": {
                "content": self.addWeightColumnIfNecessary(iFileData["data"]),
                "extension": "txt"
            },
            "final_data": {
                "content": self.addWeightColumnIfNecessary(jFileData["data"]),
                "extension": "txt"
            },
            "key_prefix": self.user.user_id(),
            "credentials": self.user_data.getCredentials(),
            "bucketname": self.user_data.getBucketName()
        }

        # # execute cloud task
        try:
            service = backend.backendservice.backendservices(self.user_data)
            cloud_result = service.submit_cloud_task(params=cloud_params)
            
            if not cloud_result["success"]:
                raise Exception(cloud_result["reason"])
                
            job.cloudDatabaseID = cloud_result["db_id"]
            job.resource = cloud_result['resource']
            job.celeryPID = cloud_result["celery_pid"]
            job.pollProcessPID = int(cloud_result["poll_process_pid"])
            # job.pid = handle.pid
            job.put()
        except Exception as e:
            job.delete(self)

            raise e

        return job


class StochOptimVisualization(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self, queryType = None, jobID = None):
        
        logging.info("JobID: {0}".format(jobID));
        
        jobID = int(jobID)

        output = { "jobID" : jobID }

        if queryType == None:
            self.render_response('stochoptimvisualization.html', **output)
            return

        optimization = StochOptimJobWrapper.get_by_id(jobID)

        service = backend.backendservice.backendservices(self.user_data)

        result = status.getJobStatus(service, 0, optimization)

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
        output["status"] = result["status"]
        output["jobName"] = optimization.name
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
    
    def __fetch_cloud_output(self, job_wrapper):
        result = {}

        try:
            service = backend.backendservice.backendservices(self.user_data)
            # check if the outputURL is empty, if so, update it from the DB
            if job_wrapper.outputURL is None:
                logging.debug("stochoptim.outputURL is None")


                task_status = service.describeTasks(job_wrapper)
                logging.debug("job_status = task_status[job.cloudDatabaseID={0}] = {1}".format(
                                                            job_wrapper.cloudDatabaseID, task_status))
                job_status = task_status[job_wrapper.cloudDatabaseID]
                logging.debug("job_status = {0}".format(job_status))
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

        except Exception as e:
            logging.info('StochOptim: Failed to fetch the remote files. {0}'.format(e))
            result['status']=False
            result['msg'] = "Failed to fetch the remote files."
        return result

