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
import csv
import json
import pickle
import logging
import itertools

import numpy
import plotly

from gillespy2 import TauLeapingSolver, TauHybridSolver, SSACSolver, ODESolver

from .stochss_job import StochSSJob
from .parameter_sweep_1d import ParameterSweep1D
from .parameter_sweep_2d import ParameterSweep2D
from .parameter_scan import ParameterScan

log = logging.getLogger("stochss")

class NumpyEncoder(json.JSONEncoder):
    '''
    ################################################################################################
    Custom json encoder for numpy ndarrays
    ################################################################################################
    '''
    def default(self, o):
        if isinstance(o, numpy.ndarray):
            return o.tolist()
        return json.JSONEncoder.default(self, o)


class ParameterSweep(StochSSJob):
    '''
    ################################################################################################
    StochSS parameter sweep job object
    ################################################################################################
    '''

    TYPE = "parameterSweep"

    def __init__(self, path):
        '''
        Intitialize an parameter sweep job object

        Attributes
        ----------
        path : str
            Path to the parameter sweep job
        '''
        super().__init__(path=path)
        self.g_model, self.s_model = self.load_models()
        self.settings = self.load_settings()


    def __get_run_settings(self):
        solver_map = {"SSA":SSACSolver, "Tau-Leaping":TauLeapingSolver,
                      "ODE":ODESolver, "Hybrid-Tau-Leaping":TauHybridSolver}
        if self.settings['simulationSettings']['isAutomatic']:
            solver_name = self.g_model.get_best_solver().name
            kwargs = {"number_of_trajectories":1 if solver_name == "ODESolver" else 20}
            if solver_name != "SSACSolver":
                return kwargs
            kwargs['solver'] = solver_map['SSA'](model=self.g_model)
            return kwargs
        run_settings = self.get_run_settings(settings=self.settings, solver_map=solver_map)
        if run_settings['solver'].name == "SSACSolver":
            run_settings['solver'] = run_settings['solver'](model=self.g_model)
        return run_settings


    def __store_csv_results(self, wkfl):
        if "ODE" not in wkfl.settings['solver'].name and \
                            wkfl.settings['number_of_trajectories'] > 1:
            csv_keys = list(itertools.product(["min", "max", "avg", "var", "final"],
                                              ["min", "max", "avg", "var"]))
        else:
            csv_keys = [["min"], ["max"], ["avg"], ["var"], ["final"]]
        stamp = self.get_time_stamp()
        dirname = f"results/results_csv{stamp}"
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        for key in csv_keys:
            if not isinstance(key, list):
                key = list(key)
            path = os.path.join(dirname, f"{'-'.join(key)}.csv")
            with open(path, "w", newline="") as csv_file:
                csv_writer = csv.writer(csv_file)
                wkfl.to_csv(keys=key, csv_writer=csv_writer)


    @classmethod
    def __store_plots(cls, wkfl):
        mappers = ["min", "max", "avg", "var", "final"]
        if "ODE" not in wkfl.settings['solver'].name and \
                            wkfl.settings['number_of_trajectories'] > 1:
            keys = list(itertools.product(wkfl.list_of_species, mappers,
                                          ["min", "max", "avg", "var"]))
        else:
            keys = list(itertools.product(wkfl.list_of_species, mappers))
        plot_figs = {}
        for key in keys:
            key = list(key)
            trace_list = wkfl.get_plotly_traces(keys=key)
            plt_data = {'title':f"<b>Parameter Sweep - Variable: {key[0]}</b>"}
            wkfl.get_plotly_layout_data(plt_data=plt_data)
            layout = plotly.graph_objs.Layout(title=dict(text=plt_data['title'], x=0.5),
                                              xaxis=dict(title=plt_data['xaxis_label']),
                                              yaxis=dict(title=plt_data['yaxis_label']))

            fig = dict(data=trace_list, layout=layout, config={"responsive": True})
            plot_figs['-'.join(key)] = fig

        with open('results/plots.json', 'w') as plots_file:
            json.dump(plot_figs, plots_file, cls=plotly.utils.PlotlyJSONEncoder,
                      indent=4, sort_keys=True)


    def __store_results(self, wkfl):
        if not 'results' in os.listdir():
            os.mkdir('results')
        with open('results/results.p', 'wb') as results_file:
            pickle.dump(wkfl.ts_results, results_file)
        if wkfl.name != "ParameterScan":
            with open('results/results.json', 'w') as json_file:
                json.dump(wkfl.results, json_file, indent=4, sort_keys=True, cls=NumpyEncoder)
            self.__store_csv_results(wkfl)


    def configure(self):
        '''
        Get the configuration arguments for 1D or 2D parameter sweep

        Attributes
        ----------
        '''
        run_settings = self.__get_run_settings()
        if "timespanSettings" in self.settings.keys():
            keys = self.settings['timespanSettings'].keys()
            if "endSim" in keys and "timeStep" in keys:
                end = self.settings['timespanSettings']['endSim']
                step_size = self.settings['timespanSettings']['timeStep']
                self.g_model.timespan(numpy.arange(0, end, step_size))
        kwargs = {"model":self.g_model, "settings":run_settings}
        parameters = []
        for param in self.settings['parameterSweepSettings']['parameters']:
            p_range = numpy.linspace(param['min'], param['max'], param['steps'])
            parameters.append({"parameter":param['name'], "range":p_range})
        if len(parameters) > 1:
            kwargs['params'] = parameters
            return kwargs
        kwargs["param"] = parameters[0]
        return kwargs


    def run(self, verbose=True):
        '''
        Run a 1D or 2D parameter sweep job

        Attributes
        ----------
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        kwargs = self.configure()
        if "param" in kwargs.keys():
            wkfl = ParameterSweep1D(**kwargs)
            sim_type = "1D parameter sweep"
        elif len(kwargs['params']) > 2:
            sim_type = "parameter scan"
            wkfl = ParameterScan(**kwargs)
        else:
            sim_type = "2D parameter sweep"
            wkfl = ParameterSweep2D(**kwargs)
        if verbose:
            log.info("Running the %s", sim_type)
        wkfl.run(job_id=self.get_file(), verbose=verbose)
        if verbose:
            log.info("The %s has completed", sim_type)
            log.info("Storing the results as pickle and csv")
        self.__store_results(wkfl=wkfl)
        if wkfl.name != "ParameterScan":
            if verbose:
                log.info("Storing the polts of the results")
            self.__store_plots(wkfl=wkfl)
