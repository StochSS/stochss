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
import datetime

from google.appengine.ext import db

from stochssapp import BaseHandler
from backend.backendservice import backendservices

class StatusPage(BaseHandler):
    """ The main handler for the Job Status Page. Displays status messages for the jobs, options to delete/kill jobs and
        options to view the Job metadata and Job results. """
    
    def authentication_required(self):
        return True
        
    def get(self):
        context = self.getContext()
        self.render_response('status.html', **context)
        
    def post(self):
        
        params = self.request.POST
        
        if 'delete' in params:

            # The jobs to delete are specified in the checkboxes
            jobs_to_delete = params.getall('select_job')
        
            service = backendservices()

            # Select the jobs to delete from the datastore
            result = {}
            for job_name in jobs_to_delete:
                try:
                    job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.email_address,job_name).get()
                    stochkit_job = job.stochkit_job
                except Exception,e:
                    result = {'status':False,'msg':"Could not retrieve the jobs"+job_name+ " from the datastore."}
        
                # TODO: Call the backend to kill and delete the job and all associated files.
                try:
                    if stochkit_job.resource == 'Local':
                        service.deleteTaskLocal([stochkit_job.pid])
                    else:
                        db_credentials = self.user_data.getCredentials()
                        os.environ["AWS_ACCESS_KEY_ID"] = db_credentials['EC2_ACCESS_KEY']
                        os.environ["AWS_SECRET_ACCESS_KEY"] = db_credentials['EC2_SECRET_KEY']
                        service.deleteTasks([(stochkit_job.celery_pid,stochkit_job.pid)])
                    isdeleted_backend = True
                except Exception,e:
                    isdeleted_backend = False
                    result['status']=False
                    result['msg'] = "Failed to delete task with PID " + str(stochkit_job.celery_pid) + str(e)
                        
                if isdeleted_backend:
                    # Delete all the local files and delete the job from the datastore
                    try:
                        # We remove the local entry of the job output directory
                        if os.path.exists(stochkit_job.output_location):
                            shutil.rmtree(stochkit_job.output_location)
                        db.delete(job)
                    except Exception,e:
                        result = {'status':False,'msg':"Failed to delete job "+job_name+str(e)}
    
            # Render the status page 
            # AH: This is a hack to prevent the page from reloading before the datastore transactions
            # have taken place. I think it is only necessary for the SQLLite backend stub.
            # TODO: We need a better way to check if the entities are gone from the datastore...
            time.sleep(0.5)
            context = self.getContext()
            self.render_response('status.html', **dict(result,**context))
                
        elif 'refresh' in params:
            # Get the context and reload the page
            context = self.getContext()
            self.render_response('status.html', **context)
        else:
            context = self.getContext()
            result = {'status':False,'msg':"There was an error processing the request."}
            self.render_response('status.html', **dict(result,**context))

    

    def getContext(self):
        """ 
            Get the status of all the jobs that exist in the system and assemble a dict
            with info to display on the page. 
        """
        context = {}
        result = {}
        service = backendservices()
        # Grab references to all the user's StochKitJobs in the system
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.email_address)

        if all_stochkit_jobs == None:
            context['no_jobs'] = 'There are no jobs in the system.'
        else:
            # We want to display the name of the job and the status of the Job.
            all_jobs = []
            status = {}

            jobs = all_stochkit_jobs.run()

            jobs = sorted(list(jobs), key = lambda x : (datetime.datetime.strptime(x.startDate, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startDate') else -1), reverse = True)

            for job in jobs:
                # Get the job id
                stochkit_job = job.stochkit_job
                
                # Query the backend for the status of the job, but only if the current status is not Finished
                if not stochkit_job.status == "Finished":
                    try:
                        if stochkit_job.resource == 'Local':
                            # First, check if the job is still running
                            res = service.checkTaskStatusLocal([stochkit_job.pid])
                            if res[stochkit_job.pid]:
                                stochkit_job.status = "Running"
                            else:
                                # Check if the signature file is present, that will always be the case for a sucessful job.
                                # for ssa and tau leaping, this is means.txt
                                # for ode, this is output.txt

                                if stochkit_job.exec_type == 'stochastic':
                                    file_to_check = stochkit_job.output_location+"/result/stats/means.txt"
                                else:
                                    file_to_check = stochkit_job.output_location+"/result/output.txt"
                                
                                if os.path.exists(file_to_check):
                                    stochkit_job.status = "Finished"
                                else:
                                    stochkit_job.status = "Failed"
                
                        elif stochkit_job.resource == 'Cloud':
                            # Retrive credentials from the datastore
                            if not self.user_data.valid_credentials:
                                return {'status':False,'msg':'Could not retrieve the status of job '+stochkit_job.name +'. Invalid credentials.'}
                            credentials = self.user_data.getCredentials()

                            # Check the status on the remote end
                            taskparams = {'AWS_ACCESS_KEY_ID':credentials['EC2_ACCESS_KEY'],'AWS_SECRET_ACCESS_KEY':credentials['EC2_SECRET_KEY'],'taskids':[stochkit_job.pid]}
                            task_status = service.describeTask(taskparams)
                            job_status = task_status[stochkit_job.pid]
                            # It frequently happens that describeTasks return None before the job is finsihed.
                            if job_status == None:
                                stochkit_job.status = "Unknown"
                            else:

                                if job_status['status'] == 'finished':
                                    # Update the stochkit job 
                                    stochkit_job.status = 'Finished'
                                    stochkit_job.output_url = job_status['output']
                                    stochkit_job.uuid = job_status['uuid']
                                
                                elif job_status['status'] == 'failed':
                                    stochkit_job.status = 'Failed'
                                elif job_status['status'] == 'pending':
                                    stochkit_job.status = 'Pending'
                                else:
                                    # The state gives more fine-grained results, like if the job is being re-run, but
                                    #  we don't bother the users with this info, we just tell them that it is still running.  
                                    stochkit_job.status = 'Running'
                    
                    except Exception,e:
                        result = {'status':False,'msg':'Could not determine the status of the jobs.'+str(e)}                

                all_jobs.append({ "name" : stochkit_job.name,
                                  "status" : stochkit_job.status,
                                  "resource" : stochkit_job.resource,
                                  "startDate" : datetime.datetime.strptime(job.startDate, '%Y-%m-%d-%H-%M-%S').strftime('%Y-%m-%d, %H-%M-%S')})
                # Save changes to the status
                job.put()
                
        context['all_jobs']=all_jobs
    
        return dict(result,**context)

    def getJobStatus(self,task_id):
        # TODO: request the status from the backend.
        return True

    def get_all_urls(self):
        """
            Get the URLs of 
        """
        model = self.get_session_property('model_edited')
        if model is None:
            return None
        else:
        	result = backendservice.describeTask(valid_username)
		self.render_response('status.html', **result)


class JobOutPutPage(BaseHandler):
    
    def authentication_required(self):
        return True

    def get(self):
        context,result = self.getContext()
        self.render_response('stochkitjoboutputpage.html',**dict(result,**context))

    def post(self):
        context,result = self.getContext()
        result = {}
        
        if 'fetch_remote' in context:
            
            logging.info("FETCHING REMOTE FILES")
            
            # Grab the Job from the datastore
            job_name = context['job_name']
            try:
                job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.email_address,job_name).get()
                stochkit_job = job.stochkit_job
                context['stochkit_job']=stochkit_job
            except Exception,e:
                result = {'status':False,'msg':"Could not retreive the jobs" +job_name+ " from the datastore."}

            try:
                
                # Grab the remote files
                service = backendservices()
                service.fetchOutput(stochkit_job.pid,stochkit_job.output_url)
                
                # Unpack it to its local output location
                os.system('tar -xf' +stochkit_job.uuid+'.tar')
                stochkit_job.output_location = os.path.abspath(os.path.dirname(__file__))+'/../output/'+stochkit_job.uuid
                stochkit_job.output_location = os.path.abspath(stochkit_job.output_location)
                
                # Clean up
                os.remove(stochkit_job.uuid+'.tar')
                
                # Save the updated status
                job.put()
                
                result['status']=True
                result['msg'] = "Sucessfully fetched the remote output files."
                
            except Exception,e:
                result['status']=False
                result['msg'] = "Failed to fetch the remote files."
                    
            # Check if the results and stats folders are present locally
            if os.path.exists(stochkit_job.output_location+"/result"):
                context['local_data']=True
            if os.path.exists(stochkit_job.output_location+"/result/stats"):
                context['local_statistics']=True
                        
            self.render_response('stochkitjoboutputpage.html',**dict(result,**context))
            
    def getContext(self):
        
        context = self.request.POST
        context = dict(context,**self.request.GET)

        job_name = context['job_name']

        # Detect if we should show the 'debug' version of the output
        if 'debug' in context:
          debug = (context['debug'] == 'true')
          context['debug'] = debug #Store a copy for the django templates
        else:
          debug = False

        result = {}
        
        # Grab the Job from the datastore
        try:
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.email_address,job_name).get()
            stochkit_job = job.stochkit_job
            context['stochkit_job']=stochkit_job
        except Exception,e:
            result = {'status':False,'msg':"Could not retreive the jobs"+job_name+ " from the datastore."}

        # If not in debug mode, show the output
        if debug == False:
          # Check if the results and stats folders are present locally
          if os.path.exists(stochkit_job.output_location+"/result"):
            context['local_data']=True
          if os.path.exists(stochkit_job.output_location+"/result/stats"):
            context['local_statistics']=True
        else:
          # If in debug mode, show the stdout and stderr along with jobinfo
          if os.path.exists(stochkit_job.output_location):
            stdoutf = open(context['stochkit_job'].stdout, 'r')
            context['stdout'] = stdoutf.read()
            stdoutf.close()

            stderrf = open(context['stochkit_job'].stderr, 'r')
            context['stderr'] = stderrf.read()
            stderrf.close()
          else:
            # Should never get here
            pass
            
        return context,result

class VisualizePage(BaseHandler):
    """ Basic Visualization """

    def authentication_required(self):
        return True
        
    def get(self):
        
        result = {}
        context = self.getContext()
        logging.info(context)
        try:
            # Get the species names
            species_names = self.getSpeciesNames(context)
            if species_names == None:
                result['status'] = False
                result['msg'] = 'Failed to retrive the species names'
            context['species_names'] = species_names
    
        except Exception,e:
            self.response.out.write(str(e))
        pass
        
        context['trajectory_number']="1"
        self.render_response('visualizepage.html',**dict(result,**context))
    
    def post(self):
        # TODO: Error handling
        
        result = {}
        context = self.getContext()
        logging.info(context)
        params = self.request.POST
        
        # Get the species names
        species_names = self.getSpeciesNames(context)
        if species_names == None:
            result['status'] = False
            result['msg'] = 'Failed to retrieve the species names'
        context['species_names'] = species_names
        
        species_name = context['species_name']
        if 'plotbuttonmean' in params:
            species_time_series = self.getMeans(context,species_name)

            if species_time_series == None:
              result = { "status" : False, "msg" : "Could not find mean values" }
        elif 'ode_plotbutton' in params:
            species_time_series = self.getODE(context, species_name)

            if species_time_series == None:
              result = { "status" : False, "msg" : "Could not find time series for ode" }
        elif 'plotbutton' in params:
            trajectory_number = context['trajectory_number']
            species_time_series = self.getTrajectory(context,trajectory_number,species_name)

            if species_time_series == None:
              result = { "status" : False, "msg" : "Could not find trajectory {0}".format(trajectory_number) }

        context['species_time_series']=species_time_series
            
        self.render_response('visualizepage.html',**dict(result,**context))
    
    def getMeans(self, params, species_name):
        """ Get the mean values """
        try:
            # StochKit labels the output files starting from 0, hence the "-1", since we label from 1 in the UI.
            meanfile = params['job_folder']+'/result/stats/means.txt'
            file = open(meanfile,'rb')
            trajectory_data = [row.strip().split('\t') for row in file]
            
            species_names = trajectory_data[0]
            for s in range(len(species_names)):
                if species_names[s] == species_name:
                    break
            species_time_series = []
            for row in trajectory_data:
                species_time_series.append([row[0],row[s]]);
            return species_time_series[1:]
        except:
            return None
    
    def getODE(self, params, species_name):
        """ Get the mean values """
        try:
            # StochKit labels the output files starting from 0, hence the "-1", since we label from 1 in the UI.
            meanfile = params['job_folder']+'/result/output.txt'
            file = open(meanfile,'rb')
            trajectory_data = [row.strip().split('\t') for row in file]
            
            species_names = trajectory_data[0]
            for s in range(len(species_names)):
                if species_names[s] == species_name:
                    break
            species_time_series = []
            for row in trajectory_data:
                species_time_series.append([row[0],row[s]]);
            return species_time_series[1:]
        except:
            return None

    
    def getTrajectory(self, params, trajectory_number, species_name):
        """ Get data from a specific trajectory in the StochKit output folder. """

        try:
            # StochKit labels the output files starting from 0, hence the "-1", since we label from 1 in the UI.
            meanfile = params['job_folder']+'/result/trajectories/trajectory'+str(int(trajectory_number)-1)+'.txt'
            file = open(meanfile,'rb')
            trajectory_data = [row.strip().split('\t') for row in file]
            
            species_names = trajectory_data[0]
            for s in range(len(species_names)):
                if species_names[s] == species_name:
                    break
            species_time_series = []
            for row in trajectory_data:
                species_time_series.append([row[0],row[s]]);
            return species_time_series[1:]
        except:
            return None
            
    def getSpeciesNames(self, params):
        """ Get a list with the species names. 
            The result folder have to be populated in advance. """
        #meanfile = params['job_folder']+'/result/stats/means.txt'
        #logging.info(str(meanfile))
        try:
            # Try to grab them from the mean.txt file
            print params
            if params['exec_type'] == 'deterministic':
                meanfile = params['job_folder'] + '/result/output.txt'
            else:
                meanfile = params['job_folder'] + '/result/stats/means.txt'
            
            #meanfile = params['job_folder']+'/result/stats/means.txt'
            file = open(meanfile,'rb')
            row = file.readline()
            logging.info(str(row))
            species_names = row.strip().split('\t')
            file.close()
        except Exception, e:
            logging.info(str(e))
            return None
                
        # The first value is always 'time' 
        return species_names[1:]

    def getContext(self):
        params = self.request.POST
        params = dict(params,**self.request.GET)
        return params
    
