'''
This class exposes all the services offered by the backend
It accepts calls from the front-end and pass them on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import threading
import os, subprocess, shlex, signal, uuid, sys, time
import logging, traceback
from datetime import datetime
from tasks import *
from boto.s3.connection import S3Connection
from celery.task.control import inspect
import celery

class backendservices():
    ''' 
    constructor for the backend service class.
    It should be passed the agent creds
    ''' 
        
    #Class Constants
    TABLENAME = 'stochss'
    KEYPREFIX = 'stochss'
    QUEUEHEAD_KEY_TAG = 'queuehead'
    INFRA_EC2 = 'ec2'
    INFRA_CLUSTER = 'cluster'
    WORKER_AMIS = {
        INFRA_EC2: 'ami-f0d42898'
    }

    def __init__(self):
        '''
        constructor to set the path of various libraries
        ''' 
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/boto'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/celery'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 
                                     '/Library/Python/2.7/site-packages/amqp'))
            
    def executeTask(self,params):
        '''
        This method instantiates celery tasks in the cloud.
	Returns return value from celery async call and the task ID
        '''
        logging.info('inside execute task for cloud : Params - %s', str(params))
        result = {}
        try:
            from tasks import task,updateEntry
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

            taskid = str(uuid.uuid4())
            result["db_id"] = taskid
            #create a celery task
            logging.info("executeTask : executing task with uuid : %s ", taskid)
            timenow = datetime.now() 
            data = {
                'status': "pending",
                "start_time": timenow.strftime('%Y-%m-%d %H:%M:%S'),
                'Message': "Task sent to Cloud"
            }
            
            tmp = None
            if params["job_type"] == "mcem2":
                queue_name = taskid
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
                updateEntry(taskid, data, backendservices.TABLENAME)
                params["queue"] = queue_name
                tmp = master_task.delay(taskid, params)
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
            else:
                updateEntry(taskid, data, backendservices.TABLENAME)
                #celery async task execution http://ask.github.io/celery/userguide/executing.html
                tmp = task.delay(taskid, params)  #calls task(taskid,params)
                result["celery_pid"] = tmp.id

            logging.info("executeTask :  result of task : %s", str(tmp))
            result["success"] = True
            return result
        except Exception, e:
            logging.error("executeTask : error - %s", str(e))
            return {
                "success": False,
                "reason": str(e),
                "exception": str(e),
                "traceback": traceback.format_exc()
            }
    
    def executeTaskLocal(self, params):
        '''
        This method spawns a stochkit process. It doesn't wait for the process to finish. The status of the
        process can be tracked using the pid and the output directory returned by this method. 
        
        @param  params['document'] = the contents of the xml file 
        @param  params['paramstring'] = the parameter to be passed to the stochkit execution
        'STOCHKIT_HOME' = this is the environment variable which has the path of the stochkit executable
        @return: 
           {"pid" : 'the process id of the task spawned', "output": "the directory where the files will be generated"}
         
        '''

        try:           
            logging.info("executeTaskLocal : inside method with params : %s ", 
                         str(params))
            res = {}
            
            paramstr =  params['paramstring']
            uuidstr = str(uuid.uuid4())
            res['uuid'] = uuidstr
            create_dir_str = "mkdir -p output/%s " % uuidstr
            os.system(create_dir_str)
            
            # Write the model document to file
            xmlfilepath = "output/" + uuidstr +"/"+uuidstr+".xml"
            xmlfilepath = os.path.abspath(xmlfilepath)
            mfhandle = open(xmlfilepath,'w')
            mfhandle.write(params['document'])
            mfhandle.close()
            
            # Pipe output to these files
            res['stdout'] = os.path.abspath('output/' + uuidstr + '/stdout')
            res['stderr'] = os.path.abspath('output/' + uuidstr + '/stderr')
            
            # The following executiong string is of the form :
            # stochkit_exec_str = "ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
            stochkit_exec_str = "{backenddir}/wrapper.py {stdout} {stderr} {0} --model {1} --out-dir output/{2}/result ".format(paramstr,xmlfilepath,uuidstr, stdout = res['stdout'], stderr = res['stderr'], backenddir = os.path.abspath(os.path.dirname(__file__)))
            print stochkit_exec_str
            logging.info("STOCHKIT_EXEX_STR: "+stochkit_exec_str)
            logging.debug("executeTaskLocal : Spawning StochKit Task. String : %s",
                           stochkit_exec_str)
            
            p = subprocess.Popen(stochkit_exec_str.split(), stdin=subprocess.PIPE)

            #logging.debug("executeTaskLocal: the result of task {0} or error {1} ".format(output,error))
            pid = p.pid

            res['pid'] = pid
            filepath = "output/%s//" % (uuidstr)
            logging.debug("executeTaskLocal : PID generated - %s", pid)
            absolute_file_path = os.path.abspath(filepath)
            logging.debug("executeTaskLocal : Output file - %s", absolute_file_path)
            res['output'] = absolute_file_path

            logging.info("executeTaskLocal: exiting with result : %s", str(res))
            return res
        except Exception as e:
            logging.error("executeTaskLocal : exception raised : %s" , str(e))
            return None

    
    def checkTaskStatusLocal(self, pids):
        '''
        checks the status of the pids and returns true if the task is running or else returns false
        pids = [list of pids to check for status]
        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
        '''
        res = {}
        logging.info("checkTaskStatusLocal : inside with params {0}".format(pids))
        try:
            for pid in pids:
                try:
                    os.kill(pid, 0)
                    res[pid] = True
                except Exception,e:
                    res[pid] = False
            logging.info("checkTaskStatusLocal : exiting with result : {0}".format(res))
            return res
        except Exception as e:
            logging.error("checkTaskStatusLocal: Exiting with error : {0}".format(e))
            return None
    
    def checkTaskStatusCloud(self, pids):
        '''
        checks the status of the pids and returns true if the task is running or else returns false
        pids = [list of pids to check for status]
        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
        '''
        res = {}
        
        return res
    
    
    def describeTask(self, params):
        '''
        @param params: A dictionary with the following fields
         "AWS_ACCESS_KEY_ID" : AWS access key
         "AWS_SECRET_ACCESS_KEY": AWS security key
         taskids : list of celery taskids
         @return: 
         a dictionary of the form :
         {"taskid":"result:"","state":""} 
        '''
        logging.debug("describeTask : setting environment variables : AWS_ACCESS_KEY_ID - %s", params['AWS_ACCESS_KEY_ID']) 
        os.environ["AWS_ACCESS_KEY_ID"] = params['AWS_ACCESS_KEY_ID']
        logging.debug("describeTask : setting environment variables : AWS_SECRET_ACCESS_KEY - %s", params['AWS_SECRET_ACCESS_KEY'])
        os.environ["AWS_SECRET_ACCESS_KEY"] = params['AWS_SECRET_ACCESS_KEY']
        result = {}
        try:
            result = describetask(params['taskids'], backendservices.TABLENAME)
        except Exception, e:
            logging.error("describeTask : exiting with error : %s", str(e))
            return None
        return result
    
    def stopTasks(self, params):
        '''
        @param id_pairs: a list of (database_id, task_id) pairs, each representing
                          a task to be stopped
        '''
        credentials = params['credentials']
        id_pairs = params['ids']
        # First we need to stop the workers from working on the tasks
        db_ids = []
        for id_pair in id_pairs:
            task_id = id_pair[0]
            database_id = id_pair[1]
            logging.info("stopTasks calling removeTask('{0}')".format(task_id))
            removeTask(task_id)
            db_ids.append(database_id)
        # Then we need to return the final description of the tasks
        describe_params = {
            'AWS_ACCESS_KEY_ID': credentials['AWS_ACCESS_KEY_ID'],
            'AWS_SECRET_ACCESS_KEY': credentials['AWS_SECRET_ACCESS_KEY'],
            'taskids': db_ids
        }
        return self.describeTask(describe_params)
    
    def deleteTasks(self, taskids):
        '''
        @param taskid:the list of taskids to be removed 
        this method revokes scheduled tasks as well as the tasks in progress. It 
        also removes task from the database. It ignores the taskids which are not active.
        '''
        logging.info("deleteTasks : inside method with taskids : %s", taskids)
        try:
            for taskid_pair in taskids:
                print 'deleteTasks: removing task {0}'.format(str(taskid_pair))
                removeTask(taskid_pair[0]) #this removes task from celery queue
                removetask(backendservices.TABLENAME,taskid_pair[1]) #this removes task information from DB. ToDo: change the name of method
            logging.info("deleteTasks: All tasks removed")
        except Exception, e:
            logging.error("deleteTasks : exiting with error : %s", str(e))

    
    def deleteTaskLocal(self, pids):
        """
        pids : list of pids to be deleted.
        Terminates the processes associated with the PID. 
        This methods ignores the PID which are  not active.
        """
        logging.info("deleteTaskLocal : inside method with pids : %s", pids)
        for pid in pids:
            try:
                logging.error("KILL TASK {0}".format(pid))
                os.kill(pid, signal.SIGTERM)
            except Exception, e:
                logging.error("deleteTaskLocal : couldn't kill process. error: %s", str(e))
        logging.info("deleteTaskLocal : exiting method")
    
    def isOneOrMoreComputeNodesRunning(self, params):# credentials):
        '''
        Checks for the existence of running compute nodes. Only need one running compute node
        to be able to run a job in the cloud.
        '''
        credentials = params["credentials"]
        key_prefix = self.KEYPREFIX
        if "key_prefix" in params:
            key_prefix = params["key_prefix"]
        try:
            params = {
                "infrastructure": self.INFRA_EC2,
                "credentials": credentials,
                "key_prefix": key_prefix
            }
            all_vms = self.describeMachines(params)
            if all_vms == None:
                return False
            # Just need one running vm
            for vm in all_vms:
                if vm != None and vm['state'] == 'running':
                    return True
            return False
        except:
            return False
    
    def isQueueHeadRunning(self, params):
        '''
        '''
        credentials = params["credentials"]
        key_prefix = self.KEYPREFIX
        if "key_prefix" in params:
            key_prefix = params["key_prefix"]
        try:
            params = {
                "infrastructure": self.INFRA_EC2,
                "credentials": credentials,
                "key_prefix": key_prefix
            }
            all_vms = self.describeMachines(params)
            if all_vms == None:
                return False
            # Just need one running vm with the QUEUEHEAD_KEY_TAG in the name of the keypair
            for vm in all_vms:
                if vm != None and vm['state'] == 'running' and vm['key_name'].find(self.QUEUEHEAD_KEY_TAG) != -1:
                    return True
            return False
        except:
            return False
    
    def startMachines(self, params, block=False):
        '''
        This method instantiates ec2 instances
        '''

        logging.info("startMachines : inside method with params : %s", str(params))
        try:
            #make sure that any keynames we use are prefixed with stochss so that
            #we can do a terminate all based on keyname prefix
            if "key_prefix" in params:
                key_prefix = params["key_prefix"]
                if not key_prefix.startswith(self.KEYPREFIX):
                    key_prefix = self.KEYPREFIX + key_prefix
            else:
                key_prefix = self.KEYPREFIX

            key_name = params["keyname"]
            if not key_name.startswith(key_prefix):
                params['keyname'] = key_prefix + key_name

            # NOTE: We are forcing blocking mode within the InfrastructureManager class
            # for the launching of VMs because of how GAE joins on all threads before
            # returning a response from a request.
            i = InfrastructureManager(blocking=block)
            res = {}
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.
            compute_check_params = {
                "credentials": params["credentials"],
                "key_prefix": key_prefix
            }
            if self.isQueueHeadRunning(compute_check_params):
		#Queue head is running so start as many vms as requested
                res = i.run_instances(params,[])
            else:
                # Need to start the queue head (RabbitMQ)
                params["queue_head"] = True
                vms_requested = int(params["num_vms"])
                requested_key_name = params["keyname"]
                # Only want one queue head, and it must have its own key so
                # it can be differentiated if necessary
                params["num_vms"] = 1
                params["keyname"] = requested_key_name+'-'+self.QUEUEHEAD_KEY_TAG
                res = i.run_instances(params,[])

                #NOTE: This relies on the InfrastructureManager being run in blocking mode...
                queue_head_ip = res["vm_info"]["public_ips"][0]
                self.__update_celery_config_with_queue_head_ip(queue_head_ip)
                params["keyname"] = requested_key_name
                params["queue_head"] = False
                if vms_requested > 1:
		    #subtract 1 since we can use the queue head as a worker
                    params["num_vms"] = vms_requested - 1
                    res = i.run_instances(params,[])

                params["num_vms"] = vms_requested

            logging.info("startMachines : exiting method with result : %s", str(res))
            return res
        except Exception, e:
            logging.error("startMachines : exiting method with error : {0}".format(str(e)))
            print "startMachines : exiting method with error :", str(e)
            return None
        
    def stopMachines(self, params, block=False):
        '''
        This method would terminate all the  instances associated with the account
	that have a keyname prefixed with stochss (all instances created by the backend service)
	params must contain credentials key/value
        '''
        key_prefix = self.KEYPREFIX
        if "key_prefix" in params and not params["key_prefix"].startswith(key_prefix):
            key_prefix += params["key_prefix"]
        elif "key_prefix" in params: 
            key_prefix = params["key_prefix"]
        try:
            logging.info("Stopping compute nodes with key_prefix: {0}".format(key_prefix))
            i = InfrastructureManager(blocking=block)
            res = i.terminate_instances(params,key_prefix)
            return True
        except Exception, e:
            logging.error("Terminate machine failed with error : %s", str(e))
            return False
    
    def describeMachines(self, params):
        '''
        This method gets the status of all the instances of ec2
        '''
        # add calls to the infrastructure manager for getting details of
        # machines
        logging.info("describeMachines : inside method with params : %s", str(params))
        key_prefix = ""
        if "key_prefix" in params:
            key_prefix = params["key_prefix"]
            if not key_prefix.startswith(self.KEYPREFIX):
                key_prefix = self.KEYPREFIX + key_prefix
        else:
            key_prefix = self.KEYPREFIX
        try:
            i = InfrastructureManager()
            res = i.describe_instances(params, [], key_prefix)
            logging.info("describeMachines : exiting method with result : %s", str(res))
            return res
        except Exception, e:
            logging.error("describeMachines : exiting method with error : %s", str(e))
            return None
    
    
    def validateCredentials(self, params):
        '''
        This method verifies the validity of ec2 credentials
        '''
	if params['infrastructure'] is None :
            logging.error("validateCredentials: infrastructure param not set")
	    return False
	creds = params['credentials']
	if creds is None :
            logging.error("validateCredentials: credentials param not set")
	    return False
	if creds['EC2_ACCESS_KEY'] is None :
            logging.error("validateCredentials: credentials EC2_ACCESS_KEY not set")
	    return False
	if creds['EC2_SECRET_KEY'] is None :
            logging.error("validateCredentials: credentials EC2_ACCESS_KEY not set")
	    return False

        logging.info("validateCredentials: inside method with params : %s", str(params))
        try:
            i = InfrastructureManager()
            logging.info("validateCredentials: exiting with result : %s", str(i))
            return i.validate_Credentials(params)
        except Exception, e:
            logging.error("validateCredentials: exiting with error : %s", str(e))
            return False
    
    
    def getSizeOfOutputResults(self, aws_access_key, aws_secret_key, output_buckets):
        '''
        This method checks the size of the output results stored in S3 for all of the buckets and keys
         specified in output_buckets.
        @param aws_access_key
         The AWS access key of the user whose output is being examined.
        @param aws_secret_key
         The AWS secret key of the user whose output is being examined.
        @param output_buckets
         A dictionary whose keys are bucket names and whose values are lists of (key name, job name) pairs.
        @return
         A dictionary whose keys are job names and whose values are output sizes of those jobs.
         The output size is either the size specified in bytes or None if no output was found.
        '''
        try:
            logging.info("getSizeOfOutputResults: inside method with output_buckets: {0}".format(output_buckets))
            # Connect to S3
            conn = S3Connection(aws_access_key, aws_secret_key)
            # Output is a dictionary
            result = {}
            for bucket_name in output_buckets:
                # Try to get the bucket
                try:
                    bucket = conn.get_bucket(bucket_name)
                except boto.exception.S3ResponseError:
                    # If the bucket doesn't exist, neither do any of the keys
                    for key_name, job_name in output_buckets[bucket_name]:
                        result[job_name] = None
                else:
                    # Ok the bucket exists, now for the keys
                    for key_name, job_name in output_buckets[bucket_name]:
                        key = bucket.get_key(key_name)
                        if key is None:
                            # No output exists for this key
                            result[job_name] = None
                        else:
                            # Output exists for this key
                            result[job_name] = key.size
            return result
        except Exception, e:
            logging.error("getSizeOfOutputResults: unable to get size with exception: {0}".format(e))
            return None
    
    def fetchOutput(self, taskid, outputurl):
        '''
        This method gets the output file from S3 and extracts it to the output 
        directory
        @param taskid: the taskid for which the output has to be fetched
        @return: True : if successful or False : if failed 
        '''
        try : 
            logging.info("fetchOutput: inside method with taskid : {0} and url {1}".format(taskid, outputurl))
            filename = "{0}.tar".format(taskid)
            #the output directory
            #logging.debug("fetchOutput : the name of file to be fetched : {0}".format(filename))
            #baseurl = "https://s3.amazonaws.com/stochkitoutput/output"
            #fileurl = "{0}/{1}".format(baseurl,filename)
            logging.debug("url to be fetched : {0}".format(taskid))
            fetchurlcmdstr = "curl --remote-name {0}".format(outputurl)
            logging.debug("fetchOutput : Fetching file using command : {0}".format(fetchurlcmdstr))
            os.system(fetchurlcmdstr)
            if not os.path.exists(filename):
                logging.error('unable to download file. Returning result as False')
                return False
            return True
        except Exception, e:
            logging.error("fetchOutput : exiting with error : %s", str(e))
            return False
    
    def __update_celery_config_with_queue_head_ip(self, queue_head_ip):
        # Write queue_head_ip to file on the appropriate line
        celery_config_filename = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "celeryconfig.py"
        )
        celery_config_lines = []
        with open(celery_config_filename, 'r') as celery_config_file:
            celery_config_lines = celery_config_file.readlines()
        with open(celery_config_filename, 'w') as celery_config_file:
            for line in celery_config_lines:
                if line.strip().startswith('BROKER_URL'):
                    celery_config_file.write('BROKER_URL = "amqp://stochss:ucsb@{0}:5672/"\n'.format(queue_head_ip))
                else:
                    celery_config_file.write(line)
        # Now update the actual Celery app....
        #TODO: Doesnt seem to work in GAE until next request comes in to server
        my_celery = CelerySingleton()
        my_celery.configure()


################## tests #############################
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m' #yellow
    FAIL = '\033[91m'
    ENDC = '\033[0m'

##########################################
##########################################
def teststochoptim(backend,compute_check_params):
    '''
    This tests a stochoptim job using a local run and a cloud run
    '''
    started_queue_head = False
    queue_key = None
    keypair_name = backend.KEYPREFIX+"-ch-stochoptim-testing"
    if backend.isQueueHeadRunning(compute_check_params):
        print "Assuming you already have a queue head up and running..."
    else:
        started_queue_head = True
        print "Launching queue head / master worker..."
        launch_params = {
            "infrastructure": backend.INFRA_EC2,
            "credentials": credentials,
            "num_vms": 1,
            "group": keypair_name,
            "image_id": backend.WORKER_AMIS[backend.INFRA_EC2],
            "instance_type": 't1.micro',#"c3.large",
            "key_prefix": keypair_name,
            "keyname": keypair_name,
            "use_spot_instances": False
        }
        launch_result = backend.startMachines(launch_params, block=True)
        if not launch_result["success"]:
            print "Failed to start master machine..."
            sys.exit(1)
        print "Done. Sleeping 2 mins while machines initialize (status checks)"
        time.sleep(120)
    # We need to start our own workers first.
    cores_to_use = 4
    print "Launching {0} slave worker(s)...".format(cores_to_use)
    launch_params = {
        "infrastructure": backend.INFRA_EC2,
        "credentials": credentials,
        "num_vms": cores_to_use,
        "group": keypair_name,
        "image_id": backend.WORKER_AMIS[backend.INFRA_EC2],
        "instance_type": 't1.micro',#"c3.large",
        "key_prefix": keypair_name,
        "keyname": keypair_name,
        "use_spot_instances": False
    }
    # Slaves dont need to be started in blocking mode, although
    # blocking mode is being forced inside the InfrastructureManager
    # currently.
    #comment this block out if you already have 4 workers started 
    #from a previous test
    #cjklaunch_result = backend.startMachines(launch_params, block=False)
    #cjkif not launch_result["success"]:
        #cjkprint "Failed to start slave worker(s)..."
        #cjksys.exit(1)
    #cjkprint "Done2. Sleeping 2 mins while machines initialize (status checks)"
    #cjktime.sleep(120)

    print 'all nodes needed have been launched'
    sys.stdout.flush()

    # Then we can execute the task.
    file_dir_path = os.path.dirname(os.path.abspath(__file__))
    path_to_model_file = os.path.join(file_dir_path, "../../stochoptim/inst/extdata/birth_death_REMAImodel.R")
    path_to_model_data_file = os.path.join(file_dir_path, "../../stochoptim/inst/extdata/birth_death_REdata0.txt")
    path_to_final_data_file = os.path.join(file_dir_path, "../../stochoptim/inst/extdata/birth_death_REdata.txt")
    params = {
        'credentials':{'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key},
        "key_prefix": keypair_name,
        "job_type": "mcem2",
        "cores": cores_to_use,
        "model_file": open(path_to_model_file, 'r').read(),
        "model_data": {
            "extension": "txt",
            "content": open(path_to_model_data_file, 'r').read()
        },
        "final_data": {
            "extension": "txt",
            "content": open(path_to_final_data_file, 'r').read()
        },
        "bucketname": "cjktestingstochoptim",
        "paramstring": "exec/cedwssa.r --K.ce 1e5 --K.prob 1e6"
    }
    print "\nCalling executeTask now..."
    sys.stdout.flush()
    result = backend.executeTask(params)
    if result["success"]:
        print "Succeeded..."
        celery_id = result["celery_pid"]
        queue_name = result["queue"]
        # call the poll task process
        poll_task_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "poll_task.py"
        )
        os.system("python {0} {1} {2} > poll_task_{1}.log 2>&1".format(
            poll_task_path,
            celery_id,
            queue_name
        ))
        task_id = result["db_id"]
        describe_task_params = {
            "AWS_ACCESS_KEY_ID": access_key,
            "AWS_SECRET_ACCESS_KEY": secret_key,
            "taskids": [task_id]
        }
        print "\nCalling describeTask..."
        desc_result = backend.describeTask(describe_task_params)[task_id]
        while desc_result["status"] != "finished":
            if "output" in desc_result:
                print "[{0}] [{1}] [{2}] [{3}]".format(
                    desc_result["taskid"],
                    desc_result["status"],
                    desc_result["message"],
                    desc_result["output"]
                )
            elif "message" in desc_result:
                print "[{0}] [{1}] [{2}]".format(
                    desc_result["taskid"],
                    desc_result["status"],
                    desc_result["message"]
                )
            else:
                print "[{0}] [{1}]".format(
                    desc_result["taskid"],
                    desc_result["status"]
                )
            time.sleep(60)
            print "\nCalling describeTask..."
            desc_result = backend.describeTask(describe_task_params)[task_id]
        print "Finished..."
        print desc_result["output"]
        terminate_params = {
            "infrastructure": backend.INFRA_EC2,
            "credentials": credentials,
            "key_prefix": keypair_name
        }
        print "\nStopping all VMs..."
        if backend.stopMachines(terminate_params):
            print "Stopped all machines!"
        else:
            print "Failed to stop machines..."
    else:
        print "Failed..."
        if "exception" in result:
            print result["exception"]
            print result["traceback"]
        else:
            print result["reason"]

##########################################
##########################################
def teststochss(backend,params):
    '''
    This tests a stochkit job using a local run (2 tasks)
    and a cloud run (2 tasks)
    It can also test describe* and start/stop Machines
    '''

    if backend.validateCredentials(params) :
	print bcolors.FAIL + \
            'startMachines is commented out, make sure you have one+ started!'\
            + bcolors.ENDC
	#or uncomment this next block and comment out the print above
        #res = backend.startMachines(params)
        #if res is None or not res['success'] :
            #raise TypeError("Error, startMachines failed!")
        #print bcolors.OKGREEN + 'startMachines succeeded ' + \
            #str(res) +  bcolors.ENDC
        #print 'started VMs, sleeping for a couple minutes to allow for initialization'
        #for aws status checks
        #time.sleep(120)

	print 'describeMachines outputs to the testoutput.log file'
        backend.describeMachines(params)

	#this is only used for cloud task deployment, this verifies that table 
        #can be created with creds
        credentials = params['credentials']
        os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
        os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']
        print 'access key: '+os.environ["AWS_ACCESS_KEY_ID"]
        createtable(backendservices.TABLENAME)

	#Test that local tasks execute and can be deleted
        #NOTE: dimer_decay.xml must be in this local dir
	xmlfile = open('dimer_decay.xml','r')
	doc = xmlfile.read()
	xmlfile.close()

	############################
	print 'testing local task execution...'
        taskargs = {}
	pids = []
	NUMTASKS = 2
	for i in range(NUMTASKS):
            taskargs['paramstring'] = 'ssa -t 100 -i 10 -r 10 --keep-trajectories --seed 706370 --label'
            taskargs['document'] = doc

            #options for job_type are stochkit (ssa), stochkit-ode (ode), 
            #and mcem2 (for paramsweep/stochoptim)
            taskargs['job_type'] = 'stochkit'

            res = backend.executeTaskLocal(taskargs)
	    if res is not None:
	        print 'task {0} local results: {1}'.format(str(i),str(res))
	        pids.append(res['pid'])
                print
	print 'number of pids: {0} {1}'.format(str(len(pids)),str(pids))

    	res  = backend.checkTaskStatusLocal(pids)
	if res is not None:
	    print 'status: {0}'.format(str(res))

	time.sleep(5) #need to sleep here to allow for process spawn
	print 'deleting pids: {0}'.format(str(pids))
	backend.deleteTaskLocal(pids)    

	############################
	print '\ntesting cloud task execution...'
        taskargs = {}
	pids = []
	taskargs['AWS_ACCESS_KEY_ID'] = credentials['EC2_ACCESS_KEY']
        taskargs['AWS_SECRET_ACCESS_KEY'] = credentials['EC2_SECRET_KEY']
	NUMTASKS = 2
	for i in range(NUMTASKS):
            taskargs['paramstring'] = 'ssa -t 100 -i 100 -r 100 --keep-trajectories --seed 706370 --label'
            taskargs['document'] = doc
            #make this unique across all names/users in S3!
            #bug in stochss: if the bucketname is aleady in s3, 
            #tasks run but never update their results in s3 (silent failur)
    	    taskargs['bucketname'] = 'stochsstestbucket2'

            #options for job_type are stochkit (ssa), stochkit-ode (ode), 
            #and mcem2 (for paramsweep/stochoptim)
            taskargs['job_type'] = 'stochkit'

            #sometimes it takes awhile for machine to be ready
            #if this fails with connection refused
            #and you just started a VM recently, then leave the VM up and
            #retry (comment out startMachine above)
            cloud_result = backend.executeTask(taskargs)
            print bcolors.OKGREEN + 'cloud_result on executeTask: ' + \
                str(cloud_result) +  bcolors.ENDC
            if not cloud_result['success']:
                print bcolors.FAIL + 'executeTask failed!' + bcolors.ENDC
                sys.exit(1)

            res = cloud_result['celery_pid']
            taskid = cloud_result['db_id']
  	    pids.append(taskid)

        #check each task's status
	taskargs['taskids'] = pids
	done = {}
	count = NUMTASKS
	while len(done) < count :
	    for i in pids:
                task_status = backend.describeTask(taskargs)
                job_status = task_status[i]  #may be None
		if job_status is not None:
		    print 'task id {0} status: {1}'.format(str(i),job_status['status'])
		    if job_status['status'] == 'finished':
        		print 'cloud job {0} is finished, output: '.format(str(i))
        		print job_status['output']
		        done[i] = True

                    #don't kill off tasks, wait for them to finish
                    #this code hasn't been tested in awhile
		    #elif job_status['status'] == 'active':
			#print '\tDELETING task {0}'.format(str(i))
			#count = count - 1
			#backend.deleteTasks([i])    
		else :
		    print 'task id {0} status is None'.format(str(i))

	print '{0} jobs have finished!\n'.format(len(done))

	############################
        #this terminates instances associated with this users creds and KEYPREFIX keyname prefix
	print 'stopMachines outputs to the testoutput.log file'
	#print 'stopMachines is commented out -- be sure to terminate your instances or uncomment!'
        if backend.stopMachines(params):
            print 'Stopped all machines!'
        else:
            print 'Failed to stop machines...'

        backend.describeMachines(params)

##########################################
##########################################

if __name__ == "__main__":

    '''Note that these must be set for this function to work properly:
        export STOCHSS_HOME=/path/to/stochss/git/dir/stochss
        export PYTHONPATH=${STOCHSS_HOME}:.:..
        export PATH=${PATH}:${STOCHSS_HOME}/StochKit
    '''

    logging.basicConfig(filename='testoutput.log',filemode='w',level=logging.DEBUG)
    try:
       access_key = os.environ["AWS_ACCESS_KEY"]
       secret_key = os.environ["AWS_SECRET_KEY"]
    except KeyError:
       print "main: Environment variables EC2_ACCESS_KEY and EC2_SECRET_KEY not set, cannot continue"
       sys.exit(1)

    os.environ["AWS_ACCESS_KEY_ID"] = access_key
    os.environ["AWS_SECRET_ACCESS_KEY"] = secret_key

    # infra = backendservices.INFRA_EC2
    backend = backendservices()
    credentials = {
      'EC2_ACCESS_KEY': access_key,
      'EC2_SECRET_KEY': secret_key
    }
    compute_check_params = {
        "infrastructure": backend.INFRA_EC2,
        "credentials": credentials
    }
    print bcolors.OKGREEN + 'is Q running? ' + \
        str(backend.isQueueHeadRunning(compute_check_params)) + \
        bcolors.ENDC
    print bcolors.OKGREEN + 'valid creds? ' + \
        str(backend.validateCredentials(compute_check_params)) + \
        bcolors.ENDC
    #comment this next line out to run the next test
    #sys.exit(1)

    ##### run this part to test stochoptim (parameter estimation code) #####
    #NOTE: Uncomment this to test stochkit2 job run
    params = {}
    params['credentials'] = credentials
    params['infrastructure'] = backend.INFRA_EC2
    params['num_vms'] = 1
    params['group'] = 'stochss' 

    #this is used for workers.  its overridden for head node in
    #agents/ec2_agent.py to be c3.large b/c we need more resources there
    #head node is also used as a worker node
    params['instance_type'] = 't1.micro'
    #stochss will prefix whatever keyname you give here: stochss_
    params['keyname'] = 'testkey'
    params['use_spot_instances'] = False
    if params['infrastructure'] == backendservices.INFRA_EC2 :
        params['image_id'] = backend.WORKER_AMIS[backend.INFRA_EC2]
    else :
        raise TypeError("Error, unexpected infrastructure type: "+params['infrastructure'])

    print 'valid creds? '+str(backend.validateCredentials(params))
    print 'for params: '+str(params)

    #print 'Exiting main... remove this if you would like to continue testing'
    #sys.exit(0)

    print 'Running StochKit Tests'
    #teststochss(backend,params)

'''
    print 'Running StochOptim Tests'
    sys.stdout.flush()
    #I haven't gotten this to work for me yet, but have run out of time
    #trying to investigate.  Pushing this to Mengyuan's task list - Chandra 7/23/14
    teststochoptim(backend,compute_check_params)
'''
