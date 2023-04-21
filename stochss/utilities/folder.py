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
import pickle
import string
import datetime
import traceback

from escapism import escape

from stochss.utilities.file_object import FileObject
from stochss.utilities.server_errors import FileExistsAPIError

class Folder(FileObject):
    '''
    Folder object used for interacting with folders on the file system.

    :param path: Path to the directoy.
    :type path: str

    :param new: Indicates whether the directory is new.
    :type new: bool

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    def __init__(self, path=None, new=False, **kwargs):
        super().__init__(path, **kwargs)

        if new:
            self.system.log.debug("Path of directories: %s", self.path)
            try:
                os.makedirs(self.path)
            except FileExistsError as err:
                msg = f"Could not create your directory: {str(err)}"
                raise FileExistsAPIError(msg, traceback.format_exc()) from err

    def __build_jstree_node(self, file_object):
        node_types = {
            'mdl': 'well-mixed', 'smdl': 'spatial', 'sbml': 'sbml-model', 'ipynb': 'notebook',
            'domn': 'domain', 'proj': 'project', 'wkgp': 'workflow-group', 'wkfl': 'workflow'
        }
        path = os.path.join(self.path, file_object)
        ext = self.get_extension(path=file_object)
        if ext not in node_types:
            node_types[ext] = "folder" if os.path.isdir(path) else "other"
        node = {
            'text': file_object,
            'type': node_types[ext],
            '_path': self.get_sanitized_path(path=os.path.join(self.path, file_object)),
            'children': node_types[ext] in ('folder', 'workflow-group')
        }
        if node['type'] != 'workflow':
            return node
        files = self.__get_file_objects(
            tests=[lambda root, file_obj: file_obj.startswith('.')],
            path=path, full_paths=False, recursive=False
        )
        node['_newFormat'] = len(files) == 1
        if node['_newFormat']:
            jobs = self.__get_file_objects(
                tests=[
                    lambda root, file_obj: file_obj.startswith('.'),
                    lambda root, file_obj: not file_obj.startswith('job')
                ],
                path=path, full_paths=False, include_files=False, include_folders=True, recursive=False
            )
            node['_hasJobs'] = len(jobs) > 0
            return node
        def __wkfl_status(files):
            if "COMPLETE" in files:
                return "complete"
            if "ERROR" in files:
                return "error"
            if "RUNNING" in files:
                return "running"
            return "ready"
        node['_status'] = __wkfl_status(files=files)
        return node

    def __get_file_objects(self, path=None, tests=None, full_paths=True,
                           include_files=True, include_folders=False, recursive=True):
        if path is None:
            path = self.path
        if tests is None:
            tests = []
        file_objects = []
        if not recursive:
            for file_object in os.listdir(path):
                if not include_files:
                    tests.append(lambda root, file_obj: os.path.isfile(os.path.join(root, file_obj)))
                if not include_folders:
                    tests.append(lambda root, file_obj: os.path.isdir(os.path.join(root, file_obj)))
                exclude = True in [test(path, file_object) for test in tests]
                if full_paths:
                    file_object = os.path.join(path, file_object)
                if not exclude:
                    file_objects.append(file_object)
            return file_objects
        try:
            for root, folders, files in os.walk(path):
                if include_files:
                    for file in files:
                        exclude = True in [test(root, file) for test in tests]
                        if full_paths:
                            file = os.path.join(root, file)
                        if not exclude:
                            file_objects.append(file)
                if include_folders:
                    for folder in folders:
                        exclude = True in [test(root, folder) for test in tests]
                        if full_paths:
                            folder = os.path.join(root, folder)
                        if not exclude:
                            file_objects.append(folder)
            return file_objects
        except FileNotFoundError:
            return []

    def __get_jstree_node(self, is_root=False):
        if self.path == self.HOME_DIRECTORY:
            is_root = True
        files = self.__get_file_objects(
            tests=[lambda root, file_obj: file_obj.startswith('.')],
            full_paths=False, include_folders=True, recursive=False
        )
        nodes = list(map(self.__build_jstree_node, files))
        if not is_root:
            return json.dumps(nodes)
        head_node = {'type': 'root', 'children': nodes, 'state': {'opened': True}}
        if self.path == self.HOME_DIRECTORY:
            head_node['text'] = "/"
            head_node['_path'] = "/"
        else:
            head_node['text'] = self.get_name()
            head_node['_path'] = self.get_sanitized_path()
        return json.dumps([head_node])

    def __get_presentations(self):
        presentations = []
        file_objects = self.__get_file_objects(tests=[lambda root, file_obj: file_obj.startswith('.')])
        if len(file_objects) == 0:
            return presentations
        names = self.__get_presentation_names()
        need_names = names == {}
        safe_chars = set(string.ascii_letters + string.digits)
        hostname = escape(os.environ.get('JUPYTERHUB_USER'), safe=safe_chars)
        routes = {'smdl': 'present-model', 'mdl': 'present-model', 'job': 'present-job', 'ipynd': 'present-notebook'}
        for file in file_objects:
            ctime = os.path.getctime(file)
            name, ext = self.__get_presentation_name(file, names)
            file_name = self.get_name(path=file, with_ext=True)
            presentation = {
                'file': file_name, 'name': f"{name}.{ext}", 'size': os.path.getsize(file),
                'link': f"/stochss/{routes[ext]}?owner={hostname}&file={file_name}",
                'ctime': datetime.datetime.fromtimestamp(ctime).strftime("%b %d, %Y")
            }
            presentations.append(presentation)
        if need_names or len(names) != len(file_objects):
            path = os.path.join(self.path, ".presentation_names.json")
            with open(path, "w", encoding="utf-8") as names_fd:
                json.dump(names, names_fd)
        return presentations

    def __get_presentation_name(self, file_obj, names):
        file = self.get_name(path=file_obj, with_ext=True)
        ext = self.get_extension(path=file)
        if file in names:
            return names[file], ext
        if ext in ("mdl", "smdl", "ipynb"):
            with open(file_obj, "r", encoding="utf-8") as json_fd:
                content = json.load(json_fd)
                if ext == "ipynb":
                    names[file] = self.get_name(path=content['file'])
                    return names[file], ext
                names[file] = content['name']
                return names[file], ext
        with open(file_obj, "rb") as pickle_fd:
            content = pickle.load(pickle_fd)
            names[file] = content['name']
            return names[file], ext

    def __get_presentation_names(self):
        path = os.path.join(self.path, ".presentation_names.json")
        try:
            with open(path, "r", encoding="utf-8") as names_fd:
                return json.load(names_fd)
        except FileNotFoundError:
            return {}
        except json.decoder.JSONDecodeError:
            return {}

    def __get_projects(self):
        projects = []
        tests = [
            lambda root, file_obj: not file_obj.endswith(".proj"), lambda root, file_obj: "trash" in root.split("/")
        ]
        file_objects = self.__get_file_objects(tests=tests, include_files=False, include_folders=True)
        for file in file_objects:
            project = {
                'directory': self.get_sanitized_path(path=file), 'dirname': self.get_dirname(path=file),
                'name': self.get_name(path=file)
            }
            projects.append(project)
        return projects

    @classmethod
    def load_jstree(cls, path=None, is_root=False):
        ''' Load the nodes for the jstree views. '''
        self = cls(path=path)
        self.system.log.debug("Path to the directory: %s", path)
        response = self.__get_jstree_node(is_root=is_root)
        self.system.log.debug("Contents of the node: %s", str(response))
        return response

    @classmethod
    def load_presentations(cls):
        ''' Load the presentations for the browser page. '''
        self = cls(path=".presentations")
        self.system.log.info("Loading presentations ...")
        presentations = self.__get_presentations()
        self.system.log.debug("List of presentations: %s", str(presentations))
        self.system.log.info("Presentations loaded")
        return {'presentations': presentations}

    @classmethod
    def load_projects(cls):
        ''' Load the projects for the browser page. '''
        self = cls()
        self.system.log.info("Loading projects ...")
        projects = self.__get_projects()
        self.system.log.debug("List of projects: %s", str(projects))
        self.system.log.info("Projects loaded")
        return {'projects': projects}

    @classmethod
    def page_load(cls, with_presentations=True):
        ''' Load the projects and presentations for the browser page. '''
        response = cls.load_projects()
        if with_presentations:
            response.update(cls.load_presentations())
        return response
