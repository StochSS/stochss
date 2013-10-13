import logging
import secrets

from google.appengine.ext import ndb

from webapp2_extras.appengine.auth.models import User

from stochssapp import BaseHandler

from simpleauth import SimpleAuthHandler

class LoginPage(BaseHandler):
    """
    """
    def authentication_required(self):
        return False
    
    def get(self):
        """ Corresponds to /login """
        if self.logged_in():
            self.redirect('/')
        else:
            self.render_response('login.html')

class ProfilePage(BaseHandler):
    """
    """
    def authentication_required(self):
        return True
        
    def get(self):
        """ Corresponds to /profile """
        self.render_response('profile.html')

class AuthHandler(BaseHandler, SimpleAuthHandler):
    """ Auth handler for OAuth 2.0, 1.0(a) and OpenID """
    def authentication_required(self):
        return False

    # Enable optional OAuth 2.0 CSRF guard
    OAUTH2_CSRF_STATE = True

    # Mappings of user attributes by provider
    # key == name of attribute as specified by provider
    # value == standardized name for reference within stochss
    USER_ATTRS = {
        'facebook' : {
            'id'     : lambda id: ('avatar_url', 
                'http://graph.facebook.com/{0}/picture?type=large'.format(id)),
            'name'   : 'name',
            'link'   : 'link',
            'email'  : 'email_address'
        },
        'google'   : {
            'picture': 'avatar_url',
            'name'   : 'name',
            'profile': 'link',
            'email'  : 'email_address'
        },
        'linkedin2': {
            'picture-url'       : 'avatar_url',
            'formatted-name'    : 'name',
            'public-profile-url': 'link',
            'email-address'     : 'email_address'
        }
    }

    def _on_signin(self, data, auth_info, provider):
        """
        Callback whenever a new or existing user is signing in
        
        Args:
            data       Dictionary containing the user's info retrieved from the provider
            auth_info  Dictionary containing the authentication info retrieved from the provider
            provider   String representing the name of the provider (i.e. google, facebook)
        """
        auth_id = '%s:%s' % (provider, data['id'])
        logging.info('Looking for a user with id %s', auth_id)

        user = self.auth.store.user_model.get_by_auth_id(auth_id)
        _attrs = self._to_user_model_attrs(data, self.USER_ATTRS[provider])

        if user:
            logging.info('Found existing user to log in')
            # Existing users might've changed their profile data so we update our
            # local model if they have.
            for property in user._properties:
                if property in _attrs and getattr(user, property) != _attrs[property]:
                    logging.info('Updating existing user credentials')
                    user.populate(**_attrs)
                    user.put()
                    break
            self.auth.set_session(self.auth.store.user_to_dict(user))

        else:   
            # Check to see if this person logged in with another provider
            # using the same email address.
            users = User.query(ndb.GenericProperty('email_address') == _attrs['email_address']).fetch()
            user = users[0] if users else None
            if user:
                logging.info('Existing user logging in with new provider')

                user.populate(**_attrs)
                user.auth_ids.append(auth_id)
                user.put()
                
                self.auth.set_session(self.auth.store.user_to_dict(user))
            # Else assume its a brand new user.
            else:
                logging.info('Creating a brand new user')
                
                ok, user = self.auth.store.user_model.create_user(auth_id, **_attrs)
                if ok:
                    self.auth.set_session(self.auth.store.user_to_dict(user))

        # Go to the profile page
        self.redirect('/profile')

    def logout(self):
        """ Logs the current user out """
        # First, check if the recent changes have been saved.
        is_model_saved = self.get_session_property('is_model_saved')
        if is_model_saved is not None and not is_model_saved:
            logging.debug("Model not saved!")
            result = {'status': False, 'save_msg': 'Please save your changes first!', 'is_saved': False, 'redirect_page': '/signout'}
            self.render_response('modeleditor.html', **result)
            return
        
        self.session.clear()
        self.auth.unset_session()
        self.redirect('/login')

    def _callback_uri_for(self, provider):
        return self.uri_for('auth_callback', provider=provider, _full=True)

    def _get_consumer_info_for(self, provider):
        """Returns a tuple (key, secret) for auth init requests."""
        return secrets.AUTH_CONFIG[provider]
        
    def _get_linkedin2_user_info(self, auth_info, **kwargs):
        """
        Required override because simple_auth has issues with LinkedIn using OAuth 2.0
        see: https://github.com/crhym3/simpleauth/issues/21
        """
        fields = 'id,picture-url,public-profile-url,formatted-name,email-address'
        url = 'https://api.linkedin.com/v1/people/~:(%s)?{0}' % fields
        resp = self._oauth2_request(url, auth_info['access_token'],
                                    token_param='oauth2_access_token')
        return self._parse_xml_user_info(resp)

    def _to_user_model_attrs(self, data, attrs_map):
        """Get needed info from the provider dataset """
        user_attrs = {}
        for k, v in attrs_map.iteritems():
            attr = (v, data.get(k)) if isinstance(v, str) else v(data.get(k))
            user_attrs.setdefault(*attr)

        return user_attrs