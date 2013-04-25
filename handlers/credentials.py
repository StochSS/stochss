try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__

from stochssapp import BaseHandler
from stochss.backendservice import *



class CredentialsPage(BaseHandler):
    """
    Provides a web UI around POST /model, to allow users to create
    StochKitModelWrappers via the web interface instead of the RESTful one.
    """
    
    def get(self):
        try:
            # User id is a numeric value.
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))
                    
        all_vms = self.get_all_vms(user_id)
        context = {'vm_names':all_vms, 'number_of_vms':len(all_vms)}
        self.render_response('credentials.html', **context)


    def post(self):

        params = self.request.POST
        action = self.request.get('save')
        
        try:
            # User id is a numeric value.
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))
    
        # Get the context of the page
        all_vms = self.get_all_vms(user_id)
        context = {'vm_names':all_vms, 'number_of_vms':len(all_vms)}
                #self.render_response('credentials.html', **context
        
        if 'save' in params:
            # Save the access and private keys to the datastore
            access_key = params['ec2_access_key']
            secret_key = params['ec2_secret_key']
            
            # See if the CredentialsWrapper is already created, in which case we modify it and rewrite.
            #result = self.save_credentials(access_key,private_key)
            
            self.response.out.write("Saving keys: " +access_key+" "+secret_key)
        elif 'start' in params:
            number_of_new_vms = params['vm_number']
            result = self.start_vms(number_of_new_vms)
            #if number_of_new_vms > 20:
            #    result = {'Status':False, 'msg': "Maximum allowed number of virtual machines is 20"}
            self.render_response('credentials.html', **(result+context))
    
        elif 'delete' in params:
            # Delete all VMs.
            #result = self.delete_vms()
            self.response.out.write('Deleting all the VMs')
        else:
            self.response.out.write('error')

                
    def get_all_vms(self,user):
        """
            
        """
        #bs = Backendservice()
        #valid_username = self.get_session_property('username')
        if user is None or user is "":
            return None
        else:
            result = ["VM1", "VM2", "VM3"]
            #result = bs.describeMachines(user)
        return result
            #self.render_response('credentialspage.html', **result)
    
	def save_credentials(self, save_changes):
		"""
		Save the Credentials. 
		""" 
        # Flush the data in cache to the datastore.
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        db_user.put()
        result = {'status': True, 'msg': model.name + ' saved successfully!'}
        return result
        
    def start_vms(self, number_of_vms=None):
        #  db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        # db_user.user = valid_username
        #result = backendservice.startMachines(db_user.user)
        result = {'status': True, 'msg': 'Starting VMs'}
        return result
    
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user)       

		
class InvalidUserException(Exception):
    pass
