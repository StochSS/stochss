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
        result = {}
        service = backendservices(self.user_data)
        # Grab references to all the user's StochKitJobs in the system
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        all_jobs = []
        if all_stochkit_jobs != None:
            # We want to display the name of the job and the status of the Job.
            status = {}

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

        allSensJobs = []
        # Grab references to all the user's StochKitJobs in the system
        allSensQuery = sensitivity.SensitivityJobWrapper.all().filter('user_id =', self.user.user_id())

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

        allParameterJobs = []
        allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE user_id = :1", self.user.user_id())

        if allParameterJobsQuery != None:
            jobs = list(allParameterJobsQuery.run())

            jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)

            for number, job in enumerate(jobs):
                number = len(jobs) - number
                if job.resource == "local" or not job.resource:
                    # First, check if the job is still running
                    res = service.checkTaskStatusLocal([job.pid])
                    if res[job.pid] and job.pid:
                        job.status = "Running"
                    else:
                        try:
                            fd = os.open("{0}/stderr".format(job.outData), os.O_RDONLY)
                            f = os.fdopen(fd)
                            stderr = f.read().strip()
                            f.close()
                        except:
                            stderr = '1'

                        if len(stderr) == 0:
                            job.status = "Finished"
                        else:
                            job.status = "Failed"

                #    asd
                elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.status != "Finished":
                    taskparams = {}
                    task_status = service.describeTasks(job)
                    logging.debug('StochOptim task_status =\n{}'.format(pprint.pformat(task_status)))
                    if task_status is None:
                        task.status = 'Inaccessible'
                    elif task_status is not None and job.cloudDatabaseID not in task_status:
                        logging.error("'Could not find job with cloudDatabaseID {} in fetched task_status!'.format(optimization.cloudDatabaseID))")
                        job.status = 'Unknown'
                        job.exceptionMessage = 'Failed to retreive job status from Job Database.'
                    else:
                        job_status = task_status[job.cloudDatabaseID]

                        # If it's finished
                        if job_status['status'] == 'finished':
                            # Update the job 
                            job.status = 'Finished'
                            job.outputURL = job_status['output']
                        # 
                        elif job_status['status'] == 'failed':
                            job.status = 'Failed'
                            job.exceptionMessage = job_status['message']
                            # Might not have an output if an exception was raised early on or if there is just no output available
                            try:
                                job.outputURL = job_status['output']
                            except KeyError:
                                pass
                        # 
                        elif job_status['status'] == 'pending':
                            job.status = 'Pending'
                        else:
                            # The state gives more fine-grained results, like if the job is being re-run, but
                            #  we don't bother the users with this info, we just tell them that it is still running.  
                            job.status = 'Running'
                            try:
                                job.outputURL = job_status['output']
                                logging.info("Found running stochoptim job with S3 output: {0}".format(job.outputURL))
                            except KeyError:
                                pass

                job.put()
                
                allParameterJobs.append({ "status" : job.status,
                                       "name" : job.name,
                                       "resource": job.resource,
                                       "number" : number,
                                       "id" : job.key().id()})
        
        context['allParameterJobs'] = allParameterJobs

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
    
        return dict(result,**context)

    def getJobStatus(self, service, number, job):
        logging.debug('*'*80)
        logging.debug('*'*80)
        logging.debug('status.getJobStatus() job = {0}'.format(job))
        logging.debug('status.getJobStatus() job.status={0} job.resource={1} job.outData={2}'.format(job.status, job.resource, job.outData))
        logging.debug('status.getJobStatus() job.indata = {0}'.format(job.indata))
        logging.debug('status.getJobStatus() type(job.indata) = {0}'.format(type(job.indata)))
        indata = json.loads(job.indata)
        file_to_check = None
        if job.outData is not None:
            if indata["exec_type"] == 'spatial':
                file_to_check = "{0}/results/complete".format(job.outData)
            elif indata["exec_type"] == 'stochastic':
                file_to_check = os.path.join(job.outData, "result/stats/means.txt")
            elif indata["exec_type"] == 'deterministic':
                file_to_check = os.path.join(job.outData, "/result/output.txt")
            else:
                raise Exception('Unknown exec_type={0}'.format(indata["exec_type"]))
        logging.debug('status.getJobStatus() file_to_check={0}'.format(file_to_check))
        if job.resource == "local" or job.outData is not None:
            job_status_found = False
            if job.resource == "local":
                # First, check if the job is still running
                res = service.checkTaskStatusLocal([job.pid])
                if res[job.pid] and job.pid:
                    job.status = "Running"
                    job_status_found = True
            if not job_status_found:
                if os.path.exists(file_to_check):
                    job.status = "Finished"
                else:
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
                    "output_stored": job.output_stored,
                    "resource": job.resource,
                    "number" : number,
                    "id" : job.key().id()}

