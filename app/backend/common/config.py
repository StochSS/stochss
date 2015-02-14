import os

class AgentTypes(object):
    EC2 = 'ec2'
    FLEX = 'flex'
    FLEX_CLI = 'flex_cli'

class AWSConfig(object):
    EC2_SETTINGS_FILENAME = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                         '..', '..', '..', 'conf', 'ec2_config.json'))

class FlexConfig(object):
    INSTANCE_TYPE = 'flexvm'

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
        else:
            return CeleryConfig.CONFIG_FILENAME

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