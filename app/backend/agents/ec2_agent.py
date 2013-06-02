
from backend.agents.base_agent import BaseAgent, AgentConfigurationException, AgentRuntimeException
import sys,os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../lib/boto'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))
print sys.path
import boto
from boto.exception import EC2ResponseError
import datetime
import os
import time,uuid
from boto.ec2.cloudwatch import MetricAlarm
from backend.utils import utils
from uuid import uuid4
import logging

__author__ = 'hiranya, anand'
__email__ = 'hiranya@appscale.com, anand@cs.ucsb.edu'

class EC2Agent(BaseAgent):
  """
  EC2 infrastructure agent class which can be used to spawn and terminate
  VMs in an EC2 based environment.
  """

  # The maximum amount of time, in seconds, that we are willing to wait for
  # a virtual machine to start up, from the initial run-instances request.
  # Setting this value is a bit of an art, but we choose the value below
  # because our image is roughly 10GB in size, and if Eucalyptus doesn't
  # have the image cached, it could take half an hour to get our image
  # started.
  MAX_VM_CREATION_TIME = 1200

  # The amount of time that run_instances waits between each describe-instances
  # request. Setting this value too low can cause Eucalyptus to interpret
  # requests as replay attacks.
  SLEEP_TIME = 20

  PARAM_CREDENTIALS = 'credentials'
  PARAM_GROUP = 'group'
  PARAM_IMAGE_ID = 'image_id'
  PARAM_INSTANCE_TYPE = 'instance_type'
  PARAM_KEYNAME = 'keyname'
  PARAM_INSTANCE_IDS = 'instance_ids'
  PARAM_SPOT = 'use_spot_instances'
  PARAM_SPOT_PRICE = 'max_spot_price'

  REQUIRED_EC2_RUN_INSTANCES_PARAMS = (
    PARAM_CREDENTIALS,
    PARAM_GROUP,
    PARAM_IMAGE_ID,
    PARAM_INSTANCE_TYPE,
    PARAM_KEYNAME,
    PARAM_SPOT
  )

  REQUIRED_EC2_TERMINATE_INSTANCES_PARAMS = (
    PARAM_CREDENTIALS,
    PARAM_INSTANCE_IDS
  )

  DESCRIBE_INSTANCES_RETRY_COUNT = 3

  def configure_instance_security(self, parameters):
    """
    Setup EC2 security keys and groups. Required input values are read from
    the parameters dictionary. More specifically, this method expects to
    find a 'keyname' parameter and a 'group' parameter in the parameters
    dictionary. Using these provided values, this method will create a new
    EC2 key-pair and a security group. Security group will be granted permissions
    to access any port on the instantiated VMs. (Also see documentation for the
    BaseAgent class)

    Args:
      parameters  A dictionary of parameters
    """
    keyname = parameters[self.PARAM_KEYNAME]
    #keyname = "stochss-keypair"
    group = parameters[self.PARAM_GROUP]
    #group = "stochss-security-group"

    key_path = '{0}.key'.format(keyname)
    ssh_key = os.path.abspath(key_path)
    utils.log('About to spawn EC2 instances - ' \
              'Expecting to find a key at {0}'.format(ssh_key))
    
      #return False

    try:
      conn = self.open_connection(parameters)
      if os.path.exists(ssh_key):
          utils.log('SSH keys found in the local system - '
                'Not initializing EC2 security')
      else:
          utils.log('Creating key pair: ' + keyname)
          key_pair = conn.create_key_pair(keyname)
          utils.write_key_file(ssh_key, key_pair.material)

      security_groups = conn.get_all_security_groups()
      group_exists = False
      for security_group in security_groups:
        if security_group.name == group:
          group_exists = True
          break

      if not group_exists:
        utils.log('Creating security group: ' + group)
        newgroup = conn.create_security_group(group, 'stochSS security group')
        newgroup.authorize('tcp', 22, 22, '0.0.0.0/0')
        newgroup.authorize('tcp', 5672, 5672, '0.0.0.0/0')
        newgroup.authorize('tcp', 6379, 6379, '0.0.0.0/0')
        newgroup.authorize('tcp', 11211, 11211, '0.0.0.0/0')
        newgroup.authorize('tcp', 55672, 55672, '0.0.0.0/0')
      return True
    except EC2ResponseError as exception:
      self.handle_failure('EC2 response error while initializing '
                          'security: ' + exception.error_message)
    except Exception as exception:
      self.handle_failure('Error while initializing EC2 '
                          'security: ' + exception.message)

  def assert_required_parameters(self, parameters, operation):
    """
    Assert that all the parameters required for the EC2 agent are in place.
    (Also see documentation for the BaseAgent class)

    Args:
      parameters  A dictionary of parameters
      operation   Operations to be invoked using the above parameters
    """
    required_params = ()
    if operation == BaseAgent.OPERATION_RUN:
      required_params = self.REQUIRED_EC2_RUN_INSTANCES_PARAMS
    elif operation == BaseAgent.OPERATION_TERMINATE:
      required_params = self.REQUIRED_EC2_TERMINATE_INSTANCES_PARAMS

    for param in required_params:
      if not utils.has_parameter(param, parameters):
        raise AgentConfigurationException('no ' + param)

  def describe_instances_old(self, parameters):
    """
    Retrieves the list of running instances that have been instantiated using a
    particular EC2 keyname. The target keyname is read from the input parameter
    map. (Also see documentation for the BaseAgent class)

    Args:
      parameters  A dictionary containing the 'keyname' parameter

    Returns:
      A tuple of the form (public_ips, private_ips, instances) where each
      member is a list.
    """
    instance_ids = []
    public_ips = []
    private_ips = []

    conn = self.open_connection(parameters)
    reservations = conn.get_all_instances()
    instances = [i for r in reservations for i in r.instances]
    for i in instances:
      if i.state == 'running' and i.key_name == parameters[self.PARAM_KEYNAME]:
        instance_ids.append(i.id)
        public_ips.append(i.public_dns_name)
        private_ips.append(i.private_dns_name)
    return public_ips, private_ips, instance_ids

  def describe_instances(self, parameters):
    """
    Retrieves the list of running instances that have been instantiated using a
    particular EC2 keyname. The target keyname is read from the input parameter
    map. (Also see documentation for the BaseAgent class)

    Args:
      parameters  A dictionary containing the 'keyname' parameter

    Returns:
      A tuple of the form (public_ips, private_ips, instances) where each
      member is a list.
    """
    conn = self.open_connection(parameters)
    reservations = conn.get_all_instances()
    instanceList = []
    instances = [i for r in reservations for i in r.instances]
    for i in instances:
        instance = dict()
        instance["id"] = i.id
        instance["public_ip"] = i.public_dns_name
        instance["private_ip"] = i.private_dns_name
        instance["state"]= i.state
        instanceList.append(instance)
    return instanceList


  def make_sleepy(self,parameters, instance_id):
      
        print "Making instance", instance_id, "sleepy..."
        credentials = parameters[self.PARAM_CREDENTIALS]
        ec2 = boto.connect_cloudwatch(str(credentials['EC2_ACCESS_KEY']),str(credentials['EC2_SECRET_KEY']))
        region = "us-east-1"
        terminate_arn = 'arn:aws:automate:{0}:ec2:terminate'.format(region)
        alarm_name = 'ec2_shutdown_sleepy_{0}'.format(instance_id)
     
        # define our alarm to terminate the instance if it gets sleepy
        # i.e. if CPU utilisation is less than 10% for 1 x 4 hr intervals    
        sleepy_alarm = MetricAlarm(
            name=alarm_name, namespace='AWS/EC2',
            metric='CPUUtilization', statistic='Average',
            comparison='<', threshold='10',
            period='3600', evaluation_periods=4,
            alarm_actions=[terminate_arn],
            dimensions={'InstanceId':instance_id})
        # create the alarm.. Zzzz!
        ec2.create_alarm(sleepy_alarm)


  def run_instances(self, count, parameters, security_configured):
    """
    Spawns the specified number of EC2 instances using the parameters
    provided. This method is blocking in that it waits until the
    requested VMs are properly booted up. However if the requested
    VMs cannot be procured within 1800 seconds, this method will treat
    it as an error and return. (Also see documentation for the BaseAgent
    class)

    Args:
      count               No. of VMs to spawned
      parameters          A dictionary of parameters. This must contain 'keyname',
                          'group', 'image_id' and 'instance_type' parameters.
      security_configured Uses this boolean value as an heuristic to
                          detect brand new AppScale deployments.

    Returns:
      A tuple of the form (instances, public_ips, private_ips)
    """
    image_id = parameters[self.PARAM_IMAGE_ID]
    instance_type = parameters[self.PARAM_INSTANCE_TYPE]
    keyname = parameters[self.PARAM_KEYNAME]
    group = parameters[self.PARAM_GROUP]
    spot = parameters[self.PARAM_SPOT]

    utils.log('[{0}] [{1}] [{2}] [{3}] [ec2] [{4}] [{5}]'.format(count,
      image_id, instance_type, keyname, group, spot))


    credentials = parameters[self.PARAM_CREDENTIALS]
    creds = parameters['credentials']
    f = open('userfile','w')
    userstr  = """#!/bin/bash \nset -x\nexec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1\ntouch anand3.txt\necho "testing logfile"\necho BEGIN\ndate '+%Y-%m-%d %H:%M:%S'\necho END\ntouch anand2.txt\n"""
    userstr+='export AWS_ACCESS_KEY_ID={0}\n'.format(str(credentials['EC2_ACCESS_KEY']))
    userstr+='export AWS_SECRET_ACCESS_KEY={0}\n'.format( str(credentials['EC2_SECRET_KEY']))
    userstr+='echo export AWS_ACCESS_KEY_ID={0} >> ~/.bashrc\n'.format(str(credentials['EC2_ACCESS_KEY']))
    userstr+='echo export AWS_SECRET_ACCESS_KEY={0} >> ~/.bashrc\n'.format( str(credentials['EC2_SECRET_KEY']))
    userstr+='echo export STOCHKIT_HOME={0} >> ~/.bashrc\n'.format("/home/ubuntu/StochKit2.0.6/")
    userstr+='echo export AWS_SECRET_ACCESS_KEY={0} >> /home/ubuntu/.bashrc\n'.format( str(credentials['EC2_SECRET_KEY']))
    userstr+='echo export AWS_ACCESS_KEY_ID={0} >> /home/ubuntu/.bashrc\n'.format(str(credentials['EC2_ACCESS_KEY']))
    userstr+='echo export STOCHKIT_HOME={0} >> /home/ubuntu/.bashrc\n'.format("/home/ubuntu/StochKit2.0.6/")
    userstr+='source ~/.bashrc \n'
    userstr+='source /home/ec2-user/.bashrc \n'
    userstr+="nohup celery -A tasks worker --autoreload --loglevel=info -n {0} --workdir /home/ubuntu > /home/ubuntu/nohup.log 2>&1 & \n".format(str(uuid.uuid4()))
    f.write(userstr)
    f.close()
    start_time = datetime.datetime.now()
    active_public_ips = []
    active_private_ips = []
    active_instances = []

    try:
      attempts = 1
      while True:
        instance_info = self.describe_instances_old(parameters)
        active_public_ips = instance_info[0]
        active_private_ips = instance_info[1]
        active_instances = instance_info[2]

        # If security has been configured on this agent just now,
        # that's an indication that this is a fresh cloud deployment.
        # As such it's not expected to have any running VMs.
        if len(active_instances) > 0 or security_configured:
          break
        elif attempts == self.DESCRIBE_INSTANCES_RETRY_COUNT:
          self.handle_failure('Failed to invoke describe_instances')
        attempts += 1

      conn = self.open_connection(parameters)
      if spot == 'True':
        price = parameters[self.PARAM_SPOT_PRICE]
        conn.request_spot_instances(str(price), image_id, key_name=keyname,
          security_groups=[group], instance_type=instance_type, count=count, user_data = userstr)
      else:
        conn.run_instances(image_id, count, count, key_name=keyname,
          security_groups=[group], instance_type=instance_type, user_data=userstr)

      instance_ids = []
      public_ips = []
      private_ips = []
      utils.sleep(10)
      end_time = datetime.datetime.now() + datetime.timedelta(0,
        self.MAX_VM_CREATION_TIME)
      now = datetime.datetime.now()

      while now < end_time:
        time_left = (end_time - now).seconds
        utils.log('[{0}] {1} seconds left...'.format(now, time_left))
        instance_info = self.describe_instances_old(parameters)
        public_ips = instance_info[0]
        private_ips = instance_info[1]
        instance_ids = instance_info[2]
        public_ips = utils.diff(public_ips, active_public_ips)
        private_ips = utils.diff(private_ips, active_private_ips)
        instance_ids = utils.diff(instance_ids, active_instances)
        if count == len(public_ips):
          break
        time.sleep(self.SLEEP_TIME)
        now = datetime.datetime.now()

      if not public_ips:
        self.handle_failure('No public IPs were able to be procured '
                            'within the time limit')

      if len(public_ips) != count:
        for index in range(0, len(public_ips)):
          if public_ips[index] == '0.0.0.0':
            instance_to_term = instance_ids[index]
            utils.log('Instance {0} failed to get a public IP address and' \
                      ' is being terminated'.format(instance_to_term))
            conn.terminate_instances([instance_to_term])

      end_time = datetime.datetime.now()
      total_time = end_time - start_time
      if spot:
        utils.log('TIMING: It took {0} seconds to spawn {1} spot ' \
                  'instances'.format(total_time.seconds, count))
      else:
        utils.log('TIMING: It took {0} seconds to spawn {1} ' \
                  'regular instances'.format(total_time.seconds, count))
        
        utils.log('Creating Alarms for the instances')
        for machineid in instance_ids:
            self.make_sleepy(parameters, machineid)   
      return instance_ids, public_ips, private_ips
    except EC2ResponseError as exception:
      self.handle_failure('EC2 response error while starting VMs: ' +
                          exception.error_message)
    except Exception as exception:
      if isinstance(exception, AgentRuntimeException):
        raise exception
      else:
        self.handle_failure('Error while starting VMs: ' + exception.message)

  def terminate_instances(self, parameters):
    """
    Stop one of more EC2 instances using. The input instance IDs are
    fetched from the 'instance_ids' parameters in the input map. (Also
    see documentation for the BaseAgent class)

    Args:
      parameters  A dictionary of parameters
    """
    conn = self.open_connection(parameters)
    instance_ids = []
    reservations = conn.get_all_instances()
    instances = [i for r in reservations for i in r.instances]
    for i in instances:
        instance_ids.append(i.id)
    terminated_instances = conn.terminate_instances(instance_ids)
    for instance in terminated_instances:
      utils.log('Instance {0} was terminated'.format(instance.id))


  def open_connection(self, parameters):
    """
    Initialize a connection to the back-end EC2 APIs.

    Args:
      parameters  A dictionary containing the 'credentials' parameter.

    Returns:
      An instance of Boto EC2Connection
    """
    credentials = parameters[self.PARAM_CREDENTIALS]
    return boto.connect_ec2(str(credentials['EC2_ACCESS_KEY']),
      str(credentials['EC2_SECRET_KEY']))


  def validate_Credentials(self, credentials):
      try:
          conn = boto.connect_ec2(str(credentials['EC2_ACCESS_KEY']),
      str(credentials['EC2_SECRET_KEY']))
          conn.get_all_instances()
          return True
      except EC2ResponseError:
          return False

  def handle_failure(self, msg):
    """
    Log the specified error message and raise an AgentRuntimeException

    Args:
      msg An error message to be logged and included in the raised exception

    Raises:
      AgentRuntimeException Contains the input error message
    """
    utils.log(msg)
    raise AgentRuntimeException(msg)

