import logging
import urllib2
import os
import sys
import stat
import json


DEREGISTER_FLEX_VM_SCRIPT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..',
                                                '..', '..', 'release-tools', 'flex-cloud', 'deregister_flex_vm.sh'))

def get_public_ip():
    return urllib2.urlopen('http://ip.42.pl/raw').read()

class FlexJobState(object):
    IDLE = 'idle'
    RUNNING = 'running'
    UNKNOWN = 'unknown'

class FlexVMState(object):
    UNPREPARED = 'unprepared'
    UNKNOWN = 'unknown'
    RUNNING = 'running'

    VALID_STATES = [UNPREPARED, RUNNING]

    @staticmethod
    def get_state_info():
        public_ip = get_public_ip()
        logging.info('self public_ip = {}'.format(public_ip))
        celery_hostname = public_ip.replace('.', '_')

        try:
            commands = [
                'rm -f /tmp/celery_report',
                'celery inspect stats -d {celery_hostname} > /tmp/celery_report'.format(celery_hostname=celery_hostname)
            ]
            command = ';'.join(commands)
            os.system(command)

            with open('/tmp/celery_report') as fin:
                lines = fin.readlines()

            if len(lines) < 2:
                info = {'state': FlexVMState.UNPREPARED}
            else:
                celery_report_dict = eval('\n'.join(lines[1:]))
                if 'consumer' in celery_report_dict and 'broker' in celery_report_dict['consumer']:
                    broker = celery_report_dict['consumer']['broker']
                    info = {
                        'state': FlexVMState.RUNNING,
                        'queue_head_ip': broker['hostname']
                    }

                    if broker['hostname'] == public_ip:
                        info['is_queue_head'] = True
                    else:
                        info['is_queue_head'] = False

                else:
                    info = {'state': FlexVMState.UNPREPARED}

        except Exception, e:
            logging.error('Error in fetching broker url: {0}'.format(str(e)))
            info = {'state': FlexVMState.UNKNOWN}

        logging.info('info = {}'.format(info))
        return info

    @staticmethod
    def prepare(request_info):
        state_info = FlexVMState.get_state_info()
        if state_info['state'] == FlexVMState.UNPREPARED:
            celery_worker_name = request_info['worker_name']
            instance_type = request_info['instance_type']
            # flex_db_password = request_info['flex_db_password']
            queue_head_ip = request_info['queue_head_ip']
            stochss_parent_dir = request_info['stochss_parent_dir']
            celery_log_level = request_info['celery_log_level']

            stochss_dir = os.path.join(stochss_parent_dir, 'stochss')
            if os.path.exists(stochss_dir):
                celery_config_filename = os.path.join(stochss_parent_dir, 'celeryconfig.py')
                FlexVMState.__create_celery_config(celery_config_filename=celery_config_filename,
                                                   queue_head_ip=queue_head_ip,
                                                   instance_type=instance_type)
                FlexVMState.__start_celery(stochss_parent_dir=stochss_parent_dir,
                                           celery_log_level=celery_log_level,
                                           celery_worker_name=celery_worker_name,
                                           instance_type=instance_type)

                state_info = FlexVMState.get_state_info()
                if state_info['state'] == 'running' and state_info['queue_head_ip'] == queue_head_ip:
                    info = {
                        'status': 'success',
                        'message': 'Flex VM in running state',
                        'state_info': state_info
                    }

                else:
                    info = {
                        'status': 'failure',
                        'message': 'Flex VM was not prepared successfully!',
                        'state': state_info['state']
                    }

            else:
                info = {
                    'status': 'failure',
                    'message': 'Flex VM does not have stochss installed at {}!'.format(stochss_dir),
                    'state': state_info['state']
                }
        else:
            info = {
                'status': 'failure',
                'message': 'Flex VM not in unprepared state!',
                'state': state_info['state']
            }
        return info


    @staticmethod
    def deregister(request_info):
        state_info = FlexVMState.get_state_info()
        if state_info['state'] == FlexVMState.UNPREPARED:
            info = {
                'status': 'success',
                'message': 'Already in unprepared state.',
                'state': state_info['state']
            }
        elif state_info['state'] == FlexVMState.RUNNING:
            queue_head_ip = request_info['queue_head_ip']
            if queue_head_ip == state_info['queue_head_ip']:
                # Kill celery and restart rabbitmq
                os.system("sudo {script}".format(script=DEREGISTER_FLEX_VM_SCRIPT))
                info = {
                    'status': 'success',
                    'message': 'Flex VM Deregistered.',
                    'old_state': state_info['state']
                }
            else:
                info = {
                    'status': 'failure',
                    'message': 'Flex VM failed to be deregistered as it is associated with different queue head.',
                    'state': state_info['state'],
                    'queue_head_ip': state_info['queue_head_ip']
                }
        else:
            info = {
                'status': 'failure',
                'message': 'Failed to get current Flex VM State..',
                'state': FlexVMState.UNKNOWN
            }

        return info

    @staticmethod
    def __create_celery_config(celery_config_filename, queue_head_ip, instance_type):
        celery_config_template = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                              '..', '..', 'backend', 'celeryconfig.py.template'))

        with open(celery_config_template) as fin:
            celery_config_lines = fin.readlines()

        for line in celery_config_lines:
            if line.strip().startswith('BROKER_URL'):
                line = 'BROKER_URL = "amqp://stochss:ucsb@{0}:5672/"\n'.format(queue_head_ip)


        exchange = "exchange = Exchange('{0}', type='direct')".format(
                                                CeleryConfig.get_exchange_name(agent_type=AgentTypes.FLEX))
        logging.debug(exchange)

        queue_list = map(lambda instance_type: "Queue('{0}', exchange, routing_key='{1}')".format(
            CeleryConfig.get_queue_name(agent_type=AgentTypes.FLEX, instance_type=instance_type),
            CeleryConfig.get_routing_key_name(agent_type=AgentTypes.FLEX, instance_type=instance_type)),
                         [instance_type])

        agent_queue_name = CeleryConfig.get_queue_name(agent_type=AgentTypes.FLEX)
        agent_routing_key = CeleryConfig.get_routing_key_name(agent_type=AgentTypes.FLEX)
        queue_list.insert(0, "Queue('{0}', exchange, routing_key='{1}')".format(agent_queue_name, agent_routing_key))
        logging.debug(queue_list)

        queues_string = 'CELERY_QUEUES = ({0})'.format(', '.join(queue_list))
        logging.debug(queues_string)

        fout = open(celery_config_filename, 'w')
        clear_following = False
        for line in celery_config_lines:
            if clear_following:
                fout.write("")
            elif line.strip().startswith('exchange'):
                fout.write(exchange + "\n")
            elif line.strip().startswith('CELERY_QUEUES'):
                fout.write(queues_string + "\n")
                clear_following = True
            else:
                fout.write(line)
        fout.close()


    @staticmethod
    def __start_celery(stochss_parent_dir, celery_log_level, celery_worker_name, instance_type):
        stochss_dir = os.path.join(stochss_parent_dir, 'stochss')
        commands = []
        commands.append('export STOCHKIT_HOME={}'.format(os.path.join(stochss_dir, 'StochKit')))
        commands.append('export STOCHKIT_ODE={}'.format(os.path.join(stochss_dir, 'ode')))
        commands.append('export R_LIBS={}'.format(os.path.join(stochss_dir, 'stochoptim', 'library')))
        commands.append('export C_FORCE_ROOT=1')

        python_path_list = [stochss_dir,
                            os.path.join(stochss_dir, 'pyurdme'),
                            os.path.join(stochss_dir, 'app'),
                            os.path.join(stochss_dir, 'app', 'backend'),
                            os.path.join(stochss_dir, 'app', 'lib', 'cloudtracker')]
        python_path = 'export PYTHONPATH={0}'.format(':'.join(python_path_list))
        commands.append(python_path)

        commands.append(
            "celery -A tasks worker -Q {q1},{q2} -n {worker_name} --autoreload --loglevel={log_level} --workdir {workdir} > {celery_log} 2>&1".format(
                q1=CeleryConfig.get_queue_name(agent_type=AgentTypes.FLEX),
                q2=CeleryConfig.get_queue_name(agent_type=AgentTypes.FLEX, instance_type=instance_type),
                log_level=celery_log_level,
                worker_name=celery_worker_name,
                work_dir=stochss_parent_dir,
                celery_log=os.path.join(stochss_parent_dir, 'celery.log'),
            )
        )

        command = ';'.join(commands)
        # start_celery_str = "celery -A tasks worker --autoreload --loglevel=info --workdir /home/ubuntu > /home/ubuntu/celery.log 2>&1"
        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to
        # write to the process' terminal, screen provides this terminal.
        celery_cmd = "screen -d -m bash -c '{0}'".format(command)

        script = '\n'.join([
            '#!/bin/bash',
            celery_cmd
        ])

        start_celery_script = '/tmp/start_celery.sh'
        with open(os.path.join(start_celery_script)) as fin:
            fin.write(script)

        st = os.stat(start_celery_script)
        os.chmod(start_celery_script, st.st_mode | stat.S_IEXEC)

        os.system('sudo {}'.format(start_celery_script))


class AgentTypes(object):
    FLEX = 'flex'

class CeleryConfig(object):
    EXCHANGE_PREFIX = "exchange_stochss"
    QUEUE_PREFIX = "queue_stochss"
    ROUTING_KEY_PREFIX = "routing_key_stochss"

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
