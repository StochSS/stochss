import os
import sys
import logging
import datetime
import uuid
import traceback
import time
import shlex
import subprocess
import pprint
import celery
from celery.task.control import inspect
from datetime import datetime

from common.config import CeleryConfig, JobDatabaseConfig, JobTypes, AgentTypes
import tasks

def execute_cloud_cost_analysis_task(params, agent, instance_type, task_id, database,
                                     access_key, secret_key, start_time,
                                     celery_queue_name, celery_routing_key):
    result = {}
    result["db_id"] = task_id

    params["db_table"] = JobDatabaseConfig.TABLE_NAME

    data = {}
    data['status'] = "pending"
    data['start_time'] = start_time.strftime('%Y-%m-%d %H:%M:%S')
    data['message'] = "Task sent to Cloud"
    data['agent'] = agent
    data['instance_type'] = instance_type
    data['uuid'] = task_id
    taskid_prefix = '{0}_{1}_'.format(agent, instance_type)

    database.updateEntry(taskid_prefix + task_id, data, params["db_table"])
    cost_analysis_task = tasks.task.apply_async(args=[task_id, params, database, access_key, secret_key, taskid_prefix],
                                 queue=celery_queue_name, routing_key=celery_routing_key)
    logging.info(cost_analysis_task.ready())

    result["celery_pid"] = cost_analysis_task.id
    logging.info("execute_cloud_cost_analysis_task: result of task : %s", str(cost_analysis_task.id))

    result["success"] = True

    return result

def get_celery_worker_status():
    # ###############################################################################
    # The master task can run on any node...
    # TODO: master task might need to run on node with at least 2 cores...
    # launch_params["instance_type"] = "c3.large"
    # launch_params["num_vms"] = 1
    ################################################################################

    celery_info = tasks.CelerySingleton().app.control.inspect()

    # How many active workers are there?
    active_workers = celery_info.active()
    logging.info("All active workers: {0}".format(active_workers))

    # We will keep around a dictionary of the available workers, where the key will be the workers name and the value
    # will be how many cores that worker has (i.e. how many tasks they can execute concurrently).
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
    logging.info("All available workers: {0}".format(available_workers))

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

    return core_count, available_workers

def execute_cloud_stochoptim_task(params, data, database, task_id, celery_queue_name, celery_routing_key):
    result = {}
    result["db_id"] = task_id
    queue_name = task_id
    result["queue"] = queue_name
    data["queue"] = queue_name

    # How many cores?
    requested_cores = -1
    if "cores" in params:
        requested_cores = int(params["cores"])

    core_count, available_workers = get_celery_worker_status()

    if core_count <= 0:
        # Then theres only one worker available
        return {
            "success": False,
            "reason": "You need to have at least two workers in order to run a parameter estimation job in the cloud."
        }

    logging.info("Found {0} cores that can be used as slaves on the following workers: {1}".format(core_count,
                                                                                                   available_workers))

    if requested_cores == -1:
        params["paramstring"] += " --cores {0}".format(core_count)
        # Now just use all available cores since the user didn't request
        # a specific amount, i.e. re-route active workers to the new queue
        worker_names = []
        for worker_name in available_workers:
            worker_names.append(worker_name)

        logging.info("Rerouting all available workers: {0} to queue: {1}".format(worker_names, queue_name))
        tasks.rerouteWorkers(worker_names, queue_name)

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
        logging.info("Rerouting workers: from queue {0} to queue: {1}".format(worker_names, queue_name))
        tasks.rerouteWorkers(worker_names, queue_name)

    # Update DB entry just before sending to worker
    database.updateEntry(task_id, data, JobDatabaseConfig.TABLE_NAME)
    params["queue"] = queue_name
    stochss_task = tasks.master_task.apply_async(args=[task_id, params, database],
                                                 queue=celery_queue_name,
                                                 routing_key=celery_routing_key)
    # TODO: This should really be done as a background_thread as soon as the task is sent
    #      to a worker, but this would require an update to GAE SDK.
    # call the poll task process
    poll_task_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "poll_task.py")

    logging.info("Task sent to cloud with celery id {0}...".format(stochss_task.id))
    poll_task_string = "python {0} {1} {2}".format(poll_task_path, stochss_task.id, queue_name)

    try:
        p = subprocess.Popen(shlex.split(poll_task_string))
        result["poll_process_pid"] = p.pid
    except Exception as e:
        logging.error("Caught exception {0}".format(e))

    result["celery_pid"] = stochss_task.id
    result["success"] = True

    return result


def check_broker_status():
    sleep_time = 5
    total_wait_time = 15
    total_tries = total_wait_time / sleep_time
    current_try = 0

    logging.info("About to check broker at: {0}".format(celery.current_app.conf['BROKER_URL']))

    while True:
        try:
            inspect().stats()

        except IOError as e:
            current_try += 1

            logging.info("Broker down, try: {0}, exception: {1}".format(current_try, e))
            if current_try >= total_tries:
                logging.info("Broker unreachable for {0} seconds.".format(total_wait_time))
                return False, e, traceback.format_exc()

            time.sleep(sleep_time)
            continue

        logging.info("Broker {0} up!".format(celery.current_app.conf['BROKER_URL']))
        break

    return True, None, None


def execute_cloud_task(params, agent, access_key, secret_key, task_id,
                       instance_type, cost_replay, database):
    '''
    This method instantiates celery tasks in the cloud.
    Returns return value from celery async call and the task ID
    '''
    logging.debug('execute_cloud_task: Params - %s', str(pprint.pformat(params)))

    import tasks
    from tasks import task


    celery_config = tasks.CelerySingleton()
    celery_config.configure()
    celery_config.printCeleryQueue()

    celery_queue_name = CeleryConfig.get_queue_name("ec2", instance_type)
    # celery_exchange = CeleryConfig.get_exchange_name("ec2", instance_type)
    celery_routing_key = CeleryConfig.get_routing_key_name("ec2", instance_type)

    logging.info('Deliver the task to the queue: {0}, routing key: {1}'.format(celery_queue_name, celery_routing_key))

    try:
        # Need to make sure that the queue is actually reachable because
        # we don't want the user to try to submit a task and have it
        # timeout because the broker server isn't up yet.
        is_broker_up, exc, trace = check_broker_status()
        if is_broker_up == False:
            return {
                "success": False,
                "reason": "Cloud instances unavailable. Please wait a minute for their initialization to complete.",
                "exception": str(exc),
                "traceback": trace
            }

        #create a celery task
        logging.info("execute_cloud_task : executing task with uuid : %s ", task_id)

        start_time = datetime.now()
        data = {
            'status': "pending",
            "start_time": start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'Message': "Task sent to Cloud",
            'uuid': task_id
        }

        if params["job_type"] == JobTypes.STOCHOPTIM:
            result = execute_cloud_stochoptim_task(params=params, data=data,
                                                   database=database, task_id=task_id,
                                                   celery_queue_name=celery_queue_name,
                                                   celery_routing_key=celery_routing_key)

        else:
            # if this is the cost analysis and agent is ec2 replay then update the stochss-cost-analysis table
            if cost_replay and agent == AgentTypes.EC2:
                result = execute_cloud_cost_analysis_task(params=params, agent=agent, instance_type=instance_type,
                                                          task_id=task_id, database=database, access_key=access_key,
                                                          secret_key=secret_key, start_time=start_time,
                                                          celery_queue_name=celery_queue_name,
                                                          celery_routing_key=celery_routing_key)
            else:
                result = {}
                result["db_id"] = task_id

                params["db_table"] = JobDatabaseConfig.TABLE_NAME
                database.updateEntry(task_id, data, params["db_table"])

                tmp = tasks.task.apply_async(args=[task_id, params, database, access_key, secret_key],
                                             queue=celery_queue_name, routing_key=celery_routing_key)
                logging.info(tmp.ready())
                result["celery_pid"] = tmp.id

                logging.info("execute_cloud_task: result of task : %s", str(tmp.id))
                result["success"] = True

        return result

    except Exception, e:
        trace = traceback.format_exc()
        logging.error("execute_cloud_task : error = %s", str(e))
        logging.error(trace)

        return {
            "success": False,
            "reason": str(e),
            "exception": str(e),
            "traceback": trace
        }