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
import shutil
import traceback

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError

class StochSSFile(StochSSBase):
    '''
    ################################################################################################
    StochSS file object
    ################################################################################################
    '''
    def __init__(self, path):
        '''
        Intitialize a file object

        Attributes
        ----------
        path : str
            Path to the folder
        '''
        super().__init__(path=path)


    def delete(self):
        '''
        Delete the file from the file system

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        try:
            os.remove(path)
            return "The file {0} was successfully deleted.".format(self.get_file())
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except PermissionError as err:
            message = f"You do not have permission to delete this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc())


    def duplicate(self):
        '''
        Creates a copy of the target file in the same directory

        Attributes
        ----------
        '''
        src_path = self.get_path(full=True)
        dst_path = self.get_unique_copy_path()
        try:
            shutil.copyfile(src_path, dst_path)
            cp_name = self.get_file(path=dst_path)
            message = f"The file {self.get_file()} has been successfully copied as {cp_name}"
            return {"Message":message, "File":cp_name}
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except PermissionError as err:
            message = f"You do not have permission to copy this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc())


    def move(self, location):
        '''
        Moves a file to a new location.

        Attributes
        ----------
        location : str
            Path to the new location of the file
        '''
        src_path = self.get_path(full=True)
        self.log("debug", f"Full path to the file: {src_path}")
        dst_path = self.get_new_path(location)
        self.log("debug", f"Full destination path: {dst_path}")
        try:
            os.rename(src_path, dst_path)
            self.path = dst_path.replace(self.user_dir + "/", "")
            return f"Success! {self.get_file()} was moved to {self.get_dir_name()}."
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message)
        except PermissionError as err:
            message = f"You do not have permission to move this file: {str(err)}"
