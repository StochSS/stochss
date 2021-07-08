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

import os
import json
import tarfile
import logging
import tempfile
import nbformat

from nbviewer.render import render_notebook
from nbconvert.exporters import HTMLExporter

import docker

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
        notebook = get_presentation_from_user(owner=owner, file=file)
        html = convert_notebook_to_html(notebook=notebook)
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
        nb_presentation = get_presentation_from_user(owner=owner, file=file, as_dict=True)
        self.set_header('Content-Disposition', f'attachment; filename="{nb_presentation["file"]}"')
        log.debug("Contents of the json file: %s", nb_presentation['notebook'])
        self.write(nb_presentation['notebook'])
        self.finish()


def convert_notebook_to_html(notebook):
    '''
    Convert the notebook object into html.

    Attributes
    ----------
    notebook : NotebookNode
        Notebook read in using nbformat
    '''
    nb_format = {"exporter": HTMLExporter}
    html, config = render_notebook(format=nb_format, nb=notebook)
    return html


def get_presentation_from_user(owner, file, as_dict=False):
    '''
    Get the model presentation from the users container

    Attributes
    ----------
    owner : str
        Hostname of the user container
    file : str
        Name of the model presentation file
    '''
    client = docker.from_env()
    containers = client.containers.list()
    user_container = list(filter(lambda container: container.name == f"jupyter-{owner}",
                                 containers))[0]
    user_nb_path = f'/home/jovyan/.presentations/{file}'
    tar_nb = tempfile.TemporaryFile()
    bits, _ = user_container.get_archive(user_nb_path)
    for chunk in bits:
        tar_nb.write(chunk)
    tar_nb.seek(0)
    tar_file = tarfile.TarFile(fileobj=tar_nb)
    tmp_dir = tempfile.TemporaryDirectory()
    tar_file.extractall(tmp_dir.name)
    tar_nb.close()
    nb_path = os.path.join(tmp_dir.name, file)
    with open(nb_path, "r") as nb_file:
        nb_presentation = json.load(nb_file)
        if as_dict:
            return nb_presentation
        return nbformat.reads(json.dumps(nb_presentation['notebook']), as_version=4)
