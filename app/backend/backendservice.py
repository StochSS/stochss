'''
This class exposes all the services offered by the backend
It accepts calls from the front-end and pass them on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import uuid
import re
import urllib2
import json
import shlex
import logging
from tasks import *

import boto
from boto.exception import S3ResponseError
from boto.s3.connection import S3Connection

from databases.dynamo_db import DynamoDB
from databases.flex_db import FlexDB
from storage.s3_storage import S3StorageAgent
from storage.flex_storage import FlexStorageAgent

import common.helper as helper
from common.config import AgentTypes, JobDatabaseConfig, AgentConfig, FlexConfig, JobConfig
from db_models.vm_state_model import VMStateModel
from celery.result import AsyncResult

sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))
#from s3_helper import *
import s3_helper


class backendservices(object):
    ''' 
    constructor for the backend service class.
    It should be passed the agent creds
    '''

    # Class Constants
    INFRA_SUPPORTED = [AgentTypes.EC2, AgentTypes.FLEX]
    
    FLEX_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.FLEX)
    EC2_CLOUD_RESOURCE = "{0}-cloud".format(AgentTypes.EC2)
    SUPPORTED_CLOUD_RESOURCES = [EC2_CLOUD_RESOURCE, FLEX_CLOUD_RESOURCE]

    # Hack
    # TODO: Query File Wrapper to get flex ssh key file dirname
    FLEX_SSH_KEYFILE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tmp'))

    def __init__(self, user_data):
        '''
        constructor
        '''
        self.user_data = user_data
        self.database_connections = {}
        self.active_agent_type = None
    
    def get_credentials(self):
        ''' Get the user_data credentials'''
        ret = self.user_data.getCredentials()
        #TODO how return these conditionally
        flex_queue_head_machine = self.user_data.get_flex_queue_head_machine()
        ret['flex_db_password'] = self.user_data.flex_db_password
        ret['queue_head_ip'] = ''
        if flex_queue_head_machine is not None and 'ip' in flex_queue_head_machine:
            ret['queue_head_ip'] = flex_queue_head_machine['ip']
        ret['queue_head_keyfile'] = ''
        if flex_queue_head_machine is not None and 'keyfile' in flex_queue_head_machine:
            ret['queue_head_keyfile'] = flex_queue_head_machine['keyfile']
        return ret

    def get_database(self, job):
        ''' Get a database backend for this job's resource type'''
        logging.debug("get_database() job.resource = {0}".format(job.resource))
        # Use cached handles if we can
        if job.resource in self.database_connections:
            logging.debug("get_database() returning cached connection to {0}".format(job.resource))
            return self.database_connections[job.resource]
        # Make a new connection
        if job.resource == self.EC2_CLOUD_RESOURCE:
            params = self.get_credentials()
            #os.environ["AWS_ACCESS_KEY_ID"] = params['AWS_ACCESS_KEY_ID']
            #os.environ["AWS_SECRET_ACCESS_KEY"] = params['AWS_SECRET_ACCESS_KEY']
            db = DynamoDB(access_key=params['EC2_ACCESS_KEY'],
                                secret_key=params['EC2_SECRET_KEY'])
            self.database_connections[job.resource] = db
            logging.debug("get_database() returning new connection to {0}".format(job.resource))
            return db
        elif job.resource == self.FLEX_CLOUD_RESOURCE:
            params = self.get_credentials()
            db = FlexDB(password=params['flex_db_password'],
                              ip=params['queue_head_ip'])
            self.database_connections[job.resource] = db
            logging.debug("get_database() returning new connection to {0}".format(job.resource))
            return db
        else:
            raise Exception("Unknown job.resource = '{0}'".format(job.resource))


    def submit_cloud_task(self, params, agent_type=None, cost_replay=False, instance_type=None):

        logging.debug('submit_cloud_task() params =\n{}\n\n'.format(pprint.pformat(params)))

        if agent_type is None:
            if self.active_agent_type is not None:
                agent_type = self.active_agent_type
            else:
                self.isOneOrMoreComputeNodesRunning()
                if self.active_agent_type is not None:
                    agent_type = self.active_agent_type
                else:
                    raise Exception("No Cloud resources found")

        if agent_type not in JobConfig.SUPPORTED_AGENT_TYPES:
            raise Exception('Unsupported agent type {0}'.format(agent_type))

        credentials = self.get_credentials()

        if agent_type == AgentTypes.EC2:
            params['resource'] = self.EC2_CLOUD_RESOURCE
            params['bucketname'] = self.user_data.S3_bucket_name
            if 'EC2_ACCESS_KEY' not in credentials or credentials['EC2_ACCESS_KEY'] == '':
                raise Exception('EC2 Access Key is not valid!')
            if 'EC2_SECRET_KEY' not in credentials or credentials['EC2_SECRET_KEY'] == '':
                raise Exception('EC2 Secret Key is not valid!')
            ec2_access_key = credentials['EC2_ACCESS_KEY']
            ec2_secret_key = credentials['EC2_SECRET_KEY']
            logging.debug('ec2_access_key = {0}, ec2_secret_key = {1}'.format(ec2_access_key, ec2_secret_key))
            database = DynamoDB(ec2_access_key, ec2_secret_key)
            storage_agent = S3StorageAgent(bucket_name=self.user_data.S3_bucket_name,
                                           ec2_secret_key=ec2_secret_key,
                                           ec2_access_key=ec2_access_key)

        elif agent_type == AgentTypes.FLEX:
            params['resource'] = self.FLEX_CLOUD_RESOURCE
            params['bucketname'] = ''
#            if flex_credentials == None or 'flex_queue_head' not in flex_credentials \
#                    or 'flex_db_password' not in flex_credentials:
#                raise Exception('Please pass valid Flex credentials!')
            database = FlexDB(ip=credentials['queue_head_ip'],
                              password=credentials['flex_db_password'])
            flex_queue_head_machine = self.user_data.get_flex_queue_head_machine()
            storage_agent = FlexStorageAgent(queue_head_ip=flex_queue_head_machine['ip'],
                                             queue_head_username=flex_queue_head_machine['username'],
                                             queue_head_keyfile= os.path.join('/home', flex_queue_head_machine['username'], FlexConfig.QUEUE_HEAD_KEY_DIR, os.path.basename(flex_queue_head_machine['keyfile']))
                                             )
                                             #queue_head_keyfile=flex_queue_head_machine['keyfile'])
            ec2_access_key = None
            ec2_secret_key = None


        # if there is no taskid explicit, create one the first run
        task_id = str(uuid.uuid4())

        logging.debug('submit_cloud_task: task_id = {}'.format(task_id))

        result = helper.execute_cloud_task(params=params, agent_type=agent_type,
                                           ec2_access_key=ec2_access_key,
                                           ec2_secret_key=ec2_secret_key,
                                           task_id=task_id, instance_type=instance_type,
                                           cost_replay=cost_replay,
                                           database=database,
                                           storage_agent=storage_agent)

        return result

#    def executeTaskLocal(self, params):
#        '''
#        This method spawns a  process. It doesn't wait for the process to finish. The status of the
#        process can be tracked using the pid and the output directory returned by this method. 
#        
#        @param  params['document'] = the contents of the xml file 
#        @param  params['paramstring'] = the parameter to be passed to the stochkit execution
#        'STOCHKIT_HOME' = this is the environment variable which has the path of the stochkit executable
#        @return: 
#           {"pid" : 'the process id of the task spawned', "output": "the directory where the files will be generated"}
#         
#        '''
#
#        try:
#            logging.debug("executeTaskLocal : inside method with params : %s ",
#                         str(params))
#            res = {}
#
#            paramstr = params['paramstring']
#            uuid_str = str(uuid.uuid4())
#            res['uuid'] = uuid_str
#            create_dir_str = "mkdir -p output/%s " % uuid_str
#            os.system(create_dir_str)
#
#            # Write the model document to file
#            xmlfilepath = "output/" + uuid_str + "/" + uuid_str + ".xml"
#            xmlfilepath = os.path.abspath(xmlfilepath)
#            mfhandle = open(xmlfilepath, 'w')
#            mfhandle.write(params['document'])
#            mfhandle.close()
#
#            # Pipe output to these files
#            res['stdout'] = os.path.abspath(os.path.join('output', uuid_str, 'stdout'))
#            res['stderr'] = os.path.abspath(os.path.join('output', uuid_str, 'stderr'))
#
#            # The following executiong string is of the form :
#            # stochkit_exec_str = "ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuid_str)
#            stochkit_exec_str = "{backenddir}/wrapper.py {stdout} {stderr} {0} --model {1} --out-dir output/{2}/result ".format(
#                paramstr, xmlfilepath, uuid_str, stdout=res['stdout'], stderr=res['stderr'],
#                backenddir=os.path.abspath(os.path.dirname(__file__)))
#
#            logging.debug("STOCHKIT_EXEX_STR: {0}".format(stochkit_exec_str))
#            logging.debug("executeTaskLocal : Spawning StochKit Task. String : %s",
#                          stochkit_exec_str)
#
#            p = subprocess.Popen(stochkit_exec_str.split(), stdin=subprocess.PIPE)
#
#            # logging.debug("executeTaskLocal: the result of task {0} or error {1} ".format(output,error))
#            pid = p.pid
#
#            res['pid'] = pid
#            logging.debug("executeTaskLocal : PID generated - %s", pid)
#            filepath = os.path.join('output', uuid_str)
#            absolute_file_path = os.path.abspath(filepath)
#            logging.debug("executeTaskLocal : Output file - %s", absolute_file_path)
#            res['output'] = absolute_file_path
#
#            logging.debug("executeTaskLocal: exiting with result : %s", str(res))
#            return res
#
#        except Exception as e:
#            logging.error("executeTaskLocal : exception raised : %s", str(e))
#            return None


    def checkTaskStatusLocal(self, pids):
        '''
        checks the status of the pids and returns true if the task is running or else returns false
        pids = [list of pids to check for status]
        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
        '''
        res = {}
        logging.debug("checkTaskStatusLocal : inside with params {0}".format(pids))
        try:
            for pid in pids:
                try:
                    os.kill(pid, 0)
                    res[pid] = True
                except Exception, e:
                    res[pid] = False
            logging.debug("checkTaskStatusLocal : exiting with result : {0}".format(res))
            return res
        except Exception as e:
            logging.error("checkTaskStatusLocal: Exiting with error : {0}".format(e))
            return None

#    def checkTaskStatusCloud(self, pids):
#        '''
#        checks the status of the pids and returns true if the task is running or else returns false
#        pids = [list of pids to check for status]
#        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
#        '''
#        raise NotImplementedError


    def describeTasks(self, job):
        '''
        @param job
        '''
        #logging.debug('*'*80)
        #logging.debug('*'*80)
        logging.debug("describeTasks() job = {0}".format(job))
        database = self.get_database(job)

        try:
            result = database.describetask(job.cloudDatabaseID, JobDatabaseConfig.TABLE_NAME)

            if result is not None and job.cloudDatabaseID in result and result[job.cloudDatabaseID]['status'] == 'active' and job.resource in self.SUPPORTED_CLOUD_RESOURCES:
                try:
                    celery_app = CelerySingleton().app
                    result2 = AsyncResult(job.celeryPID)
                    logging.debug('describeTasks(): AsyncResult.status = {0}'.format(result2.status))
                    logging.debug('describeTasks(): AsyncResult.failed() = {0}'.format(result2.failed()))
                    logging.debug('describeTasks(): AsyncResult.ready() = {0}'.format(result2.ready()))
                    #if result2.failed() or (job.status.lower() != 'pending'):
                    if result2.failed():
                        result[job.cloudDatabaseID]["status"] = "failed"
                except Exception as e:
                    logging.debug('describeTasks(): AsyncResult raised exception')
                    logging.exception(e)
                    result[job.cloudDatabaseID]["status"] = "failed"

        except Exception as e:
            logging.error(e)
            logging.debug('describeTasks() return result=None')
            #logging.debug('*'*80)
            #logging.debug('*'*80)
            return None
        logging.debug('describeTasks() return result={0}'.format(result))
        #logging.debug('*'*80)
        #logging.debug('*'*80)
        return result

    def stopTasks(self, job):
        '''
        @param job to be stopped
        '''
        credentials = self.get_credentials()
        # First we need to stop the workers from working on the task
        task_id = job.celeryPID
        logging.debug("deleteTasks() calling removeTask('{0}')".format(job.celeryPID))
        remove_task(task_id)
        return self.describeTasks(job)

    def deleteTasks(self, job):
        '''
        @param job to delete
        '''
        database = self.get_database(job)
        logging.debug("deleteTasks() calling removeTask('{0}')".format(job.celeryPID))
        remove_task(job.celeryPID)  # this removes task from celery queue
        # this removes task information from DB.
        logging.debug("deleteTasks() calling database.removetask('{0}')".format(job.cloudDatabaseID))
        database.removetask(JobDatabaseConfig.TABLE_NAME,
                        job.cloudDatabaseID)
        if job.resource == self.EC2_CLOUD_RESOURCE:
            credentials = self.get_credentials()
            bucket_name = self.user_data.S3_bucket_name
            s3_helper.delete_folder(bucket_name, job.cloudDatabaseID, credentials['EC2_ACCESS_KEY'], credentials['EC2_SECRET_KEY'])
            # delete the output tar file
            storage_agent = S3StorageAgent(bucket_name=bucket_name,
                                           ec2_access_key=credentials['EC2_ACCESS_KEY'],
                                           ec2_secret_key=credentials['EC2_SECRET_KEY'])
            filename = 'output/' + job.cloudDatabaseID + '.tar'
            logging.debug('deleting the output tar file output/{1}.tar in bucket {0}'.format(bucket_name, job.cloudDatabaseID))
            storage_agent.delete_file(filename=filename)
            # delete dynamodb entries for cost analysis
            database.remove_tasks_by_attribute(tablename=JobDatabaseConfig.COST_ANALYSIS_TABLE_NAME,
                                               attribute_name='uuid', attribute_value=job.cloudDatabaseID)
        elif job.resource == backendservices.FLEX_CLOUD_RESOURCE:
            flex_queue_head_machine = self.user_data.get_flex_queue_head_machine()
            # delete the output tar file
            storage_agent = FlexStorageAgent(queue_head_ip=flex_queue_head_machine['ip'],
                                             queue_head_username=flex_queue_head_machine['username'],
                                             queue_head_keyfile=flex_queue_head_machine['keyfile'])
            filename = job.cloudDatabaseID + '.tar'
            storage_agent.delete_file(filename=filename)
        else:
            raise Exception("Unknown job Resource '{0}'".format(self.resource))

    def stopTaskLocal(self, pids):
        """
        pids : list of pids to be deleted.
        Terminates the processes associated with the PID. 
        This methods ignores the PID which are  not active.
        """
        logging.debug("stopTaskLocal : inside method with pids : %s", pids)
        for pid in pids:
            try:
                logging.debug("stopTaskLocal(): KILL TASK {0}".format(pid))
                os.killpg(pid, signal.SIGTERM)
            except Exception, e:
                logging.error("stopTaskLocal(): couldn't kill process. error: {0}".format(e))


    def __create_dynamodb_stochss_table(self, ec2_access_key, ec2_secret_key):
        database = DynamoDB(ec2_access_key, ec2_secret_key)
        result = database.createtable(JobDatabaseConfig.TABLE_NAME)
        if result:
            logging.debug("creating table {0}".format(JobDatabaseConfig.TABLE_NAME))
        else:
            logging.error("FAILED on creating table {0}".format(JobDatabaseConfig.TABLE_NAME))

    def __get_required_parameter(self, parameter_key, params):
        if parameter_key in params and params[parameter_key] != None:
            return params[parameter_key]

        raise Exception('Error: {0} is not given in params.'.format(parameter_key))


    def __create_vm_state_model_entries(self, infrastructure, num_vms,
                                        ec2_secret_key, ec2_access_key,
                                        user_id, reservation_id):
        logging.debug('__create_vm_state_model_entries')
        logging.debug('num_vms = {0} user_id = {1} reservation_id = {2}'.format(num_vms, user_id, reservation_id))

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

        logging.debug('__create_vm_state_model_entries: ids = {0}'.format(ids))
        return ids

########################################################
    def prepare_flex_cloud_machines(self, params, blocking=False):
        logging.debug("prepare_flex_cloud_machines : params : \n%s", pprint.pformat(params))

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

            logging.debug('ec2_access_key = {0} ec2_secret_key = {1}'.format(ec2_access_key, ec2_secret_key))

            # 3. create exact number of entities in db for this launch, and set the status to 'creating'
            num_vms = len(params['flex_cloud_machine_info'])
            logging.debug('num_vms = {0}'.format(num_vms))

            reservation_id = params['reservation_id']
            logging.debug('flex: reservation_id = {0}'.format(reservation_id))

            ids = self.__create_vm_state_model_entries(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key,
                                                       infrastructure=infrastructure, num_vms=num_vms, user_id=user_id,
                                                       reservation_id=reservation_id)

            # 4. Prepare Instances
            params[VMStateModel.IDS] = ids
            res = i.prepare_instances(params)

            logging.debug("prepare_flex_cloud_machines : exiting method with result : %s", str(res))
            return True, None, ids

        except Exception, e:
            traceback.print_exc()
            logging.error("prepare_flex_cloud_machines : exiting method with error : {0}".format(str(e)))
            return False, 'Errors occur in preparing machines:' + str(e)


########################################################
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

########################################################
    def start_ec2_vms(self, params, blocking=False):
        '''
        This method instantiates EC2 vm instances
        '''
        logging.debug("start_ec2_vms : inside method with params : \n%s", pprint.pformat(params))
        try:
            # make sure that any keynames we use are prefixed with stochss so that
            #we can do a terminate all based on keyname prefix
            key_prefix = AgentConfig.get_agent_key_prefix(agent_type=AgentTypes.EC2,
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

            logging.debug('ec2: reservation_id = {0}'.format(reservation_id))

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
                    logging.debug('vm: {0}, num: {1}'.format(vm['instance_type'], vm['num_vms']))
                    num_vms += vm['num_vms']
            if 'head_node' in params:
                num_vms += 1

            logging.debug('num = {0}'.format(num_vms))

            ids = self.__create_vm_state_model_entries(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key,
                                                       infrastructure=infrastructure, num_vms=num_vms, user_id=user_id,
                                                       reservation_id=reservation_id)

            # 4. Prepare Instances
            params[VMStateModel.IDS] = ids
            res = i.prepare_instances(params)
            
            # 5, check and create stochss table exists if it does not exist
            self.__create_dynamodb_stochss_table(ec2_access_key=ec2_access_key, ec2_secret_key=ec2_secret_key)

            logging.debug("start_ec2_vms : exiting method with result : %s", str(res))
            return True, None

        except Exception as e:
            logging.exception("start_ec2_vms : exiting method with error : {0}".format(str(e)))
            return False, 'Errors occur in starting machines:' + str(e)


    def is_flex_queue_head_running(self, flex_queue_head_machine):
        if flex_queue_head_machine == None or flex_queue_head_machine['queue_head'] == False:
            return False

        try:
            ip = flex_queue_head_machine['ip']
            url = "https://{ip}/state".format(ip=ip)
            response = json.loads(urllib2.urlopen(url).read())
            logging.debug('Response from flex queue head - GET {url} :\n{resp}'.format(url=url,
                                                                                      resp=pprint.pformat(response)))
            if response['state'] == 'running' and response['is_queue_head'] == True \
                    and response['queue_head_ip'] == ip:
                return True

        except Exception as e:
            logging.error(traceback.format_exc())
            logging.error('Error: {}'.format(str(e)))

        return False


    def isOneOrMoreComputeNodesRunning(self, ins_type=None):
        '''
        Checks for the existence of running compute nodes. Only need one of running compute node
        to be able to run a job in the cloud.
        '''
        credentials = self.get_credentials()
        logging.debug('credentials = {0}'.format(credentials))
        #Check all infrastructures
        for infrastructure in JobConfig.SUPPORTED_AGENT_TYPES:
            # Check Flex
            if infrastructure == AgentTypes.FLEX:
                if self.user_data.is_flex_cloud_info_set:
                    self.user_data.update_flex_cloud_machine_info_from_db(self)
                    flex_queue_head_machine = self.user_data.get_flex_queue_head_machine()
                    if self.is_flex_queue_head_running(flex_queue_head_machine):
                        self.active_agent_type = infrastructure
                        return True
                else:
                    continue
            elif infrastructure == AgentTypes.EC2:
                if 'EC2_ACCESS_KEY' not in credentials or 'EC2_SECRET_KEY' not in credentials or \
                    credentials['EC2_ACCESS_KEY'] == '' or credentials['EC2_SECRET_KEY'] == '':
                    continue
#                key_prefix = AgentConfig.get_agent_key_prefix(agent_type=infrastructure,
#                                                              key_prefix=self.user_data.user_id)
                all_vms = self.describe_machines_from_db(infrastructure)
                if all_vms is None:
                    return False
                # Just need one running vm
                if ins_type:
                    for vm in all_vms:
                        if vm != None and vm['state'] == 'running' and vm['instance_type'] == ins_type:
                            self.active_agent_type = infrastructure
                            return True
                else:
                    for vm in all_vms:
                        if vm != None and vm['state'] == 'running':
                            self.active_agent_type = infrastructure
                            return True
        self.active_agent_type = None
        return False

    def stop_ec2_vms(self, params, blocking=False):
        '''
        This method would terminate all the EC2 instances associated with the account
	    that have a keyname prefixed with stochss (all instances created by the backend service)
	    params must contain credentials key/value
        '''
        key_prefix = AgentConfig.get_agent_key_prefix(agent_type=AgentTypes.EC2,
                                                      key_prefix=params.get('key_prefix', ''))
        try:
            logging.debug("Stopping compute nodes with key_prefix: {0}".format(key_prefix))
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

#    def describeMachines(self, params):
#        '''
#        This method gets the status of all the instances
#        '''
#        # add calls to the infrastructure manager for getting details of machines
#        logging.debug("describeMachines() params =\n%s", pprint.pformat(params))
#
#        key_prefix = AgentConfig.get_agent_key_prefix(agent_type=self.infrastructure,
#                                                      key_prefix=params.get('key_prefix', ''))
#        logging.debug('key_prefix = {0}'.format(key_prefix))
#
#        params["key_prefix"] = key_prefix
#        try:
#            i = InfrastructureManager()
#            res = i.describe_instances(params, [], key_prefix)
#            logging.debug("instances = \n%s", pprint.pformat(res))
#            return res
#
#        except Exception, e:
#            logging.error("error : %s", str(e))
#            return None

    def describe_machines_from_db(self, infrastructure, force=False):
        parameters = {
            "infrastructure": infrastructure,
            "credentials": self.get_credentials(),
            "key_prefix": self.user_data.user_id,
            "user_id": self.user_data.user_id,
        }
        if infrastructure == AgentTypes.FLEX:
            parameters['flex_cloud_machine_info'] = self.user_data.get_flex_cloud_machine_info()
            parameters['reservation_id'] = self.user_data.reservation_id
        i = InfrastructureManager()
        i.synchronize_db(parameters, force=force)
        all_vms = VMStateModel.get_all(parameters)
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

        logging.debug("validateCredentials: inside method with params : %s", str(params))
        try:
            i = InfrastructureManager()
            logging.debug("validateCredentials: exiting with result : %s", str(i))
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
                    logging.debug("queue head = {0}".format(queue_head))
                    cmd = "[ -d ~/stochss ] && echo yes".format(username=queue_head["username"])
                    remote_cmd = backendservices.__get_remote_command_string(command=cmd,
                                                                            keyfile=keyfile,
                                                                            username=queue_head["username"],
                                                                            ip=queue_head["ip"])
                    result = os.system(remote_cmd)

                    logging.debug("Result of \n{0} \n= {1}".format(remote_cmd, result))
                    if result == 0:
                        logging.debug('Validation successful!')
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


    def getSizeOfOutputResults(self, output_urls):
        '''
        This method checks the size of the output results stored in S3 for all of the buckets and keys
         specified in output_buckets.
        @return
         A dictionary whose keys are job names and whose values are output sizes of those jobs.
         The output size is either the size specified in bytes or None if no output was found.
        '''
        logging.debug("getSizeOfOutputResults: inside method with output_urls: {0}".format(output_urls))

        credentials = self.get_credentials()
        logging.debug('credentials = {0}'.format(credentials))

        result = {}
        #Check all infrastructures
        for job_id, output_url in output_urls.items():
            if output_url.startswith('scp://'):
                match_object = re.search(pattern='scp://([^:@]+)@([^:@]+):([^:@]+):([^:@]+)', string = output_url)
                username = match_object.group(1)
                ip = match_object.group(2)
                keyname = match_object.group(3)
                output_tar_file_path = match_object.group(4)
                
                command = "du -b {output_file}".format(output_file=output_tar_file_path)
                remote_cmd = helper.get_remote_command(user=username, ip=ip,
                                                       key_file=os.path.join(self.FLEX_SSH_KEYFILE_DIR, keyname),
                                                       command=command)
                
                logging.debug('command = {}'.format(remote_cmd))
                handle = subprocess.Popen(shlex.split(remote_cmd), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                stdout, stderr = handle.communicate()
                
                match_object = re.search(pattern='([^\s]+)(\s+)([^\s]+)', string=stdout)
                if match_object:
                    output_size = int(match_object.group(1))
                    logging.debug('For job_id = {0}, size = {1}'.format(job_id, output_size))
                    result[job_id] = output_size
                else:
                    result[job_id] = None
            elif output_url.startswith('https://') or output_url.startswith('http://'):
                aws_access_key = credentials['EC2_ACCESS_KEY']
                aws_secret_key = credentials['EC2_SECRET_KEY']

                # Connect to S3
                conn = S3Connection(aws_access_key, aws_secret_key)

                bucket_map = {}
                for job_id, output_url in output_urls.items():
                    s3_url_segments = output_url.split('/')
                    # S3 URLs are in the form https://s3.amazonaws.com/bucket_name/key/name
                    bucket_name = s3_url_segments[3]
                    # key_name is the concatenation of all segments after the bucket_name
                    key_name = '/'.join(s3_url_segments[4:])

                    if bucket_name in bucket_map:
                        bucket_map[bucket_name] += [(key_name, job_id)]
                    else:
                        bucket_map[bucket_name] = [(key_name, job_id)]

                for bucket_name in bucket_map:
                    # Try to get the bucket
                    try:
                        bucket = conn.get_bucket(bucket_name)
                    except S3ResponseError:
                        # If the bucket doesn't exist, neither do any of the keys
                        for key_name, job_id in bucket_map[bucket_name]:
                            result[job_id] = None
                    else:
                        # Ok the bucket exists, now for the keys
                        for key_name, job_id in bucket_map[bucket_name]:
                            key = bucket.get_key(key_name)
                            if key is None:
                                # No output exists for this key
                                result[job_id] = None
                            else:
                                # Output exists for this key
                                result[job_id] = key.size
        return result


    def fetchOutput(self, taskid, outputurl):
        '''
        This method gets the output file from S3 and extracts it to the output 
        directory
        @param taskid: the taskid for which the output has to be fetched
        @return: True : if successful or False : if failed 
        '''
        try:
            logging.debug("fetchOutput: taskid: {0} and url: {1}".format(taskid, outputurl))

            filename = "{0}.tar".format(taskid)
            logging.debug("fetchOutput : the name of file to be fetched : {0}".format(filename))

            if outputurl.startswith('scp://'):
                logging.debug('output uploaded via FlexStorageAgent')

                match_object = re.search(pattern='scp://([^:@]+)@([^:@]+):([^:@]+):([^:@]+)', string=outputurl)
                username = match_object.group(1)
                ip = match_object.group(2)
                keyname = match_object.group(3)
                output_tar_file_path = match_object.group(4)

                scp_command = \
                    helper.get_scp_command(keyfile=os.path.join(self.FLEX_SSH_KEYFILE_DIR, keyname),
                                           source="{user}@{ip}:{output_file}".format(user=username,
                                                                                 ip=ip,
                                                                                 output_file=output_tar_file_path),
                                           target=filename)

                logging.debug(scp_command)
                os.system(scp_command)

            elif outputurl.startswith('https://') or outputurl.startswith('http://'):
                logging.debug('output uploaded via S3StorageAgent')

                logging.debug("url to be fetched : {0}".format(taskid))
                fetch_url_cmd_str = "curl --remote-name {0}".format(outputurl)

                logging.debug("fetchOutput : Fetching file using command : {0}".format(fetch_url_cmd_str))
                os.system(fetch_url_cmd_str)

            else:
                logging.error('Invalid output url "{0}"'.format(outputurl))
                return False

            if not os.path.exists(filename):
                logging.error('unable to download file. Returning result as False')
                return False

            return True

        except Exception, e:
            logging.error("fetchOutput : exiting with error : %s", str(e))
            return False
