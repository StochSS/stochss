'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import json
import os
import subprocess
from notebook.base.handlers import APIHandler

from .util.workflow_status import get_status
from .util.plot_results import plot_results
from .util.convert_to_1d_param_sweep_notebook import convert_to_1d_psweep_nb
from .util.convert_to_2d_param_sweep_notebook import convert_to_2d_psweep_nb

import logging
log = logging.getLogger()


class WorkflowInfoAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Info including start date tine and path to the 
    model at the last workflow save.
    ########################################################################
    '''
    async def get(self, info_path):
        '''
        Retrieve workflow info from user container. Data is transferred to hub
        container as JSON string.

        Attributes
        ----------
        info_path : str
            Path to selected workflows info file within user pod container.
        '''
        log.debug(info_path)
        full_path = os.path.join("/home/jovyan", info_path) # full path to workflow info
        with open(full_path, 'r') as info_file:
            data = info_file.read()
        self.write(data) # Send data to client


class RunWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running workflows.
    ########################################################################
    '''
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
        model_path, workflow_name = data.split('/<--GillesPy2Workflow-->/') # get model path and workflow name from data
        log.warning("Path to the model: {0}".format(model_path))
        log.warning("Name of workflow or workflow path: {0}".format(workflow_name))
        log.warning("Type of workflow: {0}".format(wkfl_type))
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd = ["/stochss/stochss-pkg/handlers/util/run_workflow.py", "{}".format(model_path), "{0}".format(workflow_name), "{0}".format(wkfl_type) ] # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.warning("Save workflow options: {0}".format(opt_type))
        log.warning("Exec command sent to the subprocess: {0}".format(exec_cmd))
        log.warning('Sending the workflow run cmd')
        pipe = subprocess.Popen(exec_cmd)
        log.warning('The workflow has started')


class SaveWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for saving workflows.
    ########################################################################
    '''
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
        model_path, workflow_name = data.split('/<--GillesPy2Workflow-->/') # get model path and workflow name from data
        log.warning("Path to the model: {0}".format(model_path))
        log.warning("Name of workflow or workflow path: {0}".format(workflow_name))
        log.warning("Type of workflow: {0}".format(wkfl_type))
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd = [ "/stochss/stochss-pkg/handlers/util/run_workflow.py", "{0}".format(model_path), "{0}".format(workflow_name), "{0}".format(wkfl_type) ] # Script commands
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.warning("Save workflow options: {0}".format(opt_type))
        log.warning("Exec command sent to the subprocess: {0}".format(exec_cmd))
        pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
        resp, errors = pipe.communicate()
        log.warning("Response to the command: {0}".format(resp))
        log.error("Errors thrown: {0}".format(errors))


class WorkflowStatusAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''
    async def get(self, workflow_path):
        '''
        Retrieve workflow status from user container. Data is transferred to hub
        container as a string.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory within user pod container.
        '''
        log.warn('getting the status of the workflow')
        status = get_status(workflow_path)        
        log.warn('the status of the workflow is: ' + status)
        self.write(status) # Send data to client


class PlotWorkflowResultsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''
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
        results_path = os.path.join(workflow_path, 'results/plots.json') # Path to the results file
        log.warn(self.request.body)
        plt_key = body['plt_key'] # type of plot to be retrieved 
        plt_data = body['plt_data'] # plot title and axes lables
        if "None" in plt_data:
            plt_fig = plot_results(results_path, plt_key)
        else:
            plt_fig = plot_results(results_path, plt_key, plt_data) # Add plot data to the exec cmd if its not "None"
        log.warning(plt_fig)
        self.write(plt_fig) # Send data to client


class WorkflowLogsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''
    async def get(self, logs_path):
        '''
        Retrieve workflow status from user container. Data is transferred to hub
        container as a string.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory within user pod container.
        '''
        full_path = os.path.join("/home/jovyan/", logs_path)
        try:
            with open(full_path, 'r') as log_file:
                data = log_file.read()
        except:
            data = "No logs were found for this workflow."
        log.warn("Log data: {0}".format(data))
        self.write(data) # Send data to client


class WorkflowNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
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
        if workflow_type[0] == '1':
            resp = convert_to_1d_psweep_nb(path)
        elif workflow_type[0] == '2':
            resp = convert_to_2d_psweep_nb(path)
        self.write(resp)
