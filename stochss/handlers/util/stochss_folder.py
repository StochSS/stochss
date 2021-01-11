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
# import shutil
# import zipfile
# import datetime
import traceback

from .stochss_errors import StochSSFileExistsError, StochSSFileNotFoundError

class StochSSFolder():
    '''
    ################################################################################################
    StochSS folder object
    ################################################################################################
    '''
    user_dir = "/home/jovyan"

    def __init__(self, path, new=False):
        '''
        Intitialize a folder object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the folder
        new : bool
            Indicates whether or not the folder is new
        '''
        self.path = path
        new_path = os.path.join(self.user_dir, path)
        if new:
            try:
                os.makedirs(new_path)
            except FileExistsError as err:
                message = f"Could not create your directory: {str(err)}"
                raise StochSSFileExistsError(message, traceback.format_exc())


    def __build_jstree_node(self, path, file):
        types = {"mdl":"nonspatial", "smdl":"spatial", "sbml":"sbml-model", "ipynb":"notebook",
                 "wkfl":"workflow", "proj":"project", "wkgp":"workflow-group", "mesh":"mesh"}
        _path = file if self.path == "none" else os.path.join(self.path, file)
        ext = file.split('.').pop() if "." in file else None
        node = {"text":file, "type":"other", "_path":_path, "children":False}
        if ext in types.keys():
            file_type = types[ext]
            node['type'] = file_type
            if file_type == "workflow":
                from .stochss_workflow import StochSSWorkflow
                wkfl = StochSSWorkflow(path)
                node['_status'] = wkfl.get_status()
            elif file_type == "workflow-group":
                node['children'] = True
        elif os.path.isdir(os.path.join(path, file)):
            node['type'] = "folder"
            node['children'] = True

        return node


    def get_name(self, path=None):
        '''
        Get the directory name from the directory path or provided path

        Attributes
        ----------
        path : str
            Path to a directory
        '''
        name = self.path if path is None else path
        if name.endswith("/"):
            name = name[:-1]
        name = name.split('/').pop()
        if "." not in name:
            return name
        return '.'.join(name.split('.')[:-1])


    def get_jstree_node(self, is_root=False):
        '''
        Build and return a JSTree node object the represents the file object

        Attributes
        ----------
        is_root : bool
            Indicates whether or not a folder is to be treated as the root
        '''
        path = self.user_dir if self.path == "none" else os.path.join(self.user_dir, self.path)
        try:
            files = list(filter(lambda file: not file.startswith('.'), os.listdir(path=path)))
            nodes = list(map(lambda file: self.__build_jstree_node(path, file), files))
            if self.path == "none":
                state = {"opened":True}
                root = {"text":"/", "type":"root", "_path":"/", "children":nodes, "state":state}
                return json.dumps([root])
            if is_root:
                root = {"text":self.get_name(), "type":"root", "_path":self.path, "children":nodes,
                        "state":{"opened":True}}
                return json.dumps([root])
            return json.dumps(nodes)
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
