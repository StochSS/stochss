'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
import ast
import json
import string
import hashlib
import tempfile
import traceback

from escapism import escape
from gillespy2.sbml.SBMLexport import export
from gillespy2.core.jsonify import ComplexJsonCoder
from gillespy2 import (
    Model, Species, Parameter, Reaction, Event, EventTrigger, EventAssignment,
    RateRule, AssignmentRule, FunctionDefinition, TimeSpan
)

from .stochss_base import StochSSBase
from .stochss_errors import StochSSAPIError, StochSSFileNotFoundError, FileNotJSONFormatError, \
                            StochSSModelFormatError, StochSSPermissionsError

class StochSSModel(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, path, new=False, model=None):
        '''
        Intitialize a model object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the model
        new : bool
            Indicates whether or not the model is new
        model : str or dict
            Existing model data
        '''
        super().__init__(path=path)
        if new:
            if model is None:
                model = self.get_model_template()
            if isinstance(model, str):
                model = json.loads(model)
            self.model = model
            self.make_parent_dirs()
            new_path, changed = self.get_unique_path(name=self.get_file())
            if changed:
                self.path = new_path.replace(self.user_dir + '/', "")
            with open(new_path, "w", encoding="utf-8") as mdl_file:
                json.dump(model, mdl_file, indent=4, sort_keys=True, cls=ComplexJsonCoder)
        else:
            self.model = None


    @classmethod
    def __convert_event_assignments(cls, model, event):
        species = model.get_all_species()
        parameters = model.get_all_parameters()
        assignments = []
        try:
            for assignment in event['eventAssignments']:
                if assignment['expression'] != "":
                    name = assignment['variable']['name']
                    var = species[name] if name in species.keys() else parameters[name]
                    g_assignment = EventAssignment(variable=var,
                                                   expression=assignment['expression'])
                    assignments.append(g_assignment)
            return assignments
        except KeyError as err:
            message = "Event assignments are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    @classmethod
    def __convert_event_trigger(cls, event):
        if event['triggerExpression'] == "":
            return None
        return EventTrigger(expression=event['triggerExpression'],
                            initial_value=event['initialValue'],
                            persistent=event['persistent'])


    def __convert_events(self, model):
        try:
            for event in self.model['eventsCollection']:
                assignments = self.__convert_event_assignments(model=model, event=event)
                trigger = self.__convert_event_trigger(event=event)
                if assignments and trigger is not None:
                    delay = event['delay'] if event['delay'] != "" else None
                    g_event = Event(name=event['name'],
                                    delay=delay,
                                    assignments=assignments,
                                    priority=event['priority'],
                                    trigger=trigger,
                                    use_values_from_trigger_time=event['useValuesFromTriggerTime'])
                    model.add_event(g_event)
        except KeyError as err:
            message = "Events are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_function_definitions(self, model):
        try:
            for function_definition in self.model['functionDefinitions']:
                g_func_def = FunctionDefinition(name=function_definition['name'],
                                                args=function_definition['variables'].split(", "),
                                                function=function_definition['expression'])
                model.add_function_definition(g_func_def)
        except KeyError as err:
            message = "Function definitions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_model_settings(self):
        try:
            end = self.model['modelSettings']['endSim']
            step_size = self.model['modelSettings']['timeStep']
            return TimeSpan.arange(step_size, t=end + step_size)
        except KeyError as err:
            message = "Model settings are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_parameters(self, model):
        try:
            for parameter in self.model['parameters']:
                g_parameter = Parameter(name=parameter['name'],
                                        expression=parameter['expression'])
                model.add_parameter(g_parameter)
        except KeyError as err:
            message = "Parameters are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_reactions(self, model):
        try:
            g_parameters = model.get_all_parameters()
            for reaction in self.model['reactions']:
                if not reaction['massaction']:
                    rate = None
                    propensity = reaction['propensity']
                    ode_propensity = reaction['odePropensity']
                else:
                    rate = g_parameters[reaction['rate']['name']]
                    propensity = None
                    ode_propensity = None
                reactants, products = self.__convert_stoich_species(reaction=reaction)
                g_reaction = Reaction(name=reaction['name'],
                                      reactants=reactants,
                                      products=products,
                                      rate=rate,
                                      propensity_function=propensity,
                                      ode_propensity_function=ode_propensity)
                model.add_reaction(g_reaction)
        except KeyError as err:
            message = "Reactions are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_rules(self, model):
        try:
            for rule in self.model['rules']:
                if rule['expression'].strip() != "":
                    rule_class = RateRule if rule['type'] == "Rate Rule" else AssignmentRule
                    g_rule = rule_class(name=rule['name'].strip(),
                                    variable=rule['variable']['name'],
                                    formula=rule['expression'].strip())
                    if rule['type'] == "Rate Rule":
                        model.add_rate_rule(g_rule)
                    else:
                        model.add_assignment_rule(g_rule)
        except KeyError as err:
            message = "Rules are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __convert_species(self, model):
        try:
            default_mode = self.model['defaultMode']
            for species in self.model['species']:
                mode = species['mode'] if default_mode == "dynamic" else default_mode
                s_min = 0 if species['isSwitchTol'] else species['switchMin']
                g_species = Species(name=species['name'].strip(),
                                    initial_value=species['value'],
                                    mode=mode,
                                    switch_tol=species['switchTol'],
                                    switch_min=s_min)
                model.add_species(g_species)
        except KeyError as err:
            message = "Species are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    @classmethod
    def __convert_stoich_species(cls, reaction):
        try:
            reactants = {}
            for stoich_species in reaction['reactants']:
                name = stoich_species['specie']['name']
                if name not in reactants:
                    reactants[name] = stoich_species['ratio']
                else:
                    reactants[name] += stoich_species['ratio']
            products = {}
            for stoich_species in reaction['products']:
                name = stoich_species['specie']['name']
                if name not in products:
                    products[name] = stoich_species['ratio']
                else:
                    products[name] += stoich_species['ratio']
            return reactants, products
        except KeyError as err:
            message = "Reactants or products are not properly formatted or "
            message += f"are referenced incorrectly: {str(err)}"
            raise StochSSModelFormatError(message, traceback.format_exc()) from err


    def __read_model_file(self):
        try:
            with open(self.get_path(full=True), "r", encoding="utf-8") as mdl_file:
                self.model = json.load(mdl_file)
        except FileNotFoundError as err:
            message = f"Could not find the model file: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError as err:
            message = f"The model is not JSON decobable: {str(err)}"
            raise FileNotJSONFormatError(message, traceback.format_exc()) from err


    @classmethod
    def __update_event_assignments(cls, event, param_ids):
        if "eventAssignments" not in event.keys():
            return
        for assignment in event['eventAssignments']:
            try:
                if assignment['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(assignment['variable']['expression'])
                    assignment['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def __update_events(self, param_ids):
        if "eventsCollection" not in self.model.keys() or not param_ids:
            return
        for event in self.model['eventsCollection']:
            self.__update_event_assignments(event=event, param_ids=param_ids)

    def __update_model_to_current(self):
        if self.model['template_version'] == self.TEMPLATE_VERSION:
            return

        param_ids = self.__update_parameters()
        self.__update_reactions()
        self.__update_events(param_ids=param_ids)
        self.__update_rules(param_ids=param_ids)

        if "refLinks" not in self.model.keys():
            self.model['refLinks'] = []

        self.model['template_version'] = self.TEMPLATE_VERSION

    def __update_parameters(self):
        if "parameters" not in self.model.keys():
            return []
        param_ids = []
        for param in self.model['parameters']:
            try:
                param_ids.append(param['compID'])
                if isinstance(param['expression'], str):
                    param['expression'] = ast.literal_eval(param['expression'])
            except KeyError:
                pass
            except ValueError:
                pass
        return param_ids


    def __update_reactions(self):
        if "reactions" not in self.model.keys():
            return
        for reaction in self.model['reactions']:
            if "odePropensity" not in reaction.keys():
                reaction['odePropensity'] = reaction['propensity']
            try:
                if reaction['rate'].keys() and isinstance(reaction['rate']['expression'], str):
                    expression = ast.literal_eval(reaction['rate']['expression'])
                    reaction['rate']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def __update_rules(self, param_ids):
        if "rules" not in self.model.keys() or not param_ids:
            return
        for rule in self.model['rules']:
            try:
                if rule['variable']['compID'] in param_ids:
                    expression = ast.literal_eval(rule['variable']['expression'])
                    rule['variable']['expression'] = expression
            except KeyError:
                pass
            except ValueError:
                pass


    def convert_to_gillespy2(self):
        '''
        Convert a model to a gillespy2 model

        Attributes
        ----------
        '''
        try:
            if self.model is None:
                _ = self.load()
            name = self.get_name()
            tspan = self.__convert_model_settings()
            try:
                g_model = Model(name=name, volume=self.model['volume'], tspan=tspan,
                                annotation=self.model['annotation'])
            except KeyError as err:
                message = "Model properties are not properly formatted or "
                message += f"are referenced incorrectly: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
            self.__convert_species(model=g_model)
            self.__convert_parameters(model=g_model)
            self.__convert_reactions(model=g_model)
            self.__convert_events(model=g_model)
            self.__convert_rules(model=g_model)
            self.__convert_function_definitions(model=g_model)
            self.log("debug", str(g_model))
            return g_model
        except Exception as err:
            message = f"An un-expected error occured: {str(err)}"
            raise StochSSAPIError(500, "Server Error", message, traceback.format_exc()) from err


    def convert_to_sbml(self):
        '''
        Convert a model to a SBML model

        Attributes
        ----------
        '''
        name = self.get_name()
        s_file = f"{name}.sbml"
        dirname = self.get_dir_name()
        if ".proj" in dirname and ".wkgp" in dirname:
            dirname = os.path.dirname(dirname)
        s_path = os.path.join(dirname, s_file)

        g_model = self.convert_to_gillespy2()
        tmp_path = export(g_model, path=tempfile.NamedTemporaryFile().name)
        self.log("debug", f"Temp path to the sbml file: {tmp_path}")
        with open(tmp_path, "r", encoding="utf-8") as sbml_file:
            s_doc = sbml_file.read()

        message = f"{self.get_file()} was successfully converted to {s_file}"
        return {"Message":message}, {"path":s_path, "document":s_doc}


    def convert_to_spatial(self):
        '''
        Convert a non-spatial model to a spatial model

        Attributes
        ----------
        '''
        if self.model is None:
            model = self.load()
        model['is_spatial'] = True
        if model['defaultMode'] == "dynamic":
            model['defaultMode'] = "discrete-concentration"
        if "timestepSize" not in self.model['modelSettings'].keys():
            self.model['modelSettings']['timestepSize'] = 1e-5
        if "domain" not in model.keys():
            model['domain'] = self.get_model_template()['domain']
        for species in model['species']:
            if "types" not in species.keys():
                species['types'] = list(range(1, len(model['domain']['types'])))
        for reaction in model['reactions']:
            if "types" not in reaction.keys():
                reaction['types'] = list(range(1, len(model['domain']['types'])))
        if ".wkgp" in self.path:
            wkgp_path = self.get_dir_name()
            wkgp_path, _ = self.get_unique_path(name=self.get_file(path=wkgp_path),
                                                dirname=os.path.dirname(wkgp_path))
            s_file = self.get_file(path=wkgp_path).replace(".wkgp", ".smdl")
            s_path = os.path.join(wkgp_path, s_file)
        else:
            s_path = self.path.replace(".mdl", ".smdl")
            s_file = self.get_file(path=s_path)
        message = f"{self.get_file()} was successfully convert to {s_file}!"
        return {"Message":message, "File":s_file}, {"spatial":model, "path":s_path}


    def get_live_results(self):
        '''
        Get the live output figure for the preview.

        Attributes
        ----------
        '''
        file_name = f".{self.get_name()}-preview.json"
        try:
            with open(file_name, "r", encoding="utf-8") as live_fig:
                fig = json.load(live_fig)
                fig["config"] = {
                    "displayModeBar": True,
                    "responsive": True
                }
            return {"results": fig, "timeout":False}
        except FileNotFoundError:
            return ""
        except json.decoder.JSONDecodeError:
            return ""


    def get_notebook_data(self):
        '''
        Get the needed data for converting to notebook

        Attributes
        ----------
        '''
        file = f"{self.get_name()}.ipynb"
        path = os.path.join(self.get_dir_name(), file)
        g_model = self.convert_to_gillespy2()
        return {"path":path, "new":True, "models":{"s_model":self.model, "model":g_model}}


    def get_preview_results(self, outfile):
        '''
        Get the results of a model preview

        Attributes
        ----------
        outfile : str
            File holding the results of the preview run
        '''
        path = os.path.join(self.user_dir, f".{outfile}.tmp")
        done_path = f"{path}.done"
        if os.path.exists(done_path):
            with open(path, "r", encoding="utf-8") as file:
                resp = json.load(file)
            os.remove(path)
            os.remove(done_path)
            return resp
        return None


    def load(self):
        '''
        Reads the model file, updates the model to the current format, and stores it in self.model

        Attributes
        ----------
        '''
        if self.model is None:
            self.__read_model_file()
        if "annotation" not in self.model.keys():
            self.model['annotation'] = ""
        if "volume" not in self.model.keys():
            if "volume" in self.model['modelSettings'].keys():
                self.model['volume'] = self.model['modelSettings']['volume']
            else:
                self.model['volume'] = 1
        if "template_version" not in self.model:
            self.model['template_version'] = 0
        self.__update_model_to_current()

        self.model['name'] = self.get_name()
        self.model['directory'] = self.path
        return self.model


    def publish_presentation(self):
        '''
        Publish a model or spatial model presentation

        Attributes
        ----------
        '''
        present_dir = os.path.join(self.user_dir, ".presentations")
        if not os.path.exists(present_dir):
            os.mkdir(present_dir)
        try:
            self.load()
            safe_chars = set(string.ascii_letters + string.digits)
            hostname = escape(os.environ.get('JUPYTERHUB_USER'), safe=safe_chars)
            model = json.dumps(self.model, sort_keys=True)
            # replace with gillespy2.Model.to_json
            file = f"{hashlib.md5(model.encode('utf-8')).hexdigest()}.mdl"
            dst = os.path.join(present_dir, file)
            if os.path.exists(dst):
                data = None
            else:
                self.add_presentation_name(file, self.model['name'])
                data = {"path": dst, "new":True, "model":self.model}
            query_str = f"?owner={hostname}&file={file}"
            present_link = f"/stochss/present-model{query_str}"
            downloadlink = os.path.join("/stochss/download_presentation",
                                        hostname, file)
            open_link = f"https://open.stochss.org?open={downloadlink}"
            links = {"presentation": present_link, "download": downloadlink, "open": open_link}
            return links, data
        except PermissionError as err:
            message = f"You do not have permission to publish this file: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def save(self, model):
        '''
        Saves the model to an existing file

        Attributes
        ----------
        model : str
            Model to be saved
        '''
        path = self.get_path(full=True)
        self.log("debug", f"Full path to the model: {path}")
        if os.path.exists(path):
            model = json.loads(model)
            with open(path, 'w', encoding="utf-8") as file:
                json.dump(model, file, sort_keys=True, indent=4)
            self.log("debug", f"Saved the model: {self.get_name()}")
        else:
            message = f"Could not find the model file: {self.get_path()}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())
