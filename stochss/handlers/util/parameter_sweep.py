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

from .stochss_workflow import StochSSWorkflow

class ParameterSweep(StochSSWorkflow):
    '''
    ################################################################################################
    StochSS parameter sweep workflow object
    ################################################################################################
    '''

    TYPE = "parameterSweep"

    def __init__(self, path):
        '''
        Intitialize an parameter sweep workflow object

        Attributes
        ----------
        path : str
            Path to the workflow
        '''
        super().__init__(path=path)
        self.g_model, self.s_model = self.load_models()
        self.settings = self.load_settings()
