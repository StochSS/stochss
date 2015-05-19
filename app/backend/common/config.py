import os
import string
import random
import logging

class InvalidAgentType(Exception):
    pass

class AgentTypes(object):
    EC2 = 'ec2'
    FLEX = 'flex'
    FLEX_CLI = 'flex_cli'

class AWSConfig(object):
    EC2_SETTINGS_FILENAME = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                         '..', '..', '..', 'conf', 'ec2_config.json'))
    EC2_KEY_PREFIX = 'stochss-'
    EC2_QUEUE_HEAD_KEY_TAG = '-queuehead'


class FlexConfig(object):
    INSTANCE_TYPE = 'flexvm'
    KEYFILE_DIRNAME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tmp', 'keyfiles'))

    @staticmethod
    def get_keyfile_dirname(user_id):
        return os.path.join(FlexConfig.KEYFILE_DIRNAME, user_id)

    @staticmethod
    def get_keyfile(keyname, user_id):
        return os.path.join(FlexConfig.get_keyfile_dirname(user_id), keyname)


class AgentConfig(object):
    @staticmethod
    def get_agent_key_prefix(agent_type, key_prefix=''):
        if agent_type == AgentTypes.EC2:
            if key_prefix == '':
                return AWSConfig.EC2_KEY_PREFIX
            if not key_prefix.startswith(AWSConfig.EC2_KEY_PREFIX):
                return '{0}{1}'.format(AWSConfig.EC2_KEY_PREFIX, key_prefix)
        return key_prefix

    @staticmethod
    def get_queue_head_key_tag(agent_type, queue_head_key_tag=''):
        if agent_type == AgentTypes.EC2:
            if queue_head_key_tag == '':
                return AWSConfig.EC2_QUEUE_HEAD_KEY_TAG
            if not queue_head_key_tag.endswith(AWSConfig.EC2_QUEUE_HEAD_KEY_TAG):
                return '{0}{1}'.format(queue_head_key_tag, AWSConfig.EC2_QUEUE_HEAD_KEY_TAG)
        return queue_head_key_tag

    @staticmethod
    def get_queue_head_keyname(agent_type, keyname):
        tag = AgentConfig.get_queue_head_key_tag(agent_type=agent_type)
        if not keyname.endswith(tag) and tag != '':
            return '{0}{1}'.format(keyname, tag)
        return keyname

    @staticmethod
    def get_random_group_name(prefix):
        random_string = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(6))
        return '{0}-{1}'.format(prefix, random_string)


class CeleryConfig(object):
    EXCHANGE_PREFIX = "exchange_stochss"
    QUEUE_PREFIX = "queue_stochss"
    ROUTING_KEY_PREFIX = "routing_key_stochss"

    CONFIG_FILENAME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'celeryconfig.py'))
    CONFIG_TEMPLATE_FILENAME = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                            '..', 'celeryconfig.py.template'))
    @staticmethod
    def get_config_filename(agent_type):
        if agent_type == AgentTypes.FLEX_CLI:
            return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bin', 'celeryconfig.py'))
        if agent_type in [AgentTypes.FLEX, AgentTypes.EC2]:
            return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'celeryconfig.py'))
        else:
            raise InvalidAgentType('{0} is not a valid supported agent!'.format(agent_type))

    @staticmethod
    def get_exchange_name(agent_type, instance_type=None):
        if instance_type != None:
            return "{0}_{1}_{2}".format(CeleryConfig.EXCHANGE_PREFIX, agent_type, instance_type.replace(".", ""))
        else:
            return "{0}_{1}".format(CeleryConfig.EXCHANGE_PREFIX, agent_type)

    @staticmethod
    def get_queue_name(agent_type, instance_type=None):
        if instance_type != None:
            return "{0}_{1}_{2}".format(CeleryConfig.QUEUE_PREFIX, agent_type, instance_type.replace(".", ""))
        else:
            return "{0}_{1}".format(CeleryConfig.QUEUE_PREFIX, agent_type)

    @staticmethod
    def get_routing_key_name(agent_type, instance_type=None):
        if instance_type != None:
            return "{0}_{1}_{2}".format(CeleryConfig.ROUTING_KEY_PREFIX, agent_type, instance_type.replace(".", ""))
        else:
            return "{0}_{1}".format(CeleryConfig.ROUTING_KEY_PREFIX, agent_type)

class JobDatabaseConfig(object):
    TABLE_NAME = 'stochss'
    COST_ANALYSIS_TABLE_NAME = 'stochss_cost_analysis'

class JobTypes(object):
    STOCHOPTIM = 'mcem2'

class JobConfig:
    SUPPORTED_AGENT_TYPES_FOR_COST_ANALYSIS = [AgentTypes.EC2]