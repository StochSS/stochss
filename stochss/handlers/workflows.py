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
        log.debug(f"The path to the workflow: {path}")
        mdl_path = self.get_query_argument(name="model")
        log.debug(f"The path to the model: {mdl_path}")
        wkfl_type = self.get_query_argument(name="type")
        log.debug(f"Type of the workflow: {wkfl_type}")
        try:
            log.info(f"Creating {path.split('/').pop()} workflow")
            wkfl = StochSSWorkflow(path=path, new=True, mdl_path=mdl_path, wkfl_type=wkfl_type)
            resp = {"path": wkfl.path}
            log.info(f"Successfully created {wkfl.get_file()} workflow")
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
        log.debug(f"The path to the workflow/model: {path}")
        try:
            log.info("Loading workflow data")
            resp = StochSSWorkflow(path=path).load()
            log.debug(f"Response: {resp}")
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
        log.debug(f"Path to the workflow: {path}")
        data = json.loads(self.request.body.decode())
        log.debug(f"Workflow Data: {data}")
        log.debug(f"Path to the model: {data['model']}")
        try:
            wkfl = StochSSWorkflow(path=path)
            log.info(f"Saving {wkfl.get_file()}")
            resp = wkfl.save(new_settings=data['settings'], mdl_path=data['model'])
            log.debug(f"Response: {resp}")
            log.info(f"Successfully saved {wkfl.get_file()}")
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
        log.debug(f"Path to the workflow: {path}")
        data = json.loads(self.get_query_argument(name="data"))
        log.debug(f"Handler query string: {data}")
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.initialize_job(settings=data['settings'], mdl_path=data['mdl_path'],
                                       wkfl_type=data['type'], time_stamp=data['time_stamp'])
            wkfl.print_logs(log)
            log.debug(f"Response message: {resp}")
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
        log.debug(f"Path to the workflow: {path}")
        wkfl_type = self.get_query_argument(name="type")
        log.debug(f"Type of workflow: {wkfl_type}")
        verbose = self.get_query_argument(name="verbose", default=False)
        try:
            script = "/stochss/stochss/handlers/util/scripts/start_job.py"
            exec_cmd = [f"{script}", f"{path}", f"{wkfl_type}", "-v"]
            if verbose:
                exec_cmd.append("-v")
            log.debug(f"Exec command sent to the subprocess: {exec_cmd}")
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
        log.debug(f'path to the workflow: {path}')
        log.debug('Getting the status of the workflow')
        try:
            wkfl = StochSSJob(path=path)
            status = wkfl.get_status()
            log.debug(f'The status of the workflow is: {status}')
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
        log.debug(f"The path to the workflow: {path}")
        body = json.loads(self.get_query_argument(name='data'))
        log.debug(f"Plot args passed to the plot: {body}")
        try:
            job = StochSSJob(path=path)
            if body['sim_type'] in  ("GillesPy2", "GillesPy2_PS"):
                fig = job.get_plot_from_results(data_keys=body['data_keys'],
                                                plt_key=body['plt_key'], add_config=True)
                job.print_logs(log)
            else:
                fig = job.get_psweep_plot_from_results(fixed=body['data_keys'],
                                                       kwargs=body['plt_key'], add_config=True)
                job.print_logs(log)
            if "plt_data" in body.keys():
                fig = job.update_fig_layout(fig=fig, plt_data=body['plt_data'])
            log.debug(f"Plot figure: {fig}")
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
        log.debug(f"Path to the model/workflow: {path}")
        wkfl_type = self.get_query_argument(name="type")
        try:
            if path.endswith(".mdl"):
                file_obj = StochSSModel(path=path)
            elif path.endswith(".smdl"):
                file_obj = StochSSSpatialModel(path=path)
            else:
                file_obj = StochSSJob(path=path)
            log.info(f"Loading data for {file_obj.get_file()}")
            kwargs = file_obj.get_notebook_data()
            if "type" in kwargs.keys():
                wkfl_type = kwargs['type']
                kwargs = kwargs['kwargs']
                log.info(f"Converting {file_obj.get_file()} to notebook")
            else:
                log.info(f"Creating notebook workflow for {file_obj.get_file()}")
            log.debug(f"Type of workflow to be run: {wkfl_type}")
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
            log.debug(f"Response: {resp}")
            log.info(f"Successfully created the notebook for {file_obj.get_file()}")
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
        log.debug(f"The path to the workflow setting file: {path}")
        plot = json.loads(self.request.body.decode())
        log.debug(f"The plot to be saved: {plot}")
        try:
            wkfl = StochSSJob(path=path)
            resp = wkfl.save_plot(plot=plot)
            wkfl.print_logs(log)
            log.debug(f"Response message: {resp}")
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
        log.debug(f"The path to the workflow info file: {path}")
        info = json.loads(self.request.body.decode())
        log.debug(f"The annotation to be saved: {info['annotation']}")
        try:
            log.info(f"Saving annotation for {path.split('/').pop()}")
            if StochSSWorkflow.check_workflow_format(path=path):
                wkfl = StochSSWorkflow(path=path)
                wkfl.save_annotation(info['annotation'])
            else:
                wkfl = StochSSJob(path=path)
                wkfl.update_info(new_info=info)
                wkfl.print_logs(log)
            resp = {"message":"The annotation was successfully saved", "data":info['annotation']}
            log.info("Successfully saved the annotation")
            log.debug(f"Response message: {resp}")
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
        log.debug(f"The path to the workflow: {path}")
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.update_wkfl_format()
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class JobPresentationAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for publishing job presentations.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Publish a job presentation.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"The path to the job: {path}")
        name = self.get_query_argument(name="name")
        log.debug(f"Name of the job presentation: {name}")
        try:
            job = StochSSJob(path=path)
            log.info(f"Publishing the {job.get_name()} presentation")
            links, exists = job.publish_presentation(name=name)
            if exists:
                message = f"A presentation for {job.get_name()} already exists."
            else:
                message = f"Successfully published the {job.get_name()} presentation"
            resp = {"message": message, "links": links}
            log.info(resp['message'])
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DownloadCSVZipAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for downloading job csv results files.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Download a jobs results as CSV.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/zip')
        path = self.get_query_argument(name="path")
        csv_type = self.get_query_argument(name="type")
        data = json.loads(self.get_query_argument(name="data", default=None))
        try:
            job = StochSSJob(path=path)
            name = job.get_name()
            self.set_header('Content-Disposition', f'attachment; filename="{name}.zip"')
            if csv_type == "time series":
                csv_data = job.get_csvzip_from_results(**data, name=name)
            elif csv_type == "psweep":
                csv_data = job.get_psweep_csvzip_from_results(fixed=data, name=name)
            # else:
            #     csv_data = job.get_full_csvzip_from_results(name=name)
            self.write(csv_data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
