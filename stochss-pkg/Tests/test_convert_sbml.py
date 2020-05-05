import unittest, sys, os, inspect
import tempfile
from gillespy2 import Model
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir) 

from handlers.util.convert_sbml_to_model import *
from handlers.util.stochss_errors import StochSSAPIError, StochSSFileNotFoundError

class TestConvertSBMLToModel(unittest.TestCase):

    def test_sbml_to_gillespy_success_with_stochss_model(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)
        self.assertIsInstance(gillespy2_model, Model)
        self.assertIsInstance(errors, list)
        

    def test_sbml_to_gillespy_convert_error(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test2.sbml"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)
        self.assertIsNone(gillespy2_model)
        self.assertIsInstance(errors, list)


    def test_sbml_to_gillespy_file_not_found_error(self):
        expected = StochSSFileNotFoundError("")
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test3.sbml"

        try:
            resp = convert_to_gillespy_model(sbml_file)
            self.assertNotIsInstance(resp, tuple)
        except StochSSAPIError as err:
            self.assertIsInstance(err, StochSSFileNotFoundError)
            self.assertEqual(err.status_code, expected.status_code)
            self.assertEqual(err.reason, expected.reason)


    def test_build_stochss_species_from_gillespy_species(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/specie.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        species_keys = list(get_species(gillespy2_model.listOfSpecies, 1)[0][0].keys())
        species_keys.sort()
        self.assertEqual(species_keys, model_keys)


    def test_build_stochss_parameter_from_gillespy_parameter(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/parameter.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        parameter_keys = list(get_parameters(gillespy2_model.listOfParameters, 1)[0][0].keys())
        parameter_keys.sort()
        self.assertEqual(parameter_keys, model_keys)


    def test_build_stochss_reaction_from_gillespy_reaction(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/reaction.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        reaction_keys = list(get_reactions(gillespy2_model.listOfReactions, species, 1)[0][0].keys())
        reaction_keys.sort()
        self.assertEqual(reaction_keys, model_keys)


    def test_build_stochss_reactant_from_gillespy_reactant(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/stoich-specie.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        reactant_keys = list(get_reactants(list(gillespy2_model.listOfReactions.popitem(last=False)).pop().reactants, species)[0].keys())
        reactant_keys.sort()
        self.assertEqual(reactant_keys, model_keys)


    def test_build_stochss_product_from_gillespy_product(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/stoich-specie.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        product_keys = list(get_products(list(gillespy2_model.listOfReactions.popitem(last=False)).pop().products, species)[0].keys())
        product_keys.sort()
        self.assertEqual(product_keys, model_keys)


    def test_build_stochss_event_from_gillespy_event(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/event.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        parameters = get_parameters(gillespy2_model.listOfParameters, 1)[0]
        event_keys = list(get_events(gillespy2_model.listOfEvents, species, parameters, 1)[0][0].keys())
        event_keys.sort()
        self.assertEqual(event_keys, model_keys)


    def test_build_stochss_event_assignment_from_gillespy_event_assignment(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/event-assignment.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        parameters = get_parameters(gillespy2_model.listOfParameters, 1)[0]
        assignment_keys = list(get_event_assignment(list(gillespy2_model.listOfEvents.popitem(last=False)).pop().assignments, species, parameters)[0].keys())
        assignment_keys.sort()
        self.assertEqual(assignment_keys, model_keys)


    def test_build_stochss_rate_rule_from_gillespy_rate_rule(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/rule.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        parameters = get_parameters(gillespy2_model.listOfParameters, 1)[0]
        rate_rule_keys = list(get_rate_rules(gillespy2_model.listOfRateRules, species, parameters, 1)[0][0].keys())
        rate_rule_keys.sort()
        self.assertEqual(rate_rule_keys, model_keys)


    def test_build_stochss_assignment_rule_from_gillespy_assignment_rule(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/rule.js"
        gillespy2_model, errors = convert_to_gillespy_model(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        species = get_species(gillespy2_model.listOfSpecies, 1)[0]
        parameters = get_parameters(gillespy2_model.listOfParameters, 1)[0]
        assignment_rule_keys = list(get_assignment_rules(gillespy2_model.listOfAssignmentRules, species, parameters, 1)[0][0].keys())
        assignment_rule_keys.sort()
        self.assertEqual(assignment_rule_keys, model_keys)


    def test_build_stochss_function_definition_from_sbml_function_definition(self):
        sbml_file = "stochss-pkg/Tests/mock_file_sys/sbml_files/test1.sbml"
        model_path = "client/models/function-definition.js"
        function_definitions = get_sbml_function_definitions(sbml_file)

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.sort()

        function_definition_keys = list(get_function_definitions(function_definitions, 1)[0][0].keys())
        function_definition_keys.sort()
        self.assertEqual(function_definition_keys, model_keys)

