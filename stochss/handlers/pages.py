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
import json
import time
import logging
import subprocess
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSBase, report_error
from .util.stochss_errors import AWSConfigurationError

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
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
            if not os.path.exists(".aws"):
                os.mkdir(".aws")
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

class ConfirmAWSConfigHandler(APIHandler):
    '''
    ################################################################################################
    StochSS handler for comfirming AWS configuration
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Confirm that AWS is configured for running jobs..

        Attributes
        ----------
        '''
        file = StochSSBase(path='.user-settings.json')
        settings = file.load_user_settings()
        if settings['awsHeadNodeStatus'] != "running":
            file.update_aws_status(settings['headNode'])
            err = AWSConfigurationError("AWS is not properly configured for running jobs.")
            report_error(self, log, err)

        self.write({"configured": True})
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
        file = StochSSBase(path='.user-settings.json')

        script = "/stochss/stochss/handlers/util/scripts/aws_compute.py"
        exec_cmd = [f"{script}", "-lv"]
        with subprocess.Popen(exec_cmd):
            print("Launching AWS")

        time.sleep(1)
        settings = file.load_user_settings()

        self.write({"settings": settings})
        self.finish()

class AWSClusterStatusHandler(APIHandler):
    '''
    ################################################################################################
    StochSS handler for updating the AWS cluster status
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Update the AWS cluster status.

        Attributes
        ----------
        '''
        file = StochSSBase(path='.user-settings.json')

        settings = file.load_user_settings()

        file.update_aws_status(settings['headNode'])

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
        file = StochSSBase(path='.user-settings.json')

        script = "/stochss/stochss/handlers/util/scripts/aws_compute.py"
        exec_cmd = [f"{script}", "-tv"]
        with subprocess.Popen(exec_cmd):
            print("Terminating AWS")

        time.sleep(1)
        settings = file.load_user_settings()

        self.write({"settings": settings})
        self.finish()
