import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))

import datetime
from google.appengine.ext import db
from stochssapp import BaseHandler
import sensitivity
import cloudtracker

class DataReproductionPage(BaseHandler):
    """ The main handler for the Data Reproduction Page."""        
    def authentication_required(self):
        return True
    
    def get(self):
        context = self.getContext()
        self.render_response('reproduce.html', **context)
        
    def post(self):
        
        params = self.request.POST
        
        if 'reproduce' in params:
            job_uuid = params['id_box']

            credentials = self.user_data.getCredentials()
            prov_keys = backend.s3_helper.get_all_files("gdouglas.cs.ucsb.edu.research_bucket",
                                                        job_uuid,
                                                        credentials['EC2_ACCESS_KEY'],
                                                        credentials['EC2_SECRET_KEY'])
    
            if not prov_keys:
                context = self.getContext()
                result = {'status':False,'msg':"The job with this ID does not exist or cannot be reproduced."}
                self.render_response('reproduce.html', **dict(result,**context))
            else:
                self.redirect(str('rerun?id=' + job_uuid))
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
                    all_jobs.append({ "name" : stochkit_job.name,
                                      "id" : stochkit_job.pid})
        
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


class RerunJobPage(BaseHandler):
    """ The main handler for the Data Reproduction Page."""        
    def authentication_required(self):
        return True
    
    def get(self):
        uuid = self.request.get('id')
        credentials = self.user_data.getCredentials()
        cloudtracker.run(uuid, credentials['EC2_ACCESS_KEY'], credentials['EC2_SECRET_KEY'])

        context = self.getContext()
        self.render_response('rerun.html', **context)
        
    def post(self):        
        context = self.getContext()
        self.render_response('rerun.html', **context)

    def getContext(self):
        context = {}
        return context
        