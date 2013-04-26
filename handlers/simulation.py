import jinja2
import os
import cgi
import datetime
import urllib
import webapp2
import tempfile

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

class StochKitEnsembleWrapper(db.Model):
    """
        A wrapper for the StochKitEnsemble object
    """
    user_id = db.StringProperty()
    name = db.StringProperty()
    ensemble = ObjectProperty()
    file_name = db.StringProperty()


class SimulatePage(BaseHandler):
    """ Render a page that lists the available models. """
    
    def get(self):
        # all_models = self.get_session_property('all_models')
        all_models = None
        if all_models==None:
            # Query the datastore
            all_models_q = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", self.user.user_id())
            all_models=[]
            for q in all_models_q.run():
                all_models.append(q)
        
           
        template = jinja_environment.get_template('simulate.html')
        self.response.out.write(template.render({'active_view': True,'all_models': all_models}))

    def post(self):

        model = self.request.get("model_to_simulate")
        self.set_session_property('model_to_simulate',model)
        self.redirect('/simulate/newstochkitensemble')


def parseNewStochKitEnsblePage(params):
    """ Helper function to parse the form """
    

class NewStochkitEnsemblePage(BaseHandler):
    """ Page with a form to configure a well mixed stochastic (StochKit2) simulation job.  """
    
    def get(self):
        template = jinja_environment.get_template('simulate/newstochkitensemblepage.html')
        self.response.out.write(template.render({'active_upload': True}))

    def post(self):
        """ Assemble the input to StochKit2 and submit the job (locally or via cloud). """
        
        # Params is a dict that constains all response elements of the form
        params = self.request.POST
        
        # Check if the form was posted by pressing the 'Run Local' or 'Run Cloud' button.
        # Note, I think that we need some refactoring here in the future,
        # this is not a pretty solution....
        
        if 'run_local' in params:
            result=self.runLocal()
        elif 'run_cloud' in params:
            result=self.runCloud()
        else:
            result={'status':False,'msg':'There was an error processing your request.'}

        self.render_response('simulate/newstochkitensemblepage.html',**result)

    def parseForm(self):
        """ Parse the form, assemble the arguments to StochKit and check for errors. """
        # TODO: Refactor: Move the parsing code form 'runLocal' so it can be reused for 'runCloud'.
        # TODO: Check for errors....

    def runCloud(self):
        result = {'status':True,'msg': 'Calling the cloud execution function'}
        return result

    def runLocal(self):
        try:
            # Get the model that is currently in scope for simulation via the seesion property 'model_to_simulate'
            model_to_simulate=self.get_session_property('model_to_simulate')
            model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(),model_to_simulate).get()
            model = model.model
            
            # The data from the form
            params = self.request.POST
            
            # We write all StochKit input and output files to a temporary folder in the root folder of the app
            prefix_outdir = os.path.join(os.path.dirname(__file__), '../.stochkit_output')
            
            # If the base output directory does not exsit, we create it
            import subprocess
            #command = 'mkdir anand1{0}'.format(prefix_outdir)
            command ="ls -l"
            #os.system(command)
            test = subprocess.Popen(command.split())
            #process = os.popen('mkdir ' + prefix_outdir);
            #process.close()
            
            # Write a temporary StochKit2 input file.
            outfile =  "stochkit_temp_input.xml"
            mfhandle = open(outfile,'w')
            #document = StochMLDocument.fromModel(model)
            document = model.serialize()
            mfhandle.write(document)
            mfhandle.close()
            
            # Parse the required arguments
            # TODO: Error Checking needed here! But preferably also using AJAX calls similar to what Gautham
            #       implemented for the Model editor.
            
            
            # If the temporary folder we need to create to hold the output data already exists, we error
            #        process = os.popen('ls '+prefix_outdir)
            #        directories = process.read();
            #        process.close()
            
            # TODO: Replace this simple test with something better.
            #        if ensemblename in directories:
            #            self.response.out.write("The ensemble name already exists. You need to input a unique name.")
            #            return
            
            
            ensemblename = params['output']
            time = params['time']
            realizations = params['realizations']
            increment = params['increment']
            seed = params['seed']
            # Algorithm, SSA or Tau-leaping?
            executable = params['algorithm']
            
            outdir = prefix_outdir+'/'+ensemblename

            
            # Assemble the argument list
            args = ''
            args+='--model '
            args+=outfile
            args+=' --out-dir '+outdir
            args+=' -t '
            args+=str(time)
            #num_output_points = str(int(float(time)/float(increment)))
            num_output_points = 0
            args+=' -i ' + str(num_output_points)
            args+=' --realizations '
            args+=str(realizations)
            
            # We keep all the trajectories by default. The user can select to only store means and variance
            # throught the advanced options.
            if not "only-moments" in params:
                args+=' --keep-trajectories'
            
            if "label-columns" in params:
                args+=' --label'
            
            if "keep-histograms" in params:
                args+=' --keep-histograms'
            
            # TODO: We need a robust way to pick a default seed for the ensemble. It needs to be robust in a ditributed, parallel env.
            args+=' --seed '
            args+=str(seed)
            
            # If we are using local mode, shell out and run StochKit (SSA or Tau-leaping)
            cmd = executable+' '+args
            # AH: Can't test for failed execution here, popen does not return stderr.
            process = os.popen(cmd)
            stochkit_output_message = process.read()
            process.close()
            
            result = {'status':True,'msg':stochkit_output_message}
        
        except Exception,e:
            result = {'status':False,'msg':'Local execution failed: '+str(e)}
                
        return result

class JobSettingsPage(webapp2.RequestHandler):
    
    """ Configure simulation settings for jobs """
    
    def get(self):
        
        template = jinja_environment.get_template('simulate/jobsettings.html')
        self.response.out.write(template.render({'active_view': True}))

class SubmitPage(webapp2.RequestHandler):
    
    """ Submit and terminate jobs. """
    
    def get(self):
        
        template = jinja_environment.get_template('simulate/submit.html')
        self.response.out.write(template.render({'active_view': True}))
