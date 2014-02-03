import jinja2
import os
import cgi
import datetime
import urllib,urllib2
import socket
import webapp2
import logging

try:
    import json
except ImportError:
    from django.utils import simplejson as json

from webapp2_extras import auth
from webapp2_extras import sessions
from webapp2_extras import sessions_memcache
from webapp2_extras import security
from webapp2 import Route

from webapp2_extras.appengine.auth.models import User as WebApp2User

from google.appengine.ext import ndb
from google.appengine.ext import db

#from google.appengine.tools import dev_appserver

from backend.backendservice import *

import mimetypes

""" Initializer section """
# Initialize the jinja environment
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))) 

class DictionaryProperty(db.Property):
    """  A db property to store objects. """
    
    def get_value_for_datastore(self, dict_prty):
        result = super(DictionaryProperty, self).get_value_for_datastore(dict_prty)
        result = pickle.dumps(dict_prty)
        return db.Blob(result)
    
    def make_value_from_datastore(self, value):
        if value is None:
            return None
        return pickle.loads(value)
    
    def empty(self, value):
        return value is None


class UserData(db.Model):
    """ A Model to stor user specific data, such as the AWS credentials. """

    # user ID
    user_id = db.StringProperty()
    
    # The Amazon credentials
    ec2_access_key = db.StringProperty()
    ec2_secret_key = db.StringProperty()
    valid_credentials = db.BooleanProperty()
    
    # The user's S3 bucket name used to store simulation results in S3
    S3_bucket_name = db.StringProperty()
    
    # Is the amazon db table initalizes
    is_amazon_db_table = db.BooleanProperty()
    
    env_variables = db.StringProperty()

    
    def setCredentials(self, credentials):
        self.ec2_access_key  = credentials['EC2_ACCESS_KEY']
        self.ec2_secret_key  = credentials['EC2_SECRET_KEY']
    
    def getCredentials(self):
        return {'EC2_SECRET_KEY':self.ec2_secret_key,'EC2_ACCESS_KEY': self.ec2_access_key}

    def setBucketName(self,bucket_name):
        self.S3_bucket_name = str(bucket_name)

    def getBucketName(self):
        return self.S3_bucket_name

    def isTable(self):
        return self.is_amazon_db_table

class BaseHandler(webapp2.RequestHandler):
    """
    The base handler that extends the dispatch() method to start the session store and save all sessions at the end of a request:
    It also has helper methods for storing and retrieving objects from session and for rendering the response to the clients.
    All the request handlers should extend this class.
    """
    def __init__(self, request, response):

        self.auth = auth.get_auth()
        # If not logged in, the dispatch() call will redirect to /login if needed
        if self.logged_in():
            # Make sure a handler has a reference to the current user
            user_dict = self.auth.get_user_by_session()
            self.user = self.auth.store.user_model.get_by_id(user_dict['user_id'])

            # Most pages will need the UserData, so for convenience we add it here.
            self.user_data = db.GqlQuery("SELECT * FROM UserData WHERE user_id = :1", self.user.user_id()).get()

            # If the user_data does not exist in the datastore, we instantiate it here
            if self.user_data == None:
            
                user_data = UserData()
                user_data.user_id = self.user.user_id()
            
                # Get optional app-instance configurations and add those to user_data
                credentials = {'EC2_SECRET_KEY':"",'EC2_ACCESS_KEY':""}
                try:
                    env_variables = app.config.get('env_variables')
                    user_data.env_variables = json.dumps(env_variables)
                    if 'AWS_ACCESS_KEY' in env_variables:
                        credentials['EC2_ACCESS_KEY']=env_variables['AWS_ACCESS_KEY']
                    if 'AWS_SECRET_KEY' in env_variables:
                        credentials['EC2_SECRET_KEY']=env_variables['AWS_SECRET_KEY']
                except:
                    raise
        
                user_data.setCredentials(credentials)
            
                # Check if the credentials are valid
                service = backendservices()
                params ={}
                params['credentials'] =credentials
                params["infrastructure"] = "ec2"
                if service.validateCredentials(params):
                    user_data.valid_credentials = True
                else:
                    user_data.valid_credentials = False

                # Create an unique bucket name for the user
                import uuid
                user_data.setBucketName('stochss-output-'+str(uuid.uuid4()))
            
                user_data.put()
                self.user_data = user_data
            
        webapp2.RequestHandler.__init__(self, request, response)
        
    def dispatch(self):
        # Authentication check
        if self.authentication_required() and not self.logged_in():
            return self.redirect('/login')
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        # Using memcache for storing sessions.
        self.session = self.session_store.get_session(name='mc_session', factory=sessions_memcache.MemcacheSessionFactory)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)
            # Flush the datastore to persist the data. This is inefficient, but
            # makes it less likely to loose all data is the app has to force quit.
            #dev_appserver.TearDownStubs()
            
    def authentication_required(self):
        print type(self).__name__
        raise Exception("Subclass must implement me!")
        
    def logged_in(self):
        return self.auth.get_user_by_session() is not None
			
    def get_session_property(self, key):
        """ Get the value for the given session property. """
        
        try:
            return self.session[key]            
        except KeyError:
            return None
    
    def set_session_property(self, key, value):
        """ Set the value for the given session property. """
        
        self.session[key] = value
            
    def render_response(self, _template, **context):
        """ Process the template and render response. """
        if self.logged_in():
            ctx = {'user': self.user}
        else:
            ctx = {}

        ctx.update(context)

        if 'model_edited' not in ctx:
            model_edited = self.get_session_property('model_edited')
            if model_edited is not None:
                ctx.update({'model_edited': model_edited})

        if 'is_model_saved' not in ctx:
            is_model_saved = self.get_session_property('is_model_saved')
            print is_model_saved
            if is_model_saved is not None:
                ctx.update({'is_model_saved': is_model_saved})
            
        template = jinja_environment.get_template(_template)
        self.response.out.write(template.render({'active_upload': True}, **ctx))

class MainPage(BaseHandler):
    """ The Main page. Renders a welcome message and shortcuts to main menu items. """
    def authentication_required(self):
        return True
        
    def get(self):
        self.render_response("mainpage.html")
    
    def post(self):
        self.get()

class User(WebApp2User):
    """
    Subclass of the WebApp2 User class to add functionality.
    The WebApp2User class is an expando model (see https://developers.google.com/appengine/docs/python/datastore/expandoclass),
    so the User class inherits that functionality.
    """
    @classmethod
    def admin_exists(cls):
        '''
        Returns True if an admin user already exists in the DB, else False.
        '''
        admin = User.query().filter(ndb.GenericProperty('is_admin')=='YES').get()
        return admin is not None
    
    def user_id(self):
        return self.email_address
    
    def change_auth_id(self, auth_id):
           '''
           A helper method to change a user's auth id.

           :param auth_id:
               String representing a unique id for the user (i.e. email address).
           :returns
               A boolean that indicates if the auth_id is unique.
           '''
           unique = '%s.auth_id:%s' % (self.__class__.__name__, auth_id)
           ok = self.unique_model.create(unique)
           if ok:
               self.auth_ids = [auth_id]
               # Need to delete the old auth_id from the 'unique' model store
               # see https://code.google.com/p/webapp-improved/source/browse/webapp2_extras/appengine/auth/models.py
               unique_auth_id = "%s.auth_id:{0}".format(self.__class__.__name__, self.email_address)
               User.unique_model.delete_multi([unique_auth_id])
               return True
           else:
               return False
    
    def set_password(self, raw_password):
        '''
        Sets password for current user, stored as a hashed value.
        '''
        self.password = security.generate_password_hash(raw_password, length=12)
    
    def is_admin_user(self):
        """
        Determine if this user is an admin by checking for the is_admin property
        - this is an expando model and is_admin property is added dynamically only for admins
        """
        if "is_admin" in self._properties and self.is_admin == 'YES':
            return True
        return False
        
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}
config['webapp2_extras.auth'] = {
    'user_model': User,
    'user_attributes': []
}

# Try to add application configurations from the optional configuration file created upon
# launch of the app
try:
    import conf.app_config
    env_variables = {'env_variables':conf.app_config.app_config}
    config = dict(config,**env_variables)
except:
    pass

from handlers.specieseditor import *
from handlers.modeleditor import *
from handlers.parametereditor import *
from handlers.volumeeditor import *
from handlers.reactioneditor import *
from handlers.simulation import *
from handlers.credentials import *
from handlers.converttopopulation import *
from handlers.updates import *
from handlers.status import *
from handlers.auth import *
from handlers.admin import *

# Handler to serve static files
class StaticFileHandler(BaseHandler):
    """ Serve a file dynamically. """
    
    def authentication_required(self):
        return True
        
    def get(self):
        
        try:
            filename = self.request.get('filename')
            filecontent = open(filename).read()
            # Try to guess the mimetype before writing the response
            type,encoding = mimetypes.guess_type(filename)
            if type == None:
                type="text/html"
        
            self.response.headers.add_header("Content-Type",type)
            self.response.write(filecontent)
        except:
            self.response.write("Could not find the requested file on the server")

# Handlers for SimpleAuth authentication
# Map URLs to handlers
if 'lib' not in sys.path:
    sys.path[0:0] = ['lib']


app = webapp2.WSGIApplication([
                               ('/', MainPage),
                               ('/models/list.*', ModelBackboneInterface),
                               ('/stochkit/list.*', JobBackboneInterface),
                               ('/convert', ModelConvertPage),
                               ('/modeleditor/specieseditor', SpeciesEditorPage),
                               ('/modeleditor/reactioneditor', ReactionEditorPage),
                               ('/modeleditor/parametereditor', ParameterEditorPage),
                               ('/modeleditor/volumeeditor', VolumeEditorPage),
                               ('/modeleditor/converttopopulation', ConvertToPopulationPage),
                               ('/modeleditor/import/fromfile', ModelEditorImportFromFilePage),
                               ('/modeleditor/import/examplelibrary', ModelEditorImportFromLibrary),
                               ('/modeleditor/export/tostochkit2', ModelEditorExportToStochkit2),
                               ('/modeleditor.*', ModelEditorPage),
                               ('/simulate',SimulatePage),
                               ('/simulate/newstochkitensemble',NewStochkitEnsemblePage),
                               ('/status',StatusPage),
                               ('/output/visualize',VisualizePage),
                               ('/output',JobOutPutPage),
                               ('/output/[a-zA-Z0-9-_]*.tgz',JobOutPutPage),
                               ('/output/servestatic',StaticFileHandler),
                               ('/credentials',CredentialsPage),
                               ('/localsettings',LocalSettingsPage),
                               ('/updates',UpdatesPage),
                               ('/secret_key', SecretKeyHandler),
                               ('/register', UserRegistrationPage),
                               ('/login', LoginPage),
                               ('/logout', LogoutHandler),
                               ('/admin', AdminPage),
                               ('/account_settings', AccountSettingsPage),
                               ],
                                config=config,
                                debug=True)


logging.getLogger().setLevel(logging.DEBUG)

if __name__ == '__main__':
    sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
    print sys.path
    import boto
        
    main()
