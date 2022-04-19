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
# import mpl_toolkits

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


    @classmethod
    def __get_csv_data(cls, results=None, species=None, mapper=None, reducer=None):
        data = []
        for specie in species:
            p_data = cls.__process_results(
                results=results, species=specie, mapper=mapper, reducer=reducer
            )
            data.append([list(_data) for _data in p_data])
        return data


    @classmethod
    def __process_results(cls, results, species, mapper="final", reducer="avg"):
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
        return numpy.array(data)


    @classmethod
    def __write_csv_file(cls, path, header, params, data):
        with open(path, "w", encoding="utf-8") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(header)
            for i, val1 in enumerate(params[0]['range']):
                for j, val2 in enumerate(params[1]['range']):
                    line = [val1, val2]
                    for col in data:
                        line.append(col[i][j])
                    csv_writer.writerow(line)


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
        data = cls.__process_results(results=results, species=species,
                                     mapper=mapper, reducer=reducer)

        trace_list = [plotly.graph_objs.Heatmap(z=data, x=params[0]['range'],
                                                y=params[1]['range'])]

        title = f"<b>Parameter Sweep - Variable: {species}</b>"
        layout = plotly.graph_objs.Layout(title=dict(text=title, x=0.5),
                                          xaxis=dict(title=f"<b>{params[0]['name']}</b>"),
                                          yaxis=dict(title=f"<b>{params[1]['name']}</b>"))
        fig = dict(data=trace_list, layout=layout)
        return json.loads(json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder))


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
        for val1 in self.params[0]['range']:
            for val2 in self.params[1]['range']:
                if "CSolver" in solver_name:
                    tmp_mdl = self.model
                    variables = {self.params[0]['parameter']:val1, self.params[1]['parameter']:val2}
                    self.settings['variables'] = variables
                else:
                    tmp_mdl = copy.deepcopy(self.model)
                    tmp_mdl.listOfParameters[self.params[0]['parameter']].expression = val1
                    tmp_mdl.listOfParameters[self.params[1]['parameter']].expression = val2
                if verbose:
                    message = f"{job_id} --> running: {self.params[0]['parameter']}={val1}, "
                    message += f"{self.params[1]['parameter']}={val2}"
                    log.info(message)
                try:
                    tmp_res = tmp_mdl.run(**self.settings)
                except Exception as err:
                    log.error(f"{err}\n{traceback.format_exc()}")
                else:
                    key = f"{self.params[0]['parameter']}:{val1},"
                    key += f"{self.params[1]['parameter']}:{val2}"
                    self.ts_results[key] = tmp_res


    @classmethod
    def to_csv(cls, params, kwargs, path=None, nametag="results_csv"):
        '''
        Output the post-process results as a series of CSV files.

        Attributes
        ----------
        params : list
            List of sweep parameter objects
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
        header = [params[0]['name'], params[1]['name']]
        header.extend(kwargs['species'])
        # Get all CSV file data
        mappers = ['min', 'max', 'avg', 'var', 'final']
        if len(kwargs['results'][0][0].data) == 1:
            for mapper in mappers:
                path = os.path.join(directory, f"{mapper}.csv")
                # Get csv data for a mapper
                data = cls.__get_csv_data(**kwargs, mapper=mapper)
                # Write csv file
                cls.__write_csv_file(path, header, params, data)
        else:
            reducers = mappers[:-1]
            for mapper in mappers:
                for reducer in reducers:
                    path = os.path.join(directory, f"{mapper}-{reducer}.csv")
                    # Get csv data for a mapper and a reducer
                    data = cls.__get_csv_data(**kwargs, mapper=mapper, reducer=reducer)
                    # Write csv file
                    cls.__write_csv_file(path, header, params, data)
