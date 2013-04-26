'''
This class exposes all the services offered by the backend
It would accept all the calls from the front end and pass on to the backend.
All the input validation is performed in this class.
'''
from infrastructure_manager import InfrastructureManager
import os,subprocess,signal,uuid

class backendservices():
    ''' 
    constructor for the backend service class.
    It should be passed the agent creds
    '''
    #agent_type= 
        
    def initialize_server(self):
         # check if the security group exists , if not then create a group
         pass
        
    def backendservices(self,params):
        # create ec2 connection object
        pass
    def createTask(self, params):
        # this will be used to create the virtual machines
        # add the functionality for invoking the infrastrcuture 
        # manager to create the virtual machine
        pass
    def executeTask(self,params):
        #create a celery task
        # parse the paramters
        # a UUID has to be created for the task
        # the UUID will be used to track the status of the task
        pass 
    
    def executeTaskLocal(self,params):
        # dump the file
        # invoke stoch ss
        # return the pid and the url of the task
        #
        
        try:
            #logging.basicConfig(filename='stochss.log',level=logging.INFO)
            #logging.info("inside task method")
            uuidstr = str(uuid.uuid4())
            create_dir_str = "mkdir ~/output/%s " % uuidstr
            change_dir_to_ouput_str = "cd output"
            os.system(change_dir_to_ouput_str)
            #logging.debug("directory changed to output")
            os.system(create_dir_str)
            stochkit_exec_str = "~/StochKit2.0.6/ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
            copy_file_str = "cp  ~/StochKit2.0.6/models/examples/dimer_decay.xml ~/output/%s" % (uuidstr)
            os.system(copy_file_str)
            p = subprocess.Popen(stochkit_exec_str, shell=True, stdin=subprocess.PIPE,stdout=subprocess.PIPE, stderr=subprocess.STDOUT, close_fds=True)
            (s_in, s_out) = (p.stdin, p.stdout)
            #os.system(stochkit_exec_str)
            #logging.debug("stochkit executed succesfullu")
            create_tar_output_str = "tar -zcvf ~/output/%s.tar ~/output/%s" %  (uuidstr)
            #logging.debug("followig cmd to be executed %s" % (create_tar_output_str))
            copy_to_s3_str = "python ~/sccpy.py output/%s.tar" % (uuidstr)
            os.system(create_tar_output_str)
            os.system(copy_to_s3_str)
            
            # Absolute file path
            # the absolute file path of the file being generated
            # can be obtained as ::
            # os.path.abspath('mydir/myfile.txt')
            
            
            #os.system("cd output; mkdir " +  uuid + "; cp  StochKit2.0.6/models/examples/dimer_decay.xml uuid/;../StochKit2.0.6/ssa -m " uuid +" /dimer_decay.xml -t 20 -i 10 -r 1000")
            #os.system("python sccpy.py output/
        except Exception as e:
               #logging.error("exception raised : %s" ) % e
               #traceback.print_stack()
               pass
        
        
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
    
    def describeTask(self,params):
        # this method will make a call the 
        pass
    
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
        i.run_instances(params, params)
        
        pass
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
        pass
    
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
             'group':'stochss18', 
             'image_id':'ami-44b6272d', 
             'instance_type':'t1.micro',
             'keyname':'stochssnew24', 
             'email':['anand.bdk@gmail.com'],
             'credentials':{"EC2_ACCESS_KEY":"AKIAJWILGFLOFVDRDRCQ", "EC2_SECRET_KEY":"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"},
             #'credentials':{"EC2_ACCESS_KEY":"sadsdsad", "EC2_SECRET_KEY":"/95VWaJ"},
             'use_spot_instances':False}
    test  = obj.validateCredentials(params)
    print test
    pids = [12680,12681,12682, 18526]
    res  = obj.checkTaskStatusLocal(pids)
    pids = [18511,18519,19200]
    obj.deleteTaskLocal(pids)
    print str(res)
    #obj.startMachines(params)
    #obj.describeMachines(params)
    