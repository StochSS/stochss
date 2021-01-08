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
import shutil
import zipfile
import datetime
import traceback

from stochss.handlers.util.stochss_error import StochSSFileExistsError

class StochSSFolder():
    '''
    ################################################################################################
    StochSS folder object
    ################################################################################################
    '''
    user_dir = "/home/jovyan"

    def init(self, path, new=False):
        '''
        Intitialize a folder object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the folder
        new : bool
            Idicates whether or not the folder is new
        '''
        self.path = path
        path = os.path.join(self.user_dir, path)
        if new:
            try:
                os.makedirs(path)
            except FileExistsError as err:
                message = f"Could not create your directory: {str(err)}"
                raise StochSSFileExistsError(message, traceback.format_exc())