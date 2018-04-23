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
        try:
            if 'save' in params:
                EmailConfig.save_config(
                    params['smtp_host'],
                    params['smtp_port'],
                    params['smtp_username'],
                    params['smtp_password'],
                    params['from_email'],
                    params['url_prefix']
                )
                context['msg'] = 'Config Saved'
            elif 'test' in params:
                EmailConfig.send_email(
                    params['to_email'],
                    'Test email from StochSS',
                    'Test email from StochSS'
                )
                context['msg'] = 'Test Email Sent'
            elif 'enable' in params:
                if EmailConfig.set_enabled_true():
                    context['msg'] = 'Email system enabled'
                else: 
                    context['msg'] = 'Could not enable email system'
                    
            elif 'disable' in params:
                if EmailConfig.set_enabled_false():
                    context['msg'] = 'Email system disabled'
                else: 
                    context['msg'] = 'Could not disable email system'
        except Exception as e:
            context['msg'] = "Error: {0}".format(e)
        context.update( EmailConfig.get_config() )
        self.render_response('emailsetup.html', **context)

