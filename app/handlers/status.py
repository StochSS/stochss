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

from backend.storage.s3_storage import S3StorageAgent
from backend.storage.flex_storage import FlexStorageAgent
from backend.databases.flex_db import FlexDB
from backend.databases.dynamo_db import DynamoDB

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
                #if not stochkit_job.status == "Finished":
                if True:
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

                            if job["indata"].exec_type == 'stochastic':
                                file_to_check = os.path.join(job.output_location, "result/stats/means.txt")
                            else:
                                file_to_check = os.path.join(job.output_location, "result/output.txt")
                            
                            if os.path.exists(file_to_check):
                                job.status = "Finished"
                            else:
                                job.status = "Failed"

                        elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES and job.output_location is None:

                            # Check the status from backend
                            taskparams = {}
                            if job.resource == simulation.StochKitJob.EC2_CLOUD_RESOURCE:
                                # Retrieve credentials from the datastore
                                if not self.user_data.valid_credentials:
                                    return {'status':False,
                                            'msg':'Could not retrieve the status of job '+stochkit_job.name +'. Invalid credentials.'}

                                credentials = self.user_data.getCredentials()

                                taskparams = {
                                    'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                                    'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
                                    'taskids': [stochkit_job.pid],
                                    'agent_type': AgentTypes.EC2
                                }

                            elif stochkit_job.resource == simulation.StochKitJob.FLEX_CLOUD_RESOURCE:
                                queue_head_machine = self.user_data.get_flex_queue_head_machine()
                                taskparams = {
                                    'flex_db_password': self.user_data.flex_db_password,
                                    'queue_head_ip': queue_head_machine['ip'],
                                    'taskids':[stochkit_job.pid],
                                    'agent_type': AgentTypes.FLEX
                                }

                            task_status = service.describeTask(taskparams)
                            logging.info('task_status =\n{}'.format(pprint.pformat(task_status)))

                            # It frequently happens that describeTasks return None before the job is finsihed.
                            if task_status is None:
                                stochkit_job.status = "Inaccessible"
                            elif stochkit_job.pid not in task_status or task_status[stochkit_job.pid] == None:
                                stochkit_job.status = "Unknown"
                            else:
                                job_status = task_status[stochkit_job.pid]

                                if job_status['status'] == 'finished':
                                    # Update the stochkit job 
                                    stochkit_job.status = 'Finished'
                                    stochkit_job.output_url = job_status['output']
                                    stochkit_job.uuid = job_status['uuid']
                                
                                elif job_status['status'] == 'failed':
                                    stochkit_job.status = 'Failed'
                                    stochkit_job.exception_message = job_status['message']
                                    # Might not have a uuid or output if an exception was raised early on or if there is just no output available
                                    try:
                                        stochkit_job.uuid = job_status['uuid']
                                        stochkit_job.output_url = job_status['output']
                                    except KeyError:
                                        pass
                                    
                                elif job_status['status'] == 'pending':
                                    stochkit_job.status = 'Pending'
                                else:
                                    # The state gives more fine-grained results, like if the job is being re-run, but
                                    #  we don't bother the users with this info, we just tell them that it is still running.  
                                    stochkit_job.status = 'Running'
                    
                    except Exception,e:
                        logging.exception(e)
                        result = {'status':False,'msg':'Could not determine the status of the jobs.'+str(e)}                
                else:
                    logging.info("Job {0} has status {1}".format(stochkit_job.name, stochkit_job.status))

                # Save changes to the status
                job.put()

                all_jobs.append({ "name" : stochkit_job.name,
                                  "uuid": job.cloudDatabaseID, 
                                  "status" : stochkit_job.status,
                                  "resource" : stochkit_job.resource,
                                  "execType" : stochkit_job.exec_type,
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
                elif job.resource in sensitivity.SensitivityJobWrapper.SUPPORTED_CLOUD_RESOURCES:
                    if job.outData is not None:
                        file_to_check = job.outData + "/result/output.txt"
                        if os.path.exists(file_to_check):
                            job.status = "Finished"
                        else:
                            job.status = "Failed"
                    else:
                        # Check the status from backend
                        taskparams = {}
                        if job.resource == sensitivity.SensitivityJobWrapper.EC2_CLOUD_RESOURCE:
                             # Retrive credentials from the datastore
                            if not self.user_data.valid_credentials:
                                return {'status': False,
                                        'msg': 'Could not retrieve the status of job '+ job.name +'. Invalid credentials.'}
                            credentials = self.user_data.getCredentials()

                            taskparams = {
                                'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                                'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
                                'taskids': [job.cloudDatabaseID],
                                'agent_type': AgentTypes.EC2
                            }

                        elif job.resource == sensitivity.SensitivityJobWrapper.FLEX_CLOUD_RESOURCE:
                            queue_head_machine = self.user_data.get_flex_queue_head_machine()
                            taskparams = {
                                'flex_db_password': self.user_data.flex_db_password,
                                'queue_head_ip': queue_head_machine['ip'],
                                'taskids':[job.cloudDatabaseID],
                                'agent_type': AgentTypes.FLEX
                            }

                        task_status = service.describeTask(taskparams)
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
                elif job.resource in stochoptim.StochOptimJobWrapper.SUPPORTED_CLOUD_RESOURCES and job.status != "Finished":
                    taskparams = {}
                    if job.resource == stochoptim.StochOptimJobWrapper.EC2_CLOUD_RESOURCE:
                         # Retrive credentials from the datastore
                        if not self.user_data.valid_credentials:
                            return {'status': False,
                                    'msg': 'Could not retrieve the status of job '+ job.name +'. Invalid credentials.'}
                        credentials = self.user_data.getCredentials()

                        taskparams = {
                            'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                            'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
                            'taskids': [job.cloudDatabaseID],
                            'agent_type': AgentTypes.EC2
                        }

                    elif job.resource == stochoptim.StochOptimJobWrapper.FLEX_CLOUD_RESOURCE:
                        queue_head_machine = self.user_data.get_flex_queue_head_machine()
                        taskparams = {
                            'flex_db_password': self.user_data.flex_db_password,
                            'queue_head_ip': queue_head_machine['ip'],
                            'taskids':[job.cloudDatabaseID],
                            'agent_type': AgentTypes.FLEX
                        }


                    task_status = service.describeTask(taskparams)
                    logging.info('StochOptim task_status =\n{}'.format(pprint.pformat(task_status)))
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
                    taskparams = {}
                    if job.resource == backendservices.EC2_CLOUD_RESOURCE:
                        # Retrieve credentials from the datastore
                        if not self.user_data.valid_credentials:
                            return {'status': False,
                                    'msg': 'Could not retrieve the status of spatial ob '+ job.jobName +'. Invalid credentials.'}
                        credentials = self.user_data.getCredentials()

                        taskparams = {
                            'AWS_ACCESS_KEY_ID': credentials['EC2_ACCESS_KEY'],
                            'AWS_SECRET_ACCESS_KEY': credentials['EC2_SECRET_KEY'],
                            'taskids': [job.cloudDatabaseID],
                            'agent_type': AgentTypes.EC2
                        }
                    elif job.resource == backendservices.FLEX_CLOUD_RESOURCE:
                        try:
                            queue_head_machine = self.user_data.get_flex_queue_head_machine()
                            taskparams = {
                                'flex_db_password': self.user_data.flex_db_password,
                                'queue_head_ip': queue_head_machine['ip'],
                                'taskids':[job.cloudDatabaseID],
                                'agent_type': AgentTypes.FLEX
                            }
                        except Exception as e:
                            logging.exception(e)

                    task_status = service.describeTask(job)
                    logging.info('Spatial task_status =\n{}'.format(pprint.pformat(task_status)))

                    if task_status is None:
                        job.status = "Inaccessible"
                        job_status = None
                    elif task_status is not None and job.cloudDatabaseID not in task_status:
                        job.status = "Unknown"
                    else:
                        job_status = task_status[job.cloudDatabaseID]
                        if job_status['status'] == 'finished':
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
                job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
                stochkit_job = job.stochkit_job
                context['stochkit_job']=stochkit_job
            except Exception,e:
                result = {'status':False,'msg':"Could not retreive the jobs" +job_name+ " from the datastore."}

            fetch_output_result = self.fetchCloudOutput(job)
            result.update(fetch_output_result)
                    
            # Check if the results and stats folders are present locally
            if os.path.exists(stochkit_job.output_location+"/result"):
                context['local_data']=True
            if os.path.exists(stochkit_job.output_location+"/result/stats"):
                context['local_statistics']=True
                        
            self.render_response('stochkitjoboutputpage.html',**dict(result,**context))
        elif 'fetch_local' in context:
            job_name = context['job_name']
            try:
                job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
                stochkit_job = job.stochkit_job
                context['stochkit_job']=stochkit_job
            except Exception,e:
                result = {'status':False,'msg':"Could not find local job " +job_name+ " anywhere."}

            tarballName = job_name + ".tgz"

            path = tempfile.mkdtemp(dir = os.getcwd())
            os.chdir(path)

            try:
                h = subprocess.Popen("cp -r {0} {1}".format(stochkit_job.output_location, job_name).split())
                h.wait()
                h = subprocess.Popen("tar -czf {0}.tgz {0}".format(job_name).split())
                h.wait()
                
                f = open(tarballName, 'r')
                
                self.response.content_type = "application/x-tgz"
                self.response.write(f.read())
                
                f.close()
            except:
                os.chdir("../")
                raise

            os.chdir("../")
            
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
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
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
          logging.info('Viewing job output in debug mode...')
          # If in debug mode, show the stdout and stderr along with jobinfo and exception message if it exists
          if stochkit_job.exception_message != '':
            context['exception_message'] = stochkit_job.exception_message
          if os.path.exists(stochkit_job.output_location):
            stdoutf = open(context['stochkit_job'].stdout, 'r')
            context['stdout'] = stdoutf.read()
            stdoutf.close()
            stderrf = open(context['stochkit_job'].stderr, 'r')
            context['stderr'] = stderrf.read()
            stderrf.close()
          else:
            # Should never get here
            # But if we do, its likely because this was a cloud job and still need to grab the output from S3
            logging.info('No job output exists yet...')
            if stochkit_job.resource == 'Cloud' and stochkit_job.output_url is not None:
                logging.info('Fetching remote files from S3...')
                fetch_output_result = self.fetchCloudOutput(job)
                # Now, if the output was grabbed successfully, we can put stdout and stderr in the context
                if os.path.exists(stochkit_job.output_location):
                  logging.info('Placing stdout and stderr in the context...')
                  stdoutf = open(context['stochkit_job'].stdout, 'r')
                  context['stdout'] = stdoutf.read()
                  stdoutf.close()
                  stderrf = open(context['stochkit_job'].stderr, 'r')
                  context['stderr'] = stderrf.read()
                  stderrf.close()
        
        return context,result
    
    def fetchCloudOutput(self, stochkit_job_wrapper):
        '''
        '''
        try:
            result = {}
            stochkit_job = stochkit_job_wrapper.stochkit_job
            # Grab the remote files
            service = backendservices(self.user_data)
            service.fetchOutput(stochkit_job.pid, stochkit_job.output_url)
            
            # Unpack it to its local output location
            os.system('tar -xf' +stochkit_job.uuid+'.tar')
            stochkit_job.output_location = os.path.abspath(os.path.dirname(__file__))+'/../output/'+stochkit_job.uuid
            stochkit_job.output_location = os.path.abspath(stochkit_job.output_location)
            
            # Clean up
            os.remove(stochkit_job.uuid+'.tar')
            
            # Save the updated status
            stochkit_job_wrapper.put()
            
            result['status']=True
            result['msg'] = "Successfully fetched the remote output files."
            
        except Exception,e:
            logging.info('************************************* {0}'.format(e))
            result['status']=False
            result['msg'] = "Failed to fetch the remote files."
        return result

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
        #meanfile = params['job_folder']+'/output/stats/means.txt'
        #logging.info(str(meanfile))
        try:
            # Try to grab them from the mean.txt file
            if params['exec_type'] == 'deterministic':
                meanfile = params['job_folder'] + '/result/output.txt'
            else:
                meanfile = params['job_folder'] + '/result/stats/means.txt'
            
            #meanfile = params['job_folder']+'/output/stats/means.txt'
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
    
