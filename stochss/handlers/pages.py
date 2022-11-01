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
import json
import time
import logging
import subprocess
from tornado import web
from notebook.base.handlers import IPythonHandler, APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSBase

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


class ExampleLibraryHandler(PageHandler):
    '''
    ################################################################################################
    StochSS Example Library Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS example library page.

        Attributes
        ----------
        '''
        self.render("stochss-example-library.html", server_path=self.get_server_path())


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


class UserSettingsHandler(PageHandler):
    '''
    ################################################################################################
    StochSS User Settings Page Handler
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Render the StochSS user settings page.

        Attributes
        ----------
        '''
        self.render("stochss-user-settings.html", server_path=self.get_server_path())


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
        path = os.path.join(os.path.expanduser("~"), ".user-logs.txt")
        try:
            if os.path.exists(f"{path}.bak"):
                with open(path, "r", encoding="utf-8") as log_file:
                    logs = log_file.read().strip().split("\n")
            else:
                logs = []
            with open(path, "r", encoding="utf-8") as log_file:
                logs.extend(log_file.read().strip().split("\n"))
                logs = logs[int(log_num):]
        except FileNotFoundError:
            open(path, "w", encoding="utf-8").close()
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
        path = os.path.join(os.path.expanduser("~"), ".user-logs.txt")
        if os.path.exists(f'{path}.bak'):
            os.remove(f'{path}.bak')
        open(path, "w", encoding="utf-8").close()
        self.finish()


class LoadUserSettings(APIHandler):
    '''
    ################################################################################################
    StochSS handler for loading user settings
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Load the existing user settings.

        Attributes
        ----------
        '''
        file = StochSSBase(path='.user-settings.json')
        settings = file.load_user_settings()

        i_path = "/stochss/stochss_templates/instance_types.txt"
        with open(i_path, "r", encoding="utf-8") as itype_fd:
            instance_types = itype_fd.read().strip().split('|')
        instances = {}
        for instance_type in instance_types:
            (i_type, size) = instance_type.split('.')
            if i_type in instances:
                instances[i_type].append(size)
            else:
                instances[i_type] = [size]

        self.write({"settings": settings, "instances": instances})
        self.finish()

    @web.authenticated
    async def post(self):
        '''
        Save the user settings.

        Attributes
        ----------
        '''
        data = json.loads(self.request.body.decode())
        log.debug(f"Settings data to be saved: {data}")

        def check_env_data(data):
            if data['settings']['awsRegion'] == "":
                return False
            if data['settings']['awsAccessKeyID'] == "":
                return False
            if data['secret_key'] is None:
                return False
            return True

        if check_env_data(data):
            with open(".aws/awsec2.env", "w", encoding="utf-8") as env_fd:
                contents = "\n".join([
                    f"AWS_DEFAULT_REGION={data['settings']['awsRegion']}",
                    f"AWS_ACCESS_KEY_ID={data['settings']['awsAccessKeyID']}",
                    f"AWS_SECRET_ACCESS_KEY={data['secret_key']}"
                ])
                env_fd.write(contents)

        with open(".user-settings.json", "w", encoding="utf-8") as usrs_fd:
            json.dump(data['settings'], usrs_fd, indent=4, sort_keys=True)
        self.finish()

class LaunchAWSClusterHandler(APIHandler):
    '''
    ################################################################################################
    StochSS handler for launching the AWS cluster
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Launch the AWS cluster.

        Attributes
        ----------
        '''
        script = "/stochss/stochss/handlers/util/scripts/aws_compute.py"
        exec_cmd = [f"{script}", "-lv"]
        _ = subprocess.Popen(exec_cmd)

        time.sleep(0.1)
        file = StochSSBase(path='.user-settings.json')
        settings = file.load_user_settings()

        self.write({"settings": settings})
        self.finish()

class TerminateAWSClusterHandler(APIHandler):
    '''
    ################################################################################################
    StochSS handler for terminating the AWS cluster
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Terminate the AWS cluster.

        Attributes
        ----------
        '''
        script = "/stochss/stochss/handlers/util/scripts/aws_compute.py"
        exec_cmd = [f"{script}", "-tv"]
        _ = subprocess.Popen(exec_cmd)

        time.sleep(0.1)
        file = StochSSBase(path='.user-settings.json')
        settings = file.load_user_settings()

        self.write({"settings": settings})
        self.finish()
