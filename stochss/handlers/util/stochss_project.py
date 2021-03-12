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
import traceback

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileExistsError

class StochSSProject(StochSSBase):
    '''
    ################################################################################################
    StochSS project object
    ################################################################################################
    '''

    def __init__(self, path, new=False):
        '''
        Intitialize a project object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the project
        new : bool
            Indicates whether or not the workflow is new
        '''
        super().__init__(path=path)
        if new:
            try:
                os.makedirs(os.path.join(self.get_path(full=True), "trash"))
            except FileExistsError:
                message = f"Could not create your project: {self.path}"
                raise StochSSFileExistsError(message, traceback.format_exc())
