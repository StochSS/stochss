'''
This class exposes all the services offered by the backend
It accepts calls from the front-end and pass them on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import uuid
import logging
from tasks import *

import boto
from boto.exception import S3ResponseError
from boto.s3.connection import S3Connection

from databases.dynamo_db import DynamoDB
from databases.flex_db import FlexDB

import common.helper as helper
from common.config import AgentTypes, JobDatabaseConfig, AgentConfig, FlexConfig, JobConfig
from vm_state_model import VMStateModel

class backendservices(object):
    ''' 
    constructor for the backend service class.
    It should be passed the agent creds
    '''

    # Class Constants
    INFRA_SUPPORTED = [AgentTypes.EC2, AgentTypes.FLEX]

    def __init__(self, **kwargs):
        '''
        constructor to set the path of various libraries and infra type
        '''
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/boto'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/celery'))
        sys.path.append(os.path.join(os.path.dirname(__file__),
                                     '/Library/Python/2.7/site-packages/amqp'))

        self.infrastructure = kwargs.get("infrastructure", AgentTypes.EC2)
        if self.infrastructure not in backendservices.INFRA_SUPPORTED:
            raise Exception("Infrastructure {0} not supported!".format(self.infrastructure))

    def deregister_flex_cloud(self, parameters, blocking=True):
        try:
            i = InfrastructureManager(blocking=blocking)
            res = i.deregister_instances(parameters=parameters, terminate=False)
            ret = True

        except Exception, e:
            logging.error("deregister_flex_cloud() failed with error : %s", str(e))
            ret = False

        finally:
            # update db
            # VMStateModel.terminate_all(parameters)
            pass

        return ret


    def submit_cloud_task(self, params, agent_type, ec2_access_key=None, ec2_secret_key=None, task_id=None,
                    instance_type=None, cost_replay=False, database=None, flex_db_credentials=None):

        logging.info('agent_type = {0}'.format(agent_type))
        logging.info('params =\n{}\n\n'.format(pprint.pformat(params)))

        if agent_type not in JobConfig.SUPPORTED_AGENT_TYPES:
            raise Exception('Unsupported agent type = {}!'.format(agent_type))

        if agent_type == AgentTypes.EC2:
            if ec2_access_key == None or ec2_access_key == '':
                raise Exception('EC2 Access Key is not valid!')
            if ec2_secret_key == None or ec2_secret_key == '':
                raise Exception('EC2 Secret Key is not valid!')

        if not database:
            if agent_type == AgentTypes.EC2:
                database = DynamoDB(ec2_access_key, ec2_secret_key)

            elif agent_type == AgentTypes.FLEX:
                database = FlexDB(ip=flex_db_credentials['queue_head_ip'],
                                  password=flex_db_credentials['flex_db_password'])

        # if there is no taskid explicit, create one the first run
        if not task_id:
            task_id = str(uuid.uuid4())

        logging.info('submit_cloud_task: task_id = {}'.format(task_id))

        result = helper.execute_cloud_task(params=params, agent_type=agent_type,
                                           ec2_access_key=ec2_access_key,
                                           ec2_secret_key=ec2_secret_key,
                                           task_id=task_id, instance_type=instance_type,
                                           cost_replay=cost_replay,
                                           database=database)

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

            paramstr = params['paramstring']
            uuid_str = str(uuid.uuid4())
            res['uuid'] = uuid_str
            create_dir_str = "mkdir -p output/%s " % uuid_str
            os.system(create_dir_str)

            # Write the model document to file
            xmlfilepath = "output/" + uuid_str + "/" + uuid_str + ".xml"
            xmlfilepath = os.path.abspath(xmlfilepath)
            mfhandle = open(xmlfilepath, 'w')
            mfhandle.write(params['document'])
            mfhandle.close()

            # Pipe output to these files
            res['stdout'] = os.path.abspath(os.path.join('output', uuid_str, 'stdout'))
            res['stderr'] = os.path.abspath(os.path.join('output', uuid_str, 'stderr'))

            # The following executiong string is of the form :
            # stochkit_exec_str = "ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuid_str)
            stochkit_exec_str = "{backenddir}/wrapper.py {stdout} {stderr} {0} --model {1} --out-dir output/{2}/result ".format(
                paramstr, xmlfilepath, uuid_str, stdout=res['stdout'], stderr=res['stderr'],
                backenddir=os.path.abspath(os.path.dirname(__file__)))

            logging.info("STOCHKIT_EXEX_STR: {0}".format(stochkit_exec_str))
            logging.debug("executeTaskLocal : Spawning StochKit Task. String : %s",
                          stochkit_exec_str)

            p = subprocess.Popen(stochkit_exec_str.split(), stdin=subprocess.PIPE)

            # logging.debug("executeTaskLocal: the result of task {0} or error {1} ".format(output,error))
            pid = p.pid

            res['pid'] = pid
            logging.debug("executeTaskLocal : PID generated - %s", pid)
            filepath = os.path.join('output', uuid_str)
            absolute_file_path = os.path.abspath(filepath)
            logging.debug("executeTaskLocal : Output file - %s", absolute_file_path)
            res['output'] = absolute_file_path

            logging.info("executeTaskLocal: exiting with result : %s", str(res))
            return res

        except Exception as e:
            logging.error("executeTaskLocal : exception raised : %s", str(e))
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
                except Exception, e:
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
        raise NotImplementedError


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
        logging.info('describeTask: params =\n{}'.format(pprint.pformat(params)))

        if params['agent_type'] == AgentTypes.EC2:
            os.environ["AWS_ACCESS_KEY_ID"] = params['AWS_ACCESS_KEY_ID']
            os.environ["AWS_SECRET_ACCESS_KEY"] = params['AWS_SECRET_ACCESS_KEY']
            database = DynamoDB(access_key=params['AWS_ACCESS_KEY_ID'],
                                secret_key=params['AWS_SECRET_ACCESS_KEY'])

        elif params['agent_type'] == AgentTypes.FLEX:
            database = FlexDB(password=params['flex_db_password'],
                              ip=params['queue_head_ip'])

        else:
            logging.error('Invalid agent type!')
            return None

        result = {}
        try:
            result = database.describetask(params['taskids'], JobDatabaseConfig.TABLE_NAME)
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
            remove_task(task_id)
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
                remove_task(taskid_pair[0])  # this removes task from celery queue
                database.removetask(JobDatabaseConfig.TABLE_NAME,
                                    taskid_pair[1])
                # this removes task information from DB. ToDo: change the name of method
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


    def __create_dynamodb_stochss_table(self, ec2_access_key, ec2_secret_key):
        database = DynamoDB(ec2_access_key, ec2_secret_key)
        result = database.createtable(JobDatabaseConfig.TABLE_NAME)
        if result:
            logging.info("creating table {0}".format(JobDatabaseConfig.TABLE_NAME))
        else:
            logging.error("FAILED on creating table {0}".format(JobDatabaseConfig.TABLE_NAME))

    def __get_required_parameter(self, parameter_key, params):
        if parameter_key in params and params[parameter_key] != None:
            return params[parameter_key]

        raise Exception('Error: {0} is not given in params.'.format(parameter_key))


    def __create_vm_state_model_entries(self, infrastructure, num_vms,
                                        ec2_secret_key, ec2_access_key,
                                        user_id, reservation_id):
        logging.info('__create_vm_state_model_entries')
        logging.info('num_vms = {0} user_id = {1} reservation_id = {2}'.format(num_vms, user_id, reservation_id))

        ids = []
        for _ in xrange(num_vms):
            vm_state = VMStateModel(state=VMStateModel.STATE_CREATING,
                                    infra=infrastructure,
                                    ec2_access_key=ec2_access_key,
                                    ec2_secret_key=ec2_secret_key,
                                    user_id=user_id,
                                    res_id=reservation_id)
            vm_state.put()
            ids.append(vm_state.key().id())

        logging.info('__create_vm_state_model_entries: ids = {0}'.format(ids))
        return ids

    def prepare_flex_cloud_machines(self, params, blocking=False):
        logging.info("prepare_flex_cloud_machines : params : \n%s", pprint.pformat(params))

        try:
            # NOTE: We are forcing blocking mode within the InfrastructureManager class
            # for the launching of VMs because of how GAE joins on all threads before
            # returning a response from a request.
            i = InfrastructureManager(blocking=blocking)
            res = {}

            # 1. change the status of 'failed' in the previous launch in db to 'terminated'
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.

            VMStateModel.terminate_not_active(params)

            # 2. get user_id, infra, ec2 credentials

            user_id = self.__get_required_parameter(parameter_key='user_id', params=params)
            infrastructure = self.__get_required_parameter(parameter_key='infrastructure', params=params)

            ec2_access_key = ''
            ec2_secret_key = ''

            if 'credentials' in params:
                if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                    ec2_access_key = params['credentials']['EC2_ACCESS_KEY']
                    ec2_secret_key = params['credentials']['EC2_SECRET_KEY']

            logging.info('ec2_access_key = {0} ec2_secret_key = {1}'.format(ec2_access_key, ec2_secret_key))

            # 3. create exact number of entities in db for this launch, and set the status to 'creating'
            num_vms = len(params['flex_cloud_machine_info'])
            logging.info('num_vms = {0}'.format(num_vms))

            reservation_id = params['reservation_id']
            logging.info('flex: reservation_id = {0}'.format(reservation_id))

            ids = self.__create_vm_state_model_entries(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key,
                                                       infrastructure=infrastructure, num_vms=num_vms, user_id=user_id,
                                                       reservation_id=reservation_id)

            # 4. Prepare Instances
            params[VMStateModel.IDS] = ids
            res = i.prepare_instances(params)

            logging.info("prepare_flex_cloud_machines : exiting method with result : %s", str(res))
            return True, None

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_flex_cloud_machines : exiting method with error : {0}".format(str(e)))
            return False, 'Errors occur in preparing machines:' + str(e)


    def start_ec2_vms(self, params, blocking=False):
        '''
        This method instantiates EC2 vm instances
        '''
        logging.info("start_ec2_vms : inside method with params : \n%s", pprint.pformat(params))
        try:
            # make sure that any keynames we use are prefixed with stochss so that
            #we can do a terminate all based on keyname prefix
            key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.infrastructure,
                                                          key_prefix=params.get('key_prefix', ''))

            key_name = params["keyname"]
            if not key_name.startswith(key_prefix):
                params['keyname'] = key_prefix + key_name

            # NOTE: We are forcing blocking mode within the InfrastructureManager class
            # for the launching of VMs because of how GAE joins on all threads before
            # returning a response from a request.
            i = InfrastructureManager(blocking=blocking)
            res = {}

            # 1. change the status of 'failed' in the previous launch in db to 'terminated' 
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.

            ins_ids = VMStateModel.terminate_not_active(params)

           # 2. get user_id, infra, ec2 credentials

            user_id = self.__get_required_parameter(parameter_key='user_id', params=params)
            infrastructure = self.__get_required_parameter(parameter_key='infrastructure', params=params)
            reservation_id = self.__get_required_parameter(parameter_key='reservation_id', params=params)

            logging.info('ec2: reservation_id = {0}'.format(reservation_id))

            if 'credentials' in params:
                if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                    ec2_access_key = params['credentials']['EC2_ACCESS_KEY']
                    ec2_secret_key = params['credentials']['EC2_SECRET_KEY']
                else:
                    raise Exception('VMStateModel ERROR: Cannot get access key or secret.')
            else:
                raise Exception('VMStateModel ERROR: No credentials are provided.')

            if ec2_access_key is None or ec2_secret_key is None:
                raise Exception('VMStateModel ERROR: ec2 credentials are not valid.')

            # 3. create exact number of entities in db for this launch, and set the status to 'creating'
            num_vms = 0
            if 'vms' in params:
                for vm in params['vms']:
                    logging.info('vm: {0}, num: {1}'.format(vm['instance_type'], vm['num_vms']))
                    num_vms += vm['num_vms']
            if 'head_node' in params:
                num_vms += 1

            logging.info('num = {0}'.format(num_vms))

            ids = self.__create_vm_state_model_entries(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key,
                                                       infrastructure=infrastructure, num_vms=num_vms, user_id=user_id,
                                                       reservation_id=reservation_id)

            # 4. Prepare Instances
            params[VMStateModel.IDS] = ids
            res = i.prepare_instances(params)
            
            # 5, check and create stochss table exists if it does not exist
            self.__create_dynamodb_stochss_table(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key)

            logging.info("start_ec2_vms : exiting method with result : %s", str(res))
            return True, None

        except Exception, e:
            traceback.print_exc()
            logging.error("start_ec2_vms : exiting method with error : {0}".format(str(e)))
            return False, 'Errors occur in starting machines:' + str(e)


    def isOneOrMoreComputeNodesRunning(self, params, ins_type=None):  # credentials):
        '''
        Checks for the existence of running compute nodes. Only need one of running compute node
        to be able to run a job in the cloud.
        '''
        credentials = params["credentials"]

        key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.infrastructure,
                                                      key_prefix=params.get('key_prefix', ''))

        try:
            parameters = {
                "infrastructure": self.infrastructure,
                "credentials": credentials,
                "key_prefix": key_prefix
            }

            if self.infrastructure == AgentTypes.FLEX:
                parameters['flex_cloud_machine_info'] = params['flex_cloud_machine_info']

            all_vms = self.describeMachines(parameters)
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

    def stop_ec2_vms(self, params, blocking=False):
        '''
        This method would terminate all the EC2 instances associated with the account
	    that have a keyname prefixed with stochss (all instances created by the backend service)
	    params must contain credentials key/value
        '''
        key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.infrastructure,
                                                      key_prefix=params.get('key_prefix', ''))
        try:
            logging.info("Stopping compute nodes with key_prefix: {0}".format(key_prefix))
            i = InfrastructureManager(blocking=blocking)
            res = i.deregister_instances(parameters=params, terminate=True)
            ret = True

        except Exception, e:
            logging.error("Terminate machine failed with error : %s", str(e))
            ret = False

        finally:
            # update db
            VMStateModel.terminate_all(params)

        return ret

    def describeMachines(self, params):
        '''
        This method gets the status of all the instances
        '''
        # add calls to the infrastructure manager for getting details of machines
        logging.debug("params =\n%s", pprint.pformat(params))

        key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.infrastructure,
                                                      key_prefix=params.get('key_prefix', ''))
        logging.info('key_prefix = {0}'.format(key_prefix))

        params["key_prefix"] = key_prefix
        try:
            i = InfrastructureManager()
            res = i.describe_instances(params, [], key_prefix)
            logging.debug("instances = \n%s", pprint.pformat(res))
            return res

        except Exception, e:
            logging.error("error : %s", str(e))
            return None

    def describe_machines_from_db(self, params):
        i = InfrastructureManager()
        i.synchronize_db(params)
        all_vms = VMStateModel.get_all(params)
        return all_vms

    def validateCredentials(self, params):
        '''
        This method verifies the validity of ec2 credentials
        '''
        if params['infrastructure'] is None:
            logging.error("validateCredentials: infrastructure param not set")
            return False

        creds = params['credentials']
        if creds is None:
            logging.error("validateCredentials: credentials param not set")
            return False
        if creds['EC2_ACCESS_KEY'] is None:
            logging.error("validateCredentials: credentials EC2_ACCESS_KEY not set")
            return False
        if creds['EC2_SECRET_KEY'] is None:
            logging.error("validateCredentials: credentials EC2_ACCESS_KEY not set")
            return False

        logging.info("validateCredentials: inside method with params : %s", str(params))
        try:
            i = InfrastructureManager()
            logging.info("validateCredentials: exiting with result : %s", str(i))
            return i.validate_credentials(params)

        except Exception, e:
            logging.error("validateCredentials: exiting with error : %s", str(e))
            return False

    @staticmethod
    def __get_remote_command_string(command, ip, username, keyfile):
        return "ssh -o 'StrictHostKeyChecking no' -i {keyfile} {username}@{ip} \"{command}\"".format(keyfile=keyfile,
                                                                                                     username=username,
                                                                                                     command=command,
                                                                                                     ip=ip)

    @staticmethod
    def get_random_alphanumeric(length=10):
        return str(uuid.uuid4()).replace('-', '')[:length]

    @staticmethod
    def validate_flex_cloud_info(machine_info, user_id):
        logging.debug('machine_info =\n{0}'.format(pprint.pformat(machine_info)))

        is_valid = True
        error_reason = None

        # get queue head and validate its creds
        queue_head = None
        errors = []
        for machine in machine_info:
            logging.debug('machine = {}'.format(machine))

            keyfile = machine["keyfile"]

            logging.debug('keyfile = {0}'.format(keyfile))

            if not os.path.exists(keyfile):
                error_message = 'Could not find {keyname} at {keyfile}!'.format(keyname=keyname, keyfile=keyfile)
                logging.error(error_message)
                errors.append(error_message)
                is_valid = False

            if machine['queue_head'] == True:
                if queue_head != None:
                    error_message = 'There cannot be only one queue head!'
                    logging.error(error_message)
                    errors.append(error_message)
                    is_valid = False

                else:
                    queue_head = machine
                    logging.info("queue head = {0}".format(queue_head))
                    cmd = "[ -d ~/stochss ] && echo yes".format(username=queue_head["username"])
                    remote_cmd = backendservices.__get_remote_command_string(command=cmd,
                                                                            keyfile=keyfile,
                                                                            username=queue_head["username"],
                                                                            ip=queue_head["ip"])
                    result = os.system(remote_cmd)

                    logging.info("Result of \n{0} \n= {1}".format(remote_cmd, result))
                    if result == 0:
                        logging.info('Validation successful!')
                    else:
                        error_message = 'Could not successfully connect to queue head with ip: {ip}!'.format(ip=queue_head['ip'])
                        logging.error(error_message)
                        errors.append(error_message)
                        is_valid = False

        if queue_head == None:
            error_message = 'Could not find any queue_head in machine info !'
            logging.error(error_message)
            errors.append(error_message)
            is_valid = False

        if errors != []:
            error_reason = '\n'.join(errors)
        return is_valid, error_reason


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
                except S3ResponseError:
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
        try:
            logging.info("fetchOutput: inside method with taskid : {0} and url {1}".format(taskid, outputurl))
            filename = "{0}.tar".format(taskid)

            logging.debug("fetchOutput : the name of file to be fetched : {0}".format(filename))

            logging.debug("url to be fetched : {0}".format(taskid))
            fetch_url_cmd_str = "curl --remote-name {0}".format(outputurl)
            logging.debug("fetchOutput : Fetching file using command : {0}".format(fetch_url_cmd_str))
            os.system(fetch_url_cmd_str)
            if not os.path.exists(filename):
                logging.error('unable to download file. Returning result as False')
                return False
            return True
        except Exception, e:
            logging.error("fetchOutput : exiting with error : %s", str(e))
            return False

