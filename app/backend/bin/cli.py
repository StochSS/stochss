#!/usr/bin/env python

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import logging
import traceback
import json
import re
import pprint
import time
import argparse

from databases.dynamo_db import DynamoDB
import tasks
from tasks import *

from common.config import FlexConfig
import common.helper as helper

def get_aws_credentials():
    if not os.environ.has_key("AWS_ACCESS_KEY_ID") or not os.environ.has_key("AWS_SECRET_ACCESS_KEY"):
        raise Exception("Environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are not set!")

    return {'AWS_ACCESS_KEY_ID': os.environ["AWS_ACCESS_KEY_ID"],
            'AWS_SECRET_ACCESS_KEY': os.environ["AWS_SECRET_ACCESS_KEY"]}


class UnsupportedError(BaseException):
    pass


class InvalidConfigurationError(BaseException):
    pass


class BackendCli:
    SUPPORTED_OUTPUT_STORES = ["amazon_s3"]
    SUPPORTED_JOB_STATUS_DB_STORES = ["amazon_dynamodb"]
    AGENT_TYPE = 'flex'

    def __init__(self, cli_jobs_config):
        self.machines = cli_jobs_config["machines"]
        self.jobs = cli_jobs_config["jobs"]

        if cli_jobs_config["output_store"]["type"] not in self.SUPPORTED_OUTPUT_STORES:
            raise UnsupportedError("Output store {0} not supported !".format(cli_jobs_config["output_store"]["type"]))

        if cli_jobs_config["job_status_db_store"]["type"] not in self.SUPPORTED_JOB_STATUS_DB_STORES:
            raise UnsupportedError("Job Status DB store {0} not supported !".format(
                cli_jobs_config["job_status_db_store"]["type"]))

        if re.match('^amazon.*', cli_jobs_config["output_store"]["type"]) or \
                re.match('^amazon.*', cli_jobs_config["job_status_db_store"]["type"]):
            self.aws_credentials = get_aws_credentials()

        self.output_store_info = cli_jobs_config["output_store"]
        self.job_status_db_store_info = cli_jobs_config["job_status_db_store"]

        if self.job_status_db_store_info["type"] == "amazon_dynamodb":
            self.database = DynamoDB(secret_key=self.aws_credentials["AWS_SECRET_ACCESS_KEY"],
                                     access_key=self.aws_credentials["AWS_ACCESS_KEY_ID"])
        else:
            raise InvalidConfigurationError("Job status database not supported!")


    def __wait_for_jobs(self, task_id_job_map, task_ids):
        while True:
            if len(task_ids) == 0:
                break

            time.sleep(5)
            tasks = self.database.describetask(taskids=task_ids,
                                               tablename=self.job_status_db_store_info['table_name'])
            for task_id in tasks.keys():
                task = tasks[task_id]
                job_index = task_id_job_map[task_id]

                if task['status'] == 'finished':
                    logging.info("Job #{0} finished.".format(job_index))
                    logging.info("Status = \n{0}".format(pprint.pformat(task)))
                    task_ids.remove(task_id)

    def __launch_jobs(self):
        task_ids = []
        task_id_job_map = {}
        for index, job in enumerate(self.jobs):
            logging.info("Preparing for  Job #{0}...".format(index))
            with open(job['model_file_path']) as xml_file:
                model_xml_doc = xml_file.read()

            params = job["params"]
            params['document'] = model_xml_doc
            params['bucketname'] = self.output_store_info['bucket_name']

            result = self.execute_cloud_task(params=params,
                                             agent=self.AGENT_TYPE,
                                             instance_type=FlexConfig.INSTANCE_TYPE,
                                             secret_key=self.aws_credentials["AWS_SECRET_ACCESS_KEY"],
                                             access_key=self.aws_credentials["AWS_ACCESS_KEY_ID"],
                                             database=self.database)
            logging.info("Job #{0} submitted to backend.".format(index))

            logging.info("result = \n{0}".format(pprint.pprint(result)))

            if not result["success"]:
                logging.error("Exception:\n%s" % result["exception"])

            task_id = result["db_id"]
            task_ids.append(task_id)
            task_id_job_map[task_id] = index

        return task_id_job_map, task_ids

    def execute_cloud_task(self, params, agent, access_key, secret_key,
                           task_id=None, instance_type=None, cost_replay=False, database=None):
        '''
        This method instantiates celery tasks in the cloud.
        Returns return value from celery async call and the task ID
        '''
        # logging.info('inside execute task for cloud : Params - %s', str(params))
        if not database:
            database = DynamoDB(access_key, secret_key)

        result = helper.execute_cloud_task(params=params, agent=agent, access_key=access_key, secret_key=secret_key,
                                           task_id=task_id, instance_type=instance_type, cost_replay=cost_replay,
                                           database=database)
        return result


    def run(self):
        self.database.createtable(self.job_status_db_store_info['table_name'])

        self.prepare_machines()
        task_id_job_map, task_ids = self.__launch_jobs()
        self.__wait_for_jobs(task_id_job_map, task_ids)

        logging.info('All jobs finished!')

    def __get_preparing_commands(self):
        # These are commutative commands

        commands = []
        commands.append('#!/bin/bash')

        commands.append(
            'echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc'.format(str(self.aws_credentials['AWS_ACCESS_KEY_ID'])))
        commands.append(
            'echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))

        # commands.append('export STOCHKIT_HOME={0}'.format('~/stochss/StochKit/'))
        # commands.append('export STOCHKIT_ODE={0}'.format('~/stochss/ode/'))

        commands.append('echo export STOCHKIT_HOME={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/StochKit/"))
        commands.append('echo export STOCHKIT_ODE={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/ode/"))

        commands.append('echo export C_FORCE_ROOT=1 >> ~/.bashrc')
        # commands.append('echo export C_FORCE_ROOT=1 >> /home/ubuntu/.bashrc')

        commands.append('source ~/.bashrc')

        return commands

    def __configure_celery(self, queue_head):
        commands = []
        commands.append('source ~/.bashrc')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(str(self.aws_credentials['AWS_ACCESS_KEY_ID'])))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(str(self.aws_credentials['AWS_SECRET_ACCESS_KEY'])))

        for machine in self.machines:
            logging.info("Starting celery on {ip}".format(ip=machine["public_ip"]))
            success = helper.start_celery_on_vm(instance_type=FlexConfig.INSTANCE_TYPE,
                                                ip=machine["public_ip"],
                                                key_file=machine["keyfile"],
                                                prepend_commands=commands,
                                                agent_type=self.AGENT_TYPE)
            if success != 0:
                raise Exception("Failure to start celery on {0}".format(machine["public_ip"]))

        # get all intstance types and configure the celeryconfig.py locally
        instance_types = [FlexConfig.INSTANCE_TYPE]
        helper.config_celery_queues(agent_type=self.AGENT_TYPE, instance_types=instance_types)


    def __get_queue_head_machine_info(self):
        queue_head = None
        for machine in self.machines:
            if machine["type"] == "queue-head":
                if queue_head is not None:
                    raise InvalidConfigurationError("There can be only one master !")
                else:
                    queue_head = machine
            elif machine["type"] == "worker":
                pass
            else:
                raise InvalidConfigurationError("Invalid machine type : {0} !".format(machine["type"]))
        if queue_head == None:
            raise InvalidConfigurationError("Need at least one master!")
        return queue_head

    def prepare_machines(self):
        logging.info("prepare_machines: inside method with machine_info : \n%s", pprint.pformat(self.machines))

        queue_head = self.__get_queue_head_machine_info()

        logging.info("queue head = \n{0}".format(pprint.pformat(queue_head)))

        try:
            commands = self.__get_preparing_commands()

            logging.info("Preparing environment on remote machines...")
            for machine in self.machines:
                logging.info("For machine {ip}".format(ip=machine['public_ip']))

                if machine['type'] == 'queue-head':
                    rabbitmq_commands = []
                    rabbitmq_commands.append('sudo rabbitmqctl add_user stochss ucsb')
                    rabbitmq_commands.append(
                        'sudo rabbitmqctl set_permissions -p / stochss ".*" ".*" ".*"')

                    logging.info("Adding RabbitMQ commands for {0}...".format(machine['public_ip']))
                    command = '\n'.join(commands + rabbitmq_commands)

                else:
                    command = '\n'.join(commands)

                bash_script_filename = os.path.join(os.path.dirname(__file__), "setup_script.sh")
                with open(bash_script_filename, 'w') as file:
                    file.write(command)

                logging.debug("script =\n{0}".format(command))

                remote_copy_command = "scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {key_file} {bash_script_filename} {user}@{ip}:setup_script.sh".format(
                    key_file=machine["keyfile"],
                    user=machine["username"],
                    ip=machine["public_ip"],
                    bash_script_filename=bash_script_filename)

                logging.info("Remote copy command: {0}".format(remote_copy_command))
                success = os.system(remote_copy_command)

                if success != 0:
                    raise Exception("Remote copy command failed on {ip}!".format(ip=machine['public_ip']))

                commands = [
                    "chmod +x /home/ubuntu/setup_script.sh",
                    "bash /home/ubuntu/setup_script.sh"
                ]
                remote_command = "ssh -o 'UserKnownHostsFile=/dev/null' -o 'StrictHostKeyChecking=no' -i {key_file} {user}@{ip} \"{cmd}\"".format(
                    key_file=machine["keyfile"],
                    user=machine["username"],
                    ip=machine["public_ip"],
                    cmd=";".join(commands))

                logging.info("Remote command: {0}".format(remote_command))
                success = os.system(remote_command)

                if success != 0:
                    raise Exception("Remote command failed on {ip}!".format(ip=machine['public_ip']))

            helper.update_celery_config_with_queue_head_ip(queue_head_ip=queue_head["public_ip"])
            logging.info("Updated celery config with queue head ip: {0}".format(queue_head["public_ip"]))

            self.__configure_celery(queue_head)

            return {"success": True}

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_machines : exiting method with error : {0}".format(str(e)))
            return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--settings', help="Job/Configuration Settings File (../conf/cli_jobs_config.json by default)",
                        action="store", dest="config_file",
                        default=os.path.join(os.path.dirname(__file__), "..", "conf", "cli_jobs_config.json"))
    parser.add_argument('-l', '--loglevel', help="Log level (eg. debug, info, error)",
                        action="store", dest="log_level",default="info")

    args = parser.parse_args(sys.argv[1:])

    log_level = args.log_level.lower()
    if log_level == 'debug':
        logging.basicConfig(level=logging.DEBUG)
    elif log_level == 'info':
        logging.basicConfig(level=logging.INFO)
    elif log_level == 'error':
        logging.basicConfig(level=logging.ERROR)
    else:
        raise Exception('Invalid Log Level = {0}!'.format(args.log_level))
    # logging.basicConfig(filename='testoutput.log', filemode='w', level=logging.DEBUG)

    logging.info("config_file = {0}".format(args.config_file))

    if not os.path.exists(args.config_file):
        raise Exception("Invalid cli jobs config file '{0}' given!".format(args.config_file))

    with open(args.config_file) as file:
        cli_jobs_config = json.loads(file.read())

    cli = BackendCli(cli_jobs_config)
    cli.run()