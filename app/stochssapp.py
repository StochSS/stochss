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

from webapp2_extras import sessions
from webapp2_extras import sessions_memcache
from webapp2 import Route

from webapp2_extras.appengine.auth.models import User

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
        # Make sure a handler has a reference to the current user
        self.user = users.get_current_user()
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
        ctx = {'user': self.user}
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

class Signout(BaseHandler):
    """ Signout handler that clears the current user's session and redirects to the signout url. """
    def get(self):
        # First, check if the recent changes have been saved.
        is_model_saved = self.get_session_property('is_model_saved')
        if is_model_saved is not None and not is_model_saved:
            logging.debug("Model not saved!")
            result = {'status': False, 'save_msg': 'Please save your changes first!', 'is_saved': False, 'redirect_page': '/signout'}
            self.render_response('modeleditor.html', **result)
            return
        
        self.session.clear()
        self.redirect(users.create_logout_url('/'))

class MainPage(BaseHandler):
    """ The Main page. Renders a welcome message and shortcuts to main menu items. """
    def get(self):
        self.render_response("mainpage.html")
    
    def post(self):
        self.get()

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}
config['webapp2_extras.auth'] = {
#    'user_model': User,
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

from handlers.exportimport import *
from handlers.specieseditor import *
from handlers.modeleditor import *
from handlers.parametereditor import *
from handlers.volumeeditor import *
from handlers.reactioneditor import *
from handlers.simulation import *
from handlers.sensitivity import *
from handlers.credentials import *
from handlers.converttopopulation import *
from handlers.updates import *
from handlers.status import *

# Handler to serve static files
class StaticFileHandler(BaseHandler):
    """ Serve a file dynamically. """
            
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
                               ('/sensitivity',SensitivityPage),
                               ('/export', ExportPage),
                               ('/status',StatusPage),
                               ('/output/visualize',VisualizePage),
                               ('/output',JobOutPutPage),
                               ('/output/[a-zA-Z0-9-_]*.tgz',JobOutPutPage),
                               ('/output/servestatic',StaticFileHandler),
                               ('/credentials',CredentialsPage),
                               ('/localsettings',LocalSettingsPage),
                               ('/updates',UpdatesPage),
                               ('/signout', Signout),
                              ],
                              config=config,
                              debug=True
                             ) 



logging.getLogger().setLevel(logging.DEBUG)

if __name__ == '__main__':
    sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
    print sys.path
    import boto
        
    main()
