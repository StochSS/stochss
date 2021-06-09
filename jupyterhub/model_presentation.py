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

import ast
import json
import logging
import traceback
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from presentation_base import StochSSBase
from presentation_error import StochSSAPIError, report_error, \
							   StochSSFileNotFoundError, FileNotJSONFormatError

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
        log.debug("Purpose of the handler: %s", purpose)
        path = self.get_query_argument(name="path")
        log.debug("Path to the file: %s", path)
        self.set_header('Content-Type', 'application/json')
        file_objs = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        ext = path.split(".").pop()
        try:
            file = file_objs[ext](path=path)
            data = file.load()
            log.debug("Contents of the json file: %s", data)
            file.print_logs(log)
            self.write(data)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


def __read_model_file(model):
    try:
        with open(model.get_path(full=True), "r") as mdl_file:
            return json.load(mdl_file)
    except FileNotFoundError as err:
        message = f"Could not find the model file: {str(err)}"
        raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
    except json.decoder.JSONDecodeError as err:
        message = f"The model is not JSON decobable: {str(err)}"
        raise FileNotJSONFormatError(message, traceback.format_exc()) from err


class StochSSModel(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, path):
        '''
        Intitialize a model object

        Attributes
        ----------
        path : str
            Path to the model
        '''
        super().__init__(path=path)
        self.model = __read_model_file(self)


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
        self.model['name'] = self.get_name()
        self.model['directory'] = self.path
        return self.model


class StochSSSpatialModel(StochSSBase):
    '''
    ################################################################################################
    StochSS spatial model object
    ################################################################################################
    '''

    def __init__(self, path):
        '''
        Intitialize a spatial model object

        Attributes
        ----------
        path : str
            Path to the spatial model
        '''
        super().__init__(path=path)
        self.model = __read_model_file(self)


    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        self.model['name'] = self.get_name()
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
