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
import celery
from celery.task.control import inspect
import backend_handler
from backend_handler import VMStateModel
from databases.dynamo_db import DynamoDB

import common.helper as helper
from common.config import AgentTypes

class backendservices(object):
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
        INFRA_EC2: 'ami-a26924ca'
    }
    VMSTATUS_IDS = 'ids'

    def __init__(self):
        '''
        constructor to set the path of various libraries
        ''' 
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/boto'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/celery'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 
                                     '/Library/Python/2.7/site-packages/amqp'))
            
    def executeTask(self, params, agent, access_key, secret_key, task_id=None,
                    instance_type=None, cost_replay=False, database=None):
        if not database:
            database = DynamoDB(access_key, secret_key)

        if not agent:
            agent = AgentTypes.EC2

        # if there is no taskid explicit, create one the first run
        if not task_id:
            task_id = str(uuid.uuid4())

        result = helper.execute_cloud_task(params=params, agent=agent, access_key=access_key, secret_key=secret_key,
                                  task_id=task_id, instance_type=instance_type, cost_replay=cost_replay, database=database)

        return result
    
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
    
    
    def describeTask(self, params, database=None):
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
        if not database:
            database = DynamoDB(params['AWS_ACCESS_KEY_ID'], params['AWS_SECRET_ACCESS_KEY'])
        result = {}
        try:
            result = database.describetask(params['taskids'], backendservices.TABLENAME)
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
    
    def deleteTasks(self, taskids, database=None):
        '''
        @param taskid:the list of taskids to be removed 
        this method revokes scheduled tasks as well as the tasks in progress. It 
        also removes task from the database. It ignores the taskids which are not active.
        '''
        if not database:
            database = DynamoDB(os.environ["AWS_ACCESS_KEY_ID"], os.environ["AWS_SECRET_ACCESS_KEY"])
            
        logging.info("deleteTasks : inside method with taskids : %s", taskids)
        try:
            for taskid_pair in taskids:
                print 'deleteTasks: removing task {0}'.format(str(taskid_pair))
                removeTask(taskid_pair[0]) #this removes task from celery queue
                database.removetask(backendservices.TABLENAME,taskid_pair[1]) #this removes task information from DB. ToDo: change the name of method
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
    
        
    def isOneOrMoreComputeNodesRunning(self, params, ins_type=None):# credentials):
        '''
        Checks for the existence of running compute nodes. Only need one of running compute node
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
            if ins_type:
                for vm in all_vms:
                    if vm != None and vm['state'] == 'running' and vm['instance_type'] == ins_type:
                        return True
            else:
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
            
            # 1. change the status of 'failed' in the previous launch in db to 'terminated' 
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.

            ins_ids = VMStateModel.terminate_not_active(params)
            
            # 2. get credentials
            infra = None
            access_key = None
            secret_key = None
            if 'infrastructure' in params:
                infra = params['infrastructure']
            else:
                raise Exception('VMStateModel ERROR: Infrastructure is not decided.')
                return False, 'Infrastructure is not decided.'
             
            if 'credentials' in params:
                if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                    access_key = params['credentials']['EC2_ACCESS_KEY']
                    secret_key = params['credentials']['EC2_SECRET_KEY']
                else:
                    raise Exception('VMStateModel ERROR: Cannot get access key or secret.')
                    return False, 'Cannot get access key or secret of the current infrastructure.'
            else:
                raise Exception('VMStateModel ERROR: No credentials are provided.')
                return False, 'No credentials are provided.'
            
            if infra is None or access_key is None or secret_key is None:
                raise Exception('VMStateModel ERROR: Either infrastracture or credetials is none.')
                return False, 'Either infrastracture or credetials is none.'
            # 3. create exact number of entities in db for this launch, and set the status to 'creating'
            ids = []
            num = 0
            if 'vms' in params:
                for vm in params['vms']:
                    logging.info('vm: {0}, num: {1}'.format(vm['instance_type'], vm['num_vms']))
                    num += vm['num_vms']
            if 'head_node' in params:
                num += 1
                
            for _ in range(0, num):
                
                vm_status = VMStateModel(state = VMStateModel.STATE_CREATING, infra = infra, access_key = access_key, secret_key = secret_key)
                vm_status.put()         
                ids.append(vm_status.key().id())
            
            params[VMStateModel.IDS] = ids
            
            
            res = i.run_instances(params,[])
            #res = i.run_instances(params,[])
#            else:
#                # Need to start the queue head (RabbitMQ)
#                params["queue_head"] = True
#                vms_requested = int(params["num_vms"])
#                requested_key_name = params["keyname"]
#                # Only want one queue head, and it must have its own key so
#                # it can be differentiated if necessary
#                params["num_vms"] = 1
#                params["keyname"] = requested_key_name+'-'+self.QUEUEHEAD_KEY_TAG
#                res = i.run_instances(params,[])
#                #NOTE: This relies on the InfrastructureManager being run in blocking mode...
#                queue_head_ip = res["vm_info"]["public_ips"][0]
#                self.__update_celery_config_with_queue_head_ip(queue_head_ip)
#                params["keyname"] = requested_key_name
#                params["queue_head"] = False
#                if vms_requested > 1:
#                    params["num_vms"] = vms_requested - 1
#                    res = i.run_instances(params,[])
#                params["num_vms"] = vms_requested
            logging.info("startMachines : exiting method with result : %s", str(res))
            return True, None
        except Exception, e:
            traceback.print_exc()
            logging.error("startMachines : exiting method with error : {0}".format(str(e)))
            print "startMachines : exiting method with error :", str(e)
            return False, 'Errors occur in starting machines:'+str(e)
 
        
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
            # update db
            VMStateModel.terminate_all(params)
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
        #logging.info("describeMachines : inside method with params : %s", str(params))
        key_prefix = ""
        if "key_prefix" in params:
            key_prefix = params["key_prefix"]
            if not key_prefix.startswith(self.KEYPREFIX):
                key_prefix = self.KEYPREFIX + key_prefix
        else:
            key_prefix = self.KEYPREFIX
        params["key_prefix"] = key_prefix
        try:
            i = InfrastructureManager()
            res = i.describe_instances(params, [], key_prefix)
            logging.info("describeMachines : exiting method with result : %s", str(res))
            return res
        except Exception, e:
            logging.error("describeMachines : exiting method with error : %s", str(e))
            return None
    
    def describeMachinesFromDB(self, params):
        i = InfrastructureManager()
        i.synchronize_db(params)
        all_vms = VMStateModel.get_all(params)
        return all_vms
        
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
def teststochss(backend,params,database=None):
    '''
    This tests a stochkit job using a local run (2 tasks)
    and a cloud run (2 tasks)
    It can also test describe* and start/stop Machines
    '''
    if not database:
            database = DynamoDB(os.environ["AWS_ACCESS_KEY_ID"], os.environ["AWS_SECRET_ACCESS_KEY"])
            
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
        database.createtable(backendservices.TABLENAME)

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
