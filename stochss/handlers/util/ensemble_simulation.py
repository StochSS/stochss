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
import logging
import traceback

import numpy
import plotly
from gillespy2 import TauHybridSolver

from .stochss_job import StochSSJob
from .stochss_errors import StochSSAPIError, StochSSJobResultsError

log = logging.getLogger("stochss")

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
                log.error(str(err))


    def __get_run_settings(self):
        solver_map = {"ODE":self.g_model.get_best_solver_algo("ODE"),
                      "SSA":self.g_model.get_best_solver_algo("SSA"),
                      "Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Leaping"),
                      "Hybrid-Tau-Leaping":TauHybridSolver}
        run_settings = self.get_run_settings(settings=self.settings, solver_map=solver_map)
        instance_solvers = ["SSACSolver", "TauLeapingCSolver", "ODECSolver"]
        if run_settings['solver'].name in instance_solvers :
            run_settings['solver'] = run_settings['solver'](model=self.g_model)
        return run_settings


    def __store_csv_results(self, results):
        try:
            results.to_csv(path="results", nametag="results_csv", stamp=self.get_time_stamp())
        except Exception as err:
            log.error("Error storing csv results: %s\n%s",
                      str(err), traceback.format_exc())


    @classmethod
    def __store_pickled_results(cls, results):
        try:
            with open('results/results.p', 'wb') as results_file:
                pickle.dump(results, results_file)
        except Exception as err:
            message = f"Error storing pickled results: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False


    @classmethod
    def __store_result_plots(cls, results):
        try:
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
        except Exception as err:
            message = f"Error storing result plots: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False


    def __update_timespan(self):
        if "timespanSettings" in self.settings.keys():
            keys = self.settings['timespanSettings'].keys()
            if "endSim" in keys and "timeStep" in keys:
                end = self.settings['timespanSettings']['endSim']
                step_size = self.settings['timespanSettings']['timeStep']
                self.g_model.timespan(numpy.arange(0, end + step_size, step_size))


    def run(self, preview=False, verbose=True):
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
                log.info("Running %s preview simulation", self.g_model.name)
            results = self.g_model.run(timeout=5)
            if verbose:
                log.info("%s preview simulation has completed", self.g_model.name)
                log.info("Generate result plot for %s preview", self.g_model.name)
            plot = results.plotplotly(return_plotly_figure=True)
            plot["layout"]["autosize"] = True
            plot["config"] = {"responsive": True, "displayModeBar": True}
            return plot
        if verbose:
            log.info("Running the ensemble simulation")
        if self.settings['simulationSettings']['isAutomatic']:
            self.__update_timespan()
            is_ode = self.g_model.get_best_solver().name in ["ODESolver", "ODECSolver"]
            results = self.g_model.run(number_of_trajectories=1 if is_ode else 100)
        else:
            kwargs = self.__get_run_settings()
            self.__update_timespan()
            results = self.g_model.run(**kwargs)
        if verbose:
            log.info("The ensemble simulation has completed")
            log.info("Storing the results as pickle and csv")
        if not 'results' in os.listdir():
            os.mkdir('results')
        self.__store_csv_results(results=results)
        pkl_err = self.__store_pickled_results(results=results)
        if verbose:
            log.info("Storing the polts of the results")
        plt_err = self.__store_result_plots(results=results)
        if pkl_err and plt_err:
            message = "An unexpected error occured with the result object"
            trace = f"{pkl_err}\n{plt_err}"
            raise StochSSJobResultsError(message, trace)
        return None
