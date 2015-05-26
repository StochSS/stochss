try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging

import __future__
import random
import string
from stochssapp import BaseHandler
from backend.backendservice import *
from google.appengine.ext import db

import os
import re
import pprint
import time
import glob

from backend.common.config import AWSConfig, AgentTypes, AgentConfig, FlexConfig
from backend.databases.dynamo_db import DynamoDB
from backend.vm_state_model import VMStateModel

import fileserver

class CredentialsPage(BaseHandler):
    EC2_INS_TYPES = ["t1.micro", "m1.small", "m3.medium", "m3.large", "c3.large", "c3.xlarge"]
    HEAD_NODE_TYPES = ["c3.large", "c3.xlarge"]

    EC2_SAVE_CREDENTIALS = 'ec2_save_creds'
    EC2_START_VMS = 'ec2_start'
    EC2_STOP_VMS = 'ec2_stop'

    FLEX_PREPARE_CLOUD = 'prepare_flex_cloud'
    FLEX_DEREGISTER_CLOUD = 'deregister_flex_cloud'
    
    def authentication_required(self):
        return True
    
    def get(self):
        logging.info('GET')

        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')
        
        context = self.getContext(user_id)
        self.render_response('credentials.html', **context)


    def __handle_json_post_request(self, data_received, user_id):
        logging.info('__handle_json_post_request: action = {}'.format(data_received['action']))

        if data_received['action'] == CredentialsPage.FLEX_PREPARE_CLOUD:
            flex_cloud_machine_info = data_received['flex_cloud_machine_info']
            result = self.prepare_flex_cloud(user_id, flex_cloud_machine_info)
            logging.info("result = {0}".format(result))
            self.redirect('/credentials')

        elif data_received['action'] == CredentialsPage.FLEX_DEREGISTER_CLOUD:
            flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()
            result = self.deregister_flex_cloud(user_id, flex_cloud_machine_info)
            logging.info("result = {0}".format(result))
            self.redirect('/credentials')

        else:
            self.redirect('/credentials')

    def post(self):
        logging.info('POST')
        logging.debug("request.body = {0}".format(self.request.body))
        logging.info("CONTENT_TYPE = {0}".format(self.request.environ['CONTENT_TYPE']))
        
        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')

        if re.match('^application/json.*', self.request.environ['CONTENT_TYPE']):
            data_received = json.loads(self.request.body)
            logging.debug("json data = \n{0}".format(pprint.pformat(data_received)))
            self.__handle_json_post_request(data_received, user_id)

        else:
            params = self.request.POST
            logging.info('params = self.request.POST = {0}'.format(params))
            self.__handle_form_post_request(user_id, params)


    def __handle_ec2_stop_vms_request(self, params, user_id):
         # Kill all running VMs.
        try:
            service = backendservices()
            credentials = self.user_data.getCredentials()
            terminate_params = {
              "infrastructure": AgentTypes.EC2,
              "credentials": credentials,
              "key_prefix": user_id,
              "user_id": user_id
            }
            stopped = service.stop_ec2_vms(terminate_params, blocking=True)
            if not stopped:
                raise
            result = {'status': True,
                      'msg': 'Successfully terminated all running VMs.'}

        except Exception,e:
            result = {'status': False,
                      'msg': 'Failed to terminate the VMs. Please check their status in the EC2 managment console available from your Amazon account.'}
            context = self.getContext(user_id)
            self.render_response('credentials.html',**(dict(context,**result)))
            return

        self.redirect('/credentials')

    def __handle_ec2_start_vms_request(self, params, user_id):
        logging.info('__handle_ec2_start_vms_request:\n\nparams =\n{0}\n'.format(pprint.pformat(params)))

        context = self.getContext(user_id)
        vms = []
        all_numbers_correct = True
        if 'compute_power' in params:
            if params['compute_power'] == 'small':
                head_node = {"instance_type": 'c3.large', "num_vms": 1}
            else:
                result = {'status': False, 'msg': 'Unknown instance type.'}
                all_numbers_correct = False
        else:
            head_node = None
            if 'head_node' in params:
                head_node = {"instance_type": params['head_node'].replace('radio_', ''), "num_vms": 1}

            for type in self.EC2_INS_TYPES:
                num_type = 'num_' + type

                if num_type in params and params[num_type] != '':
                    if int(params[num_type]) > 20:
                        result = {'status': False, 'msg': 'Number of new vms should be no more than 20.'}
                        all_numbers_correct = False
                        break
                    elif int(params[num_type]) <= 0:
                        result = {'status': False, 'msg': 'Number of new vms should be at least 1.'}
                        all_numbers_correct = False
                        break
                    else:
                        vms.append({"instance_type": type,
                                    "num_vms": int(params[num_type])})

        active_nodes = context['number_creating'] + context['number_pending'] + context['number_running']

        if all_numbers_correct:
            result = self.start_ec2_vms(user_id, self.user_data.getCredentials(), head_node, vms, active_nodes)
            context['starting_vms'] = True
        else:
            context['starting_vms'] = False

        self.redirect('/credentials')

    def __handle_ec2_save_credentials(self, params):
        # Save the access and private keys to the datastore
        credentials = {'EC2_ACCESS_KEY': params['ec2_access_key'],
                       'EC2_SECRET_KEY': params['ec2_secret_key']}
        result = self.saveCredentials(credentials)

        # TODO: This is a hack to make it unlikely that the db transaction has not completed
        # before we re-render the page (which would cause an error). We need some real solution for this...
        time.sleep(0.5)
        self.redirect('/credentials')

    def __handle_form_post_request(self, user_id, params):
        if CredentialsPage.EC2_SAVE_CREDENTIALS in params:
            self.__handle_ec2_save_credentials(params)

        elif CredentialsPage.EC2_START_VMS in params:
            self.__handle_ec2_start_vms_request(params, user_id)

        elif CredentialsPage.EC2_STOP_VMS in params:
            self.__handle_ec2_stop_vms_request(params, user_id)

        else:
            # This happens when you click the refresh button
            self.redirect('/credentials')


    def saveCredentials(self, credentials, database=None):
        """ Save the Credentials to the datastore. """
        try:
            service = backendservices()
            params = {}
            params['credentials'] = credentials
            params["infrastructure"] = AgentTypes.EC2
            
            # Check if the supplied credentials are valid of not
            if service.validateCredentials(params):
                self.user_data.valid_credentials = True
                result = {'status': True, 'credentials_msg': 'Credentials saved successfully! The EC2 keys have been validated.'}
                # See if the amazon db table is intitalized
                if not self.user_data.isTable():
                    db_credentials = self.user_data.getCredentials()
                    # Set the environmental variables
                    os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
                    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']

                    try:
                        if not database:
                            database = DynamoDB(os.environ["AWS_ACCESS_KEY_ID"], os.environ["AWS_SECRET_ACCESS_KEY"])
                            
                        database.createtable(backendservices.STOCHSS_TABLE)
                        database.createtable(backendservices.COST_ANALYSIS_TABLE)
                        self.user_data.is_amazon_db_table=True
                    except Exception,e:
                        pass
            else:
                result = {'status': False,
                          'credentials_msg':' Invalid Secret Key or Access key specified'}
                self.user_data.valid_credentials = False
    
            # Write the credentials to the datastore
            self.user_data.setCredentials(credentials)
            self.user_data.put()
        
    
        except Exception,e:
            result = {'status': False, 'credentials_msg':' There was an error saving the credentials: '+str(e)}
        
        return result

    def deregister_flex_cloud(self, user_id, flex_cloud_machine_info):
        logging.info('deregister_flex_cloud')

        logging.info('flex_cloud_machine_info =\n{}'.format(pprint.pformat(flex_cloud_machine_info)))

        service = backendservices(infrastructure=AgentTypes.FLEX)
        credentials = self.user_data.getCredentials()
        params = {
            'infrastructure': AgentTypes.FLEX,
            'flex_cloud_machine_info': flex_cloud_machine_info,
            'key_prefix': '', # no prefix
            'keyname': '',
            'email': [user_id],
            'credentials': credentials,
            'user_id': user_id,
            'reservation_id': self.user_data.reservation_id
        }

        result = service.deregister_flex_cloud(parameters=params, blocking=True)

        if result == True:
            logging.info('deregister_flex_cloud succeeded!')
            self.user_data.valid_flex_cloud_info = False
            self.user_data.is_flex_cloud_info_set = False
            self.user_data.set_flex_cloud_machine_info([])
            self.user_data.reservation_id = None
            self.user_data.put()
        else:
            logging.error('deregister_flex_cloud failed!')

        self.redirect('/credentials')

    def prepare_flex_cloud(self, user_id, flex_cloud_machine_info):
        logging.info('prepare_flex_cloud: flex_cloud_machine_info =\n{0}'.format(pprint.pformat(flex_cloud_machine_info)))

        credentials = self.user_data.getCredentials()

        reservation_id = backendservices.get_random_alphanumeric()
        logging.info('Generated reservation_id = {0}'.format(reservation_id))

        self.user_data.is_flex_cloud_info_set = True
        self.user_data.reservation_id = reservation_id
        self.user_data.valid_flex_cloud_info = False

        for machine in flex_cloud_machine_info:
            machine['keyfile'] = fileserver.FileWrapper.get_by_id( machine['key_file_id']).storePath

        self.user_data.set_flex_cloud_machine_info(flex_cloud_machine_info)
        self.user_data.put()

        params = {
            'infrastructure': AgentTypes.FLEX,
            'flex_cloud_machine_info': flex_cloud_machine_info,
            'key_prefix': '', # no prefix
            'keyname': '',
            'email': [user_id],
            'user_id': user_id,
            'credentials': credentials,
            'reservation_id': reservation_id
        }

        service = backendservices(infrastructure=AgentTypes.FLEX)

        res, msg = service.prepare_flex_cloud_machines(params)
        if res == True:
            result = {'flex_cloud_status': 'Success',
                      'flex_cloud_info_msg': 'Successfully preparing flex cloud machines...'}
        else:
            result = {'flex_cloud_status': 'Failure',
                      'flex_cloud_info_msg': msg}
        return result


    def __get_ec2_context(self, user_id):
        context = {}
        result = {}

        credentials = self.user_data.getCredentials()
        params = {'infrastructure': AgentTypes.EC2,
                  'credentials': credentials,
                  'user_id': user_id}

        if not self.user_data.valid_credentials:
            result = {'status': False,
                      'vm_status': False,
                      'vm_status_msg': 'Could not determine the status of the VMs: Invalid Credentials!'}

            context['vm_names'] = None
            context['valid_credentials']=False
            context['active_vms']=False

            fake_credentials = { 'EC2_ACCESS_KEY': '',
                                 'EC2_SECRET_KEY': ''}
        else:
            fake_credentials = { 'EC2_ACCESS_KEY': '*' * len(credentials['EC2_ACCESS_KEY']),
                                 'EC2_SECRET_KEY': '*' * len(credentials['EC2_SECRET_KEY'])}
            context['valid_credentials'] = True

            all_vms = self.__get_all_vms(params)
            logging.info('ec2: all_vms = {0}'.format(pprint.pformat(all_vms)))

            if all_vms == None:
                result = {'status': False,
                          'vm_status': False,
                          'vm_status_msg': 'Could not determine the status of the VMs.'}

                context = {'vm_names': all_vms}

            else:
                number_creating = 0
                number_pending = 0
                number_running = 0
                number_failed = 0
                running_instances = {}

                for vm in all_vms:
                    if vm != None and vm['state']=='creating':
                        number_creating += 1
                    elif vm != None and vm['state']=='pending':
                        number_pending += 1
                    elif vm != None and vm['state']=='running':
                        number_running += 1
                        instance_type = vm['instance_type']
                        if instance_type not in running_instances:
                            running_instances[instance_type] = 1
                        else:
                            running_instances[instance_type] = running_instances[instance_type] + 1
                    elif vm != None and vm['state']=='failed':
                        number_failed += 1

                number_of_vms = len(all_vms)

                logging.info("number creating = {0}".format(number_creating))
                logging.info("number pending = {0}".format(number_pending))
                logging.info("number running = {0}".format(number_running))
                logging.info("number failed = {0}".format(number_failed))

                context['number_of_vms'] = number_of_vms
                context['vm_names'] = all_vms
                context['number_creating'] = number_creating
                context['number_pending'] = number_pending
                context['number_running'] = number_running
                context['number_failed'] = number_failed
                context['running_instances'] = running_instances

                result['status']= True
                result['credentials_msg'] = 'The EC2 keys have been validated.'
                if number_running+number_pending+number_creating+number_failed == 0:
                    context['active_vms'] = False
                else:
                    context['active_vms'] = True

                if number_running == 0:
                    context['running_vms'] = False
                else:
                    context['running_vms'] = True

        context = dict(context, **fake_credentials)
        context = dict(result, **context)

        return context


    def __get_flex_context(self, user_id):
        context = {}
        result = {}

        flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()
        logging.info("flex_cloud_machine_info =\n{0}".format(pprint.pformat(flex_cloud_machine_info)))

        result['is_flex_cloud_info_set'] = self.user_data.is_flex_cloud_info_set

        # Fill with dummy if empty
        if flex_cloud_machine_info == None or len(flex_cloud_machine_info) == 0:
            logging.info('Adding dummy flex cloud machine for UI rendering...')
            flex_cloud_machine_info = [{'ip': '', 'keyname': '', 'username': '', 'queue_head': False}]

        else:
            reservation_id = self.user_data.reservation_id
            logging.info('From user_data, reservation_id = {}'.format(reservation_id))

            params = {'infrastructure': AgentTypes.FLEX,
                      'user_id': user_id,
                      'flex_cloud_machine_info': self.user_data.get_flex_cloud_machine_info(),
                      'reservation_id': reservation_id}

            all_vms = self.__get_all_vms(params)
            logging.debug('flex: all_vms =\n{0}'.format(pprint.pformat(all_vms)))

            all_vms_map = {vm['pub_ip']: vm for vm in all_vms}
            logging.debug('flex: all_vms_map =\n{0}'.format(pprint.pformat(all_vms_map)))

            for machine in flex_cloud_machine_info:
                ip = machine['ip']
                if ip in all_vms_map:
                    if all_vms_map[ip]['reservation_id'] == reservation_id:
                        machine['state'] = all_vms_map[ip]['state']
                        machine['description'] = all_vms_map[ip]['description']
                    else:
                        logging.error('From VMStateModel, reservation_id = {} != user_data.reservation_id'.format(
                            all_vms_map[ip]['reservation_id']
                        ))
                        machine['state'] = VMStateModel.STATE_UNKNOWN
                        machine['description'] = VMStateModel.STATE_UNKNOWN

                else:
                    logging.error('Could not find machine with ip : {0}'.format(ip))
                    machine['state'] = VMStateModel.STATE_UNKNOWN
                    machine['description'] = VMStateModel.STATE_UNKNOWN

            for machine in flex_cloud_machine_info:
                machine['key_file_id'] = int(machine['key_file_id'])

            logging.info('After updating from VMStateModel, flex_cloud_machine_info =\n{0}'.format(
                                                                pprint.pformat(flex_cloud_machine_info)))

        context['flex_cloud_machine_info'] = flex_cloud_machine_info

        # Update Flex Cloud Status
        valid_flex_cloud_info = False
        for machine in flex_cloud_machine_info:
            if machine['queue_head'] and machine['state'] == VMStateModel.STATE_RUNNING:
                valid_flex_cloud_info = True

        self.user_data.valid_flex_cloud_info = valid_flex_cloud_info
        logging.info('user_data.valid_flex_cloud_info = {0}'.format(self.user_data.valid_flex_cloud_info))
        self.user_data.put()

        # Check if the flex cloud credentials are valid.
        if not self.user_data.is_flex_cloud_info_set:
            result['flex_cloud_status'] = 'Failure'
            result['flex_cloud_info_msg'] = 'Could not determine the status of the machines: Invalid Flex Cloud Credentials!'
            context['valid_flex_cloud_info'] = False

        else:
            result['flex_cloud_status'] = 'Success'
            result['flex_cloud_info_msg'] = 'At least queue head is running!'
            context['valid_flex_cloud_info'] = True

        # Get Flex SSH Key Info
        flex_ssh_key_info = self.__get_flex_ssh_key_info()
        context['flex_ssh_key_info'] = flex_ssh_key_info

        context = dict(result, **context)
        return context

    def __get_flex_ssh_key_info(self):
        files = fileserver.FileManager.getFiles(self, 'flexKeyFiles')
        flex_ssh_key_info = {f['id']: {'id': f['id'], 'keyname': f['path']} for f in files}
        return flex_ssh_key_info


    def getContext(self, user_id):
        ec2_context = self.__get_ec2_context(user_id)
        flex_context = self.__get_flex_context(user_id)
        context = dict(ec2_context, **flex_context)
        return context
    
    def __get_all_vms(self, params):
        try:
            service = backendservices()
            result = service.describe_machines_from_db(params)
            return result
        except Exception as e:
            logging.error(str(e))
            return None

    def __get_ec2_image_id(self):
        '''
            Check for AMI build by the stochss_ami_manager
                :return: image_id
        '''
        try:
            with open(AWSConfig.EC2_SETTINGS_FILENAME) as fd:
                ec2_config = json.load(fd)
                image_id = ec2_config['ami_id']
        except Exception as e:
            logging.error('Failed to read ami id from {0}: {1}'.format(AWSConfig.EC2_SETTINGS_FILENAME, str(e)))
            image_id = None

        return image_id
                    
    def start_ec2_vms(self, user_id, credentials, head_node, vms_info, active_nodes):
        logging.info('\n\nstart_vms:\nhead_node = {0}\nvms_info = {1}\nactive_nodes = {2}'.format(
            pprint.pformat(head_node),
            pprint.pformat(vms_info),
            pprint.pformat(active_nodes)))

        key_prefix = AgentConfig.get_agent_key_prefix(AgentTypes.EC2, key_prefix=user_id)
        group_random_name = AgentConfig.get_random_group_name(prefix=key_prefix)

        logging.debug("key_prefix = {0}".format(key_prefix))
        logging.debug("group_random_name = {0}".format(group_random_name))

        reservation_id = backendservices.get_random_alphanumeric()
        logging.info('Generated reservation_id = {0}'.format(reservation_id))

        params ={
            "infrastructure": AgentTypes.EC2,
            'group': group_random_name,
            'vms': vms_info,
            'image_id': None,
            'key_prefix': key_prefix,
            'keyname': group_random_name,
            'email': [user_id],
            'user_id': user_id,
            'credentials': credentials,
            'use_spot_instances' :False,
            'reservation_id': reservation_id
        }

        image_id = self.__get_ec2_image_id()
        if image_id == None:
            return {
                'status':False,
                'msg': 'Cannot load Amazon EC2 Image configuration!'
            }
        else:
            params['image_id'] = image_id


        service = backendservices()
        
        if active_nodes == 0:
            if head_node is None:
                return {'status':False ,
                        'msg': "At least one head node needs to be launched."}
            else:
                params['head_node'] = head_node
                
        elif head_node:
            params['vms'] = [head_node]
                      
        res, msg = service.start_ec2_vms(params)
        if res == True:
            result = {
                'status':True,
                'msg': 'Successfully requested starting virtual machines. Processing request...'
            }
        else:
            result = {
                'status':False,
                'msg': msg
            }

        return result



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

class FlexCredentialsIsDeletablePage(BaseHandler):
    def authentication_required(self):
        return True

    def __get_flex_ssh_key_info(self):
        files = fileserver.FileManager.getFiles(self, 'flexKeyFiles')
        logging.info('files =\n{}'.format(files))

        flex_ssh_key_info = []
        if self.user_data.valid_flex_cloud_info:
            flex_ssh_keyfiles_in_use = [machine['keyfile'] for machine in self.user_data.get_flex_cloud_machine_info()]
            logging.debug('flex_ssh_keyfiles_in_use =\n{}'.format(flex_ssh_keyfiles_in_use))

            for f in files:
                flex_ssh_keyfile = f["storePath"]
                flex_id = f["id"]

                if flex_ssh_keyfile in flex_ssh_keyfiles_in_use:
                    flex_ssh_key_info.append({'id': flex_id, 'is_deletable': False})
                else:
                    flex_ssh_key_info.append({'id': flex_id, 'is_deletable': True})
        else:
            flex_ssh_key_info = [{'id': f["id"], 'is_deletable': True} for f in files]

        logging.debug('flex_ssh_key_info =\n{}'.format(pprint.pformat(flex_ssh_key_info)))
        return { f["id"] : { "is_deletable" : f["is_deletable"] } for f in flex_ssh_key_info }

    def get(self):
        self.response.content_type = 'application/json'
        self.response.write(json.dumps(self.__get_flex_ssh_key_info()))
