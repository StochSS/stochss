import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'flex_api')))

from base_agent import BaseAgent, AgentConfigurationException, AgentRuntimeException
from common.config import AgentTypes, FlexConfig, AgentConfig

import traceback
import pprint
import datetime
import time
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

    PARAM_QUEUE_HEAD = 'queue_head'
    PARAM_FLEX_CLOUD_MACHINE_INFO = 'flex_cloud_machine_info'
    PARAM_USER_ID = 'user_id'
    PARAM_FLEX_DB_PASSWORD = 'flex_db_password'
    PARAM_FLEX_QUEUE_HEAD = 'flex_queue_head'

    REQUIRED_FLEX_PREPARE_INSTANCES_PARAMS = (
        PARAM_FLEX_CLOUD_MACHINE_INFO,
        PARAM_USER_ID,
        PARAM_FLEX_DB_PASSWORD,
        PARAM_FLEX_QUEUE_HEAD
    )

    REQUIRED_FLEX_DEREGISTER_INSTANCES_PARAMS = (
        PARAM_FLEX_CLOUD_MACHINE_INFO,
        PARAM_USER_ID,
        PARAM_FLEX_DB_PASSWORD,
        PARAM_FLEX_QUEUE_HEAD
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

        logging.debug('required_params: {0}'.format(required_params))

        for param in required_params:
            logging.debug('param: {0}'.format(param))
            if not utils.has_parameter(param, parameters):
                raise AgentConfigurationException('no ' + param)

    def __get_flex_instance_id(self, public_ip):
        return 'flex_{0}'.format(public_ip.replace('.', '_', 3))

    def describe_instances_launched(self, parameters):
        launched_ids = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            launched_ids.append(self.__get_flex_instance_id(machine['ip']))

        logging.debug('launched_ids = {0}'.format(launched_ids))
        return launched_ids

    def __get_flex_vm_state_url(self, ip):
        return 'https://{ip}/state'.format(ip=ip)

    def __get_flex_vm_state_info(self, ip):
        try:
            data_received = urllib2.urlopen(url=self.__get_flex_vm_state_url(ip), timeout=10).read()
            state_info = json.loads(data_received)

            logging.debug('From ip {0}: json = {1}'.format(ip, state_info))

            if state_info['state'] in FlexVMState.VALID_STATES:
                return state_info

        except Exception as e:
            logging.error(str(e))

        return {'state': FlexVMState.UNKNOWN}

    def describe_unprepared_instances(self, parameters):
        instance_ids = []
        public_ips = []
        private_ips = []
        instance_types = []
        keyfiles = []
        usernames = []

        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            ip = machine['ip']
            state = self.get_instance_state(ip=ip, username=machine['username'], keyfile=machine['keyfile'])
            logging.debug('describe_unprepared_instances() ip {0} has state'.format(ip, state))

            if state == FlexVMState.UNPREPARED:
                instance_ids.append(self.__get_flex_instance_id(ip))
                public_ips.append(ip)
                private_ips.append(ip)
                instance_types.append(FlexConfig.INSTANCE_TYPE)
                keyfiles.append(machine['keyfile'])
                usernames.append(machine['username'])
            else:
                logging.debug('ip {0} is already prepared!'.format(ip))

        return public_ips, private_ips, instance_ids, instance_types, keyfiles, usernames

    def __deregister_flex_vm(self, ip, username, keyfile, parameters, queue_head_ip, force=False):
        # deregister_command = self.get_remote_command_string(ip=ip, username=username, keyfile=keyfile,
        # command="sudo ~/stochss/release-tools/flex-cloud/deregister_flex_vm.sh")
        #
        # logging.debug('deregister_command =\n{}'.format(deregister_command))
        # os.system(deregister_command)

        try:
            url = "https://{ip}/deregister".format(ip=ip)
            data = json.dumps({
                'queue_head_ip': queue_head_ip
            })
            req = urllib2.Request(url=url, data=data, headers={'Content-Type': 'application/json'})
            f = urllib2.urlopen(req, timeout=10)
            response = json.loads(f.read())
            f.close()

            logging.debug('Full Deregister Response:\n{}'.format(pprint.pformat(response)))
            if response['status'] == 'success':
                logging.debug('Successfully deregistered Flex VM with ip={}'.format(ip))
            else:
                logging.debug('Failed to deregister Flex VM with ip={}'.format(ip))

        except Exception as e:
            logging.error('Failed to deregister Flex VM: '.format(str(e)))
            logging.error(sys.exc_info())

        finally:
            VMStateModel.set_state(params=parameters, ins_ids=[self.__get_flex_instance_id(public_ip=ip)],
                                   state=VMStateModel.STATE_TERMINATED, description='VM Deregistered.')


    def deregister_instances(self, parameters, terminate=False):
        machines = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        logging.debug('machines to deregistered = {0}'.format(pprint.pformat(machines)))

        queue_head_machine = parameters[self.PARAM_FLEX_QUEUE_HEAD]
        logging.debug('queue_head_machine = {}'.format(queue_head_machine))

        for machine in machines:
            self.__deregister_flex_vm(ip=machine['ip'],
                                      username=machine['username'],
                                      keyfile=machine['keyfile'],
                                      parameters=parameters,
                                      queue_head_ip=queue_head_machine['ip'])

    def validate_credentials(self, credentials):
        raise NotImplementedError

    def deregister_some_instances(self, parameters, instance_ids, terminate=False):
        """
        Deregister the specific Flex instances

        Args:
          parameters      A dictionary of parameters
          instance_ids    The list of instance ids that is going to be terminated
        """
        logging.debug('instance_ids to be deregistered = {0}'.format(instance_ids))

        machines_to_deregister = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            if self.__get_flex_instance_id(machine['ip']) in instance_ids:
                machines_to_deregister.append(machine)

        logging.debug('machines_to_deregister:\n{0}'.format(pprint.pformat(machines_to_deregister)))

        if len(machines_to_deregister) != len(instance_ids):
            logging.error('Could not find all instances to be deregistered!')

        for machine in machines_to_deregister:
            logging.debug('Instance with ip {0} was terminated'.format(machine['ip']))
            self.__deregister_flex_vm(ip=machine['ip'],
                                      username=machine['username'],
                                      keyfile=machine['keyfile'],
                                      parameters=parameters,
                                      queue_head_ip=parameters[self.PARAM_FLEX_QUEUE_HEAD]['ip'])

    def get_instance_state(self, ip, username, keyfile):
        logging.debug('Checking state for {ip}...'.format(ip=ip))

        state = VMStateModel.STATE_UNKNOWN
        try:
            command = '[ -d ~/stochss ] && true'
            cmd = self.get_remote_command_string(ip=ip, username=username,
                                                 keyfile=keyfile,
                                                 command=command)
            logging.debug('cmd = {0}'.format(cmd))
            if os.system(cmd) != 0:
                state = VMStateModel.STATE_INACCESSIBLE
            else:
                state = VMStateModel.STATE_ACCESSIBLE

                url = self.__get_flex_vm_state_url(ip)
                logging.debug('GET {url}'.format(url=url))

                response = json.loads(urllib2.urlopen(url).read())
                logging.debug('response =\n{}'.format(pprint.pformat(response)))

                if 'state' in response:
                    state = response['state']

        except Exception as e:
            logging.error(traceback.format_exc())
            logging.error('Error: {}'.format(str(e)))
            state = VMStateModel.STATE_UNKNOWN

        return state

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
                                                        keyfile=machine['keyfile'])
            instance_list.append(instance)

        logging.debug('instance_list = \n{0}'.format(pprint.pformat(instance_list)))
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
        logging.debug('prepare_instances')

        flex_cloud_machine_info = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        logging.debug('flex_cloud_machine_info =\n{}'.format(pprint.pformat(flex_cloud_machine_info)))

        queue_head = parameters[self.PARAM_FLEX_QUEUE_HEAD]
        logging.debug('queue_head = {}'.format(queue_head))
        queue_head_keyfile = queue_head['keyfile']
        remote_queue_head_keyfile = os.path.join(FlexConfig.QUEUE_HEAD_KEY_DIR,
                                                 os.path.basename(queue_head_keyfile))

        for machine in flex_cloud_machine_info:
            ip = machine['ip']
            keyfile = machine['keyfile']

            os.chmod(keyfile, int('600', 8))

            username = machine['username']
            is_queue_head = machine[self.PARAM_QUEUE_HEAD]
            id = self.__get_flex_instance_id(public_ip=ip)

            if not os.path.exists(keyfile):
                logging.error('Keyfile: {0} does not exist!'.format(keyfile))
                VMStateModel.set_state(params=parameters, ins_ids=[id],
                                       state=VMStateModel.STATE_FAILED,
                                       description=VMStateModel.DESCRI_INVALID_KEYFILE)
                continue

            logging.debug("[{0}] [{1}] [{2}] [is_queue_head:{3}]".format(ip, keyfile, username, is_queue_head))

            scp_command = \
                'scp -o \'StrictHostKeyChecking no\' -i {keyfile} {source} {target}'.format(
                    keyfile=keyfile,
                    source=queue_head_keyfile,
                    target="{username}@{ip}:{remote_queue_head_keyfile}".format(
                        username=username, ip=ip, remote_queue_head_keyfile=remote_queue_head_keyfile
                    )
                )

            logging.debug('scp command for queue head keyfile =\n{}'.format(scp_command))
            res = os.system(scp_command)
            if res != 0:
                logging.error('scp for queue head keyfile failed!'.format(keyfile))
                VMStateModel.set_state(params=parameters, ins_ids=[id],
                                       state=VMStateModel.STATE_FAILED,
                                       description=VMStateModel.DESCRI_FAIL_TO_PREPARE)
                continue

            script_lines = []
            script_lines.append("#!/bin/bash")

            script_lines.append("echo export STOCHKIT_HOME={0} >> ~/.bashrc".format("~/stochss/StochKit/"))
            script_lines.append("echo export STOCHKIT_ODE={0} >> ~/.bashrc".format("~/stochss/ode/"))
            script_lines.append("echo export R_LIBS={0} >> ~/.bashrc".format("~/stochss/stochoptim/library"))
            script_lines.append("echo export C_FORCE_ROOT=1 >> ~/.bashrc".format("~/stochss/stochoptim/library"))
            script_lines.append("chmod 600 {remote_queue_head_keyfile}".format(
                                                        remote_queue_head_keyfile=remote_queue_head_keyfile))

            if is_queue_head:
                logging.debug('Adding extra commands for configuring queue head...')
                script_lines.append("sudo rabbitmqctl add_user stochss ucsb")
                script_lines.append('sudo rabbitmqctl set_permissions -p / stochss ".*" ".*" ".*"')

                reset_mysql_script = '~/stochss/release-tools/flex-cloud/reset_mysql_pwd.sh'
                script_lines.append("sudo {reset_mysql_script} root {flex_db_password}".format(
                    reset_mysql_script=reset_mysql_script,
                    flex_db_password=parameters[self.PARAM_FLEX_DB_PASSWORD]))

            bash_script = '\n'.join(script_lines)
            logging.debug("\n\n\nbash_script =\n{0}\n\n\n".format(bash_script))

            bash_script_filename = os.path.join(AgentConfig.TMP_DIRNAME, 'stochss_init.sh')
            with open(bash_script_filename, 'w') as bash_script_file:
                bash_script_file.write(bash_script)

            scp_command = 'scp -o \'StrictHostKeyChecking no\' -i {keyfile} {source} {target}'.format(
                keyfile=keyfile,
                source=bash_script_filename,
                target="{username}@{ip}:~/stochss_init.sh".format(username=username,
                                                                  ip=ip))

            logging.debug('scp command =\n{}'.format(scp_command))
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

            logging.debug('remote_command_string =\n{}'.format(remote_command_string))
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
        logging.debug(msg)
        raise AgentRuntimeException(msg)

    @staticmethod
    def get_remote_command_string(ip, username, keyfile, command):
        return "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {username}@{ip} \"{command}\"".format(keyfile=keyfile,
                                                                                                     username=username,
                                                                                                     command=command,
                                                                                                     ip=ip)


