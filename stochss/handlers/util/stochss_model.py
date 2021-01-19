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
import ast
import json
import traceback

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, FileNotJSONFormatError

class StochSSModel(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, path, new=False, model=None):
        '''
        Intitialize a model object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the model
        new : bool
            Indicates whether or not the model is new
        model : str or dict
            Existing model data
        '''
        super().__init__(path=path)
        if new:
            if model is None:
                model = self.get_model_template()
            if isinstance(model, str):
                model = json.loads(model)
            self.model = model
            self.make_parent_dirs()
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w") as mdl_file:
                json.dump(model, mdl_file)
        else:
            self.model = None


    def __read_model_file(self):
        try:
            with open(self.get_path(full=True), "r") as mdl_file:
                self.model = json.load(mdl_file)
        except FileNotFoundError as err:
            message = f"Could not find the model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except json.decoder.JSONDecodeError as err:
            message = f"The model is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc())


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


    def convert_to_model(self):
        '''
        Convert a spatial model to a non_spatial model

        Attributes
        ----------
        '''
        s_model = self.load()
        s_model['is_spatial'] = False
        m_path = self.path.replace(".smdl", ".mdl")
        m_file = self.get_file(path=m_path)
        message = f"{self.get_file()} was successfully convert to {m_file}!"
        return {"Message":message, "File":m_file}, {"model":s_model, "path":m_path}


    def convert_to_spatial(self):
        '''
        Convert a non-spatial model to a spatial model

        Attributes
        ----------
        '''
        model = self.load()
        model['is_spatial'] = True
        s_path = self.path.replace(".mdl", ".smdl")
        s_file = self.get_file(path=s_path)
        message = f"{self.get_file()} was successfully convert to {s_file}!"
        return {"Message":message, "File":s_file}, {"spatial":model, "path":s_path}


    def load(self):
        '''
        Reads the model file, updates the model to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if self.model is None:
            self.__read_model_file()
        if "volume" not in self.model.keys():
            self.model['volume'] = self.model['modelSettings']['volume']
            del self.model['modelSettings']['volume']
        param_ids = self.__update_parameters()
        self.__update_reactions()
        self.__update_events(param_ids=param_ids)
        self.__update_rules(param_ids=param_ids)
        return self.model


    def save(self, model):
        '''
        Saves the model to an existing file

        Attributes
        ----------
        model : str
            Model to be saved
        '''
        path = self.get_path(full=True)
        self.log("debug", f"Full path to the model: {path}")
        if os.path.exists(path):
            with open(path, 'w') as file:
                file.write(model)
            self.log("debug", f"Saved the model: {self.get_name()}")
        else:
            message = f"Could not find the model file: {self.get_path()}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
