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
        # First, check to see if it's a save_changes request and then route it to the appropriate function.
        # First, check to see if it's a save_changes request and then route it to the appropriate function.
        # self.render_response('credentials.html')
        
        params = self.request.POST
        action = self.request.get('save')
        if 'save' in params:
            access_key = params['access_key']
                self.response.out.write('delete')
            
            self.response.out.write('save')
        elif 'start' in params:
            self.response.out.write('start')
        elif 'delete' in params:
            self.response.out.write('delete')
        else:
            self.response.out.write('error')

        """if self.request.get('save') == "1":
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
            self.render_response('credentials.html', **result)  """                        
            
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
    

    """def get_all_vms(self):
        try:
            # User id is a numeric value.
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))
                
        all_vms = self.get_all_vms(user_id)
        context = {'vm_names':all_vms, 'number_of_vms':len(all_vms)}
        self.render_response('credentials.html', **context)"""
    

        
	def save_credentials(self, save_changes):
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

		
class InvalidUserException(Exception):
    pass
