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

import logging
from tornado.log import LogFormatter

log = logging.getLogger('stochss')

def init_log():
    ch = logging.StreamHandler()
    formatter = LogFormatter(fmt='%(color)s[%(levelname)1.1s %(asctime)s StochSS %(filename)s:%(lineno)d]%(end_color)s %(message)s', datefmt='%H:%M:%S')
    ch.setFormatter(formatter)
    log.setLevel(logging.WARNING)
    log.addHandler(ch)
    log.propagate = False
    
