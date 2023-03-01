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
import shutil
import datetime
import traceback
import subprocess

import dotenv
import requests

from stochss_compute.cloud import EC2Cluster, EC2LocalConfig
from stochss_compute.cloud.exceptions import EC2Exception

from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError, \
                            FileNotJSONFormatError

class StochSSBase():
    '''
    ################################################################################################
    StochSS base object
    ################################################################################################
    '''
    user_dir = os.path.expanduser("~") # returns the path to the users home directory
    TEMPLATE_VERSION = 1
    SETTINGS_TEMPLATE_VERSION = 1
    DOMAIN_TEMPLATE_VERSION = 2

    def __init__(self, path):
        '''
        Intitialize a file object

        Attributes
        ----------
        path : str
            Path to the folder
        '''
        self.path = path
        self.logs = []

    @classmethod
    def __build_example_html(cls, exm_data, home):
        row = "<div class='row'>__CONTENTS__</div>"
        entry = "__ALERT__' href='__OPEN_LINK__' role='button' style='width: 100%'>__NAME__</a>"
        entry_a = f"<a class='btn box-shadow btn-outline-{entry}"

        # Well Mixed Examples
        wm_list = []
        for entry in exm_data['Well-Mixed']:
            exm_a = entry_a.replace("__ALERT__", entry['alert'])
            exm_a = exm_a.replace("__OPEN_LINK__", f"{home}?open={entry['open_link']}")
            exm_a = exm_a.replace("__NAME__", entry['name'])
            wm_list.append(f"<div class='col-md-4 col-lg-3 my-2'>{exm_a}</div>")
        well_mixed = row.replace("__CONTENTS__", ''.join(wm_list))

        # Spatial Examples
        s_list = []
        for entry in exm_data['Spatial']:
            exm_a = entry_a.replace("__ALERT__", entry['alert'])
            exm_a = exm_a.replace("__OPEN_LINK__", f"{home}?open={entry['open_link']}")
            exm_a = exm_a.replace("__NAME__", entry['name'])
            s_list.append(f"<div class='col-md-4 col-lg-3 my-2'>{exm_a}</div>")
        spatial = row.replace("__CONTENTS__", ''.join(s_list))

        return {"wellMixed": well_mixed, "spatial": spatial}

    @classmethod
    def __get_entry(cls, entries, name):
        for entry in entries:
            if entry['name'] == name:
                return entry
        return None

    @classmethod
    def __get_from_remote(cls):
        p_path = "/stochss/.proxies.txt"
        rel_path = "https://raw.githubusercontent.com/StochSS/StochSS_Example_Library/main/example_data.json"
        if os.path.exists(p_path):
            with open(p_path, "r", encoding="utf-8") as proxy_file:
                proxy_ip = proxy_file.read().strip()
                proxies = {
                    "https": f"https://{proxy_ip}",
                    "http": f"http://{proxy_ip}"
                }
        else:
            proxies = None

        response = requests.get(rel_path, allow_redirects=True, proxies=proxies)
        exm_data = json.loads(response.content.decode())
        exm_data['Download-Time'] = time.time()
        return exm_data

    def __update_exm_data(self, exm_data, old_exm_data=None):
        for entry in exm_data['Well-Mixed']:
            entry['alert'] = "success"
            if old_exm_data is not None:
                old_entry = self.__get_entry(old_exm_data['Well-Mixed'], entry['name'])
                entry['mod_time'] = old_entry['mod_time']
                entry['umd5_sum'] = old_entry['umd5_sum']
        for entry in exm_data['Spatial']:
            entry['alert'] = "success"
            if old_exm_data is not None:
                old_entry = self.__get_entry(old_exm_data['Spatial'], entry['name'])
                entry['mod_time'] = old_entry['mod_time']
                entry['umd5_sum'] = old_entry['umd5_sum']

    def __update_umd5_sums(self, exm_data, files=None):
        e_path = "Examples"
        if files is None:
            if not os.path.exists(e_path):
                return

            projs = []
            non_projs = []
            for file in os.listdir(e_path):
                if file.endswith("proj"):
                    projs.append(file)
                else:
                    non_projs.append(file)
            self.__update_umd5_sums(exm_data, files=non_projs)
            self.__update_umd5_sums(exm_data, files=projs)
        else:
            for example in files:
                if example in exm_data['Names']:
                    entry = self.__get_entry(
                        exm_data['Well-Mixed'], exm_data['Name-Mappings'][example]
                    )
                    if entry is None:
                        entry = self.__get_entry(
                            exm_data['Spatial'], exm_data['Name-Mappings'][example]
                        )
                    entry['alert'] = "primary"

    def add_presentation_name(self, file, name):
        '''
        Add a new presentation to the presentation names file.

        Attributes
        ----------
        file : str
            Name of the presentation file
        name : str
            Name of the presentation
        '''
        path = os.path.join(self.user_dir, ".presentations", ".presentation_names.json")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as names_file:
                names = json.load(names_file)
        else:
            names = {}
        names[file] = name
        with open(path, "w", encoding="utf-8") as names_file:
            json.dump(names, names_file)


    @classmethod
    def check_project_format(cls, path):
        '''
        Determine if the format of the project is out of date

        Attributes
        ----------
        '''
        files = os.listdir(path)
        model_test = lambda file: file.endswith(".mdl") or file.endswith(".smdl")
        wkgp_test = lambda file: file.endswith(".wkgp")
        models = list(filter(model_test, files))
        wkgps = list(filter(wkgp_test, files))
        if len(models) > 0:
            return False
        if len(wkgps) == 1 and wkgps[0] == "WorkflowGroup1.wkgp":
            return False
        return True


    @classmethod
    def check_workflow_format(cls, path):
        '''
        Determine if the format of the workflow is out of date

        Attributes
        ----------
        path : str
            Path to the workflow.
        '''
        path = os.path.join(cls.user_dir, path)
        files = os.listdir(path)
        old_files = ["info.json", "logs.txt", "results", "RUNNING", "ERROR", "COMPLETE"]
        for file in old_files:
            if file in files:
                return False
        if len(list(filter(lambda file: file.endswith(".mdl"), files))) > 0:
            return False
        return True


    def delete_presentation_name(self, file):
        '''
        Remove a presentation name from the presentation names file.

        Attributes
        ----------
        file : str
            Name of the presentation file to remove
        '''
        path = os.path.join(self.user_dir, ".presentations", ".presentation_names.json")
        with open(path, "r", encoding="utf-8") as names_file:
            names = json.load(names_file)
        del names[file]
        with open(path, "w", encoding="utf-8") as names_file:
            json.dump(names, names_file)


    def get_aws_cluster(self, instance=None):
        '''
        Get the AWS cluster.

        Attributes
        ----------
        instance : str
            AWS EC2 instance.
        '''
        key_dir = os.path.join(self.user_dir, ".aws")
        if instance is None:
            path = os.path.join(self.user_dir, ".user-settings.json")
            settings = self.load_user_settings(path=path)
            instance = settings['headNode']
        s_path = os.path.join(key_dir, f"{instance.replace('.', '-')}-status.txt")
        # Setup the AWS environment
        env_path = os.path.join(key_dir, "awsec2.env")
        dotenv.load_dotenv(dotenv_path=env_path)
        # Configure the AWS cluster
        local_config = EC2LocalConfig(key_dir=key_dir, status_file=s_path)
        cluster = EC2Cluster(local_config=local_config)
        return cluster

    @classmethod
    def get_new_path(cls, dst_path):
        '''
        Gets the proper destination path for the file object to be moved

        Attributes
        ----------
        dst_path : string
            New path for the file object from the users home directory
        '''
        new_path = os.path.join(cls.user_dir, dst_path)
        if dst_path.startswith("trash/") and not "trash" in os.listdir(cls.user_dir):
            os.mkdir(os.path.join(cls.user_dir, "trash"))
        if new_path.split().pop().replace('.', '', 5).isdigit():
            return new_path.replace(new_path.split().pop(), "").strip()
        if "trash/" in new_path and os.path.exists(new_path):
            stamp = datetime.datetime.now().strftime(" %y.%m.%d.%H.%M.%S")
            return new_path + stamp
        return new_path


    def get_file(self, path=None):
        '''
        Get the file from the path

        Attributes
        ----------
        path : str
            Path to a file object
        '''
        file = self.path if path is None else path
        return file.split('/').pop()


    def get_model_template(self, as_string=False):
        '''
        Get the stochss model template

        Attributes
        ----------
        as_string : bool
            Indicates whether or not to return the template in string format
        '''
        path = '/stochss/stochss_templates/modelTemplate.json'
        self.log("debug", f"Using model template at: {path}")
        try:
            with open(path, 'r', encoding="utf-8") as template:
                if as_string:
                    return template.read()
                return json.load(template)
        except FileNotFoundError as err:
            message = f"Could not find the model template file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"Model template data is not JSON decodeable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    def get_settings_template(self, as_string=False):
        '''
        Get the StochSS workflow settings template

        Attributes
        ----------
        as_string : bool
            Indicates whether or not to return the template in string format
        '''
        path = '/stochss/stochss_templates/workflowSettingsTemplate.json'
        self.log("debug", f"Using settings template at: {path}")
        try:
            with open(path, 'r', encoding="utf-8") as template:
                if as_string:
                    return template.read()
                return json.load(template)
        except FileNotFoundError as err:
            message = f"Could not find the settings template file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"Settings template data is not JSON decodeable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    def get_name(self, path=None):
        '''
        Get the name from the file object's path or provided path

        Attributes
        ----------
        path : str
            Path to a file object
        '''
        name = self.path if path is None else path
        if name.endswith("/"):
            name = name[:-1]
        name = name.split('/').pop()
        if "." not in name:
            return name
        return '.'.join(name.split('.')[:-1])


    def get_path(self, full=False):
        '''
        Get the path to the file object

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        if full:
            return os.path.join(self.user_dir, self.path)
        return self.path


    def get_dir_name(self, full=False):
        '''
        Get the path to the parent directory of the file object

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        if full:
            dirname = os.path.dirname(self.path)
            if not dirname:
                return self.user_dir
            return os.path.join(self.user_dir, dirname)
        return os.path.dirname(self.path)


    def get_status(self, path=None):
        '''
        Get the current status of the workflow

        Attributes
        ----------
        '''
        try:
            if path is None:
                path = os.path.join(self.user_dir, self.path)
            files = os.listdir(path=path)
            if "COMPLETE" in files:
                return "complete"
            if "ERROR" in files:
                return "error"
            if "RUNNING" in files:
                return "running"
            return "ready"
        except FileNotFoundError as err:
            message = f"Could not find the workflow: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def get_unique_path(self, name, dirname=None):
        '''
        Get a unique path for the file object with the target name

        Attributes
        ----------
        name : str
            New name for the target file
        '''
        if dirname is None:
            dirname = self.get_dir_name(full=True)
        exists = name in os.listdir(dirname if dirname else self.user_dir)

        i = 1
        if exists:
            ext = '.' + name.split('.').pop() if '.' in name else ""
            name = self.get_name(path=name)
            if '(' in name and ')' in name:
                _i = name.split('(').pop().split(')')[0]
                if _i.isdigit():
                    name = name.replace(f"({_i})", "")
                    if int(_i) == 1:
                        i = 2
        while exists:
            proposed_name = ''.join([name, f"({i})", ext])
            exists = proposed_name in os.listdir(dirname if dirname else self.user_dir)
            i += 1

        changed = i > 1
        if changed:
            name = proposed_name
        return os.path.join(dirname, name), changed


    def get_unique_copy_path(self, path=None):
        '''
        Gets a unique name for the file object being copied.
        Accounts for files that are already copies.

        Attributes
        ----------
        path : str
            Path to the file object
        '''
        file = self.get_file(path=path)
        dirname = self.get_dir_name() if path is None else os.path.dirname(path)
        ext = '.' + file.split('.').pop() if '.' in file else ''
        name = file.split('-copy')[0] if '-copy' in file else self.get_name(path=path)

        # Check if the file object is an original or at least the second copy
        if not '-copy' in file or '-copy(' in file:
            cp_file = ''.join([name, '-copy', ext])
            if cp_file not in os.listdir(os.path.join(self.user_dir, dirname) \
                                                    if dirname else self.user_dir):
                return os.path.join(dirname, cp_file)

        i = 2
        cp_file = ''.join([name, f"-copy({i})", ext])
        # Check if a copy exists with '-copy(2)' in the name
        # If copy_file is still not unique iterate i until a unique name is found
        while cp_file in os.listdir(os.path.join(self.user_dir, dirname) \
                                                if dirname else self.user_dir):
            i += 1
            cp_file = ''.join([name, f"-copy({i})", ext])

        return os.path.join(dirname, cp_file)

    def launch_aws_cluster(self):
        '''
        Launch an AWS instance.
        '''
        settings = self.load_user_settings(path='.user-settings.json')
        instance = settings['headNode']

        try:
            cluster = self.get_aws_cluster(instance=instance)
            cluster.launch_single_node_instance(instance)
        except EC2Exception:
            pass
        except Exception:
            cluster.clean_up()

    def load_example_library(self, home):
        '''
        Load the example library dropdown list.
        '''
        if os.path.exists(self.path):
            with open(self.path, "r", encoding="utf-8") as exm_lib:
                old_exm_data = json.load(exm_lib)
            # Update example library if the last update was more than 24 hours old
            if old_exm_data['Download-Time'] < (time.time() - (60 * 60 * 24)):
                exm_data = self.__get_from_remote()
                self.__update_exm_data(exm_data, old_exm_data=old_exm_data)
            else:
                exm_data = old_exm_data
                self.__update_exm_data(exm_data)
        else:
            exm_data = self.__get_from_remote()

        self.__update_umd5_sums(exm_data)
        with open(self.path, "w", encoding="utf-8") as data_file:
            json.dump(exm_data, data_file, sort_keys=True, indent=4)

        return self.__build_example_html(exm_data, home)

    def load_user_settings(self, path=None):
        '''
        Load the user settings from file.

        Attributes
        ----------
        path : str
            Absolute path to the user settings file.
        '''
        if path is None and os.path.exists(self.path):
            path = self.path
        elif path is None or not os.path.exists(path):
            path = "/stochss/stochss_templates/userSettingTemplate.json"
        with open(path, "r", encoding="utf-8") as usrs_fd:
            settings = json.load(usrs_fd)
        settings['awsHeadNodeStatus'] = "not launched"
        if os.path.exists(os.path.join(self.user_dir, ".aws/awsec2.env")):
            settings['awsSecretKey'] = "*"*20
            i_id = settings['headNode'].replace('.', '-')
            s_path = os.path.join(self.user_dir, f".aws/{i_id}-status.txt")
            if os.path.exists(s_path):
                with open(s_path, 'r', encoding="utf-8") as aws_s_fd:
                    settings['awsHeadNodeStatus'] = aws_s_fd.read().strip()
        else:
            settings['awsSecretKey'] = None
        return settings

    def log(self, level, message):
        '''
        Add a log to the objects internal logs

        Attribute
        ---------
        level : str
            Level of the log
        message : string
            Message to be logged
        '''
        self.logs.append({"level":level, "message":message})


    def make_parent_dirs(self):
        '''
        Make the parent directories for new file objects if they don't exist

        Attributes
        ----------
        '''
        dirname = self.get_dir_name(full=True)
        self.log("debug", f"Path of parent directories: {dirname}")
        if not os.path.exists(dirname):
            os.makedirs(dirname)


    def print_logs(self, log):
        '''
        Display all internal logs to the console

        Attributes
        ----------
        log : obj
            Logging object
        '''
        displays = {"debug":log.debug, "info":log.info, "warning":log.warning,
                    "error":log.error, "critical":log.critical}
        for entry in self.logs:
            log_display = displays[entry["level"]]
            log_display(entry["message"])


    def rename(self, name):
        '''
        Rename the target file object with a unique name

        Attributes
        ----------
        name : str
            New name for the file object
        '''
        path = self.get_path(full=True)
        file = self.get_file()
        new_path, changed = self.get_unique_path(name)
        try:
            shutil.move(path, new_path)
            self.path = new_path.replace(self.user_dir + '/', '')
            new_file = self.get_file()
            if changed:
                message = f"A file already exists with that name, {file} was renamed to "
                message += f"{new_file} in order to prevent a file from being overwritten."
            else:
                message = f"Success! {file} was renamed to {new_file}"
            return {"message":message, "_path":self.path, "changed":changed}
        except FileNotFoundError as err:
            message = f"Could not find the file or directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to rename this file or directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err

    def terminate_aws_cluster(self):
        '''
        Terminate an AWS instance.
        '''
        cluster = self.get_aws_cluster()
        cluster.clean_up()

    def update_aws_status(self, instance):
        '''
        Updated the status of the aws instance.

        Attributes
        ----------
        instance : str
            The AWS instance.
        '''
        s_path = os.path.join(self.user_dir, f".aws/{instance.replace('.', '-')}-status.txt")
        if not os.path.exists(s_path):
            return

        script = "/stochss/stochss/handlers/util/scripts/aws_compute.py"
        exec_cmd = [f"{script}", "-sv"]
        print("Updating the status of AWS")
        process = subprocess.Popen(exec_cmd)
