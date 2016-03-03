import jinja2
import os
import cgi
import datetime
import urllib, urllib2
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

# from google.appengine.tools import dev_appserver

from backend.backendservice import backendservices  #from backend.backendservice import *
from backend.common.config import AgentTypes, JobConfig, JobDatabaseConfig

import mimetypes

from db_models.user_data import UserData

""" Initializer section """
# Initialize the jinja environment
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(
                                       jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates'))))


from db_models.object_property import ObjectProperty

#?class DictionaryProperty(db.Property):
#?    """  A db property to store objects. """
#?
#?    def get_value_for_datastore(self, dict_prty):
#?        result = super(DictionaryProperty, self).get_value_for_datastore(dict_prty)
#?        result = pickle.dumps(dict_prty)
#?        return db.Blob(result)
#?
#?    def make_value_from_datastore(self, value):
#?        if value is None:
#?            return None
#?        return pickle.loads(value)
#?
#?    def empty(self, value):
#?        return value is None






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
                credentials = {'EC2_SECRET_KEY': "",
                               'EC2_ACCESS_KEY': ""}
                try:
                    env_variables = app.config.get('env_variables')
                    user_data.env_variables = json.dumps(env_variables)
                    if 'AWS_ACCESS_KEY' in env_variables:
                        credentials['EC2_ACCESS_KEY'] = env_variables['AWS_ACCESS_KEY']
                    if 'AWS_SECRET_KEY' in env_variables:
                        credentials['EC2_SECRET_KEY'] = env_variables['AWS_SECRET_KEY']
                except:
                    raise

                user_data.setCredentials(credentials)

                # Check if the credentials are valid
                service = backendservices(user_data)
                params = {}
                params['credentials'] = credentials
                params["infrastructure"] = "ec2"
                if service.validateCredentials(params):
                    user_data.valid_credentials = True
                else:
                    user_data.valid_credentials = False

                # Create an unique bucket name for the user
                import uuid

                user_data.setBucketName('stochss-output-' + str(uuid.uuid4()))

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
        self.session = self.session_store.get_session(name='mc_session',
                                                      factory=sessions_memcache.MemcacheSessionFactory)

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
        return True
        #print type(self).__name__
        #raise Exception("Subclass must implement me!")

    def logged_in(self):
        user_dict = self.auth.get_user_by_session()

        if user_dict == None:
            return None

        self.user = self.auth.store.user_model.get_by_id(user_dict['user_id'])

        if self.user == None:
            return None

        return user_dict

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
        admin = User.query().filter(ndb.GenericProperty('is_admin') == 'YES').get()
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
        unique = '{0}.auth_id:{1}'.format(self.__class__.__name__, auth_id)
        ok = self.unique_model.create(unique)
        if ok:
            # Need to delete the old auth_id from the 'unique' model store
            # see https://code.google.com/p/webapp-improved/source/browse/webapp2_extras/appengine/auth/models.py
            unique_auth_id = "{0}.auth_id:{1}".format(self.__class__.__name__, self.auth_ids[0])
            User.unique_model.delete_multi([unique_auth_id])
            self.auth_ids = [auth_id]
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

    env_variables = {'env_variables': conf.app_config.app_config}
    config = dict(config, **env_variables)
except:
    pass

from handlers.exportimport import *
import handlers.modeleditor
import handlers.stochoptim
import handlers.mesheditor
import handlers.volume
from handlers.simulation import *
from handlers.sensitivity import *
from handlers.credentials import *
from handlers.cost_analysis import *
from handlers.converttopopulation import *
from handlers.updates import *
from handlers.status import *
from handlers.datareproduction import *
from handlers.auth import *
from handlers.admin import *
import handlers.fileserver
import handlers.spatial
from backend import pricing


class MainPage(BaseHandler):
    """ The Main page. Renders a welcome message and shortcuts to main menu items. """
    def authentication_required(self):
        return True
    
    def get_titles(self,news,num_news):
    	stochss_news = ""
    	for j in range(0,num_news+1):
    		i = news.find('<title>')
    		news = news[i+7:-1]
    		i = news.find('</title>')
    		title = news[0:i]
    		news = news[i+8:-1]
    		i = news.find('<link>')
    		news = news[i+6:-1]
    		i = news.find('</link>')
    		link = news[0:i]
    		news = news[i+7:-1]
    		if(j>0):
				stochss_news = stochss_news+'<a href="'+link+'">'+title+'</a><br>'
				
    		news = news[i+8:-1]
    		
    	return stochss_news
    
    def get(self):
    	stochss_news = urllib2.urlopen("http://www.stochss.org/wordpress/?cat=7&feed=rss2").read().decode('utf-8')
    	
    	stochss_news = "<h3>Latest News:</h3><p>"+self.get_titles(stochss_news,2)+"</p><hr>"
    	
    	template_values = {'stochss_news':stochss_news}
        self.render_response("mainpage.html",**template_values)
    
    def post(self):
        self.get()

class InitializeDb(BaseHandler):
    def authentication_required(self):
        return True
        
    def get(self):
        try:
            handlers.mesheditor.setupMeshes(self)
            handlers.modeleditor.importExamplePublicModels(self)
            
            self.response.content_type = 'application/json'
            self.response.write(json.dumps({ "status" : True, "msg" : "Model editor initialized" }))
        except Exception as e:
            traceback.print_exc()
            self.response.content_type = 'application/json'
            self.response.write(json.dumps({ "status" : False, "msg" : "Model editor initialization failed" }))

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
            type, encoding = mimetypes.guess_type(filename)
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
                               ('/InitializeDb', InitializeDb),
                               ('/models.*', handlers.modeleditor.ModelBackboneInterface),
                               ('/publicModels.*', handlers.modeleditor.PublicModelBackboneInterface),
                               ('/importFromSBML.*', handlers.modeleditor.ImportFromSBMLPage),
                               ('/importFromXML.*', handlers.modeleditor.ImportFromXMLPage),
                               ('/SBMLErrorLogs.*', handlers.modeleditor.SBMLErrorLogsPage),
                               ('/meshes.*', handlers.mesheditor.MeshBackboneInterface),
                               ('/models/list.*', handlers.modeleditor.ModelBackboneInterface),
                               ('/stochkit/list.*', JobBackboneInterface),
                               #('/modeleditor/converttopopulation', ConvertToPopulationPage),
                               #('/modeleditor/import/fromfile', ModelEditorImportFromFilePage),
                               #('/modeleditor/import/publiclibrary', ModelEditorImportFromLibrary),
                               #('/modeleditor/export/tostochkit2', ModelEditorExportToStochkit2),
                               ('/modeleditor.*', handlers.modeleditor.ModelEditorPage),
                               ('/publicLibrary.*', handlers.modeleditor.PublicModelPage),
                               ('/simulate',SimulatePage),
                               ('/sensitivity',SensitivityPage),
                               ('/spatial',handlers.spatial.SpatialPage),
                               ('/volume',handlers.volume.VolumePage),
                               ('/stochoptim', handlers.stochoptim.StochOptimPage),
                               webapp2.Route('/stochoptim/<jobID>', handler = handlers.stochoptim.StochOptimVisualization),#/<queryType>
                               webapp2.Route('/stochoptim/<queryType>/<jobID>', handler = handlers.stochoptim.StochOptimVisualization),
                               ## Fileserver handlers
                               # This route is for listing all files
                               webapp2.Route('/FileServer/backbone/<key>', handler = handlers.fileserver.BackboneFileServerInterface, name = 'backbonefs'),
                               # This route is for interacting with single files
                               webapp2.Route('/FileServer/backbone/<key>/<fileID>', handler = handlers.fileserver.BackboneFileServerInterface, name = 'backbonefs'),
                               # This route is for downloading the full file
                               webapp2.Route('/FileServer/large/<key>/<fileID>/<filename>', handler = handlers.fileserver.LargeFileServerInterface, name = 'fs'),
                               # This route is for file uploads
                               webapp2.Route('/FileServer/large/<key>', handler = handlers.fileserver.LargeFileServerInterface, name = 'fs'),
                               # This route is for downloading only a few bytes
                               webapp2.Route('/FileServer/large/<key>/<fileID>/<numberBytes>/<filename>', handler = handlers.fileserver.LargeFileServerInterface, name = 'fs'),
                               ('/export', ExportPage),
                               ('/import', ImportPage),
                               ('/status',StatusPage),
                               ('/reproduce',DataReproductionPage),
                               ('/output/servestatic',StaticFileHandler),
                               ('/credentials', CredentialsPage),
                               ('/ec2Credentials', EC2CredentialsPage),
                               ('/flexCloudCredentials', FlexCredentialsPage),
                               ('/cost_analysis',CostAnalysisPage),
                               ('/localsettings',LocalSettingsPage),
                               ('/updates',UpdatesPage),
                               ('/register', UserRegistrationPage),
                               ('/login', LoginPage),
                               ('/logout', LogoutHandler),
                               ('/admin', AdminPage),
                               ('/account_settings', AccountSettingsPage),
                               ],
                                config=config,
                                debug=True)

