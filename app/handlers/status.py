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

#from backend.storage.s3_storage import S3StorageAgent
#from backend.storage.flex_storage import FlexStorageAgent
#from backend.databases.flex_db import FlexDB
#from backend.databases.dynamo_db import DynamoDB

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

                # Query the backend for the status of the job, but only if the current status is not Finished
                if job.status != "Finished":
                    try:
                        if job.resource.lower() == 'local':
                            # First, check if the job is still running
                            res = service.checkTaskStatusLocal([job.pid])
                            if res[job.pid]:
                                job.status = "Running"
                            else:
                                # Check if the signature file is present, that will always be the case for a sucessful job.
                                # for ssa and tau leaping, this is means.txt
                                # for ode, this is output.txt

                                if job.indata["exec_type"] == 'stochastic':
                                    file_to_check = os.path.join(job.output_location, "result/stats/means.txt")
                                else:
                                    file_to_check = os.path.join(job.output_location, "/result/output.txt")
                                
                                if os.path.exists(file_to_check):
                                    job.status = "Finished"
                                else:
                                    job.status = "Failed"
                
                        elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.output_location is not None:
                            # The data has been downloaded already
                            # Check if the signature file is present, that will always be the case for a sucessful job.
                            # for ssa and tau leaping, this is means.txt
                            # for ode, this is output.txt

                            if job.indata["exec_type"] == 'stochastic':
                                file_to_check = os.path.join(job.output_location, "result/stats/means.txt")
                            else:
                                file_to_check = os.path.join(job.output_location, "result/output.txt")
                            
                            if os.path.exists(file_to_check):
                                job.status = "Finished"
                            else:
                                job.status = "Failed"

                        elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.output_location is None:

                            # Check the status from backend

                            task_status = service.describeTasks(job)
                            logging.info('task_status =\n{}'.format(pprint.pformat(task_status)))

                            # It frequently happens that describeTasks return None before the job is finsihed.
                            if task_status is None:
                                job.status = "Inaccessible"
                            elif job.cloudDatabaseID not in task_status or task_status[job.cloudDatabaseID] == None:
                                job.status = "Unknown"
                            else:
                                job_status = task_status[job.cloudDatabaseID]

                                if job_status['status'] == 'finished':
                                    # Update the stochkit job 
                                    job.status = 'Finished'
                                    job.output_url = job_status['output']
                                    job.uuid = job_status['uuid']
                                
                                elif job_status['status'] == 'failed':
                                    job.status = 'Failed'
                                    job.exception_message = job_status['message']
                                    # Might not have a uuid or output if an exception was raised early on or if there is just no output available
                                    try:
                                        job.uuid = job_status['uuid']
                                        job.output_url = job_status['output']
                                    except KeyError:
                                        pass
                                    
                                elif job_status['status'] == 'pending':
                                    job.status = 'Pending'
                                else:
                                    # The state gives more fine-grained results, like if the job is being re-run, but
                                    #  we don't bother the users with this info, we just tell them that it is still running.  
                                    job.status = 'Running'
                    
                    except Exception,e:
                        logging.exception(e)
                        result = {'status':False,'msg':'Could not determine the status of the jobs.'+str(e)}                
                else:
                    logging.info("Job {0} has status {1}".format(job.name, job.status))

                # Save changes to the status
                job.put()

                print job.key().id(), job.status

                all_jobs.append({ "name" : job.name,
                                  "uuid": job.cloudDatabaseID, 
                                  "status" : job.status,
                                  "resource" : job.resource,
                                  "execType" : job.indata["exec_type"],
                                  "output_stored": job.output_stored,
                                  "id" : job.key().id(),
                                  "number" : number})
        
        context['all_jobs']=all_jobs

        allSensJobs = []
        # Grab references to all the user's StochKitJobs in the system
        #allSensQuery = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE userId = :1", self.user.user_id())

        allSensQuery = sensitivity.SensitivityJobWrapper.all().filter('userId =', self.user.user_id())

        if allSensQuery != None:
            jobs = list(allSensQuery.run())

            jobs = sorted(jobs,
                          key=lambda x:
                                (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                 if hasattr(x, 'startTime') and x.startTime != None else ''),
                          reverse = True)

            for number, job in enumerate(jobs):
                number = len(jobs) - number

                logging.info('For sensitivity job with id: {0}, resource = {1}'.format(job.key().id(), job.resource))

                if job.resource == "local":
                    if job.status != "Finished" or job.status != "Failed":
                        res = service.checkTaskStatusLocal([job.pid])
                        if res[job.pid]:
                            job.status = "Running"
                        else:
                            file_to_check = job.outData + "/result/output.txt"
                            if os.path.exists(file_to_check):
                                job.status = "Finished"
                            else:
                                job.status = "Failed"

                #elif job.resource == "cloud" and job.status != "Finished":
                elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                    if job.outData is not None:
                        file_to_check = job.outData + "/result/output.txt"
                        if os.path.exists(file_to_check):
                            job.status = "Finished"
                        else:
                            job.status = "Failed"
                    else:
                        # Check the status from backend
#                        taskparams = {}
#                        if job.resource == backendservices.EC2_CLOUD_RESOURCE:
#                             # Retrive credentials from the datastore
#                            if not self.user_data.valid_credentials:
#                                return {'status': False,
#                                        'msg': 'Could not retrieve the status of job '+ job.name +'. Invalid credentials.'}
#                            credentials = self.user_data.getCredentials()
#
#                            taskparams = {
#                                'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
#                                'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
#                                'taskids': [job.cloudDatabaseID],
#                                'agent_type': AgentTypes.EC2
#                            }
#
#                        elif job.resource == backendservices.FLEX_CLOUD_RESOURCE:
#                            queue_head_machine = self.user_data.get_flex_queue_head_machine()
#                            taskparams = {
#                                'flex_db_password': self.user_data.flex_db_password,
#                                'queue_head_ip': queue_head_machine['ip'],
#                                'taskids':[job.cloudDatabaseID],
#                                'agent_type': AgentTypes.FLEX
#                            }

                        task_status = service.describeTasks(job)
                        logging.info('task_status =\n{}'.format(pprint.pformat(task_status)))
                        if task_status is None:
                            job.status = "Inaccessible"
                        elif job.cloudDatabaseID not in task_status:
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
                else:
                    logging.error('Job Resource {0} not supported!'.format(job.resource))
                
                job.put()   
                allSensJobs.append({ "name" : job.jobName,
                                     "uuid" : job.cloudDatabaseID,
                                     "output_stored": job.output_stored,
                                     "resource": job.resource,
                                     "status" : job.status,
                                     "id" : job.key().id(),
                                     "number" : number})
        
        context['allSensJobs']=allSensJobs

        allExportJobs = []
        exportJobsQuery = db.GqlQuery("SELECT * FROM ExportJobWrapper WHERE userId = :1", self.user.user_id())

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
        allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1", self.user.user_id())

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
                        job.status = 'Inaccessible'
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
                                       "name" : job.jobName,
                                       "resource": job.resource,
                                       "number" : number,
                                       "id" : job.key().id()})
        
        context['allParameterJobs'] = allParameterJobs

        allSpatialJobs = []
        allSpatialJobsQuery = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE userId = :1", self.user.user_id())

        if allSpatialJobsQuery != None:
            jobs = list(allSpatialJobsQuery.run())

            jobs = sorted(jobs,
                          key=lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                              if hasattr(x, 'startTime') and x.startTime != None else ''),
                          reverse = True)

            for number, job in enumerate(jobs):
                number = len(jobs) - number
                if job.resource == "local" or not job.resource:
                    # First, check if the job is still running
                    res = service.checkTaskStatusLocal([job.pid])
                    if res[job.pid] and job.pid:
                        job.status = "Running"
                    else:
                        if os.path.exists("{0}/results/complete".format(job.outData)):
                            job.status = "Finished"
                        else:
                            job.status = "Failed"

                elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                    # Check the status from backend
#                    taskparams = {}
#                    if job.resource == backendservices.EC2_CLOUD_RESOURCE:
#                        # Retrieve credentials from the datastore
#                        if not self.user_data.valid_credentials:
#                            return {'status': False,
#                                    'msg': 'Could not retrieve the status of spatial ob '+ job.jobName +'. Invalid credentials.'}
#                        credentials = self.user_data.getCredentials()
#
#                        taskparams = {
#                            'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
#                            'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
#                            'taskids': [job.cloudDatabaseID],
#                            'agent_type': AgentTypes.EC2
#                        }
#                    elif job.resource == backendservices.FLEX_CLOUD_RESOURCE:
#                        try:
#                            queue_head_machine = self.user_data.get_flex_queue_head_machine()
#                            taskparams = {
#                                'flex_db_password': self.user_data.flex_db_password,
#                                'queue_head_ip': queue_head_machine['ip'],
#                                'taskids':[job.cloudDatabaseID],
#                                'agent_type': AgentTypes.FLEX
#                            }
#                        except Exception as e:
#                            logging.exception(e)

                    task_status = service.describeTasks(job)
                    logging.info('Spatial task_status =\n{}'.format(pprint.pformat(task_status)))

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
                            job.output_url = job_status['output']
                            job.uuid = job_status['uuid']
                            job.status = 'Finished'
                            if job.outData is None:
                                job.status = 'Finished'
                            else:
                                if os.path.exists("{0}/results/complete".format(job.outData)):
                                    job.status = "Finished"
                                else:
                                    job.status = "Failed"

                        elif job_status['status'] == 'failed':
                            job.status = 'Failed'
                            job.exception_message = job_status['message']
                            # Might not have a uuid or output if an exception was raised early on or if there is just no output available
                            try:
                                job.uuid = job_status['uuid']
                                job.output_url = job_status['output']
                            except KeyError:
                                pass

                        elif job_status['status'] == 'pending':
                            job.status = 'Pending'
                        else:
                            # The state gives more fine-grained results, like if the job is being re-run, but
                            #  we don't bother the users with this info, we just tell them that it is still running.
                            job.status = 'Running'
                                       
                job.put()

                allSpatialJobs.append({ "status" : job.status,
                                        "name" : job.jobName,
                                        "uuid" : job.cloudDatabaseID,
                                        "output_stored": job.output_stored,
                                        "resource": job.resource,
                                        "number" : number,
                                        "id" : job.key().id()})
        
        context['allSpatialJobs'] = allSpatialJobs
    
        return dict(result,**context)

    def getJobStatus(self,task_id):
        # TODO: request the status from the backend.
        return True
