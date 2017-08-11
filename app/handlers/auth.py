import logging
import socket
from google.appengine.ext import ndb
from google.appengine.ext import db
import os
from webapp2_extras.auth import InvalidAuthIdError, InvalidPasswordError
from webapp2_extras import security
import webapp2_extras.appengine.auth.models
from stochssapp import BaseHandler
from stochssapp import User
import datetime
import uuid

import smtplib
from email.mime.text import MIMEText
from db_models.email_config import EmailConfig
from admin import PendingUsersList


class SingleMultiUserMode(db.Model):
    ''' Single or multi-user mode for StochSS '''
    
    single_user_mode = db.BooleanProperty()

    @classmethod
    def is_single_user_mode(cls):
        ''' Is StochSS in single user mode?'''
        mode = db.GqlQuery("SELECT * FROM " + cls.__name__).get()
        if mode is None:
            mode = cls()
            mode.single_user_mode = True
            mode.put()
        return mode.single_user_mode

    @classmethod
    def set_single_user_mode(cls):
        ''' Set StochSS to be a single user'''
        mode = db.GqlQuery("SELECT * FROM " + cls.__name__).get()
        if mode is None:
            mode = cls()
        mode.single_user_mode = True
        mode.put()

    @classmethod
    def set_multi_user_mode(cls):
        ''' Set StochSS to be a single user'''
        mode = db.GqlQuery("SELECT * FROM " + cls.__name__).get()
        if mode is None:
            mode = cls()
        mode.single_user_mode = False
        mode.put()


class SecretKey(db.Model):
    '''
    '''
    key_string = db.StringProperty()
    



    @classmethod
    def clear_stored_key(cls):
        ''' Deletes the secret token(s) currently stored in the DB. '''
        all_keys = cls.all()
        if all_keys is not None:
            for key in all_keys:
                db.delete(key)
    
    def isEqualTo(self, other_key):
        '''
        '''
        return self.key_string == other_key.key_string
    
    def isEqualToAdminKey(self):
        '''
        '''
        #admin_key = db.GqlQuery("SELECT * FROM SecretKey").get()
        try:
            basename = os.path.dirname(os.path.abspath(__file__))
            with open(os.path.join(basename,"admin_uuid.txt"),'r') as file:
                admin_key = file.read()
        except:
            admin_key = None

        if admin_key is None:
            return False
        else:
            return self.key_string == admin_key

class UserRegistrationPage(BaseHandler):
    '''
    '''
    def authentication_required(self):
        return False
    
    def get(self):
        ''' Corresponds to /register '''
        context = {}
        try:
            secret_key = self.request.GET['secret_key']
        except KeyError:
            secret_key = None
        
        if secret_key is None:
            # Normal user registration
            context['create_admin'] = False
        else:
            # Attempt to create an admin user
            # We will just assume the secret key is fine because it was checked by the login page
            # But it will be checked again before the admin is actually created in the POST
            context['create_admin'] = True
            context['secret_key'] = secret_key
        
        self.render_response('user_registration.html', **context)
    
    def post(self):
        '''
        This is where user registration takes place, both for regular users as well as admins.
        An admin registers by presenting a secret token in the query string, which will be sent with the
        POST data.
        A user can register only if they have been approved by the admin, i.e. they are in the approved_users
        list (see admin.py).
        '''

        try:
            secret_key = self.request.POST['secret_key']
        except KeyError:
            secret_key = None
        
        if secret_key is None:
            # Normal user registration
            logging.info('Registering a normal user...')
            user_email = self.request.POST['email']

            # Just an email address here, we should first make sure they have not been approved
            pending_users_list = PendingUsersList.shared_list()

            # If the user does not exist, we create it.
            if not bool(User.get_by_auth_id(user_email)):
                _attrs = {
                    'email_address': user_email,
                    'name': self.request.POST['name'],
                    'password_raw': self.request.POST['password'],
                    'verified': False
                }
                success, user = self.auth.store.user_model.create_user(user_email, **_attrs)

                if success:
                    # check if user is preapproved
                    if pending_users_list.is_user_approved(user_email):
                        success = True
                        approved = True
                        # Has the user been preapproved? If so, we just verify it.
                        user.verified = True
                        user.put()
                    else:
                        success = pending_users_list.add_user_to_approval_waitlist(user_email)
                        approved = False
                
                if success:
                    if approved or (not pending_users_list.email_verification_required and not pending_users_list.admin_approval_required):
                        context = {
                            'success_alert': True,
                            'alert_message': 'Account creation successful! Your account is approved and you can log in immediately.'
                        }
                    elif pending_users_list.email_verification_required:
                        # Create a signup token for the user and send a verification email
                        token = str(uuid.uuid4())
                        user.signup_token = token
                        user.signup_token_time_created=None
                        user.put()
                        EmailConfig.send_verification_email(user_email, token)
                        context = {
                            'success_alert': True,
                            'alert_message': 'Account creation successful! You will recieve a verification email, please follow the instructions to activate your account.'
                        }
                    elif pending_users_list.admin_approval_required:
                        context = {
                            'success_alert': True,
                            'alert_message': 'Account creation successful! Once an admin has approved your account, you can login.'
                        }

                    return self.render_response('login.html', **context)

                logging.info("Account registration failed for: {0}".format(user))
                context = {
                    'email_address': self.request.POST['email'],
                    'name': self.request.POST['name'],
                    'user_registration_failed': True
                }
                return self.render_response('user_registration.html', **context)
            else:
                context = {
                    'error_alert': True,
                    'alert_message': 'You have already requested an account.'
                }
                return self.render_response('login.html', **context)
        else:
            # Attempt to create an admin user
            logging.info('Registering an admin user...')
            # Check the secret key again
            secret_key_attempt = SecretKey(key_string=secret_key)
            if secret_key_attempt.isEqualToAdminKey():
                # Then we can attempt to create an admin
                if User.admin_exists():
                    logging.info("Admin already exists...")
                    # Redirect to login, only one admin allowed
                    return self.redirect('/login?secret_key={0}'.format(secret_key))
                else:
                    # CREATE THE ADMIN ALREADY
                    _attrs = {
                        'email_address': self.request.POST['email'],
                        'name': self.request.POST['name'],
                        'password_raw': self.request.POST['password'],
                        'is_admin': 'YES',
                        'verified': True
                    }
                    success, user = self.auth.store.user_model.create_user(_attrs['email_address'], **_attrs)
                    
                    if success:
                        # Invalidate the token
                        SecretKey.clear_stored_key()
                        if 'user_mode' in self.request.POST:
                            if self.request.POST['user_mode'] == 'single':
                                logging.info("UserRegistrationPage: user_mode set to single")
                                SingleMultiUserMode.set_single_user_mode()
                            elif self.request.POST['user_mode'] == 'multi':
                                logging.info("UserRegistrationPage: user_mode set to multi")
                                SingleMultiUserMode.set_multi_user_mode()
                            else:
                                logging.info("UserRegistrationPage: unknown user_mode {0}".format(self.request.POST['user_mode']))
                        else:
                            logging.info("UserRegistrationPage: user_mode not set")
                        return self.redirect('/login?secret_key={0}'.format(secret_key))
                    else:
                        context = {
                            'email_address': self.request.POST['email'],
                            'name': self.request.POST['name'],
                            'user_registration_failed': True
                        }
                        return self.render_response('user_registration.html', **context)
            
            else:
                # Unauthorized secret key
                context = {
                    'error_alert': True,
                    'alert_message': 'Invalid secret token.'
                }
                return self.render_response('login.html', **context)

class VerificationHandler(BaseHandler):
    """ Handles email verification requests. """
    def authentication_required(self):
        return False
    
    def get(self):
        """ Corresponds to /verify """
        user_email = self.request.GET['user_email']
        token = self.request.GET['signup_token']
        user = self.auth.store.user_model.get_by_auth_id(user_email)
   
        if user:
            # Verify the token
            user_token = user.signup_token
            
            if user_token == token:
                user.verified = True
                user.signup_token = None
                user.put()
                context = {
                    'success_alert': True,
                    'alert_message': 'Account verficiation successful. You can now log in.'
                }
            else:
                context = {
                    'error_alert': True,
                    'alert_message': 'Account verficiation failed. Please contact the administrator for assistance.'
                }
        else:
            context = {
                'error_alert': True,
                'alert_message': 'Account verficiation failed. No such user.'
                }
        
        return self.render_response('login.html', **context)

class PasswordResetRequestHandler(BaseHandler):
    """ Handles password reset requests. """
    def authentication_required(self):
        return False
    
    def get(self):
        context = {}
        self.render_response('passwordresetrequest.html', **context)
    
    def post(self):
        
        """ Corresponds to /passwordresetrequest """
        user_email = self.request.POST['email']
        user = self.auth.store.user_model.get_by_auth_id(user_email)
        
        if user:
            # Create a token
            token = str(uuid.uuid4())
            user.signup_token = token
            user.signup_token_time_created=None
            user.put()
            status=EmailConfig.send_password_reset_email(user_email, token)
            if status:
                context = {
                    'success_alert': True,
                    'alert_message': 'Password reset link has been sent, please follow the instructions to reset your password'
            }
    
        return self.render_response('passwordresetrequest.html', **context)

class PasswordResetHandler(BaseHandler):
    """ Reset user password """
    def authentication_required(self):
        return False
    
    def get(self):
        """ Corresponds to /passwordreset """
        user_email = self.request.GET['user_email']
        token = self.request.GET['token']
        user = self.auth.store.user_model.get_by_auth_id(user_email)
  
        if user:
            # Verify the token
            user_token = user.signup_token
            
            if user_token == token:
                user.signup_token = None
                user.put()
                context = {'user_email':user_email}
                self.render_response('passwordreset.html',**context)
                
            else:
                context = {
                    'error_alert': True,
                    'alert_message': 'Password reset token not validated. Please contact the administrator for assistance.'
                }                    
                self.render_response('passwordreset.html', **context)
   
        else:
            context = {
                'error_alert': True,
                'alert_message': 'Password reset failed. No such user.'
            }
            self.render_response('passwordreset.html', **context)
               

    def post(self):
        '''
            Corresponds to an attempt to change the password.
            
        '''
        context = {}
        should_update_user = False
        try:
            new_password = self.request.POST["password"]
            password_confirmation =  self.request.POST["password_confirmation"]
            user_email = self.request.POST['user_email']
        except KeyError:
            new_password = None
            password_confirmation = None   
        
        if new_password not in [None, ''] and new_password == password_confirmation:
            user = self.auth.store.user_model.get_by_auth_id(user_email)
            user.set_password(new_password)
            should_update_user = True
       
        else:
            # Incorrect
            context['error_alert'] = 'Password and confirmation must match: {0}'.format(self.request.POST)
            context["user_email"] = user_email
            context["password"]=password
            context["password_confirmation"] = password_confirmation
            return self.render_response('passwordreset.html', **context)
        
        # Was anything updated?
        if should_update_user:
            user.put()
            context['success_alert'] = True 
            context['alert_message']='Successfully updated password!'
            self.render_response('login.html',**context)
        else:
            context['error_alert'] = "Failed to reset password"
            self.render_response("passwordreset.html",**context)




class LoginPage(BaseHandler):
    """
    """
    def authentication_required(self):
        return False
    
    def get(self):
        """ Corresponds to /login """
        # Make sure user isn't logged in already
        if self.logged_in():
            return self.redirect("/")
        # Need to log in

        try:
            secret_key = self.request.GET['secret_key']
        except KeyError:
            secret_key = None
        
        if secret_key is not None:
            secret_key_attempt = SecretKey(key_string=secret_key)
            if secret_key_attempt.isEqualToAdminKey() and not User.admin_exists():
                return self.redirect('/register?secret_key={0}'.format(secret_key))
            elif secret_key_attempt.isEqualToAdminKey() and  User.admin_exists() and SingleMultiUserMode.is_single_user_mode():
                # Single user mode, login user and forward to / page
                user_subobj = self.auth.store.user_model.get_by_auth_id(User.get_admin_user_id())
                user = self.auth.store.user_to_dict(user_subobj)
                self.auth.set_session(user)
                return self.redirect('/')

        # Normal user login
        if SingleMultiUserMode.is_single_user_mode() or not User.admin_exists():
            self.render_response('login_disabled.html')
        else:
            self.render_response('login.html')
    
    def post(self):
        '''
        Login attempt or request for account
        '''
        email_address = self.request.POST['email']
        try:
            request_account = self.request.POST['request_account']
        except KeyError:
            request_account = False
            
        # Login attempt, need to grab password too
        password = self.request.POST['password']
        try:
            user = self.auth.get_user_by_password(email_address, password, remember=True)
            # Success, put user in the session and redirect to home page

            # Has this user been approved? Or is the user the admin? Login either way
            pending_users_list = PendingUsersList.shared_list()

            userdb = User.get_by_id(user["user_id"])

            if hasattr(userdb, 'is_admin'):
                isAdmin = userdb.is_admin
            else:
                isAdmin = False

            if not isAdmin and pending_users_list.email_verification_required and not userdb.is_verified():
                context = {
                    'error_alert': True,
                    'alert_message': 'You need to verify your account before you can login.'
                    }
                return self.render_response('login.html', **context)

            if not isAdmin and pending_users_list.admin_approval_required and not pending_users_list.is_user_approved(email_address):
                # Not approved, add to approval waitlist
                pending_users_list.add_user_to_approval_waitlist(email_address)
                context = {
                    'error_alert': True,
                    'alert_message': 'You need to be approved by the admin before you can login.'
                    }
                return self.render_response('login.html', **context)

            # All Clear
            self.auth.set_session(user)
            return self.redirect('/')

        except (InvalidAuthIdError, InvalidPasswordError) as e:
            logging.info('Login failed for user: {0} with exception: {1}'.format(email_address, e))
            context = {
                'error_alert': True,
                'alert_message': 'The email or password you entered is incorrect.'
                }
            return self.render_response('login.html', **context)

class LogoutHandler(BaseHandler):
    '''
    '''
    def authentication_required(self):
        return True
    
    def get(self):
        is_model_saved = self.get_session_property('is_model_saved')
        if is_model_saved is not None and not is_model_saved:
            logging.debug("Model not saved!")
            result = {'status': False, 'save_msg': 'Please save your changes first!', 'is_saved': False, 'redirect_page': '/logout'}
            self.render_response('modeleditor.html', **result)
            return

        self.session.clear()
        self.auth.unset_session()
        self.redirect('/login')

class AccountSettingsPage(BaseHandler):
    """
    """
    def authentication_required(self):
        return True
        
    def get(self):
        """ Corresponds to /account_settings """
        context = {
            'name': self.user.name,
            'email_address': self.user.email_address
        }
        self.render_response('account_settings.html', **context)
    
    def post(self):
        '''
        Corresponds to a possible attempt to change some account settings.
        Possible fields to change:
        - name
        - email_address
        - password
        '''
        should_update_user = False
        new_name = self.request.POST['name']
        # new_email = self.request.POST['email']
        if self.user.name != new_name:
            self.user.name = new_name
            should_update_user = True
        context = {
            'name': self.user.name,
            'email_address': self.user.email_address
        }
        try:
            new_password = self.request.POST["password"]
            current_password = self.request.POST["current_password"]
        except KeyError:
            new_password = None
        
        if new_password not in [None, '']:
            # Check that correct current password was entered
            if security.check_password_hash(current_password, self.user.password):
                # Correct
                self.user.set_password(new_password)
                should_update_user = True
            else:
                # Incorrect
                context['error_alert'] = 'Incorrect password.'
                return self.render_response('account_settings.html', **context)
        # Was anything updated?
        if should_update_user:
            self.user.put()
            context['success_alert'] = 'Successfully updated account settings!'
        else:
            context['error_alert'] = "You didn't request any changes."
        return self.render_response('account_settings.html', **context)

