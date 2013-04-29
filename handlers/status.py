try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__
import time

from google.appengine.ext import db


from stochssapp import BaseHandler
from stochss.backendservice import *

class StatusPage(BaseHandler):
    
    def get(self):
        #all_urls = self.get_all_urls()
        context = self.getContext()
        self.render_response('status.html', **context)
        
    def post(self):
        
        params = self.request.POST
        
        if 'delete' in params:
            # The jobs to delete are specified in the checkboxes 
            print "Deleting selected elements"
            jobs_to_delete = params.getall('select_job')
            
            # Select the jobs to delete from the datastore
            result = {}
            for job_name in jobs_to_delete:
                try:
                    stochkit_job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
                except Exception,e:
                    result = {'status':False,'msg':"Could not retreive the jobs"+job_name+ " from the datastore."}
        
                # TODO: Call the backend to kill and delete the job and all associated files from EC2/local storage.
                #isdeleted_backend = backend.deleteTask(stochkit_job.task_id,credentials)
                isdeleted_backend = True
                if isdeleted_backend:
                    # Delete the job from the datastore
                    try:
                        db.delete(stochkit_job)
                    except Exception,e:
                        result = {'status':False,'msg':"Could not delete the job"+job_name+ " from the datastore."}

            # Render the page
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
            Get information about all the jobs that exist in the system and assemble a dict
            with info to display on the page. 
        """
        
        context = {}
        # Grab references to all the user's StochKitJobs in the system
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        if all_stochkit_jobs == None:
            context['no_jobs'] = 'There are no jobs in the system.'
        else:
            # We want to display the name of the job, the status of the Job, and if it is
            # completed, the URL where the user can download the output.
            job_names = []
            job_status = []
            job_urls = []
            all_jobs = []
            for job in all_stochkit_jobs.run():
                # Get the job id
                stochkit_job = job.stochkit_job
                all_jobs.append(stochkit_job)

                task_id = stochkit_job.task_id
                job_name = stochkit_job.name
                job_names.append(job_name)
                # Query the backend for the staus of the job
                job_status.append(self.getJobStatus(task_id))

            context['job_names']=job_names
            context['job_status'] = job_status
            context['all_jobs']=all_jobs
    
        return context

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




