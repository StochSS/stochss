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

from .stochss_folder import StochSSFolder

class StochSSWorkflow(StochSSFolder):
    '''
    ################################################################################################
    StochSS workflow object
    ################################################################################################
    '''

    def __init__(self, path, new=False):
        '''
        Intitialize a workflow object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the workflow
        new : bool
            Indicates whether or not the workflow is new
        '''
        super().__init__(path=path, new=new)


    def get_status(self):
        '''
        Get the current status of the workflow

        Attributes
        ----------
        '''
        path = os.path.join(self.user_dir, self.path)
        files = os.listdir(path=path)
        if "COMPLETE" in files:
            return "complete"
        if "ERROR" in files:
            return "error"
        if "RUNNING" in files:
            return "running"
        return "ready"
