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

import logging
import json
import os
import ast
import subprocess
import traceback
from json.decoder import JSONDecodeError
from notebook.base.handlers import APIHandler
from tornado import web

from .util import *

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class LoadWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting the Workflow's status, info, type, model for the
    Workflow manager page.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow's status, info, and model from User's file system.

        Attributes
        ----------
        '''


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
        path = self.get_query_arguments(path="path")
        log.debug('Getting the status of the workflow')
        wkfl = StochSSWorkflow(path=path)
        status = wkfl.get_status()
        log.debug('The status of the workflow is: %s', status)
        self.write(status)
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
