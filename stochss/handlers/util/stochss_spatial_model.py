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
import json
import tempfile
import traceback

import numpy
import plotly
from spatialpy import Model, Species, Parameter, Reaction, Mesh, MeshError, BoundaryCondition, \
                      PlaceInitialCondition, UniformInitialCondition, ScatterInitialCondition

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, FileNotJSONFormatError, DomainFormatError, \
                            StochSSModelFormatError

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
            if not model['is_spatial']:
                model['is_spatial'] = True
            if isinstance(model, str):
                model = json.loads(model)
            self.make_parent_dirs()
            self.model = model
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w") as smdl_file:
                json.dump(model, smdl_file, indent=4, sort_keys=True)
        else:
            self.model = None


    @classmethod
    def __build_boundary_condition(cls, boundary_condition):
        class NewBC(BoundaryCondition): # pylint: disable=too-few-public-methods
            '''
            ########################################################################################
            Custom SpatialPy Boundary Condition
            ########################################################################################
            '''
            __class__ = f"__main__.{boundary_condition['name']}"
            def expression(self): # pylint: disable=no-self-use
                '''
                Custom expression for boundary condition
                '''
                return boundary_condition['expression']
        return NewBC()


    @classmethod
    def __build_stochss_domain(cls, s_domain, data=None):
        particles = cls.__build_stochss_domain_particles(s_domain=s_domain, data=data)
        gravity = [0] * 3 if s_domain.gravity is None else s_domain.gravity
        domain = {"size":s_domain.mesh_size,
                  "rho_0":s_domain.rho0, # density
                  "c_0":s_domain.c0, # approx./artificial speed of sound
                  "p_0":s_domain.P0, # atmos/background pressure
                  "gravity":gravity,
                  "x_lim":s_domain.xlim,
                  "y_lim":s_domain.ylim,
                  "z_lim":s_domain.zlim,
                  "types":[{"fixed":False,
                            "mass":1.0,
                            "name":"Un-Assigned",
                            "nu":0.0,
                            "typeID":0,
                            "volume":1.0}],
                  "boundary_condition": {
                      "reflect_x": True,
                      "reflect_y": True,
                      "reflect_z": True},
                  "particles":particles}
        return domain


    @classmethod
    def __build_stochss_domain_particles(cls, s_domain, data=None):
        particles = []
        for i, vertex in enumerate(s_domain.vertices):
            if data is None or data['type'] is None:
                viscosity = s_domain.nu[i]
                fixed = bool(s_domain.fixed[i])
                type_id = int(s_domain.type[i])
            else:
                viscosity = data['type']['nu']
                fixed = data['type']['fixed']
                type_id = data['type']['typeID']
            point = list(vertex)
            if data is not None and data['transformation'] is not None:
                point = [coord + data['transformation'][i] for i, coord in enumerate(point)]
            particle = {"particle_id":i + 1,
                        "point":point,
                        "volume":s_domain.vol[i],
                        "mass":s_domain.mass[i],
                        "type":type_id,
                        "nu":viscosity,
                        "fixed":fixed}
            particles.append(particle)
        return particles


    def __convert_boundary_conditions(self, model):
        try:
            for boundary_condition in self.model['boundaryConditions']:
                s_bound_cond = self.__build_boundary_condition(boundary_condition)
                model.add_boundary_condition(s_bound_cond)
        except KeyError as err:
            message = "Spatial model boundary conditions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_domain(self, model):
        try:
            xlim = tuple(self.model['domain']['x_lim'])
            ylim = tuple(self.model['domain']['y_lim'])
            zlim = tuple(self.model['domain']['z_lim'])
            rho0 = self.model['domain']['rho_0']
            c_0 = self.model['domain']['c_0']
            p_0 = self.model['domain']['p_0']
            gravity = self.model['domain']['gravity']
            if gravity == [0, 0, 0]:
                gravity = None
            mesh = Mesh(0, xlim, ylim, zlim, rho0=rho0, c0=c_0, P0=p_0, gravity=gravity)
            self.__convert_particles(mesh=mesh)
            model.add_mesh(mesh)
            model.staticDomain = self.model['domain']['static']
        except KeyError as err:
            message = "Spatial model domain properties are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_initial_conditions(self, model):
        try:
            s_species = model.get_all_species()
            for initial_condition in self.model['initialConditions']:
                species = s_species[initial_condition['specie']['name']]
                count = initial_condition['count']
                if initial_condition['icType'] == "Scatter":
                    types = initial_condition['types']
                    s_ic = ScatterInitialCondition(species, count, types=types)
                elif initial_condition['icType'] == "Place":
                    location = [initial_condition['x'],
                                initial_condition['y'],
                                initial_condition['z']]
                    s_ic = PlaceInitialCondition(species, count, location)
                else:
                    types = initial_condition['types']
                    s_ic = UniformInitialCondition(species, count, types=types)
                model.add_initial_condition(s_ic)
        except KeyError as err:
            message = "Spatial model initial conditions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_model_settings(self, model):
        try:
            end = self.model['modelSettings']['endSim']
            output_freq = self.model['modelSettings']['timeStep']
            step_size = self.model['modelSettings']['timestepSize']
            tspan = numpy.arange(0, end + step_size, output_freq)
            model.timespan(tspan, timestep_size=step_size)
        except KeyError as err:
            message = "Spatial model settings are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_parameters(self, model):
        try:
            for parameter in self.model['parameters']:
                s_param = Parameter(name=parameter['name'], expression=parameter['expression'])
                model.add_parameter(s_param)
        except KeyError as err:
            message = "Spatial model parameters are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_particles(self, mesh):
        try:
            for particle in self.model['domain']['particles']:
                mesh.add_point(particle['point'], particle['volume'], particle['mass'],
                               particle['type'], particle['nu'], particle['fixed'])
        except KeyError as err:
            message = "Spatial model domain particle properties are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_reactions(self, model):
        try:
            s_params = model.get_all_parameters()
            for reaction in self.model['reactions']:
                reactants, products = self.__convert_stoich_species(model=model,
                                                                    reaction=reaction)
                if reaction['reactionType'] != "custom-propensity":
                    rate = s_params[reaction['rate']['name']]
                    propensity = None
                else:
                    rate = None
                    propensity = reaction['propensity']
                types = reaction['types']
                if len(types) == len(model.listOfTypeIDs):
                    types = None
                s_reaction = Reaction(name=reaction['name'],
                                      reactants=reactants,
                                      products=products,
                                      rate=rate,
                                      propensity_function=propensity,
                                      restrict_to=types)
                model.add_reaction(s_reaction)
        except KeyError as err:
            message = "Spatial model reactions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_species(self, model):
        try:
            for species in self.model['species']:
                name = species['name']
                s_species = Species(name=name, diffusion_constant=species['diffusionConst'])
                model.add_species(s_species)
                model.restrict(s_species, species['types'])
        except KeyError as err:
            message = "Spatial model species are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    @classmethod
    def __convert_stoich_species(cls, model, reaction):
        species = model.get_all_species()
        try:
            products = {}
            for stoich_species in reaction['products']:
                name = stoich_species['specie']['name']
                specie = species[name]
                if specie in products.keys():
                    products[specie] += stoich_species['ratio']
                else:
                    products[specie] = stoich_species['ratio']
            reactants = {}
            for stoich_species in reaction['reactants']:
                name = stoich_species['specie']['name']
                specie = species[name]
                if specie in reactants.keys():
                    reactants[specie] += stoich_species['ratio']
                else:
                    reactants[specie] = stoich_species['ratio']
            return reactants, products
        except KeyError as err:
            message = "Spatial model stoich species are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


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
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The domain file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err
        except MeshError as err:
            message = f"The domain file is not in proper format: {str(err)}"
            raise DomainFormatError(message, traceback.format_exc()) from err


    def __read_model_file(self):
        try:
            with open(self.get_path(full=True), "r") as smdl_file:
                self.model = json.load(smdl_file)
        except FileNotFoundError as err:
            message = f"Could not find the spatial model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The spatial model is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    def convert_to_model(self):
        '''
        Convert a spatial model to a non_spatial model

        Attributes
        ----------
        '''
        if self.model is None:
            s_model = self.load()
        s_model['is_spatial'] = False
        if ".wkgp" in self.path:
            wkgp_path = self.get_dir_name()
            wkgp_path, _ = self.get_unique_path(name=self.get_file(path=wkgp_path),
                                                dirname=os.path.dirname(wkgp_path))
            m_file = self.get_file(path=wkgp_path).replace(".wkgp", ".mdl")
            m_path = os.path.join(wkgp_path, m_file)
        else:
            m_path = self.path.replace(".smdl", ".mdl")
            m_file = self.get_file(path=m_path)
        message = f"{self.get_file()} was successfully convert to {m_file}!"
        return {"Message":message, "File":m_file}, {"model":s_model, "path":m_path}


    def convert_to_spatialpy(self):
        '''
        Convert a spatial model to a spatialpy model

        Attributes
        ----------
        '''
        if self.model is None:
            _ = self.load()
        name = self.get_name()
        s_model = Model(name=name)
        self.__convert_model_settings(model=s_model)
        self.__convert_domain(model=s_model)
        if "boundaryConditions" in self.model.keys():
            self.__convert_boundary_conditions(model=s_model)
        self.__convert_species(model=s_model)
        self.__convert_initial_conditions(model=s_model)
        self.__convert_parameters(model=s_model)
        self.__convert_reactions(model=s_model)
        # self.log("debug", str(s_model))
        return s_model


    @classmethod
    def create_boundary_condition(cls, kwargs):
        '''
        Create a new boundary condition using spatialpy.BoundaryCondition

        Attributes
        ----------
        kwargs : dict
            Arguments passed to the spatialpy.BoundaryCondition constructor
        '''
        new_bc = BoundaryCondition(**kwargs)
        expression = new_bc.expression()
        return {"expression": expression}


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
        for i, d_type in enumerate(domain['types']):
            if len(domain['types']) > 1:
                particles = list(filter(lambda particle, key=i: particle['type'] == key,
                                        domain['particles']))
            else:
                particles = domain['particles']
            trace = self.__get_trace_data(particles=particles, name=d_type['name'])
            trace_list.append(trace)
        layout = {"scene":{"aspectmode":'data'}, "autosize":True}
        if len(domain['x_lim']) == 2:
            layout["xaxis"] = {"range":domain['x_lim']}
        if len(domain['y_lim']) == 2:
            layout["yaxis"] = {"range":domain['y_lim']}
        return json.dumps({"data":trace_list, "layout":layout, "config":{"responsive":True}},
                          cls=plotly.utils.PlotlyJSONEncoder)


    def get_notebook_data(self):
        '''
        Get the needed data for converting to notebook

        Attributes
        ----------
        '''
        file = f"{self.get_name()}.ipynb"
        path = os.path.join(self.get_dir_name(), file)
        s_model = self.convert_to_spatialpy()
        self.model['path'] = self.get_file()
        return {"path":path, "new":True, "models":{"s_model":self.model, "model":s_model}}


    @classmethod
    def get_particles_from_3d_domain(cls, data):
        '''
        Create a new 3D domain and return the particles

        Attributes
        ----------
        data : dict
            Data used to create the 3D domain
        '''
        if data['transformation'] is None:
            xlim = data['xLim']
            ylim = data['yLim']
            zlim = data['zLim']
        else:
            xlim = [coord + data['transformation'][0] for coord in data['xLim']]
            ylim = [coord + data['transformation'][1] for coord in data['yLim']]
            zlim = [coord + data['transformation'][2] for coord in data['zLim']]
        s_domain = Mesh.create_3D_domain(xlim=xlim, ylim=ylim, zlim=zlim, nx=data['nx'],
                                         ny=data['ny'], nz=data['nz'], **data['type'])
        domain = cls.__build_stochss_domain(s_domain=s_domain)
        limits = {"x_lim":domain['x_lim'], "y_lim":domain['y_lim'], "z_lim":domain['z_lim']}
        return {"particles":domain['particles'], "limits":limits}


    @classmethod
    def get_particles_from_remote(cls, mesh, data, types):
        '''
        Get a list of stochss particles from a mesh

        Attributes
        ----------
        mesh : str
            Mesh containing particle data
        data : dict
            Property and location data to be applied to each particle
        types : list
            List of type discriptions (lines from an uploaded file)
        '''
        file = tempfile.NamedTemporaryFile()
        with open(file.name, "w") as mesh_file:
            mesh_file.write(mesh)
        s_domain = Mesh.read_xml_mesh(filename=file.name)
        domain = cls.__build_stochss_domain(s_domain=s_domain, data=data)
        if types is not None:
            type_data = cls.get_types_from_file(lines=types)
            for t_data in type_data['types']:
                if t_data['particle_id'] < len(domain['particles']):
                    domain['particles'][t_data['particle_id']]['type'] = t_data['typeID']
        limits = {"x_lim":domain['x_lim'], "y_lim":domain['y_lim'], "z_lim":domain['z_lim']}
        resp = {"particles":domain['particles'], "limits":limits}
        if types is not None:
            resp['types'] = type_data['names']
        return resp


    @classmethod
    def get_types_from_file(cls, path=None, lines=None):
        '''
        Get the type descriptions from the .txt file

        Attributes
        ----------
        path : str
            Path to the types description file
        lines : list
            Lines from an uploaded file
        '''
        if lines is None:
            path = os.path.join(cls.user_dir, path)
            with open(path, "r") as types_file:
                lines = types_file.readlines()
        types = []
        names = []
        for line in lines:
            if line.strip().replace(".0", "").replace(",", "", 1).isdigit():
                part_id, type_id = line.strip().split(",")
                if '.' in type_id:
                    type_id = float(type_id)
                type_id = int(type_id)
                if type_id not in names:
                    names.append(type_id)
                types.append({"particle_id":int(part_id), "typeID":type_id})
            else:
                message = "The type descriptions are not in the proper format "
                message += "(i.e. particle_id (int),type_id (int))"
                raise DomainFormatError(message, traceback.format_exc())
        return {"types":types, "names":sorted(names)}


    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if self.model is None:
            self.__read_model_file()
        self.model['name'] = self.get_name()
        if not self.model['defaultMode']:
            self.model['defaultMode'] = "discrete"
        if "timestepSize" not in self.model['modelSettings'].keys():
            self.model['modelSettings']['timestepSize'] = self.model['modelSettings']['timeStep']
        if "domain" not in self.model.keys() or len(self.model['domain'].keys()) < 6:
            self.model['domain'] = self.get_model_template()['domain']
        elif "static" not in self.model['domain'].keys():
            self.model['domain']['static'] = True
        if "boundaryConditions" not in self.model.keys():
            self.model['boundaryConditions'] = []
        for species in self.model['species']:
            if "types" not in species.keys():
                species['types'] = list(range(1, len(self.model['domain']['types'])))
            if "diffusionConst" not in species.keys():
                diff = 0.0 if "diffusionCoeff" not in species.keys() else species['diffusionCoeff']
                species['diffusionConst'] = diff
        for reaction in self.model['reactions']:
            if "types" not in reaction.keys():
                reaction['types'] = list(range(1, len(self.model['domain']['types'])))
        return self.model


    def save_domain(self, domain):
        '''
        Writes a StochSS Domain to a .domn file

        Attributes
        ----------
        domain : str
            Domain to be saved
        '''
        path = self.get_path(full=True)
        with open(path, 'w') as file:
            file.write(domain)
