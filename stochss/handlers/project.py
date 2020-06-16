import os
import json
import shutil
import logging

from tornado import web
from shutil import copyfile
from .util.rename import get_unique_file_name
from notebook.base.handlers import APIHandler

log = logging.getLogger('stochss')


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
        log.setLevel(logging.DEBUG)
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug("The path to the new project directory: {}".format(path))
        project = {"models": [], "experiments": []}
        for item in os.listdir(path):
            if item.endswith('.mdl'):
                with open(os.path.join(path, item), 'r') as mdl_file:
                    model = json.load(mdl_file)
                    model['name'] = item.split('.')[0]
                    project['models'].append(model)
            else:
                name = item.split('.')[0]
                workflows = []
                project['experiments'].append({"name":name,"workflows":workflows})
        log.debug("Contents of the project: {0}".format(project))
        self.write(project)
        log.setLevel(logging.WARNING)
        self.finish()


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
        log.debug("The path to the new project directory: {}".format(path))
        try:
            os.makedirs(path)
            resp = {"message":"", "path":""}
            self.write(resp)
        except FileExistsError as err:
            self.set_status(406)
            error = {"Reason":"Project Already Exists", "Message":"Could not create your project: {0}".format(err)}
            log.error("Exception Information: {0}".format(error))
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
        log.debug("The path to the new experiment directory: {}".format(path))
        try:
            os.mkdir(path)
            resp = {"message":"", "path":""}
            self.write(resp)
        except FileExistsError as err:
            self.set_status(406)
            error = {"Reason":"Experiment Already Exists", "Message":"Could not create your experiment: {0}".format(err)}
            log.error("Exception Information: {0}".format(error))
            self.write(error)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Dirctory Not Found", "Message":"Experiments can only be created in a StochSS Project: {0}".format(err)}
            log.error("Exception Information: {0}".format(error))
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
        log.debug("Path to the project: {}".format(path))
        log.debug("Path to the model: {}".format(mdl_path))
        try:
            unique_path, changed = get_unique_file_name(mdl_path.split("/").pop(), path)
            copyfile(mdl_path, unique_path)
            resp = {"message": "The model {0} was successfully move into {1}".format(mdl_path.split('/').pop(), path.split("/").pop())}
            if changed:
                resp['message'] += "as {0}".format(unique_path.split('/').pop())
            log.debug("Response message: {0}".format(resp))
            self.write(resp)
        except IsADirectoryError as err:
            self.set_status(406)
            error = {"Reason":"Not A Model", "Message":"Cannot move directories into StochSS Projects: {0}".format(err)}
            log.error("Exception Information: {0}".format(error))
            self.write(error)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Model Not Found", "Message":"Could not find the model: {0}".format(err)}
            log.error("Exception Information: {0}".format(error))
            self.write(error)
        self.finish()

