import os

try:
  import json
except ImportError:
  from django.utils import simplejson as json

import pprint
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

import sensitivity
import stochoptim
import mesheditor
import fileserver
import pyurdme
import spatial
from stochssapp import BaseHandler, User
from stochss.model import *
import stochss.stochkit
from stochss.examplemodels import *
from backend.backendservice import backendservices
from backend.common.config import AgentTypes

import webapp2

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))

class ExportJobWrapper(db.Model):
    userId = db.StringProperty()
    startTime = db.StringProperty()
    status = db.StringProperty()
    outData = db.StringProperty()

    def delete(self):
        try:
            os.remove(self.outData)
        except Exception as e:
            sys.stderr.write("ExportJobWrapper.delete(): {0}\n".format(e))
        super(ExportJobWrapper, self).delete()

class SuperZip:
    def __init__(self, directory = None, zipFileName = None, preferredName = "backup_", stochKitJobsToDownload = [], sensitivityJobsToDownload = [], stochOptimJobsToDownload = [], spatialJobsToDownload = []):
        self.stochKitJobsToDownload = stochKitJobsToDownload
        self.sensitivityJobsToDownload = sensitivityJobsToDownload
        self.stochOptimJobsToDownload = stochOptimJobsToDownload
        self.spatialJobsToDownload = spatialJobsToDownload
        if directory == None and zipfile == None:
            raise Exception("SuperZip must have either directory or zipFileName defined in constructor")

        if directory:
            [tid, self.tmpfile] = tempfile.mkstemp(dir = directory, prefix = preferredName, suffix = ".zip")
            self.zipfbFile = os.fdopen(tid, 'w')
            self.zipfb = zipfile.ZipFile(self.zipfbFile, mode = 'w', allowZip64 = True)
            self.names = []

            try:
                fversion = open(os.path.abspath(os.path.dirname(__file__)) + '/../VERSION', 'r')
                self.version = fversion.read().strip()
                fversion.close()
            except:
                self.version = "1.1.0"
        else:
            fdescript = os.open(zipFileName, os.O_RDONLY)
            self.zipfbFile = os.fdopen(fdescript, 'r')
            self.zipfb = zipfile.ZipFile(self.zipfbFile, mode = 'r', allowZip64 = True)

    def getFileName(self):
        return self.tmpfile

    def getName(self, preferredName):
        basename = self.tmpfile[:-4].split('/')[-1]

        fileName = '{0}/{1}'.format(basename, preferredName)
        while fileName in self.names:
            prefBase, ext = os.path.splitext(preferredName)
            fileName = '{0}/{1}_{2}{3}'.format(basename, prefBase, ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3)), ext)

        self.names.append(fileName)

        return fileName

    def addBytes(self, name, buf):
        name = self.getName(name)
        
        self.zipfb.writestr(name, buf)
        
        return name
    
    def addFile(self, name, path):
        name = self.getName(name)
        
        self.zipfb.write(path, name)
        
        return name
    
    def addFolder(self, name, path):
        name = self.getName(name)
        
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                rel = os.path.relpath(fp, path)
                self.zipfb.write(fp, os.path.join(name, rel))
                
        return name

    def addStochKitModel(self, model):
        jsonModel = { "version" : self.version,
                      "name" : model.name,
                      "user_id" : model.user_id }

        if model.user_id == "":
            return

        if model.isSpatial:
            jsonModel["isSpatial"] = model.isSpatial

            meshWrapperDb = mesheditor.MeshWrapper.get_by_id(model.spatial['mesh_wrapper_id'])
            meshData = fileserver.FileManager.getFile(self, meshWrapperDb.meshFileId, noFile = False)
            meshFileName = self.addBytes('models/data/{0}.mesh.xml'.format(model.name), meshData['data'])
            jsonModel["meshFile"] = meshFileName;

            if meshWrapperDb.subdomains:
                subdomainsData = ''
                for i, s in enumerate(meshWrapperDb.subdomains):
                    subdomainsData += '{0},{1}{2}'.format(i, s, os.linesep)
                subdomainsFileName = self.addBytes('models/data/{0}.subdomains.txt'.format(model.name), subdomainsData)
                jsonModel["subdomainsFile"] = subdomainsFileName;

            jsonModel["spatial"] = model.spatial

        jsonModel["units"] = model.units
        jsonModel["model"] = self.addBytes('models/data/{0}.xml'.format(model.name), model.createStochKitModel().serialize())

        self.addBytes('models/{0}.json'.format(model.name), json.dumps(jsonModel, sort_keys=True, indent=4, separators=(', ', ': ')))

    def addStochKitJob(self, job, globalOp = False, ignoreStatus = False):
        # Only export finished jobs unless flag says to export them all
        if job.status == "Finished" or ignoreStatus:
            # These are fields shared among all jobs
            jsonJob = { "version" : self.version,
                        "name" : job.name,
                        "user_id" : job.user_id,
                        "stdout" : job.stdout,
                        "stderr" : job.stderr,
                        "type" : job.indata["type"],
                        "status" : job.status,
                        "startDate" : job.startTime,
                        "modelName" : job.modelName,
                        "final_time" : job.indata["final_time"],
                        "increment" : job.indata["increment"],
                        "units" : job.indata["units"],
                        "realizations" : job.indata["realizations"],
                        "exec_type" : job.indata["exec_type"],
                        "epsilon" : job.indata["epsilon"],
                        "threshold" : job.indata["threshold"],
                        "pid" : job.pid,
                        "result" : job.result }
            # For cloud jobs, we need to include the output_url and possibly grab the results from S3
            if job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                #jsonJob["output_url"] = job.outputURL
                # Only grab S3 data if user wants us to
                #print 'globalOP', globalOp
                if (job.name in self.stochKitJobsToDownload) or globalOp:
                    if job.output_location is None or (job.output_location is not None and not os.path.exists(job.output_location)):
                        # Grab the output from S3 if we need to
                        service = backendservices(self.user_data)
                        service.fetchOutput(job.pid, job.outputURL)
                        # Unpack it to its local output location
                        os.system('tar -xf {0}.tar'.format(job.uuid))
                        job.output_location = os.path.dirname(os.path.join(os.path.abspath(__file__), '../output', str(job.uuid)))
                        job.output_location = os.path.abspath(job.output_location)
                        # Update the DB entry
                        job.put()
                        # Clean up
                        os.remove('{0}.tar'.format(job.uuid))
                    # Add its data to the zip archive
                    outputLocation = self.addFolder('stochkitJobs/data/{0}'.format(job.name), job.output_location)
                    jsonJob["output_location"] = outputLocation
            # For local jobs, we need to include the output location in the zip archive
            elif job.resource == 'Local':
                outputLocation = self.addFolder('stochkitJobs/data/{0}'.format(job.name), job.output_location)
                jsonJob["stdout"] = "{0}/stdout".format(outputLocation)
                jsonJob["stderr"] = "{0}/stderr".format(outputLocation)
                jsonJob["output_location"] = outputLocation

            # Add the JSON to the zip archive
            self.addBytes('stochkitJobs/{0}.json'.format(job.name), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))

    def addStochOptimJob(self, job, globalOp = False):
        jsonJob = { "version" : self.version,
                    "userId" : job.userId,
                    "pid" : job.pid,
                    "startTime" : job.startTime,
                    "jobName" : job.jobName,
                    "modelName" : job.modelName,
                    "indata" : json.loads(job.indata),
                    "nameToIndex" : json.loads(job.nameToIndex),
                    "outData" : job.outData,
                    "status" : job.status }
        
        # For cloud jobs, we need to include the output_url and possibly grab the results from S3
        if job.resource in stochoptim.StochOptimJobWrapper.SUPPORTED_CLOUD_RESOURCES:
            #jsonJob["output_url"] = job.outputURL
            # Only grab S3 data if user wants us to
            if (job.jobName in self.stochOptimJobsToDownload) or globalOp:
                # Grab the remote files
                service = backendservices(self.user_data)
                service.fetchOutput(job.cloudDatabaseID, job.outputURL)
                # Unpack it to its local output location...
                
                os.system('tar -xf' +job.cloudDatabaseID+'.tar')
                job.outData = os.path.abspath(
                    os.path.dirname(os.path.abspath(__file__))+'/../output/'+job.cloudDatabaseID
                    )

                # Clean up
                os.remove(job.cloudDatabaseID+'.tar')
                # Save the updated status
                job.put()

        # Only add the folder if it actually exists
        if job.outData is not None and os.path.exists(job.outData):
            outputLocation = self.addFolder('stochOptimJobs/data/{0}'.format(job.jobName), job.outData)
            jsonJob["outData"] = outputLocation

            jsonJob["stdout"] = "{0}/stdout".format(outputLocation)
            jsonJob["stderr"] = "{0}/stderr".format(outputLocation)

        self.addBytes('stochOptimJobs/{0}.json'.format(job.jobName), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))
    
    def addSensitivityJob(self, job, globalOp = False, ignoreStatus = False):
        if job.status == "Finished" or ignoreStatus:
            # Shared fields
            jsonJob = { "version" : self.version,
                        "userId" : job.userId,
                        "jobName" : job.jobName,
                        "modelName" : job.modelName,
                        "startTime" : job.startTime,
                        "indata" : json.loads(job.indata),
                        "status" : job.status }
            if job.resource == "local":
                outputLocation = self.addFolder('sensitivityJobs/data/{0}'.format(job.jobName), job.outData)
                jsonJob["outData"] = outputLocation
            elif job.resource in sensitivity.SensitivityJobWrapper.SUPPORTED_CLOUD_RESOURCES:
                #jsonJob["outputURL"] = job.outputURL
                # Only grab S3 data if user wants us to
                if (job.jobName in self.sensitivityJobsToDownload) or globalOp:
                    if job.outData is None or (job.outData is not None and not os.path.exists(job.outData)):
                        # Grab the output from S3 if we need to
                        service = backendservices(self.user_data)
                        service.fetchOutput(job.cloudDatabaseID, job.outputURL)
                        # Unpack it to its local output location
                        os.system('tar -xf' +job.cloudDatabaseID+'.tar')
                        job.outData = os.path.dirname(os.path.abspath(__file__))+'/../output/'+job.cloudDatabaseID
                        job.outData = os.path.abspath(job.outData)
                        # Update the DB entry
                        job.put()
                        # Clean up
                        os.remove(job.cloudDatabaseID+'.tar')
                    outputLocation = self.addFolder('sensitivityJobs/data/{0}'.format(job.jobName), job.outData)
                    jsonJob["outData"] = outputLocation
            self.addBytes('sensitivityJobs/{0}.json'.format(job.jobName), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))

    def addSpatialJob(self, job, globalOp = False):
        jsonJob = { "version" : self.version,
                    "userId" : job.userId,
                    "pid" : job.pid,
                    "startTime" : job.startTime,
                    "jobName" : job.jobName,
                    "modelName" : job.modelName,
                    "indata" : json.loads(job.indata),
                    "outData" : job.outData,
                    "resource" : "Local",
                    "uuid" : job.uuid,
                    "status" : job.status }
        
        if job.resource in spatial.SpatialJobWrapper.SUPPORTED_CLOUD_RESOURCES:
            #jsonJob["output_url"] = job.output_url
            # Only grab S3 data if user wants us to
            if (job.jobName in self.spatialJobsToDownload) or globalOp:
                if job.outData is None or (job.outData is not None and not os.path.exists(job.outData)):
                    # Grab the output from S3 if we need to
                    service = backendservices(self.user_data)
                    # Fetch
                    service.fetchOutput(job.cloud_id, job.output_url)
                    # Unpack
                    os.system('tar -xf' +job.uuid+'.tar')
                    # Record location
                    job.outData = os.path.abspath(os.path.dirname(__file__))+'/../output/'+job.uuid
                    # Save the updated status
                    job.put()
                    # Clean up
                    os.remove(job.uuid+'.tar')

        # Only add the folder if it actually exists
        if job.outData is not None and os.path.exists(job.outData):
            outputLocation = self.addFolder('spatialJobs/data/{0}'.format(job.jobName), job.outData)
            jsonJob["outData"] = outputLocation

            jsonJob["stdout"] = "{0}/stdout".format(outputLocation)
            jsonJob["stderr"] = "{0}/stderr".format(outputLocation)

        self.addBytes('spatialJobs/{0}.json'.format(job.jobName), json.dumps(jsonJob, sort_keys=True, indent=4, separators=(', ', ': ')))
        pass

    def extractSpatialJob(self, path, userId = None, handler = None, rename = None):
        jsonJob = json.loads(self.zipfb.read(path))
        path = os.path.abspath(os.path.dirname(__file__))

        zipPath = jsonJob["outData"]


        job = spatial.SpatialJobWrapper()

        jobNames = [x.jobName for x in db.Query(spatial.SpatialJobWrapper).filter('userId =', handler.user.user_id()).run()]

        #print jobNames

        if jsonJob["jobName"] in jobNames:
            if rename:

                i = 1
                tryName = '{0}_{1}'.format(jsonJob["jobName"], i)

                while tryName in jobNames:
                    i = i + 1
                    tryName = '{0}_{1}'.format(jsonJob["jobName"], i)
                    
                jsonJob["jobName"] = tryName

        if jsonJob["userId"] not in [x.user_id() for x in User.query().fetch()]:
            jsonJob["userId"] = handler.user.user_id()

        if userId:
            jsonJob["userId"] = userId

        outPath = tempfile.mkdtemp(dir = "{0}/../output/".format(path))

        for name in self.zipfb.namelist():
            if re.search('^{0}/.*$'.format(zipPath), name):
                relname = os.path.relpath(name, zipPath)

                if not os.path.exists(os.path.dirname("{0}/{1}".format(outPath, relname))):
                    os.makedirs(os.path.dirname("{0}/{1}".format(outPath, relname)))

                fhandle = open("{0}/{1}".format(outPath, relname), 'w')
                fhandle.write(self.zipfb.read(name))
                fhandle.close()

        job.userId = jsonJob["userId"]
        job.jobName = jsonJob["jobName"]
        job.startTime = jsonJob["startTime"]
        job.modelName = jsonJob["modelName"] if "modelName" in jsonJob else None
        job.indata = json.dumps(jsonJob["indata"])
        job.outData = outPath
        job.resource = "local"
        job.status = jsonJob["status"]
        job.uuid = jsonJob["uuid"]

        job.put()

        return job.key().id()

    def extractStochKitModel(self, path, userId = None, handler = None, rename = None):
        modelj = json.loads(self.zipfb.read(path))
        modelj["model"] = self.zipfb.read(modelj["model"])

        if modelj["user_id"] not in [x.user_id() for x in User.query().fetch()]:
            modelj["user_id"] = handler.user.user_id()

        if userId:
            modelj["user_id"] = userId

        if "meshFile" in modelj:
            meshFileData = self.zipfb.read(modelj["meshFile"])

            subdomainsFileData = None
            if "subdomainsFile" in modelj:
                subdomainsFileData = self.zipfb.read(modelj["subdomainsFile"])

            meshFileId = fileserver.FileManager.createFile(handler, "meshFiles", os.path.basename(modelj["meshFile"]), meshFileData, 777)

            if 'subdomainsFile' in modelj:
                subdomainsData = []
                for line in subdomainsFileData.split('\n'):
                    line = line.strip()
                    if len(line.split(',')) != 2:
                        continue
                    i, subdomain = line.split(',')
                    subdomainsData.append(int(float(subdomain)))

            names = [x.name for x in db.Query(mesheditor.MeshWrapper).filter('userId =', handler.user.user_id()).run()]
            tmpName = os.path.basename(modelj["meshFile"]).split(".")[0]
            i = 0
            while tmpName in names:
                tmpName = os.path.basename(modelj["meshFile"]).split(".")[0] + '_' + str(i)
                i += 1
            
            meshDb = mesheditor.MeshWrapper()
            meshDb.userId = handler.user.user_id()
            meshDb.name = tmpName
            meshDb.description = ""
            meshDb.meshFileId = int(meshFileId)
            meshDb.subdomains = subdomainsData
            meshDb.uniqueSubdomains = list(set(meshDb.subdomains))
            meshDb.undeletable = False
            meshDb.ghost = False
        
            pymodel = pyurdme.URDMEModel(name = 'test')
            pymodel.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(fileserver.FileManager.getFile(self, meshFileId)["storePath"]))
            coordinates = pymodel.mesh.coordinates()
            minx = numpy.min(coordinates[:, 0])
            maxx = numpy.max(coordinates[:, 0])
            miny = numpy.min(coordinates[:, 1])
            maxy = numpy.max(coordinates[:, 1])
            minz = numpy.min(coordinates[:, 2])
            maxz = numpy.max(coordinates[:, 2])
            pymodel.add_species(pyurdme.Species('T', 1))

            if len(meshDb.subdomains) == 0:
                meshDb.subdomains = [1] * len(coordinates)
                meshDb.uniqueSubdomains = [1]

            pymodel.set_subdomain_vector(numpy.array(subdomainsData))
            sd = pymodel.get_subdomain_vector()
            vol_accumulator = numpy.zeros(numpy.unique(sd).shape)
            for ndx, v in enumerate(pymodel.get_solver_datastructure()['vol']):
                vol_accumulator[sd[ndx] - 1] += v

            volumes = {}

            for s, v in enumerate(vol_accumulator):
                volumes[s + 1] = v

            meshDb.volumes = volumes
            meshDb.boundingBox = [[minx, maxx], [miny, maxy], [minz, maxz]]

            meshDb.put()

            modelj["spatial"]["mesh_wrapper_id"] = meshDb.key().id()
            modelj["isSpatial"] = True

        names = [model['name'] for model in modeleditor.ModelManager.getModels(handler)]

        name = modelj["name"]
        if rename:
            tmpName = name
            while tmpName in names:
                tmpName = name + '_' + ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3))
            name = tmpName
        else:
            if name in names:
                raise Exception("Model name already in use")

        stochKitModel = stochss.stochkit.StochMLDocument.fromString(modelj["model"]).toModel(name)
        modelDb = modeleditor.StochKitModelWrapper.createFromStochKitModel(handler, stochKitModel)

        if "isSpatial" in modelj:
            modelDb.isSpatial = modelj["isSpatial"]
        else:
            modelDb.isSpatial = False

        if "spatial" in modelj:
            modelDb.spatial = modelj["spatial"]

            # If this is true we're probably importing an older version
            if isinstance(modelDb.spatial["initial_conditions"], dict):
                initial_conditions = modelDb.spatial["initial_conditions"].values()
                for initial_condition in initial_conditions:
                    initial_condition["count"] = int(initial_condition["count"])

                modelDb.spatial["initial_conditions"] = initial_conditions

            for specie in modelDb.spatial["species_diffusion_coefficients"]:
                modelDb.spatial["species_diffusion_coefficients"][specie] = float(modelDb.spatial["species_diffusion_coefficients"][specie])

        if "is_public" in modelj:
            modelDb.is_public = modelj["is_public"]
        else:
            modelDb.is_public = False

        if "meshFile" in modelj:
            modelDb.spatial['mesh_wrapper_id'] = meshDb.key().id()

        modelDb.put()

        return modelDb

    def extractStochKitJob(self, path, userId = None, handler = None, rename = None):
        jobj = json.loads(self.zipfb.read(path))
        path = os.path.abspath(os.path.dirname(__file__))

        #print "Rename: ", rename

        zipPath = jobj["output_location"]

        #print "output_location", zipPath

        if jobj["user_id"] not in [x.user_id() for x in User.query().fetch()]:
            jobj["user_id"] = handler.user.user_id()

        if userId:
            jobj["user_id"] = userId

        outPath = tempfile.mkdtemp(dir = "{0}/../output/".format(path))

        #print "output_location", outPath

        for name in self.zipfb.namelist():
            if re.search('^{0}/.*$'.format(zipPath), name):
                relname = os.path.relpath(name, zipPath)

                if not os.path.exists(os.path.dirname("{0}/{1}".format(outPath, relname))):
                    os.makedirs(os.path.dirname("{0}/{1}".format(outPath, relname)))

                fhandle = open("{0}/{1}".format(outPath, relname), 'w')
                fhandle.write(self.zipfb.read(name))
                fhandle.close()

        jobj["modelName"] = jobj["modelName"] if "modelName" in jobj else None

        jobj["output_location"] = outPath
        jobj["stdout"] = "{0}/stdout".format(outPath)
        jobj["stderr"] = "{0}/stderr".format(outPath)
    
        return simulation.JobManager.createJob(handler, jobj, rename = rename)

    def extractStochOptimJob(self, path, userId = None, handler = None, rename = None):
        jsonJob = json.loads(self.zipfb.read(path))
        path = os.path.abspath(os.path.dirname(__file__))
        
        zipPath = jsonJob["outData"]


        job = stochoptim.StochOptimJobWrapper()

        jobNames = [x.jobName for x in db.Query(stochoptim.StochOptimJobWrapper).filter('userId =', handler.user.user_id()).run()]

        #print jobNames

        if jsonJob["jobName"] in jobNames:
            if rename:

                i = 1
                tryName = '{0}_{1}'.format(jsonJob["jobName"], i)

                while tryName in jobNames:
                    i = i + 1
                    tryName = '{0}_{1}'.format(jsonJob["jobName"], i)
                    
                jsonJob["jobName"] = tryName

        if jsonJob["userId"] not in [x.user_id() for x in User.query().fetch()]:
            jsonJob["userId"] = handler.user.user_id()

        if userId:
            jsonJob["userId"] = userId

        outPath = tempfile.mkdtemp(dir = "{0}/../output/".format(path))

        for name in self.zipfb.namelist():
            if re.search('^{0}/.*$'.format(zipPath), name):
                relname = os.path.relpath(name, zipPath)

                if not os.path.exists(os.path.dirname("{0}/{1}".format(outPath, relname))):
                    os.makedirs(os.path.dirname("{0}/{1}".format(outPath, relname)))

                fhandle = open("{0}/{1}".format(outPath, relname), 'w')
                fhandle.write(self.zipfb.read(name))
                fhandle.close()

        job.userId = jsonJob["userId"]
        job.jobName = jsonJob["jobName"]
        job.startTime = jsonJob["startTime"]
        job.modelName = jsonJob["modelName"] if "modelName" in jsonJob else None
        job.indata = json.dumps(jsonJob["indata"])
        job.nameToIndex = json.dumps(jsonJob["nameToIndex"])
        job.outData = outPath
        job.resource = "local"
        job.status = jsonJob["status"]

        job.put()

        return job.key().id()

    def extractSensitivityJob(self, path, userId = None, handler = None, rename = None):
        jsonJob = json.loads(self.zipfb.read(path))
        path = os.path.abspath(os.path.dirname(__file__))
        
        zipPath = jsonJob["outData"]

        job = sensitivity.SensitivityJobWrapper()

        jobNames = [x.jobName for x in db.Query(sensitivity.SensitivityJobWrapper).filter('userId =', handler.user.user_id()).run()]

        if jsonJob["jobName"] in jobNames:
            if rename:

                i = 1
                tryName = '{0}_{1}'.format(jsonJob["jobName"], i)

                while tryName in jobNames:
                    i = i + 1
                    tryName = '{0}_{1}'.format(jsonJob["jobName"], i)
                    
                jsonJob["jobName"] = tryName

        if jsonJob["userId"] not in [x.user_id() for x in User.query().fetch()]:
            jsonJob["userId"] = handler.user.user_id()

        if userId:
            jsonJob["userId"] = userId

        outPath = tempfile.mkdtemp(dir = "{0}/../output/".format(path))

        for name in self.zipfb.namelist():
            if re.search('^{0}/.*$'.format(zipPath), name):
                relname = os.path.relpath(name, zipPath)

                if not os.path.exists(os.path.dirname("{0}/{1}".format(outPath, relname))):
                    os.makedirs(os.path.dirname("{0}/{1}".format(outPath, relname)))

                fhandle = open("{0}/{1}".format(outPath, relname), 'w')
                fhandle.write(self.zipfb.read(name))
                fhandle.close()

        job.userId = jsonJob["userId"]
        job.jobName = jsonJob["jobName"]
        job.startTime = jsonJob["startTime"]
        job.indata = json.dumps(jsonJob["indata"])
        job.modelName = jsonJob["modelName"] if "modelName" in jsonJob else None
        job.outData = outPath
        job.resource = "local"
        job.status = jsonJob["status"]

        job.put()

        return job.key().id()

    def close(self):
        if self.zipfb:
            self.zipfb.close()

        if self.zipfbFile:
            self.zipfbFile.close()

class ExportPage(BaseHandler):
    def post(self):
        try:
            request_data = json.loads(self.request.POST.items()[0][0])
            reqType = request_data["reqType"]
        except:
            reqType = self.request.get('reqType')
            pass

        if reqType == 'delJob':
            job = ExportJobWrapper.get_by_id(int(self.request.get('id')))
            job.delete()

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps( { "status" : True, "msg" : "Export job deleted" } ))
            return
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
                if job.status == "Finished":
                    if job.resource == 'Local':
                        numberOfFiles += 1
                        totalSize += get_size(job.job.output_location)

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps( { "numberOfFiles" : numberOfFiles, "totalSize" : totalSize } ))
            return
        elif reqType == 'backup':
            if "stochOptimJobs" in request_data:
                selected_stochoptim_jobs = request_data["stochOptimJobs"]
            else:
                selected_stochoptim_jobs = []

            if "spatialJobs" in request_data:
                selected_spatial_jobs = request_data["spatialJobs"]
            else:
                selected_spatial_jobs = []

            if "sensitivityJobs" in request_data:
                selected_sensitivity_jobs = request_data["sensitivityJobs"]
            else:
                selected_sensitivity_jobs = []

            if "stochKitJobs" in request_data:
                selected_stochkit_jobs = request_data["stochKitJobs"]
            else:
                selected_stochkit_jobs = []

            #logging.info('Processing backup export request with stochkit jobs: {0} sensitivity jobs: {1}'.format(selected_stochkit_jobs, selected_sensitivity_jobs))

            exportJob = ExportJobWrapper()

            if "globalOp" in request_data:
                globalOp = request_data["globalOp"]
            else:
                globalOp = False

            if globalOp and not self.user.is_admin_user():
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write( json.dumps({ "status" : False,
                                                  "msg" : "Non-admin users cannot export all data" }) )
                return

            exportJob.userId = self.user.user_id()
            exportJob.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
            exportJob.status = "Running -- Exporting Models"
            exportJob.outData = None

            exportJob.put()

            szip = SuperZip(
                os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/',
                stochKitJobsToDownload=selected_stochkit_jobs,
                sensitivityJobsToDownload=selected_sensitivity_jobs,
                stochOptimJobsToDownload=selected_stochoptim_jobs,
                spatialJobsToDownload=selected_spatial_jobs
            )

            if not globalOp:
                models = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND is_public = False", self.user.user_id()).run()
            else:
                models = db.GqlQuery("SELECT * FROM StochKitModelWrapper").run()

            for model in models:
                szip.addStochKitModel(model)

            exportJob.status = "Running -- Exporting Simulations"
            exportJob.outData = None
            exportJob.put()

            ###jobs
            if not globalOp:
                jobs = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1", self.user.user_id()).run()
            else:
                jobs = db.GqlQuery("SELECT * FROM StochOptimJobWrapper").run()

            for job in jobs:
                szip.addStochOptimJob(job, globalOp)

            if not globalOp:
                jobs = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE userId = :1", self.user.user_id()).run()
            else:
                jobs = db.GqlQuery("SELECT * FROM SpatialJobWrapper").run()

            for job in jobs:
                szip.addSpatialJob(job, globalOp)

            if not globalOp:
                jobs = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE userId = :1", self.user.user_id()).run()
            else:
                jobs = db.GqlQuery("SELECT * FROM SensitivityJobWrapper").run()

            for job in jobs:
                szip.addSensitivityJob(job, globalOp)

            if not globalOp:
                jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id()).run()
            else:
                jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper").run()

            for job in jobs:
                szip.addStochKitJob(job, globalOp)

            szip.close()

            exportJob.status = "Finished"
            exportJob.outData = szip.getFileName()

            exportJob.put()

            self.response.headers['Content-Type'] = 'application/json'
            self.response.write( json.dumps({ "status" : True,
                                              "msg" : "Job submitted" }) )
            return

# A lot of this code taken from:
#
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

class ImportJobWrapper(db.Model):
    userId = db.StringProperty()
    status = db.StringProperty()
    zipFile = db.StringProperty()
    headerFile = db.StringProperty()

    def delete(self):
        try:
            os.remove(self.zipFile)
        except Exception as e:
            sys.stderr.write("ImportJobWrapper.delete(): {0}\n".format(e))
        try:
            os.remove(self.headerFile)
        except Exception as e:
            sys.stderr.write("ImportJobWrapper.delete(): {0}\n".format(e))
        super(ImportJobWrapper, self).delete()

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
        context = {
            'isAdminUser': self.user.is_admin_user()
        }
        # We can only pull results from S3 if we have valid AWS credentials

        resource = None

        service = backendservices(self.user_data)

        # Get all the cloud jobs
        stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        stochkit_jobs = [job for job in stochkit_jobs
                         if job.resource is not None and job.stochkit_job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES
                         and job.status == "Finished"]

        # Create the dictionary to pass to backend to check for sizes
        output_results_to_check = {}
        for cloud_job in stochkit_jobs:
            output_results_to_check[cloud_job.key().id()] = cloud_job.output_url

        # Sensitivity Jobs
        sensi_jobs = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE userId = :1", self.user.user_id())
        sensi_jobs = [job for job in sensi_jobs
                      if job.resource is not None and job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES
                      and job.status == "Finished"]
        for cloud_job in sensi_jobs:
            output_results_to_check[cloud_job.key().id()] = cloud_job.outputURL

        # StochOptim Jobs
        stochoptim_jobs_query = stochoptim.StochOptimJobWrapper.all()
        stochoptim_jobs_query.filter("userId =", self.user.user_id())
        stochoptim_jobs_query.filter("status =", "Finished")
        stochoptim_jobs = []
        for cloud_job in stochoptim_jobs_query.run():
            if cloud_job.resource is None or cloud_job.resource not in backendservices.SUPPORTED_CLOUD_RESOURCES:
                continue
            if cloud_job.outputURL is None:
                continue

            output_results_to_check[cloud_job.key().id()] = cloud_job.outputURL
            stochoptim_jobs.append(cloud_job)

        # Spatial Jobs
        spatial_jobs_query = spatial.SpatialJobWrapper.all()
        spatial_jobs_query.filter("userId =", self.user.user_id())
        spatial_jobs_query.filter("status =", "Finished")
        spatial_jobs = []
        for cloud_job in spatial_jobs_query.run():
            if cloud_job.resource is None or cloud_job.resource not in backendservices.SUPPORTED_CLOUD_RESOURCES:
                continue
            if cloud_job.output_url is None:
                continue

            output_results_to_check[cloud_job.key().id()] = cloud_job.output_url
            spatial_jobs.append(cloud_job)

        job_sizes = service.getSizeOfOutputResults(output_results_to_check)

        logging.info('job_sizes = \n{}'.format(pprint.pformat(job_sizes)))

        # Add all of the relevant jobs to the context so they will be rendered on the page
        context["stochkit_jobs"] = []
        context["sensitivity_jobs"] = []
        context["stochoptim_jobs"] = []
        context["spatial_jobs"] = []
        for cloud_job in stochkit_jobs:
            job_name = cloud_job.name
            job_id = cloud_job.key().id()
            if job_id in job_sizes:
                # These are the relevant jobs
                if job_sizes[job_id] is None:
                    size = 0
                    no_data = True
                else:
                    size = float(job_sizes[job_id])
                    no_data = False
                context["stochkit_jobs"].append({
                    'name': job_name,
                    'exec_type': cloud_job.indata["exec_type"],
                    'size': '{0} KB'.format(round(size/1024, 1)),
                    'no_data' : no_data
                })
        for cloud_job in sensi_jobs:
            job_name = cloud_job.jobName
            job_id = cloud_job.key().id()
            if job_id in job_sizes:
                if job_sizes[job_id] is None:
                    size = 0
                    no_data = True
                else:
                    size = float(job_sizes[job_id])
                    no_data = False
                context["sensitivity_jobs"].append({
                    'name': job_name,
                    'exec_type': 'sensitivity_jobs',
                    'size': '{0} KB'.format(round(size/1024, 1)),
                    'no_data' : no_data
                })
        for cloud_job in stochoptim_jobs:
            job_name = cloud_job.jobName
            job_id = cloud_job.key().id()
            if job_id in job_sizes:
                if job_sizes[job_id] is None:
                    size = 0
                    no_data = True
                else:
                    size = float(job_sizes[job_id])
                    no_data = False
                context["stochoptim_jobs"].append({
                    'name': job_name,
                    'exec_type': 'mcem2',
                    'size': '{0} KB'.format(round(size/1024, 1)),
                    'no_data' : no_data
                })
        for cloud_job in spatial_jobs:
            job_name = cloud_job.jobName
            job_id = cloud_job.key().id()
            if job_id in job_sizes:
                if job_sizes[job_id] is None:
                    size = 0
                    no_data = True
                else:
                    size = float(job_sizes[job_id])
                    no_data = False
                context["spatial_jobs"].append({
                    'name': job_name,
                    'exec_type': 'spatial',
                    'size': '{0} KB'.format(round(size/1024, 1)),
                    'no_data' : no_data
                })
        return self.render_response('exportimport.html', **context)

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

                headers = { "models" : {}, "stochkitJobs" : {}, "stochOptimJobs" : {}, "sensitivityJobs" : {}, "spatialJobs" : {} }
                for name in zipFile.namelist():
                    if re.search('models/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['models'][name] = json.loads(zipFile.read(name))
                    elif re.search('stochkitJobs/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['stochkitJobs'][name] = json.loads(zipFile.read(name))
                    elif re.search('sensitivityJobs/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['sensitivityJobs'][name] = json.loads(zipFile.read(name))
                    elif re.search('stochOptimJobs/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['stochOptimJobs'][name] = json.loads(zipFile.read(name))
                    elif re.search('spatialJobs/[a-zA-Z0-9\-_]*\.json$'.format(filename), name):
                        headers['spatialJobs'][name] = json.loads(zipFile.read(name))

                #print headers['stochOptimJobs']

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

                for job in db.GqlQuery("SELECT * FROM ImportJobWrapper WHERE userId = :1", self.user.user_id()).run():
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

                    try:
                      fversion = open(os.path.abspath(os.path.dirname(__file__)) + '/../VERSION', 'r')
                      version = fversion.read().strip()
                      fversion.close()
                    except:
                      version = "1.1.0"

                    jobs.append({ "id" : job.key().id(),
                                  "zipFile" : os.path.basename(job.zipFile),
                                  "headers" : headers,
                                  "version" : version })
                    
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(jobs))
                return
            elif reqType == 'doImport':
                state = json.loads(self.request.get('state'))
                overwriteType = self.request.get('overwriteType')

                job = ImportJobWrapper.get_by_id(state["id"])
                fdescript = os.open(job.headerFile, os.O_RDONLY)
                
                contents = ""
                while 1:
                    part = os.read(fdescript, 5000)
                    if part == '':
                        break

                    contents += part;

                headers = json.loads(contents)
                os.close(fdescript)

                globalOp = self.request.get('globalOp')

                globalOp = True if globalOp == 'true' else False

                job = ImportJobWrapper.get_by_id(state["id"])

                if globalOp and not self.user.is_admin_user():
                    self.response.headers['Content-Type'] = 'application/json'
                    self.response.write( json.dumps({ "status" : False,
                                                      "msg" : "Non-admin users cannot export all data" }) )
                    return

                szip = SuperZip(zipFileName = job.zipFile)

                if not globalOp:
                    userId = self.user.user_id()
                else:
                    userId = None

                validUsers = [x.user_id() for x in User.query().fetch()]

                totalObjects = 0
                importedObjects = 0

                for name in state['selections']['mc']:
                    if not state['selections']['mc'][name]:
                        continue

                    totalObjects += 1

                    if userId == None:
                        userID = headers['models'][name]["user_id"]

                        if userID not in validUsers:
                            userID = userId
                    else:
                        userID = userId

                    rename = False
                    dbName = headers['models'][name]["name"]
                    jobs = list(db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND name = :2", userID, dbName).run())

                    if len(jobs) > 0:
                        otherJob = jobs[0]

                        if overwriteType == 'keepOld':
                            continue
                        elif overwriteType == 'overwriteOld':
                            #print 'deleting', dbName, 'hehe'
                            otherJob.delete()
                        #elif overwriteType == 'renameOld':
                        #    i = 1
                        #    tryName = name + '_' + str(i)

                        #    while len(list(db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name", self.user.user_id(), tryName).run())) > 0:
                        #        i += 1
                        #        tryName = name + '_' + str(i)

                        #    otherJob.name = tryName
                        #    otherJob.put()
                        elif overwriteType == 'renameNew':
                            rename = True
                            
                    #print "importing ", name
                    importedObjects += 1
                    szip.extractStochKitModel(name, userId, self, rename = rename)

                #print "globalOp", userId

                for name in state['selections']['sjc']:
                    if not state['selections']['sjc'][name]:
                        continue

                    totalObjects += 1

                    if userId == None:
                        userID = headers['stochkitJobs'][name]["user_id"]

                        if userID not in validUsers:
                            userID = userId
                    else:
                        userID = userId

                    dbName = headers['stochkitJobs'][name]["name"]
                    jobs = list(db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", userID, dbName).run())

                    rename = False

                    if len(jobs) > 0:
                        otherJob = jobs[0]

                        #print otherJob.name

                        if overwriteType == 'keepOld':
                            continue
                        elif overwriteType == 'overwriteOld':
                            otherJob.delete(self)
                        elif overwriteType == 'renameNew':
                            rename = True

                    importedObjects += 1
                    szip.extractStochKitJob(name, userId, self, rename = rename)

                for name in state['selections']['snc']:
                    if not state['selections']['snc'][name]:
                        continue

                    totalObjects += 1

                    if userId == None:
                        userID = headers['sensitivityJobs'][name]["userId"]

                        if userID not in validUsers:
                            userID = userId
                    else:
                        userID = userId

                    dbName = headers['sensitivityJobs'][name]["jobName"]
                    jobs = list(db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE userId = :1 AND jobName = :2", userID, dbName).run())

                    rename = False

                    if len(jobs) > 0:
                        otherJob = jobs[0]

                        if overwriteType == 'keepOld':
                            continue
                        elif overwriteType == 'overwriteOld':
                            otherJob.delete()
                        elif overwriteType == 'renameNew':
                            rename = True

                    importedObjects += 1
                    szip.extractSensitivityJob(name, userId, self, rename = rename)

                for name in state['selections']['soc']:
                    if not state['selections']['soc'][name]:
                        continue

                    totalObjects += 1

                    if userId == None:
                        userID = headers['stochOptimJobs'][name]["userId"]

                        if userID not in validUsers:
                            userID = userId
                    else:
                        userID = userId

                    dbName = headers['stochOptimJobs'][name]["jobName"]
                    jobs = list(db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1 AND jobName = :2", userID, dbName).run())

                    rename = False

                    if len(jobs) > 0:
                        otherJob = jobs[0]

                        if overwriteType == 'keepOld':
                            continue
                        elif overwriteType == 'overwriteOld':
                            otherJob.delete()
                        elif overwriteType == 'renameNew':
                            rename = True

                    importedObjects += 1
                    szip.extractStochOptimJob(name, userId, self, rename = rename)

                for name in state['selections']['spc']:
                    if not state['selections']['spc'][name]:
                        continue

                    totalObjects += 1

                    if userId == None:
                        userID = headers['spatialJobs'][name]["userId"]

                        if userID not in validUsers:
                            userID = userId
                    else:
                        userID = userId

                    dbName = headers['spatialJobs'][name]["jobName"]
                    jobs = list(db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE userId = :1 AND jobName = :2", userID, dbName).run())

                    rename = False

                    if len(jobs) > 0:
                        otherJob = jobs[0]

                        if overwriteType == 'keepOld':
                            continue
                        elif overwriteType == 'overwriteOld':
                            otherJob.delete()
                        elif overwriteType == 'renameNew':
                            rename = True

                    importedObjects += 1
                    szip.extractSpatialJob(name, userId, self, rename = rename)

                szip.close()

                # Expect an importJobId
                # along with a list of model jsons to import
                # and a list of job jsons to import
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps( { "status" : True,
                                                  "msg" : "{0} of {1} objects imported from archive".format(importedObjects, totalObjects) }))
                
                return
            elif reqType == 'delJob':
                job = ImportJobWrapper.get_by_id(int(self.request.get('id')))
                job.delete()
                
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps( { "status" : True, "msg" : "Export job deleted" } ))
                return

            #if 'application/json' in self.request.headers.get('Accept'):

