try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__

import re

from stochssapp import *
from stochss.model import *

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)
    
class ReactionEditorPage(BaseHandler):
            
    def authentication_required(self):
        return True
    
    def get(self):
        # There are two possible types of requests
        #    Either json requests to get the reactionsSubdomainsAssignment data (expecting JSON return)
        #    Or just vanilla browser http requests wanting to load up the page. The variable 'reqType' determines what is what
        # Both request types need the model loaded up tho
        model_edited = self.get_session_property('model_edited')
        if model_edited == None:
            self.render_response('modeleditor/reactionseditor.html')
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            self.render_response('modeleditor/reactionseditor.html')
            return


        if self.request.get('reqType') == 'reactionsSubdomainAssignments':
            # Looks like a reactionsSubdomainAssignments request
            self.response.content_type = 'application/json'

            if 'reactions_subdomain_assignments' in row.spatial:
                reactionsSubdomainAssignments = row.spatial['reactions_subdomain_assignments']
            else:
                reactionsSubdomainAssignments = None
            
            self.response.write( json.dumps( { 'subdomains' : row.spatial['subdomains'],
                                               'reactionsSubdomainAssignments' : reactionsSubdomainAssignments } ) )
            return
        else:
            result = { "isSpatial" : row.isSpatial, "spatial" : row.spatial }

            all_reactions = self.get_all_reactions()
            
            result.update(all_reactions)

            if all_reactions is not None:
                self.render_response('modeleditor/reactioneditor.html', **result)            
            else:
                self.render_response('modeleditor/reactioneditor.html')

    def post(self):
        # There are two possible types of requests
        #    Either json requests to update the reactionsSubdomainsAssignment data (expecting JSON return)
        #    Or browser http form post requests adding reactions (that are expected to return a new page to the browser)

        model_edited = self.get_session_property('model_edited')
        if model_edited == None:
            self.render_response('modeleditor/reactioneditor.html')
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            self.render_response('modeleditor/reactioneditor.html')
            return

        if self.request.get('reqType') == 'setReactionSubdomainAssignment':
            # Looks like a speciesSubdomainAssignments request
            self.response.content_type = 'application/json'

            data = json.loads( self.request.get('data') );

            reactionId = data['reactionId']
            subdomainId = data['subdomainId']
            value = data['value']

            selectedSubdomains = row.spatial['reactions_subdomain_assignments'][reactionId]

            if value:
                if subdomainId not in selectedSubdomains:
                    selectedSubdomains.append(subdomainId)
            else:
                if subdomainId in selectedSubdomains:
                    selectedSubdomains.remove(subdomainId)

            row.spatial['reactions_subdomain_assignments'][reactionId] = selectedSubdomains

            row.put()
            
            self.response.write( json.dumps( { "status" : True,
                                               "msg" : "Reaction {0} subdomain assignment updated".format(reactionId) } ) )
            return
        else:
            # This appears to be a JSON request as well! I'm not sure this does anything. Better have a closer look later (Ben 8-30-2014)
            if self.request.get('update') == "1":
                # Update the page
                result = self.update_reaction()
                self.response.headers['Content-Type'] = 'application/json'
                self.response.write(json.dumps(result))

            # browser request!
            elif self.request.get('delete') == "1":
                #Delete a reaction
                result = self.delete_reaction(self.request.get('toDelete'))
                all_reactions = self.get_all_reactions()
                if all_reactions is not None:
                    result = dict(result, **all_reactions)

                result.update({ "isSpatial" : row.isSpatial, "spatial" : row.spatial })
                
                self.render_response('modeleditor/reactioneditor.html', **result)            
                
            # browser request!
            else:
                # Create a new reaction
                result = self.create_reaction()
                all_reactions = self.get_all_reactions()
                if all_reactions is not None:
                    result = dict(result, **all_reactions)

                result.update({ "isSpatial" : row.isSpatial, "spatial" : row.spatial })

                self.render_response('modeleditor/reactioneditor.html', **result)

    def get_all_reactions(self):
        """
        Get all the reactants belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_model_edited()
        if model is None:
            return None

        all_reactants = OrderedDict()
        all_products = OrderedDict()
        all_reactions = model.getAllReactions()
        for key, value in all_reactions.items():
            self.encode_species(all_reactants, key, value.reactants)
            self.encode_species(all_products, key, value.products)

        logging.debug("all_reactants " + str(all_reactants))
        logging.debug("all_products " + str(all_products))

        return {'all_reactions': all_reactions, 'all_species': json.dumps(model.getAllSpecies().keys()), 'all_parameters': model.getAllParameters().keys(), 'all_reactants': all_reactants, 'all_products': all_products,'all_species_list':model.getAllSpecies(),'all_parameters_list':model.getAllParameters()}


    def delete_reaction(self, name):
        """
        Delete the given reaction from the current model.
        """        
        try:
            model = self.get_model_edited()
            model.deleteReaction(name)

            model_edited = self.get_session_property('model_edited')
            row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()
            
            del row.spatial['reactions_subdomain_assignments'][name]

            row.put()
            # Update the cache
            self.set_model_edited(model)
            return {'status': True, 'msg': 'Reaction ' + name + ' deleted successfully.'}
        except Exception, e:
            logging.error("reaction::delete_reaction: Reaction deletion failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while deleting the reaction.'}

    def create_reaction(self):
        """ Create a new reaction. """
        
        # Grab the currently edited model
        model_edited = self.get_session_property('model_edited')
        if model_edited == None:
            return

        row = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_edited.name).get()

        if row is None:
            return

        model = row.model

        if model is None:
            return {'status': False, 'msg': 'You have not selected any model to edit.'}
        
        
        # Get the names of the reaction, the reactants and the products
        name = self.request.get('name').strip()

        if not re.match('^[a-zA-Z0-9_\-]+$', name):
          return {'status': False, 'msg': 'Reaction name must be alphanumeric characters, underscores, hyphens, and spaces only'}

        reactants = self.request.get('reactants').strip()
        products = self.request.get('products').strip()
        
        # Process the propensity function. If the mass-action checkbox is checked,
        # we generate the propensity function.
        mass_action=False
        if self.request.get('is_mass_action'):
            mass_action=True
            try:
                ma_rate = self.request.get('ma_rate')
                ma_rate_parameter = model.getParameter(str(ma_rate))
                # Set the proponsity_function variable to a dummy value to avoid an error to be raised below.
                propensity_function = "mass_action"
            except Exception,e:
                error =  {'status': False, 'msg': 'Mass action specified, but the rate constant could not be parsed.'+str(e)}
                return error
        else:
            # Read the custom proponsity function from the form.
            propensity_function = self.request.get('propensity_function').strip()

        error = self.check_input(name, reactants, products, propensity_function)
        if error is not None:
            logging.error(error)
            error.update({'name': name, 'reactants': reactants, 'products': products, 'propensity_function': propensity_function})
            return error

        try:
            reactants = self.preprocess_input(reactants)
            products = self.preprocess_input(products)
            
            # model = self.get_session_property('model_edited')
                #if model is None:
            #    return {'status': False, 'msg': 'You have not selected any model to edit.'}
            all_reactions = model.getAllReactions()
            
            # Check if the reaction already exists
            if name in all_reactions:
                return {'status': False, 'msg': 'Reaction ' + name + ' already exists.', 'name': name, 'reactants': reactants, 'products': products, 'propensity_function': propensity_function}

            all_species = model.getAllSpecies()
            
            reactants = self.decode_species(reactants)
            products = self.decode_species(products)
            
            for key in reactants.keys():
                if key not in all_species:
                    return {'status': False, 'msg': 'Reactant ' + key + ' has not been defined.', 'name': name, 'reactants': self.encode_species(None, name, reactants), 'products': self.encode_species(None, name, products), 'propensity_function': propensity_function}
            
            logging.debug("products " + str(products))
            if len(products) > 0:
                for key in products.keys():
                    if key not in all_species:
                        return {'status': False, 'msg': 'Product ' + key + ' has not been defined.', 'name': name, 'reactants': self.encode_species(None, name, reactants), 'products': self.encode_species(None, name, products), 'propensity_function': propensity_function}
            

            # Build a namespace comprised of all paramter and all species names.
            # The propensity functions should be evaluable in that namespace.
            namespace = OrderedDict()
            all_parameters = model.getAllParameters()

            for param in all_species:
                namespace[param] = int_or_float(all_species[param].initial_value)

            for param in all_parameters:
                namespace[param] = int_or_float(all_parameters[param].value)

            # If we are processing a mass-action reaction, we generate a temporary reaction here in
            # order to compile the propensity function for error checking below.
            if mass_action:
                try:
                    rtemp = Reaction(name="foo", reactants=reactants, products=products, massaction=True,rate=ma_rate_parameter)
                    propensity_function = rtemp.propensity_function
                except Exception,ret:
                    return {'status': False, 'msg': ret}

            try:
                print propensity_function, name, namespace
                value = eval(compile(propensity_function, '<string>', 'eval', __future__.division.compiler_flag), namespace)
                logging.debug("value after evaluation: " + str(value))
            except Exception, e:
                logging.error('Error evaluating the expression %s in reaction %s', propensity_function, name)
                traceback.print_exc()
                return {'status': False, 'msg': 'Error evaluating the expression ' + propensity_function + ' in reaction ' + name, 'name': name, 'reactants': self.encode_species(None, name, products), 'products': self.encode_species(None, name, products), 'propensity_function': propensity_function}

            logging.debug("reactants " + str(reactants))
            logging.debug("products " + str(products))
            logging.debug("propensity " + str(propensity_function))
            
            # Finally create the reaction and add it to the model
            if mass_action:
                reaction = Reaction(name=name, reactants=reactants, products=products, massaction=True,rate=ma_rate_parameter)
            else:
                reaction = Reaction(name=name, propensity_function=propensity_function, reactants=reactants, products=products)

            model.addReaction(reaction)
            
            row.spatial['reactions_subdomain_assignments'][name] = []

            row.model = model
            row.put()

            # Update the cache
            self.set_model_edited(model)

            return {'status': True, 'msg': 'Reaction added successfully.'}
        except Exception, e:
            logging.error("parameter::create_reaction: Reaction creation failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while creating the reaction.'+str(e)}


    def decode_species(self, input):
        """
        Decode the input and parse the species name and the stoichiometry
        """
        dict = OrderedDict()
        if input == '':
            return dict
        
        elements = input.split(",")        
        
        for element in elements:
            element = element.strip()
            stochiometry = 0
            index = 0
            for char in element:
                if char.isdigit():
                    index += 1
                    stochiometry += int(char)
                else:
                    break
            if stochiometry == 0:
                stochiometry = 1
            species = element[index:]

            if species in dict:
                dict[species] += stochiometry
            else:
                dict[species] = stochiometry
        return dict

    def encode_species(self, dict, reactant_name, species):
        """
        Encode the species name and the stoichiometry in a format consumable by the UI
        """
        encoded_value = ""
        for key, value in species.items():
            encoded_value += key if (value == 1) else str(value) + key
            encoded_value += ", "
        if dict is None:
            return encoded_value[:-2]
        
        # Else dict will be modified in place. No need to return anything   
        dict[reactant_name] = encoded_value[:-2]

    def check_input(self, name, reactants, products, propensity_function):
        """
        Check to see if the input for species creation/updation is valid
        """
        if name == "":
            return {'status': False, 'msg': 'Reaction name is missing.'}
        
        # The reactant and product lists can be empty. But we probably need more (different)
        # error checking here. 
        # if reactants == "":
        #    return {'status': False, 'msg': 'Reactant for ' + name + ' is missing.'}
    
        if propensity_function == "":
            return {'status': False, 'msg': 'Propensity function for ' + name + ' is missing.'}
        
        # return None if there are no errors
        return None
    
    def preprocess_input(self, species):
        """
        Remove the extra comma at the end, if there is one.
        """
        if species[-1:] == ',':            
            species = species[:-1]
        return species
    
    def update_reaction(self):
        """
        Update the reactions with new values.
        """
        try:
            model = self.get_model_edited()
            all_reactions = model.getAllReactions()
            all_species = model.getAllSpecies()
            all_parameters = model.getAllParameters()

            # Add the updated values afresh. i.e. The old values will be erased.
            new_reactions = OrderedDict()
            
            # The namespace should contain all the species and parameters.
            namespace = OrderedDict()

            for spec in all_species:
                namespace[spec] = int_or_float(all_species[spec].initial_value)

            for param in all_parameters:
                namespace[param] = int_or_float(all_parameters[param].value)
                
            index = 1
            for key, value in all_reactions.items():
                # This param will have the name of the reaction.
                new_name = self.request.get(str(index) + "-name").strip()
                new_reactants = self.request.get(str(index) + "-reactants").strip()
                new_products = self.request.get(str(index) + "-products").strip()
                
                # The param will have the expression associated with that key (parameter name).
                new_propensity_function = self.request.get(str(index) + "-propensity_function").strip()

                # Check to see if there are any errors in the input value
                error = self.check_input(new_name, new_reactants, new_products, new_propensity_function)
                if error is not None:
                    logging.error(error)
                    return error
                
                new_reactants = self.preprocess_input(new_reactants)
                new_products = self.preprocess_input(new_products)

                if new_name in new_reactions:
                    return {'status': False, 'msg': 'Reaction ' + new_name + " already exists!"}
                
                new_reactants = self.decode_species(new_reactants)
                
                new_products = self.decode_species(new_products)
            
                # Reactants can be empty
                if len(new_reactants) > 0:
                    for key in new_reactants.keys():
                        if key not in all_species:
                            return {'status': False, 'msg': 'Reactant ' + key + ' has not been defined for ' + new_name}
                
                # Products can be empty
                if len(new_products) > 0:    
                    for key in new_products.keys():
                        if key not in all_species:
                            return {'status': False, 'msg': 'Product ' + key + ' has not been defined for ' + new_name}
                
                try:
                    eval(compile(new_propensity_function, '<string>', 'eval', __future__.division.compiler_flag), namespace)
                except Exception, e:
                    logging.debug('Evaluation of expression %s for parameter %s failed with error %s', new_propensity_function, new_name, e)
                    traceback.print_exc()
                    return {'status': False, 'msg': 'Error evaluating expression ' + new_propensity_function + " for reaction " + new_name}
                
                value.reactants = new_reactants
                value.products = new_products
                value.propensity_function = new_propensity_function
                
                new_reactions[new_name] = value
                
                index += 1

            # Delete the old values
            model.deleteAllReactions()
            # Add the modified reactions back to the model
            model.addReaction(new_reactions)
            # Update the cache
            
            self.set_model_edited(model)
            logging.debug('Reactions updated successfully!')
            return {'status': True, 'msg': 'Reactions updated successfully.'}
        except Exception, e:
            logging.error("reaction::update_reaction: Updating of reactions failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while updating the reaction.'+str(e)}

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

