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

import celery
from celery.task.control import inspect


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

        result = {}
        try:
            #This is a celery task in tasks.py: @celery.task(name='stochss')

            # Need to make sure that the queue is actually reachable because
            # we don't want the user to try to submit a task and have it
            # timeout because the broker server isn't up yet.
            sleep_time = 5
            total_wait_time = 15
            total_tries = total_wait_time / sleep_time
            current_try = 0

            logging.info("About to check broker at: {0}".format(celery.current_app.conf['BROKER_URL']))

            while True:
                try:
                    insp = inspect().stats()
                except IOError as e:
                    current_try += 1
                    logging.info("Broker down, try: {0}, exception: {1}".format(current_try, e))
                    if current_try >= total_tries:
                        logging.info("Broker unreachable for {0} seconds.".format(total_wait_time))
                        return {
                            "success": False,
                            "reason": "Cloud instances unavailable. Please wait a minute for their initialization to complete.",
                            "exception": str(e),
                            "traceback": traceback.format_exc()
                        }
                    time.sleep(sleep_time)
                    continue
                logging.info("Broker up")
                break

            # if there is no taskid explicit, create one the first run
            if not task_id:
                task_id = str(uuid.uuid4())

            result["db_id"] = task_id
            #create a celery task
            logging.info("execute_cloud_task : executing task with uuid : %s ", task_id)
            timenow = datetime.now()
            data = {
                'status': "pending",
                "start_time": timenow.strftime('%Y-%m-%d %H:%M:%S'),
                'Message': "Task sent to Cloud",
                'uuid': task_id
            }

            tmp = None
            if params["job_type"] == "mcem2":
                queue_name = task_id
                result["queue"] = queue_name
                data["queue"] = queue_name
                # How many cores?
                requested_cores = -1
                if "cores" in params:
                    requested_cores = int(params["cores"])

                ##################################################################################################################
                # The master task can run on any node...
                #TODO: master task might need to run on node with at least 2 cores...
                # launch_params["instance_type"] = "c3.large"
                # launch_params["num_vms"] = 1
                ##################################################################################################################

                celery_info = CelerySingleton().app.control.inspect()
                # How many active workers are there?
                active_workers = celery_info.active()
                # We will keep around a dictionary of the available workers, where
                # the key will be the workers name and the value will be how many
                # cores that worker has (i.e. how many tasks they can execute
                # concurrently).
                available_workers = {}
                core_count = 0
                if active_workers:
                    for worker_name in active_workers:
                        # active_workers[worker_name] will be a list of dictionaries representing
                        # tasks that the worker is currently executing, so if it doesn't exist
                        # then the worker isn't busy
                        if not active_workers[worker_name]:
                            available_workers[worker_name] = celery_info.stats()[worker_name]['pool']['max-concurrency']
                            core_count += int(available_workers[worker_name])
                logging.info("All available workers:".format(available_workers))
                # We assume that at least one worker is already consuming from the main queue
                # so we just need to find that one worker and remove it from the list, since
                # we need one worker on the main queue for the master task.
                done = False
                for worker_name in available_workers:
                    worker_queues = celery_info.active_queues()[worker_name]
                    for queue in worker_queues:
                        if queue["name"] == "celery":
                            popped_cores = int(available_workers.pop(worker_name))
                            done = True
                            core_count -= popped_cores
                            break
                    if done:
                        break
                if core_count <= 0:
                    # Then theres only one worker available
                    return {
                        "success": False,
                        "reason": "You need to have at least two workers in order to run a parameter estimation job in the cloud."
                    }
                logging.info("Found {0} cores that can be used as slaves on the following workers: {1}".format(
                    core_count,
                    available_workers
                ))
                if requested_cores == -1:
                    params["paramstring"] += " --cores {0}".format(core_count)
                    # Now just use all available cores since the user didn't request
                    # a specific amount, i.e. re-route active workers to the new queue
                    worker_names = []
                    for worker_name in available_workers:
                        worker_names.append(worker_name)
                    logging.info("Rerouting all available workers: {0} to queue: {1}".format(worker_names, queue_name))
                    rerouteWorkers(worker_names, queue_name)
                else:
                    params["paramstring"] += " --cores {0}".format(requested_cores)
                    # Now loop through available workers and see if we have enough free to meet
                    # requested core count.
                    worker_names = []
                    unmatched_cores = requested_cores
                    if available_workers:
                        for worker_name in available_workers:
                            # We need to find out what the concurrency of the worker is.
                            worker_cores = available_workers[worker_name]
                            # Subtract this from our running count and save the workers name
                            unmatched_cores -= worker_cores
                            worker_names.append(worker_name)
                            if unmatched_cores <= 0:
                                # Then we have enough
                                break
                    # Did we get enough?
                    if unmatched_cores > 0:
                        # Nope...
                        return {
                            "success": False,
                            "reason": "Didn't find enough idle cores to meet requested core count of {0}. Still need {1} more.".format(
                                requested_cores,
                                unmatched_cores
                            )
                        }
                    logging.info("Found enough idle cores to meet requested core count of {0}".format(requested_cores))
                    # We have enough, re-route active workers to the new queue
                    logging.info("Rerouting workers: {0} to queue: {1}".format(worker_names, queue_name))
                    rerouteWorkers(worker_names, queue_name)

                # Update DB entry just before sending to worker
                database.updateEntry(task_id, data, self.job_status_db_store_info['table_name'])
                params["queue"] = queue_name
                tmp = master_task.delay(task_id, params, database)
                #TODO: This should really be done as a background_thread as soon as the task is sent
                #      to a worker, but this would require an update to GAE SDK.
                # call the poll task process
                poll_task_path = os.path.join(
                    os.path.dirname(os.path.abspath(__file__)),
                    "poll_task.py"
                )
                logging.info("Task sent to cloud with celery id {0}...".format(tmp.id))
                poll_task_string = "python {0} {1} {2} > poll_task_{1}.log 2>&1".format(
                    poll_task_path,
                    tmp.id,
                    queue_name
                )
                p = subprocess.Popen(shlex.split(poll_task_string))
                result["celery_pid"] = tmp.id

            # for all other jobs
            else:
                if instance_type:
                    queue_ins_name = "_" + instance_type.replace(".", "")
                else:
                    queue_ins_name = ""

                logging.info("queue_ins_name = {0}".format(queue_ins_name))

                celery_config = tasks.CelerySingleton()
                celery_config.configure()
                celery_config.printCeleryQueue()
                celery_queue_name = CELERY_QUEUE_FLEX + "" + queue_ins_name
                celery_exchange = CELERY_EXCHANGE_FLEX
                celery_routing_key = CELERY_ROUTING_KEY_FLEX + "" + queue_ins_name
                logging.info('Deliver the task to the queue: {0}, routing key: {1}'.format(celery_queue_name,
                                                                                           celery_routing_key))
                #celery async task execution http://ask.github.io/celery/userguide/executing.html

                # if this is the cost analysis replay then update the stochss-cost-analysis table
                if cost_replay:
                    raise NotImplementedError
                else:
                    params["db_table"] = self.job_status_db_store_info['table_name']
                    database.updateEntry(task_id, data, params["db_table"])
                    tmp = tasks.task.apply_async(args=[task_id, params, database, access_key, secret_key],
                                                 queue=celery_queue_name, routing_key=celery_routing_key)
                    # delay(taskid, params, access_key, secret_key)  #calls task(taskid,params,access_key,secret_key)
                #                 logging.info('RESULT OF TASK: {0}'.format(tmp.get()))
                print tmp.ready()
                result["celery_pid"] = tmp.id

            logging.info("execute_cloud_task:  result of task : %s", str(tmp.id))
            result["success"] = True
            return result

        except Exception, e:
            logging.error("execute_cloud_task: error - %s", str(e))
            traceback.print_exc()
            return {
                "success": False,
                "reason": str(e),
                "exception": str(e),
                "traceback": traceback.format_exc()
            }


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

    def is_queue_broker_up(self):
        """
            Check if Celery Broker is up
            :return: is_broker_up, exception, traceback_str
        """
        sleep_time = 5
        total_wait_time = 15
        total_tries = total_wait_time / sleep_time

        current_try = 0
        broker_url = celery.current_app.conf['BROKER_URL']
        logging.info("About to check broker at: {0}".format(broker_url))

        while True:
            try:
                inspection_stats = inspect().stats()

            except IOError as e:
                current_try += 1
                logging.info("Broker down, try: {0}, exception: {1}".format(current_try, e))

                if current_try >= total_tries:
                    logging.info("Broker unreachable for {0} seconds.".format(total_wait_time))
                    return False, e, traceback.format_exc()

                time.sleep(sleep_time)
                continue

            logging.info("Broker is up!")
            break

        return True, None, None

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

            self.config_celery_queues(CELERY_EXCHANGE_FLEX, CELERY_QUEUE_FLEX, CELERY_ROUTING_KEY_FLEX, instance_types)

            return {"success": True}

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_machines : exiting method with error : {0}".format(str(e)))
            return None


    def __start_celery_on_machine_via_ssh(self, user, ip, key_file_path):
        # sudo export PYTHONPATH=/home/ubuntu:/home/ubuntu/pyurdme:/home/ubuntu/stochss/app:/home/ubuntu/stochss/app/backend:/home/ubuntu/stochss/app/lib/cloudtracker;export AWS_ACCESS_KEY_ID=**********;export AWS_SECRET_ACCESS_KEY=********;celery -A tasks worker -Q queue_stochss_flex,queue_stochss_flex_flexvm --autoreload --loglevel=debug --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1'

        commands = []
        commands.append('source /home/ubuntu/.bashrc')
        commands.append(
            'export PYTHONPATH=/home/ubuntu:/home/ubuntu/pyurdme:/home/ubuntu/stochss/app:/home/ubuntu/stochss/app/backend:/home/ubuntu/stochss/app/lib/cloudtracker')
        commands.append('export AWS_ACCESS_KEY_ID={0}'.format(self.aws_credentials['AWS_ACCESS_KEY_ID']))
        commands.append('export AWS_SECRET_ACCESS_KEY={0}'.format(self.aws_credentials['AWS_SECRET_ACCESS_KEY']))
        commands.append(
            "celery -A tasks worker -Q " + CELERY_QUEUE_FLEX + "," \
            + CELERY_QUEUE_FLEX + "_" + self.INSTANCE_TYPE.replace(".", "") \
            + " --autoreload --loglevel=debug --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1")

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