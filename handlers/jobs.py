'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import json
import os

from jupyterhub.handlers.base import BaseHandler
from tornado import web # handle authentication
from handlers.db_util import checkUserOrRaise

import logging
log = logging.getLogger()
from handlers import stochss_kubernetes


class JobInfoAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting Job Info including start date tine and path to the 
    model at the last job save.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, info_path):
        '''
        Retrieve job info from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        info_path : str
            Path to selected jobs info file within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        log.debug(info_path)
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        full_path = "/home/jovyan{0}".format(info_path) # full path to job info
        json_data = stochss_kubernetes.read_from_pod(client, 
            user_pod, full_path) # Use cat to read json file
        self.write(json_data) # Send data to client


class RunJobAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for running jobs.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, opt_type, data):
        '''
        Start running a job and record the time in UTC in the job_info file.
        Creates job directory and job_info file if running a new job.  Copys 
        model into the job directory.

        Attributes
        ----------
        opt_type : str
            type of job being run (rn) for new job (re) for existing job.
        data : str
            Path to selected jobs model file and name of job within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        model_path, job_name = data.split('/<--GillesPy2Job-->/') # get model path and job name from data
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        log.warn('starting the job')
        exec_cmd = "screen -d -m run_job.py {} {} {}".format(model_path, job_name).split(" ") # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('sent the job')


class SaveJobAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for saving jobs.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, opt_type, data):
        '''
        Start saving the job.  Creates the job directory and job_info file if
        saving a new job.  Copys model into the job directory.

        Attributes
        ----------
        opt_type : str
            type of job being run (rn) for new job (re) for existing job.
        data : str
            Path to selected jobs model file and name of job within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        model_path, job_name = data.split('/<--GillesPy2Job-->/') # get model path and job name from data
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd = [ "run_job.py", model_path, job_name ] # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.warn(exec_cmd)
        stochss_kubernetes.run_script(exec_cmd, client, user_pod)


class JobStatusAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting Job Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, job_path):
        '''
        Retrieve job status from user container. Data is transferred to hub
        container as a string.

        Attributes
        ----------
        job_path : str
            Path to selected job directory within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        log.warn('getting the status of the job')
        # full_path = "/home/jovyan/{0}".format(job_path) # full path to job
        exec_cmd = [ 'job_status.py', job_path ]
        status = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('the status of the job is: ' + status)
        self.write(status.strip()) # Send data to client


class PlotJobResultsAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, job_path):
        '''
        Retrieve a plot figure of the job results based on the plot type 
        in the request body. Data is transferred to hub container as JSON 
        string.

        Attributes
        ----------
        job_path : str
            Path to selected job directory within user pod container.
        '''

        body = json.loads(self.get_query_argument(name='data')) # Plot request body
        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        results_path = os.path.join(job_path, 'results/results.p') # Path to the results file
        log.warn(self.request.body)
        plt_type = body['plt_type'] # type of plot to be retrieved 
        plt_data = json.dumps(body['plt_data']) # plot title and axes lables
        exec_cmd = [ 'plot_results.py', results_path, plt_type] # Script commands
        if not "None" in plt_data:
            exec_cmd.append(plt_data) # Add plot data to the exec cmd if its not "None"
        plt_fig = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(plt_fig)
        self.write(plt_fig) # Send data to client

