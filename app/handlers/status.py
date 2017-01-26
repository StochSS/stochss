try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import dateutil.tz
import pytz
import logging
import traceback
import __future__
import time
import shutil
import os
import subprocess
import pickle
import tempfile
import datetime
import pprint
import fileserver

from google.appengine.ext import db

from stochssapp import BaseHandler
from backend.backendservice import backendservices
from backend.common.config import AgentTypes, JobDatabaseConfig

import sensitivity
import simulation
import spatial
import stochoptim
import cluster_execution
import cluster_execution.remote_execution
import cluster_execution.cluster_parameter_sweep
import cluster_execution.cluster_execution_exceptions

import molns

class StatusPage(BaseHandler):
    """ The main handler for the Job Status Page. Displays status messages for the jobs, options to delete/kill jobs and
        options to view the Job metadata and Job results. """        

    def __init__(self, request, response):
        BaseHandler.__init__(self, request, response)
        self.molnsConfig = None       

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
                job_filter = self.request.GET['job_type']
                if job_filter != '':
                    if job_filter in show_jobs:
                        for k,v in show_jobs.iteritems(): show_jobs[k]=False
                        show_jobs[job_filter] = True
                context['filter_value_div']='none'
                context['job_type_div']='inline'
            elif k == "filter_type" and v == "name" and filter_value != '':
                SQL_where_clause = "WHERE user_id = :1 AND name = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "model" and filter_value != '':
                SQL_where_clause = "WHERE user_id = :1 AND modelName = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "resource" and filter_value != '':
                SQL_where_clause = "WHERE user_id = :1 AND resource = :2"
                SQL_where_data = [self.user.user_id(), filter_value]
            elif k == "filter_type" and v == "status" and filter_value != '':
                SQL_where_clause = "WHERE user_id = :1 AND resource = :2"
                SQL_where_data = [self.user.user_id(), filter_value]


        all_jobs_together = []
        # StochKit jobs
        all_jobs = []
        if show_jobs['stochkit']:
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
        all_jobs_together.extend(all_jobs)

        # Sensitivity
        allSensJobs = []
        if show_jobs['sensitivity']:
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
        all_jobs_together.extend(allSensJobs)


        # Export
        allExportJobs = []
        if show_jobs['export']:
            exportJobsQuery = db.GqlQuery("SELECT * FROM ExportJobWrapper {0}".format(SQL_where_clause), *SQL_where_data)
            if exportJobsQuery != None:
                jobs = list(exportJobsQuery.run())
                jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)

                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allExportJobs.append(self.__process_getJobStatus(service, job, number))
        context['allExportJobs'] = allExportJobs
        all_jobs_together.extend(allExportJobs)

        # Parameter Estimation
        allParameterJobs = []
        if show_jobs['parameter_estimation']:
            allParameterJobsQuery = db.GqlQuery("SELECT * FROM StochOptimJobWrapper {0}".format(SQL_where_clause), *SQL_where_data) 
            if allParameterJobsQuery != None:
                jobs = list(allParameterJobsQuery.run())
                jobs = sorted(jobs, key = lambda x : (datetime.datetime.strptime(x.startTime, '%Y-%m-%d-%H-%M-%S') if hasattr(x, 'startTime') and x.startTime != None else ''), reverse = True)
                for number, job in enumerate(jobs):
                    number = len(jobs) - number
                    allParameterJobs.append(self.__process_getJobStatus(service, job, number))
        context['allParameterJobs'] = allParameterJobs
        all_jobs_together.extend(allParameterJobs)

        #Spatial Jobs
        allSpatialJobs = []
        if show_jobs['spatial']:
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
        all_jobs_together.extend(allSpatialJobs)

        #Parameter Sweep Jobs
        allParameterSweepJobs = []
        if show_jobs['parameter_sweep']:
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
        all_jobs_together.extend(allParameterSweepJobs)
        # Sort the jobs
        all_jobs_together.sort(key=lambda x: (datetime.datetime.strptime(x['startTime'], '%Y-%m-%d-%H-%M-%S')
                                         if 'startTime' in x and x['startTime'] != None else datetime.datetime.now()),
                              reverse=True)
        context['all_jobs_together'] = all_jobs_together
        
        if 'time_zone_name' in self.request.cookies:
            #logging.info("time_zone_name = {0}".format(self.request.cookies.get('time_zone_name')))
            context['time_zone_name'] = "({0})".format(self.request.cookies.get('time_zone_name'))
        else:
            context['time_zone_name'] = '(UTC)'
        logging.info("STATUS: CONTEXT \n {0}".format(context))
        return context

    def __process_getJobStatus(self,service,job, number):
        try:
            if self.molnsConfig is None:
                molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()
                if molnsConfigDb:
                    self.molnsConfig = molns.MOLNSConfig(config_dir = molnsConfigDb.folder)

            status = self.getJobStatus(service, job, self.molnsConfig)
        except Exception as e:
            traceback.print_exc()
            status = {  "status" : 'Error: {0}'.format(e),
                        "name" : job.name,
                        "uuid" : job.cloudDatabaseID if hasattr(job, 'cloudDatabaseID') else None,
                        "output_stored": None,
                        "resource": 'Error',
                        "id" : job.key().id()}
        status["number"] = number
        return status


    def getJobStatus(self, service, job, molnsConfig = None):
            file_to_check = "{0}/return_code".format(job.outData)
            jobType = '(unknown kind={0})'.format(job.kind())
            if job.kind() == 'ExportJobWrapper':
                jobName = os.path.basename(job.outData)
            else:
                jobName = job.name

            if job.kind() == 'StochKitJobWrapper':
                jobActionUrl = '/simulate?id={0}'.format(job.key().id())
                jobResultUrl = '/simulate?id={0}'.format(job.key().id())
                indata = json.loads(job.indata)
                if indata['exec_type'] ==  'deterministic':
                    jobType = 'Deterministic Simulation'
                else:
                    jobType = 'Stochastic Simulation'
            elif job.kind() == 'SpatialJobWrapper':
                jobActionUrl = '/spatial?id={0}'.format(job.key().id())
                jobResultUrl = '/spatial?id={0}'.format(job.key().id())
                jobType = 'Spatial Simulation'
            elif job.kind() == 'SensitivityJobWrapper':
                jobActionUrl = '/sensitivity?id={0}'.format(job.key().id())
                jobResultUrl = '/sensitivity?id={0}'.format(job.key().id())
                jobType = 'Sensitivity Analysis'
            elif job.kind() == 'StochOptimJobWrapper':
                jobActionUrl = '/stochoptim?id={0}'.format(job.key().id())
                jobResultUrl = '/stochoptim/{0}'.format(job.key().id())
                jobType = 'Parameter Estimation'
            elif job.kind() == 'ParameterSweepJobWrapper':
                jobActionUrl = '/parametersweep?id={0}'.format(job.key().id())
                jobResultUrl = '/parametersweep/{0}'.format(job.key().id())
                jobType = 'Parameter Sweep'
            elif job.kind() == 'ExportJobWrapper':
                jobActionUrl = '/export?id={0}'.format(job.key().id())
                jobResultUrl = "/static/tmp/{0}".format(os.path.basename(job.outData))
                jobType = 'Export'
            
            dateobj = datetime.datetime.strptime(job.startTime, '%Y-%m-%d-%H-%M-%S')
            if 'time_zone_utc_offset' in self.request.cookies:
                dateobj2 = dateobj - datetime.timedelta(hours=int(self.request.cookies.get('time_zone_utc_offset')))
                datestr = dateobj2.strftime('%b-%d-%y %H:%M')
                #logging.info("time_zone_utc_offset = {0}".format(self.request.cookies.get('time_zone_utc_offset')))
            else:
                datestr = dateobj.strftime('%b-%d-%y %H:%M')

            if job.kind() == 'ExportJobWrapper':
                return { "status" : job.status,
                     "name" : jobName,
                     "type" : jobType,
                     "actionURL" : jobActionUrl,
                     "resultURL" : jobResultUrl,
                     "uuid" : None,
                     "output_stored": None,
                     "resource": "local",
                     "start_time" : str(datestr),
                     "startTime" : job.startTime,
                     "id" : job.key().id() }
                
            if job.resource is None:
                return { "status" : 'Error',
                        "name" : jobName,
                        "type" : jobType,
                        "actionURL" : jobActionUrl,
                        "resultURL" : jobResultUrl,
                        "uuid" : job.cloudDatabaseID,
                        "output_stored": None,
                        "resource": None,
                        "start_time" : 'none',#datetime.datetime.strptime(job.startTime, '%Y-%m-%d-%H-%M-%S').replace(tzinfo=dateutil.tz.tzutc()).astimezone(dateutil.tz.tzlocal()),
                        "startTime" : job.startTime,
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
            elif job.resource.lower() == "qsub":  # TODO
                cluster_node_info = self.user_data.get_cluster_node_info()[0]
                files = fileserver.FileManager.getFiles(self, 'clusterKeyFiles')
                cluster_ssh_key_info = {f['id']: {'id': f['id'], 'keyname': f['path']} for f in files}

                cluster_info = dict()
                cluster_info['ip_address'] = cluster_node_info['ip']
                cluster_info['username'] = cluster_node_info['username']
                cluster_info['ssh_key'] = fileserver.FileWrapper.get_by_id(
                    cluster_ssh_key_info[cluster_node_info['key_file_id']]['id']).storePath

                rh = cluster_execution.remote_execution.RemoteHost(cluster_info['ip_address'], cluster_info['username'], cluster_info['ssh_key'], port=22)

                cps = cluster_execution.cluster_parameter_sweep.ClusterParameterSweep(model_cls = None, parameters = None, remote_host = rh)

                if job.status != "Finished" and job.status != "Failed":
                    try:
                        val = cps.get_sweep_result(pickle.loads(job.qsubHandle))
                        # TODO delete this
                        print val

                        results = []
                        for nm in val:
                            results.append({ "parameters" : nm.parameters, "result" : nm.result })

                        with open(os.path.join(job.outData, 'results'), 'w') as f:
                            pickle.dump(results, f)

                        with open(file_to_check, 'w') as f:
                            f.write('0')

                        status = "Finished"
                    except cluster_execution.cluster_execution_exceptions.RemoteJobNotFinished as e:
                        status = "Running"
                    except cluster_execution.cluster_execution_exceptions.RemoteJobFailed as e:
                        status = "Failed"

                        with open(file_to_check, 'w') as f:
                            f.write('1')

                job.status = status
                #status = qsub.check_status(job.qsubjob)
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
                     "type" : jobType,
                     "actionURL" : jobActionUrl,
                     "resultURL" : jobResultUrl,
                     "uuid" : job.cloudDatabaseID if hasattr(job, 'cloudDatabaseID') else None,
                     "output_stored": job.output_stored if hasattr(job, 'output_stored') else None,
                     "resource": job.resource,
                     "start_time" : str(datestr),
                     "startTime" : job.startTime,
                     "id" : job.key().id() }

