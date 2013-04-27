try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__
import random
import string
from stochssapp import BaseHandler
from backend.backendservice import *


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
            credentials = {'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key}
            
            # See if the CredentialsWrapper is already created, in which case we modify it and rewrite.
            result = self.saveCredentials(user_id,credentials)
            context = self.getVMContext(user_id)
            #result = {'status':True,'credentials_msg':'Your credentials has been saved.'}
            self.render_response('credentials.html', **(dict(context, **result)))

        elif 'start' in params:
            
            db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", user_id).get()
            access_key = ""
            secret_key = ""
            # the following code has to be refactored. The textbox should always have the key.
            # We won't have to fetch the keys all the time from DB if it's prepopulated in the
            # box.
            if db_credentials is None:
                # Create a new credentials wrapper
                access_key = credentials['EC2_ACCESS_KEY']
                secret_key = credentials['EC2_SECRET_KEY']
            else:
                secret_key = db_credentials.secret_key
                access_key = db_credentials.access_key
        
            credentials = {'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key}
            number_of_new_vms = params['vm_number']
            result = self.start_vms(user_id, credentials, number_of_new_vms)
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
            #check if the credentials are valid
            service = backendservices()
            params ={}
            params['credentials'] =credentials
            params["infrastructure"] = "ec2"
            
            if service.validateCredentials(params):
                db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", user_id).get()
                if db_credentials is None:
                    # Create a new credentials wrapper
                    db_credentials = CredentialsWrapper()
                    db_credentials.user_id = user_id
                    db_credentials.access_key = credentials['EC2_ACCESS_KEY']
                    db_credentials.secret_key = credentials['EC2_SECRET_KEY']
                else:
                    db_credentials.secret_key = credentials['EC2_SECRET_KEY']
                    db_credentials.access_key = credentials['EC2_ACCESS_KEY']
                db_credentials.put()
                result = {'status': True, 'credentials_msg': ' Credentials saved successfully!'}
            else:
                result = {'status': False, 'credentials_msg':' Invalid Secret Key or Access key specified'}
        except Exception,e:
            result = {'status': False, 'credentials_msg':' There was an error saving the credentials: '+str(e)}
        
        return result


    def getVMContext(self,user_id):
        
        # Obtain the user's credentials from the datastore
        try:
            db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", user_id).get()
            if db_credentials is None:
                credentials = {'EC2_SECRET_KEY':"",'EC2_ACCESS_KEY':""}
            else:
                credentials = {'EC2_ACCESS_KEY':db_credentials.access_key,'EC2_SECRET_KEY':db_credentials.secret_key}
        except Exception, e:
           # This should never fail at this stage, and if it does we crash the app. TODO: Improve error handling.
           print str(e) 
           raise Exception
                    
        # I assumed here that all_vms is a list of VMs ""
        all_vms = self.get_all_vms(user_id,credentials)
        if all_vms == None:
            return None
        number_pending = 0
        number_running = 0;
        for vm in all_vms:
            if vm != None and vm['state']=='pending': number_pending = number_pending + 1
            elif vm != None and vm['state']=='running': number_running = number_running + 1
        number_of_vms = len(all_vms)
        print "number pending = " + str(number_pending)
        print "number running = " + str(number_running)
        # ANAND: Check the status of the VMS
        #vm_status = backendservice.getStatusOfVMS(all_vms)
        vm_status = ['Pending','Running','Pending']
        context = {'vm_names':all_vms, 'number_of_vms':number_of_vms,'vm_status':vm_status,'number_pending':number_pending,'number_running':number_running}
        context = dict(context, **credentials)
        return context
    
    def get_all_vms(self,user_id,credentials):
        """
            
        """
        #valid_username = self.get_session_property('username')
        if user_id is None or user_id is "":
            return None
        else:
            service = backendservices()
            params ={"infrastructure":"ec2",
                 'credentials':credentials}          
            result = service.describeMachines(params)
            print "i was here too"
            print str(result)
        return result
    
    def start_vms(self, user_id, credentials, number_of_vms=None):
        #  db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        # db_user.user = valid_username
        #result = backendservice.startMachines(db_user.user)
        # ANAND: Modify 'result' as needed depending on the result of the call to backendservice.
        group_random_name = user_id +"-"+''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(6))
        params ={"infrastructure":"ec2",
             "num_vms":number_of_vms, 
             'group':group_random_name, 
             'image_id':'ami-44b6272d', 
             'instance_type':'t1.micro',
             'keyname':group_random_name, 
             'email':[user_id],
             'credentials':credentials,
             'use_spot_instances':False}
        service = backendservices()
        res = service.startMachines(params)
        if res != None and res['success']==True:
            result = {'status':'Success' , 'msg': 'Sucessfully requested '+ str(number_of_vms) + ' Virtual Machines.'}
        else:
            result = {'status': 'False' , 'msg': 'Request to start the machines failed. Please contact the administrator.'}
        #result = {'status': , 'msg': 'Sucessfully requested '+ str(number_of_vms) + ' Virtual Machines.'}
        return result
    
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user)       

		
class InvalidUserException(Exception):
    pass
