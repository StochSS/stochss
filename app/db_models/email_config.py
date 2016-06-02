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
    from_email = db.StringProperty()

    @classmethod
    def get_config(self):
        ret = {}
        ret['smtp_host'] = ''
        ret['smtp_port'] = ''
        ret['smtp_username'] = ''
        ret['smtp_password'] = ''
        ret['from_email'] = ''
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is not None:
            ret['smtp_host'] = config.smtp_host
            ret['smtp_port'] = config.smtp_port
            ret['smtp_username'] = config.smtp_username
            ret['smtp_password'] = config.smtp_password
            ret['from_email'] = config.from_email
        return ret

    @classmethod
    def save_config(self, smtp_host, smtp_port, smtp_username, smtp_password, from_email):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            config = EmailConfig()
        config.smtp_host     = smtp_host
        config.smtp_port     = smtp_port
        config.smtp_username = smtp_username
        config.smtp_password = smtp_password
        config.from_email    = from_email
        config.put()

    @classmethod
    def is_enabled():
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        return True
        

    @classmethod
    def send_email(self, to_email_address, subject, message):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        import smtplib
        smtp = smtplib.SMTP_SSL(config.smtp_host, int(config.smtp_port))
        from email.mime.text import MIMEText
        msg = MIMEText(message)
        msg['To'] = to_email_address
        msg['Subject'] = subject
        msg['From'] = config.from_email
        smtp.sendmail(config.from_email, to_email_address, msg.as_string())
        return True
