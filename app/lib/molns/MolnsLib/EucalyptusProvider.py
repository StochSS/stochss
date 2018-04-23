import boto
import boto.ec2
from boto.exception import EC2ResponseError
from boto.ec2.regioninfo import RegionInfo
import collections
import os
import time
import sys
import logging
from urlparse import urlparse
from collections import OrderedDict
import installSoftware
import ssh_deploy
from molns_provider import ProviderBase, ProviderException

#logging.getLogger('boto').setLevel(logging.ERROR)
logging.getLogger('boto').setLevel(logging.CRITICAL)


##########################################
class EucalyptusBase(ProviderBase):
    """ Abstract class for Eucalyptus. """
    
    SSH_KEY_EXTENSION = ".pem"
    PROVIDER_TYPE = 'Eucalyptus'

#def EucalyptusProvider_config_get_region():
#    if os.environ.get('AWS_DEFAULT_REGION') is None:
#        return 'us-east-1'
#    return os.environ.get('AWS_DEFAULT_REGION')

def EucalyptusProvider_config_get_ubuntu_images_by_region(conf=None):
    if conf is not None:
        access_key = conf['aws_access_key']
        secret_key = conf['aws_secret_key']
        ec2_url = conf['ec2_url']
    else:
        access_key = os.environ.get('EC2_ACCESS_KEY')
        secret_key = os.environ.get('EC2_SECRET_KEY')
        ec2_url = os.environ.get('EC2_URL')

    try:
        o = urlparse(ec2_url)
        ec2_host = o.hostname
        ec2_port = o.port
        ec2_path = o.path
        # Setup connection to Eucalyptus
        conn = boto.connect_ec2(aws_access_key_id=access_key,
                                aws_secret_access_key=secret_key,
                                is_secure=False,
                                region=RegionInfo(name="eucalyptus", endpoint=ec2_host),
                                port=ec2_port,
                                path=ec2_path)

        # Run commands
        images = conn.get_all_images()
        for i in images:
            if 'trusty' in i.name.lower():
                return i.id
    except Exception as e:
        logging.debug('EucalyptusProvider_config_get_ubuntu_images_by_region() caught exception {0}'.format(e))
    return None

def EucalyptusProvider_default_key_name():
    user = os.environ.get('USER') or 'USER'
    return "{0}_molns_sshkey_{1}".format(user, hex(int(time.time())).replace('0x',''))
##########################################
class EucalyptusProvider(EucalyptusBase):
    """ Provider handle for an Eucalyptus service. """

    OBJ_NAME = 'EucalyptusProvider'
    
    CONFIG_VARS = OrderedDict(
    [
    ('aws_access_key',
        {'q':'Eucalyptus access Key', 'default':os.environ.get('EC2_ACCESS_KEY'), 'ask':True, 'obfuscate':True}),
    ('aws_secret_key',
        {'q':'Eucalyptus secret key', 'default':os.environ.get('EC2_SECRET_KEY'), 'ask':True, 'obfuscate':True}),
    ('ec2_url',
        {'q':'URL of Eucalyptus service (EC2_URL)', 'default':os.environ.get('EC2_URL'), 'ask':True, 'obfuscate':False}),
    ('key_name',
        {'q':'Eucalyptus Key Pair name', 'default':EucalyptusProvider_default_key_name(), 'ask':True}),
    ('group_name',
        {'q':'Eucalyptus Security Group name', 'default':'molns', 'ask':True}),
    ('ubuntu_image_name',
        {'q':'ID of the base Ubuntu image to use', 'default':EucalyptusProvider_config_get_ubuntu_images_by_region, 'ask':True}),
    ('molns_image_name',
        {'q':'ID of the MOLNs image (leave empty for none)', 'default':None, 'ask':True}),
    ('default_instance_type',
        {'q':'Default Instance Type', 'default':'c3.large', 'ask':True}),
    ('login_username',
        {'default':'ubuntu', 'ask':False})
    ])

    def get_config_credentials(self):
        """ Return a dict with the credentials necessary for authentication. """
        return {
            'aws_access_key_id' : self.config['aws_access_key'],
            'aws_secret_access_key' : self.config['aws_secret_key']
            }
            

    def check_ssh_key(self):
        """ Check that the SSH key is found locally and remotely. 
        Returns:
            True if the key is valid, otherwise False.
        """
        ssh_key_dir = os.path.join(self.config_dir, self.name)
        logging.debug('ssh_key_dir={0}'.format(ssh_key_dir))
        if not os.path.isdir(ssh_key_dir):
            logging.debug('making ssh_key_dir={0}'.format(ssh_key_dir))
            os.makedirs(ssh_key_dir)
        ssh_key_file = os.path.join(ssh_key_dir,self.config['key_name']+self.SSH_KEY_EXTENSION)
        if not os.path.isfile(ssh_key_file):
            logging.debug("ssh_key_file '{0}' not found".format(ssh_key_file))
            return False
        self._connect()
        return self.eucalyptus.keypair_exists(self.config['key_name'])

    def create_ssh_key(self):
        """ Create the ssh key and write the file locally. """
        self._connect()
        ssh_key_dir = os.path.join(self.config_dir, self.name)
        logging.debug('creating ssh key {0} in dir{1}'.format(self.config['key_name'], ssh_key_dir))
        self.eucalyptus.create_keypair(self.config['key_name'], ssh_key_dir)

    def check_security_group(self):
        """ Check if the security group is created. """
        self._connect()
        return self.eucalyptus.security_group_exists(self.config['group_name'])

    def create_seurity_group(self):
        """ Create the security group. """
        self._connect()
        return self.eucalyptus.create_security_group(self.config['group_name'])

    def check_molns_image(self):
        """ Check if the molns image is created. """
        if 'molns_image_name' in self.config and self.config['molns_image_name'] is not None and self.config['molns_image_name'] != '':
            self._connect()
            return self.eucalyptus.image_exists(self.config['molns_image_name'])
        return False

    def create_molns_image(self):
        """ Create the molns image is created. """
        self._connect()
        # clear the network-related persisent udev rules:
        #echo "" > /etc/udev/rules.d/70-persistent-net.rules 
        #echo "" > /lib/udev/rules.d/75-persistent-net-generator.rules
        #
        
        # start vm
        instances = self.eucalyptus.start_eucalyptus_instances(image_id=self.config["ubuntu_image_name"])
        instance = instances[0]
        # get login ip
        ip = instance.public_dns_name
        # install software
        try:
            logging.debug("installing software on server (ip={0})".format(ip))
            install_vm_instance = installSoftware.InstallSW(ip, config=self)
            #install_vm_instance.run_with_logging()
            # create image
            logging.debug("Shutting down instance")
            self.eucalyptus.stop_eucalyptus_instances([instance])
            logging.debug("Creating image")
            image_id = instance.create_image(name=self._get_image_name())
            #logging.debug("Finding volume of instance")
            #vol = None
            #for v in self.eucalyptus.conn.get_all_volumes():
            #    if v.attach_data is not None and v.attach_data.instance_id == instance.id:
            #        vol = v
            #        break
            #if vol is None:
            #    raise Exception("Can not find volume associated with instance.  Base image must be an EBS backed image.")
            #snap = vol.create_snapshot()
            #logging.debug('Snapshot {0} of volume {1}'.format(snap.id, vol.id))
            #image_id = self.eucalyptus.conn.register_image(name=self._get_image_name(), snapshot_id=snap.id, delete_root_volume_on_termination=True)
            ##deleteOnTermination
            #image_id = self.eucalyptus.conn.register_image(name=self._get_image_name(), snapshot_id=snap.id)
            logging.debug("Image created: {0}".format(image_id))
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to create molns image: {0}".format(e))
        finally:
            logging.debug("terminating {0}".format(instance))
            self.eucalyptus.terminate_eucalyptus_instances([instance])
        return image_id

    def _connect(self):
        if self.connected: return
        self.eucalyptus = CreateVM(config=self)
        self.connected = True

    def _get_image_name(self):
        return "MOLNS_{0}_{1}_{2}".format(self.PROVIDER_TYPE, self.name, int(time.time()))

##########################################
class EucalyptusController(EucalyptusBase):
    """ Provider handle for an open stack controller. """
    
    OBJ_NAME = 'EucalyptusController'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type', 'default':'c3.large', 'ask':True}),
    ])

    def _connect(self):
        if self.connected: return
        self.eucalyptus = CreateVM(config=self.provider)
        self.connected = True

    def start_instance(self, num=1):
        """ Start or resume the controller. """
        try:
            self._connect()
            instances = self.eucalyptus.start_eucalyptus_instances(image_id=self.provider.config["molns_image_name"], num=int(num), instance_type=self.config["instance_type"])
            ret = []
            for instance in instances:
                ip = instance.public_dns_name
                i  = self.datastore.get_instance(provider_instance_identifier=instance.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.id)
                ret.append(i)
            if num == 1:
                return ret[0]
            else:
                return ret
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to start molns instance: {0}".format(e))

    def resume_instance(self, instances):
        self._connect()
        if isinstance(instances, list):
            eucalyptus_instances = []
            for instance in instances:
                eucalyptus_instance = self.eucalyptus.get_instance(instance.provider_instance_identifier)
                eucalyptus_instances.append(eucalyptus_instance)
            new_eucalyptus_instances = self.eucalyptus.resume_eucalyptus_instances(eucalyptus_instances)
            instances_to_update = list(instances)
            while len(instances_to_update) > 0:
                instance = instances_to_update.pop()
                success=False
                for eucalyptus_inst in new_eucalyptus_instances:
                    if eucalyptus_inst.id == instance.provider_instance_identifier:
                        instance.ip_address = eucalyptus_inst.public_dns_name
                        logging.debug("instance.id={0} updated with ip={1}".format(instance.provider_instance_identifier, instance.ip_address))
                        success=True
                        break
                if not success:
                    raise ProviderException("Could not update the IP of id={0} after resume".format(instance.provider_instance_identifier))
        else:
            eucalyptus_instance = self.eucalyptus.get_instance(instances.provider_instance_identifier)
            new_instance = self.eucalyptus.resume_eucalyptus_instances([eucalyptus_instance])
            instances.ip_address = new_instance[0].public_dns_name
            logging.debug("instance.id={0} updated with ip={1}".format(instances.provider_instance_identifier, instances.ip_address))

    def stop_instance(self, instances):
        self._connect()
        if isinstance(instances, list):
            eucalyptus_instances = []
            for instance in instances:
                eucalyptus_instance = self.eucalyptus.get_instance(instance.provider_instance_identifier)
                eucalyptus_instances.append(eucalyptus_instance)
            self.eucalyptus.stop_eucalyptus_instances(eucalyptus_instances)
        else:
            eucalyptus_instance = self.eucalyptus.get_instance(instances.provider_instance_identifier)
            self.eucalyptus.stop_eucalyptus_instances([eucalyptus_instance])

    def terminate_instance(self, instances):
        self._connect()
        if isinstance(instances, list):
            eucalyptus_instances = []
            for instance in instances:
                eucalyptus_instance = self.eucalyptus.get_instance(instances.provider_instance_identifier)
                eucalyptus_instances.append(eucalyptus_instance)
                self.datastore.delete_instance(instance)
            self.eucalyptus.terminate_eucalyptus_instances(eucalyptus_instances)
        else:
            eucalyptus_instance = self.eucalyptus.get_instance(instances.provider_instance_identifier)
            self.eucalyptus.terminate_eucalyptus_instances([eucalyptus_instance])
            self.datastore.delete_instance(instances)
    
    def get_instance_status(self, instance):
        self._connect()
        try:
            status = self.eucalyptus.get_instance_status(instance.provider_instance_identifier)
        except Exception as e:
            #logging.exception(e)
            return self.STATUS_TERMINATED
        if status == 'running' or status == 'pending':
            return self.STATUS_RUNNING
        if status == 'stopped' or status == 'stopping':
            return self.STATUS_STOPPED
        if status == 'terminated' or status == 'shutting-down':
            return self.STATUS_TERMINATED
        raise ProviderException("EucalyptusController.get_instance_status() got unknown status '{0}'".format(status))


##########################################
class EucalyptusWorkerGroup(EucalyptusController):
    """ Provider handle for an open stack controller. """
    
    OBJ_NAME = 'EucalyptusWorkerGroup'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type', 'default':'c3.large', 'ask':True}),
    ('num_vms',
        {'q':'Number of virtual machines in group', 'default':'1', 'ask':True}),
    ])

    def start_instance(self, num=1):
        """ Start worker group vms. """
        try:
            self._connect()
            instances = self.eucalyptus.start_eucalyptus_instances(image_id=self.provider.config["molns_image_name"], num=int(num), instance_type=self.config["instance_type"])
            ret = []
            for instance in instances:
                ip = instance.public_dns_name
                i  = self.datastore.get_instance(provider_instance_identifier=instance.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.controller.id,  worker_group_id=self.id)
                ret.append(i)
            if num == 1:
                return ret[0]
            else:
                return ret
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to start molns instance: {0}".format(e))

    def terminate_instance(self, instances):
        self._connect()
        if isinstance(instances, list):
            eucalyptus_instances = []
            for instance in instances:
                eucalyptus_instance = self.eucalyptus.get_instance(instance.provider_instance_identifier)
                eucalyptus_instances.append(eucalyptus_instance)
                self.datastore.delete_instance(instance)
            self.eucalyptus.terminate_eucalyptus_instances(eucalyptus_instances)
        else:
            eucalyptus_instance = self.eucalyptus.get_instance(instances.provider_instance_identifier)
            self.eucalyptus.terminate_eucalyptus_instances([eucalyptus_instance])
            self.datastore.delete_instance(instances)


##########################################
class CreateVM:
    '''
    This class is used to create VMs for Eucalyptus
    '''
    PENDING_IMAGE_WAITTIME = 60

    def __init__(self, config=None, connect=True):
        if config is not None:
            self.config = config
        if self.config['aws_access_key'] is None or self.config['aws_secret_key'] is None:
            raise ProviderException("AWS_SECRET_KEY or AWS_ACCESS_KEY not set")
        if connect:
            self.connect()

    def connect(self):
        #self.conn = boto.ec2.connect_to_region(
        #    self.config['aws_region'],
        #    aws_access_key_id=self.config['aws_access_key'],
        #    aws_secret_access_key=self.config['aws_secret_key']
        #)
        access_key = self.config['aws_access_key']
        secret_key = self.config['aws_secret_key']
        ec2_url = self.config['ec2_url']
        o = urlparse(ec2_url)
        ec2_host = o.hostname
        ec2_port = o.port
        ec2_path = o.path
        # Setup connection to Eucalyptus
        self.conn = boto.connect_ec2(aws_access_key_id=access_key,
                                    aws_secret_access_key=secret_key,
                                    is_secure=False,
                                    region=RegionInfo(name="eucalyptus", endpoint=ec2_host),
                                    port=ec2_port,
                                    path=ec2_path)


    def get_instance(self, instance_id):
        #logging.debug("get_instance(instance_id={0})".format(instance_id))
        try:
            reservations = self.conn.get_all_reservations(instance_ids=[instance_id])
        except EC2ResponseError:
            raise ProviderException("instance not found {0}".format(instance_id))
        #logging.debug("get_instance()  reservations:{0}".format(reservations))
        for reservation in reservations:
            #logging.debug("get_instance()  reservation.instances:{0}".format(reservation.instances))
            for instance in reservation.instances:
                if instance.id == instance_id:
                    return instance
        raise ProviderException("instance not found {0}".format(instance_id))

    def get_instance_status(self, instance_id):
        return self.get_instance(instance_id).state

    
    def get_vm_status(self, key_name=None, verbose=False, show_all=False):
        if key_name is None:
            key_name = self.config['key_name']
        reservations = self.conn.get_all_reservations()
        stopped_vms = []
        running_vms = []
        for reservation in reservations:
            for instance in reservation.instances:
                if verbose and show_all:
                    print "{0}\t{1}\t{2}\t{3}".format(instance.id,instance.key_name,instance.state,instance.public_dns_name)
                if instance.key_name == key_name:
                    if verbose and not show_all:
                        print "{0}\t{1}\t{2}\t{3}".format(instance.id,instance.key_name,instance.state,instance.public_dns_name)
                    if instance.state == 'running':
                        running_vms.append(instance)
                    elif instance.state == 'stopped':
                        stopped_vms.append(instance)
        #return (stopped_vms, running_vms)
        return (stopped_vms, sorted(running_vms, key=lambda vm: vm.id))
        
    def image_exists(self, image_id):
        try:
            img = self.conn.get_all_images(image_ids=[image_id])[0]
            return True
        except IndexError:
            return False

    def start_vms(self, image_id=None, key_name=None, group_name=None, num=None, instance_type=None):
        if key_name is None:
            key_name = self.config['key_name']
        if group_name is None:
            group_name = self.config['group_name']
        if num is None:
            num = 1
        if instance_type is None:
            instance_type = self.config['default_instance_type']
        # Check the group
        self.create_security_group(group_name)

        #(stopped_vms, running_vms) = self.get_vm_status(key_name)
        #if len(running_vms) > 0:
        #    msg = "Error: {0} VMs are already running with key_name={1}".format(len(running_vms),
        #        key_name)
        #    print msg
        #    raise ProviderException(msg)

        if len(stopped_vms) > 0:
            return self.resume_eucalyptus_instances(stopped_vms)
            
        if image_id is None:
            raise ProviderException("Base Ubuntu image not specified.")
        else:
            self.image_id = image_id

        # Check image
        try:
            img = self.conn.get_all_images(image_ids=[self.image_id])[0]
        except IndexError:
            raise ProviderException("Could not find image_id={0}".format(self.image_id))

        if img.state != "available":
            if img.state != "pending":
                raise ProviderException("Image {0} is not available, it has state is {1}.".format(self.image_id, img.state))
            while img.state == "pending":
                print "Image {0} has state {1}, waiting {2} seconds for it to become available.".format(self.image_id, img.state, self.PENDING_IMAGE_WAITTIME)
                time.sleep(self.PENDING_IMAGE_WAITTIME)
                img.update()

        self.key_name = key_name
        self.group_name = group_name
        group_list = []
        for _ in range(num):
            group_list.append(group_name)
    
        print "Starting {0} Eucalyptus instance(s). This will take a minute...".format(num)
        reservation = self.conn.run_instances(self.image_id, min_count=num, max_count=num, key_name=key_name, security_groups=group_list, instance_type=instance_type)

        instances = reservation.instances
        num_instance = len(instances) 
        num_running = 0
        while num_running < num_instance:
            num_running = 0
            for instance in instances:
                instance.update()
                if instance.state == 'running':
                    num_running += 1
                if num_running < num_instance: 
                    time.sleep(5)
        print "Eucalyptus instances started."
        return sorted(instances, key=lambda vm: vm.id)

    def start_eucalyptus_instances(self, image_id=None, key_name=None, group_name=None, num=1, instance_type=None):
        if key_name is None:
            key_name = self.config['key_name']
        if group_name is None:
            group_name = self.config['group_name']
        if num is None:
            num = 1
        if instance_type is None:
            instance_type = self.config['default_instance_type']
        try:
            img = self.conn.get_all_images(image_ids=[image_id])[0]
        except IndexError:
            raise ProviderException("Could not find image_id={0}".format(image_id))
        if img.state != "available":
            if img.state != "pending":
                raise ProviderException("Image {0} is not available, it has state is {1}.".format(image_id, img.state))
            while img.state == "pending":
                print "Image {0} has state {1}, waiting {2} seconds for it to become available.".format(image_id, img.state, self.PENDING_IMAGE_WAITTIME)
                time.sleep(self.PENDING_IMAGE_WAITTIME)
                img.update()
        print "Starting {0} Eucalyptus instance(s). This will take a minute...".format(num)
        reservation = self.conn.run_instances(image_id, min_count=num, max_count=num, key_name=key_name, security_groups=[group_name], instance_type=instance_type)
        instances = reservation.instances
        num_instance = len(instances) 
        num_running = 0
        while num_running < num_instance:
            num_running = 0
            for instance in instances:
                instance.update()
                if instance.state == 'running':
                    num_running += 1
                if num_running < num_instance: 
                    time.sleep(5)
        print "Eucalyptus instances started."
        return sorted(instances, key=lambda vm: vm.id)

    def stop_vms(self, key_name=None):
        if key_name is None:
            key_name = self.config['key_name']
        (stopped_vms, running_vms) = self.get_vm_status(key_name)
        self.stop_eucalyptus_instances(running_vms)

    def terminate_vms(self, key_name=None):
        if key_name is None:
            key_name = self.config['key_name']
        (stopped_vms, running_vms) = self.get_vm_status(key_name)
        self.terminate_eucalyptus_instances(running_vms+stopped_vms)

    def resume_eucalyptus_instances(self, instances):
        num_instance = len(instances) 
        print "Resuming Eucalyptus instance(s). This will take a minute..."
        for instance in instances:
            print "\t{0}.".format(instance.id)
            instance.start()
        num_running = 0
        while num_running < num_instance:
            num_running = 0
            for instance in instances:
                instance.update()
                if instance.state == 'running':
                    num_running += 1
                if num_running < num_instance: 
                    time.sleep(5)
        print "Eucalyptus instances resumed."
        return instances

    def stop_eucalyptus_instances(self, instances):
        num_instance = len(instances) 
        print "Stopping Eucalyptus instance(s). This will take a minute..."
        for instance in instances:
            print "\t{0}.".format(instance.id)
            instance.stop()
        num_stopped = 0
        while num_stopped < num_instance:
            num_stopped = 0
            for instance in instances:
                instance.update()
                if instance.state == 'stopped':
                    num_stopped += 1
                if num_stopped < num_instance: 
                    time.sleep(5)
        print "Eucalyptus instances stopped."

    def terminate_eucalyptus_instances(self, instances):
        num_instance = len(instances) 
        print "Terminating Eucalyptus instance(s). This will take a minute..."
        for instance in instances:
            print "\t{0}.".format(instance.id)
            instance.terminate()
        num_terminated = 0
        while num_terminated < num_instance:
            num_terminated = 0
            for instance in instances:
                instance.update()
                if instance.state == 'terminated':
                    num_terminated += 1
                if num_terminated < num_instance: 
                    time.sleep(5)
        print "Eucalyptus instance terminated."

    def create_vm_image(self, image_name=None, key_name=None):
        if key_name is None:
            key_name = self.config['key_name']
        if image_name is None:
            image_name = "MOLNS_{0}_{1}".format(key_name,int(time.time()))
        (stopped_vms, running_vms) = self.get_vm_status(key_name)
        if len(running_vms) != 1:
            raise ProviderException("Expected only one running vm, {0} are running".format(len(running_vms)))
        self.stop_eucalyptus_instances(running_vms)
        instance = running_vms[0]
        image_ami = instance.create_image(image_name)
        print "Image created id={0} name={0}".format(image_ami, image_name)
        self.terminate_eucalyptus_instances(running_vms)
        return image_ami
        
        

    def keypair_exists(self, key_name):
        for sg in self.conn.get_all_key_pairs():
            if sg.name == key_name:
                return True
        return False

    def keypair_file_exists(cls, key_name, conf_dir):
        return os.path.exists(conf_dir + os.sep + key_name + ".pem")

    def create_keypair(self, key_name, conf_dir):
         key_pair = self.conn.create_key_pair(key_name)
         key_pair.save(conf_dir)

    def security_group_exists(self, group_name):
        for sg in self.conn.get_all_security_groups():
            if sg.name == group_name:
                return True
        return False
            
    def create_security_group(self, group_name):
        security_group = None
        for sg in self.conn.get_all_security_groups():
            if sg.name == group_name:
                security_group = sg
                break
        if security_group is None:
            print "Security group not found, creating one."
            security_group = self.conn.create_security_group(group_name, 'MOLNs Security Group')
            self.set_security_group_rules(security_group)
        elif not self.check_security_group_rules(security_group):
            raise ProviderException("Security group {0} exists, but has the wrong firewall rules. Please delete the group, or choose a different one.")
        return security_group

 
    def set_security_group_rules(self, group, expected_rules=ProviderBase.FIREWALL_RULES):
        for rule in expected_rules:
            if not group.authorize(ip_protocol=rule.ip_protocol,
                            from_port=rule.from_port,
                            to_port=rule.to_port,
                            cidr_ip=rule.cidr_ip):
                return False
        return True

    def check_security_group_rules(self, group, expected_rules=ProviderBase.FIREWALL_RULES):
        """ Check to be sure the expected_rules are set for this group.  """
        ret = True
     
        current_rules = []
        for rule in group.rules:
            if not rule.grants[0].cidr_ip:
                current_rule = self.SecurityGroupRule(rule.ip_protocol,
                                  rule.from_port,
                                  rule.to_port,
                                  "0.0.0.0/0",
                                  rule.grants[0].name)
            else:
                current_rule = self.SecurityGroupRule(rule.ip_protocol,
                                  rule.from_port,
                                  rule.to_port,
                                  rule.grants[0].cidr_ip,
                                  None)
     
            if current_rule not in expected_rules:
                print "Unexpected Rule: {0}".format(current_rule)
                ret = False
            else:
                #print "Current Rule: {0}".format(current_rule)
                current_rules.append(current_rule)
     
        for rule in expected_rules:
            if rule not in current_rules:
                print "Rule not found: {0}".format(rule)
                ret = False

        return ret
     
