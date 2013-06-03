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

import time

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

        context = self.getContext(user_id)
        self.render_response('credentials.html', **context)


    def post(self):

        params = self.request.POST
        
        try:
            # User id is a numeric value.
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))
    
        # Get the context of the page
        context = self.getContext(user_id)

        if 'save' in params:
            # Save the access and private keys to the datastore
            access_key = params['ec2_access_key']
            secret_key = params['ec2_secret_key']
            credentials = {'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key}
            result = self.saveCredentials(credentials)
            # TODO: This is a hack to make it unlikely that the db transaction has not completed
            # before we re-render the page (which would cause an error). We need some real solution for this...
            time.sleep(0.5)
            context = self.getContext(user_id)
            self.render_response('credentials.html', **(dict(context, **result)))

        elif 'start' in params:
            number_of_new_vms = params['vm_number']
            result = self.start_vms(user_id, self.user_data.getCredentials(), number_of_new_vms)
            self.redirect('/credentials')

        elif 'stop' in params:
            # Kill all running VMs.
            try:
                service = backendservices()
                credentials = self.user_data.getCredentials()
                stopped = service.stopMachines({"infrastructure":"ec2", "credentials":self.user_data.getCredentials()})
                if not stopped:
                    raise
                result = {'status': True, 'msg': 'Sucessfully terminated all running VMs.'}
            except Exception,e:
                result = {'status': False, 'msg': 'Failed to terminate the VMs. Please check their status in the EC2 managment consol available from your Amazon account.'}
            finally:
                context = self.getContext(user_id)
                self.render_response('credentials.html',**(dict(context,**result)))
    
        elif 'refresh' in params:
            self.redirect('/credentials')
        else:
            result = {'status': False, 'msg': 'There was an error processing the request'}
            self.render_response('credentials.html', **(dict(context, **result)))

    def saveCredentials(self, credentials):
        """ Save the Credentials to the datastore. """
        try:
            service = backendservices()
            params ={}
            params['credentials'] =credentials
            params["infrastructure"] = "ec2"
            
            # Check if the supplied credentials are valid of not
            if service.validateCredentials(params):
                self.user_data.valid_credentials = True
                result = {'status': True, 'credentials_msg': ' Credentials saved successfully! The EC2 keys have been validated.'}
                # See if the amazon db table is intitalized
                if not self.user_data.isTable():
                    from backend.tasks import createtable
                    db_credentials = self.user_data.getCredentials()
                    # Set the environmental variables
                    os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
                    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']

                    try:
                        createtable("stochss")
                        self.user_data.is_amazon_db_table=True
                    except Exception,e:
                        pass
            else:
                result = {'status': False, 'credentials_msg':' Invalid Secret Key or Access key specified'}
                self.user_data.valid_credentials = False
    
            # Write the credentials to the datastore
            self.user_data.setCredentials(credentials)
            self.user_data.put()
        
    
        except Exception,e:
            result = {'status': False, 'credentials_msg':' There was an error saving the credentials: '+str(e)}
        
        return result


    def getContext(self,user_id):
        
        service = backendservices()
        params = {}
        credentials =  self.user_data.getCredentials()
        params['credentials'] = credentials
        params["infrastructure"] = "ec2"
        
        context = {}
        result = {}
        
        # Check if the credentials are valid.
        if not self.user_data.valid_credentials:
            result = {'status':False,'vm_status':False,'vm_status_msg':'Could not determine the status of the VMs: Invalid Credentials.'}
            context['vm_names'] = None
            context['valid_credentials']=False
        else:
            
            context['valid_credentials'] = True
            all_vms = self.get_all_vms(user_id,credentials)
            if all_vms == None:
                result = {'status':False,'vm_status':False,'vm_status_msg':'Could not determine the status of the VMs.'}
                context = {'vm_names':all_vms}
            else:
                number_pending = 0
                number_running = 0;
                for vm in all_vms:
                    if vm != None and vm['state']=='pending': number_pending = number_pending + 1
                    elif vm != None and vm['state']=='running': number_running = number_running + 1
                number_of_vms = len(all_vms)
                print "number pending = " + str(number_pending)
                print "number running = " + str(number_running)
                context['number_of_vms'] = number_of_vms
                context['vm_names'] = all_vms
                context['number_pending'] = number_pending
                context['number_running'] = number_running
                result['status']= True
                result['credentials_msg'] = 'The EC2 keys have been validated.'
                if number_running+number_pending == 0:
                    context['active_vms'] = False
                else:
                    context['active_vms'] = True
                
        context = dict(context, **credentials)
        context = dict(result, **context)
        return context
    
    def get_all_vms(self,user_id,credentials):
        """
            
        """
        #valid_username = self.get_session_property('username')
        if user_id is None or user_id is "":
            return None
        else:
            try:
                service = backendservices()
                params ={"infrastructure":"ec2",
                     'credentials':credentials}          
                result = service.describeMachines(params)
                return result
            except:
                return None
                    
    def start_vms(self, user_id, credentials, number_of_vms=None):
        group_random_name = user_id +"-"+''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(6))
        params ={"infrastructure":"ec2",
             "num_vms":number_of_vms, 
             'group':group_random_name, 
             'image_id':'ami-11bad678', 
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

        return result
    
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user)       


class LocalSettingsPage(BaseHandler):
    """ Set paths for local plugin software. """

    def get(self):
        """ """
        env_variables = self.user_data.env_variables
        if env_variables == None:
            context = {}
        else:
            context = json.loads(env_variables)
        
        logging.info(context)
        self.render_response("localsettings.html",**context)
    
    def post(self):
        """ """
        params = self.request.POST
        
        if self.user_data.env_variables == None:
            env_variables = {}
        else:
            env_variables = json.loads(self.user_data.env_variables)
                
        for key in params:
            env_variables[key] = params[key]
                
        self.user_data.env_variables = json.dumps(env_variables)
        self.user_data.put()
        self.render_response("localsettings.html",**env_variables)


class InvalidUserException(Exception):
    pass
