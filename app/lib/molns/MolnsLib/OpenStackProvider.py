import os
import sys
import time
import logging
from novaclient import client as novaclient
from collections import OrderedDict
import collections
import installSoftware
from molns_provider import ProviderBase, ProviderException

# quite the logging of 'requests.packages.urllib3.connectionpool'
logging.getLogger('requests.packages.urllib3.connectionpool').setLevel(logging.ERROR)
logging.getLogger('novaclient.client').setLevel(logging.ERROR)


##########################################
class OpenStackBase(ProviderBase):
    """ Abstract class for OpenStack. """
    
    SSH_KEY_EXTENSION = ".pem"
    PROVIDER_TYPE = 'OpenStack'

def OpenStackProvider_default_key_name():
    user = os.environ.get('USER') or 'USER'
    return "{0}_molns_sshkey_{1}".format(user, hex(int(time.time())).replace('0x',''))
##########################################
class OpenStackProvider(OpenStackBase):
    """ Provider handle for an open stack service. """

    OBJ_NAME = 'OpenStackProvider'
    
    MAX_IMAGE_CREATION_WAITTIME = 1800
    
    CONFIG_VARS = OrderedDict(
    [
    ('nova_username',
        {'q':'OpenStack username', 'default':os.environ.get('OS_USERNAME'), 'ask':True}),
    ('nova_password',
        {'q':'OpenStack password', 'default':os.environ.get('OS_PASSWORD'), 'ask':True, 'obfuscate':True}),
    ('nova_auth_url',
        {'q':'OpenStack auth_url', 'default':os.environ.get('OS_AUTH_URL'), 'ask':True}),
    ('nova_project_id',
        {'q':'OpenStack project_name', 'default':os.environ.get('OS_TENANT_NAME'), 'ask':True}),
    ('neutron_nic',
        {'q':'Network ID (leave empty if only one possible network)', 'default':None, 'ask':True}),    
    ('region_name',
        {'q':'Specify the region (leave empty if only one region)', 'default':os.environ.get('OS_REGION_NAME'), 'ask':True}),    
    ('floating_ip_pool',
        {'q':'Name of Floating IP Pool (leave empty if only one possible pool)', 'default':None, 'ask':True}),
    ('nova_version',
        {'q':'Enter the version of the OpenStack NOVA API', 'default':"2", 'ask':True}),
    ('key_name',
        {'q':'OpenStack Key Pair name', 'default':OpenStackProvider_default_key_name(), 'ask':True}),
    ('group_name',
        {'q':'OpenStack Security Group name', 'default':'molns', 'ask':True}),
    ('ubuntu_image_name',
        {'q':'ID of the base Ubuntu image to use', 'default':None, 'ask':True}),
    ('molns_image_name',
        {'q':'ID of the MOLNs image (leave empty for none)', 'default':None, 'ask':True}),
    ('default_instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ('login_username',
        {'default':'ubuntu', 'ask':False})
    ])

    def get_config_credentials(self):
        """ Return a dict with the credentials necessary for authentication. """
        return {
            'user' : self.config['nova_username'],
            'key' : self.config['nova_password'],
            'tenant_name' : self.config['nova_project_id'],
            'authurl' : self.config['nova_auth_url']
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
        remote_keys = self.nova.keypairs.list()
        for k in remote_keys:
            if k.name == self.config['key_name']:
                return True
        return False

    def create_ssh_key(self):
        """ Create the ssh key and write the file locally. """
        ssh_key_dir = os.path.join(self.config_dir, self.name)
        logging.debug('ssh_key_dir={0}'.format(ssh_key_dir))
        if not os.path.isdir(ssh_key_dir):
            logging.debug('making ssh_key_dir={0}'.format(ssh_key_dir))
            os.makedirs(ssh_key_dir)
        ssh_key_file = os.path.join(ssh_key_dir,self.config['key_name']+self.SSH_KEY_EXTENSION)
        if os.path.isfile(ssh_key_file):
            raise ProviderException("ssh_key_file '{0}' already exists".format(self.config['key_name']))

        self._connect()
        new_key = self.nova.keypairs.create(name=self.config['key_name'])
        #with open(ssh_key_file, 'w') as fd:
        with os.fdopen(os.open(ssh_key_file, os.O_WRONLY | os.O_CREAT, 0600), 'w') as fd:
            fd.write(new_key.private_key)
        logging.debug("ssh key '{0}' created and written to file '{1}'".format(self.config['key_name'],ssh_key_file))

    def check_security_group(self):
        """ Check if the security group is created. """
        self._connect()
        groups = self.nova.security_groups.list()
        for g in groups:
            if g.name == self.config['group_name']:
                return True
        return False
    
    def create_seurity_group(self):
        """ Create the security group. """
        self._connect()
        g = self.nova.security_groups.create(name=self.config['group_name'], description="MOLNs security group")
        rules = [dict(fr._asdict()) for fr in self.FIREWALL_RULES]
        for r in rules: # ughly hack to fix naming problem  
	    # The keyword argument names are differnt in boto and novaclient...
            r.pop("src_group_name")
            r["cidr"]=r.pop("cidr_ip")
            self.nova.security_group_rules.create(parent_group_id=g.id, **r)

    def check_molns_image(self):
        """ Check if the molns image is created. """
        if 'molns_image_name' not in self.config or self.config['molns_image_name'] is None or self.config['molns_image_name'] == '':
            logging.debug("molns_image_name is not set")
            return False
        try:
            image = self.nova.images.get(self.config['molns_image_name'])
            logging.debug("image found, status={0}".format(image.status))
            if image.status == 'ACTIVE':
                return True
            return False
        except novaclient.exceptions.NotFound as e:
            logging.debug("got novaclient.exceptions.NotFound: {0}".format(e))
            return False

    def create_molns_image(self):
        """ Create the molns image is created. """
        # start vm
        instance = self._boot_ubuntu_vm()
        # get login ip
        ip = self._attach_floating_ip(instance)
        # install software
        try:
            logging.debug("installing software on server (ip={0})".format(ip))
            install_vm_instance = installSoftware.InstallSW(ip, config=self)
            install_vm_instance.run_with_logging()
            # create image
            logging.debug("shutting down instance")
            self._stop_vm(instance)
            logging.debug("creating image")
            image_id = instance.create_image(image_name=self._get_image_name())
            logging.debug("image creation started image_id={0}".format(image_id))
            time.sleep(10)
            t1 = time.time()
            while time.time() < t1+self.MAX_IMAGE_CREATION_WAITTIME:
                logging.debug("waiting for image creation to complete")
                time.sleep(30)
                img_status = self._get_image_status(image_id)
                logging.debug("image status is {0}".format(img_status))
                if img_status != 'SAVING':
                    break
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to create molns image: {0}".format(e))
        finally:
            logging.debug("terminating {0}".format(instance))
            instance.delete()
            try:
                logging.debug("deleteing floating ip {0}".format(ip))
                self._delete_floating_ip(ip)
            except ProviderException as e:
                logging.error("Error deleteing floating IP: {0}".format(e))
        return image_id

    def _connect(self):
        if self.connected: return
        creds = {}
        creds['username'] = self.config['nova_username']
        creds['api_key'] = self.config['nova_password']
        creds['auth_url'] = self.config['nova_auth_url']
        creds['project_id'] = self.config['nova_project_id']
        if 'region_name' in self.config and self.config['region_name'] is not None:
            creds['region_name'] = self.config['region_name']
        self.nova = novaclient.Client(self.config['nova_version'], **creds)
        self.connected = True

    def _get_image_name(self):
        return "MOLNS_{0}_{1}_{2}".format(self.PROVIDER_TYPE, self.name, int(time.time()))

    def _get_image_status(self, image_id):
        self._connect()
        img = self.nova.images.get(image_id)
        return img.status

    def _get_instance_status(self, instance_id):
        self._connect()
        instances = []
        instance = self.nova.servers.get(instance_id)
        return instance.status

    def _stop_instances(self, instance_ids):
        self._connect()
        instances = []
        for instance_id in instance_ids:
            instances.append(self.nova.servers.get(instance_id))
        self._stop_vm(instances)

    def _resume_instances(self, instance_ids):
        self._connect()
        for instance_id in instance_ids:
            try:
                instance = self.nova.servers.get(instance_id)
                instance.start()
                logging.debug("instance={0}".format(instance))
                # wait for boot to complete
                while instance.status == 'BUILD':
                    logging.debug("Launching node, status '{0}'".format(instance.status))
                    time.sleep(5)
                    # Retrieve the instance again so the status field updates
                    instance = self.nova.servers.get(instance.id)
                    #instance.update()
                logging.debug("status: {0}".format(instance.status))
                return instance
            except Exception as e:
                logging.exception(e)
                logging.debug("terminating instance {0}".format(instance))
                instance.delete()
                raise ProviderException("Failed to boot vm\n{0}".format(e))

    def _terminate_instances(self, instance_ids):
        self._connect()
        if not isinstance(instance_ids, list):
            instance_ids = [instance_ids]
        try:
            instances = []
            for instance_id in instance_ids:
                instance = self.nova.servers.get(instance_id)
                instances.append(instance)
                instance.delete()
            inst_to_check = instances
            while len(inst_to_check) > 0:
                time.sleep(5)
                inst_still_stopping = []
                for instance in inst_to_check:
                    # Retrieve the instance again so the status field updates
                    try:
                        instance = self.nova.servers.get(instance.id)
                        logging.debug("Terminating node, status '{0}'  [{1}]".format(instance.status, instance.id))
                        if instance.status != 'SHUTOFF':
                            inst_still_stopping.append(instance)
                    except novaclient.exceptions.NotFound as e:
                        pass
                inst_to_check = inst_still_stopping
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to terminate vm(s)\n{0}".format(e))
    

    def _stop_vm(self, instances):
        self._connect()
        if not isinstance(instances, list):
            instances = [instances]
        try:
            for instance in instances:
                instance.stop()
            inst_to_check = instances
            while len(inst_to_check) > 0:
                time.sleep(5)
                inst_still_stopping = []
                for instance in inst_to_check:
                    # Retrieve the instance again so the status field updates
                    try:
                        instance = self.nova.servers.get(instance.id)
                        logging.debug("Stopping node, status '{0}'  [{1}]".format(instance.status, instance.id))
                        if instance.status != 'SHUTOFF':
                            inst_still_stopping.append(instance)
                    except novaclient.exceptions.NotFound as e:
                        pass
                inst_to_check = inst_still_stopping
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to stop vm(s)\n{0}".format(e))

    def _boot_ubuntu_vm(self):
        instance_type = self.config["default_instance_type"]
        return self.__boot_vm(self.config["ubuntu_image_name"], instance_type=instance_type)

    def _boot_molns_vm(self, instance_type=None, num=1):
        if instance_type is None:
            instance_type = self.config["default_instance_type"]
        return self.__boot_vm(self.config["molns_image_name"], instance_type=instance_type, num=num)

    def __boot_vm(self, image_name, instance_type, num=1):
        self._connect()
        instances = []
        try:
            image = self.nova.images.get(image_name)
            #logging.debug("image={0}".format(image))
            flavor = self.nova.flavors.find(name=instance_type)
            #logging.debug("flavor={0}".format(flavor))
            for n in range(int(num)):
                if 'neutron_nic' in self.config and self.config['neutron_nic'] != '':
                    inst = self.nova.servers.create(name="molns_vm_"+self.name, image=image, flavor=flavor, key_name=self.config["key_name"], security_groups=[self.config["group_name"]],nics=[{'net-id':self.config['neutron_nic']}])
                else:
                    inst = self.nova.servers.create(name="molns_vm_"+self.name, image=image, flavor=flavor, key_name=self.config["key_name"], security_groups=[self.config["group_name"]])
                instances.append(inst)
                #logging.debug("instance={0}".format(inst))
            # wait for boot to complete
            inst_to_check = instances
            while len(inst_to_check) > 0:
                time.sleep(5)
                inst_still_building = []
                for instance in inst_to_check:
                    # Retrieve the instance again so the status field updates
                    instance = self.nova.servers.get(instance.id)
                    logging.debug("Launching node, status '{0}'  [{1}]".format(instance.status, instance.id))
                    if instance.status == 'BUILD':
                        inst_still_building.append(instance)
                inst_to_check = inst_still_building
            if num == 1:
                return instances[0]
            else:
                return instances
        except Exception as e:
            logging.exception(e)
            for instance in instances:
                logging.debug("terminating instance {0}".format(instance))
                instance.delete()
            raise ProviderException("Failed to boot vm\n{0}".format(e))

    def _delete_floating_ip(self, ip):
        try:
            floating_ips = self.nova.floating_ips.list()
            for fip in floating_ips:
                if fip.ip == ip:
                    fip.delete()
                    return
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Could not delete floating ip '{0}'".format(ip))

    def _attach_floating_ip(self, instance):
       # Try to attach a floating IP to the controller
        logging.info("Attaching floating ip to the server...")
        try:
            floating_ip = self.nova.floating_ips.create(self.config['floating_ip_pool'])
            instance.add_floating_ip(floating_ip)
            logging.debug("ip={0}".format(floating_ip.ip))
            return floating_ip.ip
        except Exception as e:
            raise ProviderException("Failed to attach a floating IP to the controller.\n{0}".format(e))

##########################################
class OpenStackController(OpenStackBase):
    """ Provider handle for an open stack controller. """
    
    OBJ_NAME = 'OpenStackController'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ])

    def start_instance(self, num=1):
        """ Start or resume the controller. """
        #print "nova_instance = self.provider._boot_molns_vm(self, instance_type={0})".format(self.config['instance_type'])
        nova_instance = self.provider._boot_molns_vm(instance_type=self.config['instance_type'], num=num)
        if isinstance(nova_instance, list):
            ret = []
            for i in nova_instance:
                ip = self.provider._attach_floating_ip(i)
                i  = self.datastore.get_instance(provider_instance_identifier=i.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.id)
                ret.append(i)
            return ret
        else:
            ip = self.provider._attach_floating_ip(nova_instance)
            i  = self.datastore.get_instance(provider_instance_identifier=nova_instance.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.id)
            return i

    def resume_instance(self, instances):
        if isinstance(instances, list):
            pids = [x.provider_instance_identifier for x in instances]
            self.provider._resume_instances(pids)
        else:
            self.provider._resume_instances([instances.provider_instance_identifier])

    def stop_instance(self, instances):
        if isinstance(instances, list):
            pids = [x.provider_instance_identifier for x in instances]
            self.provider._stop_instances(pids)
        else:
            self.provider._stop_instances([instances.provider_instance_identifier])

    def terminate_instance(self, instances):
        if isinstance(instances, list):
            pids = []
            for instance in instances:
                self.provider._delete_floating_ip(instances.ip_address)
                self.datastore.delete_instance(instances)
                pids.append(instance.provider_instance_identifier)
            self.provider._terminate_instances(pids)
        else:
            self.provider._terminate_instances([instances.provider_instance_identifier])
            self.provider._delete_floating_ip(instances.ip_address)
            self.datastore.delete_instance(instances)
    
    def get_instance_status(self, instance):
        try:
            status = self.provider._get_instance_status(instance.provider_instance_identifier)
        except novaclient.exceptions.NotFound as e:
            return self.STATUS_TERMINATED
        if status == 'ACTIVE' or status == 'BUILD':
            return self.STATUS_RUNNING
        if status == 'SHUTOFF':
            return self.STATUS_STOPPED
        if status == 'DELETED':
            return self.STATUS_TERMINATED
        raise ProviderException("OpenStackController.get_instance_status() got unknown status '{0}'".format(status))


##########################################
class OpenStackWorkerGroup(OpenStackController):
    """ Provider handle for an open stack controller. """
    
    OBJ_NAME = 'OpenStackWorkerGroup'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ('num_vms',
        {'q':'Number of virtual machines in group', 'default':'1', 'ask':True}),
    ])

    def start_instance(self, num=1):
        """ Start or resume the controller. """
        #print "nova_instance = self.provider._boot_molns_vm(self, instance_type={0})".format(self.config['instance_type'])
        nova_instance = self.provider._boot_molns_vm(instance_type=self.config['instance_type'], num=num)
        if isinstance(nova_instance, list):
            ret = []
            for i in nova_instance:
                try:
                    ip = self.provider._attach_floating_ip(i)
                except Exception as e:
                    logging.exception(e)
                    logging.debug("Terminating instance {0}".format(i.id))
                    i.delete()
                inst  = self.datastore.get_instance(provider_instance_identifier=i.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.controller.id, worker_group_id=self.id)
                ret.append(inst)
            return ret
        else:
            try:
                ip = self.provider._attach_floating_ip(nova_instance)
            except Exception as e:
                logging.exception(e)
                logging.debug("Terminating instance {0}".format(nova_instance.id))
                nova_instance.delete()
                raise e

            i  = self.datastore.get_instance(provider_instance_identifier=nova_instance.id, ip_address=ip, provider_id=self.provider.id, controller_id=self.controller.id, worker_group_id=self.id)
            return i

    def terminate_instance(self, instances):
        if isinstance(instances, list):
            pids = []
            for instance in instances:
                self.provider._delete_floating_ip(instance.ip_address)
                pids.append(instance.provider_instance_identifier)
                self.datastore.delete_instance(instance)
            self.provider._terminate_instances(pids)
        else:
            self.provider._terminate_instances([instances.provider_instance_identifier])
            self.provider._delete_floating_ip(instances.ip_address)
            self.datastore.delete_instance(instances)
