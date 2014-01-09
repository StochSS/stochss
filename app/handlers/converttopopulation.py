try:
    import json
except ImportError:
    from django.utils import simplejson as json

import traceback
from collections import OrderedDict

from stochssapp import *
from stochss.model import *

class ConvertToPopulationPage(BaseHandler):        
    def get(self):
        model_edited = self.get_session_property('model_edited')        

        self.render_response('modeleditor/convert_modeleditor.html', modelName = model_edited.name)
