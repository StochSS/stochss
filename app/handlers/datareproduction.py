import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))

import json
import datetime
from google.appengine.ext import db
from stochssapp import BaseHandler
import sensitivity
from cloudtracker import CloudTracker
import logging
from backend import tasks

DEFAULT_BUCKET_NAME = ''

class DataReproductionPage(BaseHandler):
    """ The main handler for the Data Reproduction Page."""        
    def authentication_required(self):
        return True
    
    def get(self):
        context = self.getContext()
        self.render_response('reproduce.html', **context)
        
    def post(self):
        
        job_type = self.request.get('job_type')
        
        if job_type == 'stoch_job':
            job_name = self.request.get('name')

            logging.info('job name: '.format(job_name))
            credentials = self.user_data.getCredentials()
            
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()       
            uuid = job.stochkit_job.pid
            
        
            try:        
                time = datetime.datetime.now()
                os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
                os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']
                access_key = credentials['EC2_ACCESS_KEY']
                secret_key = credentials['EC2_SECRET_KEY']
                ct = CloudTracker(access_key, secret_key, str(uuid), self.user_data.getBucketName())
                
                #if need_tracking, it means that there is no provenace.    
                has_prov = not ct.if_tracking() 
                # If there is no provenance data for this job, report an error to the user
                if not has_prov:
                    result = {'status':False,'msg':"The job with this ID does not exist or cannot be reproduced."}
                    return
                
                logging.info('start to rerun the job {0}'.format(str(uuid)))
                # Set up CloudTracker with user credentials and specified UUID to rerun the job
                params = ct.get_input()
            
                tmp = tasks.task.delay(uuid, params, access_key, secret_key)  #calls task(taskid,params,access_key,secret_key)
                celery_task_id = tmp.id
                logging.info("executeTask :  result of task : %s", str(tmp.id))
                      
                job.stochkit_job.pid = uuid
                # The celery_pid is the Celery Task ID.
                job.stochkit_job.celery_pid = celery_task_id
                job.stochkit_job.status = 'Running'
                job.stochkit_job.output_location = None
            
                job.startDate = time.strftime("%Y-%m-%d-%H-%M-%S")
            
                job.put()
                result = {'status':True,'msg':'Job rerun submitted sucessfully.'}
            
            
            except Exception,e:
                result = {'status':False,'msg':'Cloud execution failed: '+str(e)}
            
            self.response.content_type = 'application/json'    
            self.response.write(json.dumps(result))
            return
        
        else:
            context = self.getContext()
            self.render_response('reproduce.html', **context)


    def getContext(self):
        """ 
            Get all the jobs that exist in the system and assemble a dict
            with info to display on the page. 
        """
        context = {}
        result = {}
        # Grab references to all the user's StochKitJobs in the system
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        all_jobs = []
        if all_stochkit_jobs != None:
            jobs = list(all_stochkit_jobs.run())
            jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startDate, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startDate') and x.startDate != None else datetime.datetime.now()), reverse = True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number

                # Get the job id
                stochkit_job = job.stochkit_job
                
                # Query the backend for the status of the job, but only if the current status is not Finished
                if stochkit_job.status == "Finished":
                    all_jobs.append({ "id": job.key().id(),
                                      "name" : stochkit_job.name,
                                      "uuid" : stochkit_job.pid})
        
        context['all_jobs']=all_jobs

        allSensJobs = []
        allSensQuery = sensitivity.SensitivityJobWrapper.all().filter('userId =', self.user.user_id())

        if allSensQuery != None:
            jobs = list(allSensQuery.run())
            jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)

            for number, job in enumerate(jobs):
                number = len(jobs) - number
                if job.status == "Finished":
                    allSensJobs.append({ "name" : job.jobName,
                                         "id" : job.cloudDatabaseID})
        
        context['allSensJobs']=allSensJobs
    
        return dict(result,**context)

        
