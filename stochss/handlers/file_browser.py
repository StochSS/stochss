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

'''
APIHandler documentation:
https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583

Note APIHandler.finish() sets Content-Type handler to 'application/json'

Use finish() for json, write() for text
'''
import os
import json
import uuid
import subprocess
from json.decoder import JSONDecodeError
from datetime import datetime
import logging
import traceback
from shutil import move, rmtree
from tornado import web
from notebook.base.handlers import APIHandler

from .util import *

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class ModelBrowserFileList(APIHandler):
    '''
    ##############################################################################
    Handler for interacting with the User's File Browser
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Reads the content of a directory and returns a jstree dictionary.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        is_root = self.get_query_argument(name="isRoot", default=False)
        log.info("Path to the directory: %s", path)
        try:
            folder = StochSSFolder(path=path)
            node = folder.get_jstree_node(is_root=is_root)
            log.debug("Contents of the directory: %s", node)
            self.write(node)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason, "Message":err.message}
            if err.traceback is None:
                trace = traceback.format_exc()
            else:
                trace = err.traceback
            log.error("Exception information: %s\n%s", error, trace)
            error['Traceback'] = trace
            self.write(error)
        self.finish()


class ModelToNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Runs the convert_to_notebook function from the convert_to_notebook script
        to build a Jupyter Notebook version of the model and write it to a file.

        Attributes
        ----------
        '''


class DeleteFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for removing files and/or directoies from the User's file system.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Removes a single file or recursively remove a directory and its contents.

        Attributes
        ----------
        '''


class MoveFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler moving file locations in the User's file system.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Moves a file or a directory and its contents to a new location.

        Attributes
        ----------
        '''


class DuplicateModelHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a file.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a file with a unique name and stores it in the same
        directory as the original.

        Attributes
        ----------
        '''


class DuplicateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a directory and its contents.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a directory and its contents with a unique name and
        stores it in the same parent directory as the original.

        Attributes
        ----------
        '''


class RenameAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for renaming files or directories.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Rename a file or directory.  If the file or directory already exists
        increment the file name using '(x)' naming convention to get a unique
        name.

        Attributes
        ----------
        '''


class ConvertToSpatialAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a model to a spatial model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a spatial model file with a unique name from a model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''


class ConvertToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a spatial model to a model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a model file with a unique name from a spatial model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''


class ModelToSBMLAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a StochSS model to a SBML model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a SBML Model file with a unique name from a model file and
        store it in the same directory as the original.

        Attributes
        ----------
        '''


class SBMLToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a SBML model to a StochSS model.
    ##############################################################################
    '''

    @web.authenticated
    async def get(self):
        '''
        Creates a StochSS model with a unique name from an sbml model and
        store it in the same directory as the original.

        Attributes
        ----------
        '''


class DownloadAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading plain text files to the users download directory.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Read and return plain text files.

        Attributes
        ----------
        '''


class DownloadZipFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading zip files to the users download directory.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Read and download a zip file or generate a zip file from a directory or
        file and then download.  Generated zip files are stored in the targets
        parent directory with a unique name.

        Attributes
        ----------
        '''


class CreateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating a new directory or path of directories.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a single directory or if the path od directories contains other
        directories that do not exist, a path of directories.

        Attributes
        ----------
        '''
        directories = self.get_query_argument(name="path")
        log.debug("Path of directories: %s", directories)
        try:
            folder = StochSSFolder(path=directories, new=True)
            self.write("{0} was successfully created!".format(directories))
        except StochSSAPIHandler as err:
            report_error(self, log)
        self.finish()


class UploadFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for uploading files.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Uploads the target file to the target directory.  If the intended file
        type is a StochSS Model or SBML Model, the original file is uploaded
        with a converted model.  If the file can't be uploaded to the intended
        type no conversion is made and errors are sent to the user.

        Attributes
        ----------

        '''


class DuplicateWorkflowAsNewHandler(APIHandler):
    '''
    ##############################################################################
    Handler for duplicating a workflow as new and a workflows model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a new workflow that uses the same model and has
        the same type as the target workflow in its parent directory.

        Attributes
        ----------
        '''


class GetWorkflowModelPathAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for getting the path to the workflow model.
    ##############################################################################
    '''

    async def get(self):
        '''
        Returns the path to the model used for the workflow to allow the user
        to edit the model.  If the model doesn't exist a 404 response is sent.

        Attributes
        ----------
        '''


class UploadFileFromLinkAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for uploading file from a url.
    ##############################################################################
    '''

    async def get(self):
        '''
        Upload and unzip a zip file from a url.

        Attributes
        ----------
        '''
