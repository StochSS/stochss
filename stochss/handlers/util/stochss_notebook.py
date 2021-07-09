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
import string
import hashlib
import traceback
import nbformat
from escapism import escape
from nbformat import v4 as nbf

from gillespy2.solvers.utilities.cpp_support_test import check_cpp_support

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError, StochSSModelFormatError, \
                            StochSSPermissionsError, StochSSFileExistsError

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
                  "ODECSolver":"ODE", "TauLeapingCSolver":"Tau-Leaping"}

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

    def __create_boundary_condition_cells(self):
        pad = "    "
        bc_cells = []
        try:
            for boundary_condition in self.s_model['boundaryConditions']:
                bc_cell = [f'class {boundary_condition["name"]}(BoundaryCondition):',
                           f'{pad}def expression(self):',
                           f'{pad*2}return """{boundary_condition["expression"]}"""']
                bc_cells.append(nbf.new_code_cell("\n".join(bc_cell)))
            return bc_cells
        except KeyError as err:
            message = "Boundary conditions are not properly formatted or "
            message += f"are referenced incorrectly for notebooks: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_boundary_condition_string(self, model, pad):
        if self.s_model['boundaryConditions']:
            bound_conds = ["", f"{pad}# Boundary Conditions"]
            try:
                for bound_cond in self.s_model['boundaryConditions']:
                    bc_str = f"{pad}self.add_boundary_condition({bound_cond['name']}())"
                    bound_conds.append(bc_str)
                model.extend(bound_conds)
            except KeyError as err:
                message = "Boundary conditions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_common_cells(self, interactive_backend=False):
        cells = [self.__create_import_cell(interactive_backend=interactive_backend),
                 nbf.new_markdown_cell(f"# {self.get_name()}"),
                 self.__create_model_cell(),
                 nbf.new_code_cell(f'model = {self.__get_class_name()}()'),
                 nbf.new_markdown_cell("# Simulation Parameters"),
                 self.__create_configuration_cell()]
        return cells

    def __create_configuration_cell(self):
        pad = "    "
        config = ["def configure_simulation():"]
        # Add solver instantiation line if the c solver are available
        instance_solvers = ["SSACSolver", "ODECSolver", "TauLeapingCSolver"]
        is_automatic = self.settings['simulationSettings']['isAutomatic']
        if self.settings['solver'] in instance_solvers:
            if is_automatic and self.nb_type <= self.ENSEMBLE_SIMULATION:
                commented = True
            elif is_automatic and self.settings['solver'] not in instance_solvers:
                commented = True
            else:
                commented = False
            start = f"{pad}# " if commented else pad
            config.append(f"{start}solver = {self.settings['solver']}(model=model)")
        config.append(pad + "kwargs = {")
        if self.s_model['is_spatial']:
            settings = self.__get_spatialpy_run_setting()
        else:
            settings = self.__get_gillespy2_run_settings()
        settings_lists = {"ODE":['"solver"', '"integrator_options"'],
                          "SSA":['"solver"', '"seed"', '"number_of_trajectories"'],
                          "Tau-Leaping":['"solver"', '"seed"', '"number_of_trajectories"',
                                         '"tau_tol"'],
                          "Hybrid-Tau-Leaping":['"solver"', '"seed"', '"number_of_trajectories"',
                                                '"tau_tol"', '"integrator_options"']}
        algorithm = self.settings['simulationSettings']['algorithm']
        is_spatial = self.s_model['is_spatial']
        for setting in settings:
            key = setting.split(':')[0]
            if self.nb_type > self.ENSEMBLE_SIMULATION and key == '"solver"' and \
                                                self.settings['solver'] in instance_solvers:
                start = pad*2
            elif key not in settings_lists[algorithm]:
                start = f"{pad*2}# "
            elif is_automatic and not is_spatial and key == '"number_of_trajectories"':
                start = pad*2
            elif is_automatic:
                start = f"{pad*2}# "
            else:
                start = pad*2
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
                    delay = f'"{event["delay"]}"' if event['delay'] else None
                    ev_str = f'{pad}self.add_event(Event(name="{event["name"]}", '
                    ev_str += f'trigger={t_name}, assignments=[{a_names}], '
                    ev_str += f'delay={delay}, priority="{event["priority"]}", '
                    ev_str += f'use_values_from_trigger_time={event["useValuesFromTriggerTime"]}))'
                    events.append(ev_str)
                model.extend(triggers)
                model.extend(assignments)
                model.extend(events)
            except KeyError as err:
                message = "Events are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

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
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_import_cell(self, interactive_backend=False):
        try:
            is_automatic = self.settings['simulationSettings']['isAutomatic']
            if self.nb_type == self.SPATIAL_SIMULATION:
                imports = ["%load_ext autoreload", "%autoreload 2", "", "import numpy as np"]
            else:
                imports = ["import numpy as np"]
            if interactive_backend:
                imports.append("%matplotlib notebook")
            if self.s_model['is_spatial']:
                imports.append("import spatialpy")
                imports.append("from spatialpy import Model, Species, Parameter, Reaction, Mesh,\\")
                imports.append("                      PlaceInitialCondition, \\")
                imports.append("                      UniformInitialCondition, \\")
                imports.append("                      ScatterInitialCondition")
                return nbf.new_code_cell("\n".join(imports))
            imports.append("import gillespy2")
            imports.append("from gillespy2 import Model, Species, Parameter, Reaction, Event, \\")
            imports.append("                      EventTrigger, EventAssignment, RateRule, \\")
            imports.append("                      AssignmentRule, FunctionDefinition")
            ssa_import = f'from gillespy2 import {self.model.get_best_solver_algo("SSA").name}'
            tau_import = 'from gillespy2 import '
            tau_import += f'{self.model.get_best_solver_algo("Tau-Leaping").name}'
            ode_import = f'from gillespy2 import {self.model.get_best_solver_algo("ODE").name}'
            algorithm_map = {'SSA': ssa_import, 'Tau-Leaping': tau_import, 'ODE': ode_import,
                             'Hybrid-Tau-Leaping': 'from gillespy2 import TauHybridSolver'}
            algorithm = self.settings['simulationSettings']['algorithm']
            for name, alg_import in algorithm_map.items():
                if not is_automatic and name == algorithm:
                    imports.append(alg_import)
                elif name == algorithm and self.nb_type > self.ENSEMBLE_SIMULATION and \
                                                            name == "SSA":
                    imports.append(alg_import)
                else:
                    imports.append(f"# {alg_import}")
            return nbf.new_code_cell("\n".join(imports))
        except KeyError as err:
            message = "Workflow settings are not properly formatted or "
            message += f"are referenced incorrectly for notebooks: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_initial_condition_strings(self, model, pad):
        if self.s_model['initialConditions']:
            ic_types = {"Place":"PlaceInitialCondition", "Scatter":"ScatterInitialCondition",
                        "Distribute Uniformly per Voxel":"UniformInitialCondition"}
            initial_conditions = ["", f"{pad}# Initial Conditions"]
            try:
                for init_cond in self.s_model['initialConditions']:
                    ic_str = f'{pad}self.add_initial_condition({ic_types[init_cond["icType"]]}('
                    ic_str += f'species={init_cond["specie"]["name"]}, count={init_cond["count"]},'
                    if init_cond["icType"] == "Place":
                        place = f'{init_cond["x"]}, {init_cond["y"]}, {init_cond["z"]}'
                        ic_str += f' location=[{place}]))'
                    else:
                        ic_str += f' types={str(init_cond["types"])}))'
                    initial_conditions.append(ic_str)
                model.extend(initial_conditions)
            except KeyError as err:
                message = "Initial conditions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_mesh_string(self, model, pad):
        mesh = ["", f"{pad}# Domain",
                f"{pad}mesh = Mesh.read_stochss_domain('{self.s_model['path']}')",
                f"{pad}self.add_mesh(mesh)",
                "", f"{pad}self.staticDomain = {self.s_model['domain']['static']}"]
        model.extend(mesh)

    def __create_model_cell(self):
        pad = '        '
        if self.s_model['is_spatial']:
            model = [f"class {self.__get_class_name()}(Model):",
                     "    def __init__(self):",
                     f'{pad}Model.__init__(self, name="{self.get_name()}")']
            self.__create_mesh_string(model=model, pad=pad)
            self.__create_boundary_condition_string(model=model, pad=pad)
            self.__create_species_strings(model=model, pad=pad)
            self.__create_initial_condition_strings(model=model, pad=pad)
            self.__create_parameter_strings(model=model, pad=pad)
            self.__create_reaction_strings(model=model, pad=pad)
        else:
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
            if self.s_model['is_spatial']:
                names = []
            try:
                for param in self.s_model['parameters']:
                    if self.s_model['is_spatial']:
                        names.append(param['name'])
                        param_str = f'{pad}{param["name"]} = Parameter(name="{param["name"]}", '
                        param_str += f'expression="{param["expression"]}")'
                    else:
                        param_str = f'{pad}self.add_parameter(Parameter(name="{param["name"]}", '
                        param_str += f'expression="{param["expression"]}"))'
                    parameters.append(param_str)
                model.extend(parameters)
                if self.s_model['is_spatial']:
                    model.append(f"{pad}self.add_parameter([{', '.join(names)}])")
            except KeyError as err:
                message = "Parameters are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_ps_post_process_cells(self):
        pad = "    "
        fe_vbs_pnt = f"{pad*2}print(f'population_at_last_timepoint"
        fe_vbs_pnt += " {c.variable_of_interest}={res[c.variable_of_interest][-1]}')"
        # feature extraction cell
        fe_cell = ["# What value(s) do you want to extract from the simulation trajectory",
                   "def population_at_last_timepoint(c, res):", f"{pad}if c.verbose:",
                   fe_vbs_pnt, f"{pad}return res[c.variable_of_interest][-1]"]
        # mean std aggragator cell
        msa_cell = ["# How do we combine the values from multiple trajectores",
                    "def mean_std_of_ensemble(c, data):", f"{pad}a = np.average(data)",
                    f"{pad}s = np.std(data)", f"{pad}if c.verbose:",
                    pad * 2 + "print(f'mean_std_of_ensemble m:{a} s:{s}')",
                    f"{pad}return (a, s)"]
        # average aggragator cell
        aa_cell = [msa_cell[0], "def average_of_ensemble(c, data):",
                   f"{pad}a = np.average(data)", f"{pad}if c.verbose:",
                   pad * 2 + "print(f'average_of_ensemble = {a}')",
                   f"{pad}return a"]
        cells = [nbf.new_markdown_cell("# Post Processing"),
                 nbf.new_markdown_cell("## Feature extraction function"),
                 nbf.new_code_cell('\n'.join(fe_cell)),
                 nbf.new_markdown_cell("## Aggregation function")]
        if self.nb_type == self.PARAMETER_SWEEP_1D:
            cells.append(nbf.new_code_cell('\n'.join(msa_cell)))
        else:
            cells.append(nbf.new_code_cell('\n'.join(aa_cell)))
        return cells

    def __create_ps1d_class_cell(self):
        pad = "    "
        run_str = self.__create_ps1d_run_str()
        plt_strs = [f"{pad}def plot(c):", f"{pad*2}from matplotlib import pyplot as plt",
                    f"{pad*2}from mpl_toolkits.axes_grid1 import make_axes_locatable",
                    f"{pad*2}fig, ax = plt.subplots(figsize=(8, 8))",
                    pad * 2 + "plt.title(f'Parameter Sweep - Variable:{c.variable_of_interest}')",
                    f"{pad*2}plt.errorbar(c.p1_range, c.data[:, 0], c.data[:, 1])",
                    f"{pad*2}plt.xlabel(c.p1, fontsize=16, fontweight='bold')",
                    f"{pad*2}plt.ylabel('Population', fontsize=16, fontweight='bold')"]
        pltly_str = self.__create_ps1d_plotly_str()
        class_cell = ["class ParameterSweep1D():", "", run_str, "", "",
                      "\n".join(plt_strs), "", "", pltly_str]
        return nbf.new_code_cell("\n".join(class_cell))

    def __create_ps1d_config_cell(self):
        pad = "    "
        if self.settings['solver'] == "SSACSolver":
            model_str = f"{pad}model = {self.__get_class_name()}()"
        else:
            model_str = f"{pad}ps_class = {self.__get_class_name()}"
        config_cell = ["class ParameterSweepConfig(ParameterSweep1D):",
                       f"{pad}# What class defines the GillesPy2 model", model_str]
        settings = self.settings['parameterSweepSettings']
        eval_str = "float(eval(model.get_parameter(p1).expression))"
        number_of_trajectories = self.settings['simulationSettings']['realizations']
        if not settings['parameters']:
            param = self.s_model['parameters'][0]
            p_min = f"0.5 * {eval_str}"
            p_max = f"1.5 * {eval_str}"
            p_steps = "11"
            spec_of_interest = self.s_model['species'][0]
        else:
            param = settings['parameters'][0]
            p_min = param['min']
            p_max = param['max']
            p_steps = param['steps']
            spec_of_interest = settings['speciesOfInterest']
        config_cell.extend([f"{pad}# ENTER PARAMETER HERE", f"{pad}p1 = '{param['name']}'",
                            f"{pad}# ENTER START VALUE FOR P1 RANGE HERE", f"{pad}p1_min = {p_min}",
                            f"{pad}# ENTER END VALUE FOR P1 RANGE HERE", f"{pad}p1_max = {p_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P1 HERE",
                            f"{pad}p1_steps = {p_steps}",
                            f"{pad}p1_range = np.linspace(p1_min, p1_max, p1_steps)",
                            f"{pad}# ENTER VARIABLE OF INTEREST HERE",
                            f"{pad}variable_of_interest = '{spec_of_interest['name']}'",
                            f"{pad}number_of_trajectories = {number_of_trajectories}",
                            f"{pad}# What feature of the simulation are we examining",
                            f"{pad}feature_extraction = population_at_last_timepoint",
                            f"{pad}# for ensemble resutls: how do we aggreggate the values",
                            f"{pad}ensemble_aggragator = mean_std_of_ensemble"])
        return nbf.new_code_cell("\n".join(config_cell))

    @classmethod
    def __create_ps1d_plotly_str(cls):
        pad = "    "
        trace_str = f"{pad*2}trace_list = [go.Scatter(x=c.p1_range, y=c.data[:, 0]"
        trace_str += ", error_y=error_y)]"
        title_str = f"{pad*2}title = dict(text=f'<b>Parameter Sweep - Variable: "
        title_str += "{c.variable_of_interest}</b>', x=0.5)"
        lyout_str = f"{pad*2}layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)"
        pltly_strs = [f"{pad}def plotplotly(c, return_plotly_figure=False):",
                      f"{pad*2}from plotly.offline import iplot",
                      f"{pad*2}import plotly.graph_objs as go", "",
                      f"{pad*2}visible = c.number_of_trajectories > 1",
                      f"{pad*2}error_y = dict(type='data', array=c.data[:, 1], visible=visible)",
                      "", trace_str, "", title_str,
                      f"{pad*2}yaxis_label = dict(title='<b>Population</b>')",
                      pad * 2 + "xaxis_label = dict(title=f'<b>{c.p1}</b>')", "",
                      lyout_str, "", f"{pad*2}fig = dict(data=trace_list, layout=layout)", "",
                      f"{pad*2}if return_plotly_figure:",
                      f"{pad*3}return fig", f"{pad*2}iplot(fig)"]
        return "\n".join(pltly_strs)

    def __create_ps1d_run_str(self):
        pad = "    "
        run_strs = [f"{pad}def run(c, kwargs, verbose=False):",
                    f"{pad*2}c.verbose = verbose",
                    f"{pad*2}fn = c.feature_extraction",
                    f"{pad*2}ag = c.ensemble_aggragator",
                    f"{pad*2}data = np.zeros((len(c.p1_range), 2)) # mean and std",
                    f"{pad*2}for i, v1 in enumerate(c.p1_range):"]
        res_str = f"{pad*4}tmp_results = "
        if self.settings['solver'] == "SSACSolver":
            res_str += "model.run(**kwargs, variables={c.p1:v1})"
        else:
            res_str += "tmp_model.run(**kwargs)"
            run_strs.extend([f"{pad*3}tmp_model = c.ps_class()",
                             f"{pad*3}tmp_model.listOfParameters[c.p1].set_expression(v1)"])
        run_strs.extend([f"{pad*3}if c.verbose:",
                         pad * 4 + "print(f'running {c.p1}={v1}')",
                         f"{pad*3}if(c.number_of_trajectories > 1):",
                         res_str,
                         f"{pad*4}(m, s) = ag([fn(x) for x in tmp_results])",
                         f"{pad*4}data[i, 0] = m",
                         f"{pad*4}data[i, 1] = s",
                         f"{pad*3}else:",
                         res_str.replace("results", "result"),
                         f"{pad*4}data[i, 0] = c.feature_extraction(tmp_result)",
                         f"{pad*2}c.data = data"])
        return "\n".join(run_strs)

    def __create_ps2d_class_cell(self):
        pad = "    "
        run_str = self.__create_ps2d_run_str()
        plt_strs = [f"{pad}def plot(c):", f"{pad*2}from matplotlib import pyplot as plt",
                    f"{pad*2}from mpl_toolkits.axes_grid1 import make_axes_locatable",
                    f"{pad*2}fig, ax = plt.subplots(figsize=(8, 8))",
                    f"{pad*2}plt.imshow(c.data)",
                    f"{pad*2}ax.set_xticks(np.arange(c.data.shape[1]) + 0.5, minor=False)",
                    f"{pad*2}ax.set_yticks(np.arange(c.data.shape[0]) + 0.5, minor=False)",
                    pad * 2 + "plt.title(f'Parameter Sweep - Variable: {c.variable_of_interest}')",
                    f"{pad*2}ax.set_xticklabels(c.p1_range, minor=False, rotation=90)",
                    f"{pad*2}ax.set_yticklabels(c.p2_range, minor=False)",
                    f"{pad*2}ax.set_xlabel(c.p1, fontsize=16, fontweight='bold')",
                    f"{pad*2}ax.set_ylabel(c.p2, fontsize=16, fontweight='bold')",
                    f"{pad*2}divider = make_axes_locatable(ax)",
                    f"{pad*2}cax = divider.append_axes('right', size='5%', pad=0.2)",
                    f"{pad*2}_ = plt.colorbar(ax=ax, cax=cax)"]
        pltly_str = self.__create_ps2d_plotly_str()
        class_cell = ["class ParameterSweep2D():", "", run_str, "", "",
                      "\n".join(plt_strs), "", "", pltly_str]
        return nbf.new_code_cell("\n".join(class_cell))

    def __create_ps2d_config_cell(self):
        pad = "    "
        if self.settings['solver'] == "SSACSolver":
            model_str = f"{pad}model = {self.__get_class_name()}()"
        else:
            model_str = f"{pad}ps_class = {self.__get_class_name()}"
        config_cell = ["class ParameterSweepConfig(ParameterSweep2D):",
                       f"{pad}# What class defines the GillesPy2 model", model_str]
        settings = self.settings['parameterSweepSettings']
        p1_eval_str = "float(eval(model.get_parameter(p1).expression))"
        p2_eval_str = "float(eval(model.get_parameter(p2).expression))"
        number_of_trajectories = self.settings['simulationSettings']['realizations']
        if not settings['parameters']:
            param1 = self.s_model['parameters'][0]
            p1_min = f"0.5 * {p1_eval_str}"
            p1_max = f"1.5 * {p1_eval_str}"
            param2 = self.s_model['parameters'][1]
            p2_min = f"0.5 * {p2_eval_str}"
            p2_max = f"1.5 * {p2_eval_str}"
            spec_of_interest = self.s_model['species'][0]
        else:
            param1 = settings['parameters'][0]
            p1_min = param1['min']
            p1_max = param1['max']
            param2 = settings['parameters'][1]
            p2_min = param2['min']
            p2_max = param2['max']
            spec_of_interest = settings['speciesOfInterest']
        config_cell.extend([f"{pad}# ENTER PARAMETER 1 HERE", f"{pad}p1 = '{param1['name']}'",
                            f"{pad}# ENTER PARAMETER 2 HERE", f"{pad}p2 = '{param2['name']}'",
                            f"{pad}# ENTER START VALUE FOR P1 RANGE HERE",
                            f"{pad}p1_min = {p1_min}",
                            f"{pad}# ENTER END VALUE FOR P1 RANGE HERE", f"{pad}p1_max = {p1_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P1 HERE",
                            f"{pad}p1_steps = {param1['steps'] if settings['parameters'] else 11}",
                            f"{pad}p1_range = np.linspace(p1_min, p1_max, p1_steps)",
                            f"{pad}# ENTER START VALUE FOR P2 RANGE HERE",
                            f"{pad}p2_min = {p2_min}",
                            f"{pad}# ENTER END VALUE FOR P2 RANGE HERE", f"{pad}p2_max = {p2_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P2 HERE",
                            f"{pad}p2_steps = {param2['steps'] if settings['parameters'] else 11}",
                            f"{pad}p2_range = np.linspace(p2_min, p2_max, p2_steps)",
                            f"{pad}# ENTER VARIABLE OF INTEREST HERE",
                            f"{pad}variable_of_interest = '{spec_of_interest['name']}'",
                            f"{pad}number_of_trajectories = {number_of_trajectories}",
                            f"{pad}# What feature of the simulation are we examining",
                            f"{pad}feature_extraction = population_at_last_timepoint",
                            f"{pad}# for ensemble resutls: how do we aggreggate the values",
                            f"{pad}ensemble_aggragator = average_of_ensemble"])
        return nbf.new_code_cell("\n".join(config_cell))

    @classmethod
    def __create_ps2d_plotly_str(cls):
        pad = "    "
        title_str = f"{pad*2}title = dict(text=f'<b>Parameter Sweep - Variable: "
        title_str += "{c.variable_of_interest}</b>', x=0.5)"
        lyout_str = f"{pad*2}layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)"
        pltly_strs = [f"{pad}def plotplotly(c, return_plotly_figure=False):",
                      f"{pad*2}from plotly.offline import init_notebook_mode, iplot",
                      f"{pad*2}import plotly.graph_objs as go", "",
                      f"{pad*2}xaxis_ticks = c.p1_range", f"{pad*2}yaxis_ticks = c.p2_range", "",
                      f"{pad*2}trace_list = [go.Heatmap(z=c.data, x=xaxis_ticks, y=yaxis_ticks)]",
                      title_str, pad * 2 + "xaxis_label = dict(title=f'<b>{c.p1}</b>')",
                      pad * 2 + "yaxis_label = dict(title=f'<b>{c.p2}</b>')", "",
                      lyout_str, "", f"{pad*2}fig = dict(data=trace_list, layout=layout)", "",
                      f"{pad*2}if return_plotly_figure:",
                      f"{pad*3}return fig", f"{pad*2}iplot(fig)"]
        return "\n".join(pltly_strs)

    def __create_ps2d_run_str(self):
        pad = "    "
        run_strs = [f"{pad}def run(c, kwargs, verbose=False):",
                    f"{pad*2}c.verbose = verbose",
                    f"{pad*2}fn = c.feature_extraction",
                    f"{pad*2}ag = c.ensemble_aggragator",
                    f"{pad*2}data = np.zeros((len(c.p1_range), len(c.p2_range)))",
                    f"{pad*2}for i, v1 in enumerate(c.p1_range):",
                    f"{pad*3}for j, v2 in enumerate(c.p2_range):"]
        res_str = f"{pad*5}tmp_results = "
        if self.settings['solver'] == "SSACSolver":
            res_str += "model.run(**kwargs, variables={c.p1:v1, c.p2:v2})"
        else:
            res_str += "tmp_model.run(**kwargs)"
            run_strs.extend([f"{pad*4}tmp_model = c.ps_class()",
                             f"{pad*4}tmp_model.listOfParameters[c.p1].set_expression(v1)",
                             f"{pad*4}tmp_model.listOfParameters[c.p2].set_expression(v2)"])
        run_strs.extend([f"{pad*4}if c.verbose:",
                         pad * 5 + "print(f'running {c.p1}={v1}, {c.p2}={v2}')",
                         f"{pad*4}if(c.number_of_trajectories > 1):",
                         res_str,
                         f"{pad*5}data[i, j] = ag([fn(x) for x in tmp_results])",
                         f"{pad*4}else:",
                         res_str.replace("results", "result"),
                         f"{pad*5}data[i, j] = c.feature_extraction(tmp_result)",
                         f"{pad*2}c.data = data"])
        return "\n".join(run_strs)

    def __create_reaction_strings(self, model, pad):
        if self.s_model['reactions']:
            reactions = ["", f"{pad}# Reactions"]
            if self.s_model['is_spatial']:
                names = []
            try:
                for reac in self.s_model['reactions']:
                    react_str = self.__create_stoich_spec_string(stoich_species=reac['reactants'])
                    prod_str = self.__create_stoich_spec_string(stoich_species=reac['products'])
                    if self.s_model['is_spatial']:
                        names.append(reac['name'])
                        reac_str = f'{pad}{reac["name"]} = Reaction(name="{reac["name"]}", '
                        if len(reac['types']) < len(self.s_model['domain']['types']) - 1:
                            reac_str += f'restrict_to={str(reac["types"])}, '
                    else:
                        reac_str = f'{pad}self.add_reaction(Reaction(name="{reac["name"]}", '
                    reac_str += f'reactants={react_str}, products={prod_str}, '
                    if reac['reactionType'] == 'custom-propensity':
                        reac_str += f'propensity_function="{reac["propensity"]}")'
                    else:
                        reac_str += f'rate=self.listOfParameters["{reac["rate"]["name"]}"])'
                    if not self.s_model['is_spatial']:
                        reac_str += ")"
                    reactions.append(reac_str)
                model.extend(reactions)
                if self.s_model['is_spatial']:
                    model.append(f"{pad}self.add_reaction([{', '.join(names)}])")
            except KeyError as err:
                message = "Reactions are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

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
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    @classmethod
    def __create_sme_expres_cells(cls):
        # res conf cell
        param_conf = "met.data.configurations['listOfParameters'] = "
        param_conf += "list(model.listOfParameters.keys())"
        rconf_strs = ["# First lets add some appropiate information about the model and features",
                      param_conf,
                      "met.data.configurations['listOfSpecies'] = list(model.listOfSpecies.keys())",
                      "met.data.configurations['listOfSummaries'] = met.summaries.features",
                      "met.data.configurations['timepoints'] = model.tspan"]
        # met explore cell
        mtexp_strs = ["# Here we use UMAP for dimension reduction", "met.explore(dr_method='umap')"]
        # supervised train cell
        sptrn_strs = ["from sciope.models.label_propagation import LPModel",
                      "# here lets use the dimension reduction embedding as input data",
                      "data = met.dr_model.embedding_", "",
                      "model_lp = LPModel()", "# train using basinhopping",
                      "model_lp.train(data, met.data.user_labels, min_=0.01, max_=10, niter=50)"]
        # map label cell
        cmt_str = "# just to vislualize the result we will map the label distribution "
        cmt_str += "to the user_labels\n# (will enable us to see the LP model output "
        cmt_str += "when using method 'explore')"
        mplbl_strs = [cmt_str, "user_labels = np.copy(met.data.user_labels)",
                      "# takes the label corresponding to index 0",
                      "met.data.user_labels = model_lp.model.label_distributions_[:, 0]"]
        cells = [nbf.new_markdown_cell("## Explore the result"),
                 nbf.new_code_cell("\n".join(rconf_strs)),
                 nbf.new_code_cell("\n".join(mtexp_strs)),
                 nbf.new_code_cell("\n".join(sptrn_strs)),
                 nbf.new_code_cell("\n".join(mplbl_strs)),
                 nbf.new_code_cell("met.explore(dr_method='umap')"),
                 nbf.new_code_cell("met.data.user_labels = user_labels")]
        return cells

    def __create_sme_setup_cells(self):
        spec_of_interest = list(self.model.get_all_species().keys())
        # Wrapper cell
        sim_str = "simulator = wrapper.get_simulator(gillespy_model=model, "
        sim_str += f"run_settings=settings, species_of_interest={spec_of_interest})"
        sim_strs = ["from sciope.utilities.gillespy2 import wrapper",
                    "settings = configure_simulation()", sim_str,
                    "expression_array = wrapper.get_parameter_expression_array(model)"]
        # Dask cell
        dask_strs = ["from dask.distributed import Client", "", "c = Client()"]
        # lhc cell
        lhc_str = "lhc = latin_hypercube_sampling.LatinHypercube("
        lhc_str += "xmin=expression_array, xmax=expression_array*3)"
        lhc_strs = ["from sciope.designs import latin_hypercube_sampling",
                    "from sciope.utilities.summarystats.auto_tsfresh import SummariesTSFRESH", "",
                    lhc_str, "lhc.generate_array(1000) # creates a LHD of size 1000", "",
                    "# will use default minimal set of features",
                    "summary_stats = SummariesTSFRESH()"]
        # stochmet cell
        ism_strs = ["from sciope.stochmet.stochmet import StochMET", "",
                    "met = StochMET(simulator, lhc, summary_stats)"]
        cells = [nbf.new_markdown_cell("## Define simulator function (using gillespy2 wrapper)"),
                 nbf.new_code_cell("\n".join(sim_strs)),
                 nbf.new_markdown_cell("## Start local cluster using dask client"),
                 nbf.new_code_cell("\n".join(dask_strs)),
                 nbf.new_markdown_cell("## Define parameter sampler/design and summary statistics"),
                 nbf.new_code_cell("\n".join(lhc_strs)),
                 nbf.new_markdown_cell("## Initiate StochMET"),
                 nbf.new_code_cell("\n".join(ism_strs))]
        return cells

    def __create_smi_setup_cells(self):
        pad = "    "
        priors = ["# take default from mode 1 as reference",
                  "default_param = np.array(list(model.listOfParameters.items()))[:, 1]",
                  "", "bound = []", "for exp in default_param:",
                  f"{pad}bound.append(float(exp.expression))", "", "# Set the bounds",
                  "bound = np.array(bound)", "dmin = bound * 0.1", "dmax = bound * 2.0",
                  "", "# Here we use uniform prior",
                  "uni_prior = uniform_prior.UniformPrior(dmin, dmax)"]
        stat_dist = ["# Function to generate summary statistics",
                     "summ_func = auto_tsfresh.SummariesTSFRESH()", "",
                     "# Distance", "ns = naive_squared.NaiveSquaredDistance()"]
        cells = [nbf.new_markdown_cell("## Define prior distribution"),
                 nbf.new_code_cell("\n".join(priors)),
                 nbf.new_markdown_cell("## Define simulator"),
                 self.__create_smi_simulator_cell(),
                 nbf.new_markdown_cell("## Define summary statistics and distance function"),
                 nbf.new_code_cell("\n".join(stat_dist))]
        return cells

    def __create_smi_simulator_cell(self):
        pad = "    "
        comment = f"{pad}# params - array, need to have the same order as model.listOfParameters"
        loop = f"{pad}for e, pname in enumerate(model.listOfParameters.keys()):"
        if self.settings['solver'] == "SSACSolver":
            comment += "\n"+ pad +"variables = {}"
            func_def = "def get_variables(params, model):"
            body = f"{pad*2}variables[pname] = params[e]"
            return_str = f"{pad}return variables"
            call = f"{pad}variables = get_variables(params, model)"
            run = f"{pad}res = model.run(**kwargs, variables=variables)"
        else:
            func_def = "def set_model_parameters(params, model):"
            body = f"{pad*2}model.get_parameter(pname).set_expression(params[e])"
            return_str = f"{pad}return model"
            call = f"{pad}model_update = set_model_parameters(params, model)"
            run = f"{pad}res = model_update.run(**kwargs)"
        sim_strs = [func_def, comment, loop, body, return_str, ""]
        simulator = ["# Here we use the GillesPy2 Solver", "def simulator(params, model):",
                     call, "", run, f"{pad}res = res.to_array()",
                     f"{pad}tot_res = np.asarray([x.T for x in res]) # reshape to (N, S, T)",
                     f"{pad}# should not contain timepoints", f"{pad}tot_res = tot_res[:, 1:, :]",
                     "", f"{pad}return tot_res", ""]
        sim_strs.extend(simulator)
        sim2_com = "# Wrapper, simulator function to abc should should only take one argument "
        sim2_com += "(the parameter point)"
        simulator2 = [sim2_com, "def simulator2(x):", f"{pad}return simulator(x, model=model)"]
        sim_strs.extend(simulator2)
        return nbf.new_code_cell("\n".join(sim_strs))

    def __create_species_strings(self, model, pad):
        if self.s_model['species']:
            species = ["", f"{pad}# Variables"]
            if self.s_model['is_spatial']:
                names = []
                types_str = [""]
            try:
                for spec in self.s_model['species']:
                    if self.s_model['is_spatial']:
                        names.append(spec["name"])
                        spec_str = f'{pad}{spec["name"]} = Species(name="{spec["name"]}", '
                        spec_str += f"diffusion_constant={spec['diffusionConst']})"
                        if len(spec['types']) < len(self.s_model['domain']['types']) - 1:
                            type_str = f"{pad}self.restrict({spec['name']}, {str(spec['types'])})"
                            types_str.append(type_str)
                    else:
                        spec_str = f'{pad}self.add_species(Species(name="{spec["name"]}", '
                        spec_str += f'initial_value={spec["value"]}, mode="{spec["mode"]}"))'
                    species.append(spec_str)
                model.extend(species)
                if self.s_model['is_spatial']:
                    model.append(f"{pad}self.add_species([{', '.join(names)}])")
                    if len(types_str) > 1:
                        model.extend(types_str)
            except KeyError as err:
                message = "Species are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err

    def __create_stoich_spec_string(self, stoich_species):
        species = {}
        for stoich_spec in stoich_species:
            name = stoich_spec['specie']['name']
            if name in species.keys():
                species[name] += stoich_spec['ratio']
            else:
                species[name] = stoich_spec['ratio']
        spec_list = []
        for name, ratio in species.items():
            if not self.s_model['is_spatial']:
                name = f"'{name}'"
            spec_list.append(f"{name}: {ratio}")
        return "{" + ", ".join(spec_list) + "}"

    def __create_tspan_string(self, model, pad):
        end = self.s_model['modelSettings']['endSim']
        output_freq = self.s_model['modelSettings']['timeStep']
        tspan = ["", f"{pad}# Timespan"]
        if self.s_model['is_spatial']:
            step_size = self.s_model['modelSettings']['timestepSize']
            ts_str = f'{pad}self.timespan(np.arange(0, {end + step_size}, {output_freq})'
            ts_str += f", timestep_size={step_size})"
        else:
            ts_str = f'{pad}self.timespan(np.arange(0, {end + output_freq}, {output_freq}))'
        tspan.append(ts_str)
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

    def __get_gillespy2_run_settings(self):
        is_automatic = self.settings['simulationSettings']['isAutomatic']
        if self.nb_type in (self.PARAMETER_SWEEP_1D, self.PARAMETER_SWEEP_2D) and is_automatic:
            self.settings['simulationSettings']['realizations'] = 20
        settings = self.settings['simulationSettings']
        if settings['algorithm'] == "ODE":
            self.settings['simulationSettings']['realizations'] = 1
            settings['realizations'] = 1
        # Map algorithm for GillesPy2
        ssa_solver = "solver" if self.is_ssa_c else "NumPySSASolver"
        ode_solver = "solver" if self.is_ssa_c else "ODESolver"
        tau_solver = "solver" if self.is_ssa_c else "TauLeapingSolver"
        solver_map = {"SSA":f'"solver":{ssa_solver}',
                      "ODE":f'"solver":{ode_solver}',
                      "Tau-Leaping":f'"solver":{tau_solver}',
                      "Hybrid-Tau-Leaping":'"solver":TauHybridSolver'}
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

    def __get_spatialpy_run_setting(self):
        self.settings['simulationSettings']['realizations'] = 1
        settings = self.settings['simulationSettings']
        settings_map = {"number_of_trajectories":settings['realizations'],
                        "seed":settings['seed'] if settings['seed'] != -1 else None}
        return [f'"{key}":{val}' for key, val in settings_map.items()]

    def __get_gillespy2_solver_name(self):
        if self.settings['simulationSettings']['isAutomatic']:
            solver = self.model.get_best_solver().name
            self.settings['simulationSettings']['algorithm'] = self.SOLVER_MAP[solver]
            return solver
        algorithm_map = {'SSA': self.model.get_best_solver_algo("SSA").name,
                         'Tau-Leaping': self.model.get_best_solver_algo("Tau-Leaping").name,
                         'Hybrid-Tau-Leaping': 'TauHybridSolver',
                         'ODE': self.model.get_best_solver_algo("ODE").name}
        return algorithm_map[self.settings['simulationSettings']['algorithm']]

    @classmethod
    def __get_presentation_links(cls, hostname, file):
        query_str = f"?owner={hostname}&file={file}"
        present_link = f"https://staging.stochss.org/stochss/present-notebook{query_str}"
        dl_link_base = "https://staging.stochss.org/stochss/notebook/download_presentation"
        download_link = os.path.join(dl_link_base, hostname, file)
        open_link = f"https://staging.stochss.org?open={download_link}"
        return {"presentation": present_link, "download": download_link, "open": open_link}

    def create_1dps_notebook(self):
        '''Create a 1D parameter sweep jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.PARAMETER_SWEEP_1D
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        run_strs = ["kwargs = configure_simulation()", "ps = ParameterSweepConfig()",
                    "%time ps.run(kwargs)"]
        cells = self.__create_common_cells()
        cells.extend(self.__create_ps_post_process_cells())
        cells.extend([nbf.new_markdown_cell("# Parameter Sweep"),
                      self.__create_ps1d_class_cell(),
                      self.__create_ps1d_config_cell(),
                      nbf.new_code_cell("\n".join(run_strs)),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell("ps.plot()"),
                      nbf.new_code_cell("ps.plotplotly()")])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_2dps_notebook(self):
        '''Create a 2D parameter sweep jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.PARAMETER_SWEEP_2D
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        run_strs = ["kwargs = configure_simulation()", "ps = ParameterSweepConfig()",
                    "%time ps.run(kwargs)"]
        cells = self.__create_common_cells()
        cells.extend(self.__create_ps_post_process_cells())
        cells.extend([nbf.new_markdown_cell("# Parameter Sweep"),
                      self.__create_ps2d_class_cell(),
                      self.__create_ps2d_config_cell(),
                      nbf.new_code_cell("\n".join(run_strs)),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell("ps.plot()"),
                      nbf.new_code_cell("ps.plotplotly()")])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_es_notebook(self):
        '''Create an ensemble simulation jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.ENSEMBLE_SIMULATION
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        run_str = "kwargs = configure_simulation()\nresults = model.run(**kwargs)"
        cells = self.__create_common_cells()
        cells.extend([nbf.new_code_cell(run_str),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell("results.plotplotly()")])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_ses_notebook(self):
        '''Create a spetial ensemble simulation jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.SPATIAL_SIMULATION
        self.settings['solver'] = "Solver"
        run_str = "kwargs = configure_simulation()\nresults = model.run(**kwargs)"
        if self.s_model['species']:
            species = self.s_model['species'][0]['name']
            plot_str = f"results.plot_species('{species}', animated=True, width=None, height=None)"
        else:
            plot_str = "results.plot_property('type', animated=True, width=None, height=None)"
        cells = self.__create_common_cells()
        if 'boundaryConditions' in self.s_model.keys():
            bc_cells = self.__create_boundary_condition_cells()
            for i, bc_cell in enumerate(bc_cells):
                cells.insert(2 + i, bc_cell)
        cells.extend([nbf.new_code_cell(run_str),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell(plot_str)])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_sme_notebook(self):
        '''Create a model exploration jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.MODEL_EXPLORATION
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        cells = self.__create_common_cells(interactive_backend=True)
        cells.append(nbf.new_markdown_cell("# Model Exploration"))
        cells.extend(self.__create_sme_setup_cells())
        cells.extend([nbf.new_markdown_cell("## Run parameter sweep"),
                      nbf.new_code_cell("met.compute(n_points=500, chunk_size=10)")])
        cells.extend(self.__create_sme_expres_cells())

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_smi_notebook(self):
        '''Create a model inference jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.MODEL_INFERENCE
        self.settings['solver'] = self.__get_gillespy2_solver_name()
        cells = self.__create_common_cells()
        imports = ["%load_ext autoreload", "%autoreload 2", "",
                   "from tsfresh.feature_extraction.settings import MinimalFCParameters",
                   "from sciope.utilities.priors import uniform_prior",
                   "from sciope.utilities.summarystats import auto_tsfresh",
                   "from sciope.utilities.distancefunctions import naive_squared",
                   "from sciope.inference.abc_inference import ABC",
                   "from sklearn.metrics import mean_absolute_error",
                   "from dask.distributed import Client"]
        fd_header = "## Generate some fixed(observed) data based on default parameters of the model"
        fd_str = "kwargs = configure_simulation()\nfixed_data = model.run(**kwargs)"
        rshp_strs = ["# Reshape the data and remove timepoints array",
                     "fixed_data = fixed_data.to_array()",
                     "fixed_data = np.asarray([x.T for x in fixed_data])",
                     "fixed_data = fixed_data[:, 1:, :]"]
        cells.extend([nbf.new_markdown_cell("# Model Inference"),
                      nbf.new_code_cell("\n".join(imports)), nbf.new_markdown_cell(fd_header),
                      nbf.new_code_cell(fd_str), nbf.new_code_cell("\n".join(rshp_strs))])
        cells.extend(self.__create_smi_setup_cells())
        # abc cell
        abc_str = "abc = ABC(fixed_data, sim=simulator2, prior_function=uni_prior, "
        abc_str += "summaries_function=summ_func.compute, distance_function=ns)"
        # compute fixed mean cell
        fm_str = "# First compute the fixed(observed) mean\nabc.compute_fixed_mean(chunk_size=2)"
        # run model inference cell
        rmi_str = "res = abc.infer(num_samples=100, batch_size=10, chunk_size=2)"
        # absolute error cell
        abse_str = "mae_inference = mean_absolute_error(bound, abc.results['inferred_parameters'])"
        cells.extend([nbf.new_markdown_cell("## Start local cluster using dask client"),
                      nbf.new_code_cell("c = Client()"),
                      nbf.new_markdown_cell("## Start abc instance"),
                      nbf.new_code_cell(abc_str), nbf.new_code_cell(fm_str),
                      nbf.new_code_cell(rmi_str), nbf.new_code_cell(abse_str)])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def load(self):
        '''Read the notebook file and return as a dict'''
        try:
            with open(self.get_path(full=True), "r") as notebook_file:
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
                message = "A presentation with this name already exists"
                raise StochSSFileExistsError(message)
            links = self.__get_presentation_links(hostname, file)
            with open(dst, "w") as presentation_file:
                json.dump(notebook_pres, presentation_file)
            return links
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
        with open(path, 'w') as file:
            nbformat.write(notebook, file, version=4)
        return f"Successfully created the notebook {self.get_file()}"
