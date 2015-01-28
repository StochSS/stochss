import logging
try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db

import pickle
import traceback
import re
import random
import time
from google.appengine.api import users

from stochssapp import BaseHandler, ObjectProperty

import stochss.stochkit
import stochss.model
import mesheditor

import webapp2
import exportimport

class StochKitModelWrapper(db.Model):
    """
    A wrapper for the StochKit Model object
    """
    user_id = db.StringProperty()
    name = db.StringProperty()
    type = db.StringProperty()
    species = ObjectProperty()
    parameters = ObjectProperty()
    reactions = ObjectProperty()
    isSpatial = db.BooleanProperty()
    units = db.StringProperty()
    spatial = ObjectProperty()
    zipFileName = db.StringProperty()
    is_public = db.BooleanProperty()

    def delete(self):
        if self.zipFileName:
            if os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        super(StochKitModelWrapper, self).delete()

    # Create a regular Stochkit model from the JSON formatted one
    def createStochKitModel(self):
        sModel = stochss.stochkit.StochKitModel(self.name)

        for specie in self.species:
            sModel.addSpecies(stochss.model.Species(specie['name'], specie['initialCondition']))

        for parameter in self.parameters:
            sModel.addParameter(stochss.model.Parameter(parameter['name'], parameter['value']))

        for reaction in self.reactions:
            reactants = dict([(sModel.getSpecies(reactant['specie']), reactant['stoichiometry']) for reactant in reaction['reactants']])
            products = dict([(sModel.getSpecies(reactant['specie']), reactant['stoichiometry']) for product in reaction['products']])

            if(reaction['type'] == 'massaction'):
                sModel.addReaction(stochss.model.Reaction(reaction['name'], reactants, products, None, True, sModel.getParameter(reaction['rate']), None))
            else:
                sModel.addReaction(stochss.model.Reaction(reaction['name'], reactants, products, reaction['equation'], False, None, None))

        return sModel

class ModelManager():
    @staticmethod
    def getModels(handler, modelAsString = True, noXML = False):
        models = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", handler.user.user_id()).run()

        output = []

        for modelDb in models:
            #modelDb.delete()
            jsonModel = { "name" : modelDb.name,
                          "id" : modelDb.key().id(),
                          "units" : modelDb.units,
                          "type" : modelDb.type,
                          "species" : modelDb.species,
                          "parameters" : modelDb.parameters,
                          "reactions" : modelDb.reactions,
                          "isSpatial" : modelDb.isSpatial,
                          "spatial" : modelDb.spatial,
                          "is_public" : modelDb.is_public }

            output.append(jsonModel)

        return output

    @staticmethod
    def getModel(handler, model_id, modelAsString = True):
        modelDb = StochKitModelWrapper.get_by_id(int(model_id))

        if modelDb == None:
            return None

        jsonModel = { "name" : modelDb.name,
                      "id" : modelDb.key().id(),
                      "species" : modelDb.species,
                      "type" : modelDb.type,
                      "parameters" : modelDb.parameters,
                      "reactions" : modelDb.reactions,
                      "units" : modelDb.units,
                      "isSpatial" : modelDb.isSpatial,
                      "spatial" : modelDb.spatial,
                      "is_public" : modelDb.is_public }
                
        return jsonModel

    @staticmethod
    def getModelByName(handler, modelName, modelAsString = True, user_id = None):
        if not user_id:
            user_id = handler.user.user_id()

        model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND name = :2", user_id, modelName).get()

        if model == None:
            return None

        jsonModel = { "name" : modelDb.name,
                      "id" : modelDb.key().id(),
                      "species" : modelDb.species,
                      "type" : modelDb.type,
                      "parameters" : modelDb.parameters,
                      "reactions" : modelDb.reactions,
                      "units" : modelDb.units,
                      "isSpatial" : modelDb.isSpatial,
                      "spatial" : modelDb.spatial,
                      "is_public" : modelDb.is_public }
                
        return jsonModel

    @staticmethod
    def createModel(handler, model, modelAsString = True, rename = None):
        userID = None

        # Set up defaults
        if 'isSpatial' not in model or 'spatial' not in model:
            model['isSpatial'] = False
            model['spatial'] = { 'subdomains' : [],
                                 'mesh_wrapper_id' : None,
                                 'species_diffusion_coefficients' : {} ,
                                 'species_subdomain_assignments' : {} ,
                                 'reactions_subdomain_assignments' : {},
                                 'initial_conditions' : {} }

        if 'is_public' not in model:
            model['is_public'] = False

        if 'user_id' in model:
            userID = model['user_id']
        else:
            userID = handler.user.user_id()

        # Make sure name isn't taken, or build one that isn't taken
        if "name" in model:
            tryName = model["name"]
            if tryName in [x.name for x in db.Query(StochKitModelWrapper).filter('user_id =', userID).run()]:
                if rename:
                    i = 1
                    tryName = '{0}_{1}'.format(model["name"], i)

                    while tryName in [x.name for x in db.Query(StochKitModelWrapper).filter('user_id =', userID).run()]:
                        i = i + 1
                        tryName = '{0}_{1}'.format(model["name"], i)
                else:
                    return None

        modelWrap = StochKitModelWrapper()

        if rename:
            model["name"] = tryName

        if "name" in model:
            name = model["name"]
        else:
            raise Exception("Why is this code here? modeleditor.py 185")
            #name = "tmpname"

        if 'isSpatial' in model:
            modelWrap.isSpatial = model['isSpatial']

        if 'spatial' in model:
            modelWrap.spatial = model['spatial']

        modelWrap.name = name

        modelWrap.species = model["species"]
        modelWrap.parameters = model["parameters"]
        modelWrap.reactions = model["reactions"]
        modelWrap.type = model["type"]
        modelWrap.spatial = model["spatial"]
        modelWrap.isSpatial = model["isSpatial"]
        modelWrap.is_public = model["is_public"]
        modelWrap.units = model["units"]
        modelWrap.user_id = userID

        return modelWrap.put().id()

    @staticmethod
    def deleteModel(handler, model_id):
        model = StochKitModelWrapper.get_by_id(model_id)
        model.delete()

    @staticmethod
    def updateModel(handler, jsonModel):

        if "id" in jsonModel:
            modelWrap = StochKitModelWrapper.get_by_id(jsonModel["id"])

            userID = handler.user.user_id()
        else:
            modelWrap = StochKitModelWrapper()

            if 'isSpatial' not in jsonModel or 'spatial' not in jsonModel:
                jsonModel['isSpatial'] = False
                jsonModel['spatial'] = { 'subdomains' : [],
                                     'mesh_wrapper_id' : None,
                                     'species_diffusion_coefficients' : {} ,
                                     'species_subdomain_assignments' : {} ,
                                     'reactions_subdomain_assignments' : {},
                                     'initial_conditions' : {} }

            # This seems insane
            if 'user_id' in jsonModel:
                userID = jsonModel['user_id']
            else:
                userID = handler.user.user_id()

        #if "name" not in jsonModel:
        #    raise Exception("Why is this code here?")

        if 'isSpatial' in jsonModel:
            modelWrap.isSpatial = jsonModel['isSpatial']

        if 'spatial' in jsonModel:
            modelWrap.spatial = jsonModel['spatial']

        if 'is_public' not in jsonModel:
            jsonModel['is_public'] = False

        modelWrap.user_id = userID
        modelWrap.name = jsonModel["name"]
        modelWrap.species = jsonModel["species"]
        modelWrap.type = jsonModel["type"]
        modelWrap.parameters = jsonModel["parameters"]
        modelWrap.reactions = jsonModel["reactions"]
        #modelWrap.spatial = jsonModel["spatial"]
        #modelWrap.isSpatial = jsonModel["isSpatial"]
        modelWrap.is_public = jsonModel["is_public"]
        modelWrap.units = jsonModel["units"]

        return modelWrap.put().id()

class ModelBackboneInterface(BaseHandler):
    def get(self):
        req = filter(None, self.request.path.split('/'))
    
        self.response.content_type = 'application/json'
        
        if len(req) == 1 or req[-1] == 'list':
            models = ModelManager.getModels(self, noXML = True)

            self.response.write(json.dumps(models))
        else:
            model = ModelManager.getModel(self, int(req[-1]))

            self.response.write(json.dumps(model))

    def post(self):
        jsonModel = json.loads(self.request.body)

        modelId = ModelManager.updateModel(self, jsonModel)
        #modelId = ModelManager.createModel(self, jsonModel, rename = True)

        self.response.content_type = "application/json"

        if modelId == None:
            self.response.set_status(500)
            self.response.write('')
        else:
            self.response.write(json.dumps(ModelManager.getModel(self, modelId)))

    def put(self):
        req = self.request.uri.split('/')[-1]

        modelId = int(req)
        jsonModel = json.loads(self.request.body)
        modelId = ModelManager.updateModel(self, jsonModel)

        self.response.content_type = "application/json"

        if modelId == None:
            self.response.write('Can\'t find model id ' + req)
            self.response.set_status(500)
        else:
            self.response.write(json.dumps(ModelManager.getModel(self, modelId)))

    def delete(self):
        model_id = self.request.uri.split('/')[-1]
      
        ModelManager.deleteModel(self, int(model_id))
      
        self.response.content_type = "application/json"
        self.response.write(json.dumps([]))

class ModelConvertPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('convert.html')

class ModelEditorPage(BaseHandler):
    """
        
    """        
    def authentication_required(self):
        return True
    
    def get(self):
        mesheditor.setupMeshes(self)

        #f = open('/home/bbales2/stochss/test/modelEditor/client/index.html')
        #self.response.out.write(f.read())
        #f.close()
        self.render_response('modelEditor.html')
