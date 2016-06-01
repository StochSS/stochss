from google.appengine.ext import db
import pprint
import sys
import os
from backend.common.config import AgentTypes, JobConfig, JobDatabaseConfig
import logging


class EmailConfig(db.Model):
    """ A Model to store config for sending email """
    smtp_host = db.StringProperty()
    smtp_port = db.StringProperty()
    smtp_username = db.StringProperty()
    smtp_password = db.StringProperty()

    @classmethod
    def get_config(self):
        ret = {}
        ret['smtp_host'] = 'smtp_host'
        ret['smtp_port'] = '465'
        ret['smtp_username'] = 'smtp_username'
        ret['smtp_password'] = 'smtp_password'
        return ret

    @classmethod
    def set_config(self, smtp_host, smtp_port, smtp_username, smtp_password):
        pass

    @classmethod
    def send_email(self, to_email_address, subject, message):
        return True
