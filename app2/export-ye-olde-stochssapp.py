import os
import pickle
import webapp2, jinja2
from google.appengine.ext import db
try:
  import json
except ImportError:
  from django.utils import simplejson as json

# Initialize the jinja environment
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))) 

# Import all of the StochSS Models
from handlers.modeleditor import *
from handlers.exportimport import *

path = os.path.abspath(os.path.dirname(__file__))

class MainPage(webapp2.RequestHandler):
    '''
    '''
    def get(self):
        #Get all data
        context = {
            "all_models": db.GqlQuery("SELECT * FROM StochKitModelWrapper").fetch(1000)
        }
        template = jinja_environment.get_template("main_page.html")
        return self.response.out.write(template.render({'active_upload': True}, **context))
    
    def post(self):
        request_data = json.loads(self.request.POST.items()[0][0])
        logging.info(request_data)
        context = {}
        selected_models = request_data['modelsToExport']
        # Create a zip archive
        if len(selected_models) > 0:
            szip = SuperZip(os.path.abspath(os.path.dirname(__file__)) + '/../app2/static/tmp/')
            for model in selected_models:
                model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE model_name = :1", model).get()
                szip.addStochKitModel(model)
            szip.close()
            context["status"] = True
            context["zipLocation"] = os.path.relpath(szip.getFileName(), path)
        else:
            context["status"] = False
            context["msg"] = "There were no selected models."
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(context))


app = webapp2.WSGIApplication([('/', MainPage)], debug=True)
logging.getLogger().setLevel(logging.DEBUG)
