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
import traceback

import plotly
from spatialpy import Mesh, MeshError

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, FileNotJSONFormatError, DomainFormatError

class StochSSSpatialModel(StochSSBase):
    '''
    ################################################################################################
    StochSS spatial model object
    ################################################################################################
    '''

    def __init__(self, path, new=False, model=None):
        '''
        Intitialize a spatial model object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the spatial model
        new : bool
            Indicates whether or not the spatial model is new
        model : str or dict
            Existing spatial model data
        '''
        super().__init__(path=path)
        if new:
            if model is None:
                model = self.get_model_template()
                model['is_spatial'] = True
            if isinstance(model, str):
                model = json.loads(model)
            self.make_parent_dirs()
            self.model = model
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w") as smdl_file:
                json.dump(model, smdl_file)
        else:
            self.model = None


    def __build_stochss_domain(self, s_domain):
        particles = self.__build_stochss_domain_particles(s_domain=s_domain)
        domain = {"size":s_domain.mesh_size,
                  "rho_0":s_domain.rho0, # density
                  "c_0":s_domain.c0, # approx./artificial speed of sound
                  "p_0":s_domain.P0, # atmos/background pressure
                  "gravity":s_domain.gravity,
                  "x_lim":s_domain.xlim,
                  "y_lim":s_domain.ylim,
                  "z_lim":s_domain.zlim,
                  "type_names":["Un-Assigned"],
                  "boundary_condition": {
                      "reflect_x": True,
                      "reflect_y": True,
                      "reflect_z": True},
                  "particles":particles,
                  "def_particle_id":len(particles) + 1}
        return domain


    @classmethod
    def __build_stochss_domain_particles(cls, s_domain):
        particles = []
        for i, vertex in enumerate(s_domain.vertices):
            particle = {"particle_id":i + 1,
                        "point":list(vertex),
                        "volume":s_domain.vol[i],
                        "mass":s_domain.mass[i],
                        "type":int(s_domain.type[i]), # type == 0 indicates un-initialized
                        "nu":s_domain.nu[i], # viscosity
                        "fixed":bool(s_domain.fixed[i])}
            particles.append(particle)
        return particles


    @classmethod
    def __get_trace_data(cls, particles, name=""):
        ids = []
        x_data = []
        y_data = []
        z_data = []
        for particle in particles:
            ids.append(str(particle['particle_id']))
            x_data.append(particle['point'][0])
            y_data.append(particle['point'][1])
            z_data.append(particle['point'][2])
        return plotly.graph_objs.Scatter3d(ids=ids, x=x_data, y=y_data, z=z_data,
                                           name=name, mode="markers", marker={"size":5})


    def __load_domain_from_file(self, path):
        try:
            path = os.path.join(self.user_dir, path)
            if path.endswith(".domn"):
                with open(path, "r") as domain_file:
                    return json.load(domain_file)
            s_domain = Mesh.read_xml_mesh(filename=path)
            return self.__build_stochss_domain(s_domain=s_domain)
        except FileNotFoundError as err:
            message = f"Could not find the domain file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except json.decoder.JSONDecodeError as err:
            message = f"The domain file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc())
        except MeshError as err:
            message = f"The domain file is not in proper format: {str(err)}"
            raise DomainFormatError(message, traceback.format_exc())


    def __read_model_file(self):
        try:
            with open(self.get_path(full=True), "r") as smdl_file:
                self.model = json.load(smdl_file)
        except FileNotFoundError as err:
            message = f"Could not find the spatial model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        except json.decoder.JSONDecodeError as err:
            message = f"The spatial model is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc())


    def get_domain(self, path=None, new=False):
        '''
        Get a prospective domain

        Attributes
        ----------
        path : str
            Path to a prospective domain
        new : bool
            Indicates whether or not to load an new domain
        '''
        if new:
            return self.get_model_template()['domain']
        if path is None:
            return self.load()['domain']
        return self.__load_domain_from_file(path=path)


    def get_domain_plot(self, domain=None, path=None, new=False):
        '''
        Get a plotly plot of the models domain or a prospective domain

        Attributes
        ----------
        domain : dict
            The domain to be plotted
        path : str
            Path to a prospective domain
        new : bool
            Indicates whether or not to load an new domain
        '''
        if domain is None:
            domain = self.get_domain(path=path, new=new)
        trace_list = []
        for i, name in enumerate(domain['type_names']):
            if len(domain['type_names']) > 1:
                particles = list(filter(lambda particle, key=i: particle['type'] == key,
                                        domain['particles']))
            else:
                particles = domain['particles']
            trace = self.__get_trace_data(particles=particles, name=name)
            trace_list.append(trace)
        layout = {"width":1000, "height":1000, "scene":{"aspectmode":'data'}}
        if len(domain['x_lim']) == 2:
            layout["xaxis"] = {"range":domain['x_lim']}
        if len(domain['y_lim']) == 2:
            layout["yaxis"] = {"range":domain['y_lim']}
        return json.dumps({"data":trace_list, "layout":layout}, cls=plotly.utils.PlotlyJSONEncoder)


    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if self.model is None:
            self.__read_model_file()
        self.model['name'] = self.get_name()
        if "domain" not in self.model.keys():
            self.model['domain'] = self.get_model_template()['domain']
        for species in self.model['species']:
            if "types" not in species.keys():
                species['types'] = list(range(1, len(self.model['domain']['type_names'])))
        for reaction in self.model['reactions']:
            if "types" not in reaction.keys():
                reaction['types'] = list(range(1, len(self.model['domain']['type_names'])))
        return self.model
