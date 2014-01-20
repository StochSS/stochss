'''
This class exposes all the services offered by the backend
It accepts calls from the front-end and pass them on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import threading
import os, subprocess, signal, uuid, sys, time
import logging
from datetime import datetime
from tasks import *

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
        try:
            from tasks import task,updateEntry
	    #This is a celery task in tasks.py: @celery.task(name='stochss')

            taskid = str(uuid.uuid4())
            #create a celery task
            logging.debug("executeTask : executing task with uuid : %s ", taskid)
            timenow = datetime.now() 
            data = {'status':"pending","start_time":timenow.strftime('%Y-%m-%d %H:%M:%S'), 'Message':"Task sent to Cloud"}
            updateEntry(taskid, data, backendservices.TABLENAME)
	    #celery async task execution http://ask.github.io/celery/userguide/executing.html
            tmp = task.delay(taskid, params)  #calls task(taskid,params)

            logging.debug("executeTask :  result of task : %s", str(tmp))
            return tmp.id, taskid
        except Exception, e:
            logging.error("executeTask : error - %s", str(e))
    
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
    
    def startMachines(self, params, block=False):
        '''
        This method instantiates ec2 instances
        '''

        logging.info("startMachines : inside method with params : %s", str(params))
        try:
            keyname = params['keyname']
	    #make sure that any keynames we use are prefixed with stochss so that
	    #we can do a terminate all based on keyname prefix
	    if not keyname.startswith(backendservices.KEYPREFIX):
		params['keyname'] = backendservices.KEYPREFIX+keyname
            i = InfrastructureManager(blocking=block)
            res = i.run_instances(params,[])
            logging.info("startMachines : exiting method with result : %s", str(res))
            return res
        except Exception, e:
            logging.error("startMachines : exiting method with error : %s", str(e))
            return None
        
    def stopMachines(self, params, block=False):
        '''
        This method would terminate all the  instances associated with the account
	that have a keyname prefixed with stochss (all instances created by the backend service)
	params must contain credentials key/value
        '''
        try:
            i = InfrastructureManager(blocking=block)
            res = i.terminate_instances(params,backendservices.KEYPREFIX)
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
        try:
            i = InfrastructureManager()
            res = i.describe_instances(params, [], backendservices.KEYPREFIX)
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
       logging.error("main: Environment variables EC2_ACCESS_KEY and EC2_SECRET_KEY not set, cannot continue")
       sys.exit(1)

    infra = backendservices.INFRA_EC2

    obj = backendservices()
    params ={
        'credentials':{'EC2_ACCESS_KEY':access_key, 'EC2_SECRET_KEY':secret_key},
    }
    params['infrastructure'] = infra
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
	    res, taskid = obj.executeTask(taskargs)
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
