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
import logging
from tornado import web
from notebook.base.handlers import IPythonHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
class PageHandler(IPythonHandler):
    '''
    Base handler for rendering stochss pages.
    '''
    def get_template_path(self):
        '''
        Retrieve the location of stochss pages output by webpack.
        The html pages are located in the same directory as static assets.
        '''
        return self.settings['config']['NotebookApp']['extra_static_paths'][0]

    @classmethod
    def get_server_path(cls):
        try:
            server_path = os.environ['JUPYTERHUB_SERVICE_PREFIX']
        except KeyError:
            server_path = '/'

        return server_path


class HomeHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-home.html", server_path=self.get_server_path())


class UserHomeHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-user-home.html", server_path=self.get_server_path())


class QuickstartHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-quickstart.html", server_path=self.get_server_path())


class ModelBrowserHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-file-browser.html", server_path=self.get_server_path())


class ModelEditorHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-model-editor.html", server_path=self.get_server_path())


class WorkflowSelectionHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-workflow-selection.html", server_path=self.get_server_path())


class WorkflowEditorHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-workflow-manager.html", server_path=self.get_server_path())


class ProjectBrowserHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-project-browser.html", server_path=self.get_server_path())


class ProjectManagerHandler(PageHandler):
    @web.authenticated
    async def get(self):
        self.render("stochss-project-manager.html", server_path=self.get_server_path())
