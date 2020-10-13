#!/usr/bin/env python3

import os
import json
from .rename import get_unique_file_name
from .stochss_errors import StochSSFileNotFoundError
# from run_model import ModelFactory
from gillespy2.sbml.SBMLimport import convert, __read_sbml_model, __get_math
import gillespy2


workdir = '/home/jovyan/stochss'


def convert_to_gillespy_model(path):
    if os.path.exists(path):
        try:
            gpy_model, errors = convert(path)
            return gpy_model, errors
        except:
            return None, []
    else:
        raise StochSSFileNotFoundError("Could not find the sbml file: "+path, None)


def get_sbml_function_definitions(path):
    sbml_model = __read_sbml_model(path)[0]
    function_definitions = []

    for i in range(sbml_model.getNumFunctionDefinitions()):
        function = sbml_model.getFunctionDefinition(i)
        function_name = function.getId()
        function_tree = function.getMath()
        num_nodes = function_tree.getNumChildren()
        function_args = [function_tree.getChild(i).getName() for i in range(num_nodes-1)]
        function_string = __get_math(function_tree.getChild(num_nodes-1))
        fd = {"name":function_name, "function":function_string, "args":function_args}
        function_definitions.append(fd)

    return function_definitions


def convert_to_stochss_model(stochss_model, gillespy_model, full_path, name=None):
    comp_id = 1
    errors = []
    if type(gillespy_model) is gillespy2.Model:
        sbml_model_file = full_path.split('/').pop()
        if name is None:
            stochss_model_file = gillespy_model.name + '.mdl'
        else:
            stochss_model_file = name + '.mdl'
        stochss_model_path = get_unique_file_name(stochss_model_file, full_path.split(sbml_model_file)[0])[0]

        species = gillespy_model.get_all_species()
        stochss_species, default_mode, comp_id = get_species(species, comp_id)
        stochss_model['species'].extend(stochss_species)
        stochss_model['defaultMode'] = default_mode
        
        parameters = gillespy_model.get_all_parameters()
        stochss_parameters, comp_id = get_parameters(parameters, comp_id)
        stochss_model['parameters'].extend(stochss_parameters)

        reactions = gillespy_model.get_all_reactions()
        stochss_reactions, comp_id = get_reactions(reactions, stochss_species, comp_id)
        stochss_model['reactions'].extend(stochss_reactions)

        events = gillespy_model.listOfEvents
        stochss_events, comp_id = get_events(events, stochss_species, stochss_parameters, comp_id)
        stochss_model['eventsCollection'].extend(stochss_events)

        rate_rules = gillespy_model.listOfRateRules
        stochss_rate_rules, comp_id = get_rate_rules(rate_rules, stochss_species, stochss_parameters, comp_id)
        stochss_model['rules'].extend(stochss_rate_rules)

        assignment_rules = gillespy_model.listOfAssignmentRules
        stochss_assignment_rules, comp_id = get_assignment_rules(assignment_rules, stochss_species, stochss_parameters, comp_id)
        stochss_model['rules'].extend(stochss_assignment_rules)
        
        if gillespy_model.listOfFunctionDefinitions:
            function_definitions = get_sbml_function_definitions(full_path)
            stochss_function_definitions, comp_id = get_function_definitions(function_definitions, comp_id)
            stochss_model['functionDefinitions'].extend(stochss_function_definitions)

        stochss_model['defaultID'] = comp_id

        with open(stochss_model_path, "w") as stochss_file:
            json.dump(stochss_model, stochss_file)
    
        return "The SBML Model was successfully converted to a StochSS Model.", errors, stochss_model_path
    else:
        return "ERROR! We were unable to convert the SBML Model into a StochSS Model.", [], ""


def get_species(species, comp_id):
    stochss_species = []
    mode = "dynamic"
    
    for name, specie in species.items():
        if not specie.mode == "dynamic":
            mode = "continuous"
            break

    for name, specie in species.items():
        
        stochss_specie = {"compID":comp_id,
                          "name":specie.name,
                          "value":specie.initial_value,
                          "mode":mode,
                          "switchTol": 0.03,
                          "switchMin": 100,
                          "isSwitchTol": True,
                          "annotation": "",
                          "diffusionCoeff":0,
                          "subdomains": [
                              "subdomain 1: ",
                              "subdomain 2: "
                          ]}

        stochss_species.append(stochss_specie)
        comp_id += 1

    return stochss_species, mode, comp_id


def get_parameters(parameters, comp_id):
    stochss_parameters = []

    for name, parameter in parameters.items():
        
        stochss_parameter = {"compID":comp_id,
                             "name":parameter.name,
                             "expression":str(parameter.expression),
                             "annotation": ""
                            }

        stochss_parameters.append(stochss_parameter)
        comp_id += 1

    return stochss_parameters, comp_id


def get_reactions(reactions, stochss_species, comp_id):
    stochss_reactions = []

    for name, reaction in reactions.items():
        
        stochss_reaction = {"compID":comp_id,
                            "name":reaction.name,
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
                            "products": [],
                            }

        reactants = reaction.reactants
        stochss_reactants = get_reactants(reactants, stochss_species)
        stochss_reaction['reactants'].extend(stochss_reactants)

        products = reaction.products
        stochss_products = get_products(products, stochss_species)
        stochss_reaction['products'].extend(stochss_products)

        summary = build_summary(stochss_reactants, stochss_products)
        stochss_reaction['summary'] = summary
        
        stochss_reactions.append(stochss_reaction)
        comp_id += 1

    return stochss_reactions, comp_id


def get_reactants(reactants, stochss_species):
    stochss_reactants = []

    for specie, ratio in reactants.items():
        stoich_species = get_specie(stochss_species, specie.name)

        stochss_reactant = {"ratio":ratio,"specie":stoich_species}
        stochss_reactants.append(stochss_reactant)

    return stochss_reactants


def get_products(products, stochss_species):
    stochss_products = []

    for specie, ratio in products.items():
        stoich_species = get_specie(stochss_species, specie.name)

        stochss_product = {"ratio":ratio,"specie":stoich_species}
        stochss_products.append(stochss_product)

    return stochss_products


def get_specie(stochss_species, name):
    return list(filter(lambda specie: specie['name'] == name, stochss_species))[0]


def get_parameter(stochss_parameters, name):
    return list(filter(lambda parameter: parameter['name'] == name, stochss_parameters))[0]


def build_summary(stochss_reactants, stochss_products):
    summary = ""

    if len(stochss_reactants):
        reactant_elements = list(map(build_summary_element, stochss_reactants))
        reactants_summary = '+'.join(reactant_elements)
    else:
        reactants_summary = "\\emptyset"
    summary += reactants_summary

    summary += " \\rightarrow "

    if len(stochss_products):
        product_elements = list(map(build_summary_element, stochss_products))
        products_summary = '+'.join(product_elements)
    else:
        products_summary = "\\emptyset"
    summary += products_summary

    return summary


def build_summary_element(stoich_specie):
    ratio = stoich_specie['ratio']
    name = stoich_specie['specie']['name']

    if ratio > 1:
        return "{0}{1}".format(ratio, name)
    else:
        return name


def get_events(events, stochss_species, stochss_parameters, comp_id):
    stochss_events = []

    for name, event in events.items():

        stochss_event = {"compID":comp_id,
                         "name": event.name,
                         "annotation": "",
                         "delay": event.delay,
                         "priority": event.priority,
                         "triggerExpression": event.trigger.expression,
                         "initialValue": event.trigger.value,
                         "persistent": event.trigger.persistent,
                         "useValuesFromTriggerTime": event.use_values_from_trigger_time,
                         "eventAssignments": []
                        }

        assignments = event.assignments
        stochss_assignments = get_event_assignment(assignments, stochss_species, stochss_parameters)
        stochss_event['eventAssignments'].extend(stochss_assignments)

        stochss_events.append(stochss_event)
        comp_id += 1

    return stochss_events, comp_id


def get_event_assignment(assignments, stochss_species, stochss_parameters):
    stochss_assignments = []

    for assignment in assignments:
        try:
            variable = get_specie(stochss_species, assignment.variable.name)
        except:
            variable = get_parameter(stochss_parameters, assignment.variable.name)

        stochss_assignment = {"variable": variable,
                              "expression": assignment.expression
                             }

        stochss_assignments.append(stochss_assignment)

    return stochss_assignments


def get_rate_rules(rate_rules, stochss_species, stochss_parameters, comp_id):
    stochss_rate_rules = []

    for name, rate_rule in rate_rules.items():
        
        try:
            variable = get_specie(stochss_species, rate_rule.variable)
        except:
            variable = get_parameter(stochss_parameters, rate_rule.variable)

        stochss_rate_rule = {"compID":comp_id,
                             "name":rate_rule.name,
                             "expression":rate_rule.formula,
                             "type":"Rate Rule",
                             "variable":variable,
                             "annotation": ""
                            }

        stochss_rate_rules.append(stochss_rate_rule)
        comp_id += 1

    return stochss_rate_rules, comp_id


def get_assignment_rules(assignment_rules, stochss_species, stochss_parameters, comp_id):
    stochss_assignment_rules = []

    for name, assignment_rule in assignment_rules.items():
        
        try:
            variable = get_specie(stochss_species, assignment_rule.variable)
        except:
            variable = get_parameter(stochss_parameters, assignment_rule.variable)

        stochss_assignment_rule = {"compID":comp_id,
                                   "name":assignment_rule.name,
                                   "expression":assignment_rule.formula,
                                   "type":"Assignment Rule",
                                   "variable":variable,
                                   "annotation": ""
                                  }

        stochss_assignment_rules.append(stochss_assignment_rule)
        comp_id += 1

    return stochss_assignment_rules, comp_id


def get_function_definitions(function_definitions, comp_id):
    stochss_function_definitions = []

    for function_definition in function_definitions:
        
        name = function_definition["name"]
        variables = ', '.join(function_definition["args"])
        expression = function_definition["function"]
        function = "lambda({0}, {1})".format(variables, expression)
        signature = "{0}({1})".format(name, variables)

        stochss_function_definition = {"compID":comp_id,
                                       "name":name,
                                       "function":function,
                                       "expression":expression,
                                       "variables":variables,
                                       "signature":signature,
                                       "annotation": ""
                                       }

        stochss_function_definitions.append(stochss_function_definition)
        comp_id += 1

    return stochss_function_definitions, comp_id


def convert_sbml_to_model(path, model_template):
    
    full_path = os.path.join(workdir, path)
    name = full_path.split('/').pop().split('.')[0]
    template = json.loads(model_template)
    gillespy_model, sbml_errors = convert_to_gillespy_model(full_path)
    sbml_errors = list(map(lambda error: error[0], sbml_errors))
    if gillespy_model is None:
        sbml_errors.append("Error: could not convert the SBML Model to a StochSS Model")
    msg, errors, stochss_model_path = convert_to_stochss_model(template, gillespy_model, full_path, name=name)
    sbml_errors.extend(errors)
    resp = {"message":msg,"errors":sbml_errors,"File":stochss_model_path.split('/').pop()}
    return resp
