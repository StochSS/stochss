import unittest
import json

template_path = "model_templates/nonSpatialModelTemplate.json"


class TestNonSpatialModelTemplate(unittest.TestCase):

    def test_model_elements(self):
        with open(template_path, "r") as template_file:
            template = json.load(template_file)

        template_keys = list(template.keys())
        model_path = "client/models/model.js"

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))
            
        template_keys.sort()
        model_keys.sort()
        self.assertEqual(template_keys, model_keys)


    def test_model_settings_elements(self):
        with open(template_path, "r") as template_file:
            template = json.load(template_file)

        template_keys = list(template['modelSettings'].keys())
        mdl_settings_path = "client/models/model-settings.js"
        
        with open(mdl_settings_path, "r") as mdl_settings_file:
            data = mdl_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            mdl_settings_keys = list(map(lambda item: item.strip().split(':')[0], data))

        template_keys.sort()
        mdl_settings_keys.sort()
        self.assertEqual(template_keys, mdl_settings_keys)


    def test_simulation_settings_elements(self):
        with open(template_path, "r") as template_file:
            template = json.load(template_file)

        template_keys = list(template['simulationSettings'].keys())
        sim_settings_path = "client/models/simulation-settings.js"

        with open(sim_settings_path, "r") as sim_settings_file:
            data = sim_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            sim_settings_keys = list(map(lambda item: item.strip().split(':')[0], data))

        template_keys.sort()
        sim_settings_keys.sort()
        self.assertEqual(template_keys, sim_settings_keys)


    def test_psweep_settings_elements(self):
        with open(template_path, "r") as template_file:
            template = json.load(template_file)

        template_keys = list(template['parameterSweepSettings'].keys())
        psweep_settings_path = "client/models/parameter-sweep-settings.js"

        with open(psweep_settings_path, "r") as psweep_settings_file:
            data = psweep_settings_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            psweep_settings_keys = list(map(lambda item: item.strip().split(':')[0], props))
            psweep_settings_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))
        
        template_keys.sort()
        psweep_settings_keys.sort()
        self.assertEqual(template_keys, psweep_settings_keys)

