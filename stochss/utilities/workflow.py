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
import shutil
import datetime

from stochss.utilities.folder import Folder
from stochss.templates.workflow_settings import wkfl_settings_template

class Workflow(Folder):
    r'''
    Workflow object used for interacting with workflows on the file system.

    :param path: Path to the workflow.
    :type path: str

    :param new: Indicates whether the workflow is new.
    :type new: bool

    :param settings: The settings for the workflow in the following format:
             {'model': <<Path to the source model>>, 'settings': <<Settings for new Jobs>>,
             'wkfl_type': <<Type of workflow (should be values in TITLES)>>}
    :type settings: dict

    :param model: Path to the source model. Ignored if settings is provided.
    :type model: str

    :param wkfl_type: Type of workflow (should be keys in TITLES).
    :type wkfl_type: str

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    TEMPLATE_VERSION = 1
    TITLES = {
        'gillespy2': 'Ensemble Simulation', 'spatial': 'Spatial Ensemble Simulation',
        'paramereSweep': 'Parameter Sweep', 'inference': 'Model Inference'
    }
    TYPES = { 'gillespy2': '_ES', 'spatial': '_SES', 'paramereSweep': '_PS', 'inference': '_MI' }

    def __init__(self, path, new=False, settings=None, model=None, wkfl_type=None, **kwargs):
        if new and not path.endswith(".wkfl"):
            path = f"{path}.wkfl"
        super().__init__(path=path, new=new, make_unique=True, **kwargs)

        self.loaded = False
        self.model = None
        self.settings = None
        self.type = None
        self.annotation = None
        self.jobs = []
        self.settings_file = os.path.join(self.path, "settings.json")
        self.annotation_file = os.path.join(self.path, "README.md")
        if new:
            if settings is None:
                settings = {'model': model, 'settings': wkfl_settings_template, 'wkfl_type': self.TITLES[wkfl_type]}
            with open(self.settings_file, "w", encoding="utf-8") as settings_fd:
                json.dump(settings, settings_fd, sort_keys=True, indent=4)

    def __get_old_version_data(self):
        info_path = os.path.join(self.path, "info.json")
        with open(info_path, "r", encoding="utf-8") as info_fd:
            info = json.load(info_fd)
        with open(self.settings_file, "r", encoding="utf-8") as settings_fd:
            settings = json.load(settings_fd)
        data = {'annotation': info['annotation'], 'wkfl_file': f"{self.get_name()}{self.TYPES[info['type']]}.wkfl"}
        files = self._get_file_objects(
            tests=[lambda root, file_obj: file_obj.startswith('.')], full_paths=False, recursive=False
        )
        def __wkfl_status(files):
            if "COMPLETE" in files:
                return "complete"
            if "ERROR" in files:
                return "error"
            if "RUNNING" in files:
                return "running"
            return "ready"
        data['status'] = __wkfl_status(files)
        model_dst = os.path.join(self.HOME_DIRECTORY, info['source_model'])
        if data['status'] in ("running", "complete"):
            model_src = os.path.join(self.HOME_DIRECTORY, info['wkfl_model'])
            job_file = datetime.datetime.fromtimestamp(os.path.getctime(self.path)).strftime("job_%m%d%y_%H%M%S")
        else:
            job_file = None
            model_src = os.path.join(self.path, self.get_name(path=info['source_model'], with_ext=True))
        data['job_file'] = job_file
        if not os.path.exists(model_dst):
            shutil.copyfile(model_src, model_dst)
        data['settings'] = {'model': model_dst, 'settings': settings, 'wkfl_type': self.TITLES[info['type']]}
        return data

    def __load_annotation(self):
        try:
            with open(self.annotation_file, "r", encoding="utf-8") as readme_fd:
                self.annotation = readme_fd.read()
        except FileNotFoundError:
            self.annotation = ""

    def __load_jobs(self):
        pass

    def __load_settings(self):
        with open(self.settings_file, "r", encoding="utf-8") as settings_fd:
            settings = json.load(settings_fd)

        if "template_version" not in settings['settings']:
            settings['settings']['template_version'] = 0
        wkfl_settings_template.update(settings['settings'])

        self.model = settings['model']
        self.settings = wkfl_settings_template
        self.type = settings['type']
        self.__update_settings_to_current()

    def __update_settings_to_current(self):
        if self.settings['template_version'] == self.TEMPLATE_VERSION:
            return

        parameters = []
        if "parameters" not in self.settings['parameterSweepSettings']:
            if "paramID" in self.settings['parameterSweepSettings']['parameterOne']:
                parameters.append({
                    "paramID": self.settings['parameterOne']['paramID'],
                    "min": self.settings['parameterSweepSettings']['p1Min'],
                    "max": self.settings['parameterSweepSettings']['p1Max'],
                    "name": self.settings['parameterSweepSettings']['parameterOne']['name'],
                    "steps": self.settings['parameterSweepSettings']['p1Steps'],
                    "hasChangedRanged": False
                })
            if "paramID" in self.settings['parameterSweepSettings']['parameterTwo']:
                parameters.append({
                    "paramID": self.settings['parameterSweepSettings']['parameterTwo']['paramID'],
                    "min": self.settings['parameterSweepSettings']['p2Min'],
                    "max": self.settings['parameterSweepSettings']['p2Max'],
                    "name": self.settings['parameterSweepSettings']['parameterTwo']['name'],
                    "steps": self.settings['parameterSweepSettings']['p2Steps'],
                    "hasChangedRanged": False
                })
            soi = self.settings['parameterSweepSettings']['speciesOfInterest']
            self.settings['parameterSweepSettings'] = {
                "speciesOfInterest": soi, "parameters": parameters
            }
        self.settings['template_version'] = self.TEMPLATE_VERSION

    def check_current_workflow_version(self):
        '''
        Check if the workflow is at the current version.

        :returns: True if the workflow is at the current version else False
        :rtype: bool
        '''
        files = self._get_file_objects(full_paths=False, recursive=False, tests=[
            lambda root, file_obj: file_obj.startswith('.'),
            lambda root, file_obj: file_obj in ("settings.json", "README.md")
        ])
        if len(files) > 0:
            return False
        return True

    @classmethod
    def check_workflow_version(cls, path):
        '''
        Classmethod for checking if the workflow is at the current version.

        :param path: Path to the workflow.
        :type path: str

        :returns: True if the workflow is at the current version else False
        :rtype: bool
        '''
        workflow = cls(path)
        return workflow.check_current_workflow_version()

    def load(self, for_project=True):
        '''
        Load the contents of the workflow directory.

        :param for_project: Indicates the dictionaty is intended for the project manager page.
        :type for_project: bool
        '''
        if not self.check_current_workflow_version():
            self.update_workflow_to_current()

        self.__load_settings()
        self.__load_annotation()
        if not for_project:
            self.__load_jobs()

    def to_dict(self, for_project=True):
        '''
        Update and return the workflow dictionary thats compatable with the stochss pages.

        :param for_project: Indicates the dictionaty is intended for the project manager page.
        :type for_project: bool

        :returns: The dictionary representation of the notebook workflow.
        :rtype: dict
        '''
        if not self.loaded:
            self.load(for_project=for_project)

        workflow = {
            'directory': self.get_sanitized_path(),
            'name': self.get_name()
        }
        if for_project:
            workflow['annotation'] = self.annotation
            workflow['status'] = None
            workflow['type'] = self.type
            return workflow
        return workflow

    def update_workflow_to_current(self):
        '''
        Update the workflow to the current version and return old data.

        :returns: Data needed for a project to reformat.
        :rtype: dict
        '''
        dirname = self.get_dirname()
        data = self.__get_old_version_data()
        if data['status'] == "ready":
            shutil.rmtree(self.path)
            new_workflow = Workflow(path=os.path.join(dirname, data['wkfl_file']), settings=data['settings'])
        else:
            _ = self.rename(data['job_file'])
            new_workflow = Workflow(path=os.path.join(dirname, data['wkfl_file']), settings=data['settings'])
            self.move(os.path.join(new_workflow.path, self.get_name(with_ext=True)))
        with open(new_workflow.annotation_file, "w", encoding="utf-8") as readme_fd:
            readme_fd.write(data['annotation'])
        return new_workflow.get_name(path=data['settings']['model']), new_workflow

    @classmethod
    def update_to_current(cls, path):
        '''
        Classmethod for updating the workflow to the current format.

        :param path: Path to the workflow.
        :type path: str

        :returns: Data needed for a project to reformat.
        :rtype: dict
        '''
        workflow = cls(path)
        return workflow.update_workflow_to_current()
