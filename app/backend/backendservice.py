'''
This class exposes all the services offered by the backend
It accepts calls from the front-end and pass them on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import threading
import os, subprocess, signal, uuid, sys, time
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
    INFRA_EC2 = 'ec2'
    INFRA_CLUSTER = 'cluster'

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
            updateEntry(taskid, data, backendservices.TABLENAME)
            tmp = None
            if params["job_type"] == "mcem2":
                # We should start all of the instances related to this job with the same key, so
                # that they can all be terminated at the same time easily.
                key_prefix = ""
                if "key_prefix" in params:
                    key_prefix = params["key_prefix"]
                    if not key_prefix.startswith(self.KEYPREFIX):
                      key_prefix = self.KEYPREFIX + key_prefix
                else:
                    key_prefix = self.KEYPREFIX
                random_name = "{0}-slave-{1}".format(
                    key_prefix,
                    taskid
                )
                # Return the key name as well so that this set of machines can be terminated together
                # by the user.
                result["key_name"] = random_name
                requested_cores = params["cores"]
                params["paramstring"] += " --cores {0}".format(requested_cores)
                # The master task can run on any node...
                #TODO: master task might need to run on node with at least 2 cores...
                # launch_params["instance_type"] = "c3.large"
                # launch_params["num_vms"] = 1
                # We need to start up enough workers for the slave tasks. The workers
                # also all need to be consuming from a separate queue so that we have
                # full access to them.
                launch_params = {
                    "infrastructure": self.INFRA_EC2,
                    "credentials": params["credentials"],
                    "num_vms": requested_cores,
                    "group": random_name, 
                    "image_id": "ami-b1a5bed8",
                    "instance_type": "t1.micro",
                    "keyname": random_name,
                    "use_spot_instances": False,
                    "queue": taskid
                }
                #NOTE: We are forcing blocking mode in the InfrastructureManager due to GAE, but
                # the slaves don't really need to be started in blocking mode.
                print "Launching slaves..."
                launch_result = self.startMachines(launch_params)
                if not launch_result["success"]:
                    logging.info("executeTask : failed to start enough slave machines for mcem2 job")
                    return
                print "Done."
                params["queue"] = taskid
                tmp = master_task.delay(taskid, params)
                result["celery_pid"] = tmp.id
            else:
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
        logging.info("checkTaskStatusLocal : inside with params %s", str(pids))
        try:
            for pid in pids:
                try:
                    os.kill(pid, 0)
                    res[pid] = True
                except Exception,e:
                    res[pid] = False
            logging.info("checkTaskStatusLocal : exiting with result : %s", str(res))
            return res
        except Exception as e:
            logging.error("checkTaskStatusLocal: Exiting with error : %s", str(e))
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
    
    def deleteTasks(self, taskids):
        '''
        @param taskid:the list of taskids to be removed 
        this method revokes scheduled tasks as well as the tasks in progress. It 
        also removes task from the database. It ignores the taskids which are not active.
        '''
        logging.info("deleteTasks : inside method with taskids : %s", taskids)
        try:
            for taskid_pair in taskids:
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
    
    def startMachines(self, params, block=False):
        '''
        This method instantiates ec2 instances
        '''

        logging.info("startMachines : inside method with params : %s", str(params))
        try:
            #make sure that any keynames we use are prefixed with stochss so that
            #we can do a terminate all based on keyname prefix
            key_name = params["keyname"]
            if not key_name.startswith(self.KEYPREFIX):
                params['keyname'] = self.KEYPREFIX + key_name
            # NOTE: We are forcing blocking mode within the InfrastructureManager class
            # for the launching of VMs because of how GAE joins on all threads before
            # returning a response from a request.
            i = InfrastructureManager(blocking=block)
            res = {}
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.
            compute_check_params = {
                "credentials": params["credentials"],
                "key_prefix": params["key_prefix"]
            }
            if self.isOneOrMoreComputeNodesRunning(compute_check_params):
                res = i.run_instances(params,[])
            else:
                queue_head_ami = "ami-f75a409e"
                # Need to start the queue head (RabbitMQ)
                params["queue_head"] = True
                vms_requested = int(params["num_vms"])
                requested_image_id = params["image_id"]
                requested_key_name = params["keyname"]
                # Only want one queue head, and it must have its own key so
                # it can be differentiated if necessary
                params["num_vms"] = 1
                params["image_id"] = queue_head_ami
                params["keyname"] = requested_key_name+'-queuehead'
                res = i.run_instances(params,[])
                #NOTE: This relies on the InfrastructureManager being run in blocking mode...
                queue_head_ip = res["vm_info"]["public_ips"][0]
                self.__update_celery_config_with_queue_head_ip(queue_head_ip)
                #TODO: See TODO in __update_celery_config_with_queue_head_ip
                #      Basically broker will always be unreachable in GAE in this
                #      scenario...
                # Need to make sure that the queue is actually reachable because
                # we don't want the user to try to submit a task and have it
                # timeout because the broker server isn't up yet.
                # sleep_time = 5
                # total_wait_time = 60
                # total_tries = total_wait_time / sleep_time
                # current_try = 0
                # print "About to check broker at:", celery.current_app.conf['BROKER_URL']
                # while True:
                #     try:
                #         insp = inspect().stats()
                #     except IOError as e:
                #         current_try += 1
                #         print "Broker down, try: {0}, exception: {1}".format(current_try, e)
                #         if current_try >= total_tries:
                #             print "Broker unreachable for {0} seconds. Fatal error.".format(total_wait_time)
                #             return
                #         time.sleep(sleep_time)
                #         continue
                #     print "Broker up"
                #     break
                params["image_id"] = requested_image_id
                params["keyname"] = requested_key_name
                params["queue_head"] = False
                if vms_requested > 1:
                    params["num_vms"] = vms_requested - 1
                    res = i.run_instances(params,[])
                params["num_vms"] = vms_requested
            logging.info("startMachines : exiting method with result : %s", str(res))
            return res
        except Exception, e:
            logging.error("startMachines : exiting method with error : %s", str(e))
            print "startMachines : exiting method with error : %s", str(e)
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
        elif "key_prefix" in params: #and params["key_prefix"].startswith(key_prefix)
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


if __name__ == "__main__":

    '''Note that these must be set for this function to work properly:
        export STOCHSS_HOME=/path/to/stochss/git/dir/stochss
        export PYTHONPATH=${STOCHSS_HOME}:.:..
        export PATH=${PATH}:${STOCHSS_HOME}/StochKit
        export DYLD_LIBRARY_PATH=${STOCHSS_HOME}/StochKit/libs/boost_1_53_0/stage/lib
    '''

    logging.basicConfig(filename='testoutput.log',filemode='w',level=logging.DEBUG)
    try:
       access_key = os.environ["EC2_ACCESS_KEY"]
       secret_key = os.environ["EC2_SECRET_KEY"]
    except KeyError:
       print "main: Environment variables EC2_ACCESS_KEY and EC2_SECRET_KEY not set, cannot continue"
       sys.exit(1)

    os.environ["AWS_ACCESS_KEY_ID"] = access_key
    os.environ["AWS_SECRET_ACCESS_KEY"] = secret_key

    # infra = backendservices.INFRA_EC2
    obj = backendservices()
    credentials = {
      'EC2_ACCESS_KEY': access_key,
      'EC2_SECRET_KEY': secret_key
    }
    compute_check_params = {
        "credentials": credentials
    }
    started_queue_head = False
    queue_key = None
    if obj.isOneOrMoreComputeNodesRunning(compute_check_params):
        print "Assuming you already have a queue head up and running..."
    else:
        started_queue_head = True
        print "Launching queue head / master worker..."
        keypair_name = obj.KEYPREFIX+"-ch-stochoptim-testing"
        launch_params = {
            "infrastructure": obj.INFRA_EC2,
            "credentials": credentials,
            "num_vms": 1,
            "group": keypair_name,
            "image_id": "ami-b1a5bed8",
            "instance_type": "t1.micro",
            "key_prefix": keypair_name,
            "keyname": keypair_name,
            "use_spot_instances": False
        }
        launch_result = obj.startMachines(launch_params, block=True)
        if not launch_result["success"]:
            print "Failed to start master machine..."
            sys.exit(1)
        queue_key = launch_result[""]
        print "Done."
    
    file_dir_path = os.path.dirname(os.path.abspath(__file__))
    path_to_model_file = os.path.join(file_dir_path, "../../../stochoptim/inst/extdata/birth_death_MAImodel.R")
    path_to_model_data_file = os.path.join(file_dir_path, "../../../../Downloads/birth_death_MAdata.txt")
    params = {
        'credentials':{'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key},
        "key_prefix": keypair_name,
        "job_type": "mcem2",
        "cores": 1,
        "model_file": open(path_to_model_file, 'r').read(),
        "model_data": open(path_to_model_data_file, 'r').read(),
        "bucketname": "chstochoptim",
        "paramstring": "exec/mcem2.r --steps CEU --seed 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1"
    }
    print "\nCalling executeTask now..."
    result = obj.executeTask(params)
    if result["success"]:
        print "Succeeded..."
        key_name = result["key_name"]
        task_id = result["db_id"]
        describe_task_params = {
            "AWS_ACCESS_KEY_ID": access_key,
            "AWS_SECRET_ACCESS_KEY": secret_key,
            "taskids": [task_id]
        }
        print "\nCalling describeTask..."
        desc_result = obj.describeTask(describe_task_params)[task_id]
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
            time.sleep(20)
            print "\nCalling describeTask..."
            desc_result = obj.describeTask(describe_task_params)[task_id]
        print "Finished..."
        print desc_result["output"]
        terminate_params = {
            "credentials": {
                "EC2_ACCESS_KEY": access_key,
                "EC2_SECRET_KEY": secret_key
            },
            "key_prefix": keypair_name
        }
        print "\nStopping all VMs..."
        if obj.stopMachines(terminate_params):
            print "Stopped all machines!"
        else:
            print "Failed to stop machines..."
    else:
        print "Failed..."
        print result["exception"]
        print result["traceback"]
    
    #NOTE: Uncomment this for normal testing routine.
"""    params['infrastructure'] = infra
    params['num_vms'] = 1
    params['group'] = 'stochss'
    params['instance_type'] = 't1.micro'
    #stochss will prefix whatever keyname you give here: stochss_stochssnew32
    params['keyname'] = 'cjknew32'
    params['use_spot_instances'] = False
    if infra == backendservices.INFRA_EC2 :
        params['image_id'] = 'ami-851937ec'
    else :
        raise TypeError("Error, unexpected infrastructure type: "+infra)

    print 'valid creds? '+str(obj.validateCredentials(params))
    print 'for params: '+str(params)
    #print 'Exiting main... remove this if you would like to continue testing'
    #sys.exit(0)

    if obj.validateCredentials(params) :
	print 'startMachines is commented out -- there better be an instance started! (or uncomment)'
        #res = obj.startMachines(params,True)
        #if res is None :
            #raise TypeError("Error, startMachines failed!")

	#this is only used for cloud task deployment, this verifies that it can be created with creds
        credentials = params['credentials']
        os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
        os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']
        print 'access key: '+os.environ["AWS_ACCESS_KEY_ID"]
        createtable(backendservices.TABLENAME)

	print 'describeMachines outputs to the testoutput.log file'
        obj.describeMachines(params)

	#Test that local tasks execute and can be deleted
        #NOTE: dimer_decay.xml must be in this local dir
	xmlfile = open('dimer_decay.xml','r')
	doc = xmlfile.read()
	xmlfile.close()

	############################
	print 'testing local task execution...'
        taskargs = {}
	pids = []
	NUMTASKS = 1
	for i in range(NUMTASKS):
            taskargs['paramstring'] = 'ssa -t 100 -i 10 -r 10 --keep-trajectories --seed 706370 --label'
            taskargs['document'] = doc
            res = obj.executeTaskLocal(taskargs)
	    if res is not None:
	        print 'results: {0}'.format(str(res))
	        pids.append(res['pid'])
	print 'number of pids: {0} {1}'.format(str(len(pids)),str(pids))

    	res  = obj.checkTaskStatusLocal(pids)
	if res is not None:
	    print 'status: {0}'.format(str(res))

	time.sleep(5) #need to sleep here to allow for process spawn
	print 'deleting pids: {0}'.format(str(pids))
	obj.deleteTaskLocal(pids)    

	############################
	print 'testing cloud task execution...'
        taskargs = {}
	pids = []
	taskargs['AWS_ACCESS_KEY_ID'] = credentials['EC2_ACCESS_KEY']
        taskargs['AWS_SECRET_ACCESS_KEY'] = credentials['EC2_SECRET_KEY']
	NUMTASKS = 4
	for i in range(NUMTASKS):
            taskargs['paramstring'] = 'ssa -t 100 -i 100 -r 100 --keep-trajectories --seed 706370 --label'
            taskargs['document'] = doc
    	    taskargs['bucketname'] = 'cjk4321'
        cloud_result = obj.executeTask(taskargs)
        res = cloud_result["celery_pid"]
        taskid = cloud_result["db_id"]
  	    pids.append(taskid)

	taskargs['taskids'] = pids
	done = {}
	count = NUMTASKS
	while len(done) < count :
	    for i in pids:
                task_status = obj.describeTask(taskargs)
                job_status = task_status[i]  #may be None
		if job_status is not None:
		    print 'task id {0} status: {1}'.format(str(i),job_status['status'])
		    if job_status['status'] == 'finished':
		        done[i] = True
		    elif job_status['status'] == 'active':
			print '\tDELETING task {0}'.format(str(i))
			count = count - 1
			obj.deleteTasks([i])    
		else :
		    print 'task id {0} status is None'.format(str(i))

	print '{0} jobs have finished!'.format(len(done))

	############################
        #this terminates instances associated with this users creds and KEYPREFIX keyname prefix
	print 'stopMachines outputs to the testoutput.log file'
	print 'stopMachines is commented out -- be sure to terminate your instances or uncomment!'
        #res = obj.stopMachines(params)
        #print 'output from stopMachines: {0}'.format(str(res))
"""