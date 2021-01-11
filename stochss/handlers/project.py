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
import ast

from shutil import copyfile, copytree, rmtree
from tornado import web
from notebook.base.handlers import APIHandler

# from .util.rename import get_unique_file_name, get_file_name
# from .util.workflow_status import get_status
# from .util.generate_zip_file import download_zip
# from .util.convert_to_combine import convert
# from .util.stochss_errors import StochSSAPIError

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class LoadProjectBrowserAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for loading all of the users projects
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Recursively searches all directories for projects

        Attributes
        ----------
        '''


class LoadProjectAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Projects
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''


class NewProjectAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Projects
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''


class NewWorkflowGroupAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Workflow Groups
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new workflow group directory.

        Attributes
        ----------
        '''


class AddExistingModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for adding existing models to a project
    ################################################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Get the list of models that can be added to the project

        Attributes
        ----------
        '''


    @web.authenticated
    def post(self):
        '''
        Add the selected model to the project.

        Attributes
        ----------
        '''


class ExtractModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for extracting models from a project
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a model from a project.

        Attributes
        ----------
        '''


class ExtractWorkflowAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for extracting workflows from a project
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a workflow from a project.

        Attributes
        ----------
        '''


class EmptyTrashAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for a projects trash directory
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Empty the trash directory.

        Attributes
        ----------
        '''


class ProjectMetaDataAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for a projects meta data
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Get the projects meta data if it exists else create a meta data dictionary.

        Attributes
        ----------
        '''


    @web.authenticated
    def post(self):
        '''
        Save the projects meta data.

        Attributes
        ----------
        '''


class ExportAsCombineAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for exporting a project or part of a project as a COMBINE archive
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Export a project with existing meta data if any.

        Attributes
        ----------
        '''


    @web.authenticated
    def post(self):
        '''
        Export a project with new or updated meta data.

        Attributes
        ----------
        '''


class UpdateAnnotationAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for updating the README.md file with the projects annotation
    ##############################################################################
    '''
    @web.authenticated
    def post(self):
        '''
        Export a project with new or updated meta data.

        Attributes
        ----------
        '''
