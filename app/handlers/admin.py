try:
  import json
except ImportError:
  from django.utils import simplejson as json

import logging, string, random

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
        Returns False if email address already in list, else True
        """
        if self.users_waiting_approval and (user_email in self.users_waiting_approval):
            return False
        self.users_waiting_approval.append(user_email)
        self.put()
        return True
    
    def remove_user_from_approval_waitlist(self, user_email):
        '''
        Removes the given email address from the approval waitlist.
        This function is currently only called when the email exists in the waitlist so 
         theres no checking to do.
        '''
        self.users_waiting_approval.remove(user_email)
        self.put()
        
    def approve_user(self, user_email, awaiting_approval):
        """
        Add given email address to list of approved users and 
         remove it from waiting approval list if needed.
        Returns False if email address already in list, else True
        """
        if self.approved_users and (user_email in self.approved_users):
            return False
        if awaiting_approval:
            self.users_waiting_approval.remove(user_email)
        self.approved_users.append(user_email)
        self.put()
        return True
    
    def remove_user_from_approved_list(self, user_email):
        self.approved_users.remove(user_email)
        self.put()

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
        users = User.query().fetch()
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
        """
        Main entry point of ajax calls from Admin page.
        """
        action = self.request.get('action')
        email = self.request.get('email')
        logging.info("Processing admin request to perform action '{0}' with email '{1}'".format(action, email))
        json_result = {
            'email': email
        }
        failure_message = ''
        if action in ['approve', 'approve1']:
            result = self._approve_user(email, action == 'approve1')
        elif action == 'deny':
            result = self._deny_user(email)
        elif action == 'revoke':
            result = self._revoke_user(email)
        elif action == 'delete':
            result = self._delete_user(email)
            if not result:
                failure_message = "You can't delete the admin user!"
        elif action == 'reset':
            result, password = self._reset_user_password(email)
            json_result['password'] = password
        else:
            json_result['success'] = False
            return self.response.write(json.dumps(json_result))
        
        json_result['success'] = result
        if failure_message is not '':
            json_result['message'] = failure_message
        return self.response.write(json.dumps(json_result))
    
    def _approve_user(self, email, awaiting_approval):
        """ Add user to approved users list and remove it from the waiting approval list if necessary """
        pending_users_list = PendingUsersList.shared_list()
        success = pending_users_list.approve_user(email, awaiting_approval)
        return success
    
    def _deny_user(self, email):
        """ Remove user from waiting approval list """
        pending_users_list = PendingUsersList.shared_list()
        pending_users_list.remove_user_from_approval_waitlist(email)
        return True
        
    def _revoke_user(self, email):
        """ Remove user from approved users list """
        pending_users_list = PendingUsersList.shared_list()
        pending_users_list.remove_user_from_approved_list(email)
        return True

    def _delete_user(self, email):
        """ Delete existing user """
        users = User.query(ndb.GenericProperty('email_address') == email).fetch()
        if users:
            user = users[0]
            if user.is_admin_user():
                return False
            # Delete from db
            user.key.delete()
            # Need to delete the auth_id from the 'unique' model store
            # see https://code.google.com/p/webapp-improved/source/browse/webapp2_extras/appengine/auth/models.py
            unique_auth_id = "User.auth_id:{0}".format(email)
            User.unique_model.delete_multi([unique_auth_id])
        return True
    
    def _reset_user_password(self, email):
        '''
        Reset the password of the user with the given email address to a
         random password that they will be sure to change immediately.
        Returns a tuple (success, password), where success is a boolean
         indicating whether or not the operation completed and password is 
         the new password of the user if success is True.
        '''
        user = User.get_by_auth_id(email)
        # First we have 5 letters (upper/lowercase) or digits
        random_password = ''.join(random.choice(string.ascii_letters + string.digits) for x in range(5))
        # Then 2 punctuation chars
        random_password += ''.join(random.choice(string.punctuation) for x in range(2))
        # Then 5 more letters or digits
        random_password += ''.join(random.choice(string.ascii_letters + string.digits) for x in range(5))
        user.set_password(random_password)
        user.put()
        return (True, random_password)