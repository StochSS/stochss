import logging
try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db

import pickle
import os
import traceback
import re
import random
import time
from google.appengine.api import users

from stochssapp import BaseHandler, ObjectProperty

import stochss.stochkit
import stochss.model
import stochss.examplemodels
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
        sModel.units = self.units

        for specie in self.species:
            sModel.addSpecies(stochss.model.Species(specie['name'], specie['initialCondition']))

        for parameter in self.parameters:
            sModel.addParameter(stochss.model.Parameter(parameter['name'], parameter['value']))

        for reaction in self.reactions:
            inReactants = {}
            for reactant in reaction['reactants']:
                if reactant['specie'] not in inReactants:
                    inReactants[reactant['specie']] = 0

                inReactants[reactant['specie']] += reactant['stoichiometry']

            inProducts = {}
            for product in reaction['products']:
                if product['specie'] not in inProducts:
                    inProducts[product['specie']] = 0

                inProducts[product['specie']] += product['stoichiometry']

            reactants = dict([(sModel.getSpecies(reactant[0]), reactant[1]) for reactant in inReactants.items()])

            products = dict([(sModel.getSpecies(product[0]), product[1]) for product in inProducts.items()])
            
            if(reaction['type'] == 'custom'):
                sModel.addReaction(stochss.model.Reaction(reaction['name'], reactants, products, reaction['equation'], False, None, None))
            else:
                sModel.addReaction(stochss.model.Reaction(reaction['name'], reactants, products, None, True, sModel.getParameter(reaction['rate']), None))

        return sModel

    def toJSON(self):
        return { "name" : self.name,
                 "id" : self.key().id(),
                 "units" : self.units,
                 "type" : self.type,
                 "species" : self.species,
                 "parameters" : self.parameters,
                 "reactions" : self.reactions,
                 "isSpatial" : self.isSpatial,
                 "spatial" : self.spatial,
                 "is_public" : self.is_public }

    @staticmethod
    def createFromStochKitModel(handler, model, public = False):
        species = []
        parameters = []
        reactions = []

        mesheditor.setupMeshes(handler)
        meshWrapperDb = db.GqlQuery("SELECT * FROM MeshWrapper WHERE userId = :1", handler.user.user_id()).get()

        def fixName(name):
            if re.match('^[^a-zA-Z_]', name):
                name = 'a' + name

            return re.sub('[^a-zA-Z0-9_]', '', name)

        spatial = {
          'initial_conditions' : [],
          'mesh_wrapper_id' : meshWrapperDb.key().id(),
          'reactions_subdomain_assignments': {},
          'species_diffusion_coefficients': {},
          'species_subdomain_assignments': {}
          }

        for specieName, specie in model.listOfSpecies.items():
            name = fixName(specie.name)
            species.append({ 'name' : name, 'initialCondition' : specie.initial_value })
            spatial['species_diffusion_coefficients'][name] = 0.0
            spatial['species_subdomain_assignments'][name] = meshWrapperDb.uniqueSubdomains

        for parameterName, parameter in model.listOfParameters.items():
            parameter.evaluate()
            name = fixName(parameter.name)
            parameters.append({ 'name' : name, 'value' : parameter.value })

        modelType = 'massaction'
        for reactionName, reaction in model.listOfReactions.items():
            outReaction = {}

            reactants = []
            products = []

            for reactantName, stoichiometry in reaction.reactants.items():
                reactantName = fixName(reactantName)
                reactants.append({ 'specie' : reactantName, 'stoichiometry' : stoichiometry })

            for productName, stoichiometry in reaction.products.items():
                productName = fixName(productName)
                products.append({ 'specie' : productName, 'stoichiometry' : stoichiometry })
                
            if reaction.massaction == True:
                outReaction['type'] = 'massaction'
                outReaction['rate'] = fixName(reaction.marate.name)
            else:
                modelType = 'custom'
                outReaction['type'] = 'custom'
                outReaction['equation'] = reaction.propensity_function

            outReaction['reactants'] = reactants
            outReaction['products'] = products
            outReaction['name'] = fixName(reaction.name)

            spatial['reactions_subdomain_assignments'][fixName(reaction.name)] = meshWrapperDb.uniqueSubdomains

            reactions.append(outReaction)

        names = [modelt['name'] for modelt in ModelManager.getModels(handler)]

        modelDb = StochKitModelWrapper()

        
        tmpName = fixName(model.name)
        while tmpName in names:
            tmpName = fixName(model.name) + '_' + ''.join(random.choice('abcdefghijklmnopqrztuvwxyz') for x in range(3))
        name = tmpName

        modelDb.user_id = handler.user.user_id()
        modelDb.name = name
        modelDb.type = modelType
        modelDb.species = species
        modelDb.parameters = parameters
        modelDb.reactions = reactions
        modelDb.isSpatial = False
        modelDb.units = model.units
        modelDb.spatial = spatial
        modelDb.zipFileName = None
        modelDb.is_public = public

        modelDb.put()

        return modelDb

class ModelManager():
    @staticmethod
    def getModels(handler, public = False):
        if public:
            models = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE is_public = :1", public).run()
        else:
            models = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", handler.user.user_id()).run()

        output = []

        for modelDb in models:
            #modelDb.delete()
            if not public and modelDb.is_public:
                continue

            #if public:
            #    modelDb.delete()
            #    continue

            jsonModel = modelDb.toJSON()
            jsonModel["ownedByMe"] = modelDb.user_id == handler.user.user_id()

            output.append(jsonModel)

        return output

    @staticmethod
    def getModel(handler, model_id):
        modelDb = StochKitModelWrapper.get_by_id(int(model_id))

        if modelDb == None:
            return None

        jsonModel = modelDb.toJSON()
        jsonModel["ownedByMe"] = modelDb.user_id == handler.user.user_id()
        
        return jsonModel

    @staticmethod
    def getModelByName(handler, modelName, user_id = None):
        if not user_id:
            user_id = handler.user.user_id()

        modelDb = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND name = :2", user_id, modelName).get()

        if modelDb == None:
            return None

        jsonModel = modelDb.toJSON()
        jsonModel["ownedByMe"] = modelDb.user_id == handler.user.user_id()
                
        return jsonModel

    #@staticmethod
    #def createModel(handler, model, rename = None):
    #    userID = None

        # Set up defaults
    #    if 'isSpatial' not in model or 'spatial' not in model:
    #        model['isSpatial'] = False
    #        model['spatial'] = { 'subdomains' : [],
    #                             'mesh_wrapper_id' : None,
    #                             'species_diffusion_coefficients' : {} ,
    #                             'species_subdomain_assignments' : {} ,
    #                             'reactions_subdomain_assignments' : {},
    #                             'initial_conditions' : [] }

    #    if 'is_public' not in model:
    #        model['is_public'] = False

    #    if 'user_id' in model:
    #        userID = model['user_id']
    #    else:
    #        userID = handler.user.user_id()

        # Make sure name isn't taken, or build one that isn't taken
    #    if "name" in model:
    #        tryName = model["name"]
    #        if tryName in [x.name for x in db.Query(StochKitModelWrapper).filter('user_id =', userID).run()]:
    #            if rename:
    #                i = 1
    #                tryName = '{0}_{1}'.format(model["name"], i)

    #                while tryName in [x.name for x in db.Query(StochKitModelWrapper).filter('user_id =', userID).run()]:
    #                    i = i + 1
    #                    tryName = '{0}_{1}'.format(model["name"], i)
    #            else:
    #                return None

    #    modelWrap = StochKitModelWrapper()

    #    if rename:
    #        model["name"] = tryName

    #    if "name" in model:
    #        name = model["name"]
    #    else:
    #        raise Exception("Why is this code here? modeleditor.py 185")
            #name = "tmpname"

    #    if 'isSpatial' in model:
    #        modelWrap.isSpatial = model['isSpatial']

    #    if 'spatial' in model:
    #        modelWrap.spatial = model['spatial']

    #    modelWrap.name = name

    #    modelWrap.species = model["species"]
    #    modelWrap.parameters = model["parameters"]
    #    modelWrap.reactions = model["reactions"]
    #    modelWrap.type = model["type"]
    #    modelWrap.spatial = model["spatial"]
    #    modelWrap.isSpatial = model["isSpatial"]
    #    modelWrap.is_public = model["is_public"]
    #    modelWrap.units = model["units"]
    #    modelWrap.user_id = userID

    #    return modelWrap.put().id()

    @staticmethod
    def deleteModel(handler, model_id):
        model = StochKitModelWrapper.get_by_id(model_id)

        userID = handler.user.user_id()

        if userID != model.user_id:
            raise "Error accessing model {0} with user id {1} (model owned by {2})".format(model_id, userID, model.user_id)

        model.delete()

    @staticmethod
    def updateModel(handler, jsonModel):
        createModel = False

        if "id" in jsonModel:
            modelWrap = StochKitModelWrapper.get_by_id(jsonModel["id"])

            userID = handler.user.user_id()

            if userID != modelWrap.user_id:
                raise "Error accessing model {0} with user id {1} (model owned by {2})".format(jsonModel["id"], userID, modelWrap.user_id)
        else:
            createModel = True

            modelWrap = StochKitModelWrapper()

            if 'isSpatial' not in jsonModel or 'spatial' not in jsonModel:
                jsonModel['isSpatial'] = False
                jsonModel['spatial'] = { 'subdomains' : [],
                                     'mesh_wrapper_id' : None,
                                     'species_diffusion_coefficients' : {} ,
                                     'species_subdomain_assignments' : {} ,
                                     'reactions_subdomain_assignments' : {},
                                     'initial_conditions' : [] }

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

            # Make sure we have access to a copy of the mesh
            meshDbCurrent = mesheditor.MeshWrapper.get_by_id(modelWrap.spatial["mesh_wrapper_id"])

            if createModel:
                if meshDbCurrent.userId != userID:
                    meshDb = mesheditor.MeshWrapper()

                    meshDb.userId = userID


                    names = [x.name for x in db.Query(mesheditor.MeshWrapper).filter('userId =', handler.user.user_id()).run()]
                    
                    tmpName = meshDbCurrent.name
                    i = 0
                    while tmpName in names:
                        tmpName = meshDbCurrent.name + '_' + str(i)
                        i += 1

                    meshDb.name = tmpName
                    meshDb.description = meshDbCurrent.description
                    meshDb.meshFileId = meshDbCurrent.meshFileId
                    meshDb.subdomains = meshDbCurrent.subdomains
                    meshDb.uniqueSubdomains = meshDbCurrent.uniqueSubdomains
                    meshDb.undeletable = meshDbCurrent.undeletable
                    meshDb.ghost = False
                    
                    meshDb.put()

                    modelWrap.spatial["mesh_wrapper_id"] = meshDb.key().id()
                else:
                    meshDbCurrent.ghost = False
                    meshDbCurrent.put()

            # This is maintained here!
            modelWrap.subdomains = meshDbCurrent.uniqueSubdomains

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
            models = ModelManager.getModels(self)

            self.response.write(json.dumps(models))
        elif req[-1] == 'names':
            models = ModelManager.getModels(self)

            outModels = []
            for model in models:
                outModels.append( { "id" : model["id"],
                                    "name" : model["name"] } )

            self.response.write(json.dumps(outModels))
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

class PublicModelBackboneInterface(BaseHandler):
    def get(self):
        req = filter(None, self.request.path.split('/'))
    
        self.response.content_type = 'application/json'

        #modelDb = StochKitModelWrapper.createFromStochKitModel(self, stochss.examplemodels.dimerdecay(), True)

        #print modelDb.key().id(), modelDb.user_id, modelDb.is_public
        
        if len(req) == 1 or req[-1] == 'list':
            models = ModelManager.getModels(self, public = True)

            self.response.write(json.dumps(models))
        elif req[-1] == 'names':
            models = ModelManager.getModels(self, public = True)

            outModels = []
            for model in models:
                outModels.append( { "id" : model["id"],
                                    "name" : model["name"] } )

            self.response.write(json.dumps(outModels))
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

class PublicModelPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        try:
            self.importExamplePublicModels()
        except:
            traceback.print_exc()
            print "ERROR: Failed to import example public models"

        self.render_response('publicLibrary.html')

    def importExamplePublicModels(self):
        path = os.path.abspath(os.path.dirname(__file__))
        szip = exportimport.SuperZip(zipFileName = path + "/../../examples/examples.zip")

        toImport = {}
        for name in szip.zipfb.namelist():
            if re.search('models/[a-zA-Z0-9\-_]*\.json$', name):
                toImport[json.loads(szip.zipfb.read(name))['name']] = name

        names = [model['name'] for model in ModelManager.getModels(self, public = True)]

        for name in set(toImport.keys()) - set(names):
            path = toImport[name]
            modelDb = szip.extractStochKitModel(path, "", self, rename = True)
            modelDb.user_id = ""
            modelDb.name = name
            modelDb.is_public = True
            modelDb.put()

            if modelDb.isSpatial:
                meshDb = mesheditor.MeshWrapper.get_by_id(modelDb.spatial["mesh_wrapper_id"])
                meshDb.undeletable = True
                meshDb.put()

        szip.close()

class ImportFromXMLPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('importFromXML.html')

    def post(self):
        storage = self.request.POST['datafile']

        name = storage.filename.split('.')[0]

        stochKitModel = stochss.stochkit.StochMLDocument.fromString(storage.file.read()).toModel(name)
        modelDb = StochKitModelWrapper.createFromStochKitModel(self, stochKitModel)

        self.redirect("/modeleditor?select={0}".format(modelDb.key().id()))

class ModelEditorPage(BaseHandler):
    """
        
    """
    def authentication_required(self):
        return True
    
    def get(self):
        if self.request.get('reqType') == 'exportToZip':
            modelId = int(self.request.get('id'));

            model = StochKitModelWrapper.get_by_id(modelId)
            
            try:
                if model.zipFileName:
                    if os.path.exists(model.zipFileName):
                        os.remove(model.zipFileName)

                szip = exportimport.SuperZip(os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), preferredName = model.name + "_")
                
                model.zipFileName = szip.getFileName()
                
                szip.addStochKitModel(model)
                
                szip.close()
                
                # Save the updated status
                model.put()
                
                relpath = '/' + os.path.relpath(model.zipFileName, os.path.abspath(os.path.dirname(__file__) + '/../'))
                
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps({ 'status' : True,
                                                 'msg' : 'Model prepared',
                                                 'url' : relpath }))
            except Exception as e:
                traceback.print_exc()
                result = {}
                result['status'] = False
                result['msg'] = 'Error: {0}'.format(e)
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(result))

            return

        mesheditor.setupMeshes(self)

        #f = open('/home/bbales2/stochss/test/modelEditor/client/index.html')
        #self.response.out.write(f.read())
        #f.close()
        self.render_response('modelEditor.html')
