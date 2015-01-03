import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))

import json
import datetime
from google.appengine.ext import db
from stochssapp import BaseHandler
import sensitivity
import spatial
from cloudtracker import CloudTracker
import s3_helper
import logging
import shutil
from backend import tasks
from backend.backendservice import backendservices

DEFAULT_BUCKET_NAME = ''

class DataReproductionPage(BaseHandler):
    """ The main handler for the Data Reproduction Page."""        
    def authentication_required(self):
        return True
    
#     def get(self):
#         context = self.getContext()
#         self.render_response('reproduce.html', **context)
        
    def post(self):
        
        self.response.content_type = 'application/json'
        req_type = self.request.get('req_type')
        
        credentials = self.user_data.getCredentials()
        os.environ["AWS_ACCESS_KEY_ID"] = credentials['EC2_ACCESS_KEY']
        os.environ["AWS_SECRET_ACCESS_KEY"] = credentials['EC2_SECRET_KEY']
        access_key = credentials['EC2_ACCESS_KEY']
        secret_key = credentials['EC2_SECRET_KEY']
        
        if req_type == 'delOutput':
            uuid = self.request.get('uuid')
            
            try:
                #delete the output tar file
                s3_helper.delete_file(self.user_data.getBucketName(), 'output/'+uuid+'.tar', access_key, secret_key)
                logging.info('delete the output tar file output/{1}.tar in bucket {0}'.format(self.user_data.getBucketName(), uuid))
                
                job_type = self.request.get('job_type')
                
                if job_type == 'stochkit':
                    job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND cloud_id = :2", self.user.user_id(),uuid).get()       
                    job.output_stored = 'False'
                    job.put()
                elif job_type == 'sensitivity':
                    job = sensitivity.SensitivityJobWrapper.all().filter('userId =', self.user.user_id()).filter('cloudDatabaseID =', uuid).get()
                    job.output_stored = 'False'
                    job.outData = None
                    job.put()
                elif job_type == 'spatial':
                    job = spatial.SpatialJobWrapper.all().filter('userId =', self.user.user_id()).filter('cloud_id =', uuid).get()  
                    job.output_stored = 'False'
                    job.outData = None
                    job.put()   
                
                # delete the local output if any
                output_path = os.path.join(os.path.dirname(__file__), '../output/')
                if os.path.exists(str(output_path)+uuid):
                    shutil.rmtree(str(output_path)+uuid)
                    
                result = {'status':True,'msg':'Output deleted successfully.'}
            except Exception as e:
                logging.error(e)
                result = {'status':False,'msg':'Fail to delete output in the cloud: '+str(e)}
            
            self.response.write(json.dumps(result))
            return
        
        elif req_type == 'rerun':
        
            service = backendservices()
        
            compute_check_params = {
                    "infrastructure": "ec2",
                    "credentials": self.user_data.getCredentials(),
                    "key_prefix": self.user.user_id()
            }
            if not self.user_data.valid_credentials or not service.isOneOrMoreComputeNodesRunning(compute_check_params):
                self.response.write(json.dumps({
                    'status': False,
                    'msg': 'You must have at least one active compute node to run in the cloud.'
                }))
                return
        
            job_type = self.request.get('job_type')
            uuid = self.request.get('uuid')

            logging.info('job uuid: '.format(uuid))
            
            
          
        
            if job_type == 'stochkit':
              
                job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND cloud_id = :2", self.user.user_id(),uuid).get()       
            
        
                try:        
                    logging.info('start to rerun the job {0}'.format(str(uuid)))
                    # Set up CloudTracker with user credentials and specified UUID to rerun the job
                    ct = CloudTracker(access_key, secret_key, str(uuid), self.user_data.getBucketName())
                    has_prov = not ct.if_tracking() 
                    # If there is no provenance data for this job, report an error to the user
                    if not has_prov:
                        result = {'status':False,'msg':"The job with this ID does not exist or cannot be reproduced."}
                        self.response.content_type = 'application/json'    
                        self.response.write(json.dumps(result))
                        return
                
                    params = ct.get_input()
                    logging.info("OUT_PUT SIZE: {0}".format(params['output_size']))
                
                    time = datetime.datetime.now()
                    cloud_result = service.executeTask(params, "ec2", access_key, secret_key, uuid)  #calls task(taskid,params,access_key,secret_key)
                    
                    if not cloud_result["success"]:
                        e = cloud_result["exception"]
                        result = {
                                  'status': False,
                                  'msg': 'Cloud execution failed: '+str(e)
                                 }
                        return result 
                    # The celery_pid is the Celery Task ID.
                    job.stochkit_job.celery_pid = cloud_result["celery_pid"]
                    job.stochkit_job.status = 'Running'
                    job.stochkit_job.output_location = None
                    job.output_stored = 'True'
            
                    job.startDate = time.strftime("%Y-%m-%d-%H-%M-%S")
            
                    job.put()
                    result = {'status':True,'msg':'Job rerun submitted sucessfully.'}
            
            
                except Exception,e:
                    result = {'status':False,'msg':'Cloud execution failed: '+str(e)}
            
                
                self.response.write(json.dumps(result))
                return
        
            elif job_type == 'sensitivity':
                job = sensitivity.SensitivityJobWrapper.all().filter('userId =', self.user.user_id()).filter('cloudDatabaseID =', uuid).get()
            
                try:
                    ct = CloudTracker(access_key, secret_key, str(uuid), self.user_data.getBucketName())
                    has_prov = not ct.if_tracking() 
                    # If there is no provenance data for this job, report an error to the user
                    if not has_prov:
                        result = {'status':False,'msg':"The job with this ID does not exist or cannot be reproduced."}
                        self.response.content_type = 'application/json'    
                        self.response.write(json.dumps(result))
                        return
                
                    params = ct.get_input()
                
                    time = datetime.datetime.now()
                    cloud_result = service.executeTask(params, "ec2", access_key, secret_key, uuid)  #calls task(taskid,params,access_key,secret_key)
                    
                    if not cloud_result["success"]:
                        e = cloud_result["exception"]
                        result = {
                                  'status': False,
                                  'msg': 'Cloud execution failed: '+str(e)
                                 }
                        return result 
                    
                    # The celery_pid is the Celery Task ID.
                    job.status = "Running"    
                    job.celeryPID = cloud_result["celery_pid"]
                    job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
                    job.output_stored = 'True'
                    job.put()
                    result = {'status':True,'msg':'Job rerun submitted sucessfully.'}
            
                except Exception,e:
                    result = {'status':False,'msg':'Cloud execution failed: '+str(e)}
            
                
                self.response.write(json.dumps(result))
                return  
        
            elif job_type == 'spatial':
                job = spatial.SpatialJobWrapper.all().filter('userId =', self.user.user_id()).filter('cloud_id =', uuid).get()  
            
                try:
                    ct = CloudTracker(access_key, secret_key, str(uuid), self.user_data.getBucketName())
                    has_prov = not ct.if_tracking() 
                    # If there is no provenance data for this job, report an error to the user
                    if not has_prov:
                        result = {'status':False,'msg':"The job with this ID does not exist or cannot be reproduced."}
                        self.response.content_type = 'application/json'    
                        self.response.write(json.dumps(result))
                        return
                
                    params = ct.get_input()
                
                    time = datetime.datetime.now()
                    cloud_result = service.executeTask(params, "ec2", access_key, secret_key, uuid)  #calls task(taskid,params,access_key,secret_key)
                    
                    if not cloud_result["success"]:
                        e = cloud_result["exception"]
                        result = {
                                  'status': False,
                                  'msg': 'Cloud execution failed: '+str(e)
                                 }
                        return result 
                    
                    job.status = "Running"    
                    job.celeryPID = cloud_result["celery_pid"]
                    job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
                    job.output_stored = 'True'
                    job.put()
                    result = {'status':True,'msg':'Job rerun submitted sucessfully.'}
            
                except Exception,e:
                    result = {'status':False,'msg':'Cloud execution failed: '+str(e)}
            
                
                self.response.write(json.dumps(result))
                return
            
            else:
                self.response.write(json.dumps({'status': False, 'msg': 'Unknown job type.'}))
                
        else:
            self.response.write(json.dumps({'status': False, 'msg': 'Unknown requested type.'}))



        
