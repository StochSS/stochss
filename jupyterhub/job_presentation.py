'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
import pickle
import logging
import tempfile
import traceback

from pathlib import Path

import numpy
import plotly

from presentation_base import StochSSBase, get_presentation_from_user
from presentation_error import StochSSJobResultsError, StochSSFileNotFoundError, report_error, \
                               PlotNotAvailableError, StochSSAPIError

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class JobAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for getting job presentations from user containers.
    ################################################################################################
    '''
    async def get(self):
        '''
        Load the job presentation from User's presentations directory.

        Attributes
        ----------
        '''
        owner = self.get_query_argument(name="owner")
        log.debug("Container id of the owner: %s", owner)
        file = self.get_query_argument(name="file")
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/json')
        try:
            path = os.path.join("/tmp/presentation_cache", file)
            if os.path.exists(path):
                job = StochSSJob(path=path).load()
            else:
                job = get_presentation_from_user(owner=owner, file=file, kwargs={"file": file},
                                                 process_func=process_job_presentation)
            log.debug("Contents of the json file: %s", job)
            self.write(job)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


class DownJobPresentationAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for downloading job presentations from user containers.
    ################################################################################################
    '''
    async def get(self, owner, file):
        '''
        Download the job presentation from User's presentations directory.

        Attributes
        ----------
        '''
        log.debug("Container id of the owner: %s", owner)
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/zip')
        job, name = get_presentation_from_user(owner=owner, file=file,
                                               kwargs={"for_download": True},
                                               process_func=process_job_presentation)
        self.set_header('Content-Disposition', f'attachment; filename="{name}.zip"')
        self.write(job)
        self.finish()


class PlotJobResultsAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for getting result plots based on plot type.
    ################################################################################################
    '''
    async def get(self):
        '''
        Retrieve a plot figure of the job results based on the plot type in the request body.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", path)
        body = json.loads(self.get_query_argument(name='data'))
        log.debug("Plot args passed to the plot: %s", body)
        try:
            job = StochSSJob(path=path)
            if body['sim_type'] in  ("GillesPy2", "GillesPy2_PS"):
                fig = job.get_plot_from_results(data_keys=body['data_keys'],
                                                plt_key=body['plt_key'])
                job.print_logs(log)
            else:
                fig = job.get_psweep_plot_from_results(fixed=body['data_keys'],
                                                       kwargs=body['plt_key'])
                job.print_logs(log)
            if "plt_data" in body.keys():
                fig = job.update_fig_layout(fig=fig, plt_data=body['plt_data'])
            log.debug("Plot figure: %s", fig)
            self.write(fig)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DownloadCSVAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for getting result plots based on plot type.
    ################################################################################################
    '''
    async def get(self):
        '''
        Retrieve a plot figure of the job results based on the plot type in the request body.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", path)
        body = json.loads(self.get_query_argument(name='data'))
        log.debug("Plot args passed to the plot: %s", body)
        try:
            job = StochSSJob(path=path)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


def process_job_presentation(path, file=None, for_download=False):
    '''
    Get the job presentation data from the file.

    Attributes
    ----------
    path : str
        Path to the job presentation file.
    for_download : bool
        Whether or not the job presentation is being downloaded.
    '''
    with open(path, "rb") as job_file:
        job = pickle.load(job_file)
        job['job']['name'] = job['name']
    if not for_download:
        dirname = "/tmp/presentation_cache"
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        job_dir = os.path.join(dirname, file)
        job['job']['directory'] = job_dir
        os.mkdir(job_dir)
        with open(os.path.join(job_dir, "job.json"), "w") as job_file:
            json.dump(job['job'], job_file, sort_keys=True, indent=4)
        with open(os.path.join(job_dir, "results.p"), "wb") as res_file:
            pickle.dump(job['results'], res_file)
        return job['job']
    job_zip = make_zip_for_download(job)
    return job_zip, job['name']


def make_zip_for_download(job):
    '''
    Make an editable job for users to download.

    Attributes
    ----------
    job : dict
        StochSS job presentation
    '''
    tmp_dir = tempfile.TemporaryDirectory()
    res_path = os.path.join(tmp_dir.name, job['name'],
                            '/'.join(job['job']['directory'].split('/')[2:]), "results")
    Path(res_path).mkdir(parents=True)
    with open(os.path.join(res_path, "results.p"), "wb") as res_file:
        pickle.dump(job['results'], res_file)
    job_path = os.path.dirname(res_path)
    Path(os.path.join(job_path, "RUNNING")).touch()
    Path(os.path.join(job_path, "COMPLETE")).touch()
    write_json(path=os.path.join(job_path, "settings.json"), body=job['job']['settings'])
    write_json(path=os.path.join(job_path, job['job']['mdlPath'].split('/').pop()),
               body=job['job']['model'])
    info = {"annotation": "", "wkfl_model": job['job']['mdlPath'].split('/').pop(),
            "start_time": job['job']['startTime'], "type": job['job']['type'],
            "source_model": os.path.join(job['name'], job['job']['mdlPath'].split('/').pop())}
    write_json(path=os.path.join(job_path, "info.json"), body=info)
    if "No logs" in job['job']['logs']:
        Path(os.path.join(job_path, "logs.txt")).touch()
    else:
        with open(os.path.join(job_path, "logs.txt"), "w") as logs_file:
            logs_file.write(job['job']['logs'])
    wkfl_path = os.path.dirname(job_path)
    settings = {"model": info['source_model'], "settings": job['job']['settings'],
                "type": job['job']['titleType']}
    write_json(path=os.path.join(wkfl_path, "settings.json"), body=settings)
    write_json(path=os.path.join(os.path.dirname(wkfl_path),
                                 job['job']['mdlPath'].split('/').pop()), body=job['job']['model'])
    zip_path = os.path.join(tmp_dir.name, job['name'])
    shutil.make_archive(zip_path, "zip", tmp_dir.name, job['name'])
    with open(f"{zip_path}.zip", "rb") as zip_file:
        return zip_file.read()


def write_json(path, body):
    '''
    Write a json file to disc.

    Attributes
    ----------
    path : str
        Path to the file.
    body : dict
        Contents of the file.
    '''
    with open(path, "w") as file:
        json.dump(body, file, sort_keys=True, indent=4)


class StochSSJob(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, path):
        '''
        Intitialize a job object

        Attributes
        ----------
        path : str
            Path to the job presentation.
        '''
        super().__init__(path=path)


    def __get_filtered_1d_results(self, f_keys):
        results = self.__get_pickled_results()
        f_results = []
        for key, result in results.items():
            if self.__is_result_valid(f_keys, key):
                f_results.append(result)
        return f_results


    def __get_filtered_2d_results(self, f_keys, param):
        results = self.__get_pickled_results()
        f_results = []
        for value in param['range']:
            p_key = f"{param['name']}:{value}"
            p_results = []
            for key, result in results.items():
                if p_key in key.split(',') and self.__is_result_valid(f_keys, key):
                    p_results.append(result)
            f_results.append(p_results)
        return f_results


    @classmethod
    def __get_fixed_keys_and_dims(cls, settings, fixed):
        p_len = len(settings['parameterSweepSettings']['parameters'])
        dims = p_len - len(fixed.keys())
        if dims <= 0:
            message = "Too many fixed parameters were provided."
            message += "At least one variable parameter is required."
            raise StochSSJobResultsError(message)
        if dims > 2:
            message = "Not enough fixed parameters were provided."
            message += "Variable parameters cannot exceed 2."
            raise StochSSJobResultsError(message)
        f_keys = [f"{name}:{value}" for name, value in fixed.items()]
        return dims, f_keys


    def __get_pickled_results(self):
        path = os.path.join(self.path, "results.p")
        with open(path, "rb") as results_file:
            return pickle.load(results_file)


    @classmethod
    def __is_result_valid(cls, f_keys, key):
        for f_key in f_keys:
            if f_key not in key.split(','):
                return False
        return True


    def load(self):
        '''
        Loads a job presentation from cache

        Attributes
        ----------
        '''
        with open(os.path.join(self.path, "job.json"), "r") as job_file:
            return json.load(job_file)


    def get_plot_from_results(self, data_keys, plt_key, add_config=False):
        '''
        Get the plotly figure for the results of a job

        Attributes
        ----------
        data_keys : dict
            Dictionary of param names and values used to identify the correct data.
        plt_key : str
            Type of plot to generate.
        '''
        self.log("debug", f"Key identifying the plot to generate: {plt_key}")
        try:
            self.log("info", "Loading the results...")
            result = self.__get_pickled_results()
            if data_keys:
                key = [f"{name}:{value}" for name, value in data_keys.items()]
                key = ','.join(key)
                result = result[key]
            self.log("info", "Generating the plot...")
            if plt_key == "mltplplt":
                fig = result.plotplotly(return_plotly_figure=True, multiple_graphs=True)
            elif plt_key == "stddevran":
                fig = result.plotplotly_std_dev_range(return_plotly_figure=True)
            else:
                if plt_key == "stddev":
                    result = result.stddev_ensemble()
                elif plt_key == "avg":
                    result = result.average_ensemble()
                fig = result.plotplotly(return_plotly_figure=True)
            if add_config and plt_key != "mltplplt":
                fig["config"] = {"responsive":True}
            self.log("info", "Loading the plot...")
            return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))
        except FileNotFoundError as err:
            message = f"Could not find the results pickle file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except KeyError as err:
            message = f"The requested plot is not available: {str(err)}"
            raise PlotNotAvailableError(message, traceback.format_exc()) from err


    def get_psweep_plot_from_results(self, fixed, kwargs, add_config=False):
        '''
        Generate and return the parameter sweep plot form the time series results.

        Attributes
        ----------
        fixed : dict
            Dictionary for parameters that remain at a fixed value.
        kwarps : dict
            Dictionary of keys used for post proccessing the results.
        '''
        self.log("debug", f"Key identifying the plot to generate: {kwargs}")
        settings = self.load()['settings']
        try:
            self.log("info", "Loading the results...")
            dims, f_keys = self.__get_fixed_keys_and_dims(settings, fixed)
            params = list(filter(lambda param: param['name'] not in fixed.keys(),
                                 settings['parameterSweepSettings']['parameters']))
            if dims == 1:
                kwargs['param'] = params[0]
                kwargs['results'] = self.__get_filtered_1d_results(f_keys)
                self.log("info", "Generating the plot...")
                fig = ParameterSweep1D.plot(**kwargs)
            else:
                kwargs['params'] = params
                kwargs['results'] = self.__get_filtered_2d_results(f_keys, params[0])
                self.log("info", "Generating the plot...")
                fig = ParameterSweep2D.plot(**kwargs)
            if add_config:
                fig['config'] = {"responsive": True}
            self.log("info", "Loading the plot...")
            return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))
        except FileNotFoundError as err:
            message = f"Could not find the results pickle file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except KeyError as err:
            message = f"The requested plot is not available: {str(err)}"
            raise PlotNotAvailableError(message, traceback.format_exc()) from err


    def update_fig_layout(self, fig=None, plt_data=None):
        '''
        Update the figure layout.

        Attributes
        ----------
        fig : dict
            Plotly figure to be updated
        plt_data : dict
            Title and axes data for the plot
        '''
        self.log("debug", f"Title and axis data for the plot: {plt_data}")
        try:
            if plt_data is None:
                return fig
            for key in plt_data.keys():
                if key == "title":
                    fig['layout']['title']['text'] = plt_data[key]
                else:
                    fig['layout'][key]['title']['text'] = plt_data[key]
            return fig
        except KeyError as err:
            message = f"The requested plot is not available: {str(err)}"
            raise PlotNotAvailableError(message, traceback.format_exc()) from err


class ParameterSweep1D():
    '''
    ################################################################################################
    StochSS 1D parameter sweep job object
    ################################################################################################
    '''

    @classmethod
    def plot(cls, results, species, param, mapper="final", reducer="avg"):
        '''
        Plot the results with error bar from time series results.

        Attributes
        ----------
        results : list
            List of GillesPy2 results objects.
        species : str
            Species of interest name.
        param : dict
            StochSS sweep parameter dictionary.
        mapper : str
            Key indicating the feature extraction function to use.
        reducer : str
            Key indicating the ensemble aggragation function to use.
        '''
        func_map = {"min": numpy.min, "max": numpy.max, "avg": numpy.mean,
                    "var": numpy.var, "final": lambda res: res[-1]}
        map_results = [[func_map[mapper](traj[species]) for traj in result] for result in results]
        if len(map_results[0]) > 1:
            data = [[func_map[reducer](map_result),
                     numpy.std(map_result)] for map_result in map_results]
            visible = True
        else:
            data = [[map_result[0], 0] for map_result in map_results]
            visible = False
        data = numpy.array(data)

        error_y = dict(type="data", array=data[:, 1], visible=visible)
        trace_list = [plotly.graph_objs.Scatter(x=param['range'],
                                                y=data[:, 0], error_y=error_y)]

        title = f"<b>Parameter Sweep - Variable: {species}</b>"
        layout = plotly.graph_objs.Layout(title=dict(text=title, x=0.5),
                                          xaxis=dict(title=f"<b>{param['name']}</b>"),
                                          yaxis=dict(title="<b>Population</b>"))

        fig = dict(data=trace_list, layout=layout)
        return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))


class ParameterSweep2D():
    '''
    ################################################################################################
    StochSS 2D parameter sweep job object
    ################################################################################################
    '''

    @classmethod
    def plot(cls, results, species, params, mapper="final", reducer="avg"):
        '''
        Plot the results with error bar from time series results.

        Attributes
        ----------
        results : list
            List of GillesPy2 results objects.
        species : str
            Species of interest name.
        params : list
            List of StochSS sweep parameter dictionaries.
        mapper : str
            Key indicating the feature extraction function to use.
        reducer : str
            Key indicating the ensemble aggragation function to use.
        '''
        func_map = {"min": numpy.min, "max": numpy.max, "avg": numpy.mean,
                    "var": numpy.var, "final": lambda res: res[-1]}
        data = []
        for p_results in results:
            map_results = [[func_map[mapper](traj[species]) for traj in result]
                            for result in p_results]
            if len(map_results[0]) > 1:
                red_results = [func_map[reducer](map_result) for map_result in map_results]
            else:
                red_results = [map_result[0] for map_result in map_results]
            data.append(red_results)
        data = numpy.array(data)

        trace_list = [plotly.graph_objs.Heatmap(z=data, x=params[0]['range'],
                                                y=params[1]['range'])]

        title = f"<b>Parameter Sweep - Variable: {species}</b>"
        layout = plotly.graph_objs.Layout(title=dict(text=title, x=0.5),
                                          xaxis=dict(title=f"<b>{params[0]['name']}</b>"),
                                          yaxis=dict(title=f"<b>{params[1]['name']}</b>"))
        fig = dict(data=trace_list, layout=layout)
        return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))
