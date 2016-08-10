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

import molns

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
        ## 
        context = {}
        ##
        all_job_types = OrderedDict([('stochkit','Non-spatial Simulation'),('spatial','Spatial Simulation'),('sensitivity','Sensitivity'),('parameter_estimation','Parameter Estimation'),('parameter_sweep','Parameter Sweep'),('export','Data Export')])
        show_jobs={}
        context['job_type_option_list'] = ""
        for k,v in all_job_types.iteritems(): 
            show_jobs[k]=True
            if 'job_type' in self.request.GET and self.request.GET['job_type'] == k:
                context['job_type_option_list'] += "<option value=\"{0}\" SELECTED>{1}</option>".format(k,v)
            else:
                context['job_type_option_list'] += "<option value=\"{0}\">{1}</option>".format(k,v)
        context['filter_value_div']='inline'
        context['job_type_div']='none'
        service = backendservices(self.user_data)
        ## setup filters
        filter_types = ['type','name','model','resource','status']
        if 'filter_value' in self.request.GET:
            filter_value = self.request.GET['filter_value']
            context['seleted_filter_value'] = filter_value
        if 'filter_type' in self.request.GET:
            for f in filter_types:
                context['seleted_filter_type_'+f] = ''
            filter_type = self.request.GET['filter_type']
            context['seleted_filter_type_'+filter_type] = 'SELECTED'
        SQL_where_clause = "WHERE user_id = :1"
        SQL_where_data = [self.user.user_id()]
        ## process filters
        for k,v in self.request.GET.iteritems():
            #if k == 'job_type' and v != "":
            #    for k,v in show_jobs.iteritems(): show_jobs[k]=False
            #    if v in show_jobs: show_jobs[v] = True
            if k == "filter_type" and v == "type":# and 'job_type' in self.request.GET:
                for k,v in show_jobs.iteritems(): show_jobs[k]=False
                job_filter = self.request.GET['job_type']
                if job_filter in show_jobs: show_jobs[job_filter] = True
                context['filter_value_div']='none'
                context['job_type_div']='inline'
            elif k == "filter_type" and v == "name":
                SQL_where_clause = "WHERE user_id = :1 AND name = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "model":
                SQL_where_clause = "WHERE user_id = :1 AND modelName = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "resource":
                SQL_where_clause = "WHERE user_id = :1 AND resource = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "status":
                SQL_where_clause = "WHERE user_id = :1 AND resource = :2"
                SQL_where_data = [self.user.user_id(), filter_value]


        # StochKit jobs
        all_jobs = []
        if show_jobs['stochkit']:
            #all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
            all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
            if all_stochkit_jobs != None:
                jobs = list(all_stochkit_jobs.run())
                jobs = sorted(jobs,
                              key=lambda x:
                                    (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                         if hasattr(x, 'startTime') and x.startTime != None else datetime.datetime.now()),
                              reverse=True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    all_jobs.append(self.__process_getJobStatus(service, job, number))
        context['all_jobs']=all_jobs

        # Sensitivity
        allSensJobs = []
        if show_jobs['sensitivity']:
            #allSensQuery = db.GqlQuery("SELECT * FROM SensitivityJobWrapper WHERE user_id = :1", self.user.user_id())
            allSensQuery = db.GqlQuery("SELECT * FROM SensitivityJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
            if allSensQuery != None:
                jobs = list(allSensQuery.run())
                jobs = sorted(jobs,
                              key=lambda x:
                                    (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                     if hasattr(x, 'startTime') and x.startTime != None else ''),
                              reverse = True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allSensJobs.append(self.__process_getJobStatus(service, job, number))
        context['allSensJobs']=allSensJobs


        # Export
        allExportJobs = []
        if show_jobs['export']:
            #exportJobsQuery = db.GqlQuery("SELECT * FROM ExportJobWrapper WHERE user_id = :1", self.user.user_id())
            exportJobsQuery = db.GqlQuery("SELECT * FROM ExportJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
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
        if show_jobs['parameter_estimation']:
            #allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE user_id = :1", self.user.user_id())
            allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper {0}".format(SQL_where_clause), *SQL_where_data) 
            if allParameterJobsQuery != None:
                jobs = list(allParameterJobsQuery.run())
                jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allParameterJobs.append(self.__process_getJobStatus(service, job, number))
        context['allParameterJobs'] = allParameterJobs

        #Spatial Jobs
        allSpatialJobs = []
        if show_jobs['spatial']:
            #allSpatialJobsQuery = db.GqlQuery("SELECT * FROM SpatialJobWrapper WHERE user_id = :1", self.user.user_id())
            allSpatialJobsQuery = db.GqlQuery("SELECT * FROM SpatialJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
            if allSpatialJobsQuery != None:
                jobs = list(allSpatialJobsQuery.run())
                jobs = sorted(jobs,
                              key=lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                                  if hasattr(x, 'startTime') and x.startTime != None else ''),
                              reverse = True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allSpatialJobs.append(self.__process_getJobStatus(service, job, number))
        context['allSpatialJobs'] = allSpatialJobs

        #Parameter Sweep Jobs
        allParameterSweepJobs = []
        if show_jobs['parameter_sweep']:
            #allParameterSweepJobsQuery = db.GqlQuery("SELECT * FROM ParameterSweepJobWrapper WHERE user_id = :1", self.user.user_id())
            allParameterSweepJobsQuery = db.GqlQuery("SELECT * FROM ParameterSweepJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
            if allParameterSweepJobsQuery != None:
                jobs = list(allParameterSweepJobsQuery.run())
                jobs = sorted(jobs,
                              key=lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S')
                                                  if hasattr(x, 'startTime') and x.startTime != None else ''),
                              reverse = True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allParameterSweepJobs.append(self.__process_getJobStatus(service,job, number))
        context['allParameterSweepJobs'] = allParameterSweepJobs
    
        return context

    def __process_getJobStatus(self,service,job,number):
        try:
            molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()

            if molnsConfigDb:
                config = molns.MOLNSConfig(config_dir = molnsConfigDb.folder)

            status = getJobStatus(service, job, config)
        except Exception as e:
            traceback.print_exc()
            status = {  "status" : 'Error: {0}'.format(e),
                        "name" : job.name,
                        "uuid" : job.cloudDatabaseID if hasattr(job, 'cloudDatabaseID') else None,
                        "output_stored": None,
                        "resource": 'Error',
                        "id" : job.key().id()}
        status['number'] = number
        return status


def getJobStatus(service, job, molnsConfig = None):
        logging.debug('status.getJobStatus() job = {0}'.format(job))
        logging.debug('status.getJobStatus() job.status={0} job.resource={1} job.outData={2}'.format(job.status, job.resource, job.outData))
        #indata = json.loads(job.indata)
        file_to_check = "{0}/return_code".format(job.outData)
        logging.debug('status.getJobStatus() file_to_check={0}'.format(file_to_check))
        logging.debug('status.getJobStatus() job.outData={0}'.format(job.outData))
        if job.resource is None:
            return { "status" : 'Error',
                    "name" : job.name,
                    "uuid" : job.cloudDatabaseID,
                    "output_stored": None,
                    "resource": None,
                    "id" : job.key().id()}

        return_code = None
        try:
            if os.path.exists(file_to_check):
                with open(file_to_check, 'r') as fd:
                    line = fd.readline().strip()
                
                    if len(line) > 0:
                        return_code = int(line)
        except Exception as e:
            logging.exception(e)
            job.status = "Failed"

        if job.outData is not None and return_code is not None:
            # job finished
            logging.debug('status.getJobStatus() file_to_check={0} return_code={1}'.format(file_to_check, return_code))
            if job.kind() == 'StochKitJobWrapper':
                if os.path.exists("{0}/result/log.txt".format(job.outData)):
                    job.status = "Failed"
                else:
                    job.status = "Finished"
            else:
                if return_code == 0:
                    job.status = "Finished"
                else:
                    job.status = "Failed"
        elif job.resource.lower() == "local":
            # running Locally
            # check if the job is still running
            res = service.checkTaskStatusLocal([job.pid])
            if res[job.pid] and job.pid:
                job.status = "Running"
            else:
                job.status = "Failed"
        elif job.resource.lower() == "molns":
            if molnsConfig:
                job_status = molns.MOLNSExec.job_status([job.molnsPID], molnsConfig)
                  
                status = 'Running' if job_status['running'] else 'Finished'
                  
                if status == 'Finished':
                    with open(file_to_check, 'w') as f:
                        f.write('0')

                job.status = status
            else:
                job.status = 'Unknown'

        elif job.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            # running in cloud
            task_status = service.describeTasks(job)
            logging.info('status.getJobStatus()  task_status =\n{}'.format(pprint.pformat(task_status)))

            if task_status is None:
                job.status = "Inaccessible"
                logging.debug("status.getJobStatus() job.status = {0}".format(job.status))
                job_status = None
            elif task_status is not None and job.cloudDatabaseID not in task_status:
                job.status = "Unknown"
                logging.debug("status.getJobStatus() job.status = {0}".format(job.status))
            else:
                job_status = task_status[job.cloudDatabaseID]
                if job_status is None or 'status' not in job_status:
                    job.status = "Unknown"
                    logging.debug("status.getJobStatus() job.status = {0}".format(job.status))
                elif job_status['status'] == 'finished':
                    job.outputURL = job_status['output']
                    job.uuid = job_status['uuid']
                    job.status = 'Finished'
                    logging.debug("status.getJobStatus() job.status = {0}".format(job.status))

                elif job_status['status'] == 'failed':
                    job.status = 'Failed'
                    logging.debug("status.getJobStatus() job.status = {0}".format(job.status))
                    job.exception_message = job_status['message']
                    # Might not have a uuid or output if an exception was raised early on or if there is just no output available
                    try:
                        job.uuid = job_status['uuid']
                        job.outputURL = job_status['output']
                    except KeyError:
                        pass

                elif job_status['status'] == 'pending':
                    job.status = 'Pending'
                    logging.debug("status.getJobStatus() job.status = {0}".format(job.status))
                else:
                    # The state gives more fine-grained results, like if the job is being re-run, but
                    #  we don't bother the users with this info, we just tell them that it is still running.
                    job.status = 'Running'
                    logging.debug("status.getJobStatus() job.status = {0}".format(job.status))

        job.put()
        
        return { "status" : job.status,
                 "name" : job.name,
                 "uuid" : job.cloudDatabaseID if hasattr(job, 'cloudDatabaseID') else None,
                 "output_stored": job.output_stored if hasattr(job, 'output_stored') else None,
                 "resource": job.resource,
                 "id" : job.key().id() }

