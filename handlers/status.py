try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__

from stochssapp import BaseHandler
from stochss.model import *


class StatusPage(BaseHandler):
    
    def get(self):
        all_reactions = self.get_all_reactions()
        if all_reactions is not None:
            self.render_response('status/statuspage.html', **all_reactions)            
        else:
            self.render_response('status/statuspage.html')

    def post(self):
        if self.request.get('update') == "1":
            result = self.update_reaction()
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
            
        elif self.request.get('delete') == "1":
            result = self.delete_reaction(self.request.get('toDelete'))
            all_reactions = self.get_all_reactions()
            if all_reactions is not None:
                result = dict(result, **all_reactions)
                
            self.render_response('status/statuspage.html', **result)            
                
        else:
            result = self.create_reaction()
            all_reactions = self.get_all_reactions()
            if all_reactions is not None:
                result = dict(result, **all_reactions)

            self.render_response('status/statuspage.html', **result)

    def get_all_reactions(self):
        """
        Get all the reactants belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_session_property('model_edited')
        if model is None:
            return None
