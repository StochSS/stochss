import logging
from google.appengine.ext import db

import pickle
import os
import re
import random

import stochss.stochkit
import stochss.model

from db_models.object_property import ObjectProperty

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

    #def isMassAction(self):
    #    isMassAction = True

    #    for reaction in self.reactions:
    #        if(reaction['type'] == 'custom'):
    #            isMassAction = False

    #    return isMassAction

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
