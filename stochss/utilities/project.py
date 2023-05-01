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

from stochss.utilities.folder import Folder
from stochss.utilities.workflow_group import WorkflowGroup
from stochss.utilities.workflow import Workflow

class Project(Folder):
    r'''
    Project object used for interacting with projects on the file system.

    :param path: Path to the project.
    :type path: str

    :param new: Indicates whether the project is new.
    :type new: bool

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    def __init__(self, path, new=False, **kwargs):
        if new and not path.endswith(".proj"):
            path = f"{path}.proj"
        super().__init__(path=path, new=new, **kwargs)

        self.readme_file = os.path.join(self.path, 'README.md')
        self.trash_directory = os.path.join(self.path, "trash")
        self.metadata_file = os.path.join(self.path, ".metadata.json")
        if new:
            os.mkdir(self.trash_directory)
            open(self.readme_file, "w", encoding="utf-8").close() # pylint: disable=consider-using-with
            open(self.metadata_file, "w", encoding="utf-8").close() # pylint: disable=consider-using-with

        self.loaded = False
        self.archive = []
        self.creators = None
        self.metadata = None
        self.annotation = None
        self.workflow_groups = []

    def __check_project_version(self):
        models = self._get_file_objects(
            tests=[lambda root, file_obj, obj=self: obj.get_extension(path=file_obj) not in ("mdl", "smdl")],
            full_paths=False, recursive=False
        )
        if len(models) > 0:
            return False
        workflow_groups = self._get_file_objects(
            tests=[lambda root, file_obj: not file_obj.endswith(".wkgp")],
            full_paths=False, include_files=False, include_folders=True, recursive=True
        )
        if len(workflow_groups) == 1 and workflow_groups[0] == "WorkflowGroup1.wkgp":
            return False
        return True

    def __get_old_version_data(self):
        workflows = self._get_file_objects(
            tests=[lambda root, file_obj: not file_obj.endswith(".wkfl")],
            include_files=False, include_folders=True, recursive=False
        )
        wkfl_mappings = {}
        for workflow in workflows:
            if Workflow.check_workflow_version(workflow):
                model, data = Workflow.update_to_current(workflow)
                if model in wkfl_mappings:
                    wkfl_mappings[model].append(data)
                else:
                    wkfl_mappings[model] = [data]
        models = self._get_file_objects(
            tests=[lambda root, file_obj, obj=self: obj.get_extension(path=file_obj) not in ("mdl", "smdl")],
            full_paths=False, recursive=False
        )
        wkgp_mappings = {}
        for model in models:
            name = self.get_name(path=model)
            wkgp_mappings[name] = {'model': model}
            if name in wkfl_mappings:
                wkgp_mappings[name]['workflows'] = wkfl_mappings[name]
            else:
                wkgp_mappings[name]['workflows'] = []
        return wkgp_mappings

    def __load_annotation(self):
        with open(self.readme_file, "r", encoding="utf-8") as readme_fd:
            self.annotation = readme_fd.read().strip()

    def __load_metadata(self):
        creators = []
        try:
            with open(self.metadata_file, "r", encoding="utf-8") as meta_fd:
                data = json.load(meta_fd)
            metadata = data['meta_data'] if "meta_data" in data else data['metadata']
            if "creators" in data:
                if isinstance(data['creators'], dict):
                    for _, info in data['creators'].items():
                        creators.append(info)
                else:
                    creators = data['creators']
            if "description" not in metadata:
                self.__update_metadata(metadata[self.get_name(with_ext=True)], creators)
            self.metadata = metadata
            self.creators = creators
        except FileNotFoundError:
            self.metadata = {'description': "", 'creators': []}
            self.creators = creators

    def __update_to_current(self):
        # Check if the project format is current
        if self.__check_project_version():
            return

        v1_data = self.__get_old_version_data()
        os.chdir(self.path)
        for name, contents in v1_data.items():
            os.mkdir(f"{name}.wkgp")
            os.rename(contents['model'], f"{name}.wkgp/{contents['model']}")
            for workflow in contents['workflows']:
                workflow.move(f"{name}.wkgp")

    def __update_metadata(self, metadata, creators): # pylint: disable=no-self-use
        creator_ids = []
        for email in metadata['creators']:
            for i, creator in enumerate(creators):
                if creator['email'] == email:
                    creator_ids.append(f"C{i + 1}")
        metadata['creators'] = creator_ids

    def load(self):
        ''' Load the project from the file system. '''
        self.__update_to_current()
        self.__load_annotation()
        self.__load_metadata()
        workflow_groups = self._get_file_objects(
            tests=[lambda root, file_obj: not file_obj.endswith(".wkgp")],
            full_paths=False, include_files=False, include_folders=True, recursive=False
        )
        for workflow_group_file in workflow_groups:
            if workflow_group_file in self.metadata:
                self.__update_metadata(self.metadata[workflow_group_file], self.creators)
                wkgp_metadata = self.metadata[workflow_group_file]
            else:
                wkgp_metadata = None
            workflow_group_path = os.path.join(self.get_sanitized_path(), workflow_group_file)
            workflow_group = WorkflowGroup(workflow_group_path, metadata=wkgp_metadata)
            workflow_group.load()
            if workflow_group.model is None:
                self.archive.append(workflow_group)
            else:
                self.workflow_groups.append(workflow_group)
        self.loaded = True

    @classmethod
    def load_project(cls, path=None):
        '''
        Load the details of the project for the project manager page.

        :param path: Path to the project.
        :type path: str

        :returns: Required contents of the project manager page.
        :rtype: dict
        '''
        project = cls(path)
        return project.to_dict()

    def to_dict(self):
        '''
        Convert the project to a dictionary compatable with the project manager page.

        :returns: The dictionary representation of the project.
        :rtype:
        '''
        if not self.loaded:
            self.load()

        project = {
            'annotation': self.annotation,
            'archive': [workflow_group.to_dict() for workflow_group in self.archive],
            'creators': self.creators,
            'directory': self.get_sanitized_path(),
            'dirname': self.get_dirname(sanitized=True),
            'metadata': self.metadata,
            'name': self.get_name(),
            'newFormat': True,
            'trash_empty': len(self._get_file_objects(
                path=self.trash_directory, tests=[lambda root, file_obj: file_obj.startswith('.')],
                full_paths=False, include_folders=True, recursive=False
            )) == 0,
            'workflowGroups': [workflow_group.to_dict() for workflow_group in self.workflow_groups]
        }
        return project
