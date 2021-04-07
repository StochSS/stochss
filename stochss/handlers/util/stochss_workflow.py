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
import datetime
import traceback

from .stochss_base import StochSSBase
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
            self.workflow['settings'] = {"settings": self.get_settings_template(),
                                         "model": mdl_path, "type":wkfl_type}
            settings_path = os.path.join(self.get_path(full=True), "settings.json")
            with open(settings_path, "w") as settings_file:
                json.dump(self.workflow['settings'], settings_file, indent=4, sort_keys=True)
        else:
            self.workflow['settings'] = None


    def __get_old_wkfl_data(self):
        job = StochSSJob(path=self.path)
        wkfl = job.load()
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
        for file_obj in os.listdir(self.get_path(full=True)):
            if file_obj.startswith("job_"):
                path = os.path.join(self.path, file_obj)
                job = StochSSJob(path=path).load()
                self.workflow['jobs'].append(job)


    def __load_settings(self):
        path = os.path.join(self.get_path(full=True), "settings.json")
        try:
            with open(path, "r") as settings_file:
                self.workflow['settings'] = json.load(settings_file)
        except FileNotFoundError as err:
            message = f"Could not find the settings file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc) from err


    @classmethod
    def __write_new_files(cls, settings, annotation):
        with open("settings.json", "w") as settings_file:
            json.dump(settings, settings_file, indent=4, sort_keys=True)
        with open("README.md", "w") as rdme_file:
            rdme_file.write(annotation)


    # def initialize_job(self):
    #     '''
    #     Initialize a new job for this workflow.

    #     Attributes
    #     ----------
    #     '''



    def load(self):
        '''
        Load a StochSS Workflow object.

        Attributes
        ----------
        '''
        self.workflow['directory'] = self.path
        self.workflow['name'] = self.get_name()
        if self.workflow['settings'] is None:
            self.__load_settings()
        self.__load_annotation()
        self.__load_jobs()


    def save(self, settings, mdl_path):
        '''
        Save the settings and model path for the workflow to the settings file.

        Attributes
        ----------
        Settings : dict
            Settings used for initializing jobs.
        mdl_path : str
            Path to the model used for jobs.
        '''
        path = os.path.join(self.get_path(full=True), "settings.json")
        self.workflow['settings'] = {"settings": settings, "model": mdl_path}
        with open(path, "w") as settings_file:
            json.dump(self.workflow['settings'], settings_file, indent=4, sort_keys=True)


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
            self.rename(name=data['wkfl'])
        else:
            with open("settings.json", "w") as settings_file:
                json.dump(data['settings']['settings'], settings_file, indent=4, sort_keys=True)
            self.rename(name=data['job'])
            path = os.path.join(self.get_dir_name(full=True), data['wkfl'])
            os.mkdir(path)
            shutil.move(self.get_path(full=True), os.path.join(path, data['job']))
            os.chdir(path)
            self.__write_new_files(data['settings'], data['annotation'])
        os.chdir(self.user_dir)
        self.path = os.path.join(self.get_dir_name(), data['wkfl'])
        return self.path, data['settings']['model']
