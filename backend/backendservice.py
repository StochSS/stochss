'''
This class exposes all the services offered by the backend
It would accept all the calls from the front end and pass on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import os,subprocess,signal,uuid,sys

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
        print 'inside execute task for cloud'
        try:
            from tasks import task
            uuidstr = uuid.uuid4()
            #create a celery task
            tmp = task.delay(str(uuidstr),params)
            # the UUID will be used to track the status of the task
            print str(tmp)
            return tmp
        except Exception,e:
            print str(e)
        pass 
    
    
    
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
            #logging.basicConfig(filename='stochss.log',level=logging.INFO)
            #logging.info("inside task method")
            res = {}
            xmlfilepath = params['file'] 
            paramstr =  params['paramstring']
            uuidstr = str(uuid.uuid4())
            res['uuid'] = uuidstr
            create_dir_str = "mkdir -p output/%s " % uuidstr
            os.system(create_dir_str)
            # check if the env variable is set form STOCHKIT_HOME or else use the default location
            #STOCHKIT_DIR = "/Users/RaceLab/StochKit2.0.6"
            STOCHKIT_DIR = "/Users/andreash/Downloads/StochKit2.0.6"
            # AH: THIS DOES NOT WORK, FOR SOME REASON THE VARIABLE IS NOT PICKED UP FROM THE SHELL
            try:
                STOCHKIT_DIR = os.environ['STOCHKIT_HOME']
            except Exception:
                #ignores if the env variable is not set
                print "VARIABLE NOT SET!!"
                pass
            
            # The following executiong string is of the form : stochkit_exec_str = "~/StochKit2.0.6/ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
            stochkit_exec_str = "{0}/{2} --out-dir output/{3}/result ".format(STOCHKIT_DIR,xmlfilepath,paramstr,uuidstr)
            #logging.debug("Spawning StochKit Task. String : ", stochkit_exec_str)
            print "======================="
            print " Command to be executed : "
            print stochkit_exec_str
            print "======================="
            print "To test if the command string was correct. Copy the above line and execute in terminal."
            p = subprocess.Popen(stochkit_exec_str, shell=True, stdin=subprocess.PIPE,stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            pid = p.pid;
            res['pid'] = pid 
            filepath = "output/%s//" % (uuidstr)
            absolute_file_path = os.path.abspath(filepath)
            res['output'] = absolute_file_path
            #res['relative_output_path']=os.path.relpath(filepath,)
            
            #copies the XML file to the output direcory
            copy_file_str = "cp  {0} output/{1}".format(xmlfilepath,uuidstr)
            os.system(copy_file_str)
            #removefilestr = "rm {0}".format(xmlfilepath)
            #os.system(removefilestr) 
            return res
        except Exception as e:
               #logging.error("exception raised : %s" ) % e
               #traceback.print_stack()
               pass
    
    def checkTaskStatusLocal(self,pids):
        '''
        checks the status of the pids and returns true if the task is running or else returns false
        pids = [list of pids to check for status]
        returns a dictionary as {"pid1":"status", "pid2":"status", "pid3":"status"}
        '''
        res = {}
        
        for pid in pids:
            try:
                os.getpgid(pid)
                res[pid] = True
            except Exception,e:
                res[pid] = False
        return res
    
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
                result['taskid'] = res
        except Exception,e:
            print str(e)
            return None
        return result
    
    def deleteTask(self):
        #this would kill the celery task in the queue
        # it would basically remove the queue entery for the task
        # from the list
        pass
    
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
             'image_id':'ami-ed2d4084', 
             'instance_type':'t1.micro',
             'keyname':'stochssnew32', 
             'email':['anand.bdk@gmail.com'],
             'credentials':{"EC2_ACCESS_KEY":"AKIAJWILGFLOFVDRDRCQ", "EC2_SECRET_KEY":"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"},
             #'credentials':{"EC2_ACCESS_KEY":"sadsdsad", "EC2_SECRET_KEY":"/95VWaJ"},
             'use_spot_instances':False}
    #test  = obj.validateCredentials(params)
    #print test
    print str(obj.startMachines(params))
    #val = obj.describeMachines(params)
    pids = [12680,12681,12682, 18526]
    #res  = obj.checkTaskStatusLocal(pids)
    pids = [18511,18519,19200]
    #obj.deleteTaskLocal(pids)
    #print str(res)
    
    param = {'file':"/Users/RaceLab/StochKit2.0.6/models/examples/dimer_decay.xml",'paramstring':"--force -t 10 -r 1000"}
    #res = obj.executeTaskLocal(param)
    #print str(res)
    #obj.startMachines(params)
    #obj.describeMachines(params)
    