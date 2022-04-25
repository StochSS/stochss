'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
import datetime
import traceback

import numpy

from .stochss_base import StochSSBase
from .stochss_folder import StochSSFolder
from .stochss_model import StochSSModel
from .stochss_job import StochSSJob
from .stochss_errors import StochSSFileNotFoundError

class StochSSWorkflow(StochSSBase):
    '''
    ################################################################################################
    StochSS workflow object
    ################################################################################################
    '''

    def __init__(self, path, new=False, mdl_path=None, wkfl_type=None):
        '''
        Intitialize a workflow object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the workflow
        new : bool
            Indicates whether or not the workflow is new
        mdl_path : str
            Path to model for the workflow
        wkfl_type : str
            Type of workflow
        '''
        super().__init__(path=path)
        self.workflow = {}
        if new:
            unique_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = unique_path.replace(self.user_dir + '/', "")
            os.mkdir(unique_path)
            settings = self.get_settings_template()
            if wkfl_type == "Parameter Sweep":
                settings['simulationSettings']['realizations'] = 20
            if os.path.exists(mdl_path):
                with open(mdl_path, "r") as mdl_file:
                    timespan_settings = json.load(mdl_file)['modelSettings']
                    settings['timespanSettings'] = timespan_settings
            self.workflow['settings'] = {"settings": settings, "model": mdl_path, "type":wkfl_type}
            settings_path = os.path.join(self.get_path(full=True), "settings.json")
            with open(settings_path, "w") as settings_file:
                json.dump(self.workflow['settings'], settings_file, indent=4, sort_keys=True)
        else:
            self.workflow['settings'] = None


    def __get_old_wkfl_data(self):
        job = StochSSJob(path=self.path)
        wkfl = job.load()
        if wkfl['model'] is None:
            mdl_path = job.get_model_path()
            wkfl['model'] = StochSSModel(path=mdl_path).load()
        wkfl['settings']['timespanSettings'] = wkfl['model']['modelSettings']
        info = job.load_info()
        settings = {"settings":wkfl['settings'], "model":info['source_model'],
                    "type":wkfl['titleType']}
        time_stamp = job.get_time_stamp()
        if time_stamp is None:
            wkfl_file = job.get_file()
            if wkfl['status'] != "ready":
                ctime = os.path.getctime(job.path)
                time_stamp = datetime.datetime.fromtimestamp(ctime).strftime("_%m%d%Y_%H%M%S")
        else:
            wkfl_file = job.get_file(path=job.path.replace(time_stamp, ""))
        job_file = None if wkfl['status'] == "ready" else f"job{time_stamp}"
        return {"wkfl":wkfl_file, "job":job_file, "settings":settings,
                "status":wkfl['status'], "annotation":info['annotation']}


    def __load_annotation(self):
        path = os.path.join(self.get_path(full=True), "README.md")
        try:
            with open(path, "r") as annotation_file:
                annotation = annotation_file.read()
        except FileNotFoundError:
            annotation = ""
        self.workflow['annotation'] = annotation


    def __load_jobs(self):
        self.workflow['jobs'] = []
        time = 0
        last_job = None
        for file_obj in os.listdir(self.get_path(full=True)):
            if file_obj.startswith("job_"):
                path = os.path.join(self.path, file_obj)
                job = StochSSJob(path=path).load()
                self.workflow['jobs'].append(job)
                if os.path.getmtime(path) > time and job['status'] != "running":
                    time = os.path.getmtime(path)
                    last_job = job
        if last_job is None:
            self.workflow['activeJob'] = None
        else:
            self.workflow['activeJob'] = last_job


    def __load_settings(self):
        path = os.path.join(self.get_path(full=True), "settings.json")
        try:
            with open(path, "r") as settings_file:
                settings = json.load(settings_file)
                self.workflow['model'] = settings['model']
                self.workflow['settings'] = settings['settings']
                self.workflow['type'] = settings['type']
        except FileNotFoundError as err:
            message = f"Could not find the settings file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc) from err


    @classmethod
    def __update_results_settings(cls, settings):
        for param in settings['parameterSweepSettings']['parameters']:
            p_range = list(numpy.linspace(param['min'], param['max'], param['steps']))
            param['range'] = p_range


    def __update_settings(self):
        settings = self.workflow['settings']['parameterSweepSettings']
        parameters = []
        if "parameters" not in settings.keys():
            if "paramID" in settings['parameterOne']:
                param1 = {"paramID": settings['parameterOne']['paramID'],
                          "min": settings['p1Min'],
                          "max": settings['p1Max'],
                          "name": settings['parameterOne']['name'],
                          "steps": settings['p1Steps'],
                          "hasChangedRanged": False}
                parameters.append(param1)
            if "paramID" in settings['parameterTwo']:
                param2 = {"paramID": settings['parameterTwo']['paramID'],
                          "min": settings['p2Min'],
                          "max": settings['p2Max'],
                          "name": settings['parameterTwo']['name'],
                          "steps": settings['p2Steps'],
                          "hasChangedRanged": False}
                parameters.append(param2)
            soi = settings['speciesOfInterest']
            self.workflow['settings']['parameterSweepSettings'] = {"speciesOfInterest": soi,
                                                                   "parameters": parameters}


    @classmethod
    def __write_new_files(cls, settings, annotation):
        with open("settings.json", "w") as settings_file:
            json.dump(settings, settings_file, indent=4, sort_keys=True)
        with open("README.md", "w") as rdme_file:
            rdme_file.write(annotation)


    def check_for_external_model(self, path=None):
        '''
        Check if the jobs model exists outside of the job and return it path

        Attributes
        ----------
        path : str
            Path to the external model
        '''
        if path is None:
            if self.check_workflow_format(path=self.path):
                path = self.get_model_path()
            else:
                job = StochSSJob(path=self.path)
                path = job.get_model_path(full=True, external=True)
        self.log("debug", f"Path to the job's model: {path}")
        resp = {"file":path.replace(self.user_dir + '/', '')}
        if not os.path.exists(path):
            file = self.get_file(path=path)
            error = f"The model file {file} could not be found.  "
            error += "To edit the model you will need to extract the model from the "
            error += "workflow or open the workflow and update the path to the model."
            resp['error'] = error
        return resp


    def duplicate_as_new(self):
        '''
        Create a clean copy of the workflow and its settings with no jobs.

        Attributes
        ----------
        '''
        self.load()
        path = self.get_unique_copy_path(path=self.path)
        kwargs = {"path": path, "new": True, "mdl_path": self.workflow['model'],
                  "wkfl_type": self.workflow['type']}
        message = f"A new workflow has been created from {self.path}"
        resp = {"message": message, "mdlPath": self.workflow['model'],
                "mdl_file": self.get_file(path=self.workflow['model'])}
        c_resp = self.check_for_external_model(path=self.workflow['model'])
        if "error" in c_resp.keys():
            resp['error'] = c_resp['error']
        return resp, kwargs


    def extract_model(self):
        '''
        Extract the model from the most recently created job.

        Attributes
        ----------
        '''
        new_format = self.check_workflow_format(path=self.path)
        if new_format:
            os.chdir(self.path)
            files = list(filter(lambda file: file.startswith("job_"), os.listdir()))
            if len(files) <= 0:
                os.chdir(self.user_dir)
                message = "There are no jobs to extract a model from."
                raise StochSSFileNotFoundError(message)
            files.sort(reverse=True, key=os.path.getctime)
            os.chdir(self.user_dir)
            path = os.path.join(self.path, files[0])
        else:
            path = self.path
        job = StochSSJob(path=path)
        return job.extract_model()


    def get_model_path(self):
        '''
        Return the path to the external model file

        Attributes
        ----------
        '''
        try:
            with open(os.path.join(self.path, "settings.json")) as settings_file:
                path = json.load(settings_file)['model']
            if ".proj" not in self.path:
                return path
            file = self.get_file(path=path)
            proj_path = f"{self.path.split('.proj')[0]}.proj"
            if self.check_project_format(path=proj_path):
                return os.path.join(self.get_dir_name(), file)
            return os.path.join(proj_path, file)
        except FileNotFoundError as err:
            message = f"Could not find settings file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def initialize_job(self, settings, mdl_path, time_stamp, wkfl_type):
        '''
        Initialize a new job for this workflow.

        Attributes
        ----------
        settings : dict
            Workflow settings dictionary
        mdl_path : str
            Path to the model of the workflow
        time_stamp : str
            Datetime stamp for the new job
        wkfl_type : str
            Type of workflow
        '''
        self.log("info", f"Saving {self.get_file()}")
        self.save(new_settings=settings, mdl_path=mdl_path)
        if wkfl_type == "parameterSweep":
            self.__update_results_settings(settings=settings)
        self.log("info", f"Successfully saved {self.get_file()}")
        if self.check_workflow_format(path=self.path):
            self.log("info", f"Creating job{time_stamp} job")
            path = os.path.join(self.path, f"job{time_stamp}")
            data = {"mdl_path": mdl_path, "settings": settings, "type":wkfl_type}
            job = StochSSJob(path=path, new=True, data=data)
            self.log("info", f"Successfully created {job.get_file()} job")
        else:
            job = StochSSJob(path=self.path)
        self.log("info", f"Initializing {job.get_file()}")
        job.save(mdl_path=mdl_path, settings=settings, initialize=True)
        return job.path


    def load(self):
        '''
        Load a StochSS Workflow object.

        Attributes
        ----------
        '''
        self.workflow['directory'] = self.path
        self.workflow['name'] = self.get_name()
        self.workflow['newFormat'] = self.check_workflow_format(path=self.path)
        if self.workflow['newFormat']:
            if self.workflow['settings'] is None:
                self.__load_settings()
            self.__load_annotation()
            self.__load_jobs()
            oldfmtrdy = False
        else:
            self.workflow['jobs'] = []
            job = StochSSJob(path=self.path)
            jobdata = job.load()
            self.workflow['activeJob'] = jobdata
            self.workflow['model'] = job.get_model_path(external=True)
            self.workflow['settings'] = jobdata['settings']
            self.workflow['type'] = jobdata['titleType']
            oldfmtrdy = jobdata['status'] == "ready"
        self.__update_settings()
        if not os.path.exists(self.workflow['model']) and (oldfmtrdy or self.workflow['newFormat']):
            if ".proj" in self.path:
                if "WorkflowGroup1.wkgp" in self.path:
                    proj = StochSSFolder(path=os.path.dirname(self.get_dir_name(full=True)))
                    test = lambda ext, root, file: ".wkfl" in root or "trash" in root.split("/")
                    models = proj.get_file_list(ext=[".mdl"], test=test)
                else:
                    wkgp = StochSSFolder(path=self.get_dir_name(full=True))
                    test = lambda ext, root, file: ".wkfl" in root
                    models = wkgp.get_file_list(ext=[".mdl"], test=test)
                    if models['files']:
                        self.workflow['model'] = models["paths"]["0"][0]
                        models = None
                    else:
                        self.workflow['model'] = None
            else:
                root = StochSSFolder(path="")
                test = lambda ext, root, file: ".wkfl" in root or ".proj" in root or \
                                               "trash" in root.split("/")
                models = root.get_file_list(ext=[".mdl"], test=test)
            if models is not None:
                self.workflow['models'] = models
        return self.workflow


    def save(self, new_settings, mdl_path):
        '''
        Save the settings and model path for the workflow to the settings file.

        Attributes
        ----------
        new_settings : dict
            Settings used for initializing jobs.
        mdl_path : str
            Path to the model used for jobs.
        '''
        if self.check_workflow_format(path=self.path):
            path = os.path.join(self.get_path(full=True), "settings.json")
            with open(path, "r") as settings_file:
                settings = json.load(settings_file)
            settings['settings'] = new_settings
            settings['model'] = mdl_path
            with open(path, "w") as settings_file:
                json.dump(settings, settings_file, indent=4, sort_keys=True)
            return f"Successfully saved the workflow: {self.path}"
        job = StochSSJob(path=self.path)
        return job.save(mdl_path=mdl_path, settings=new_settings)


    def save_annotation(self, annotation):
        '''
        Save the workflows annotation.

        annotation : str
            Annotation to be saved
        '''
        with open(os.path.join(self.path, "README.md"), "w") as rdme_file:
            rdme_file.write(annotation)


    def update_wkfl_format(self):
        '''
        Update a workflow to the new workflow/job format

        Attributes
        ----------
        '''
        data = self.__get_old_wkfl_data()
        os.chdir(self.path)
        if data['status'] == "ready":
            for file in os.listdir():
                if os.path.isdir(file):
                    shutil.rmtree(file)
                else:
                    os.remove(file)
            self.__write_new_files(data['settings'], data['annotation'])
            if data['wkfl'] != self.get_file():
                self.rename(name=data['wkfl'])
        else:
            with open("settings.json", "w") as settings_file:
                json.dump(data['settings']['settings'], settings_file, indent=4, sort_keys=True)
            self.rename(name=data['job'])
            path, _ = self.get_unique_path(name=data['wkfl'], dirname=self.get_dir_name(full=True))
            os.mkdir(path)
            shutil.move(self.get_path(full=True), os.path.join(path, data['job']))
            os.chdir(path)
            self.__write_new_files(data['settings'], data['annotation'])
            self.path = os.path.join(self.get_dir_name(), self.get_file(path=path))
        os.chdir(self.user_dir)
        return self.path
