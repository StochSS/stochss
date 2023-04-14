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
import shutil

class UserSystem:
    ''' Manager the users system state. '''
    HOME_DIRECTORY = os.path.expanduser("~")
    AWS_DIRECTORY = os.path.join(HOME_DIRECTORY, ".system/aws")
    LOG_FILE = os.path.join(HOME_DIRECTORY, ".system/logs.txt")
    SETTINGS_FILE = os.path.join(HOME_DIRECTORY, ".system/settings.json")

    def __init__(self):
        self.__update_to_current()

    def __load_settings(self):
        with open(self.SETTINGS_FILE, "r", encoding="utf-8") as settings_fd:
            settings = json.load(settings_fd)

        settings['awsHeadNodeStatus'] = "not launched"
        awsenv_path = os.path.join(self.AWS_DIRECTORY, "awsec2.env")
        if os.path.exists(awsenv_path):
            settings['awsSecretKey'] = "*" * 20
            instance = settings['headNode'].replace(".", "-")
            awsstatus_path = os.path.join(self.AWS_DIRECTORY, f"{instance}-status.txt")
            if os.path.exists(awsstatus_path):
                with open(awsstatus_path, "r", encoding="utf-8") as awsstatus_fd:
                    settings['awsHeadNodeStatus'] = awsstatus_fd.read().strip()
        else:
            settings['awsSecretKey'] = None
        return settings

    def __load_supported_aws_instances(self): # pylint: disable=no-self-use
        path = "/stochss/stochss/utilities/aws_instances.txt"
        with open(path, "r", encoding="utf-8") as aws_instances_fd:
            aws_instances = aws_instances_fd.read().strip().split("|")

        instances = {}
        for aws_instance in aws_instances:
            (instance_type, size) = aws_instance.split(".")
            if instance_type in instances:
                instances[instance_type].append(size)
            else:
                instances[instance_type] = [size]
        return instances

    def __load_system_logs(self):
        log_backups = [f"{self.LOG_FILE}.bak{i}" for i in range(5)]
        log_backups.reverse()
        logs = []
        for log_backup in log_backups:
            if os.path.exists(log_backup):
                with open(log_backup, "r", encoding="utf-8") as log_backup_fd:
                    logs.extend(log_backup_fd.read().strip().split("\n"))
        with open(self.LOG_FILE, "r", encoding="utf-8") as log_file_fd:
            logs.extend(log_file_fd.read().strip().split("\n"))
        return logs


    def __update_to_current(self):
        # Ensure that the aws directory always exists in the new location.
        if not os.path.exists(self.AWS_DIRECTORY):
            os.makedirs(self.AWS_DIRECTORY)
            src_path = os.path.join(self.HOME_DIRECTORY, ".aws")
            if os.path.exists(src_path):
                _ = shutil.move(src_path, self.AWS_DIRECTORY)
        # Ensure that the system settings file always exists in the new location.
        if not os.path.exists(self.SETTINGS_FILE):
            src_path = os.path.join(self.HOME_DIRECTORY, ".user-settings.json")
            if not os.path.exists(src_path):
                src_path = "/stochss/stochss/templates/system-settings.json"
            os.rename(src_path, self.SETTINGS_FILE)
        # Ensure that the logs file always exists in the new location.
        if not os.path.exists(self.LOG_FILE):
            src_path = os.path.join(self.HOME_DIRECTORY, ".user-logs.txt")
            if os.path.exists(src_path):
                os.rename(src_path, self.LOG_FILE)
                if os.path.exists(f"{src_path}.bak"):
                    os.rename(f"{src_path}.bak", f"{self.LOG_FILE}.bak0")
            else:
                open(self.LOG_FILE, "w", encoding="utf-8").close() # pylint: disable=consider-using-with

    @classmethod
    def page_load(cls, load_for="settings"):
        '''
        Load the contents of the desired page.

        :param load_for: Indicates which page we are loading for. Options 'settings' or 'menu'.
        :type load_for: str

        :returns: The required contents of the page.
        :rtype: dict
        '''
        self = cls()
        settings = self.__load_settings()
        instances = self.__load_supported_aws_instances()
        response = {'settings': settings, 'instances': instances}
        if load_for == "menu":
            logs = self.__load_system_logs()
            response['logs'] = logs
        return response
