'''
Use BaseHandler for page requests since
the base API handler has some logic that prevents
requests without a referrer field
'''


import os
import json
import logging

from shutil import copyfile, copytree, rmtree
from tornado import web
from notebook.base.handlers import APIHandler

from .util.rename import get_unique_file_name
from .util.workflow_status import get_status
from .util.generate_zip_file import download_zip
from .util.convert_to_combine import convert
from .util.stochss_errors import StochSSAPIError, StochSSPermissionsError

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class LoadProjectBrowserAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for loading all of the users projects
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Recursively searches all directories for projects

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        projects = []
        self.get_projects_from_directory(user_dir, projects)
        log.debug("List of projects: %s", projects)
        resp = {"projects":projects}
        self.write(resp)
        self.finish()


    @classmethod
    def get_projects_from_directory(cls, path, projects):
        '''
        Get the projects in the directory if any exist.

        Attributes
        ----------
        path : string
            Path the target directory
        projects : list
            List of project dictionaries
        '''
        for item in os.listdir(path):
            new_path = os.path.join(path, item)
            if item.endswith('.proj'):
                projects.append({'directory': new_path.replace("/home/jovyan/", ""),
                                 'parentDir': os.path.dirname(new_path.replace("/home/jovyan/",
                                                                               "")),
                                 'elementID': "p{}".format(len(projects) + 1)})
            elif not item.startswith('.') and os.path.isdir(new_path):
                cls.get_projects_from_directory(new_path, projects)


class LoadProjectAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Projects
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the new project directory: %s", path)
        project = {"models": [], "experiments": [], "trash_empty": True}
        for item in os.listdir(path):
            if item.endswith('.mdl'):
                mdl_dir = os.path.join(path, item)
                with open(mdl_dir, 'r') as mdl_file:
                    model = json.load(mdl_file)
                    model['name'] = item.split('.')[0]
                    model['directory'] = mdl_dir
                    project['models'].append(model)
            elif item.endswith('.exp'):
                name = item.split('.')[0]
                workflows = []
                for workflow in os.listdir(os.path.join(path, item)):
                    if workflow.endswith('.wkfl'):
                        wkfl_dict = {"path":os.path.join(path, item, workflow),
                                     "name":workflow.split('.')[0]}
                        wkfl_dict['status'] = get_status(wkfl_dict['path'])
                        with open(os.path.join(wkfl_dict['path'],
                                               'settings.json'), 'r') as settings_file:
                            outputs = json.load(settings_file)['resultsSettings']['outputs']
                            if outputs:
                                output = max(outputs, key=lambda output: output['stamp'])
                                if "plot" in project.keys():
                                    if output['stamp'] > project['plot']['output']['stamp']:
                                        project['plot']['path'] = wkfl_dict['path']
                                        project['plot']['output'] = output
                                else:
                                    project['plot'] = {"path":wkfl_dict['path'], "output":output}
                            wkfl_dict['outputs'] = outputs
                        self.get_workflow_info(wkfl_dict)
                        workflows.append(wkfl_dict)
                project['experiments'].append({"name":name, "workflows":workflows})
            elif item == "trash":
                project['trash_empty'] = len(os.listdir(os.path.join(path, item))) == 0
        log.debug("Contents of the project: %s", project)
        self.write(project)
        self.finish()


    @classmethod
    def get_workflow_info(cls, wkfl_dict):
        '''
        Add the necessary workflow info elements to the workflow model

        Attributes
        ----------
        wkfl_dict : dict
            JSON representation of a workflow
        '''
        with open(os.path.join(wkfl_dict["path"], "info.json"), 'r') as info_file:
            info = json.load(info_file)
            wkfl_dict['annotation'] = ""
            if not 'annotation' in info.keys():
                wkfl_dict['annotation'] = ""
            else:
                wkfl_dict['annotation'] = info['annotation']


class NewProjectAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Projects
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new project directory and the path to the directory if needed.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the new project directory: %s", path)
        try:
            os.makedirs(path)
            os.mkdir(os.path.join(path, "trash"))
            os.mkdir(os.path.join(path, "Experiment1.exp"))
            resp = {"message":"Successfully created the project: {0}\
                              ".format(path.split('/').pop()),
                    "path":path}
            self.write(resp)
        except FileExistsError as err:
            self.set_status(406)
            error = {"Reason":"Project Already Exists",
                     "Message":"Could not create your project: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


class NewExperimentAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Experiments
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new experiment directory.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the new experiment directory: %s", path)
        try:
            os.mkdir(path)
            proj_file = os.path.dirname(path).split('/').pop()
            exp_file = path.split('/').pop()
            resp = {"message":"The {} was successfully created in {}".format(exp_file, proj_file),
                    "path":path}
            self.write(resp)
        except FileExistsError as err:
            self.set_status(406)
            error = {"Reason":"Experiment Already Exists",
                     "Message":"Could not create your experiment: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Dirctory Not Found",
                     "Message":"Experiments can only be created in a StochSS Project: \
                                {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


class AddExistingModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Experiments
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new experiment directory.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        mdl_path = os.path.join(user_dir, self.get_query_argument(name="mdlPath"))
        log.debug("Path to the project: %s", path)
        log.debug("Path to the model: %s", mdl_path)
        try:
            unique_path, changed = get_unique_file_name(mdl_path.split("/").pop(), path)
            copyfile(mdl_path, unique_path)
            resp = {"message": "The model {0} was successfully move into \
                                {1}".format(mdl_path.split('/').pop(), path.split("/").pop())}
            if changed:
                resp['message'] += " as {0}".format(unique_path.split('/').pop())
            log.debug("Response message: %s", resp)
            self.write(resp)
        except IsADirectoryError as err:
            self.set_status(406)
            error = {"Reason":"Not A Model",
                     "Message":"Cannot move directories into StochSS Projects: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Model Not Found",
                     "Message":"Could not find the model: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


class AddExistingWorkflowAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating new StochSS Experiments
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Create a new experiment directory.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        wkfl_path = os.path.join(user_dir, self.get_query_argument(name="wkflPath"))
        log.debug("Path to the experiment: %s", path)
        log.debug("Path to the workflow: %s", wkfl_path)
        try:
            if get_status(wkfl_path) == "running":
                raise StochSSPermissionsError("Running workflows cannot be moved.")
            unique_path, changed = get_unique_file_name(wkfl_path.split('/').pop(), path)
            copytree(wkfl_path, unique_path)
            resp = {"message": "The Workflow {0} was successfully moved into \
                                {1}".format(wkfl_path.split('/').pop(), path.split('/').pop())}
            with open(os.path.join(unique_path, "info.json"), 'r+') as info_file:
                info = json.load(info_file)
                log.debug("Old workflow info: %s", info)
                if get_status(unique_path) == "ready":
                    info['source_model'] = os.path.join(os.path.dirname(path).replace(user_dir+"/",
                                                                                      ""),
                                                        info['source_model'].split('/').pop())
                else:
                    info['wkfl_model'] = (info['wkfl_model']
                                          .replace(os.path.dirname(info['wkfl_model']),
                                                   unique_path.replace(user_dir+"/",
                                                                       "")))
                log.debug("New workflow info: %s", info)
                info_file.seek(0)
                json.dump(info, info_file)
                info_file.truncate()
            if changed:
                resp['message'] += " as {0}".format(unique_path.split("/").pop())
            log.debug("Response message: %s", resp)
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Workflow Not Found",
                     "Message":"Could not find the workflow: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


class ExtractModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for extracting models from a project
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a model from a project.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        src_path = os.path.join(user_dir, self.get_query_argument(name="srcPath"))
        log.debug("Path to the target model: %s", src_path)
        dst_path = os.path.join(user_dir, self.get_query_argument(name="dstPath"))
        log.debug("Destination path for the target model: %s", dst_path)
        try:
            unique_path, changed = get_unique_file_name(dst_path.split('/').pop(),
                                                        os.path.dirname(dst_path))
            copyfile(src_path, unique_path)
            export_path = (os.path.dirname(unique_path).replace(user_dir+"/", "")
                           if os.path.dirname(unique_path) != user_dir else "/")
            resp = "The Model {0} was extracted to {1}".format(src_path.split('/').pop(),
                                                               export_path)
            if changed:
                resp += " as {0}".format(unique_path.split('/').pop())
            log.debug("Response message: %s", resp)
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Model Not Found",
                     "Message":"Could not find the model: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


class ExtractWorkflowAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for extracting workflows from a project
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Extract a workflow from a project.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        src_path = os.path.join(user_dir, self.get_query_argument(name="srcPath"))
        log.debug("Path to the target model: %s", src_path)
        dst_path = os.path.join(user_dir, self.get_query_argument(name="dstPath"))
        log.debug("Destination path for the target model: %s", dst_path)
        try:
            if get_status(src_path) != "running":
                unique_path, changed = get_unique_file_name(dst_path.split('/').pop(),
                                                            os.path.dirname(dst_path))
                copytree(src_path, unique_path)
                if get_status(unique_path) != "ready":
                    self.update_workflow_path(unique_path)
                export_path = (os.path.dirname(unique_path).replace(user_dir+"/", "")
                               if os.path.dirname(unique_path) != user_dir else "/")
                resp = "The Workflow {0} was exported to {1}".format(src_path.split('/').pop(),
                                                                     export_path)
                if changed:
                    resp += " as {0}".format(unique_path.split('/').pop())
                log.debug("Response message: %s", resp)
                self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Workflow Not Found",
                     "Message":"Could not find the workflow: {0}".format(err)}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


    @classmethod
    def update_workflow_path(cls, dst):
        '''
        Update the path to the workflows model

        Attributes
        ----------
        dst : string
            Destination path for the workflow
        '''
        with open(os.path.join(dst, "info.json"), "r+") as info_file:
            info = json.load(info_file)
            log.debug("Old workflow info: %s", info)
            new_path = os.path.join(dst, info['wkfl_model'].split('/').pop())
            info['wkfl_model'] = new_path.replace("/home/jovyan/", "")
            log.debug("New workflow info: %s", info)
            info_file.seek(0)
            json.dump(info, info_file)
            info_file.truncate()


class EmptyTrashAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for a projects trash directory
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Empty the trash directory.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        log.debug("Path to the trash directory: %s", path)
        try:
            for item in os.listdir(path):
                item_path = os.path.join(path, item)
                if os.path.isdir(item_path):
                    rmtree(item_path)
                else:
                    os.remove(item_path)
            resp = "Successfully emptied the trash"
            log.debug("Response message: %s", resp)
            self.write(resp)
        except FileNotFoundError:
            os.mkdir(path)
            resp = "The trash directory was removed."
            log.debug("Response message: %s", resp)
            self.write(resp)
        self.finish()


class ProjectMetaDataAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for a projects meta data
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Get the projects meta data if it exists else create a meta data dictionary.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        log.debug("Path to the project directory: %s", path)
        files = self.get_query_argument(name="files").split(',')
        log.debug("List of files: %s", files)
        md_path = os.path.join(path, ".meta-data.json")
        log.debug("Path to the meta-data file: %s", md_path)
        if os.path.exists(md_path):
            with open(md_path, "r") as md_file:
                data = json.load(md_file)
                meta_data = data['meta-data']
                creators = data['creators']
        else:
            meta_data = {}
            creators = {}

        for file in files:
            if file not in meta_data.keys():
                meta_data[file] = {"description":"", "creators":[]}
        log.debug("Meta-data for the project: %s", meta_data)
        log.debug("Creators for the project: %s", creators)
        resp = {"meta_data":meta_data, "creators":creators}
        log.debug("Response Message: %s", resp)
        self.write(resp)
        self.finish()


    @web.authenticated
    def post(self):
        '''
        Save the projects meta data.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        self.set_header('Content-Type', 'application/json')
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        log.debug("Path to the project directory: %s", path)
        data = self.request.body.decode()
        log.debug("Meta-data to be saved: %s", data)
        with open(os.path.join(path, ".meta-data.json"), "w") as md_file:
            md_file.write(data)
        self.finish()


class ExportAsCombineAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for exporting a project or part of a project as a COMBINE archive
    ##############################################################################
    '''
    @web.authenticated
    def get(self):
        '''
        Export a project with existing meta data if any.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        log.debug("Path to the project/experiment/workflow directory: %s", path)
        project_path = os.path.join(user_dir, self.get_query_argument(name="projectPath",
                                                                      default=""))
        log.debug("Path to the project directory: %s", project_path)
        download = bool(self.get_query_argument(name="download", default=False))
        try:
            if download:
                self.set_header('Content-Type', 'application/zip')
                self.set_header('Content_Disposition',
                                'attachment; filename="{0}"'.format((path.split('/')
                                                                     .pop().split('.')[0])))
                resp = download_zip(path, "download")
                log.debug("Response message: %s", resp)
            else:
                self.set_header('Content-Type', 'application/json')
                if os.path.exists(os.path.join(project_path, ".meta-data.json")):
                    with open(os.path.join(project_path, ".meta-data.json"), "r") as md_file:
                        data = json.load(md_file)
                    for _, meta_data in data['meta-data'].items():
                        meta_data['creators'] = list(map(lambda key: data['creators'][key],
                                                         meta_data['creators']))
                    resp = convert(path, data["meta-data"])
                else:
                    resp = convert(path)
                if resp["errors"]:
                    log.error("Errors raised by convert process: %s", resp["errors"])
                log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            if download:
                self.set_header('Content-Type', 'application/json')
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()


    @web.authenticated
    def post(self):
        '''
        Export a project with new or updated meta data.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        path = os.path.join(user_dir, self.get_query_argument(name="path"))
        log.debug("Path to the project/experiment/workflow directory: %s", path)
        project_path = os.path.join(user_dir, self.get_query_argument(name="projectPath",
                                                                      default=""))
        log.debug("Path to the project directory: %s", project_path)
        data = self.request.body.decode()
        log.debug("Meta-data to be saved: %s", data)
        with open(os.path.join(project_path, ".meta-data.json"), "w") as md_file:
            md_file.write(data)
        data = json.loads(data)
        for _, meta_data in data['meta-data'].items():
            meta_data['creators'] = list(map(lambda key: data['creators'][key],
                                             meta_data['creators']))
        download = bool(self.get_query_argument(name="download", default=False))
        try:
            if download:
                self.set_header('Content-Type', 'application/zip')
                self.set_header('Content_Disposition',
                                'attachment; filename="{0}"'.format((path.split('/')
                                                                     .pop().split('.')[0])))
                resp = download_zip(path, "download")
            else:
                self.set_header('Content-Type', 'application/json')
                resp = convert(path, data["meta-data"])
                if resp["errors"]:
                    log.error("Errors raised by convert process: %s", resp["errors"])
                log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            if download:
                self.set_header('Content-Type', 'application/json')
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception Information: %s", error)
            self.write(error)
        self.finish()
