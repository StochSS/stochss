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
from backend.tasks import createtable
from google.appengine.ext import db
import time

class CredentialsPage(BaseHandler):
    """
    """
    INS_TYPES = ["t1.micro", "m1.small", "m3.medium", "m3.large", "c3.large", "c3.xlarge"];
    
    def authentication_required(self):
        return True
    
    def get(self):
        try:
            # User id is a string
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))

        context = self.getContext(user_id)
        self.render_response('credentials.html', **context)


    def post(self):

        params = self.request.POST
        
        print "CredentialsPage.post() params={0}".format(params)
        
        try:
            # User id is a string
            user_id = self.user.user_id()
            if user_id is None:
                raise InvalidUserException
        except Exception, e:
            raise InvalidUserException('Cannot determine the current user. '+str(e))
        
            
        

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
            context = self.getContext(user_id)
            all_numbers_correct = True;
            
                
            vms = []
            for type in self.INS_TYPES:
                num_type = 'num_'+type
                
                if num_type in params and params[num_type] != '':
                    if int(params[num_type]) > 20:
                        result = {'status': 'False' , 'msg': 'Number of new vms should be no more than 20.'}
                        all_numbers_correct = False
                        break;
                    elif int(params[num_type]) <= 0:
                        result = {'status': 'False' , 'msg': 'Number of new vms should be at least 1.'}
                        all_numbers_correct = False
                        break;
                    else:
                        vms.append({"instance_type": type, "num_vms": int(params[num_type])})
            
#             if not self.isQueueHeadRunning():
#                 if params['num_c3.large'] == '' and params['num_c3.xlarge'] == '':
#                     result = {'status': 'False' , 'msg': 'There should be at least one instance that are larger than or equal to c3.large.'}
#                     all_numbers_correct = False  
                   
            if all_numbers_correct :
            
                result = self.start_vms(user_id, self.user_data.getCredentials(), vms)
                context['starting_vms'] = True
            
            self.render_response('credentials.html', **(dict(context, **result)))

        elif 'stop' in params:
            # Kill all running VMs.
            try:
                service = backendservices()
                credentials = self.user_data.getCredentials()
                terminate_params = {
                  "infrastructure": "ec2",
                  "credentials": self.user_data.getCredentials(),
                  "key_prefix": user_id
                }
                stopped = service.stopMachines(terminate_params,True) #True means blocking, ie wait for success (its pretty quick)
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
            result = {'status': True, 'msg': ''}
            context = self.getContext(user_id)
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
                    db_credentials = self.user_data.getCredentials()
                    # Set the environmental variables
                    os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
                    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']

                    try:
                        createtable(backendservices.TABLENAME)
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
        
        params = {}
        credentials =  self.user_data.getCredentials()
#         logging.info('CREDENTIALS: {0}'.format(credentials))
        params['credentials'] = credentials
        params["infrastructure"] = "ec2"
        
        context = {}
        result = {}
        
        # Check if the credentials are valid.
        if not self.user_data.valid_credentials:
            result = {'status':False,'vm_status':False,'vm_status_msg':'Could not determine the status of the VMs: Invalid Credentials.'}
            context['vm_names'] = None
            context['valid_credentials']=False
            context['active_vms']=False

            fake_credentials = { 'EC2_ACCESS_KEY': '', 'EC2_SECRET_KEY': '' }
        else:
            fake_credentials = { 'EC2_ACCESS_KEY': '*' * len(credentials['EC2_ACCESS_KEY']), 'EC2_SECRET_KEY': '*' * len(credentials['EC2_SECRET_KEY']) }
            
            context['valid_credentials'] = True
            all_vms = self.get_all_vms(user_id,params)
            if all_vms == None:
                result = {'status':False,'vm_status':False,'vm_status_msg':'Could not determine the status of the VMs.'}
                context = {'vm_names':all_vms}
            else:
                number_creating = 0
                number_pending = 0
                number_running = 0
                number_failed = 0
                for vm in all_vms:
                    if vm != None and vm['state']=='creating': number_creating = number_creating + 1
                    elif vm != None and vm['state']=='pending': number_pending = number_pending + 1
                    elif vm != None and vm['state']=='running': number_running = number_running + 1
                    elif vm != None and vm['state']=='failed': number_failed = number_failed + 1
                number_of_vms = len(all_vms)
                print "number creating = " + str(number_creating)
                print "number pending = " + str(number_pending)
                print "number running = " + str(number_running)
                print "number failed = " + str(number_failed)
                context['number_of_vms'] = number_of_vms
                context['vm_names'] = all_vms
                context['number_creating'] = number_creating
                context['number_pending'] = number_pending
                context['number_running'] = number_running
                context['number_failed'] = number_failed
                result['status']= True
                result['credentials_msg'] = 'The EC2 keys have been validated.'
                if number_running+number_pending+number_creating+number_failed == 0:
                    context['active_vms'] = False
                else:
                    context['active_vms'] = True
                
        context = dict(context, **fake_credentials)
        context = dict(result, **context)
        return context
    
    def get_all_vms(self,user_id,params):
        """
            
        """
        if user_id is None or user_id is "":
            return None
        else:
            try:
                service = backendservices()
#                 params = {
#                     "infrastructure": service.INFRA_EC2,
#                     "credentials": credentials,
#                     "key_prefix": service.KEYPREFIX + user_id
#                 }
                result = service.describeMachinesFromDB(params)
                return result
            except:
                return None
                    
    def start_vms(self, user_id, credentials, vms_info):
        key_prefix = user_id
        group_random_name = key_prefix +"-"+''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(6))
        
                
        params ={"infrastructure":"ec2",
             "vms":vms_info, 
             'group':group_random_name, 
             'image_id':'ami-e4e45e8c',
             'key_prefix':key_prefix, #key_prefix = user_id
             'keyname':group_random_name, 
             'email':[user_id],
             'credentials':credentials,
             'use_spot_instances':False}
        service = backendservices()
        res, msg = service.startMachines(params)
        if res == True:
            result = {'status':'Success' , 'msg': 'Sucessfully requested starting virtual machines. Processing request...'}
        else:
            result = {'status':'Failure' , 'msg': ""}
        return result
#         res = service.startMachines(params)
#         if res != None and res['success']==True:
#             result = {'status':'Success' , 'msg': 'Sucessfully requested '+ str(number_of_vms) + ' Virtual Machines.'}
#         else:
#             result = {'status': 'False' , 'msg': 'Request to start the machines failed. Please contact the administrator.'}
#  
#         return result
    
    def delete_vms():
        db_user = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", user_id).get()
        db_user.user = valid_username
        result =  backendservice.stopMachines(db_user.user,True) #True means blocking, ie wait for success



class LocalSettingsPage(BaseHandler):
    """ Set paths for local plugin software. """
    def authentication_required(self):
        return True
    
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
