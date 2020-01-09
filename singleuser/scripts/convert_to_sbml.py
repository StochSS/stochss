#!/usr/bin/env python3

import libsbml
import json
import argparse
import os
from rename import get_unique_file_name


user_dir = "/home/jovyan"


def convert_to_sbml(model):
    try:
        document = libsbml.SBMLDocument(3,2)
    except ValueError:
        raise SystemExit("Could not create SBML object.")

    sbml_model = document.createModel()
    sbml_model.setName(str(model['name']))

    c = sbml_model.createCompartment()
    c.setId('c')
    c.setConstant(True)
    c.setSize(1)
    c.setSpatialDimensions(3)

    species = model['species']
    convert_species(sbml_model, species)

    parameters = model['parameters']
    convert_parameters(sbml_model, parameters)

    reactions = model['reactions']
    convert_reactions(sbml_model, reactions)

    events = model['eventsCollection']
    convert_events(sbml_model, events)

    rate_rules = model['rateRules']
    convert_rate_rules(sbml_model, rate_rules)
    
    return document


def convert_species(sbml_model, species):
    for specie in species:
        s = sbml_model.createSpecies()
        s.initDefaults()
        s.setCompartment('c')
        s.setId(specie['name'])
        s.setInitialAmount(specie['value'])


def convert_parameters(sbml_model, parameters):
    for parameter in parameters:
        p = sbml_model.createParameter()
        p.initDefaults()
        p.setId(parameter['name'])
        p.setValue(float(parameter['value']))


def convert_reactions(sbml_model, reactions):
    for reaction in reactions:
        r = sbml_model.createReaction()
        r.initDefaults()
        r.setId(reaction['name'])

        _reactants = reaction['reactants']
        reactants = convert_reactants(r, _reactants)

        _products = reaction['products']
        products = convert_products(r, _products)

        create_equation(r, reaction, reactants)


def convert_reactants(sbml_reaction, _reactants):
    reactants = {}

    for reactant in _reactants:
        specie = reactant['specie']
        if specie['name'] not in reactants:
            reactants[specie['name']] = 0
        reactants[specie['name']] += reactant['ratio']

    for name, ratio in reactants.items():
        r = sbml_reaction.createReactant()
        r.setConstant(True)
        r.setSpecies(name)
        r.setStoichiometry(ratio)

    return reactants


def convert_products(sbml_reaction, _products):
    products = {}

    for product in _products:
        specie = product['specie']
        if specie['name'] not in products:
            products[specie['name']] = 0
        products[specie['name']] += product['ratio']

    for name, ratio in products.items():
        p = sbml_reaction.createProduct()
        p.setConstant(True)
        p.setSpecies(name)
        p.setStoichiometry(ratio)

    return products


def create_equation(sbml_reaction, reaction, reactants):
    k = sbml_reaction.createKineticLaw()
    rate = reaction['rate']
    if not reaction['propensity']:
        if len(reactants) == 0:
            equation = "{0}".format(rate['name'])
        elif len(reactants) == 1:
            name = list(reactants.keys())[0]
            ratio = reactants[name]
            equation = '{0} * {1}'.format(rate['name'], name)
            if ratio == 2:
                equation += " * {0}".format(name)
        else:
            name0, name1 = list(reactants.keys())
            equation = "{0} * {1} * {2}".format(rate['name'], name0, name1)
    else:
        equation = reaction['propensity'].replace("and", "&&").replace("or", "||")

    try:
        k.setMath(libsbml.parseL3Formula(equation))
    except Exception as error:
        raise Exception('libsbml threw an error when parsing rate equation "{0}" for reaction "{1}"'.format(equation, reaction['name']))


def convert_events(sbml_model, events):
    for event in events:
        e = sbml_model.createEvent()
        e.setId(event['name'])
        e.setUseValuesFromTriggerTime(event['useValuesFromTriggerTime'])

        delay = event['delay'].replace('and', '&&').replace('or', '||')
        d = e.createDelay()
        try:
            d.setMath(libsbml.parseL3Formula(delay))
        except Exception as error:
            raise Exception('libsbml threw an error when parsing delay equation "{0}" for event "{1}"'.format(delay, event['name']))

        priority = event['priority'].replace('and', '&&').replace('or', '||')
        p = e.createPriority()
        try:
            p.setMath(libsbml.parseL3Formula(priority))
        except Exception as error:
            raise Exception('libsbml threw an error when parsing priority equation "{0}" for event "{1}"'.format(priority, event['name']))

        trigger_expression = event['triggerExpression'].replace('and','&&').replace('or','||')
        t = e.createTrigger()
        try:
            t.setMath(libsbml.parseL3Formula(trigger_expression))
        except Exception as error:
            raise Exception('libsbml threw an error when parsing trigger equation "{0}" for event "{1}"'.format(trigger_expression, event['name']))
        t.setInitialValue(event['initialValue'])
        t.setPersistent(event['persistent'])

        assignments = event['eventAssignments']
        convert_event_assignments(event['name'], e, assignments)


def convert_event_assignments(event_name, sbml_event, assignments):
    for assignment in assignments:
        a = sbml_event.createEventAssignment()

        variable = assignment['variable']
        a.setVariable(variable['name'])

        expression = assignment['expression'].replace('and','&&').replace('or','||')
        try:
            a.setMath(libsbml.parseL3Formula(expression))
        except Exception as error:
            raise Exception('libsbml threw an error when parsing assignment equation "{0}" for event "{1}"'.format(assignment, event_name))


def convert_rate_rules(sbml_model, rules):
    for rule in rules:
        species = rule['specie']
        r = sbml_model.createRateRule()
        r.setId(rule['name'])
        r.setVariable(species['name'])
        equation = rule['rule']
        equation = equation.replace("and", "&&")
        equation = equation.replace("or", "||")

        try:
            r.setMath(libsbml.parseL3Formula(equation))
        except Exception as error:
            raise Exception('libsbml threw an error when parsing rate equation "{0}" for rate rule "{1}"'.format(equation, rule['name']))


def write_sbml_to_file(sbml_path, sbml_doc):
    writer = libsbml.SBMLWriter()

    with open(sbml_path, "w") as sbml_file:
        sbml_file.write(writer.writeSBMLToString(sbml_doc))


def get_stochss_model(path):
    with open(path, "r") as model_file:
        model = json.loads(model_file.read())
    return model


def get_parsed_args():
    parser = argparse.ArgumentParser(description="Convert a StochSS model into SBML format.")
    parser.add_argument('path', help="The path from the user directory to the target model.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    path = os.path.join(user_dir, args.path)
    model_file = path.split('/').pop()
    model_name = model_file.split('.')[0]
    sbml_file = model_name + ".sbml"
    sbml_path = get_unique_file_name(sbml_file, path.split(model_file)[0])[0]
    model = get_stochss_model(path)
    model['name'] = model_name
    sbml_doc = convert_to_sbml(model)
    write_sbml_to_file(sbml_path, sbml_doc)