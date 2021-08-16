'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

import logging

def init_log():
    ''' Initialize the user container logger '''
    log = logging.getLogger('tornado.log.stochss')
    # Create console handler and set level to debug
    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('[%(asctime)s StochSS][%(levelname)s] %(message)s')
    handler.setFormatter(formatter)
    # add ch to StochSS logger
    log.addHandler(log)

def get_log():
    ''' Get the user container logger. '''
    logging.getLogger('tornado.log.stochss')
