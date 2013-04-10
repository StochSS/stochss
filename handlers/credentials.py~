import jinja2
import os
import cgi
import datetime
import urllib
import webapp2
import subprocess
import tempfile
#import numpy as np

from google.appengine.ext import db
import pickle
import traceback
import logging
from google.appengine.api import users

from stochss.model import *
from stochss.stochkit import *
from stochssapp import BaseHandler
from stochssapp import StochKitModelWrapper
from stochssapp import ObjectProperty

try:
    import json
except ImportError:
    from django.utils import simplejson as json

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))


class CredentialsPage(BaseHandler):
    """ Render a page that lists the available models. """
    
 
           
        template = jinja_environment.get_template('simulate.html')
        self.response.out.write(template.render({'active_view': True,'all_models': all_models}))

    def post(self):

        self.redirect('/status/credentials')
