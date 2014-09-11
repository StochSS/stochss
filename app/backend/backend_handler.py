
import webapp2
from google.appengine.api import background_thread, urlfetch, modules
from agents.base_agent import AgentRuntimeException
from utils import utils
import pickle
import urllib
import sys
import os
import time
import logging
import thread
from tasks import CelerySingleton
from subprocess import Popen, PIPE, STDOUT
from google.appengine.ext import db

__author__ = 'mengyuan'
__email__ = 'gmy.melissa@gmail.com'


BACKEND_NAME = 'backendthread'
BACKEND_URL = 'http://%s' % modules.get_hostname(BACKEND_NAME)

BACKEND_START = BACKEND_URL+'/_ah/start'
BACKEND_BACKGROUND = BACKEND_URL+'/_ah/background'
BACKEND_WORKER_R_URL = BACKEND_URL+'/backend/worker'
BACKEND_MANAGER_R_URL = BACKEND_URL+'/backend/manager'

class VMStateModel(db.Model):
    IDS = 'ids'
    EC2_ACCESS_KEY = 'EC2_ACCESS_KEY'
    EC2_SECRET_KEY = 'EC2_SECRET_KEY'
    
    STATE_CREATING = 'creating'
    STATE_PENDING = 'pending'
    STATE_RUNNING = 'running'
    STATE_FAILED = 'failed'
    STATE_TERMINATED = 'terminated'
    
    DESCRI_FAIL_TO_RUN = 'fail to run the instance'
    DESCRI_TIMEOUT_ON_SSH = 'timeout to connect instance via ssh'
    DESCRI_FAIL_TO_COFIGURE_CELERY = 'fail to celery on the instance'
    DESCRI_SUCCESS = 'success'
    
    infra = db.StringProperty()
    access_key = db.StringProperty()
    secret_key = db.StringProperty()
    res_id = db.StringProperty()
    ins_id = db.StringProperty()
    pub_ip = db.StringProperty()
    pri_ip = db.StringProperty()
    local_key = db.StringProperty()
    state = db.StringProperty(required=True,
                                  choices=set([STATE_CREATING, STATE_PENDING, STATE_RUNNING, STATE_FAILED, STATE_TERMINATED]))
    description = db.StringProperty()
    created = db.DateTimeProperty(auto_now_add=True)      
    
    @staticmethod
    def get_all(params):              
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return None
            
            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state !=', VMStateModel.STATE_TERMINATED)
            all_vms = []
            for e in entities:
                dict = {
                        "ins_id": e.ins_id,
                        "state": e.state,
                        "discription": e.description 
                        }      
                all_vms.append(dict)
            return all_vms
        except Exception as e:
            logging.error("Error in getting all vms from db! {0}".format(e))
            return None
        
    @staticmethod
    def terminate_not_active(params):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state =', VMStateModel.STATE_FAILED)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()

        except Exception as e:
            logging.error("Error in updating non-active vms to terminated in db! {0}".format(e))
    
    @staticmethod
    def terminate_all(params):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state !=', VMStateModel.STATE_TERMINATED)
            
            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()
        except Exception as e:
            logging.error("Error in terminating all vms in db! {0}".format(e))   
            
        
    @staticmethod   
    def update_res_ids(params, ids, res_id):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            entities = VMStateModel.get_by_id(ids)
            
            for e in entities:
                e.res_id = res_id
                e.put()
        except Exception as e:
            logging.error("Error in updating reservation ids in db! {0}".format(e))
    
    @staticmethod          
    def update_ins_ids(params, ins_ids):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            entities = VMStateModel.all()
            entities.filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key)
            entities.filter('state =', VMStateModel.STATE_CREATING)
           
            for (ins_id, e) in zip(ins_ids, entities.run(limit = len(ins_ids))):
                e.ins_id = ins_id
                e.state = VMStateModel.STATE_PENDING
                e.put()
        except Exception as e:
            logging.error("Error in updating instance ids in db! {0}".format(e))
    
    @staticmethod          
    def update_ips(params, ins_ids, pub_ips, pri_ips, local_key):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            if local_key is None:
                raise Exception('Error: Cannot find local key!')
            for (ins_id, pub_ip, pri_ip) in zip(ins_ids, pub_ips, pri_ips):
                e = VMStateModel.all().filter('ins_id =', ins_id).filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key).get()
                e.pub_ip = pub_ip
                e.pri_ip = pri_ip
                e.local_key = local_key
                e.put()
        except Exception as e:
            logging.error("Error in updating ips in db! {0}".format(e))
    
    @staticmethod    
    def set_state(params, ins_ids, state, description=None):
        try:
            infra, access_key, secret_key = VMStateModel.validate_credentials(params)
            if infra is None:
                return
            
            for ins_id in ins_ids:
                e = VMStateModel.all().filter('ins_id =', ins_id).filter('infra =', infra).filter('access_key =', access_key).filter('secret_key =', secret_key).get()
                e.state = state
                if description is not None:
                    e.description = description
                e.put()            
        except Exception as e:
            logging.error("Error in set state.")

    @staticmethod
    def validate_credentials(params):
        infra = None
        access_key = None
        secret_key = None
        if 'infrastructure' in params:
            infra = params['infrastructure']
        else:
            raise Exception('VMStateModel ERROR: Infrastructure is not decided.')
            return None, None, None
             
        if 'credentials' in params:
            if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                access_key = params['credentials']['EC2_ACCESS_KEY']
                secret_key = params['credentials']['EC2_SECRET_KEY']
            else:
                raise Exception('VMStateModel ERROR: Cannot get access key or secret.')
                return None, None, None
        else:
            raise Exception('VMStateModel ERROR: No credentials are provided.')
            return None, None, None
            
        if infra is None or access_key is None or secret_key is None:
            raise Exception('VMStateModel ERROR: Either infrastracture or credetials is none.')
            return None, None, None
        
        return infra, access_key, secret_key

class BackendWorker(webapp2.RequestHandler):
    KEYPREFIX = 'stochss'
    QUEUEHEAD_KEY_TAG = 'queuehead'
    
    def post(self, op, infra, agent, num_vms, parameters, reservation_id):
        utils.log('BackendWorker starts to get the request from remote.')
#         op = self.request.get('op')
#         
#         req_infra = self.request.POST.get('infra')
#         infra = pickle.loads(str(req_infra))
#         req_agent = self.request.POST.get('agent')
#         agent = pickle.loads(str(req_agent))
#         req_num_vms = self.request.POST.get('num_vms')
#         num_vms = pickle.loads(str(req_num_vms))
#         req_parameters = self.request.POST.get('parameters')
#         parameters = pickle.loads(str(req_parameters))
#         req_reservation_id = self.request.POST.get('reservation_id')
#         reservation_id = pickle.loads(str(req_reservation_id))
        
        if op == 'start_vms':
            utils.log('About to start vms.')
#             id = background_thread.start_new_background_thread(self.spawn_vms, [infra, agent, num_vms, parameters, reservation_id])
#             utils.log('Started a background thread to spwan vms, id: {0}.'.format(id))
            self.spawn_vms(infra, agent, num_vms, parameters, reservation_id)
            return
        
        elif op == 'vms_ready':
            logging.info('Vms are ready.')
            
            status_info = infra.reservations.get(reservation_id)
            
            if status_info['vm_info']['public_ips'] is None or len(status_info['vm_info']['public_ips']) == 0:
                logging.info("Error: no instance is connectable.")
                return
            # if running queue head just now, modify parameters and run the left nodes
            if "queue_head" in parameters and parameters["queue_head"] == True:  
                queue_head_ip = status_info['vm_info']['public_ips'][0]
                utils.log('queue_head_ip: {0}'.format(queue_head_ip))
                # celery configuration needs to be updated with the queue head ip                 
                self.update_celery_config_with_queue_head_ip(queue_head_ip)
                
                # copy celery config to queue head
#                 id = background_thread.start_new_background_thread(self.copyCeleryConfigToInstance, [infra, agent, num_vms, parameters, reservation_id])
#                 utils.log('Started a background thread to copy celery configuration to queue head, id: {0}.'.format(id))
                self.copyCeleryConfigToInstance(infra, agent, num_vms, parameters, reservation_id)
                return
                
                # if total number of vms is 1, finish copy and start celery
#                 if num_vms == 1:
#                     #wait for the vms to be configured                
#                     id = background_thread.start_new_background_thread(self.copyCeleryConfigToInstance, [agent, status_info, parameters])
#                     utils.log('Started a background thread to copy celery configuration, id: {0}.'.format(id))
#                     return
#                 # else start left vms
#                 else:
#                     parameters["keyname"] = parameters["keyname"].replace('-'+self.QUEUEHEAD_KEY_TAG, '')
#                     parameters["queue_head"] = False
#                     parameters["num_vms"] = num_vms - 1
#                      
#                     logging.info('KEYNAME: {0}'.format(parameters["keyname"]))
#                     id = background_thread.start_new_background_thread(self.spawn_vms, [infra, agent, num_vms, parameters, reservation_id])           
#                     utils.log('Started a background thread to spwan vms, id: {0}.'.format(id))
#                     return
            else:
#                 id = background_thread.start_new_background_thread(self.copyCeleryConfigToInstance, [infra, agent, num_vms, parameters, reservation_id])
#                 utils.log('Started a background thread to copy celery configuration, id: {0}.'.format(id))
                self.copyCeleryConfigToInstance(infra, agent, num_vms, parameters, reservation_id)
                return
            
        elif op == 'queuehead_configured':
            logging.info('Queue head have already run and been configured.')
            
            if "queue_head" in parameters and parameters["queue_head"] == True: 
                # if total number of vms we want is 1, then it's done
                if num_vms == 1:
                    return;
                # or we need to copy celery to the other nodes
                else:
                    # remove queuehead info
                    status_info = infra.reservations.get(reservation_id)
                    status_info['vm_info'] = {
                        'public_ips': None,
                        'private_ips': None,
                        'instance_ids': None
                    }
                    infra.reservations.put(reservation_id, status_info)
                    parameters["keyname"] = parameters["keyname"].replace('-'+self.QUEUEHEAD_KEY_TAG, '')
                    parameters["queue_head"] = False
                    parameters["num_vms"] = num_vms - 1
                     
                    logging.info('KEYNAME: {0}'.format(parameters["keyname"]))
                    
#                     id = background_thread.start_new_background_thread(self.spawn_vms, [infra, agent, num_vms, parameters, reservation_id])           
#                     utils.log('Started a background thread to spwan vms, id: {0}.'.format(id))
                    self.spawn_vms(infra, agent, num_vms, parameters, reservation_id)
                    return
            
        
        

    def poll_instances_status(self, infra, agent, num_vms, parameters, reservation_id):
        utils.log('Start polling task.')
        
        ins_ids= agent.describe_instances_launched(parameters)
        
        # update db with new instance ids and 'pending'  
        VMStateModel.update_ins_ids(parameters, ins_ids)
         
        POLL_COUNT = 10
        POLL_WAIT = 5
        for x in range(0, POLL_COUNT):
            # get the ips and ids of this keyname
            public_ips, private_ips, instance_ids = agent.describe_instances_running(parameters)
            
            # if we get the requested number of vms (the requested number will be 1 if this is queue head),
            # update reservation information and send a message to the backend server
            if parameters["num_vms"] == len(public_ips):
                # update db with new public ips and private ips
                VMStateModel.update_ips(parameters, instance_ids, public_ips, private_ips, parameters["keyname"])
#                 id = background_thread.start_new_background_thread(self.verify_instances_vis_ssh, [infra, agent, num_vms, parameters, reservation_id, public_ips, private_ips, instance_ids])
#                 utils.log('Started a background thread to verify instances via ssh, id: {0}.'.format(id))

                self.verify_instances_vis_ssh(infra, agent, num_vms, parameters, reservation_id, public_ips, private_ips, instance_ids)
                return;
            else: 
                time.sleep(POLL_WAIT)
                utils.log('polling task: sleep 5 seconds...')
        
        logging.info('Polling timeout. About to terminate some instances:')
        terminate_ins_ids = []
        for ins_id in ins_ids:
            if ins_id not in instance_ids:
                logging.info('instance {0}'.format(ins_id))
                terminate_ins_ids.append(ins_id)
        # terminate timeout instances        
        agent.terminate_some_instances(parameters, terminate_ins_ids)
        # update db with failure information
        VMStateModel.set_state(parameters, terminate_ins_ids, VMStateModel.STATE_FAILED, VMStateModel.DESCRI_FAIL_TO_RUN)
                   
#         id = background_thread.start_new_background_thread(self.verify_instances_vis_ssh, [infra, agent, num_vms, parameters, reservation_id, public_ips, private_ips, instance_ids])
#         utils.log('Started a background thread to verify instances that has run via ssh, id: {0}.'.format(id))
        self.verify_instances_vis_ssh(infra, agent, num_vms, parameters, reservation_id, public_ips, private_ips, instance_ids)
        return
            
    def verify_instances_vis_ssh(self, infra, agent, num_vms, parameters, reservation_id,  public_ips, private_ips, instance_ids):
        utils.log('{0} nodes are running. Now trying to verify ssh connectable.'.format(parameters["num_vms"]))    
                           
        status_info = infra.reservations.get(reservation_id)
                 
        keyfile = "{0}/../{1}.key".format(os.path.dirname(__file__),parameters['keyname'])
        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))
                  
        connected_public_ips = []
        connected_private_ips = []
        connected_instance_ids = []
                  
        for (pub_ip, pri_ip, ins_id) in zip(public_ips, private_ips, instance_ids):
                 
            logging.info('connecting to {0}...'.format(pub_ip))              
            success = self.waitforSSHconnection(keyfile, pub_ip)
                          
            if success == True:
                logging.info('{0} is successfully added'.format(pub_ip))
                connected_public_ips.append(pub_ip)
                connected_private_ips.append(pri_ip)
                connected_instance_ids.append(ins_id)
                  
        # if there are some vms not able to be connected via ssh, 
        # just shut them down explicitly            
        if len(public_ips) != len(connected_public_ips):
            logging.info('Time out on ssh to {0} instances. They will be terminated.'.format(len(public_ips)-len(connected_public_ips)))
 
            try:
                terminate_ins_ids = []
                for ins_id in instance_ids:
                    if ins_id not in connected_instance_ids:
                        terminate_ins_ids.append(ins_id)
                agent.terminate_some_instances(parameters, terminate_ins_ids)
                # update db with failed vms 
                VMStateModel.set_state(parameters, terminate_ins_ids, VMStateModel.STATE_FAILED, VMStateModel.DESCRI_TIMEOUT_ON_SSH)
            except:
                raise Exception("Errors in terminating instances that cannot be connected via ssh.")        
                             
        public_ips = None
        private_ips = None
        instance_ids = None                     
                 
#         status_info['state'] = infra.STATE_RUNNING
        
        # if there are instances already running in this reservation, 
        # specifically, if queue head has just been started in the same reservation,
        # just append the following ips
        if status_info['vm_info'] is not None:
            if status_info['vm_info']['public_ips'] is not None:
                connected_public_ips.extend(status_info['vm_info']['public_ips'])
                connected_private_ips.extend(status_info['vm_info']['private_ips'])
                connected_instance_ids.extend(status_info['vm_info']['instance_ids'])
                logging.info('PUBLIC LENGTH {0}'.format(len(connected_public_ips)))
                        
        status_info['vm_info'] = {
            'public_ips': connected_public_ips,
            'private_ips': connected_private_ips,
            'instance_ids': connected_instance_ids
        }
        infra.reservations.put(reservation_id, status_info)
                 
        # report that vms are ready
#         from_fields = {
#             'op': 'vms_ready',
#             'infra': pickle.dumps(infra),
#             'agent': pickle.dumps(agent),
#             'num_vms': pickle.dumps(num_vms),
#             'parameters': pickle.dumps(parameters),
#             'reservation_id': pickle.dumps(reservation_id)
#         }
#         from_data = urllib.urlencode(from_fields)
#         urlfetch.fetch(url= BACKEND_WORKER_R_URL,
#                        method = urlfetch.POST,
#                        payload = from_data)
        self.post('vms_ready', infra, agent, num_vms, parameters, reservation_id)
        return
        
    def spawn_vms(self, infra, agent, num_vms, parameters, reservation_id):       
        """
        public method for starting a set of VMs

        Args:
        agent           Infrastructure agent in charge of current operation
        num_vms         No. of VMs totally to be spawned
        parameters      A dictionary of parameters
        reservation_id  Reservation ID of the current run request
        """
        
        try:
            # NOTE: We need to make sure that the RabbitMQ server is running if any compute
            # nodes are running as we are using the AMQP broker option for Celery.
#             compute_check_params = {
#                 "credentials": parameters["credentials"],
#                 "key_prefix": parameters["key_prefix"]
#             }
            
            if not self.isQueueHeadRunning(agent, parameters):
                # Queue head is not running, so create a queue head
                utils.log('About to start a queue head.')
                
                parameters["queue_head"] = True
                vms_requested = int(parameters["num_vms"])
                requested_key_name = parameters["keyname"]
                # Only want one queue head, and it must have its own key so
                # it can be differentiated if necessary
                parameters["num_vms"] = 1
                parameters["keyname"] = requested_key_name+'-'+self.QUEUEHEAD_KEY_TAG
            
            security_configured = agent.configure_instance_security(parameters)
            try:
                agent.run_instances(parameters)
            except:
                raise Exception('Errors in running instances in agent.')
            
#             id = background_thread.start_new_background_thread(self.poll_instances_status, [infra, agent, num_vms, parameters, reservation_id])
#             utils.log('Started a background thread to poll the status of starting vms, id: {0}.'.format(id))
            self.poll_instances_status(infra, agent, num_vms, parameters, reservation_id)
            return
        
        except AgentRuntimeException as exception:
            logging.exception(exception)
#             res['state'] = infra.STATE_FAILED
#             res['reason'] = exception.message
#             infra.reservations.put(reservation_id, res)              

    def update_celery_config_with_queue_head_ip(self, queue_head_ip):
        # Write queue_head_ip to file on the appropriate line
        celery_config_filename = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "celeryconfig.py"
        )
        celery_template_filename = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "celeryconfig.py.template"
        )
        celery_config_lines = []
        with open(celery_template_filename, 'r') as celery_config_file:
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

    def copyCeleryConfigToInstance(self, infra, agent, num_vms, params, reservation_id):
        # Update celery config file...it should have the correct IP
        # of the Queue head node, which should already be running.
        # Pass it line by line so theres no weird formatting errors from
        # trying to echo a multi-line file directly on the command line

        #print "reservation={0}".format(reservation)
        #print "params={0}".format(params)
        
        reservation = infra.reservations.get(reservation_id)
        
        keyfile = "{0}/../{1}.key".format(os.path.dirname(__file__),params['keyname'])
        #logging.debug("keyfile = {0}".format(keyfile))
        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))
        
        celery_config_filename = "{0}/{1}".format(os.path.dirname(__file__),"/celeryconfig.py")
        if not os.path.exists(celery_config_filename):
            raise Exception("celery config file not found: {0}".format(celery_config_filename))
        
        
        credentials = params['credentials']
        python_path = "source /home/ubuntu/.bashrc;export PYTHONPATH=/home/ubuntu/pyurdme/:/home/ubuntu/stochss/app/;"
        python_path+='export AWS_ACCESS_KEY_ID={0};'.format(str(credentials['EC2_ACCESS_KEY']))
        python_path+='export AWS_SECRET_ACCESS_KEY={0};'.format( str(credentials['EC2_SECRET_KEY']))
        start_celery_str = "celery -A tasks worker --autoreload --loglevel=info --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1"
        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to write to the process' terminal, screen provides this terminal.
        celerycmd = "sudo screen -d -m bash -c '{1}{0}'\n".format(start_celery_str,python_path)
        
        for ip, ins_id in zip(reservation['vm_info']['public_ips'], reservation['vm_info']['instance_ids']):
            #self.waitforSSHconnection(keyfile, ip)
            
            cmd = "scp -o 'StrictHostKeyChecking no' -i {0} {1} ubuntu@{2}:celeryconfig.py".format(keyfile, celery_config_filename, ip)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                logging.info("scp success!")
                logging.info(" {0} transfered to {1}".format(celery_config_filename, ip))
            else:
                raise Exception("scp failure: {0} not transfered to {1}".format(celery_config_filename, ip))
            
            
            cmd = "ssh -o 'StrictHostKeyChecking no' -i {0} ubuntu@{1} \"{2}\"".format(keyfile, ip, celerycmd)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                # update db with successful running vms    
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_RUNNING, VMStateModel.DESCRI_SUCCESS)
                logging.info("celery started! ")
                logging.info("host ip: {0}".format(ip))
            else:
                agent.terminate_some_instances(params, [ins_id])
                VMStateModel.set_state(params, [ins_id], VMStateModel.STATE_FAILED, VMStateModel.DESCRI_FAIL_TO_COFIGURE_CELERY)
                raise Exception("Failure to start celery on {0}".format(ip))
        
#         from_fields = {
#             'op': 'queuehead_configured',
#             'infra': pickle.dumps(infra),
#             'agent': pickle.dumps(agent),
#             'num_vms': pickle.dumps(num_vms),
#             'parameters': pickle.dumps(params),
#             'reservation_id': pickle.dumps(reservation_id)
#         }
#         from_data = urllib.urlencode(from_fields)
#         urlfetch.fetch(url= BACKEND_WORKER_R_URL,
#                        method = urlfetch.POST,
#                        payload = from_data)
        self.post('queuehead_configured', infra, agent, num_vms, params, reservation_id)
        return
        

    def waitforSSHconnection(self, keyfile, ip):
        
#         cmd = "ssh -o StrictHostKeyChecking=no -i {0} ubuntu@{1} \"pwd\"".format(keyfile, ip)
#         logging.info(cmd)
#          
#         success = os.system(cmd)
#         if success == 0:
#             logging.info("ssh connected to {0}".format(ip))
#             return True
#         else:
#             logging.info("ssh not connected to {0}".format(ip))
#             return False
            #time.sleep(SSH_RETRY_WAIT)
        
     
        SSH_RETRY_COUNT = 8
        SSH_RETRY_WAIT = 3
                
        cmd = "ssh -o StrictHostKeyChecking=no -i {0} ubuntu@{1} \"pwd\"".format(keyfile, ip)
        logging.info(cmd)        
        for x in range(0, SSH_RETRY_COUNT):
            #success = os.system(cmd)
            p = Popen(cmd, shell=True, stdin=PIPE, stdout=PIPE, stderr=STDOUT, close_fds=True)
            output = p.stdout.read()
            if output.startswith('Warning:'):
                logging.info("ssh connected to {0}".format(ip))
                return True
            else:
                logging.info("ssh not connected to {0}, sleeping {1}".format(ip, SSH_RETRY_WAIT))
                time.sleep(SSH_RETRY_WAIT)
                  
#         raise Exception("Timeout waiting to connect to node via SSH")
        logging.info('Timeout waiting to connect to node via SSH.')
        return False
    
    
    def startCeleryViaSSH(self, reservation, params):
        # Even the queue head gets a celery worker
        # NOTE: We only need to use the -n argument to celery command if we are starting
        #       multiple workers on the same machine. Instead, we are starting one worker
        #       per machine and letting that one worker execute one task per core, using
        #       the configuration in celeryconfig.py to ensure that Celery detects the
        #       number of cores and enforces this desired behavior.
        
        credentials = params['credentials']
        python_path = "source /home/ubuntu/.bashrc;export PYTHONPATH=/home/ubuntu/pyurdme/:/home/ubuntu/stochss/app/;"
        python_path+='export AWS_ACCESS_KEY_ID={0};'.format(str(credentials['EC2_ACCESS_KEY']))
        python_path+='export AWS_SECRET_ACCESS_KEY={0};'.format( str(credentials['EC2_SECRET_KEY']))
        start_celery_str = "celery -A tasks worker --autoreload --loglevel=info --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1"
        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to write to the process' terminal, screen provides this terminal.
        celerycmd = "sudo screen -d -m bash -c '{1}{0}'\n".format(start_celery_str,python_path)
        #print "reservation={0}".format(reservation)
        #print "params={0}".format(params)
        keyfile = "{0}/../{1}.key".format(os.path.dirname(__file__),params['keyname'])
        #logging.info("keyfile = {0}".format(keyfile))
        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))
        for ip in reservation['vm_info']['public_ips']:
            self.waitforSSHconnection(keyfile, ip)
            cmd = "ssh -o StrictHostKeyChecking=no -i {0} ubuntu@{1} \"{2}\"".format(keyfile, ip, celerycmd)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                logging.info("celery started on {0}".format(ip))
            else:
                raise Exception("Failure to start celery on {0}".format(ip))
            

    def isQueueHeadRunning(self, agent, params):
        '''
        '''
#         credentials = params["credentials"]
#         key_prefix = self.KEYPREFIX
#         if "key_prefix" not in params:
        params['key_prefix'] = self.KEYPREFIX           
        try:
#             logging.info('key_prefix: {0}'.format(params['key_prefix']))
            all_vms = agent.describe_instances(params, params['key_prefix'])
            if all_vms == None:
                logging.info('No vms are found.')
                return False
            # Just need one running vm with the QUEUEHEAD_KEY_TAG in the name of the keypair
            for vm in all_vms:
                if vm != None and vm['state'] == 'running' and vm['key_name'].find(self.QUEUEHEAD_KEY_TAG) != -1:
                    return True
            return False
        except Exception as e:
            logging.error('Error in testing queuehead running. {0}'.format(e))
            return False
        
class BackendQueue(webapp2.RequestHandler):
    def get(self):
        op = self.request.get('op')
        if op == 'start_vms':
            utils.log('Inside backend queue.')
            req_infra = self.request.get('infra')
            infra = pickle.loads(str(req_infra))
            req_agent = self.request.get('agent')
            agent = pickle.loads(str(req_agent))
            req_num_vms = self.request.get('num_vms')
            num_vms = pickle.loads(str(req_num_vms))
            req_parameters = self.request.get('parameters')
            parameters = pickle.loads(str(req_parameters))
            req_reservation_id = self.request.get('reservation_id')
            reservation_id = pickle.loads(str(req_reservation_id))
            
#             form_fields = {
#             'op': 'start_vms',
#             'infra': pickle.dumps(infra),
#             'agent': pickle.dumps(agent),
#             'num_vms': pickle.dumps(num_vms),
#             'parameters': pickle.dumps(parameters),
#             'reservation_id': pickle.dumps(reservation_id)
#             }
#             from_data = urllib.urlencode(form_fields)
#             
#             #backends.get_url(backend_handler.BACKEND_NAME)
#             
#             urlfetch.fetch(BACKEND_START)
# #             urlfetch.set_default_fetch_deadline(60)
#             
#             result = urlfetch.fetch(url=BACKEND_WORKER_R_URL,
#                                 method = urlfetch.POST,
#                                 payload = from_data)
            worker = BackendWorker()
            worker.post('start_vms', infra, agent, num_vms, parameters, reservation_id)
        
app = webapp2.WSGIApplication([('/backend/worker', BackendWorker), 
                               ('/backend/queue', BackendQueue)],
                              debug=True)
