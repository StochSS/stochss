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
import itertools

import numpy
import plotly

from gillespy2 import TauLeapingSolver, TauHybridSolver, VariableSSACSolver

from .stochss_workflow import StochSSWorkflow
from .parameter_sweep_1d import ParameterSweep1D
from .parameter_sweep_2d import ParameterSweep2D

class ParameterSweep(StochSSWorkflow):
    '''
    ################################################################################################
    StochSS parameter sweep workflow object
    ################################################################################################
    '''

    TYPE = "parameterSweep"

    def __init__(self, path):
        '''
        Intitialize an parameter sweep workflow object

        Attributes
        ----------
        path : str
            Path to the parameter sweep workflow
        '''
        super().__init__(path=path)
        self.g_model, self.s_model = self.load_models()
        self.settings = self.load_settings()


    def __get_run_settings(self, verbose=False):
        solver_map = {"SSA":VariableSSACSolver(model=self.g_model), "Tau-Leaping":TauLeapingSolver,
                      "ODE":TauHybridSolver, "Hybrid-Tau-Leaping":TauHybridSolver}
        if self.settings['simulationSettings']['isAutomatic']:
            if verbose:
                self.log("info", "Running a parameter sweep with automatic solver")
            solver_name = self.g_model.get_best_solver().name
            kwargs = {"number_of_trajectories":1 if solver_name == "ODESolver" else 20}
            if solver_name != "VariableSSACSolver":
                return kwargs
            kwargs['solver'] = solver_map['SSA']
            return kwargs
        return self.get_run_settings(settings=self.settings, solver_map=solver_map)


    def __store_csv_results(self, wkfl):
        if wkfl.settings['number_of_trajectories'] > 1:
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
        if wkfl.settings['number_of_trajectories'] > 1:
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
            json.dump(plot_figs, plots_file, cls=plotly.utils.PlotlyJSONEncoder)


    def __store_results(self, wkfl):
        if not 'results' in os.listdir():
            os.mkdir('results')
        with open('results/results.p', 'wb') as results_file:
            pickle.dump(wkfl.ts_results, results_file)
        with open('results/results.json', 'w') as json_file:
            json_file.write(json.dumps(str(wkfl.results)))
        self.__store_csv_results(wkfl)


    def configure(self, verbose=False):
        '''
        Get the configuration arguments for 1D or 2D parameter sweep

        Attributes
        ----------
        '''
        run_settings = self.__get_run_settings(verbose=verbose)
        kwargs = {"model":self.g_model, "settings":run_settings}
        settings = self.settings['parameterSweepSettings']
        p1_range = numpy.linspace(settings['p1Min'], settings['p1Max'], settings['p1Steps'])
        param_one = {"parameter":settings['parameterOne']['name'], "range":p1_range}
        if settings['is1D']:
            kwargs['param'] = param_one
            return kwargs
        p2_range = numpy.linspace(settings['p2Min'], settings['p2Max'], settings['p2Steps'])
        param_two = {"parameter":settings['parameterTwo']['name'], "range":p2_range}
        kwargs["params"] = [param_one, param_two]
        return kwargs


    def run(self, verbose=False):
        '''
        Run a 1D or 2D parameter sweep workflow

        Attributes
        ----------
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        is_1d = self.settings['parameterSweepSettings']['is1D']
        kwargs = self.configure(verbose=verbose)
        wkfl = ParameterSweep1D(**kwargs) if is_1d else ParameterSweep2D(**kwargs)
        wkfl.run(verbose=verbose)
        self.__store_results(wkfl=wkfl)
        self.__store_plots(wkfl=wkfl)
