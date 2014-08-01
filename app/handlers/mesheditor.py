try:
  import json
except ImportError:
  from django.utils import simplejson as json

import traceback
import re
from collections import OrderedDict
import fileserver
import shlex
import sys

from stochssapp import *
from stochss.model import *

class MeshWrapper(db.Model):
    userId = db.StringProperty()
    meshFileId = db.IntegerProperty()
    processedMeshId = db.IntegerProperty()
    
def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class MeshEditorPage(BaseHandler):

    def authentication_required(self):
        return True
    
    def get(self):
        reqType = self.request.get('reqType')
        if reqType == "getMeshes":
            self.response.content_type = 'application/json'

            meshWrappers = []
            for row in db.GqlQuery("SELECT * FROM MeshWrapper WHERE userId = :1", self.user.user_id()).run():
                #row.delete()
                #continue
                mesh = fileserver.FileManager.getFile(self, row.meshFileId, noFile = True)
                
                meshWrappers.append( { "path" : mesh["path"],
                                       "meshWrapperId" : row.key().id(),
                                       "meshFileId" : row.meshFileId,
                                       "processedMeshId" : row.processedMeshId } )

                print row.processedMeshId
                print meshWrappers[-1]

            self.response.write( json.dumps( meshWrappers ) )
            return
        else:
            model_edited = self.get_session_property('model_edited')

            if model_edited == None:
                self.render_response('modeleditor/mesheditor.html')
                return

            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            if row is None:
                self.render_response('modeleditor/mesheditor.html')
                return

            all_species = row.model.getAllSpecies()

            data = { "name" : row.model.name, "units" : row.model.units, "isSpatial" : row.isSpatial, "spatial" : row.spatial }
            
            if all_species is not None:
                self.render_response('modeleditor/mesheditor.html', **data)
            else:
                self.render_response('modeleditor/mesheditor.html')


    def post(self):
        # First, check to see if it's an update request and then route it to the appropriate function.
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == "process":
          #processedMeshFiles
          #meshFiles
          meshFiles = fileserver.FileManager.getFiles(self, "meshFiles")
          processedMeshFiles = fileserver.FileManager.getFiles(self, "processedMeshFiles")

          converted = set()
          for wrapper in db.GqlQuery("SELECT * FROM MeshWrapper WHERE user_id = :1", self.user.user_id()).run():
              converted.add(converted.meshFileId)

          allFiles = set()
          for f in meshFiles:
              allFiles.add(f["id"])

          #for f in meshFiles + processedMeshFiles:
          #    fileserver.FileManager.deleteFile(self, f["id"])
          #return

          for meshId in allFiles - converted:
              meshDb = MeshWrapper()

              meshFile = fileserver.FileManager.getFile(self, meshId, noFile = True)
              #fileserver.FileManager.deleteFile(self, meshFiles[i]["id"])

              #mesh = pyurdme.URDMEMesh.read_dolfin_mesh(meshFile["storePath"])

              path = os.path.dirname(os.path.realpath(__file__))
              handle = subprocess.Popen(shlex.split('{0}/processMesh.py {1}'.format(path, meshFile["storePath"])), stdout = subprocess.PIPE, stderr = subprocess.PIPE)
              stdout, stderr = handle.communicate()

              processedMeshFileId = fileserver.FileManager.createFile(self, "processedMeshFiles", meshFile["path"], stdout, meshFile["perm"])

              meshDb.userId = self.user.user_id()
              meshDb.meshFileId = meshFile["id"]
              meshDb.processedMeshId = int(processedMeshFileId)

              print meshDb.processedMeshId, processedMeshFileId

              meshDb.put()

          self.response.write( json.dumps( { "status" : True,
                                             "msg" : "Files processed" } ) )
        elif reqType == 'delete':
            meshWrapperId = int(self.request.get('id'))

            print "mesh", meshWrapperId

            meshWrapper = MeshWrapper.get_by_id(meshWrapperId)

            try:
                fileserver.FileManager.deleteFile(self, meshWrapper.meshFileId)
            except Exception as e:
                pass

            try:
                fileserver.FileManager.deleteFile(self, meshWrapper.processedMeshId)
            except:
                pass

            meshWrapper.delete()

            self.response.write( json.dumps( { "status" : True,
                                               "msg" : "Mesh deleted" } ) )

        else:
            return
