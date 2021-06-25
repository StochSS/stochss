import unittest
import json
import os

os.chdir('/stochss')

class TestNonSpatialModelTemplate(unittest.TestCase):

    def setUp(self):
        template_path = "stochss_templates/nonSpatialModelTemplate.json"

        with open(template_path, "r") as template_file:
            self.template = json.load(template_file)


    def test_model_elements(self):
        template_keys = sorted(list(self.template.keys()))
        model_path = "client/models/model.js"

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))

        model_keys.sort()
        self.assertEqual(template_keys, model_keys)


    def test_model_settings_elements(self):
        template_keys = sorted(list(self.template['modelSettings'].keys()))
        mdl_settings_path = "client/models/model-settings.js"

        with open(mdl_settings_path, "r") as mdl_settings_file:
            data = mdl_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            mdl_settings_keys = sorted(list(map(lambda item: item.strip().split(':')[0], data)))

        self.assertEqual(template_keys, mdl_settings_keys)
