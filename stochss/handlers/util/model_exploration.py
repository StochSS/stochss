#!/usr/bin/env python3

'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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

from stochss.handlers.util.stochss_errors import StochSSPermissionsError

class ModelExploration():

    def __init__(self, wkfl_path, mdl_path, settings=None):
        self.wkfl_path = wkfl_path
        self.mdl_path = mdl_path
        self.settings = self.get_settings() if settings is None else settings
        self.mdl_file = mdl_path.split('/').pop()
        self.info_path = os.path.join(wkfl_path, 'info.json')
        self.log_path = os.path.join(wkfl_path, 'logs.txt')
        self.wkfl_mdl_path = os.path.join(wkfl_path, self.mdl_file)
        self.res_path = os.path.join(wkfl_path, 'results')
        wkfl_name_elements = wkfl_path.split('/').pop().split('.')[0].split('_')
        try:
            date, time = wkfl_name_elements[-2:]
            if date.isdigit() and time.isdigit():
                self.wkfl_timestamp = '_'.join(["",date,time])
            else:
                self.wkfl_timestamp = None
        except:
            self.wkfl_timestamp = None


    def get_settings(self):
        settings_path = os.path.join(self.wkfl_path, "settings.json")

        if os.path.exists(settings_path):
            with open(settings_path, "r") as settings_file:
                return json.load(settings_file)

        with open("/stochss/stochss_templates/workflowSettingsTemplate.json", "r") as template_file:
            settings_template = json.load(template_file)
        
        if os.path.exists(self.wkfl_mdl_path):
            with open(self.wkfl_mdl_path, "r") as mdl_file:
                mdl = json.load(mdl_file)
                try:
                    settings = {"simulationSettings":mdl['simulationSettings'],
                                "parameterSweepSettings":mdl['parameterSweepSettings'],
                                "modelExplarationSettings":settings_template['modelExplorationSettings'],
                                "resultsSettings":settings_template['resultsSettings']}
                    return settings
                except:
                    return settings_template
        else:
            return settings_template


    def save(self):
        settings_path = os.path.join(self.wkfl_path, "settings.json")
        with open(settings_path, "w") as settings_file:
            json.dump(self.settings, settings_file)


    def run(self, gillespy2_model, verbose):
        message = "StochSS Model Exploration Jobs are currently not supported"
        raise StochSSPermissionsError(message)
