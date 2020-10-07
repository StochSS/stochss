#!/usr/bin/env python3

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
import traceback
from json.decoder import JSONDecodeError
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError


def is_unique(path):
    '''
    Checks if the new files name is unique and return a unique path.

    Attributes
    ----------
    path : str
        The path to the model file.
    '''
    from .rename import get_unique_file_name

    file_name = path.split('/').pop()
    dir_path = path.split(file_name)[0]
    return get_unique_file_name(file_name, dir_path)[0]


def get_model_data(path, to_spatial):
    '''
    Read the model data from the file and return it in json format.

    Attributes
    ----------
    path : str
        The path to the model file.
    '''
    try:
        with open(path, 'r') as model_file:
            model_data = json.loads(model_file.read())
        return model_data
    except FileNotFoundError as err:
        raise ModelNotFoundError("Could not read file: " + str(err), traceback.format_exc())
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The data is not JSON decobable: " + str(e), traceback.format_exc())


def convert_model(path, to_spatial):
    user_dir = "/home/jovyan"
    
    model_path = os.path.join(user_dir, path)
    model_data = get_model_data(model_path, to_spatial)
    from_ext = '.mdl' if to_spatial else '.smdl'
    to_ext = '.smdl' if to_spatial else '.mdl'
    model_path = is_unique(model_path.replace(from_ext, to_ext))
    
    try:
        model_data['is_spatial'] = to_spatial
    except KeyError as err:
        raise JSONFileNotModelError("Could not convert your model: " + str(err), traceback.format_exc())

    with open(model_path, 'w') as model_file:
        json.dump(model_data, model_file)

    old_model = path.split('/').pop()
    new_model = model_path.split('/').pop()
    return {"Message":"{0} was successfully convert to {1}!".format(old_model, new_model),"File":new_model}

