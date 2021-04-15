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
from .stochss_folder import StochSSFolder
from .stochss_model import StochSSModel
from .stochss_spatial_model import StochSSSpatialModel
from .stochss_errors import StochSSJobError, StochSSJobNotCompleteError, \
                            StochSSFileNotFoundError, StochSSFileExistsError, \
                            FileNotJSONFormatError, PlotNotAvailableError

class StochSSJob(StochSSBase):
    '''
    ################################################################################################
    StochSS job object
    ################################################################################################
    '''

    TYPES = {"gillespy":"_ES", "parameterSweep":"_PS"}
    TITLES = {"gillespy":"Ensemble Simulation", "parameterSweep":"Parameter Sweep"}

    def __init__(self, path, new=False, data=None):
        '''
        Intitialize a job object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the job
        new : bool
            Indicates whether or not the job is new
        data : dict
            Load data needed for loading a job
        '''
        super().__init__(path=path)
        self.job = {}
        self.type = None
        self.time_stamp = None
        if data is not None:
            self.type = data['type']
            self.time_stamp = data['stamp'] if new else self.get_time_stamp()
        if new:
            file = f"{self.get_name()}{self.TYPES[self.type]}{self.time_stamp}.wkfl"
            self.path = file if data['dirname'] is None else os.path.join(data['dirname'], file)
            settings = data['settings'] if "settings" in data.keys() else None
            self.__create_new_job(mdl_path=path, settings=settings)


    def __create_new_job(self, mdl_path, settings=None):
        path = self.get_path(full=True)
        try:
            if not os.path.exists(self.get_dir_name(full=True)):
                os.makedirs(path)
            else:
                os.mkdir(path)
            os.mkdir(self.get_results_path(full=True))
            info = {"source_model":mdl_path, "wkfl_model":None, "type":self.type, "start_time":None}
            self.update_info(new_info=info, new=True)
            open(os.path.join(path, "logs.txt"), "w").close()
            shutil.copyfile(os.path.join(self.user_dir, mdl_path),
                            self.get_model_path(full=True))
            if settings is None:
                self.__create_settings()
            else:
                with open(self.__get_settings_path(full=True), "w") as settings_file:
                    json.dump(settings, settings_file)
        except FileExistsError as err:
            message = f"Could not create your job: {str(err)}"
            raise StochSSFileExistsError(message, traceback.format_exc()) from err
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def __create_settings(self):
        if self.type == "parameterSweep":
            settings = self.get_settings_template()
            settings['simulationSettings']['realizations'] = 20
            with open(self.__get_settings_path(full=True), "w") as file:
                json.dump(settings, file, indent=4, sort_keys=True)
        else:
            shutil.copyfile('/stochss/stochss_templates/workflowSettingsTemplate.json',
                            self.__get_settings_path(full=True))


    def __get_settings_path(self, full=False):
        return os.path.join(self.get_path(full=full), "settings.json")


    def __get_extract_dst_path(self, mdl_file):
        if ".proj" not in self.path:
            wkfl_dirname = os.path.dirname(self.path.replace(self.path.partition(".wkfl")[2], ""))
            return os.path.join(wkfl_dirname, mdl_file)
        proj_path = self.path.replace(self.path.partition(".proj")[2], "")
        if "WorkflowGroup1.wkgp" in self.path:
            return os.path.join(proj_path, mdl_file)
        wkgp_path = self.path.replace(self.path.partition(".wkgp")[2], "")
        has_mdl = len(list(filter(lambda file: file.endswith(".mdl"), os.listdir(wkgp_path)))) > 0
        if has_mdl:
            wkgp_file = f"{self.get_name(path=mdl_file)}.wkgp"
            path, changed = self.get_unique_path(name=wkgp_file, dirname=proj_path)
            if changed:
                mdl_file = f"{self.get_name(path=path)}.{mdl_file.split('.').pop()}"
            return os.path.join(path, mdl_file)
        wkgp_name = self.get_name(path=wkgp_path)
        if wkgp_name != self.get_name(path=mdl_file):
            mdl_file = f"{wkgp_name}.{mdl_file.split('.').pop()}"
        return os.path.join(wkgp_path, mdl_file)


    def __is_csv_dir(self, file):
        if "results_csv" not in file:
            return False
        path = os.path.join(file, self.get_results_path())
        if not os.path.isdir(path):
            return False
        return True


    def duplicate_as_new(self, stamp):
        '''
        Get all data needed to create a new job that
        is a copy of this job in ready state.

        Attributes
        ----------
        '''
        wkfl = self.load()
        if wkfl['status'] != "ready":
            mdl_path = self.get_model_path(external=True)
        else:
            mdl_path = wkfl['mdlPath']
        data = {"type":self.type, "stamp":stamp,
                "dirname":self.get_dir_name(), "settings":wkfl['settings']}
        kwargs = {"path":self.get_model_path(), "new":True, "data":data}
        resp = {"message":f"A new job has been created from {self.path}",
                "mdlPath":mdl_path,
                "mdl_file":self.get_file(path=mdl_path)}
        return resp, kwargs


    def extract_model(self):
        '''
        Get all data needed to create a new model that is a copy of the jobs model

        Attributes
        ----------
        '''
        src_path = self.get_model_path()
        model = StochSSModel(path=src_path).load()
        dst_path = self.__get_extract_dst_path(mdl_file=self.get_file(path=src_path))
        kwargs = {"path":dst_path, "new":True, "model":model}
        resp = {"message":f"A copy of the model in {self.path} has been created"}
        return resp, kwargs


    def generate_csv_zip(self):
        '''
        Create a zip archive of the csv results for download

        Atrributes
        ----------
        '''
        status = self.get_status()
        if status == "error":
            message = f"The job experienced an error during run: {status}"
            raise StochSSJobError(message, traceback.format_exc())
        if status != "complete":
            message = f"The job has not finished running: {status}."
            raise StochSSJobNotCompleteError(message, traceback.format_exc())

        csv_path = self.get_csv_path(full=True)
        if os.path.exists(csv_path + ".zip"):
            message = f"{csv_path}.zip already exists."
            return {"Message":message, "Path":csv_path.replace(self.user_dir+"/", "") + ".zip"}
        csv_folder = StochSSFolder(path=csv_path)
        return csv_folder.generate_zip_file()


    def get_csv_path(self, full=False):
        '''
        Return the path to the csv directory

        Attributes
        ----------
        '''
        res_path = self.get_results_path(full=full)
        if not os.path.exists(res_path):
            message = f"Could not find the results directory: {res_path}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())

        try:
            res_files = os.listdir(res_path)
            csv_path = list(filter(lambda file: self.__is_csv_dir(file=file), res_files))[0]
            return os.path.join(res_path, csv_path)
        except IndexError as err:
            message = f"Could not find the job results csv directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def get_info_path(self, full=False):
        '''
        Return the path to the info.json file

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        return os.path.join(self.get_path(full=full), "info.json")


    def get_model_path(self, full=False, external=False):
        '''
        Return the path to the model file

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        external : bool
            Indicates whether or not to consider the path to the internal model
        '''
        info = self.load_info()
        self.log("debug", f"Job info: {info}")
        if external:
            if '.proj' not in self.path:
                return info['source_model']
            file = self.get_file(path=info['source_model'])
            proj_path = f"{self.path.split('.proj')[0]}.proj"
            if self.check_project_format(path=proj_path):
                return os.path.join(self.get_dir_name(), file)
            return os.path.join(proj_path, file)
        if info['wkfl_model'] is None:
            file = self.get_file(path=info['source_model'])
            return os.path.join(self.get_path(full=full), file)
        file = self.get_file(path=info['wkfl_model'])
        return os.path.join(self.get_path(full=full), file)


    def get_notebook_data(self):
        '''
        Get the needed data for converting to notebook

        Attributes
        ----------
        '''
        info = self.load_info()
        file = f"{self.get_name()}.ipynb"
        path = os.path.join(self.get_dir_name(), file)
        g_model, s_model = self.load_models()
        settings = self.load_settings()
        if info['type'] == "gillespy":
            wkfl_type = info['type']
        elif info['type'] == "parameterSweep" and settings['parameterSweepSettings']['is1D']:
            wkfl_type = "1d_parameter_sweep"
        else:
            wkfl_type = "2d_parameter_sweep"
        kwargs = {"path":path, "new":True, "settings":settings,
                  "models":{"s_model":s_model, "model":g_model}}
        return {"kwargs":kwargs, "type":wkfl_type}


    def get_results_path(self, full=False):
        '''
        Return the path to the results directory

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        return os.path.join(self.get_path(full=full), "results")


    def get_results_plot(self, plt_key, plt_data):
        '''
        Get the plotly figure for the results of a job

        Attributes
        ----------
        plt_key : str
            Indentifier for the requested plot figure
        plt_data : dict
            Title and axes data for the plot
        '''
        self.log("debug", f"Key identifying the requested plot: {plt_key}")
        self.log("debug", f"Title and axis data for the plot: {plt_data}")
        path = os.path.join(self.get_results_path(full=True), "plots.json")
        self.log("debug", f"Path to the job result plot file: {path}")
        try:
            with open(path, "r") as plot_file:
                fig = json.load(plot_file)[plt_key]
            if plt_data is None:
                return fig
            for key in plt_data.keys():
                if key == "title":
                    fig['layout']['title']['text'] = plt_data[key]
                else:
                    fig['layout'][key]['title']['text'] = plt_data[key]
            return fig
        except FileNotFoundError as err:
            message = f"Could not find the plots file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The plots file is not JSON decodable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err
        except KeyError as err:
            message = f"The requested plot is not available: {str(err)}"
            raise PlotNotAvailableError(message, traceback.format_exc()) from err


    def get_run_logs(self):
        '''
        Return the contents of the log file'

        Attributes
        ----------
        '''
        path = os.path.join(self.get_path(full=True), "logs.txt")
        try:
            with open(path, "r") as file:
                logs = file.read()
            self.log("debug", f"Contents of the log file: {logs}")
            if logs:
                return logs
            return "No logs were recoded for this job."
        except FileNotFoundError as err:
            message = f"Could not find the log file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    @classmethod
    def get_run_settings(cls, settings, solver_map):
        '''
        Get the gillespy2 run settings for model.run()

        Attributes
        ----------
        settings : dict
            StochSS simulation settings dict
        need_variable_ssa : bool
            Indicates whether or not the VariableSSACSolver is needed
        '''
        settings = settings['simulationSettings']
        kwargs = {"solver":solver_map[settings['algorithm']]}
        if settings['algorithm'] in ("ODE", "Hybrid-Tau-Leaping"):
            integrator_options = {"atol":settings['absoluteTol'], "rtol":settings['relativeTol']}
            kwargs["integrator_options"] = integrator_options
        if settings['algorithm'] == "ODE":
            return kwargs
        kwargs["number_of_trajectories"] = settings['realizations']
        if settings['seed'] != -1:
            kwargs['seed'] = settings['seed']
        if settings['algorithm'] == "SSA":
            return kwargs
        kwargs['tau_tol'] = settings['tauTol']
        return kwargs


    def get_time_stamp(self):
        '''
        Get the time stamp from the job name

        Attributes
        ----------
        '''
        name = self.get_name()
        time_stamp = "_"+"_".join(name.split('_')[-2:])
        if time_stamp.replace('_', '').isdigit():
            return time_stamp
        return None


    def load(self, new=False):
        '''
        Reads in all relavent data for a job and stores it in self.job.

        Attributes
        ----------
        '''
        error = None
        info = self.load_info()
        self.type = info['type']
        status = "new" if new else self.get_status()
        if status in ("new", "ready"):
            if ".proj" in self.path:
                mdl_dirname = self.get_dir_name()
                if "WorkflowGroup1" in self.path:
                    mdl_dirname = os.path.dirname(mdl_dirname)
                mdl_path = os.path.join(mdl_dirname, self.get_file(path=info['source_model']))
            else:
                mdl_path = info['source_model']
        else:
            mdl_path = self.get_model_path()
        try:
            model = StochSSModel(path=mdl_path).load()
        except StochSSFileNotFoundError as err:
            model = None
            error = {"Reason":err.reason, "Message":err.message, "traceback":err.traceback}
            self.log("error", f"Exception information: {error}")
        finally:
            settings = self.load_settings(model=model)
            self.job = {"mdlPath":mdl_path, "model":model, "settings":settings,
                        "startTime":info['start_time'], "status":status,
                        "timeStamp":self.time_stamp, "titleType":self.TITLES[info['type']],
                        "type":self.type, "wkflDir":self.get_file(),
                        "wkflName":self.get_name(), "wkflParPath":self.get_dir_name()}
            if error is not None:
                self.job['error'] = error
        return self.job


    def load_info(self):
        '''
        Reads the jobs load function

        Attributes
        ----------
        '''
        try:
            path = self.get_info_path(full=True)
            self.log("debug", f"The path to the job's info file: {path}")
            with open(path, "r") as info_file:
                info = json.load(info_file)
                if "annotation" not in info:
                    info['annotation'] = ""
                return info
        except FileNotFoundError as err:
            message = f"Could not find the info file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The info file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    def load_models(self):
        '''
        Load GillesPy2 and StochSS models for running

        Atrributes
        ----------
        '''
        path = self.get_model_path()
        if path.endswith('.mdl'):
            model_obj = StochSSModel(path=path)
            model = model_obj.convert_to_gillespy2()
        else:
            model_obj = StochSSSpatialModel(path=path)
            model = model_obj.convert_to_spatialpy()
        return model, model_obj.model


    def load_settings(self, model=None):
        '''
        Load the job settings from the settings file

        Attributes
        ----------
        model : dict
            Stochss model dict (used to backwards compatability)
        '''
        try:
            path = self.__get_settings_path(full=True)
            with open(path, "r") as settings_file:
                return json.load(settings_file)
        except FileNotFoundError as err:
            if model is None:
                message = f"Could not find the settings file: {str(err)}"
                raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
            settings = self.get_settings_template()
            if "simulationSettings" in model.keys():
                settings['simulationSettings'] = model['simulationSettings']
            elif self.type == "parameterSweep":
                settings['simulationSettings']['realizations'] = 20
            if "parameterSweepSettings" in model.keys():
                settings['parameterSweepSettings'] = model['parameterSweepSettings']
            return settings
        except json.decoder.JSONDecodeError as err:
            message = f"The settings file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    def save(self, mdl_path, settings, initialize):
        '''
        Save the data for a new or ready state job

        Attributes
        ----------
        '''
        path = self.get_model_path(full=True)
        new_info = {"source_model":mdl_path}
        if initialize:
            # If this format is not something Javascript's Date.parse() method
            # understands then the job status page will be unable to correctly create a
            # Date object from the datestring parsed from the job's info.json file
            new_info['start_time'] = datetime.datetime.now().strftime("%b %d, %Y  %I:%M %p UTC")
            new_info['wkfl_model'] = self.get_file(path=mdl_path)
            open(os.path.join(self.path, 'RUNNING'), 'w').close()
        self.update_info(new_info=new_info)
        with open(self.__get_settings_path(full=True), "w") as file:
            json.dump(settings, file, indent=4, sort_keys=True)
        try:
            os.remove(path)
            shutil.copyfile(os.path.join(self.user_dir, mdl_path),
                            self.get_model_path(full=True))
            return f"Successfully saved the job: {self.path}"
        except FileNotFoundError as err:
            message = f"Could not find the model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def save_plot(self, plot):
        '''
        Save a plot to the output settings (for projects only)

        Attributes
        ----------
        plot : dict
            plot data used needed to look up the plot
        '''
        settings = self.load_settings()
        self.log("debug", f"Original settings: {settings}")
        settings['resultsSettings']['outputs'].append(plot)
        self.log("debug", f"New settings: {settings}")
        with open(self.__get_settings_path(full=True), "w") as settings_file:
            json.dump(settings, settings_file, indent=4, sort_keys=True)
        return {"message":"The plot was successfully saved", "data":plot}


    def update_info(self, new_info, new=False):
        '''
        Updates the contents of the info file. If source model is updated,
        checks if the model exists at that path

        Attributes
        ----------
        new_info : dict
            Contains all data to be updated under the correct key
        new : bool
            Indicates whether or not an info file needs to be created
        '''
        if new:
            info = new_info
        else:
            info = self.load_info()
            if "source_model" in new_info.keys():
                info['source_model'] = new_info['source_model']
            if "wkfl_model" in new_info.keys():
                info['wkfl_model'] = new_info['wkfl_model']
            if "type" in new_info.keys():
                info['type'] = new_info['type']
            if "start_time" in new_info.keys():
                info['start_time'] = new_info['start_time']
            if "annotation" in new_info.keys():
                info['annotation'] = new_info['annotation']
        self.log("debug", f"New info: {info}")
        with open(self.get_info_path(full=True), "w") as file:
            json.dump(info, file, indent=4, sort_keys=True)
