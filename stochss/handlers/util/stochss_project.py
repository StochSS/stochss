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
from .stochss_job import StochSSJob
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


    def __get_meta_data(self, path=None):
        if path is None:
            path = os.path.join(self.get_path(full=True), ".metadata.json")
        if not os.path.exists(path):
            return {"description":"", "creators":[]}, []
        with open(path, "r") as md_file:
            data = json.load(md_file)
        creators = []
        metadata = data['meta_data'] if "meta_data" in data.keys() else data['metadata']
        if "creators" in data.keys():
            if isinstance(data['creators'], dict):
                for _, info in data['creators'].items():
                    creators.append(info)
            else:
                creators = data['creators']
        return metadata, creators


    def __get_old_model_data(self):
        wkgps = {}
        for file in os.listdir(self.get_path(full=True)):
            ext = file.split('.').pop()
            if ext in ("mdl", "smdl"):
                name = self.get_name(path=file)
                wkgp = {"file":f"{name}.wkgp",
                        "model":file,
                        "workflows":[]}
                wkgps[name] = wkgp
        return wkgps


    def __get_old_workflow_data(self, data):
        has_notebook = False
        wkgp_path = os.path.join(self.get_path(), "WorkflowGroup1.wkgp")
        for file in os.listdir(wkgp_path):
            if file.endswith(".wkfl"):
                path = os.path.join(wkgp_path, file)
                wkfl = StochSSWorkflow(path=path)
                mdl_file = wkfl.get_file(path=wkfl.get_model_path())
                mdl_name = wkfl.get_name(path=mdl_file)
                if mdl_name not in data.keys():
                    try:
                        _, kwargs = wkfl.extract_model()
                        StochSSModel(**kwargs)
                    except StochSSFileNotFoundError:
                        mdl_file = None
                    wkgp = {"file":f"{mdl_name}.wkgp",
                            "model":mdl_file,
                            "workflows":[file]}
                    data[mdl_name] = wkgp
                else:
                    data[mdl_name]['workflows'].append(file)
                    if data[mdl_name]['model'] is None:
                        try:
                            _, kwargs = wkfl.extract_model()
                            StochSSModel(**kwargs)
                            data[mdl_name]['model'] = mdl_file
                        except StochSSFileNotFoundError:
                            pass
            elif not has_notebook and file.endswith(".ipynb"):
                has_notebook = True
        return has_notebook


    def __load_annotation(self):
        path = os.path.join(self.get_path(full=True), "README.md")
        if not os.path.exists(path):
            return ""
        with open(path, "r") as rdme_file:
            return rdme_file.read()


    def __load_model(self, dirname, file):
        classes = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
        model_class = classes[file.split('.').pop()]
        mdl_path = os.path.join(dirname, file)
        model = model_class(path=mdl_path).load()
        model['name'] = self.get_name(path=file)
        model['directory'] = mdl_path.replace(self.user_dir + "/", "")
        return model


    def __load_notebook(self, dirname, file):
        path = os.path.join(dirname, file)
        notebook = json.dumps(StochSSNotebook(path=path).load())
        status = "error" if "Traceback (most recent call last)" in notebook else "ready"
        nb_wkfl = {"directory":path.replace(self.user_dir + "/", ""), "annotation":"",
                   "name":self.get_name(path=path), "status":status, "type":"Notebook"}
        return nb_wkfl


    def __load_workflow(self, dirname, folder):
        path = os.path.join(dirname, folder)
        wkfl = {"directory":path.replace(self.user_dir + "/", ""), "name":self.get_name(path=path)}
        if self.check_workflow_format(path=path):
            workflow = StochSSWorkflow(path=path)
            workflow.load()
            wkfl['annotation'] = workflow.workflow['annotation']
            wkfl['type'] = workflow.workflow['type']
            wkfl['status'] = None
        else:
            workflow = StochSSJob(path=path)
            info = workflow.load_info()
            wkfl["annotation"] = info['annotation']
            wkfl["status"] = workflow.get_status()
            wkfl["type"] = workflow.TITLES[info['type']]
        return wkfl


    def __load_workflow_group(self, current_format, file, metadata=None):
        path = os.path.join(self.get_path(full=True), file)
        if metadata is None:
            metadata, _ = self.__get_meta_data(path=os.path.join(path, ".metadata.json"))
        wkgp = {"name": self.get_name(path=file), "workflows": [], "model": None,
                "metadata": metadata}
        for file_obj in os.listdir(path):
            if current_format and self.MODEL_TEST(file_obj):
                wkgp['model'] = self.__load_model(dirname=path, file=file_obj)
            elif file_obj.endswith(".wkfl"):
                wkgp['workflows'].append(self.__load_workflow(dirname=path, folder=file_obj))
            elif file_obj.endswith(".ipynb"):
                wkgp['workflows'].append(self.__load_notebook(dirname=path, file=file_obj))
        if current_format and wkgp['model'] is None:
            self.project['archive'].append(wkgp)
        else:
            self.project['workflowGroups'].append(wkgp)


    def __update_all_workflows(self):
        wkgp = os.path.join(self.path, "WorkflowGroup1.wkgp")
        for file in os.listdir(wkgp):
            if file.endswith(".wkfl"):
                path = os.path.join(wkgp, file)
                if not self.check_workflow_format(path=path):
                    wkfl = StochSSWorkflow(path=path)
                    if "error" in wkfl.check_for_external_model().keys():
                        wkfl.extract_model()
                    wkfl.update_wkfl_format()


    @classmethod
    def __update_metadata(cls, metadata, creators):
        creator_ids = []
        for email in metadata['creators']:
            for i, creator in enumerate(creators):
                if creator['email'] == email:
                    creator_ids.append(f"C{i + 1}")
        metadata['creators'] = creator_ids
        return metadata


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
            if self.check_project_format(path=self.path):
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
            self.log("info", f"Successfully extracted {self.get_file(path=src)} to {dirname}")
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
        current_format = self.check_project_format(path=self.path)
        trash_path = os.path.join(self.get_path(full=True), "trash")
        annotation = self.__load_annotation()
        metadata, creators = self.__get_meta_data()
        self.project = {"name":self.get_name(), "directory":self.path, "annotation":annotation,
                        "dirname":self.get_dir_name(), "newFormat": current_format,
                        "creators": creators, "workflowGroups": [], "archive":[]}
        if "description" in metadata.keys():
            self.project['metadata'] = metadata
        else:
            new_metadata = self.__update_metadata(metadata=metadata[self.get_file()],
                                                  creators=creators)
            self.project['metadata'] = new_metadata
        if os.path.exists(trash_path):
            self.project['trash_empty'] = len(os.listdir(trash_path)) == 0
        else:
            self.project['trash_empty'] = True
            os.mkdir(trash_path)
        wkgp_test = lambda folder: folder.endswith(".wkgp")
        for wkgp in filter(wkgp_test, os.listdir(self.get_path(full=True))):
            if wkgp in metadata.keys():
                wkgp_md = self.__update_metadata(metadata=metadata[wkgp], creators=creators)
            else:
                wkgp_md = None
            self.__load_workflow_group(current_format=current_format, file=wkgp, metadata=wkgp_md)
        if not current_format:
            self.project["models"] =  []
            for mdl in filter(self.MODEL_TEST, os.listdir(self.get_path(full=True))):
                self.project['models'].append(self.__load_model(dirname=self.path, file=mdl))
        return self.project


    def update_annotation(self, annotation):
        '''
        Updates the projects annotation file

        Attributes
        ----------
        annotation : str
            The annotations to be saved.
        '''
        path = os.path.join(self.get_path(full=True), "README.md")
        with open(path, 'w') as readme_file:
            readme_file.write(annotation)


    def update_meta_data(self, data):
        '''
        Updates the projects meta-data file.

        Attributes
        ----------
        meta-data : str
            Meta-Data to be saved
        '''
        for file, metadata in data.items():
            if file.endswith(".proj"):
                path = os.path.join(self.get_path(full=True), ".metadata.json")
            else:
                path = os.path.join(self.get_path(full=True), file, ".metadata.json")
            with open(path, "w") as metadata_file:
                json.dump(metadata, metadata_file, indent=4, sort_keys=True)


    def update_project_format(self):
        '''
        Update a project to the new format

        Attributes
        ----------
        '''
        self.__update_all_workflows()
        data = self.__get_old_model_data()
        has_notebook = self.__get_old_workflow_data(data=data)
        os.chdir(self.path)
        for _, wkgp in data.items():
            if wkgp['model'] is not None:
                os.mkdir(wkgp['file'])
                shutil.move(wkgp['model'], os.path.join(wkgp['file'], wkgp['model']))
                for workflow in wkgp['workflows']:
                    dst = os.path.join(wkgp['file'], workflow)
                    shutil.move(os.path.join("WorkflowGroup1.wkgp", workflow), dst)
            else:
                for workflow in wkgp['workflows']:
                    shutil.rmtree(os.path.join("WorkflowGroup1.wkgp", workflow))
        if has_notebook:
            shutil.move("WorkflowGroup1.wkgp", "Notebooks")
        else:
            shutil.rmtree("WorkflowGroup1.wkgp")
        os.chdir(self.user_dir)
