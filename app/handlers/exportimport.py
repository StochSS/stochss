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

class ExportPage(BaseHandler):
    def get(self):

        req = self.request.get('action')

        if req == 'backup':
            [tid, tmpfile] = tempfile.mkstemp(suffix = ".tgz")
            tmpdir = tempfile.mkdtemp()
            tarfb = tarfile.TarFile(fileobj = os.fdopen(tid, 'w:gz'), mode = 'w')
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

                        addFile('stochkitJobs/{0}.json'.format(job.name), json.dumps(jsonJob))

            tarfb.close()
            self.response.write(tmpfile)
            return
        elif req == 'import':
            pass
        
        self.response.write("you suck")
