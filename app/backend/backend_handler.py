
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
import backendservice
import thread
from tasks import *

__author__ = 'mengyuan'
__email__ = 'gmy.melissa@gmail.com'


BACKEND_NAME = 'backendthread'

BACKEND_START = '/_ah/start'
BACKEND_WORKER_R_URL = '/backend/worker'
BACKEND_MANAGER_R_URL = '/backend/manager'



class BackendWorker(webapp2.RequestHandler):
    def post(self):
        utils.log('BackendWorker starts to get the request from remote.')
        op = self.request.get('op')
        
        req_infra = self.request.POST.get('infra')
        infra = pickle.loads(str(req_infra))
        req_agent = self.request.POST.get('agent')
        agent = pickle.loads(str(req_agent))
        req_num_vms = self.request.POST.get('num_vms')
        num_vms = pickle.loads(str(req_num_vms))
        req_parameters = self.request.POST.get('parameters')
        parameters = pickle.loads(str(req_parameters))
        req_reservation_id = self.request.POST.get('reservation_id')
        reservation_id = pickle.loads(str(req_reservation_id))
        
        if op == 'start_vms':
            utils.log('About to start vms.')
            
            id = background_thread.start_new_background_thread(self.spawn_vms, [infra, agent, num_vms, parameters, reservation_id])
            utils.log('Already started a background thread, id: {0}.'.format(id))
#            utils.log('Already started a background thread.')
        elif op == 'vms_ready':
            logging.info('Vms are ready.')
            
            status_info = infra.reservations.get(reservation_id)
            # if running queue head just now, modify parameters and run the left nodes
            if parameters["queue_head"] == True:  
                queue_head_ip = status_info['vm_info']['public_ips'][0]
                utils.log('queue_head_ip: {0}'.format(queue_head_ip))
                                 
                self.update_celery_config_with_queue_head_ip(queue_head_ip)
                
                # if total number of vms is 1, finish copy and start celery
                if num_vms == 1:
                    self.copyCeleryConfigToInstance(status_info, parameters)
                    self.startCeleryViaSSH(status_info, parameters)
                # else start left vms
                else:
                    service = backendservice.backendservices()
                    parameters["keyname"] = parameters["keyname"].replace('-'+service.QUEUEHEAD_KEY_TAG, '')
                    parameters["queue_head"] = False
                    parameters["num_vms"] = num_vms - 1
                
                    background_thread.start_new_background_thread(self.spawn_vms, [infra, agent, num_vms, parameters, reservation_id])           
            
            else:
                self.copyCeleryConfigToInstance(status_info, parameters)
                self.startCeleryViaSSH(status_info, parameters)   

    def poll_instances_status(self, infra, agent, num_vms, parameters, reservation_id):
        utils.log('Start polling task.')
        while True:
            public_ips, private_ips, instance_ids = agent.describe_instances_old(parameters)
            
            # if we get the requested number of vms (the requested number will be 1 if this is queue head),
            # update reservation information and send a message to the backend server
            if parameters["num_vms"] == len(public_ips):
                 status_info = infra.reservations.get(reservation_id)
                 status_info['state'] = infra.STATE_RUNNING
                 status_info['vm_info'] = {
                    'public_ips': public_ips,
                    'private_ips': private_ips,
                    'instance_ids': instance_ids
                }
                 infra.reservations.put(reservation_id, status_info)
                 
                 # report that vms are ready
                 from_fields = {
                    'op': 'vms_ready',
                    'infra': pickle.dumps(infra),
                    'agent': pickle.dumps(agent),
                    'num_vms': pickle.dumps(num_vms),
                    'parameters': pickle.dumps(parameters),
                    'reservation_id': pickle.dumps(reservation_id)
                 }
                 from_data = urllib.urlencode(from_fields)
                 urlfetch.fetch(url= 'http://%s' % modules.get_hostname(BACKEND_NAME)+BACKEND_WORKER_R_URL,
                               method = urlfetch.POST,
                               payload = from_data)
                 return;
             
            time.sleep(3)
            utils.log('polling task: sleep 3 seconds...')
        
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
            service = backendservice.backendservices()
            compute_check_params = {
                "credentials": parameters["credentials"],
                "key_prefix": parameters["key_prefix"]
            }
            
            if not service.isQueueHeadRunning(compute_check_params):
                # Queue head is not running, so create a queue head
                utils.log('About to start a queue head.')
                
                parameters["queue_head"] = True
                vms_requested = int(parameters["num_vms"])
                requested_key_name = parameters["keyname"]
                # Only want one queue head, and it must have its own key so
                # it can be differentiated if necessary
                parameters["num_vms"] = 1
                parameters["keyname"] = requested_key_name+'-'+service.QUEUEHEAD_KEY_TAG
            
            
            security_configured = agent.configure_instance_security(parameters)
            background_thread.start_new_background_thread(self.poll_instances_status, [infra, agent, num_vms, parameters, reservation_id])
            agent.run_instances(parameters)
        
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

    def copyCeleryConfigToInstance(self, reservation, params):
        # Update celery config file...it should have the correct IP
        # of the Queue head node, which should already be running.
        # Pass it line by line so theres no weird formatting errors from
        # trying to echo a multi-line file directly on the command line

        #print "reservation={0}".format(reservation)
        #print "params={0}".format(params)
        keyfile = "{0}/../{1}.key".format(os.path.dirname(__file__),params['keyname'])
        #logging.debug("keyfile = {0}".format(keyfile))
        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))
        
        celery_config_filename = "{0}/{1}".format(os.path.dirname(__file__),"/celeryconfig.py")
        if not os.path.exists(celery_config_filename):
            raise Exception("celery config file not found: {0}".format(celery_config_filename))
        
        for ip in reservation['vm_info']['public_ips']:
            self.waitforSSHconnection(keyfile, ip)
            cmd = "scp -o 'StrictHostKeyChecking no' -i {0} {1} ubuntu@{2}:celeryconfig.py".format(keyfile, celery_config_filename, ip)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                logging.info("scp success: {0} transfered to {1}".format(celery_config_filename, ip))
            else:
                raise Exception("scp failure: {0} not transfered to {1}".format(celery_config_filename, ip))

    def waitforSSHconnection(self, keyfile, ip):
        SSH_RETRY_COUNT = 30
        SSH_RETRY_WAIT = 3
        for _ in range(0, SSH_RETRY_COUNT):
            cmd = "ssh -o 'StrictHostKeyChecking no' -i {0} ubuntu@{1} \"pwd\"".format(keyfile, ip)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                logging.info("ssh connected to {0}".format(ip))
                return True
            else:
                logging.info("ssh not connected to {0}, sleeping {1}".format(ip, SSH_RETRY_WAIT))
                time.sleep(SSH_RETRY_WAIT)
                
        raise Exception("Timeout waiting to connect to node via SSH")
    
    
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
            cmd = "ssh -o 'StrictHostKeyChecking no' -i {0} ubuntu@{1} \"{2}\"".format(keyfile, ip, celerycmd)
            logging.info(cmd)
            success = os.system(cmd)
            if success == 0:
                logging.info("celery started on {0}".format(ip))
            else:
                raise Exception("Failure to start celery on {0}".format(ip))
            


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
            
            form_fields = {
            'op': 'start_vms',
            'infra': pickle.dumps(infra),
            'agent': pickle.dumps(agent),
            'num_vms': pickle.dumps(num_vms),
            'parameters': pickle.dumps(parameters),
            'reservation_id': pickle.dumps(reservation_id)
            }
            from_data = urllib.urlencode(form_fields)
          
            backend_url = 'http://%s' % modules.get_hostname(BACKEND_NAME)#backends.get_url(backend_handler.BACKEND_NAME)
     
            backend_worker_url = backend_url + BACKEND_WORKER_R_URL
            result = urlfetch.fetch(url=backend_worker_url,
                                method = urlfetch.POST,
                                payload = from_data)
        
app = webapp2.WSGIApplication([('/backend/worker', BackendWorker), 
                               ('/backend/queue', BackendQueue)],
                              debug=True)
