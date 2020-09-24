#!/usr/bin/env python3

import os
import ast
import json
import traceback

from json.decoder import JSONDecodeError
import libsbml

from .rename import get_unique_file_name, get_file_name
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, \
                            JSONFileNotModelError, FileNotSBMLFormatError, \
                            ImporperMathMLFormatError


def convert_to_sbml(_path, write_to_file=True):
    user_dir = "/home/jovyan"

    path = os.path.join(user_dir, _path)
    model_file = path.split('/').pop()
    model_name = get_file_name(model_file)
    sbml_file = model_name + ".sbml"
    sbml_path, changed = get_unique_file_name(sbml_file, path.split(model_file)[0])
    if changed:
        sbml_file = sbml_path.split('/').pop()

    model = get_stochss_model(path)
    model['name'] = model_name

    try:
        document = libsbml.SBMLDocument(3, 2)
    except ValueError as err:
        raise FileNotSBMLFormatError("Could not create SBML object."+str(err),
                                     traceback.format_exc())

    sbml_model = document.createModel()
    sbml_model.setName(str(model['name']))

    compartment = sbml_model.createCompartment()
    compartment.setId('c')
    compartment.setConstant(True)
    compartment.setSize(1)
    compartment.setSpatialDimensions(3)

    try:
        convert_species(sbml_model, model['species'])

        convert_parameters(sbml_model, model['parameters'])

        convert_reactions(sbml_model, model['reactions'])

        convert_events(sbml_model, model['eventsCollection'])

        rate_rules = get_rate_rules(model['rules'])
        convert_rate_rules(sbml_model, rate_rules)

        assignment_rules = get_assignment_rules(model['rules'])
        convert_assignment_rules(sbml_model, assignment_rules)

        convert_function_definitions(sbml_model, model['functionDefinitions'])
    except KeyError as err:
        raise JSONFileNotModelError("Could not convert your model: " + str(err),
                                    traceback.format_exc())

    if write_to_file:
        write_sbml_to_file(sbml_path, document)

        return {"Message":"{0} was successfully converted to {1}".format(model_file, sbml_file),
                "File":sbml_file}
    return document


def get_rate_rules(rules):
    rate_rules = []
    for rule in rules:
        if rule['type'] == "Rate Rule" and not rule['expression'] == "":
            rate_rules.append(rule)
    return rate_rules


def get_assignment_rules(rules):
    assignment_rules = []
    for rule in rules:
        if rule['type'] == "Assignment Rule" and not rule['expression'] == "":
            assignment_rules.append(rule)
    return assignment_rules


def convert_species(sbml_model, species):
    for specie in species:
        spec = sbml_model.createSpecies()
        spec.initDefaults()
        spec.setCompartment('c')
        spec.setId(specie['name'])
        spec.setInitialAmount(specie['value'])


def convert_parameters(sbml_model, parameters):
    for parameter in parameters:
        param = sbml_model.createParameter()
        param.initDefaults()
        param.setId(parameter['name'])
        param.setValue(ast.literal_eval(parameter['expression']))


def convert_reactions(sbml_model, reactions):
    for reaction in reactions:
        reac = sbml_model.createReaction()
        reac.initDefaults()
        reac.setId(reaction['name'])

        _reactants = reaction['reactants']
        reactants = convert_reactants(reac, _reactants)

        _products = reaction['products']
        convert_products(reac, _products)

        create_equation(reac, reaction, reactants)


def convert_reactants(sbml_reaction, _reactants):
    reactants = {}

    for reactant in _reactants:
        specie = reactant['specie']
        if specie['name'] not in reactants:
            reactants[specie['name']] = 0
        reactants[specie['name']] += reactant['ratio']

    for name, ratio in reactants.items():
        react = sbml_reaction.createReactant()
        react.setConstant(True)
        react.setSpecies(name)
        react.setStoichiometry(ratio)

    return reactants


def convert_products(sbml_reaction, _products):
    products = {}

    for product in _products:
        specie = product['specie']
        if specie['name'] not in products:
            products[specie['name']] = 0
        products[specie['name']] += product['ratio']

    for name, ratio in products.items():
        prod = sbml_reaction.createProduct()
        prod.setConstant(True)
        prod.setSpecies(name)
        prod.setStoichiometry(ratio)


def create_equation(sbml_reaction, reaction, reactants):
    kin_law = sbml_reaction.createKineticLaw()
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
        kin_law.setMath(libsbml.parseL3Formula(equation))
    except Exception:
        raise ImporperMathMLFormatError('libsbml threw an error when parsing rate equation "{0}" \
                    for reaction "{1}"'.format(equation, reaction['name']), traceback.format_exc())


def convert_events(sbml_model, events):
    for event in events:
        evt = sbml_model.createEvent()
        evt.setId(event['name'])
        evt.setUseValuesFromTriggerTime(event['useValuesFromTriggerTime'])

        if event['delay']:
            delay = event['delay'].replace('and', '&&').replace('or', '||')
            dly = evt.createDelay()
            try:
                dly.setMath(libsbml.parseL3Formula(delay))
            except Exception:
                raise ImporperMathMLFormatError('libsbml threw an error when parsing \
                            delay equation "{0}" for event "{1}"'.format(delay, event['name']),
                                                traceback.format_exc())

        priority = event['priority'].replace('and', '&&').replace('or', '||')
        prior = evt.createPriority()
        try:
            prior.setMath(libsbml.parseL3Formula(priority))
        except Exception:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing priority \
                        equation "{0}" for event "{1}"'.format(priority, event['name']),
                                            traceback.format_exc())

        trigger_expression = event['triggerExpression'].replace('and', '&&').replace('or', '||')
        trig = evt.createTrigger()
        try:
            trig.setMath(libsbml.parseL3Formula(trigger_expression))
        except Exception:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing trigger \
                        equation "{0}" for event "{1}"'.format(trigger_expression, event['name']),
                                            traceback.format_exc())
        trig.setInitialValue(event['initialValue'])
        trig.setPersistent(event['persistent'])

        assignments = event['eventAssignments']
        convert_event_assignments(event['name'], evt, assignments)


def convert_event_assignments(event_name, sbml_event, assignments):
    for assignment in assignments:
        assign = sbml_event.createEventAssignment()

        variable = assignment['variable']
        assign.setVariable(variable['name'])

        expression = assignment['expression'].replace('and', '&&').replace('or', '||')
        try:
            assign.setMath(libsbml.parseL3Formula(expression))
        except Exception:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing assignment \
                        equation "{0}" for event "{1}"'.format(assignment, event_name),
                                            traceback.format_exc())


def convert_rate_rules(sbml_model, rules):
    for rule in rules:
        variable = rule['variable']
        r_rule = sbml_model.createRateRule()
        r_rule.setId(rule['name'])
        r_rule.setVariable(variable['name'])
        equation = rule['expression'].replace("and", "&&").replace("or", "||")

        try:
            r_rule.setMath(libsbml.parseL3Formula(equation))
        except Exception:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing rate \
                        equation "{0}" for rate rule "{1}"'.format(equation, rule['name']),
                                            traceback.format_exc())


def convert_assignment_rules(sbml_model, rules):
    for rule in rules:
        variable = rule['variable']
        a_rule = sbml_model.createAssignmentRule()
        a_rule.setId(rule['name'])
        a_rule.setVariable(variable['name'])
        equation = rule['expression'].replace("and", "&&").replace("or", "||")

        try:
            a_rule.setMath(libsbml.parseL3Formula(equation))
        except:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing assignment \
                        equation "{0}" for assignment rule "{1}"'.format(equation, rule['name']),
                                            traceback.format_exc())


def convert_function_definitions(sbml_model, function_definitions):
    for function_definition in function_definitions:
        func_def = sbml_model.createFunctionDefinition()
        func_def.setId(function_definition['name'])
        function = (function_definition['function']
                    .replace("and", "&&").replace("or", "||").replace("**", "^"))

        try:
            node = libsbml.parseL3Formula(function)
            func_def.setMath(node)
        except:
            raise ImporperMathMLFormatError('libsbml threw an error when parsing function "{0}" \
                             for function definition "{1}"'.format(function,
                                                                   function_definition['name']),
                                            traceback.format_exc())


def write_sbml_to_file(sbml_path, sbml_doc):
    writer = libsbml.SBMLWriter()

    with open(sbml_path, "w") as sbml_file:
        sbml_file.write(writer.writeSBMLToString(sbml_doc))


def get_stochss_model(path):
    try:
        with open(path, "r") as model_file:
            model = json.loads(model_file.read())
        return model
    except FileNotFoundError as err:
        raise ModelNotFoundError("Could not finf model file: " + str(err), traceback.format_exc())
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The model is not JSON decodable: " + str(err),
                                      traceback.format_exc())
