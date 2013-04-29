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
from backend.backendservice import backendservices

#from backend import backendservice

try:
    import json
except ImportError:
    from django.utils import simplejson as json

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))


class StochKitJobWrapper(db.Model):
    # A reference to the user that owns this job
    user_id =  db.StringProperty()
    stochkit_job = ObjectProperty()

class StochKitJob():
    """ Model for a StochKit job. Contains all the parameters associated with the call. """
    
    def __init__(self,name=None, final_time=None, increment=None, realizations=1,algorithm='ssa',store_only_mean=False, label_column_names=False,create_histogram_data=False, seed=None, epsilon=0.1,threshold=10, output_url = None):
        """ fdsgfhsj """
        
        # Input parameters
        self.name = name
        self.final_time = final_time
        self.increment = increment
        self.realizations = realizations
        self.algorithm = algorithm
        
        self.store_only_mean = store_only_mean
        self.label_column_names = label_column_names
        self.create_histogram_data = create_histogram_data
        
        # TODO: Fix this.
        if seed == None:
            self.seed = 6546358634
        
        self.epsilon = epsilon
        self.threshold = threshold
                
        # Status of the Job (Running, Pending, Done)
        status = 'Pending'
        #  Process ID (only valid for local execution???)
        pid = None
                
        # URL to the result (valid after a sucessful execution)
        output_url = output_url
    
    
    def setpid(self,pid):
        """ Set the PID of the job after execcution """
        self.pid = pid
    
    def getArgumentString(self):
        """ Assemble the argument list for a StochKit2 execution. """
        
        

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
    
        context = {'all_models': all_models}
        self.render_response('simulate.html',**context)

    def post(self):
        
        model = self.request.get("model_to_simulate")
        if model == None or model == "":
            self.redirect('/simulate')
        else:
            self.set_session_property('model_to_simulate',model)
            self.redirect('/simulate/newstochkitensemble')


class NewStochkitEnsemblePage(BaseHandler):
    """ Page with a form to configure a well mixed stochastic (StochKit2) simulation job.  """
    
    def get(self):
        model_to_simulate=self.get_session_property('model_to_simulate')
        context = {'model_to_simulate':model_to_simulate}
        self.render_response('simulate/newstochkitensemblepage.html',**context)

    def post(self):
        """ Assemble the input to StochKit2 and submit the job (locally or via cloud). """
        

        # Params is a dict that constains all response elements of the form
        params = self.request.POST
    
        # Create a stochhkit_job instance
        
        if 'run_local' in params:
            result=self.runStochKitLocal()
        elif 'run_cloud' in params:
            result=self.runCloud()
        else:
            result={'status':False,'msg':'There was an error processing your request.'}

        context = {'model_to_simulate':self.get_session_property('model_to_simulate')}
        self.render_response('simulate/newstochkitensemblepage.html',**dict(context,**result))

    def parseForm(self):
        """ Parse the form, assemble the arguments to StochKit and check for errors. """
        # TODO: Refactor: Move the parsing code form 'runLocal' so it can be reused for 'runCloud'.
        # TODO: Check for errors....

    def runCloud(self):
        result = {'status':True,'msg': 'Calling the cloud execution function'}
        return result

    def runStochKitLocal(self):
        """ Submit a local StochKit job """
        try:
            #the parameter dictionary to be passed to the backend
            param ={}
            # Get the model that is currently in scope for simulation via the seesion property 'model_to_simulate'
            model_to_simulate=self.get_session_property('model_to_simulate')
            model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(),model_to_simulate).get()
            model = model.model
            # The data from the form
            params = self.request.POST
            
            # We write all StochKit input and output files to a temporary folder in the root folder of the app
            prefix_outdir = os.path.join(os.path.dirname(__file__), '../.stochkit_output')
            
            # Write a temporary StochKit2 input file.
            outfile =  params['output']+".xml"
            mfhandle = open(outfile,'w')
            document = StochMLDocument.fromModel(model)
            document = model.serialize()
            mfhandle.write(document)
            mfhandle.close()
            filepath  = os.path.abspath(outfile)
            params['file'] = filepath
            print filepath
            
            ensemblename = params['output']
            time = params['time']
            realizations = params['realizations']
            increment = params['increment']
            seed = params['seed']
            
            # Algorithm, SSA or Tau-leaping?
            executable = params['algorithm']
        

            # Assemble the argument list
            args = ''
            args+='--model '
            args+=filepath
            #args+=' --out-dir '+outdir
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
        
        
            cmd = executable+' '+args
        
            # Create a StochKitJob instance
            stochkit_job = StochKitJob(name=ensemblename, final_time=time, realizations=realizations,increment=increment,seed=seed,algorithm=executable)
        
            # Create the argument string
            args = stochkit_job.getArgumentString()
            print cmd
            params['paramstring'] = cmd
            # Run StochKit
            service = backendservices()
            
            res = service.executeTaskLocal(params)
            print str(res)
            
            if(res == None):
                result = {'status':False,'msg':'Local execution failed. '}
                return result
            stochkit_job.pid = res['pid']
                
            #cmd = executable+' '+args
            #cmd = stochkit_job.getAlgorithm() + ' ' +args
            #process = os.popen(cmd)
            #stochkit_output_message = process.read()
            #process.close()
            # Create a StochKitJob instance
            
            # Create a wrapper to store the Job description in the datastore
            stochkit_job_db = StochKitJobWrapper()
            stochkit_job_db.user_id = self.user.user_id()
            stochkit_job_db.stochkit_job = stochkit_job
            stochkit_job_db.put()
                
            result = {'status':True,'msg':'Job submitted sucessfully'}
            

            #result = {'status':True,'msg':stochkit_output_message}
        
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
