'''
APIHandler documentation:
https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583

Note APIHandler.finish() sets Content-Type handler to 'application/json'

Use finish() for json, write() for text
'''
from notebook.base.handlers import APIHandler
import json, os
import logging
from shutil import move, rmtree
from .util.stochss_errors import StochSSAPIError
from .util.ls import ls
from .util.convert_to_notebook import convert_to_notebook
from .util.duplicate import duplicate, duplicate_wkfl_as_new
from .util.rename import rename
from .util.convert_to_smdl_mdl import convert_model
from .util.convert_to_sbml import convert_to_sbml
from .util.convert_sbml_to_model import convert_sbml_to_model
from .util.generate_zip_file import download_zip
from .util.upload_file import upload

log = logging.getLogger('stochss')

class ModelBrowserFileList(APIHandler):
    '''
    ##############################################################################
    Handler for interacting with the User's File Browser
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Reads the content of a directory and returns a jstree dictionary. 

        Attributes
        ----------
        path : str
            Path from the user directory to the target directory.
        '''
        log.info("Path to the directory: {0}".format(path))
        try:
            output = ls(path)
            log.debug("Contents of the directory: {0}".format(output))
            self.write(output)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()

  
class ModelToNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Runs the convert_to_notebook function from the convert_to_notebook script
        to build a Jupyter Notebook version of the model and write it to a file.

        Attributes
        ----------
        path : str
            Path from the user directory to the target model.
        '''
        self.set_header('Content-Type', 'application/json')
        try:
            log.debug("Path to the model file: {0}".format(path))
            dest_file = convert_to_notebook(path)
            log.debug("Notebook file path: {0}".format(dest_file))
            self.write(dest_file)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class DeleteFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for removing files and/or directoies from the User's file system.
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Removes a single file or recursively remove a directory and its contents.

        Attributes
        ----------
        path : str
            Path to removal target.

        '''
        file_path = os.path.join('/home/jovyan', path)
        log.debug("Deleting  path: {0}".format(file_path))
        try:
            try:
                os.remove(file_path)
            except OSError:
                rmtree(file_path)
            self.write("The file {0} was successfully deleted.".format(path.split('/').pop()))
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File Not Found","Message":"Could not find the file or directory: {0}".format(err)}
            self.write(error)
        except PermissionError as err:
            self.set_status(403)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Permission Denied","Message":"You do not have permission to delete this file: {0}".format(err)}
            self.write(error)
        self.finish()


class MoveFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler moving file locations in the User's file system.
    ##############################################################################
    '''
    async def get(self, data):
        '''
        Moves a file or a directory and its contents to a new location.

        Attributes
        ----------
        data : str
            Data string containing old and new locations of target file.

        '''
        user_dir = "/home/jovyan/"
        log.debug("File path and dest path: {0}".format(data))
        old_path = os.path.join(user_dir, "{0}".format(data.split('/<--MoveTo-->/')[0]))
        log.debug("Path to the file: {0}".format(old_path))
        new_path = os.path.join(user_dir, "{0}".format(data.split('/<--MoveTo-->/').pop()))
        log.debug("Destination path: {0}".format(new_path))
        try:
            if os.path.isdir(old_path):
                move(old_path, new_path)
                # If directory is wkfl and has been started, update wkfl model path
                if old_path.endswith('.wkfl') and "RUNNING" in os.listdir(path=new_path):
                    old_parent_dir = os.path.dirname(old_path)
                    new_parent_dir = os.path.dirname(new_path)
                    with open(os.path.join(new_path, "info.json"), "r+") as info_file:
                        info = json.load(info_file)
                        info['model'] = info['model'].replace(old_parent_dir, new_parent_dir)
                        info_file.seek(0)
                        json.dump(info, info_file)
                        info_file.truncate()
            else:
                os.rename(old_path, new_path)
            self.write("Success! {0} was moved to {1}.".format(old_path, new_path))
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"StochSS File Not Found","Message":"Could not find the file or directory: {0}".format(err)}
            self.write(error)
        except PermissionError as err:
            self.set_status(403)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Permission Denied","Message":"You do not have permission to move this file: {0}".format(err)}
            self.write(error)
        self.finish()
        

 
class DuplicateModelHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a file.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Creates a copy of a file with a unique name and stores it in the same 
        directory as the original.

        Attributes
        ----------
        path : str
            Path to target model.

        '''
        self.set_header('Content-Type', 'application/json')
        log.debug("Copying file: {0}".format(path))
        try:
            resp = duplicate(path)
            log.debug("Response message: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class DuplicateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating copies of a directory and its contents.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Creates a copy of a directory and its contents with a unique name and 
        stores it in the same parent directory as the original.

        Attributes
        ----------
        path : str
            Path to target directory.

        '''
        self.set_header('Content-Type', 'application/json')
        log.debug("Path to the file: {0}".format(path))
        try:
            resp = duplicate(path, True)
            log.debug("Response message: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()

        
class RenameAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for renaming files or directories.
    ##############################################################################
    '''

    async def get(self, data):
        '''
        Rename a file or directory.  If the file or directory already exists
        increment the file name using '(x)' naming convention to get a unique 
        name.

        Attributes
        ----------
        data : str
            string of data containing rename information.

        '''
        log.debug("Renaming file: {0}".format(data))
        path, new_name = data.split('/<--change-->/')
        log.debug("Path to the file or directory: {0}".format(path))
        log.debug("New filename: {0}".format(new_name))
        self.set_header('Content-Type', 'application/json')
        try:
            resp = rename(path, new_name)
            log.debug("Response message: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class ConvertToSpatialAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a model to a spatial model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Creates a spatial model file with a unique name from a model file and 
        stores it in the same directory as the original.

        Attributes
        ----------
        path : str
            Path from the user directory to the model.

        '''
        log.debug("Converting non-spatial model to spatial model: {0}".format(path))
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_model(path, to_spatial=True)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class ConvertToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a spatial model to a model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Creates a model file with a unique name from a spatial model file and 
        stores it in the same directory as the original.

        Attributes
        ----------
        path : str
            Path from the user directory to the spatial model.

        '''
        log.debug("Converting spatial model to non-spatial model: {0}".format(path))
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_model(path, to_spatial=False)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class ModelToSBMLAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a StochSS model to a SBML model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Create a SBML Model file with a unique name from a model file and 
        store it in the same directory as the original.

        Attributes
        ----------
        path : str
            Path from the user directory to the target model file.

        '''
        self.set_header('Content-Type', 'application/json')
        log.debug("Converting to SBML: {0}".format(path))
        try:
            resp = convert_to_sbml(path)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()

        
class SBMLToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a SBML model to a StochSS model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Creates a StochSS model with a unique name from an sbml model and 
        store it in the same directory as the original.

        Attributes
        ----------
        path : str
            Path from the user directory to the target sbml file.

        '''
        log.debug("Converting SBML: {0}".format(path))
        template_path ='/stochss/model_templates/nonSpatialModelTemplate.json'
        log.debug("Using model template: {0}".format(template_path))
        with open(template_path, "r") as template_file:
            model_template = template_file.read()
        log.debug("Model template: {0}".format(model_template))
        self.set_header('Content-Type', 'application/json')
        try:
            resp = convert_sbml_to_model(path, model_template)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()

        
class DownloadAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading plain text files to the users download directory.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Read and return plain text files.

        Attributes
        ----------
        path : str
            Path from the user directory to the target sbml file.

        '''
        log.debug("Path to the model: {0}".format(path))
        full_path = os.path.join("/home/jovyan", path)
        log.debug("Path to the model on disk: {0}".format(full_path))
        try:
            with open(full_path, 'r') as f:
                resp = f.read()
            self.write(resp)
        except FileNotFoundError as err:
            self.set_status(404)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"File Not Found","Message":"Could not find file: " + str(err)}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class DownloadZipFileAPIHandler(APIHandler):
     '''
     ##############################################################################
     Handler for downloading zip files to the users download directory.
     ##############################################################################
     '''

     async def get(self, action, path):
        '''
        Read and download a zip file or generate a zip file from a directory or 
        file and then download.  Generated zip files are stored in the targets 
        parent directory with a unique name.

        Attributes
        ----------
        path : str
            Path from the user directory to the target file or directory.

        '''
        log.debug("Path to the model: {0}".format(path))
        log.debug("Action: {0}".format(action))
        if action == "download":
            file_name = "{0}.zip".format(path.split('/').pop().split('.')[0])
            log.debug("Name of the download file: {0}".format(file_name))
            self.set_header('Content-Type', 'application/zip')
            self.set_header('Content_Disposition', 'attachment; filename="{0}"'.format(file_name))
        else:
            self.set_header('Content-Type', 'application/json')
        
        generate = not action == "download"
        log.debug("Generate script arguement: {0}".format(generate))
        try:
            resp = download_zip(path, generate)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            if action == "download":
                self.set_header('Content-Type', 'application/json')
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class CreateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating a new directory or path of directories.
    ##############################################################################
    '''

    async def get(self, directories):
        '''
        Creates a single directory or if the path od directories contains other
        directories that do not exist, a path of directories.

        Attributes
        ----------
        directories : str
            Directory or path of directories to be created if needed.

        '''
        log.debug("Path of directories: {0}".format(directories))
        full_path = os.path.join("/home/jovyan", directories)
        log.debug("Full path of directories: {0}".format(full_path))
        try:
            os.makedirs(full_path)
            self.write("{0} was successfully created!".format(directories))
        except FileExistsError as err:
            self.set_status(406)
            self.set_header('Content-Type', 'application/json')
            error = {"Reason":"Directory Already Exists","Message":"Could not create your directory: "+str(err)}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()


class UploadFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for uploading files.
    ##############################################################################
    '''

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
        body = file_data['body']
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

    async def get(self, target, time_stamp, path):
        '''
        Creates a duplicate of the model in the target workflow in its parent
        directory.  Creates a new workflow that uses the same model and has 
        the same type as the target workflow in its parent directory.

        Attributes
        ----------
        path : str
            Path from the user directory to the target workflow.

        '''
        log.debug("Path to the workflow: {0}".format(path))
        log.debug("The {0} is being copied".format(target))
        if time_stamp == "None":
            time_stamp = None
        else:
            log.debug("The time stamp for the new workflow: {0}".format(time_stamp))
        only_model = target == "wkfl_model"
        log.debug("only_model flag: {0}".format(only_model))
        self.set_header('Content-Type', 'application/json')
        try:
            resp = duplicate_wkfl_as_new(path, only_model, time_stamp)
            log.debug("Response: {0}".format(resp))
            self.write(resp)
        except StochSSAPIError as err:
            self.set_status(err.status_code)
            error = {"Reason":err.reason,"Message":err.message}
            log.error("Exception information: {0}".format(error))
            self.write(error)
        self.finish()
