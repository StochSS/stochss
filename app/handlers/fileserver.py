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

# This is the Google App Engine DB object that tracks the file
#
# Files have
#    an owner (string),
#    a permisions integer (just like unix),
#    a pathKey (I should have called it application key, cause it is really designed so that
#                  each application can store its junk completely orthogonal to other apps)
#    a path (which really isn't important filesystem-wise, but can contain the name, etc, and other
#                  user side infos that are useful in the real application)
#    a storePath (which is the reference to the actual file stored on the actual device somewhere)

class FileWrapper(db.Model):
    # A reference to the user that owns this job
    owner = db.StringProperty()
    #group = db.StringProperty() -- need to implement a groupmanager
    perm = db.IntegerProperty()
    pathKey = db.StringProperty()
    path = db.StringProperty()
    storePath = db.StringProperty()
    #lastModified -- should we have this property?
    #fileType = db.StringProperty() -- should support both single files and folders

    # I don't check these yet
    def readable(self, handler):
        if owner == handler.user.user_id():
            return True
        else:
            return False

    # Nor these
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
    def build(handler, pathKey, path, data, perm = 755):
        filewrapper = FileWrapper()

        filewrapper.fromJSON( { "path" : path,
                                "pathKey" : pathKey,
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

        self.pathKey = data["pathKey"]
        self.path = data["path"]
        self.owner = data["owner"]
        self.perm = data["perm"]
        
        path = os.path.abspath(os.path.dirname(__file__))
        [tid, tmpfile] = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__)) + '/../static/tmp/')

        self.storePath = tmpfile

        f = os.fdopen(tid, 'w')
        f.write(data["data"])
        f.close()

    # I like to interact with Google DB objects as if they are JSON objects... This is what that looks like
    def toJSON(self, noFile = True, asString = False, numberBytes = None):
        data = None
        if not noFile:
            fileID = os.open(self.storePath, os.O_RDONLY)
            f = os.fdopen(fileID)

            if numberBytes:
                data = f.read(numberBytes)
            else:
                data = f.read()

            f.close()

        if asString:
            return json.dumps({ "id" : self.key().id(),
                                "pathKey" : self.pathKey,
                                "path" : self.path,
                                "owner" : self.owner,
                                "perm" : self.perm,
                                "data" : data })
        else:
            return { "id" : self.key().id(),
                     "pathKey" : self.pathKey,
                     "path" : self.path,
                     "owner" : self.owner,
                     "perm" : self.perm,
                     "data" : data }

# And here is a more useful interface to the Google DB itself, wrapped as something more filesystem-y
class FileManager():
    # These methods take noFile and asString arguments, these are:
    #    noFile == True means return no file data, just the header information
    #    asString == True, return the json object as a json string, otherwise return it as the data blob that would be passed to json.dumps to get the string

    # getFiles reutrns all the files whos pathKey matches path... Maybe I should change this? I'm confused now
    @staticmethod
    def getFiles(handler, path, noFile = True, asString = False):
        output = []

        for ffile in db.GqlQuery("SELECT * FROM FileWrapper WHERE owner = :1", handler.user.user_id()).run():
            if re.match(path, ffile.pathKey):
                output.append(ffile.toJSON(noFile = noFile, asString = asString))

        return output

    # numberBytes == None means read all the data in the file if noFile == False
    #    If numberBytes is greater than or equal to zero, it means read that number of bytes and return them 
    @staticmethod
    def getFile(handler, fileID, noFile = True, asString = False, numberBytes = None):
        ffile = FileWrapper.get_by_id(fileID)

        return ffile.toJSON(noFile = noFile, asString = asString, numberBytes = numberBytes)
   
    @staticmethod
    def createFile(handler, pathKey, path, data, perm = 755):
        ffile = FileWrapper.build(handler, pathKey, path, data, perm)

        ffile.put()

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

# Lives at localhost:8080/FileServer/backbone/ for StochSS
# For every application key (or pathKey), there is effectively a backbone file server sharing the
#    objects exported by FileWrapper.toJSON above at:
#     localhost:8080/Fileserver/backbone/<key>
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

    def delete(self, key = None, fileID = None):
        self.response.content_type = 'application/json'

        if fileID:
            fileID = int(fileID)

        FileManager.deleteFile(self, fileID)
      
        self.response.write(json.dumps([]))

# In the context of StochSS: localhost:8080/LargeFiles/
# POST:
# This handles file uploads from the jQuery-File-Upload plugin by : https://github.com/blueimp/jQuery-File-Upload at localhost:8080/FileServer/large/<key>
#
# GET:
# This also handles requests for binary forms of the files themselves (not encoded in JSON blobs like above for the backbone server)
# These requests are handled at localhost:8080/FileServer/large/<key>/<fileID>/<filename-which-isn't-really-used>. The filename is *necessary* though for distinguishing request types between the above and:
#  Requests for only the first few bytes of a file which are handled at localhost:8080/FileServer/large/<key>/<fileID>/<numberBytes>/<filename-which-isn't-really-used> where numberBytes is the number of bytes requested
class LargeFileServerInterface(BaseHandler):
    def get(self, key, fileID, numberBytes = None, filename = None):
        # I need to add an interface here so people can get files not in json format... For actual download n' stuff 
        path = filter(None, self.request.path.split('/'))[1:]
        if numberBytes != None:
            numberBytes = int(numberBytes)

        ffiles = FileManager.getFile(self, int(fileID), noFile = False, numberBytes = numberBytes)

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

                fileID = FileManager.createFile(self, "{0}".format(key), "{0}".format(fieldStorage.filename), fieldStorage.value)

                response.append(FileManager.getFile(self, fileID, noFile = True))

        self.response.write(json.dumps(response))
