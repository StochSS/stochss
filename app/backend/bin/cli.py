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
import argparse
import subprocess
import shlex

from databases.dynamo_db import DynamoDB
import tasks
from tasks import *
import common.helper as helper

import celery


CELERY_EXCHANGE_FLEX = "exchange_stochss_flex"
CELERY_QUEUE_FLEX = "queue_stochss_flex"
CELERY_ROUTING_KEY_FLEX = "routing_key_stochss_flex"


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
    AGENT_TYPE = 'flex_cli'
    INSTANCE_TYPE = 'flexvm'

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
                                             agent="flex",
                                             instance_type=self.INSTANCE_TYPE,
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


    def config_celery_queues(self, exchange_name, queue_name, routing_key, ins_types):
        exchange = "exchange = Exchange('" + exchange_name + "', type = 'direct')"

        CELERY_QUEUES = "CELERY_QUEUES = (Queue('" + queue_name + "', exchange, routing_key = '" + routing_key + "'), "
        for ins_type in ins_types:
            celery_queue_name = queue_name + "_" + ins_type.replace(".", "")
            celery_routing_key = routing_key + "_" + ins_type.replace(".", "")
            CELERY_QUEUES = CELERY_QUEUES + "Queue('" + celery_queue_name + "', exchange, routing_key = '" + celery_routing_key + "'), "

        CELERY_QUEUES = CELERY_QUEUES + ")"

        celery_config_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "celeryconfig.py")

        with open(celery_config_filename, 'r') as f:
            lines = f.readlines()

        with open(celery_config_filename, 'w') as f:
            clear_following = False
            for line in lines:
                if clear_following:
                    f.write("")
                elif line.strip().startswith('exchange'):
                    f.write(exchange + "\n")
                elif line.strip().startswith('CELERY_QUEUES'):
                    f.write(CELERY_QUEUES + "\n")
                    clear_following = True
                else:
                    f.write(line)

        # reload the celery configuration
        my_celery = tasks.CelerySingleton()
        my_celery.configure()


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
        # commands.append("set -x")
        # commands.append("exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1")
        # commands.append("touch anand3.txt")
        # commands.append("echo testing logfile")
        # commands.append("echo BEGIN")
        # commands.append("date '+%Y-%m-%d %H:%M:%S'")
        # commands.append("echo END")
        # commands.append("touch anand2.txt")

        # commands.append('export AWS_ACCESS_KEY_ID={0}'.format(self.aws_credentials['AWS_ACCESS_KEY_ID']))
        # commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))

        # commands.append(
        # 'echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc'.format(self.aws_credentials['AWS_ACCESS_KEY_ID']))
        # commands.append(
        # 'echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))

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
        logging.info("queue_head['public_ip'] = {0}".format(queue_head["public_ip"]))
        self.__update_celery_config_with_queue_head_ip(queue_head_ip=queue_head["public_ip"])
        logging.info("Updated celery config with queue head ip: {0}".format(queue_head["public_ip"]))
        for machine in self.machines:
            logging.info("Copying celery config to {ip}".format(ip=machine["public_ip"]))
            self.__copy_celery_config_to_machine(user=machine["username"],
                                                 ip=machine["public_ip"],
                                                 key_file_path=machine["keyfile"])

            logging.info("Starting celery on {ip}".format(ip=machine["public_ip"]))
            self.__start_celery_on_machine_via_ssh(user=machine["username"],
                                                   ip=machine["public_ip"],
                                                   key_file_path=machine["keyfile"])

    def __update_celery_config_with_queue_head_ip(self, queue_head_ip):
        # Write queue_head_ip to file on the appropriate line
        current_dir = os.path.dirname(os.path.abspath(__file__))
        celery_config_filename = os.path.join(current_dir, "celeryconfig.py")
        celery_template_filename = os.path.join(current_dir, "..", "celeryconfig.py.template")

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
        my_celery = tasks.CelerySingleton()
        my_celery.configure()


    def prepare_machines(self):
        logging.info("prepare_machines: inside method with machine_info : \n%s", pprint.pformat(self.machines))

        instance_types = [self.INSTANCE_TYPE]

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

            self.__configure_celery(queue_head)

            helper.config_celery_queues(agent=self.AGENT_TYPE, instance_types=instance_types)

            return {"success": True}

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_machines : exiting method with error : {0}".format(str(e)))
            return None


    def __start_celery_on_machine_via_ssh(self, user, ip, key_file_path):
        # sudo export PYTHONPATH=/home/ubuntu:/home/ubuntu/pyurdme:/home/ubuntu/stochss/app:/home/ubuntu/stochss/app/backend:/home/ubuntu/stochss/app/lib/cloudtracker;export AWS_ACCESS_KEY_ID=AKIAJLESBH6UR3N4TJTA;export AWS_SECRET_ACCESS_KEY=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;celery -A tasks worker -Q queue_stochss_flex,queue_stochss_flex_flexvm --autoreload --loglevel=debug --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1'

        commands = []
        commands.append('source /home/ubuntu/.bashrc')
        commands.append(
            'export PYTHONPATH=/home/ubuntu/stochss:/home/ubuntu/stochss/pyurdme:/home/ubuntu/stochss/app:/home/ubuntu/stochss/app/backend:/home/ubuntu/stochss/app/lib/cloudtracker')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(self.aws_credentials['AWS_ACCESS_KEY_ID']))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))
        commands.append(
            "celery -A tasks worker -Q " + CELERY_QUEUE_FLEX + "," \
            + CELERY_QUEUE_FLEX + "_" + self.INSTANCE_TYPE.replace(".", "") \
            + " --autoreload --loglevel=info --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1")

        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to write to
        # the process' terminal, screen provides this terminal.
        celery_cmd = "sudo screen -d -m bash -c '{0}'\n".format(';'.join(commands))

        logging.info("keyfile = {0}".format(key_file_path))

        if not os.path.exists(key_file_path):
            raise Exception("ssh keyfile file not found: {0}".format(key_file_path))

        command = "ssh -o 'StrictHostKeyChecking no' -i {key_file_path} {user}@{ip} \"{cmd}\"".format(
            key_file_path=key_file_path,
            user=user,
            ip=ip,
            cmd=celery_cmd)
        logging.info(command)
        success = os.system(command)

        if success == 0:
            logging.info("celery started on {0}".format(ip))
        else:
            raise Exception("Failure to start celery on {0}".format(ip))


    def __copy_celery_config_to_machine(self, user, ip, key_file_path):
        logging.info("keyfile = {0}".format(key_file_path))

        if not os.path.exists(key_file_path):
            raise Exception("ssh keyfile file not found: {0}".format(key_file_path))

        celery_config_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "celeryconfig.py")
        logging.debug("celery_config_filename = {0}".format(celery_config_filename))

        if not os.path.exists(celery_config_filename):
            raise Exception("celery config file not found: {0}".format(celery_config_filename))

        cmd = "scp -o 'StrictHostKeyChecking no' -i {key_file_path} {file} {user}@{ip}:celeryconfig.py".format(
            key_file_path=key_file_path,
            file=celery_config_filename,
            user=user,
            ip=ip)
        logging.info(cmd)
        success = os.system(cmd)

        if success == 0:
            logging.info("scp success: {0} transfered to {1}".format(celery_config_filename, ip))
        else:
            raise Exception("scp failure: {0} not transfered to {1}".format(celery_config_filename, ip))


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