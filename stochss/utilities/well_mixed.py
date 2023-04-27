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

from stochss.utilities.file import File
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
    def __init__(self, path, new=True, model=None, **kwargs):
        if new:
            if not path.endswith(".mdl"):
                path = f"{path}.mdl"
            if model is None:
                model = json.dumps(well_mixed_template, sort_keys=True, indent=4)
            elif isinstance(model, dict):
                model = json.dumps(model, sort_keys=True, indent=4)

        super().__init__(path=path, new=new, make_unique=True, body=model, **kwargs)
