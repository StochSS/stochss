try:
  import json
except ImportError:
  from django.utils import simplejson as json
import jinja2
from google.appengine.ext import db
import pickle
import traceback
import random
import zipfile
import tempfile
import logging
import time
import sys
import simulation
import modeleditor
import shutil
from google.appengine.api import users

from stochssapp import BaseHandler
from stochss.model import *
from stochss.stochkit import *
from stochss.examplemodels import *

import webapp2

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))

class ExportJobWrapper(db.Model):
    userId = db.StringProperty()
    startTime = db.StringProperty()
    status = db.StringProperty()
    outData = db.StringProperty()

class ExportPage(BaseHandler):
    def get(self):

        reqType = self.request.get('reqType')

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

                jsonModel["units"] = model.model.units

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
            self.response.write( json.dumps({ "status" : True,
                                              "msg" : "Job submitted" }) )
            return
        elif reqType == 'import':
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write( json.dumps({ "status" : False,
                                              "msg" : "Not implemented yet" }) )
            return


# -*- coding: utf-8 -*-
#
# jQuery File Upload Plugin GAE Python Example 2.1.1
# https://github.com/blueimp/jQuery-File-Upload
#
# Copyright 2011, Sebastian Tschan
# https://blueimp.net
#
# Licensed under the MIT license:
# http://www.opensource.org/licenses/MIT
#
import re
import urllib

def cleanup(blob_keys):
    blobstore.delete(blob_keys)

class ImportJobWrapper(db.Model):
    userId = db.StringProperty()
    status = db.StringProperty()
    zipFile = db.StringProperty()
    headerFile = db.StringProperty()

class ImportPage(BaseHandler):

    def initialize(self, request, response):
        super(ImportPage, self).initialize(request, response)
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers[
            'Access-Control-Allow-Methods'
        ] = 'OPTIONS, HEAD, GET, POST, PUT, DELETE'
        self.response.headers[
            'Access-Control-Allow-Headers'
        ] = 'Content-Type, Content-Range, Content-Disposition'

    def get_file_size(self, file):
        file.seek(0, 2)  # Seek to the end of the file
        size = file.tell()  # Get the position of EOF
        file.seek(0)  # Reset the file position to the beginning
        return size

    def get(self):
        self.render_response('exportimport.html')

    def post(self):
        if 'files[]' in self.request.POST:
            files = []
            for name, fieldStorage in self.request.POST.items():
                if type(fieldStorage) is unicode:
                    continue

                job = ImportJobWrapper()

                filename, suffix = os.path.splitext(fieldStorage.filename)
                filename = os.path.basename(filename)
                
                path = os.path.abspath(os.path.dirname(__file__))
                [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/', prefix = filename + "_", suffix = suffix)
                job.userId = self.user.user_id()
                job.status = "Writing file on server"
                job.zipFile = tmpfile

                job.put()

                fhandle = os.fdopen(tid, 'w')
                fhandle.write(fieldStorage.value)
                fhandle.close()

                job.status = "Analyzing file"
                job.put()

                zipFile = zipfile.ZipFile(fieldStorage.file, 'r')

                headers = { "models" : {}, "stochkitJobs" : {} }
                for name in zipFile.namelist():
                    if re.search('^{0}/models/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['models'][name] = json.loads(zipFile.read(name))
                    elif re.search('^{0}/stochkitJobs/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['stochkitJobs'][name] = json.loads(zipFile.read(name))
                    
                zipFile.close();
                
                job.status = "Finished"
                [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/')

                fhandle = os.fdopen(tid, 'w')
                fhandle.write(json.dumps(headers))
                fhandle.close()

                job.headerFile = tmpfile
                job.put()

                files.append( fieldStorage.filename )
            
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(files))
        else:
            reqType = self.request.get('reqType')

            if reqType == 'importInfo':
                # Print [ { id: importJobid,
                #           zipFile : zipFilename,
                #           listOfModelJsons,
                #           listOfJobJsons } ]

                jobs = []

                for job in db.GqlQuery("SELECT * FROM ImportJobWrapper").run():
                    #job.delete()
                    #Using os open here cause normal Python open is failing
                    try:
                        fdescript = os.open(job.headerFile, os.O_RDONLY)
                    except:
                        job.delete()
                        return

                    contents = ""
                    while 1:
                        part = os.read(fdescript, 5000)
                        if part == '':
                            break

                        contents += part;

                    headers = json.loads(contents)
                    os.close(fdescript)

                    jobs.append({ "id" : job.key().id(),
                                  "zipFile" : os.path.basename(job.zipFile),
                                  "headers" : headers })
                    
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(jobs))
                return
            elif reqType == 'doImport':
                state = json.loads(self.request.get('state'))

                job = ImportJobWrapper.get_by_id(state["id"])

                fdescript = os.open(job.zipFile, os.O_RDONLY)
                fhandle = os.fdopen(fdescript, 'r')

                zhandle = zipfile.ZipFile(fhandle, 'r')

                for name in state['selections']['mc']:
                    modelj = json.loads(zhandle.read(name))
                    modelj["model"] = zhandle.read(modelj["model"])

                    modeleditor.ModelManager.createModel(self, modelj)

                for name in state['selections']['sjc']:
                    jobj = json.loads(zhandle.read(name))
                    path = os.path.abspath(os.path.dirname(__file__))
                    
                    zipPath = jobj["output_location"]

                    outPath = tempfile.mkdtemp(dir = "{0}/../output/".format(path))

                    for name in zhandle.namelist():
                        if re.search('^{0}.*$'.format(zipPath), name):
                            relname = os.path.relpath(name, zipPath)

                            if not os.path.exists(os.path.dirname("{0}/{1}".format(outPath, relname))):
                                os.makedirs(os.path.dirname("{0}/{1}".format(outPath, relname)))

                            print "Writing ", name, " to " , "{0}/{1}".format(outPath, relname)

                            fhandle = open("{0}/{1}".format(outPath, relname), 'w')
                            fhandle.write(zhandle.read(name))
                            fhandle.close()

                    jobj["output_location"] = outPath

                    print simulation.JobManager.createJob(self, jobj)
                    print "stochkitModel", name

                zhandle.close()
                fhandle.close()
                
                # Expect an importJobId
                # along with a list of model jsons to import
                # and a list of job jsons to import
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps( { "status" : True,
                                                  "msg" : "Archive imported" }))
                
                return

            #if 'application/json' in self.request.headers.get('Accept'):

