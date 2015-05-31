import logging
import urllib2
import os

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
            import celery
            reload(celery)

            stats = celery.current_app.control.inspect(destination=[celery_hostname]).stats()

            if stats == None:
                logging.info('No celery started!')
                info = {'state': FlexVMState.UNPREPARED}

            else:
                logging.info('Celery running!')

                if celery_hostname not in stats:
                    info = {'state': FlexVMState.UNPREPARED}

                else:
                    broker = stats[celery_hostname]['broker']
                    logging.info('broker = {}'.format(broker))

                    info = {
                        'state': FlexVMState.RUNNING,
                        'queue_head_ip': broker['hostname']
                    }

                    if broker['hostname'] == public_ip:
                        info['is_queue_head'] = True
                    else:
                        info['is_queue_head'] = False
        except Exception, e:
            logging.error('Error in fetching broker url: {0}'.format(str(e)))
            info = {'state': FlexVMState.UNKNOWN}

        logging.info('info = {}'.format(info))
        return info

    @staticmethod
    def prepare(request_info):
        return {}

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
                    'state': state_info['state']
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

