from google.appengine.ext import db
import pprint
import sys
import os
from backend.common.config import AgentTypes, JobConfig, JobDatabaseConfig
import logging


class EmailConfig(db.Model):
    """ A Model to store config for sending email """
    enabled = db.BooleanProperty()
    smtp_host = db.StringProperty()
    smtp_port = db.StringProperty()
    smtp_username = db.StringProperty()
    smtp_password = db.StringProperty()
    from_email = db.StringProperty()
    url_prefix = db.StringProperty()

    @classmethod
    def get_config(self):
        ret = {}
        ret['smtp_host'] = ''
        ret['smtp_port'] = ''
        ret['smtp_username'] = ''
        ret['smtp_password'] = ''
        ret['from_email'] = ''
        ret['url_prefix']=''
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is not None:
            ret['smtp_host'] = config.smtp_host
            ret['smtp_port'] = config.smtp_port
            ret['smtp_username'] = config.smtp_username
            ret['smtp_password'] = config.smtp_password
            ret['from_email'] = config.from_email
            ret['url_prefix']=config.url_prefix
            ret['email_enabled'] = bool(config.enabled)
        return ret

    @classmethod
    def save_config(self, smtp_host, smtp_port, smtp_username, smtp_password, from_email,url_prefix):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            config = EmailConfig()
            config.enabled = False
        config.smtp_host     = smtp_host
        config.smtp_port     = smtp_port
        config.smtp_username = smtp_username
        config.smtp_password = smtp_password
        config.from_email    = from_email
        config.url_prefix    = url_prefix
        config.put()

    @classmethod
    def set_enabled_true(self):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is not None:
            config.enabled = True
            config.put()
            return True
        return False

    @classmethod
    def set_enabled_false(self):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is not None:
            config.enabled = False
            config.put()
            return True
        return False

    @classmethod
    def is_enabled(self):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        return bool(config.enabled)
        

    @classmethod
    def send_email(self, to_email_address, subject, message):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        import smtplib
        smtp = smtplib.SMTP(config.smtp_host, int(config.smtp_port))
        from email.mime.text import MIMEText
        msg = MIMEText(message)
        msg['To'] = to_email_address
        msg['Subject'] = subject
        msg['From'] = config.from_email
        smtp.starttls()
        smtp.login(config.smtp_username, config.smtp_password)
        smtp.sendmail(config.from_email, to_email_address, msg.as_string())
        smtp.quit()
        return True

    @classmethod
    def send_verification_email(self,user_email, token):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        msg = "Please click the following link in order to verify your account: {0}".format(str(config.url_prefix)+"/verify?user_email={0}&signup_token={1}".format(user_email, token))
        status = self.send_email(user_email,"StochSS registration verification", msg)
        if status:
            return True
        else:
            return False

    @classmethod
    def send_password_reset_email(self,user_email, token):
        config = db.GqlQuery("SELECT * FROM EmailConfig").get()
        if config is None:
            return False
        msg = "Please click the following link in order to reset your password: {0}".format(str(config.url_prefix)+"/passwordreset?user_email={0}&token={1}".format(user_email, token))
        status = self.send_email(user_email,"StochSS: Reset password", msg)
        if status:
            return True
        else:
            return False
