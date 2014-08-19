
import webapp2
from google.appengine.api import background_thread, backends, urlfetch
from agents.base_agent import AgentRuntimeException
from utils import utils
import pickle
import urllib
import sys
import os
import logging
import backendservice

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
        if op == 'start_vms':
            utils.log('About to start vms.')
            req_infra = self.request.get('infra')
            infra = pickle.loads(str(req_infra))
            req_agent = self.request.get('agent')
            agent = pickle.loads(str(req_agent))
            req_num_vms = self.request.POST.get('num_vms')
            num_vms = pickle.loads(str(req_num_vms))
            req_parameters = self.request.POST.get('parameters')
            parameters = pickle.loads(str(req_parameters))
            req_reservation_id = self.request.POST.get('reservation_id')
            reservation_id = pickle.loads(str(req_reservation_id))
            id = background_thread.start_new_background_thread(self.spawn_cluster, [infra, agent, num_vms, parameters, reservation_id])
            utils.log('Already started a background thread, id: {0}.'.format(id))


    def spawn_vms(self, infra, agent, num_vms, parameters, reservation_id):
        
        status_info = infra.reservations.get(reservation_id)
        security_configured = agent.configure_instance_security(parameters)
        instance_info = agent.run_instances(num_vms, parameters, security_configured)
        ids = instance_info[0]
        public_ips = instance_info[1]
        private_ips = instance_info[2]
        status_info['state'] = infra.STATE_RUNNING
        status_info['vm_info'] = {
            'public_ips': public_ips,
            'private_ips': private_ips,
            'instance_ids': ids
        }
        utils.log('Successfully launched nodes request {0}.'.format(reservation_id))
        infra.reservations.put(reservation_id, status_info)
        return status_info

    def spawn_cluster(self, infra, agent, num_vms, parameters, reservation_id):
        """
        public method for starting a set of VMs

        Args:
        agent           Infrastructure agent in charge of current operation
        num_vms         No. of VMs to be spawned
        parameters      A dictionary of parameters
        reservation_id  Reservation ID of the current run request
        """
        try:
            service = backendservice.backendservices()
            compute_check_params = {
                "credentials": parameters["credentials"],
                "key_prefix": parameters["key_prefix"]
            }
            if service.isQueueHeadRunning(compute_check_params):
                #Queue head is running so start as many vms as requested
                res = self.spawn_vms( infra, agent, num_vms, parameters, reservation_id)
#                service.copyCeleryConfigToInstance(res, parameters)
#                # start celery via ssh
#                service.startCeleryViaSSH(res, parameters)
            else:
                # Need to start the queue head (RabbitMQ)
                parameters["queue_head"] = True
                vms_requested = int(parameters["num_vms"])
                requested_key_name = parameters["keyname"]
                # Only want one queue head, and it must have its own key so
                # it can be differentiated if necessary
                parameters["num_vms"] = 1
                parameters["keyname"] = requested_key_name+'-'+service.QUEUEHEAD_KEY_TAG
                #res = i.run_instances(params,[])
                res = self.spawn_vms( infra, agent, num_vms, parameters, reservation_id)


                #NOTE: This relies on the InfrastructureManager being run in blocking mode...
                queue_head_ip = res["vm_info"]["public_ips"][0]
                utils.info('queue_head_ip: {0}'.format(queue_head_ip))
                service.update_celery_config_with_queue_head_ip(queue_head_ip)
#                service.copyCeleryConfigToInstance(res, parameters)
#                # start celery via ssh
#                service.startCeleryViaSSH(res, parameters)

                parameters["keyname"] = requested_key_name
                parameters["queue_head"] = False
                if vms_requested > 1:
                    #subtract 1 since we can use the queue head as a worker
                    parameters["num_vms"] = vms_requested - 1
                    #res = i.run_instances(params,[])
                    res = self.spawn_vms( infra, agent, num_vms, parameters, reservation_id)

#                    service.copyCeleryConfigToInstance(res, parameters)
#                    # start celery via ssh
#                    service.startCeleryViaSSH(res, parameters)

                parameters["num_vms"] = vms_requested

            utils.log('Successfully finished request {0}.'.format(reservation_id))
        except AgentRuntimeException as exception:
            logging.exception(exception)
            res['state'] = infra.STATE_FAILED
            res['reason'] = exception.message
            infra.reservations.put(reservation_id, res)

app = webapp2.WSGIApplication([('/backend/worker', BackendWorker)],
                              debug=True)
