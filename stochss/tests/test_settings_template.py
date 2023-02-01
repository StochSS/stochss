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

class TestWorkflowSettingsTemplate(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for settings template completeness.
    ################################################################################################
    '''
    def setUp(self):
        '''
        Get the settings template prior to each test.
        '''
        template_path = "stochss_templates/workflowSettingsTemplate.json"

        with open(template_path, "r") as template_file:
            self.template = json.load(template_file)

    def test_workflow_settings_elements(self):
        '''
        Check if the settings template has all of the properties currently in the settings model.
        '''
        template_keys = sorted(list(self.template.keys()))
        model_path = "client/models/settings.js"

        with open(model_path, "r") as model_file:
            data = model_file.read()
            props = data.split("props: {").pop().split("}")[0].split(",")
            children = data.split("children: {").pop().split('}')[0].split(',')
            model_keys = sorted(list(map(lambda item: item.strip().split(':')[0], props)))
            model_keys.extend(sorted(list(map(lambda item: item.strip().split(':')[0], children))))

        model_keys.sort()
        self.assertEqual(template_keys, model_keys)


    def test_workflow_simulation_settings_elements(self):
        '''
        Check if the simulation settings in the settings template has
        all of the properties currently in the simulation settings model.
        '''
        template_keys = sorted(list(self.template['simulationSettings'].keys()))
        sim_settings_path = "client/models/simulation-settings.js"

        with open(sim_settings_path, "r") as sim_settings_file:
            data = sim_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            sim_settings_keys = sorted(list(map(lambda item: item.strip().split(':')[0], data)))

        self.assertEqual(template_keys, sim_settings_keys)


    def test_workflow_parameter_sweep_settings_elements(self):
        '''
        Check if the parameter sweep settings in the settings template has
        all of the properties currently in the parameter sweep settings model.
        '''
        template_keys = sorted(list(self.template['parameterSweepSettings'].keys()))
        psweep_settings_path = "client/models/parameter-sweep-settings.js"

        with open(psweep_settings_path, "r") as psweep_settings_file:
            data = psweep_settings_file.read()
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            children = data.split("children: {").pop().split('}')[0].split(',')
            psweep_settings_keys = list(map(lambda item: item.strip().split(':')[0], collections))
            psweep_settings_keys.extend(list(map(lambda item: item.strip().split(':')[0],
                                                 children)))

        psweep_settings_keys.sort()
        self.assertEqual(template_keys, psweep_settings_keys)


    def test_workflow_results_settings_elements(self):
        '''
        Check if the results settings in the settings template has
        all of the properties currently in the results settings model.
        '''
        template_keys = sorted(list(self.template['resultsSettings'].keys()))
        results_settings_path = "client/models/results-settings.js"

        with open(results_settings_path, "r") as results_settings_file:
            data = results_settings_file.read().split("props: {").pop().split("}")[0].split(",")
            results_settings_keys = sorted(list(map(lambda item: item.strip().split(":")[0], data)))

        self.assertEqual(template_keys, results_settings_keys)


    def test_workflow_timespan_settings_elements(self):
        '''
        Check if the timespan settings in the model template has
        all of the properties currently in the timespan settings model.
        '''
        template_keys = sorted(list(self.template['timespanSettings'].keys()))
        tspan_settings_path = "client/models/timespan-settings.js"

        with open(tspan_settings_path, "r") as tspan_settings_file:
            data = tspan_settings_file.read().split("props: {").pop().split('}')[0].split(',')
            tspan_settings_keys = sorted(list(map(lambda item: item.strip().split(':')[0], data)))

        self.assertEqual(template_keys, tspan_settings_keys)


    def test_workflow_inference_settings_elements(self):
        '''
        Check if the inference settings in the settings template has
        all of the properties currently in the inference settings model.
        '''
        template_keys = sorted(list(self.template['inferenceSettings'].keys()))
        tspan_settings_path = "client/models/inference-settings.js"

        with open(tspan_settings_path, "r") as tspan_settings_file:
            data = tspan_settings_file.read()
            props = data.split("props: {").pop().split('}')[0].split(',')
            collections = data.split("collections: {").pop().split('}')[0].split(',')
            inf_settings_keys = sorted(list(map(lambda item: item.strip().split(':')[0], props)))
            inf_settings_keys.extend(
                sorted(list(map(lambda item: item.strip().split(':')[0], collections)))
            )

        inf_settings_keys.sort()
        self.assertEqual(template_keys, inf_settings_keys)
