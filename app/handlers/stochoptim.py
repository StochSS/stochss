from stochssapp import BaseHandler

from google.appengine.ext import db
import fileserver
import json
import os
import re
import shlex
import subprocess
import tempfile
import time

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class StochOptimJobWrapper(db.Model):
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    indata = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()

class StochOptimPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('stochoptim.html')            

    def post(self):
        reqType = self.request.get('reqType')

        if reqType == 'newJob':
            data = json.loads(self.request.get('data'))

            job = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1 AND jobName = :2", self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            job = self.runLocal(data)
            
            self.response.write(json.dumps({"status" : True,
                                            "msg" : "Job launched",
                                            "id" : job.key().id()}))

            print data

        self.response.content_type = 'application/json'
        self.response.write(json.dumps({ 'status' : True,
                                         'msg' : 'Job downloaded'}))
    
    def runLocal(self, data):
        '''
        '''

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        job = StochOptimJobWrapper()
        job.userId = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = dataDir

        job.status = "running"

        # Convert model and write to file
        model_file_file = tempfile.mktemp(suffix = '.R', dir = dataDir)
        #mff = open(model_file_file, 'w')
        #mff.write(job["model_file"])
        #mff.close()
        data["model_file_file"] = model_file_file

        model_data_file = tempfile.mktemp(suffix = '.txt', dir = dataDir)
        mdf = open(model_data_file, 'w')
        jFileData = fileserver.FileManager.getFile(self, data["dataID"], noFile = False)
        mdf.write(jFileData["data"])
        print jFileData["data"]
        mdf.close()
        data["model_data_file"] = model_data_file

        data["exec"] = "'bash &'"

        data["steps"] = ("C" if data["crossEntropyStep"] else "") + ("E" if data["emStep"] else "") + ("U" if data["uncertaintyStep"] else "")

        data["cores"] = 1
        data["options"] = ""

        cmd = "stochoptim/exec/mcem2.r --model {model_file_file} --data {model_data_file} --steps {steps} --seed {seed} --cores {cores} --K.ce {Kce} --K.em {Kem} --K.lik {Klik} --K.cov {Kcov} --rho {rho} --perturb {perturb} --alpha {alpha} --beta {beta} --gamma {gamma} --k {k} --pcutoff {pcutoff} --qcutoff {qcutoff} --numIter {numIter} --numConverge {numConverge} --command {exec} --options '{options}'".format(**data)

        exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, cmd)

        handle = subprocess.Popen(shlex.split(exstring))

        job.pid = handle.pid

        job.put()

        return job
