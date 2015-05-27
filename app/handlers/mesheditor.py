try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db

import traceback
import re
import os
from collections import OrderedDict
import fileserver
import shlex
import sys
import pyurdme
import numpy
import tempfile
import shutil

from stochssapp import BaseHandler, ObjectProperty
from stochss.model import *

#right here

class MeshWrapper(db.Model):
    userId = db.StringProperty()
    name = db.StringProperty()
    description = db.TextProperty()
    meshFileId = db.IntegerProperty()
    subdomains = ObjectProperty()
    uniqueSubdomains = ObjectProperty()
    volumes = ObjectProperty()
    boundingBox = ObjectProperty()
    undeletable = db.BooleanProperty()
    ghost = db.BooleanProperty()

    def toJSON(self, reduced = True):
        return { "userId" : self.userId,
                 "name" : self.name,
                 "description" : self.description,
                 "meshFileId" : self.meshFileId,
                 "subdomains" : self.subdomains if not reduced else [],
                 "volumes" : self.volumes,
                 "boundingBox" : self.boundingBox,
                 "uniqueSubdomains" : self.uniqueSubdomains,
                 "undeletable" : bool(self.undeletable),
                 "ghost" : bool(self.ghost),
                 "id" : self.key().id() }

    def delete(self):
        try:
            fileserver.FileManager.deleteFile(self, self.meshFileId)
        except IOError as error:
            sys.stderr.write('Failed to delete meshFile {0} in meshwrapper destructor\n'.format(self.meshFileId))

        super(MeshWrapper, self).delete()
    
def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class MeshManager():
    @staticmethod
    def getMeshes(handler):
        meshes = db.GqlQuery("SELECT * FROM MeshWrapper WHERE userId = :1", handler.user.user_id()).run()

        output = []

        for meshDb in meshes:
            #meshDb.delete()
            output.append(meshDb.toJSON(reduced = False))

        return output

    @staticmethod
    def getMesh(handler, meshId):
        meshDb = MeshWrapper.get_by_id(int(meshId))

        if meshDb == None:
            return None

        return meshDb.toJSON(reduced = False)

    # This also creates
    @staticmethod
    def updateMesh(handler, jsonMesh, rename = False):
        if "undeletable" not in jsonMesh:
            jsonMesh["undeletable"] = False

        # This basically says to prefer the userId in the input
        if 'userId' in jsonMesh:
            userId = jsonMesh['userId']
        else:
            userId = handler.user.user_id()

        if "id" in jsonMesh:
            meshDb = MeshWrapper.get_by_id(jsonMesh["id"])
            name = jsonMesh["name"]
        else:
            # Make sure name isn't taken, or build one that isn't taken
            if "name" in jsonMesh:
                name = jsonMesh["name"]
                usedNames = set([x.name for x in db.Query(MeshWrapper).filter('userId =', userId).run()])
                if name in usedNames:
                    if rename:
                        i = 1
                        name = '{0}_{1}'.format(jsonMesh["name"], i)
                        
                        while name in usedNames:
                            i = i + 1
                            name = '{0}_{1}'.format(jsonMesh["name"], i)
                    else:
                        raise Exception("Name is required on new meshes")

            meshDb = MeshWrapper()

        meshDb.userId = userId
        meshDb.name = name
        meshDb.description = jsonMesh["description"]
        meshDb.meshFileId = jsonMesh["meshFileId"]
        meshDb.subdomains = jsonMesh["subdomains"]
        meshDb.uniqueSubdomains = jsonMesh["uniqueSubdomains"]
        meshDb.undeletable = jsonMesh["undeletable"]

        pymodel = pyurdme.URDMEModel(name = 'test')
        meshFileObj = fileserver.FileManager.getFile(handler, meshDb.meshFileId)
        pymodel.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(meshFileObj["storePath"]))
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

        pymodel.set_subdomain_vector(numpy.array(meshDb.subdomains))
        sd = pymodel.get_subdomain_vector()
        vol_accumulator = numpy.zeros(numpy.unique(sd).shape)
        for ndx, v in enumerate(pymodel.get_solver_datastructure()['vol']):
            vol_accumulator[sd[ndx] - 1] += v

        volumes = {}

        for s, v in enumerate(vol_accumulator):
            volumes[s + 1] = v

        meshDb.volumes = volumes
        meshDb.boundingBox = [[minx, maxx], [miny, maxy], [minz, maxz]]

        return meshDb.put().id()

    @staticmethod
    def deleteMesh(handler, meshId):
        meshDb = MeshWrapper.get_by_id(meshId)
        meshDb.ghost = True
        meshDb.put()

class MeshBackboneInterface(BaseHandler):
    def get(self):
        req = filter(None, self.request.path.split('/'))

        self.response.content_type = 'application/json'
        
        if len(req) == 1 or req[-1] == 'list':
            meshes = MeshManager.getMeshes(self)

            self.response.write(json.dumps(meshes))
        elif req[-2] == 'threeJsMesh':
            meshFileObj = fileserver.FileManager.getFile(self, int(req[-1]))
            meshFileName = meshFileObj["storePath"]

            #colors = []
            #print data['selectedSubdomains']
            #for subdomain in subdomains:
            #    if subdomain in data['selectedSubdomains']:
            #        colors.append('red')
            #    else:
            #        colors.append('black')
                    
            threejs = pyurdme.URDMEMesh.read_dolfin_mesh(str(meshFileName)).export_to_three_js()

            self.response.write( threejs )
        else:
            mesh = MeshManager.getMesh(self, int(req[-1]))

            self.response.write(json.dumps(mesh))

    def post(self):
        jsonMesh = json.loads(self.request.body)

        meshId = MeshManager.updateMesh(self, jsonMesh, rename = True)

        self.response.content_type = "application/json"

        if meshId == None:
            self.response.set_status(500)
            self.response.write('')
        else:
            self.response.write(json.dumps(MeshManager.getMesh(self, meshId)))

    def put(self):
        req = self.request.uri.split('/')[-1]

        meshId = int(req)
        jsonMesh = json.loads(self.request.body)
        meshId = MeshManager.updateMesh(self, jsonMesh)

        self.response.content_type = "application/json"

        if meshId == None:
            self.response.write('Can\'t find mesh id ' + req)
            self.response.set_status(500)
        else:
            self.response.write(json.dumps(MeshManager.getMesh(self, meshId)))

    def delete(self):
        meshId = self.request.uri.split('/')[-1]
      
        MeshManager.deleteMesh(self, int(meshId))
      
        self.response.content_type = "application/json"
        self.response.write(json.dumps([]))

def setupMeshes(handler):
    base = os.path.dirname(os.path.realpath(__file__)) + '/../static/spatial/'

    files = [ 'coli_with_membrane_mesh.xml',
              'cylinder_mesh.xml',
              'unit_cube_with_membrane_mesh.xml',
              'unit_sphere_with_membrane_mesh.xml' ]
                
    descriptions = { 'coli_with_membrane_mesh.xml' : 'Simplified E-coli model mesh',
                     'cylinder_mesh.xml' : 'Cylindrical domain',
                     'unit_cube_with_membrane_mesh.xml' : 'Cubic domain of edge length 1.0',
                     'unit_sphere_with_membrane_mesh.xml' : 'Spherical domain with radius 1.0' }
    
    namesToFilenames = { 'E-coli with membrane' : 'coli_with_membrane_mesh.xml',
                         'Cylinder' : 'cylinder_mesh.xml',
                         'Unit cube' : 'unit_cube_with_membrane_mesh.xml',
                         'Unit sphere' : 'unit_sphere_with_membrane_mesh.xml' }
    
    converted = set()
    for wrapper in db.GqlQuery("SELECT * FROM MeshWrapper WHERE userId = :1", handler.user.user_id()).run():
        converted.add(wrapper.name)

    for name in set(namesToFilenames.keys()) - converted:
        fileName = namesToFilenames[name]
        
        meshDb = MeshWrapper()
        
        # To get the subdomains, there is a .txt file stored along with every .xml
        baseName, ext = os.path.splitext(fileName)
        subdomainsFile = open(os.path.join(base, baseName + '.txt'), 'r')

        subdomains = []

        for line in subdomainsFile.read().split():
            v, s = line.strip().split(',')

            v = int(v)
            s = int(float(s))
                        
            subdomains.append((v, s))

        subdomainsFile.close()

        subdomains = [y for x, y in sorted(subdomains, key = lambda x : x[0])]
        uniqueSubdomains = list(set(subdomains))

        meshFile = open(os.path.join(base, fileName), 'r')
        meshFileId = fileserver.FileManager.createFile(handler, "meshFiles", fileName, meshFile.read(), 777)
        meshFile.close()
        
        meshDb.userId = handler.user.user_id()
        meshDb.name = name
        meshDb.description = descriptions[fileName]
        meshDb.meshFileId = int(meshFileId)
        meshDb.subdomains = subdomains
        meshDb.uniqueSubdomains = uniqueSubdomains
        meshDb.undeletable = True

        pymodel = pyurdme.URDMEModel(name = 'test')
        pymodel.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(os.path.join(base, fileName)))
        coordinates = pymodel.mesh.coordinates()
        minx = numpy.min(coordinates[:, 0])
        maxx = numpy.max(coordinates[:, 0])
        miny = numpy.min(coordinates[:, 1])
        maxy = numpy.max(coordinates[:, 1])
        minz = numpy.min(coordinates[:, 2])
        maxz = numpy.max(coordinates[:, 2])
        pymodel.add_species(pyurdme.Species('T', 1))
        pymodel.set_subdomain_vector(numpy.array(subdomains))
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
        
    """def post(self):
        try:
            # First, check to see if it's an update request and then route it to the appropriate function.
            reqType = self.request.get('reqType')
            self.response.content_type = 'application/json'

        
            model_edited = self.get_session_property('model_edited')
            if model_edited == None:
                self.render_response('modeleditor/specieseditor.html')
                return

            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            if row is None:
                self.render_response('modeleditor/specieseditor.html')
                return

            if self.request.get('reqType') == 'setMesh':
                # Looks like a speciesSubdomainAssignments request
                self.response.content_type = 'application/json'

                #print 'QWTASDFFASDFASDFSDAJKL;FSADFDSAJKL;FASD'
            
                data = json.loads( self.request.get('data') );

                meshWrapperId = data['meshWrapperId']

                # Acquire updated subdomains (if there are any)
                meshDb = MeshWrapper.get_by_id(meshWrapperId)

                meshFile = fileserver.FileManager.getFile(self, meshDb.meshFileId)
                
                row.spatial['subdomains'] = []
                if meshDb.subdomainsFileId:
                    sdFile = fileserver.FileManager.getFile(self, meshDb.subdomainsFileId)
                    newSubdomains = set()

                    sdHandle = open(sdFile['storePath'], 'r')
                    for line in sdHandle:
                        v, l = line.strip().split(',')
                
                        l = int(float(l))
                
                        newSubdomains.add(l)

                    sdHandle.close()

                    row.spatial['subdomains'] = list(newSubdomains)

                    row.spatial['species_subdomain_assignments'] = {}
                    row.spatial['reactions_subdomain_assignments'] = {}

                    for speciesId in row.model.listOfSpecies.keys():
                        row.spatial['species_subdomain_assignments'][speciesId] = list(newSubdomains)

                    for reactionId in row.model.listOfReactions.keys():
                        row.spatial['reactions_subdomain_assignments'][reactionId] = list(newSubdomains)
                else:
                    row.spatial['subdomains'] = [1]

                    for speciesId in row.spatial['species_subdomain_assignments']:
                        row.spatial['species_subdomain_assignments'][speciesId] = [1]

                    for reactionId in row.spatial['reactions_subdomain_assignments']:
                        row.spatial['reactions_subdomain_assignments'][reactionId] = [1]

                    row.spatial['initial_conditions'] = {}

                row.spatial['mesh_wrapper_id'] = meshWrapperId

                row.put()
            
                meshWrappers = []
                for wrapperRow in db.GqlQuery("SELECT * FROM MeshWrapper").run():
                    meshWrappers.append( wrapperRow.toJSON() )

                data = { 'meshes' : meshWrappers,
                         'meshWrapperId' : row.spatial['mesh_wrapper_id'],
                         'selectedMesh' : meshDb.toJSON(),
                         'subdomains' : row.spatial['subdomains'],
                         'initialConditions' : row.spatial['initial_conditions'],
                         'reactionsSubdomainAssignments' : row.spatial['reactions_subdomain_assignments'],
                         'speciesSubdomainAssignments' : row.spatial['species_subdomain_assignments'] }

                self.response.write(json.dumps( data ))
                return
            if self.request.get('reqType') == 'setName':
                # Looks like a speciesSubdomainAssignments request
                self.response.content_type = 'application/json'

                data = json.loads( self.request.get('data') );

                meshWrapperId = data['id']

                meshDb = MeshWrapper.get_by_id(meshWrapperId)

                meshDb.name = data['newName']
                
                meshDb.put()
            
                self.response.write(json.dumps( { "statu" : True,
                                                  "msg" : 'Name updated' } ))
                return
            elif self.request.get('reqType') == 'getMesh':
                return
            elif self.request.get('reqType') == 'deleteMesh':
                data = json.loads( self.request.get('data') );
                meshWrapperDb = MeshWrapper.get_by_id(data['id'])

                meshWrapperDb.delete()

                self.response.write( { "status" : False, "msg" : "Mesh deleted" })
                return
            elif self.request.get('reqType') == 'setInitialConditions':
                data = json.loads( self.request.get('data') );

                row.spatial['initial_conditions'] = data['initialConditions']

                #print data['initialConditions']
                #print row.spatial['initial_conditions']

                row.put()

                self.response.write( json.dumps( { "status" : True, "msg" : "Initial conditions updated" } ) )
                return
            elif reqType == 'addMeshWrapper':
                meshDb = MeshWrapper()
                data = json.loads(self.request.get('data'))

                meshFile = fileserver.FileManager.getFile(self, data['meshFileId'])
                basename, ext = os.path.splitext(meshFile['path'])

                meshDb.userId = self.user.user_id()
                meshDb.name = data['name']
                meshDb.description = data['description']
                meshDb.meshFileId = data['meshFileId']
                meshDb.subdomainsFileId = data['subdomainsFileId'] if 'subdomainsFileId' in data else None
                meshDb.ghost = False
                meshDb.undeletable = False
                
                meshDb.put()
                
                self.response.write( json.dumps( meshDb.toJSON() ) )
                return
        except Exception, error:
            traceback.print_exc()
            result = { "status" : False,
                       "msg" : 'Internal StochSS error: {0}'.format(error) }
            self.error(500)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
"""
