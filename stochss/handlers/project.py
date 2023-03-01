'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
                  StochSSAPIError, report_error, report_critical_error

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
            log.debug(f"List of projects: {data}")
            self.write(data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"The path to the project directory: {path}")
        log.info("Loading project data")
        try:
            project = StochSSProject(path=path)
            s_project = project.load()
            log.debug(f"Contents of the project: {s_project}")
            self.write(s_project)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"The path to the new project directory: {path}")
        log.info(f"Creating {path.split('/').pop()} project")
        try:
            project = StochSSProject(path=path, new=True)
            resp = {"message":f"Successfully created the project: {project.get_file()}",
                    "path":project.path}
            log.debug(f"Response: {resp}")
            log.info(f"Successfully created {project.get_file()} project")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the project: {path}")
        file = self.get_query_argument(name="mdlFile")
        log.debug(f"Name to the file: {file}")
        try:
            project = StochSSProject(path=path)
            resp = project.add_model(file=file, new=True)
            project.print_logs(log)
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the model: {path}")
        try:
            folder = StochSSFolder(path="")
            # file will be excluded if test passes
            test = lambda ext, root, file: bool(".wkfl" in root or f"{path}" in root or \
                                                "trash" in root.split("/") or \
                                                ".presentations" in root)
            data = folder.get_file_list(ext=[".mdl", ".smdl"], test=test)
            log.debug(f"List of models: {data}")
            self.write(data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the project: {path}")
        mdl_path = self.get_query_argument(name="mdlPath")
        log.debug(f"Path to the model: {mdl_path}")
        try:
            project = StochSSProject(path=path)
            log.info("Loading model data")
            model_class = StochSSModel if mdl_path.endswith(".mdl") else StochSSSpatialModel
            model = model_class(path=mdl_path)
            log.info(f"Adding {model.get_file()} to {project.get_file()}")
            resp = project.add_model(file=model.get_file(), model=model.load())
            project.print_logs(log)
            log.info(f"Successfully added {model.get_file()} to {project.get_file()}")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the target model: {src_path}")
        dst_path = self.get_query_argument(name="dstPath")
        log.debug(f"Destination path for the target model: {dst_path}")
        try:
            src_model = StochSSModel(path=src_path)
            log.info(f"Extracting {src_model.get_file()}")
            dst_model = StochSSModel(path=dst_path, new=True, model=src_model.load())
            dirname = dst_model.get_dir_name()
            if not dirname:
                dirname = "/"
            message = f"The Model {src_model.get_file()} was extracted to "
            message += f"{dirname} in files as {dst_model.get_file()}"
            log.debug(f"Response message: {message}")
            log.info(f"Successfully extracted {src_model.get_file()} to {dirname}")
            self.write(message)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the target model: {src_path}")
        dst_path = self.get_query_argument(name="dstPath")
        log.debug(f"Destination path for the target model: {dst_path}")
        try:
            log.info(f"Extracting {src_path.split('/').pop()}")
            project = StochSSProject(path=os.path.dirname(os.path.dirname(src_path)))
            resp = project.extract_workflow(src=src_path, dst=dst_path)
            project.print_logs(log)
            log.debug(f"Response message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the project directory: {path}")
        data = json.loads(self.request.body.decode())
        log.debug(f"Meta-data to be saved: {data}")
        try:
            log.info(f"Saving metadata for {path.split('/').pop()}")
            project = StochSSProject(path=path)
            project.update_meta_data(data=data)
            log.info("Successfully saved the metadata")
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"Path to the project directory: {path}")
        data = json.loads(self.request.body.decode())['annotation'].strip()
        log.debug(f"Annotation to be saved: {data}")
        try:
            log.info(f"Saving the annotation for {path.split('/').pop()}")
            project = StochSSProject(path=path)
            project.update_annotation(annotation=data)
            log.info("Successfully saved the annotation")
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
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
        log.debug(f"The path to the project: {path}")
        try:
            proj = StochSSProject(path=path)
            proj.update_project_format()
        except StochSSAPIError as err:
            report_error(self, log, err)
        except Exception as err:
            report_critical_error(self, log, err)
        self.finish()
