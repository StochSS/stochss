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
import uuid
import logging
import subprocess
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSFolder, StochSSModel, StochSSSpatialModel, StochSSNotebook, \
                  StochSSAPIError, report_error


log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
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
        log.debug(f"Purpose of the handler: {purpose}")
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the file: {path}")
        self.set_header('Content-Type', 'application/json')
        file_objs = {"ipynb":StochSSNotebook, "mdl":StochSSModel, "smdl":StochSSSpatialModel}
        ext = path.split(".").pop()
        if ext == "ipynb":
            log.info("Getting notebook data for download")
        elif purpose == "None":
            log.info("Getting model data for download")
        else:
            log.info("Loading model data")
        try:
            file = file_objs[ext](path=path)
            data = file.load()
            log.debug(f"Contents of the json file: {data}")
            file.print_logs(log)
            self.write(data)
        except StochSSAPIError as load_err:
            if purpose == "edit" and ext != "ipynb":
                try:
                    model = file_objs[ext](path=path, new=True)
                    data = model.load()
                    log.debug(f"Contents of the model template: {data}")
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
        log.debug(f"Path to the model: {path}")
        data = self.request.body.decode()
        log.debug(f"Model data to be saved: {data}")
        try:
            if path.endswith(".domn"):
                model = StochSSSpatialModel(path=path)
                log.info(f"Saving {model.get_file(path=path)}")
                model.save_domain(domain=data)
            else:
                model = StochSSModel(path=path)
                log.info(f"Saving {model.get_file(path=path)}")
                model.save(model=data)
                model.print_logs(log)
            log.info(f"Successfully saved {model.get_file(path=path)}")
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
        path = self.get_query_argument(name="path", default=None)
        log.debug(f"Path to the spatial model: {path}")
        d_path = self.get_query_argument(name="domain_path", default=None)
        if d_path is not None:
            log.debug(f"Path to the domain file: {d_path}")
        new = self.get_query_argument(name="new", default=False)
        log.debug(f"The domain is new: {new}")
        log.info("Loading the domain data")
        try:
            model = StochSSSpatialModel(path=path)
            domain = model.get_domain(path=d_path, new=new)
            s_model = None if path is None else model.load()
            resp = {"model":s_model, "domain":domain}
            log.debug(f"Response: {resp}")
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
        path = self.get_query_argument(name="path", default=None)
        log.debug(f"Path to the spatial model: {path}")
        d_path = self.get_query_argument(name="domain_path", default=None)
        if d_path is not None:
            log.debug(f"Path to the domain file: {d_path}")
        new = self.get_query_argument(name="new", default=False)
        log.debug(f"The domain is new: {new}")
        log.info("Generating the domain plot")
        try:
            model = StochSSSpatialModel(path=path)
            fig = json.loads(model.get_domain_plot(path=d_path, new=new))
            log.info("Loading the domain plot")
            resp = {"fig":fig}
            log.debug(f"Response: {resp}")
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
        log.debug(f"Path to the model: {path}")
        run_cmd = self.get_query_argument(name="cmd")
        log.debug(f"Run command sent to the script: {run_cmd}")
        outfile = self.get_query_argument(name="outfile")
        # Create temporary results file it doesn't already exist
        if outfile == 'none':
            outfile = str(uuid.uuid4()).replace("-", "_")
        log.debug(f"Temporary outfile: {outfile}")
        target = self.get_query_argument(name="target", default=None)
        resp = {"Running":False, "Outfile":outfile, "Results":""}
        if run_cmd == "start":
            model = StochSSModel(path=path)
            if os.path.exists(f".{model.get_name()}-preview.json"):
                os.remove(f".{model.get_name()}-preview.json")
            exec_cmd = ['/stochss/stochss/handlers/util/scripts/run_preview.py',
                        f'{path}', f'{outfile}']
            if target is not None:
                exec_cmd.insert(1, "--target")
                exec_cmd.insert(2, f"{target}")
            log.debug(f"Script commands for running a preview: {exec_cmd}")
            subprocess.Popen(exec_cmd)
            resp['Running'] = True
            log.debug(f"Response to the start command: {resp}")
            self.write(resp)
        else:
            model = StochSSModel(path=path)
            log.info("Check for preview results ...")
            results = model.get_preview_results(outfile=outfile)
            log.debug(f"Results for the model preview: {results}")
            if results is None:
                resp['Running'] = True
                resp['Results'] = model.get_live_results()
                log.info("The preview is still running")
            else:
                resp['Results'] = results
                log.info("Loading the preview results")
            log.debug(f"Response to the read command: {resp}")
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
        log.debug(f"Path to the file: {path}")
        model = StochSSModel(path=path)
        resp = {"exists":os.path.exists(model.get_path(full=True))}
        log.debug(f"Response: {resp}")
        self.write(resp)
        self.finish()


class ImportMeshAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for importing domain particles from remote file.
    ################################################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Imports particles from a domain file to add to a domain.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        log.info(f"Loading the doamin from {self.request.files['datafile'][0]['filename']}")
        data = self.request.files['datafile'][0]['body'].decode()
        if "typefile" in self.request.files.keys():
            log.info(f"Loading the particle types from \
                        {self.request.files['typefile'][0]['filename']}")
            types = self.request.files['typefile'][0]['body'].decode().strip().split("\n")
        else:
            types = None
        log.info("Loading particle data")
        particle_data = json.loads(self.request.body_arguments['particleData'][0].decode())
        try:
            log.info("Generating new particles")
            resp = StochSSSpatialModel.get_particles_from_remote(doamin=data, data=particle_data,
                                                                 types=types)
            log.debug(f"Number of Particles: {len(resp['particles'])}")
            log.info("Successfully created new particles")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class LoadExternalDomains(APIHandler):
    '''
    ################################################################################################
    Handler for getting external domain files.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Get all domain files on disc.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        try:
            folder = StochSSFolder(path="")
            test = lambda ext, root, file: bool("trash" in root.split("/"))
            resp = folder.get_file_list(ext=".domn", test=test)
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class LoadParticleTypesDescriptions(APIHandler):
    '''
    ################################################################################################
    Handler for getting particle type description files.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Get text files on disc for particles type description selection.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        try:
            folder = StochSSFolder(path="")
            test = lambda ext, root, file: bool("trash" in root.split("/"))
            resp = folder.get_file_list(ext=".txt", test=test)
            log.debug("Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class Create3DDomainAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating a 3D domain.
    ################################################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Create a 3D domain and return its particles.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        log.info("Loading particle data")
        data = json.loads(self.request.body.decode())
        log.debug("Data used to create the domain: {data}")
        try:
            log.info("Generating new particles")
            resp = StochSSSpatialModel.get_particles_from_3d_domain(data=data)
            log.debug(f"Number of Particles: {len(resp['particles'])}")
            log.info("Successfully created new particles")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class GetParticlesTypesAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler getting particle types.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Get particle types from a text file.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("Path to the file: {}", path)
        try:
            log.info(f"Loading particle types from {path.split('/').pop()}")
            model = StochSSSpatialModel(path="")
            resp = model.get_types_from_file(path=path)
            log.debug(f"Number of Particles: {len(resp['types'])}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ModelPresentationAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler publishing model presentations.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Publish a model or spatial model presentation.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the file: {path}")
        file_objs = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        ext = path.split(".").pop()
        try:
            model = file_objs[ext](path=path)
            log.info(f"Publishing the {model.get_name()} presentation")
            links, data = model.publish_presentation()
            if data is None:
                message = f"A presentation for {model.get_name()} already exists."
            else:
                message = f"Successfully published the {model.get_name()} presentation."
                file_objs[ext](**data)
            resp = {"message": message, "links": links}
            log.info(resp['message'])
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class CreateNewBoundCondAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler creating new boundary conditions.
    ################################################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Creates a new restricted boundary condition.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body.decode())
        path = data['model_path']
        kwargs = data['kwargs']
        log.debug(f"Args passed to the boundary condition constructor: {kwargs}")
        try:
            log.info("Creating the new boundary condition")
            model = StochSSSpatialModel(path=path)
            resp = model.create_boundary_condition(kwargs)
            log.info("Successfully created the new boundary condition")
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
