from google.appengine.ext import db

from stochssapp import BaseHandler

from db_models.email_config import EmailConfig


class EmailSetupPage(BaseHandler):
    """ The main handler for the Email Setup Page.
    """
    def authentication_required(self):
        return True

    def get(self):
        context = EmailConfig.get_config()
        self.render_response('emailsetup.html', **context)

    def post(self):
        params = self.request.POST
        context = {}
        if 'save' in params:
            EmailConfig.get_config(
                params['smtp_host'],
                params['smtp_port'],
                params['smtp_username'],
                params['smtp_email']
            )
            context['msg'] = 'Config Saved'
        elif 'test' in params:
            context = EmailConfig.get_config()
            EmailConfig.send_email(
                params['to_email'],
                'Test email from StochSS',
                'Test email from StochSS'
            )
            context['msg'] = 'Test Email Sent'
            
        context.update( EmailConfig.get_config() )
        self.render_response('emailsetup.html', **context)

        
