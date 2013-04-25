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

from google.appengine.ext import db

class CredentialsWrapper(db.Model):
    """ This is a temporary model to be replaces by Arvind's User Model """
    user_id = db.StringProperty()
    access_key = db.StringProperty()
    secret_key = db.StringProperty()


class CredentialsPage(BaseHandler):
    """
    """
    
    def get(self):
        try:
            # User id is a numeric value.
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))

        context = self.getVMContext(user_id)
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
        context = self.getVMContext(user_id)

        if 'save' in params:
            # Save the access and private keys to the datastore
            access_key = params['ec2_access_key']
            secret_key = params['ec2_secret_key']
            credentials = {'access_key':access_key, 'secret_key':secret_key}
            
            # See if the CredentialsWrapper is already created, in which case we modify it and rewrite.
            result = self.saveCredentials(user_id,credentials)
            context = self.getVMContext(user_id)
            #result = {'status':True,'credentials_msg':'Your credentials has been saved.'}
            self.render_response('credentials.html', **(dict(context, **result)))

        elif 'start' in params:
            number_of_new_vms = params['vm_number']
            result = self.start_vms(user_id,number_of_new_vms)
            
            #if number_of_new_vms > 20:
            #    result = {'Status':False, 'msg': "Maximum allowed number of virtual machines is 20"}
            self.render_response('credentials.html', **(dict(context, **result)))
    
        elif 'delete' in params:
            # Delete all VMs.
            #result = self.delete_vms()
            self.response.out.write('Deleting all the VMs')
    
        elif 'refresh' in params:
            self.redirect('/credentials')
        else:
            result = {'status': False, 'msg': 'There was an error processing the request'}
            self.render_response('credentials.html', **(dict(context, **result)))

    def saveCredentials(self, user_id, credentials):
        """
		Save the Credentials in the datastore.
		"""
        try:
            db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", user_id).get()
            if db_credentials is None:
                # Create a new credentials wrapper
                db_credentials = CredentialsWrapper()
                db_credentials.user_id = user_id
                db_credentials.access_key = credentials['access_key']
                db_credentials.secret_key = credentials['secret_key']
            else:
                db_credentials.secret_key = credentials['secret_key']
                db_credentials.access_key = credentials['access_key']
            db_credentials.put()
            result = {'status': True, 'credentials_msg': ' Credentials saved successfully!'}
        except Exception,e:
            result = {'status': False, 'credentials_msg':' There was an error saving the credentials: '+str(e)}
        
        return result


    def getVMContext(self,user_id):
        
        # Obtain the user's credentials from the datastore
        try:
            db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", user_id).get()
            if db_credentials is None:
                credentials = {'access_key':"",'secret_key':""}
            else:
                credentials = {'access_key':db_credentials.access_key,'secret_key':db_credentials.secret_key}
        except Exception, e:
           # This should never fail at this stage, and if it does we crash the app. TODO: Improve error handling. 
           raise Exception
                    
        # I assumed here that all_vms is a list of VMs ""
        all_vms = self.get_all_vms(user_id)
        number_of_vms = len(all_vms)
        # ANAND: Check the status of the VMS
        #vm_status = backendservice.getStatusOfVMS(all_vms)
        vm_status = ['Pending','Running','Pending']
        context = {'vm_names':all_vms, 'number_of_vms':number_of_vms,'vm_status':vm_status,'number_pending':2,'number_running':1}
        context = dict(context, **credentials)
        return context
    
    def get_all_vms(self,user_id):
        """
            
        """
        #bs = Backendservice()
        #valid_username = self.get_session_property('username')
        if user_id is None or user_id is "":
            return None
        else:
            result = ["VM1", "VM2", "VM3"]
            #result = bs.describeMachines(user)
        return result
    
    def start_vms(self, user_id, number_of_vms=None):
        #  db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        # db_user.user = valid_username
        #result = backendservice.startMachines(db_user.user)
        # ANAND: Modify 'result' as needed depending on the result of the call to backendservice.
        result = {'status': True, 'msg': 'Sucessfully requested '+ str(number_of_vms) + ' Virtual Machines.'}
        return result
    
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user)       

		
class InvalidUserException(Exception):
    pass
