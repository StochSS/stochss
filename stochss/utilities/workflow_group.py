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
from stochss.utilities.workflow import Workflow
from stochss.utilities.spatial import Spatial
from stochss.utilities.well_mixed import WellMixed
from stochss.utilities.notebook import Notebook

class WorkflowGroup(Folder):
    r'''
    Workflow group object used for interacting with workflow groups on the file system.

    :param path: Path to the workflow group.
    :type path: str

    :param metadata: Metadata for the workflow group store in the projects metadata file.
    :type metadata: dict

    :param new: Indicates whether the workflow group is new.
    :type new: bool

    :param spatial: Indicates that the model is a spatial model.
    :type spatial: bool

    :param model: Contents of the model.
    :type model: dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    def __init__(self, path, metadata=None, new=False, spatial=False, model=None, **kwargs):
        if new and not path.endswith(".wkpg"):
            path = f"{path}.wkgp"
        super().__init__(path=path, new=new, make_unique=True, **kwargs)

        self.loaded = False
        self.model = None
        self.metadata = metadata
        self.workflows = []
        self.metadata_file = os.path.join(self.path, ".metadata.json")
        if new:
            if spatial:
                self.model = Spatial(f"{self.get_sanitized_path()}/{self.get_name()}.smdl", new=True, model=model)
            else:
                self.model = WellMixed(f"{self.get_sanitized_path()}/{self.get_name()}.mdl", new=True, model=model)

    def __load_metadata(self):
        try:
            with open(self.metadata_file, "r", encoding="utf-8") as metadata_fd:
                self.metadata = json.load(metadata_fd)
        except FileNotFoundError:
            self.metadata = {'description': "", 'creators': []}

    def __load_model(self):
        models = self._get_file_objects(recursive=False, tests=[
            lambda root, file_obj: file_obj.startswith("."),
            lambda root, file_obj, obj=self: obj.get_extension(path=file_obj) not in ("mdl", "smdl")
        ])
        print(models)
        if len(models) > 0:
            if self.get_extension(path=models[0]) == "smdl":
                self.model = Spatial(models[0])
            else:
                self.model = WellMixed(models[0])

    def __load_workflows(self):
        workflows = self._get_file_objects(include_folders=True, recursive=False, tests=[
            lambda root, file_obj: file_obj.startswith("."),
            lambda root, file_obj, obj=self: obj.get_extension(path=file_obj) not in ("ipynb", "wkfl")
        ])
        for workflow in workflows:
            if self.get_extension(path=workflow) == "ipynb":
                self.workflows.append(Notebook(workflow))
            else:
                self.workflows.append(Workflow(workflow))

    def load(self):
        ''' Load the details of the workflow group for the project manager page. '''
        if self.metadata is None:
            self.__load_metadata()
        self.__load_model()
        self.__load_workflows()
        self.loaded = True

    def to_dict(self):
        '''
        Convert the workflow group to a dictionary compatable with the project manager page.

        :returns: The dictionary representation of the workflow group.
        :rtype:
        '''
        if not self.loaded:
            self.load()

        workflow_group = {
            'name': self.get_name(),
            'metadata': self.metadata,
            'model': None if self.model is None else self.model.to_dict(),
            'workflows': [workflow.to_dict() for workflow in self.workflows]
        }
        return workflow_group
