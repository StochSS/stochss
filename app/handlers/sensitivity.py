import jinja2
import os
import cgi
import datetime
import urllib
import webapp2
import tempfile,sys
from google.appengine.ext import db
import pickle
import threading
import subprocess
import traceback
import logging
from google.appengine.api import users

from stochss.model import *
from stochss.stochkit import *

from stochssapp import BaseHandler

from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobConfig
from backend.storage.s3_storage import S3StorageAgent
from backend.storage.flex_storage import FlexStorageAgent
from backend.databases.flex_db import FlexDB
from backend.databases.dynamo_db import DynamoDB

import time

import modeleditor
import exportimport

import os, shutil
import random

try:
    import json
except ImportError:
    from django.utils import simplejson as json

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))
        
class SensitivityJobWrapper(db.Model):
    FLEX_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.FLEX)
    EC2_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.EC2)
    SUPPORTED_CLOUD_RESOURCES = [FLEX_CLOUD_RESOURCE, EC2_CLOUD_RESOURCE]

    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty()
    indata = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    resource = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    outputURL = db.StringProperty()
    exceptionMessage = db.StringProperty()
    output_stored = db.StringProperty()

    def delete(self, handler):
        logging.debug("SensitivityJobWrapper.delete(cloudDatabaseID={0})".format(self.cloudDatabaseID))
        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)

        if self.zipFileName is not None and os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)
        logging.debug("\tresource={0}".format(self.resource))

        service = backendservices()
        if self.resource == 'Local':
            logging.debug('service.stopTaskLocal([{0}])'.format(self.pid))
            service.stopTaskLocal([self.pid])
            time.sleep(0.25)
            status = service.checkTaskStatusLocal([self.pid]).values()[0]
            logging.debug('status = service.checkTaskStatusLocal([self.pid]).values()[0] = {0}'.format(status))
        else: # cloud
            try:
                user_data = handler.user_data
                if self.resource == self.EC2_CLOUD_RESOURCE:
                    bucketname = user_data.S3_bucket_name
                    logging.info('bucketname = {}'.format(bucketname))
                    ec2_credentials = handler.user_data.getCredentials()
                    # delete the folder that contains the replay sources
                    logging.info('deleting the rerun source folder {1} in bucket {0}'.format(bucketname, self.pid))
                    delete_folder(bucketname, self.pid, ec2_credentials['EC2_ACCESS_KEY'], ec2_credentials['EC2_SECRET_KEY'])
                    # delete the output tar file
                    storage_agent = S3StorageAgent(bucket_name=bucketname,
                                                   ec2_access_key=ec2_credentials['EC2_ACCESS_KEY'],
                                                   ec2_secret_key=ec2_credentials['EC2_SECRET_KEY'])
                    filename = 'output/' + self.cloudDatabaseID + '.tar'
                    logging.info('deleting the output tar file output/{1}.tar in bucket {0}'.format(bucketname, self.pid))
                    storage_agent.delete_file(filename=filename)
                    database = DynamoDB(access_key=ec2_credentials['EC2_ACCESS_KEY'],
                                        secret_key=ec2_credentials['EC2_SECRET_KEY'])
                    service.deleteTasks(taskids=[(self.celeryPID, self.cloudDatabaseID)], database=database)
                    # delete dynamodb entries for cost analysis
                    database.remove_tasks_by_attribute(tablename=JobDatabaseConfig.COST_ANALYSIS_TABLE_NAME,
                                                       attribute_name='uuid', attribute_value=self.pid)
                elif self.resource == self.FLEX_CLOUD_RESOURCE:
                    flex_queue_head_machine = user_data.get_flex_queue_head_machine()
                    # delete the output tar file
                    storage_agent = FlexStorageAgent(queue_head_ip=flex_queue_head_machine['ip'],
                                                     queue_head_username=flex_queue_head_machine['username'],
                                                     queue_head_keyfile=flex_queue_head_machine['keyfile'])
                    filename = self.cloudDatabaseID + '.tar'
                    storage_agent.delete_file(filename=filename)
                    database = FlexDB(password=user_data.flex_db_password, ip=flex_queue_head_machine['ip'])
                    service.deleteTasks(taskids=[(self.celeryPID, self.cloudDatabaseID)], database=database)
                else:
                    logging.error(traceback.format_exc())
                    logging.error("UNKNOWN job.resource = {0}".format(self.resource))
            except Exception as e:
                logging.error(traceback.format_exc())
                logging.error('Error: {}'.format(str(e)))
                raise Exception('fail to delete cloud output or rerun sources.')
        super(SensitivityJobWrapper, self).delete()

class SensitivityPage(BaseHandler):
    """ Render a page that lists the available models. """    
    def get(self):
        self.render_response('sensitivity.html')

    def post(self):       
        reqType = self.request.get('reqType')

        if reqType == "jobInfo":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))
            
            jsonJob = { "id": int(self.request.get('id')),
                        "userId" : job.userId,
                        "jobName" : job.jobName,
                        "startTime" : job.startTime,
                        "indata" : json.loads(job.indata),
                        "outData" : job.outData,
                        "status" : job.status,
                        "resource" : job.resource,
                        "uuid": job.cloudDatabaseID,
                        "output_stored": job.output_stored,
                        "modelName" : job.modelName }
            
            if self.user.user_id() != job.userId:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(["Not the right user"]))

            if job.status == "Finished":
                if job.resource in SensitivityJobWrapper.SUPPORTED_CLOUD_RESOURCES and job.outData is None:
                    # Let the user decide if they want to download it
                    self.response.headers['Content-Type'] = 'application/json'
                    self.response.write(json.dumps({ "status" : "Finished",
                                                     "values" : [],
                                                     "job" : jsonJob}))
                    return
                outputdir = job.outData
                try:
                    # Load all data from file in JSON format
                    vhandle = open(outputdir + '/result/output.txt', 'r')
                    values = { 'time' : [], 'trajectories' : {}, 'sensitivities' : {}, 'parameters' : {}}
                    parameters = []
                    columnToList = []
                    for i, line in enumerate(vhandle):
                        if i == 0:
                            continue
                        elif i == 1:
                            names = line.split()

                            parameterNames = []

                            for name in names:
                                if ':' in name:
                                    specie, parameter = name.split(':')
                                    if parameter not in parameterNames:
                                        parameterNames.append(parameter)
                            
                            for name in names:
                                if name == 'time':
                                    columnToList.append(values['time'])
                                elif ':' in name:
                                    specie, parameter = name.split(':')

                                    if specie not in values['sensitivities']:
                                        values['sensitivities'][specie] = {}

                                    values['sensitivities'][specie][parameter] = [] # Make a new timeseries for sensitivity
                                    columnToList.append(values['sensitivities'][specie][parameter]) # Store a reference here for future use
                                else:
                                    values['trajectories'][name] = [] # start a new timeseries for this name
                                    columnToList.append(values['trajectories'][name]) # Store a reference here for future use
                        elif i == 2:
                            parameters = map(float, line.split())
                        elif i == 3:
                            for storage, value in zip(columnToList, map(float, line.split())):
                                storage.append(value)
                        elif i == 4:
                            continue
                        else:
                            for storage, value in zip(columnToList, map(float, line.split())):
                                storage.append(value)
                    vhandle.close()

                    values['parameters'] = dict(zip(parameterNames, parameters))

                    self.response.headers['Content-Type'] = 'application/json'
                    self.response.write(json.dumps({ "status" : "Finished",
                                                     "values" : values,
                                                     "job" : jsonJob }))
                    return
                except IOError as ioe:
                    logging.error("caught error {0}".format(ioe))
                    job.status = "Failed"
                    logging.error("put job.status = Failed")
                    job.put()
                    
            if job.status == "Failed":
                self.response.headers['Content-Type'] = 'application/json'

                stdout = ''
                stderr = ''
                try:
                    fstdoutHandle = open(job.outData + '/stdout.log', 'r')
                    stdout = fstdoutHandle.read()
                    fstdoutHandle.close()
                    fstderrHandle = open(job.outData + '/stderr.log', 'r')
                    stderr = fstderrHandle.read()
                    fstderrHandle.close()
                except  IOError as ioe:
                    logging.error("could not open error log files in {0}".format(job.outData))

                self.response.write(json.dumps({ "status" : "Failed",
                                                 "stdout" : stdout,
                                                 "stderr" : stderr,
                                                 "job" : jsonJob}))
                return

            # else
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ "status" : "asdfasdf" }))
        elif reqType == "getFromCloud":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))

            service = backendservices()
            service.fetchOutput(job.cloudDatabaseID, job.outputURL)
            # Unpack it to its local output location
            os.system('tar -xf' +job.cloudDatabaseID+'.tar')
            job.outData = os.path.dirname(os.path.abspath(__file__))+'/../output/'+job.cloudDatabaseID
            job.outData = os.path.abspath(job.outData)
            # jsonJob["outData"] = job.outData
            # Clean up
            os.remove(job.cloudDatabaseID+'.tar')
            # Update the db entry
            job.put()
            
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded'}))
            return
        elif reqType == "getLocalData":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))
            
            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.jobName + "_")
                
                job.zipFileName = szip.getFileName()

                szip.addSensitivityJob(job, globalOp = True, ignoreStatus = True)
                
                szip.close()

                # Save the updated status
                job.put()
            
            
            relpath = os.path.relpath(job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return

        elif reqType == "delJob":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))

            if self.user.user_id() != job.userId:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(["Not the right user"]))
                return

            job.delete(self)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ "status" : True,
                                             "msg" : "Job deleted"}));

        elif reqType == "newJob":
            data = json.loads(self.request.get('data'))

            job = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE userId = :1 AND jobName = :2", self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            try:
                # Either local or cloud
                if data["resource"] == "local":
                    job = self.runLocal(data)

                elif data["resource"] == "cloud":
                    backend_service = backendservices()

                    if self.user_data.is_flex_cloud_info_set:
                        self.user_data.update_flex_cloud_machine_info_from_db()
                        flex_queue_head_machine = self.user_data.get_flex_queue_head_machine()

                        if backend_service.is_flex_queue_head_running(flex_queue_head_machine):
                            logging.info('Flex Queue Head is running')
                            data['resource'] = '{0}-cloud'.format(AgentTypes.FLEX)
                            job, cloud_result = self.runCloud(data=data, agent_type=AgentTypes.FLEX)

                        else:
                            return self.response.write(json.dumps({
                                "status": False,
                                "msg": "You must have at least queue head running to run in flex cloud."
                            }))

                    else:

                        compute_check_params = {
                            "infrastructure": AgentTypes.EC2,
                            "credentials": self.user_data.getCredentials(),
                            "key_prefix": self.user.user_id()
                        }
                        if self.user_data.valid_credentials and \
                                backend_service.isOneOrMoreComputeNodesRunning(compute_check_params):

                            data['resource'] = '{0}-cloud'.format(AgentTypes.EC2)
                            job, cloud_result = self.runCloud(data=data, agent_type=AgentTypes.EC2)

                        else:
                            return self.response.write(json.dumps({
                                "status": False,
                                "msg": "You must have at least one active compute node to run in the cloud."
                            }))


                    if not job:
                        e = cloud_result["exception"]
                        self.response.write(json.dumps({"status" : False,
                                                        "msg" : 'Cloud execution failed: '+str(e)}))
                        return

                else:
                    return self.response.write(json.dumps({"status" : False,
                                                           "msg" : "Unrecognized resource requested: {0}".format(data.resource)}))

                self.response.write(json.dumps( { "status" : True,
                                                  "msg" : "Job launched",
                                                  "kind" : job.kind(),
                                                  "id" : job.key().id() }))
            except Exception as e:
                traceback.print_exc()
                self.response.write(json.dumps({ "status" : False,
                                                 "msg" : "Error: {0}".format(e) }))
        else:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "No data submitted"}))
    
    def runLocal(self, data):
        '''
        '''
        job = SensitivityJobWrapper()
        job.resource = "local"
        job.userId = self.user.user_id()
        model = modeleditor.StochKitModelWrapper.get_by_id(data["id"])
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.modelName = model.name
        
        runtime = float(data["time"])
        dt = float(data["increment"])

        job.indata = json.dumps(data)

        path = os.path.abspath(os.path.dirname(__file__))

        parameters = []
        for parameter in data['selections']["pc"]:
            if data['selections']["pc"][parameter]:
                parameters.append(parameter)

        if len(parameters) == 0:
            raise Exception("At least one parameter must be selected");

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job.outData = dataDir

        modelFileName = '{0}/{1}.xml'.format(job.outData, model.name)
        fmodelHandle = open(modelFileName, 'w')

        stochkitmodel = model.createStochKitModel()

        # Wow, what a hack
        if stochkitmodel.units.lower() == 'population':
            document = stochkitmodel.serialize()
            
            stochkitmodel = StochMLDocument.fromString(document).toModel(model.name)
            
            for reactionN in stochkitmodel.getAllReactions():
                reaction = stochkitmodel.getAllReactions()[reactionN]
                if reaction.massaction:
                    if len(reaction.reactants) == 1 and reaction.reactants.values()[0] == 2:
                        reaction.marate.setExpression(reaction.marate.expression + ' / 2')

        fmodelHandle.write(stochkitmodel.serialize())
        fmodelHandle.close()

        job.status = "Pending"

        args = "--sensi -m {0} --parameters {1} -t {2} --out-dir {3} -i {4}".format(modelFileName, " ".join(parameters), runtime, dataDir + '/result', int(runtime / dt))

        ode = "{0}/../../ode/stochkit_ode.py {1}".format(path, args)
        exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, ode)

        handle = subprocess.Popen(exstring.split())
        job.pid = handle.pid

        job.put()
        return job
    
    def runCloud(self, data, agent_type):
        logging.info('agent_type = {}'.format(agent_type))

        job = SensitivityJobWrapper()

        job.resource = "{0}-cloud".format(agent_type)
        job.userId = self.user.user_id()
        model = modeleditor.StochKitModelWrapper.get_by_id(data["id"])
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.status = "Pending"
        job.modelName = model.name

        runtime = float(data["time"])
        dt = float(data["increment"])

        job.indata = json.dumps(data)

        parameters = []
        for parameter in data['selections']["pc"]:
            if data['selections']["pc"][parameter]:
                parameters.append(parameter)
        stochkitmodel = model.createStochKitModel() 

        # Wow, what a hack
        if stochkitmodel.units.lower() == 'population':
            document = stochkitmodel.serialize()
            
            stochkitmodel = StochMLDocument.fromString(document).toModel(model.name)
            
            for reactionN in stochkitmodel.getAllReactions():
                reaction = stochkitmodel.getAllReactions()[reactionN]
                if reaction.massaction:
                    if len(reaction.reactants) == 1 and reaction.reactants.values()[0] == 2:
                        reaction.marate.setExpression(reaction.marate.expression + ' / 2')

        params = {
            "job_type": "sensitivity",
            "document": str( stochkitmodel.serialize() ),
            "paramstring": "stochkit_ode.py --sensi --parameters {0} -t {1} -i {2}".format(
                                " ".join(parameters), runtime, int(runtime / dt)
                            ),
            "bucketname": self.user_data.getBucketName()
        }

        service = backendservices()


        if agent_type == AgentTypes.EC2:
            ec2_credentials = self.user_data.getCredentials()

            # Set the environmental variables
            os.environ["AWS_ACCESS_KEY_ID"] = ec2_credentials['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = ec2_credentials['EC2_SECRET_KEY']
            # Send the task to the backend
            cloud_result = service.submit_cloud_task(params=params, agent_type=agent_type,
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
            cloud_result = service.submit_cloud_task(params=params, agent_type=agent_type,
                                                     flex_credentials=flex_credentials)

        else:
            raise Exception('Invalid agent type!')

        # if not cloud_result["success"]:
        if not cloud_result["success"]:
            return None, cloud_result
            
        job.cloudDatabaseID = cloud_result["db_id"]
        job.celeryPID = cloud_result["celery_pid"]
        job.outData = None
        job.zipFileName = None
        job.output_stored = 'True'
        job.put()
        return job, None
