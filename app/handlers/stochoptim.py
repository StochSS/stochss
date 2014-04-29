try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__

import re

from stochssapp import *
from stochss.model import *

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)
    
class StochOptimPage(BaseHandler):
            
    def authentication_required(self):
        return True
    
    def get(self):
      self.render_response('stochoptim.html')            
