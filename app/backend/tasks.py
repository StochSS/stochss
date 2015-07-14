import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/celery'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/boto'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/kombu'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/amqp'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/billiard'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/anyjson'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/pytz'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))

from celery import Celery, group

try:
    import celeryconfig

except ImportError:
    with open('{0}/celeryconfig.py.template'.format(os.path.dirname(__file__)), 'r') as fdr:
        with open('{0}/celeryconfig.py'.format(os.path.dirname(__file__)), 'w') as fdw:
            fdw.write(fdr.read())
    import celeryconfig

import shlex
import traceback
import logging
import subprocess
from datetime import datetime
from multiprocessing import Process
import tempfile, time
import signal
import pprint
from cloudtracker import CloudTracker
from common.config import AgentTypes

from kombu import Exchange, Queue
import time


class TaskConfig:
    USERNAME = 'ubuntu'
    STOCHSS_HOME = os.path.join('/','home',USERNAME, 'stochss')
    STOCHKIT_DIR = os.path.join(STOCHSS_HOME, 'StochKit')
    ODE_DIR = os.path.join(STOCHSS_HOME, 'ode')
    STOCHOPTIM_DIR = os.path.join(STOCHSS_HOME, 'stochoptim')
    STOCHOPTIM_R_LIB_DIR = os.path.join(STOCHOPTIM_DIR, 'library')
    SCCPY_PATH = os.path.join(STOCHSS_HOME, 'app', 'backend', 'bin', 'sccpy.py')
    PYURDME_DIR = os.path.join(STOCHSS_HOME, 'pyurdme')
    PYURDME_WRAPPER_PATH = os.path.join(PYURDME_DIR, 'pyurdme_wrapper.py')
    STOCHSS_PID_DIR = '/tmp/stochss_job_pid'
    STOCHSS_PID_FILE_PREFIX = 'pid'
    STOCHSS_COMPLETED_FILE = 'complete'
    SHUTDOWN_MONITOR_POLL_INTERVAL = 600
    SHUTDOWN_MONITOR_IDLE_TIME = 5400 #(90 minutes)


class ShutdownMonitor():
    """ Class to contain the shutdown monitor code. """
    
    def check_if_any_jobs_are_running(self):
        """ Return False if any jobs are currently running. """
        logging.info("check_if_any_jobs_are_running")
        if not os.path.exists(TaskConfig.STOCHSS_PID_DIR):
            os.mkdir(TaskConfig.STOCHSS_PID_DIR)
        for fname in os.listdir(TaskConfig.STOCHSS_PID_DIR):
            if fname.startswith(TaskConfig.STOCHSS_PID_FILE_PREFIX):
                logging.info("found {0}, delaying shutdown".format(fname))
                return False
        return True
    
    def time_since_last_job_ended(self):
        """ Return the number of seconds since the last job ended. """
        last_command_completed_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, TaskConfig.STOCHSS_COMPLETED_FILE)
        if not os.path.exists(last_command_completed_file):
            logging.info("touching file '{0}'".format(last_command_completed_file))
            os.system("touch {0}".format(last_command_completed_file))
        idle_time = time.time() - os.stat(last_command_completed_file).st_mtime
        logging.info("idle_time='{0}'".format(idle_time))
        return idle_time

    def start(self):
        logging.basicConfig(filename='shutdown_monitor.log',level=logging.DEBUG)
        logging.info("="*80)
        logging.info("Starting ShutdownMonitor")

        while True:
            logging.info("="*80)
            logging.info("ShutdownMonitor: checking at: {0}".format(time.asctime(time.localtime(time.time()))))
            if self.check_if_any_jobs_are_running() and self.time_since_last_job_ended() > TaskConfig.SHUTDOWN_MONITOR_IDLE_TIME:
                logging.info("ShutdownMonitor: shutting down computer")
                os.system("sudo shutdown -h now")
            time.sleep(TaskConfig.SHUTDOWN_MONITOR_POLL_INTERVAL)


class CelerySingleton(object):
    """
    Singleton class by Duncan Booth.
    Multiple object variables refer to the same object.
    http://web.archive.org/web/20090619190842/http://www.suttoncourtenay.org.uk/duncan/accu/pythonpatterns.html#singleton-and-the-borg
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = object.__new__(cls)
            cls._instance.app = Celery('tasks')
            # cls.__configure(cls._instance)
        return cls._instance

    def configure(self):
        reload(celeryconfig)
        self.app.config_from_object('celeryconfig')

    def print_celery_queue_config(self):
        print "BROKER_URL = {0}".format(self.app.conf.BROKER_URL)
        print "CELERY_QUEUES = \n{0}".format(pprint.pformat(self.app.conf.CELERY_QUEUES))

# def add_queue(self, queue_name, exchange_name, routing_key):
#         exchange = Exchange(exchange_name, type='direct')
#         if not self.app.conf.CELERY_QUEUES:
#             logging.info('No celery queue is currently existing.Creating CELERY_QUEUES')
#             self.app.conf.CELERY_QUEUES = ()
#         if Queue(queue_name, exchange, routing_key) not in self.app.conf.CELERY_QUEUES:
#             logging.info('{0} queue is not existing.Creating it.'.format(queue_name))
#             self.app.conf.CELERY_QUEUES += (Queue(queue_name, exchange, routing_key),)


celery_config = CelerySingleton()
celery_config.configure()
celery = celery_config.app


def poll_commands(queue_name):
    print "Polling process: just started..."
    package_root = "StochOptim"
    commands_file = os.path.abspath("commands.txt")
    done_token = "done"
    # slave_tasks = []
    all_slave_params = []
    while True:
        # Do this in a loop forever until the master_task terminates this process
        # Check for commands file
        print "Polling process: checking for commands file..."
        while not os.path.exists(commands_file):
            time.sleep(5)
        print "Polling process: found commands file..."
        # Ok it exists, now check the last line
        all_commands = []
        last_line = ""
        print "Polling process: checking for done token..."
        with open(commands_file, 'r') as commands:
            all_commands = [c.strip() for c in commands.readlines()]
            if all_commands:
                last_line = all_commands[-1]
        # We need to wait until all commmands are there
        while last_line != done_token:
            time.sleep(5)
            with open(commands_file, 'r') as commands:
                all_commands = [c.strip() for c in commands.readlines()]
                if all_commands:
                    last_line = all_commands[-1]
        print "Polling process: found done token, re-constructing commands..."
        # Ok we have all the commands now.
        all_commands.remove(done_token)
        # slave_tasks = []
        all_slave_params = []
        for command in all_commands:
            # We need to reconstruct the command for the remote worker.
            # We are going to reconstruct it in place and then just join
            # the segments of the array to create the final string.
            command_segments = command.split(' ')
            # We actually don't need to worry about the full path to the executable being
            # wrong because all instances on the same infrastructure have the exact same
            # directory structure.
            slave_params = {}
            # We do need to worry about all of the input/output files.
            for index, segment in enumerate(command_segments):
                # For input files, we will pass the contents of the file as a key,value pair
                # to the slave in the input parameters map, where the key is just the file name
                # in the command string and the value is the file contents.
                # We need to re-write the contents to file on the slave before calling.
                if segment == "--model":
                    file_name = command_segments[index + 1]
                    with open(file_name, 'r') as file_content:
                        slave_params[file_name] = file_content.read()
                elif segment == "--initial":
                    file_name = command_segments[index + 1]
                    with open(file_name, 'r') as file_content:
                        slave_params[file_name] = file_content.read()
                elif segment == "--final":
                    file_name = command_segments[index + 1]
                    with open(file_name, 'r') as file_content:
                        slave_params[file_name] = file_content.read()
                # For output files, we don't need to do anything really because the slave will deal with
                # making sure they exist on the master after the slave is finished.
                elif segment == "--output":
                    pass
                elif segment == "--stats":
                    pass
            # Now command_segments is the correct execution string (other than the business with the
            # input files), just need to join it.
            execution_string = " ".join(command_segments)
            print "Polling process: command =", execution_string
            slave_params['exec_str'] = execution_string
            # celery_result = slave_task.delay(slave_params, queue=queue_name)
            # slave_tasks.append(celery_result)
            all_slave_params.append(slave_params)
        # Part of Celery's task calling API, calls all tasks at the same time,
        # can retrieve all the results together.
        slave_group = group(
            slave_task.s(slave_params).set(queue=queue_name) for slave_params in all_slave_params
        )()
        print "Polling process: waiting on results from slaves", queue_name
        # all_results will be a list of dictionaries, each with one or two
        # (file name, file content) key-value pairs
        all_results = slave_group.get()
        # Now remove the commands file and wait until all slave_tasks are done
        os.remove(commands_file)
        # Need to write them all to files now
        for result in all_results:
            for key in result:
                fileint, file_name = tempfile.mkstemp(suffix=".RData")
                os.close(fileint)
                with open(file_name, 'w') as file_handle:
                    file_handle.write(result[key])
                print_size_string = "ls -lh {0}".format(file_name)
                print print_size_string
                os.system(print_size_string)
                mv_string = "mv {0} {1}".format(file_name, key)
                print mv_string
                os.system(mv_string)
                # with open(key, 'w') as file_handle:
                #     file_handle.write(result[key])
        # Now we loop back to the start since the actual master executable just polls the
        # file-system and should have all the files it needs now.
        print "Polling process: done writing output files"


def update_output_store(task_id, bucket_name, output_dir, database, storage_agent):
    print "Output update process just started..."
    # Wait 60 seconds initially for some output to build up
    time.sleep(60)
    while True:
        tar_output_str = "tar -zcf {0}.tar {0}".format(output_dir)
        print "S3 update", tar_output_str
        os.system(tar_output_str)

        logging.info('Uploading output...')
        trials = 0
        output_url = None
        while trials < 2 and output_url == None:
            try:
                output_url = storage_agent.upload_file(filename="{dir}.tar".format(dir=output_dir))
            except Exception as e:
                logging.error(traceback.format_exc())
                logging.error('Error in file upload: {}'.format(e))
                time.sleep(60)
            finally:
                trials += 1

        logging.info("output_url = {}".format(output_url))


        # copy_to_s3_str = "python {sccpy} -f {output_dir}.tar --ec2 {bucket_name}".format(sccpy=TaskConfig.SCCPY_PATH,
        #                                                             output_dir=output_dir, bucket_name=bucket_name)
        # print "S3 update", copy_to_s3_str
        # os.system(copy_to_s3_str)

        data = {
            'uuid': task_id,
            'status': 'active',
            'message': 'Task executing in the cloud.',
            'output': output_url
        }
        database.updateEntry(taskid=task_id, data=data, tablename="stochss")

        # Update the output in S3 every 60 seconds...
        time.sleep(60)


def handle_task_success(task_id, data, output_dir, bucket_name, database, storage_agent):
    tar_output_str = "tar -zcf {0}.tar {0}".format(output_dir)
    print tar_output_str
    os.system(tar_output_str)

    logging.info('Uploading output...')
    trials = 0
    output_url = None
    while trials < 2 and output_url == None:
        try:
            output_url = storage_agent.upload_file(filename="{dir}.tar".format(dir=output_dir))
        except Exception as e:
            logging.error(traceback.format_exc())
            logging.error('Error in file upload: {}'.format(e))
            time.sleep(60)
        finally:
            trials += 1

    logging.info("output_url = {}".format(output_url))

    # copy_to_s3_str = "python {sccpy} -f {output_dir}.tar --ec2 {2}".format(sccpy=TaskConfig.SCCPY_PATH,
    #                                                                      output_dir=output_dir, bucket_name=bucket_name)
    # print copy_to_s3_str
    # return_code = os.system(copy_to_s3_str)
    # if return_code != 0:
    #     print "S3 update conflict, waiting 60 seconds for retry..."
    #     time.sleep(60)
    #     return_code = os.system(copy_to_s3_str)
    # print "Return code after S3 retry is {0}".format(return_code)

    cleanup_string = "rm -rf {0} {0}.tar".format(output_dir)
    print cleanup_string
    os.system(cleanup_string)

    data['output'] = output_url
    database.updateEntry(taskid=task_id, data=data, tablename="stochss")


def handle_task_failure(task_id, data, database, storage_agent, output_dir=None, bucket_name=None):
    if output_dir and bucket_name:
        tar_output_str = "tar -zcf {0}.tar {0}".format(output_dir)
        print tar_output_str
        os.system(tar_output_str)

        logging.info('Uploading output...')
        trials = 0
        output_url = None
        while trials < 2 and output_url == None:
            try:
                output_url = storage_agent.upload_file(filename="{dir}.tar".format(dir=output_dir))
            except Exception as e:
                logging.error(traceback.format_exc())
                logging.error('Error in file upload: {}'.format(e))
                time.sleep(60)
            finally:
                trials += 1

        logging.info("output_url = {}".format(output_url))


        # copy_to_s3_str = "python {sccpy} -f {output_dir}.tar --ec2 {bucket_name}".format(sccpy=TaskConfig.SCCPY_PATH,
        #                                                               output_dir=output_dir, bucket_name=bucket_name)
        # print copy_to_s3_str
        # return_code = os.system(copy_to_s3_str)
        #
        # if return_code != 0:
        #     print "S3 update conflict, waiting 60 seconds for retry..."
        #     time.sleep(60)
        #     return_code = os.system(copy_to_s3_str)
        #
        # print "Return code after S3 retry is {0}".format(return_code)

        cleanup_string = "rm -rf {0} {0}".format(output_dir)
        print cleanup_string
        os.system(cleanup_string)

        data['output'] = output_url

    database.updateEntry(taskid=task_id, data=data, tablename="stochss")


@celery.task(name='tasks.master_task')
def master_task(task_id, params, database, storage_agent):
    '''
    This task encapsulates the logic behind the new R program.
    '''
    try:
        print "Master task starting execution..."
        start_time = datetime.now()
        data = {
            'status': 'active',
            'message': 'Task executing in the cloud.'
        }

        database.updateEntry(taskid=task_id, data=data, tablename="stochss")

        result = {
            'uuid': task_id
        }
        try:
            import multiprocessing
            core_count = multiprocessing.cpu_count()
            params["paramstring"] += " --cores {0}".format(core_count)
        except Exception as e:
            logging.exception(e)
        paramstr = params['paramstring']
        output_dir = "output/{0}".format(task_id)
        return_code_file = "output/{0}/return_code".format(task_id)
        create_dir_str = "mkdir -p {0}".format(output_dir)  #output_dir+"/result"
        print create_dir_str
        os.system(create_dir_str)
        # Write files
        model_file_name = "{0}/model-{1}.R".format(output_dir, task_id)
        f = open(model_file_name, 'w')
        f.write(params['model_file'])
        f.close()
        # This file can have different extensions...
        model_data_dict = params['model_data']
        model_data_file_name = "{0}/model-data-{1}.{2}".format(output_dir, task_id, model_data_dict["extension"])
        f = open(model_data_file_name, 'w')
        f.write(model_data_dict['content'])
        f.close()
        # This argument is optional (?)
        final_data_file_name = None
        if 'final_data' in params:
            final_data_dict = params['final_data']
            final_data_file_name = "{0}/final-data-{1}.{2}".format(output_dir, task_id, final_data_dict["extension"])
            f = open(final_data_file_name, 'w')
            f.write(final_data_dict['content'])
            f.close()
        # Start up a new process to poll commands.txt
        poll_process = Process(
            target=poll_commands,
            args=(params["queue"],)
        )
        # Need to start up another process to periodically update stdout
        # and stderr in S3 bucket.
        bucket_name = params["bucketname"]
        update_process = Process(
            target=update_output_store,
            args=(task_id, bucket_name, output_dir, database, storage_agent)
        )
        # Construct execution string and call it
        exec_str = "{0}/{1} --model {2} --data {3}".format(
            TaskConfig.STOCHOPTIM_DIR,
            params["paramstring"],
            model_file_name,
            model_data_file_name
        )
        if final_data_file_name:
            exec_str += " --finalData {0}".format(final_data_file_name)

        stdout = "{0}/stdout".format(output_dir)
        stderr = "{0}/stderr".format(output_dir)
        print "Master: about to call {0}".format(exec_str)
        execution_time = 0

        environ = os.environ.copy()
        if not environ.has_key('R_LIBS'):
            environ['R_LIBS'] = TaskConfig.STOCHOPTIM_R_LIB_DIR

        pid_file = None
        p = None

        with open(stdout, 'w') as stdout_fh:
            with open(stderr, 'w') as stderr_fh:
                execution_start = datetime.now()
                try:
                    p = subprocess.Popen(
                        shlex.split(exec_str),
                        stdout=stdout_fh,
                        stderr=stderr_fh,
                        env=environ
                    )
                    pid = p.pid
                    if not os.path.exists(TaskConfig.STOCHSS_PID_DIR):
                        os.mkdir(TaskConfig.STOCHSS_PID_DIR)
                    # create pid file
                    pid_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, "{0}-{1}".format(TaskConfig.STOCHSS_PID_FILE_PREFIX, pid))
                    logging.info("[Master] creating PID file '{0}'".format(pid_file))
                    with open(pid_file, 'w+') as fd:
                        fd.write(str(pid))
                    poll_process.start()
                    update_process.start()
                    # Handler that should catch the first SIGTERM signal and then kill
                    # off all subprocesses
                    def handler(signum, frame, *args):
                        print 'Caught signal:', signum
                        # try to kill subprocesses off...
                        try:
                            p.terminate()
                            poll_process.terminate()
                            update_process.terminate()
                        except Exception as e:
                            print '******************************************************************'
                            print "Exception:", e
                            print traceback.format_exc()
                            print '******************************************************************'

                    # Register the handler with SIGTERM signal
                    signal.signal(signal.SIGTERM, handler)
                    # Wait on program execution...
                    stdout, stderr = p.communicate() # wait for process to complete
                    return_code = p.wait()
                    if return_code_file is not None:
                        with open(return_code_file, 'w+') as fd:
                            fd.write(str(return_code))
                except Exception as e:
                    logging.error('Error: {}'.format(str(e)))
                    logging.error(traceback.format_exc())

                finally:
                    #clean up pid file
                    logging.info("[Master] deleting PID file '{0}'".format(pid_file))
                    if pid_file != None and os.path.exists(pid_file):
                        os.remove(pid_file)

                    last_command_completed_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, TaskConfig.STOCHSS_COMPLETED_FILE)

                    logging.info("[Master] touching file '{0}'".format(last_command_completed_file))
                    os.system("touch {0}".format(last_command_completed_file))
                
                execution_time = (datetime.now() - execution_start).total_seconds()
                #print "Should be empty:", stdout
                #print "Should be empty:", stderr
                print "Return code:", p.returncode
        # Done
        logging.info("Master: finished execution of executable")

        poll_process.terminate()
        update_process.terminate()
        # 0 means success
        # -15 means SIGTERM, i.e. it was explicitly terminated, most likely
        # by the signal handler defined just above
        if p.returncode not in [0, -15]:
            data = {
                'status': 'failed',
                'message': 'The executable failed with an exit status of {0}.'.format(p.returncode)
            }
            handle_task_failure(task_id=task_id, data=data, database=database, output_dir=output_dir,
                                bucket_name=bucket_name, storage_agent=storage_agent)
            return
        # Else just send final output to S3
        data = {
            'status': 'finished',
            'uuid': task_id,
            'total_time': (datetime.now() - start_time).total_seconds(),
            'execution_time': execution_time
        }
        handle_task_success(task_id=task_id, data=data, output_dir=output_dir,
                            bucket_name=bucket_name, database=database, storage_agent=storage_agent)
    except Exception, e:
        data = {
            'status': 'failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }
        handle_task_failure(task_id=task_id, data=data, database=database, storage_agent=storage_agent)


@celery.task(name='tasks.slave_task')
def slave_task(params):
    '''
    The worker tasks for the R program, only to be called from the master_task.
    '''
    command = params["exec_str"]
    # First, we need to reconstruct the execution string with the
    # input files. We are going to reconstruct it in place and then
    # just join the segments of the array to create the final string.
    command_segments = command.split(' ')
    input_files = []
    output_files = {}
    # First, we need to worry about all of the input/output files.
    for index, segment in enumerate(command_segments):
        # For input files, the value passed is the key to use to retrieve the
        # proper file contents from the input params dictionary. We need to
        # re-write the contents to file and replace file name in command
        # string before calling executable.
        if segment == "--model":
            for file_handle in with_temp_file(input_files):
                file_handle.write(params[command_segments[index + 1]])
            command_segments[index + 1] = input_files[-1]
        elif segment == "--initial":
            for file_handle in with_temp_file(input_files):
                file_handle.write(params[command_segments[index + 1]])
            command_segments[index + 1] = input_files[-1]
        elif segment == "--final":
            for file_handle in with_temp_file(input_files):
                file_handle.write(params[command_segments[index + 1]])
            command_segments[index + 1] = input_files[-1]
        # For output files, we need to store the name that the master is expecting and
        # then replace it with a new temp file name
        elif segment == "--output":
            output_files["output"] = [command_segments[index + 1]]
            fileint, file_name = tempfile.mkstemp(suffix=".RData")
            os.close(fileint)
            command_segments[index + 1] = file_name
            output_files["output"].append(file_name)
        elif segment == "--stats":
            output_files["stats"] = [command_segments[index + 1]]
            fileint, file_name = tempfile.mkstemp(suffix=".RData")
            os.close(fileint)
            command_segments[index + 1] = file_name
            output_files["stats"].append(file_name)

    environ = os.environ.copy()
    if not environ.has_key('R_LIBS'):
        environ['R_LIBS'] = TaskConfig.STOCHOPTIM_R_LIB_DIR

    # Now command_segments is the correct execution string, just need to join it.
    execution_string = " ".join(command_segments)
    print execution_string
    try:
        p = subprocess.Popen(
            shlex.split(execution_string),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=environ
        )
        pid = p.pid
        if not os.path.exists(TaskConfig.STOCHSS_PID_DIR):
            os.mkdir(TaskConfig.STOCHSS_PID_DIR)
        # create pid file
        pid_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, "{0}-{1}".format(TaskConfig.STOCHSS_PID_FILE_PREFIX, pid))
        logging.info("[Slave] creating PID file '{0}'".format(pid_file))
        with open(pid_file, 'w+') as fd:
            fd.write(str(pid))
        stdout, stderr = p.communicate() # wait for process to complete
    except Exception as e:
        logging.error(e)
    finally:
        logging.info("[Slave] deleting PID file '{0}'".format(pid_file))
        os.remove(pid_file) #clean up pid file
        last_command_completed_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, TaskConfig.STOCHSS_COMPLETED_FILE)
        logging.info("[Slave] touching file '{0}'".format(last_command_completed_file))
        os.system("touch {0}".format(last_command_completed_file))



    # Clean up the input files first
    delete_input_string = "rm -f {0}".format(" ".join(input_files))
    print delete_input_string
    os.system(delete_input_string)
    # Need to send the output files back to the master now, so send them back
    # in a dictionary, where the key is the absolute file path that the master
    # is expecting and the value is the contents of the file.
    result = {}
    if "stats" in output_files:
        # Get the output
        master_output_file = output_files["output"][0]
        slave_output_file = output_files["output"][1]
        with open(slave_output_file, 'r') as file_handle:
            result[master_output_file] = file_handle.read()
        print_size_string = "ls -lh {0}".format(slave_output_file)
        print print_size_string
        os.system(print_size_string)
        # Clean up
        delete_file_string = "rm -f {0}".format(slave_output_file)
        print delete_file_string
        os.system(delete_file_string)
        # Get the output
        master_stats_file = output_files["stats"][0]
        slave_stats_file = output_files["stats"][1]
        with open(slave_stats_file, 'r') as file_handle:
            result[master_stats_file] = file_handle.read()
        print_size_string = "ls -lh {0}".format(slave_stats_file)
        print print_size_string
        os.system(print_size_string)
        # Clean up
        delete_file_string = "rm -f {0}".format(slave_stats_file)
        print delete_file_string
        os.system(delete_file_string)
    else:
        # Get the output
        master_output_file = output_files["output"][0]
        slave_output_file = output_files["output"][1]
        with open(slave_output_file, 'r') as file_handle:
            result[master_output_file] = file_handle.read()
        print_size_string = "ls -lh {0}".format(slave_output_file)
        print print_size_string
        os.system(print_size_string)
        # Clean up
        delete_file_string = "rm -f {0}".format(slave_output_file)
        print delete_file_string
        os.system(delete_file_string)
    return result


def with_temp_file(file_names):
    fileint, file_name = tempfile.mkstemp(suffix=".RData")
    os.close(fileint)
    file_names.append(file_name)
    with open(file_name, 'w') as file_handle:
        yield file_handle



def execute_task(exec_str, return_code_file=None):
    try:
        p = subprocess.Popen(exec_str, shell=True, preexec_fn=os.setsid)
        pid = p.pid

        # Handler that should catch the first SIGTERM signal and then kill
        # off all subprocesses
        def handler(signum, frame, *args):
            print 'execute_task(): Caught signal:', signum
            # try to kill subprocesses off...
            try:
                print 'Sending SIGTERM to process group {0}'.format(p.pid)
                os.killpg(p.pid, signal.SIGTERM)
                p.terminate()
            except Exception as e:
                print '******************************************************************'
                print "Exception:", e
                print traceback.format_exc()
                print '******************************************************************'

        # Register the handler with SIGTERM signal
        signal.signal(signal.SIGTERM, handler)

        if not os.path.exists(TaskConfig.STOCHSS_PID_DIR):
            os.mkdir(TaskConfig.STOCHSS_PID_DIR)
        # create pid file
        pid_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, "{0}-{1}".format(TaskConfig.STOCHSS_PID_FILE_PREFIX, pid))
        logging.info("creating PID file '{0}'".format(pid_file))
        with open(pid_file, 'w+') as fd:
            fd.write(str(pid))
        return_code = p.wait() # wait for process to complete
        if return_code_file is not None:
            with open(return_code_file, 'w+') as fd:
                fd.write(str(return_code))
    except Exception as e:
        logging.error(e)
    finally:
        logging.info("deleting PID file '{0}'".format(pid_file))
        os.remove(pid_file) #clean up pid file
        last_command_completed_file = os.path.join(TaskConfig.STOCHSS_PID_DIR, TaskConfig.STOCHSS_COMPLETED_FILE)
        logging.info("touching file '{0}'".format(last_command_completed_file))
        os.system("touch {0}".format(last_command_completed_file))



@celery.task(name='stochss')
def task(taskid, params, agent, database, storage_agent, access_key, secret_key, task_prefix=""):
    '''
    This is the actual work done by a task worker
    params    should contain at least 'bucketname'
    '''
    uuidstr = taskid
    res = {}

    try:
        bucketname = params['bucketname']
        if_tracking = False
        ct = None

        if agent == AgentTypes.EC2:
            logging.info('Trying to track via CloudTracker...')

            # Initialize cloudtracker with the task's UUID
            ct = CloudTracker(access_key, secret_key, uuidstr, bucketname)
            if_tracking = ct.if_tracking()

            logging.info('This is the first time to execute the job? '.format(if_tracking))
            if if_tracking:
                ct.track_input(params)

        logging.info('task to be executed at remote location')
        print 'inside celery task method'
        data = {'status': 'active',
                'message': 'Task Executing in cloud'}

        # will have prefix for cost-anaylsis job
        taskid = '{0}{1}'.format(task_prefix, taskid)

        database.updateEntry(taskid=taskid, data=data, tablename=params["db_table"])
        paramstr = params['paramstring']

        job_type = params['job_type']
        if job_type == 'spatial':
            create_dir_str = "mkdir -p output/%s/results " % uuidstr
            os.system(create_dir_str)
        create_dir_str = "mkdir -p output/%s/result " % uuidstr
        os.system(create_dir_str)
        
        return_code_file = "output/{0}/return_code".format(uuidstr)


        filename = os.path.join('output', uuidstr, '{0}.xml'.format(uuidstr))
        with open(filename, 'w') as f:
            f.write(params['document'])

        xmlfilepath = filename

        stdout = os.path.join('output', uuidstr, 'stdout.log')
        stderr = os.path.join('output', uuidstr, 'stderr.log')

        exec_str = ''

        logging.info('job_type = {}'.format(job_type))
        if job_type == 'stochkit':
            # The following executiong string is of the form :
            # stochkit_exec_str = "~/StochKit/ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
            exec_str = "{0}/{1} -m {2} --force --out-dir output/{3}/result 2>{4} > {5}".format(TaskConfig.STOCHKIT_DIR,
                                                                                               paramstr, xmlfilepath,
                                                                                               uuidstr, stderr, stdout)
        elif job_type == 'stochkit_ode' or job_type == 'sensitivity':
            logging.info('sensitivity job')
            exec_str = "{0}/{1} -m {2} --force --out-dir output/{3}/result 2>{4} > {5}".format(TaskConfig.ODE_DIR,
                                                                                               paramstr, xmlfilepath,
                                                                                               uuidstr, stderr, stdout)
        elif job_type == 'spatial':
            cmd = "chown -R {username} output/{uuidstr}".format(username=TaskConfig.USERNAME, uuidstr=uuidstr)
            print cmd
            os.system(cmd)
            exec_str = \
                "sudo -E -u {username} {pyurdme_wrapper} {model_xml_file} {output_dir} {sim_algorithm} {sim_realizations} {sim_seed} 2>{stderr} > {stdout}".format(
                    username=TaskConfig.USERNAME,
                    pyurdme_wrapper=TaskConfig.PYURDME_WRAPPER_PATH,
                    model_xml_file=xmlfilepath,
                    output_dir=os.path.join('output', uuidstr, 'results'),
                    sim_algorithm=params['simulation_algorithm'],
                    sim_realizations=params['simulation_realizations'],
                    sim_seed=params['simulation_seed'],
                    stderr=stderr,
                    stdout=stdout)

        print "======================="
        print " Command to be executed : "
        print "{0}".format(exec_str)
        print "======================="
        print "To test if the command string was correct. Copy the above line and execute in terminal."

        timestarted = datetime.now()
        # os.system(exec_str)
        execute_task(exec_str, return_code_file=return_code_file)
        timeended = datetime.now()

        results = os.listdir("output/{0}/result".format(uuidstr))
        if 'stats' in results and os.listdir("output/{0}/result/stats".format(uuidstr)) == ['.parallel']:
            raise Exception("The compute node can not handle a job of this size.")

        filepath = os.path.join('output', uuidstr)
        absolute_file_path = os.path.abspath(filepath)

        if agent == AgentTypes.EC2:
            try:
                if if_tracking:
                    ct.track_output(absolute_file_path)
            except Exception, e:
                print "CloudTracker Error: track_output"
                print e

        data = {'status': 'active',
                'message': 'Task finished. Generating output.'}
        database.updateEntry(taskid=taskid, data=data, tablename=params["db_table"])
        diff = timeended - timestarted

        if task_prefix != "":
            res['status'] = "finished"
            res['time_taken'] = "{0} seconds".format(diff.total_seconds())
        else:

            logging.info('Generating output tar file...')
            output_dir = os.path.join("output", uuidstr)
            output_tar_filename = os.path.join("output", "{}.tar".format(uuidstr))

            create_output_tar_command = \
                "tar -zcvf {output_tar_filename} {output_dir}".format(output_tar_filename=output_tar_filename,
                                                                      output_dir=output_dir)
            logging.info(create_output_tar_command)
            os.system(create_output_tar_command)

            output_url = storage_agent.upload_file(filename=output_tar_filename)
            logging.info('output_url = {}'.format(output_url))

            logging.info('Removing xml file...')
            removefilestr = "rm {0}".format(xmlfilepath)
            os.system(removefilestr)

            logging.info('Removing output ...')
            remove_output_command = \
                "rm -r {output_tar_filename} {output_dir}".format(output_tar_filename=output_tar_filename,
                                                                  output_dir=output_dir)
            os.system(remove_output_command)

            # if there is some task prefix, meaning that it is cost replay,
            # update the table another way
            res['status'] = "finished"
            res['pid'] = uuidstr
            res['output'] = output_url
            res['time_taken'] = "{0} seconds".format(diff.total_seconds())

        database.updateEntry(taskid=taskid, data=res, tablename=params["db_table"])
        

        if agent == AgentTypes.EC2:
            # there is no "cost_analysis_table" in params in cost analysis task,
            # but it there should have in normal task and rerun task.

            logging.info('Updating cost analysis table for normal/rerun task...')
            if "cost_analysis_table" in params:
                if "INSTANCE_TYPE" not in os.environ:
                    logging.error("Error: there is no INSTANCE_TYPE in environment variable.")
                    res['message'] = "Error: there is no INSTANCE_TYPE in environment variable."
                    return res

                result = database.getEntry('taskid', taskid, params["db_table"])
                data = None
                for one in result:
                    data = one
                    logging.info("{0} data in stochss table: {1}".format(taskid, one))
                    break
                if data == None:
                    logging.error("Error: there is no data in stochss table with {0}.".format(taskid))
                    res['message'] = "EError: there is no data in stochss table with {0}.".format(taskid)
                    return res

                instance_type = os.environ["INSTANCE_TYPE"]
                taskid_prefix = '{0}_{1}_'.format(agent, instance_type)
                taskid = taskid_prefix+taskid
                cost_analysis_data = {
                        'agent': agent,
                        'instance_type': instance_type,
                        'message': data['message'],
                        'start_time': data['start_time'],
                        'status': data['status'],
                        'time_taken': data['time_taken'],
                        'uuid': data['uuid']
                        }
                database.updateEntry(taskid=taskid, data=cost_analysis_data, tablename=params["cost_analysis_table"])
    

    except Exception, e:
        logging.error('Error in stochss task: {}'.format(str(e)))
        logging.error(traceback.format_exc())

        expected_output_dir = os.path.join("output", uuidstr)
        output_tar_filename = "{expected_output_dir}.tar".format(expected_output_dir=expected_output_dir)

        # First check for existence of output directory
        if os.path.isdir(expected_output_dir):
            # Then we should store this in S3 for debugging purposes
            create_output_tar_command = \
                "tar -zcvf {output_tar_filename} {expected_output_dir}".format(expected_output_dir=expected_output_dir,
                                                                               output_tar_filename=output_tar_filename)
            logging.info(create_output_tar_command)
            os.system(create_output_tar_command)

            logging.info('Uploading output...')
            output_url = storage_agent.upload_file(filename="{dir}.tar".format(dir=expected_output_dir))
            logging.info("output_url = {}".format(output_url))

            # Now clean up
            remove_output_str = \
                "rm -r {output_tar_filename} {expected_output_dir}".format(output_tar_filename=output_tar_filename,
                                                                        expected_output_dir=expected_output_dir)
            os.system(remove_output_str)

            # Update the DB entry
            res['output'] = output_url
            res['status'] = 'failed'
            res['message'] = str(e)

            database.updateEntry(taskid=taskid, data=res, tablename="stochss")

        else:
            # Nothing to do here besides send the exception
            data = {'status': 'failed',
                    'message': str(e)}
            database.updateEntry(taskid=taskid, data=data, tablename="stochss")
        raise e
    return res


def check_task_status(task_id):
    '''
    Method takes task_id as input and returns the result of the celery task
    '''
    logging.info("checkStatus inside method with params %s", str(task_id))
    result = {}
    try:
        from celery.result import AsyncResult

        res = AsyncResult(task_id)
        logging.debug("checkStatus: result returned for the taskid = {0} is {1}".format(task_id, str(res)))
        result = res.result
        result['state'] = res.status
        if res.status == "PROGRESS":
            print 'Task in progress'
            print 'Current %d' % result['current']
            print 'Total %d' % result['total']
            result['result'] = None
        elif res.status == "SUCCESS":
            result['result'] = res.result
        elif res.status == "FAILURE":
            result['result'] = res.result

    except Exception, e:
        logging.debug("checkStatus error : %s", str(e))
        result['state'] = "FAILURE"
        result['result'] = str(e)
    logging.debug("checkStatus : Exiting with result %s", str(res))
    return result


def remove_task(task_id):
    '''
    this method revokes scheduled tasks as well as the tasks in progress
    '''
    try:
        print "removeTask: with task_id: {0}".format(str(task_id))
        from celery.task.control import revoke
        # Celery can't use remote control (which includes revoking tasks) with SQS
        # http://docs.celeryproject.org/en/latest/getting-started/brokers/sqs.html
        revoke(task_id, terminate=True, signal="SIGTERM")
    except Exception, e:
        print "task {0} cannot be removed/deleted. Error : {1}".format(task_id, str(e))


def reroute_workers(worker_names, to_queue, from_queue="celery"):
    '''
    Changes all workers specified by worker_names to stop consuming from the
    from_queue and start consuming from the to_queue.
    By default, the from_queue is the main default queue created that all workers
    consume from initially.
    '''
    app = CelerySingleton().app
    app.control.cancel_consumer(from_queue, reply=True, destination=worker_names)
    app.control.add_consumer(to_queue, reply=True, destination=worker_names)


def get_worker_list_consuming_from_queue(from_queue):
    '''
    Returns a list of the names of all workers that are consuming from the
    from_queue, or an empty list if no workers are consuming from the queue.
    '''
    worker_names = []
    app = CelerySingleton().app
    all_worker_assignments = app.control.inspect().active_queues()
    for worker_name in all_worker_assignments:
        worker_queues = all_worker_assignments[worker_name]
        for queue in worker_queues:
            if queue["name"] == from_queue:
                worker_names.append(worker_name)
    return worker_names



if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "shutdown-monitor":
        ShutdownMonitor().start()

