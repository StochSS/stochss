try:
  import json
except ImportError:
  from django.utils import simplejson as json

import os
from google.appengine.ext import db
import boto
from backend.common.config import AgentTypes
from backend import backendservice
from backend.pricing import Price
from cloudtracker import CloudTracker
import simulation, spatial, sensitivity
import logging
from backend.databases.dynamo_db import DynamoDB

from stochssapp import BaseHandler

ALL_INSTANCE_TYPES = ['t1.micro', 'm1.small', 'm3.medium', 'm3.large', 'c3.large', 'c3.xlarge']

def get_all_jobs_time_cost(uuid, access_key, secret_key):
    
    database = DynamoDB(access_key, secret_key)
    results = database.getEntry('uuid', uuid, backendservice.backendservices.COST_ANALYSIS_TABLE)
             
    jobs = []
    if results is None:
        return jobs
    
    try:
        seen_instance_types = {} # so we don't get duplicate entries
        for result in results:
            job = {}
            job['agent'] = result['agent']
            job['instance_type'] = result['instance_type']
            if job['instance_type'] in seen_instance_types:
                continue
            else:
                seen_instance_types[job['instance_type']] = 1
            job['status'] = result['status']
            if 'time_taken' not in result:
                time = 0
            else:
                logging.info("time taken: {0}".format(result['time_taken']))
                time = result['time_taken']
                if time:
                    time = time.partition(' ')[0]#seconds
                else:
                    time = 0
                
            job['time'] = str(float(time)/60.00)
            
            cost_per_hour = Price.COST_TABLE_PER_HOUR['ec2'][job['instance_type']]
            job['cost'] = str( cost_per_hour * float(time)/3600.00)
            time_by_hour = int(float(time))/3600 + 1
            job['cost_by_hour'] = str(cost_per_hour * time_by_hour)
            
            logging.info('agent: '+job['agent']+', instance_type: '+job['instance_type']+', time: '+job['time']+', cost: '+job['cost']+', cost per hour: '+str(cost_per_hour)+', cost by hour: '+ job['cost_by_hour'])
            jobs.append(job)
        return jobs
    except Exception, e:
        logging.error("{0}".format(e))
        return {}
    
def get_best_instance_type(uuid, access_key, secret_key):
    jobs = get_all_jobs_time_cost(uuid, access_key, secret_key)
    min_cost = 9999999.00
    best_type = None
    for job in jobs:
        if float(job['time']) > 0.00:
            if job['cost'] < min_cost:
                min_cost = job['cost']
                best_type = job['instance_type']
    return best_type

class CostAnalysisPage(BaseHandler):
    """ The main handler for the Job Status Page. Displays status messages for the jobs, options to delete/kill jobs and
        options to view the Job metadata and Job results. """        
    def authentication_required(self):
        return True
    
    def get(self):
        
        params = self.request.GET
        id = params['id']    
        context = self.getContext(id, params['job_type'])
        context['id'] = params['id']
        context['job_type']= params['job_type'] 
        context['all_instance_types'] = ALL_INSTANCE_TYPES
        context['analyzed_instance_types'] = {x:True for x in ALL_INSTANCE_TYPES}
        for job in eval(context['jobs']):
            context['analyzed_instance_types'][job['instance_type']] = False
        self.render_response('cost_analysis.html', **context) 
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
          
        req_type = self.request.get('req_type')
        job_type = self.request.get('job_type')
        id = self.request.get('id')
        instance_type = self.request.get('instance_type')
        
        if req_type == 'analyze':
            logging.info('Analyzing the cost...')
            #job_type = params['job_type']
            
            logging.info('rerun cost analysis in '+instance_type)
            credentials =  self.user_data.getCredentials()
            access_key = credentials['EC2_ACCESS_KEY']
            secret_key = credentials['EC2_SECRET_KEY']
            backend_services = backendservice.backendservices()
            
            compute_check_params = {
                    "infrastructure": AgentTypes.EC2,
                    "credentials": credentials,
                    "key_prefix": self.user.user_id()
            }
            
            if not self.user_data.valid_credentials or not backend_services.isOneOrMoreComputeNodesRunning(compute_check_params, instance_type):
                logging.info('You must have at least one active '+instance_type+' compute node to run in the cloud.')
                self.response.write(json.dumps({
                    'status': False,
                    'msg': 'You must have at least one active '+instance_type+' compute node to run in the cloud.'
                }))
                return
            
            result = {}
            try:        
                    uuid, _ = self.get_uuid_name(id, job_type)
                    logging.info('start to rerun the job {0} for cost analysis'.format(str(uuid)))
                    # Set up CloudTracker with user credentials and specified UUID to rerun the job
                    ct = CloudTracker(access_key, secret_key, str(uuid), self.user_data.getBucketName())
                    has_prov = not ct.if_tracking() 
                    # If there is no provenance data for this job, report an error to the user
                    if not has_prov:
                        result = {'status':"fail",'msg':"The job with this ID does not exist or cannot be reproduced."}    
                        self.response.write(json.dumps(result))
                        return
                
                    params = ct.get_input()
                    
                    
                    cloud_result = backend_services.executeTask(params, "ec2", access_key, secret_key, uuid, instance_type, True)  #calls task(taskid,params,access_key,secret_key)
                    
                    if not cloud_result["success"]:
                        e = cloud_result["exception"]
                        result = {
                                  'status': False,
                                  'msg': 'Cloud execution failed: '+str(e)
                                 }
                        return result 
                    
                    result = {'status':True,'msg':'Cost analysis submitted successfully.'}
            
            
            except Exception,e:
                    result = {'status':False,'msg':'Cloud execution failed: '+str(e)}
            
        
        
        self.response.write(json.dumps(result))  
        

    def getContext(self, id, job_type):
        """ 
            Get the status of all the jobs that exist in the system and assemble a dict
            with info to display on the page. 
        """
        context = {} 
        context['uuid'], context['name']= self.get_uuid_name(id, job_type)

        
        credentials =  self.user_data.getCredentials()
        access_key = credentials['EC2_ACCESS_KEY']
        secret_key = credentials['EC2_SECRET_KEY']
        
        logging.info("UUID: "+context['uuid'])
        jobs = get_all_jobs_time_cost(context['uuid'], access_key, secret_key)

        
        context['jobs'] = json.dumps(jobs)
        
        return context
    
    def get_uuid_name(self, id, job_type):
        if job_type == 'stochkit':
            job = simulation.StochKitJobWrapper.get_by_id(int(id))
            name= job.name
            uuid = job.stochkit_job.pid
        elif job_type == 'spatial':
            job = spatial.SpatialJobWrapper.get_by_id(int(id))
            name = job.jobName
            uuid = job.cloud_id
        elif job_type == 'sensitivity':
            job = sensitivity.SensitivityJobWrapper.get_by_id(int(id))
            name = job.jobName
            uuid = job.cloudDatabaseID
        else:
            name = ''
            uuid = ''
            
        return uuid, name
        
