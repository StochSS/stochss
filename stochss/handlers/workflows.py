'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

from .util import StochSSJob, StochSSModel, StochSSSpatialModel, StochSSNotebook, StochSSWorkflow, \
                  StochSSParamSweepNotebook, StochSSSciopeNotebook, StochSSAPIError, report_error

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class NewWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating a new workflow
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a new workflow of the given type for the given model.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", path)
        mdl_path = self.get_query_argument(name="model")
        log.debug("The path to the model: %s", mdl_path)
        wkfl_type = self.get_query_argument(name="type")
        log.debug("Type of the workflow: %s", wkfl_type)
        try:
            log.info("Creating %s workflow", path.split('/').pop())
            wkfl = StochSSWorkflow(path=path, new=True, mdl_path=mdl_path, wkfl_type=wkfl_type)
            resp = {"path": wkfl.path}
            log.info("Successfully created %s workflow", wkfl.get_file())
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


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
        try:
            log.info("Loading workflow data")
            resp = StochSSWorkflow(path=path).load()
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


    @web.authenticated
    async def post(self):
        '''
        Start saving the workflow.  Creates the workflow directory and workflow_info file if
        saving a new workflow.  Copys model into the workflow directory.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Path to the workflow: %s", path)
        data = json.loads(self.request.body.decode())
        log.debug("Workflow Data: %s", data)
        log.debug("Path to the model: %s", data['model'])
        try:
            wkfl = StochSSWorkflow(path=path)
            log.info("Saving %s", wkfl.get_file())
            resp = wkfl.save(new_settings=data['settings'], mdl_path=data['model'])
            log.debug("Response: %s", resp)
            log.info("Successfully saved %s", wkfl.get_file())
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class InitializeJobAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for initializing jobs.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Initialize a new job or an existing old format workflow.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Path to the workflow: %s", path)
        data = json.loads(self.get_query_argument(name="data"))
        log.debug("Handler query string: %s", data)
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.initialize_job(settings=data['settings'], mdl_path=data['mdl_path'],
                                       wkfl_type=data['type'], time_stamp=data['time_stamp'])
            wkfl.print_logs(log)
            log.debug("Response message: %s", resp)
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
        path = self.get_query_argument(name="path")
        log.debug("Path to the workflow: %s", path)
        wkfl_type = self.get_query_argument(name="type")
        log.debug("Type of workflow: %s", wkfl_type)
        verbose = self.get_query_argument(name="verbose", default=False)
        try:
            script = "/stochss/stochss/handlers/util/scripts/start_job.py"
            exec_cmd = [f"{script}", f"{path}", f"{wkfl_type}", "-v"]
            if verbose:
                exec_cmd.append("-v")
            log.debug("Exec command sent to the subprocess: %s", exec_cmd)
            log.debug('Sending the workflow run cmd')
            job = subprocess.Popen(exec_cmd)
            with open(os.path.join(path, "RUNNING"), "w") as file:
                file.write(f"Subprocess id: {job.pid}")
            log.debug('The workflow has started')
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
            wkfl = StochSSJob(path=path)
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
            wkfl = StochSSJob(path=path)
            if "plt_type" in body.keys():
                fig = wkfl.get_plot_from_results(**body)
                wkfl.print_logs(log)
            else:
                log.info("Loading the plot...")
                fig = wkfl.get_results_plot(**body)
            log.debug("Plot figure: %s", fig)
            self.write(fig)
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
                file_obj = StochSSJob(path=path)
            log.info("Loading data for %s", file_obj.get_file())
            kwargs = file_obj.get_notebook_data()
            if "type" in kwargs.keys():
                wkfl_type = kwargs['type']
                kwargs = kwargs['kwargs']
                log.info("Converting %s to notebook", file_obj.get_file())
            else:
                log.info("Creating notebook workflow for %s", file_obj.get_file())
            log.debug("Type of workflow to be run: %s", wkfl_type)
            if wkfl_type in ("1d_parameter_sweep", "2d_parameter_sweep"):
                notebook = StochSSParamSweepNotebook(**kwargs)
                notebooks = {"1d_parameter_sweep":notebook.create_1d_notebook,
                             "2d_parameter_sweep":notebook.create_2d_notebook}
            elif wkfl_type in ("sciope_model_exploration", "model_inference"):
                notebook = StochSSSciopeNotebook(**kwargs)
                notebooks = {"sciope_model_exploration":notebook.create_me_notebook,
                             "model_inference":notebook.create_mi_notebook}
            else:
                notebook = StochSSNotebook(**kwargs)
                notebooks = {"gillespy":notebook.create_es_notebook,
                             "spatial":notebook.create_ses_notebook}
            resp = notebooks[wkfl_type]()
            notebook.print_logs(log)
            log.debug("Response: %s", resp)
            log.info("Successfully created the notebook for %s", file_obj.get_file())
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
            wkfl = StochSSJob(path=path)
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
            log.info("Saving annotation for %s", path.split('/').pop())
            if StochSSWorkflow.check_workflow_format(path=path):
                wkfl = StochSSWorkflow(path=path)
                wkfl.save_annotation(info['annotation'])
            else:
                wkfl = StochSSJob(path=path)
                wkfl.update_info(new_info=info)
                wkfl.print_logs(log)
            resp = {"message":"The annotation was successfully saved", "data":info['annotation']}
            log.info("Successfully saved the annotation")
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class UpadteWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for updating workflow format.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Updates the workflow to the new format.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", path)
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.update_wkfl_format()
            log.debug("Response Message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
