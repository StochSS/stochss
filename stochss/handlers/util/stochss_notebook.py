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

import json
import string
import traceback
import nbformat
from nbformat import v4 as nbf

from gillespy2.solvers.utilities.cpp_support_test import check_cpp_support

from .stochss_base import StochSSBase
from .stochss_errors import StochSSAPIError, StochSSFileNotFoundError, StochSSModelFormatError

class StochSSNotebook(StochSSBase):
    '''
    ################################################################################################
    StochSS notebook object
    ################################################################################################
    '''

    ENSEMBLE_SIMULATION = 1
    PARAMETER_SWEEP = 2
    SOLVER_MAP = {"SSACSolver":"SSA", "NumPySSASolver":"SSA", "VariableSSACSolver":"V-SSA",
                  "TauLeapingSolver":"Tau-Leaping", "TauHybridSolver":"Hybrid-Tau-Leaping",
                  "ODESolver":"ODE"}

    def __init__(self, path, new=False, models=None, settings=None):
        '''
        Intitialize a notebook object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the notebook
        '''
        super().__init__(path=path)
        if new:
            self.is_ssa_c = check_cpp_support()
            self.nb_type = 0
            self.s_model = models["s_model"]
            self.g_model = models["g_model"]
            self.settings = self.get_settings_template() if settings is None else settings
            self.make_parent_dirs()
            n_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = n_path.replace(self.user_dir + '/', "")


    def __create_configuration_cell(self):
        pad = "    "
        config = ["def configure_simulation():"]
        # Add solver instantiation line if the c solver are available
        instance_solvers = ["SSACSolver", "VariableSSACSolver"]
        is_automatic = self.settings['simulationSettings']['isAutomatic']
        if self.is_ssa_c and self.settings['solver'] in instance_solvers:
            start = f"{pad}# " if is_automatic else pad
            config.append(f"{start}solver = {self.settings['solver']}(model=model)")
        config.append(pad + "kwargs = {")
        settings = self.__get_gillespy2_run_settings()
        settings_lists = {"ODE":['"solver"', '"integrator_options"'],
                          "SSA":['"seed"', '"number_of_trajectories"'],
                          "V-SSA":['"solver"', '"seed"', '"number_of_trajectories"'],
                          "Tau-Leaping":['"solver"', '"seed"', '"number_of_trajectories"',
                                         '"tau_tol"'],
                          "Hybrid-Tau-Leaping":['"solver"', '"seed"', '"number_of_trajectories"',
                                                '"tau_tol"', '"integrator_options"']}
        algorithm = self.settings['simulationSettings']['algorithm']
        for setting in settings:
            start = pad*2
            if is_automatic or setting.split(':')[0] not in settings_lists[algorithm]:
                start = f"{start}# "
            config.append(f"{start}{setting},")
        config.extend([pad + "}", f"{pad}return kwargs"])
        return nbf.new_code_cell("\n".join(config))


    def __create_event_strings(self, model, pad):
        if self.s_model['eventsCollection']:
            triggers = ["", f"{pad}# Event Triggers"]
            assignments = ["", f"{pad}# Event Assignments"]
            events = ["", f"{pad}# Events"]
            try:
                for event in self.s_model['eventsCollection']:
                    t_name = self.__create_event_trigger_string(triggers=triggers, event=event,
                                                                pad=pad)
                    a_names = self.__create_event_assignment_strings(assignments=assignments,
                                                                     event=event, pad=pad)
                    delay = event['delay'] if event['delay'] else None
                    ev_str = f'{pad}self.add_event(Event(name="{event["name"]}", '
                    ev_str += f'trigger={t_name}, assignments=[{a_names}], '
                    ev_str += f'delay="{delay}", priority="{event["priority"]}", '
                    ev_str += f'use_values_from_trigger_time={event["useValuesFromTriggerTime"]}))'
                    events.append(ev_str)
                model.extend(triggers)
                model.extend(assignments)
                model.extend(events)
            except KeyError as err:
                message = "Events are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    @classmethod
    def __create_event_assignment_strings(cls, assignments, event, pad):
        names = []
        for i, assignment in enumerate(event['eventAssignments']):
            name = f'{event["name"]}_assign_{i+1}'
            names.append(name)
            assign_str = f'{pad}{name} = EventAssignment(variable="{assignment["variable"]["name"]}'
            assign_str += f'", expression="{assignment["expression"]}")'
            assignments.append(assign_str)
        return ', '.join(names)


    @classmethod
    def __create_event_trigger_string(cls, triggers, event, pad):
        name = f'{event["name"]}_trig'
        trig_str = f'{pad}{name} = EventTrigger(expression="{event["triggerExpression"]}", '
        trig_str += f'initial_value={event["initialValue"]}, persistent={event["persistent"]})'
        triggers.append(trig_str)
        return name


    def __create_function_definition_strings(self, model, pad):
        if self.s_model['functionDefinitions']:
            func_defs = ["", f"{pad}# Function Definitions"]
            try:
                for func_def in self.s_model['functionDefinitions']:
                    fd_str = f'{pad}self.add_function_definition(FunctionDefinition('
                    fd_str += f'name="{func_def["name"]}", function="{func_def["expression"]}", '
                    fd_str += f'args={func_def["variables"].split(", ")}))'
                    func_defs.append(fd_str)
                model.extend(func_defs)
            except KeyError as err:
                message = "Function definitions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    def __create_import_cell(self, interactive_backend=False):
        try:
            imports = ["import numpy as np"]
            if interactive_backend:
                imports.append("%matplotlib notebook")
            if self.s_model['is_spatial']:
                imports.append("import spatialPy")
                return nbf.new_code_cell("\n".join(imports))
            imports.append("import gillespy2")
            imports.append("from gillespy2 import Model, Species, Parameter, Reaction, Event, \\")
            imports.append("                      EventTrigger, EventAssignment, RateRule, \\")
            imports.append("                      AssignmentRule, FunctionDefinition")
            ssa = "SSACSolver" if self.is_ssa_c else "NumPySSASolver"
            algorithm_map = {'SSA': f'from gillespy2 import {ssa}',
                             'V-SSA': 'from gillespy2 import VariableSSACSolver',
                             'Tau-Leaping': 'from gillespy2 import TauLeapingSolver',
                             'Hybrid-Tau-Leaping': 'from gillespy2 import TauHybridSolver',
                             'ODE': 'from gillespy2 import ODESolver'}
            is_automatic = self.settings['simulationSettings']['isAutomatic']
            algorithm = self.settings['simulationSettings']['algorithm']
            for name, alg_import in algorithm_map.items():
                if not is_automatic and name == algorithm:
                    imports.append(alg_import)
                else:
                    imports.append(f"# {alg_import}")
            return nbf.new_code_cell("\n".join(imports))
        except KeyError as err:
            message = "Workflow settings are not properly formatted or "
            message += f"are referenced incorrectly for notebooks: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc())


    def __create_model_cell(self):
        if self.s_model['is_spatial']:
            reason = "Function Not Supported"
            message = "Spatial not yet implemented."
            raise StochSSAPIError(403, reason, message, traceback.format_exc())
        pad = '        '
        model = [f"class {self.__get_class_name()}(Model):",
                 "    def __init__(self, parameter_values=None):",
                 f'{pad}Model.__init__(self, name="{self.get_name()}")',
                 f"{pad}self.volume = {self.s_model['volume']}"]
        self.__create_parameter_strings(model=model, pad=pad)
        self.__create_species_strings(model=model, pad=pad)
        self.__create_reaction_strings(model=model, pad=pad)
        self.__create_event_strings(model=model, pad=pad)
        self.__create_rules_strings(model=model, pad=pad)
        self.__create_function_definition_strings(model=model, pad=pad)
        self.__create_tspan_string(model=model, pad=pad)
        return nbf.new_code_cell("\n".join(model))


    def __create_parameter_strings(self, model, pad):
        if self.s_model['parameters']:
            parameters = ["", f"{pad}# Parameters"]
            try:
                for param in self.s_model['parameters']:
                    param_str = f'{pad}self.add_parameter(Parameter(name="{param["name"]}", '
                    param_str += f'expression="{param["expression"]}"))'
                    parameters.append(param_str)
                model.extend(parameters)
            except KeyError as err:
                message = "Parameters are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    def __create_reaction_strings(self, model, pad):
        if self.s_model['reactions']:
            reactions = ["", f"{pad}# Reactions"]
            try:
                for reac in self.s_model['reactions']:
                    react_str = self.__create_stoich_spec_string(stoich_species=reac['reactants'])
                    prod_str = self.__create_stoich_spec_string(stoich_species=reac['products'])
                    reac_str = f'{pad}self.add_reaction(Reaction(name="{reac["name"]}", '
                    reac_str += f'reactants={react_str}, products={prod_str}, '
                    if reac['reactionType'] == 'custom-propensity':
                        reac_str += f'propensity_function="{reac["propensity"]}"))'
                    else:
                        reac_str += f'rate=self.listOfParameters["{reac["rate"]["name"]}"]))'
                    reactions.append(reac_str)
                model.extend(reactions)
            except KeyError as err:
                message = "Reactions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    def __create_rules_strings(self, model, pad):
        if self.s_model['rules']:
            rate_rules = ["", f"{pad}# Rate Rules"]
            assignment_rules = ["", f"{pad}# Assignment Rules"]
            rr_start = "self.add_rate_rule(RateRule"
            ar_start = "self.add_assignment_rule(AssignmentRule"
            try:
                for rule in self.s_model['rules']:
                    start = rr_start if rule['type'] == "Rate Rule" else ar_start
                    rule_str = f'{pad}{start}(name="{rule["name"]}", formula="{rule["expression"]}"'
                    rule_str += f', variable="{rule["variable"]["name"]}"))'
                    if rule['type'] == "Rate Rule":
                        rate_rules.append(rule_str)
                    else:
                        assignment_rules.append(rule_str)
                if len(rate_rules) > 2:
                    model.extend(rate_rules)
                if len(assignment_rules) > 2:
                    model.extend(assignment_rules)
            except KeyError as err:
                message = "Rules are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    def __create_species_strings(self, model, pad):
        if self.s_model['species']:
            species = ["", f"{pad}# Variables"]
            try:
                for spec in self.s_model['species']:
                    spec_str = f'{pad}self.add_species(Species(name="{spec["name"]}", '
                    spec_str += f'initial_value={spec["value"]}, mode="{spec["mode"]}"))'
                    species.append(spec_str)
                model.extend(species)
            except KeyError as err:
                message = "Species are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc())


    @classmethod
    def __create_stoich_spec_string(cls, stoich_species):
        species = {}
        for stoich_spec in stoich_species:
            name = stoich_spec['specie']['name']
            if name in species.keys():
                species[name] += stoich_spec['ratio']
            else:
                species[name] = stoich_spec['ratio']
        return str(species)


    def __create_tspan_string(self, model, pad):
        end = self.s_model['modelSettings']['endSim']
        step = self.s_model['modelSettings']['timeStep']
        tspan = ["", f"{pad}# Timespan",
                 f'{pad}self.timespan(np.arange(0, {end}, {step}))']
        model.extend(tspan)


    def __get_class_name(self):
        name = self.get_name()
        for char in string.punctuation:
            name = name.replace(char, "")
        l_char = name[0]
        if l_char in string.digits:
            return f"M{name}"
        if l_char in string.ascii_lowercase:
            return name.replace(l_char, l_char.upper(), 1)
        return name


    def __get_gillespy2_run_settings(self, is_mdl_inf=False):
        settings = self.settings['simulationSettings']
        # Map algorithm for GillesPy2
        ssa_solver = "solver" if self.is_ssa_c else "NumPySSASolver"
        solver_map = {"SSA":f'"solver":{ssa_solver}',
                      "V-SSA":'"solver":solver',
                      "ODE":'"solver":ODESolver',
                      "Tau-Leaping":'"solver":TauLeapingSolver',
                      "Hybrid-Tau-Leaping":'"solver":TauHybridSolver'}
        # Map number_of_trajectories for model inference
        if is_mdl_inf and settings['realizations'] < 30:
            settings['realizations'] = 100
        # Map algorithm settings for GillesPy2. GillesPy2 requires snake case, remap camelCase
        settings_map = {"number_of_trajectories":settings['realizations'],
                        "seed":settings['seed'] if settings['seed'] != -1 else None,
                        "tau_tol":settings['tauTol'],
                        "integrator_options":str({"rtol":settings['relativeTol'],
                                                  "atol":settings['absoluteTol']})}
        #Parse settings for algorithm
        run_settings = [solver_map[settings['algorithm']]]
        algorithm_settings = [f'"{key}":{val}' for key, val in settings_map.items()]
        run_settings.extend(algorithm_settings)
        return run_settings


    def __get_gillespy2_solver_name(self):
        if self.settings['simulationSettings']['isAutomatic']:
            precompile = self.nb_type > 1
            solver = self.g_model.get_best_solver(precompile=precompile).name
            self.settings['simulationSettings']['algorithm'] = self.SOLVER_MAP[solver]
            return solver
        algorithm_map = {'SSA': "SSACSolver" if self.is_ssa_c else "NumPySSASolver",
                         'V-SSA': 'VariableSSACSolver',
                         'Tau-Leaping': 'TauLeapingSolver',
                         'Hybrid-Tau-Leaping': 'TauHybridSolver',
                         'ODE': 'ODESolver'}
        return algorithm_map[self.settings['simulationSettings']['algorithm']]


    def create_es_notebook(self):
        '''
        Create an ensemble simulation jupiter notebook for a StochSS model/workflow

        Attributes
        ----------
        '''
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        self.nb_type = self.ENSEMBLE_SIMULATION
        run_str = "kwargs = configure_simulation()\nresults = model.run(**kwargs)"
        cells = [nbf.new_markdown_cell(f"# {self.get_name()}"),
                 self.__create_import_cell(),
                 self.__create_model_cell(),
                 nbf.new_code_cell(f'model = {self.__get_class_name()}()'),
                 self.__create_configuration_cell(),
                 nbf.new_code_cell(run_str),
                 nbf.new_code_cell("results.plotplotly()")]

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}


    def load(self):
        '''
        Read the notebook file and return as a dict

        Attributes
        ----------
        '''
        try:
            with open(self.get_path(full=True), "r") as notebook_file:
                return json.load(notebook_file)
        except FileNotFoundError as err:
            message = f"Could not find the notebook file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


    def write_notebook_file(self, cells):
        '''
        Write the new notebook file to disk

        Attributes
        ----------
        cells : list
            List of cells for the new notebook
        '''
        path = self.get_path(full=True)
        notebook = nbf.new_notebook(cells=cells)
        with open(path, 'w') as file:
            nbformat.write(notebook, file, version=4)
        return f"Successfully created the notebook {self.get_file()}"
