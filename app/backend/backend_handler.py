import webapp2
from google.appengine.api import background_thread, urlfetch, modules
from agents.base_agent import AgentRuntimeException
from utils import utils
import pickle
import urllib

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib', 'amqp'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib', 'kombu'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib', 'celery'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib', 'billiard'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib', 'anyjson'))

import time
import logging
from threading import Timer
import datetime
import pprint
import traceback
import urllib2
import json

sys.path.append(os.path.join(os.path.dirname(__file__), '..' ))
from db_models.user_data import UserData

from google.appengine.ext import db
from kombu import Queue, Exchange

from common.config import AgentTypes, AgentConfig, FlexConfig, JobDatabaseConfig
import common.helper as helper
from databases.flex_db import FlexDB
from db_models.vm_state_model import VMStateModel

BACKEND_NAME = 'backendthread'
BACKEND_URL = 'http://%s' % modules.get_hostname(BACKEND_NAME)

BACKEND_START = '{0}/_ah/start'.format(BACKEND_URL)
BACKEND_BACKGROUND = '{0}/_ah/background'.format(BACKEND_URL)
BACKEND_SYN_R_URL = '{0}/backend/synchronizedb'.format(BACKEND_URL)
BACKEND_MANAGER_R_URL = '{0}/backend/manager'.format(BACKEND_URL)
BACKEND_QUEUE_R_URL = 'http://{0}{1}'.format(modules.get_hostname('backendqueue'),
                                             '/backend/queue')
BACKEND_PREPARE_VMS_OP = 'prepare_vms'

INS_TYPES_EC2 = ["t1.micro", "m1.small", "m3.medium", "m3.large", "c3.large", "c3.xlarge"]


class VMStateSyn(db.Model):
    last_syn = db.DateTimeProperty()
    infra = db.StringProperty()
    thread_id = db.IntegerProperty()  #So only one thread is active per infra

class BackendWorker(object):
    def prepare_vms(self, parameters):
        raise NotImplementedError


class FlexBackendWorker(BackendWorker):
    POLL_COUNT = 10
    POLL_WAIT_TIME = 5

    PARAM_IS_QUEUE_HEAD = 'queue_head'
    PARAM_FLEX_CLOUD_MACHINE_INFO = 'flex_cloud_machine_info'
    PARAM_FLEX_DB_PASSWORD = 'flex_db_password'
    PARAM_FLEX_QUEUE_HEAD = 'flex_queue_head'


    def __init__(self, agent, infra_manager, reservation_id):
        logging.info('FlexBackendWorker(agent = {0}, infra_manager = {1} reservation_id = {2})'.format(agent,
                                                                                    infra_manager, reservation_id))
        self.agent = agent
        self.agent_type = self.agent.AGENT_NAME
        if self.agent_type != AgentTypes.FLEX:
            raise Exception('FlexBackendWorker does not work for agent {0}!'.format(self.agent.AGENT_NAME))

        self.infra_manager = infra_manager
        self.reservation_id = reservation_id

    def __get_queue_head_from_params(self, flex_cloud_machine_info, parameters):
        queue_head_machine = None
        for machine in flex_cloud_machine_info:
            if machine[self.PARAM_IS_QUEUE_HEAD]:
                if queue_head_machine != None:
                    logging.error('Error: Multiple queue heads !')
                    user_data.flex_cloud_status = False
                    user_data.flex_cloud_info_msg = 'Error: Multiple queue heads'
                    user_data.put()
                    return None
                else:
                    queue_head_machine = machine

        if queue_head_machine == None:
            logging.error('Error: No queue head !')
            user_data.flex_cloud_status = False
            user_data.flex_cloud_info_msg = 'Error: No queue head'
            user_data.put()
            return None

        return queue_head_machine

    def __get_user_data(self, user_id):
        user_data = db.GqlQuery("SELECT * FROM UserData WHERE user_id = :1", user_id).get()
        if user_data is None:
            raise Exception("Can not find UserData for user_id = '{0}'".format(user_id))
        return user_data

    def prepare_vms(self, parameters):
        logging.debug('prepare_vms(): parameters={0}'.format(parameters))

        queue_head_machine = parameters[self.PARAM_FLEX_QUEUE_HEAD]

        user_data = self.__get_user_data(parameters['user_id'])

        if self.PARAM_FLEX_CLOUD_MACHINE_INFO not in parameters \
                or parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO] == None \
                or parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO] == []:

            logging.error('Error: No {0} param!'.format(self.PARAM_FLEX_CLOUD_MACHINE_INFO))
            # Report Error
            user_data.flex_cloud_status = False
            user_data.flex_cloud_info_msg = 'Invalid Parameters'
            user_data.put()
            return

        flex_cloud_machine_info = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
    
        # Set the user message to "configuring..."
        user_data.flex_cloud_status = True
        user_data.flex_cloud_info_msg = 'Flex Cloud configured. Waiting for workers to become available...'
        user_data.put()
        
        # Initialize the VMstateModel db
        all_accessible = True
        for machine in flex_cloud_machine_info:
            if self.agent.check_network_ports(machine['ip'], [22, 443]):
                state = VMStateModel.STATE_ACCESSIBLE
            else:
                state = VMStateModel.STATE_INACCESSIBLE
                all_accessible = False
            vm_state = VMStateModel(state=state,
                                    infra=self.agent_type,
                                    ins_type=FlexConfig.INSTANCE_TYPE,
                                    pri_ip=machine['ip'],
                                    pub_ip=machine['ip'],
                                    username=machine['username'],
                                    keyfile=machine['keyfile'],
                                    ins_id= self.agent.get_flex_instance_id(machine['ip']),
                                    user_id=parameters['user_id'],
                                    res_id=self.reservation_id)
            vm_state.put()
            
        if not all_accessible:
            # Report Failure
            user_data.flex_cloud_status = False
            user_data.flex_cloud_info_msg = 'Error: not all workers are accessible'
            user_data.put()
            return
        

        if queue_head_machine == None or not helper.wait_for_ssh_connection(queue_head_machine['keyfile'],queue_head_machine['ip'],username=queue_head_machine['username']):
            logging.error('Found no viable ssh-able/running queue head machine!')
            # Report Failure
            user_data.flex_cloud_status = False
            user_data.flex_cloud_info_msg = 'Error: Can not connect {0} (queue head) via SSH'.format(queue_head_machine['ip'])
            user_data.put()
            return

        if not self.__prepare_queue_head(queue_head_machine, parameters):
            logging.error('Error: could not prepare queue head!')
            # Report Failure
            user_data.flex_cloud_status = False
            user_data.flex_cloud_info_msg = 'Error preparing the queue head'
            user_data.put()
            return


        flex_cloud_workers = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            if machine[self.PARAM_IS_QUEUE_HEAD] != True:
                if helper.wait_for_ssh_connection(machine['keyfile'],machine['ip'],username=machine['username']):
                    flex_cloud_workers.append(machine)
                else:
                    # Report Failure
                    user_data.flex_cloud_status = False
                    user_data.flex_cloud_info_msg = 'Error: Can not connect to {0} via SSH'.format(machine['ip'])
                    user_data.put()
                    return

            if len(flex_cloud_workers) > 0:
                logging.debug('Preparing workers: {0}'.format(flex_cloud_workers))
                params = {
                    'infrastructure': AgentTypes.FLEX,
                    self.PARAM_FLEX_CLOUD_MACHINE_INFO: flex_cloud_workers,
                    'credentials': parameters['credentials'],
                    'user_id': parameters['user_id'],
                    self.PARAM_FLEX_QUEUE_HEAD: parameters[self.PARAM_FLEX_QUEUE_HEAD],
                    'reservation_id': parameters['reservation_id']
                }
                self.agent.prepare_instances(params)

        helper.update_celery_config_with_queue_head_ip(queue_head_ip=queue_head_machine['ip'],
                                                               agent_type=self.agent_type)

        self.__configure_celery(params=parameters)

        # Report Success
        logging.debug('Flex Cloud Deployed')
        user_data.flex_cloud_status = True 
        user_data.flex_cloud_info_msg = 'Flex Cloud Deployed'
        user_data.put()
        
        # Force the update of the instance status
        VMStateModel.synchronize(agent = self.agent, parameters = parameters)
        
        return


    def __prepare_queue_head(self, queue_head_machine, parameters):
        logging.debug('*'*80)
        logging.debug('*'*80)
        logging.debug('__prepare_queue_head(queue_head_machine={0}, parameters={1})'.format(queue_head_machine, parameters))
        keyfile = queue_head_machine['keyfile']
        if not os.path.exists(keyfile):
            logging.error('Queue head keyfile: {0} does not exist!'.format(keyfile))
            return False

        success = helper.wait_for_ssh_connection(key_file=keyfile,
                                                 ip=queue_head_machine['ip'],
                                                 username=queue_head_machine['username'])

        if success == True:
            logging.info('Queue Head with ip {0} is successfully ssh-able'.format(queue_head_machine['ip']))
        else:
            logging.error('Queue Head ssh failed!')
            logging.debug('-'*80)
            logging.debug('-'*80)
            return False

        try:
            queue_head_prepare_params = {
                'infrastructure': AgentTypes.FLEX,
                self.PARAM_FLEX_CLOUD_MACHINE_INFO: [queue_head_machine],
                'credentials': parameters['credentials'],
                'user_id': parameters['user_id'],
                self.PARAM_FLEX_DB_PASSWORD: parameters[self.PARAM_FLEX_DB_PASSWORD],
                self.PARAM_FLEX_QUEUE_HEAD: parameters[self.PARAM_FLEX_QUEUE_HEAD]
            }
            self.agent.prepare_instances(queue_head_prepare_params)

            # Create stochss table in flex db in queue head
            database = FlexDB(password=parameters[self.PARAM_FLEX_DB_PASSWORD], ip=queue_head_machine['ip'])
            database.createtable(JobDatabaseConfig.TABLE_NAME)

            logging.debug('-'*80)
            logging.debug('-'*80)
            return True

        except Exception as e:
            logging.error(e)
            logging.debug('-'*80)
            logging.debug('-'*80)
            return False


    def __configure_celery(self, params):
        '''
        Private method used for uploading the current celery configuration to each instance
        that is running and ssh connectable.

        Args
            parameters      A dictionary of parameters
        '''
        # Update celery config file...it should have the correct IP
        # of the Queue head node, which should already be running.
        # Pass it line by line so theres no weird formatting errors from
        # trying to echo a multi-line file directly on the command line

        logging.debug('__configure_celery() params={0}'.format(params))
        flex_cloud_machine_info = params[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        
        instance_types = []
        for machine in flex_cloud_machine_info:
            vm = VMStateModel.get_by_ip(machine['ip'], reservation_id=params['reservation_id'])
            commands = []
            my_ins_type = 'Unknown'
            commands.append('source ~/.bashrc')
            if vm is None:
                logging.error('VMStateModel.get_by_ip({0}) in None'.format(machine['ip']))
                continue
            else:
                my_ins_type = vm.ins_type
                commands.append('export INSTANCE_TYPE={0}'.format(vm.ins_type))
                if vm.ins_type not in instance_types:
                    instance_types.append(vm.ins_type)

            ip = machine['ip']
            keyfile = machine['keyfile']
            username = machine['username']

            success = helper.start_celery_on_vm(instance_type=my_ins_type, ip=ip, key_file=keyfile,
                                                username=username,
                                                agent_type=self.agent_type,
                                                worker_name=ip.replace('.', '_'),
                                                prepend_commands=commands)
            if success == 0:
                # update db with successful running vms
                logging.info("celery started on host ip: {0}".format(ip))

            else:
                raise Exception("Fail to start celery on {0}".format(ip))

        # get all intstance types and configure the celeryconfig.py locally
        logging.info('For local celery setup, instance_types = {0}'.format(instance_types))
        helper.config_celery_queues(agent_type=self.agent_type, instance_types=instance_types)



class EC2BackendWorker(BackendWorker):
    '''
    EC2BackendWorker does the job of spawning virtual machines on a specific agent and
    configuring celery workers on those machines.
    Currently, it is implemented in a blocking mode.   
    '''

    POLL_COUNT = 10
    POLL_WAIT_TIME = 5

    def __init__(self, agent, infra_manager, reservation_id):
        self.agent = agent
        self.agent_type = self.agent.AGENT_NAME
        if self.agent_type != AgentTypes.EC2:
            raise Exception('EC2BackendWorker does not work for agent {0}!'.format(self.agent.AGENT_NAME))

        self.infra_manager = infra_manager
        self.reservation_id = reservation_id


    def prepare_vms(self, parameters):
        """
        Public method for preparing a set of VMs

        Args:
        parameters      A dictionary of parameters
        """
        logging.debug("prepare_vms(): nparameters = {0}".format(parameters))

        if not parameters["vms"] and 'head_node' not in parameters:
            logging.error("No vms are waiting to be prepared or head_node is not specified!")
            return

        try:
            # ##################################################
            # step 1: run instance based on queue head or not #
            # ##################################################

            num_vms, parameters = self.__prepare_queue_head(parameters)
            if num_vms == None and parameters == None:
                return


            # ########################################################################
            # step 2: poll the status of instances, if not running, terminate them  #
            #########################################################################
            public_ips, private_ips, instance_ids = self.__poll_instances_status(num_vms, parameters)
            if public_ips == None:
                if not self.__is_queue_head_running(parameters):
                    # if last time of spawning queue head failed, spawn another queue head again
                    self.prepare_vms(parameters)
                else:
                    return

            ############################################################
            # step 3: set alarm for the nodes, if it is NOT queue head #
            ############################################################
            # logging.info('Set shutdown alarm')
            #
            # try:
            #     if "queue_head" not in parameters or parameters["queue_head"] == False:
            #         for ins_id in instance_ids:
            #             agent.make_sleepy(parameters, ins_id)
            #     else:
            #         agent.make_sleepy(parameters, instance_ids[0], '7200')
            #
            # except:
            #     raise Exception('Errors in set alarm for instances.')

            ########################################################
            # step 4: verify whether nodes are connectable via ssh #
            ########################################################
            connected_public_ips, connected_instance_ids = self.__verify_ec2_instances_via_ssh(parameters=parameters,
                                                                                               public_ips=public_ips,
                                                                                               instance_ids=instance_ids)

            if len(connected_public_ips) == 0:
                if not self.__is_queue_head_running(parameters):
                    # if last time of spawning queue head failed, spawn another queue head again
                    self.prepare_vms(parameters)
                else:
                    return


            #########################################
            # step 5: configure celery on each node #
            #########################################
            if "queue_head" in parameters and parameters["queue_head"] == True:
                queue_head_ip = connected_public_ips[0]
                logging.info('queue_head_ip: {0}'.format(queue_head_ip))
                # celery configuration needs to be updated with the queue head ip
                helper.update_celery_config_with_queue_head_ip(queue_head_ip=queue_head_ip,
                                                               agent_type=self.agent_type)

            # copy celery configure to nodes.
            self.__configure_celery(parameters, connected_public_ips, connected_instance_ids)

            #####################################################################
            # step 6: if current node is queue head, may need to spawn the rest #
            #####################################################################

            if "queue_head" in parameters and parameters["queue_head"] == True:
                self.prepare_vms(parameters)
            else:
                # else all vms requested are finished spawning. Done!
                return

        except Exception as e:
            logging.exception(e)


    def __launch_ec2_queue_head(self, parameters):
        logging.info('About to start an EC2 queue head...')
        parameters["queue_head"] = True
        requested_key_name = parameters["keyname"]

        # get the largest instance_type and let it to be queue head
        head_node = parameters['head_node']
        parameters["instance_type"] = head_node["instance_type"]
        parameters["num_vms"] = 1
        parameters["shutdown"] = "terminate"

        num_vms = 1

        # Tag queue head key so that it can be differentiated if necessary
        parameters["keyname"] = AgentConfig.get_queue_head_keyname(agent_type=self.agent_type,
                                                                   keyname=requested_key_name)

        logging.info('New queue head keyname: {0}'.format(parameters["keyname"]))

        self.agent.configure_instance_security(parameters)
        try:
            self.agent.prepare_instances(parameters)
        except Exception as e:
            raise Exception('Errors in running instances in agent: ' + str(e))

        del parameters['head_node']

        return num_vms

    def __is_queue_head_running(self, params):
        '''
        Private method that is used for checking whether the queue head is running. Queue head has
        a different configuration of machine type and should be used for celery configuration.

        Args
            params   A dictionary of parameters

        Return
            A boolean value of wether the queue head is running or not
        '''
        logging.info('Trying to check if queue head is running...')

        try:
            all_vms = self.agent.describe_instances(params, prefix=params['key_prefix'])
            if all_vms == None:
                logging.info('No vms were found!')
                return False

            queue_head_tag = AgentConfig.get_queue_head_key_tag(agent_type=self.agent_type)
            key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.agent_type,
                                                          key_prefix=params.get('key_prefix', ''))

            # Just need one running vm with the QUEUEHEAD_KEY_TAG in the name of the keypair
            for vm in all_vms:
                if vm != None and vm['state'] == 'running':
                    if vm['key_name'].endswith(queue_head_tag) and vm['key_name'].startswith(key_prefix):
                        logging.info('Found queue head: {0}'.format(vm))
                        return True
            return False

        except Exception as e:
            logging.error('Error in testing whether queue_head is running! {0}'.format(e))
            return False

    def __prepare_queue_head(self, parameters):
        logging.debug("__prepare_queue_head(): parameters = {0}".format(parameters))

        num_vms = 0

        if not self.__is_queue_head_running(parameters):
            logging.info("Queue head is not running, so create a new queue head...")
            if 'head_node' not in parameters:
                logging.error("Head node is needed to run StochSS!")
                return None, None

            num_vms = self.__launch_ec2_queue_head(parameters)

        else:
            logging.info("Found queue head running...")

            # Queue head is already running, downgrading to normal worker
            if "queue_head" in parameters and parameters["queue_head"] == True:
                parameters["keyname"] = parameters["keyname"].replace(
                    AgentConfig.get_queue_head_key_tag(agent_type=self.agent_type),
                    '')
                logging.info(
                    'After downgrading from queue head to normal worker: keyname = {0}'.format(parameters["keyname"]))

            parameters["queue_head"] = False
            self.agent.configure_instance_security(parameters)

            # set shutdown behavior to "terminate"
            parameters["shutdown"] = "terminate"
            for vm in parameters["vms"]:
                parameters["instance_type"] = vm["instance_type"]
                parameters["num_vms"] = vm["num_vms"]
                num_vms += vm["num_vms"]
                try:
                    self.agent.prepare_instances(parameters)
                except Exception as e:
                    raise Exception('Errors in running instances in agent: {0}'.format(str(e)))

        return num_vms, parameters

    def __poll_instances_status(self, num_vms, parameters):
        '''
        Private method that working on polling the state of instances that have already spawned 
        every some time and checking the ssh connectability if they are running.
        
        Args
            num_vms         Number of virtual machines that are needed to be polling
            parameters      A dictionary of parameters
            
        Return
            A turple of (public ips, private ips, instance ids). Each of the three is a list
        '''
        logging.info('Start polling task for infrastructure = {0}'.format(parameters['infrastructure']))

        ins_ids = self.agent.describe_instances_launched(parameters)
        logging.info("ins_ids = {0}".format(ins_ids))

        # update db with new instance ids and 'pending'
        VMStateModel.update_ins_ids(parameters, ins_ids, self.reservation_id, from_state=VMStateModel.STATE_CREATING,
                                    to_state=VMStateModel.STATE_PENDING)

        public_ips = None
        private_ips = None
        instance_ids = None
        keyfiles = None

        for x in xrange(EC2BackendWorker.POLL_COUNT):
            # get the ips and ids of this keyname
            public_ips, private_ips, instance_ids, instance_types, keyfiles = self.agent.describe_instances_running(
                                                                                                            parameters)

            logging.info("public_ips = {0}".format(public_ips))
            logging.debug("private_ips = {0}".format(private_ips))
            logging.info("instance_ids = {0}".format(instance_ids))
            logging.info("instance_types = {0}".format(instance_types))
            logging.info("keyfiles = {0}".format(keyfiles))

            # if we get the requested number of vms (the requested number will be 1 if this is queue head),
            # update reservation information and send a message to the backend server
            if num_vms == len(public_ips):
                # update db with new public ips and private ips
                VMStateModel.update_ips(parameters, instance_ids, public_ips, private_ips, instance_types, keyfiles)
                break

            else:
                if x < EC2BackendWorker.POLL_COUNT - 1:
                    time.sleep(EC2BackendWorker.POLL_WAIT_TIME)
                    logging.info('Polling task: sleep 5 seconds...')

                else:
                    VMStateModel.update_ips(parameters, instance_ids, public_ips, private_ips, instance_types, keyfiles)

                    logging.info('Polling timeout. About to terminate some instances:')
                    terminate_ins_ids = []
                    for ins_id in ins_ids:
                        if ins_id not in instance_ids:
                            logging.info('instance {0} to be terminated'.format(ins_id))
                            terminate_ins_ids.append(ins_id)
                    # terminate timeout instances
                    self.agent.deregister_some_instances(parameters, terminate_ins_ids)
                    # update db with failure information
                    VMStateModel.set_state(parameters,
                                           terminate_ins_ids,
                                           VMStateModel.STATE_FAILED,
                                           VMStateModel.DESCRI_FAIL_TO_RUN)

        return public_ips, private_ips, instance_ids


    def __verify_ec2_instances_via_ssh(self, instance_ids, parameters, public_ips):
        keyfile = os.path.join(os.path.dirname(__file__), '..', '{0}.key'.format(parameters['keyname']))
        logging.info('keyfile = {0}'.format(keyfile))

        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))

        connected_public_ips = []
        connected_instance_ids = []

        for (pub_ip, ins_id) in zip(public_ips, instance_ids):
            logging.info('connecting to {0}...'.format(pub_ip))
            success = helper.wait_for_ssh_connection(key_file=keyfile, ip=pub_ip)

            if success == True:
                logging.info('{0} is successfully added'.format(pub_ip))
                connected_public_ips.append(pub_ip)
                connected_instance_ids.append(ins_id)

        # if there are some vms not able to be connected via ssh,
        # just shut them down explicitly
        if len(public_ips) != len(connected_public_ips):
            logging.info('Time out on ssh to {0} instances. They will be terminated.'.format(
                len(public_ips) - len(connected_public_ips)))

            try:
                terminate_ins_ids = []
                for ins_id in instance_ids:
                    if ins_id not in connected_instance_ids:
                        terminate_ins_ids.append(ins_id)
                self.agent.deregister_some_instances(parameters, terminate_ins_ids)
                # update db with failed vms
                VMStateModel.set_state(parameters, terminate_ins_ids,
                                       VMStateModel.STATE_FAILED,
                                       VMStateModel.DESCRI_TIMEOUT_ON_SSH)
            except:
                raise Exception("Errors in terminating instances that cannot be connected via ssh.")

        public_ips = None
        instance_ids = None

        return connected_public_ips, connected_instance_ids


    def __configure_celery(self, params, public_ips, instance_ids):
        '''
        Private method used for uploading the current celery configuration to each instance 
        that is running and ssh connectable.
        
        Args
            parameters      A dictionary of parameters
            public_ips      A list of public ips that are going to be configed
            instance_ids    A list of instance_ids that are used for terminating instances and update
                            database if fail on configuration by some reason  
        '''
        # Update celery config file...it should have the correct IP
        # of the Queue head node, which should already be running.
        # Pass it line by line so theres no weird formatting errors from
        # trying to echo a multi-line file directly on the command line


        key_file = os.path.join(os.path.dirname(__file__), '..', '{0}.key'.format(params['keyname']))
        logging.debug("key_file = {0}".format(key_file))

        if not os.path.exists(key_file):
            raise Exception("ssh key_file file not found: {0}".format(key_file))

        credentials = params['credentials']

        commands = []
        commands.append('source /home/ubuntu/.bashrc')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(str(credentials['EC2_ACCESS_KEY'])))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(str(credentials['EC2_SECRET_KEY'])))

        for ip, ins_id in zip(public_ips, instance_ids):
            # helper.wait_for_ssh_connection(key_file, ip)
            ins_type = VMStateModel.get_instance_type(params, ins_id)
            commands.append('export INSTANCE_TYPE={0}'.format(ins_type))
            success = helper.start_celery_on_vm(instance_type=ins_type, ip=ip, key_file=key_file,
                                                agent_type=self.agent_type,
                                                worker_name=ip.replace('.', '_'),
                                                prepend_commands=commands)
            if success == 0:
                # update db with successful running vms
                logging.info("celery started! ")
                logging.info("host ip: {0}".format(ip))
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_RUNNING, VMStateModel.DESCRI_SUCCESS)
            else:
                self.agent.deregister_some_instances(params, [ins_id])
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_FAILED,
                                       VMStateModel.DESCRI_FAIL_TO_COFIGURE_CELERY)
                raise Exception("Failure to start celery on {0}".format(ip))

        # get all intstance types and configure the celeryconfig.py locally
        instance_types = VMStateModel.get_running_instance_types(params)
        helper.config_celery_queues(agent_type=self.agent_type, instance_types=instance_types)


class SynchronizeDB(webapp2.RequestHandler):
    '''
    SynchronizeDB's main job is to start a background_thread to synchronize the VMStateModel
    with the agent every some time
    '''
    PAUSE = 180

    def post(self):
        req_agent = self.request.get('agent')
        self.agent = pickle.loads(str(req_agent))
        self.agent_type = self.agent.AGENT_NAME

        req_parameters = self.request.get('parameters')
        self.parameters = pickle.loads(str(req_parameters))

        self.is_start = False
        self.thread_id = background_thread.start_new_background_thread(self.begin, [])
        logging.info('Started a background thread to synchronize db. id: {0} agent: {1} parameters : {2}'.format(self.thread_id, self.agent_type, self.parameters))
        return

    def begin(self):
        self.initialize_vm_state_db()
        if not self.is_start:
            self._run()

    def _start(self):
        if not self.is_start:
            self.timer = Timer(SynchronizeDB.PAUSE, self._run).start()
            self.is_start = True

    def _run(self):
        logging.debug('SynchronizeDB._run() thread_id={0} agent_type={1} parameters={2}'.format(self.thread_id, self.agent_type, self.parameters))
        self.is_start = False
        VMStateModel.synchronize(agent=self.agent, parameters=self.parameters)
        if self.update_vm_state_db():
            self._start()

    def initialize_vm_state_db(self):
        try:
            now = datetime.datetime.now()
            logging.info('For agent {0} Initializing VM state db'.format(self.agent_type))
            syn = VMStateSyn.all().filter('infra =', self.agent.AGENT_NAME)

            if syn.count() == 0:
                e = VMStateSyn(last_syn=now, thread_id=self.thread_id, infra=self.agent.AGENT_NAME)
                e.put()
                return True
            else:
                e = syn.get()
                e.thread_id = self.thread_id
                e.put()

        except Exception as e:
            logging.error('Error: have errors in write date time to db_syn. {0}'.format(e))
            return False

    def update_vm_state_db(self):
        try:
            now = datetime.datetime.now()
            logging.info('For agent {0} updating synchronization time to db_syn: {1}'.format(self.agent_type, now))
            syn = VMStateSyn.all().filter('infra =', self.agent.AGENT_NAME)

            if syn.count() == 0:
                e = VMStateSyn(last_syn=now, thread_id=self.thread_id, infra=self.agent.AGENT_NAME)
                e.put()
                return True
            else:
                e = syn.get()
                logging.info('For agent {0}, old last_syn = {1}'.format(self.agent_type, e.last_syn))
                e.last_syn = now
                e.put()
                if e.thread_id == self.thread_id:
                    return True
                else:
                    logging.debug('Last request of VMStateSyn for infra={0} was by thread_id={1}, I am thread_id={2}. Exiting.'.format(e.infra, e.thread_id, self.thread_id))
                    return False


        except Exception as e:
            logging.error('Error: have errors in write date time to db_syn. {0}'.format(e))
            return False


    def __get_user_data(self):
        user_data = db.GqlQuery("SELECT * FROM UserData WHERE user_id = :1", self.parameters['user_id']).get()
        if user_data is None:
            raise Exception("Can not find UserData for user_id = '{0}'".format(self.parameters['user_id']))
        return user_data



# @staticmethod
# def stop():
# SynchronizeDB.TIMER.cancel()
# SynchronizeDB.SYNCHRONIZE_DB = False

class BackendQueue(webapp2.RequestHandler):
    '''
    BackendQueue is a task queue that runs in the background, in parallel with the frontend.
    Currently, there are 2 types of tasks that BackendQueue is going to deal with:
        1. prepare vms that frontend requests (operation code: prepare_vms)
        2. trigger the database auto synchronization (operation code: start_db_syn). 
        Since currently, we could not solve the background http 500 error interruption from somewhere
        using the background_thread, we have to check the db synchronization log every sometime
        and start another background_thread if the previous one stop working by background http 500.
    The tasks in the task queue are executed serially in block mode.   
    '''

    def __handle_prepare_vms_op(self):
        logging.info('Backend queue got the request to start vms.')

        # unpickle all loading objects
        req_infra = self.request.get('infra')
        infra = pickle.loads(str(req_infra))

        req_agent = self.request.get('agent')
        agent = pickle.loads(str(req_agent))

        req_parameters = self.request.get('parameters')
        parameters = pickle.loads(str(req_parameters))

        req_reservation_id = self.request.get('reservation_id')
        reservation_id = pickle.loads(str(req_reservation_id))

        logging.info('AGENT_NAME = {0}'.format(agent.AGENT_NAME))

        if agent.AGENT_NAME == AgentTypes.EC2:
            EC2BackendWorker(infra_manager=infra, agent=agent, reservation_id=reservation_id).prepare_vms(parameters)
        elif agent.AGENT_NAME == AgentTypes.FLEX:
            FlexBackendWorker(infra_manager=infra, agent=agent, reservation_id=reservation_id).prepare_vms(parameters)
        else:
            logging.error('Invalid agent type = {0}!'.format(agent.AGENT_NAME))
            return

        logging.info('Backend queue finished preparing vms.')

    def __handle_start_db_syn(self):
        logging.info('Backend queue got the request to start syn db.')

        # trigger db auto synchronization
        urlfetch.fetch(url=BACKEND_SYN_R_URL,
                       method=urlfetch.POST,
                       payload=urllib.urlencode(self.request.GET))

    def get(self):
        op = self.request.get('op')
        if op == BACKEND_PREPARE_VMS_OP:
            self.__handle_prepare_vms_op()
        elif op == 'start_db_syn':
            self.__handle_start_db_syn()


app = webapp2.WSGIApplication([('/backend/synchronizedb', SynchronizeDB),
                               ('/backend/queue', BackendQueue)],
                              debug=True)
