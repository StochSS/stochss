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
import uuid
import logging
import subprocess
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSModel, StochSSSpatialModel, StochSSNotebook, StochSSAPIError, report_error


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
        file_objs = {"ipynb":StochSSNotebook, "mdl":StochSSModel, "smdl":StochSSSpatialModel}
        ext = path.split(".").pop()
        try:
            file = file_objs[ext](path=path)
            data = file.load()
            log.debug("Contents of the json file: %s", data)
            file.print_logs(log)
            self.write(data)
        except StochSSAPIError as load_err:
            if purpose == "edit" and ext != "ipynb":
                try:
                    model = file_objs[ext](path=path, new=True)
                    data = model.load()
                    log.debug("Contents of the model template: %s", data)
                    model.print_logs(log)
                    self.write(data)
                except StochSSAPIError as new_model_err:
                    report_error(self, log, new_model_err)
            else:
                report_error(self, log, load_err)
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
            if path.endswith(".domn"):
                model = StochSSSpatialModel(path=path)
                model.save_domain(domain=data)
            else:
                model = StochSSModel(path=path)
                model.save(model=data)
                model.print_logs(log)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class LoadDomainEditorAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for loading the domain editor for spatial models.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Load and return the spatial model, domain, and domain plot.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the spatial model: %s", path)
        d_path = self.get_query_argument(name="domain_path", default=None)
        if d_path is not None:
            log.debug("Path to the domain file: %s", d_path)
        new = self.get_query_argument(name="new", default=False)
        log.debug("The domain is new: %s", new)
        try:
            model = StochSSSpatialModel(path=path)
            domain = model.get_domain(path=d_path, new=new)
            resp = {"model":model.load(), "domain":domain}
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class LoadDomainAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for loading the domain for the spatial model editor.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Load and return the domain plot.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the spatial model: %s", path)
        d_path = self.get_query_argument(name="domain_path", default=None)
        if d_path is not None:
            log.debug("Path to the domain file: %s", d_path)
        new = self.get_query_argument(name="new", default=False)
        log.debug("The domain is new: %s", new)
        try:
            model = StochSSSpatialModel(path=path)
            fig = json.loads(model.get_domain_plot(path=d_path))
            resp = {"fig":fig}
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class RunModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for running a model from the model editor.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Run the model with a 5 second timeout.  Results are sent to the
        client as a JSON object.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the model: %s", path)
        run_cmd = self.get_query_argument(name="cmd")
        log.debug("Run command sent to the script: %s", run_cmd)
        outfile = self.get_query_argument(name="outfile")
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile = str(uuid.uuid4()).replace("-", "_")
        log.debug("Temporary outfile: %s", outfile)
        resp = {"Running":False, "Outfile":outfile, "Results":""}
        if run_cmd == "start":
            exec_cmd = ['/stochss/stochss/handlers/util/scripts/run_preview.py',
                        f'{path}', f'{outfile}']
            log.debug("Script commands for running a preview: %s", exec_cmd)
            subprocess.Popen(exec_cmd)
            resp['Running'] = True
            log.debug("Response to the start command: %s", resp)
            self.write(resp)
        else:
            model = StochSSModel(path=path)
            results = model.get_preview_results(outfile=outfile)
            log.debug("Results for the model preview: %s", results)
            if results is None:
                resp['Running'] = True
            else:
                resp['Results'] = results
            log.debug("Response to the read command: %s", resp)
            self.write(resp)
        self.finish()


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
