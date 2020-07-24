'''
APIHandler documentation:
https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583

Note APIHandler.finish() sets Content-Type handler to 'application/json'

Use finish() for json, write() for text
'''
import os
import json
from json.decoder import JSONDecodeError
import logging
from shutil import move, rmtree
from tornado import web
from notebook.base.handlers import APIHandler
from .util.stochss_errors import StochSSAPIError, StochSSPermissionsError
from .util.ls import list_files
from .util.convert_to_notebook import convert_to_notebook
from .util.duplicate import duplicate, duplicate_wkfl_as_new
from .util.rename import rename
from .util.convert_to_smdl_mdl import convert_model
from .util.convert_to_sbml import convert_to_sbml
from .util.convert_sbml_to_model import convert_sbml_to_model
from .util.generate_zip_file import download_zip
from .util.upload_file import upload
from .util.workflow_status import get_status

log = logging.getLogger('stochss')


# pylint: disable=abstract-method
class ModelBrowserFileList(APIHandler):
    '''
    ##############################################################################
    Handler for interacting with the User's File Browser
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Reads the content of a directory and returns a jstree dictionary.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        is_root = self.get_query_argument(name="isRoot", default=False)
        log.info("Path to the directory: %s", path)
        try:
            if is_root:
                output = list_files(path, is_root=True)
            else:
                output = list_files(path)
            log.debug("Contents of the directory: %s", output)
            self.write(output)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class ModelToNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Runs the convert_to_notebook function from the convert_to_notebook script
        to build a Jupyter Notebook version of the model and write it to a file.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        try:
            log.debug("Path to the model file: %s", path)
            dest_file = convert_to_notebook(path)
            log.debug("Notebook file path: %s", dest_file)
            self.write(dest_file)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class DeleteFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for removing files and/or directoies from the User's file system.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Removes a single file or recursively remove a directory and its contents.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        file_path = os.path.join('/home/jovyan', path)
        log.debug("Deleting  path: %s", file_path)
        try:
            try:
                os.remove(file_path)
            except OSError:
                rmtree(file_path)
            self.write("The file {0} was successfully deleted.".format(path.split('/').pop()))
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File Not Found",
                     "Message":"Could not find the file or directory: {0}".format(err)}
            self.write(error)
        except PermissionError as err:
            self.set_status(403)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Permission Denied",
                     "Message":"You do not have permission to delete this file: {0}".format(err)}
            self.write(error)
        self.finish()


class MoveFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler moving file locations in the User's file system.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Moves a file or a directory and its contents to a new location.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"
        src_path = self.get_query_argument(name="srcPath")
        log.debug("Path to the file: %s", src_path)
        old_path = os.path.join(user_dir, src_path)
        log.debug("Full path to the file: %s", old_path)
        dst_path = self.get_query_argument(name="dstPath")
        log.debug("Destination path: %s", dst_path)
        new_path = os.path.join(user_dir, dst_path)
        log.debug("Full destination path: %s", new_path)
        try:
            if os.path.isdir(old_path):
                # If directory is wkfl and has been started, update wkfl model path
                if old_path.endswith('.wkfl') and "RUNNING" in os.listdir(path=old_path):
                    self.update_workflow_paths(src_path, dst_path, old_path)
                elif old_path.endswith('.proj'):
                    self.is_project_movable(old_path)
                    self.update_project_paths(src_path, dst_path, old_path)
                move(old_path, new_path)
            else:
                os.rename(old_path, new_path)
            self.write("Success! {0} was moved to {1}.".format(old_path, new_path))
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File Not Found",
                     "Message":"Could not find the file or directory: {0}".format(err)}
            log.error(error)
            self.write(error)
        except PermissionError as err:
            self.set_status(403)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Permission Denied",
                     "Message":"You do not have permission to move this file: {0}".format(err)}
            log.error(error)
            self.write(error)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason, "Message":err.message}
            log.error(error)
            self.write(error)
        self.finish()


    @classmethod
    def update_workflow_paths(cls, src, dst, old_path):
        '''
        Updates the wkfl_model path in the info file.

        Attributes
        ----------
        src : string
            The parent directory of the source path.
        dst : string
            The parent directory of the destination path.
        old_path : string
            The path to the source file or directory.
        '''
        old_parent_dir = os.path.dirname(src)
        log.debug("Old parent directory: %s", old_parent_dir)
        new_parent_dir = os.path.dirname(dst)
        log.debug("New parent directory: %s", new_parent_dir)
        with open(os.path.join(old_path, "info.json"), "r+") as info_file:
            info = json.load(info_file)
            log.debug("Old wkfl info: %s", info)
            info['wkfl_model'] = info['wkfl_model'].replace(old_parent_dir, new_parent_dir)
            info_file.seek(0)
            log.debug("New wkfl info: %s", info)
            json.dump(info, info_file)
            info_file.truncate()


    @classmethod
    def is_project_movable(cls, old_path):
        '''
        Checks the status of each workflow in the project to determine
        if the project is able to be moved.

        Attributes
        ----------
        old_path : string
            The path to the source file or directory.
        '''
        for proj_item in os.listdir(old_path):
            if proj_item.endswith('.exp'):
                for exp_item in os.listdir(os.path.join(old_path, proj_item)):
                    if (exp_item.endswith('.wkfl') and
                            get_status(os.path.join(old_path, proj_item, exp_item)) == 'running'):
                        raise StochSSPermissionsError("This project contains a running workflow: \
                                                      {0} in {1}".format(exp_item, proj_item))


    @classmethod
    def update_project_paths(cls, src, dst, old_path):
        '''
        Updates the wkfl_model path in the info file of each workflow
        in the project directory.

        Attributes
        ----------
        src : string
            The parent directory of the source path.
        dst : string
            The parent directory of the destination path.
        old_path : string
            The path to the source file or directory.
        '''
        old_parent_dir = os.path.dirname(src)
        log.debug("Old parent directory: %s", old_parent_dir)
        new_parent_dir = os.path.dirname(dst)
        log.debug("New parent directory: %s", new_parent_dir)
        for proj_item in os.listdir(old_path,):
            if proj_item.endswith('.exp'):
                for exp_item in os.listdir(os.path.join(old_path, proj_item)):
                    with open(os.path.join(old_path, proj_item, exp_item,
                                           "info.json"), "r+") as info_file:
                        info = json.load(info_file)
                        log.debug("Old wkfl info: %s", info)
                        if get_status(os.path.join(old_path, proj_item,
                                                   exp_item)) == 'ready':
                            if not old_parent_dir:
                                src_mdl = os.path.join(new_parent_dir,
                                                       info['source_model'])
                            else:
                                src_mdl = (info['source_model']
                                           .replace(old_parent_dir, new_parent_dir, 1))
                            info['source_model'] = (src_mdl[1:]
                                                    if src_mdl.startswith('/')
                                                    else src_mdl)
                        else:
                            if not old_parent_dir:
                                wkfl_mdl = os.path.join(new_parent_dir,
                                                        info['wkfl_model'])
                            else:
                                wkfl_mdl = info['wkfl_model'].replace(old_parent_dir,
                                                                      new_parent_dir, 1)
                            info['wkfl_model'] = (wkfl_mdl[1:]
                                                  if wkfl_mdl.startswith('/')
                                                  else wkfl_mdl)
                        info_file.seek(0)
                        log.debug("New wkfl info: %s", info)
                        json.dump(info, info_file)
                        info_file.truncate()


class DuplicateModelHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a file.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a file with a unique name and stores it in the same
        directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        log.debug("Copying file: %s", path)
        try:
            resp = duplicate(path)
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class DuplicateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a directory and its contents.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a directory and its contents with a unique name and
        stores it in the same parent directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        log.debug("Path to the file: %s", path)
        try:
            resp = duplicate(path, True)
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class RenameAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for renaming files or directories.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Rename a file or directory.  If the file or directory already exists
        increment the file name using '(x)' naming convention to get a unique
        name.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        new_name = self.get_query_argument(name="name")
        log.debug("Path to the file or directory: %s", path)
        log.debug("New filename: %s", new_name)
        self.set_header('Content-Type', 'application/json')
        try:
            resp = rename(path, new_name)
            log.debug("Response message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class ConvertToSpatialAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a model to a spatial model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a spatial model file with a unique name from a model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Converting non-spatial model to spatial model: %s", path)
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_model(path, to_spatial=True)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class ConvertToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a spatial model to a model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a model file with a unique name from a spatial model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Converting spatial model to non-spatial model: %s", path)
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_model(path, to_spatial=False)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class ModelToSBMLAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a StochSS model to a SBML model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a SBML Model file with a unique name from a model file and
        store it in the same directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        log.debug("Converting to SBML: %s", path)
        try:
            resp = convert_to_sbml(path)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class SBMLToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a SBML model to a StochSS model.
    ##############################################################################
    '''

    async def get(self):
        '''
        Creates a StochSS model with a unique name from an sbml model and
        store it in the same directory as the original.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Converting SBML: %s", path)
        template_path = '/stochss/stochss_templates/nonSpatialModelTemplate.json'
        log.debug("Using model template: %s", template_path)
        with open(template_path, "r") as template_file:
            model_template = template_file.read()
        log.debug("Model template: %s", model_template)
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_sbml_to_model(path, model_template)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class DownloadAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading plain text files to the users download directory.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Read and return plain text files.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug("Path to the model: %s", path)
        full_path = os.path.join("/home/jovyan", path)
        log.debug("Path to the model on disk: %s", full_path)
        try:
            with open(full_path, 'r') as file:
                resp = file.read()
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"File Not Found",
                     "Message":"Could not find file: " + str(err)}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class DownloadZipFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading zip files to the users download directory.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Read and download a zip file or generate a zip file from a directory or
        file and then download.  Generated zip files are stored in the targets
        parent directory with a unique name.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        action = self.get_query_argument(name="action")
        log.debug("Path to the model: %s", path)
        log.debug("Action: %s", action)
        if action == "download":
            file_name = "{0}.zip".format(path.split('/').pop().split('.')[0])
            log.debug("Name of the download file: %s", file_name)
            self.set_header('Content-Type', 'application/zip')
            self.set_header('Content_Disposition', 'attachment; filename="{0}"'.format(file_name))
        else:
            self.set_header('Content-Type', 'application/json')

        try:
            resp = download_zip(path, action)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            if action == "download":
                self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class CreateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating a new directory or path of directories.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a single directory or if the path od directories contains other
        directories that do not exist, a path of directories.

        Attributes
        ----------
        '''
        directories = self.get_query_argument(name="path")
        log.debug("Path of directories: %s", directories)
        full_path = os.path.join("/home/jovyan", directories)
        log.debug("Full path of directories: %s", full_path)
        try:
            os.makedirs(full_path)
            self.write("{0} was successfully created!".format(directories))
        except FileExistsError as err:
            self.set_status(406)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Directory Already Exists",
                     "Message":"Could not create your directory: "+str(err)}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class UploadFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for uploading files.
    ##############################################################################
    '''
    @web.authenticated
    async def post(self):
        '''
        Uploads the target file to the target directory.  If the intended file
        type is a StochSS Model or SBML Model, the original file is uploaded
        with a converted model.  If the file can't be uploaded to the intended
        type no conversion is made and errors are sent to the user.

        Attributes
        ----------

        '''
        file_data = self.request.files['datafile'][0]
        file_info = json.loads(self.request.body_arguments['fileinfo'][0].decode())
        log.debug(file_info['type'])
        log.debug(file_info['path'])
        if file_info['name']:
            log.debug(file_info['name'])
        else:
            log.debug("No name given")
        file_name = file_data['filename']
        log.debug(file_name)
        log.debug(type(file_data['body']))
        resp = upload(file_data, file_info)
        log.debug(resp)
        self.write(json.dumps(resp))
        self.finish()


class DuplicateWorkflowAsNewHandler(APIHandler):
    '''
    ##############################################################################
    Handler for duplicating a workflow as new and a workflows model.
    ##############################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a new workflow that uses the same model and has
        the same type as the target workflow in its parent directory.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        target = self.get_query_argument(name="target")
        time_stamp = self.get_query_argument(name="stamp")
        log.debug("Path to the workflow: %s", path)
        log.debug("The %s is being copied", target)
        if time_stamp == "None":
            time_stamp = None
        else:
            log.debug("The time stamp for the new workflow: %s", time_stamp)
        only_model = target == "wkfl_model"
        log.debug("only_model flag: %s", only_model)
        self.set_header('Content-Type', 'application/json')
        try:
            resp = duplicate_wkfl_as_new(path, only_model, time_stamp)
            log.debug("Response: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason, "Message":err.message}
            log.error("Exception information: %s", error)
            self.write(error)
        self.finish()


class GetWorkflowModelPathAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for getting the path to the workflow model.
    ##############################################################################
    '''

    async def get(self):
        '''
        Returns the path to the model used for the workflow to allow the user
        to edit the model.  If the model doesn't exist a 404 response is sent.

        Attributes
        ----------
        '''
        user_dir = "/home/jovyan"

        path = self.get_query_argument(name="path")
        self.set_header('Content-Type', 'application/json')
        log.debug("The path to the workflow: %s", path)
        full_path = os.path.join(user_dir, path, "info.json")
        log.debug("The full path to the workflow's info file: %s", full_path)
        try:
            with open(full_path, "r") as info_file:
                info = json.load(info_file)
            log.debug("Workflow info: %s", info)
            model_path = info['source_model']
            log.debug("Path to the workflow's model: %s", model_path)
            resp = {"file":model_path.replace(user_dir + "/", "")}
            if not os.path.exists(os.path.join(user_dir, model_path)):
                mdl_file = model_path.split('/').pop()
                resp['error'] = "The model file {0} could not be found.  To edit the model you \
                                 will need to extract the model from the workflow or open the \
                                 workflow and update the path to the model.".format(mdl_file)
            log.debug("Response: %s", resp)
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            error = {"Reason":"Workflow Info File Not Found",
                     "Message":"Could not find the workflow's info file: "+str(err)}
            log.error(error)
            self.write(error)
        except JSONDecodeError as err:
            self.set_status(404)
            error = {"Reason":"Workflow Info File Not JSON Format",
                     "Message":"The workflow info file is not JSON decodable: "+str(err)}
            log.error(error)
            self.write(error)
        self.finish()
