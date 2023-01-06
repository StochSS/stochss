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
import json
import copy
import string
import hashlib
import traceback

import numpy
import plotly
from escapism import escape
from spatialpy import Model, Species, Parameter, Reaction, Domain, DomainError, BoundaryCondition, \
                      PlaceInitialCondition, UniformInitialCondition, ScatterInitialCondition, \
                      TimeSpan, Geometry, CombinatoryGeometry, CartesianLattice, SphericalLattice, \
                      CylindricalLattice, XMLMeshLattice, MeshIOLattice, StochSSLattice, \
                      TranslationTransformation, RotationTransformation, ReflectionTransformation, \
                      ScalingTransformation

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, FileNotJSONFormatError, DomainFormatError, \
                            StochSSModelFormatError, StochSSPermissionsError, DomainUpdateError

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
                model['defaultMode'] = "discrete"
            if not model['is_spatial']:
                model['is_spatial'] = True
            if isinstance(model, str):
                model = json.loads(model)
            self.make_parent_dirs()
            self.model = model
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w", encoding="utf-8") as smdl_file:
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
            def __init__(self):
                pass

            def expression(self): # pylint: disable=no-self-use
                ''' Custom expression for boundary condition. '''
                return boundary_condition['expression']
        return NewBC()

    @classmethod
    def __build_geometry(cls, geometry, name=None, formula=None):
        if formula is None:
            formula = geometry['formula']
        if name is None:
            name = geometry['name']

        class NewGeometry(Geometry): # pylint: disable=too-few-public-methods
            '''
            ########################################################################################
            Custom SpatialPy Geometry
            ########################################################################################
            '''
            __class__ = f"__main__.{name}"
            def __init__(self):
                pass

            def inside(self, point, on_boundary): # pylint: disable=no-self-use
                ''' Custom inside function for geometry. '''
                namespace = {'x': point[0], 'y': point[1], 'z': point[2], 'on_boundary': on_boundary}
                return eval(formula, {}, namespace)
        return NewGeometry()

    @classmethod
    def __build_stochss_domain(cls, s_domain, data=None):
        particles = cls.__build_stochss_domain_particles(s_domain=s_domain, data=data)
        gravity = [0] * 3 if s_domain.gravity is None else s_domain.gravity
        domain = {"size":s_domain.domain_size,
                  "rho_0":s_domain.rho0, # density
                  "c_0":s_domain.c0, # approx./artificial speed of sound
                  "p_0":s_domain.P0, # atmos/background pressure
                  "gravity":gravity,
                  "x_lim":s_domain.xlim,
                  "y_lim":s_domain.ylim,
                  "z_lim":s_domain.zlim,
                  "types":[{
                      "fixed":False, "mass":1.0, "name":"Un-Assigned",
                      "nu":0.0, "typeID":0, "volume":1.0
                  }],
                  "boundary_condition": {
                      "reflect_x": True, "reflect_y": True, "reflect_z": True
                  },
                  "particles":particles}
        return domain

    @classmethod
    def __build_stochss_domain_particles(cls, s_domain, data=None):
        particles = []
        for i, vertex in enumerate(s_domain.vertices):
            if data is None or data['type'] is None:
                viscosity = s_domain.nu[i]
                fixed = bool(s_domain.fixed[i])
                type_id = s_domain.typeNdxMapping[s_domain.type_id[i]]
            else:
                viscosity = data['type']['nu']
                fixed = data['type']['fixed']
                type_id = data['typeID'] if 'typeID' in data.keys() else data['type']['typeID']
            point = list(vertex)
            if data is not None and data['transformation'] is not None:
                point = [coord + data['transformation'][i] for i, coord in enumerate(point)]
            particle = {"particle_id":i + 1,
                        "point":point,
                        "volume":s_domain.vol[i],
                        "mass":s_domain.mass[i],
                        "type":type_id,
                        "nu":viscosity,
                        "rho":s_domain.rho[i],
                        "c":s_domain.c[i],
                        "fixed":fixed}
            particles.append(particle)
        return particles

    def __convert_actions(self, domain, s_domain, type_ids):
        geometries = self.__convert_geometries(s_domain)
        lattices = self.__convert_lattices(s_domain)
        transformations = self.__convert_transformations(s_domain, geometries, lattices)
        try:
            actions = sorted(s_domain['actions'], key=lambda action: action['priority'])
            for i, action in enumerate(actions):
                # Get geometry. 'Multi Particle' scope uses geometry from action
                if action['geometry'] == "":
                    geometry = None
                elif action['geometry'] in geometries:
                    geometry = geometries[action['geometry']]
                else:
                    geometry = transformations[action['geometry']]
                # Build props arg
                if action['type'] in ('Fill Action', 'Set Action'):
                    kwargs = {
                        'type_id': type_ids[action['typeID']].replace("-", ""), 'mass': action['mass'],
                        'vol': action['vol'], 'rho': action['rho'], 'nu': action['nu'],
                        'c': action['c'], 'fixed': action['fixed']
                    }
                else:
                    kwargs = {}
                # Apply actions
                if action['type'] == "Fill Action":
                    if not action['useProps']:
                        kwargs = {}
                    if action['scope'] == 'Multi Particle':
                        if action['lattice'] in lattices:
                            lattice = lattices[action['lattice']]
                        else:
                            lattice = transformations[action['lattice']]
                        _ = domain.add_fill_action(
                            lattice=lattice, geometry=geometry, enable=action['enable'],
                            apply_action=action['enable'], **kwargs
                        )
                    else:
                        point = [action['point']['x'], action['point']['y'], action['point']['z']]
                        domain.add_point(point, **kwargs)
                else:
                    # Get proper geometry for scope
                    # 'Single Particle' scope creates a geometry using actions point.
                    if action['scope'] == 'Single Particle':
                        p_x = action['point']['x']
                        p_y = action['point']['y']
                        p_z = action['point']['z']
                        formula = f"x == {p_x} and y == {p_y} and z == {p_z}"
                        geometry = self.__build_geometry(
                            None, name=f"SPAGeometry{i + 1}", formula=formula
                        )
                    if action['type'] == "Set Action":
                        domain.add_set_action(
                            geometry=geometry, enable=action['enable'],
                            apply_action=action['enable'], **kwargs
                        )
                        if action['scope'] == "Single Particle":
                            curr_pnt = numpy.array(
                                [action['point']['x'], action['point']['y'], action['point']['z']]
                            )
                            new_pnt = numpy.array([
                                action['newPoint']['x'], action['newPoint']['y'],
                                action['newPoint']['z']
                            ])
                            if numpy.count_nonzero(curr_pnt - new_pnt) > 0:
                                for j, vertex in enumerate(domain.vertices):
                                    if numpy.count_nonzero(curr_pnt - vertex) <= 0:
                                        domain.vertices[j] = new_pnt
                                        break
                    else:
                        domain.add_remove_action(
                            geometry=geometry, enable=action['enable'],
                            apply_action=action['enable']
                        )
        except KeyError as err:
            message = "Spatial actions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_boundary_conditions(self, model):
        try:
            for boundary_condition in self.model['boundaryConditions']:
                s_bound_cond = self.__build_boundary_condition(boundary_condition)
                model.add_boundary_condition(s_bound_cond)
        except KeyError as err:
            message = "Spatial model boundary conditions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_domain(self, type_ids, model=None, s_domain=None):
        try:
            if s_domain is None:
                s_domain = self.model['domain']
            xlim = tuple(s_domain['x_lim'])
            ylim = tuple(s_domain['y_lim'])
            zlim = tuple(s_domain['z_lim'])
            rho0 = s_domain['rho_0']
            c_0 = s_domain['c_0']
            p_0 = s_domain['p_0']
            gravity = s_domain['gravity']
            if gravity == [0, 0, 0]:
                gravity = None
            domain = Domain(0, xlim, ylim, zlim, rho0=rho0, c0=c_0, P0=p_0, gravity=gravity)
            self.__convert_actions(domain, s_domain, type_ids)
            if model is None:
                self.__convert_types(domain, type_ids)
                return domain
            model.add_domain(domain)
            self.__convert_types(model.domain, type_ids)
            model.staticDomain = self.model['domain']['static']
            return None
        except KeyError as err:
            message = "Spatial model domain properties are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_geometries(self, s_domain):
        try:
            geometries = {}
            comb_geoms = []
            for s_geometry in s_domain['geometries']:
                if s_geometry['type'] == "Standard Geometry":
                    geometries[s_geometry['name']] = self.__build_geometry(s_geometry)
                else:
                    name = s_geometry['name']
                    comb_geometry = CombinatoryGeometry("", {})
                    comb_geometry.formula = s_geometry['formula']
                    geometries[name] = comb_geometry
                    comb_geoms.append(name)
            for name in comb_geoms:
                geo_namespace = {
                    key: geometry for key, geometry in geometries.items() \
                                    if key != name and key in geometries[name].formula
                }
                geometries[name].geo_namespace = geo_namespace
            return geometries
        except KeyError as err:
            message = "Spatial geometries are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_initial_conditions(self, model, type_ids):
        try:
            s_species = model.get_all_species()
            for initial_condition in self.model['initialConditions']:
                species = s_species[initial_condition['specie']['name']]
                count = initial_condition['count']
                if initial_condition['icType'] == "Scatter":
                    types = [type_ids[d_type] for d_type in initial_condition['types']]
                    s_ic = ScatterInitialCondition(species, count, types=types)
                elif initial_condition['icType'] == "Place":
                    location = [
                        initial_condition['x'], initial_condition['y'], initial_condition['z']
                    ]
                    s_ic = PlaceInitialCondition(species, count, location)
                else:
                    types = [type_ids[d_type] for d_type in initial_condition['types']]
                    s_ic = UniformInitialCondition(species, count, types=types)
                model.add_initial_condition(s_ic)
        except KeyError as err:
            message = "Spatial model initial conditions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_lattices(self, s_domain):
        try:
            lattices = {}
            for s_lattice in s_domain['lattices']:
                name = s_lattice['name']
                center = [
                    s_lattice['center']['x'], s_lattice['center']['y'], s_lattice['center']['z']
                ]
                if s_lattice['type'] == "Cartesian Lattice":
                    lattice = CartesianLattice(
                        s_lattice['xmin'], s_lattice['xmax'], s_lattice['deltax'], center=center,
                        ymin=s_lattice['ymin'], ymax=s_lattice['ymax'], deltay=s_lattice['deltay'],
                        zmin=s_lattice['zmin'], zmax=s_lattice['zmax'], deltaz=s_lattice['deltaz']
                    )
                elif s_lattice['type'] == "Spherical Lattice":
                    lattice = SphericalLattice(
                        s_lattice['radius'], s_lattice['deltas'], center=center,
                        deltar=s_lattice['deltar']
                    )
                elif s_lattice['type'] == "Cylindrical Lattice":
                    lattice = CylindricalLattice(
                        s_lattice['radius'], s_lattice['length'], s_lattice['deltas'],
                        center=center, deltar=s_lattice['deltar']
                    )
                elif s_lattice['type'] == "XML Mesh Lattice":
                    lattice = XMLMeshLattice(
                        os.path.join(self.user_dir, s_lattice['filename']), center=center,
                        subdomain_file=os.path.join(self.user_dir, s_lattice['subdomainFile'])
                    )
                elif s_lattice['type'] == "Mesh IO Lattice":
                    lattice = MeshIOLattice(
                        os.path.join(self.user_dir, s_lattice['filename']), center=center,
                        subdomain_file=os.path.join(self.user_dir, s_lattice['subdomainFile'])
                    )
                else:
                    lattice = StochSSLattice(
                        os.path.join(self.user_dir, s_lattice['filename']), center=center
                    )
                lattices[name] = lattice
            return lattices
        except KeyError as err:
            message = "Spatial lattices are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_model_settings(self, model):
        try:
            end = self.model['modelSettings']['endSim']
            output_freq = self.model['modelSettings']['timeStep']
            step_size = self.model['modelSettings']['timestepSize']
            tspan = TimeSpan.arange(output_freq, t=end + step_size, timestep_size=step_size)
            model.timespan(tspan)
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

    def __convert_reactions(self, model, type_ids):
        try:
            s_params = model.get_all_parameters()
            for reaction in self.model['reactions']:
                reactants, products = self.__convert_stoich_species(model=model,
                                                                    reaction=reaction)
                if reaction['massaction']:
                    rate = s_params[reaction['rate']['name']]
                    propensity = None
                    ode_propensity = None
                else:
                    rate = None
                    propensity = reaction['propensity']
                    ode_propensity = reaction['odePropensity']
                types = [type_ids[d_type] for d_type in reaction['types']]
                if len(types) == len(type_ids):
                    types = None
                s_reaction = Reaction(
                    name=reaction['name'], reactants=reactants, products=products,
                    rate=rate, propensity_function=propensity,
                    ode_propensity_function=ode_propensity, restrict_to=types
                )
                model.add_reaction(s_reaction)
        except KeyError as err:
            message = "Spatial model reactions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_species(self, model, type_ids):
        try:
            for species in self.model['species']:
                name = species['name']
                types = [type_ids[d_type] for d_type in species['types']]
                if len(types) == len(type_ids):
                    types = None
                s_species = Species(
                    name=name, diffusion_coefficient=species['diffusionConst'],
                    restrict_to=types
                )
                model.add_species(s_species)
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
                if specie in products:
                    products[specie] += stoich_species['ratio']
                else:
                    products[specie] = stoich_species['ratio']
            reactants = {}
            for stoich_species in reaction['reactants']:
                name = stoich_species['specie']['name']
                specie = species[name]
                if specie in reactants:
                    reactants[specie] += stoich_species['ratio']
                else:
                    reactants[specie] = stoich_species['ratio']
            return reactants, products
        except KeyError as err:
            message = "Spatial model stoich species are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    @classmethod
    def __convert_transformations(cls, s_domain, geometries, lattices):
        try:
            transformations = {}
            nested_trans = {}
            for s_transformation in s_domain['transformations']:
                name = s_transformation['name']
                vector = [
                    [
                        s_transformation['vector'][0]['x'],
                        s_transformation['vector'][0]['y'],
                        s_transformation['vector'][0]['z']
                    ],
                    [
                        s_transformation['vector'][1]['x'],
                        s_transformation['vector'][1]['y'],
                        s_transformation['vector'][1]['z']
                    ]
                ]
                if s_transformation['geometry'] != "":
                    geometry = geometries[s_transformation['geometry']]
                else:
                    geometry = None
                if s_transformation['lattice'] != "":
                    lattice = lattices[s_transformation['lattice']]
                else:
                    lattice = None
                if s_transformation['transformation'] != "":
                    nested_trans[name] = s_transformation['transformation']
                if s_transformation['type'] == "Translate Transformation":
                    transformation = TranslationTransformation(
                        vector, geometry=geometry, lattice=lattice
                    )
                elif s_transformation['type'] == "Rotate Transformation":
                    transformation = RotationTransformation(
                        vector, s_transformation['angle'], geometry=geometry, lattice=lattice
                    )
                elif s_transformation['type'] == "Reflect Transformation":
                    normal = numpy.array([
                        s_transformation['normal']['x'], s_transformation['normal']['y'],
                        s_transformation['normal']['z']
                    ])
                    point1 = numpy.array([
                        s_transformation['point1']['x'], s_transformation['point1']['y'],
                        s_transformation['point1']['z']
                    ])
                    point2 = numpy.array([
                        s_transformation['point2']['x'], s_transformation['point2']['y'],
                        s_transformation['point2']['z']
                    ])
                    point3 = numpy.array([
                        s_transformation['point3']['x'], s_transformation['point3']['y'],
                        s_transformation['point3']['z']
                    ])
                    if numpy.count_nonzero(point3 - point1) <= 0 or \
                                numpy.count_nonzero(point2 - point1) <= 0:
                        point2 = None
                        point3 = None
                    else:
                        normal = None
                    transformation = ReflectionTransformation(
                        point1, normal=normal, point2=point2, point3=point3,
                        geometry=geometry, lattice=lattice
                    )
                else:
                    center = numpy.array([
                        s_transformation['center']['x'], s_transformation['center']['y'],
                        s_transformation['center']['z']
                    ])
                    transformation = ScalingTransformation(
                        s_transformation['factor'], center=center,
                        geometry=geometry, lattice=lattice
                    )
                transformations[name] = transformation
            for trans, nested_tran in nested_trans.items():
                transformations[trans].transformation = transformations[nested_tran]
            return transformations
        except KeyError as err:
            message = "Spatial transformations are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    @classmethod
    def __convert_types(cls, domain, type_ids):
        domain.typeNdxMapping = {"type_UnAssigned": 0}
        domain.typeNameMapping = {0: "type_UnAssigned"}
        domain.listOfTypeIDs = [0]
        for ndx, name in type_ids.items():
            if ndx not in domain.typeNameMapping:
                name = f"type_{name}"
                domain.typeNdxMapping[name] = ndx
                domain.typeNameMapping[ndx] = name
                domain.listOfTypeIDs.append(ndx)
        types = list(set(domain.type_id))
        for name in types:
            if name not in domain.typeNdxMapping:
                ndx = len(domain.typeNdxMapping)
                domain.typeNdxMapping[name] = ndx
                domain.typeNameMapping[ndx] = name
                domain.listOfTypeIDs.append(ndx)

    def __create_presentation(self, file, dst):
        presentation = {'model': self.model, 'files': {}}
        # Check if the domain has lattices
        if len(self.model['domain']['lattices']) == 0:
            return self.__write_presentation_file(presentation, dst)
        # Process file based lattices
        file_based_types = ('XML Mesh Lattice', 'Mesh IO Lattice', 'StochSS Lattice')
        for lattice in self.model['domain']['lattices']:
            if lattice['type'] in file_based_types:
                entry = self.__get_presentation_file_entry(lattice['filename'], file)
                lattice['filename'] = entry['pres_path']
                presentation['files'][lattice['name']] = entry
                if lattice['subdomainFile'] != "":
                    sdf_entry = self.__get_presentation_file_entry(lattice['subdomainFile'], file)
                    lattice['subdomainFile'] = sdf_entry['pres_path']
                    presentation['files'][f"{lattice['name']}_sdf"] = sdf_entry
        return self.__write_presentation_file(presentation, dst)

    def __get_presentation_file_entry(self, path, presentation_file):
        entry = {'name': self.get_file(path=path)}
        entry['dwn_path'] = os.path.join(
            self.user_dir, f"{self.model['name']}_doamin_files", entry['name']
        )
        entry['pres_path'] = os.path.join(
            "/tmp/presentation_cache", f"{presentation_file}_doamin_files", entry['name']
        )
        with open(path, "r", encoding="utf-8") as entry_fd:
            entry['body'] = entry_fd.read().strip()
        return entry

    @classmethod
    def __get_trace_data(cls, particles, name="", index=None):
        common_rgb_values = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
            '#bcbd22', '#17becf', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff',
            '#800000', '#808000', '#008000', '#800080', '#008080', '#000080', '#ff9999', '#ffcc99',
            '#ccff99', '#cc99ff', '#ffccff', '#62666a', '#8896bb', '#77a096', '#9d5a6c', '#9d5a6c',
            '#eabc75', '#ff9600', '#885300', '#9172ad', '#a1b9c4', '#18749b', '#dadecf', '#c5b8a8',
            '#000117', '#13a8fe', '#cf0060', '#04354b', '#0297a0', '#037665', '#eed284', '#442244',
            '#ffddee', '#702afb'
        ]
        ids = []
        x_data = []
        y_data = []
        z_data = []
        for particle in particles:
            ids.append(str(particle['particle_id']))
            x_data.append(particle['point'][0])
            y_data.append(particle['point'][1])
            z_data.append(particle['point'][2])
        marker = {"size":5}
        if index is not None:
            marker["color"] = common_rgb_values[(index) % len(common_rgb_values)]
        return plotly.graph_objs.Scatter3d(ids=ids, x=x_data, y=y_data, z=z_data,
                                           name=name, mode="markers", marker=marker)

    def __load_domain_from_file(self, path):
        try:
            path = os.path.join(self.user_dir, path)
            if path.endswith(".domn"):
                with open(path, "r", encoding="utf-8") as domain_file:
                    s_domain = json.load(domain_file)
                    self.path = path
                    self.__update_domain_to_current(domain=s_domain)
                    return s_domain
            s_domain = Domain.read_xml_mesh(filename=path)
            return self.__build_stochss_domain(s_domain=s_domain)
        except FileNotFoundError as err:
            message = f"Could not find the domain file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The domain file is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err
        except DomainError as err:
            message = f"The domain file is not in proper format: {str(err)}"
            raise DomainFormatError(message, traceback.format_exc()) from err

    def __read_model_file(self):
        try:
            with open(self.get_path(full=True), "r", encoding="utf-8") as smdl_file:
                self.model = json.load(smdl_file)
        except FileNotFoundError as err:
            message = f"Could not find the spatial model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The spatial model is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err

    @classmethod
    def __update_domain_to_v1(cls, domain=None):
        if domain['template_version'] == 1:
            return

        if "static" not in domain.keys():
            domain['static'] = True
        type_changes = {}
        for i, d_type in enumerate(domain['types']):
            if d_type['typeID'] != i:
                type_changes[d_type['typeID']] = i
                d_type['typeID'] = i
            if "rho" not in d_type.keys():
                d_type['rho'] = d_type['mass'] / d_type['volume']
            if "c" not in d_type.keys():
                d_type['c'] = 10
            if "geometry" not in d_type.keys():
                d_type['geometry'] = ""
        if domain['particles']:
            for particle in domain['particles']:
                if particle['type'] in type_changes:
                    particle['type'] = type_changes[particle['type']]
                if "rho" not in particle.keys():
                    particle['rho'] = particle['mass'] / particle['volume']
                if "c" not in particle.keys():
                    particle['c'] = 10

    def __update_domain_to_current(self, domain=None):
        if domain is None:
            if "domain" not in self.model.keys() or len(self.model['domain'].keys()) < 6:
                self.model['domain'] = self.get_model_template()['domain']
            domain = self.model['domain']

        if domain['template_version'] == self.DOMAIN_TEMPLATE_VERSION:
            return

        self.__update_domain_to_v1(domain)
        # Create version 1 domain directory if needed.
        v1_dir = os.path.join(self.user_dir, "Version1-Domains")
        if not os.path.exists(v1_dir):
            os.mkdir(v1_dir)
        # Get the file name for the version 1 domain file
        v1_domain = None
        filename = os.path.join(v1_dir, self.get_file().replace(".smdl", ".domn"))
        if self.path == filename:
            errmsg = f"{self.get_file()} may be a dependency of another doamin (.domn) "
            errmsg += "or a spatial model (.smdl) and can't be updated."
            raise DomainUpdateError(errmsg)
        if os.path.exists(filename):
            with open(filename, "r", encoding="utf-8") as v1_domain_fd:
                v1_domain = json.dumps(json.load(v1_domain_fd), sort_keys=True, indent=4)
            curr_domain = json.dumps(domain, sort_keys=True, indent=4)
            if v1_domain != curr_domain:
                filename, _ = self.get_unique_path(
                    self.get_file().replace(".smdl", ".domn"), dirname=v1_dir
                )
                v1_domain = None
        # Create the version 1 doman file
        if v1_domain is None:
            with open(filename, "w", encoding="utf-8") as v1_domain_fd:
                json.dump(domain, v1_domain_fd, sort_keys=True, indent=4)

        shapes = []
        geometries = []
        for d_type in domain['types']:
            if 'geometry' in d_type and d_type['geometry']:
                geometries.append({
                    'name': f"geometry{len(geometries) + 1}",
                    'type': 'Standard Geometry',
                    'formula': d_type['geometry']
                })
                # TODO: Convert old type geometries to shapes
        domain['actions'] = [{
            'type': 'Fill Action', 'scope': 'Multi Particle', 'priority': 1, 'enable': True,
            'geometry': '', 'lattice': 'lattice1', 'useProps': False,
            'point': {'x': 0, 'y': 0, 'z': 0}, 'newPoint': {'x': 0, 'y': 0, 'z': 0},
            'c': 10, 'fixed': False, 'mass': 1.0, 'nu': 0.0, 'rho': 1.0, 'typeID': 0, 'vol': 0.0
        }]
        domain['shapes'] = shapes
        domain['geometries'] = geometries
        domain['lattices'] = [{
            'name': 'lattice1', 'type': 'StochSS Lattice',
            'filename': filename.replace(f'{self.user_dir}/', ''), 'subdomainFile': '',
            'center': {'x': 0, 'y': 0, 'z': 0}, 'length': 0, 'radius': 0,
            'deltar': 0,'deltas': 0,'deltax': 0,'deltay': 0,'deltaz': 0,
            'xmax': 0,'xmin': 0,'ymax': 0,'ymin': 0,'zmax': 0,'zmin': 0
        }]
        domain['transformations'] = []
        domain['template_version'] = self.DOMAIN_TEMPLATE_VERSION

    def __update_model_to_current(self):
        if self.model['template_version'] == self.TEMPLATE_VERSION:
            return

        if not self.model['defaultMode']:
            self.model['defaultMode'] = "discrete"
        elif self.model['defaultMode'] == "dynamic":
            self.model['defaultMode'] = "discrete-concentration"
        if "timestepSize" not in self.model['modelSettings'].keys():
            self.model['modelSettings']['timestepSize'] = 1e-5
        if "boundaryConditions" not in self.model.keys():
            self.model['boundaryConditions'] = []
        for species in self.model['species']:
            if "types" not in species.keys():
                species['types'] = list(range(1, len(self.model['domain']['types'])))
            if "diffusionConst" not in species.keys():
                if "diffusionCoeff" not in species.keys():
                    diff = 0.0
                else:
                    diff = species['diffusionCoeff']
                species['diffusionConst'] = diff
        for reaction in self.model['reactions']:
            if "odePropensity" not in reaction.keys():
                reaction['odePropensity'] = reaction['propensity']
            if "types" not in reaction.keys():
                reaction['types'] = list(range(1, len(self.model['domain']['types'])))

        self.model['template_version'] = self.TEMPLATE_VERSION

    @classmethod
    def __write_presentation_file(cls, body, path):
        with open(path, "w", encoding="utf-8") as presentation_fd:
            json.dump(body, presentation_fd, sort_keys=True, indent=4)
        return True

    def convert_to_model(self):
        ''' Convert a spatial model to a non_spatial model. '''
        if self.model is None:
            s_model = self.load()
        s_model['is_spatial'] = False
        if s_model['defaultMode'] == "discrete-concentration":
            s_model['defaultMode'] = "dynamic"
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
        '''Convert a spatial model to a spatialpy model. '''
        if self.model is None:
            _ = self.load()
        name = self.get_name()
        s_model = Model(name=name)
        self.__convert_model_settings(model=s_model)
        types = sorted(self.model['domain']['types'], key=lambda d_type: d_type['typeID'])
        type_ids = {d_type['typeID']: d_type['name'] for d_type in types}
        self.__convert_domain(model=s_model, type_ids=type_ids)
        if "boundaryConditions" in self.model.keys():
            self.__convert_boundary_conditions(model=s_model)
        self.__convert_species(model=s_model, type_ids=type_ids)
        self.__convert_initial_conditions(model=s_model, type_ids=type_ids)
        self.__convert_parameters(model=s_model)
        self.__convert_reactions(model=s_model, type_ids=type_ids)
        # self.log("debug", str(s_model))
        return s_model

    def create_boundary_condition(self, kwargs):
        '''
        Create a new boundary condition using spatialpy.BoundaryCondition

        Attributes
        ----------
        kwargs : dict
            Arguments passed to the spatialpy.BoundaryCondition constructor
        '''
        model = self.convert_to_spatialpy()
        new_bc = BoundaryCondition(model=model, **kwargs)
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

    def get_domain_plot(self, path=None, new=False, domains=None):
        '''
        Get a plotly plot of the models domain or a prospective domain

        Attributes
        ----------
        path : str
            Path to a prospective domain
        new : bool
            Indicates whether or not to load an new domain
        domains : tuple(spatialpy.Domain, stochss.Domain)
            Domain objects used to generate plot data.
        '''
        if domains is None:
            if new:
                path = '/stochss/stochss_templates/modelTemplate.json'
                s_domain = StochSSSpatialModel(path).load()['domain']
            elif path is None:
                path = self.path
                s_domain = self.load()['domain']
            else:
                s_domain = self.__load_domain_from_file(path)
            try:
                domain = Domain.read_stochss_domain(path)
            except DomainError as err:
                raise DomainFormatError(f"Failed to load the domain.  Reason given: {err}") from err
        else:
            domain = domains[0]
            s_domain = domains[1]
        fig_temp_path = "/stochss/stochss_templates/domainPlotTemplate.json"
        with open(fig_temp_path, "r", encoding="utf-8") as fig_temp_file:
            fig_temp = json.load(fig_temp_file)
            trace_temp = copy.deepcopy(fig_temp['data'][0])
        if len(s_domain['particles']) == 0:
            fig_temp['data'][0]['name'] = "Un-Assigned"
            # Case #1: no particles and one type
            if len(s_domain['types']) == 1:
                return fig_temp, trace_temp
            # Case #2: no particles and multiple types
            for index in range(1, len(s_domain['types'])):
                trace = copy.deepcopy(trace_temp)
                trace['name'] = s_domain['types'][index]['name']
                fig_temp['data'].append(trace)
            return fig_temp, trace_temp
        fig = domain.plot_types(return_plotly_figure=True)
        # Case #3: 1 or more particles and one type
        if len(s_domain['types']) == 1:
            fig['data'][0]['name'] = "Un-Assigned"
            ids = list(filter(lambda particle: particle['particle_id'], s_domain['particles']))
            fig['data'][0]['ids'] = ids
        # Case #4: 1 or more particles and multiple types
        else:
            for index, d_type in enumerate(s_domain['types']):
                if d_type['name'] == "Un-Assigned":
                    t_test = lambda trace: trace['name'] in ("Un-Assigned", "UnAssigned")
                else:
                    t_test = lambda trace, name=d_type['name']: trace['name'] == name
                traces = list(filter(t_test, fig['data']))
                if len(traces) == 0:
                    fig['data'].insert(index, self.__get_trace_data(
                        particles=[], name=d_type['name'], index=index
                    ))
                else:
                    particles = list(filter(
                        lambda particle, key=d_type['typeID']: particle['type'] == key,
                        s_domain['particles']
                    ))
                    ids = list(map(lambda particle: particle['particle_id'], particles))
                    trace = traces[0]
                    trace['name'] = d_type['name']
                    trace['ids'] = ids
        fig['layout']['width'] = None
        fig['layout']['height'] = None
        fig['layout']['autosize'] = True
        fig['config'] = {"responsive":True}
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    def get_notebook_data(self):
        ''' Get the needed data for converting to notebook. '''
        file = f"{self.get_name()}.ipynb"
        path = os.path.join(self.get_dir_name(), file)
        s_model = self.convert_to_spatialpy()
        self.model['path'] = self.get_file()
        return {"path":path, "new":True, "models":{"s_model":self.model, "model":s_model}}

    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model.
        '''
        if self.model is None:
            self.__read_model_file()

        if "domain" in self.model:
            self.model['name'] = self.get_name()
            if "template_version" not in self.model:
                self.model['template_version'] = 0
            self.__update_model_to_current()

            if "template_version" not in self.model['domain']:
                self.model['domain']['template_version'] = 0
            self.__update_domain_to_current()
        else:
            if "template_version" not in self.model:
                self.model['template_version'] = 0
            self.__update_domain_to_current(domain=self.model)

        return self.model

    def load_action_preview(self, s_domain):
        ''' Get a domain preview of all enabled actions. '''
        types = sorted(s_domain['types'], key=lambda d_type: d_type['typeID'])
        type_ids = {d_type['typeID']: d_type['name'] for d_type in types}
        domain = self.__convert_domain(type_ids, s_domain=s_domain)
        xlim, ylim, zlim = domain.get_bounding_box()
        limits = [list(xlim), list(ylim), list(zlim)]
        s_domain['particles'] = self.__build_stochss_domain_particles(domain)
        plot = self.get_domain_plot(domains=(domain, s_domain))
        return plot, limits

    def publish_presentation(self):
        ''' Publish a model or spatial model presentation. '''
        present_dir = os.path.join(self.user_dir, ".presentations")
        if not os.path.exists(present_dir):
            os.mkdir(present_dir)
        try:
            self.load()
            safe_chars = set(string.ascii_letters + string.digits)
            hostname = escape(os.environ.get('JUPYTERHUB_USER'), safe=safe_chars)
            model = json.dumps(self.model, sort_keys=True)
            # replace with gillespy2.Model.to_json
            file = f"{hashlib.md5(model.encode('utf-8')).hexdigest()}.smdl"
            dst = os.path.join(present_dir, file)
            if os.path.exists(dst):
                data = None
            else:
                self.add_presentation_name(file, self.model['name'])
                data = self.__create_presentation(file, dst)
            query_str = f"?owner={hostname}&file={file}"
            present_link = f"/stochss/present-model{query_str}"
            downloadlink = os.path.join("/stochss/download_presentation",
                                        hostname, file)
            open_link = f"https://open.stochss.org?open={downloadlink}"
            links = {"presentation": present_link, "download": downloadlink, "open": open_link}
            return links, data
        except PermissionError as err:
            message = f"You do not have permission to publish this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err

    def save_domain(self, domain):
        '''
        Writes a StochSS Domain to a .domn file

        Attributes
        ----------
        domain : str
            Domain to be saved
        '''
        domain = json.loads(domain)
        path = self.get_path(full=True)
        with open(path, 'w', encoding="utf-8") as file:
            json.dump(domain, file, sort_keys=True, indent=4)
