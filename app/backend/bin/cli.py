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
import uuid
import datetime
import tempfile
import subprocess
import shlex
import argparse

from databases.dynamo_db import DynamoDB
import tasks
from tasks import *

from common.config import CeleryConfig, JobTypes, JobDatabaseConfig, JobConfig, AgentTypes
import common.helper as helper

import celery
from celery.task.control import inspect


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
    AGENT_TYPE = AgentTypes.FLEX_CLI
    INSTANCE_TYPE = 'flexvm'

    def __init__(self, cli_jobs_config):
        self.machines = cli_jobs_config["machines"]
        self.jobs = cli_jobs_config["jobs"]
        self.output_filename = cli_jobs_config["output_filename"]

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
            self.database = None


    def __wait_for_jobs(self, task_id_job_map, task_ids):
        finished_tasks = []
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
                    finished_tasks.append({'job_index': job_index, 'job_status': task})
                    task_ids.remove(task_id)

        return finished_tasks

    def __submit_job(self, job_index, job):
        logging.info("Preparing for  Job #{0}...".format(job_index))
        with open(job['model_file_path']) as xml_file:
            model_xml_doc = xml_file.read()

        params = job["params"]
        params['document'] = model_xml_doc
        params['bucketname'] = self.output_store_info['bucket_name']

        task_id = str(uuid.uuid4())

        result = helper.execute_cloud_task(params=params,
                                           agent_type=self.AGENT_TYPE,
                                           access_key=self.aws_credentials["AWS_ACCESS_KEY_ID"],
                                           secret_key=self.aws_credentials["AWS_SECRET_ACCESS_KEY"],
                                           task_id=task_id,
                                           instance_type=self.INSTANCE_TYPE,
                                           cost_replay=False,
                                           database=self.database)
        if result["success"]:
            logging.info("Job #{0} successfully ubmitted to backend.".format(job_index))
        else:
            logging.info("Failed to submit Job #{0} to backend.".format(job_index))
        logging.debug("result = {0}".format(pprint.pformat(result)))
        return result

    def __launch_jobs(self):
        task_ids = []
        task_id_job_map = {}
        for job_index, job in enumerate(self.jobs):
            result = self.__submit_job(job_index, job)

            task_id = result["db_id"]
            task_ids.append(task_id)
            task_id_job_map[task_id] = job_index

        return task_id_job_map, task_ids

    def run(self):
        self.database.createtable(self.job_status_db_store_info['table_name'])

        if self.prepare_machines():
            task_id_job_map, task_ids = self.__launch_jobs()
            finished_tasks = self.__wait_for_jobs(task_id_job_map, task_ids)

            with open(self.output_filename, 'w') as f:
                f.write(pprint.pformat(finished_tasks))

            logging.info('All jobs finished!')

        else:
            logging.error("Failed to prepare machines!")

    def __get_preparing_commands(self):
        # These are commutative commands

        commands = []
        commands.append('#!/bin/bash')

        commands.append(
            'echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc'.format(str(self.aws_credentials['AWS_ACCESS_KEY_ID'])))
        commands.append(
            'echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))

        commands.append('echo export STOCHKIT_HOME={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/StochKit/"))
        commands.append('echo export STOCHKIT_ODE={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/ode/"))

        commands.append('echo export C_FORCE_ROOT=1 >> ~/.bashrc')
        commands.append('echo export R_LIBS={0} >> ~/.bashrc'.format("/home/ubuntu/stochss/stochoptim/library"))

        commands.append('source ~/.bashrc')

        return commands

    def __configure_celery(self, queue_head):
        commands = []
        commands.append('source ~/.bashrc')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(str(self.aws_credentials['AWS_ACCESS_KEY_ID'])))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(str(self.aws_credentials['AWS_SECRET_ACCESS_KEY'])))

        for machine in self.machines:
            logging.info("Starting celery on {ip}".format(ip=machine["public_ip"]))
            success = helper.start_celery_on_vm(instance_type=self.INSTANCE_TYPE,
                                                ip=machine["public_ip"],
                                                username=machine["username"],
                                                key_file=machine["keyfile"],
                                                prepend_commands=commands,
                                                agent_type=self.AGENT_TYPE)
            if success != 0:
                raise Exception("Failure to start celery on {0}".format(machine["public_ip"]))

        # get all intstance types and configure the celeryconfig.py locally
        instance_types = [self.INSTANCE_TYPE]
        helper.config_celery_queues(agent_type=self.AGENT_TYPE, instance_types=instance_types)

    def __get_queue_head_machine_info(self):
        queue_head = None
        for machine in self.machines:
            if machine["type"] == "queue-head":
                if queue_head is not None:
                    raise InvalidConfigurationError("There can be only one queue head!")
                else:
                    queue_head = machine
            elif machine["type"] == "worker":
                pass
            else:
                raise InvalidConfigurationError("Invalid machine type : {0} !".format(machine["type"]))

        if queue_head == None:
            raise InvalidConfigurationError("Need at least one queue head!")

        return queue_head

    def __run_prepare_script_on_vm(self, machine):
        run_script_commands = [
            "chmod +x ~/setup_script.sh",
            "bash ~/setup_script.sh"
        ]

        run_script_command = ";".join(run_script_commands)
        remote_command = "ssh -o 'UserKnownHostsFile=/dev/null' -o 'StrictHostKeyChecking=no' -i {key_file} {user}@{ip} \"{cmd}\"".format(
            key_file=machine["keyfile"],
            user=machine["username"],
            ip=machine["public_ip"],
            cmd=run_script_command)

        logging.info("Remote command: {0}".format(run_script_command))

        success = os.system(remote_command)
        return success

    def __copy_prepare_script_to_vm(self, machine):
        script_commands = self.__get_preparing_commands()

        if machine['type'] == 'queue-head':
            rabbitmq_commands = []
            rabbitmq_commands.append('sudo rabbitmqctl add_user stochss ucsb')
            rabbitmq_commands.append(
                'sudo rabbitmqctl set_permissions -p / stochss ".*" ".*" ".*"')

            logging.info("Adding RabbitMQ commands for {0}...".format(machine['public_ip']))
            script_command_string = '\n'.join(script_commands + rabbitmq_commands)

        else:
            script_command_string = '\n'.join(script_commands)

        logging.debug("command = \n{0}".format(script_command_string))

        bash_script_filename = os.path.abspath(os.path.join(os.path.dirname(__file__), "setup_script.sh"))
        with open(bash_script_filename, 'w') as file:
            file.write(script_command_string)

        logging.debug("script =\n\n{0}\n\n".format(script_command_string))
        remote_copy_command = \
            "scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {key_file} {bash_script_filename} {user}@{ip}:~/setup_script.sh".format(
                key_file=machine["keyfile"],
                user=machine["username"],
                ip=machine["public_ip"],
                bash_script_filename=bash_script_filename)

        logging.info("Remote copy command: {0}".format(remote_copy_command))

        success = os.system(remote_copy_command)
        return success

    def prepare_machines(self):
        logging.info("prepare_machines: inside method with machine_info : \n%s", pprint.pformat(self.machines))

        queue_head = self.__get_queue_head_machine_info()

        # push queue head to be the first node to be prepared
        self.machines.remove(queue_head)
        self.machines.insert(0, queue_head)

        logging.info("queue head = \n{0}".format(pprint.pformat(queue_head)))

        try:
            logging.info("Preparing environment on remote machines...")
            for machine in self.machines:
                logging.info("For machine {ip}".format(ip=machine['public_ip']))

                success = self.__copy_prepare_script_to_vm(machine)

                if success != 0:
                    raise Exception("Remote copy command failed on {ip}!".format(ip=machine['public_ip']))

                success = self.__run_prepare_script_on_vm(machine)

                if success != 0:
                    raise Exception("Remote command failed on {ip}!".format(ip=machine['public_ip']))

            helper.update_celery_config_with_queue_head_ip(queue_head_ip=queue_head["public_ip"],
                                                           agent_type=self.AGENT_TYPE)
            logging.info("Updated celery config with queue head ip: {0}".format(queue_head["public_ip"]))

            self.__configure_celery(queue_head)

            return True

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_machines : exiting method with error : {0}".format(str(e)))
            return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="StochSS Command Line Interface (CLI) for running Batched StochSS Jobs \
                                                  on cloud virtual machines.")
    parser.add_argument('-s', '--settings',
                        help="Job/Configuration Settings File for setting up machine info, job info, etc. \
                              For more info, visit http://www.stochss.org/ \
                              (Default: $STOCHSS/app/backend/conf/cli_jobs_config.json)",
                        action="store", dest="config_file",
                        default=os.path.join(os.path.dirname(__file__), "..", "conf", "cli_jobs_config.json"))
    parser.add_argument('-l', '--loglevel', help="Log level (eg. debug, info, error)",
                        action="store", dest="log_level", default="info")
    parser.add_argument('-o', '--output', help="Output file containing job output info. \
                                               (Default: ./stochss_cli_job_output.json)",
                        action="store", dest="output_filename", default="./stochss_cli_job_output.json")

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

    cli_jobs_config['output_filename'] = args.output_filename
    cli = BackendCli(cli_jobs_config)
    cli.run()