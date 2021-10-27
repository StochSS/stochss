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
import logging
from tornado import web
from notebook.base.handlers import IPythonHandler, APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class PageHandler(IPythonHandler):
    '''
    ################################################################################################
    Base handler for rendering stochss pages.
    ################################################################################################
    '''
    def get_template_path(self):
        '''
        Retrieve the location of stochss pages output by webpack.
        The html pages are located in the same directory as static assets.

        Attributes
        ----------
        '''
        return self.settings['config']['NotebookApp']['extra_static_paths'][0]

    @classmethod
    def get_server_path(cls):
        '''
        Retrieve the path to the server.

        Attributes
        ----------
        '''
        try:
            server_path = os.environ['JUPYTERHUB_SERVICE_PREFIX']
        except KeyError:
            server_path = '/'

        return server_path


class HomeHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Home Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS home page.

        Attributes
        ----------
        '''
        self.render("stochss-home.html", server_path=self.get_server_path())


class UserHomeHandler(PageHandler):
    '''
    ################################################################################################
    StochSS User Home Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS user home page.

        Attributes
        ----------
        '''
        self.render("stochss-user-home.html", server_path=self.get_server_path())


class QuickstartHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Tutorials Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS tutorials page.

        Attributes
        ----------
        '''
        self.render("stochss-quickstart.html", server_path=self.get_server_path())


class ModelBrowserHandler(PageHandler):
    '''
    ################################################################################################
    StochSS File Browser Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS file browser page.

        Attributes
        ----------
        '''
        self.render("stochss-file-browser.html", server_path=self.get_server_path())


class ModelEditorHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Model Editor Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS model editor page.

        Attributes
        ----------
        '''
        self.render("stochss-model-editor.html", server_path=self.get_server_path())


class DomainEditorHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Domain Editor Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS domain editor page.

        Attributes
        ----------
        '''
        self.render("stochss-domain-editor.html", server_path=self.get_server_path())


class WorkflowSelectionHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Workflow Selection Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS workflow selection page.

        Attributes
        ----------
        '''
        self.render("stochss-workflow-selection.html", server_path=self.get_server_path())


class WorkflowEditorHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Workflow Manager Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS workflow manager page.

        Attributes
        ----------
        '''
        self.render("stochss-workflow-manager.html", server_path=self.get_server_path())


class ProjectManagerHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Project Manager Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS project manager page.

        Attributes
        ----------
        '''
        self.render("stochss-project-manager.html", server_path=self.get_server_path())


class LoadingPageHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Loading Page Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS loading page.

        Attributes
        ----------
        '''
        self.render("stochss-loading-page.html", server_path=self.get_server_path())


class MultiplePlotsHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Multiple Plots Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS multiple plots page.

        Attributes
        ----------
        '''
        self.render("multiple-plots-page.html", server_path=self.get_server_path())


class UserLogsAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting the user logs
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Return the contents of the user log file.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        log_num = self.get_query_arguments(name="logNum")[0]
        path = os.path.join("/var/logs/.user-logs.txt")
        try:
            if os.path.exists(f"{path}.bak"):
                with open(path, "r") as log_file:
                    logs = log_file.read().strip().split("\n")
            else:
                logs = []
            with open(path, "r") as log_file:
                logs = logs.extend(log_file.read().strip().split("\n"))[int(log_num):]
        except FileNotFoundError:
            open(path, "w").close()
            logs = []
        self.write({"logs":logs})
        self.finish()


class ClearUserLogsAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for clearing the user logs
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Clear contents of the user log file.

        Attributes
        ----------
        '''
        open(os.path.join(os.path.expanduser("~"), ".user-logs.txt"), "w").close()
        self.finish()
