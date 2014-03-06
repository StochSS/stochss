try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db
import pickle
import zipfile, tempfile
import sys, time, random
import simulation, modeleditor
import shutil

from stochss.model import *
from stochss.stochkit import *
from stochss.examplemodels import *
import logging

class SuperZip:
    def __init__(self, directory = None, zipFileName = None, preferredName = "backup_", cloudJobsToDownload = []):
        self.cloudJobsToDownload = cloudJobsToDownload
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
            fileName = '{0}/{1}_{2}'.format(basename, preferredName, ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3)))

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
        jsonModel = {
            "version" : self.version,
            "name" : model.model_name,
            "user_id" : None#model.user_id
        }

        if model.attributes:
            jsonModel.update(model.attributes)
            
        jsonModel["units"] = model.model.units

        jsonModel["model"] = self.addBytes('models/data/{0}.xml'.format(model.model_name), model.model.serialize())
        self.addBytes('models/{0}.json'.format(model.model_name), json.dumps(jsonModel, sort_keys=True, indent=4, separators=(', ', ': ')))

    def close(self):
        if self.zipfb:
            self.zipfb.close()

        if self.zipfbFile:
            self.zipfbFile.close()

