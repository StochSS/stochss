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
import numpy

class NumpyEncoder(json.JSONEncoder):
    '''
    ################################################################################################
    Custom json encoder for numpy ndarrays
    ################################################################################################
    '''
    def default(self, o):
        if isinstance(o, numpy.ndarray):
            return o.tolist()
        if isinstance(o, numpy.int64):
            return int(o)
        return json.JSONEncoder.default(self, o)
