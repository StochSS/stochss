'''
This class exposes all the services offered by the backend
It would accept all the calls from the front end and pass on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import os,subprocess,signal,uuid,sys
import logging

class backendservices():
    ''' 
    constructor for the backend service class.
    It should be passed the agent creds
    '''
    #agent_type= 
        
    def backendservices(self): 
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/boto'))
        sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/celery'))
        sys.path.append(os.path.join(os.path.dirname(__file__), '/Library/Python/2.7/site-packages/amqp'))
            
    def initialize_server(self):
         # check if the security group exists , if not then create a group
         pass
        
    
    def createTask(self, params):
        # this will be used to create the virtual machines
        # add the functionality for invoking the infrastrcuture 
        # manager to create the virtual machine
        
        pass
    
    
    def executeTask(self,params):
        '''
        This method instantiates celery tasks in the cloud.
        '''
        logging.info('inside execute task for cloud : Params - %s', str(params))
        try:
            from tasks import task
            uuidstr = uuid.uuid4()
            #create a celery task
            logging.debug("executeTask : executing task with uuid : %s ", uuidstr)
            tmp = task.delay(str(uuidstr),params)
            # the UUID will be used to track the status of the task
            logging.debug("executeTask :  result of task : %s", str(tmp))
            return tmp
        except Exception,e:
            logging.error("executeTask : error - %s", str(e))
    
    
    
    def executeTaskLocal(self,params):
        '''
        This method spawns a stochkit process. It doesn't wait for the process to finish. The status of the
        process can be tracked using the pid and the output directory returned by this method. 
        
        @param  params['file'] = the absolute path of the xml file 
        @param  params['paramstring'] = the parameter to be passed to the stochkit execution
        'STOCHKIT_HOME' = this is the environment variable which has the path of the stochkit executable
        @return: 
           {"pid" : 'the process id of the task spawned', "output": "the directory where the files will be generated"}
         
        '''
        try:
           
            logging.info("executeTaskLocal : inside method with params : %s ", str(params))
            res = {}
            xmlfilepath = params['file'] 
            paramstr =  params['paramstring']
            uuidstr = str(uuid.uuid4())
            res['uuid'] = uuidstr
            create_dir_str = "mkdir -p output/%s " % uuidstr
            os.system(create_dir_str)
            # check if the env variable is set form STOCHKIT_HOME or else use the default location
            STOCHKIT_DIR = "/Users/RaceLab/StochKit2.0.6"
            #STOCHKIT_DIR = "/Users/andreash/Downloads/StochKit2.0.6"
            # AH: THIS DOES NOT WORK, FOR SOME REASON THE VARIABLE IS NOT PICKED UP FROM THE SHELL
            try:
                STOCHKIT_DIR = os.environ['STOCHKIT_HOME']
                logging.debug("executeTaskLocal : Environment variable set for STOCHKIT_HOME : %s",STOCHKIT_DIR )
            except Exception:
                logging.debug(" executeTaskLocal : environment variable not set for STOCHKIT_HOME. Default location will be used : %s", STOCHKIT_DIR)
            # The following executiong string is of the form : stochkit_exec_str = "~/StochKit2.0.6/ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
            stochkit_exec_str = "{0}/{2} --out-dir output/{3}/result ".format(STOCHKIT_DIR,xmlfilepath,paramstr,uuidstr)
            logging.debug("executeTaskLocal : Spawning StochKit Task. String : %s", stochkit_exec_str)
            p = subprocess.Popen(stochkit_exec_str, shell=True, stdin=subprocess.PIPE,stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            pid = p.pid;
            res['pid'] = pid 
            filepath = "output/%s//" % (uuidstr)
            logging.debug("executeTaskLocal : PID generated - %s", pid)
            absolute_file_path = os.path.abspath(filepath)
            logging.debug("executeTaskLocal : Output file - %s", absolute_file_path)
            res['output'] = absolute_file_path
            #res['relative_output_path']=os.path.relpath(filepath,)
            
            #copies the XML file to the output direcory
            logging.debug("executeTaskLocal: Copying xml file to output directory")
            copy_file_str = "cp  {0} output/{1}".format(xmlfilepath,uuidstr)
            os.system(copy_file_str)
            #removefilestr = "rm {0}".format(xmlfilepath)
            #os.system(removefilestr)
            logging.info("executeTaskLocal: exiting with result : %s", str(res)) 
            return res
        except Exception as e:
               logging.error("executeTaskLocal : exception raised : %s" , str(e))
               return None
               
    
    def checkTaskStatusLocal(self,pids):
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
                    os.getpgid(pid)
                    res[pid] = True
                except Exception,e:
                    res[pid] = False
            logging.info("checkTaskStatusLocal : exiting with result : %s", str(res))
            return res
        except Exception,e:
            logging.error("checkTaskStatusLocal: Exiting with error : %s", str(e))
            return None
    
    def checkTaskStatusCloud(self,ids):
        '''
        checks the status of the pids and returns true if the task is running or else returns false
        pids = [list of pids to check for status]
        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
        '''
        res = {}
        
        return res
    
    
    def describeTask(self,params):
        '''
        @param params: A dictionary with the following fields
         "AWS_ACCESS_KEY_ID" : AWS access key
         "AWS_SECRET_ACCESS_KEY": AWS security key
         taskids : list of celery taskids
         @return: 
         a dictionary of the form :
         {"taskid":"result:"","state":""} 
        '''
        # this method will make a call the 
        os.environ["AWS_ACCESS_KEY_ID"] = params['AWS_ACCESS_KEY_ID']
        os.environ["AWS_SECRET_ACCESS_KEY"] = params['AWS_SECRET_ACCESS_KEY']
        result = {}
        from tasks import checkStatus
        try:
            for taskid in params['taskids']:
                res = checkStatus(taskid)
                result[taskid] = res
        except Exception,e:
            print str(e)
            return None
        return result
    
    def deleteTasks(self,taskids):
        '''
        @param taskid:the list of taskids to be removed 
        this method revokes scheduled tasks as well as the tasks in progress
        
        '''
        try:
            from tasks import removeTask
            for taskid in taskids:
                removeTask(taskid)
        except Exception, e:
            print "exception occured : {0}".format(str(e))

    
    def deleteTaskLocal(self, pids):
        """
        pids : list of pids to be deleted.
        Terminates the processes associated with the PID. This methods ignores the PID which are not not active.
        """
        for pid in pids:
            try:
                os.kill(pid, signal.SIGKILL)
            except Exception,e:
                pass
    
    def startMachines(self,params):
        #this will basically start an instance in ec2
        # add call from the infrastructure manager here
        i = InfrastructureManager(blocking=True)
        res = i.run_instances(params, params)
        return res
        
    def stopMachines(self,params):
        # add infrastcutre manager call to stop a virtual machines
        pass
    def describeMachines(self,params):
        # add calls to the infrastructure manager for getting details of
        # machines
        i = InfrastructureManager()
        secret =[]
        res = i.describe_instances(params, secret)
        for i in res:
            from pprint import pprint
            pprint(i)
            print "==============================================="
        return res
    
    
    def validateCredentials(self,params):
        i = InfrastructureManager()
        return i.validate_Credentials(params)
    
    
    
    def fetchOutput(self,taskid):
        '''
        This method gets the output file from S3 and extracts it to the output 
        directory
        @param taskid: the taskid for which the output has to be fetched
        @return: True : if successful or False : if failed 
        '''
        filename = "{0}.tar".format(taskid)
        #the output directory
        
        print "the name of file to be fetched : {0}".format(filename)
        baseurl = "https://s3.amazonaws.com/stochkitoutput/output"
        fileurl = "{0}/{1}".format(baseurl,filename)
        fetchurlcmdstr = "curl --remote-name {0}".format(fileurl)
        print "Fetching file using command : {0}".format(fetchurlcmdstr)
        os.system(fetchurlcmdstr)
        if not os.path.exists(filename):
            print 'unable to download file'
            return False
        else:
            outputdir = "{0}/../output/{1}".format(os.getcwd(),taskid)
            createoutputdirstr = "mkdir -p {0}".format(outputdir)
            os.system(createoutputdirstr)
            print "the files will be extracted at {0} ".format(outputdir)
            untarcmdstr = "tar -xzvf  {0} -C {1}/".format(filename,outputdir)
            print "untaring file using command : {0}".format(untarcmdstr)
            os.system(untarcmdstr)
            os.system("pwd")
            removetarcmd = "rm {0}".format(filename)
            print "removing the fetched file using command : {0}".format(removetarcmd)
            os.system(removetarcmd)
            return True
        
if __name__ == "__main__":
    obj = backendservices()
    PARAM_CREDENTIALS = 'credentials'
    PARAM_GROUP = 'group'
    PARAM_IMAGE_ID = 'image_id'
    PARAM_INSTANCE_TYPE = 'instance_type'
    PARAM_KEYNAME = 'keyname'
    credentials = {"EC2_ACCESS_KEY":"KIAJWILGFLOFVDRDRCQ", "EC2_SECRET_KEY":"vnEvY4vFpmaPsPNTB80H8IsNqIkWGTMys/95VWaJ"}
    params ={"infrastructure":"ec2",
             "num_vms":1, 
             'group':'stochss19', 
             'image_id':'ami-1d066b74', 
             'instance_type':'t1.micro',
             'keyname':'stochssnew32', 
             'email':['anand.bdk@gmail.com'],
             'credentials':{"EC2_ACCESS_KEY":"AKIAJWILGFLOFVDRDRCQ", "EC2_SECRET_KEY":"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"},
             #'credentials':{"EC2_ACCESS_KEY":"sadsdsad", "EC2_SECRET_KEY":"/95VWaJ"},
             'use_spot_instances':False}
    #test  = obj.validateCredentials(params)
    #print test
    #print str(obj.startMachines(params))
    #val = obj.describeMachines(params)
    pids = [12680,12681,12682, 18526]
    #res  = obj.checkTaskStatusLocal(pids)
    pids = [18511,18519,19200]
    #obj.deleteTaskLocal(pids)
    #print str(res)
    obj.fetchOutput("dddd0430-a3c5-445a-a4fd-aad59d6927fa")
    param = {'file':"/Users/RaceLab/StochKit2.0.6/models/examples/dimer_decay.xml",'paramstring':"--force -t 10 -r 1000"}
    #res = obj.executeTaskLocal(param)
    #print str(res)
    #obj.startMachines(params)
    #obj.describeMachines(params)
    