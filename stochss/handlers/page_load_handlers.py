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
from tornado import web
from notebook.base.handlers import APIHandler

from stochss.utilities.user_system import UserSystem

# pylint: disable=abstract-method
class PageLoadHandler(APIHandler):
    ''' Handler for loading the initial content of StochSS Live! pages '''
    PAGE_MAP = {
        # 'browser': 'stochss-file-browser.html',
        # 'domain-editor': 'stochss-domain-editor.html',
        # 'example-library': 'stochss-example-library.html',
        # 'home': 'stochss-user-home.html',
        # 'loading-page': 'stochss-loading-page.html',
        # 'model-editor': 'stochss-model-editor.html',
        # 'multiple-plots': 'multiple-plots-page.html',
        # 'project-manager': 'stochss-project-manager.html',
        # 'quickstart': 'stochss-quickstart.html',
        'settings': UserSystem,
        # 'workflow-manager': 'stochss-workflow-manager.html',
        # 'workflow-selection': 'stochss-workflow-selection.html'
    }

    @web.authenticated
    async def get(self, page_key):
        '''
        Render a select html page.

        :param page_key: Key indicating the desired page to load.
        :type page_key: str
        '''
        self.set_header("Content-Type", "application/json")
        kwargs = self.request.get_query_argument
        print(kwargs, type(kwargs))
        response = self.PAGE_MAP[page_key].page_load(**kwargs)
        self.write(response)
        self.finish()
