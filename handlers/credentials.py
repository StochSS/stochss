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
        all_vms = self.get_all_vms()
        if all_vms is not None:
            self.render_response('credentials.html', **all_vms)
        else:
            self.render_response('credentials.html')        
     
        



    def post(self):
            # First, check to see if it's a save_changes request and then route it to the appropriate function.
        if self.request.get('save') == "1":
            result = self.save_credentials(save_creds)
            self.set_session_property('save',save_creds)            
            self.redirect('credentials')                                  
            result = dict(get_all_vms(self), **result)
            self.render_response('credentials.html', **result) 


        elif self.request.get('start') == "1":
            result = self.start_vm()
            result = dict(get_all_vms(self), **result)
            self.render_response('credentials.html', **result)                                 
        
        else self.request.get('delete') == "1":
            result = self.delete_vms() 
            result = dict(get_all_vms(self), **result)
            self.render_response('credentials.html', **result)                          
            
             
            

    def get_all_vms(self):
        """
        Get all the reactants belonging to the current user.
        This model must be in cache.
        """
        valid_username = self.get_session_property('username')
        if valid_username is None:
            return None
        else
        	result = backendservice.describeMachines(valid_username)
		self.render_response('credentials.html', **result)	

	def save_credentials(self, save_creds):
		"""
		Save the Credentials
		""" 
       # Flush the data in cache to the datastore.
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        db_user.put()
        result = {'status': True, 'msg': model.name + ' saved successfully!'}
        
    def start_vm(self):
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result = backendservice.startMachines(db_user.user)
        
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user)       
            		
		
