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
import pickle
import plotly

import numpy
from gillespy2 import TauLeapingSolver, TauHybridSolver, SSACSolver, ODESolver

from .stochss_job import StochSSJob
from .stochss_errors import StochSSAPIError

class EnsembleSimulation(StochSSJob):
    '''
    ################################################################################################
    StochSS ensemble simulation job object
    ################################################################################################
    '''

    TYPE = "gillespy"

    def __init__(self, path, preview=False):
        '''
        Intitialize an ensemble simulation job object

        Attributes
        ----------
        path : str
            Path to the ensemble simulation job
        '''
        super().__init__(path=path)
        if not preview:
            try:
                self.settings = self.load_settings()
                self.g_model, self.s_model = self.load_models()
            except StochSSAPIError as err:
                self.log("error", str(err))


    def __get_run_settings(self):
        solver_map = {"SSA":SSACSolver(model=self.g_model), "Tau-Leaping":TauLeapingSolver,
                      "ODE":ODESolver, "Hybrid-Tau-Leaping":TauHybridSolver}
        return self.get_run_settings(settings=self.settings, solver_map=solver_map)


    @classmethod
    def __plot_results(cls, results):
        plots = {"trajectories":results.plotplotly(return_plotly_figure=True)}
        if len(results) > 1:
            plots['stddevran'] = results.plotplotly_std_dev_range(return_plotly_figure=True)
            std_res = results.stddev_ensemble()
            plots['stddev'] = std_res.plotplotly(return_plotly_figure=True)
            avg_res = results.average_ensemble()
            plots['avg'] = avg_res.plotplotly(return_plotly_figure=True)
        for _, plot in plots.items():
            plot["config"] = {"responsive":True}
        with open('results/plots.json', 'w') as plots_file:
            json.dump(plots, plots_file, cls=plotly.utils.PlotlyJSONEncoder,
                      indent=4, sort_keys=True)


    def __store_results(self, results):
        if not 'results' in os.listdir():
            os.mkdir('results')
        with open('results/results.p', 'wb') as results_file:
            pickle.dump(results, results_file)
        results.to_csv(path="results", nametag="results_csv", stamp=self.get_time_stamp())


    def __update_timespan(self):
        if "timespanSettings" in self.settings.keys():
            keys = self.settings['timespanSettings'].keys()
            if "endSim" in keys and "timeStep" in keys:
                end = self.settings['timespanSettings']['endSim']
                step_size = self.settings['timespanSettings']['timeStep']
                self.g_model.timespan(numpy.arange(0, end, step_size))


    def run(self, preview=False, verbose=False):
        '''
        Run a GillesPy2 ensemble simulation job

        Attributes
        ----------
        preview : bool
            Indicates whether or not to run a 5 sec preivew
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        if preview:
            if verbose:
                self.log("info", "Running a preview ensemble simulation")
            results = self.g_model.run(timeout=5)
            plot = results.plotplotly(return_plotly_figure=True)
            plot["layout"]["autosize"] = True
            plot["config"] = {"responsive": True, "displayModeBar": True}
            return plot
        if self.settings['simulationSettings']['isAutomatic']:
            if verbose:
                self.log("info", "Running an ensemble simulation with automatic solver")
            self.__update_timespan()
            is_ode = self.g_model.get_best_solver(precompile=False).name == "ODESolver"
            results = self.g_model.run(number_of_trajectories=1 if is_ode else 100)
        else:
            if verbose:
                self.log("info", "Running an ensemble simulation with manual solver")
            kwargs = self.__get_run_settings()
            self.__update_timespan()
            results = self.g_model.run(**kwargs)
        if verbose:
            self.log("info", "Storing the results as pickle and csv")
        self.__store_results(results=results)
        if verbose:
            self.log("info", "Storing the polts of the results")
        self.__plot_results(results=results)
        return None
