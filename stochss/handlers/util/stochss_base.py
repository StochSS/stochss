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

class StochSSBase():
    '''
    ################################################################################################
    StochSS base object
    ################################################################################################
    '''
    user_dir = "/home/jovyan"

    def __init__(self, path):
        '''
        Intitialize a file object

        Attributes
        ----------
        path : str
            Path to the folder
        '''
        self.path = path


    def get_name(self, path=None):
        '''
        Get the file name from the file path or provided path

        Attributes
        ----------
        path : str
            Path to a file
        '''
        name = self.path if path is None else path
        if name.endswith("/"):
            name = name[:-1]
        name = name.split('/').pop()
        if "." not in name:
            return name
        return '.'.join(name.split('.')[:-1])


    def get_path(self, full=False):
        '''
        Get the path to the file

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        if full:
            return os.path.join(self.user_dir, self.path)
        return self.path
