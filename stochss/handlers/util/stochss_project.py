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
import traceback

from .stochss_base import StochSSBase
from .stochss_model import StochSSModel
from .stochss_spatial_model import StochSSSpatialModel
from .stochss_workflow import StochSSWorkflow
from .stochss_errors import StochSSFileExistsError

class StochSSProject(StochSSBase):
    '''
    ################################################################################################
    StochSS project object
    ################################################################################################
    '''

    MODEL_TEST = lambda file: file.endswith(".mdl") or file.endswith(".smdl")

    def __init__(self, path, new=False):
        '''
        Intitialize a project object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the project
        new : bool
            Indicates whether or not the workflow is new
        '''
        super().__init__(path=path)
        self.project = None
        if new:
            try:
                os.makedirs(os.path.join(self.get_path(full=True), "trash"))
            except FileExistsError:
                message = f"Could not create your project: {self.path}"
                raise StochSSFileExistsError(message, traceback.format_exc())


    def add_model(self, file, model=None, new=False):
        '''
        Add a model to the project

        Attributes
        ----------
        file : str
            Name for the model file
        model : dict
            Model data
        new : bool
            Indicates whether or not the model is new
        '''
        if new:
            wkgp = os.path.join(self.path, f"{self.get_name(path=file)}.wkgp")
        else:
            wkgp, _ = self.get_unique_path(name=f"{self.get_name(path=file)}.wkgp")
        try:
            os.mkdir(wkgp)
            path = os.path.join(wkgp if self.check_format() else self.path, file)
            if model is None:
                model = self.get_model_template()
            with open(path, "w") as model_file:
                json.dump(model, model_file)
            if new:
                return {"path":path}
            message = f"{file} was successfully added to the project."
            return {"message":message}
        except FileExistsError:
            message = f"Could not create your model: {file}"
            raise StochSSFileExistsError(message, traceback.format_exc())


    def check_format(self):
        '''
        Determine if the format of the project is out of date

        Attributes
        ----------
        '''
        files = os.listdir(self.path)
        wkgp_test = lambda file: file.endsith(".wkgp")
        models = list(filter(self.MODEL_TEST, files))
        wkgps = list(filter(wkgp_test, files))
        if len(models) > 0:
            return False
        if len(wkgps) == 1 and wkgps[0] == "WorkflowGroup1.wkgp":
            return False
        return True


    def load(self):
        '''
        Determines the project format, gets all models and workflows
        in the project based on the format.

        Attributes
        ----------
        '''
        current_format = self.check_format()
        trash_path = os.path.join(self.get_path(full=True), "trash")
        self.project = {"models":[], "newFormat": current_format}
        if os.path.exists(trash_path):
            self.project['trash_empty'] = os.listdir(trash_path) == 0
        else:
            self.project['trash_empty'] = True
            os.mkdir(trash_path)
        classes = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        workflow_groups = {"name":"WorkflowGroup1", "workflows":[]}
        for root, folders, files in os.walk(self.get_path(full=True)):
            if "trash" not in root and ".wkfl" not in root:
                for file in filter(self.MODEL_TEST, files):
                    model_class = classes[file.split('.').pop()]
                    self.project['models'].append(model_class(path=os.path.join(root, file)).load())
                for wkfl in filter(lambda folder: folder.endswith(".wkfl"), folders):
                    path = os.path.join(root, wkfl)
                    workflow = StochSSWorkflow(path=path)
                    info = workflow.load_info()
                    workflow_groups['workflows'].append({"path":path,
                                                         "annotation":info['annotation'],
                                                         "name":self.get_name(path=path),
                                                         "status":workflow.get_status(),
                                                         "type":workflow.TITLES[info['type']],
                                                         "outputs":[]})
        self.project['workflowGroups'] = workflow_groups
        return self.project
