try:
  import json
except ImportError:
  from django.utils import simplejson as json

from google.appengine.ext import ndb

from stochssapp import BaseHandler
from stochssapp import User

def admin_required(handler):
    """
    Decorator for requiring admin access to page.
    Assumes user already logged in, so redirects to profile page if not admin
    """
    def check_admin(self, *args, **kwargs):
        try:
            if self.user.is_admin == "YES":
                return handler(self, *args, **kwargs)
        except AttributeError:
            self.redirect('/profile')
    return check_admin

class AdminPage(BaseHandler):
    """
    """
    def authentication_required(self):
        return True
    
    @admin_required
    def get(self):
        """ Corresponds to /admin """
        users = User.query().fetch(projection=[ndb.GenericProperty('name'), ndb.GenericProperty('email_address')])
        if len(users) == 0:
            users = None
        context = {'users': users}
        self.render_response('admin.html', **context)
        
    @admin_required
    def post(self):
        """ Used to update the list of approved users """
        email_address = self.request.get('email')

        result = {
            'email': email_address,
            'name': 'Need to send name'
        }
        self.response.write(json.dumps(result))
        return
