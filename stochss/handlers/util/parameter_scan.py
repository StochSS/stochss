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
from dask.distributed import Client
from dask import delayed, compute
from collections import OrderedDict

class ParameterScan():
    '''
    ################################################################################################
    StochSS parameter scan job object
    ################################################################################################
    '''
    name = "ParameterScan"

    def __init__(self, model, settings, params):
        '''
        initialize a Parameter Scan object

        Attributes
        ----------
        model : obj
            GillesPy2 Model
        settings : dict
            GillesPy2 simulation settings dictionary
        params : list
            list containing dictionaries of parameters
        '''
        self.model = model
        self.settings = settings
        self.params = params
        self.logs = []
        self.ts_results = {}
        # Initialize DASK - TODO: Update workers + threads
        self.c = Client(n_workers=2, threads_per_worker=4)
        self.result_keys = []
        self.simulations = []

    @classmethod
    def __get_result_key(cls, variables):
        elements = []
        for name, value in variables.items():
            elements.append(f"{name}:{value}")
        return ",".join(elements)


    def __load(self, index, variables, verbose):
        if index < len(self.params):
            param = self.params[index]
            index += 1
            for val in param['range']:
                variables[param['parameter']] = val
                self.__load(index=index, variables=variables, verbose=verbose)
        else:
            tmp_mdl = self.__setup_model(variables=variables)
            result_key = self.__get_result_key(variables=variables)
            if verbose:
                message = f'running {result_key.replace(":", "=").replace(",", ", ")}'
                print(message)
            sim_thread = delayed(tmp_mdl.run)(**self.settings)
            self.simulations.append(sim_thread)
            self.result_keys.append(result_key)

    def __run(self):
        self.ts_results = dict(zip(self.result_keys, compute(*self.simulations, scheduler='threads')))

    def __setup_model(self, variables):
        if "solver" in self.settings.keys() and \
                        self.settings['solver'].name == "VariableSSACSolver":
            self.settings['variables'] = variables
            return self.model
        tmp_mdl = copy.deepcopy(self.model)
        for name, value in variables.items():
            tmp_mdl.listOfParameters[name].set_expression(value)
        return tmp_mdl


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


    def run(self, verbose=False):
        '''
        Run a parameter scan job

        Attributes
        ----------
        '''
        index = 0
        variables = {}
        self.__load(index=index, variables=variables, verbose=verbose)
        self.__run()


