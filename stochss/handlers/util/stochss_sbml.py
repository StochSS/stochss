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

from gillespy2.sbml.SBMLimport import convert

from .stochss_base import StochSSBase
from .stochss_errors import StochSSFileNotFoundError

class StochSSSBMLModel(StochSSBase):
    '''
    ################################################################################################
    StochSS notebook object
    ################################################################################################
    '''

    def __init__(self, path, new=False, document=None):
        '''
        Intitialize a notebook object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the sbml model file
        new : bool
            Indicates whether or not the file is new
        document : str
            Contents of the sbml model file
        '''
        super().__init__(path=path)
        if new:
            self.make_parent_dirs()
            sbml_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = sbml_path.replace(self.user_dir + '/', "")
            with open(sbml_path, "w") as sbml_file:
                sbml_file.write(document)


    @classmethod
    def __build_element(cls, stoich_species):
        if not stoich_species:
            return "\\emptyset"

        elements = []
        for species in stoich_species:
            name = species['specie']['name']
            ratio = species['ratio']
            element = f"{ratio}{name}" if ratio > 1 else name
            elements.append(element)
        return '+'.join(elements)


    @classmethod
    def __convert_parameters(cls, model, parameters):
        for name, parameter in parameters.items():
            s_parameter = {"compID":model['defaultID'],
                           "name":name,
                           "expression":str(parameter.expression),
                           "annotation": ""}
            model['parameters'].append(s_parameter)
            model['defaultID'] += 1


    @classmethod
    def __convert_stoich_species(cls, s_reaction, reaction, key, species):
        source = reaction.reactants if key == "reactants" else reaction.products
        for specie, ratio in source.items():
            stoich_species = {"ratio":ratio,
                              "specie":cls.__get_species(species=species, name=specie.name)}
            s_reaction[key].append(stoich_species)


    @classmethod
    def __get_parameter(cls, parameters, name):
        return list(filter(lambda parameter: parameter['name'] == name, parameters))[0]


    @classmethod
    def __get_summary(cls, reaction):
        r_summary = cls.__build_element(reaction['reactants'])
        p_summary = cls.__build_element(reaction['products'])
        reaction['summary'] = f"{r_summary} \\rightarrow {p_summary}"


    @classmethod
    def __get_species(cls, species, name):
        return list(filter(lambda specie: specie['name'] == name, species))[0]


    @classmethod
    def __gillespy2__convert_assignments(cls, model, event, assignments):
        for assignment in assignments:
            name = assignment.variable.name
            try:
                variable = cls.__get_species(species=model['species'], name=name)
            except IndexError:
                variable = cls.__get_parameter(parameters=model['parameters'], name=name)

            s_assignment = {"variable": variable,
                            "expression": assignment.expression}
            event['eventAssignments'].append(s_assignment)


    @classmethod
    def __gillespy2__convert_events(cls, model, events):
        for name, event in events.items():
            s_event = {"compID":model['defaultID'],
                       "name": name,
                       "annotation": "",
                       "delay": event.delay,
                       "priority": event.priority,
                       "triggerExpression": event.trigger.expression,
                       "initialValue": event.trigger.value,
                       "persistent": event.trigger.persistent,
                       "useValuesFromTriggerTime": event.use_values_from_trigger_time,
                       "eventAssignments": []}

            cls.__gillespy2__convert_assignments(model=model, event=s_event,
                                                 assignments=event.assignments)

            model['eventsCollection'].append(s_event)
            model['defaultID'] += 1


    @classmethod
    def __gillespy2__convert_function_definition(cls, model, function_definitions):
        for name, function_definition in function_definitions.items():
            variables = function_definition.args
            expression = function_definition.function_string
            function = "lambda({0}, {1})".format(variables, expression)
            signature = "{0}({1})".format(name, variables)

            s_function_definition = {"compID":model['defaultID'],
                                     "name":name,
                                     "function":function,
                                     "expression":expression,
                                     "variables":variables,
                                     "signature":signature,
                                     "annotation": ""}
            model['functionDefinitions'].append(s_function_definition)
            model['defaultID'] += 1


    @classmethod
    def __gillespy2__convert_reactions(cls, model, reactions):
        for name, reaction in reactions.items():
            s_reaction = {"compID":model['defaultID'],
                          "name":name,
                          "reactionType": "custom-propensity",
                          "massaction": False,
                          "propensity": reaction.propensity_function,
                          "annotation": "",
                          "rate": {},
                          "types": [],
                          "reactants": [],
                          "products": []}

            for key in ['reactants', 'products']:
                cls.__convert_stoich_species(s_reaction=s_reaction, reaction=reaction,
                                                        key=key, species=model['species'])
            cls.__get_summary(reaction=s_reaction)

            model['reactions'].append(s_reaction)
            model['defaultID'] += 1


    @classmethod
    def __gillespy2__convert_rules(cls, model, r_type, rules):
        for name, rule in rules.items():
            try:
                variable = cls.__get_species(species=model['species'], name=rule.variable)
            except IndexError:
                variable = cls.__get_parameter(parameters=model['parameters'], name=rule.variable)

            s_rule = {"compID":model['defaultID'],
                      "name":name,
                      "expression":rule.formula,
                      "type":r_type,
                      "variable":variable,
                      "annotation": ""}
            model['rules'].append(s_rule)
            model['defaultID'] += 1


    @classmethod
    def __gillespy2__convert_species(cls, model, species):
        mode = "dynamic"

        # Get the model for all species
        for _, specie in species.items():
            if specie.mode != mode:
                mode = "continuous"
                break

        for name, specie in species.items():
            s_species = {"compID":model['defaultID'],
                         "name":name,
                         "value":specie.initial_value,
                         "mode":mode,
                         "switchTol": 0.03,
                         "switchMin": 100,
                         "isSwitchTol": True,
                         "annotation": "",
                         "diffusionConst":0,
                         "types": []}
            model['species'].append(s_species)
            model['defaultID'] += 1

        model['defaultMode'] = mode


    @classmethod
    def __spatialpy__convert_domain(cls, model, domain):
        boundary_condition = {"reflext_x":True, "reflect_y":True, "reflect_z":True}
        particles = cls.__spatialpy__convert_particles(domain=domain)
        s_domain = {"boundary_condition":boundary_condition,
                    "c_0":domain.c0,
                    "p_0":domain.P0,
                    "gravity":[0] * 3 if domain.gravity is None else domain.gravity,
                    "rho_0":domain.rho0,
                    "size":None,
                    "x_lim":list(domain.xlim),
                    "y_lim":list(domain.ylim),
                    "z_lim":list(domain.zlim),
                    "types":[],
                    "particles":particles}

        model['domain'] = s_domain


    @classmethod
    def __spatialpy__convert_initial_conditions(cls, model, sp_model):
        for initial_condition in sp_model.listOfInitialConditions:
            species = cls.__get_species(species=model['species'],
                                        name=initial_condition.species.name)
            s_initial_condition = {"specie":species,
                                   "count":initial_condition.count}
            if "Place" in str(type(initial_condition)):
                initial_condition['icType'] = "Place"
                initial_condition['x'] = initial_condition.location[0]
                initial_condition['y'] = initial_condition.location[1]
                initial_condition['z'] = initial_condition.location[2]
                initial_condition['types'] = sp_model.listOfTypeIDs
            else:
                if initial_condition.types is None:
                    initial_condition['types'] = sp_model.listOfTypeIDs
                else:
                    initial_condition['types'] = initial_condition.types
                if "Scatter" in str(type(initial_condition)):
                    initial_condition['icType'] = "Scatter"
                else:
                    initial_condition['icType'] = "Distribute Uniformly per Voxel"
                initial_condition['x'] = 0
                initial_condition['y'] = 0
                initial_condition['z'] = 0
        model['initialConditions'].append(s_initial_condition)


    @classmethod
    def __spatialpy__convert_particles(cls, domain):
        s_particles = []
        for i, point in enumerate(domain.vertices):
            s_particle = {"fixed":bool(domain.fixed[i]),
                          "mass":domain.mass[i],
                          "nu":domain.nu[i],
                          "particle_id":i,
                          "point":list(point),
                          "type":int(domain.type[i]),
                          "volume":domain.vol[i]}

            s_particles.append(s_particle)
        return s_particles


    @classmethod
    def __spatialpy__convert_reactions(cls, model, sp_model):
        for name, reaction in sp_model.get_all_reactions().items():
            if reaction.restrict_to is None:
                types = sp_model.listOfTypeIDs
            else:
                types = reaction.restrict_to
            s_reaction = {"compID":model['defaultID'],
                          "name":name,
                          "reactionType": "custom-propensity",
                          "massaction": False,
                          "propensity": reaction.propensity_function,
                          "annotation": "",
                          "rate": {},
                          "types":types,
                          "reactants": [],
                          "products": []}

            for key in ['reactants', 'products']:
                cls.__convert_stoich_species(s_reaction=s_reaction, reaction=reaction,
                                                        key=key, species=model['species'])
            cls.__get_summary(reaction=s_reaction)

            model['reactions'].append(s_reaction)
            model['defaultID'] += 1


    @classmethod
    def __spatialpy__convert_species(cls, model, sp_model):
        for name, specie in sp_model.get_all_species().items():
            if specie in sp_model.listOfDiffusuionRestrictions.keys():
                types = sp_model.listOfDiffusuionRestrictions[specie]
            else:
                types = sp_model.listOfTypeIDs
            s_species = {"compID":model['defaultID'],
                         "name":name,
                         "value":0,
                         "mode":None,
                         "switchTol": 0.03,
                         "switchMin": 100,
                         "isSwitchTol": True,
                         "annotation": "",
                         "diffusionConst":specie.diffusion_constant,
                         "types": types}
            model['species'].append(s_species)
            model['defaultID'] += 1


    @classmethod
    def __spatialpy__convert_types(cls, model, types):
        default_type = {"fixed":False, "mass":1, "name":"Un-Assigned",
                        "nu":0, "typeID":0, "volume":1}
        model['domain']['types'].append(default_type)
        for sp_type in types:
            s_type = default_type
            s_type['typeID'] = sp_type
            s_type['name'] = str(sp_type)

            model['domain']['types'].append(s_type)


    def convert_to_gillespy(self):
        '''
        Convert the sbml model to a gillespy model and return it

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        if not os.path.exists(path):
            message = f"Could not find the sbml file: {path}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())

        g_model, errors = convert(path)
        errors = list(map(lambda error: error[0], errors))
        if g_model is None:
            errors.append("Error: could not convert the SBML Model to a StochSS Model")
        return g_model, errors


    def convert_to_model(self, name=None, wkgp=False):
        '''
        Convert the sbml model to a stochss model and return it with mdl path

        Attributes
        ----------
        '''
        g_model, errors = self.convert_to_gillespy() # GillesPy2 Model object
        if g_model is None:
            message = "ERROR! We were unable to convert the SBML Model into a StochSS Model."
            return {"message":message, "errors":errors, "model":None}

        s_file = f"{g_model.name}.mdl" if name is None else f"{name}.mdl"
        if wkgp:
            wkgp_path, changed = self.get_unique_path(name=f"{self.get_name(path=s_file)}.wkgp",
                                                      dirname=self.get_dir_name())
            if changed:
                s_file = s_file.replace(self.get_name(path=s_file), self.get_name(path=wkgp_path))
            s_path = os.path.join(wkgp_path, s_file)
        else:
            s_path = os.path.join(self.get_dir_name(), s_file)

        model_temp = self.get_model_template() # StochSS Model in json format
        self.log("debug", f"Model template: \n{json.dumps(model_temp)}")
        s_model = self.gillespy2_to_model(s_model=model_temp, g_model=g_model)

        message = "The SBML Model was successfully converted to a StochSS Model."
        return {"message":message, "errors":errors, "model":s_model, "path":s_path}


    @classmethod
    def gillespy2_to_model(cls, s_model, g_model):
        '''
        Convert the gillespy2 model to a stochss model

        Attributes
        ----------
        s_model : dict
            The StochSS model template
        g_model : obj
            The GillesPy2 model object
        '''
        cls.__gillespy2__convert_species(model=s_model, species=g_model.get_all_species())
        cls.__convert_parameters(model=s_model, parameters=g_model.get_all_parameters())
        cls.__gillespy2__convert_reactions(model=s_model, reactions=g_model.get_all_reactions())
        cls.__gillespy2__convert_events(model=s_model, events=g_model.get_all_events())
        cls.__gillespy2__convert_rules(model=s_model, r_type='Rate Rule',
                                       rules=g_model.get_all_rate_rules())
        cls.__gillespy2__convert_rules(model=s_model, r_type='Assignment Rule',
                                       rules=g_model.get_all_assignment_rules())
        function_definitions = g_model.get_all_function_definitions()
        cls.__gillespy2__convert_function_definition(model=s_model,
                                                     function_definitions=function_definitions)
        return s_model


    @classmethod
    def spatialpy_to_model(cls, s_model, sp_model):
        '''
        Convert the spatialpy model to a stochss model

        Attributes
        ----------
        s_model : dict
            The StochSS model template
        sp_model : obj
            The SpatialPy model object
        '''
        cls.__spatialpy__convert_domain(model=s_model, domain=sp_model.domain)
        s_model['domain']['static'] = sp_model.staticDomain
        cls.__spatialpy__convert_types(model=s_model, types=sp_model.listOfTypeIDs)
        cls.__spatialpy__convert_species(model=s_model, sp_model=sp_model)
        cls.__spatialpy__convert_initial_conditions(model=s_model, sp_model=sp_model)
        cls.__convert_parameters(model=s_model, parameters=sp_model.get_all_parameters())
        cls.__spatialpy__convert_reactions(model=s_model, sp_model=sp_model)
        return s_model
