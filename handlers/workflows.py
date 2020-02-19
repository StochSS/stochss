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


class WorkflowInfoAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting Workflow Info including start date tine and path to the 
    model at the last workflow save.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, info_path):
        '''
        Retrieve workflow info from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        info_path : str
            Path to selected workflows info file within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        log.debug(info_path)
        user = self.current_user.name # Get Username
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        full_path = "/home/jovyan{0}".format(info_path) # full path to workflow info
        json_data = stochss_kubernetes.read_from_pod(client, 
            user_pod, "{0}".format(full_path)) # Use cat to read json file
        self.write(json_data) # Send data to client
        '''


class RunWorkflowAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for running workflows.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, wkfl_type, opt_type, data):
        '''
        Start running a workflow and record the time in UTC in the workflow_info file.
        Creates workflow directory and workflow_info file if running a new workflow.  Copys 
        model into the workflow directory.

        Attributes
        ----------
        opt_type : str
            type of workflow being run (rn) for new workflow (re) for existing workflow.
        data : str
            Path to selected workflows model file and name of workflow within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        model_path, workflow_name = data.split('/<--GillesPy2Workflow-->/') # get model path and workflow name from data
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        log.warn('starting the workflow')
        exec_cmd = "screen -d -m run_workflow.py {} {}".format(model_path, workflow_name).split(" ") # Script commands
        # exec_cmd = ["run_workflow.py", "{}".format(model_path), "{0}".format(workflow_name), "{0}".format(wkfl_type) ] # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('sent the workflow')
        '''


class SaveWorkflowAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for saving workflows.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, wkfl_type, opt_type, data):
        '''
        Start saving the workflow.  Creates the workflow directory and workflow_info file if
        saving a new workflow.  Copys model into the workflow directory.

        Attributes
        ----------
        opt_type : str
            type of workflow being run (rn) for new workflow (re) for existing workflow.
        data : str
            Path to selected workflows model file and name of workflow within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        model_path, workflow_name = data.split('/<--GillesPy2Workflow-->/') # get model path and workflow name from data
        log.warn("Path to the model: {0}".format(model_path))
        log.warn("Name of workflow or workflow path: {0}".format(workflow_name))
        log.warn("Type of workflow: {0}".format(wkfl_type))
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd = [ "run_workflow.py", "{0}".format(model_path), "{0}".format(workflow_name), "{0}".format(wkfl_type) ] # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.warn("Run workflow options: {0}".format(opt_type))
        log.warn("Exec command sent to the user pod: {0}".format(exec_cmd))
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn("Response to the command: {0}".format(resp))
        '''


class WorkflowStatusAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, workflow_path):
        '''
        Retrieve workflow status from user container. Data is transferred to hub
        container as a string.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        log.warn('getting the status of the workflow')
        exec_cmd = [ 'workflow_status.py', "{0}".format(workflow_path) ]
        status = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('the status of the workflow is: ' + status)
        self.write(status.strip()) # Send data to client
        '''


class PlotWorkflowResultsAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, workflow_path):
        '''
        Retrieve a plot figure of the workflow results based on the plot type 
        in the request body. Data is transferred to hub container as JSON 
        string.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory within user pod container.
        '''

        body = json.loads(self.get_query_argument(name='data')) # Plot request body
        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        results_path = os.path.join(workflow_path, 'results/results.p') # Path to the results file
        log.warn(self.request.body)
        plt_type = body['plt_type'] # type of plot to be retrieved 
        plt_data = json.dumps(body['plt_data']) # plot title and axes lables
        exec_cmd = [ 'plot_results.py', "{0}".format(results_path), "{0}".format(plt_type)] # Script commands
        if not "None" in plt_data:
            exec_cmd.extend(["--plt_data", "{0}".format(plt_data)]) # Add plot data to the exec cmd if its not "None"
        plt_fig = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(plt_fig)
        self.write(plt_fig) # Send data to client
        '''


class WorkflowLogsAPIHandler(BaseHandler):

    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''

    @web.authenticated
    async def get(self, logs_path):
        '''
        Retrieve workflow status from user container. Data is transferred to hub
        container as a string.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory within user pod container.
        '''

        checkUserOrRaise(self) # User Validation
        user = self.current_user.name # Get Username
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Load kube client
        full_path = "/home/jovyan/{0}".format(logs_path)
        '''
        data = stochss_kubernetes.read_from_pod(client, 
            user_pod, "{0}".format(full_path), isJSON=False) # Use cat to read json file
        log.warn("Log data: {0}".format(data))
        self.write(data) # Send data to client
        '''


class WorkflowNotebookHandler(BaseHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self, workflow_type, path):
        '''
        Sends request to server to run convert_to_notebook.py on target mdl
        file.

        Attributes
        ----------
        type : str
            Type of notebook template to use for conversion.
        path : str
            Path to target model within user pod container.
        '''
        checkUserOrRaise(self) # Validate User
        user = self.current_user.name # Get User Name
        '''
        client, user_pod = stochss_kubernetes.load_kube_client(user) # Kube API
        workflow_types = {"1d_parameter_sweep":"convert_to_1d_param_sweep_notebook.py",
                          "2d_parameter_sweep":"convert_to_2d_param_sweep_notebook.py"
                         }
        exec_cmd = [workflow_types[workflow_type], path] # Script commands
        log.warning(path)
        resp = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        self.write(resp)
        '''
