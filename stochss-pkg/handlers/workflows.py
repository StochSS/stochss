'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import logging
import json
import os
import subprocess
from notebook.base.handlers import APIHandler
from json.decoder import JSONDecodeError
from tornado import web

from .util.workflow_status import get_status
from .util.plot_results import plot_results
from .util.convert_to_1d_param_sweep_notebook import convert_to_1d_psweep_nb
from .util.convert_to_2d_param_sweep_notebook import convert_to_2d_psweep_nb
from .util.stochss_errors import StochSSAPIError

log = logging.getLogger('stochss')


class LoadWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting the Workflow's status, info, type, model for the 
    Workflow manager page.
    ########################################################################
    '''
    @web.authenticated
    async def get(self, stamp, wkfl_type, path):
        '''
        Retrieve workflow's status, info, and model from User's file system.

        Attributes
        ----------
        stamp : str
            Time stamp when the workflow was loaded.
        type : str
            Type of the workflow
        path : str
            Path to a new workflow's source model or an existing workflow.
        '''
        self.set_header('Content-Type', 'application/json')
        user_dir = "/home/jovyan"
        log.debug("Time stamp of the workflow: {0}".format(stamp))
        log.debug("The type of the workflow: {0}".format(wkfl_type))
        log.debug("The path to the workflow/model: {0}".format(path))
        title_types = {"gillespy":"Ensemble Simulation","parameterSweep":"Parameter Sweep"}
        parent_path = os.path.dirname(path)
        if path.endswith('.mdl'):
            resp = {"mdlPath":path,"timeStamp":stamp,"type":wkfl_type,
                    "status":"new","titleType":title_types[wkfl_type],
                    "wkflParPath": parent_path}
            name = path.split('/').pop().split('.')[0]
            resp["wkflName"] = name + stamp
            resp["wkflDir"] = resp['wkflName'] + ".wkfl"
            resp["startTime"] = None
        elif path.endswith('.wkfl'):
            resp = {"wkflDir":path.split('/').pop(), "wkflParPath":parent_path}
            resp["status"] = get_status(path)
            name = path.split('/').pop().split('.')[0]
            resp["wkflName"] = name
            try:
                resp["timeStamp"] = "_"+"_".join(name.split('_')[-2:])
            except:
                resp["timeStamp"] = None
            try:
                with open(os.path.join(user_dir, path, "info.json"), "r") as info_file:
                    info = json.load(info_file)
                resp["type"] = info['type']
                resp["startTime"] = info['start_time']
                resp["mdlPath"] = info['source_model'] if resp['status'] == "ready" else info['wkfl_model']
                resp["titleType"] = title_types[info['type']]
            except FileNotFoundError as err:
                self.set_status(404)
                error = {"Reason":"Info File Not Found","Message":"Could not find the workflow info file: "+str(err)}
                log.error("Exception information: {0}".format(error))
                self.write(error)
            except JSONDecodeError as err:
                self.set_status(406)
                error = {"Reason":"File Not JSON Format","Message":"The workflow info file is not JSON decodable: "+str(err)}
                log.error("Exception information: {0}".format(error))
                self.write(error)
        try:
            with open(os.path.join(user_dir, resp['mdlPath']), "r") as model_file:
                resp["model"] = json.load(model_file)
        except:
            resp["model"] = None
            resp["error"] = {"Reason":"Model Not Found","Message":"Could not find the model file: "+resp['mdlPath']}
        log.debug("Response: {0}".format(resp))
        self.write(resp)
        self.finish()


class RunWorkflowAPIHandler(APIHandler):
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
        wkfl_type : str
            Type of workflow being run
        opt_type : str
            State of workflow being run (rn) for new workflow (re) for existing workflow.
        data : str
            Path to selected workflows model file and name or path of workflow.
        '''
        log.debug("Model path and workflow name or path: {0}".format(data))
        log.debug("Actions for the workflow: {0}".format(opt_type))
        log.debug("Type of workflow: {0}".format(wkfl_type))
        model_path, workflow_name = data.split('/<--GillesPy2Workflow-->/') # get model path and workflow name from data
        log.debug("Path to the model: {0}".format(model_path))
        log.debug("Name of workflow or workflow path: {0}".format(workflow_name))
        exec_cmd = ["/stochss/stochss-pkg/handlers/util/run_workflow.py", "{}".format(model_path), "{0}".format(workflow_name), "{0}".format(wkfl_type) ] # Script commands
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.debug("Exec command sent to the subprocess: {0}".format(exec_cmd))
        log.debug('Sending the workflow run cmd')
        pipe = subprocess.Popen(exec_cmd)
        log.debug('The workflow has started')
        self.finish()


class SaveWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for saving workflows.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Start saving the workflow.  Creates the workflow directory and workflow_info file if
        saving a new workflow.  Copys model into the workflow directory.

        Attributes
        ----------
        '''
        data = json.loads(self.get_query_argument(name="data"))
        log.debug("Handler query string: {0}".format(data))
        opt_type = data['optType']
        wkfl_type = data['type']
        model_path = data['mdlPath']
        workflow_path = data['wkflPath']
        log.debug("Actions for the workflow: {0}".format(opt_type))
        log.debug("Type of workflow: {0}".format(wkfl_type))
        log.debug("Path to the model: {0}".format(model_path))
        log.debug("Name of workflow or workflow path: {0}".format(workflow_path))
        exec_cmd = [ "/stochss/stochss-pkg/handlers/util/run_workflow.py", "{0}".format(model_path), "{0}".format(workflow_path), "{0}".format(wkfl_type) ] # Script commands
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.debug("Exec command sent to the subprocess: {0}".format(exec_cmd))
        pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
        resp, errors = pipe.communicate()
        log.debug("Response to the command: {0}".format(resp))
        log.error("Errors thrown: {0}".format(errors))
        if resp:
            self.write(resp)
        else:
            self.write(errors)
        self.finish()


class WorkflowStatusAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''
    @web.authenticated
    async def get(self, workflow_path):
        '''
        Retrieve workflow status based on status files.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory.
        '''
        log.debug('Getting the status of the workflow')
        status = get_status(workflow_path)
        log.debug('The status of the workflow is: {0}\n'.format(status))
        self.write(status)
        self.finish()


class PlotWorkflowResultsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''
    @web.authenticated
    async def get(self, workflow_path):
        '''
        Retrieve a plot figure of the workflow results based on the plot type 
        in the request body.

        Attributes
        ----------
        workflow_path : str
            Path to selected workflow directory.
        '''
        log.debug("The path to the workflow: {0}\n".format(workflow_path))
        body = json.loads(self.get_query_argument(name='data'))
        log.debug("Plot args passed to the plot: {0}\n".format(body))
        results_path = os.path.join(workflow_path, 'results/plots.json')
        log.debug("Path to the workflow results: {0}\n".format(results_path))
        plt_key = body['plt_key']
        log.debug("Key identifying the requested plot: {0}\n".format(plt_key))
        plt_data = body['plt_data']
        log.debug("Title and axis data for the plot: {0}\n".format(plt_data))
        self.set_header('Content-Type', 'application/json')
        try:
            if "None" in plt_data:
                plt_fig = plot_results(results_path, plt_key)
            else:
                plt_fig = plot_results(results_path, plt_key, plt_data) # Add plot data to the exec cmd if its not "None"
            log.debug("Plot figure: {0}\n".format(plt_fig))
            self.write(plt_fig)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}\n".format(error))
            self.write(error)
        self.finish()


class WorkflowLogsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow logs.
    ########################################################################
    '''
    @web.authenticated
    async def get(self, logs_path):
        '''
        Retrieve workflow logs from User's file system.

        Attributes
        ----------
        logs_path : str
            Path to the workflow logs file.
        '''
        log.debug("Path to the workflow logs file: {0}\n".format(logs_path))
        full_path = os.path.join("/home/jovyan/", logs_path)
        log.debug("Full path to the workflow logs file: {0}\n".format(full_path))
        try:
            with open(full_path, 'r') as log_file:
                data = log_file.read()
            log.debug("Contents of the log file: {0}\n".format(data))
            if data:
                resp = data
            else:
                resp = "No logs were recoded for this workflow."
            log.debug("Response: {0}\n".format(resp))
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File or Directory Not Found","Message":"Could not find the workflow log file: "+str(err)}
            log.error("Exception information: {0}\n".format(error))
            self.write(error)
        self.finish()


class WorkflowNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self, workflow_type, path):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        type : str
            Type of notebook template to use for conversion.
        path : str
            Path to target model within User's file system.
        '''
        log.debug("Type of workflow to be run: {0}\n".format(workflow_type))
        log.debug("Path to the model: {0}\n".format(path))
        workflows = {"1d_parameter_sweep":convert_to_1d_psweep_nb, "2d_parameter_sweep":convert_to_2d_psweep_nb}
        try:
            resp = workflows[workflow_type](path)
            log.debug("Response: {0}\n".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}\n".format(error))
            self.write(error)
        self.finish()
