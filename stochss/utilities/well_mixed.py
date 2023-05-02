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
import ast
import json
import copy
import traceback

from stochss.utilities.file import File
from stochss.utilities.server_errors import FileNotFoundAPIError, JSONDecodeAPIError
from stochss.templates.models import well_mixed_template

class WellMixed(File):
    r'''
    Well mixed model object used for interacting with well mixed models on the file system.

    :param path: Path to the well mixed model.
    :type path: str

    :param new: Indicates whether the well mixed model is new.
    :type new: bool

    :param model: Contents of the new well mixed model. Optional, ignored if new is not set.
    :type model: str | dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    TEMPLATE_VERSION = 1

    def __init__(self, path, new=False, model=None, **kwargs):
        if new:
            if not path.endswith(".mdl"):
                path = f"{path}.mdl"
            if model is None:
                model = json.dumps(well_mixed_template, sort_keys=True, indent=4)
            elif isinstance(model, dict):
                model = json.dumps(model, sort_keys=True, indent=4)

        super().__init__(path=path, new=new, make_unique=True, body=model, **kwargs)

        self.model_dict = None
        self.model_object = None
        self.loaded = False

    def __load_model_dict(self):
        try:
            with open(self.path, "r", encoding="utf-8") as model_fd:
                model_dict = json.load(model_fd)

            if "volume" not in model_dict and "volume" in model_dict['modelSettings']:
                model_dict['volume'] = model_dict['modelSettings']['volume']
            if "template_version" not in model_dict:
                model_dict['template_version'] = 0
            model_template = copy.deepcopy(well_mixed_template)
            model_template.update(model_dict)

            self.model_dict = model_template
            self.__update_model_to_current()
        except FileNotFoundError as err:
            msg = f"Could not find the well mixed model file: {str(err)}"
            raise FileNotFoundAPIError(msg, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError:
            msg = f"The well mixed model is not JSON decobable: {str(err)}"
            raise JSONDecodeAPIError(msg, traceback.format_exc()) from err

    def __load_model_object(self):
        pass

    def __update_event_assignments(self, event, param_ids): # pylint: disable=no-self-use
        if "eventAssignments" in event:
            for assignment in event['eventAssignments']:
                try:
                    if assignment['variable']['compID'] in param_ids:
                        assignment['variable']['expression'] = ast.literal_eval(assignment['variable']['expression'])
                except KeyError:
                    pass
                except ValueError:
                    pass

    def __update_events(self, param_ids):
        if len(param_ids) > 0:
            for event in self.model_dict['eventsCollection']:
                self.__update_event_assignments(event, param_ids)

    def __update_model_to_current(self):
        if self.model_dict['template_version'] == self.TEMPLATE_VERSION:
            return

        param_ids = self.__update_parameters()
        self.__update_reactions()
        self.__update_events(param_ids=param_ids)
        self.__update_rules(param_ids=param_ids)

        self.model_dict['template_version'] = self.TEMPLATE_VERSION

    def __update_parameters(self):
        param_ids = []
        for param in self.model_dict['parameters']:
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
        for reaction in self.model_dict['reactions']:
            if "odePropensity" not in reaction.keys():
                reaction['odePropensity'] = reaction['propensity']
            try:
                if reaction['rate'].keys() and isinstance(reaction['rate']['expression'], str):
                    reaction['rate']['expression'] = ast.literal_eval(reaction['rate']['expression'])
            except KeyError:
                pass
            except ValueError:
                pass

    def __update_rules(self, param_ids):
        if len(param_ids) > 0:
            for rule in self.model_dict['rules']:
                try:
                    if rule['variable']['compID'] in param_ids:
                        rule['variable']['expression'] = ast.literal_eval(rule['variable']['expression'])
                except KeyError:
                    pass
                except ValueError:
                    pass

    def load(self, dict_only=True):
        '''
        Load the contents of the well-mixed model file and convert the model to GillesPy2.

        :param dict_only: Indicates that only the well_mixed model dictionary is needed
        :type dict_only: bool
        '''
        self.loaded = True
        self.__load_model_dict()
        if not dict_only:
            self.__load_model_object()

    @classmethod
    def load_well_mixed_model(cls, path=None):
        '''
        Load the details of the well-mixed model for the model editor page.

        :param path: Path to the well-mixed model.
        :type path: str

        :returns: Contents of the well-mixed model for the model editor page.
        :rtype: dict
        '''
        model = cls(path)
        return model.to_dict()

    def to_dict(self):
        '''
        Update and return the model dictionary thats compatable with the stochss pages.

        :returns: The dictionary representation of the well mixed model.
        :rtype: dict
        '''
        if not self.loaded:
            self.load()

        self.model_dict['name'] = self.get_name()
        self.model_dict['directory'] = self.get_sanitized_path()
        return self.model_dict
