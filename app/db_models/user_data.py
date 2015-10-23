from google.appengine.ext import db
import pprint
import sys
import os
from backend.common.config import AgentTypes, JobConfig, JobDatabaseConfig
import logging
from db_models.vm_state_model import VMStateModel

try:
    import json
except ImportError:
    from django.utils import simplejson as json



class UserData(db.Model):
    """ A Model to store user specific data, such as the AWS credentials. """

    # user ID
    user_id = db.StringProperty()

    # The Amazon credentials
    ec2_access_key = db.StringProperty()
    ec2_secret_key = db.StringProperty()
    valid_credentials = db.BooleanProperty()

    # The user's S3 bucket name used to store simulation results in S3
    S3_bucket_name = db.StringProperty()

    # Is the amazon db table initalizes
    is_amazon_db_table = db.BooleanProperty()

    # Private Cloud Machine Info
    flex_cloud_machine_info = db.TextProperty(default="[]")
    valid_flex_cloud_info = db.BooleanProperty(default=False)
    is_flex_cloud_info_set = db.BooleanProperty(default=False)
    flex_db_password = db.StringProperty()

    flex_cloud_status = db.BooleanProperty()
    flex_cloud_info_msg = db.TextProperty()

    # reservation ID for Flex Cloud
    reservation_id = db.StringProperty()

    env_variables = db.TextProperty()


    def setCredentials(self, credentials):
        self.ec2_access_key = credentials['EC2_ACCESS_KEY']
        self.ec2_secret_key = credentials['EC2_SECRET_KEY']

    def getCredentials(self):
        return {'EC2_SECRET_KEY': self.ec2_secret_key, 'EC2_ACCESS_KEY': self.ec2_access_key}

    def setBucketName(self, bucket_name):
        self.S3_bucket_name = str(bucket_name)

    def getBucketName(self):
        return self.S3_bucket_name

    def isTable(self):
        return self.is_amazon_db_table

    def set_flex_cloud_machine_info(self, machine_info):
        logging.debug("set_flex_cloud_machine_info() machine_info = {0}".format(machine_info))
        self.flex_cloud_machine_info = json.dumps(machine_info, encoding="ascii")

    def get_flex_cloud_machine_info(self):
        info = json.loads(self.flex_cloud_machine_info, encoding="ascii")
        logging.debug("get_flex_cloud_machine_info() info = {0}".format(self.flex_cloud_machine_info))
        return info

    def get_flex_queue_head_machine(self):
        flex_cloud_machine_info = self.get_flex_cloud_machine_info()
        queue_head_machine = None
        for machine in flex_cloud_machine_info:
            if machine['queue_head']:
                queue_head_machine = machine
                break

        logging.debug('flex_queue_head_machine = {}'.format(queue_head_machine))
        return queue_head_machine

    def __get_all_vms(self, params, service):
        logging.debug('__get_all_vms() params={0}'.format(params))
        #service = backendservice.backendservices(self)
        result = service.describe_machines_from_db(params, force=False)
        return result

    def update_flex_cloud_machine_info_from_db(self, service):
        logging.debug('update_flex_cloud_machine_info_from_db')

        if self.is_flex_cloud_info_set:
            flex_cloud_machine_info = self.get_flex_cloud_machine_info()

            if flex_cloud_machine_info is None or len(flex_cloud_machine_info) == 0:
                return

            all_vms = self.__get_all_vms(AgentTypes.FLEX, service)
            #logging.debug('flex: all_vms =\n{0}'.format(pprint.pformat(all_vms)))
            logging.debug('flex: all_vms =\n{0}'.format(all_vms))

            all_vms_map = {vm['pub_ip']: vm for vm in all_vms}
            #logging.debug('flex: all_vms_map =\n{0}'.format(pprint.pformat(all_vms_map)))
            logging.debug('flex: all_vms_map =\n{0}'.format(all_vms_map))

            for machine in flex_cloud_machine_info:
                vms = VMStateModel.get_by_ip(machine['ip'], reservation_id=self.reservation_id)
                if vms is None:
                    logging.debug('machine={0} vms=NONE'.format(machine))
                else:
                    logging.debug('machine={0} vms={1} {2}'.format(machine, vms.pub_ip, vms.state))
                if vms and vms.res_id == self.reservation_id:
                    machine['state'] = vms.state
                    machine['description'] = vms.description
                else:
                    if vms:
                        logging.error('From VMStateModel, reservation_id = {0} != user_data.reservation_id'.format(
                            vms.res_id
                        ))
                    machine['state'] = VMStateModel.STATE_UNKNOWN
                    machine['description'] = VMStateModel.STATE_UNKNOWN

            for machine in flex_cloud_machine_info:
                machine['key_file_id'] = int(machine['key_file_id'])

            logging.debug('After updating from VMStateModel, flex_cloud_machine_info =\n{0}'.format(
                                                                pprint.pformat(flex_cloud_machine_info)))

            # Update Flex Cloud Status
            valid_flex_cloud_info = False
            for machine in flex_cloud_machine_info:
                if machine['queue_head'] and machine['state'] == VMStateModel.STATE_RUNNING:
                    valid_flex_cloud_info = True

            self.valid_flex_cloud_info = valid_flex_cloud_info
            self.set_flex_cloud_machine_info(flex_cloud_machine_info)
            self.put()

            logging.debug('valid_flex_cloud_info = {0}'.format(self.valid_flex_cloud_info))

        else:
            # for clearing out db syn requests
            all_vms = self.__get_all_vms(AgentTypes.FLEX, service)
            logging.debug('flex: all_vms =\n{0}'.format(pprint.pformat(all_vms)))
