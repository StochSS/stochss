'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

import os
import json
import logging
import subprocess
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSWorkflow, StochSSModel, StochSSSpatialModel, StochSSNotebook, \
                  StochSSAPIError, report_error

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class LoadWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting the Workflow's status, info, type, model for the Workflow manager page.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow's status, info, and model from User's file system.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow/model: %s", path)
        wkfl_type = self.get_query_argument(name="type")
        dirname = self.get_query_argument(name='parentPath', default=os.path.dirname(path))
        data = {"type":wkfl_type if wkfl_type != "none" else None,
                "stamp": self.get_query_argument(name="stamp"),
                "dirname": None if not dirname or dirname == "." else dirname}
        log.debug("Load data for the workflow: %s", data)
        try:
            new = path.endswith(".mdl")
            wkfl = StochSSWorkflow(path=path, new=new, data=data)
            resp = wkfl.load(new=new)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class RunWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for running workflows.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Start running a workflow and record the time in UTC in the workflow_info file.
        Creates workflow directory and workflow_info file if running a new workflow.  Copys
        model into the workflow directory.

        Attributes
        ----------
        '''
        data = json.loads(self.get_query_argument(name="data"))
        log.debug("Handler query string: %s", data)
        path = data['wkflPath']
        log.debug("Path to the workflow: %s", path)
        wkfl_type = data['type']
        log.debug("Type of workflow: %s", wkfl_type)
        try:
            # nav = f"cd {StochSSWorkflow(path=path).get_path(full=True)}"
            script = "/stochss/stochss/handlers/util/scripts/start_job.py"
            exec_cmd = [f"{script}", f"{path}", f"{wkfl_type}"]
            if "v" in data['optType']:
                exec_cmd.append("-v")
            log.debug("Exec command sent to the subprocess: %s", exec_cmd)
            log.debug('Sending the workflow run cmd')
            subprocess.Popen(exec_cmd)
            log.debug('The workflow has started')
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class SaveWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for saving workflows.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Start saving the workflow.  Creates the workflow directory and workflow_info file if
        saving a new workflow.  Copys model into the workflow directory.

        Attributes
        ----------
        '''
        try:
            data = json.loads(self.get_query_argument(name="data"))
            log.debug("Handler query string: %s", data)
            model_path = data['mdlPath']
            log.debug("Path to the model: %s", model_path)
            wkfl = StochSSWorkflow(path=data['wkflPath'])
            resp = wkfl.save(mdl_path=model_path, settings=data['settings'],
                             initialize="r" in data['optType'])
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class WorkflowStatusAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow status based on status files.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug('path to the workflow: %s', path)
        log.debug('Getting the status of the workflow')
        try:
            wkfl = StochSSWorkflow(path=path)
            status = wkfl.get_status()
            log.debug('The status of the workflow is: %s', status)
            self.write(status)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class PlotWorkflowResultsAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting result plots based on plot type.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve a plot figure of the workflow results based on the plot type
        in the request body.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", path)
        body = json.loads(self.get_query_argument(name='data'))
        if body['plt_data'] == "None":
            body['plt_data'] = None
        log.debug("Plot args passed to the plot: %s", body)
        try:
            wkfl = StochSSWorkflow(path=path)
            fig = wkfl.get_results_plot(**body)
            log.debug("Plot figure: %s", fig)
            self.write(fig)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class WorkflowLogsAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting Workflow logs.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow logs from User's file system.

        Attributes
        ----------
        '''
        path = os.path.dirname(self.get_query_argument(name="path"))
        log.debug("Path to the workflow logs file: %s", path)
        try:
            wkfl = StochSSWorkflow(path=path)
            logs = wkfl.get_run_logs()
            wkfl.print_logs(log)
            log.debug("Response: %s", logs)
            self.write(logs)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class WorkflowNotebookHandler(APIHandler):
    '''
    ################################################################################################
    Handler for handling conversions from model (.mdl) file or workflows (.wkfl)
    to Jupyter Notebook (.ipynb) file for notebook workflows.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Path to the model/workflow: %s", path)
        wkfl_type = self.get_query_argument(name="type")
        try:
            if path.endswith(".mdl"):
                file_obj = StochSSModel(path=path)
            elif path.endswith(".smdl"):
                file_obj = StochSSSpatialModel(path=path)
            else:
                file_obj = StochSSWorkflow(path=path)
            kwargs = file_obj.get_notebook_data()
            if "type" in kwargs.keys():
                wkfl_type = kwargs['type']
                kwargs = kwargs['kwargs']
            log.debug("Type of workflow to be run: %s", wkfl_type)
            notebook = StochSSNotebook(**kwargs)
            notebooks = {"gillespy":notebook.create_es_notebook,
                         "spatial":notebook.create_ses_notebook,
                         "1d_parameter_sweep":notebook.create_1dps_notebook,
                         "2d_parameter_sweep":notebook.create_2dps_notebook,
                         "sciope_model_exploration":notebook.create_sme_notebook,
                         "model_inference":notebook.create_smi_notebook}
            resp = notebooks[wkfl_type]()
            notebook.print_logs(log)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class SavePlotAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file or workflows (.wkfl)
    to Jupyter Notebook (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow setting file: %s", path)
        plot = json.loads(self.request.body.decode())
        log.debug("The plot to be saved: %s", plot)
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.save_plot(plot=plot)
            wkfl.print_logs(log)
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class SaveAnnotationAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for saving annotations for workflows.
    ################################################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Adds/updates the workflows annotation in the info file.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow info file: %s", path)
        info = json.loads(self.request.body.decode())
        log.debug("The annotation to be saved: %s", info['annotation'])
        try:
            wkfl = StochSSWorkflow(path=path)
            wkfl.update_info(new_info=info)
            wkfl.print_logs(log)
            resp = {"message":"The annotation was successfully saved", "data":info['annotation']}
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
