from base_agent import BaseAgent, AgentConfigurationException, AgentRuntimeException
from common.config import AgentTypes

import sys
import os
import traceback

sys.path.append(os.path.join(os.path.dirname(__file__), '../../lib/boto'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))

import datetime
import time
import pprint
import logging

from utils import utils
from tasks import *

__author__ = 'dev'
__email__ = 'dnath@cs.ucsb.edu'


class FlexAgent(BaseAgent):
    AGENT_NAME = AgentTypes.FLEX

    PARAM_CREDENTIALS = 'credentials'
    PARAM_QUEUE_HEAD = 'queue_head'
    PARAM_FLEX_CLOUD_MACHINE_INFO = 'flex_cloud_machine_info'

    def configure_instance_security(self, parameters):
        pass

    def assert_required_parameters(self, parameters, operation):
        pass

    def __get_flex_instance_id(self, public_ip):
        return 'flex_{}'.format(public_ip.replace('.', '', 3))

    def describe_instances_launched(self, parameters):
        launched_ids = []
        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            launched_ids.append(self.__get_flex_instance_id(machine['ip']))

    def describe_instances_running(self, parameters):
        instance_ids = []
        public_ips = []
        private_ips = []
        instance_types = []

        for machine in parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]:
            instance_ids.append(self.__get_flex_instance_id(machine['ip']))
            public_ips.append(machine['ip'])
            private_ips.append(machine['ip'])
            instance_types.append('c3.large')

        return public_ips, private_ips, instance_ids, instance_types

    def prepare_instances(self, parameters, count=None, security_configured=True):
        pass


    def deregister_instances(self, parameters, terminate=False):
        machines = parameters[self.PARAM_FLEX_CLOUD_MACHINE_INFO]
        logging.info('machines = {0}'.format(pprint.pformat(machines)))

    def validate_credentials(self, credentials):
        raise NotImplementedError

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
                                                        keyfile=machine["keyfile"])
            instance["key_name"] = os.path.basename(machine["keyfile"])
            instance_list.append(instance)

        logging.info('instance_list = \n{0}'.format(pprint.pformat(instance_list)))
        return instance_list

    def __get_preparing_commands(self, aws_credentials):
        # These are commutative commands

        commands = []

        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(aws_credentials['AWS_ACCESS_KEY_ID']))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(aws_credentials['AWS_SECRET_ACCESS_KEY']))

        commands.append(
            'echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc'.format(aws_credentials['AWS_ACCESS_KEY_ID']))
        commands.append(
            'echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc'.format(aws_credentials['AWS_SECRET_ACCESS_KEY']))

        # commands.append('echo export AWS_ACCESS_KEY_ID={0} >> /home/ubuntu/.bashrc'.format(str(self.aws_credentials['AWS_ACCESS_KEY_ID'])))
        # commands.append('echo export AWS_SECRET_ACCESS_KEY={0} >> /home/ubuntu/.bashrc'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))

        commands.append('export STOCHKIT_HOME={0}'.format('/home/ubuntu/stochss/StochKit/'))
        commands.append('export STOCHKIT_ODE={0}'.format('/home/ubuntu/stochss/ode/'))

        commands.append('echo export STOCHKIT_HOME={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/StochKit/"))
        commands.append('echo export STOCHKIT_ODE={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/ode/"))

        commands.append('echo export C_FORCE_ROOT=1 >> ~/.bashrc')
        # commands.append('echo export C_FORCE_ROOT=1 >> /home/ubuntu/.bashrc')

        commands.append('source ~/.bashrc')

        return commands


    def prepare_machines(self, params):
        logging.info("prepare_machines: inside method with machine_info : \n%s", pprint.pformat(params["machines"]))

        queue_head = None
        for machine in params["machines"]:
            if machine["type"] == "queue-head":
                if queue_head is not None:
                    raise AgentConfigurationException("There can be only one master !")
                else:
                    queue_head = machine
            elif machine["type"] == "worker":
                pass
            else:
                raise AgentConfigurationException("Invalid machine type : {0} !".format(machine["type"]))

        if queue_head == None:
            raise AgentConfigurationException("Need at least one master!")

        logging.info("queue head = \n{0}".format(pprint.pformat(queue_head)))

        try:
            commands = self.__get_preparing_commands(aws_credentials=params['aws_credentials'])
            command = ';'.join(commands)

            logging.info("Preparing environment on remote machines...")
            for machine in params["machines"]:
                logging.info("For machine {ip}".format(ip=machine['ip']))

                if machine['type'] == 'queue-head':
                    rabbitmq_commands = []
                    rabbitmq_commands.append('sudo rabbitmqctl add_user stochss ucsb')
                    rabbitmq_commands.append(
                        'sudo rabbitmqctl set_permissions -p / stochss \\\".*\\\" \\\".*\\\" \\\".*\\\"')

                    logging.info("Adding RabbitMQ commands for {0}...".format(machine['ip']))
                    updated_command = ';'.join(commands + rabbitmq_commands)

                    remote_command = "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {user}@{ip} \"{cmd}\"".format(
                        keyfile=machine["keyfile"],
                        user=machine["username"],
                        ip=machine["public_ip"],
                        cmd=updated_command)
                else:
                    remote_command = "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {user}@{ip} \"{cmd}\"".format(
                        keyfile=machine["keyfile"],
                        user=machine["username"],
                        ip=machine["public_ip"],
                        cmd=command)

                logging.info("Remote command: {0}".format(remote_command))
                success = os.system(command)

                if success != 0:
                    raise Exception("Remote command failed on {ip}!".format(ip=machine['ip']))

            self.__configure_celery(queue_head, params)

            return {"success": True}

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_machines : exiting method with error : {0}".format(str(e)))
            return None

    def __configure_celery(self, queue_head, params):
        self.__update_celery_config_with_queue_head_ip(queue_head_ip=queue_head["public_ip"])
        logging.info("Updated celery config with queue head ip: {0}".format(queue_head["public_ip"]))
        for machine in params["machines"]:
            logging.info("Copying celery config to {ip}".format(ip=machine["public_ip"]))
            self.__copy_celery_config_to_machine(username=machine["username"],
                                                 ip=machine["public_ip"],
                                                 keyfile=machine["keyfile"])

            logging.info("Starting celery on {ip}".format(ip=machine["public_ip"]))
            self.__start_celery_on_machine_via_ssh(username=machine["username"],
                                                   ip=machine["public_ip"],
                                                   keyfile=machine["keyfile"],
                                                   aws_credentials=params['aws_credentials'])

    def __update_celery_config_with_queue_head_ip(self, queue_head_ip):
        # Write queue_head_ip to file on the appropriate line
        current_dir = os.path.dirname(os.path.abspath(__file__))
        celery_config_filename = os.path.join(current_dir, "celeryconfig.py")
        celery_template_filename = os.path.join(current_dir, "conf", "celeryconfig.py.template")

        logging.debug("celery_config_filename = {0}".format(celery_config_filename))
        logging.debug("celery_template_filename = {0}".format(celery_template_filename))

        celery_config_lines = []
        with open(celery_template_filename) as celery_config_file:
            celery_config_lines = celery_config_file.readlines()

        with open(celery_config_filename, 'w') as celery_config_file:
            for line in celery_config_lines:
                if line.strip().startswith('BROKER_URL'):
                    celery_config_file.write('BROKER_URL = "amqp://stochss:ucsb@{0}:5672/"\n'.format(queue_head_ip))
                else:
                    celery_config_file.write(line)

        # Now update the actual Celery app....
        # TODO: Doesnt seem to work in GAE until next request comes in to server
        my_celery = CelerySingleton()
        my_celery.configure()

    def __copy_celery_config_to_machine(self, username, ip, keyfile):
        logging.info("keyfile = {0}".format(keyfile))

        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))

        celery_config_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "celeryconfig.py")
        logging.info("celery_config_filename = {0}".format(celery_config_filename))

        if not os.path.exists(celery_config_filename):
            raise Exception("celery config file not found: {0}".format(celery_config_filename))

        cmd = "scp -o 'StrictHostKeyChecking no' -i {keyfile} {file} {user}@{ip}:celeryconfig.py".format(
            keyfile=keyfile,
            file=celery_config_filename,
            user=username,
            ip=ip)
        logging.info(cmd)
        success = os.system(cmd)

        if success == 0:
            logging.info("scp success: {0} transfered to {1}".format(celery_config_filename, ip))
        else:
            raise Exception("scp failure: {0} not transfered to {1}".format(celery_config_filename, ip))


    def __start_celery_on_machine_via_ssh(self, username, ip, keyfile, aws_credentials):
        commands = []
        commands.append('source /home/ubuntu/.bashrc')
        commands.append(
            'export PYTHONPATH=/home/ubuntu/pyurdme/:/home/ubuntu/stochss/app/:/home/ubuntu/stochss/app/backend')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(aws_credentials['AWS_ACCESS_KEY_ID']))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(aws_credentials['AWS_SECRET_ACCESS_KEY']))
        commands.append(
            'celery -A tasks worker --autoreload --loglevel=info --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1')

        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to write to
        # the process' terminal, screen provides this terminal.
        celery_cmd = "sudo screen -d -m bash -c '{0}'\n".format(';'.join(commands))

        logging.info("keyfile = {0}".format(keyfile))

        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))

        command = "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {user}@{ip} \"{cmd}\"".format(keyfile=keyfile,
                                                                                                user=username,
                                                                                                ip=ip,
                                                                                                cmd=celery_cmd)
        logging.info(command)
        success = os.system(command)

        if success == 0:
            logging.info("celery started on {0}".format(ip))
        else:
            raise Exception("Failure to start celery on {0}".format(ip))

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

