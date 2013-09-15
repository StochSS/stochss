import jinja2
import os
import cgi
import datetime
import urllib
import webapp2
import tempfile,sys
from google.appengine.ext import db
import pickle
import threading
import traceback
import logging
from google.appengine.api import users

from stochss.model import *
from stochss.stochkit import *

from stochssapp import BaseHandler
from stochssapp import StochKitModelWrapper
from stochssapp import ObjectProperty

from backend.backendservice import backendservices

import os, shutil
import random

try:
    import json
except ImportError:
    from django.utils import simplejson as json

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=(jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates'))))


class JobWrapper(db.Model):
    """ A wrapper around the Job object """
    # user_id =  db.StringProperty()
    # job_id = db.StringProperty()
    # job_type = db.StringProperty()
    # job = ObjectProperty()

class Job():
    """ Representation of a Job in StochSS. A Job consists of a collection of Tasks. """

    def __init__(self):
        # tasks is a dict where the task_id is key and a task object is the value. 
        self.tasks = {}

class Task():
    """ Representation of a Task in StochSS """

    def __init__(self,task_id = None):
        self.task_id = task_id


class StochKitJobWrapper(db.Model):
    # A reference to the user that owns this job
    user_id =  db.StringProperty()
    name = db.StringProperty()
    # The type if the job {'local', 'cloud'}
    type =  db.StringProperty()
    stochkit_job = ObjectProperty()

    stdout = db.StringProperty()
    stderr = db.StringProperty()

class StochKitJob(Job):
    """ Model for a StochKit job. Contains all the parameters associated with the call. """
    
    def __init__(self,name=None, final_time=None, increment=None, realizations=1,algorithm='ssa',store_only_mean=False, label_column_names=True,create_histogram_data=False, seed=None, epsilon=0.1,threshold=10, output_url = None):
        """ fdsgfhsj """
        
        # Type of the job {'Local','Cloud'}
        self.type = None
        
        # The status of the job. Valid statuses are 'Running', 'Finished', 'Failed'
        self.status = None
        
        # URL to the result (valid after a sucessful execution)
        self.output_location = ""
        self.output_url = output_url
        
        # Input parameters
        self.name = name
        self.final_time = final_time
        self.increment = increment
        self.realizations = realizations
        self.algorithm = algorithm
        
        self.store_only_mean = store_only_mean
        self.label_column_names = label_column_names
        self.create_histogram_data = create_histogram_data
        
        if seed == None:
            self.seed = int(uuid.uuid())
        
        self.epsilon = epsilon
        self.threshold = threshold
         
    
        # Status of the Job (Running, Pending, Done)
        status = 'Pending'
        #  Process ID
        self.pid = None
    
        # The result dict returned by the cloud submission
        self.result = None
    
        

class SimulatePage(BaseHandler):
    """ Render a page that lists the available models. """
    
    def get(self):

        # Query the datastore
        all_models_q = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1", self.user.user_id())
        all_models=[]
        for q in all_models_q.run():
            all_models.append(q)
    
        context = {'all_models': all_models}
        self.render_response('simulate.html',**context)

    def post(self):
        
        model = self.request.get('model_to_simulate')
        if model == None or model == "":
            self.redirect('/simulate')
        else:
            self.set_session_property('model_to_simulate',model)
            self.redirect('/simulate/newstochkitensemble')


class NewStochkitEnsemblePage(BaseHandler):
    """ Page with a form to configure a well mixed stochastic (StochKit2) simulation job.  """
    
    def get(self):
        model_to_simulate=self.get_session_property('model_to_simulate')

        # If model_to_simulate has not been set using the simulation manager main page,
        # we attempt to set it to the currently edited model
        if model_to_simulate is None:
            model_edited = self.get_session_property('model_edited')
            if model_edited is not None and model_edited is not "":
                model_to_simulate = model_edited.name
                self.set_session_property('model_to_simulate',model_to_simulate)

        model_units = ''

        # Make sure that the model is present in the datastore
        #    Figure out what kind of model it is too (concentration or populatio)
        if model_to_simulate is not None:
            model_db = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(), model_to_simulate).get()

            model_units = model_db.model.units
            model_volume_exists = bool(model_db.model.volume)
            print 'volume ' + repr(bool(model_db.model.volume))

            if model_db == None:
                self.set_session_property('model_to_simulate', None)
                model_to_simulate = None
    
        # If we have not managed to identify a model to simulate, we redirect to
        # a page where the user can select a model
        if model_to_simulate is None:
            self.redirect("/simulate")

        context = { 'model_to_simulate':model_to_simulate, 'model_units' : model_units, 'model_volume_exists' : model_volume_exists }
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

    def runCloud(self):
        
        try:
            # Get the model that is currently in scope for simulation via the session property 'model_to_simulate'
            try:
                model_to_simulate=self.get_session_property('model_to_simulate')
                db_model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(),model_to_simulate).get()
                model = db_model.model
            except:
                return {'status':False,'msg':'Failed to retrive the model to simulate.'}
            
            # Check the data from the form for errors
            params,result = self.parseForm()
            if not result['status']:
                return result
        
            db_credentials = self.user_data.getCredentials()
            # Set the environmental variables 
            os.environ["AWS_ACCESS_KEY_ID"] = db_credentials['EC2_ACCESS_KEY']
            os.environ["AWS_SECRET_ACCESS_KEY"] = db_credentials['EC2_SECRET_KEY']

            if os.environ["AWS_ACCESS_KEY_ID"] == '':
                result = {'status':False,'msg':'Access Key not set. Check : Settings > Cloud Computing'}
                return result

            if os.environ["AWS_SECRET_ACCESS_KEY"] == '':
                result = {'status':False,'msg':'Secret Key not set. Check : Settings > Cloud Computing'}
                return result
        
            #the parameter dictionary to be passed to the backend
            param = {}

            # Execute as concentration or population?
            exec_type = params['exec_type']

            if not (exec_type == 'concentration' or exec_type == "population"):
                result = {
                     'status' : False, 'msg' : 'exec_type must be concentration or population. Try refreshing page, or e-mail developers'
                      }
                return result


            if exec_type.lower() != model.units.lower():
                if exec_type.lower() == 'concentration' and model.units.lower() == 'population':
                    if model.volume != None:
                        model = model.toConcentration()
                    else:
                        result = { 'status' : False, 'msg' : '\'Volume\' must be defined to execute a population-based model by concentration. Do this with the \'Volume\' tab in the Model Editor' }
                        return result
                elif exec_type.lower() == 'population' and model.units.lower() == 'concentration':
                    if model.volume != None:
                        model = model.toPopulation()
                    else:
                        result = { 'status' : False, 'msg' : '\'Volume\' must be defined to execute a concentration-based model by population. Do this with the \'Volume\' tab in the Model Editor' }
                        return result

            document = model.serialize()
            params['document']=str(document)
            print 'model serialized'
            filepath = ""
            params['file'] = filepath
            ensemblename = params['job_name']
            time = params['time']
            realizations = params['realizations']
            increment = params['increment']
            seed = params['seed']


            # Assemble the argument list
            args = ''
            args+=' -t '
            args+=str(time)
            num_output_points = str(int(float(time)/float(increment)))
            args+=' -i ' + str(num_output_points)
            path = os.path.dirname(__file__)

            # Algorithm, SSA or Tau-leaping?
            if executable != 'stochkit_ode':
                executable = params['algorithm']

                args+=' --realizations '
                args+=str(realizations)
            
                # We keep all the trajectories by default. The user can select to only store means and variance
                # through the advanced options.
                if not "only-moments" in params:
                    args+=' --keep-trajectories'
            
                if "keep-histograms" in params:
                    args+=' --keep-histograms'
                        
                args+=' --seed '
                args+=str(seed)
            else:
                executable = "{0}/../stochss/ode/stochkit_ode".format(path)
            
            # Columns need to be labeled for visulatization page to work.  
            args += ' --label'
        
            cmd = executable+' '+args
        
            # Create a StochKitJob instance
            stochkit_job = StochKitJob(name=ensemblename, final_time=time, realizations=realizations,increment=increment,seed=seed,algorithm=params['algorithm'])
        
            params['paramstring'] = cmd

            bucketname = self.user_data.getBucketName()
            params['bucketname'] = bucketname         
        
            # Call backendservices and execute StochKit
            service = backendservices()
            res, taskid = service.executeTask(params)
            
            if res == None:
                result = {'status':False,'msg':'Cloud execution failed. '}
                return result
        
            stochkit_job.resource = 'Cloud'
            stochkit_job.type = 'StochKit2 Ensemble'
            
            # The jobs pid is the Celery task id.
            stochkit_job.pid = taskid
            stochkit_job.status = 'Running'
        
            # Create a wrapper to store the Job description in the datastore
            stochkit_job_db = StochKitJobWrapper()
            stochkit_job_db.user_id = self.user.user_id()
            stochkit_job_db.name = stochkit_job.name
            stochkit_job_db.stochkit_job = stochkit_job
            stochkit_job_db.put()
            result = {'status':True,'msg':'Job submitted sucessfully.'}
                
        except Exception,e:
            result = {'status':False,'msg':'Cloud execution failed: '+str(e)}       
        return result
        
    def parseForm(self):
        """ 
            Parses the StochKit2 Ensemble job submission form.
            Returns a tuple of dicts (params, result) where params contain
            the StochKit job parameters and result contains the status and a sucess or error message.
            
        """
        params = {}
        result = {}
        result['status']=True
        result['msg']=''
        
        par = self.request.POST
        
        # Check the name of the simulation, make sure that no simulation with that name exists in the system
        name = par['job_name']
        model = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),name).get()
        if model is not None:
            result['status'] = False
            result['msg'] = 'A job with that name already exists. You need to input a unique name.'
        
        # Make sure that the simulation time is a numeric value greater than 0
        try:
            endtime = float(par['time'])
            assert endtime > 0.0
        except:
            result['status'] = False
            result['msg'] =  result['msg']+'\nThe simulation end time must be a positive number greater than zero'
        
        # Make sure that the increment is a positive number
        try:
            increment = float(par['increment'])
            assert increment > 0.0
        except:
            result['status'] = False
            result['msg'] =  result['msg']+'\nThe output sampling times must be positive numbers greater than zero.'
        
        # Make sure that the number of relalizations is an integer value greater than or equal to 1
        try:
           realizations = int(par['realizations'])
           assert realizations >=1
        except:
            result['status'] = False
            result['msg'] =  result['msg']+'\nThe number of realizations must be positive integer greater than zero.'
                
        # Check the seed, needs to be a numeric value
        try:
            if par['seed']=="":
                # Bootstrap StochKit RNG with a random int
                seed = random.randrange(0,1000000)
                logging.info('SEED: '+str(seed))
                par['seed'] = str(seed)
            else:
                seed = float(par['seed'])
            assert seed >= 0
        except Exception,e:
            result['status'] = False
            result['msg'] =  result['msg']+'\nThe seed must be a positive number.' + str(e)

        # Check epsilon, needs to be a numeric value between 0 and one
        try:
            epsilon = float(par['epsilon'])
            assert epsilon > 0.0 and epsilon < 1.0
        except:
            result['status'] = False
            result['msg'] =  result['msg']+'\n Epsilon must be a number in (0,1)'

        # TODO: Check with Sheng what numbers are valid for the threshold

        return par,result
    
    def runStochKitLocal(self):
        """ Submit a local StochKit job """
        try:
            # Get the model that is currently in scope for simulation via the session property 'model_to_simulate'
            try:
                model_to_simulate=self.get_session_property('model_to_simulate')
                db_model = db.GqlQuery("SELECT * FROM StochKitModelWrapper WHERE user_id = :1 AND model_name = :2", self.user.user_id(),model_to_simulate).get()
                model = db_model.model
            except:
                return {'status':False,'msg':'Failed to retrive the model to simulate.'}
            
            # Check the data from the form for errors
            params,result = self.parseForm()
            if not result['status']:
                return result
        
            #the parameter dictionary to be passed to the backend
            param = {}
            
            # Execute as concentration or population?
            exec_type = params['exec_type']

            if not (exec_type == 'concentration' or exec_type == "population"):
                result = {
                    'status' : False, 'msg' : 'exec_type must be concentration or population. Try refreshing page, or e-mail developers'
                    }
                return result


            if exec_type.lower() != model.units.lower():
                if exec_type.lower() == 'concentration' and model.units.lower() == 'population':
                    if model.volume != None:
                        model = model.toConcentration()
                    else:
                        result = { 'status' : False, 'msg' : '\'Volume\' must be defined to execute a population-based model by concentration. Do this with the \'Volume\' tab in the Model Editor' }
                        return result
                elif exec_type.lower() == 'population' and model.units.lower() == 'concentration':
                    if model.volume != None:
                        model = model.toPopulation()
                    else:
                        result = { 'status' : False, 'msg' : '\'Volume\' must be defined to execute a concentration-based model by population. Do this with the \'Volume\' tab in the Model Editor' }
                        return result

            document = model.serialize()
            params['document']=str(document)
            print 'model serialized'
            filepath = ""
            params['file'] = filepath
            ensemblename = params['job_name']
            executable = params['algorithm']
            time = params['time']
            realizations = params['realizations']
            increment = params['increment']
            seed = params['seed']

            # Assemble the argument list
            args = ''
            args+=' -t '
            args+=str(time)
            num_output_points = str(int(float(time)/float(increment)))
            args+=' -i ' + str(num_output_points)
            path = os.path.dirname(__file__)

            # Algorithm, SSA or Tau-leaping?
            if executable != 'stochkit_ode':
                executable = params['algorithm']

                args+=' --realizations '
                args+=str(realizations)
            
                # We keep all the trajectories by default. The user can select to only store means and variance
                # through the advanced options.
                if not "only-moments" in params:
                    args+=' --keep-trajectories'
            
                if "keep-histograms" in params:
                    args+=' --keep-histograms'
                        
                args+=' --seed '
                args+=str(seed)
            else:
                executable = "{0}/../stochss/ode/stochkit_ode".format(path)
            
            # Columns need to be labeled for visulatization page to work.  
            args += ' --label'
        
            cmd = executable+' '+args
        
            # Create a StochKitJob instance
            stochkit_job = StochKitJob(name=ensemblename, final_time=time, realizations=realizations,increment=increment,seed=seed,algorithm=params['algorithm'])
        
            # Create the argument string
            params['paramstring'] = cmd
                    
            # Call backendservices and execute StochKit
            service = backendservices()
            res = service.executeTaskLocal(params)
            
            if(res == None):
                result = {'status':False,'msg':'Local execution failed. '}
                return result
        
            stochkit_job.resource = 'Local'
            stochkit_job.type = 'StochKit2 Ensemble'
                    
            stochkit_job.pid = res['pid']
            stochkit_job.output_location = res['output']
            stochkit_job.uuid = res['uuid']
            stochkit_job.status = 'Running'
            stochkit_job.stdout = res['stdout']
            stochkit_job.stderr = res['stderr']
            
            # Create a wrapper to store the Job description in the datastore
            stochkit_job_db = StochKitJobWrapper()
            stochkit_job_db.user_id = self.user.user_id()
            stochkit_job_db.name = stochkit_job.name
            stochkit_job_db.stochkit_job = stochkit_job
            stochkit_job_db.stdout = stochkit_job.stdout
            stochkit_job_db.stderr = stochkit_job.stderr
            stochkit_job_db.put()
    
            result = {'status':True,'msg':'Job submitted sucessfully'}
            
        except Exception,e:
            result = {'status':False,'msg':'Local execution failed: '+str(e)}
                
        return result

