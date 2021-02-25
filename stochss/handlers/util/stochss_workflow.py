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
from .stochss_errors import StochSSWorkflowError, StochSSWorkflowNotCompleteError, \
                            StochSSFileNotFoundError, StochSSFileExistsError, \
                            FileNotJSONFormatError, PlotNotAvailableError

class StochSSWorkflow(StochSSBase):
    '''
    ################################################################################################
    StochSS workflow object
    ################################################################################################
    '''

    TYPES = {"gillespy":"_ES", "parameterSweep":"_PS"}
    TITLES = {"gillespy":"Ensemble Simulation", "parameterSweep":"Parameter Sweep"}

    def __init__(self, path, new=False, data=None):
        '''
        Intitialize a workflow object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the workflow
        new : bool
            Indicates whether or not the workflow is new
        data : dict
            Load data needed for loading a workflow
        '''
        super().__init__(path=path)
        self.workflow = {}
        self.type = None
        self.time_stamp = None
        if data is not None:
            self.type = data['type']
            self.time_stamp = data['stamp'] if new else self.get_time_stamp()
        if new:
            file = f"{self.get_name()}{self.TYPES[self.type]}{self.time_stamp}.wkfl"
            self.path = file if data['dirname'] is None else os.path.join(data['dirname'], file)
            settings = data['settings'] if "settings" in data.keys() else None
            self.__create_new_workflow(mdl_path=path, settings=settings)


    def __create_new_workflow(self, mdl_path, settings=None):
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
        except FileExistsError as err:
            message = f"Could not create your workflow: {str(err)}"
            raise StochSSFileExistsError(message, traceback.format_exc())
        except FileNotFoundError as err:
            message = f"Could not find the file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


    def __create_settings(self):
        if self.type == "parameterSweep":
            settings = self.get_settings_template()
            settings['simulationSettings']['realizations'] = 20
            with open(self.get_settings_path(full=True), "w") as file:
                json.dump(settings, file)
        else:
            shutil.copyfile('/stochss/stochss_templates/workflowSettingsTemplate.json',
                            self.get_settings_path(full=True))


    def __is_csv_dir(self, file):
        if "results_csv" not in file:
            return False
        path = os.path.join(file, self.get_results_path())
        if not os.path.isdir(path):
            return False
        return True


    def __load_info(self):
        try:
            path = self.get_info_path(full=True)
            self.log("debug", f"The path to the workflow's info file: {path}")
            with open(path, "r") as info_file:
                return json.load(info_file)
        except FileNotFoundError as err:
            message = f"Could not find the info file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except json.decoder.JSONDecodeError as err:
            message = f"The info file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc())


    def check_for_external_model(self, path=None):
        '''
        Check if the workflows model exists outside of the workflow and return it path
        '''
        if path is None:
            path = self.get_model_path(full=True, external=True)
        self.log("debug",
                 f"Path to the workflow's model: {path}")
        resp = {"file":path.replace(self.user_dir + '/', '')}
        if not os.path.exists(path):
            file = self.get_file(path=path)
            error = f"The model file {file} could not be found.  "
            error += "To edit the model you will need to extract the model from the "
            error += "workflow or open the workflow and update the path to the model."
            resp['error'] = error
        return resp


    def duplicate_as_new(self, stamp):
        '''
        Get all data needed to create a new workflow that
        is a copy of this workflow in ready state.

        Attributes
        ----------
        '''
        wkfl = self.load()
        if wkfl['status'] != "ready":
            mdl_path = self.__load_info()['source_model']
        else:
            mdl_path = wkfl['mdlPath']
        data = {"type":self.type, "stamp":stamp,
                "dirname":self.get_dir_name(), "settings":wkfl['settings']}
        kwargs = {"path":self.get_model_path(), "new":True, "data":data}
        resp = {"message":f"A new workflow has been created from {self.path}",
                "mdlPath":mdl_path,
                "mdl_file":self.get_file(path=mdl_path)}
        c_resp = self.check_for_external_model(path=os.path.join(self.user_dir, mdl_path))
        if "error" in c_resp.keys():
            resp['error'] = c_resp['error']
        return resp, kwargs


    def extract_model(self):
        '''
        Get all data needed to create a new model that is a copy of the workflows model

        Attributes
        ----------
        '''
        src_path = self.get_model_path()
        model = StochSSModel(path=src_path).load()
        file = self.get_file(path=src_path)
        dst_dirname = self.get_dir_name()
        if ".proj" in dst_dirname:
            dst_dirname = os.path.dirname(dst_dirname)
        dst_path = os.path.join(dst_dirname, file)
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
            message = f"The workflow experienced an error during run: {status}"
            raise StochSSWorkflowError(message, traceback.format_exc())
        if status != "complete":
            message = f"The workflow has not finished running: {status}."
            raise StochSSWorkflowNotCompleteError(message, traceback.format_exc())

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
            message = f"Could not find the workflow results csv directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


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
        info = self.__load_info()
        self.log("debug", f"Workflow info: {info}")
        if external or info['wkfl_model'] is None:
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
        info = self.__load_info()
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
                  "models":{"s_model":s_model, "g_model":g_model}}
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
        Get the plotly figure for the results of a workflow

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
        self.log("debug", f"Path to the workflow result plot file: {path}")
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
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except json.decoder.JSONDecodeError as err:
            message = f"The plots file is not JSON decodable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc())
        except KeyError as err:
            message = f"The requested plot is not available: {str(err)}"
            raise PlotNotAvailableError(message, traceback.format_exc())


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
            return "No logs were recoded for this workflow."
        except FileNotFoundError as err:
            message = f"Could not find the log file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


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


    def get_settings_path(self, full=False):
        '''
        Return the path to the settings.json file

        Attributes
        ----------
        full : bool
            Indicates whether or not to get the full path or local path
        '''
        return os.path.join(self.get_path(full=full), "settings.json")


    def get_time_stamp(self):
        '''
        Get the time stamp from the workflow name

        Attributes
        ----------
        '''
        name = self.get_name()
        return "_"+"_".join(name.split('_')[-2:])


    def load(self, new=False):
        '''
        Reads in all relavent data for a workflow and stores it in self.workflow.

        Attributes
        ----------
        '''
        error = None
        info = self.__load_info()
        self.type = info['type']
        status = "new" if new else self.get_status()
        if status in ("new", "ready"):
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
            self.workflow = {"mdlPath":mdl_path, "model":model, "settings":settings,
                             "startTime":info['start_time'], "status":status,
                             "timeStamp":self.time_stamp, "titleType":self.TITLES[info['type']],
                             "type":self.type, "wkflDir":self.get_file(),
                             "wkflName":self.get_name(), "wkflParPath":self.get_dir_name()}
            if error is not None:
                self.workflow['error'] = error
        return self.workflow


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
        Load the workflow settings from the settings file

        Attributes
        ----------
        model : dict
            Stochss model dict (used to backwards compatability)
        '''
        try:
            path = self.get_settings_path(full=True)
            with open(path, "r") as settings_file:
                return json.load(settings_file)
        except FileNotFoundError as err:
            if model is None:
                message = f"Could not find the settings file: {str(err)}"
                raise StochSSFileNotFoundError(message, traceback.format_exc())
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
            raise FileNotJSONFormatError(message, traceback.format_exc())


    def save(self, mdl_path, settings, initialize):
        '''
        Save the data for a new or ready state workflow

        Attributes
        ----------
        '''
        path = self.get_model_path(full=True)
        new_info = {"source_model":mdl_path}
        if initialize:
            # If this format is not something Javascript's Date.parse() method
            # understands then the workflow status page will be unable to correctly create a
            # Date object from the datestring parsed from the workflow's info.json file
            new_info['start_time'] = datetime.datetime.now().strftime("%b %d, %Y  %I:%M %p UTC")
            new_info['wkfl_model'] = self.get_file(path=mdl_path)
            open(os.path.join(self.path, 'RUNNING'), 'w').close()
        self.update_info(new_info=new_info)
        with open(self.get_settings_path(full=True), "w") as file:
            json.dump(settings, file)
        try:
            os.remove(path)
            shutil.copyfile(os.path.join(self.user_dir, mdl_path),
                            self.get_model_path(full=True))
            return f"Successfully saved the workflow: {self.path}"
        except FileNotFoundError as err:
            message = f"Could not find the model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


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
        with open(self.get_settings_path(full=True), "w") as settings_file:
            json.dump(settings, settings_file)
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
            info = self.__load_info()
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
            json.dump(info, file)
