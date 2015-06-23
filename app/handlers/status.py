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
import tempfile
import datetime
import pprint

from google.appengine.ext import db

from stochssapp import BaseHandler
from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobDatabaseConfig

import sensitivity
import simulation
import spatial
import stochoptim

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
        
            service = backendservices(self.user_data)

            # Select the jobs to delete from the datastore
            result = {}
            for job_name in jobs_to_delete:
                try:
                    job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
                except Exception,e:
                    result = {'status':False,'msg':"Could not retrieve the jobs"+job_name+ " from the datastore."}
        
                job.delete()
    
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
        service = backendservices(self.user_data)
        # StochKit jobs
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        all_jobs = []
        if all_stochkit_jobs != None:
            jobs = list(all_stochkit_jobs.run())
            jobs = sorted(jobs,
                          key=lambda x:
                                (datetime.datetime.strptime(x.startDate, '%Y-%m-%d-%H-%M-%S')
                                     if hasattr(x, 'startDate') and x.startDate != None else datetime.datetime.now()),
                          reverse=True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number
                all_jobs.append(self.getJobStatus(service, number,job))
        context['all_jobs']=all_jobs

        # Sensitivity
        allSensJobs = []
        allSensQuery = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE user_id = :1", self.user.user_id())
        if allSensQuery != None:
            jobs = list(allSensQuery.run())
            jobs = sorted(jobs,
                          key=lambda x:
                                (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                 if hasattr(x, 'startTime') and x.startTime != None else ''),
                          reverse = True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number
                allSensJobs.append(self.getJobStatus(service, number,job))
        context['allSensJobs']=allSensJobs


        # Export
        allExportJobs = []
        exportJobsQuery = db.GqlQuery("SELECT * FROM ExportJobWrapper WHERE user_id = :1", self.user.user_id())
        if exportJobsQuery != None:
            jobs = list(exportJobsQuery.run())
            jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number
                allExportJobs.append({ "startTime" : job.startTime,
                                       "status" : job.status,
                                       "number" : number,
                                       "outData" : os.path.basename(job.outData if job.outData else ""),
                                       "id" : job.key().id()})
        context['allExportJobs'] = allExportJobs

        # Parameter Estimation
        allParameterJobs = []
        allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE user_id = :1", self.user.user_id())
        if allParameterJobsQuery != None:
            jobs = list(allParameterJobsQuery.run())
            jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number
                allParameterJobs.append(self.getJobStatus(service, number,job))
        context['allParameterJobs'] = allParameterJobs

        #Spatial Jobs
        allSpatialJobs = []
        allSpatialJobsQuery = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE user_id = :1", self.user.user_id())
        if allSpatialJobsQuery != None:
            jobs = list(allSpatialJobsQuery.run())
            jobs = sorted(jobs,
                          key=lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                              if hasattr(x, 'startTime') and x.startTime != None else ''),
                          reverse = True)
            for number, job in enumerate(jobs):
                number = len(jobs) - number
                allSpatialJobs.append(self.getJobStatus(service, number,job))
        context['allSpatialJobs'] = allSpatialJobs
    
        return context

    def getJobStatus(self, service, number, job):
        logging.debug('*'*80)
        logging.debug('*'*80)
        logging.debug('status.getJobStatus() job = {0}'.format(job))
        logging.debug('status.getJobStatus() job.status={0} job.resource={1} job.outData={2}'.format(job.status, job.resource, job.outData))
        logging.debug('status.getJobStatus() job.indata = {0}'.format(job.indata))
        logging.debug('status.getJobStatus() type(job.indata) = {0}'.format(type(job.indata)))
        indata = json.loads(job.indata)
        file_to_check = "{0}/return_code".format(job.outData)
        logging.debug('status.getJobStatus() file_to_check={0}'.format(file_to_check))
        if job.resource.lower() == "local" or job.outData is not None:
            job_status_found = False
            if job.resource.lower() == "local":
                # First, check if the job is still running
                res = service.checkTaskStatusLocal([job.pid])
                if res[job.pid] and job.pid:
                    job.status = "Running"
                    job_status_found = True
            if not job_status_found:
                if not os.path.exists(file_to_check):
                    job.status = "Failed"
                else:
                    try:
                        with open(file_to_check) as fd:
                            return_code = fd.readline()
                            logging.debug('status.getJobStatus() file_to_check={0} return_code={1}'.format(file_to_check, return_code))
                            if int(return_code) == 0:
                                job.status = "Finished"
                            else:
                                job.status = "Failed"
                    except Exception as e:
                        logging.exception(e)
                        job.status = "Failed"

        elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            task_status = service.describeTasks(job)
            logging.info('status.getJobStatus()  task_status =\n{}'.format(pprint.pformat(task_status)))

            if task_status is None:
                job.status = "Inaccessible"
                job_status = None
            elif task_status is not None and job.cloudDatabaseID not in task_status:
                job.status = "Unknown"
            else:
                job_status = task_status[job.cloudDatabaseID]
                if job_status is None or 'status' not in job_status:
                    job.status = "Unknown"
                elif job_status['status'] == 'finished':
                    # Update the spatial job
                    job.outputURL = job_status['output']
                    job.uuid = job_status['uuid']
                    job.status = 'Finished'
                    if job.outData is None:
                        job.status = 'Finished'
                    else:
                        if os.path.exists(file_to_check):
                            job.status = "Finished"
                        else:
                            job.status = "Failed"

                elif job_status['status'] == 'failed':
                    job.status = 'Failed'
                    job.exception_message = job_status['message']
                    # Might not have a uuid or output if an exception was raised early on or if there is just no output available
                    try:
                        job.uuid = job_status['uuid']
                        job.outputURL = job_status['output']
                    except KeyError:
                        pass

                elif job_status['status'] == 'pending':
                    job.status = 'Pending'
                else:
                    # The state gives more fine-grained results, like if the job is being re-run, but
                    #  we don't bother the users with this info, we just tell them that it is still running.
                    job.status = 'Running'
                               
        job.put()
        logging.debug('status.getJobStatus() job.status = {0}'.format(job.status))
        logging.debug('*'*80)
        logging.debug('*'*80)
        
         

        return {    "status" : job.status,
                    "name" : job.name,
                    "uuid" : job.cloudDatabaseID,
                    "output_stored": job.output_stored if hasattr(job, 'output_stored') else None,
                    "resource": job.resource,
                    "number" : number,
                    "id" : job.key().id()}

