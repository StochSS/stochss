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

import json

from .stochss_base import StochSSBase

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
                model = self.get_model_template(as_string=True)
            if isinstance(model, dict):
                model = json.dumps(model)
            self.make_parent_dirs()
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w") as mdl_file:
                mdl_file.write(model)
