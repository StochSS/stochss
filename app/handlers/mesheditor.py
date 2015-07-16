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

from db_models.mesh import MeshWrapper
    
def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class MeshManager():
    @staticmethod
    def getMeshes(handler):
        meshes = db.GqlQuery("SELECT * FROM MeshWrapper WHERE user_id = :1", handler.user.user_id()).run()

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
        if 'user_id' in jsonMesh:
            userId = jsonMesh['user_id']
        else:
            userId = handler.user.user_id()

        if "id" in jsonMesh:
            meshDb = MeshWrapper.get_by_id(jsonMesh["id"])
            name = jsonMesh["name"]
        else:
            # Make sure name isn't taken, or build one that isn't taken
            if "name" in jsonMesh:
                name = jsonMesh["name"]
                usedNames = set([x.name for x in db.Query(MeshWrapper).filter('user_id =', userId).run()])
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

        meshDb.user_id = userId
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
    try:
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
        for wrapper in db.GqlQuery("SELECT * FROM MeshWrapper WHERE user_id = :1", handler.user.user_id()).run():
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
            
            meshDb.user_id = handler.user.user_id()
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
    except:
        traceback.print_exc()
        print "ERROR: Failed to import example public models"

