try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db
import pickle
import traceback
import random
import tarfile
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

        if reqType == 'size':
            def get_size(start_path = '.'):
                # Stolen from http://stackoverflow.com/questions/1392413/calculating-a-directory-size-using-python
                totalSize = 0
                for dirpath, dirnames, filenames in os.walk(start_path):
                    for f in filenames:
                        fp = os.path.join(dirpath, f)
                        totalSize += os.path.getsize(fp)
                return totalSize

            # sizes of models will be trivial
            totalSize = 0

            jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper").fetch(100000)

            for job in jobs:
                stochkit_job = job.stochkit_job

                if stochkit_job.status == "Finished":
                    if stochkit_job.resource == 'Local':
                        totalSize += get_size(job.stochkit_job.output_location)

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps( { "size" : totalSize } ))
            return
        elif reqType == 'backup':
            exportJob = ExportJobWrapper()

            exportJob.userId = self.user.user_id()
            exportJob.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            exportJob.status = "Running -- Exporting Models"
            exportJob.outData = ""

            exportJob.put()

            [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/', suffix = ".tar")
            tmpdir = tempfile.mkdtemp()
            tarfb = tarfile.TarFile(fileobj = os.fdopen(tid, 'w'), mode = 'w')
            names = []

            try:
                fversion = open(os.path.abspath(os.path.dirname(__file__)) + '/../VERSION', 'r')
                version = fversion.read().strip()
                fversion.close()
            except:
                version = "1.1.0"

            #def folderExists(folder):
            #    pass

            def addFile(preferredName, buf, isFile = False):
                basename = tmpfile[:-4].split('/')[-1]

                fileName = '{0}/{1}'.format(basename, preferredName)
                while fileName in names:
                    fileName = '{0}/{1}_{2}'.format(basename, preferredName, ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3)))

                names.append(fileName)

                if not isFile:
                    addingFile = tempfile.NamedTemporaryFile(mode = 'w', dir='./')

                    #os.close(addingFile[1])

                    addingFile.write(buf)
                    addingFile.flush()

                    tarfb.add(addingFile.name, arcname = fileName)

                    addingFile.close()
                else:
                    tarfb.add(buf, arcname = fileName)
                return fileName

            models = db.GqlQuery("SELECT * FROM StochKitModelWrapper").fetch(100000)

            output = []

            for model in models:
                jsonModel = { "version" : version,
                              "name" : model.model_name,
                              "user_id" : model.user_id}
                if model.attributes:
                    jsonModel.update(model.attributes)

                jsonModel["type"] = model.model.units

                jsonModel["model"] = addFile('models/data/{0}.xml'.format(model.model_name), model.model.serialize())
                addFile('models/{0}.json'.format(model.model_name), json.dumps(jsonModel, sort_keys=True, indent=4, separators=(', ', ': ')))

            #job = ExportJobWrapper.get_by_id(job.key().id())

            exportJob.status = "Running -- Exporting Simulations"
            exportJob.outData = None

            exportJob.put()

            ###jobs
            jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper").fetch(100000)

            for job in jobs:
                stochkit_job = job.stochkit_job

                # Only export local, finished jobsx
                if stochkit_job.status == "Finished":
                    if stochkit_job.resource == 'Local':

                        outputLocation = addFile('stochkitJobs/data/{0}'.format(job.name), job.stochkit_job.output_location, True)

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

                        addFile('stochkitJobs/{0}.json'.format(job.name), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))


            tarfb.close()


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
