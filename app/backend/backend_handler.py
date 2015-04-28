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

from google.appengine.ext import db
from kombu import Queue, Exchange

from common.config import AgentTypes, AgentConfig
import common.helper as helper

__author__ = 'mengyuan, dev'
__email__ = 'gmy.melissa@gmail.com, dnath@cs.ucsb.edu'

BACKEND_NAME = 'backendthread'
BACKEND_URL = 'http://%s' % modules.get_hostname(BACKEND_NAME)

BACKEND_START = '{0}/_ah/start'.format(BACKEND_URL)
BACKEND_BACKGROUND = '{0}/_ah/background'.format(BACKEND_URL)
BACKEND_SYN_R_URL = '{0}/backend/synchronizedb'.format(BACKEND_URL)
BACKEND_MANAGER_R_URL = '{0}/backend/manager'.format(BACKEND_URL)
BACKEND_QUEUE_R_URL = 'http://{0}{1}'.format(modules.get_hostname('backendqueue'),
                                             '/backend/queue')

INS_TYPES_EC2 = ["t1.micro", "m1.small", "m3.medium", "m3.large", "c3.large", "c3.xlarge"]


class VMStateSyn(db.Model):
    last_syn = db.DateTimeProperty()


class VMStateModelException(Exception):
    pass


class VMStateModel(db.Model):
    SUPPORTED_INFRA = [AgentTypes.EC2]

    IDS = 'ids'
    EC2_ACCESS_KEY = 'EC2_ACCESS_KEY'
    EC2_SECRET_KEY = 'EC2_SECRET_KEY'

    STATE_CREATING = 'creating'
    STATE_PENDING = 'pending'
    STATE_RUNNING = 'running'
    STATE_STOPPED = 'stopped'
    STATE_FAILED = 'failed'
    STATE_TERMINATED = 'terminated'

    DESCRI_FAIL_TO_RUN = 'fail to run the instance'
    DESCRI_TIMEOUT_ON_SSH = 'timeout to connect instance via ssh'
    DESCRI_FAIL_TO_COFIGURE_CELERY = 'fail to configure celery on the instance'
    DESCRI_FAIL_TO_COFIGURE_SHUTDOWN = 'fail to configure shutdown behavior on the instance'
    DESCRI_NOT_FOUND = 'not find the instance in cloud infrastructure'
    DESCRI_SUCCESS = 'success'

    infra = db.StringProperty()
    access_key = db.StringProperty()
    secret_key = db.StringProperty()
    ins_type = db.StringProperty()
    res_id = db.StringProperty()
    ins_id = db.StringProperty()
    pub_ip = db.StringProperty()
    pri_ip = db.StringProperty()
    local_key = db.StringProperty()
    choices = set([STATE_CREATING, STATE_PENDING, STATE_RUNNING, STATE_STOPPED, STATE_FAILED, STATE_TERMINATED])
    state = db.StringProperty(required=True,
                              choices=choices)
    description = db.StringProperty()
    created = db.DateTimeProperty(auto_now_add=True)

    @staticmethod
    def get_all(params):
        '''
        get the information of all vms that are not terminated
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        Return
            a dictionary of vms info
        '''
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return None

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state !=', VMStateModel.STATE_TERMINATED)

            all_vms = []
            for e in entities:
                vm_dict = {
                    "ins_id": e.ins_id,
                    "instance_type": e.ins_type,
                    "state": e.state,
                    "discription": e.description
                }
                all_vms.append(vm_dict)

            return all_vms

        except Exception as e:
            logging.error("Error in getting all vms from db! {0}".format(e))
            return None

    @staticmethod
    def get_instance_type(params, ins_id):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return None

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('ins_id ==', ins_id)

            e = entities.get()
            return e.ins_type

        except Exception as e:
            logging.error("Error in getting the instance type of instance {0} from db! {1}".format(ins_id, e))
            return None

    @staticmethod
    def get_running_instance_type(params):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return None

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state ==', VMStateModel.STATE_RUNNING)

            types = []
            for e in entities:
                types.append(e.ins_type)

            return list(set(types))

        except Exception as e:
            logging.error("Error in getting all running instance types from db! {0}".format(e))
            return None

    @staticmethod
    def fail_active(params):
        '''
        update all vms that are 'creating' to 'failed'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        if params['infrastructure'] not in VMStateModel.SUPPORTED_INFRA:
            logging.info('VMStateModel does not support infra = {0}!'.format(params['infrastructure']))
            return

        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state =', VMStateModel.STATE_CREATING)

            for e in entities:
                e.state = VMStateModel.STATE_FAILED
                e.put()

        except Exception as e:
            logging.error("Error in updating 'creating' vms to 'failed' in db! {0}".format(e))

    @staticmethod
    def terminate_not_active(params):
        '''
        update all vms that are 'failed' in the last launch to 'terminated'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state =', VMStateModel.STATE_FAILED)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()

        except Exception as e:
            logging.error("Error in updating non-active vms to terminated in db! {0}".format(e))

    @staticmethod
    def terminate_all(params):
        '''
        update the state of all vms that are not terminated to 'terminated'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state !=', VMStateModel.STATE_TERMINATED)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()
        except Exception as e:
            logging.error("Error in terminating all vms in db! {0}".format(e))


    @staticmethod
    def update_res_ids(params, ids, res_id):
        '''
        set the reservation id of the some entities given their ids.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ids       a list of ids which are the primary keys of VMStateModel
            res_id    the reservation id that should be updated
        '''
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            entities = VMStateModel.get_by_id(ids)

            for e in entities:
                e.res_id = res_id
                e.put()

        except Exception as e:
            logging.error("Error in updating reservation ids in db! {0}".format(e))

    @staticmethod
    def update_ins_ids(params, ins_ids, res_id):
        '''
        set the instance ids within the certain reservation,
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are going to be set with
            res_id    the reservation id that is based on
        '''
        logging.info('update_ins_ids: \nparams =\n{0}\nins_ids = {1}\nres_id = {2}'.format(
                        pprint.pformat(params), ins_ids, res_id))
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('res_id =', res_id).filter('state =', VMStateModel.STATE_CREATING)

            for (ins_id, e) in zip(ins_ids, entities.run(limit=len(ins_ids))):
                logging.info('ins_id = {0}'.format(ins_id))
                e.ins_id = ins_id
                e.state = VMStateModel.STATE_PENDING
                e.put()
            logging.info('Updated ins_ids = {0}'.format(ins_ids))

        except Exception as e:
            logging.error("Error in updating instance ids in db! {0}".format(e))

    @staticmethod
    def update_ips(params, ins_ids, pub_ips, pri_ips, ins_types, local_key):
        '''
        set the the public ips, the private ips, the instance types and the local key 
        to corresponding instance ids.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are based on
            pub_ips   a list of public ips that are going to be set with
            pri_ips   a list of private ips that are going to be set with
            ins_type  a list of instance types that are going to be set with
            local_key the local key name that is corresponding to this set of instance ids
        '''
        logging.info('\n\nupdate_ips: \nparams =\n{0}\nins_ids = {1}\npub_ips = {2}\npri_ips = {3}\nins_types = {4}\nlocal_key = {5}'.format(
                        pprint.pformat(params), ins_ids, pub_ips, pri_ips, ins_types, local_key))
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            if local_key is None:
                raise Exception('Error: Cannot find local key!')

            for (ins_id, pub_ip, pri_ip, ins_type) in zip(ins_ids, pub_ips, pri_ips, ins_types):

                e = VMStateModel.all().filter('ins_id =', ins_id).filter('infra =', infra)\
                                      .filter('access_key =', access_key).filter('secret_key =', secret_key).get()

                e.pub_ip = pub_ip
                e.pri_ip = pri_ip
                e.ins_type = ins_type
                e.local_key = local_key
                e.put()

        except Exception as e:
            print sys.exc_info()
            logging.error("Error in updating ips in db! {0}".format(e))

    @staticmethod
    def set_state(params, ins_ids, state, description=None):
        '''
        set the state of a list of instances and add some discriptions if needed.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are going to be set state
            state     the state that is going to be set to the instances
            description    (optional) the description to the state     
        '''
        logging.info('set_state:\nins_ids = {0} state = {1} description ={2}'.format(ins_ids, state, description))
        logging.debug('set_state:\nparams =\n{0}'.format(pprint.pformat(params)))
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return

            for ins_id in ins_ids:
                e = VMStateModel.all().filter('ins_id =', ins_id).filter('infra =', infra).filter('access_key =',
                                                                                                  access_key).filter(
                    'secret_key =', secret_key).get()
                if e.state != VMStateModel.STATE_TERMINATED:
                    e.state = state
                if description is not None:
                    e.description = description
                e.put()

        except Exception as e:
            logging.error("Error in set_state: {0}".format(str(e)))

    @staticmethod
    def validate_credentials(params):
        '''
        validate if the access key and secret key are available to be used
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        Return
            A tuple of the form (infrastructure, access key, secret key).
        '''
        if 'infrastructure' in params and params['infrastructure'] in VMStateModel.SUPPORTED_INFRA:
            infra = params['infrastructure']
        else:
            raise VMStateModelException('Infrastructure is not supported for VMStateModel!')

        if 'credentials' in params:
            if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                access_key = params['credentials']['EC2_ACCESS_KEY']
                secret_key = params['credentials']['EC2_SECRET_KEY']
            else:
                raise VMStateModelException('Cannot get access key or secret.')
        else:
            raise VMStateModelException('No credentials are provided.')

        if access_key is None or secret_key is None:
            raise VMStateModelException('Credentials are not given!')

        return infra, access_key, secret_key

    @staticmethod
    def synchronize(agent, credentials):
        '''
        synchronization the db with the specific agent
        Args
            agent    the agent that is going to be synchronized with
            credentials    the dictionary containing access_key and secret_key pair of the agent
        '''
        logging.info('Start Synchronizing DB...')
        instanceList = agent.describe_instances({'credentials': credentials})

        entities = VMStateModel.all()
        entities.filter('infra =', agent.AGENT_NAME).filter('access_key =', credentials['EC2_ACCESS_KEY']).filter(
            'secret_key =', credentials['EC2_SECRET_KEY'])
        entities.filter('state !=', VMStateModel.STATE_TERMINATED).filter('state !=', VMStateModel.STATE_CREATING)

        for e in entities:
            find = False
            for ins in instanceList:
                if e.ins_id == ins['id']:
                    find = True
                    if e.state == VMStateModel.STATE_PENDING and ins['state'] == VMStateModel.STATE_RUNNING:
                        break
                    else:
                        if ins['state'] == 'shutting-down':
                            ins['state'] = VMStateModel.STATE_TERMINATED
                        e.state = ins['state']
                        e.put()
                    break

            if not find:
                e.state = VMStateModel.STATE_TERMINATED
                e.decription = VMStateModel.DESCRI_NOT_FOUND
                e.put()
        logging.info('Finished synchronizing DB!')


class BackendWorker(object):
    '''
    BackendWorker does the job of spawning virtual machines on a specific agent and 
    configuring celery workers on those machines.
    Currently, it is implemented in a blocking mode.   
    '''

    KEYPREFIX = 'stochss'
    QUEUEHEAD_KEY_TAG = 'queuehead'

    def __launch_ec2_queue_head(self, agent, num_vms, parameters):
        logging.info('About to start a queue head.')
        parameters["queue_head"] = True
        requested_key_name = parameters["keyname"]

        # get the largest instance_type and let it to be queue head
        head_node = parameters['head_node']
        parameters["instance_type"] = head_node["instance_type"]
        parameters["num_vms"] = 1
        parameters["shutdown"] = "terminate"

        num_vms = 1

        # Tag queue head key so that it can be differentiated if necessary
        parameters["keyname"] = AgentConfig.get_queue_head_keyname(agent_type=agent.AGENT_NAME,
                                                                   keyname=requested_key_name)

        logging.info('New queue head keyname: {0}'.format(parameters["keyname"] ))

        security_configured = agent.configure_instance_security(parameters)
        try:
            agent.run_instances(parameters)
        except Exception as e:
            raise Exception('Errors in running instances in agent: ' + str(e))

        del parameters['head_node']

        return num_vms

    def __prepare_queue_head(self, agent, parameters):
        logging.debug("__prepare_queue_head:\nparameters = \n{0}".format(pprint.pformat(parameters)))

        num_vms = 0

        if not self.__is_queue_head_running(agent, parameters):
            # Queue head is not running, so create a queue head
            if 'head_node' not in parameters:
                logging.error("Head node is needed to run StochSS!")
                # if there is no head node running, and the current worker nodes are not tagged 'head node' then just fail all 'creating' ones
                VMStateModel.fail_active(parameters)
                return None, None

            if agent.AGENT_NAME == AgentTypes.EC2:
                num_vms = self.__launch_ec2_queue_head(agent, num_vms, parameters)

            else:
                logging.info('Not launching queue head as agent = {0}'.format(agent.AGENT_NAME))
                return None, None

        # if the queue head is running
        else:
            if "queue_head" in parameters and parameters["queue_head"] == True:
                parameters["keyname"] = parameters["keyname"].replace('-' + self.QUEUEHEAD_KEY_TAG, '')
                logging.info('KEYNAME: {0}'.format(parameters["keyname"]))

            parameters["queue_head"] = False
            security_configured = agent.configure_instance_security(parameters)

            # set shutdown behavior to "terminate"
            parameters["shutdown"] = "terminate"
            for vm in parameters["vms"]:
                parameters["instance_type"] = vm["instance_type"]
                parameters["num_vms"] = vm["num_vms"]
                num_vms += vm["num_vms"]
                try:
                    agent.run_instances(parameters)
                except:
                    raise Exception('Errors in running instances in agent.')

        return num_vms, parameters


    def prepare_vms(self, infra, agent, parameters, reservation_id):
        """
        Public method for preparing a set of VMs

        Args:
        infra           Infrastructure that is needed to be call
        agent           Infrastructure agent in charge of current operation
        parameters      A dictionary of parameters
        reservation_id  the reservation id for the instances that are going to be spawned
        """
        logging.info("AGENT_NAME = {0}".format(agent.AGENT_NAME))
        logging.debug("\n\nprepare_vms:\n\nparameters = \n{0}".format(pprint.pformat(parameters)))

        if not parameters["vms"] and 'head_node' not in parameters:
            logging.info("No vms are waiting to be prepared or head_node is not specified!")
            return

        try:
            # ##################################################
            # step 1: run instance based on queue head or not #
            # ##################################################

            num_vms, parameters = self.__prepare_queue_head(agent, parameters)
            if num_vms == None and parameters == None:
                return


            ########################################################################
            # step 2: poll the status of instances, if not running, terminate them #
            ########################################################################
            public_ips, private_ips, instance_ids = self.__poll_instances_status(infra, agent, num_vms, parameters,
                                                                                 reservation_id)
            if public_ips == None:
                if not self.__is_queue_head_running(agent, parameters):
                    # if last time of spawning queue head failed, spawn another queue head again
                    self.prepare_vms(infra, agent, parameters, reservation_id)
                else:
                    return

            ############################################################
            # step 3: set alarm for the nodes, if it is NOT queue head #
            ############################################################
#             logging.info('Set shutdown alarm')
#
#             try:
#                 if "queue_head" not in parameters or parameters["queue_head"] == False:
#                     for ins_id in instance_ids:
#                         agent.make_sleepy(parameters, ins_id)
#                 else:
#                     agent.make_sleepy(parameters, instance_ids[0], '7200')
#
#             except:
#                 raise Exception('Errors in set alarm for instances.')

            ########################################################
            # step 4: verify whether nodes are connectable via ssh #
            ########################################################
            connected_public_ips, connected_instance_ids = self.__verify_instances_via_ssh(agent, parameters,
                                                                                           public_ips, instance_ids)

            if len(connected_public_ips) == 0:
                if not self.__is_queue_head_running(agent, parameters):
                    # if last time of spawning queue head failed, spawn another queue head again
                    self.prepare_vms(infra, agent, parameters, reservation_id)
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
                                                               agent_type=agent.AGENT_NAME)

            # copy celery configure to nodes.
            self.__configure_celery(agent, parameters, connected_public_ips, connected_instance_ids)

            #####################################################################
            # step 6: if current node is queue head, may need to spawn the rest #
            #####################################################################

            if "queue_head" in parameters and parameters["queue_head"] == True:
                self.prepare_vms(infra, agent, parameters, reservation_id)
            else:
                # else all vms requested are finished spawning. Done!
                return

        except Exception as e:
            logging.exception(e)


    def __poll_instances_status(self, infra, agent, num_vms, parameters, reservation_id):
        '''
        Private method that working on polling the state of instances that have already spawned 
        every some time and checking the ssh connectability if they are running.
        
        Args
            infra           Infrastructure that is needed to be call
            agent           Agent in charge of current operation
            num_vms         Number of virtual machines that are needed to be polling
            parameters      A dictionary of parameters
            reservation_id  the reservation id for the instances that are going to be spawned  
            
        Return
            A turple of (public ips, private ips, instance ids). Each of the three is a list
        '''
        logging.info('Start polling task for infrastructure = {0}'.format(parameters['infrastructure']))

        ins_ids = agent.describe_instances_launched(parameters)
        logging.info("ins_ids = {0}".format(ins_ids))

        # update db with new instance ids and 'pending'
        if parameters['infrastructure'] == AgentTypes.EC2:
            VMStateModel.update_ins_ids(parameters, ins_ids, reservation_id)

        public_ips = None
        private_ips = None
        instance_ids = None

        POLL_COUNT = 10
        POLL_WAIT = 5
        for x in range(0, POLL_COUNT):
            # get the ips and ids of this keyname
            public_ips, private_ips, instance_ids, instance_types = agent.describe_instances_running(parameters)

            logging.info("public_ips = {0}".format(public_ips))
            logging.info("private_ips = {0}".format(private_ips))
            logging.info("instance_ids = {0}".format(instance_ids))
            logging.info("instance_types = {0}".format(instance_types))

            # if we get the requested number of vms (the requested number will be 1 if this is queue head),
            # update reservation information and send a message to the backend server
            if num_vms == len(public_ips):
                # update db with new public ips and private ips
                if parameters['infrastructure'] == AgentTypes.EC2:
                    VMStateModel.update_ips(parameters, instance_ids, public_ips, private_ips, instance_types,
                                            parameters["keyname"])
                break

            else:
                if x < POLL_COUNT - 1:
                    time.sleep(POLL_WAIT)
                    logging.info('Polling task: sleep 5 seconds...')

                else:
                    if parameters['infrastructure'] == AgentTypes.EC2:
                        VMStateModel.update_ips(parameters, instance_ids, public_ips, private_ips, instance_types,
                                                parameters["keyname"])

                        logging.info('Polling timeout. About to terminate some instances:')
                        terminate_ins_ids = []
                        for ins_id in ins_ids:
                            if ins_id not in instance_ids:
                                logging.info('instance {0}'.format(ins_id))
                                terminate_ins_ids.append(ins_id)
                        # terminate timeout instances
                        agent.terminate_some_instances(parameters, terminate_ins_ids)
                        # update db with failure information
                        VMStateModel.set_state(parameters, terminate_ins_ids, VMStateModel.STATE_FAILED,
                                               VMStateModel.DESCRI_FAIL_TO_RUN)
                    else:
                        logging.info('Polling timeout.')

        return public_ips, private_ips, instance_ids


    def __verify_ec2_instances_via_ssh(self, agent, instance_ids, parameters, public_ips):
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
                agent.terminate_some_instances(parameters, terminate_ins_ids)
                # update db with failed vms
                VMStateModel.set_state(parameters, terminate_ins_ids,
                                       VMStateModel.STATE_FAILED,
                                       VMStateModel.DESCRI_TIMEOUT_ON_SSH)
            except:
                raise Exception("Errors in terminating instances that cannot be connected via ssh.")

        public_ips = None
        instance_ids = None

        return connected_instance_ids, connected_public_ips

    def __verify_flex_instances_via_ssh(self, agent, parameters, public_ips):
        connected_public_ips = []
        connected_instance_ids = []

        for machine in parameters['flex_cloud_machine_info']:
            keyfile = machine['keyfile']
            if not os.path.exists(keyfile):
                raise Exception("ssh keyfile file not found: {0}".format(keyfile))

            ip = machine['ip']
            if ip in public_ips:
                logging.info('connecting to {0}...'.format(ip))
                success = helper.wait_for_ssh_connection(key_file=keyfile, ip=ip,
                                                         username=machine['username'])
                if success == True:
                    logging.info('{0} is successfully added'.format(ip))
                    connected_public_ips.append(ip)
                    connected_instance_ids.append(agent.get_flex_instance_id(ip))
                else:
                    logging.error('Could not make a successful ssh connection to {0}'.format(ip))

            else:
                logging.info('ip {0} not in public_ips list!'.format(ip))

        if len(public_ips) != len(connected_public_ips):
            logging.info('Time out on ssh to {0} instances.'.format(len(public_ips) - len(connected_public_ips)))

        return connected_instance_ids, connected_public_ips

    def __verify_instances_via_ssh(self, agent, parameters, public_ips, instance_ids):
        '''
        Private method that is used to verify whether the virtual machines are connectable via ssh.
        
        Args
            agent           Agent in charge of current operation
            parameters      A dictionary of parameters
            public_ips      A list of public ips that are used for ssh connection
            instance_ids    A list of instance_ids that are used for terminating instances and update
                            database if fail on verification the instances by some reason
            
        Return
            A turple of (public ips, instance ids). Each of the two is a list of successfully verified
            instances
        '''
        logging.info('agent.AGENT_NAME = {0}'.format(agent.AGENT_NAME))
        logging.info('{0} nodes are running. Now trying to verify ssh connectable.'.format(len(public_ips)))

        if agent.AGENT_NAME == AgentTypes.EC2:
            connected_instance_ids, connected_public_ips = self.__verify_ec2_instances_via_ssh(agent, instance_ids,
                                                                                               parameters, public_ips)
            return connected_public_ips, connected_instance_ids

        elif agent.AGENT_NAME == AgentTypes.FLEX:
            connected_instance_ids, connected_public_ips = self.__verify_flex_instances_via_ssh(agent, parameters,
                                                                                                public_ips)
            return connected_instance_ids, connected_public_ips
        else:
            raise Exception('Agent {0} not supported!'.format(agent.AGENT_NAME))


    def __configure_celery(self, agent, params, public_ips, instance_ids):
        '''
        Private method used for uploading the current celery configuration to each instance 
        that is running and ssh connectable.
        
        Args
            agent           Agent in charge of current operation
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
                                                agent_type=AgentTypes.EC2,
                                                prepend_commands=commands)
            if success == 0:
                # update db with successful running vms
                logging.info("celery started! ")
                logging.info("host ip: {0}".format(ip))
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_RUNNING, VMStateModel.DESCRI_SUCCESS)
            else:
                agent.terminate_some_instances(params, [ins_id])
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_FAILED,
                                       VMStateModel.DESCRI_FAIL_TO_COFIGURE_CELERY)
                raise Exception("Failure to start celery on {0}".format(ip))

        # get all intstance types and configure the celeryconfig.py locally
        instance_types = VMStateModel.get_running_instance_type(params)
        helper.config_celery_queues(agent_type=AgentTypes.EC2, instance_types=instance_types)


    def __is_queue_head_running(self, agent, params):
        '''
        Private method that is used for checking whether the queue head is running. Queue head has
        a different configuration of machine type and should be used for celery configuration.
        
        Args
            agent    Agent in charge of current operation
            params   A dictionary of parameters
            
        Return
            A boolean value of wether the queue head is running or not
        '''
        logging.info('Trying to check if queue head is running...')

        queue_head_tag = AgentConfig.get_queue_head_key_tag(agent_type=agent.AGENT_NAME)

        try:
            all_vms = agent.describe_instances(params, prefix=params['key_prefix'])
            if all_vms == None:
                logging.info('No vms were found!')
                return False

            # Just need one running vm with the QUEUEHEAD_KEY_TAG in the name of the keypair
            for vm in all_vms:
                if vm != None and vm['state'] == 'running' and vm['key_name'].find(queue_head_tag) != -1:
                    return True
            return False

        except Exception as e:
            logging.error('Error in testing whether queue_head is running! {0}'.format(e))
            return False


class SynchronizeDB(webapp2.RequestHandler):
    '''
    SynchronizeDB's main job is to start a background_thread to synchronize the VMStateModel
    with the agent every some time
    '''
    PAUSE = 180

    def post(self):
        req_agent = self.request.get('agent')
        self.agent = pickle.loads(str(req_agent))
        req_parameters = self.request.get('parameters')
        self.parameters = pickle.loads(str(req_parameters))

        self.is_start = False

        id = background_thread.start_new_background_thread(self.begin, [])
        logging.info('Started a background thread to synchronize db. id: {0}'.format(id))
        return

    def begin(self):
        try:
            self.credentials = self.parameters['credentials']
        except:
            raise Exception('Error: credentials not set properly!')

        if not self.is_start:
            self._run()

    def _start(self):
        if not self.is_start:
            self.timer = Timer(SynchronizeDB.PAUSE, self._run).start()
            self.is_start = True

    def _run(self):
        self.is_start = False
        VMStateModel.synchronize(self.agent, self.credentials)
        self._write_time()
        self._start()

    def _write_time(self):
        try:
            now = datetime.datetime.now()
            logging.info('Write datetime of synchronization to db_syn: {0}'.format(now))
            syn = VMStateSyn.all()
            if syn.count() == 0:
                e = VMStateSyn(last_syn=now)
                e.put()
            else:
                e = db.GqlQuery("SELECT * FROM VMStateSyn").get()
                e.last_syn = now
                e.put()

        except Exception as e:
            logging.error('Error: have errors in write date time to db_syn. {0}'.format(e))


# @staticmethod
# def stop():
#         SynchronizeDB.TIMER.cancel()
#         SynchronizeDB.SYNCHRONIZE_DB = False

class BackendQueue(webapp2.RequestHandler):
    '''
    BackendQueue is a task queue that runs in the background, in parallel with the front end.
    Currently, there are 2 types of tasks that BackendQueue is going to deal with:
        1. start vms that front end requests (operation code: start_vms)
        2. trigger the database auto synchronization (operation code: start_db_syn). 
        Since currently, we could not solve the background http 500 error interruption from somewhere
        using the background_thread, we have to check the db synchronization log every sometime
        and start another background_thread if the previous one stop working by background http 500.
    The tasks in the task queue are executed serially in block mode.   
    '''

    def get(self):
        op = self.request.get('op')
        if op == 'start_vms':
            logging.info('Backend queue got the request to start vms.')
            # pickle all loading objects
            req_infra = self.request.get('infra')
            infra = pickle.loads(str(req_infra))
            req_agent = self.request.get('agent')
            agent = pickle.loads(str(req_agent))
            req_parameters = self.request.get('parameters')
            parameters = pickle.loads(str(req_parameters))
            req_reservation_id = self.request.get('reservation_id')
            reservation_id = pickle.loads(str(req_reservation_id))

            # execute spawning vms
            worker = BackendWorker()
            worker.prepare_vms(infra, agent, parameters, reservation_id)
            logging.info('Backend queue finished starting vms.')

        elif op == 'start_db_syn':
            logging.info('Backend queue got the request to start syn db.')

            # trigger db auto synchronization 
            urlfetch.fetch(url=BACKEND_SYN_R_URL,
                           method=urlfetch.POST,
                           payload=urllib.urlencode(self.request.GET))


app = webapp2.WSGIApplication([('/backend/synchronizedb', SynchronizeDB),
                               ('/backend/queue', BackendQueue)],
                              debug=True)
