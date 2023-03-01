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
import csv
import copy
import pickle
import logging
import traceback

import numpy

import gillespy2

from sciope.inference import smc_abc
from sciope.utilities.priors import uniform_prior
from sciope.utilities.summarystats import auto_tsfresh, identity
from sciope.utilities.epsilonselectors import RelativeEpsilonSelector

from .stochss_job import StochSSJob
from .stochss_errors import StochSSJobError, StochSSJobResultsError

log = logging.getLogger("stochss")

class ModelInference(StochSSJob):
    '''
    ################################################################################################
    StochSS model inference job object
    ################################################################################################
    '''

    TYPE = "inference"

    def __init__(self, path):
        '''
        Intitialize a model inference job object

        Attributes
        ----------
        path : str
            Path to the model inference job
        '''
        super().__init__(path=path)
        self.g_model, self.s_model = self.load_models()
        self.settings = self.load_settings()

    @classmethod
    def __get_csv_data(cls, path):
        with open(path, "r", newline="", encoding="utf-8") as csv_fd:
            csv_reader = csv.reader(csv_fd, delimiter=",")
            rows = []
            for i, row in enumerate(csv_reader):
                if i != 0:
                    rows.append(row)
            data = numpy.array(rows).swapaxes(0, 1).astype("float")
        return data

    def __get_infer_args(self):
        settings = self.settings['inferenceSettings']
        eps_selector = RelativeEpsilonSelector(20, max_rounds=settings['numEpochs'])
        args = [settings['num_samples'], settings['batchSize']]
        kwargs = {"eps_selector": eps_selector, "chunk_size": settings['chunkSize']}
        return args, kwargs

    def __get_prior_function(self):
        dmin = []
        dmax = []
        for parameter in self.settings['inferenceSettings']['parameters']:
            dmin.append(parameter['min'])
            dmax.append(parameter['max'])
        return uniform_prior.UniformPrior(numpy.array(dmin, dtype="float"), numpy.array(dmax, dtype="float"))

    def __get_run_settings(self):
        solver_map = {"ODE":self.g_model.get_best_solver_algo("ODE"),
                      "SSA":self.g_model.get_best_solver_algo("SSA"),
                      "CLE":self.g_model.get_best_solver_algo("CLE"),
                      "Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Leaping"),
                      "Hybrid-Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Hybrid")}
        run_settings = self.get_run_settings(settings=self.settings, solver_map=solver_map)
        instance_solvers = ["ODECSolver", "SSACSolver", "TauLeapingCSolver", "TauHybridCSolver"]
        if run_settings['solver'].name in instance_solvers :
            run_settings['solver'] = run_settings['solver'](model=self.g_model)
        return run_settings

    def __get_summaries_function(self):
        summary_type = self.settings['inferenceSettings']['summaryStatsType']
        if summary_type == "identity":
            return identity.Identity()
        if summary_type == "minimal" and len(self.settings['inferenceSettings']['summaryStats']) == 8:
            return auto_tsfresh.SummariesTSFRESH()
        features = {}
        for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
            features[feature_calculator['name']] = feature_calculator['args']
        return auto_tsfresh.SummariesTSFRESH(features=features)

    def __load_obs_data(self, path=None, data=None):
        if path is None:
            path = self.get_new_path(self.settings['inferenceSettings']['obsData'])
        if not (path.endswith(".csv") or path.endswith(".obsd")):
            raise StochSSJobError("Observed data must be a CSV file (.csv) or a directory (.obsd) of CSV files.")
        if path.endswith(".csv"):
            new_data = self.__get_csv_data(path)
            data.append(new_data)
            return data
        for file in os.listdir(path):
            data = self.__load_obs_data(path=os.path.join(path, file), data=data)
        return data

    @classmethod
    def __report_result_error(cls, trace):
        message = "An unexpected error occured with the result object"
        raise StochSSJobResultsError(message, trace)

    @classmethod
    def __store_pickled_results(cls, results):
        try:
            with open('results/results.p', 'wb') as results_fd:
                pickle.dump(results, results_fd)
        except Exception as err:
            message = f"Error storing pickled results: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False

    def process(self, raw_results):
        """
        Post processing function used to reshape simulator results and
        process results for identity summary statistics.
        """
        if self.settings['inferenceSettings']['summaryStatsType'] != "identity":
            return raw_results.to_array().swapaxes(1, 2)[:,1:, :]

        definitions = {"time": "time"}
        for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
            definitions[feature_calculator['name']] = feature_calculator['formula']

        trajectories = []
        for result in raw_results:
            evaluations = {}
            for label, formula in definitions.items():
                evaluations[label] = eval(formula, {}, result.data)
            trajectories.append(gillespy2.Trajectory(
                data=evaluations, model=result.model, solver_name=result.solver_name, rc=result.rc
            ))
        processed_results = gillespy2.Results([evaluations])
        return processed_results.to_array().swapaxes(1, 2)[:,1:, :]

    def run(self, verbose=True):
        '''
        Run a model inference job

        Attributes
        ----------
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        obs_data = numpy.array(self.__load_obs_data(data=[]))[:,1:, :]
        prior = self.__get_prior_function()
        summaries = self.__get_summaries_function()
        if verbose:
            log.info("Running the model inference")
        smc_abc_inference = smc_abc.SMCABC(
            obs_data, sim=self.simulator, prior_function=prior, summaries_function=summaries.compute
        )
        infer_args, infer_kwargs = self.__get_infer_args()
        results = smc_abc_inference.infer(*infer_args, **infer_kwargs)
        if verbose:
            log.info("The model inference has completed")
            log.info("Storing the results as pickle.")
        if not 'results' in os.listdir():
            os.mkdir('results')
        pkl_err = self.__store_pickled_results(results)
        if pkl_err:
            self.__report_result_error(trace=pkl_err)

    def simulator(self, parameter_point):
        """ Wrapper function for inference simulations. """
        model = copy.deepcopy(self.g_model)

        labels = list(map(lambda parameter: parameter['name'], self.settings['inferenceSettings']['parameters']))
        for ndx, parameter in enumerate(parameter_point):
            model.listOfParameters[labels[ndx]].expression = str(parameter)

        kwargs = self.__get_run_settings()
        raw_results = model.run(**kwargs)

        return self.process(raw_results)
