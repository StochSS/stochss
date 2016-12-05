import os
import collections
from ssh import SSH


class ProviderException(Exception):
    pass


class ProviderBase:
    """ Abstract class. """
    
    STATUS_RUNNING = 'running'
    STATUS_STOPPED = 'stopped'
    STATUS_TERMINATED = 'terminated'

    SecurityGroupRule = collections.namedtuple("SecurityGroupRule", ["ip_protocol", "from_port", "to_port", "cidr_ip",
                                                                     "src_group_name"])

    FIREWALL_RULES = [
        SecurityGroupRule("tcp", "22", "22", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "80", "80", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "443", "443", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "1443", "1443", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "8080", "8080", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "8081", "8081", "0.0.0.0/0", None),
        SecurityGroupRule("tcp", "9000", "65535", "0.0.0.0/0", None),
    ]
    
    def __init__(self, name, config=None, config_dir=None, **kwargs):
        self.config = {}
        self.name = name
        self.type = self.PROVIDER_TYPE
        self.connected = False
        if config_dir is None:
            raise Exception("config_dir is a required arg")
        self.config_dir = config_dir
        if config is not None:
            for k, v in config.iteritems():
                self.config[k] = v
        for k,v in kwargs.iteritems():
            self.__dict__[k] = v
        self.ssh = SSH()

    def __getitem__(self, key):
        if key not in self.CONFIG_VARS.keys():
            raise KeyError("{0}: key {1} not found".format(self.OBJ_NAME, key))
        return self.config[key]

    def __setitem__(self, key, value):
        if key not in self.CONFIG_VARS.keys():
            raise KeyError("{0}: key {1} not found".format(self.OBJ_NAME, key))
        self.config[key] = value

    def __str__(self):
        ret = "{0}: ".format(self.OBJ_NAME)
        for k,v in self.config.iteritems():
            if 'obfuscate' in self.CONFIG_VARS[k] and self.CONFIG_VARS[k]['obfuscate']:
                ret += '\n\t{0} = ****************'.format(k)
            else:
                ret += '\n\t{0} = {1}'.format(k,v)
        return ret

    def get_config_vars(self):
        for key, conf in self.CONFIG_VARS.iteritems():
            if key in self.config and self.config[key] is not None and self.config[key] != '':
                yield (key, conf, self.config[key])
            else:
                yield (key, conf, None)

    def sshkeyfilename(self):
        ssh_key_dir = os.path.join(self.config_dir, self.name)
        ssh_key_file = os.path.join(ssh_key_dir,self.config['key_name']+self.SSH_KEY_EXTENSION)
        return ssh_key_file
