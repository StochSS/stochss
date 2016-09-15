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
import tempfile
import time
import datetime
from google.appengine.api import users

from stochssapp import BaseHandler

import stochss.stochkit
import stochss.model
import stochss.examplemodels
import stochss.SBMLconverter
import mesheditor

import webapp2
import exportimport

from db_models.model import StochKitModelWrapper
from db_models.sbml_import_logs import SBMLImportErrorLogs

def createStochKitModelWrapperFromStochKitModel(handler, model, public = False):
    species = []
    parameters = []
    reactions = []
    
    meshWrapperDb = db.GqlQuery("SELECT * FROM MeshWrapper WHERE user_id = :1", handler.user.user_id()).get()
    
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

        totalReactants = 0
        reactantCount = len(reaction.reactants.items())
        productCount = len(reaction.products.items())
        for reactantName, stoichiometry in reaction.reactants.items():
            reactantName = fixName(reactantName)
            reactants.append({ 'specie' : reactantName, 'stoichiometry' : stoichiometry })
            totalReactants += stoichiometry

        for productName, stoichiometry in reaction.products.items():
            productName = fixName(productName)
            products.append({ 'specie' : productName, 'stoichiometry' : stoichiometry })
                
        if reaction.massaction == True:
            outReaction['type'] = 'massaction'
            outReaction['rate'] = fixName(reaction.marate.name)

            if reactantCount == 0 and productCount == 1:
                outReaction['type'] = 'creation'
            elif reactantCount == 1 and productCount == 0:
                outReaction['type'] = 'destruction'
            elif reactantCount == 2 and productCount == 1:
                outReaction['type'] = 'merge'
            elif reactantCount == 1 and productCount == 1 and totalReactants == 1:
                outReaction['type'] = 'change'
            elif reactantCount == 1 and productCount == 1 and totalReactants == 2:
                outReaction['type'] = 'dimerization'
            elif reactantCount == 1 and productCount == 2:
                outReaction['type'] = 'split'
            elif reactantCount == 2 and productCount == 2:
                outReaction['type'] = 'four'

            if totalReactants > 2:
                raise Exception("Error in Reaction {0}: StochKit mass action reactions cannot have more than 2 total reacting particles. Total stoichiometry for this reaction is {1}".format(reactionName, totalRreactants))
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
    modelDb.sbmlFileName = None
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

            # Make sure we have access to a copy of the mesh (if it exists)
            if "mesh_wrapper_id" in modelWrap.spatial and modelWrap.spatial["mesh_wrapper_id"]:
                meshDbCurrent = mesheditor.MeshWrapper.get_by_id(modelWrap.spatial["mesh_wrapper_id"])

                if createModel:
                    if meshDbCurrent.user_id != userID:
                        meshDb = mesheditor.MeshWrapper()

                        meshDb.user_id = userID


                        names = [x.name for x in db.Query(mesheditor.MeshWrapper).filter('user_id =', handler.user.user_id()).run()]
                    
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
                        meshDb.undeletable = False#meshDbCurrent.undeletable
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
        #importExamplePublicModels(self)

        self.render_response('publicLibrary.html')

def importExamplePublicModels(handler):
    try:
        path = os.path.abspath(os.path.dirname(__file__))
        szip = exportimport.SuperZip(zipFileName = path + "/../../examples/examples.zip")
    
        toImport = {}
        for name in szip.zipfb.namelist():
            if re.search('models/[a-zA-Z0-9\-_]*\.json$', name):
                toImport[json.loads(szip.zipfb.read(name))['name']] = name

        names = [model['name'] for model in ModelManager.getModels(handler, public = True)]

        for name in set(toImport.keys()) - set(names):
            path = toImport[name]
            modelDb = szip.extractStochKitModel(path, "", handler, rename = True)
            modelDb.user_id = ""
            modelDb.name = name
            modelDb.is_public = True
            modelDb.put()
        
            if modelDb.isSpatial:
                meshDb = mesheditor.MeshWrapper.get_by_id(modelDb.spatial["mesh_wrapper_id"])
                #meshDb.undeletable = True
                meshDb.put()

        szip.close()
    except:
        traceback.print_exc()
        print "ERROR: Failed to import example public models"

class ImportFromXMLPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('importFromXML.html')

    def post(self):
        try:
            storage = self.request.POST['datafile']

            name = storage.filename.split('.')[0]

            stochKitModel = stochss.stochkit.StochMLDocument.fromString(storage.file.read()).toModel(name)

            if len(stochKitModel.listOfParameters) == 0 and len(stochKitModel.listOfSpecies) == 0 and len(stochKitModel.listOfReactions) == 0:
                raise Exception("No parameters, species, or reactions detected in model. This XML file is probably not a StochKit Model")

            modelDb = createStochKitModelWrapperFromStochKitModel(self, stochKitModel)
            
            self.redirect("/modeleditor?select={0}".format(modelDb.key().id()))
        except Exception as e:
            traceback.print_exc()
            result = {}
            result['status'] = False
            result['msg'] = 'Error: {0}'.format(e)

            self.render_response("importFromXML.html", **result)

class ImportFromSBMLPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        if 'reqType' in self.request.GET:
            if self.request.get('reqType') == 'delete':
                errorLogsId = int(self.request.get('id'));
                    
                errorLogsDb = SBMLImportErrorLogs.get_by_id(errorLogsId)

                errorLogsDb.delete()
                    
                self.redirect("/importFromSBML")

        errorLogsDbQuery = list(db.GqlQuery("SELECT * FROM SBMLImportErrorLogs WHERE user_id = :1", self.user.user_id()).run())
        errorLogsDbQuery = sorted(errorLogsDbQuery, key = lambda x : (datetime.datetime.strptime(x.date, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'date') and x.date != None else datetime.datetime.now()), reverse = True)

        result = []

        for error in errorLogsDbQuery:
            modelDb = StochKitModelWrapper.get_by_id(error.modelId)
            result.append( { 'id' : error.key().id(),
                             'date' : error.date,
                             'fileName' : error.fileName,
                             'modelName' : modelDb.name if modelDb else None } )

        self.render_response('importFromSBML.html', **{ "errors" : result })

    def post(self):
        try:
            storage = self.request.POST['datafile']

            name = storage.filename.split('.')[0]

            tmp = tempfile.NamedTemporaryFile(delete = False)
            filename = tmp.name
            tmp.write(storage.file.read())
            tmp.close()

            #stochKitModel = stochss.stochkit.StochMLDocument.fromString(storage.file.read()).toModel(name)
            model, errors = stochss.SBMLconverter.convertToStochSS(filename)

            modelDb = createStochKitModelWrapperFromStochKitModel(self, model)
            
            modelDb.units = model.units
            modelDb.put()

            errorLogsDb = SBMLImportErrorLogs()
            errorLogsDb.modelId = modelDb.key().id()
            errorLogsDb.user_id = self.user.user_id()
            errorLogsDb.fileName = storage.filename
            errorLogsDb.errors = errors
            errorLogsDb.date = time.strftime("%Y-%m-%d-%H-%M-%S")
            errorLogsDb.put()

            os.remove(filename)
            
            #self.redirect("/modeleditor?select={0}".format(modelDb.key().id()))
            self.redirect("/SBMLErrorLogs?id={0}".format(errorLogsDb.key().id()))
        except Exception as e:
            traceback.print_exc()
            result = {}
            result['status'] = False
            result['msg'] = 'Error: {0}'.format(e)

            self.render_response("importFromSBML.html", **result)

class SBMLErrorLogsPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        if 'id' in self.request.GET:
            errorLogsId = int(self.request.get('id'));
            errorLogsDb = SBMLImportErrorLogs.get_by_id(errorLogsId)

            modelDb = StochKitModelWrapper.get_by_id(errorLogsDb.modelId)

            result = { "db" : errorLogsDb,
                       "modelName" : modelDb.name if modelDb else None }

            print result["db"].errors

        self.render_response('SBMLErrorLogs.html', **result)

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
        elif self.request.get('reqType') == 'exportToSBML':
            modelId = int(self.request.get('id'));

            model = StochKitModelWrapper.get_by_id(modelId)
            
            try:
                if model.sbmlFileName:
                    if os.path.exists(model.sbmlFileName):
                        os.remove(model.sbmlFileName)

                fd, fname = tempfile.mkstemp(dir = os.path.abspath(os.path.dirname(__file__) + '/../static/tmp/'), prefix = model.name + "_", suffix = '.sbml')

                os.close(fd)

                stochss.SBMLconverter.convertToSBML(fname, model)

                model.sbmlFileName = fname

                # Save the updated status
                model.put()
                
                relpath = '/' + os.path.relpath(fname, os.path.abspath(os.path.dirname(__file__) + '/../'))
                
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

        #mesheditor.setupMeshes(self)

        self.render_response('modelEditor.html')
