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
import ast
import json
import logging
import tarfile
import tempfile

import docker

from presentation_base import StochSSBase
from presentation_error import StochSSAPIError, report_error

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class JsonFileAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for getting model presentations from user containers.
    ################################################################################################
    '''
    async def get(self):
        '''
        Load the model presentation from User's presentations directory.

        Attributes
        ----------
        '''
        log.setLevel(logging.DEBUG)
        owner = self.get_query_argument(name="owner")
        log.debug("Container id of the owner: %s", owner)
        file = self.get_query_argument(name="file")
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/json')
        file_objs = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        ext = file.split(".").pop()
        try:
            model = get_presentation_from_user(owner=owner, file=file)
            file_obj = file_objs[ext](model=model)
            model = file_obj.load()
            log.debug("Contents of the json file: %s", model)
            file_obj.print_logs(log)
            self.write(model)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


class DownModelPresentationAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for downloading model presentations from user containers.
    ################################################################################################
    '''
    async def get(self, owner, file):
        '''
        Download the model presentation from User's presentations directory.

        Attributes
        ----------
        '''
        log.debug("Container id of the owner: %s", owner)
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/json')
        try:
            model = get_presentation_from_user(owner=owner, file=file)
            ext = file.split(".").pop()
            self.set_header('Content-Disposition', f'attachment; filename="{model["name"]}.{ext}"')
            log.debug("Contents of the json file: %s", model)
            self.write(model)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


def get_presentation_from_user(owner, file):
    '''
    Get the model presentation from the users container

    Attributes
    ----------
    owner : str
        Hostname of the user container
    file : str
        Name of the model presentation file
    '''
    client = docker.from_env()
    containers = client.containers.list()
    user_container = list(filter(lambda container: container.name == f"jupyter-{owner}",
                                 containers))[0]
    user_model_path = f'/home/jovyan/.presentations/{file}'
    tar_mdl = tempfile.TemporaryFile()
    bits, _ = user_container.get_archive(user_model_path)
    for chunk in bits:
        tar_mdl.write(chunk)
    tar_mdl.seek(0)
    tar_file = tarfile.TarFile(fileobj=tar_mdl)
    tmp_dir = tempfile.TemporaryDirectory()
    tar_file.extractall(tmp_dir.name)
    tar_mdl.close()
    mdl_path = os.path.join(tmp_dir.name, file)
    with open(mdl_path, "r") as mdl_file:
        return json.load(mdl_file)


class StochSSModel(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, model):
        '''
        Intitialize a model object

        Attributes
        ----------
        model : dict
            Existing model data
        '''
        super().__init__()
        self.model = model


    @classmethod
    def __update_event_assignments(cls, event, param_ids):
        if "eventAssignments" not in event.keys():
            return
        for assignment in event['eventAssignments']:
            try:
                if assignment['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(assignment['variable']['expression'])
                    assignment['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def __update_events(self, param_ids):
        if "eventsCollection" not in self.model.keys() or not param_ids:
            return
        for event in self.model['eventsCollection']:
            self.__update_event_assignments(event=event, param_ids=param_ids)


    def __update_parameters(self):
        if "parameters" not in self.model.keys():
            return []
        param_ids = []
        for param in self.model['parameters']:
            try:
                param_ids.append(param['compID'])
                if isinstance(param['expression'], str):
                    param['expression'] = ast.literal_eval(param['expression'])
            except KeyError:
                pass
            except ValueError:
                pass
        return param_ids


    def __update_reactions(self):
        if "reactions" not in self.model.keys():
            return
        for reaction in self.model['reactions']:
            try:
                if reaction['rate'].keys() and isinstance(reaction['rate']['expression'], str):
                    expression = ast.literal_eval(reaction['rate']['expression'])
                    reaction['rate']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def __update_rules(self, param_ids):
        if "rules" not in self.model.keys() or not param_ids:
            return
        for rule in self.model['rules']:
            try:
                if rule['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(rule['variable']['expression'])
                    rule['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def load(self):
        '''
        Reads the model file, updates the model to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if "annotation" not in self.model.keys():
            self.model['annotation'] = ""
        if "volume" not in self.model.keys():
            if "volume" in self.model['modelSettings'].keys():
                self.model['volume'] = self.model['modelSettings']['volume']
            else:
                self.model['volume'] = 1
        param_ids = self.__update_parameters()
        self.__update_reactions()
        self.__update_events(param_ids=param_ids)
        self.__update_rules(param_ids=param_ids)
        return self.model


class StochSSSpatialModel(StochSSBase):
    '''
    ################################################################################################
    StochSS spatial model object
    ################################################################################################
    '''

    def __init__(self, model):
        '''
        Intitialize a spatial model object

        Attributes
        ----------
        model : dict
            Existing model data
        '''
        super().__init__()
        self.model = model


    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if not self.model['defaultMode']:
            self.model['defaultMode'] = "discrete"
        if "static" not in self.model['domain'].keys():
            self.model['domain']['static'] = True
        for species in self.model['species']:
            if "types" not in species.keys():
                species['types'] = list(range(1, len(self.model['domain']['types'])))
            if "diffusionConst" not in species.keys():
                diff = 0.0 if "diffusionCoeff" not in species.keys() else species['diffusionCoeff']
                species['diffusionConst'] = diff
        for reaction in self.model['reactions']:
            if "types" not in reaction.keys():
                reaction['types'] = list(range(1, len(self.model['domain']['types'])))
        return self.model
