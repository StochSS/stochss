try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__
import time
import shutil
import os
import subprocess
import tempfile
import datetime

from google.appengine.ext import db

from stochssapp import BaseHandler
from backend.backendservice import backendservices

from simulation import StochKitJobWrapper
from sensitivity import SensitivityJobWrapper

import sensitivity

class CostAnalysisPage(BaseHandler):
    """ The main handler for the Cost Analysis Status Page. Displays cost information about completed jobs."""        
    def authentication_required(self):
        return True
    
    def get(self):
        context = self.getContext()
        self.render_response('cba.html', **context)
        
    def post(self):        
        params = self.request.POST        
        context = self.getContext()
        self.render_response('cba.html', **context)

    def getContext(self):
        """ 
            Get the status of all the cost info for a particular job and assemble a dict
            with info to display on the page. 
        """
        context = {}
        service = backendservices()

        job_id = int(self.request.get('id'))
        job = StochKitJobWrapper.get_by_id(job_id)

        if job is None:
            job = SensitivityJobWrapper.get_by_id(job_id)
            context['filename'] = "output/" + job.cloudDatabaseID + ".tar"
        else:
            context['filename'] = "output/" + job.pid + ".tar"

        bucketname = self.user_data.getBucketName()
        context['job_id'] = job_id
        context['bucketname'] = bucketname
        context['jobname'] = job.jobName
        return context