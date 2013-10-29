try:
  import json
except ImportError:
  from django.utils import simplejson as json

from google.appengine.ext import ndb
from google.appengine.ext import db

from stochssapp import BaseHandler
from stochssapp import User

class PendingUsersList(db.Model):
    """
    A model to store the list of pending users.
    This includes users who haven't been given access yet,
     as well as users who have been given access and haven't yet logged in.
    Once a user logs in, a User model is created for them in the datastore
     and they are removed from this list.
    """
    users_waiting_approval = db.StringListProperty()
    approved_users = db.StringListProperty()
    
    @classmethod
    def shared_list(cls):
        """
        The idea is that only one of these lists exist in the datastore.
        This method encapsulates that logic and retrieves that list.
        """
        shared_list = db.GqlQuery("SELECT * FROM " + cls.__name__).get()
        if shared_list is None:
            shared_list = cls()
            shared_list.put()
        return shared_list
    
    def is_user_approved(self, user_email):
        """ Check if the given email address belongs to an approved user """
        if self.approved_users and (user_email in self.approved_users):
            return True
        return False
    
    def add_user_to_approval_waitlist(self, user_email):
        """
        Add the given email address to the list of users waiting approval
         i.e. the users that have tried to log in without first being granted access
        """
        if self.users_waiting_approval and (user_email in self.users_waiting_approval):
            return
        self.users_waiting_approval.append(user_email)
        self.put()
        
    def approve_user(self, user_email):
        """
        Add given email address to list of approved users
        Returns False is email address already in list, else True
        """
        if self.approved_users and (user_email in self.approved_users):
            return False
        self.approved_users.append(user_email)
        self.put()
        return True

def admin_required(handler):
    """
    Decorator for requiring admin access to page.
    Assumes user already logged in, so redirects to profile page if not admin
    """
    def check_admin(self, *args, **kwargs):
        if self.user.is_admin_user:
            return handler(self, *args, **kwargs)
        else:
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
        pending_users_list = PendingUsersList.shared_list()

        context = {
            'active_users': users,
            'approved_users': pending_users_list.approved_users,
            'users_waiting_approval': pending_users_list.users_waiting_approval
        }
        self.render_response('admin.html', **context)
        
    @admin_required
    def post(self):
        """ Used to update the list of approved users """
        email_address = self.request.get('email')
        pending_users_list = PendingUsersList.shared_list()
        success = pending_users_list.approve_user(email_address)

        result = {
            'email': email_address,
            'success': success
        }
        self.response.write(json.dumps(result))
        return
