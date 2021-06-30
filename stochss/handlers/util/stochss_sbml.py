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
import traceback

from gillespy2.sbml.SBMLimport import convert
from gillespy2.sbml.SBMLimport import __read_sbml_model as _read_sbml_model
from gillespy2.sbml.SBMLimport import __get_math as _get_math

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
    def __convert_assignments(cls, model, event, assignments):
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
    def __convert_events(cls, model, events):
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

            cls.__convert_assignments(model=model, event=s_event, assignments=event.assignments)

            model['eventsCollection'].append(s_event)
            model['defaultID'] += 1


    @classmethod
    def __convert_function_definition(cls, model, function_definitions):
        for function_definition in function_definitions:
            name = function_definition["name"]
            variables = ', '.join(function_definition["args"])
            expression = function_definition["function"]
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
    def __convert_reactions(cls, model, reactions):
        for name, reaction in reactions.items():
            s_reaction = {"compID":model['defaultID'],
                          "name":name,
                          "reactionType": "custom-propensity",
                          "massaction": False,
                          "propensity": reaction.propensity_function,
                          "annotation": "",
                          "rate": {},
                          "subdomains": [
                              "subdomain 1: ",
                              "subdomain 2: "
                          ],
                          "reactants": [],
                          "products": []}

            for key in ['reactants', 'products']:
                cls.__convert_stoich_species(s_reaction=s_reaction, reaction=reaction,
                                             key=key, species=model['species'])
            cls.__get_summary(reaction=s_reaction)

            model['reactions'].append(s_reaction)
            model['defaultID'] += 1


    @classmethod
    def __convert_rules(cls, model, r_type, rules):
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
    def __convert_species(cls, model, species):
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
                         "subdomains": [
                             "subdomain 1: ",
                             "subdomain 2: "
                         ]}
            model['species'].append(s_species)
            model['defaultID'] += 1

        model['defaultMode'] = mode


    def __get_function_definitions(self):
        path = self.get_path(full=True)
        sb_model = _read_sbml_model(path)[0]
        function_definitions = []

        for i in range(sb_model.getNumFunctionDefinitions()):
            function = sb_model.getFunctionDefinition(i)
            function_name = function.getId()
            function_tree = function.getMath()
            num_nodes = function_tree.getNumChildren()
            function_args = [function_tree.getChild(i).getName() for i in range(num_nodes-1)]
            function_string = _get_math(function_tree.getChild(num_nodes-1))
            s_function_definition = {"name":function_name,
                                     "function":function_string,
                                     "args":function_args}
            function_definitions.append(s_function_definition)

        return function_definitions


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
        s_model = self.get_model_template() # StochSS Model in json format
        self.log("debug", f"Model template: \n{json.dumps(s_model)}")

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

        self.__convert_species(model=s_model, species=g_model.get_all_species())
        self.__convert_parameters(model=s_model, parameters=g_model.get_all_parameters())
        self.__convert_reactions(model=s_model, reactions=g_model.get_all_reactions())
        self.__convert_events(model=s_model, events=g_model.get_all_events())
        self.__convert_rules(model=s_model, r_type='Rate Rule', rules=g_model.get_all_rate_rules())
        self.__convert_rules(model=s_model, r_type='Assignment Rule',
                             rules=g_model.get_all_assignment_rules())
        self.__convert_function_definition(model=s_model,
                                           function_definitions=self.__get_function_definitions())

        message = "The SBML Model was successfully converted to a StochSS Model."
        return {"message":message, "errors":errors, "model":s_model, "path":s_path}
