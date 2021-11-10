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
import csv
import json
import copy
import logging
import traceback

import numpy
import plotly
# import matplotlib

log = logging.getLogger("stochss")

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


    @classmethod
    def __get_csv_data(cls, results=None, species=None, mapper=None, reducer=None):
        data = []
        for specie in species:
            p_data, _ = cls.__process_results(
                results=results, species=specie, mapper=mapper, reducer=reducer
            )
            data.extend([list(p_data[:,0]), list(p_data[:,1])])
        return data


    @classmethod
    def __process_results(cls, results, species, mapper="final", reducer="avg"):
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
        return numpy.array(data), visible


    @classmethod
    def __write_csv_file(cls, path, header, param, data):
        with open(path, "w") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(header)
            for i, val in enumerate(param['range']):
                line = [val]
                for col in data:
                    line.append(col[i])
                csv_writer.writerow(line)


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
        data, visible = cls.__process_results(results=results, species=species,
                                              mapper=mapper, reducer=reducer)

        error_y = dict(type="data", array=data[:, 1], visible=visible)
        trace_list = [plotly.graph_objs.Scatter(x=param['range'],
                                                y=data[:, 0], error_y=error_y)]

        title = f"<b>Parameter Sweep - Variable: {species}</b>"
        layout = plotly.graph_objs.Layout(title=dict(text=title, x=0.5),
                                          xaxis=dict(title=f"<b>{param['name']}</b>"),
                                          yaxis=dict(title="<b>Population</b>"))

        fig = dict(data=trace_list, layout=layout)
        return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))


    def run(self, job_id, verbose=False):
        '''
        Run a 1D parameter sweep job

        Attributes
        ----------
        '''
        if "solver" in self.settings.keys():
            solver_name = self.settings['solver'].name
        else:
            solver_name = self.model.get_best_solver().name
        for val in self.param['range']:
            if solver_name in ["SSACSolver", "TauLeapingCSolver", "ODECSolver"]:
                tmp_mdl = self.model
                self.settings['variables'] = {self.param['parameter']:val}
            else:
                tmp_mdl = copy.deepcopy(self.model)
                tmp_mdl.listOfParameters[self.param['parameter']].expression = val
            if verbose:
                log.info(f"{job_id} --> running: {self.param['parameter']}={val}")
            try:
                tmp_res = tmp_mdl.run(**self.settings)
            except Exception as err:
                log.error(f"{err}\n{traceback.format_exc()}")
            else:
                key = f"{self.param['parameter']}:{val}"
                self.ts_results[key] = tmp_res


    @classmethod
    def to_csv(cls, param, kwargs, path=None, nametag="results_csv"):
        '''
        Output the post-process results as a series of CSV files.

        Attributes
        ----------
        param : dict
            Sweep parameter object
        kwargs : dict
            Filtered results and full list of Model species
        path : str
            Parent path to the csv directory
        nametag : str
            Name of the csv directory
        '''
        if path is None:
            directory = os.path.join(".", str(nametag))
        else:
            directory = os.path.join(path, str(nametag))
        os.mkdir(directory)
        # Define header row for all files
        header = [param['name']]
        for specie in kwargs['species']:
            header.extend([specie, f"{specie}-stddev"])
        # Get all CSV file data
        mappers = ['min', 'max', 'avg', 'var', 'final']
        if len(kwargs['results'][0].data) == 1:
            for mapper in mappers:
                path = os.path.join(directory, f"{mapper}.csv")
                # Get csv data for a mapper
                data = cls.__get_csv_data(**kwargs, mapper=mapper)
                # Write csv file
                cls.__write_csv_file(path, header, param, data)
        else:
            reducers = mappers[:-1]
            for mapper in mappers:
                for reducer in reducers:
                    path = os.path.join(directory, f"{mapper}-{reducer}.csv")
                    # Get csv data for a mapper and a reducer
                    data = cls.__get_csv_data(**kwargs, mapper=mapper, reducer=reducer)
                    # Write csv file
                    cls.__write_csv_file(path, header, param, data)
