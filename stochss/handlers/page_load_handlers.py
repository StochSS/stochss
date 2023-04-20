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
import traceback
from tornado import web
from notebook.base.handlers import APIHandler

from stochss.utilities.user_system import UserSystem
from stochss.utilities.server_errors import APIError, report_error

# pylint: disable=abstract-method
class PageLoadHandler(APIHandler):
    ''' Handler for loading the initial content of StochSS Live! pages '''
    PAGE_MAP = {
        # 'browser': 'stochss-file-browser.html',
        # 'domain-editor': 'stochss-domain-editor.html',
        'example-library': UserSystem.load_examples,
        'logs': UserSystem.load_logs,
        # 'loading-page': 'stochss-loading-page.html',
        # 'model-editor': 'stochss-model-editor.html',
        # 'multiple-plots': 'multiple-plots-page.html',
        # 'project-manager': 'stochss-project-manager.html',
        'settings': UserSystem.page_load,
        # 'workflow-manager': 'stochss-workflow-manager.html',
        # 'workflow-selection': 'stochss-workflow-selection.html'
    }

    def __process_query_args(self, include_url_base_path=False):
        print(self.request.query_arguments)
        process_func = {
            'str': lambda value: value[0].decode(),
            'int': lambda value: int(value[0].decode())
        }
        arg_types = { 'load_for': 'str', 'index': 'int'}
        kwargs = {key: process_func[arg_types[key]](value) for key, value in self.request.query_arguments.items()}
        if include_url_base_path:
            url_base = str(self.request.path).replace("/load/example-library", "")
            if not url_base.startswith("/user"):
                url_base = url_base[1:]
            kwargs['url_base'] = url_base
        print(kwargs)
        return kwargs

    @web.authenticated
    async def get(self, page_key):
        '''
        Render a select html page.

        :param page_key: Key indicating the desired page to load.
        :type page_key: str
        '''
        try:
            self.set_header("Content-Type", "application/json")
            kwargs = self.__process_query_args()
            if page_key == 'example-library':
                kwargs['url_base'] = self.request.path
            if page_key in ('logs', 'settings', 'example-library'):
                response = self.PAGE_MAP[page_key](**kwargs)
            self.write(response)
        except Exception as err: # pylint: disable=broad-except
            system = UserSystem()
            error = APIError(
                404, "Page Contents Failed to Load", str(err), traceback.format_exc()
            )
            report_error(self, system.log, error)
        self.finish()
