try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db
import pickle
import traceback
import random
import zipfile
import tempfile
import logging
import time
import shutil
from google.appengine.api import users

from stochssapp import BaseHandler
from stochss.model import *
from stochss.stochkit import *
from stochss.examplemodels import *

import webapp2

class ExportJobWrapper(db.Model):
    userId = db.StringProperty()
    startTime = db.StringProperty()
    status = db.StringProperty()
    outData = db.StringProperty()

class ExportPage(BaseHandler):
    def get(self):

        reqType = self.request.get('action')

        if reqType == 'delJob':
            pass
        elif reqType == 'size':
            def get_size(start_path = '.'):
                # Stolen from http://stackoverflow.com/questions/1392413/calculating-a-directory-size-using-python
                totalSize = 0
                for dirpath, dirnames, filenames in os.walk(start_path):
                    for f in filenames:
                        fp = os.path.join(dirpath, f)
                        totalSize += os.path.getsize(fp)
                return totalSize

            # sizes of models will be trivial so we ignore them
            numberOfFiles = 0
            totalSize = 0

            jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id()).fetch(100000)

            for job in jobs:
                stochkit_job = job.stochkit_job

                if stochkit_job.status == "Finished":
                    if stochkit_job.resource == 'Local':
                        numberOfFiles += 1
                        totalSize += get_size(job.stochkit_job.output_location)

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps( { "numberOfFiles" : numberOfFiles, "totalSize" : totalSize } ))
            return
        elif reqType == 'backup':
            exportJob = ExportJobWrapper()

            exportJob.userId = self.user.user_id()
            exportJob.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            exportJob.status = "Running -- Exporting Models"
            exportJob.outData = ""

            exportJob.put()

            [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/', prefix = "backup_", suffix = ".zip")
            tmpdir = tempfile.mkdtemp()
            zipfbFile = os.fdopen(tid, 'w')
            zipfb = zipfile.ZipFile(zipfbFile, mode = 'w', allowZip64 = True)
            names = []

            try:
                fversion = open(os.path.abspath(os.path.dirname(__file__)) + '/../VERSION', 'r')
                version = fversion.read().strip()
                fversion.close()
            except:
                version = "1.1.0"

            #def folderExists(folder):
            #    pass

            def getName(preferredName):
                basename = tmpfile[:-4].split('/')[-1]

                fileName = '{0}/{1}'.format(basename, preferredName)
                while fileName in names:
                    fileName = '{0}/{1}_{2}'.format(basename, preferredName, ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3)))

                names.append(fileName)

                return fileName

            def addBytes(name, buf):
                name = getName(name)

                zipfb.writestr(name, buf)

                return name

            def addFile(name, path):
                name = getName(name)

                zipfb.write(path, name)

                return name

            def addFolder(name, path):
                name = getName(name)

                for dirpath, dirnames, filenames in os.walk(path):
                    for f in filenames:
                        fp = os.path.join(dirpath, f)
                        rel = os.path.relpath(fp, path)
                        zipfb.write(fp, os.path.join(name, rel))

                return name

            models = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", self.user.user_id()).fetch(100000)

            output = []

            for model in models:
                jsonModel = { "version" : version,
                              "name" : model.model_name,
                              "user_id" : model.user_id}
                if model.attributes:
                    jsonModel.update(model.attributes)

                jsonModel["type"] = model.model.units

                jsonModel["model"] = addBytes('models/data/{0}.xml'.format(model.model_name), model.model.serialize())
                addBytes('models/{0}.json'.format(model.model_name), json.dumps(jsonModel, sort_keys=True, indent=4, separators=(', ', ': ')))

            #job = ExportJobWrapper.get_by_id(job.key().id())

            exportJob.status = "Running -- Exporting Simulations"
            exportJob.outData = None

            exportJob.put()

            ###jobs
            jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id()).fetch(100000)

            for job in jobs:
                stochkit_job = job.stochkit_job

                # Only export local, finished jobsx
                if stochkit_job.status == "Finished":
                    if stochkit_job.resource == 'Local':
                        outputLocation = addFolder('stochkitJobs/data/{0}'.format(job.name), job.stochkit_job.output_location)

                        jsonJob = { "version" : version,
                                    "name" : job.name,
                                    "stdout" : job.stdout,
                                    "stderr" : job.stderr,
                                    # These are things contained in the stochkit_job object
                                    "type" : job.stochkit_job.type,
                                    "status" : job.stochkit_job.status,
                                    "output_location" : outputLocation,
                                    "output_url" : job.stochkit_job.output_url,
                                    "final_time" : job.stochkit_job.final_time,
                                    "increment" : job.stochkit_job.increment,
                                    "realizations" : job.stochkit_job.realizations,
                                    "exec_type" : job.stochkit_job.exec_type,
                                    "store_only_mean" : job.stochkit_job.store_only_mean,
                                    "label_column_names" : job.stochkit_job.label_column_names,
                                    "create_histogram_data" : job.stochkit_job.create_histogram_data,
                                    "epsilon" : job.stochkit_job.epsilon,
                                    "threshold" : job.stochkit_job.threshold,
                                    "pid" : job.stochkit_job.pid,
                                    "result" : job.stochkit_job.result }
                    
                        if job.attributes:
                            jsonJob.update(job.attributes)

                        addBytes('stochkitJobs/{0}.json'.format(job.name), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))


            zipfb.close()
            zipfbFile.close()

            exportJob.status = "Finished"
            exportJob.outData = tmpfile.split("/")[-1]

            exportJob.put()

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write( { "status" : True,
                                   "msg" : "Job submitted" } )
            return
        elif reqType == 'import':
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write( { "status" : False,
                                   "msg" : "Not implemented yet" })
            return
