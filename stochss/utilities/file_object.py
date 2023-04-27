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
import shutil
import traceback

from stochss.utilities.user_system import UserSystem
from stochss.utilities.server_errors import FileNotFoundAPIError, PermissionsAPIError

class FileObject():
    r'''
    Base class for file objects.

    :param path: Path to the file object. Defaults to the users home directory.
    :type path: str

    :param make_unique: Indicates that the directory name should change if the name is not available.
                        Ignored if path is not set.
    :type make_unique: bool

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    HOME_DIRECTORY = os.path.expanduser("~")

    def __init__(self, path=None, make_unique=False, **kwargs):
        if path in ("", "/"):
            path = None
        if path is None:
            path = self.HOME_DIRECTORY
        else:
            path = os.path.join(self.HOME_DIRECTORY, path)
            if make_unique and os.path.exists(path):
                dirname = self.get_dirname(path=path)
                name = self.get_name(path=path, with_ext=True, unique_method="rename")
                path = os.path.join(dirname, name)
        self.path = path

        self.system = UserSystem(**kwargs)

    def get_dirname(self, path=None, parent=False, generations=1, sanitized=True):
        '''
        Get an ancestoral path of the file object from its path.

        :param path: Path to the file object. Defaults to the objects path attribute.
        :type path: str

        :param parent: Indicates whether the dirname should be higher than the parent.
        :type parent: bool

        :param generations: The number of additional generations to move up in the directory chain.
        :type generations: int

        :param sanitized: Indicates whether the home directory should be removed from the dirname.
        :type sanitized: bool

        :returns: The path to an ancestoral directory.
        :rtype: str
        '''
        if path is None:
            path = self.path
        dirname = os.path.dirname(path)
        index = 0
        while parent and index < generations:
            dirname = os.path.dirname(dirname)
            index += 1
        if sanitized:
            return self.get_sanitized_path(path=dirname)
        return dirname

    def get_extension(self, path=None):
        '''
        Get the extension of a file object from its path.

        :param path: Path to the file object. Defaults to the objects path attribute.
        :type path: str

        :returns: The extension of the file object if it has one else None
        :rtype: str | None
        '''
        if path is None:
            path = self.path
        if "." in path:
            return path.split(".").pop()
        return None

    def get_name(self, path=None, with_ext=False, unique_method=None, pymethod=False):
        '''
        Get a name from the path of a file object.

        :param path: Path to a file object. Defaults to the objects path attribute.
        :type path: str

        :param with_ext: Indicate whether to includes the extension in the name.
        :type with_ext: bool

        :param unique_method: Key indicating the method to use for unique naming.
                              Options: 'duplicate', 'rename', from_trash, or 'to-trash'
        :type unique_method: str

        :param pymethod: Indicates whether the name needs to meet python function naming conventions.
        :type pymethod: bool

        :returns: The name generated from the file objects path.
        :rtype: str
        '''
        remove_methods = {
            'duplicate': lambda name: "-copy".join(name.split('-copy')[:-1]),
            'ext': lambda file_name: ".".join(file_name.split('.')[:-1]),
            'rename': lambda name: "(".join(name.split('(')[:-1])
        }
        unique_methods = {
            "duplicate": lambda name, ext, index: f"{name}-copy({index}).{ext}" if index > 0 else f"{name}-copy.{ext}",
            "rename": lambda name, ext, index: f"{name}({index}).{ext}"
        }
        if path is None:
            path = self.path

        file_name = path.split("/").pop()
        if pymethod:
            file_name = remove_methods['ext'](file_name)
            raise Exception("pymethod has not been implemented.")
        if unique_method is not None:
            ext = self.get_extension(path=path)
            file_name = remove_methods['ext'](file_name)
            dirname = self.get_dirname(path=path)
            index = 1
            while os.path.exists(f"{dirname}/{file_name}{ext}"):
                file_name = unique_methods[unique_method](file_name, ext, index)
                index += 1
        if with_ext:
            return file_name
        return remove_methods['ext'](file_name)

    def get_sanitized_path(self, path=None):
        '''
        Get the path to a file object without the home directory.

        :param path: Path to the file object. Defaults to the objects path attribute.
        :type path: str

        :returns: The path to the file object without the home directory.
        :rtype: str
        '''
        if path is None:
            path = self.path
        return path[len(self.HOME_DIRECTORY) + 1:]

    def rename(self, name):
        '''
        Rename a file object. The name may change depending on its availability.

        :param name: Proposed new name for the file object.
        :type name: str

        :returns: True if the proposed name was changed, else False
        :rtype: bool
        '''
        dirname = self.get_dirname()
        new_path = os.path.join(dirname, name)
        unique_name = self.get_name(path=new_path, with_ext=True, unique_method="rename")
        dst = os.path.join(dirname, unique_name)
        changed = new_path != dst
        try:
            shutil.move(self.path, dst)
            self.path = dst
            return changed
        except FileNotFoundError as err:
            msg = f"Could not find file or directory: {str(err)}"
            raise FileNotFoundAPIError(msg, traceback.format_exc()) from err
        except PermissionError as err:
            msg = f"You do not have permission to rename this file or directory: {str(err)}"
            raise PermissionsAPIError(msg, traceback.format_exc()) from err
