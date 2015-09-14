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
                if job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
#                    try:
#                        logging.info("Stopping StochOptim poll task pid={0}".format(job.pollProcessPID))
#                        os.kill(job.pollProcessPID, signal.SIGTERM)
#                    except Exception as e:
#                        logging.error("StochOptimPage.post.stopJob(): exception during kill process: {0}".format(e))
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
#            job.pollProcessPID = int(cloud_result["poll_process_pid"])
            # job.pid = handle.pid
            job.put()
        except Exception as e:
            job.status='Failed'
            job.delete(self)
            raise

        return job

