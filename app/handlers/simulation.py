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
import random
import subprocess
import traceback
import logging
import boto
from boto.dynamodb import condition
from google.appengine.api import users

from stochss.model import *
from stochss.stochkit import *

from stochssapp import BaseHandler
from modeleditor import StochKitModelWrapper

import modeleditor

from backend.backendservice import backendservices

from s3_helper import *

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

from db_models.stochkit_job import StochKitJobWrapper


class JobManager():
    @staticmethod
    def getJobs(handler):
        jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", handler.user.user_id()).fetch(100000)

        output = []

        for job in jobs:
            indata = json.loads(job.indata)

            # type, final_time, increment, realizations, exec_type, units, store_only_mean, label_column_names,
            #  create_histogram_data, epsilon, threshold, result

            jsonJob = { "id" : job.key().id(),
                        "name" : job.name,
                        "stdout" : job.stdout,
                        "stderr" : job.stderr,
                        # These are things contained in the stochkit_job object
                        "type" : indata["type"],
                        "status" : job.status,
                        "startTime" : job.startTime,
                        "modelName" : job.modelName,
                        "output_stored": job.output_stored,
                        "output_location" : job.outData,
                        "zipFileName" : job.zipFileName,
                        "output_url" : job.outputURL,
                        "final_time" : indata["final_time"],
                        "increment" : indata["increment"],
                        "realizations" : indata["realizations"],
                        "exec_type" : indata["exec_type"],
                        "units" : indata["units"],
                        "resource" : indata["resource"],
                        "epsilon" : indata["epsilon"],
                        "threshold" : indata["threshold"],
                        "seed" : indata["seed"],
                        "cloudDatabaseID" : job.cloudDatabaseID,
                        "pid" : job.pid,
                        "result" : job.result }

            output.append(jsonJob)

        return output

    @staticmethod
    def getJob(handler, job_id):
        job = StochKitJobWrapper.get_by_id(job_id)
        indata = json.loads(job.indata)
        logging.debug('getJob() job.id = {0} job.indata = {1}'.format(job.key().id(), indata))

        jsonJob = { "id" : job.key().id(),
                    "name" : job.name,
                    "stdout" : job.stdout,
                    "stderr" : job.stderr,
                    # These are things contained in the stochkit_job object
                    "type" : indata["type"],
                    "status" : job.status,
                    "startTime" : job.startTime,
                    "modelName" : job.modelName,
                    "output_stored": job.output_stored,
                    "output_location" : job.outData,
                    "zipFileName" : job.zipFileName,
                    "output_url" : job.outputURL,
                    "final_time" : indata["final_time"],
                    "increment" : indata["increment"],
                    "realizations" : indata["realizations"],
                    "exec_type" : indata["exec_type"],
                    "units" : indata["units"],
                    "resource" : job.resource,
                    "epsilon" : indata["epsilon"],
                    "threshold" : indata["threshold"],
                    "cloudDatabaseID" : job.cloudDatabaseID,
                    "seed" : indata["seed"],
                    "pid" : job.pid,
                    "result" : job.result }
            
        return jsonJob

    @staticmethod
    def createJob(handler, job, rename = None):
        tryName = job["name"]

        userID = None

        if 'user_id' in job:
            userID = job['user_id']
        else:
            userID = handler.user.user_id()

        jobNames = [x.name for x in db.Query(StochKitJobWrapper).filter('user_id =', userID).run()]

        if job["name"] in jobNames:
            if not rename:
                return None
            else:
                i = 1
                tryName = '{0}_{1}'.format(job["name"], i)

                while tryName in jobNames:
                    i = i + 1
                    tryName = '{0}_{1}'.format(job["name"], i)
                    
        if rename:
            job["name"] = tryName

        jobWrap = StochKitJobWrapper()
        jobWrap.user_id = userID
        jobWrap.name = job['name']

        if 'seed' not in job:
            job['seed'] = -1
        
        jobWrap.modelName = job['modelName']
        # This is probably not a good idea...
        jobWrap.indata = json.dumps(dict([(k, job[k]) for k in ['type', 'final_time', 'increment', 'realizations', 'exec_type', 'units', 'epsilon', 'threshold', 'seed'] if k in job]))

        if 'startTime' in job:
            jobWrap.startTime = job['startTime']

        if 'resource' in job:
            jobWrap.resource = job['resource']
        else:
            jobWrap.resource = 'Local'

        jobWrap.outData = job['output_location']

        if 'output_url' in job:
            jobWrap.outputURL = job['output_url']

        jobWrap.stdout = job['stdout']
        jobWrap.stderr = job['stderr']
        if 'output_stored' in job:
            jobWrap.output_stored = job['output_stored']

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
        jobWrap.put()
        
        jsonJob = { "id" : jobWrap.key().id() }

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
      
      self.response.content_type = "application/json"
      self.response.write(json.dumps(job))

  def delete(self):
      job_id = request.uri.split('/')[-1]
      
      JobManager.deleteJob(self, int(job_id))
      
      request.setHeader("Content-Type", "application/json")
      self.response.write(json.dumps([]))


class SimulatePage(BaseHandler):
    """ Render a page that lists the available models. """    
    def authentication_required(self):
        return True
    
    def get(self):
        all_models = []
        # Query the datastore
        for model in modeleditor.ModelManager.getModels(self):
            all_models.append({ "name" : model["name"],
                                "id" : model["id"],
                                "units" : model["units"],
                                "isSpatial" : model["isSpatial"] })
        context = {'all_models': all_models}

        self.render_response('simulate.html',**context)

    def post(self):
        """ Assemble the input to StochKit2 and submit the job (locally or via cloud). """

        reqType = self.request.get('reqType')

        if reqType == 'getFromCloud':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))

            service = backendservices(self.user_data)
            service.fetchOutput(job)
            
            # Unpack it to its local output location
            os.system('tar -xf {0}.tar'.format(job.cloudDatabaseID))
            job.outData = os.path.abspath('{0}/../output/{1}'.format(os.path.abspath(os.path.dirname(__file__)), job.cloudDatabaseID))

            job.stdout = os.path.join(job.outData, '/stdout.log')
            job.stderr = os.path.join(job.outData, '/stderr.log')

            # Clean up
            os.remove('{0}.tar'.format(job.cloudDatabaseID))

            # Save the updated status
            job.put()

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded'}))
            return
        elif reqType == 'getDataLocal':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))

            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.name + "_")
                
                job.zipFileName = szip.getFileName()

                szip.addStochKitJob(job, globalOp = True, ignoreStatus = True)
                
                szip.close()

                # Save the updated status
                job.put()
            
            
            relpath = os.path.relpath(job.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({ 'status' : True,
                                             'msg' : 'Job downloaded',
                                             'url' : relpath }))
            return
        elif reqType == 'delJob':
            try:
                job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))

                if job.user_id == self.user.user_id():
                    job.delete(self)
                    
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : True,
                                                 'msg' : "Job deleted from the datastore."}))
            except Exception as e:
                logging.exception(e)
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : False,
                                                 'msg' : "Error: {0}".format(e) }))

            return
        elif reqType == 'redirectJupyterNotebook':
            try:
                job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))
                #Check if notebook already exists, if not create one
                notebook_filename = "{0}.ipynb".format(job.name)
                local_path = os.path.relpath(os.path.abspath(job.outData), os.path.abspath(__file__+'/../../../'))
                notebook_file_path =  os.path.abspath(job.outData) + "/" + notebook_filename
                notebook_template_path = os.path.abspath(__file__+'/../../../jupyter_notebook_templates')+"/Simulation.ipynb"
                if not os.path.isfile(notebook_file_path):
                    logging.info("Creating {0} from {1}".format(notebook_file_path,notebook_template_path))
                    shutil.copyfile(notebook_template_path, notebook_file_path)


                #TODO remove 'localhost' here, replace with ip used for request
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
        elif reqType == 'jobInfo':
            job = StochKitJobWrapper.get_by_id(int(self.request.get('id')))
            indata = json.loads(job.indata)

            if self.user.user_id() != job.user_id:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(["Not the right user"]))

            if job.status == "Finished":
                try:
                    if (job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.output_stored == 'False') or (job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.outData is None):
                        self.response.headers['Content-Type'] = 'application/json'
                        self.response.write(json.dumps({ "status" : "Finished",
                                                         "values" : [],
                                                         "job" : JobManager.getJob(self, job.key().id())}))
                        return
                    else:
                        outputdir = job.outData
                        # Load all data from file in JSON format
                        if indata['exec_type'] == 'stochastic':
                            tid = self.request.get('tid')

                            if tid != '' and tid != 'mean':
                                outfile = '/result/trajectories/trajectory{0}.txt'.format(tid)

                                vhandle = open(outputdir + outfile, 'r')
                        
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
                                outfile = '/result/stats/means.txt'

                                vhandle = open(outputdir + outfile, 'r')

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
                            values = { 'time' : [], 'trajectories' : {} }

                            #if not os.path.isfile(outputdir + outfile):

                            vhandle = open(outputdir + outfile, 'r')

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
                                    continue
                                elif i == 3:
                                    for storage, value in zip(columnToList, map(float, line.split())):
                                        storage.append(value)
                                elif i == 4:
                                    continue
                                else:
                                    for storage, value in zip(columnToList, map(float, line.split())):
                                        storage.append(value)
                            vhandle.close()

                    self.response.headers['Content-Type'] = 'application/json'
                    result = {"status" : "Finished",
                              "values" : values,
                              "job" : JobManager.getJob(self, job.key().id())}
                    logging.debug("result = \n\n{}".format(result))
                    self.response.write(json.dumps(result))
                    return

                except Exception as e:
                    traceback.print_exc()
                    job.status = "Failed"
                    job.put()
                    logging.error("Failed to parse output data. Assuming job failed and continuing")
            
            if job.status == "Failed":
                self.response.headers['Content-Type'] = 'application/json'

                stdout = ""
                stderr = ""
                
                if job.outData is not None:
                    if os.path.isfile(job.outData + '/stdout'):
                        fstdoutHandle = open(job.outData + '/stdout', 'r')
                    else:
                        fstdoutHandle = open(job.outData + '/stdout.log', 'r')
                    stdout = fstdoutHandle.read()
                    fstdoutHandle.close()

                    if os.path.isfile(job.outData + '/stderr'):
                        fstderrHandle = open(job.outData + '/stderr', 'r')
                    else:
                        fstderrHandle = open(job.outData + '/stderr.log', 'r')
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
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2",
                              self.user.user_id(), params["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return
            
            backend_services = backendservices(self.user_data)

            # Create a stochhkit_job instance
            try:
                if params['resource'] == "local":
                    job = self.runStochKitLocal(params)
                elif params['resource'] == 'cloud':
                    job = self.runCloud(params)
                else:
                    raise Exception("Unknown resource {0}".format(params["resource"]))
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps( { "status" : True,
                                                  "msg" : "Job launched",
                                                  "id" : job.key().id() } ))
            except Exception as e:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps( { "status" : False,
                                                  "msg" : str(e) } ))
    
    def runCloud(self, params):
        model = StochKitModelWrapper.get_by_id(params["id"]).createStochKitModel()

        if not model:
            raise Exception('Failed to retrive the model \'{0}\' to simulate'.format(params["id"]))

        #the parameter dictionary to be passed to the backend
        param = {}

        # Execute as concentration or population?
        exec_type = params['execType'].lower()

        if exec_type not in ["deterministic", "stochastic"]:
            raise Exception('exec_type must be concentration or population. Found \'{0}\''.format(exec_type))

        if model.units.lower() == 'concentration' and exec_type.lower() == 'stochastic':
            raise Exception('Concentration models cannot be executed Stochastically' )

        executable = exec_type.lower()
        document = model.serialize()

        # Wow, what a hack

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

        if int(params['seed']) < 0:
            random.seed()
            params['seed'] = random.randint(0, 2147483647)

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

        # Columns need to be labeled for visulatization page to work.  
        args += ' --label'
        
        cmd = executable+' '+args
        
        params['paramstring'] = cmd
        
        bucketname = self.user_data.getBucketName()
        params['bucketname'] = bucketname  
        
        params['user_id'] = self.user.user_id()       
        
        # Call backendservices and execute StochKit
        service = backendservices(self.user_data)

        cloud_result = service.submit_cloud_task(params)

        if not cloud_result["success"]:
            e = cloud_result["exception"]
            raise Exception('Cloud execution failed: {0}'.format(e))
            
        celery_task_id = cloud_result["celery_pid"]
        taskid = cloud_result["db_id"]

        # Create a StochKitJob instance
        job = StochKitJobWrapper()
        job.resource = cloud_result['resource']
        
        # stochkit_job.uuid = res['uuid']
            
        
        
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = params['jobName']
        job.modelName = model.name
        #job.pid = taskid
        job.celeryPID = celery_task_id
        job.cloudDatabaseID = taskid

        # Create a StochKitJob instance
        job.indata = json.dumps({ "type" : 'StochKit2 Ensemble',
                                  "final_time" : params['time'],
                                  "realizations" : params['realizations'],
                                  "increment" : params['increment'],
                                  "seed" : params['seed'],
                                  "exec_type" : params['execType'],
                                  "units" : model.units.lower(),
                                  "epsilon" : params['epsilon'],
                                  "threshold" : params['threshold'] })

        job.output_stored = 'True'
        job.outData = None
        #job.stdout = '{0}/stdout'.format(dataDir)
        #job.stderr = '{0}/stderr'.format(dataDir)
        job.status = 'Running'
        job.put()

        return job

    def runStochKitLocal(self, params):
        """ Submit a local StochKit job """
        modelDb = StochKitModelWrapper.get_by_id(params["id"])

        if not modelDb:
            return {'status':False,
                    'msg':'Failed to retrive the model to simulate.'}

        model = modelDb.createStochKitModel()

        # Execute as concentration or population?
        execType = params['execType'].lower()
        
        if execType not in ["deterministic", "stochastic", "sensitivity"]:
            raise Exception('exec_type must be deterministic, sensitivity, or stochastic. Found "{0}"'.format(execType))
            
        if model.units.lower() == 'concentration' and execType.lower() == 'stochastic':
            raise Exception('Concentration models cannot be executed stochastically')

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
            args += ' --keep-trajectories '

            if int(params['seed']) < 0:
                random.seed()
                params['seed'] = random.randint(0, 2147483647)

            args += '--seed {0} '.format(params['seed'])
        else:
            executable = "{0}/../../ode/stochkit_ode.py".format(path)

        # Columns need to be labeled for visulatization page to work.  
        args += ' --label'
        
        cmd = executable + ' ' + args
        
        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')
        
        # Wow, what a hack
        if params['execType'] == 'deterministic' and model.units.lower() == 'population':
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

        logging.info("cmd =\n{}".format(cmd))
        logging.debug('simulation.runLocal(): cmd={0}'.format(cmd))
        logging.debug('*'*80)
        logging.debug('*'*80)

        #ode = "{0}/../../ode/stochkit_ode.py {1}".format(path, args)
        exstring = '{0}/backend/wrapper.py {1}/stdout {1}/stderr {1}/return_code {2}'.format(basedir, dataDir, cmd)

        logging.debug('simulation.runLocal(): exstring={0}'.format(exstring))
        logging.debug('*'*80)
        logging.debug('*'*80)
        handle = subprocess.Popen(exstring.split(), preexec_fn=os.setsid)

        # Create a wrapper to store the Job description in the datastore
        job = StochKitJobWrapper()
        job.resource = 'Local'
        
        # stochkit_job.uuid = res['uuid']
            
        
        
        job.user_id = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.name = params['jobName']
        job.modelName = model.name
        job.pid = handle.pid

        # Create a StochKitJob instance
        job.indata = json.dumps( { "type" : 'StochKit2 Ensemble',
                                   "final_time" : params['time'],
                                   "realizations" : params['realizations'],
                                   "increment" : params['increment'],
                                   "seed" : params['seed'],
                                   "exec_type" : params['execType'],
                                   "units" : model.units.lower(),
                                   "epsilon" : params['epsilon'],
                                   "threshold" : params['threshold'] } )

        job.outData = dataDir
        job.stdout = '{0}/stdout'.format(dataDir)
        job.stderr = '{0}/stderr'.format(dataDir)
        job.status = 'Running'
        job.put()
            
        return job
