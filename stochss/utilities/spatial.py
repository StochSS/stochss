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
import json
import traceback

from stochss.utilities.file import File
from stochss.utilities.domain import Domain
from stochss.utilities.server_errors import FileNotFoundAPIError, JSONDecodeAPIError
from stochss.templates.models import spatial_template

class Spatial(File):
    r'''
    Spatial model object used for interacting with spatial models on the file system.

    :param path: Path to the spatial model.
    :type path: str

    :param new: Indicates whether the spatial is new.
    :type new: bool

    :param model: Contents of the new spatial model. Optional, ignored if new is not set.
    :type model: str | dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    TEMPLATE_VERSION = 1

    def __init__(self, path, new=True, model=None, **kwargs):
        if new:
            if not path.endswith(".smdl"):
                path = f"{path}.smdl"
            if model is None:
                model = json.dumps(spatial_template, sort_keys=True, indent=4)
            elif isinstance(model, dict):
                model = json.dumps(model, sort_keys=True, indent=4)

        super().__init__(path=path, new=new, make_unique=True, body=model, **kwargs)

        self.loaded = False
        self.model_dict = None
        self.model_object = None

    def __load_model_dict(self):
        try:
            with open(self.path, "r", encoding="utf-8") as model_fd:
                model_dict = json.load(model_fd)

            if "template_version" not in model_dict:
                model_dict['template_version'] = 0
            spatial_template.update(model_dict)

            self.model_dict = spatial_template
            self.model_dict['domain'] = Domain(
                self.get_sanitized_path(), domain=model_dict['domain']
            ).to_dict(nested=True)
            self.__update_model_to_current()
        except FileNotFoundError as err:
            msg = f"Could not find the spatial model file: {str(err)}"
            raise FileNotFoundAPIError(msg, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError:
            msg = f"The spatial model is not JSON decobable: {str(err)}"
            raise JSONDecodeAPIError(msg, traceback.format_exc()) from err

    def __load_model_object(self):
        pass

    def __update_model_to_current(self):
        if self.model_dict['template_version'] == self.TEMPLATE_VERSION:
            return

        if self.model_dict['defaultMode'] == "":
            self.model_dict['defaultMode'] = "discrete"
        elif self.model_dict['defaultMode'] == "dynamic":
            self.model_dict['defaultMode'] = "discrete-concentration"
        if "timestepSize" not in self.model_dict['modelSettings']:
            self.model_dict['modelSettings']['timestepSize'] = 1e-5
        domain_types = list(range(1, len(self.model_dict['domain']['types'])))
        for species in self.model_dict['species']:
            if "types" not in species:
                species['types'] = domain_types
            if "diffusionConst" not in species:
                species['diffusionConst'] = species['diffusionCoeff'] if "diffusionCoeff" in species else 0.0
        for reaction in self.model_dict['reactions']:
            if "odePropensity" not in reaction:
                reaction['odePropensity'] = reaction['propensity']
            if "types" not in reaction:
                reaction['types'] = domain_types

        self.model_dict['template_version'] = self.TEMPLATE_VERSION

    def load(self, dict_only=True):
        '''
        Load the contents of the model file and convert the model to Spatial.

        :param dict_only: Indicates that only the model dictionary is needed
        :type dict_only: bool
        '''
        self.__load_model_dict()
        if not dict_only:
            self.__load_model_object()
        self.loaded = True

    def to_dict(self, domain_only=True):
        '''
        Update and return the model dictionary thats compatable with the stochss pages.

        :param domain_only: indicates that only the models domain was requested.
        :type domain_only: bool

        :returns: The dictionary representation of the spatial model.
        :rtype: dict
        '''
        if not self.loaded:
            self.load()

        if domain_only:
            return self.model_dict['domain']
        self.model_dict['name'] = self.get_name()
        self.model_dict['directory'] = self.get_sanitized_path()
        return self.model_dict
