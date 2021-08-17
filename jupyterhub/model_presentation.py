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

import ast
import json
import logging

from presentation_base import StochSSBase, get_presentation_from_user
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
        owner = self.get_query_argument(name="owner")
        log.debug(f"Container id of the owner: {owner}")
        file = self.get_query_argument(name="file")
        log.debug(f"Name to the file: {file}")
        self.set_header('Content-Type', 'application/json')
        try:
            model = get_presentation_from_user(owner=owner, file=file, kwargs={"file": file},
                                               process_func=process_model_presentation)
            log.debug(f"Contents of the json file: {model}")
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
        log.debug(f"Container id of the owner: {owner}")
        log.debug(f"Name to the file: {file}")
        self.set_header('Content-Type', 'application/json')
        model = get_presentation_from_user(owner=owner, file=file,
                                           kwargs={"for_download": True},
                                           process_func=process_model_presentation)
        ext = file.split(".").pop()
        self.set_header('Content-Disposition', f'attachment; filename="{model["name"]}.{ext}"')
        log.debug(f"Contents of the json file: {model}")
        self.write(model)
        self.finish()


def process_model_presentation(path, file=None, for_download=False):
    '''
    Get the model presentation data from the file.

    Attributes
    ----------
    path : str
        Path to the model presentation file.
    file : str
        Name of the presentation file.
    for_download : bool
        Whether or not the model presentation is being downloaded.
    '''
    with open(path, "r") as mdl_file:
        model = json.load(mdl_file)
    if for_download:
        return model
    file_objs = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
    ext = file.split(".").pop()
    file_obj = file_objs[ext](model=model)
    model_pres = file_obj.load()
    file_obj.print_logs(log)
    return model_pres


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
