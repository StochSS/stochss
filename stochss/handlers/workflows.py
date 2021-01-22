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
# import ast
# import json
import logging
# import traceback
# import subprocess
# from json.decoder import JSONDecodeError
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSWorkflow, \
                  StochSSAPIError, report_error

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
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
        log.setLevel(logging.DEBUG)
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
        log.setLevel(logging.WARNING)
        self.finish()


class RunWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running workflows.
    ########################################################################
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


class WorkflowStatusAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow status based on status files.

        Attributes
        ----------
        '''
        path = self.get_query_arguments(name="path")
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
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve a plot figure of the workflow results based on the plot type
        in the request body.

        Attributes
        ----------
        '''


class WorkflowLogsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow logs.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow logs from User's file system.

        Attributes
        ----------
        '''


class WorkflowNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file or workflows (.wkfl)
    to Jupyter Notebook (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        '''


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


class SaveAnnotationAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for saving annotations for workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Adds/updates the workflows annotation in the info file.

        Attributes
        ----------
        '''
