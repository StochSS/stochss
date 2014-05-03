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
import re

from stochssapp import BaseHandler
import json
import time

import os, shutil
import random

class FileWrapper(db.Model):
    # A reference to the user that owns this job
    owner = db.StringProperty()
    #group = db.StringProperty() -- need to implement a groupmanager
    perm = db.IntegerProperty()
    path = db.StringProperty()
    storePath = db.StringProperty()
    #lastModified -- should we have this property?
    #fileType = db.StringProperty() -- should support both single files and folders

    def readable(self, handler):
        if owner == handler.user.user_id():
            return True
        else:
            return False

    def writable(self, handler):
        if owner == handler.user.user_id():
            return True
        else:
            return False

    def delete(self):
        if self.storePath:
            if os.path.exists(self.storePath):
                os.remove(self.storePath)

        super(FileWrapper, self).delete()

    @staticmethod
    def build(handler, path, data, perm = 755):
        filewrapper = FileWrapper()

        print handler.user.user_id()
        filewrapper.fromJSON( { "path" : path,
                                "data" : data,
                                "owner" : handler.user.user_id(),
                                "perm" : perm } )

        return filewrapper

    # This is practically the constructor
    def fromJSON(self, rawData, asString = False):
        if asString:
            data = json.loads(rawData)
        else:
            data = rawData
        
        if self.storePath:
            if os.path.exists(self.storePath):
                os.remove(self.storePath)

        self.path = data["path"]
        self.owner = data["owner"]
        self.perm = data["perm"]

        print self.path
        print self.perm
        print self.owner
        
        path = os.path.abspath(os.path.dirname(__file__))
        [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/')

        self.storePath = tmpfile

        f = os.fdopen(tid, 'w')
        f.write(data["data"])
        f.close()

        print "A"
        print self.path
        print self.perm
        print self.owner

    def toJSON(self, noFile = True, asString = False):
        data = None
        if not noFile:
            fileID = os.open(self.storePath, os.O_RDONLY)
            f = os.fdopen(fileID)
            data = f.read()
            f.close()

        if asString:
            return json.dumps({ "id" : self.key().id(),
                                "path" : self.path,
                                "owner" : self.owner,
                                "perm" : self.perm,
                                "data" : data })
        else:
            return { "id" : self.key().id(),
                     "path" : self.path,
                     "owner" : self.owner,
                     "perm" : self.perm,
                     "data" : data }

class FileManager():
    @staticmethod
    def getFiles(handler, path, noFile = True, asString = False):
        output = []

        for ffile in db.GqlQuery("SELECT * FROM FileWrapper WHERE owner = :1", handler.user.user_id()).run():
            print "found ", path, ffile.path
            if re.match(path, ffile.path):
                output.append(ffile.toJSON(noFile = noFile, asString = asString))

        return output

    @staticmethod
    def getFile(handler, fileID, noFile = True, asString = False):
        print fileID
        ffile = FileWrapper.get_by_id(fileID)

        print ffile.__dict__

        return ffile.toJSON(noFile = noFile, asString = asString)
    
    @staticmethod
    def createFile(handler, path, data, perm = 755):
        ffile = FileWrapper.build(handler, path, data, perm)

        ffile.put()

        print ffile.owner
        print ffile.path

        print "created file"

        return ffile.key().id()

    @staticmethod
    def deleteFile(handler, fileID):
        ffile = FileWrapper.get_by_id(fileID)
        ffile.delete()

    @staticmethod
    def updateFile(handler, fileID, jsonObject):
        ffile = FileWrapper.get_by_id(fileID)
        
        ffile.fromJSON(jsonObject)

        ffile.put()

        return ffile.key().id()

# This server expects to have a handle to a root level url
# For instance, localhost:8080/fileserver
# NOT localhost:8080/fool/fileserver
#
# Lives at localhost:8080/BackboneFiles/ for StochSS
class BackboneFileServerInterface(BaseHandler):
    def get(self, key = None, fileID = None):
        self.response.content_type = 'application/json'

        if fileID == None:
            print "Interpretted as get list"
            files = FileManager.getFiles(self, "{0}".format(key))
            
            self.response.write(json.dumps(files))
        # if req != list, then it should be a file id
        else:
            ffile = FileManager.getFile(self, int(fileID))
            
            self.response.write(json.dumps(ffile))

    def post(self):
        jsonJob = json.loads(self.request.body)
        job = JobManager.createJob(self, jsonJob)
      
        print 'CREATE', job["id"]
      
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
        req = filter(None, self.request.path.split('/'))[-1]

        self.response.content_type = 'application/json'

        FileManager.deleteJob(self, int(req))
      
        self.response.write(json.dumps([]))

# This server expects to have a handle to a root level url
# For instance, localhost:8080/fileserver
# NOT localhost:8080/fool/fileserver
#
# In the context of StochSS:
# localhost:8080/LargeFiles/
class LargeFileServerInterface(BaseHandler):
    def get(self, key, fileID, filename):
        # I need to add an interface here so people can get files not in json format... For actual download n' stuff 
        path = filter(None, self.request.path.split('/'))[1:]

        ffiles = FileManager.getFile(self, int(fileID), noFile = False)

        self.response.content_type = 'application/octet-stream'
        
        self.response.write(ffiles["data"])

    def post(self, key):
        response = []

        self.response.content_type = "application/json"
        if 'files[]' in self.request.POST:
            files = []
            for name, fieldStorage in self.request.POST.items():
                # What?
                if type(fieldStorage) is unicode:
                    continue

                fileID = FileManager.createFile(self, "{0}/{1}".format(key, fieldStorage.filename), fieldStorage.value)

                response.append(FileManager.getFile(self, fileID, noFile = True))

        self.response.write(json.dumps(response))

        #jsonJob = json.loads(self.request.body)
        #job = JobManager.createJob(self, jsonJob)
      
        #print 'CREATE', job["id"]
      
        #self.response.write(json.dumps(job))

    #def put(self):
        #req = request.uri.split('/')[-1]

        #jobId = int(req)
        #jsonJob = json.loads(self.request.body)
        #job = JobManager.updateJob(self, jsonJob)
        
        #print 'UPDATE', req, job["id"]

        #self.response.content_type = "application/json"
        #self.response.write(json.dumps(job))

    #def delete(self):
        #req = filter(None, self.request.path.split('/'))[-1]

        #self.response.content_type = 'application/json'

        #FileManager.deleteJob(self, int(req))
      
        #self.response.write(json.dumps([]))
