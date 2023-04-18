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
import logging

from tornado.log import LogFormatter

class UserSystem:
    '''
    Manager the users system state.

    :param logger_kw: Keyword arguments used to initialize the logs file handler.
    :type logger_kw: dict

    :param init_logs: Whether or not to initialize the logs with the object.
    :type init_logs: bool
    '''
    HOME_DIRECTORY = os.path.expanduser("~")
    AWS_DIRECTORY = os.path.join(HOME_DIRECTORY, ".stochss-system/aws")
    LOG_FILE = os.path.join(HOME_DIRECTORY, ".stochss-system/logs.txt")
    SETTINGS_FILE = os.path.join(HOME_DIRECTORY, ".stochss-system/settings.json")

    def __init__(self, logger_kw=None, init_logs=True):
        if logger_kw is None:
            logger_kw = {}

        if not os.path.exists(self.AWS_DIRECTORY):
            self.__update_to_current()
        if init_logs:
            self.log = self.initialize_logger(**logger_kw)
            self.status_log = logging.getLogger("JobStatus")

    def __get_file_handler(self, file_path=None, log_level="info"):
        if file_path is None:
            file_path = self.LOG_FILE

        handler = logging.handlers.RotatingFileHandler(file_path, maxBytes=200000, backupCount=5)
        handler.namer = lambda name: name.replace(".txt", ".txt.bak")
        handler.setFormatter(LogFormatter(fmt="%(asctime)s$ %(message)s", datefmt="%b %d, %Y  %I:%M %p UTC"))
        handler.setLevel(getattr(logging, log_level.upper(), None))
        return handler

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
                for file in os.listdir(src_path):
                    os.rename(os.path.join(src_path, file), os.path.join(self.AWS_DIRECTORY, file))
                shutil.rmtree(src_path)
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

    def initialize_logger(self, use_for="system", log_path=None):
        '''
        Initialize the StochSS logger.

        :param use_for: Indicates what the logger will be used for.
                        Options: 'system', 'well-mixed job', or 'spatial-job'.
        :type use_for: str

        :param log_path: Path to the log file. Defaults to the user log file.
        :type log_path: str

        :returns: The root logger.
        :rtype: logging.Logger
        '''
        log = logging.getLogger()
        log.setLevel(logging.INFO)

        stochss_log = log.getChild("StochSS")
        stochss_sh = logging.StreamHandler()
        stochss_sh.setFormatter(LogFormatter(
            fmt="%(color)s[%(levelname)1.1s %(asctime)s StochSS %(filenam)s:%(lineno)d]%(end_color)s %(message)s",
            datefmt="%H:%M:%S", color=True
        ))
        stochss_sh.setLevel(logging.WARNING)
        stochss_log.addHandler(stochss_sh)

        gpy_log = log.getChild("GillesPy2")
        gpy_log.propagate = True
        spy_log = log.getChild("SpatialPy")
        spy_log.propagate = True

        system_fh = self.__get_file_handler()
        if use_for == "system":
            log.addHandler(system_fh)
        else:
            job_status_log = log.getChild("JobStatus")
            job_status_log.addHandler(system_fh)
            job_status_log.setLevel(logging.INFO)
            job_status_log.propagate = False

            job_fh = self.__get_file_handler(file_path=log_path, log_level="warning")
            log.addHandler(job_fh)
        return log

    @classmethod
    def page_load(cls, load_for="settings"):
        '''
        Load the contents of the desired page.

        :param load_for: Indicates which page we are loading for. Options: 'settings' or 'menu'.
        :type load_for: str

        :returns: The required contents of the page.
        :rtype: dict
        '''
        self = cls(init_logs=False)
        settings = self.__load_settings()
        response = {'settings': settings}
        if load_for == "menu":
            logs = self.__load_system_logs()
            response['logs'] = logs
        else:
            instances = self.__load_supported_aws_instances()
            response['instances'] = instances
        return response
