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
import datetime


class StochSSBase():
    '''
    ################################################################################################
    StochSS base object
    ################################################################################################
    '''
    user_dir = "/home/jovyan"

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
            return os.path.join(self.user_dir, os.path.dirname(self.path))
        return os.path.dirname(self.path)


    def get_unique_copy_path(self):
        '''
        Gets a unique name for the file object being copied.
        Accounts for files that are already copies.

        Attributes
        ----------
        '''
        file = self.get_file()
        dirname = self.get_dir_name()
        ext = '.' + file.split('.').pop() if '.' in file else ''
        name = file.split('-copy')[0] if '-copy' in file else self.get_name()

        # Check if the file object is an original or at least the second copy
        if not '-copy' in file or '-copy(' in file:
            cp_file = ''.join([name, '-copy', ext])
            if cp_file not in os.listdir(dirname):
                return os.path.join(dirname, cp_file)

        i = 2
        cp_file = ''.join([name, f"-copy({i})", ext])
        # Check if a copy exists with '-copy(2)' in the name
        # If copy_file is still not unique iterate i until a unique name is found
        while cp_file in os.listdir(dirname):
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
