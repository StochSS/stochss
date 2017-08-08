try:
  import json
except ImportError:
  from django.utils import simplejson as json

import logging, string, random

from google.appengine.ext import ndb
from google.appengine.ext import db

from stochssapp import BaseHandler
from stochssapp import User

from db_models.email_config import EmailConfig

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
    #user_verification_method = db.StringProperty()  # 'admin' (default), 'email', 'none'
    admin_approval_required = db.BooleanProperty()
    email_verification_required = db.BooleanProperty()

    @classmethod
    def shared_list(cls):
        """
        The idea is that only one of these lists exist in the datastore.
        This method encapsulates that logic and retrieves that list.
        """
        shared_list = db.GqlQuery("SELECT * FROM " + cls.__name__).get()
        if shared_list is None:
            shared_list = cls()
            shared_list.admin_approval_required = True
            shared_list.email_verification_required = False
            shared_list.put()
        if not hasattr(shared_list,'admin_approval_required'):
            shared_list.admin_approval_required = True
        if not hasattr(shared_list,'email_verification_required'):
            shared_list.email_verification_required = False
        return shared_list

    def set_admin_approval_required(self, value):
        """ Update the value of 'admin_approval_required' (boolean). """
        self.admin_approval_required = value
        self.put()

    def set_email_verification_required(self, value):
        """ Update the value of 'email_verification_required' (boolean). """
        self.email_verification_required = value
        self.put()

    def is_user_approved(self, user_email):
        """ Check if the given email address belongs to an approved user """
        if self.approved_users and (user_email in self.approved_users):
            return True
        return False

    def user_exists(self, user_email):
        return bool(User.get_by_auth_id(user_email))
    
    def add_user_to_approval_waitlist(self, user_email):
        """
        Add the given email address to the list of users waiting approval
         as long as the given user_email is not a current user's email.
        Returns True if email address already in list, or if it is added.
        """
        if (self.users_waiting_approval and (user_email in self.users_waiting_approval)):
            return True

        self.users_waiting_approval.append(user_email)
        self.put()
        return True
    
    def remove_user_from_approval_waitlist(self, user_email):
        '''
        Removes the given email address from the approval waitlist.
        '''
        if user_email in self.users_waiting_approval:
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
        if not self.is_user_approved(user_email):
            self.approved_users.append(user_email)
        if user_email in self.users_waiting_approval:
            self.users_waiting_approval.remove(user_email)
        self.put()
        return True
    
    def remove_user_from_approved_list(self, user_email):
        logging.info('remove_user_from_approved_list()')
        logging.info('self.approved_users = {0}'.format(self.approved_users))
        logging.info('self.users_waiting_approval = {0}'.format(self.users_waiting_approval))
        if user_email in self.approved_users:
            self.approved_users.remove(user_email)
        self.put()

    def remove_user_from_approval_waitlist(self, user_email):
        if self.users_waiting_approval and (user_email in self.users_waiting_approval):
            self.users_waiting_approval.remove(user_email)
        self.put()

def admin_required(handler):
    """
    Decorator for requiring admin access to page.
    Assumes user already logged in, so redirects to a page with information if not admin
    """
    def check_admin(self, *args, **kwargs):
        if self.user.is_admin_user():
            return handler(self, *args, **kwargs)
        else:
            self.redirect('/restricted')
    return check_admin

class RestrictedPageHandler(BaseHandler):
    """ Handles the case when user's try to access a restricted page. """

    def get(self):
        self.render_response('restricted.html')

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

        # This is complicated. We need to get the Users that don't exist as User objects, but exist as approved users. These are the pre-approved users. The admin user must be specifically excluded
        active_users = set(filter(None, [str(u.email_address) if not u.is_admin_user() else None for u in users]))
        approved_users = set([str(u) for u in pending_users_list.approved_users])
        preapproved_users = approved_users - active_users

        context = {
            'admin_approval_required' : pending_users_list.admin_approval_required,
            'email_verification_required' : pending_users_list.email_verification_required,
            'email_setup' : EmailConfig.is_enabled(),
            'active_users': users,
            'preapproved_users': preapproved_users,
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
        if action in ['approve']:
            result = self._approve_user(email, True)
        elif action in ['preapprove']:
            result = self._approve_user(email, False)
            self.redirect('/admin')
        elif action == 'revoke':
            result = self._revoke_user(email)
        elif action == 'revoke_preapproved':
            result = self._revoke_preapproved_user(email)
        elif action == 'delete':
            result = self._delete_user(email)
            if not result:
                failure_message = "You can't delete the admin user!"
        elif action == 'reset':
            result, password = self._reset_user_password(email)
            json_result['password'] = password
        elif action == 'change_verification_method':
            self._change_verification_method() 
            self.redirect('/admin')
            return
        else:
            json_result['success'] = False
            return self.response.write(json.dumps(json_result))
        
        json_result['success'] = result
        if failure_message is not '':
            json_result['message'] = failure_message
        return self.response.write(json.dumps(json_result))
    
    def _change_verification_method(self):
        """ Switch the value of the verification method """
        logging.info("self.request.get('admin_approval_required') == {0}".format(self.request.get('admin_approval_required')))
        if self.request.get('admin_approval_required') is not None and self.request.get('admin_approval_required') != '':
            pending_users_list = PendingUsersList.shared_list()
            logging.info('switching admin_approval_required to {0}'.format(not pending_users_list.admin_approval_required))
            pending_users_list.set_admin_approval_required(not pending_users_list.admin_approval_required)
        logging.info("self.request.get('email_verification_required') == {0}".format(self.request.get('email_verification_required')))
        if self.request.get('email_verification_required') is not None and self.request.get('email_verification_required') != '':
            pending_users_list = PendingUsersList.shared_list()
            logging.info('switching email_verification_required to {0}'.format(not pending_users_list.email_verification_required))
            pending_users_list.set_email_verification_required(not pending_users_list.email_verification_required)

    def _approve_user(self, email, awaiting_approval):
        """ Add user to approved users list and remove it from the waiting approval list if necessary """
        pending_users_list = PendingUsersList.shared_list()
        success = pending_users_list.approve_user(email, awaiting_approval)
        return success
        
    def _revoke_user(self, email):
        """ Remove user from approved users list """
        pending_users_list = PendingUsersList.shared_list()
        pending_users_list.remove_user_from_approved_list(email)
        pending_users_list.add_user_to_approval_waitlist(email)
        return True

    def _revoke_preapproved_user(self, email):
        """ Remove pre-approved user from approved users list """
        pending_users_list = PendingUsersList.shared_list()
        pending_users_list.remove_user_from_approved_list(email)
        return True

    def _delete_user(self, email):
        """ Delete existing user """
        user = User.get_by_auth_id(email)
        if user:
            if user.is_admin_user():
                return False
            # Delete from db
            user.key.delete()
            
            pending_users_list = PendingUsersList.shared_list()
            if(pending_users_list.is_user_approved(email)):
                pending_users_list.remove_user_from_approved_list(email)
            pending_users_list.remove_user_from_approval_waitlist(email)

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
