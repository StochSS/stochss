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
import shutil
import traceback

from .stochss_base import StochSSBase
from .stochss_model import StochSSModel
from .stochss_spatial_model import StochSSSpatialModel
from .stochss_workflow import StochSSWorkflow
from .stochss_notebook import StochSSNotebook
from .stochss_errors import StochSSFileExistsError, StochSSFileNotFoundError, \
                            StochSSPermissionsError

class StochSSProject(StochSSBase):
    '''
    ################################################################################################
    StochSS project object
    ################################################################################################
    '''

    MODEL_TEST = lambda self, file: file.endswith(".mdl") or file.endswith(".smdl")

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
            except FileExistsError as err:
                message = f"Could not create your project: {self.path}"
                raise StochSSFileExistsError(message, traceback.format_exc()) from err


    def __load_model(self, dirname, file):
        classes = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        model_class = classes[file.split('.').pop()]
        mdl_path = os.path.join(dirname, file)
        model = model_class(path=mdl_path).load()
        model['name'] = self.get_name(path=file)
        model['directory'] = mdl_path
        self.project['models'].append(model)


    def __load_notebook(self, dirname, file):
        path = os.path.join(dirname, file)
        notebook = json.dumps(StochSSNotebook(path=path).load())
        status = "error" if "Traceback (most recent call last)" in notebook else "ready"
        nb_wkfl = {"path":path, "annotation":"", "name":self.get_name(path=path),
                   "status":status, "outputs":[], "type":"notebook"}
        self.project['workflowGroups'][0]['workflows'].append(nb_wkfl)


    def __load_workflow(self, dirname, folder):
        path = os.path.join(dirname, folder)
        workflow = StochSSWorkflow(path=path)
        info = workflow.load_info()
        outputs = workflow.load_settings()['resultsSettings']['outputs']
        if outputs:
            output = max(outputs, key=lambda output: output['stamp'])
            if "plot" in self.project.keys():
                if output['stamp'] > self.project['plot']['output']['stamp']:
                    self.project['plot'] = {"path":path, "output":output}
            else:
                self.project['plot'] = {"path":path, "output":output}
        wkfl = {"path":path, "annotation":info['annotation'],
                "name":self.get_name(path=path), "status":workflow.get_status(),
                "type":workflow.TITLES[info['type']], "outputs":outputs}
        self.project['workflowGroups'][0]['workflows'].append(wkfl)


    def __load_workflow_group(self, current_format, wkgp_path, file):
        if current_format and self.MODEL_TEST(file):
            self.__load_model(dirname=wkgp_path, file=file)
        elif file.endswith(".wkfl"):
            self.__load_workflow(dirname=wkgp_path, folder=file)
        elif file.endswith(".ipynb"):
            self.__load_notebook(dirname=wkgp_path, file=file)


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
        try:
            self.log("debug", f"Original file name: {file}")
            if self.check_project_format():
                wkgp_file = f"{self.get_name(path=file)}.wkgp"
                self.log("debug", f"Original workflow group folder name: {wkgp_file}")
                if new:
                    wkgp_path = os.path.join(self.get_path(full=True), wkgp_file)
                else:
                    wkgp_path, changed = self.get_unique_path(name=wkgp_file, dirname=self.path)
                    if changed:
                        wkgp_file = self.get_file(path=wkgp_path)
                        file = f"{self.get_name(path=wkgp_path)}.{file.split('.').pop()}"
                self.log("debug", f"Final file name: {file}")
                self.log("debug", f"Final workflow group folder name: {wkgp_file}")
                self.log("debug", f"Workflow group path: {wkgp_path}")
                path = os.path.join(self.path, wkgp_file, file)
            else:
                path = os.path.join(self.path, file)
            if new and os.path.exists(path):
                message = f"Could not create your model: {file}"
                raise StochSSFileExistsError(message, traceback.format_exc())
            self.log("debug", f"Path to the model: {path}")
            if model is None:
                model = self.get_model_template()
            model_class = StochSSModel if path.endswith(".mdl") else StochSSSpatialModel
            model = model_class(path=path, new=True, model=model)
            if new:
                return {"path":path}
            message = f"{file} was successfully added to the project."
            return {"message":message}
        except FileExistsError as err:
            message = f"Could not create your model: {file}"
            raise StochSSFileExistsError(message, traceback.format_exc()) from err


    def extract_workflow(self, src, dst):
        '''
        Make a copy of the target workflow and place it in the parent directory of the project.

        Attributes
        ----------
        src : str
            Path to the target workflow
        dst : str
            Proposed path for the workflows copy
        '''
        dirname = os.path.dirname(dst)
        dst, _ = self.get_unique_path(name=self.get_file(path=dst), dirname=dirname)
        try:
            shutil.copytree(src, dst)
            if not dirname:
                dirname = "/"
            resp = f"The Workflow {self.get_file(path=src)} was exported to {dirname}"
            resp += f" in files as {self.get_file(path=dst)}"
            return resp
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to copy this directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def load(self):
        '''
        Determines the project format, gets all models and workflows
        in the project based on the format.

        Attributes
        ----------
        '''
        current_format = self.check_project_format()
        trash_path = os.path.join(self.get_path(full=True), "trash")
        self.project = {"models":[], "newFormat": current_format,
                        "workflowGroups":[{"name":"WorkflowGroup1", "workflows":[]}]}
        if os.path.exists(trash_path):
            self.project['trash_empty'] = len(os.listdir(trash_path)) == 0
        else:
            self.project['trash_empty'] = True
            os.mkdir(trash_path)
        wkgp_test = lambda folder: folder.endswith(".wkgp")
        if current_format:
            for wkgp in filter(wkgp_test, os.listdir(self.get_path(full=True))):
                wkgp_path = os.path.join(self.path, wkgp)
                for file in os.listdir(wkgp_path):
                    self.__load_workflow_group(current_format=current_format,
                                               wkgp_path=wkgp_path, file=file)
        else:
            for file_obj in os.listdir(self.get_path(full=True)):
                if self.MODEL_TEST(file_obj):
                    self.__load_model(dirname=self.path, file=file_obj)
                elif wkgp_test(file_obj):
                    wkgp_path = os.path.join(self.path, file_obj)
                    for file in os.listdir(wkgp_path):
                        self.__load_workflow_group(current_format=current_format,
                                                   wkgp_path=wkgp_path, file=file)
        return self.project
