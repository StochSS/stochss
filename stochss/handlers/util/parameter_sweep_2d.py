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

import copy
import logging
import traceback

import numpy
import plotly
import matplotlib
import mpl_toolkits

log = logging.getLogger("stochss")

class ParameterSweep2D():
    '''
    ################################################################################################
    StochSS 2D parameter sweep job object
    ################################################################################################
    '''
    name = "ParameterSweep2D"

    MAPPER_KEYS = ["min", "max", "avg", "var", "final"]
    REDUCER_KEYS = ["min", "max", "avg", "var"]

    def __init__(self, model, settings, params):
        '''
        initialize a 2D Parameter Sweep object

        Attributes
        ----------
        model : obj
            GillesPy2 Model
        settings : dict
            StochSS simulation settings dictionary
        params : list
            list containing dictionaries of settings for the parameters
        '''
        self.model = model
        self.settings = settings
        self.list_of_species = model.get_all_species().keys()
        self.params = params
        self.ts_results = {}
        self.results = {}


    def __ensemble_feature_extraction(self, results, i_ndx, j_ndx, verbose=False):
        func_map = {"min":numpy.min, "max":numpy.max, "avg":numpy.mean, "var":numpy.var}
        for species in self.list_of_species:
            for m_key in self.MAPPER_KEYS:
                if m_key == "final":
                    m_data = [x[species][-1] for x in results]
                else:
                    m_data = [func_map[m_key](x[species]) for x in results]
                if verbose:
                    log.debug('  %s population %s=%s', m_key, species, m_data)
                for r_key in self.REDUCER_KEYS:
                    r_data = func_map[r_key](m_data)
                    self.results[species][m_key][r_key][i_ndx, j_ndx] = r_data
                    if verbose:
                        log.debug('    %s of ensemble = %s', r_key, r_data)


    def __feature_extraction(self, results, i_ndx, j_ndx, verbose=False):
        func_map = {"min":numpy.min, "max":numpy.max, "avg":numpy.mean, "var":numpy.var}
        for species in self.list_of_species:
            spec_res = results[species]
            for key in self.MAPPER_KEYS:
                if key == "final":
                    data = spec_res[-1]
                else:
                    data = func_map[key](spec_res)
                self.results[species][key][i_ndx, j_ndx] = data
                if verbose:
                    log.debug('  %s population %s=%s', key, species, data)


    def __setup_results(self, solver_name):
        for species in self.list_of_species:
            spec_res = {}
            if "ODE" not in solver_name and self.settings['number_of_trajectories'] > 1:
                for m_key in self.MAPPER_KEYS:
                    spec_res[m_key] = {}
                    for r_key in self.REDUCER_KEYS:
                        spec_res[m_key][r_key] = numpy.zeros((len(self.params[0]['range']),
                                                              len(self.params[1]['range'])))
            else:
                for key in self.MAPPER_KEYS:
                    spec_res[key] = numpy.zeros((len(self.params[0]['range']),
                                                 len(self.params[1]['range'])))
            self.results[species] = spec_res


    def get_plotly_layout_data(self, plt_data):
        '''
        Get plotly axes labels for layout

        Attributes
        ----------
        plt_data : dict
            Existing layout data
        '''
        if "yaxis_label" not in plt_data:
            plt_data['yaxis_label'] = f"<b>{self.params[1]['parameter']}</b>"
        if "xaxis_label" not in plt_data:
            plt_data['xaxis_label'] = f"<b>{self.params[0]['parameter']}</b>"


    def get_plotly_traces(self, keys):
        '''
        Get the plotly trace list

        Attributes
        ----------
        key : list
            Identifiers for the results data
        '''
        if len(keys) <= 2:
            results = self.results[keys[0]][keys[1]]
        else:
            results = self.results[keys[0]][keys[1]][keys[2]]

        trace_list = [plotly.graph_objs.Heatmap(z=results, x=self.params[0]['range'],
                                                y=self.params[1]['range'])]
        return trace_list


    def plot(self, keys=None):
        '''
        Plot the results based on the keys using matplotlib

        Attributes
        ----------
        key : list
            Identifiers for the results data
        '''
        if len(keys) <= 2:
            results = self.results[keys[0]][keys[1]]
        else:
            results = self.results[keys[0]][keys[1]][keys[2]]

        _, axis = matplotlib.pyplot.subplots(figsize=(8, 8))
        matplotlib.pyplot.imshow(results)
        axis.set_xticks(numpy.arange(results.shape[1])+0.5, minor=False)
        axis.set_yticks(numpy.arange(results.shape[0])+0.5, minor=False)
        matplotlib.pyplot.title(f"Parameter Sweep - Variable: {keys[0]}")
        axis.set_xticklabels(self.params[0]['range'], minor=False, rotation=90)
        axis.set_yticklabels(self.params[1]['range'], minor=False)
        axis.set_xlabel(self.params[0]['parameter'], fontsize=16, fontweight='bold')
        axis.set_ylabel(self.params[1]['parameter'], fontsize=16, fontweight='bold')
        divider = mpl_toolkits.axes_grid1.make_axes_locatable(axis)
        cax = divider.append_axes("right", size="5%", pad=0.2)
        _ = matplotlib.pyplot.colorbar(ax=axis, cax=cax)


    def run(self, job_id, verbose=False):
        '''
        Run a 2D parameter sweep job

        Attributes
        ----------
        '''
        if "solver" in self.settings.keys():
            solver_name = self.settings['solver'].name
        else:
            solver_name = self.model.get_best_solver().name
        self.__setup_results(solver_name=solver_name)
        for i, val1 in enumerate(self.params[0]['range']):
            for j, val2 in enumerate(self.params[1]['range']):
                if solver_name in ["SSACSolver", "TauLeapingCSolver", "ODECSolver"]:
                    tmp_mdl = self.model
                    variables = {self.params[0]['parameter']:val1, self.params[1]['parameter']:val2}
                    self.settings['variables'] = variables
                else:
                    tmp_mdl = copy.deepcopy(self.model)
                    tmp_mdl.listOfParameters[self.params[0]['parameter']].set_expression(val1)
                    tmp_mdl.listOfParameters[self.params[1]['parameter']].set_expression(val2)
                if verbose:
                    message = f"{job_id} --> running: {self.params[0]['parameter']}={val1}, "
                    message += f"{self.params[1]['parameter']}={val2}"
                    log.info(message)
                try:
                    tmp_res = tmp_mdl.run(**self.settings)
                except Exception as err:
                    log.error("%s\n%s", err, traceback.format_exc())
                else:
                    key = f"{self.params[0]['parameter']}:{val1},"
                    key += f"{self.params[1]['parameter']}:{val2}"
                    self.ts_results[key] = tmp_res
                    if "ODE" not in solver_name and self.settings['number_of_trajectories'] > 1:
                        self.__ensemble_feature_extraction(results=tmp_res, i_ndx=i, j_ndx=j,
                                                           verbose=verbose)
                    else:
                        self.__feature_extraction(results=tmp_res, i_ndx=i, j_ndx=j,
                                                  verbose=verbose)


    def to_csv(self, keys, csv_writer):
        '''
        Convert self.results to a csv file

        Attributes
        ----------
        key : list
            Identifiers for the results data
        csv_writer : obj
            CSV file writer.
        '''
        results = []
        names = [self.params[0]['parameter'], self.params[1]['parameter']]
        names.extend(self.list_of_species)
        for species in self.list_of_species:
            if len(keys) <= 1:
                results.append(self.results[species][keys[0]])
            else:
                results.append(self.results[species][keys[0]][keys[1]])
        csv_writer.writerow(names)
        for i, step1 in enumerate(self.params[0]['range']):
            for j, step2 in enumerate(self.params[1]['range']):
                line = [step1, step2]
                for res in results:
                    line.append(res[i, j])
                csv_writer.writerow(line)
