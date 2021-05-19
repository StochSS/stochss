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
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSFolder, StochSSProject, StochSSModel, StochSSSpatialModel, \
                  StochSSAPIError, report_error

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
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
            data = folder.get_project_list()
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
        log.info("Loading project data")
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
        log.info("Creating %s project", path.split('/').pop())
        try:
            project = StochSSProject(path=path, new=True)
            resp = {"message":f"Successfully created the project: {project.get_file()}",
                    "path":project.path}
            log.debug("Response: %s", resp)
            log.info("Successfully created %s project", project.get_file())
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class NewModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating new StochSS Models in StochSS Projects
    ################################################################################################
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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the project: %s", path)
        mdl_path = self.get_query_argument(name="mdlPath")
        log.debug("Path to the model: %s", mdl_path)
        try:
            project = StochSSProject(path=path)
            log.info("Loading model data")
            model_class = StochSSModel if mdl_path.endswith(".mdl") else StochSSSpatialModel
            model = model_class(path=mdl_path)
            log.info("Adding %s to %s", model.get_file(), project.get_file())
            resp = project.add_model(file=model.get_file(), model=model.load())
            project.print_logs(log)
            log.info("Successfully added %s to %s", model.get_file(), project.get_file())
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ExtractModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for extracting models from a project
    ################################################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a model from a project.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        src_path = self.get_query_argument(name="srcPath")
        log.debug("Path to the target model: %s", src_path)
        dst_path = self.get_query_argument(name="dstPath")
        log.debug("Destination path for the target model: %s", dst_path)
        try:
            src_model = StochSSModel(path=src_path)
            log.info("Extracting %s", src_model.get_file())
            dst_model = StochSSModel(path=dst_path, new=True, model=src_model.load())
            dirname = dst_model.get_dir_name()
            if not dirname:
                dirname = "/"
            message = f"The Model {src_model.get_file()} was extracted to "
            message += f"{dirname} in files as {dst_model.get_file()}"
            log.debug("Response message: %s", message)
            log.info("Successfully extracted %s to %s", src_model.get_file(), dirname)
            self.write(message)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ExtractWorkflowAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for extracting workflows from a project
    ################################################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a workflow from a project.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        src_path = self.get_query_argument(name="srcPath")
        log.debug("Path to the target model: %s", src_path)
        dst_path = self.get_query_argument(name="dstPath")
        log.debug("Destination path for the target model: %s", dst_path)
        try:
            log.info("Extracting %s", src_path.split('/').pop())
            project = StochSSProject(path=os.path.dirname(os.path.dirname(src_path)))
            resp = project.extract_workflow(src=src_path, dst=dst_path)
            project.print_logs(log)
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the trash directory: %s", path)
        try:
            log.info("Emptying the trash")
            folder = StochSSFolder(path=path)
            resp = folder.empty()
            log.debug("Response message: %s", resp)
            log.info("Successfully emptied the trash")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ProjectMetaDataAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for a projects meta data
    ##############################################################################
    '''
    @web.authenticated
    def post(self):
        '''
        Save the projects meta data.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the project directory: %s", path)
        data = json.loads(self.request.body.decode())
        log.debug("Meta-data to be saved: %s", data)
        try:
            log.info("Saving metadata for %s", path.split('/').pop())
            project = StochSSProject(path=path)
            project.update_meta_data(data=data)
            log.info("Successfully saved the metadata")
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


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
        self.finish()


    @web.authenticated
    def post(self):
        '''
        Export a project with new or updated meta data.

        Attributes
        ----------
        '''
        log.warning("Export as combine w/meta data function has not been cleaned up")
        self.finish()


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
        path = self.get_query_argument(name="path")
        log.debug("Path to the project directory: %s", path)
        data = json.loads(self.request.body.decode())['annotation'].strip()
        log.debug("Annotation to be saved: %s", data)
        try:
            log.info("Saving the annotation for %s", path.split('/').pop())
            project = StochSSProject(path=path)
            project.update_annotation(annotation=data)
            log.info("Successfully saved the annotation")
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class UpadteProjectAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for updating project format.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Updates the project and its workflows to the new format.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("The path to the project: %s", path)
        try:
            proj = StochSSProject(path=path)
            proj.update_project_format()
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
