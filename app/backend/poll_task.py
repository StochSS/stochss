import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/boto'))
from time import sleep
import tasks
import logging
from celery.result import AsyncResult
sys.path.append(os.path.join(os.path.dirname(__file__), '../handlers'))
#sys.path.append(os.path.join(os.path.dirname(__file__), '../../sdk/python/'))
#sys.path.append(os.path.join(os.path.dirname(__file__), '../../sdk/python/lib/'))
#from db_models.stochoptim_job import StochOptimJobWrapper


def poll_task(task_id, queue_name, job_id):
    try:
        sys.stderr.write("poll_task(): Checking Task {0}.\n".format(task_id))
        # Get the Celery app
        celery_app = tasks.CelerySingleton().app
        # Get the task
        result = AsyncResult(task_id)
        # Wait until its ready, checking once/minute
        while not result.ready():
            sys.stderr.write("poll_task(): Task {0} still not done...\n".format(task_id))
            sleep(60)
        sys.stderr.write("poll_task(): Task {0} done.".format(task_id))
    except Exception as e:
        logging.exception(e)
        # Set job status to failed
        #job = StochOptimJobWrapper.get_by_id(job_id)
        #job.status = 'Failed'
        #job.put()

    # Ok its done, need to get the workers now
    worker_names = tasks.get_worker_list_consuming_from_queue(queue_name)
    if worker_names:
        sys.stderr.write("Rerouting workers {0} from {1} back to main queue.\n".format(worker_names, queue_name))
        # If there are still workers consuming from this queue (i.e.
        # they haven't been terminated by the alarms yet), we need
        # to reclaim them.
        tasks.reroute_workers(worker_names, "celery", from_queue=queue_name)
    return True

def print_usage_and_exit():
    sys.stderr.write("Error in command line arguments!\n")
    sys.stderr.write("Expected Usage: ./poll_task.py [task_id] [queue_name] [job_id]\n")
    sys.exit(1)

if __name__ == "__main__":
    argc = len(sys.argv)
    if argc > 3:
        task_id = sys.argv[1]
        queue_name = sys.argv[2]
        job_id = sys.argv[3]
        poll_task(task_id, queue_name, job_id)
    else:
        print_usage_and_exit()
