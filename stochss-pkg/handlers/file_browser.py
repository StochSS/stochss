'''
APIHandler documentation:
https://github.com/jupyter/notebook/blob/master/notebook/base/handlers.py#L583

Note APIHandler.finish() sets Content-Type handler to 'application/json'

Use finish() for json, write() for text
'''
from notebook.base.handlers import APIHandler

from shutil import move, rmtree
import json, os
import logging
log = logging.getLogger()

from .util.ls import ls
from .util.convert_to_notebook import convert_to_notebook
from .util.duplicate import duplicate
from .util.rename import rename
from .util.convert_to_smdl_mdl import convert_model
from .util.convert_to_sbml import convert_to_sbml
from .util.convert_sbml_to_model import convert_sbml_to_model
from .util.generate_zip_file import download_zip


class ModelBrowserFileList(APIHandler):
    '''
    ##############################################################################
    Handler for interacting with the Model File Browser list 
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Attributes
        ----------
        path : str
            Path to target directory.
        '''
        output = ls(path)
        self.finish(output)

  
class ModelToNotebookHandler(APIHandler):
    '''
    ##############################################################################
    Handler for handling conversions from model (.mdl) file to Jupyter Notebook
    (.ipynb) file.
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Sends request to server to run convert_to_notebook.py on target mdl
        file.

        Attributes
        ----------
        path : str
            Path to target model within user pod container.
        '''
        dest_file = convert_to_notebook(path)
        self.write(dest_file)


class DeleteFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for removing files from remote user pod.
    ##############################################################################
    '''
    async def get(self, path):
        '''
        Send Get request for removing file from user file system.  This
        method utilizes the kubernetes python api to invoke rm -R on target
        file in remote user pod.

        Attributes
        ----------
        path : str
            Path to removal target.

        '''
        file_path = os.path.join('/home/jovyan', path)
        try:
            os.remove(file_path)
        except OSError:
            rmtree(file_path)
        self.finish("{0} was successfully deleted.".format(path.split('/').pop()))


class MoveFileAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler moving file locations in remote user pod.
    ##############################################################################
    '''
    async def get(self, data):
        '''
        Send Get request to change location of target file in remote user file
        system.  This method utilizes the kubernetes python api to invoke mv on
        target file in remote user pod.

        Attributes
        ----------
        data : str
            Data string containing old and new locations of target file.

        '''
        old_path = os.path.join("/home/jovyan/", "{0}".format(data.split('/<--MoveTo-->/')[0]))
        new_path = os.path.join("/home/jovyan/", "{0}".format(data.split('/<--MoveTo-->/').pop()))
        if os.path.isdir(old_path):
            move(old_path, new_path)
        else:
            os.rename(old_path, new_path)
        self.write("Success! {0} was moved to {1}.")

 
class DuplicateModelHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating model duplicates in user pod.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request for duplicating target file in user pod.  This method 
        utilizes the kubernetes python api to invoke the duplicate.py module of
        the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path to target model within user pod container.

        '''
        resp = duplicate(path)
        self.finish(resp)


class DuplicateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating directory duplicates in user pod.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request for duplicating target directory in user pod.  This method 
        utilizes the kubernetes python api to invoke the duplicate.py module of
        the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path to target directory within user pod container.

        '''
        resp = duplicate(path, True)
        self.finish(resp)

        
class RenameAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for renaming model files.
    ##############################################################################
    '''

    async def get(self, _path):
        '''
        Send Get request to rename target file in user pod.  This method
        utilizes the kubernetes python api to invoke the rename.py module of
        the user container (stored in [UserPod]:/usr/local/bin).

        Attributes
        ----------
        _path : str
            string of data containing rename information.

        '''
        path, new_name = _path.split('/<--change-->/')
        resp = rename(path, new_name)
        self.finish(resp)


class ConvertToSpatialAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a model to a spatial model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request to convert a target model to a spatial model in user pod.  
        This method utilizes the kubernetes python api to invoke the 
        convert_to_smdl_mdl.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the model.

        '''
        resp = convert_model(path, to_spatial=True)
        self.finish(resp)


class ConvertToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a spatial model to a model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request to convert a target spatial model to a model in user pod.  
        This method utilizes the kubernetes python api to invoke the 
        convert_to_smdl_mdl.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the model.

        '''
        resp = convert_model(path, to_spatial=False)
        self.finish(resp)


class ModelToSBMLAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a StochSS model to a SBML model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request to convert a target StochSS model to a SBML model in user 
        pod. This method utilizes the kubernetes python api to invoke the 
        convert_to_sbml.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the target model file.

        '''
        convert_to_sbml(path)
        self.write('Done')

        
class SBMLToModelAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for converting a SBML model to a StochSS model.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request to convert a target SBML model to a StochSS model in user 
        pod. This method utilizes the kubernetes python api to invoke the 
        convert_sbml_to_model.py module of the user container (stored in 
        [UserPod]:/usr/local/bin).

        Attributes
        ----------
        path : str
            Path from the user directory to the target sbml file.

        '''
        template_path ='/stochss/model_templates/nonSpatialModelTemplate.json'
        with open(template_path, "r") as template_file:
            model_template = template_file.read()
        resp = convert_sbml_to_model(path, model_template)
        self.finish(resp)

        
class DownloadAPIHandler(APIHandler):
    '''
    ##############################################################################
    Handler for downloading plain text files to the users download directory.
    ##############################################################################
    '''

    async def get(self, path):
        '''
        Send Get request to get the file data in user pod for download. 
        This method utilizes the kubernetes python api.

        Attributes
        ----------
        path : str
            Path from the user directory to the target sbml file.

        '''
        full_path = os.path.join("/home/jovyan", path)
        with open(full_path, 'r') as f:
            resp = f.read()
        self.write(resp)


class DownloadZipFileAPIHandler(APIHandler):
     '''
     ##############################################################################
     Handler for downloading zip files to the users download directory.
     ##############################################################################
     '''

     async def get(self, action, path):
        '''
        Send Get request to generate and/or get the zip file in user pod for download. 
        This method utilizes the kubernetes python api.

        Attributes
        ----------
        path : str
            Path from the user directory to the target file or directory.

        '''
        if action == "download":
            file_name = "{0}.zip".format(path.split('/').pop().split('.')[0])
            log.warning(file_name)
            self.set_header('Content-Type', 'application/zip')
            self.set_header('Content_Disposition', 'attachment; filename="{0}"'.format(file_name))
        
        generate = not action == "download"
        resp = download_zip(path, generate)
        self.write(resp)


class CreateDirectoryHandler(APIHandler):
    '''
    ##############################################################################
    Handler for creating a new directory or path of directories.
    ##############################################################################
    '''

    async def get(self, directories):
        '''
        Send Get request to get the file data in user pod for download. 
        This method utilizes the kubernetes python api.

        Attributes
        ----------
        directories : str
            Directory or path of directories to be created if needed.

        '''
        full_path = os.path.join("/home/jovyan", directories)
        os.makedirs(full_path)
        self.write('')

