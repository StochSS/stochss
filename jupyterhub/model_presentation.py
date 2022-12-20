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

import ast
import json
import logging
import traceback

import numpy
import plotly

import spatialpy

from presentation_base import StochSSBase, get_presentation_from_user
from presentation_error import StochSSAPIError, StochSSModelFormatError, report_error

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class JsonFileAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for getting model presentations from user containers.
    ################################################################################################
    '''
    async def get(self):
        '''
        Load the model presentation from User's presentations directory.

        Attributes
        ----------
        '''
        owner = self.get_query_argument(name="owner")
        log.debug(f"Container id of the owner: {owner}")
        file = self.get_query_argument(name="file")
        log.debug(f"Name to the file: {file}")
        self.set_header('Content-Type', 'application/json')
        try:
            model = get_presentation_from_user(owner=owner, file=file, kwargs={"file": file},
                                               process_func=process_model_presentation)
            log.debug(f"Contents of the json file: {model['model']}")
            self.write(model)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


class DownModelPresentationAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for downloading model presentations from user containers.
    ################################################################################################
    '''
    async def get(self, owner, file):
        '''
        Download the model presentation from User's presentations directory.

        Attributes
        ----------
        '''
        log.debug(f"Container id of the owner: {owner}")
        log.debug(f"Name to the file: {file}")
        self.set_header('Content-Type', 'application/json')
        try:
            model = get_presentation_from_user(owner=owner, file=file,
                                               kwargs={"for_download": True},
                                               process_func=process_model_presentation)
            ext = file.split(".").pop()
            self.set_header('Content-Disposition', f'attachment; filename="{model["name"]}.{ext}"')
            log.debug(f"Contents of the json file: {model}")
            self.write(model)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


def process_model_presentation(path, file=None, for_download=False):
    '''
    Get the model presentation data from the file.

    Attributes
    ----------
    path : str
        Path to the model presentation file.
    file : str
        Name of the presentation file.
    for_download : bool
        Whether or not the model presentation is being downloaded.
    '''
    with open(path, "r", encoding="utf-8") as mdl_file:
        model = json.load(mdl_file)
    if for_download:
        return model
    file_objs = {"mdl":StochSSModel, "smdl":StochSSSpatialModel}
    ext = file.split(".").pop()
    file_obj = file_objs[ext](model=model)
    model_pres = file_obj.load()
    file_obj.print_logs(log)
    return model_pres


class StochSSModel(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, model):
        '''
        Intitialize a model object

        Attributes
        ----------
        model : dict
            Existing model data
        '''
        super().__init__()
        self.model = model

    @classmethod
    def __update_event_assignments(cls, event, param_ids):
        if "eventAssignments" not in event.keys():
            return
        for assignment in event['eventAssignments']:
            try:
                if assignment['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(assignment['variable']['expression'])
                    assignment['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass

    def __update_events(self, param_ids):
        if "eventsCollection" not in self.model.keys() or not param_ids:
            return
        for event in self.model['eventsCollection']:
            self.__update_event_assignments(event=event, param_ids=param_ids)

    def __update_parameters(self):
        if "parameters" not in self.model.keys():
            return []
        param_ids = []
        for param in self.model['parameters']:
            try:
                param_ids.append(param['compID'])
                if isinstance(param['expression'], str):
                    param['expression'] = ast.literal_eval(param['expression'])
            except KeyError:
                pass
            except ValueError:
                pass
        return param_ids

    def __update_reactions(self):
        if "reactions" not in self.model.keys():
            return
        for reaction in self.model['reactions']:
            try:
                if reaction['rate'].keys() and isinstance(reaction['rate']['expression'], str):
                    expression = ast.literal_eval(reaction['rate']['expression'])
                    reaction['rate']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass

    def __update_rules(self, param_ids):
        if "rules" not in self.model.keys() or not param_ids:
            return
        for rule in self.model['rules']:
            try:
                if rule['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(rule['variable']['expression'])
                    rule['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass

    def load(self):
        '''
        Reads the model file, updates the model to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if "annotation" not in self.model.keys():
            self.model['annotation'] = ""
        if "volume" not in self.model.keys():
            if "volume" in self.model['modelSettings'].keys():
                self.model['volume'] = self.model['modelSettings']['volume']
            else:
                self.model['volume'] = 1
        param_ids = self.__update_parameters()
        self.__update_reactions()
        self.__update_events(param_ids=param_ids)
        self.__update_rules(param_ids=param_ids)
        return {"model": self.model}


class StochSSSpatialModel(StochSSBase):
    '''
    ################################################################################################
    StochSS spatial model object
    ################################################################################################
    '''
    def __init__(self, model):
        '''
        Intitialize a spatial model object

        Attributes
        ----------
        model : dict
            Existing model data
        '''
        super().__init__()
        self.model = model

    @classmethod
    def __build_geometry(cls, geometry, name=None, formula=None):
        if formula is None:
            formula = geometry['formula']
        if name is None:
            name = geometry['name']

        class NewGeometry(spatialpy.Geometry): # pylint: disable=too-few-public-methods
            '''
            ########################################################################################
            Custom SpatialPy Geometry
            ########################################################################################
            '''
            __class__ = f"__main__.{name}"
            def __init__(self):
                pass

            def inside(self, point, on_boundary): # pylint: disable=no-self-use
                '''
                Custom inside function for geometry
                '''
                namespace = {'x': point[0], 'y': point[1], 'z': point[2]}
                return eval(formula, {}, namespace)
        return NewGeometry()

    @classmethod
    def __build_stochss_domain_particles(cls, domain):
        particles = []
        for i, vertex in enumerate(domain.vertices):
            viscosity = domain.nu[i]
            fixed = bool(domain.fixed[i])
            type_id = domain.typeNdxMapping[domain.type_id[i]]
            particle = {
                "particle_id": i + 1, "point": list(vertex), "type": type_id,
                "volume": domain.vol[i], "mass": domain.mass[i], "nu": viscosity,
                "rho": domain.rho[i], "c": domain.c[i], "fixed": fixed
            }
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
                        'type_id': type_ids[action['typeID']], 'mass': action['mass'], 'vol': action['vol'],
                        'rho': action['rho'], 'nu': action['nu'], 'c': action['c'], 'fixed': action['fixed']
                    }
                else:
                    kwargs = {}
                # Apply actions
                if action['type'] == "Fill Action":
                    if not action['useProps']:
                        kwargs = {}
                    if action['scope'] == 'Multi Particle':
                        lattice = lattices[action['lattice']] if action['lattice'] in lattices else transformations[action['lattice']]
                        _ = domain.add_fill_action(
                            lattice=lattice, geometry=geometry, enable=action['enable'], apply_action=action['enable'], **kwargs
                        )
                    else:
                        point = [action['point']['x'], action['point']['y'], action['point']['z']]
                        domain.add_point(point, **kwargs)
                else:
                    # Get proper geometry for scope
                    # 'Single Particle' scope creates a geometry using actions point.
                    if action['scope'] == 'Single Particle':
                        formula = f"x == {action['point']['x']} and y == {action['point']['y']} and z == {action['point']['z']}"
                        geometry = self.__build_geometry(None, name=f"SPAGeometry{i + 1}", formula=formula)
                    if action['type'] == "Set Action":
                        domain.add_set_action(
                            geometry=geometry, enable=action['enable'], apply_action=action['enable'], **kwargs
                        )
                        if action['scope'] == "Single Particle":
                            curr_pnt = numpy.array([action['point']['x'], action['point']['y'], action['point']['z']])
                            new_pnt = numpy.array([action['newPoint']['x'], action['newPoint']['y'], action['newPoint']['z']])
                            if numpy.count_nonzero(curr_pnt - new_pnt) > 0:
                                for j, vertex in enumerate(domain.vertices):
                                    if numpy.count_nonzero(curr_pnt - vertex) <= 0:
                                        domain.vertices[j] = new_pnt
                                        break
                    else:
                        domain.add_remove_action(
                            geometry=geometry, enable=action['enable'], apply_action=action['enable']
                        )
        except KeyError as err:
            message = "Spatial actions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err
    
    def __convert_domain(self, type_ids, s_domain):
        try:
            xlim = tuple(s_domain['x_lim'])
            ylim = tuple(s_domain['y_lim'])
            zlim = tuple(s_domain['z_lim'])
            rho0 = s_domain['rho_0']
            c_0 = s_domain['c_0']
            p_0 = s_domain['p_0']
            gravity = s_domain['gravity']
            if gravity == [0, 0, 0]:
                gravity = None
            domain = spatialpy.Domain(0, xlim, ylim, zlim, rho0=rho0, c0=c_0, P0=p_0, gravity=gravity)
            self.__convert_actions(domain, s_domain, type_ids)
            self.__convert_types(domain, type_ids)
            return domain
        except KeyError as err:
            message = "Spatial model domain properties are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __convert_types(self, domain, type_ids):
        domain.typeNdxMapping = {"type_UnAssigned": 0}
        domain.typeNameMapping = {0: "type_UnAssigned"}
        domain.listOfTypeIDs = [0]
        for ndx, name in type_ids.items():
            name = f"type_{name}"
            domain.typeNdxMapping[name] = ndx
            domain.typeNameMapping[ndx] = name
            domain.listOfTypeIDs.append(ndx)

    def __convert_geometries(self, s_domain):
        try:
            geometries = {}
            comb_geoms = []
            for s_geometry in s_domain['geometries']:
                if s_geometry['type'] == "Standard Geometry":
                    geometries[s_geometry['name']] = self.__build_geometry(s_geometry)
                else:
                    name = s_geometry['name']
                    comb_geometry = spatialpy.CombinatoryGeometry("", {})
                    comb_geometry.formula = s_geometry['formula']
                    geometries[name] = comb_geometry
                    comb_geoms.append(name)
            for name in comb_geoms:
                geo_namespace = {key: geometry for key, geometry in geometries.items() if key != name}
                geometries[name].geo_namespace = geo_namespace
            return geometries
        except KeyError as err:
            message = "Spatial geometries are not properly formatted or "
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
                    lattice = spatialpy.CartesianLattice(
                        s_lattice['xmin'], s_lattice['xmax'], s_lattice['deltax'], center=center,
                        ymin=s_lattice['ymin'], ymax=s_lattice['ymax'], deltay=s_lattice['deltay'],
                        zmin=s_lattice['zmin'], zmax=s_lattice['zmax'], deltaz=s_lattice['deltaz']
                    )
                elif s_lattice['type'] == "Spherical Lattice":
                    lattice = spatialpy.SphericalLattice(
                        s_lattice['radius'], s_lattice['deltas'], center=center, deltar=s_lattice['deltar']
                    )
                elif s_lattice['type'] == "Cylindrical Lattice":
                    lattice = spatialpy.CylindricalLattice(
                        s_lattice['radius'], s_lattice['length'], s_lattice['deltas'],
                        center=center, deltar=s_lattice['deltar']
                    )
                elif s_lattice['type'] == "XML Mesh Lattice":
                    lattice = spatialpy.XMLMeshLattice(
                        s_lattice['filename'], center=center, subdomain_file=s_lattice['subdomainFile']
                    )
                elif s_lattice['type'] == "Mesh IO Lattice":
                    lattice = spatialpy.MeshIOLattice(
                        s_lattice['filename'], center=center, subdomain_file=s_lattice['subdomainFile']
                    )
                else:
                    lattice = spatialpy.StochSSLattice(s_lattice['filename'], center=center)
                lattices[name] = lattice
            return lattices
        except KeyError as err:
            message = "Spatial lattices are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err
    
    def __convert_transformations(self, s_domain, geometries, lattices):
        try:
            transformations = {}
            nested_trans = {}
            for s_transformation in s_domain['transformations']:
                name = s_transformation['name']
                vector = [
                    [s_transformation['vector'][0]['x'], s_transformation['vector'][0]['y'], s_transformation['vector'][0]['z']],
                    [s_transformation['vector'][1]['x'], s_transformation['vector'][1]['y'], s_transformation['vector'][1]['z']]
                ]
                geometry = geometries[s_transformation['geometry']] if s_transformation['geometry'] != "" else None
                lattice = lattices[s_transformation['lattice']] if s_transformation['lattice'] != "" else None
                if s_transformation['transformation'] != "":
                    nested_trans[name] = s_transformation['transformation']
                if s_transformation['type'] == "Translate Transformation":
                    transformation = spatialpy.TranslationTransformation(vector, geometry=geometry, lattice=lattice)
                elif s_transformation['type'] == "Rotate Transformation":
                    transformation = spatialpy.RotationTransformation(vector, s_transformation['angle'], geometry=geometry, lattice=lattice)
                elif s_transformation['type'] == "Reflect Transformation":
                    normal = numpy.array([s_transformation['normal']['x'], s_transformation['normal']['y'], s_transformation['normal']['z']])
                    point1 = numpy.array([s_transformation['point1']['x'], s_transformation['point1']['y'], s_transformation['point1']['z']])
                    point2 = numpy.array([s_transformation['point2']['x'], s_transformation['point2']['y'], s_transformation['point2']['z']])
                    point3 = numpy.array([s_transformation['point3']['x'], s_transformation['point3']['y'], s_transformation['point3']['z']])
                    if numpy.count_nonzero(point3 - point1) <= 0 or numpy.count_nonzero(point2 - point1) <= 0:
                        point2 = None
                        point3 = None
                    else:
                        normal = None
                    transformation = spatialpy.ReflectionTransformation(
                        point1, normal=normal, point2=point2, point3=point3, geometry=geometry, lattice=lattice
                    )
                else:
                    center = numpy.array([s_transformation['center']['x'], s_transformation['center']['y'], s_transformation['center']['z']])
                    transformation = spatialpy.ScalingTransformation(
                        s_transformation['factor'], center=center, geometry=geometry, lattice=lattice
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

    def __update_domain_to_current(self, domain=None):
        if domain is None:
            if "domain" not in self.model.keys() or len(self.model['domain'].keys()) < 6:
                self.model['domain'] = self.get_model_template()['domain']
            domain = self.model['domain']

        if domain['template_version'] == self.DOMAIN_TEMPLATE_VERSION:
            return

        self.__update_domain_to_v1(domain)

        # Create version 1 domain directory if needed.
        v1_dir = os.path.join('/tmp/presentation_cache', "Version 1 Domains")
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
                filename, _ = self.get_unique_path(self.get_file().replace(".smdl", ".domn"), dirname=v1_dir)
                v1_domain = None
        # Create the version 1 doman file
        if v1_domain is None:
            with open(filename, "w", encoding="utf-8") as v1_domain_fd:
                json.dump(domain, v1_domain_fd, sort_keys=True, indent=4)
        
        geometries = []
        for d_type in domain['types']:
            if 'geometry' in d_type and d_type['geometry']:
                geometries.append({
                    'name': f"geometry{len(geometries) + 1}",
                    'type': 'Standard Geometry',
                    'formula': d_type['geometry']
                })
        domain['actions'] = [{
            'type': 'Fill Action', 'scope': 'Multi Particle', 'priority': 1, 'enable': True,
            'geometry': '', 'lattice': 'lattice1', 'useProps': False,
            'point': {'x': 0, 'y': 0, 'z': 0}, 'newPoint': {'x': 0, 'y': 0, 'z': 0},
            'c': 10, 'fixed': False, 'mass': 1.0, 'nu': 0.0, 'rho': 1.0, 'typeID': 0, 'vol': 0.0
        }]
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

    def __update_domain_to_v1(self, domain=None):
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

    def get_domain_plot(self, domain, s_domain):
        '''
        Get a plotly plot of the models domain or a prospective domain

        Attributes
        ----------
        domain : spatialpy.Domain
            SpatialPy domain object used to generate plot data.
        s_domain : stochss.Domain
            StochSS domain object used to generate plot data.
        '''
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

    def load(self):
        '''
        Reads the spatial model file, updates it to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if "template_version" not in self.model:
            self.model['template_version'] = 0
        if "template_version" not in self.model['domain']:
            self.model['domain']['template_version'] = 0

        self.__update_model_to_current()
        self.__update_domain_to_current()

        plot = self.load_action_preview()
        return {"model": self.model, "domainPlot": json.loads(plot)}

    def load_action_preview(self):
        s_domain = self.model['domain']
        types = sorted(s_domain['types'], key=lambda d_type: d_type['typeID'])
        type_ids = {d_type['typeID']: d_type['name'] for d_type in types}
        domain = self.__convert_domain(type_ids, s_domain)
        # xlim, ylim, zlim = domain.get_bounding_box()
        s_domain['particles'] = self.__build_stochss_domain_particles(domain)
        return self.get_domain_plot(domain, s_domain)#, [list(xlim), list(ylim), list(zlim)]
