import logging
import secrets

from google.appengine.ext import ndb
from google.appengine.ext import db

from stochssapp import BaseHandler
from stochssapp import User

#from simpleauth import SimpleAuthHandler

from admin import PendingUsersList

class SecretKey(db.Model):
    '''
    '''
    key_string = db.StringProperty()
    
    def isEqualTo(self, other_key):
        '''
        '''
        return self.key_string == other_key.key_string
    
    def isEqualToAdminKey(self):
        '''
        '''
        admin_key = db.GqlQuery("SELECT * FROM SecretKey").get()
        if admin_key is None:
            return False
        else:
            return self.isEqualTo(admin_key)

class SecretKeyHandler(BaseHandler):
    '''
    Handles the endpoint for secret key creation.
    '''
    def authentication_required(self):
        return False
    
    def post(self):
        '''
        A POST to /secret_key means a new secret key should be generated from the string in the request body.
        '''
        # Dont allow requests from outside connections
        if self.request.headers['Host'].find('localhost') == -1:
            return
        # We should only have one secret key in the DB
        all_keys = db.GqlQuery("SELECT * FROM SecretKey").get()
        if all_keys is not None:
            try:
                list(all_keys)
                for key in all_keys:
                    db.delete(key)
            except:
                db.delete(all_keys)
        SecretKey(key_string=self.request.get('key_string')).put()
        self.response.out.write('Successful secret key creation!')

class LoginPage(BaseHandler):
    """
    """
    def authentication_required(self):
        return False
    
    def get(self):
        """ Corresponds to /login """
        if self.request.headers['Host'].find('localhost') == -1:
            # Need to log in
            try:
                secret_key = self.request.GET['secret_key']
            except KeyError:
                secret_key = None
            if secret_key is not None:
                secret_key_attempt = SecretKey(key_string=secret_key)
                if secret_key_attempt.isEqualToAdminKey():
                    # Fake the log in...
                    auth_id = 'default:remote'
                    _attrs = {
                        'name': 'Remote Access',
                        'email_address': 'do-not-use@stochss.remote'
                    }
                    user = self.auth.store.user_model.get_by_auth_id(auth_id)
                    if user is None:
                        ok, user = self.auth.store.user_model.create_user(auth_id, **_attrs)

                    self.auth.set_session(self.auth.store.user_to_dict(user))
                    return self.redirect('/')
                else:
                    # Unauthorized secret key query string param, just ignore it completely...
                    pass
            self.render_response('login.html')
        else:
            # This is one way to allow local access with no login, but it doesnt cover every case
            # Also, it means there is a separate account for local access that can only see its own models
            # # Fake the log in...
            # auth_id = 'default:local'
            # _attrs = {
            #     'name': 'Local Access',
            #     'email_address': 'do-not-use@stochss.local'
            # }
            # user = self.auth.store.user_model.get_by_auth_id(auth_id)
            # if user is None:
            #     ok, user = self.auth.store.user_model.create_user(auth_id, **_attrs)
            # 
            # self.auth.set_session(self.auth.store.user_to_dict(user))
            # self.redirect('/')
            self.render_response('login.html')

class LogoutPage(BaseHandler):
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

class ProfilePage(BaseHandler):
    """
    """
    def authentication_required(self):
        return True
        
    def get(self):
        """ Corresponds to /profile """
        self.render_response('profile.html')

# class AuthHandler(BaseHandler, SimpleAuthHandler):
#     """ Auth handler for OAuth 2.0, 1.0(a) and OpenID """
#     def authentication_required(self):
#         return False
# 
#     # Enable optional OAuth 2.0 CSRF guard
#     OAUTH2_CSRF_STATE = True
# 
#     # Mappings of user attributes by provider
#     # key == name of attribute as specified by provider
#     # value == standardized name for reference within stochss
#     USER_ATTRS = {
#         'facebook' : {
#             'id'     : lambda id: ('avatar_url', 
#                 'http://graph.facebook.com/{0}/picture?type=large'.format(id)),
#             'name'   : 'name',
#             'link'   : 'link',
#             'email'  : 'email_address'
#         },
#         'google'   : {
#             'picture': 'avatar_url',
#             'name'   : 'name',
#             'profile': 'link',
#             'email'  : 'email_address'
#         },
#         'linkedin2': {
#             'picture-url'       : 'avatar_url',
#             'formatted-name'    : 'name',
#             'public-profile-url': 'link',
#             'email-address'     : 'email_address'
#         }
#     }
# 
#     def _on_signin(self, data, auth_info, provider):
#         """
#         Callback whenever a new or existing user is signing in
#         
#         Args:
#             data       Dictionary containing the user's info retrieved from the provider
#             auth_info  Dictionary containing the authentication info retrieved from the provider
#             provider   String representing the name of the provider (i.e. google, facebook)
#         """
#         auth_id = '%s:%s' % (provider, data['id'])
#         logging.info('Looking for a user with id %s', auth_id)
# 
#         user = self.auth.store.user_model.get_by_auth_id(auth_id)
#         _attrs = self._to_user_model_attrs(data, self.USER_ATTRS[provider])
#         
#         if self.should_create_admin():
#             logging.info('Creating admin user')
#             _attrs['is_admin'] = 'YES'
#             ok, user = self.auth.store.user_model.create_user(auth_id, **_attrs)
#             if ok:
#                 self.auth.set_session(self.auth.store.user_to_dict(user))
#             return self.redirect('/admin')
#         
#         should_update_user = False
#         if user:
#             logging.info('Found existing user to log in')
#             # Existing users might've changed their profile data so we update our
#             # local model if they have.
#             for property in user._properties:
#                 if property in _attrs and getattr(user, property) != _attrs[property]:
#                     logging.info('Updating existing user credentials')
#                     should_update_user = True
#                     break                    
#         else:
#             user = self.check_if_user_exists(_attrs)
#             
#             if user:
#                 logging.info('Existing user logging in with new provider')
#                 should_update_user = True
#                 user.auth_ids.append(auth_id)
#             else:
#                 pending_user_list = PendingUsersList.shared_list()
#                 if pending_user_list.is_user_approved(_attrs['email_address']):
#                     logging.info('Creating a brand new user') 
#                     ok, user = self.auth.store.user_model.create_user(auth_id, **_attrs)
#                     pending_user_list.remove_user_from_approved_list(_attrs['email_address'])
#                 else:
#                     logging.info('User {0} is not approved'.format(_attrs['email_address']))
#                     pending_user_list.add_user_to_approval_waitlist(_attrs['email_address'])
#                     context = { 'unauthorizedError': True }
#                     return self.render_response('login.html', **context)
#                     #return self.redirect('/login')
# 
#         if should_update_user:
#             user.populate(**_attrs)
#             user.put()
#         self.auth.set_session(self.auth.store.user_to_dict(user))
#             
#         if user.is_admin_user():
#             return self.redirect('/admin')
#         # Else go to the profile page
#         self.redirect('/profile')
# 
#     def logout(self):
#         """ Logs the current user out """
#         # First, check if the recent changes have been saved.
#         is_model_saved = self.get_session_property('is_model_saved')
#         if is_model_saved is not None and not is_model_saved:
#             logging.debug("Model not saved!")
#             result = {'status': False, 'save_msg': 'Please save your changes first!', 'is_saved': False, 'redirect_page': '/signout'}
#             self.render_response('modeleditor.html', **result)
#             return
#         
#         self.session.clear()
#         self.auth.unset_session()
#         self.redirect('/login')
#         
#     def handle_exception(self, exception, debug):
#         logging.error(exception)
#         result = { 'authError': True }
#         self.render_response('login.html', **result)
#         
#     def should_create_admin(self):
#         """
#         Right now, just check to see if this is the first user being created.
#         i.e. the first user to log in is the admin.
#         """
#         users = User.query().fetch(1)
#         if users:
#             return False
#         else:
#             return True
#     
#     def check_if_user_exists(self, user_dict):
#         """
#         Check to see if the user has already logged in with another provider
#         Currently only comparing email address.
#         Returns the user object if it exists, otherwise None.
#         """
#         users = User.query(ndb.GenericProperty('email_address') == user_dict['email_address']).fetch()
#         user = users[0] if users else None
#         return user
#     
#     def _to_user_model_attrs(self, data, attrs_map):
#         """Get needed info from the provider dataset """
#         user_attrs = {}
#         for k, v in attrs_map.iteritems():
#             attr = (v, data.get(k)) if isinstance(v, str) else v(data.get(k))
#             user_attrs.setdefault(*attr)
# 
#         return user_attrs
# 
#     def _callback_uri_for(self, provider):
#         return self.uri_for('auth_callback', provider=provider, _full=True)
# 
#     def _get_consumer_info_for(self, provider):
#         """Returns a tuple (key, secret) for auth init requests."""
#         return secrets.AUTH_CONFIG[provider]
#         
#     def _get_linkedin2_user_info(self, auth_info, **kwargs):
#         """
#         Required override because simple_auth has issues with LinkedIn using OAuth 2.0
#         see: https://github.com/crhym3/simpleauth/issues/21
#         """
#         fields = 'id,picture-url,public-profile-url,formatted-name,email-address'
#         url = 'https://api.linkedin.com/v1/people/~:(%s)?{0}' % fields
#         resp = self._oauth2_request(url, auth_info['access_token'],
#                                     token_param='oauth2_access_token')
#         return self._parse_xml_user_info(resp)
