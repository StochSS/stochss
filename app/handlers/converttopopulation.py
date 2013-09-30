try:
    import json
except ImportError:
    from django.utils import simplejson as json

import traceback
from collections import OrderedDict

from stochssapp import *
from stochss.model import *

class ConvertToPopulationPage(BaseHandler):

    def get(self):
        results = self.render_data()

        if results["minimum"] is not None and results["maximum"] is not None:
            self.render_response('modeleditor/converttopopulation.html', **results)
        else:
            self.render_response('modeleditor/converttopopulation.html')


    def post(self):
        result = self.create_model()

        if result["status"] == False:
            result.update(self.render_data())
            self.render_response('modeleditor/converttopopulation.html', **result)
        else:
            self.redirect('/modeleditor/specieseditor')

    def render_data(self):
        model = self.get_session_property('model_edited')

        if model == None:
            self.render_response('modeleditor/converttopopulation.html')
            return

        all_species = model.getAllSpecies()

        max_species = None
        min_species = None

        for species_name in all_species:
            species = all_species[species_name]

            if max_species == None:
                max_species = species

            if min_species == None and species.initial_value > 0:
                min_species = species

            if min_species != None:
                if min_species.initial_value > species.initial_value and species.initial_value > 0:
                    min_species = species

            if max_species != None:
                if max_species.initial_value < species.initial_value:
                    max_species = species
        
        return { 'minimum' : min_species,
                 'maximum' : max_species };

    def create_model(self):
        """
          Creates a new ModelWrapper and stores it in the Datastore.
          Parameters:
            name:  To identify the given model.
            model: The Model string

          Returns:
            A dict that indicates the status of this call.
        """
        name = self.request.get('name').strip()

        volume = float(self.request.get('volume'))
        units = "population"
        if not name:
          return {'status': False, 'msg': 'Model name is missing.'}

        if not units:
          return {'status': False, 'msg': 'Units are missing.'}

        model = self.get_session_property('model_edited')

        model = model.toPopulation(volume)

        model.name = name

        try:
          user_id = self.user.user_id()
          logging.debug("user_id " + user_id)  
          
          #db_model = StochKitModelWrapper.get_by_key_name(key_name)
          db_model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", user_id, name).get()
          
          if db_model is not None:
              return {'status': False, 'msg': 'A Model already exists by that name.', 'name': name}
          
          # After creating the model and before setting this as the currently edited model, check if the previously edited model was saved.
          is_model_saved = self.get_session_property('is_model_saved')
          if is_model_saved is not None and not is_model_saved:
              logging.debug('old_model: ' + self.get_session_property('model_edited').name)
              return {'status': False, 'msg': 'Please save your changes first!', 'is_saved': False}
          
          save_model(model, name, user_id)
          
          # Also add the model name to cache.
          add_model_to_cache(self, name)

          # Set the new model as the one that is being edited.
          self.set_session_property('model_edited', model)

          return {'status': True, 'msg': 'Model created successfully!'}
        except Exception, e:
          logging.error("converttopopulation::create_model: Model creation failed with error %s", e)
          traceback.print_exc()
          return {'status': False, 'msg': 'There was an error while creating the model.'}

def save_model(model, model_name, user_id):
    """ Save model as a new entity. """
    db_model = StochKitModelWrapper()
    db_model.user_id = user_id
    db_model.model = model
    db_model.model_name = model_name
    db_model.put()
