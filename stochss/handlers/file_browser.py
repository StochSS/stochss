'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
        log.debug("Path to the directory: %s", path)
        try:
            folder = StochSSFolder(path=path)
            node = folder.get_jstree_node(is_root=is_root)
            log.debug("Contents of the directory: %s", node)
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
        log.debug("Path to the model file: %s", path)
        self.set_header('Content-Type', 'application/json')
        try:
            is_spatial = path.endswith(".smdl")
            log.info("Getting data from %s", path.split('/').pop())
            model = StochSSSpatialModel(path=path) if is_spatial else StochSSModel(path=path)
            data = model.get_notebook_data()
            log.debug("Notebook data: %s", data)
            log.info("Converting %s to notebook", path.split('/').pop())
            notebook = StochSSNotebook(**data)
            resp = notebook.create_ses_notebook() if is_spatial else notebook.create_es_notebook()
            log.info("Successfully created the notebook for %s", path.split('/').pop())
            log.debug("Notebook file path: %s", resp)
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
        log.debug("Path to the trash directory: %s", path)
        try:
            log.info("Emptying the trash")
            folder = StochSSFolder(path=path)
            resp = folder.empty()
            log.debug("Response message: %s", resp)
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
        log.debug("Deleting path: %s", path)
        try:
            log.info("Deleting %s", path.split('/').pop())
            is_dir = os.path.isdir(path)
            file_obj = StochSSFolder(path=path) if is_dir else StochSSFile(path=path)
            resp = file_obj.delete()
            log.info("Successfully deleted %s", path.split('/').pop())
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
        log.debug("Path to the file: %s", src_path)
        dst_path = self.get_query_argument(name="dstPath")
        log.debug("Destination path: %s", dst_path)
        try:
            dst = os.path.dirname(dst_path).split('/').pop()
            if not dst:
                dst = "/"
            log.info("Moving %s to %s", src_path.split('/').pop(), dst)
            is_dir = os.path.isdir(src_path)
            file_obj = StochSSFolder(path=src_path) if is_dir else StochSSFile(path=src_path)
            resp = file_obj.move(location=dst_path)
            file_obj.print_logs(log)
            log.info("Successfully moved %s to %s", src_path.split('/').pop(), dst)
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
        log.debug("Path to the file: %s", path)
        try:
            log.info("Coping %s", path.split('/').pop())
            file = StochSSFile(path=path)
            resp = file.duplicate()
            file.print_logs(log)
            log.info("Successfully copied %s", path.split('/').pop())
            log.debug("Response message: %s", resp)
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
        log.debug("Path to the directory: %s", path)
        try:
            log.info("Coping %s", path.split('/').pop())
            folder = StochSSFolder(path=path)
            resp = folder.duplicate()
            folder.print_logs(log)
            log.info("Successfully copied %s", path.split('/').pop())
            log.debug("Response message: %s", resp)
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
        log.debug("Path to the file or directory: %s", path)
        new_name = self.get_query_argument(name="name")
        log.debug("New filename: %s", new_name)
        try:
            log.info("Renaming %s to %s", path.split('/').pop(), new_name)
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
            log.info("Successfully renamed %s to %s", path.split('/').pop(), file_obj.get_file())
            log.debug("Response message: %s", resp)
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
        log.debug("Converting non-spatial model to spatial model: %s", path)
        try:
            log.info("Convert %s to a spatial model", path.split('/').pop())
            model = StochSSModel(path=path)
            log.info("Getting spatial model data")
            resp, data = model.convert_to_spatial()
            _ = StochSSModel(path=data['path'], new=True, model=data['spatial'])
            log.info("Successfully converted %s to a spatial model", path.split('/').pop())
            log.debug("Response: %s", resp)
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
        log.debug("Converting spatial model to non-spatial model: %s", path)
        try:
            log.info("Convert %s to a model", path.split('/').pop())
            model = StochSSSpatialModel(path=path)
            log.info("Getting model data")
            resp, data = model.convert_to_model()
            _ = StochSSModel(path=data['path'], new=True, model=data['model'])
            log.info("Successfully converted %s to a model", path.split('/').pop())
            log.debug("Response: %s", resp)
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
        log.debug("Converting to SBML: %s", path)
        try:
            log.info("Convert %s to sbml", path.split('/').pop())
            model = StochSSModel(path=path)
            log.info("Getting sbml data")
            resp, data = model.convert_to_sbml()
            model.print_logs(log)
            sbml = StochSSSBMLModel(path=data['path'], new=True, document=data['document'])
            resp["File"] = sbml.get_file()
            log.info("Successfully converted %s to sbml", path.split('/').pop())
            log.debug("Response: %s", resp)
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
        log.debug("Converting SBML: %s", path)
        try:
            log.info("Convert %s to a model", path.split('/').pop())
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
                log.info("Successfully converted %s to a model", path.split('/').pop())
            log.debug("Response: %s", resp)
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
        log.debug("Path to the model: %s", path)
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
        log.debug("Path to the model: %s", path)
        action = self.get_query_argument(name="action")
        log.debug("Action: %s", action)
        try:
            if action == "generate":
                log.info("Zipping the directory for download")
                folder = StochSSFolder(path=path)
                resp = folder.generate_zip_file()
            else:
                log.info("Zipping the csv files for download")
                wkfl = StochSSJob(path=path)
                resp = wkfl.generate_csv_zip()
            log.debug("Response: %s", resp)
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
        log.debug("Path of directories: %s", directories)
        try:
            log.info("Creating %s directory", directories.split('/').pop())
            folder = StochSSFolder(path=directories, new=True)
            folder.print_logs(log)
            log.info("Successfully created %s directory", directories.split('/').pop())
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
        log.debug("Type of the files contents: %s", type(file_data['body']))
        log.debug("Name of the file: %s", file_data['filename'])
        file_info = json.loads(self.request.body_arguments['fileinfo'][0].decode())
        log.debug("Type of file to be uploaded: %s", file_info['type'])
        log.debug("Path to the directory where the file will be uploaded: %s", file_info['path'])
        name = file_info['name'] if file_info['name'] else None
        if file_info['path'].split('/').pop():
            dst = file_info['path'].split('/').pop()
        else:
            dst = "/"
        if name is not None:
            if os.path.dirname(name):
                dst = os.path.dirname(name).split('/').pop()
            log.info("Uploading %s as %s to %s", file_data['filename'], name, dst)
            log.debug("Name with 'save as' path for the file: %s", name)
        else:
            log.info("Uploading %s to %s", file_data['filename'], dst)
            log.debug("No name given: %s", name)
        try:
            folder = StochSSFolder(path=file_info['path'])
            resp = folder.upload(file_type=file_info['type'], file=file_data['filename'],
                                 body=file_data['body'], new_name=name)
            log.info("Successfully uploaded %s to %s", resp['file'], dst)
            log.debug("Response: %s", resp)
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
        log.debug("Path to the workflow: %s", path)
        target = self.get_query_argument(name="target")
        log.debug("The %s is being copied", target)
        try:
            wkfl = StochSSWorkflow(path=path)
            if target == "wkfl_model":
                log.info("Extracting the model from %s", wkfl.get_file())
                resp, kwargs = wkfl.extract_model()
                model = StochSSModel(**kwargs)
                resp['mdlPath'] = model.path
                resp['File'] = model.get_file()
                log.info("Successfully extracted the model from %s", wkfl.get_file())
            else:
                log.info("Duplicating %s as new", wkfl.get_file())
                if wkfl.check_workflow_format(path=path):
                    log.info("Getting the workflow data")
                    resp, kwargs = wkfl.duplicate_as_new()
                    new_wkfl = StochSSWorkflow(**kwargs)
                else:
                    time_stamp = self.get_query_argument(name="stamp")
                    if time_stamp == "None":
                        time_stamp = None
                    log.debug("The time stamp for the new workflow: %s", time_stamp)
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
                log.info("Successfully duplicated %s as new", wkfl.get_file())
            log.debug("Response: %s", resp)
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
        log.debug("The path to the workflow: %s", path)
        try:
            wkfl = StochSSWorkflow(path=path)
            resp = wkfl.check_for_external_model()
            wkfl.print_logs(log)
            log.debug("Response: %s", resp)
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
        log.debug("The path to the external file or the response file: %s", path)
        cmd = self.get_query_argument(name="cmd", default=None)
        log.debug("The command for the upload script: %s", cmd)
        script = '/stochss/stochss/handlers/util/scripts/upload_remote_file.py'
        if cmd is None:
            outfile = f"{str(uuid.uuid4()).replace('-', '_')}.tmp"
            log.debug("Response file name: %s", outfile)
            exec_cmd = [script, f'{path}', f'{outfile}'] # Script commands for read run_cmd
            log.debug("Exec command: %s", exec_cmd)
            pipe = subprocess.Popen(exec_cmd)
            resp = {"responsePath": outfile}
            log.debug("Response: %s", resp)
            self.write(resp)
        else:
            exec_cmd = [script, 'None', f'{path}'] # Script commands for read run_cmd
            log.debug("Exec command: %s", exec_cmd)
            pipe = subprocess.Popen(exec_cmd, stdout=subprocess.PIPE, text=True)
            results, error = pipe.communicate()
            log.error("Errors trown by the subprocess: %s", error)
            resp = json.loads(results)
            log.debug("Response: %s", resp)
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
        log.debug("The path to the zip archive: %s", path)
        try:
            file = StochSSFile(path=path)
            resp = file.unzip(from_upload=False)
            log.debug("Response Message: %s", resp)
            self.write(resp)
        except StochSSAPIError as err:
            report_error(self, log, err)
        self.finish()
