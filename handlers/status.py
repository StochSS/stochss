try:
  import json
except ImportError:
  from django.utils import simplejson as json

from collections import OrderedDict
import logging
import traceback
import __future__
import time

from google.appengine.ext import db

import os
from stochssapp import BaseHandler
from stochss.backendservice import *
from backend.backendservice import backendservices

import shutil

try:
    #sys.path.append('/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python')
    #sys.path.append('/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/numpy')
    import numpy as np
    from matplotlib import pylab
except:
    pass

class StatusPage(BaseHandler):
    
    def get(self):
        #all_urls = self.get_all_urls()
        context = self.getContext()
        self.render_response('status.html', **context)
        
    def post(self):
        
        params = self.request.POST
        
        if 'delete' in params:
            # The jobs to delete are specified in the checkboxes 
            print "Deleting selected elements"
            jobs_to_delete = params.getall('select_job')
            
            service = backendservices()

            # Select the jobs to delete from the datastore
            result = {}
            for job_name in jobs_to_delete:
                try:
                    job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
                    stochkit_job = job.stochkit_job
                except Exception,e:
                    result = {'status':False,'msg':"Could not retreive the jobs"+job_name+ " from the datastore."}
        
                # TODO: Call the backend to kill and delete the job and all associated files from EC2/local storage.
                try:
                    service.deleteTaskLocal([stochkit_job.pid])
                    isdeleted_backend = True
                except Exception,e:
                    isdeleted_backend = False
                    result['status']=False
                    result['msg'] = "Failed to kill task with PID " + str(stochkit_job.pid) + str(e)
                        
                if isdeleted_backend:
                    # Delete all the files and delete the job from the datastore
                    try:
                        # We remove the local entry of the job output directory
                        shutil.rmtree(stochkit_job.output_location)
                        # TODO: Check if it is a Cloud job, and in that case call the
                        # backend to clean up all files from the remote end.
                        db.delete(job)
                    except Exception,e:
                        result = {'status':False,'msg':"Failed to delete job "+job_name}

            # Render the page
                            
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
            Get information about all the jobs that exist in the system and assemble a dict
            with info to display on the page. 
        """
        context = {}
        result = {}
        service = backendservices()
        # Grab references to all the user's StochKitJobs in the system
        all_stochkit_jobs = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1", self.user.user_id())
        if all_stochkit_jobs == None:
            context['no_jobs'] = 'There are no jobs in the system.'
        else:
            # We want to display the name of the job, the status of the Job, and if it is
            # completed, the URL where the user can download the output.
            all_jobs = []
            for job in all_stochkit_jobs.run():
                
                # Get the job id
                stochkit_job = job.stochkit_job
                
                # Query the backend for the status of the job, but only if the current status is not Finished
                if not stochkit_job.status == "Finished":
                    try:
                        if stochkit_job.resource == 'Local':
                            # First, check if the job is still running
                            res = service.checkTaskStatusLocal([stochkit_job.pid])
                            if res[stochkit_job.pid]:
                                stochkit_job.status = "Running"
                            else:
                                # Check if the output folder is present, in which case the job finsihed sucessfully.
                                if os.path.exists(stochkit_job.output_location+"/result"):
                                    stochkit_job.status = "Finished"
                                else:
                                    stochkit_job.status = "Failed"
                        elif stochkit_job.resource == 'Cloud':
                            # Retrive credentials from the datastore
                            try:
                                db_credentials = db.GqlQuery("SELECT * FROM CredentialsWrapper WHERE user_id = :1", self.user.user_id()).get()
                            except:
                                return {'status':False,'msg':'Could not retrieve the status of job '+stochkit_job.name +'. Failed to retrive the EC2 credentials.'}
                            # Check the status on the remote end
                            taskparams = {'AWS_ACCESS_KEY_ID':db_credentials.access_key,'AWS_SECRET_ACCESS_KEY':db_credentials.secret_key,'taskids':[stochkit_job.pid]}
                            task_status = service.describeTask(taskparams)
                            if task_status == None:
                                return {'status':False,'msg':'Could not retrieve the status of job '+stochkit_job.name }

                            job_status = task_status[stochkit_job.pid]
        
                            if job_status['state'] == 'SUCCESS':
                                stochkit_job.status = 'Finished'
                                print job_status
                                stochkit_job.output_url = job_status['output']
                            elif job_status['state'] == 'FAILED':
                                stochkit_job.status == 'Failed'
                            else:
                                # The state gives more fine-grained results, like if the job is being rerun, but
                                #  we don't bother the users of the UI with this. 
                                job_status.status == 'Running'
                
                        # Todo, implement check in the case of Cloud
                    except Exception,e:
                        result = {'status':False,'msg':'Could not determine the status of the jobs.'+str(e)}
                
                all_jobs.append(stochkit_job)
                # Save changes to the status
                job.put()
                #job_status.append(self.getJobStatus(task_id))
                
        context['all_jobs']=all_jobs
    
        return dict(result,**context)

    def getJobStatus(self,task_id):
        # TODO: request the status from the backend.
        return True

    def get_all_urls(self):
        """
            Get the URLs of 
        """
        model = self.get_session_property('model_edited')
        if model is None:
            return None
        else:
        	result = backendservice.describeTask(valid_username)
		self.render_response('status.html', **result)


class JobOutPutPage(BaseHandler):

    def get(self):
        context,result = self.getContext()
        self.render_response('stochkitjoboutputpage.html',**dict(result,**context))

    def post(self):
        context,result = self.getContext()
        result = {}
        logging.info(context)
        if 'fetch_remote' in context:
            logging.info("TRYING TO FETCH FILES")
            service = backendservices()
            job = context['stochkit_job']
            try:
                service.fetchOutput(job.pid)
            except:
                result['status']=False
                result['msg'] = "Failed to fetch the remote files."
        context,result = self.getContext()
        self.render_response('stochkitjoboutputpage.html',**dict(result,**context))


    def getContext(self):
        context = self.request.POST
        context = dict(context,**self.request.GET)

        job_name = context['job_name']
        result = {}
        
        # Grab the Job from the datastore
        try:
            job = db.GqlQuery("SELECT * FROM StochKitJobWrapper WHERE user_id = :1 AND name = :2", self.user.user_id(),job_name).get()
            stochkit_job = job.stochkit_job
            context['stochkit_job']=stochkit_job
        except Exception,e:
            result = {'status':False,'msg':"Could not retreive the jobs"+job_name+ " from the datastore."}
        
        # Check if the results and stats folders are present locally
        if os.path.exists(stochkit_job.output_location+"/result"):
            context['local_data']=True
        if os.path.exists(stochkit_job.output_location+"/result/stats"):
            context['local_statistics']=True
            
        return context,result

class VisualizePage(BaseHandler):
    """ Basic Visualization """

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
           
        self.render_response('visualizepage.html',**dict(result,**context))
    
    def post(self):
        result = {}
        context = self.getContext()
        logging.info(context)
        # Get the species names
        species_names = self.getSpeciesNames(context)
        if species_names == None:
            result['status'] = False
            result['msg'] = 'Failed to retrive the species names'
        context['species_names'] = species_names
        
        trajectory_number = context['trajectory_number']
        species_name = context['species_name']
        species_time_series = self.getTrajectory(context,trajectory_number,species_name)
        if species_time_series is None:
            logging.info("ERRERRERERERRER")
        context['species_time_series']=species_time_series
            
        self.render_response('visualizepage.html',**dict(result,**context))
        
    def getTrajectory(self, params, trajectory_number, species_name):
        """ Get data from a specific trajectory in the StochKit output folder. """
        logging.info(params)
        try:
            meanfile = params['job_folder']+'/result/trajectories/trajectory0.txt'
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
            
    def getSpeciesNames(self,params):
        """ Get a list with the species names. 
            The result folder have to be populated in advance. """
        meanfile = params['job_folder']+'/result/stats/means.txt'
        logging.info(str(meanfile))
        try:
            # Try to grab them from the mean.txt file
            meanfile = params['job_folder']+'/result/stats/means.txt'
            file = open(meanfile,'rb')
            row = file.readline()
            logging.info(str(row))
            species_names = row.strip().split('\t')
            file.close()
        except Exception, e:
            logging.info(str(e))
            return None
            # Try to grab them from a trajectory file
            #     meanfile = params['job_folder']+'/result/trajectories/trajectory0.txt'
            # file = open(meanfile,'rb')
            #row = file.readline()
                #species_names = row.strip().split('\t')
                
        # The first value is always 'time' 
        return species_names[1:]

    def getContext(self):
        params = self.request.POST
        params = dict(params,**self.request.GET)
        return params
    
