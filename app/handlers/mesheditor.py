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
import pyurdme

from stochssapp import *
from stochss.model import *
#import modeleditor.ObjectProperty

#right here

class MeshWrapper(db.Model):
    userId = db.StringProperty()
    path = db.StringProperty()
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
        if True == True:
            base = os.path.dirname(os.path.realpath(__file__)) + '/../static/spatial/'
            files = set([ 'coli_with_membrane_mesh.xml',
                          'cylinder_mesh.xml',
                          'unit_cube_with_membrane_mesh.xml',
                          'unit_sphere_with_membrane_mesh.xml' ])
            
            converted = set()
            for wrapper in db.GqlQuery("SELECT * FROM MeshWrapper").run():
                wrapper.delete()
                #converted.add(wrapper.path)

            for fileName in files - converted:
                meshDb = MeshWrapper()
                
                #path = os.path.dirname(os.path.realpath(__file__))
                #handle = subprocess.Popen(shlex.split('{0}/processMesh.py {1}'.format(path, os.path.join(base, fileName))), stdout = subprocess.PIPE, stderr = subprocess.PIPE)
                #stdout, stderr = handle.communicate()

                stdout = pyurdme.URDMEMesh.read_dolfin_mesh(os.path.join(base, fileName)).export_to_three_js()

                #print stdout, stderr

                processedMeshFileId = fileserver.FileManager.createFile(self, "processedMeshFiles", fileName, stdout, 777)
                
                meshDb.userId = self.user.user_id()
                meshDb.path = fileName
                meshDb.processedMeshId = int(processedMeshFileId)
        
                meshDb.put()
            
                #return

        reqType = self.request.get('reqType')
        if reqType == "getMeshInfo":
            self.response.content_type = 'application/json'
            model_edited = self.get_session_property('model_edited')

            if model_edited == None:
                self.render_response('modeleditor/mesheditor.html')
                return

            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            if row is None:
                self.render_response('modeleditor/mesheditor.html')
                return

            meshWrappers = []
            for wrapperRow in db.GqlQuery("SELECT * FROM MeshWrapper").run():
                meshWrappers.append( { "path" : wrapperRow.path,
                                       "meshWrapperId" : wrapperRow.key().id(),
                                       "processedMeshId" : wrapperRow.processedMeshId } )

            print row.spatial['species_subdomain_assignments']

            data = { 'meshes' : meshWrappers,
                     'subdomains' : row.spatial['subdomains'],
                     'reactionsSubdomainAssignments' : row.spatial['species_subdomain_assignments'],
                     'speciesSubdomainAssignments' : row.spatial['reactions_subdomain_assignments'] }

            self.response.write( json.dumps( data ) )
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

        raise "shouldn't ever get here"

        return
