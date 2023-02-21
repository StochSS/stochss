'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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

import unittest
import json
import os

os.chdir('/stochss')

class TestModelTemplate(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for model template completeness.
    ################################################################################################
    '''
    def setUp(self):
        '''
        Get the model template prior to each test.
        '''
        template_path = "stochss_templates/modelTemplate.json"

        with open(template_path, "r", encoding="utf8") as template_file:
            self.template = json.load(template_file)


    def test_model_elements(self):
        '''
        Check if the model template has all of the properties currently in the model model.
        '''
        template_keys = sorted(list(self.template.keys()))
        model_path = "client/models/model.js"

        with open(model_path, "r", encoding="utf8") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = list(map(lambda item: item.strip().split(':')[0], props))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))
            model_keys.extend(list(map(lambda item: item.strip().split(':')[0], children)))

        model_keys.sort()
        self.assertEqual(template_keys, model_keys)


    def test_timespan_settings_elements(self):
        '''
        Check if the timespan settings in the model template has
        all of the properties currently in the timespan settings model.
        '''
        template_keys = sorted(list(self.template['modelSettings'].keys()))
        mdl_settings_path = "client/models/timespan-settings.js"

        with open(mdl_settings_path, "r", encoding="utf8") as mdl_settings_file:
            data = mdl_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            mdl_settings_keys = sorted(list(map(lambda item: item.strip().split(':')[0], data)))

        self.assertEqual(template_keys, mdl_settings_keys)


    def test_model_domain_elements(self):
        '''
        Check if the domain in the model template has all of the
        properties currently in the domain model.
        '''
        template_keys = sorted(list(self.template['domain'].keys()))
        domain_path = "client/models/domain.js"

        with open(domain_path, "r", encoding="utf8") as domain_file:
            data = domain_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            domain_keys = list(map(lambda item: item.strip().split(':')[0], props))
            domain_keys.extend(list(map(lambda item: item.strip().split(':')[0], collections)))

        domain_keys.sort()
        self.assertEqual(template_keys, domain_keys)
