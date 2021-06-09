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
import traceback

import numpy
import plotly

from gillespy2 import TauHybridSolver

from .stochss_job import StochSSJob
from .parameter_sweep_1d import ParameterSweep1D
from .parameter_sweep_2d import ParameterSweep2D
from .parameter_scan import ParameterScan
from .stochss_errors import StochSSJobResultsError, StochSSJobError

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
        instance_solvers = ["SSACSolver", "TauLeapingCSolver", "ODECSolver"]
        if self.settings['simulationSettings']['isAutomatic']:
            solver = self.g_model.get_best_solver()
            kwargs = {"number_of_trajectories":1 if "ODE" in solver.name else 20}
            if solver.name not in instance_solvers:
                return kwargs
            kwargs['solver'] = solver(model=self.g_model)
            return kwargs
        solver_map = {"SSA":self.g_model.get_best_solver_algo("SSA"),
                      "Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Leaping"),
                      "ODE":self.g_model.get_best_solver_algo("ODE"),
                      "Hybrid-Tau-Leaping":TauHybridSolver}
        run_settings = self.get_run_settings(settings=self.settings, solver_map=solver_map)
        if run_settings['solver'].name in instance_solvers:
            run_settings['solver'] = run_settings['solver'](model=self.g_model)
        return run_settings


    @classmethod
    def __report_result_error(cls, trace):
        message = "An unexpected error occured with the result object"
        raise StochSSJobResultsError(message, trace)


    def __store_csv_results(self, job):
        try:
            if "solver" in job.settings.keys():
                solver_name = job.settings['solver'].name
            else:
                solver_name = job.model.get_best_solver().name
            if "ODE" not in solver_name and job.settings['number_of_trajectories'] > 1:
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
                    job.to_csv(keys=key, csv_writer=csv_writer)
        except Exception as err:
            log.error("Error storing csv results: %s\n%s",
                      str(err), traceback.format_exc())


    @classmethod
    def __store_pickled_results(cls, job):
        try:
            with open('results/results.p', 'wb') as results_file:
                pickle.dump(job.ts_results, results_file)
        except Exception as err:
            message = f"Error storing pickled results: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False


    @classmethod
    def __store_result_plots(cls, job):
        try:
            mappers = ["min", "max", "avg", "var", "final"]
            if "solver" in job.settings.keys():
                solver_name = job.settings['solver'].name
            else:
                solver_name = job.model.get_best_solver().name
            if "ODE" not in solver_name and job.settings['number_of_trajectories'] > 1:
                keys = list(itertools.product(job.list_of_species, mappers,
                                              ["min", "max", "avg", "var"]))
            else:
                keys = list(itertools.product(job.list_of_species, mappers))
            plot_figs = {}
            for key in keys:
                key = list(key)
                trace_list = job.get_plotly_traces(keys=key)
                plt_data = {'title':f"<b>Parameter Sweep - Variable: {key[0]}</b>"}
                job.get_plotly_layout_data(plt_data=plt_data)
                layout = plotly.graph_objs.Layout(title=dict(text=plt_data['title'], x=0.5),
                                                  xaxis=dict(title=plt_data['xaxis_label']),
                                                  yaxis=dict(title=plt_data['yaxis_label']))

                fig = dict(data=trace_list, layout=layout, config={"responsive": True})
                plot_figs['-'.join(key)] = fig

            with open('results/plots.json', 'w') as plots_file:
                json.dump(plot_figs, plots_file, cls=plotly.utils.PlotlyJSONEncoder,
                          indent=4, sort_keys=True)
        except Exception as err:
            message = f"Error storing result plots: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False


    @classmethod
    def __store_results(cls, job):
        try:
            with open('results/results.json', 'w') as json_file:
                json.dump(job.results, json_file, indent=4, sort_keys=True, cls=NumpyEncoder)
        except Exception as err:
            message = f"Error storing results dictionary: {err}\n{traceback.format_exc()}"
            log.err(message)
            return message
        return False


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
                self.g_model.timespan(numpy.arange(0, end + step_size, step_size))
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
            job = ParameterSweep1D(**kwargs)
            sim_type = "1D parameter sweep"
        elif len(kwargs['params']) > 2:
            sim_type = "parameter scan"
            job = ParameterScan(**kwargs)
        else:
            sim_type = "2D parameter sweep"
            job = ParameterSweep2D(**kwargs)
        if verbose:
            log.info("Running the %s", sim_type)
        job.run(job_id=self.get_file(), verbose=verbose)
        if not job.ts_results:
            message = "All simulations failed to complete."
            raise StochSSJobError(message)
        if verbose:
            log.info("The %s has completed", sim_type)
            log.info("Storing the results as pickle and csv")
        if not 'results' in os.listdir():
            os.mkdir('results')
        pkl_err = self.__store_pickled_results(job=job)
        if job.name != "ParameterScan":
            if verbose:
                log.info("Storing the polts of the results")
            res_err = self.__store_results(job=job)
            self.__store_csv_results(job=job)
            plt_err = self.__store_result_plots(job=job)
            if pkl_err and res_err and plt_err:
                self.__report_result_error(trace=f"{res_err}\n{pkl_err}\n{plt_err}")
        elif pkl_err:
            self.__report_result_error(trace=pkl_err)
