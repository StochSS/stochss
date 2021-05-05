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

import copy

import numpy
import plotly
import matplotlib

class ParameterSweep1D():
    '''
    ################################################################################################
    StochSS 1D parameter sweep job object
    ################################################################################################
    '''
    name = "ParameterSweep1D"

    MAPPER_KEYS = ["min", "max", "avg", "var", "final"]
    REDUCER_KEYS = ["min", "max", "avg", "var"]

    def __init__(self, model, settings, param):
        '''
        initialize a 1D Parameter Sweep object

        Attributes
        ----------
        model : obj
            GillesPy2 Model
        settings : dict
            StochSS simulation settings dictionary
        param : dict
            Dictionary of settings for the parameter
        '''
        self.model = model
        self.settings = settings
        self.param = param
        self.list_of_species = model.get_all_species().keys()
        self.results = {}
        self.ts_results = {}
        self.logs = []


    def __ensemble_feature_extraction(self, results, index, verbose=False):
        func_map = {"min":numpy.min, "max":numpy.max, "avg":numpy.mean, "var":numpy.var}
        for species in self.list_of_species:
            for m_key in self.MAPPER_KEYS:
                if m_key == "final":
                    m_data = [x[species][-1] for x in results]
                else:
                    m_data = [func_map[m_key](x[species]) for x in results]
                if verbose:
                    self.log("debug", f'  {m_key} population {species}={m_data}')
                std = numpy.std(m_data)
                for r_key in self.REDUCER_KEYS:
                    r_data = func_map[r_key](m_data)
                    self.results[species][m_key][r_key][index, 0] = r_data
                    self.results[species][m_key][r_key][index, 1] = std
                    if verbose:
                        self.log("debug", f'    {r_key} std of ensemble m:{r_data} s:{std}')


    def __feature_extraction(self, results, index, verbose=False):
        func_map = {"min":numpy.min, "max":numpy.max, "avg":numpy.mean, "var":numpy.var}
        for species in self.list_of_species:
            spec_res = results[species]
            for key in self.MAPPER_KEYS:
                if key == "final":
                    data = spec_res[-1]
                else:
                    data = func_map[key](spec_res)
                self.results[species][key][index, 0] = data
                if verbose:
                    self.log("debug", f'  {key} population {species}={data}')


    def __setup_results(self):
        for species in self.list_of_species:
            spec_res = {}
            if "ODE" not in self.settings['solver'].name and \
                            self.settings['number_of_trajectories'] > 1:
                for m_key in self.MAPPER_KEYS:
                    spec_res[m_key] = {}
                    for r_key in self.REDUCER_KEYS:
                        spec_res[m_key][r_key] = numpy.zeros((len(self.param['range']), 2))
            else:
                for key in self.MAPPER_KEYS:
                    spec_res[key] = numpy.zeros((len(self.param['range']), 2))
            self.results[species] = spec_res


    def get_plotly_layout_data(self, plt_data):
        '''
        Get plotly axes labels for layout

        Attributes
        ----------
        plt_data : dict
            Existing layout data
        '''
        if "xaxis_label" not in plt_data:
            plt_data['xaxis_label'] = f"<b>{self.param['parameter']}</b>"
        if "yaxis_label" not in plt_data:
            plt_data['yaxis_label'] = "<b>Population</b>"


    def get_plotly_traces(self, keys):
        '''
        Get the plotly trace list

        Attributes
        ----------
        key : list
            Identifiers for the results data
        '''
        if len(keys) > 2:
            results = self.results[keys[0]][keys[1]][keys[2]]
        else:
            results = self.results[keys[0]][keys[1]]

        visible = self.settings['number_of_trajectories'] > 1
        error_y = dict(type="data", array=results[:, 1], visible=visible)

        trace_list = [plotly.graph_objs.Scatter(x=self.param['range'],
                                                y=results[:, 0], error_y=error_y)]
        return trace_list


    def log(self, level, message):
        '''
        Add a log to the objects internal logs

        Attribute
        ---------
        level : str
            Level of the log
        message : string
            Message to be logged
        '''
        self.logs.append({"level":level, "message":message})


    def plot(self, keys=None):
        '''
        Plot the results based on the keys using matplotlib

        Attributes
        ----------
        key : list
            Identifiers for the results data
        '''
        if len(keys) > 2:
            results = self.results[keys[0]][keys[1]][keys[2]]
        else:
            results = self.results[keys[0]][keys[1]]

        matplotlib.pyplot.subplots(figsize=(8, 8))
        matplotlib.pyplot.title(f"Parameter Sweep - Variable: {keys[0]}")
        matplotlib.pyplot.errorbar(self.param['range'], results[:, 0], results[:, 1])
        matplotlib.pyplot.xlabel(self.param['parameter'],
                                 fontsize=16, fontweight='bold')
        matplotlib.pyplot.ylabel("Population", fontsize=16, fontweight='bold')


    def run(self, verbose=False):
        '''
        Run a 1D parameter sweep job

        Attributes
        ----------
        '''
        self.__setup_results()
        for i, val in enumerate(self.param['range']):
            if "solver" in self.settings.keys() and \
                            self.settings['solver'].name == "VariableSSACSolver":
                tmp_mdl = self.model
                self.settings['variables'] = {self.param['parameter']:val}
            else:
                tmp_mdl = copy.deepcopy(self.model)
                tmp_mdl.listOfParameters[self.param['parameter']].set_expression(val)
            if verbose:
                self.log("info", f"--> running simulation: {self.param['parameter']}={val}")
            try:
                tmp_res = tmp_mdl.run(**self.settings)
            except Exception as err:
                self.log("error", str(err))
            else:
                key = f"{self.param['parameter']}:{val}"
                self.ts_results[key] = tmp_res
                if "ODE" not in self.settings['solver'].name and \
                                self.settings['number_of_trajectories'] > 1:
                    self.__ensemble_feature_extraction(results=tmp_res, index=i, verbose=verbose)
                else:
                    self.__feature_extraction(results=tmp_res, index=i, verbose=verbose)


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
        names = [self.param['parameter']]
        for species in self.list_of_species:
            names.extend([species, f"{species}-stddev"])
            if len(keys) > 1:
                results.append(self.results[species][keys[0]][keys[1]])
            else:
                results.append(self.results[species][keys[0]])
        csv_writer.writerow(names)
        for i, step in enumerate(self.param['range']):
            line = [step]
            for res in results:
                line.extend([res[i, 0], res[i, 1]])
            csv_writer.writerow(line)
