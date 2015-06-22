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

from backend.common.config import AWSConfig, AgentTypes, AgentConfig, FlexConfig, JobDatabaseConfig
from backend.databases.dynamo_db import DynamoDB
from backend.vm_state_model import VMStateModel

import fileserver

class FlexCredentialsPage(BaseHandler):
    HEAD_NODE_TYPES = ["c3.large", "c3.xlarge"]

    FLEX_PREPARE_CLOUD = 'prepare_flex_cloud'
    FLEX_DEREGISTER_CLOUD = 'deregister_flex_cloud'
    FLEX_REFRESH_CLOUD = 'refresh_flex_cloud'
    
    def authentication_required(self):
        return True
    
    def get(self):
        logging.debug('GET')

        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')
        
        context = self.getContext(user_id)

        self.render_response('flex_cloud_credentials.html', **context)


    def __handle_json_post_request(self, data_received, user_id):
        logging.debug('__handle_json_post_request: action = {}'.format(data_received['action']))

        if data_received['action'] == FlexCredentialsPage.FLEX_PREPARE_CLOUD:
            logging.debug("data_received['action'] = {0} = FlexCredentialsPage.FLEX_PREPARE_CLOUD".format(data_received['action']))
            flex_cloud_machine_info = data_received['flex_cloud_machine_info']
            logging.debug("flex_cloud_machine_info = {0}".format(flex_cloud_machine_info))
            result = self.prepare_flex_cloud(user_id, flex_cloud_machine_info)
            logging.debug("result = {0}".format(result))
            self.redirect('/flexCloudCredentials')
        elif data_received['action'] == FlexCredentialsPage.FLEX_DEREGISTER_CLOUD:
            logging.debug("data_received['action'] = {0} = FlexCredentialsPage.FLEX_DEREGISTER_CLOUD".format(data_received['action']))
            result = self.deregister_flex_cloud(user_id)
            logging.debug("result = {0}".format(result))
            self.redirect('/flexCloudCredentials')
        elif data_received['action'] == FlexCredentialsPage.FLEX_REFRESH_CLOUD:
            logging.debug("data_received['action'] = {0} = FlexCredentialsPage.FLEX_REFRESH_CLOUD".format(data_received['action']))
            result = self.refresh_flex_cloud(user_id)
            logging.debug("result = {0}".format(result))
            self.redirect('/flexCloudCredentials')
        else:
            self.redirect('/flexCloudCredentials')

    def post(self):
        logging.debug('POST')
        logging.debug("request.body = {0}".format(self.request.body))
        logging.debug("CONTENT_TYPE = {0}".format(self.request.environ['CONTENT_TYPE']))

        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')

        data_received = json.loads(self.request.body)
        logging.debug("json data = \n{0}".format(pprint.pformat(data_received)))
        self.__handle_json_post_request(data_received, user_id)


    def deregister_flex_cloud(self, user_id):
        logging.debug('deregister_flex_cloud')

        service = backendservices(self.user_data) #infrastructure=AgentTypes.FLEX)
        credentials = self.user_data.getCredentials()
        params = {
            'infrastructure': AgentTypes.FLEX,
            'flex_cloud_machine_info': self.user_data.get_flex_cloud_machine_info(),
            'flex_queue_head': self.user_data.get_flex_queue_head_machine(),
            'key_prefix': '', # no prefix
            'keyname': '',
            'email': [user_id],
            'credentials': credentials,
            'user_id': user_id,
            'reservation_id': self.user_data.reservation_id
        }
        self.user_data.flex_cloud_status = True
        self.user_data.flex_cloud_info_msg = 'Deregistering Flex Cloud'
        self.user_data.put()

        result = service.deregister_flex_cloud(parameters=params, blocking=True)

        if result == True:
            logging.debug('deregister_flex_cloud succeeded!')
            self.user_data.valid_flex_cloud_info = False
            self.user_data.is_flex_cloud_info_set = False

            # delete state, description from old_flex_cloud_machine_info
            old_flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()
            for machine in old_flex_cloud_machine_info:
                if 'state' in machine:
                    del machine['state']
                if 'description' in machine:
                    del machine['description']

            self.user_data.set_flex_cloud_machine_info(old_flex_cloud_machine_info)
            self.user_data.reservation_id = None
            self.user_data.flex_db_password = None
            self.user_data.flex_cloud_status = None
            self.user_data.flex_cloud_info_msg = ''
            self.user_data.put()
        else:
            logging.error('deregister_flex_cloud failed!')
            self.user_data.flex_cloud_status = True
            self.user_data.flex_cloud_info_msg = 'Error when deregistering Flex Cloud'
            self.user_data.put()


        self.redirect('/flexCloudCredentials')

    def prepare_flex_cloud(self, user_id, flex_cloud_machine_info):
        logging.debug('prepare_flex_cloud: flex_cloud_machine_info =\n{0}'.format(pprint.pformat(flex_cloud_machine_info)))

        credentials = self.user_data.getCredentials()

        reservation_id = backendservices.get_random_alphanumeric()
        logging.debug('Generated reservation_id = {0}'.format(reservation_id))

        self.user_data.is_flex_cloud_info_set = True
        self.user_data.reservation_id = reservation_id
        self.user_data.valid_flex_cloud_info = False

        for machine in flex_cloud_machine_info:
            machine['keyfile'] = fileserver.FileWrapper.get_by_id( machine['key_file_id']).storePath

        self.user_data.set_flex_cloud_machine_info(flex_cloud_machine_info)
        self.user_data.flex_db_password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(16))
        self.user_data.put()

        params = {
            'infrastructure': AgentTypes.FLEX,
            'flex_cloud_machine_info': flex_cloud_machine_info,
            'key_prefix': '', # no prefix
            'keyname': '',
            'email': [user_id],
            'user_id': user_id,
            'credentials': credentials,
            'reservation_id': reservation_id,
            'flex_db_password': self.user_data.flex_db_password,
            'flex_queue_head': self.user_data.get_flex_queue_head_machine()
        }

        service = backendservices(self.user_data)

        res, msg, ids = service.prepare_flex_cloud_machines(params)

        for idN, machine in zip(ids, flex_cloud_machine_info):
            machine['database_id'] = idN

        self.user_data.set_flex_cloud_machine_info(flex_cloud_machine_info)
        self.user_data.flex_cloud_status = True
        #self.user_data.flex_cloud_info_msg = 'Flex Cloud configured. Waiting for workers to become available...'
        self.user_data.flex_cloud_info_msg = 'Preparing Flex Cloud'
        self.user_data.put()

        if res == True:
            result = {'flex_cloud_status': True,
                      'flex_cloud_info_msg': 'Preparing Flex Cloud'}
        else:
            result = {'flex_cloud_status': False,
                      'flex_cloud_info_msg': msg }
        return result
##############
    def refresh_flex_cloud(self, user_id):
        service = backendservices(self.user_data)
        service.describe_machines_from_db(AgentTypes.FLEX, force=True)

##############


    def __get_flex_context(self, user_id):
        context = {}
        result = {}

        flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()
        logging.debug("flex_cloud_machine_info =\n{0}".format(pprint.pformat(flex_cloud_machine_info)))

        result['is_flex_cloud_info_set'] = self.user_data.is_flex_cloud_info_set

        # Fill with dummy if empty
        if flex_cloud_machine_info is None or len(flex_cloud_machine_info) == 0:
            logging.debug('Adding dummy flex cloud machine for UI rendering...')
            flex_cloud_machine_info = [{'ip': '', 'keyname': '', 'username': '', 'queue_head': True, 'state': ''}]
        else:
            service = backendservices(self.user_data)
            self.user_data.update_flex_cloud_machine_info_from_db(service)
            flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()

            if self.user_data.is_flex_cloud_info_set:
                terminated = True
                all_running = True
                for machine in flex_cloud_machine_info:
                    if machine['state'] != 'terminated' and machine['state'] != 'inaccessible':
                        terminated = False
                    if machine['state'] != 'running':
                        all_running = False
            
                if terminated:
                    self.deregister_flex_cloud(self.user.user_id())

                    self.user_data.flex_cloud_status = False
                    self.user_data.flex_cloud_info_msg = 'Flex Cloud failed to deploy'
                    self.user_data.put()

                    self.user_data.update_flex_cloud_machine_info_from_db(service)
                    flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()
                elif all_running:
                    self.user_data.flex_cloud_status = True
                    self.user_data.flex_cloud_info_msg = 'Flex Cloud Deployed'
                    self.user_data.put()
        # We must ensure queue head is first element in this list for GUI to work properly
        flex_cloud_machine_info = sorted(flex_cloud_machine_info, key=lambda x: x['queue_head'], reverse=True)

        context['flex_cloud_machine_info'] = flex_cloud_machine_info

        logging.debug('user_data.valid_flex_cloud_info = {0}'.format(self.user_data.valid_flex_cloud_info))
        context['valid_flex_cloud_info'] = self.user_data.valid_flex_cloud_info

        # Check if the flex cloud credentials are valid.
        context['flex_cloud_status'] = self.user_data.flex_cloud_status
        context['flex_cloud_info_msg'] = self.user_data.flex_cloud_info_msg
#        if self.user_data.is_flex_cloud_info_set:
#            if not self.user_data.valid_flex_cloud_info:
#                context['flex_cloud_status'] = True
#                context['flex_cloud_info_msg'] = 'Flex Cloud configured. Waiting for workers to become available...'

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
        context = self.__get_flex_context(user_id)
        return context
    
    def __get_all_vms(self, params):
        logging.debug('__get_all_vms() params={0}'.format(params))
        service = backendservices(self.user_data)
        result = service.describe_machines_from_db(params['infrastructure'])
        logging.debug('service.describe_machines_from_db = {0}'.format(result))
        return result


class CredentialsPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        logging.debug('GET')

        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')
        
        context = self.getContext(user_id)

        self.render_response('credentials.html', **context)


    def __get_ec2_context(self, user_id):
        context = {}
        result = {}
        # Need a default
        context['active_vms'] = False

        credentials = self.user_data.getCredentials()

        params = {'infrastructure': AgentTypes.EC2,
                  'credentials': credentials,
                  'user_id': user_id}

        if not self.user_data.valid_credentials:
            context['active_vms'] = False
        else:
            all_vms = self.__get_all_vms(params)
            logging.debug('ec2: all_vms = {0}'.format(pprint.pformat(all_vms)))

            if all_vms is None:
                context['active_vms'] = False
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

                if number_running+number_pending+number_creating+number_failed == 0:
                    context['active_vms'] = False
                else:
                    context['active_vms'] = True

        return context


    def __get_flex_context(self, user_id):
        service = backendservices(self.user_data)
        self.user_data.update_flex_cloud_machine_info_from_db(service)
        flex_cloud_machine_info = self.user_data.get_flex_cloud_machine_info()

        context = { 'is_flex_cloud_info_set' : self.user_data.is_flex_cloud_info_set,
                    'valid_flex_cloud_info' : self.user_data.valid_flex_cloud_info }

        return context

    def getContext(self, user_id):
        ec2_context = self.__get_ec2_context(user_id)
        flex_context = self.__get_flex_context(user_id)
        context = dict(ec2_context, **flex_context)
        return context
    
    def __get_all_vms(self, params):
        logging.debug('__get_all_vms() params={0}'.format(params))
        service = backendservices(self.user_data)
        result = service.describe_machines_from_db(params['infrastructure'])
        logging.debug('service.describe_machines_from_db = {0}'.format(result))
        return result


class EC2CredentialsPage(BaseHandler):
    EC2_INS_TYPES = ["t1.micro", "m1.small", "m3.medium", "m3.large", "c3.large", "c3.xlarge"]
    HEAD_NODE_TYPES = ["c3.large", "c3.xlarge"]

    EC2_SAVE_CREDENTIALS = 'ec2_save_creds'
    EC2_START_VMS = 'ec2_start'
    EC2_STOP_VMS = 'ec2_stop'

    def authentication_required(self):
        return True
    
    def get(self):
        logging.debug('GET')

        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')
        
        context = self.getContext(user_id)

        self.render_response('ec2_credentials.html', **context)

    def post(self):
        logging.debug('POST')
        logging.debug("request.body = {0}".format(self.request.body))
        logging.debug("CONTENT_TYPE = {0}".format(self.request.environ['CONTENT_TYPE']))
        
        user_id = self.user.user_id()
        if user_id is None:
            raise InvalidUserException('Cannot determine the current user!')

        params = self.request.POST
        logging.debug('params = self.request.POST = {0}'.format(params))
        self.__handle_form_post_request(user_id, params)


    def __handle_ec2_stop_vms_request(self, params, user_id):
         # Kill all running VMs.
        service = backendservices(self.user_data)
        credentials = self.user_data.getCredentials()
        terminate_params = {
            "infrastructure": AgentTypes.EC2,
            "credentials": credentials,
            "key_prefix": user_id,
            "user_id": user_id
        }

        stopped = service.stop_ec2_vms(terminate_params, blocking=True)

        if not stopped:
            raise Exception("Failed to stop VMs")

        self.redirect('/ec2Credentials')

    def __handle_ec2_start_vms_request(self, params, user_id):
        logging.debug('__handle_ec2_start_vms_request:\n\nparams =\n{0}\n'.format(pprint.pformat(params)))
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

        self.redirect('/ec2Credentials')

    def __handle_ec2_save_credentials(self, params):
        # Save the access and private keys to the datastore
        credentials = {'EC2_ACCESS_KEY': params['ec2_access_key'],
                       'EC2_SECRET_KEY': params['ec2_secret_key']}
        result = self.saveCredentials(credentials)

        # TODO: This is a hack to make it unlikely that the db transaction has not completed
        # before we re-render the page (which would cause an error). We need some real solution for this...
        time.sleep(0.5)
        self.redirect('/ec2Credentials')

    def __handle_form_post_request(self, user_id, params):
        try:
            if EC2CredentialsPage.EC2_SAVE_CREDENTIALS in params:
                self.__handle_ec2_save_credentials(params)

            elif EC2CredentialsPage.EC2_START_VMS in params:
                self.__handle_ec2_start_vms_request(params, user_id)

            elif EC2CredentialsPage.EC2_STOP_VMS in params:
                self.__handle_ec2_stop_vms_request(params, user_id)

            else:
                # This happens when you click the refresh button
                self.redirect('/ec2Credentials')
        except Exception, e:
            logging.exception(e)
            result = { 'status' : False,
                       'msg' : 'Error: {0}'.format(e) }
            context = self.getContext(user_id)
            self.render_response('ec2_credentials.html',**(dict(context,**result)))
            return

    def saveCredentials(self, credentials, database=None):
        """ Save the Credentials to the datastore. """
        logging.debug('Saving EC2 credentials...')
        service = backendservices(self.user_data)
        params = {}
        params['credentials'] = credentials
        params["infrastructure"] = AgentTypes.EC2
        
        # Check if the supplied credentials are valid of not
        if service.validateCredentials(params):
            self.user_data.valid_credentials = True
            result = {'credentials_status': True, 'credentials_msg': 'Credentials saved successfully! The EC2 keys have been validated.'}
            # See if the amazon db table is intitalized
            if not self.user_data.isTable():
                db_credentials = self.user_data.getCredentials()
                # Set the environmental variables
                #                    os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
                #                    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']

                try:
                    if not database:
                        database = DynamoDB(access_key=credentials['EC2_ACCESS_KEY'],
                                            secret_key=credentials['EC2_SECRET_KEY'])
                            
                    database.createtable(JobDatabaseConfig.TABLE_NAME)
                    database.createtable(JobDatabaseConfig.COST_ANALYSIS_TABLE_NAME)

                    self.user_data.is_amazon_db_table = True

                except Exception,e:
                    logging.error('Failed to create database tables', str(e))
        else:
            result = {'credentials_status': False,
                      'credentials_msg':' Invalid Secret Key or Access key specified'}
            self.user_data.valid_credentials = False
    
        # Write the credentials to the datastore
        self.user_data.setCredentials(credentials)
        self.user_data.put()
        
        return result

    def __get_ec2_context(self, user_id):
        context = {}
        result = {}
        # Need a default
        context['active_vms'] = False

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
            logging.debug('ec2: all_vms = {0}'.format(pprint.pformat(all_vms)))

            if all_vms is None:
                result = {'status': False,
                          'vm_status': False,
                          'vm_status_msg': 'Could not determine the status of the VMs.'}

                context['vm_names'] = all_vms

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

                logging.debug("number creating = {0}".format(number_creating))
                logging.debug("number pending = {0}".format(number_pending))
                logging.debug("number running = {0}".format(number_running))
                logging.debug("number failed = {0}".format(number_failed))

                context['number_of_vms'] = number_of_vms
                context['vm_names'] = all_vms
                context['number_creating'] = number_creating
                context['number_pending'] = number_pending
                context['number_running'] = number_running
                context['number_failed'] = number_failed
                context['running_instances'] = running_instances

                result['credentials_status']= True
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


        logging.debug('*'*80)
        logging.debug("context['active_vms'] = '{0}'".format(context['active_vms']))
        logging.debug('*'*80)
        return context


    def getContext(self, user_id):
        return self.__get_ec2_context(user_id)
    
    def __get_all_vms(self, params):
        logging.debug('__get_all_vms() params={0}'.format(params))
        service = backendservices(self.user_data)
        result = service.describe_machines_from_db(params['infrastructure'])
        logging.debug('service.describe_machines_from_db = {0}'.format(result))
        return result

    def __get_ec2_image_id(self):
        '''
            Check for AMI build by the stochss_ami_manager
                :return: image_id
        '''
        try:
            with open(AWSConfig.EC2_SETTINGS_FILENAME) as fd:
                ec2_config = json.load(fd)
                image_id = ec2_config['ami_id']
        except IOError as e:
            logging.error('Failed to read ami id from {0}: {1}'.format(AWSConfig.EC2_SETTINGS_FILENAME, str(e)))
            image_id = None

        return image_id
                    
    def start_ec2_vms(self, user_id, credentials, head_node, vms_info, active_nodes):
        logging.debug('\n\nstart_vms:\nhead_node = {0}\nvms_info = {1}\nactive_nodes = {2}'.format(
            pprint.pformat(head_node),
            pprint.pformat(vms_info),
            pprint.pformat(active_nodes)))
            
        logging.debug('*'*80)
        logging.debug("Cleaning up TERMINATED entries in the DB")
        VMStateModel.delete_terminated(user_id)
        logging.debug('*'*80)

        key_prefix = AgentConfig.get_agent_key_prefix(AgentTypes.EC2, key_prefix=user_id)
        group_random_name = AgentConfig.get_random_group_name(prefix=key_prefix)

        logging.debug("key_prefix = {0}".format(key_prefix))
        logging.debug("group_random_name = {0}".format(group_random_name))

        reservation_id = backendservices.get_random_alphanumeric()
        logging.debug('Generated reservation_id = {0}'.format(reservation_id))

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


        service = backendservices(self.user_data)
        
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
        
        logging.debug(context)
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
