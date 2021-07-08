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

import json
import logging
import nbformat

from nbviewer.render import render_notebook
from nbconvert.exporters import HTMLExporter

from presentation_base import get_presentation_from_user

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class NotebookAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for getting notebook presentations from user containers.
    ################################################################################################
    '''
    async def get(self):
        '''
        Load the notebook presentation from User's presentations directory.

        Attributes
        ----------
        '''
        owner = self.get_query_argument(name="owner")
        log.debug("Container id of the owner: %s", owner)
        file = self.get_query_argument(name="file")
        log.debug("Name to the file: %s", file)
        html = get_presentation_from_user(owner=owner, file=file,
                                          process_func=process_notebook_presentation)
        self.write(html)
        self.finish()


class DownNotebookPresentationAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for downloading notebook presentations from user containers.
    ################################################################################################
    '''
    async def get(self, owner, file):
        '''
        Download the notebook presentation from User's presentations directory.

        Attributes
        ----------
        '''
        log.debug("Container id of the owner: %s", owner)
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/json')
        nb_presentation = get_presentation_from_user(owner=owner, file=file,
                                                     kwargs={"as_dict": True},
                                                     process_func=process_notebook_presentation)
        self.set_header('Content-Disposition', f'attachment; filename="{nb_presentation["file"]}"')
        log.debug("Contents of the json file: %s", nb_presentation['notebook'])
        self.write(nb_presentation['notebook'])
        self.finish()


def process_notebook_presentation(path, as_dict=False):
    '''
    Get the notebook presentation data from the file.

    Attributes
    ----------
    path : str
        Path to the notebook presentation file
    as_dict : bool
        Whether or not to return the data as a dictionary
    '''
    with open(path, "r") as nb_file:
        nb_presentation = json.load(nb_file)
    if as_dict:
        return nb_presentation
    notebook = nbformat.reads(json.dumps(nb_presentation['notebook']), as_version=4)
    nb_format = {"exporter": HTMLExporter}
    html, _ = render_notebook(format=nb_format, nb=notebook)
    return html
