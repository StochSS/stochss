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
from modeleditor import StochKitModelWrapper, ObjectProperty

from backend.backendservice import backendservices

import exportimport

import time

import os, shutil
import random

try:
    import json
except ImportError:
    from django.utils import simplejson as json

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))


class JobWrapper(db.Model):
    """ A wrapper around the Job object """
    # user_id =  db.StringProperty()
    # job_id = db.StringProperty()
    # job_type = db.StringProperty()
    # job = ObjectProperty()

class Job():
    """ Representation of a Job in StochSS. A Job consists of a collection of Tasks. """

    def __init__(self):
        # tasks is a dict where the task_id is key and a task object is the value. 
        self.tasks = {}

class Task():
    """ Representation of a Task in StochSS """

    def __init__(self,task_id = None):
        self.task_id = task_id


class StochKitJobWrapper(db.Model):
    # A reference to the user that owns this job
    user_id =  db.StringProperty()
    name = db.StringProperty()
    # The type if the job {'local', 'cloud'}
    type =  db.StringProperty()
    attributes = ObjectProperty()
    stochkit_job = ObjectProperty()
    startDate = db.StringProperty()

    stdout = db.StringProperty()
    stderr = db.StringProperty()

class JobManager():
    @staticmethod
    def getJobs(handler):
        jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", handler.user.user_id()).fetch(100000)

        output = []

        for job in jobs:
            jsonJob = { "id" : job.key().id(),
                        "name" : job.name,
                        "stdout" : job.stdout,
                        "stderr" : job.stderr,
                        # These are things contained in the stochkit_job object
                        "type" : job.stochkit_job.type,
                        "status" : job.stochkit_job.status,
                        "output_location" : job.stochkit_job.output_location,
                        "zipFileName" : job.stochkit_job.zipFileName,
                        "output_url" : job.stochkit_job.output_url,
                        "final_time" : job.stochkit_job.final_time,
                        "increment" : job.stochkit_job.increment,
                        "realizations" : job.stochkit_job.realizations,
                        "exec_type" : job.stochkit_job.exec_type,
                        "units" : job.stochkit_job.units,
                        "resource" : job.stochkit_job.resource,
                        "store_only_mean" : job.stochkit_job.store_only_mean,
                        "label_column_names" : job.stochkit_job.label_column_names,
                        "create_histogram_data" : job.stochkit_job.create_histogram_data,
                        "epsilon" : job.stochkit_job.epsilon,
                        "threshold" : job.stochkit_job.threshold,
                        "pid" : job.stochkit_job.pid,
                        "result" : job.stochkit_job.result }

            if job.attributes:
                jsonJob.update(job.attributes)

            output.append(jsonJob)

        return output

    @staticmethod
    def getJob(handler, job_id):
        job = StochKitJobWrapper.get_by_id(job_id)

        jsonJob = { "id" : job.key().id(),
                    "name" : job.name,
                    "stdout" : job.stdout,
                    "stderr" : job.stderr,
                    # These are things contained in the stochkit_job object
                    "type" : job.stochkit_job.type,
                    "status" : job.stochkit_job.status,
                    "output_location" : job.stochkit_job.output_location,
                    "zipFileName" : job.stochkit_job.zipFileName,
                    "units" : job.stochkit_job.units,
                    "output_url" : job.stochkit_job.output_url,
                    "final_time" : job.stochkit_job.final_time,
                    "increment" : job.stochkit_job.increment,
                    "realizations" : job.stochkit_job.realizations,
                    "resource" : job.stochkit_job.resource,
                    "exec_type" : job.stochkit_job.exec_type,
                    "store_only_mean" : job.stochkit_job.store_only_mean,
                    "label_column_names" : job.stochkit_job.label_column_names,
                    "create_histogram_data" : job.stochkit_job.create_histogram_data,
                    "epsilon" : job.stochkit_job.epsilon,
                    "threshold" : job.stochkit_job.threshold,
                    "pid" : job.stochkit_job.pid,
                    "result" : job.stochkit_job.result}
        
        if job.attributes:
            jsonJob.update(job.attributes)
            
        return jsonJob

    @staticmethod
    def createJob(handler, job):
        jobWrap = StochKitJobWrapper()
        jobWrap.user_id = handler.user.user_id()
        jobWrap.name = job['name']
        jobWrap.type = job['type']
        
        # This is probably not a good idea...
        jobWrap.stochkit_job = StochKitJob(**job)

        jobWrap.stdout = job['stdout']
        jobWrap.stderr = job['stderr']

        jobWrap.put()

        return jobWrap.key().id()

    @staticmethod
    def deleteJob(handler, job_id):
        job = StochKitJobWrapper.get_by_id(job_id)
        job.delete()

    @staticmethod
    def updateJob(handler, job):
        jobWrap = StochKitJobWrapper.get_by_id(job_id)
        jobWrap.user_id = handler.user.user_id()
        jobWrap.attributes = job
        jobWrap.put()
        
        jsonJob = { "id" : jobWrap.key().id() }
        if job.attributes:
            jsonJob.update(job)

        return jsonJob

class JobBackboneInterface(BaseHandler):
  def get(self):
    req = self.request.path.split('/')[-1]
    
    self.response.content_type = 'application/json'
    
    if req == 'list':
        jobs = JobManager.getJobs(self)

        self.response.write(json.dumps(jobs))
    else:
        job = JobManager.getJob(self, int(req))

        self.response.write(json.dumps(job))

  def post(self):
      jsonJob = json.loads(self.request.body)
      job = JobManager.createJob(self, jsonJob)
      
      #print 'CREATE', job["id"]
      
      self.response.content_type = "application/json"
      self.response.write(json.dumps(job))

  def put(self):
      req = request.uri.split('/')[-1]

      jobId = int(req)
      jsonJob = json.loads(self.request.body)
      job = JobManager.updateJob(self, jsonJob)
      
      print 'UPDATE', req, job["id"]

      self.response.content_type = "application/json"
      self.response.write(json.dumps(job))

  def delete(self):
      job_id = request.uri.split('/')[-1]
      
      print 'DELETE', str(int(job_id))
      
      JobManager.deleteJob(self, int(job_id))
      
      request.setHeader("Content-Type", "application/json")
      self.response.write(json.dumps([]))

class StochKitJob(Job):
    """ Model for a StochKit job. Contains all the parameters associated with the call. """
    
    def __init__(self,name=None, final_time=None, increment=None, realizations=1, exec_type="stochastic",store_only_mean=False, label_column_names=True,create_histogram_data=False, seed=None, epsilon=0.1,threshold = 10, output_url = None, units = None, type = None, status = None, output_location = "", zipFileName = None, **kwargs):
        """ fdsgfhsj """
        
        # Type of the job {'Local','Cloud'}
        self.type = type
        
        # The status of the job. Valid statuses are 'Running', 'Finished', 'Failed'
        self.status = status
        
        # URL to the result (valid after a sucessful execution)
        self.output_location = output_location
        self.output_url = output_url
        self.zipFileName = zipFileName
        # In case of failure
        self.exception_message = ""
        
        # Input parameters
        self.name = name
        self.final_time = final_time
        self.increment = increment
        self.realizations = realizations
        self.exec_type = exec_type
        self.units = units
        
        self.store_only_mean = store_only_mean
        self.label_column_names = label_column_names
        self.create_histogram_data = create_histogram_data
        
        self.epsilon = epsilon
        self.threshold = threshold
        self.resource = "local"

    
        # Status of the Job (Running, Pending, Done)
        status = 'Pending'
        #  Process ID
        self.pid = None
        # Celery Task ID
        self.celery_pid = None
    
        # The result dict returned by the cloud submission
        self.result = None
    
        

class SimulatePage(BaseHandler):
    """ Render a page that lists the available models. """    
    def authentication_required(self):
        return True
    
    def get(self):
        # Query the datastore
        all_models_q = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", self.user.user_id())
        all_models=[]
        for q in all_models_q.run():
            all_models.append({ "name" : q.model.name,
                                "id" : q.key().id(),
                                "units" : q.model.units })
    
        context = {'all_models': all_models}
        self.render_response('simulate.html',**context)
    def post(self):
        """ Assemble the input to StochKit2 and submit the job (locally or via cloud). """

        reqType = self.request.get('reqType')

        if reqType == 'getFromCloud':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))

            service = backendservices()
            service.fetchOutput(job.stochkit_job.pid, job.stochkit_job.output_url)
            
            stochkit_job = job.stochkit_job
            # Unpack it to its local output location
            os.system('tar -xf' +stochkit_job.uuid+'.tar')
            stochkit_job.output_location = os.path.abspath(os.path.dirname(__file__))+'/../output/'+stochkit_job.uuid
            stochkit_job.output_location = os.path.abspath(stochkit_job.output_location)
            
            # Clean up
            os.remove(stochkit_job.uuid+'.tar')

            job.stochkit_job.resource = 'local'

            # Save the updated status
            job.put()

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded'}))
            return
        elif reqType == 'getDataLocal':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))
            
            if not job.stochkit_job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.name + "_")
                
                job.stochkit_job.zipFileName = szip.getFileName()

                szip.addStochKitJob(job)
                
                szip.close()

                # Save the updated status
                job.put()
            
            
            relpath = os.path.relpath(job.stochkit_job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return
        elif reqType == 'delJob':
            try:
                job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))
                stochkit_job = job.stochkit_job
            except Exception,e:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : False,
                                                 'msg' : "Could not retrieve job" + int(self.request.get('id'))+ " from the datastore."}))
                return
        
            # TODO: Call the backend to kill and delete the job and all associated files.
            try:
                service = backendservices()

                if stochkit_job.resource == 'Local':
                    service.deleteTaskLocal([stochkit_job.pid])

                    time.sleep(0.25)
                    
                    status = service.checkTaskStatusLocal([stochkit_job.pid]).values()[0]
                    
                    if status:
                        raise Exception("")
                else:
                    db_credentials = self.user_data.getCredentials()
                    os.environ["AWS_ACCESS_KEY_ID"] = db_credentials['EC2_ACCESS_KEY']
                    os.environ["AWS_SECRET_ACCESS_KEY"] = db_credentials['EC2_SECRET_KEY']
                    service.deleteTasks([(stochkit_job.celery_pid,stochkit_job.pid)])
                isdeleted_backend = True
            except Exception,e:
                isdeleted_backend = False
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : False,
                                                 'msg' : "Failed to delete task with PID " + str(stochkit_job.celery_pid) + str(e)}))
                return

            if isdeleted_backend:
                try:
                    if os.path.exists(stochkit_job.output_location):
                        shutil.rmtree(stochkit_job.output_location)
                    job.delete()
                except Exception,e:
                    result = {'status':False,'msg':"Failed to delete job "+job_name+str(e)}
        elif reqType == 'jobInfo':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))

            if self.user.user_id() != job.user_id:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(["Not the right user"]))

            if job.stochkit_job.status == "Finished":
                if job.stochkit_job.resource == 'Cloud':
                    self.response.headers['Content-Type'] = 'application/json'
                    self.response.write(json.dumps({ "status" : "Finished",
                                                     "values" : [],
                                                     "job" : JobManager.getJob(self, job.key().id())}))
                    return
                else:
                    outputdir = job.stochkit_job.output_location
                # Load all data from file in JSON format
                    if job.stochkit_job.exec_type == 'stochastic':
                        outfile = '/result/stats/means.txt'
                        
                        print "outputdir", outputdir
                        
                        vhandle = open(outputdir + outfile, 'r')

                        print outputdir + outfile

                        values = { 'time' : [], 'trajectories' : {} }
                        columnToList = []
                        for i, line in enumerate(vhandle):
                            if i == 0:
                                names = line.split()
                                for name in names:
                                    if name == 'time':
                                        columnToList.append(values['time'])
                                    else:
                                        values['trajectories'][name] = [] # start a new timeseries for this name
                                        columnToList.append(values['trajectories'][name]) # Store a reference here for future use
                            else:
                                for storage, value in zip(columnToList, map(float, line.split())):
                                    storage.append(value)
                        vhandle.close()
                    else:
                        outfile = '/result/output.txt'

                        vhandle = open(outputdir + '/result/output.txt', 'r')
                        values = { 'time' : [], 'trajectories' : {} }
                        columnToList = []
                        for i, line in enumerate(vhandle):
                            if i == 0:
                                continue
                            elif i == 1:
                                names = line.split()
                                for name in names:
                                    if name == 'time':
                                        columnToList.append(values['time'])
                                    else:
                                        values['trajectories'][name] = [] # start a new timeseries for this name
                                        columnToList.append(values['trajectories'][name]) # Store a reference here for future use
                            elif i == 2:
                                for storage, value in zip(columnToList, map(float, line.split())):
                                    storage.append(value)
                            elif i == 3:
                                continue
                            else:
                                for storage, value in zip(columnToList, map(float, line.split())):
                                    storage.append(value)
                        vhandle.close()

                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ "status" : "Finished",
                                                 "values" : values,
                                                 "job" : JobManager.getJob(self, job.key().id())}))
            elif job.stochkit_job.status == "Failed":
                self.response.headers['Content-Type'] = 'application/json'

                fstdoutHandle = open(job.stochkit_job.output_location + '/stdout', 'r')
                stdout = fstdoutHandle.read()
                fstdoutHandle.close()

                fstderrHandle = open(job.stochkit_job.output_location + '/stderr', 'r')
                stderr = fstderrHandle.read()
                fstderrHandle.close()

                self.response.write(json.dumps({ "status" : "Failed",
                                                 "job" : JobManager.getJob(self, job.key().id()),
                                                 "stdout" : stdout,
                                                 "stderr" : stderr}))
            else:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ "status" : "asdfasfdfdsa" }))
        else:
            # Params is a dict that constains all response elements of the form
            params = json.loads(self.request.get('data'))

            self.response.headers['Content-Type'] = 'application/json'
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(), params["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            # Create a stochhkit_job instance
            if params['resource'] == "local":
                result=self.runStochKitLocal(params)
            elif params['resource'] == 'cloud':
                if self.user_data.valid_credentials and self.isOneOrMoreComputeNodesRunning(self.user_data.getCredentials()):
                    result=self.runCloud(params)
                else:
                    result = { 'status': False, 'msg': 'You must have at least one active compute node to run in the cloud.' }
            else:
                result={'status':False,'msg':'There was an error processing your request.'}

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))

    def isOneOrMoreComputeNodesRunning(self, credentials):
        '''
        Checks for the existence of running compute nodes. Only need one running compute node
        to be able to run a job in the cloud.
        '''
        try:
            service = backendservices()
            params = {
                "infrastructure": "ec2",
                "credentials": credentials
            }
            all_vms = service.describeMachines(params)
            if all_vms == None:
                return False
            # Just need one running vm
            for vm in all_vms:
                if vm != None and vm['state'] == 'running':
                    return True
            return False
        except:
            return False

    def runCloud(self, params):
        
        try:
            model = StochKitModelWrapper.get_by_id(params["id"]).model

            if not model:
                return {'status':False,'msg':'Failed to retrive the model to simulate.'}

            db_credentials = self.user_data.getCredentials()
            # Set the environmental variables 
            os.environ["AWS_ACCESS_KEY_ID"] = db_credentials['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = db_credentials['EC2_SECRET_KEY']

            if os.environ["AWS_ACCESS_KEY_ID"] == '':
                result = {'status':False,'msg':'Access Key not set. Check : Settings > Cloud Computing'}
                return result

            if os.environ["AWS_SECRET_ACCESS_KEY"] == '':
                result = {'status':False,'msg':'Secret Key not set. Check : Settings > Cloud Computing'}
                return result
        
            #the parameter dictionary to be passed to the backend
            param = {}

            # Execute as concentration or population?
            exec_type = params['execType']

            if not (exec_type == "deterministic" or exec_type == "stochastic"):
                result = {
                     'status' : False, 'msg' : 'exec_type must be concentration or population. Try refreshing page, or e-mail developers'
                      }
                return result

            if model.units.lower() == 'concentration' and exec_type.lower() == 'stochastic':
                result = { 'status' : False, 'msg' : 'GUI Error: Concentration models cannot be executed Stochastically. Try leaving and returning to this page' }
                return result

            executable = exec_type.lower()
            document = model.serialize()

            if executable == 'deterministic' and model.units.lower() == 'population':
                model = StochMLDocument.fromString(document).toModel(model.name)

                for reactionN in model.getAllReactions():
                    reaction = model.getAllReactions()[reactionN]
                    if reaction.massaction:
                        if len(reaction.reactants) == 1 and reaction.reactants.values()[0] == 2:
                            reaction.marate.setExpression(reaction.marate.expression + ' / 2')
            
            document = model.serialize()

            params['document']=str(document)
            filepath = ""
            params['file'] = filepath
            ensemblename = params['jobName']
            stime = params['time']
            realizations = params['realizations']
            increment = params['increment']
            seed = params['seed']

            # Assemble the argument list
            args = ''
            args+=' -t '
            args+=str(stime)
            num_output_points = str(int(float(stime)/float(increment)))
            args+=' -i ' + str(num_output_points)
            path = os.path.dirname(__file__)

            # Algorithm, SSA or Tau-leaping?
            if executable != 'deterministic':
                params['job_type'] = 'stochkit'
                executable = params['algorithm']

                args+=' --realizations '
                args+=str(realizations)
            
                # We keep all the trajectories by default. The user can select to only store means and variance
                # through the advanced options.
                if not "only-moments" in params:
                    args+=' --keep-trajectories'
            
                if "keep-histograms" in params:
                    args+=' --keep-histograms'
                        
                args+=' --seed '
                args+=str(seed)
            else:
                params['job_type'] = 'stochkit_ode'
                executable = "stochkit_ode.py"

            print executable
    
            # Columns need to be labeled for visulatization page to work.  
            args += ' --label'
        
            cmd = executable+' '+args
        
            params['paramstring'] = cmd

            bucketname = self.user_data.getBucketName()
            params['bucketname'] = bucketname         
        
            # Call backendservices and execute StochKit
            service = backendservices()
            celery_task_id, taskid = service.executeTask(params)
            
            if celery_task_id == None:
                result = {'status':False,'msg':'Cloud execution failed. '}
                return result
            # Create a StochKitJob instance
            stochkit_job = StochKitJob(name = ensemblename, final_time = stime, realizations = realizations, increment = increment, seed = seed, exec_type = exec_type, units = model.units.lower())
        
        
            stochkit_job.resource = 'Cloud'
            stochkit_job.type = 'StochKit2 Ensemble'
            
            # The jobs pid is the DB/S3 ID.
            stochkit_job.pid = taskid
            # The celery_pid is the Celery Task ID.
            stochkit_job.celery_pid = celery_task_id
            stochkit_job.status = 'Running'
            stochkit_job.output_location = 'output/%s' % taskid
            stochkit_job.stdout = stochkit_job.output_location + '/stdout.log'
            stochkit_job.stderr = stochkit_job.output_location + '/stderr.log'
        
            # Create a wrapper to store the Job description in the datastore
            stochkit_job_db = StochKitJobWrapper()
            stochkit_job_db.startDate = time.strftime("%Y-%m-%d-%H-%M-%S")
            stochkit_job_db.user_id = self.user.user_id()
            stochkit_job_db.name = stochkit_job.name
            stochkit_job_db.stochkit_job = stochkit_job
            stochkit_job_db.put()
            result = {'status':True,'msg':'Job submitted sucessfully.'}
                
        except Exception,e:
            result = {'status':False,'msg':'Cloud execution failed: '+str(e)}       
        return result
        
  
    
    def runStochKitLocal(self, params):
        """ Submit a local StochKit job """
        try:
            model = StochKitModelWrapper.get_by_id(params["id"])

            if not model:
                return {'status':False,'msg':'Failed to retrive the model to simulate.'}

            model = model.model

            # Execute as concentration or population?
            execType = params['execType']

            if not (execType == "deterministic" or execType == "stochastic" or execType == "sensitivity"):
                result = {
                    'status' : False, 'msg' : 'exec_type must be deterministic, sensitivity, or stochastic. Try refreshing page, or e-mail developers'
                    }
                return result

            if model.units.lower() == 'concentration' and execType.lower() == 'stochastic':
                result = { 'status' : False, 'msg' : 'GUI Error: Concentration models cannot be executed Stochastically. Try leaving and returning to this page' }
                return result

            executable = execType.lower()

            # Assemble the argument list
            args = ''
            args += ' -t {0} '.format(params['time'])
            num_output_points = int(float(params['time'])/float(params['increment']))
            args += ' -i {0} '.format(num_output_points)
            path = os.path.abspath(os.path.dirname(__file__))
            # Algorithm, SSA or Tau-leaping?
            if params['execType'] != 'deterministic':
                executable = "{0}/../../StochKit/{1}".format(path, params['algorithm'])

                args += ' --realizations {0} '.format(params['realizations'])
                args+=' --seed {0} '.format(params['seed'])
            else:
                executable = "{0}/../../ode/stochkit_ode.py".format(path)

            # Columns need to be labeled for visulatization page to work.  
            args += ' --label'

            cmd = executable + ' ' + args

            basedir = path + '/../'
            dataDir = tempfile.mkdtemp(dir = basedir + 'output')

            # Wow, what a hack
            if executable == 'deterministic' and model.units.lower() == 'population':
                document = model.serialize()

                model = StochMLDocument.fromString(document).toModel(model.name)

                for reactionN in model.getAllReactions():
                    reaction = model.getAllReactions()[reactionN]
                    if reaction.massaction:
                        if len(reaction.reactants) == 1 and reaction.reactants.values()[0] == 2:
                            reaction.marate.setExpression(reaction.marate.expression + ' / 2')

            modelFileName = '{0}/{1}.xml'.format(dataDir, model.name)
            fmodelHandle = open(modelFileName, 'w')
            fmodelHandle.write(model.serialize())
            fmodelHandle.close()

            cmd += ' -m {0} --out-dir {1}/result'.format(modelFileName, dataDir)

            print cmd

            #ode = "{0}/../../ode/stochkit_ode.py {1}".format(path, args)
            exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, cmd)

            handle = subprocess.Popen(exstring.split())

            # Create a StochKitJob instance
            stochkit_job = StochKitJob(name = params['jobName'], final_time = params['time'], realizations = params['realizations'], increment = params['increment'], seed = params['seed'], exec_type = params['execType'], units = model.units.lower())
            
        
            stochkit_job.resource = 'Local'
            stochkit_job.type = 'StochKit2 Ensemble'
                    
            stochkit_job.pid = handle.pid
            stochkit_job.output_location = dataDir
            # stochkit_job.uuid = res['uuid']
            stochkit_job.status = 'Running'
            stochkit_job.stdout = '{0}/stdout'.format(dataDir)
            stochkit_job.stderr = '{0}/stderr'.format(dataDir)
            
            # Create a wrapper to store the Job description in the datastore
            stochkit_job_db = StochKitJobWrapper()
            stochkit_job_db.user_id = self.user.user_id()
            stochkit_job_db.startDate = time.strftime("%Y-%m-%d-%H-%M-%S")
            stochkit_job_db.name = stochkit_job.name
            stochkit_job_db.stochkit_job = stochkit_job
            stochkit_job_db.stdout = stochkit_job.stdout
            stochkit_job_db.stderr = stochkit_job.stderr
            stochkit_job_db.put()
    
            result = {'status':True,'msg':'Job submitted sucessfully'}
            
        except None:#Exception,e:
            raise e
        #result = {'status':False,'msg':'Local execution failed: '+str(e)}
                
        return result
