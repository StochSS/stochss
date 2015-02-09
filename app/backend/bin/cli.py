#!/usr/bin/env python

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'boto'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'celery'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'kombu'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'amqp'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib', 'billiard'))

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
import boto
from boto.exception import S3CreateError
import uuid
import threading

from databases.dynamo_db import DynamoDB
import tasks
from tasks import *

from common.config import CeleryConfig, JobTypes, JobDatabaseConfig, JobConfig, AgentTypes, AWSConfig
import common.helper as helper

import celery
from celery.task.control import inspect


def get_aws_credentials():
    if os.environ.has_key("AWS_ACCESS_KEY_ID") and os.environ.has_key("AWS_SECRET_ACCESS_KEY"):
        return {'AWS_ACCESS_KEY_ID': os.environ["AWS_ACCESS_KEY_ID"],
            'AWS_SECRET_ACCESS_KEY': os.environ["AWS_SECRET_ACCESS_KEY"]}
    elif os.environ.has_key("AWS_ACCESS_KEY") and os.environ.has_key("AWS_SECRET_KEY"):
        return {'AWS_ACCESS_KEY_ID': os.environ["AWS_ACCESS_KEY"],
            'AWS_SECRET_ACCESS_KEY': os.environ["AWS_SECRET_KEY"]}

    raise Exception("Environment variables AWS_ACCESS_KEY_ID/AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY/AWS_SECRET_KEY are not set!")


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

        if self.output_store_info["type"] == "amazon_s3":
            trial = 0
            s3helper = S3Helper()
            while trial < 5:
                s3_uuid = uuid.uuid4()
                self.output_store_info['bucket_name'] = "{0}-{1}".format(self.output_store_info['bucket_name_prefix'],
                                                                         s3_uuid)
                if s3helper.make_s3_bucket(self.output_store_info['bucket_name_prefix']):
                    logging.info('bucket name = {0}'.format(self.output_store_info['bucket_name']))
                    break
                else:
                    self.output_store_info['bucket_name'] = None
                trial += 1

            if self.output_store_info['bucket_name'] == None:
                logging.error("Could not create S3 bucket!")
                sys.exit(0)
        else:
            raise NotImplementedError("Only Amazon S3 is supported!")


        self.job_status_db_store_info = cli_jobs_config["job_status_db_store"]

        if self.job_status_db_store_info["type"] == "amazon_dynamodb":
            self.database = DynamoDB(secret_key=self.aws_credentials["AWS_SECRET_ACCESS_KEY"],
                                     access_key=self.aws_credentials["AWS_ACCESS_KEY_ID"])
        else:
            raise NotImplementedError("Only Amazon Dynamo DB is supported!")


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
            logging.info("Job #{0} successfully submitted to backend.".format(job_index))
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

class ShellCommandException(Exception):
    pass

class ShellCommand(object):
    def __init__(self, cmd, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr, verbose=False):
        self.cmd = cmd
        self.stdin = stdin
        self.stdout = stdout
        self.stderr = stderr
        self.process = None
        self.verbose = verbose

    def run(self, timeout=None, silent=True):
        def target():
            if self.verbose: print 'Running... $', self.cmd
            self.process = subprocess.Popen(self.cmd,
                                            stdin=self.stdin,
                                            stdout=self.stdout,
                                            stderr=self.stderr,
                                            shell=True)
            self.process.communicate()
            if self.verbose: print 'End of cmd $', self.cmd

        thread = threading.Thread(target=target)
        thread.start()

        if timeout is not None:
            thread.join(timeout)
            if thread.is_alive():
                if silent is False:
                    print 'Terminating process due to timeout...'
                self.process.terminate()
                thread.join()
                if silent is False:
                    print 'Process return code =', self.process.returncode
        else:
            thread.join()
            if self.process.returncode != 0:
                raise ShellCommandException("return code = {0}".format(self.process.returncode))


class S3Helper(object):
    def __init__(self):
        self.s3_connection = self.__create_s3_connection()

    def __create_s3_connection(self):
        if os.environ.has_key('AWS_ACCESS_KEY'):
            aws_access_key = os.environ['AWS_ACCESS_KEY']
        else:
            aws_access_key = raw_input("Please enter your AWS access key: ")

        if os.environ.has_key('AWS_SECRET_KEY'):
            aws_secret_key = os.environ['AWS_SECRET_KEY']
        else:
            aws_secret_key = raw_input("Please enter your AWS secret key: ")

        return boto.connect_s3(aws_access_key_id=aws_access_key,
                               aws_secret_access_key=aws_secret_key)

    def make_s3_bucket(self, bucket_name):
        try:
            self.s3_connection.create_bucket(bucket_name)

        except S3CreateError:
            traceback.print_exc()
            return False

        bucket = self.s3_connection.get_bucket(bucket_name)
        bucket.set_acl('public-read')
        return True

class EC2Helper(object):
    NUM_SSH_TRIALS = 15
    KEY_PREFIX = "stochss_cli_kp"

    def __init__(self):
        self.ec2_connection = self.__create_ec2_connection()

    def __create_ec2_connection(self, aws_region='us-east-1'):
        if os.environ.has_key('AWS_ACCESS_KEY'):
            aws_access_key = os.environ['AWS_ACCESS_KEY']
        else:
            aws_access_key = raw_input("Please enter your AWS access key: ")

        if os.environ.has_key('AWS_SECRET_KEY'):
            aws_secret_key = os.environ['AWS_SECRET_KEY']
        else:
            aws_secret_key = raw_input("Please enter your AWS secret key: ")

        return boto.ec2.connect_to_region(region_name=aws_region,
                                          aws_access_key_id=aws_access_key,
                                          aws_secret_access_key=aws_secret_key)

    def launch_instance(self, ami_id, instance_type):
        ec2_uuid = uuid.uuid4()
        key_name = "{0}_{1}".format(self.KEY_PREFIX, ec2_uuid)
        key_pair = self.ec2_connection.create_key_pair(key_name)

        current_dir = os.path.dirname(os.path.abspath(__file__))
        key_pair.save(current_dir)

        key_file = os.path.join(current_dir, "{0}.pem".format(key_name))

        if os.path.exists(key_file):
            print 'Downloaded key file: {0}'.format(key_file)
        else:
            print "Key file: {0} doesn't exist! Exiting.".format(key_file)
            sys.exit(1)

        security_group_name = "stochss_cli_sg_{0}".format(ec2_uuid)
        new_security_group = self.ec2_connection.create_security_group(name=security_group_name,
                                                                       description='StochSS CLI')

        new_security_group.authorize('tcp', 22, 22, '0.0.0.0/0')
        new_security_group.authorize('tcp', 5672, 5672, '0.0.0.0/0')
        new_security_group.authorize('tcp', 6379, 6379, '0.0.0.0/0')
        new_security_group.authorize('tcp', 11211, 11211, '0.0.0.0/0')
        new_security_group.authorize('tcp', 55672, 55672, '0.0.0.0/0')

        print "Security group {0} successfully created with appropriate permissions.".format(new_security_group.name)

        security_groups = [new_security_group.name]

        print 'Trying to launch instance... [this might take a while]'
        reservation = self.ec2_connection.run_instances(image_id=ami_id,
                                                        key_name=key_name,
                                                        instance_type=instance_type,
                                                        security_groups=security_groups)

        instance = reservation.instances[0]
        instance_id = instance.id

        while instance.update() != "running":
            time.sleep(5)

        instance_ip = instance.ip_address

        self.__wait_until_successful_ssh(instance_id=instance_id, instance_ip=instance_ip,
                                         key_file=key_file, user="ubuntu")

        print 'Instance successfully running - ip: {0}, id: {1}, base_ami_id = {2}'.format(instance_ip,
                                                                                           instance_id,
                                                                                           ami_id)

        print "Please add the following line to your job config file in the machines section and decide whether it'll be a worker or queue-head in the blank section"
        machine_info = {
            "public_ip": instance_ip,
            "private_ip": instance_ip,
            "username": "ubuntu",
            "keyfile": key_file,
            "type": "___"
        }

        print ',\n'.join(json.dumps(machine_info).split(','))

    def __wait_until_successful_ssh(self, instance_id, instance_ip, user, key_file):
        command = 'echo Instance {0} with ip {1} is up!'.format(instance_id, instance_ip)

        trial = 0
        while trial < self.NUM_SSH_TRIALS:
            time.sleep(5)
            print 'Trying to ssh into {0} #{1} ...'.format(instance_ip, trial + 1)

            try:
                EC2Helper.run_remote_command(user=user, ip=instance_ip, key_file=key_file, command=command)
                print "Instance {0} with ip {1} is up!".format(instance_id, instance_ip)
                break

            except:
                pass

            trial += 1

    def terminate_instances(self):
        reservations = self.ec2_connection.get_all_instances()
        instances = [i for r in reservations for i in r.instances]

        running_cli_instances = []
        for i in instances:
            if i.key_name is not None and i.key_name.startswith(self.KEY_PREFIX) and i.state == 'running':
                running_cli_instances.append(i)

        instance_ids = map(lambda x: x.id, running_cli_instances)
        if instance_ids != []:
            terminated_instances = self.ec2_connection.terminate_instances(instance_ids)
            for instance in terminated_instances:
                print ('Instance {0} was terminated.'.format(instance.id))
        else:
            print 'No StochSS CLI instance running.'

    @staticmethod
    def get_remote_command(user, ip, key_file, command):
        return 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {0} {1}@{2} "{3}"'.format(key_file, user,
                                                                                                         ip, command)

    @staticmethod
    def run_remote_command(user, ip, key_file, command):
        remote_cmd = EC2Helper.get_remote_command(user=user, ip=ip,
                                             key_file=key_file,
                                             command=command)
        shell_cmd = ShellCommand(remote_cmd)
        shell_cmd.run()


def build_arg_parser():
    with open(AWSConfig.EC2_SETTINGS_FILENAME) as f:
        ami_info = json.loads(f.read())
    default_ami_id = ami_info["ami_id"]

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
    parser.add_argument('--ec2-launch', help="Launch EC2 instances",
                        action="store_true", dest="ec2_launch", default=False)
    parser.add_argument('--ec2-type', help="EC2 instance type, used with --ec2-launch. eg. c3.large",
                        action="store", dest="ec2_instance_type", default=None)
    parser.add_argument('--ec2-ami-id', help="EC2 AMI id, Default: {0} used with --ec2-launch".format(default_ami_id),
                        action="store", dest="ec2_ami_id", default=default_ami_id)

    parser.add_argument('--ec2-terminate', help="Terminate previously launched EC2 instances for StochSS CLI",
                        action="store_true", dest="ec2_terminate", default=False)

    return parser


if __name__ == "__main__":
    parser = build_arg_parser()

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

    if args.ec2_launch:
        if args.ec2_ami_id == None or args.ec2_instance_type == None:
            print 'Error: Please provide ec2 ami id and/or ec2 instance type!'
        else:
            ec2helper = EC2Helper()
            print 'Trying to start EC2 instance with ami id = {0}, instance type = {1} ...'.format(args.ec2_ami_id,
                                                                                              args.ec2_instance_type)
            ec2helper.launch_instance(ami_id=args.ec2_ami_id, instance_type=args.ec2_instance_type)

        sys.exit(0)

    if args.ec2_terminate:
        ec2helper = EC2Helper()
        ec2helper.terminate_instances()
        sys.exit(0)

    logging.info("config_file = {0}".format(args.config_file))

    if not os.path.exists(args.config_file):
        raise Exception("Invalid cli jobs config file '{0}' given!".format(args.config_file))

    with open(args.config_file) as file:
        cli_jobs_config = json.loads(file.read())

    cli_jobs_config['output_filename'] = args.output_filename
    cli = BackendCli(cli_jobs_config)
    cli.run()