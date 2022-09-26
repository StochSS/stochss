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
import string
import hashlib
import traceback
import nbformat
from escapism import escape
from nbformat import v4 as nbf

from gillespy2.solvers.utilities.cpp_support_test import check_cpp_support

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, StochSSModelFormatError, \
                            StochSSPermissionsError

class StochSSNotebook(StochSSBase):
    '''
    ################################################################################################
    StochSS notebook object
    ################################################################################################
    '''
    ENSEMBLE_SIMULATION = 1
    SPATIAL_SIMULATION = 2
    PARAMETER_SWEEP_1D = 3
    PARAMETER_SWEEP_2D = 4
    MODEL_EXPLORATION = 5
    MODEL_INFERENCE = 6
    SOLVER_MAP = {"SSACSolver":"SSA", "NumPySSASolver":"SSA", "ODESolver":"ODE", "Solver":"SSA",
                  "TauLeapingSolver":"Tau-Leaping", "TauHybridSolver":"Hybrid-Tau-Leaping",
                  "ODECSolver":"ODE", "TauLeapingCSolver":"Tau-Leaping",
                  "TauHybridCSolver":"Hybrid-Tau-Leaping"}

    def __init__(self, path, new=False, models=None, settings=None):
        '''Intitialize a notebook object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the notebook'''
        super().__init__(path=path)
        if new:
            self.is_ssa_c = check_cpp_support()
            self.nb_type = 0
            self.s_model = models["s_model"]
            self.model = models["model"]
            if settings is None:
                self.settings = self.get_settings_template()
                if self.s_model['is_spatial']:
                    self.settings['simulationSettings']['realizations'] = 1
            else:
                self.settings = settings
                if "timespanSettings" in settings.keys():
                    keys = settings['timespanSettings'].keys()
                    if "endSim" in keys and "timeStep" in keys:
                        end = settings['timespanSettings']['endSim']
                        step_size = settings['timespanSettings']['timeStep']
                        self.s_model['modelSettings']['endSim'] = end
                        self.s_model['modelSettings']['timeStep'] = step_size
            self.make_parent_dirs()
            n_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = n_path.replace(self.user_dir + '/', "")

    def __add_name(self, names, names_length, name, max_len=100):
        if names_length + len(name) > max_len:
            names = [f"{', '.join(names)},\n{' ' * (8 + 100 - max_len)}{name}"]
            return 8 + len(name), names
        names.append(name)
        return names_length + 2 + len(name), None

    def __create_common_header_cells(self):
        name = self.s_model['name'].replace('_', ' ').replace('-', ' ').title()
        nb_title = f"# {name}\n***"
        if 'annotation' in self.s_model and self.s_model['annotation'] != '':
            nb_title = f"{nb_title}\n{self.s_model['annotation']}\n***"
        nb_title = f"{nb_title}\n## Setup the Environment\n***"

        return [
            nbf.new_markdown_cell(nb_title),
            nbf.new_markdown_cell(f"***\n## Create the {name} Model\n***"),
            nbf.new_markdown_cell("### Instantiate the model"),
            nbf.new_markdown_cell("***\n## Simulation Parameters\n***")
        ]

    def __create_configuration_cell(self):
        if self.s_model['is_spatial']:
            settings = self.__get_spatialpy_run_setting()
        else:
            settings = self.__get_gillespy2_run_settings()
        is_automatic = self.settings['simulationSettings']['isAutomatic']
        algorithm = self.settings['simulationSettings']['algorithm']
        use_solver = self.nb_type not in (self.ENSEMBLE_SIMULATION, self.SPATIAL_SIMULATION)
        settings_lists = {
            "ODE": ["solver", "algorithm", "integrator_options"],
            "SSA": ["solver", "algorithm", "seed", "number_of_trajectories"],
            "CLE": ["solver", "algorithm", "seed", "number_of_trajectories", "tau_tol"],
            "Tau-Leaping": ["solver", "algorithm", "seed", "number_of_trajectories", "tau_tol"],
            "Hybrid-Tau-Leaping": [
                "solver", "algorithm", "number_of_trajectories",
                "seed", "tau_tol", "integrator_options"
            ]
        }

        pad = "    "
        config = ["def configure_simulation():"]
        if use_solver:
            if self.s_model['is_spatial']:
                nb_solver = "spatialpy.solver(model=model)"
            else:
                solver = self.get_gillespy2_solver_name()
                nb_solver = f"gillespy2.{solver}(model=model)"
            config.append(f"{pad}solver = {nb_solver}")

        config.append(pad + "kwargs = {")
        for name, val in settings.items():
            if is_automatic or name not in settings_lists[algorithm]:
                config.append(f"{pad*2}# '{name}': {val},")
            else:
                config.append(f"{pad*2}'{name}': {val},")
        config.extend([pad + "}", f"{pad}return kwargs"])
        return nbf.new_code_cell("\n".join(config))

    def __create_parameters(self, nb_model, index):
        if len(self.s_model['parameters']) > 0:
            pad = '    '
            package = "spatialpy" if self.s_model['is_spatial'] else "gillespy2"
            args_tmp = "name='__NAME__', expression='__EXPRESSION__'"
            tmp = f"{pad}__NAME__ = {package}.Parameter({args_tmp})"
            names = []
            n_len = 8
            parameters = ["", f"{pad}# Parameters"]
            try:
                for s_parameter in self.s_model['parameters']:
                    name = s_parameter['name']
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_param = tmp.replace("__NAME__", name)
                    nb_param = nb_param.replace("__EXPRESSION__", str(s_parameter['expression']))
                    parameters.append(nb_param)
                parameters.append(f"{pad}model.add_parameter([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(parameters))
                index += 1
            except KeyError as err:
                message = "Parameters are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_reactions(self, nb_model, index, type_refs=None):
        if len(self.s_model['reactions']) > 0:
            pad = '    '
            package = "spatialpy" if self.s_model['is_spatial'] else "gillespy2"
            l1_tmp = f"{pad*2}name='__NAME__',__RATE____RESTRICT_TO__"
            l2_tmp = f"{pad*2}reactants=__REACTANTS__, products=__PRODUCTS__"
            tmp = f"{pad}__NAME__ = {package}.Reaction(\n{l1_tmp}\n{l2_tmp}__L3____L4__\n{pad})"
            names = []
            n_len = 8
            reactions = ["", f"{pad}# Reactions"]
            try:
                for s_reaction in self.s_model['reactions']:
                    name = s_reaction['name']
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    reactants = self.__create_stoich_species(stoich_species=s_reaction['reactants'])
                    products = self.__create_stoich_species(stoich_species=s_reaction['products'])

                    if s_reaction['rate'] != {}:
                        nb_reac = tmp.replace("__L3____L4__", "")
                        rate = s_reaction['rate']['name']
                        nb_reac = nb_reac.replace("__RATE__", f" rate='{rate}',")
                    else:
                        ssa = f",\n{pad*2}propensity_function='{s_reaction['propensity']}',"
                        ode = f"\n{pad*2}ode_propensity_function='{s_reaction['odePropensity']}'"
                        nb_reac = tmp.replace("__RATE__", "")
                        nb_reac = nb_reac.replace("__L3__", ssa).replace("__L4__", ode)
                    if type_refs is None or len(s_reaction['types']) == len(type_refs):
                        nb_reac = nb_reac.replace("__RESTRICT_TO__", "")
                    else:
                        types = [type_refs[d_type] for d_type in s_reaction['types']]
                        restrict_to = f" restrict_to=[{', '.join(types)}],"
                        nb_reac = nb_reac.replace("__RESTRICT_TO__", restrict_to)
                    nb_reac = nb_reac.replace("__NAME__", name)
                    nb_reac = nb_reac.replace("__REACTANTS__", reactants)
                    nb_reac = nb_reac.replace("__PRODUCTS__", products)
                    reactions.append(nb_reac)
                reactions.append(f"{pad}model.add_reaction([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(reactions))
                index += 1
            except KeyError as err:
                message = "Reactions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_run(self, results):
        nb_run_header = "***\n## Run the Simulation\n***"
        nb_run = ["kwargs = configure_simulation()"]
        if results is None:
            nb_run.append("results = model.run(**kwargs)")
        else:
            nb_load_res = [
                "# results = model.run(**kwargs)", f"path = '{results}'",
                "with open(os.path.join(os.path.expanduser('~'), path), 'rb') as results_file:",
                "    results = pickle.load(results_file)"
            ]
            nb_run.extend(nb_load_res)
        nb_run = "\n".join(nb_run)
        return nbf.new_markdown_cell(nb_run_header), nbf.new_code_cell(nb_run)

    def __create_spatial_boundary_conditions(self, nb_model, index):
        if len(self.s_model['boundaryConditions']) > 0:
            pad = '    '
            tmp = f"{pad}__NAME__ = __OBJECT__()"
            names = []
            n_len = 8
            bound_conds = ["", f"{pad}# Boundary Conditions"]
            try:
                for s_bound_cond in self.s_model['boundaryConditions']:
                    name = f"{s_bound_cond['name'].lower()}_bc"
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_bound_cond = tmp.replace("__NAME__", name)
                    nb_bound_cond = nb_bound_cond.replace("__OBJECT__", s_bound_cond['name'])
                    bound_conds.append(nb_bound_cond)
                bound_conds.append(f"{pad}model.add_boundary_condition([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(bound_conds))
                index += 1
            except KeyError as err:
                message = "Boundary conditions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_spatial_boundary_condition_cells(self, cells):
        index = 3
        if len(self.s_model['boundaryConditions']) > 0:
            pad = "    "
            tmp_body = f"{pad}def expression(self):\n{pad*2}return '''__EXPRESSION__'''"
            tmp = f"class __NAME__(spatialpy.BoundaryCondition):\n{tmp_body}"
            try:
                bc_header = "***\n## Creating the Boundary Conditions for the System\n***"
                cells.insert(2, nbf.new_markdown_cell(bc_header))
                index = 3
                for s_bound_cond in self.s_model['boundaryConditions']:
                    bc_cell = tmp.replace("__NAME__", s_bound_cond['name'])
                    bc_cell = bc_cell.replace("__EXPRESSION__", s_bound_cond['expression'])
                    cells.insert(index, nbf.new_code_cell(bc_cell))
                    index += 1
                return index + 1
            except KeyError as err:
                message = "Boundary conditions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_spatial_domain(self, nb_model, index):
        try:
            pad = '    '
            tmp = f"{pad}model.__TYPE__ = '__ID__'"
            nb_domain = [
                "", f"{pad}# Define Domain Type IDs as constants of the Model",
                "", f"{pad}# Domain",
                f"{pad}domain = spatialpy.Domain.read_stochss_domain('{self.s_model['path']}')",
                f"{pad}model.add_domain(domain)", "",
                f"{pad}model.staticDomain = {self.s_model['domain']['static']}"
            ]
            d_index = 2
            for d_type in self.s_model['domain']['types']:
                if d_type['typeID'] > 0:
                    nb_type = tmp.replace("__TYPE__", d_type['name'].upper())
                    nb_type = nb_type.replace("__ID__", d_type['name'])
                    nb_domain.insert(d_index, nb_type)
                    d_index += 1
            nb_model.insert(index, '\n'.join(nb_domain))
        except KeyError as err:
            message = "The domain is not properly formatted or "
            message += f"is referenced incorrectly for notebooks: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index + 1

    def __create_spatial_initial_condition(self, nb_model, index, type_refs):
        if len(self.s_model['initialConditions']) > 0:
            pad = '    '
            args_tmp = "species='__SPECIES__', count=__COUNT__, __DATA__"
            tmp = f"{pad}__NAME__ = spatialpy.__OBJECT__({args_tmp})"
            names = []
            n_len = 8
            ic_types = {
                "Place":"PlaceInitialCondition",
                "Scatter":"ScatterInitialCondition",
                "Distribute Uniformly per Voxel":"UniformInitialCondition"
            }
            init_cond = ["", f"{pad}# Initial Conditions"]
            try:
                for s_init_cond in self.s_model['initialConditions']:
                    name = f"{s_init_cond['specie']['name']}_ic"
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_init_cond = tmp.replace("__OBJECT__", ic_types[s_init_cond['icType']])
                    nb_init_cond = nb_init_cond.replace("__NAME__", name)
                    nb_init_cond = nb_init_cond.replace(
                        "__SPECIES__", s_init_cond['specie']['name']
                    )
                    nb_init_cond = nb_init_cond.replace("__COUNT__", str(s_init_cond['count']))
                    if s_init_cond['icType'] == "Place":
                        location = f"location=[{s_init_cond['x']}, {s_init_cond['y']}, {s_init_cond['z']}]"
                        nb_init_cond = nb_init_cond.replace("__DATA__", location)
                    else:
                        types = [type_refs[d_type] for d_type in s_init_cond['types']]
                        restrict_to = f"types=[{', '.join(types)}]"
                        nb_init_cond = nb_init_cond.replace("__DATA__", restrict_to)
                    init_cond.append(nb_init_cond)
                init_cond.append(f"{pad}model.add_initial_condition([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(init_cond))
                index += 1
            except KeyError as err:
                message = "Initial Conditions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_spatial_model_cell(self, func_name):
        pad = '    '
        frequency = self.s_model['modelSettings']['timeStep']
        end = self.s_model['modelSettings']['endSim']
        timestep_size = self.s_model['modelSettings']['timestepSize']
        nb_model = [
            f"def {func_name}(parameter_values=None):",
            f"{pad}model = spatialpy.Model(name='{self.s_model['name']}')",
            "", f"{pad}# Timespan",
            f"{pad}tspan = spatialpy.TimeSpan.arange({frequency}, t={end}, timestep_size={timestep_size})",
            f"{pad}model.timespan(tspan)", f"{pad}return model"
        ]
        type_refs = self.__get_object_types()
        index = self.__create_spatial_domain(nb_model, 2)
        index = self.__create_spatial_species(nb_model, index, type_refs)
        index = self.__create_spatial_initial_condition(nb_model, index, type_refs)
        index = self.__create_parameters(nb_model, index)
        index = self.__create_reactions(nb_model, index, type_refs=type_refs)
        index = self.__create_spatial_boundary_conditions(nb_model, index)
        return nbf.new_code_cell("\n".join(nb_model))

    def __create_spatial_species(self, nb_model, index, type_refs):
        if len(self.s_model['species']) > 0:
            pad = '    '
            args_tmp = "name='__NAME__', diffusion_coefficient=__VALUE____RESTRICT_TO__"
            tmp = f"{pad}__NAME__ = spatialpy.Species({args_tmp})"
            names = []
            n_len = 8
            species = ["", f"{pad}# Variables"]
            try:
                for s_species in self.s_model['species']:
                    name = s_species['name']
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_spec = tmp.replace("__NAME__", name)
                    nb_spec = nb_spec.replace("__VALUE__", str(s_species['diffusionConst']))
                    if len(s_species['types']) == len(type_refs):
                        nb_spec = nb_spec.replace("__RESTRICT_TO__", "")
                    else:
                        types = [type_refs[d_type] for d_type in s_species['types']]
                        restrict_to = f", restrict_to=[{', '.join(types)}]"
                        nb_spec = nb_spec.replace("__RESTRICT_TO__", restrict_to)
                    species.append(nb_spec)
                species.append(f"{pad}model.add_species([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(species))
                index += 1
            except KeyError as err:
                message = "Species are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_stoich_species(self, stoich_species):
        species = {}
        for stoich_spec in stoich_species:
            name = stoich_spec['specie']['name']
            if name in species:
                species[name] += stoich_spec['ratio']
            else:
                species[name] = stoich_spec['ratio']
        return str(species)

    def __create_well_mixed_events(self, nb_model, index):
        if self.s_model['eventsCollection']:
            pad = '    '
            l1_args = f"{pad*2}name='__NAME__', trigger=__TRIGGER__,"
            l2_args = f"{pad*2}assignments=__ASSIGNMENTS__,"
            l3_args = f"{pad*2}delay=__DELAY__, priority='__PRIORITY__',"
            l4_args = f"{pad*2}use_values_from_trigger_time=__UVFTT__"
            args = f"{l1_args}\n{l2_args}\n{l3_args}\n{l4_args}"
            tmp = f"{pad}__NAME__ = gillespy2.Event(\n{args}\n{pad})"
            names = []
            n_len = 8
            triggers = ["", f"{pad}# Event Triggers"]
            assignments = ["", f"{pad}# Event Assignments"]
            events = ["", f"{pad}# Events"]
            try:
                for s_event in self.s_model['eventsCollection']:
                    name = s_event['name']
                    t_name, nb_trigger = self.__create_well_mixed_event_trigger(s_event)
                    triggers.append(nb_trigger)
                    a_names, nb_assignments = self.__create_well_mixed_event_assignments(s_event)
                    assignments.extend(nb_assignments)
                    delay = "None" if s_event['delay'] is None else f"'{s_event['delay']}'"

                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names

                    nb_event = tmp.replace("__NAME__", name)
                    nb_event = nb_event.replace("__TRIGGER__", t_name)
                    nb_event = nb_event.replace("__ASSIGNMENTS__", a_names)
                    nb_event = nb_event.replace("__DELAY__", delay)
                    nb_event = nb_event.replace("__PRIORITY__", s_event['priority'])
                    nb_event = nb_event.replace(
                        "__UVFTT__", str(s_event['useValuesFromTriggerTime'])
                    )
                    events.append(nb_event)
                events.append(f"{pad}model.add_event([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(triggers))
                index += 1
                nb_model.insert(index, '\n'.join(assignments))
                index += 1
                nb_model.insert(index, '\n'.join(events))
                index += 1
            except KeyError as err:
                message = "Events are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_well_mixed_event_assignments(self, s_event):
        pad = '    '
        args = f"{pad*2}name='__NAME__', variable='__VAR__',\n{pad*2}expression='__EXPRESSION__'"
        tmp = f"{pad}__NAME__ = gillespy2.EventAssignment(\n{args}\n{pad})"
        names = []
        n_len = 8
        assignments = []
        for i, s_assignment in enumerate(s_event['eventAssignments']):
            name = f"{s_event['name']}_assign_{i + 1}"
            n_len, n_names = self.__add_name(names, n_len, name, max_len=87)
            if n_names is not None:
                names = n_names
            nb_assignment = tmp.replace("__NAME__", name)
            nb_assignment = nb_assignment.replace("__VAR__", s_assignment['variable']['name'])
            nb_assignment = nb_assignment.replace("__EXPRESSION__", s_assignment['expression'])
            assignments.append(nb_assignment)
        return f"[{', '.join(names)}]", assignments

    def __create_well_mixed_event_trigger(self, s_event):
        pad = '    '
        name = f"{s_event['name']}_trig"
        value = s_event['initialValue']
        persistent = s_event['persistent']
        l1_args = f"{pad*2}expression='{s_event['triggerExpression']}',"
        l2_args = f"{pad*2}initial_value={value}, persistent={persistent}"
        nb_trig = f"{pad}{name} = gillespy2.EventTrigger(\n{l1_args}\n{l2_args}\n{pad})"
        return name, nb_trig

    def __create_well_mixed_function_definition(self, nb_model, index):
        if self.s_model['functionDefinitions']:
            pad = '    '
            args_tmp = f"{pad*2}name='__NAME__', args=__ARGS__,\n{pad*2}function='__FUNCTION__'"
            tmp = f"{pad}__NAME__ = gillespy2.FunctionDefinition(\n{args_tmp}\n{pad})"
            names = []
            n_len = 8
            func_defs = ["", f"{pad}# Function Definitions"]
            try:
                for s_func_def in self.s_model['functionDefinitions']:
                    name = s_func_def['name']
                    args = str(s_func_def['variables'].split(','))
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_func_def = tmp.replace("__NAME__", name)
                    nb_func_def = nb_func_def.replace("__ARGS__", args)
                    nb_func_def = nb_func_def.replace("__FUNCTION__", s_func_def['expression'])
                    func_defs.append(nb_func_def)
                func_defs.append(
                    f"{pad}model.add_function_definition([\n{pad*2}{', '.join(names)}\n{pad}])"
                )
                nb_model.insert(index, '\n'.join(func_defs))
                index += 1
            except KeyError as err:
                message = "Function definitions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_well_mixed_model_cell(self, func_name):
        pad = '    '
        frequency = self.s_model['modelSettings']['timeStep']
        end = self.s_model['modelSettings']['endSim']
        nb_model = [
            f"def {func_name}(parameter_values=None):",
            f"{pad}model = gillespy2.Model(name='{self.s_model['name']}')",
            f"{pad}model.volume = {self.s_model['volume']}",
            "", f"{pad}# Timespan",
            f"{pad}tspan = gillespy2.TimeSpan.arange({frequency}, t={end})",
            f"{pad}model.timespan(tspan)", f"{pad}return model"
        ]
        index = self.__create_well_mixed_species(nb_model, 3)
        index = self.__create_parameters(nb_model, index)
        index = self.__create_reactions(nb_model, index)
        index = self.__create_well_mixed_rules(nb_model, index)
        index = self.__create_well_mixed_events(nb_model, index)
        index = self.__create_well_mixed_function_definition(nb_model, index)
        return nbf.new_code_cell("\n".join(nb_model))

    def __create_well_mixed_species(self, nb_model, index):
        if len(self.s_model['species']) > 0:
            pad = '    '
            args_tmp = "name='__NAME__', initial_value=__VALUE__, mode='__MODE__'"
            tmp = f"{pad}__NAME__ = gillespy2.Species({args_tmp})"
            names = []
            n_len = 8
            species = ["", f"{pad}# Variables"]
            try:
                for s_species in self.s_model['species']:
                    name = s_species['name']
                    n_len, n_names = self.__add_name(names, n_len, name)
                    if n_names is not None:
                        names = n_names
                    nb_spec = tmp.replace("__NAME__", name)
                    nb_spec = nb_spec.replace("__VALUE__", str(s_species['value']))
                    nb_spec = nb_spec.replace("__MODE__", s_species['mode'])
                    species.append(nb_spec)
                species.append(f"{pad}model.add_species([\n{pad*2}{', '.join(names)}\n{pad}])")
                nb_model.insert(index, '\n'.join(species))
                index += 1
            except KeyError as err:
                message = "Species are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __create_well_mixed_rules(self, nb_model, index):
        if self.s_model['rules']:
            pad = '    '
            args_tmp = f"{pad*2}name='__NAME__', variable='__VAR__',\n{pad*2}formula='__FORMULA__'"
            tmp = f"{pad}__NAME__ = gillespy2.__TYPE__(\n{args_tmp}\n{pad})"
            rr_names = []
            ar_names = []
            rr_n_len = 8
            ar_n_len = 8
            rate_rules = ["", f"{pad}# Rate Rules"]
            assignment_rules = ["", f"{pad}# Assignment Rules"]
            try:
                for s_rule in self.s_model['rules']:
                    name = s_rule['name']
                    nb_rule = tmp.replace("__NAME__", s_rule["name"])
                    nb_rule = nb_rule.replace("__FORMULA__", s_rule["expression"])
                    nb_rule = nb_rule.replace("__VAR__", s_rule["variable"]["name"])
                    if s_rule['type'] == "Rate Rule":
                        rr_n_len, n_names = self.__add_name(rr_names, rr_n_len, name)
                        if n_names is not None:
                            rr_names = n_names
                        nb_rule = nb_rule.replace("__TYPE__", "RateRule")
                        rate_rules.append(nb_rule)
                    else:
                        ar_n_len, n_names = self.__add_name(ar_names, ar_n_len, name)
                        if n_names is not None:
                            ar_names = n_names
                        nb_rule = nb_rule.replace("__TYPE__", "AssignmentRule")
                        assignment_rules.append(nb_rule)
                if len(rate_rules) > 2:
                    rate_rules.append(
                        f"{pad}model.add_rate_rule([\n{pad*2}{', '.join(rr_names)}\n{pad}])"
                    )
                    nb_model.insert(index, '\n'.join(rate_rules))
                    index += 1
                if len(assignment_rules) > 2:
                    assignment_rules.append(
                        f"{pad}model.add_assignment_rule([\n{pad*2}{', '.join(ar_names)}\n{pad}])"
                    )
                    nb_model.insert(index, '\n'.join(assignment_rules))
                    index += 1
            except KeyError as err:
                message = "Rules are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index

    def __get_gillespy2_run_settings(self, use_solver=False):
        # is_automatic = self.settings['simulationSettings']['isAutomatic']
        # if self.nb_type in (self.PARAMETER_SWEEP_1D, self.PARAMETER_SWEEP_2D) and is_automatic:
        #     self.settings['simulationSettings']['realizations'] = 20
        settings = self.settings['simulationSettings']
        # Map algorithm settings for GillesPy2. GillesPy2 requires snake case, remap camelCase
        settings_map = {
            "number_of_trajectories": settings['realizations'],
            "seed": settings['seed'] if settings['seed'] != -1 else None,
            "tau_tol": settings['tauTol'],
            "integrator_options": str({
                "rtol":settings['relativeTol'],
                "atol":settings['absoluteTol']
            })
        }
        if use_solver:
            settings_map['solver'] = "solver"
        elif settings['algorithm'] == "Hybrid-Tau-Leaping":
            settings_map['algorithm'] = "'Tau-Hybrid'"
        else:
            settings_map['algorithm'] = f"'{settings['algorithm']}'"
        return settings_map

    def __get_object_types(self):
        types = sorted(self.s_model['domain']['types'], key=lambda d_type: d_type['typeID'])
        type_map = {}
        for d_type in types:
            if d_type['typeID'] > 0:
                type_map[d_type['typeID']] = f"model.{d_type['name'].upper()}"
        return type_map

    @classmethod
    def __get_presentation_links(cls, hostname, file):
        query_str = f"?owner={hostname}&file={file}"
        present_link = f"/stochss/present-notebook{query_str}"
        dl_link_base = "/stochss/notebook/download_presentation"
        download_link = os.path.join(dl_link_base, hostname, file)
        open_link = f"https://open.stochss.org?open={download_link}"
        return {"presentation": present_link, "download": download_link, "open": open_link}

    def __get_spatialpy_run_setting(self):
        settings = self.settings['simulationSettings']
        return {
            "number_of_trajectories":settings['realizations'],
            "seed":settings['seed'] if settings['seed'] != -1 else None
        }

    def create_common_cells(self):
        ''' Create the cells common to all notebook types. '''
        func_name = self.get_function_name()
        cells = self.__create_common_header_cells()
        cells.insert(3, nbf.new_code_cell(f"model = {func_name}()"))
        if self.nb_type == self.SPATIAL_SIMULATION:
            cells.insert(1, nbf.new_code_cell("import spatialpy"))
            index = self.__create_spatial_boundary_condition_cells(cells)
            cells.insert(index, self.__create_spatial_model_cell(func_name))
        else:
            cells.insert(1, nbf.new_code_cell("import gillespy2"))
            cells.insert(3, self.__create_well_mixed_model_cell(func_name))
        cells.append(self.__create_configuration_cell())
        return cells

    def create_es_notebook(self, results=None):
        '''Create an ensemble simulation jupiter notebook for a StochSS model/workflow '''
        self.nb_type = self.ENSEMBLE_SIMULATION
        cells = self.create_common_cells()

        self.settings['solver'] = self.get_gillespy2_solver_name()
        if results is not None:
            cells.insert(1, nbf.new_code_cell("import os\nimport pickle"))
        run_header, run_code = self.__create_run(results)
        vis_header = nbf.new_markdown_cell("***\n## Visualization\n***")
        vis_code = nbf.new_code_cell("results.plotplotly()")
        cells.extend([run_header, run_code, vis_header, vis_code])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_ses_notebook(self, results=None):
        '''Create a spetial ensemble simulation jupiter notebook for a StochSS model/workflow '''
        self.nb_type = self.SPATIAL_SIMULATION
        cells = self.create_common_cells()

        self.settings['solver'] = "Solver"
        if results is not None:
            cells.insert(1, nbf.new_code_cell("import os\nimport pickle"))
        run_header, run_code = self.__create_run(results)
        vis_header = nbf.new_markdown_cell("***\n## Visualization\n***")
        plt_args = "animated=True, width='auto', height='auto'"
        if len(self.s_model['species']) > 0:
            species = self.s_model['species'][0]['name']
            plot_str = f"results.plot_species('{species}', {plt_args})"
        else:
            plot_str = f"results.plot_property('type', {plt_args})"
        vis_code = nbf.new_code_cell(plot_str)
        cells.extend([run_header, run_code, vis_header, vis_code])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def get_function_name(self):
        ''' Get the python style class name, '''
        name = self.s_model['name'].lower()
        for char in string.punctuation:
            if char != "_":
                name = name.replace(char, "")
        return f"create_{name.replace(' ', '_')}"

    def get_gillespy2_solver_name(self):
        ''' Get the name of the gillespy2 solver. '''
        if self.settings['simulationSettings']['isAutomatic']:
            solver = self.model.get_best_solver().name
            self.settings['simulationSettings']['algorithm'] = self.SOLVER_MAP[solver]
            return solver
        algorithm_map = {
            'ODE': self.model.get_best_solver_algo("ODE").name,
            'SSA': self.model.get_best_solver_algo("SSA").name,
            'CLE': self.model.get_best_solver_algo("CLE").name,
            'Tau-Leaping': self.model.get_best_solver_algo("Tau-Leaping").name,
            'Hybrid-Tau-Leaping': self.model.get_best_solver_algo("Tau-Hybrid").name
        }
        return algorithm_map[self.settings['simulationSettings']['algorithm']]

    def load(self):
        '''Read the notebook file and return as a dict'''
        try:
            with open(self.get_path(full=True), "r", encoding="utf-8") as notebook_file:
                return json.load(notebook_file)
        except FileNotFoundError as err:
            message = f"Could not find the notebook file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err

    def publish_presentation(self):
        '''Publish a notebook presentation'''
        present_dir = os.path.join(self.user_dir, ".presentations")
        if not os.path.exists(present_dir):
            os.mkdir(present_dir)
        try:
            notebook_pres = {"notebook": self.load(), "file": self.get_file()}
            safe_chars = set(string.ascii_letters + string.digits)
            hostname = escape(os.environ.get('JUPYTERHUB_USER'), safe=safe_chars)
            nb_str = json.dumps(notebook_pres['notebook'], sort_keys=True)
            file = f"{hashlib.md5(nb_str.encode('utf-8')).hexdigest()}.ipynb"
            dst = os.path.join(present_dir, file)
            if os.path.exists(dst):
                exists = True
            else:
                self.add_presentation_name(file, self.get_name())
                exists = False
                with open(dst, "w", encoding="utf-8") as presentation_file:
                    json.dump(notebook_pres, presentation_file)
            links = self.__get_presentation_links(hostname, file)
            return links, exists
        except PermissionError as err:
            message = f"You do not have permission to publish this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err

    def write_notebook_file(self, cells):
        '''Write the new notebook file to disk

        Attributes
        ----------
        cells : list
            List of cells for the new notebook'''
        path = self.get_path(full=True)
        notebook = nbf.new_notebook(cells=cells)
        with open(path, 'w', encoding="utf-8") as file:
            nbformat.write(notebook, file, version=4)
        return f"Successfully created the notebook {self.get_file()}"
