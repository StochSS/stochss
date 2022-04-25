'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
from spatialpy import Solver

from .stochss_job import StochSSJob

class SpatialSimulation(StochSSJob):
    '''
    ################################################################################################
    StochSS spatial ensemble simulation job object
    ################################################################################################
    '''

    TYPE = "spatial"

    def __init__(self, path, preview=False, target=None):
        '''
        Intitialize a spatial ensemble simulation job object

        Attributes
        ----------
        path : str
            Path to the spatial ensemble simulation job
        preview : bool
            Indicates whether or not the simulation is a preview.
        target : string
            Results data target used for ploting
        '''
        super().__init__(path=path)
        if not preview:
            self.settings = self.load_settings()
            self.s_py_model, self.s_model = self.load_models()
        else:
            self.target = target


    def __get_run_settings(self):
        solver_map = {"SSA":Solver(model=self.s_py_model)}
        return self.get_run_settings(settings=self.settings, solver_map=solver_map)


    def run(self, preview=False, verbose=False):
        '''
        Run a SpatialPy ensemble simulation job

        Attributes
        ----------
        preview : bool
            Indicates whether or not to run a ??? sec preivew
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        if preview:
            if verbose:
                self.log("info", "Running a preview spatial ensemble simulation")
            results = self.s_py_model.run()
            properties = ["type", "rho", "mass", "nu"]
            t_ndx_list = list(range(len(os.listdir(results.result_dir)) - 1))
            kwargs = {"t_ndx_list": t_ndx_list, "animated": True, "width": "auto", "height": "auto",
                      "return_plotly_figure": True, "f_duration": 100, "t_duration": 100}
            if self.target in properties or self.target.startswith("v["):
                if self.target.startswith("v["):
                    kwargs['p_ndx'] = int(self.target[2])
                    self.target = "v"
                plot = results.plot_property(property_name=self.target, **kwargs)
            else:
                concentration = self.s_model['defaultMode'] == "discrete-concentration"
                deterministic = self.s_model['defaultMode'] == "continuous"
                plot = results.plot_species(species=self.target, concentration=concentration,
                                            deterministic=deterministic, **kwargs)
            plot["layout"]["autosize"] = True
            plot["config"] = {"responsive": True, "displayModeBar": True}
            return plot
        return None
