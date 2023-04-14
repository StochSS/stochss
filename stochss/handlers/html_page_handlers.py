'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
from tornado import web
from notebook.base.handlers import IPythonHandler

# pylint: disable=abstract-method
class BaseHTMLPageHandler(IPythonHandler):
    ''' Base handler for rendering the StochSS Live! pages. '''
    def get_template_path(self):
        '''
        Retrieve the location of StochSS pages output by webpack.
        The HTML pages are located in the same directory as the static assets (./../dist).

        :returns: The location of webpack page artifacts.
        :rtype: str
        '''
        return self.settings['config']['NotebookApp']['extra_static_paths'][0]

    @classmethod
    def get_server_path(cls):
        '''
        Retrieve the path to the server.

        :returns: The server path.
        :rtype: str
        '''
        try:
            server_path = os.environ['JUPYTERHUB_SERVICE_PREFIX']
        except KeyError:
            server_path = '/'

        return server_path

class HTMLPageHandler(BaseHTMLPageHandler):
    ''' Handler for rendering the StochSS Live! pages '''
    PAGE_MAP = {
        'browser': 'stochss-file-browser.html',
        'domain-editor': 'stochss-domain-editor.html',
        'example-library': 'stochss-example-library.html',
        'home': 'stochss-user-home.html',
        'loading-page': 'stochss-loading-page.html',
        'model-editor': 'stochss-model-editor.html',
        'multiple-plots': 'multiple-plots-page.html',
        'project-manager': 'stochss-project-manager.html',
        'quickstart': 'stochss-quickstart.html',
        'settings': 'stochss-user-settings.html',
        'workflow-manager': 'stochss-workflow-manager.html',
        'workflow-selection': 'stochss-workflow-selection.html'
    }

    @web.authenticated
    async def get(self, page_key):
        '''
        Render a select html page.

        :param page_key: Key indicating the desired html page.
        :type page_key: str
        '''
        html_file = self.PAGE_MAP[page_key]
        self.render(html_file, server_path=self.get_server_path())
