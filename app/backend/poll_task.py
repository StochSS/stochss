import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/boto'))
from time import sleep
import tasks
from celery.result import AsyncResult

def poll_task(task_id, queue_name):
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
    # Ok its done, need to get the workers now
    worker_names = tasks.workersConsumingFromQueue(queue_name)
    if worker_names:
        sys.stderr.write("Rerouting workers {0} from {1} back to main queue.\n".format(worker_names, queue_name))
        # If there are still workers consuming from this queue (i.e.
        # they haven't been terminated by the alarms yet), we need
        # to reclaim them.
        tasks.rerouteWorkers(worker_names, "celery", from_queue=queue_name)
    return True

def print_usage_and_exit():
    sys.stderr.write("Error in command line arguments!\n")
    sys.stderr.write("Expected Usage: ./poll_task.py [task_id] [queue_name]\n")
    sys.exit(1)

if __name__ == "__main__":
    argc = len(sys.argv)
    if argc > 2:
        task_id = sys.argv[1]
        queue_name = sys.argv[2]
        poll_task(task_id, queue_name)
    else:
        print_usage_and_exit()
