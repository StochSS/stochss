try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__
import random
import re
import string
from stochssapp import BaseHandler
from backend.backendservice import *

from google.appengine.ext import db

import os
import time
import urllib2
from backend.backendservice import backendservices

def internet_on():
    try:
        response=urllib2.urlopen('http://www.google.com/',timeout=4)
        return True
    except urllib2.URLError as err: pass
    return False

class UpdatesPage(BaseHandler):
    """ Set paths for local plugin software. """
    def get(self):
        """ """
        env_variables = self.user_data.env_variables
        if env_variables == None:
            context = {}
        else:
            context = json.loads(env_variables)
        
        logging.info(context)

        # Check if there is an internet connection available
        if internet_on():
          # Check if updates available. Assume a divergent branch can be updated. This is actually false, but we'll go with it. We need to change this so the user can make local changes...
          h = subprocess.Popen('git remote update'.split(), stdout = subprocess.PIPE, stderr = subprocess.PIPE)
          stdout, stderr = h.communicate()

          h = subprocess.Popen('git status -uno'.split(), stdout = subprocess.PIPE, stderr = subprocess.PIPE)
          stdout, stderr = h.communicate()

          update_available = re.search('behind', stdout)
          
          if update_available:
            service = backendservices()

            all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())

            # Check to make sure no jobs are running
            context['nojobs'] = True
            if all_stochkit_jobs != None:
              for job in all_stochkit_jobs.run():
                stochkit_job = job.stochkit_job  
                if not stochkit_job.status == "Finished":
                  res = service.checkTaskStatusLocal([stochkit_job.pid])
                  if res[stochkit_job.pid]:
                    context['nojobs'] = False

            context['update'] = True
          else:
            context['update'] = False

          context['nointernet'] = False
        else:
          context['nointernet'] = True

        self.render_response("updates.html",**context)
    
    def post(self):
        """ """

        #To trigger the update, a file named 'update' must be written in the root StochSS folder - so we do it!
        file = open('update', 'w')
        file.write(' ')
        file.close()

        params = self.request.POST
        
        if self.user_data.env_variables == None:
            env_variables = {}
        else:
            env_variables = json.loads(self.user_data.env_variables)
                
        for key in params:
            env_variables[key] = params[key]
                
        self.user_data.env_variables = json.dumps(env_variables)
        self.user_data.put()

        env_variables['updating'] = True

        self.render_response("updates.html", **env_variables)

class InvalidUserException(Exception):
    pass

