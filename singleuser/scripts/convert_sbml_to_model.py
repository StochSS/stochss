#!/usr/bin/env python3

import argparse
import os
import json
from rename import get_unique_file_name
# from run_model import ModelFactory
from gillespy2.sbml.SBMLimport import convert
import gillespy2


user_dir = "/home/jovyan"


def convert_to_gillespy_model(path):
    gpy_model, errors = convert(path)
    return gpy_model, errors
    # with open(path, "r") as model_file:
    #     stochss_model = json.loads(model_file.read())
    #     stochss_model['name'] = path.split('/').pop().split('.')[0]
    # gillespy_model = ModelFactory(stochss_model)
    # return gillespy_model.model, []


def convert_to_stochss_model(stochss_model, gillespy_model, full_path):
    if type(gillespy_model) is gillespy2.core.gillespy2.Model:
        sbml_model_file = full_path.split('/').pop()
        stochss_model_file = gillespy_model.name + '.mdl'
        stochss_model_path = get_unique_file_name(stochss_model_file, full_path.split(sbml_model_file)[0])[0]

        species = gillespy_model.get_all_species()
        stochss_species, algorithm = get_species(species)
        stochss_model['species'].extend(stochss_species)
        stochss_model['simulationSettings']['stochasticSettings']['algorithm'] = algorithm

        parameters = gillespy_model.get_all_parameters()
        stochss_parameters = get_parameters(parameters)
        stochss_model['parameters'].extend(stochss_parameters)

        reactions = gillespy_model.get_all_reactions()
        stochss_reactions = get_reactions(reactions, stochss_species)
        stochss_model['reactions'].extend(stochss_reactions)

        events = gillespy_model.listOfEvents
        stochss_events = get_events(events, stochss_species, stochss_parameters)
        stochss_model['eventsCollection'].extend(stochss_events)

        rate_rules = gillespy_model.listOfRateRules
        stochss_rate_rules = get_rate_rules(rate_rules, stochss_species)
        stochss_model['rateRules'].extend(stochss_rate_rules)
        
        with open(stochss_model_path, "w") as stochss_file:
            json.dump(stochss_model, stochss_file)
    
        return "The SBML Model was successfully converted to a StochSS Model."
    else:
        return "ERROR! We were unable to convert the SBML Model into a StochSS Model."


def get_species(species):
    stochss_species = []
    mode = "dynamic"
    algorithm = "SSA"

    for name in species.keys():
        if not species[name].mode == "dynamic":
            mode = "continuous"
            algorithm = "Hybrid-Tau-Leaping"
            break

    for name in species.keys():
        specie = species[name]

        stochss_specie = {"name":specie.name,
                          "value":specie.initial_value,
                          "mode":mode,
                          "diffusionCoeff":0,
                          "subdomains": [
                              "subdomain 1: ",
                              "subdomain 2: "
                          ]}

        stochss_species.append(stochss_specie)

    return stochss_species, algorithm


def get_parameters(parameters):
    stochss_parameters = []

    for name in parameters.keys():
        parameter = parameters[name]

        stochss_parameter = {"name":parameter.name,
                             "value":float(parameter.expression)
                            }

        stochss_parameters.append(stochss_parameter)

    return stochss_parameters


def get_reactions(reactions, stochss_species):
    stochss_reactions = []

    for name in reactions.keys():
        reaction = reactions[name]

        stochss_reaction = {"name":reaction.name,
                            "reactionType": "custom-propensity",
                            "massaction": False,
                            "propensity": reaction.propensity_function,
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

        annotation = build_annotation(stochss_reactants, stochss_products)
        stochss_reaction['annotation'] = annotation
        
        stochss_reactions.append(stochss_reaction)

    return stochss_reactions


def get_reactants(reactants, stochss_species):
    stochss_reactants = []

    for specie in reactants.keys():
        ratio = reactants[specie]
        stoich_species = get_specie(stochss_species, specie.name)

        stochss_reactant = {"ratio":ratio,"specie":stoich_species}
        stochss_reactants.append(stochss_reactant)

    return stochss_reactants


def get_products(products, stochss_species):
    stochss_products = []

    for specie in products.keys():
        ratio = products[specie]
        stoich_species = get_specie(stochss_species, specie.name)

        stochss_product = {"ratio":ratio,"specie":stoich_species}
        stochss_products.append(stochss_product)

    return stochss_products


def get_specie(stochss_species, name):
    return list(filter(lambda specie: specie['name'] == name, stochss_species))[0]


def get_parameter(stochss_parameters, name):
    return list(filter(lambda parameter: parameter['name'] == name, stochss_parameters))[0]


def build_annotation(stochss_reactants, stochss_products):
    annotation = ""

    if len(stochss_reactants):
        reactant_elements = list(map(build_annotation_element, stochss_reactants))
        reactants_annotation = '+'.join(reactant_elements)
    else:
        reactants_annotation = "\\emptyset"
    annotation += reactants_annotation

    annotation += " \\rightarrow "

    if len(stochss_products):
        product_elements = list(map(build_annotation_element, stochss_products))
        products_annotation = '+'.join(product_elements)
    else:
        products_annotation = "\\emptyset"
    annotation += products_annotation

    return annotation


def build_annotation_element(stoich_specie):
    ratio = stoich_specie['ratio']
    name = stoich_specie['specie']['name']

    if ratio > 1:
        return "{0}{1}".format(ratio, name)
    else:
        return name


def get_events(events, stochss_species, stochss_parameters):
    stochss_events = []

    for name in events.keys():
        event = events['name']

        stochss_event = {"name": event.name,
                         "delay": event.delay,
                         "priority": event.priority,
                         "triggerExpression": event.trigger.expression,
                         "initialValue": event.trigger.value,
                         "persistent": event.trigger.persistent,
                         "useValuesFromTriggerTime": event.use_values_from_trigger_time,
                         "eventAssignment": []
                        }

        assignments = event.assignments
        stochss_assignments = get_event_assignments(assignments, stochss_species, stochss_parameters)
        stochss_event['eventAssignment'].extend(stochss_assignments)

        stochss_events.append(stochss_event)

    return stochss_events


def get_event_assignment(assignments, stochss_species, stochss_parameters):
    stochss_assignments = []

    for assignment in assignments:
        try:
            variable = get_specie(stochss_species, assignment.variable)
        except:
            variable = get_parameter(stochss_parameters, assignment.variable)

        stochss_assignment = {"variable": variable,
                              "expression": assignment.expression
                             }

        stochss_assignments.append(stochss_assignment)

    return stochss_assignments


def get_rate_rules(rate_rules, stochss_species):
    stochss_rate_rules = []

    for name in rate_rules.keys():
        rate_rule = rate_rules[name]

        specie = get_specie(stochss_species, rate_rule.species.name)

        stochss_rate_rule = {"name":rate_rule.name,
                             "rule":rate_rule.expression,
                             "specie":specie
                            }

        stochss_rate_rules.append(stochss_rate_rule)

    return stochss_rate_rules


def get_parsed_args():
    parser = argparse.ArgumentParser(description="Convert a SBML model file into a StochSS model file.")
    parser.add_argument('path', help="The path from the user directory to the SBML file.")
    parser.add_argument('model_template', help="StochSS model template to build the model.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    full_path = os.path.join(user_dir, args.path)
    template = json.loads(args.model_template)
    gillespy_model, errors = convert_to_gillespy_model(full_path)
    errors = list(map(lambda error: error[0], errors))
    msg = convert_to_stochss_model(template, gillespy_model, full_path)
    resp = {"message":msg,"errors":errors}
    print(json.dumps(resp))