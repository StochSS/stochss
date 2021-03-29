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
import json
import shutil
import datetime
import traceback

from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError, \
                            FileNotJSONFormatError

class StochSSBase():
    '''
    ################################################################################################
    StochSS base object
    ################################################################################################
    '''
    user_dir = os.path.expanduser("~") # returns the path to the users home directory

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


    def check_project_format(self):
        '''
        Determine if the format of the project is out of date

        Attributes
        ----------
        '''
        files = os.listdir(self.path)
        model_test = lambda file: file.endswith(".mdl") or file.endswith(".smdl")
        wkgp_test = lambda file: file.endswith(".wkgp")
        models = list(filter(model_test, files))
        wkgps = list(filter(wkgp_test, files))
        if len(models) > 0:
            return False
        if len(wkgps) == 1 and wkgps[0] == "WorkflowGroup1.wkgp":
            return False
        return True


    def get_new_path(self, dst_path):
        '''
        Gets the proper destination path for the file object to be moved

        Attributes
        ----------
        dst_path : string
            New path for the file object from the users home directory
        '''
        new_path = os.path.join(self.user_dir, dst_path)
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
        path = '/stochss/stochss_templates/nonSpatialModelTemplate.json'
        self.log("debug", f"Using model template at: {path}")
        try:
            with open(path, 'r') as template:
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
            with open(path, 'r') as template:
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
        exists = name in os.listdir(dirname)

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
            exists = proposed_name in os.listdir(dirname)
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
            if cp_file not in os.listdir(dirname if dirname else self.user_dir):
                return os.path.join(dirname, cp_file)

        i = 2
        cp_file = ''.join([name, f"-copy({i})", ext])
        # Check if a copy exists with '-copy(2)' in the name
        # If copy_file is still not unique iterate i until a unique name is found
        while cp_file in os.listdir(dirname if dirname else self.user_dir):
            i += 1
            cp_file = ''.join([name, f"-copy({i})", ext])

        return os.path.join(dirname, cp_file)


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
            message = f"You don not have permission to rename this file or directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err
