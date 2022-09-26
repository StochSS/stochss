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

import os
import json
import uuid
import logging
import subprocess
from tornado import web
from notebook.base.handlers import APIHandler
# APIHandler documentation:
# https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583
# Note APIHandler.finish() sets Content-Type handler to 'application/json'
# Use finish() for json, write() for text

from .util import StochSSBase, StochSSFolder, StochSSFile, StochSSModel, StochSSSpatialModel, \
                  StochSSSBMLModel, StochSSNotebook, StochSSWorkflow, StochSSJob, StochSSProject, \
                  StochSSAPIError, report_error


log = logging.getLogger('stochss')


# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class ModelBrowserFileList(APIHandler):
    '''
    ################################################################################################
    Handler for interacting with the User's File Browser
    ################################################################################################
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
        log.debug(f"Path to the directory: {path}")
        try:
            folder = StochSSFolder(path=path)
            node = folder.get_jstree_node(is_root=is_root)
            log.debug(f"Contents of the directory: {node}")
            self.write(node)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ModelToNotebookHandler(APIHandler):
    '''
    ################################################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ################################################################################################
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
        log.debug(f"Path to the model file: {path}")
        self.set_header('Content-Type', 'application/json')
        try:
            is_spatial = path.endswith(".smdl")
            log.info(f"Getting data from {path.split('/').pop()}")
            model = StochSSSpatialModel(path=path) if is_spatial else StochSSModel(path=path)
            data = model.get_notebook_data()
            log.debug(f"Notebook data: {data}")
            log.info(f"Converting {path.split('/').pop()} to notebook")
            notebook = StochSSNotebook(**data)
            resp = notebook.create_ses_notebook() if is_spatial else notebook.create_es_notebook()
            log.info(f"Successfully created the notebook for {path.split('/').pop()}")
            log.debug(f"Notebook file path: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the trash directory: {path}")
        try:
            log.info("Emptying the trash")
            folder = StochSSFolder(path=path)
            resp = folder.empty()
            log.debug(f"Response message: {resp}")
            log.info("Successfully emptied the trash")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DeleteFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for removing files and/or directoies from the User's file system.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Removes a single file or recursively remove a directory and its contents.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug(f"Deleting path: {path}")
        try:
            log.info(f"Deleting {path.split('/').pop()}")
            is_dir = os.path.isdir(path)
            file_obj = StochSSFolder(path=path) if is_dir else StochSSFile(path=path)
            resp = file_obj.delete()
            log.info(f"Successfully deleted {path.split('/').pop()}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class MoveFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler moving file locations in the User's file system.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Moves a file or a directory and its contents to a new location.

        Attributes
        ----------
        '''
        src_path = self.get_query_argument(name="srcPath")
        log.debug(f"Path to the file: {src_path}")
        dst_path = self.get_query_argument(name="dstPath")
        log.debug(f"Destination path: {dst_path}")
        try:
            dst = os.path.dirname(dst_path).split('/').pop()
            if not dst:
                dst = "/"
            log.info(f"Moving {src_path.split('/').pop()} to {dst}")
            is_dir = os.path.isdir(src_path)
            file_obj = StochSSFolder(path=src_path) if is_dir else StochSSFile(path=src_path)
            resp = file_obj.move(location=dst_path)
            file_obj.print_logs(log)
            log.info(f"Successfully moved {src_path.split('/').pop()} to {dst}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DuplicateModelHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating copies of a file.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a file with a unique name and stores it in the same
        directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the file: {path}")
        try:
            log.info(f"Coping {path.split('/').pop()}")
            file = StochSSFile(path=path)
            resp = file.duplicate()
            file.print_logs(log)
            log.info(f"Successfully copied {path.split('/').pop()}")
            log.debug(f"Response message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DuplicateDirectoryHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating copies of a directory and its contents.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a copy of a directory and its contents with a unique name and
        stores it in the same parent directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the directory: {path}")
        try:
            log.info(f"Coping {path.split('/').pop()}")
            folder = StochSSFolder(path=path)
            resp = folder.duplicate()
            folder.print_logs(log)
            log.info(f"Successfully copied {path.split('/').pop()}")
            log.debug(f"Response message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class RenameAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for renaming files or directories.
    ################################################################################################
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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the file or directory: {path}")
        new_name = self.get_query_argument(name="name")
        log.debug(f"New filename: {new_name}")
        try:
            log.info(f"Renaming {path.split('/').pop()} to {new_name}")
            is_model = path.endswith(".mdl") or path.endswith(".smdl")
            if ".proj" in path and ".wkgp" in path and is_model:
                wkgp = StochSSBase(path=os.path.dirname(path))
                new_path, _ = wkgp.get_unique_path(name=f"{wkgp.get_name(path=new_name)}.wkgp")
                wkgp.rename(name=wkgp.get_file(path=new_path))
                file_obj = StochSSBase(path=os.path.join(wkgp.path, wkgp.get_file(path=path)))
                file_name = f"{wkgp.get_name(path=new_path)}.{path.split('.').pop()}"
                resp = file_obj.rename(name=file_name)
            else:
                file_obj = StochSSBase(path=path)
                resp = file_obj.rename(name=new_name)
            log.info(f"Successfully renamed {path.split('/').pop()} to {file_obj.get_file()}")
            log.debug(f"Response message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ConvertToSpatialAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for converting a model to a spatial model.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a spatial model file with a unique name from a model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Converting non-spatial model to spatial model: {path}")
        try:
            log.info(f"Convert {path.split('/').pop()} to a spatial model")
            model = StochSSModel(path=path)
            log.info("Getting spatial model data")
            resp, data = model.convert_to_spatial()
            _ = StochSSModel(path=data['path'], new=True, model=data['spatial'])
            log.info(f"Successfully converted {path.split('/').pop()} to a spatial model")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ConvertToModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for converting a spatial model to a model.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a model file with a unique name from a spatial model file and
        stores it in the same directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Converting spatial model to non-spatial model: {path}")
        try:
            log.info(f"Convert {path.split('/').pop()} to a model")
            model = StochSSSpatialModel(path=path)
            log.info("Getting model data")
            resp, data = model.convert_to_model()
            _ = StochSSModel(path=data['path'], new=True, model=data['model'])
            log.info(f"Successfully converted {path.split('/').pop()} to a model")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class ModelToSBMLAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for converting a StochSS model to a SBML model.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Create a SBML Model file with a unique name from a model file and
        store it in the same directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Converting to SBML: {path}")
        try:
            log.info(f"Convert {path.split('/').pop()} to sbml")
            model = StochSSModel(path=path)
            log.info("Getting sbml data")
            resp, data = model.convert_to_sbml()
            model.print_logs(log)
            sbml = StochSSSBMLModel(path=data['path'], new=True, document=data['document'])
            resp["File"] = sbml.get_file()
            log.info(f"Successfully converted {path.split('/').pop()} to sbml")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class SBMLToModelAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for converting a SBML model to a StochSS model.
    ################################################################################################
    '''

    @web.authenticated
    async def get(self):
        '''
        Creates a StochSS model with a unique name from an sbml model and
        store it in the same directory as the original.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Converting SBML: {path}")
        try:
            log.info(f"Convert {path.split('/').pop()} to a model")
            sbml = StochSSSBMLModel(path=path)
            log.info("Getting model data")
            if ".proj" in path:
                proj = StochSSProject(path=sbml.get_dir_name())
                wkgp = proj.check_project_format(path=proj.path)
            else:
                wkgp = False
            convert_resp = sbml.convert_to_model(name=sbml.get_name(), wkgp=wkgp)
            sbml.print_logs(log)
            resp = {"message":convert_resp['message'], "errors":convert_resp['errors'], "File":""}
            if convert_resp['model'] is not None:
                model = StochSSModel(path=convert_resp['path'], new=True,
                                     model=convert_resp['model'])
                resp['File'] = model.get_file()
                log.info(f"Successfully converted {path.split('/').pop()} to a model")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DownloadAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for downloading plain text files to the users download directory.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Read and return plain text files.

        Attributes
        ----------
        '''
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the model: {path}")
        try:
            log.info("Getting the file contents for download")
            file = StochSSFile(path=path)
            data = file.read()
            file.print_logs(log)
            self.write(data)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DownloadZipFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for downloading zip files to the users download directory.
    ################################################################################################
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
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the model: {path}")
        action = self.get_query_argument(name="action")
        log.debug(f"Action: {action}")
        try:
            if action == "generate":
                log.info("Zipping the directory for download")
                folder = StochSSFolder(path=path)
                resp = folder.generate_zip_file()
            else:
                log.info("Zipping the csv files for download")
                wkfl = StochSSJob(path=path)
                resp = wkfl.generate_csv_zip()
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class CreateDirectoryHandler(APIHandler):
    '''
    ################################################################################################
    Handler for creating a new directory or path of directories.
    ################################################################################################
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
        log.debug(f"Path of directories: {directories}")
        try:
            log.info(f"Creating {directories.split('/').pop()} directory")
            folder = StochSSFolder(path=directories, new=True)
            folder.print_logs(log)
            log.info(f"Successfully created {directories.split('/').pop()} directory")
            self.write(f"{directories} was successfully created!")
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class UploadFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for uploading files.
    ################################################################################################
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
        log.debug(f"Type of the files contents: {type(file_data['body'])}")
        log.debug(f"Name of the file: {file_data['filename']}")
        file_info = json.loads(self.request.body_arguments['fileinfo'][0].decode())
        log.debug(f"Type of file to be uploaded: {file_info['type']}")
        log.debug(f"Path to the directory where the file will be uploaded: {file_info['path']}")
        name = file_info['name'] if file_info['name'] else None
        if file_info['path'].split('/').pop():
            dst = file_info['path'].split('/').pop()
        else:
            dst = "/"
        if name is not None:
            if os.path.dirname(name):
                dst = os.path.dirname(name).split('/').pop()
            log.info(f"Uploading {file_data['filename']} as {name} to {dst}")
            log.debug(f"Name with 'save as' path for the file: {name}")
        else:
            log.info(f"Uploading {file_data['filename']} to {dst}")
            log.debug(f"No name given: {name}")
        try:
            folder = StochSSFolder(path=file_info['path'])
            resp = folder.upload(file_type=file_info['type'], file=file_data['filename'],
                                 body=file_data['body'], new_name=name)
            log.info(f"Successfully uploaded {resp['file']} to {dst}")
            log.debug(f"Response: {resp}")
            self.write(json.dumps(resp))
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class DuplicateWorkflowAsNewHandler(APIHandler):
    '''
    ################################################################################################
    Handler for duplicating a workflow as new and a workflows model.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Creates a new workflow that uses the same model and has
        the same type as the target workflow in its parent directory.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the workflow: {path}", )
        target = self.get_query_argument(name="target")
        log.debug(f"The {target} is being copied")
        try:
            wkfl = StochSSWorkflow(path=path)
            if target == "wkfl_model":
                log.info(f"Extracting the model from {wkfl.get_file()}")
                resp, kwargs = wkfl.extract_model()
                model = StochSSModel(**kwargs)
                resp['mdlPath'] = model.path
                resp['File'] = model.get_file()
                log.info(f"Successfully extracted the model from {wkfl.get_file()}")
            else:
                log.info(f"Duplicating {wkfl.get_file()} as new")
                if wkfl.check_workflow_format(path=path):
                    log.info("Getting the workflow data")
                    resp, kwargs = wkfl.duplicate_as_new()
                    new_wkfl = StochSSWorkflow(**kwargs)
                else:
                    time_stamp = self.get_query_argument(name="stamp")
                    if time_stamp == "None":
                        time_stamp = None
                    log.debug(f"The time stamp for the new workflow: {time_stamp}")
                    job = StochSSJob(path=path)
                    log.info("Getting the workflow data")
                    resp, kwargs = job.duplicate_as_new(stamp=time_stamp)
                    new_wkfl = StochSSJob(**kwargs)
                    new_wkfl.update_info(new_info={"source_model":resp['mdlPath']})
                    c_resp = wkfl.check_for_external_model(path=resp['mdlPath'])
                    if "error" in c_resp.keys():
                        resp['error'] = c_resp['error']
                resp['wkflPath'] = new_wkfl.path
                resp['File'] = new_wkfl.get_file()
                log.info(f"Successfully duplicated {wkfl.get_file()} as new")
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class GetWorkflowModelPathAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting the path to the workflow model.
    ################################################################################################
    '''

    async def get(self):
        '''
        Returns the path to the model used for the workflow to allow the user
        to edit the model.  If the model doesn't exist a 404 response is sent.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"The path to the workflow: {path}")
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.check_for_external_model()
            wkfl.print_logs(log)
            log.debug(f"Response: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class UploadFileFromLinkAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for uploading file from a url.
    ################################################################################################
    '''

    async def get(self):
        '''
        Upload and unzip a zip file from a url.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"The path to the external file or the response file: {path}")
        cmd = self.get_query_argument(name="cmd", default=None)
        log.debug(f"The command for the upload script: {cmd}")
        script = '/stochss/stochss/handlers/util/scripts/upload_remote_file.py'
        if cmd == "validate":
            try:
                folder = StochSSFolder(path="")
                resp = {'exists': folder.validate_upload_link(remote_path=path)}
                log.debug(f"Response: {resp}")
                self.write(resp)
            except StochSSAPIError as err:
                report_error(self, log, err)
        elif cmd is None:
            overwrite = self.get_query_argument(name='overwrite', default=False)
            outfile = f"{str(uuid.uuid4()).replace('-', '_')}.tmp"
            log.debug(f"Response file name: {outfile}")
            exec_cmd = [script, f'{path}', f'{outfile}'] # Script commands for read run_cmd
            if overwrite:
                exec_cmd.append('-o')
            log.debug(f"Exec command: {exec_cmd}")
            pipe = subprocess.Popen(exec_cmd)
            resp = {"responsePath": outfile}
            log.debug(f"Response: {resp}")
            self.write(resp)
        else:
            exec_cmd = [script, 'None', f'{path}'] # Script commands for read run_cmd
            log.debug(f"Exec command: {exec_cmd}")
            pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
            results, error = pipe.communicate()
            if error is not None:
                log.error(f"Errors thrown by the subprocess: {error}")
            resp = json.loads(results)
            log.debug(f"Response: {resp}")
            self.write(resp)
        self.finish()


class UnzipFileAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for unzipping zip archives.
    ################################################################################################
    '''

    async def get(self):
        '''
        Unzip a zip archive.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"The path to the zip archive: {path}")
        try:
            file = StochSSFile(path=path)
            resp = file.unzip(from_upload=False)
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class NotebookPresentationAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler publishing notebook presentations.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Publish a notebook presentation.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        path = self.get_query_argument(name="path")
        log.debug(f"Path to the file: {path}")
        try:
            notebook = StochSSNotebook(path=path)
            log.info(f"Publishing the {notebook.get_name()} presentation")
            links, exists = notebook.publish_presentation()
            if exists:
                message = f"A presentation for {notebook.get_name()} already exists."
            else:
                message = f"Successfully published the {notebook.get_name()} presentation"
            resp = {"message": message, "links": links}
            log.info(resp['message'])
            log.debug(f"Response Message: {resp}")
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()


class PresentationListAPIHandler(APIHandler):
    '''
    ################################################################################################
    Handler for getting the users full list of presentations.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Get the list of presentations.

        Attributes
        ----------
        '''
        self.set_header('Content-Type', 'application/json')
        try:
            log.info("Loading presentations...")
            presentations = StochSSFolder.get_presentations()
            log.debug(f"List of presentations: {presentations}")
            log.info("Loading complete.")
            self.write({"presentations": presentations})
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()

class ImportFromLibrary(APIHandler):
    '''
    ################################################################################################
    Handler for getting the list of examples from StochSS Example Library.
    ################################################################################################
    '''
    @web.authenticated
    async def get(self):
        '''
        Get the list of presentations.

        Attributes
        ----------
        '''
        home = "/hub/spawn" if str(self.request.path).startswith("/user") else "stochss/home"
        try:
            system = StochSSBase(path=".example-library.json")
            examples = system.load_example_library(home)
            self.write(examples)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
