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
from stochssapp import StochKitModelWrapper
from stochssapp import ObjectProperty

import time

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
    userId = db.StringProperty()
    model = db.ReferenceProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    indata = db.StringProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()

class SensitivityPage(BaseHandler):
    """ Render a page that lists the available models. """    
    def get(self):
        self.render_response('sensitivity.html')

    def post(self):       
        reqType = self.request.get('reqType')

        if reqType == "jobInfo":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))
            
            jsonJob = { "userId" : job.userId,
                        "jobName" : job.jobName,
                        "startTime" : job.startTime,
                        "indata" : json.loads(job.indata),
                        "outData" : job.outData,
                        "status" : job.status }

            if self.user.user_id() != job.userId:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(["Not the right user"]))

            if job.status == "Finished":
                outputdir = job.outData
                # Load all data from file in JSON format
                vhandle = open(outputdir + '/result/output.txt', 'r')
                values = { 'time' : [], 'trajectories' : {}, 'sensitivities' : {}}
                columnToList = []
                for i, line in enumerate(vhandle):
                    if i == 0:
                        continue
                    elif i == 1:
                        names = line.split()
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
                                                 "job" : jsonJob }))
            elif job.status == "Failed":
                self.response.headers['Content-Type'] = 'application/json'

                fstdoutHandle = open(job.outData + '/stdout', 'r')
                stdout = fstdoutHandle.read()
                fstdoutHandle.close()

                fstderrHandle = open(job.outData + '/stderr', 'r')
                stderr = fstderrHandle.read()
                fstderrHandle.close()

                self.response.write(json.dumps({ "status" : "Failed",
                                                 "stdout" : stdout,
                                                 "stderr" : stderr,
                                                 "job" : jsonJob}))
            else:
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ "status" : "asdfasdf" }))
        elif reqType == "getLocalData":
            job = SensitivityJobWrapper.get_by_id(int(self.request.get('id')))
            
            if not job.zipFileName:
                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = job.jobName + "_")
                
                job.zipFileName = szip.getFileName()

                szip.addSensitivityJob(job)
                
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

            shutil.rmtree(job.outData)

            job.delete()
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

            job = SensitivityJobWrapper()

            job.userId = self.user.user_id()
            job.model = StochKitModelWrapper.get_by_id(data["id"])
            job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            job.jobName = data["jobName"]

            runtime = float(data["time"])
            dt = float(data["increment"])

            job.indata = json.dumps(data)

            path = os.path.abspath(os.path.dirname(__file__))

            parameters = []
            for parameter in data['selections']["pc"]:
                if data['selections']["pc"][parameter]:
                    parameters.append(parameter)

            basedir = path + '/../'
            dataDir = tempfile.mkdtemp(dir = basedir + 'output')

            job.outData = dataDir

            modelFileName = '{0}/{1}.xml'.format(job.outData, job.model.model_name)
            fmodelHandle = open(modelFileName, 'w')
            fmodelHandle.write(job.model.model.serialize())
            fmodelHandle.close()

            job.status = "Pending"

            args = "--sensi -m {0} --parameters {1} -t {2} --out-dir {3} -i {4}".format(modelFileName, " ".join(parameters), runtime, dataDir + '/result', int(runtime / dt))

            ode = "{0}/../../ode/stochkit_ode.py {1}".format(path, args)
            exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, ode)

            handle = subprocess.Popen(exstring.split())
            job.pid = handle.pid

            job.put()

            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Job launched",
                                            "kind" : job.kind(),
                                            "id" : job.key().id()}))
        else:
            self.response.write(json.dumps({"status" : False,
                                            "msg" : "No data submitted"}))
