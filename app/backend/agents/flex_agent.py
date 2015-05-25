from base_agent import BaseAgent, AgentConfigurationException, AgentRuntimeException
from common.config import AgentTypes, FlexConfig, AgentConfig

import sys
import os
import traceback

sys.path.append(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../flex_api'))

import datetime
import time
import pprint
import logging
import urllib2
import json
import tempfile

from utils import utils
from tasks import *

from flex_state import FlexVMState
from vm_state_model import VMStateModel

__author__ = 'dev'
__email__ = 'dnath@cs.ucsb.edu'


class FlexAgent(BaseAgent):
    AGENT_NAME = AgentTypes.FLEX

    PARAM_CREDENTIALS = 'credentials'
    PARAM_QUEUE_HEAD = 'queue_head'
    PARAM_FLEX_CLOUD_MACHINE_INFO = 'flex_cloud_machine_info'
    PARAM_USER_ID = 'user_id'

    REQUIRED_FLEX_PREPARE_INSTANCES_PARAMS = (
        PARAM_FLEX_CLOUD_MACHINE_INFO,
        PARAM_USER_ID
    )

    REQUIRED_FLEX_DEREGISTER_INSTANCES_PARAMS = (
        PARAM_FLEX_CLOUD_MACHINE_INFO,
        PARAM_USER_ID
    )

    def configure_instance_security(self, parameters):
        # TODO
        return True

    def assert_required_parameters(self, parameters, operation):
        required_params = ()
        if operation == BaseAgent.OPERATION_PREPARE:
            required_params = self.REQUIRED_FLEX_PREPARE_INSTANCES_PARAMS
        elif operation == BaseAgent.OPERATION_DEREGISTER:
            required_params = self.REQUIRED_FLEX_DEREGISTER_INSTANCES_PARAMS

        logging.info('required_params: {0}'.format(required_params))

        for param in required_params:
            logging.info('param: {0}'.format(param))
            if not utils.has_parameter(param, parameters):
                raise AgentConfigurationException('no ' + param)

    def __get_flex_instance_id(self, public_ip):
        return 'flex_{0}'.format(public_ip.replace('.', '_', 3))

    def describe_instances_launched(self, parameters):
        launched_ids = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            launched_ids.append(self.__get_flex_instance_id(machine['ip']))

        logging.info('launched_ids = {0}'.format(launched_ids))
        return launched_ids

    def __get_flex_vm_state_url(self, ip):
        return 'https://{ip}/state'.format(ip=ip)

    def __get_flex_vm_state_info(self, ip):
        try:
            data_received = urllib2.urlopen(self.__get_flex_vm_state_url(ip)).read()
            state_info = json.loads(data_received)

            logging.info('From ip {0}: json = {1}'.format(ip, state_info))

            if state_info['state'] in FlexVMState.VALID_STATES:
                return state_info

        except Exception as e:
            logging.error(str(e))

        return {'state': FlexVMState.UNKNOWN}

    def describe_instances_running(self, parameters):
        instance_ids = []
        public_ips = []
        private_ips = []
        instance_types = []
        keynames = []
        usernames = []

        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            ip = machine['ip']
            state_info = self.__get_flex_vm_state_info(ip)

            if state_info['state'] == FlexVMState.UNPREPARED:
                instance_ids.append(self.__get_flex_instance_id(ip))
                public_ips.append(ip)
                private_ips.append(ip)
                instance_types.append(FlexConfig.INSTANCE_TYPE)
                keynames.append(machine['keyname'])
                usernames.append(machine['username'])
            else:
                logging.info('ip {0} is already prepared!'.format(ip))

        return public_ips, private_ips, instance_ids, instance_types, keynames, usernames

    def __deregister_flex_vm(self, ip, username, keyname, user_id, parameters, force=False):
        keyfile = FlexConfig.get_keyfile(keyname=keyname, user_id=user_id)
        deregister_command = self.get_remote_command_string(ip=ip, username=username, keyfile=keyfile,
                                       command="sudo kill -9 $(ps aux | grep celery | awk '{print $2}')")

        logging.info('deregister_command =\n{}'.format(deregister_command))
        os.system(deregister_command)

        VMStateModel.set_state(params=parameters, ins_ids=[self.__get_flex_instance_id(public_ip=ip)],
                               state=VMStateModel.STATE_TERMINATED, description='VM Deregistered.')


    def deregister_instances(self, parameters, terminate=False):
        machines = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        logging.info('machines to deregistered = {0}'.format(pprint.pformat(machines)))
        for machine in machines:
            self.__deregister_flex_vm(ip=machine['ip'], username=machine['username'], keyname=machine['keyname'],
                                      user_id=parameters['user_id'], parameters=parameters)

    def validate_credentials(self, credentials):
        raise NotImplementedError

    def deregister_some_instances(self, parameters, instance_ids, terminate=False):
        """
        Deregister the specific Flex instances

        Args:
          parameters      A dictionary of parameters
          instance_ids    The list of instance ids that is going to be terminated
        """
        logging.info('instance_ids to be deregistered = {0}'.format(instance_ids))

        machines_to_deregister = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            if self.__get_flex_instance_id(machine['ip']) in instance_ids:
                machines_to_deregister.append(machine)

        logging.info('machines_to_deregister:\n{0}'.format(pprint.pformat(machines_to_deregister)))

        if len(machines_to_deregister) != len(instance_ids):
            logging.error('Could not find all instances to be deregistered!')

        for machine in machines_to_deregister:
            logging.info('Instance with ip {0} was terminated'.format(machine['ip']))
            self.__deregister_flex_vm(ip=machine['ip'], username=machine['username'], keyname=machine['keyname'],
                                      user_id=parameters['user_id'], parameters=parameters)

    def get_instance_state(self, ip, username, keyfile):
        logging.info('Checking state...')
        command = '[ -d ~/stochss ] && echo yes'

        cmd = self.get_remote_command_string(ip=ip, username=username, keyfile=keyfile,
                                             command=command)
        logging.info('cmd = {0}'.format(cmd))

        if os.system(cmd) == 0:
            return 'running'

        # TODO: Check if state is prepared

        return 'unknown'

    def describe_instances(self, parameters, prefix=''):
        """
        Retrieves the list of running instances

        Args:
          parameters  A dictionary containing the 'keyname' parameter

        Returns:
          A tuple of the form (public_ips, private_ips, instances) where each
          member is a list.
        """
        logging.debug('params = \n{0}'.format(pprint.pformat(parameters)))
        machines = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        instance_list = []

        for machine in machines:
            instance = {}
            instance["id"] = self.__get_flex_instance_id(machine["ip"])
            instance["public_ip"] = machine["ip"]
            instance["private_ip"] = machine["ip"]

            instance["state"] = self.get_instance_state(ip=machine["ip"],
                                                        username=machine["username"],
                                                        keyfile=FlexConfig.get_keyfile(
                                                            keyname=machine["keyname"],
                                                            user_id=parameters[self.PARAM_USER_ID]))

            instance["key_name"] = os.path.basename(machine["keyname"])
            instance_list.append(instance)

        logging.info('instance_list = \n{0}'.format(pprint.pformat(instance_list)))
        return instance_list


    def prepare_instances(self, parameters, count=None, security_configured=True):
        """
        prepares the specified number of Flex instances using the parameters
        provided. This method is blocking in that it waits until the
        requested VMs are properly booted up. However if the requested
        VMs cannot be procured within 1800 seconds, this method will treat
        it as an error and return. (Also see documentation for the BaseAgent
        class)

        Args:
          parameters          A dictionary of parameters. This must contain 'keyname',
                              'group', 'image_id' and 'instance_type' parameters.
          security_configured Uses this boolean value as an heuristic to
                              detect brand new AppScale deployments.

        Returns:
          A tuple of the form (instances, public_ips, private_ips)
        """

        flex_cloud_machine_info = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        user_id = parameters[self.PARAM_USER_ID]

        credentials = parameters[self.PARAM_CREDENTIALS]

        for machine in flex_cloud_machine_info:
            ip = machine['ip']
            keyfile = FlexConfig.get_keyfile(keyname=machine['keyname'], user_id=user_id)
            username = machine['username']
            is_queue_head = machine[self.PARAM_QUEUE_HEAD]
            id = self.__get_flex_instance_id(public_ip=ip)

            if not os.path.exists(keyfile):
                logging.error('Keyfile: {0} does not exist!'.format(keyfile))
                VMStateModel.set_state(params=parameters, ins_ids=[id],
                                       state=VMStateModel.STATE_FAILED,
                                       description=VMStateModel.DESCRI_INVALID_KEYFILE)
                continue


            logging.info("[{0}] [{1}] [{2}] [is_queue_head:{3}]".format(ip, keyfile, username, is_queue_head))

            script_lines = []
            script_lines.append("#!/bin/bash")

            script_lines.append("echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc".format(credentials['EC2_ACCESS_KEY']))
            script_lines.append("echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc".format(credentials['EC2_SECRET_KEY']))

            script_lines.append("echo export STOCHKIT_HOME={0} >> ~/.bashrc".format("~/stochss/StochKit/"))
            script_lines.append("echo export STOCHKIT_ODE={0} >> ~/.bashrc".format("~/stochss/ode/"))
            script_lines.append("echo export R_LIBS={0} >> ~/.bashrc".format("~/stochss/stochoptim/library"))
            script_lines.append("echo export C_FORCE_ROOT=1 >> ~/.bashrc".format("~/stochss/stochoptim/library"))

            if is_queue_head:
                script_lines.append("sudo rabbitmqctl add_user stochss ucsb")
                script_lines.append('sudo rabbitmqctl set_permissions -p / stochss ".*" ".*" ".*"')

            bash_script = '\n'.join(script_lines)
            logging.info("\n\n\nbash_script =\n{0}\n\n\n".format(bash_script))

            bash_script_filename = os.path.join(AgentConfig.TMP_DIRNAME, 'stochss_init.sh')
            bash_script_file = open(bash_script_filename, 'w')
            bash_script_file.write(bash_script)
            bash_script_file.close()

            scp_command = 'scp -o \'StrictHostKeyChecking no\' -i {keyfile} {source} {target}'.format(
                                                keyfile=keyfile,
                                                source=bash_script_filename,
                                                target="{username}@{ip}:~/stochss_init.sh".format(username=username,
                                                                                                  ip=ip))

            logging.info('scp command =\n{}'.format(scp_command))
            res = os.system(scp_command)

            os.remove(bash_script_filename)

            if res != 0:
                logging.error('scp failed!'.format(keyfile))
                VMStateModel.set_state(params=parameters, ins_ids=[id],
                                       state=VMStateModel.STATE_FAILED,
                                       description=VMStateModel.DESCRI_FAIL_TO_PREPARE)
                continue

            commands = ['chmod +x ~/stochss_init.sh',
                        '~/stochss_init.sh']
            command = ';'.join(commands)

            remote_command_string = self.get_remote_command_string(ip=ip, username=username,
                                                                   keyfile=keyfile, command=command)

            logging.info('remote_command_string =\n{}'.format(remote_command_string))
            res = os.system(remote_command_string)

            if res != 0:
                logging.error('remote command failed!'.format(keyfile))
                VMStateModel.set_state(params=parameters, ins_ids=[id],
                                       state=VMStateModel.STATE_FAILED,
                                       description=VMStateModel.DESCRI_FAIL_TO_PREPARE)
                continue



    def handle_failure(self, msg):
        """
        Log the specified error message and raise an AgentRuntimeException

        Args:
          msg An error message to be logged and included in the raised exception

        Raises:
          AgentRuntimeException Contains the input error message
        """
        logging.info(msg)
        raise AgentRuntimeException(msg)

    @staticmethod
    def get_remote_command_string(ip, username, keyfile, command):
        return "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {username}@{ip} \"{command}\"".format(keyfile=keyfile,
                                                                                                     username=username,
                                                                                                     command=command,
                                                                                                     ip=ip)


