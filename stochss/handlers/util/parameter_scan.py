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

import copy
import logging
import traceback

log = logging.getLogger("stochss")

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
        self.ts_results = {}


    @classmethod
    def __get_result_key(cls, variables):
        elements = []
        for name, value in variables.items():
            elements.append(f"{name}:{value}")
        return ",".join(elements)


    def __run(self, job_id, index, variables, verbose):
        if index < len(self.params):
            param = self.params[index]
            index += 1
            for val in param['range']:
                variables[param['parameter']] = val
                self.__run(job_id=job_id, index=index, variables=variables, verbose=verbose)
        else:
            tmp_mdl = self.__setup_model(variables=variables)
            result_key = self.__get_result_key(variables=variables)
            if verbose:
                message = f'{job_id} --> running: '
                message += f'{result_key.replace(":", "=").replace(",", ", ")}'
                log.info(message)
            try:
                tmp_result = tmp_mdl.run(**self.settings)
            except Exception as err:
                log.error(f"{err}\n{traceback.format_exc()}")
            else:
                self.ts_results[result_key] = tmp_result


    def __setup_model(self, variables):
        if "solver" in self.settings.keys() and \
                        "CSolver" in self.settings['solver'].name:
            self.settings['variables'] = variables
            return self.model
        tmp_mdl = copy.deepcopy(self.model)
        for name, value in variables.items():
            tmp_mdl.listOfParameters[name].expression = value
        return tmp_mdl


    def run(self, job_id, verbose=False):
        '''
        Run a parameter scan job

        Attributes
        ----------
        '''
        index = 0
        variables = {}
        self.__run(job_id=job_id, index=index, variables=variables, verbose=verbose)
