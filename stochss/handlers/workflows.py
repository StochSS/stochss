'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''

import logging
import json
import os
import subprocess
import traceback
from json.decoder import JSONDecodeError
from notebook.base.handlers import APIHandler
from tornado import web

from .util.workflow_status import get_status
from .util.plot_results import plot_results
from .util.convert_to_notebook import convert_to_notebook
from .util.convert_to_1d_param_sweep_notebook import convert_to_1d_psweep_nb
from .util.convert_to_2d_param_sweep_notebook import convert_to_2d_psweep_nb
from .util.convert_to_sciope_me import convert_to_sciope_me
from .util.convert_to_model_inference_notebook import convert_to_mdl_inference_nb
from .util.stochss_errors import StochSSAPIError
from .util.run_workflow import initialize

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class LoadWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting the Workflow's status, info, type, model for the
    Workflow manager page.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow's status, info, and model from User's file system.

        Attributes
        ----------
        '''
        stamp = self.get_query_argument(name="stamp")
        wkfl_type = self.get_query_argument(name="type")
        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        user_dir = "/home/jovyan"
        log.debug("Time stamp of the workflow: %s", stamp)
        log.debug("The type of the workflow: %s", wkfl_type)
        log.debug("The path to the workflow/model: %s", path)
        title_types = {"gillespy":"Ensemble Simulation", "parameterSweep":"Parameter Sweep"}
        name_types = {"gillespy":"_ES", "parameterSweep":"_PS"}
        parent_path = self.get_query_argument(name='parentPath', default=os.path.dirname(path))
        if path.endswith('.mdl'):
            resp = {"mdlPath":path, "timeStamp":stamp, "type":wkfl_type,
                    "status":"new", "titleType":title_types[wkfl_type],
                    "wkflParPath": parent_path, "startTime":None}
            resp["wkflName"] = (path.split('/').pop().split('.')[0] +
                                name_types[wkfl_type] + stamp)
            resp["wkflDir"] = resp['wkflName'] + ".wkfl"
        elif path.endswith('.wkfl'):
            resp = {"wkflDir":path.split('/').pop(), "wkflParPath":parent_path,
                    "wkflName":path.split('/').pop().split('.')[0]}
            resp["status"] = get_status(path)
            resp["timeStamp"] = "_"+"_".join(resp['wkflName'].split('_')[-2:])
            try:
                with open(os.path.join(user_dir, path, "info.json"), "r") as info_file:
                    info = json.load(info_file)
                resp["type"] = info['type']
                resp["startTime"] = info['start_time']
                resp["mdlPath"] = (info['source_model'] if resp['status'] == "ready"
                                   else info['wkfl_model'])
                resp["titleType"] = title_types[info['type']]
            except FileNotFoundError as err:
                self.set_status(404)
                error = {"Reason":"Info File Not Found",
                         "Message":"Could not find the workflow info file: "+str(err)}
                self.respond_with_error(error)
            except JSONDecodeError as err:
                self.set_status(406)
                error = {"Reason":"File Not JSON Format",
                         "Message":"The workflow info file is not JSON decodable: "+str(err)}
                self.respond_with_error(error)
        try:
            with open(os.path.join(user_dir, resp['mdlPath']), "r") as model_file:
                resp["model"] = json.load(model_file)
        except FileNotFoundError:
            resp["model"] = None
            resp["error"] = {"Reason":"Model Not Found",
                             "Message":"Could not find the model file: "+resp['mdlPath']}
            trace = traceback.format_exc()
            log.error("Exception information: %s\n%s", resp["error"], trace)
        resp["settings"] = self.get_settings(os.path.join(resp['wkflParPath'], resp['wkflDir']),
                                             resp['mdlPath'])
        log.debug("Response: %s", resp)
        self.write(resp)
        self.finish()


    @classmethod
    def get_settings(cls, wkfl_path, mdl_path):
        '''
        Get the settings for the workflow.

        Attributes
        ----------
        wkfl_path : string
            The path to the workflow
        mdl_path : string
            The path to the model used by the workflow
        '''
        settings_path = os.path.join(wkfl_path, "settings.json")

        if os.path.exists(settings_path):
            with open(settings_path, "r") as settings_file:
                return json.load(settings_file)

        with open("/stochss/stochss_templates/workflowSettingsTemplate.json", "r") as template_file:
            settings_template = json.load(template_file)

        if os.path.exists(mdl_path):
            with open(mdl_path, "r") as mdl_file:
                mdl = json.load(mdl_file)
                try:
                    settings = {"simulationSettings":mdl['simulationSettings'],
                                "parameterSweepSettings":mdl['parameterSweepSettings'],
                                "resultsSettings":settings_template['resultsSettings']}
                    return settings
                except KeyError:
                    return settings_template
        else:
            return settings_template


    def respond_with_error(self, error):
        '''
        Respond to the api request with an error

        Attributes
        ----------
        error : dict
            Information on the error being reported
        '''
        trace = traceback.format_exc()
        log.error("Exception information: %s\n%s", error, trace)
        error['Traceback'] = trace
        self.write(error)


class RunWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for running workflows.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Start running a workflow and record the time in UTC in the workflow_info file.
        Creates workflow directory and workflow_info file if running a new workflow.  Copys
        model into the workflow directory.

        Attributes
        ----------
        '''
        data = json.loads(self.get_query_argument(name="data"))
        log.debug("Handler query string: %s", data)
        opt_type = data['optType']
        wkfl_type = data['type']
        model_path = data['mdlPath']
        workflow_path = data['wkflPath']
        log.debug("Actions for the workflow: %s", opt_type)
        log.debug("Type of workflow: %s", wkfl_type)
        log.debug("Path to the model: %s", model_path)
        log.debug("Path to the workflow: %s", workflow_path)
        exec_cmd = ["/stochss/stochss/handlers/util/run_workflow.py",
                    "{}".format(model_path), "{0}".format(workflow_path),
                    "{0}".format(wkfl_type)] # Script commands
        opt_type = list(map(lambda el: "-" + el, list(opt_type))) # format the opt_type for argparse
        exec_cmd.extend(opt_type) # Add opt_type to exec_cmd
        log.debug("Exec command sent to the subprocess: %s", exec_cmd)
        log.debug('Sending the workflow run cmd')
        subprocess.Popen(exec_cmd)
        log.debug('The workflow has started')
        self.finish()


class SaveWorkflowAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for saving workflows.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Start saving the workflow.  Creates the workflow directory and workflow_info file if
        saving a new workflow.  Copys model into the workflow directory.

        Attributes
        ----------
        '''
        data = json.loads(self.get_query_argument(name="data"))
        log.debug("Handler query string: %s", data)
        opt_type = data['optType']
        wkfl_type = data['type']
        model_path = data['mdlPath']
        workflow_path = data['wkflPath']
        settings = data['settings']
        log.debug("Actions for the workflow: %s", opt_type)
        log.debug("Type of workflow: %s", wkfl_type)
        log.debug("Path to the model: %s", model_path)
        log.debug("Path to the workflow: %s", workflow_path)
        kwargs = {"save":True, "settings":settings}
        if 'n' in opt_type:
            kwargs['new'] = True
        else:
            kwargs['existing'] = True
        if 'r' in opt_type:
            kwargs['run'] = True
        resp = initialize(model_path, workflow_path, wkfl_type, **kwargs)
        log.debug("Response to the command: %s", resp)
        if resp:
            self.write(resp)
        self.finish()


class WorkflowStatusAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow Status (checking for RUNNING and COMPLETE files.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow status based on status files.

        Attributes
        ----------
        '''
        workflow_path = self.get_query_argument(name="path")
        log.debug('Getting the status of the workflow')
        status = get_status(workflow_path)
        log.debug('The status of the workflow is: %s', status)
        self.write(status)
        self.finish()


class PlotWorkflowResultsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting result plots based on plot type.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve a plot figure of the workflow results based on the plot type
        in the request body.

        Attributes
        ----------
        '''
        workflow_path = self.get_query_argument(name="path")
        log.debug("The path to the workflow: %s", workflow_path)
        body = json.loads(self.get_query_argument(name='data'))
        log.debug("Plot args passed to the plot: %s", body)
        results_path = os.path.join(workflow_path, 'results/plots.json')
        log.debug("Path to the workflow results: %s", results_path)
        plt_key = body['plt_key']
        log.debug("Key identifying the requested plot: %s", plt_key)
        plt_data = body['plt_data']
        log.debug("Title and axis data for the plot: %s", plt_data)
        plt_species = body['plt_species'] if "plt_species" in body.keys() else None
        log.debug("Visible species in the plot: %s", plt_species)
        self.set_header('Content-Type', 'application/json')
        try:
            if "None" in plt_data:
                plt_fig = plot_results(results_path, plt_key, plt_species=plt_species)
            else:
                plt_fig = plot_results(results_path, plt_key, plt_data=plt_data,
                                       plt_species=plt_species)
            log.debug("Plot figure: %s", plt_fig)
            self.write(plt_fig)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            if err.traceback is None:
                trace = traceback.format_exc()
            else:
                trace = err.traceback
            log.error("Exception information: %s\n%s", error, trace)
            error['Traceback'] = trace
            self.write(error)
        self.finish()


class WorkflowLogsAPIHandler(APIHandler):
    '''
    ########################################################################
    Handler for getting Workflow logs.
    ########################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Retrieve workflow logs from User's file system.

        Attributes
        ----------
        '''
        logs_path = self.get_query_argument(name="path")
        log.debug("Path to the workflow logs file: %s", logs_path)
        full_path = os.path.join("/home/jovyan/", logs_path)
        log.debug("Full path to the workflow logs file: %s", full_path)
        try:
            with open(full_path, 'r') as log_file:
                data = log_file.read()
            log.debug("Contents of the log file: %s", data)
            if data:
                resp = data
            else:
                resp = "No logs were recoded for this workflow."
            log.debug("Response: %s", resp)
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File or Directory Not Found",
                     "Message":"Could not find the workflow log file: "+str(err)}
            trace = traceback.format_exc()
            log.error("Exception information: %s\n%s", error, trace)
            error['Traceback'] = trace
            self.write(error)
        self.finish()


class WorkflowNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file or workflows (.wkfl)
    to Jupyter Notebook (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        '''
        workflow_type = self.get_query_argument(name="type")
        path = self.get_query_argument(name="path")
        settings = None

        if path.endswith('.wkfl'):
            name = path.split('/').pop().split('.')[0].replace('-', '_')
            with open(os.path.join(path, "info.json"), "r") as info_file:
                info = json.load(info_file)
                workflow_type = info['type']
            with open(os.path.join(path, "settings.json"), "r") as settings_file:
                settings = json.load(settings_file)
            if workflow_type == "parameterSweep":
                workflow_type = ("1d_parameter_sweep" if settings['parameterSweepSettings']['is1D']
                                 else "2d_parameter_sweep")
            dest_path = os.path.dirname(path)
            path = info['source_model'] if info['wkfl_model'] is None else info['wkfl_model']
            log.debug("Name for the notebook: %s", name)
        else:
            dest_path = self.get_query_argument(name="parentPath")

        log.debug("Type of workflow to be run: %s", workflow_type)
        log.debug("Path to the model: %s", path)
        workflows = {"gillespy":convert_to_notebook,
                     "1d_parameter_sweep":convert_to_1d_psweep_nb,
                     "2d_parameter_sweep":convert_to_2d_psweep_nb,
                     "sciope_model_exploration":convert_to_sciope_me,
                     "model_inference":convert_to_mdl_inference_nb}
        try:
            resp = (workflows[workflow_type](path, name=name, settings=settings,
                                             dest_path=dest_path)
                    if settings is not None else workflows[workflow_type](path,
                                                                          dest_path=dest_path))
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason, "Message":err.message}
            if err.traceback is None:
                trace = traceback.format_exc()
            else:
                trace = err.traceback
            log.error("Exception information: %s\n%s", error, trace)
            error['Traceback'] = trace
            self.write(error)
        self.finish()


class SavePlotAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file or workflows (.wkfl)
    to Jupyter Notebook (.ipynb) file for notebook workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Create a jupyter notebook workflow using a stochss model.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        plot = json.loads(self.request.body.decode())
        log.debug("The path to the workflow setting file: %s", path)
        log.debug("The plot to be saved: %s", plot)

        with open(path, "r") as settings_file:
            settings = json.load(settings_file)
            log.debug("Original settings: %s", settings)

        settings['resultsSettings']['outputs'].append(plot)
        log.debug("New settings: %s", settings)

        with open(path, "w") as settings_file:
            json.dump(settings, settings_file)

        resp = {"message":"The plot was successfully saved", "data":plot}
        log.debug("Response message: %s", resp)
        self.write(resp)
        self.finish()


class SaveAnnotationAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for saving annotations for workflows.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Adds/updates the workflows annotation in the info file.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        annotation = json.loads(self.request.body.decode())['annotation']
        log.debug("The path to the workflow info file: %s", path)
        log.debug("The annotation to be saved: %s", annotation)

        with open(path, "r") as info_file:
            info = json.load(info_file)
            log.debug("Original info: %s", info)

        info['annotation'] = annotation
        log.debug("New info: %s", info)

        with open(path, "w") as info_file:
            json.dump(info, info_file)

        resp = {"message":"The annotation was successfully saved", "data":annotation}
        log.debug("Response message: %s", resp)
        self.write(resp)
        self.finish()
