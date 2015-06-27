import logging
import pprint
import sys

from google.appengine.ext import db

class VMStateModelException(Exception):
    pass

from backend.common.config import AgentTypes


class VMStateModel(db.Model):
    SUPPORTED_INFRA = [AgentTypes.EC2, AgentTypes.FLEX]

    IDS = 'ids'

    STATE_CREATING = 'creating'
    STATE_PENDING = 'pending'
    STATE_RUNNING = 'running'
    STATE_STOPPED = 'stopped'
    STATE_FAILED = 'failed'
    STATE_TERMINATED = 'terminated'
    STATE_UNPREPARED = 'unprepared'
    STATE_UNKNOWN = 'unknown'
    STATE_ACCESSIBLE = 'accessible'
    STATE_INACCESSIBLE = 'inaccessible'

    DESCRI_FAIL_TO_RUN = 'fail to run the instance'
    DESCRI_TIMEOUT_ON_SSH = 'timeout to connect instance via ssh'
    DESCRI_FAIL_TO_COFIGURE_CELERY = 'fail to configure celery on the instance'
    DESCRI_FAIL_TO_COFIGURE_SHUTDOWN = 'fail to configure shutdown behavior on the instance'
    DESCRI_NOT_FOUND = 'not find the instance in cloud infrastructure'
    DESCRI_SUCCESS = 'success'
    DESCRI_INVALID_KEYFILE = 'fail to find valid key file for instance'
    DESCRI_FAIL_TO_PREPARE = 'fail to prepare the instance'

    infra = db.StringProperty()
    ec2_access_key = db.StringProperty()
    ec2_secret_key = db.StringProperty()
    user_id = db.StringProperty()
    ins_type = db.StringProperty()
    res_id = db.StringProperty()
    ins_id = db.StringProperty()
    pub_ip = db.StringProperty()
    pri_ip = db.StringProperty()
    keyfile = db.StringProperty()
    username = db.StringProperty()
    states = set([STATE_CREATING, STATE_PENDING, STATE_RUNNING, STATE_STOPPED, STATE_FAILED,
                  STATE_TERMINATED, STATE_UNPREPARED, STATE_UNKNOWN, STATE_ACCESSIBLE, STATE_INACCESSIBLE])
    state = db.StringProperty(required=True,
                              choices=states)
    description = db.StringProperty()
    created = db.DateTimeProperty(auto_now_add=True)

    @staticmethod
    def _validate(params):
        '''
        validate if the access key and secret key are available to be used
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        Return
            A tuple of the form (infrastructure, credentials).
        '''
        if 'infrastructure' in params and params['infrastructure'] in VMStateModel.SUPPORTED_INFRA:
            infra = params['infrastructure']
        else:
            raise VMStateModelException('Infrastructure is not supported for VMStateModel!')

        if 'user_id' in params and params['user_id'] != None:
            user_id = params['user_id']
        else:
            raise VMStateModelException('Valid user_id not provided in params!')

        if infra == AgentTypes.EC2:
            if 'credentials' in params:
                if 'EC2_ACCESS_KEY' in params['credentials'] and 'EC2_SECRET_KEY' in params['credentials']:
                    access_key = params['credentials']['EC2_ACCESS_KEY']
                    secret_key = params['credentials']['EC2_SECRET_KEY']
                else:
                    raise VMStateModelException('Cannot get EC2 access key or secret.')
            else:
                raise VMStateModelException('No EC2 credentials are provided.')

            if access_key is None or secret_key is None:
                raise VMStateModelException('EC2 Credentials are not given!')

            ec2_credentials = {'EC2_ACCESS_KEY': access_key,
                           'EC2_SECRET_KEY': secret_key}
            return infra, ec2_credentials, user_id

        elif infra == AgentTypes.FLEX:
            return infra, None, user_id

        return None, None, None

    @staticmethod
    def _get_all_entities(params):
        try:
            infra, ec2_credentials, user_id = VMStateModel._validate(params)

            if infra != None and user_id != None:
                entities = VMStateModel.all()
                entities.filter('infra =', infra).filter('user_id =', user_id)

                if infra == AgentTypes.EC2:
                    entities.filter('ec2_access_key =', ec2_credentials['EC2_ACCESS_KEY'])\
                        .filter('ec2_secret_key =', ec2_credentials['EC2_SECRET_KEY'])

                if 'reservation_id' in params and params['reservation_id'] != None:
                    logging.debug('_get_all_entities(): For agent {0}, filtering with (res_id = {1})'.format(infra, params['reservation_id']))
                    entities.filter('res_id = ', params['reservation_id'])

                return entities

        except Exception as e:
            logging.error('Error: {0}'.format(str(e)))

        return None

    @staticmethod
    def get_all(params):
        '''
        get the information of all vms that are not terminated
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        Return
            a dictionary of vms info
        '''
        try:
            entities = VMStateModel._get_all_entities(params)
            #entities.filter('state !=', VMStateModel.STATE_TERMINATED)

            all_vms = []
            for e in entities:
                vm_dict = {
                    "database_id" : e.key().id(),
                    "ins_id": e.ins_id,
                    "instance_type": e.ins_type,
                    "state": e.state,
                    "description": e.description,
                    "username": e.username,
                    "pub_ip": e.pub_ip,
                    "keyfile": e.keyfile,
                    "reservation_id": e.res_id
                }
                all_vms.append(vm_dict)

            return all_vms

        except Exception as e:
            logging.error("Error in getting all vms from db! {0}".format(e))
            return None

    @staticmethod
    def get_instance_type(params, ins_id):
        try:
            entities = VMStateModel._get_all_entities(params)
            entities.filter('ins_id ==', ins_id)

            e = entities.get()
            return e.ins_type

        except Exception as e:
            logging.error("Error in getting the instance type of instance {0} from db! {1}".format(ins_id, e))
            return None

    @staticmethod
    def get_running_instance_types(params):
        try:
            entities = VMStateModel._get_all_entities(params)
            entities.filter('state ==', VMStateModel.STATE_RUNNING)

            types = []
            for e in entities:
                types.append(e.ins_type)

            return list(set(types))

        except Exception as e:
            logging.error("Error in getting all running instance types from db! {0}".format(e))
            return None

    @staticmethod
    def fail_active(params):
        '''
        update all vms that are 'creating' to 'failed'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        logging.debug('fail_active()')

        try:
            entities = VMStateModel._get_all_entities(params)
            entities.filter('state =', VMStateModel.STATE_CREATING)

            for e in entities:
                e.state = VMStateModel.STATE_FAILED
                e.put()

        except Exception as e:
            logging.error("Error in updating 'creating' vms to 'failed' in db! {0}".format(e))

    @staticmethod
    def cleanup_flex_old_flex_entries(user_id):
        '''
        update all flex vms that , and delete those entried
        Args
            params
        '''
        logging.debug('cleanup_flex_old_flex_entries()')
        try:
            if user_id != None:
                entities = VMStateModel.all()
                entities.filter('user_id =', user_id)
                entities.filter('infra = ', 'flex')
                for e in entities:
                    logging.debug('Deleting {0}'.format(e.ins_type))
                    e.delete()

        except Exception as e:
            logging.exception("Error deleteing flex VMStateModel entities in db {0}".format(e))

    @staticmethod
    def delete_terminated(user_id):
        '''
        update all vms that are in 'terminated' state, and delete those entried
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        logging.debug('delete_terminated()')
        try:
            if user_id != None:
                entities = VMStateModel.all()
                entities.filter('user_id =', user_id)
                entities.filter('state =', VMStateModel.STATE_TERMINATED)
                for e in entities:
                    logging.debug('Deleting {0}'.format(e.ins_type))
                    e.delete()

        except Exception as e:
            logging.exception("Error deleteing terminated VMStateModel entities in db {0}".format(e))


    @staticmethod
    def terminate_not_active(params):
        '''
        update all vms that are in 'failed' or 'unknown' state in the last launch to 'terminated'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        logging.debug('terminate_not_active')
        try:
            logging.debug('Terminating vms with FAILED state')
            entities = VMStateModel._get_all_entities(params)
            entities.filter('state =', VMStateModel.STATE_FAILED)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()
        except Exception as e:
            logging.error("Error in updating non-active vms with FAILED state to terminated in db! {0}".format(e))

        try:
            logging.debug('Terminating vms with UNKNOWN state')
            entities = VMStateModel._get_all_entities(params)
            entities.filter('state =', VMStateModel.STATE_UNKNOWN)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()

        except Exception as e:
            logging.error("Error in updating non-active vms with UNKNOWN state to terminated in db! {0}".format(e))

    @staticmethod
    def terminate_all(params):
        '''
        update the state of all vms that are not terminated to 'terminated'.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
        '''
        logging.info('terminate_all')
        try:
            entities = VMStateModel._get_all_entities(params)
            entities.filter('state !=', VMStateModel.STATE_TERMINATED)

            for e in entities:
                e.state = VMStateModel.STATE_TERMINATED
                e.put()
        except Exception as e:
            logging.error("Error in terminating all vms in db! {0}".format(e))


    @staticmethod
    def update_res_ids(params, ids, res_id):
        '''
        set the reservation id of the some entities given their ids.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ids       a list of ids which are the primary keys of VMStateModel
            res_id    the reservation id that should be updated
        '''
        logging.info('update_res_ids: ids = {0} res_id = {1}'.format(ids, res_id))
        try:
            infra, ec2_credentials, user_id = VMStateModel._validate(params)
            if infra == None or user_id == None:
                return

            entities = VMStateModel.get_by_id(ids)

            for e in entities:
                e.res_id = res_id
                e.put()

        except Exception as e:
            logging.error("Error in updating reservation ids in db! {0}".format(e))

    @staticmethod
    def update_ins_ids(params, ins_ids, res_id, from_state, to_state):
        '''
        set the instance ids within the certain reservation,
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are going to be set with
            res_id    the reservation id that is based on
        '''
        logging.info('update_ins_ids:\nins_ids = {0}\nres_id = {1}'.format(ins_ids, res_id))
        logging.info('update_ins_ids:\nfrom_state = {0}\nto_state = {1}'.format(from_state, to_state))
        logging.debug('\n\nparams =\n{0}'.format(pprint.pformat(params)))

        try:
            entities = VMStateModel._get_all_entities(params)
            entities.filter('res_id =', res_id).filter('state =', from_state)

            for (ins_id, e) in zip(ins_ids, entities.run(limit=len(ins_ids))):
                logging.info('ins_id = {0}'.format(ins_id))
                e.ins_id = ins_id
                e.state = to_state
                e.put()
            logging.info('Updated ins_ids = {0}'.format(ins_ids))

        except Exception as e:
            logging.error("Error in updating instance ids in db! {0}".format(e))

    @staticmethod
    def update_ips(params, ins_ids, pub_ips, pri_ips, ins_types, keyfiles):
        '''
        set the the public ips, the private ips, the instance types and the keyfiles
        to corresponding instance ids.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are based on
            pub_ips   a list of public ips that are going to be set with
            pri_ips   a list of private ips that are going to be set with
            ins_type  a list of instance types that are going to be set with
            keyfiles  a list of keyfiles that is corresponding to this set of instance ids
        '''
        logging.info(
            'update_ips:\n\nins_ids = {0}\npub_ips = {1}\npri_ips = {2}\nins_types = {3}\nkeyfiles = {keyfiles}'.format(
                ins_ids, pub_ips, pri_ips, ins_types, keyfiles=keyfiles))
        logging.debug('\n\nparams = {}'.format(pprint.pformat(params)))

        try:
            if keyfiles is None:
                raise Exception('Error: Cannot find keyfiles!')

            for (ins_id, pub_ip, pri_ip, ins_type, keyfile) in zip(ins_ids, pub_ips, pri_ips, ins_types, keyfiles):
                entities = VMStateModel._get_all_entities(params)
                e = entities.filter('ins_id =', ins_id).get()

                if e == None:
                    logging.error('Error: Could not find vm: ins_id={ins_id}'.format(ins_id=ins_id))
                else:
                    e.pub_ip = pub_ip
                    e.pri_ip = pri_ip
                    e.ins_type = ins_type
                    e.keyfile = keyfile
                    e.put()

        except Exception as e:
            print sys.exc_info()
            logging.error("Error in updating ips in db! {0}".format(e))

    @staticmethod
    def set_state(params, ins_ids, state, description=None):
        '''
        set the state of a list of instances and add some discriptions if needed.
        Args
            params    a dictionary of parameters, containing at least 'agent' and 'credentials'.
            ins_ids   a list of instance ids that are going to be set state
            state     the state that is going to be set to the instances
            description    (optional) the description to the state
        '''
        logging.info('set_state:\nins_ids = {0}\nstate = {1}\ndescription = {2}'.format(ins_ids, state, description))
        logging.debug('set_state:\nparams =\n{0}'.format(pprint.pformat(params)))
        try:
            for ins_id in ins_ids:
                entities = VMStateModel._get_all_entities(params)
                e = entities.filter('ins_id =', ins_id).get()

                if e == None:
                    logging.error('Error: Could not find vm: ins_id={ins_id}'.format(ins_id=ins_id))
                else:
                    if e.state != VMStateModel.STATE_TERMINATED:
                        e.state = state
                    if description is not None:
                        e.description = description
                    e.put()

        except Exception as e:
            logging.error("Error in set_state: {0}".format(str(e)))


    @staticmethod
    def synchronize(agent, parameters):
        '''
        synchronization the db with the specific agent
        Args
            agent    the agent that is going to be synchronized with
            credentials    the dictionary containing access_key and secret_key pair of the agent
        '''
        logging.info('For agent {0}, Start Synchronizing DB...'.format(agent.AGENT_NAME))
        logging.debug("synchronize() parameters={0}".format(parameters))
        instance_list = agent.describe_instances(parameters)

        entities = VMStateModel._get_all_entities(params=parameters)
        #entities.filter('state !=', VMStateModel.STATE_TERMINATED).filter('state !=', VMStateModel.STATE_CREATING)

        for e in entities:
            found = False
            for instance in instance_list:
                if e.ins_id == instance['id']:
                    found = True
                    if e.state == VMStateModel.STATE_PENDING and instance['state'] == VMStateModel.STATE_RUNNING:
                        break
                    else:
                        if instance['state'] == 'shutting-down':
                            instance['state'] = VMStateModel.STATE_TERMINATED
                        e.state = instance['state']
                        e.put()
                    break

            if not found:
                e.state = VMStateModel.STATE_TERMINATED
                e.decription = VMStateModel.DESCRI_NOT_FOUND
                e.put()

        logging.info('Finished synchronizing DB!')
