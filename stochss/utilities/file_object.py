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

from stochss.utilities.user_system import UserSystem

class FileObject():
    '''
    Base class for file objects.

    :param path: Path to the file object. Defaults to the users home directory.
    :type path: str

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    HOME_DIRECTORY = os.path.expanduser("~")

    def __init__(self, path=None, **kwargs):
        if path in ("", "/"):
            path = None
        if path is None:
            self.path = self.HOME_DIRECTORY
        else:
            self.path = os.path.join(self.HOME_DIRECTORY, path)

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
            "rename": lambda name, ext, index: f"{name}({index}).{ext}" if index > 0 else f"{name}.{ext}"
        }
        if path is None:
            path = self.path

        file_name = path.split("/").pop()
        if pymethod:
            name = remove_methods['ext'](file_name)
            raise Exception("pymethod has not been implemented.")
        if unique_method is not None:
            ext = self.get_extension(path=path)
            name = remove_methods['ext'](file_name)
            dirname = self.get_dirname(path=path)
            raise Exception("unique has not been implemented.")
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
