try:
  import json
except ImportError:
  from django.utils import simplejson as json

import traceback
import re
from collections import OrderedDict

from stochssapp import *
from stochss.model import *

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class SpeciesEditorPage(BaseHandler):

    def authentication_required(self):
        return True
    
    def get(self):
        # There are two types of requests that will come to this page:
        #    Regular user attemps to load a page
        #    And ajax requests to get the speciesSubdomainAssignments for a given model
        # Both request types need the model loaded up tho
        model_edited = self.get_session_property('model_edited')
        if model_edited == None:
            self.render_response('modeleditor/specieseditor.html')
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            self.render_response('modeleditor/specieseditor.html')
            return

        if self.request.get('reqType') == 'speciesSubdomainAssignments':
            # Looks like a speciesSubdomainAssignments request
            self.response.content_type = 'application/json'

            if 'species_subdomain_assignments' in row.spatial:
                speciesSubdomainAssignments = row.spatial['species_subdomain_assignments']
            else:
                speciesSubdomainAssignments = None
            
            self.response.write( json.dumps( { 'subdomains' : row.spatial['subdomains'],
                                               'speciesSubdomainAssignments' : speciesSubdomainAssignments } ) )
            return
        else:
            # Looks like a user request
            all_species = row.model.getAllSpecies()

            data = {'all_species': row.model.getAllSpecies(), "name" : row.model.name, "units" : row.model.units, "isSpatial" : row.isSpatial, "spatial" : row.spatial }

            if all_species is not None:
                self.render_response('modeleditor/specieseditor.html', **data)
            else:
                self.render_response('modeleditor/specieseditor.html')

    def post(self):
        # There are two types of requests that could be made to this server
        #    1. Old style form posts from the original StochSS code which handles species name/initial value/diffusion constant changes
        #    2. and jquery requests from the new js that handles (in spatial models) changes to the species/subdomain mapping
        
        model_edited = self.get_session_property('model_edited')
        if model_edited == None:
            self.render_response('modeleditor/specieseditor.html')
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            self.render_response('modeleditor/specieseditor.html')
            return

        if self.request.get('reqType') == 'setSpeciesSubdomainAssignment':
            # Looks like a speciesSubdomainAssignments request
            self.response.content_type = 'application/json'

            data = json.loads( self.request.get('data') );

            speciesId = data['speciesId']
            subdomainId = data['subdomainId']
            value = data['value']

            selectedSubdomains = row.spatial['species_subdomain_assignments'][speciesId]

            if value:
                if subdomainId not in selectedSubdomains:
                    selectedSubdomains.append(subdomainId)
            else:
                if subdomainId in selectedSubdomains:
                    selectedSubdomains.remove(subdomainId)

            row.spatial['species_subdomain_assignments'][speciesId] = selectedSubdomains

            row.put()
            
            self.response.write( json.dumps( { "status" : True,
                                               "msg" : "Species {0} subdomain assignment updated".format(speciesId) } ) )
            return
        else:
            # First, check to see if it's an update request and then route it to the appropriate function. Update requests return JSON! The other requests return html pages!
            if self.request.get('update') == "1":
                result = self.update_species()
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(result))
                return
            
            elif self.request.get('delete') == "1":
                result = self.delete_species()
                all_species = self.get_all_species()
                if all_species is not None:
                    result = dict(result, **all_species)
            else:
                result = self.create_species()
                all_species = self.get_all_species()
                if all_species is not None:
                    result = dict(result, **all_species)

            # Now that species updated need to get a new copy of the model            
            model_edited = self.get_session_property('model_edited')
            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            result.update({"name" : row.model.name, "units" : row.model.units, "isSpatial" : row.isSpatial, "spatial" : row.spatial })
            self.render_response('modeleditor/specieseditor.html', **result)

    def create_species(self):
        """
        Create a new species for the current model.
        """
        model_edited = self.get_session_property('model_edited')

        if model_edited == None:
            self.render_response('modeleditor/specieseditor.html')
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            self.render_response('modeleditor/specieseditor.html')
            return

        name = self.request.get('name').strip()

        if not re.match('^[a-zA-Z0-9_\-]+$', name):
          return {'status': False, 'msg': 'Species name must be alphanumeric characters, underscores, hyphens, and spaces only'}

        if row.isSpatial:
            diffusion_coefficient = self.request.get('diffusion_coefficient').strip()
            initial_value = 0
        else:
            initial_value = self.request.get('initial_value').strip()
            diffusion_coefficient = 0

        errors = self.check_input(name, initial_value, diffusion_coefficient, row.isSpatial)

        if errors is not None:
            errors.update({'name': name, 'initial_value': initial_value})
            return errors
        try:
            model = row.model

            initial_value = int_or_float(initial_value)

            if model is None:
                return {'status': False, 'msg': 'You have not selected any model to edit.'}

            # Check if the species already exists
            if name in model.getAllSpecies():
                return {'status': False, 'msg': 'Species ' + name + ' already exists!', 'name': name, 'initial_value': initial_value}

            species = Species(name, initial_value)
            model.addSpecies(species)

            row.spatial['species_diffusion_coefficients'][name] = diffusion_coefficient
            row.spatial['species_subdomain_assignments'][name] = []

            row.model = model
            row.put()

            # Update the cache
            self.set_model_edited(model)
            return {'status': True, 'msg': 'Species added successfully!'}
        except Exception, e:
            logging.error("species::create_species: Species creation failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': e}

    def delete_species(self):
        """
        Delete the given species from the current model.
        """
        name = self.request.get('toDelete')        
        try:
            model_edited = self.get_session_property('model_edited')

            if model_edited == None:
                self.render_response('modeleditor/specieseditor.html')
                return

            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            if row is None:
                self.render_response('modeleditor/specieseditor.html')
                return

            row.model.deleteSpecies(name)

            del row.spatial['species_diffusion_coefficients'][name]
            del row.spatial['species_subdomain_assignments'][name]

            row.put()

            return {'status': True, 'msg': 'Species ' + name + ' deleted successfully!'}
        except Exception, e:
            logging.error("species::delete_species: Species deletion failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'Species deletion failed'}

        
    def check_input(self, name, initial_value, diffusion_coefficient, isSpatial):
        """
        Check to see if the input for species creation/updation is valid
        """
        model = self.get_model_edited()

        if model is None:
            return {'status': False, 'msg': 'You have not selected any model to edit.'}

        if not name:
            return {'status': False, 'msg': 'Species name is missing!'}

        if initial_value == None:
                return {'status': False, 'msg': 'Initial value for species ' + name + ' is missing!'}

        if diffusion_coefficient == None:
                return {'status': False, 'msg': 'Diffusion coefficient for species ' + name + ' is missing!'}

        if initial_value < 0:
                return {'status': False, 'msg': 'Initial value for species ' + name + ' is less than zero!'}

        if diffusion_coefficient < 0:
                return {'status': False, 'msg': 'Diffusion coefficient for species ' + name + ' is less than zero!'}

        # the initial_value must be an integer.        
        if model.units == "population":
            try:
                int(initial_value)
            except ValueError:
                return {'status': False, 'msg': 'Initial value for species ' + name + ' is not an integer!'}
        else:
            try:
                float(initial_value)
            except ValueError:
                return {'status': False, 'msg': 'Initial value for species ' + name + ' is not a valid floating point number!'}

        try:
            float(diffusion_coefficient)
        except ValueError:
            return {'status': False, 'msg': 'Diffusion coefficient for species ' + name + ' is not a valid floating point number!'}

        # return None if there are no errors
        return None

    def update_species(self):
        """
        Update the species with new values.
        """
        try:
            model_edited = self.get_session_property('model_edited')

            if model_edited == None:
                self.render_response('modeleditor/specieseditor.html')
                return

            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

            if row is None:
                self.render_response('modeleditor/specieseditor.html')
                return

            model = row.model

            all_species = model.getAllSpecies()

            oldKey = None
            newKey = None

            # Add the updated values afresh. i.e. The old values are erased.
            new_species_list = []

            index = 1
            for key, value in all_species.items():
                # This param will have the name of the species.
                new_name = self.request.get(key + "-name").strip()

                # If name changed, change all the indexing
                if new_name != key:
                    oldKey = key
                    newKey = new_name

                    row.spatial['species_diffusion_coefficients'][new_name] = row.spatial['species_diffusion_coefficients'][key]

                    del row.spatial['species_diffusion_coefficients'][key]

                    row.spatial['species_subdomain_assignments'][new_name] = row.spatial['species_subdomain_assignments'][key]

                    del row.spatial['species_subdomain_assignments'][key]

                # The param will have the initial value associated with that key (species name).
                if row.isSpatial:
                    new_initial_value = 0
                    new_diffusion_coefficient = float(self.request.get(key + "-diffusion_constant").strip())
                else:
                    new_initial_value = self.request.get(key + "-initial_value").strip()
                    new_diffusion_coefficient = 0

                logging.debug('new_name: ' + new_name)
                logging.debug('new_initial_value: ' + str(new_initial_value))
                # Check to see if there are any error in the input value
                error = self.check_input(new_name, new_initial_value, new_diffusion_coefficient, row.isSpatial)

                if error is not None:
                    logging.error('error: ' + str(error))
                    return error

                # Add the new entry
                value.name = new_name
                value.initial_value = int_or_float(new_initial_value)
                row.spatial['species_diffusion_coefficients'][new_name] = new_diffusion_coefficient
                new_species_list.append(value)
                index += 1

            # Delete the old values
            model.deleteAllSpecies()
            # Add the modified species back to the model
            model.addSpecies(new_species_list)
            # Update the cache

            row.model = model
            row.put()

            #self.set_model_edited(model)
            result = {'status': True, 'msg': 'Species updated successfully!'}

            if oldKey:
                result['key'] = oldKey
                result['newKey'] = newKey

            return result
        except Exception, e:
            logging.error("species::update_species: Updating of Species failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': e}

    def get_all_species(self):
        """
        Get all the species belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_model_edited()
        if model is None:
            return None
        return {'all_species': model.getAllSpecies()}

    def get_model_edited(self):
        model_edited = self.get_session_property('model_edited')

        if model_edited == None:
            return None

        db_model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        return db_model.model

    def set_model_edited(self, model):
        db_model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model.name).get()
        db_model.model = model
        db_model.put()
        # TODO: This is a hack to make it unlikely that the db transaction has not completed
        # before we re-render the page (which would cause an error). We need some real solution for this...
        time.sleep(0.5)

        self.set_session_property('model_edited', model)
