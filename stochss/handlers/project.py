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


# import os
# import ast
# import json
# import shutil
import logging

# from shutil import copyfile, copytree, rmtree
from tornado import web
from notebook.base.handlers import APIHandler

# from .util.rename import get_unique_file_name, get_file_name
# from .util.workflow_status import get_status
# from .util.generate_zip_file import download_zip

from .util import StochSSFolder, StochSSProject, StochSSModel, StochSSSpatialModel, \
                  StochSSAPIError, report_error

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class LoadProjectBrowserAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for loading all of the users projects
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Recursively searches all directories for projects

        Attributes
        ----------
        '''
        try:
            self.set_header('Content-Type', 'application/json')
            folder = StochSSFolder(path="")
            data = folder.get_file_list(ext=".proj", folder=True)
            log.debug("List of projects: %s", data)
            self.write(data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class LoadProjectAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating new StochSS Projects
    ################################################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the project directory: %s", path)
        try:
            project = StochSSProject(path=path)
            s_project = project.load()
            log.debug("Contents of the project: %s", s_project)
            self.write(s_project)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class NewProjectAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating new StochSS Projects
    ################################################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the new project directory: %s", path)
        try:
            project = StochSSProject(path=path, new=True)
            resp = {"message":f"Successfully created the project: {project.get_file()}",
                    "path":project.path}
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class NewModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Models in StochSS Projects
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new model in the project.

        Attributes
        ----------
        '''
        log.setLevel(logging.DEBUG)
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the project: %s", path)
        file = self.get_query_argument(name="mdlFile")
        log.debug("Name to the file: %s", file)
        try:
            project = StochSSProject(path=path)
            resp = project.add_model(file=file, new=True)
            project.print_logs(log)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        log.setLevel(logging.WARNING)
        self.finish()


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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the model: %s", path)
        try:
            folder = StochSSFolder(path="")
            # file will be excluded if test passes
            test = lambda ext, root, file: bool(".wkfl" in root or f"{path}" in root or \
                                                "trash" in root)
            data = folder.get_file_list(ext=[".mdl", ".smdl"], test=test)
            log.debug("List of models: %s", data)
            self.write(data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


    @web.authenticated
    def post(self):
        '''
        Add the selected model to the project.

        Attributes
        ----------
        '''
        log.setLevel(logging.DEBUG)
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the project: %s", path)
        mdl_path = self.get_query_argument(name="mdlPath")
        log.debug("Path to the model: %s", mdl_path)
        try:
            project = StochSSProject(path=path)
            model_class = StochSSModel if mdl_path.endswith(".mdl") else StochSSSpatialModel
            model = model_class(path=mdl_path)
            resp = project.add_model(file=model.get_file(), model=model.load())
            project.print_logs(log)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        log.setLevel(logging.WARNING)
        self.finish()


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
        log.warning("Extract model function has not been cleaned up")


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
        log.warning("Extract workflow function has not been cleaned up")


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
        log.warning("Empty trash function has not been cleaned up")


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
        log.warning("Get meta data function has not been cleaned up")


    @web.authenticated
    def post(self):
        '''
        Save the projects meta data.

        Attributes
        ----------
        '''
        log.warning("Save meta data function has not been cleaned up")


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
        log.warning("Export as combine function has not been cleaned up")


    @web.authenticated
    def post(self):
        '''
        Export a project with new or updated meta data.

        Attributes
        ----------
        '''
        log.warning("Export as combine w/meta data function has not been cleaned up")


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
        log.warning("Save annotation function has not been cleaned up")
