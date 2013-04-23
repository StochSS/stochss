try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__

from stochssapp import BaseHandler
from stochss.backendservice import *

class StatusPage(BaseHandler):
    
    def get(self):
        all_urls = self.get_all_urls()
        if all_urls is not None:
            self.render_response('statuspage.html', **all_urls)            
        else:
            self.render_response('statuspage.html')

    def post(self):
        if self.request.get('update') == "1":
            result = self.update_url()
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
            
        elif self.request.get('delete') == "1":
            result = self.delete_url(self.request.get('toDelete'))
            all_urls = self.get_all_urls()
            if all_urls is not None:
                result = dict(result, **all_urls)
                
            self.render_response('statuspage.html', **result)            
                
        else:
            result = self.create_reaction()
            all_reactions = self.get_all_reactions()
            if all_reactions is not None:
                result = dict(result, **all_reactions)

            self.render_response('statuspage.html', **result)

    def get_all_urls(self):
        """
        Get all the reactants belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_session_property('model_edited')
        if model is None:
            return None
        else
        	result = backendservice.describeTask(valid_username)
		self.render_response('statuspage.html', **result)

	def delete_tasks(self):
		"""
		Delete the selected tasks
		"""
        name = self.request.get('toDelete') 

       try:
            user = self.get_session_property('valid_username')
            backendservice.deleteTask()

            # Update the cache
            self.set_session_property('valid_username', user)
            return {'status': True, 'msg': 'Job ' + name + ' deleted successfully!'}
        except Exception, e:
            logging.error("Task::delete_Task: Task deletion failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while deleting the Task.'}       




