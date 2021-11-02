'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
import zipfile
import traceback

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, StochSSPermissionsError, \
                            StochSSFileExistsError, StochSSUnzipError

class StochSSFile(StochSSBase):
    '''
    ################################################################################################
    StochSS file object
    ################################################################################################
    '''
    def __init__(self, path, new=False, body=""):
        '''
        Intitialize a file object

        Attributes
        ----------
        path : str
            Path to the folder
        '''
        super().__init__(path=path)
        if new:
            self.make_parent_dirs()
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            open_op = 'wb' if isinstance(body, bytes) else 'w'
            with open(new_path, open_op) as file:
                file.write(body)


    def delete(self):
        '''
        Delete the file from the file system

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        try:
            if ".presentations" in path:
                self.delete_presentation_name(self.get_file())
            os.remove(path)
            return "The file {0} was successfully deleted.".format(self.get_file())
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to delete this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def duplicate(self):
        '''
        Creates a copy of the target file in the same directory

        Attributes
        ----------
        '''
        src_path = self.get_path(full=True)
        self.log("debug", f"Full path to the file: {src_path}")
        if ".proj" in src_path and ".wkgp" in src_path and not src_path.endswith(".ipynb"):
            wkgp = self.get_unique_copy_path(path=self.get_dir_name())
            os.mkdir(wkgp)
            dst_path = os.path.join(wkgp, f"{self.get_name(path=wkgp)}.{src_path.split('.').pop()}")
        else:
            dst_path = self.get_unique_copy_path()
        self.log("debug", f"Full destination path: {dst_path}")
        try:
            shutil.copyfile(src_path, dst_path)
            cp_name = self.get_file(path=dst_path)
            message = f"The file {self.get_file()} has been successfully copied as {cp_name}"
            return {"Message":message, "File":cp_name}
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to copy this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


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
            raise StochSSFileNotFoundError(message, traceback.format_exc) from err
        except PermissionError as err:
            message = f"You do not have permission to move this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def read(self):
        '''
        Read the file and return the contents

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        self.log("debug", f"Path to the model on disk: {path}")
        try:
            with open(path, 'r') as file:
                resp = file.read()
            return resp
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def unzip(self, from_upload=True):
        '''
        Extract the contents of a zip archive

        Attributes
        ----------
        '''
        if not self.path.endswith(".zip"):
            return []
        try:
            path = self.get_path(full=True)
            dirname = self.get_dir_name(full=True)
            with zipfile.ZipFile(path, "r") as zip_file:
                members = zip_file.namelist()
                files = list(map(lambda file: os.path.exists(os.path.join(dirname, file)), members))
                if True in files:
                    self.delete()
                    file = self.get_file()
                    message = f"Unable to upload {file} "
                    message += f"as the parent directory in {file} already exists."
                    raise StochSSFileExistsError(message, traceback.format_exc())
                zip_file.extractall(dirname)
            if "__MACOSX" in os.listdir(dirname):
                shutil.rmtree(os.path.join(dirname, "__MACOSX"))
            if from_upload:
                return []
            message = "Successfully extracted the contents of"
            return {"message": f"{message} {self.get_file()} to {self.get_dir_name()}"}
        except zipfile.BadZipFile as err:
            message = f"{str(err)} so it could not be unzipped."
            if not from_upload:
                raise StochSSUnzipError(message, traceback.format_exc()) from err
            return [message]
