import logging
import urllib2

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
        try:
            import celery
            stats = celery.current_app.control.inspect(destination=[public_ip]).stats()
            if stats == None:
                info = {'state': FlexVMState.UNPREPARED}
            else:
                broker = stats['broker']
                info = {'state': FlexVMState.RUNNING,
                        'queue_head_ip': broker['hostname']}
                if broker['hostname'] == public_ip:
                    info['is_queue_head'] = True
                else:
                    info['is_queue_head'] = False
        except Exception, e:
            logging.error('Error in fetching broker url: {0}'.format(str(e)))
            info = {'state': FlexVMState.UNKNOWN}

        return info

    def change_state(self, from_state, to_state):
        if from_state == to_state:
            return {'message': 'No change required!',
                    'success': True}

        if from_state not in FlexVMState.VALID_STATES and to_state not in FlexVMState.VALID_STATES:
            return {'message':
                        'from_state = {0}, to_state = {1} are invalid states for successful state transition!'.format(
                            from_state, to_state),
                    'success': False}



