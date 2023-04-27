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
import traceback

from stochss.utilities.file_object import FileObject
from stochss.utilities.server_errors import FileNotFoundAPIError, PermissionsAPIError

class File(FileObject):
    r'''
    File object used for interacting with files on the file system.

    :param path: Path to the file.
    :type path: str

    :param new: Indicates whether the file is new.
    :type new: bool

    :param make_unique: Indicates that the file name should change if the name is not available.
    :type make_unique: bool

    :param body: Contents of the new file. Optional, ignored if new is not set.
    :type body: str | dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    def __init__(self, path, new=False, make_unique=False, body=None, **kwargs):
        super().__init__(path, make_unique=new and make_unique, **kwargs)

        if new:
            file_fd = open(self.path, "w", encoding="utf-8") # pylint: disable=consider-using-with
            if body is not None:
                file_fd.write(body)
            file_fd.close()

    def move(self, location):
        '''
        Move a file to another laction on the file system.

        :param location: New location for the file.
        :type location: str
        '''
        self.system.log.debug("Path to the file: %s", self.path)
        self.system.log.debug("Path to the destination: %s", location)
        try:
            os.rename(self.path, location)
        except FileNotFoundError as err:
            msg = f"Could not find the file: {str(err)}"
            raise FileNotFoundAPIError(msg, traceback.format_exc()) from err
        except PermissionError as err:
            msg = f"You do not have permission to move this file: {str(err)}"
            raise PermissionsAPIError(msg, traceback.format_exc()) from err
