'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
import logging
import traceback

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class DownloadExampleAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for downloading example projects from the hub container.
    ################################################################################################
    '''
    async def get(self, file):
        '''
        Download the example project from the hubs presentation cache.

        Attributes
        ----------
        '''
        log.debug(f"Name to the file: {file}")
        self.set_header('Content-Type', 'application/zip')
        try:
        	path = os.path.join("/tmp/presentation_cache", file)
            with open(path, "rb") as exmp_file:
            	example = exmp_file.read()
            self.set_header('Content-Disposition', f'attachment; filename="{file}"')
            self.write(example)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()