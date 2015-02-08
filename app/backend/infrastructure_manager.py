from agents.base_agent import BaseAgent, AgentConfigurationException, AgentRuntimeException
from agents.factory import InfrastructureAgentFactory
import json
import thread
from utils import utils
from utils.persistent_dictionary import PersistentStoreFactory, PersistentDictionary
import backend_handler
from backend_handler import VMStateModel
from google.appengine.api import background_thread, modules, urlfetch
from google.appengine.api import taskqueue
from google.appengine.ext import db
import pickle
import re
import urllib
import logging
import os
import datetime

__author__ = 'hiranya'
__email__ = 'hiranya@appscale.com'

class InfrastructureManager:
  """
  InfrastructureManager class is the main entry point to the AppScale
  Infrastructure Manager implementation. An instance of this class can
  be used to start new virtual machines in a specified cloud environment
  and terminate virtual machines when they are no longer required. Instances
  of this class also keep track of the virtual machines spawned by them
  and hence each InfrastructureManager instance can be queried to obtain
  information about any virtual machines spawned by each of them in the
  past.

  This implementation is completely cloud infrastructure agnostic
  and hence can be used to spawn/terminate instances on a wide range of
  cloud (IaaS) environments. All the cloud environment specific operations
  are delegated to a separate cloud agent and the InfrastructureManager
  initializes cloud agents on demand by looking at the 'infrastructure'
  parameter passed into the methods of this class.
  """

  # Default reasons which might be returned by this module
  REASON_BAD_SECRET = 'bad secret'
  REASON_BAD_VM_COUNT = 'bad vm count'
  REASON_BAD_ARGUMENTS = 'bad arguments'
  REASON_RESERVATION_NOT_FOUND = 'reservation_id not found'
  REASON_NONE = 'none'

  # Parameters required by InfrastructureManager
  PARAM_RESERVATION_ID = 'reservation_id'
  PARAM_INFRASTRUCTURE = 'infrastructure'
  PARAM_VMS = 'vms'
  PARAM_KEYNAME = 'keyname'

  # States a particular VM deployment could be in
  STATE_PENDING = 'pending'
  STATE_RUNNING = 'running'
  STATE_FAILED  = 'failed'

  # A list of parameters required to query the InfrastructureManager about
  # the state of a run_instances request.
  DESCRIBE_INSTANCES_REQUIRED_PARAMS = (  )

  # A list of parameters required to initiate a VM deployment process
  RUN_INSTANCES_REQUIRED_PARAMS = (
    PARAM_INFRASTRUCTURE,
  )

  # A list of parameters required to initiate a VM termination process
  TERMINATE_INSTANCES_REQUIRED_PARAMS = ( PARAM_INFRASTRUCTURE, )

  def __init__(self, params=None, blocking=False):
    """
    Create a new InfrastructureManager instance. This constructor
    accepts an optional boolean parameter which decides whether the
    InfrastructureManager instance should operate in blocking mode
    or not. A blocking InfrastructureManager does not return until
    each requested run/terminate operation is complete. This mode
    is useful for testing and verification purposes. In a real-world
    deployment it's advisable to instantiate the InfrastructureManager
    in the non-blocking mode as run/terminate operations could take
    a rather long time to complete. By default InfrastructureManager
    instances are created in the non-blocking mode.

    Args
      params    A dictionary of parameters. Optional parameter. If
                specified it must at least include the 'store_type' parameter.
      blocking  Whether to operate in blocking mode or not. Optional
                and defaults to false.
    """
    self.blocking = blocking
    #self.secret = utils.get_secret()
    self.agent_factory = InfrastructureAgentFactory()
    if params is not None:
      store_factory = PersistentStoreFactory()
      store = store_factory.create_store(params)
      self.reservations = PersistentDictionary(store)
    else:
      self.reservations = PersistentDictionary()

  def describe_instances(self, parameters, secret, prefix=''):
    """
    Query the InfrastructureManager instance for details regarding
    a set of virtual machines spawned in the past. This method accepts
    a dictionary of parameters and a secret for authentication purposes.
    The dictionary of parameters must include a 'reservation_id' parameter
    which is used to reference past virtual machine deployments.

    Args:
      parameters  A dictionary of parameters which contains a valid
                  'reservation_id' parameter. A valid 'reservation_id'
                  is an ID issued by the run_instances method of the
                  same InfrastructureManager object. Alternatively one
                  may provide a valid JSON string instead of a dictionary
                  object.
      secret      A previously established secret

    Returns:
      If the provided secret key is valid and the parameters map contains
      a valid 'reservation_id' parameter, this method will return a
      dictionary containing information regarding the requested past
      virtual machine deployment. This returned map contains several
      keys including 'success', 'state', 'reason' and 'vm_info'. The value
      of 'success' could be True of False depending on the outcome of the
      virtual machine deployment process. If the value of 'success' happens
      to be False, the 'reason' key would contain more details as to what
      caused the deployment to fail. The 'state' key could contain a 'pending'
      value or a 'running' value depending on the current state of the
      virtual machine deployment. And finally the 'vm_info' key would point
      to a another dictionary containing the IP addresses of the spawned virtual
      machines. If the virtual machine deployment had failed or still in the
      'pending' state, this key would contain the value None.

      If this method receives an invalid key or an invalid 'reservation_id'
      parameter, it will return a dictionary containing the keys 'success'
      and 'reason' where 'success' would be set to False, and 'reason' is
      set to a simple error message describing the cause of the error.

    Raises:
      TypeError   If the inputs are not of the expected types
      ValueError  If the input JSON string (parameters) cannot be parsed properly
    """
#    parameters, secret = self.__validate_args(parameters, secret)

#    if self.secret != secret:
#      return self.__generate_response(False, self.REASON_BAD_SECRET)

    for param in self.DESCRIBE_INSTANCES_REQUIRED_PARAMS:
      if not utils.has_parameter(param, parameters):
        return self.__generate_response(False, 'no ' + param)
    result = []
    infrastructure = parameters[self.PARAM_INFRASTRUCTURE]
    agent = self.agent_factory.create_agent(infrastructure)
    return agent.describe_instances(parameters,prefix)
    
#    reservation_id = parameters[self.PARAM_RESERVATION_ID]
#    if self.reservations.has_key(reservation_id):
#      return self.reservations.get(reservation_id)
#    else:
#      return self.__generate_response(False, self.REASON_RESERVATION_NOT_FOUND)

  def run_instances(self, parameters, secret):
    """
    Start a new virtual machine deployment using the provided parameters. The
    input parameter set must include an 'infrastructure' parameter which indicates
    the exact cloud environment to use. Value of this parameter will be used to
    instantiate a cloud environment specific agent which knows how to interact
    with the specified cloud platform. The parameters map must also contain a
    'num_vms' parameter which indicates the number of virtual machines that should
    be spawned. In addition to that any parameters required to spawn VMs in the
    specified cloud environment must be included in the parameters map.

    If this InfrastructureManager instance has been created in the blocking mode,
    this method will not return until the VM deployment is complete. Otherwise
    this method will simply kick off the VM deployment process and return
    immediately.

    Args:
      parameters  A parameter map containing the keys 'infrastructure',
                  'num_vms' and any other cloud platform specific
                  parameters. Alternatively one may provide a valid
                  JSON string instead of a dictionary object.
      secret      A previously established secret (currently not used)

    Returns:
      If the secret is valid and all the required parameters are available in
      the input parameter map, this method will return a dictionary containing
      a special 'reservation_id' key. If the secret is invalid or a required
      parameter is missing, this method will return a different map with the
      key 'success' set to False and 'reason' set to a simple error message.

    Raises:
      TypeError   If the inputs are not of the expected types
      ValueError  If the input JSON string (parameters) cannot be parsed properly
    """

    utils.log('Received a request to run instances.')

    utils.log('Request parameters are {0}'.format(parameters))
    for param in self.RUN_INSTANCES_REQUIRED_PARAMS:
      logging.info('param: {0}'.format(param))
      if not utils.has_parameter(param, parameters):
        return self.__generate_response(False, 'no ' + param)

    infrastructure = parameters[self.PARAM_INFRASTRUCTURE]
    agent = self.agent_factory.create_agent(infrastructure)
    try:
      agent.assert_required_parameters(parameters, BaseAgent.OPERATION_RUN)
    except AgentConfigurationException as exception:
      return self.__generate_response(False, exception.message)

    keyname = parameters[self.PARAM_KEYNAME]
    if keyname is None :
      utils.log('Invalid keyname: '+keyname)
      return self.__generate_response(False, self.REASON_BAD_ARGUMENTS)

    reservation_id = utils.get_random_alphanumeric()
#     status_info = {
#       'success': True,
#       'reason': 'received run request',
#       'state': self.STATE_PENDING,
#       'vm_info': None
#     }
#     self.reservations.put(reservation_id, status_info)
    # update db with reservation ids
    VMStateModel.update_res_ids(parameters, parameters[VMStateModel.IDS], reservation_id)
    
    utils.log('Generated reservation id {0} for this request.'.format(
      reservation_id)
    )
    
    if self.blocking:
      utils.log('Running spawn_vms in blocking mode')
      result = self.__spawn_vms(agent, len(parameters['vms']), parameters, reservation_id)
      # NOTE: We will only be able to return an IP for the started instances when run in blocking
      #       mode, but this is needed to update the queue head IP in celeryconfig.py.
      return result # self.__generate_response(

    else:
      utils.log('Running spawn_vms in non-blocking mode')
      
      # send the spawn vms task to backend server
      from_fields = {
            'op': 'start_vms',
            'infra': pickle.dumps(self),
            'agent': pickle.dumps(agent),
            'parameters': pickle.dumps(parameters),
            'reservation_id': pickle.dumps(reservation_id)
      }
#       from_data = urllib.urlencode(from_fields)
#       
#       rpc = urlfetch.create_rpc()    
#       urlfetch.make_fetch_call(rpc=rpc, url=backend_worker_url,
#                                method = urlfetch.POST,
#                                payload = from_data)
#     os.environ['HTTP_HOST'] = "127.0.0.1:8080"
    
    taskqueue.add(url='/backend/queue', params=from_fields, method='GET')

      
    utils.log('Successfully sent request to backend server, reservation_id: {0}.'.format(reservation_id))
#     return self.__generate_response(True,
#       self.REASON_NONE, {'reservation_id': reservation_id})
    return self.__generate_response(True, 'Succeed in sending request to backend server.')

  def synchronize_db(self, params):
    last_time = None
    set_gap_large = False
    try: 
        e = db.GqlQuery("SELECT * FROM VMStateSyn").get()
        if e:
            last_time = e.last_syn
        else:
            last_time = datetime.datetime.now() - datetime.timedelta(1)
#         file = open(backend_handler.DB_SYN_PATH)
#         line = file.readline()
#         date_string = re.match(r'\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}', line).group(0)
#         last_time = datetime.datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')               
    except Exception as e:
        logging.error('Error: have errors in opening db_syn file. {0}'.format(e))
        return
                       
    if last_time is None:
        raise Exception('Error: cannot read last synchronization infromation of db!')
        return
    else:
        now = datetime.datetime.now()
        delta = now - last_time
        gap = delta.total_seconds()
        logging.info('Time now: {0}'.format(now))
        logging.info('Time last synchronization: {0}'.format(last_time))
        logging.info('Time in between: {0}'.format(gap))
        if gap < backend_handler.SynchronizeDB.PAUSE+1:
            utils.log('Less than {0} seconds to synchronize db.'.format(backend_handler.SynchronizeDB.PAUSE))
            return
                    
        logging.info('Start synchronize db every {0} seconds.'.format(backend_handler.SynchronizeDB.PAUSE))
        infrastructure = params[self.PARAM_INFRASTRUCTURE]
        agent = self.agent_factory.create_agent(infrastructure)
        from_fields = {
                       'op': 'start_db_syn',
                       'agent': pickle.dumps(agent),
                       'parameters': pickle.dumps(params),
                       }
        taskqueue.add(url='/backend/queue', params=from_fields, method='GET')
    
    
      
  def terminate_instances(self, parameters,prefix=''):
    """
    Terminate a group of virtual machines using the provided parameters.
    The input parameter map must contain an 'infrastructure' parameter which
    will be used to instantiate a suitable cloud agent. Any additional
    environment specific parameters should also be available in the same
    map.

    If this InfrastructureManager instance has been created in the blocking mode,
    this method will not return until the VM deployment is complete. Otherwise
    this method simply starts the VM termination process and returns immediately.

    Args:
      parameters  A dictionary of parameters containing the required
                  'infrastructure' parameter and any other platform
                  dependent required parameters. Alternatively one
                  may provide a valid JSON string instead of a dictionary
                  object.
      secret      A previously established secret

    Returns:
      If the secret is valid and all the parameters required to successfully
      start a termination process are present in the parameters dictionary,
      this method will return a dictionary with the key 'success' set to
      True. Otherwise it returns a dictionary with 'success' set to False
      and 'reason' set to a simple error message.

    Raises:
      TypeError   If the inputs are not of the expected types
      ValueError  If the input JSON string (parameters) cannot be parsed properly
    """
    infrastructure = parameters[self.PARAM_INFRASTRUCTURE]
    agent = self.agent_factory.create_agent(infrastructure)
    if self.blocking:
      self.__kill_vms(agent, parameters, prefix)
    else:
      thread.start_new_thread(self.__kill_vms, (agent, parameters, prefix))
    return self.__generate_response(True, self.REASON_NONE)


  def __spawn_vms(self, agent, num_vms, parameters, reservation_id):
    """
    Private method for starting a set of VMs

    Args:
      agent           Infrastructure agent in charge of current operation
      num_vms         No. of VMs to be spawned
      parameters      A dictionary of parameters
      reservation_id  Reservation ID of the current run request
    """
    status_info = self.reservations.get(reservation_id)
    try:
      security_configured = agent.configure_instance_security(parameters)
      instance_info = agent.run_instances(num_vms, parameters,
        security_configured)
      ids = instance_info[0]
      public_ips = instance_info[1]
      private_ips = instance_info[2]
      status_info['state'] = self.STATE_RUNNING
      status_info['vm_info'] = {
        'public_ips': public_ips,
        'private_ips': private_ips,
        'instance_ids': ids
      }
      utils.log('Successfully finished request {0}.'.format(reservation_id))
    except AgentRuntimeException as exception:
      status_info['state'] = self.STATE_FAILED
      status_info['reason'] = exception.message
    self.reservations.put(reservation_id, status_info)
    return status_info


  def __kill_vms(self, agent, parameters, prefix=''):
    """
    Private method for stopping a set of VMs

    Args:
      agent       Infrastructure agent in charge of current operation
      parameters  A dictionary of parameters
    """
    agent.terminate_instances(parameters, prefix)

  def __generate_response(self, status, msg, extra=None):
    """
    Generate an infrastructure manager service response

    Args:
      status  A boolean value indicating the status
      msg     A reason message (useful if this a failed operation)
      extra   Any extra fields to be included in the response (Optional)

    Returns:
      A dictionary containing the operation response
    """
    response = {'success': status, 'reason': msg}
    if extra is not None:
      for key, value in extra.items():
        response[key] = value
    return response

  def __validate_args(self, parameters, secret):
    """
    Validate the arguments provided by user.

    Args:
      parameters  A dictionary (or a JSON string) provided by the client
      secret      Secret sent by the client

    Returns:
      Processed user arguments

    Raises
      TypeError If at least one user argument is not of the current type
    """
    if type(parameters) != type('') and type(parameters) != type({}):
      raise TypeError('Invalid data type for parameters. Must be a '
                      'JSON string or a dictionary.')
    elif type(secret) != type(''):
      raise TypeError('Invalid data type for secret. Must be a string.')

    if type(parameters) == type(''):
      parameters = json.loads(parameters)
    return parameters, secret

  def validate_credentials(self, parameters):
      """
      Validate if the creds work with IAAS
      
      Returns:
          True if they work or else False is returned
      """
      infrastructure = parameters[self.PARAM_INFRASTRUCTURE]
      agent = self.agent_factory.create_agent(infrastructure)
      return agent.validate_credentials(parameters['credentials'])
      
