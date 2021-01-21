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
# import uuid
# import json
import logging
# import traceback
# import subprocess
from tornado import web
from notebook.base.handlers import APIHandler

from .util import StochSSModel, StochSSNotebook, StochSSAPIError, report_error


log = logging.getLogger('stochss')

# pylint: disable=abstract-method
class JsonFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Base Handler for interacting with Model file Get/Post Requests and
    downloading json formatted files.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve model data from User's file system if it exists and
        create new models using a model template if they don't.  Also
        retrieves JSON files for download.

        Attributes
        ----------
        '''
        purpose = self.get_query_argument(name="for")
        log.debug("Purpose of the handler: %s", purpose)
        path = self.get_query_argument(name="path")
        log.debug("Path to the file: %s", path)
        self.set_header('Content-Type', 'application/json')
        try:
            file = StochSSNotebook(path=path) if purpose == "None" else StochSSModel(path=path)
            data = file.load()
            log.debug("Contents of the json file: %s", data)
            file.print_logs(log)
            self.write(data)
        except StochSSAPIError as err:
            if purpose == "edit":
                try:
                    model = StochSSModel(path=path, new=True)
                    data = model.load()
                    log.debug("Contents of the model template: %s", data)
                    model.print_logs(log)
                    self.write(data)
                except StochSSAPIError as err:
                    report_error(self, log, err)
            else:
                report_error(self, log, err)
        self.finish()


    @web.authenticated
    async def post(self):
        '''
        Send/Save model data to user container.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Path to the model: %s", path)
        data = self.request.body.decode()
        log.debug("Model data to be saved: %s", data)
        try:
            model = StochSSModel(path=path)
            model.save(model=data)
            model.print_logs(log)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class RunModelAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running a model from the model editor.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Run the model with a 5 second timeout.  Results are sent to the
        client as a JSON object.

        Attributes
        ----------
        '''


class ModelExistsAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for checking if a model already exists.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Check if the model already exists.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the file: %s", path)
        model = StochSSModel(path=path)
        resp = {"exists":os.path.exists(model.get_path(full=True))}
        log.debug("Response: %s", resp)
        self.write(resp)
        self.finish()
