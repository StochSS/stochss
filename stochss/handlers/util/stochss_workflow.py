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
import traceback

from .stochss_base import StochSSBase
from .stochss_folder import StochSSFolder
from .stochss_errors import StochSSWorkflowError, StochSSWorkflowNotCompleteError, \
                            StochSSFileNotFoundError

class StochSSWorkflow(StochSSBase):
    '''
    ################################################################################################
    StochSS workflow object
    ################################################################################################
    '''

    def __init__(self, path, new=False):
        '''
        Intitialize a workflow object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the workflow
        new : bool
            Indicates whether or not the workflow is new
        '''
        super().__init__(path=path)
        if new:
            new_path = self.get_path(full=True)
            print(f"New workflow: {new_path}")


    def __is_csv_dir(self, file):
        if "results_csv" not in file:
            return False
        path = os.path.join(file, self.get_results_path())
        if not os.path.isdir(path):
            return False
        return True


    def generate_csv_zip(self):
        '''
        Create a zip archive of the csv results for download

        Atrributes
        ----------
        '''
        status = self.get_status()
        if status == "error":
            message = f"The workflow experienced an error during run: {status}"
            raise StochSSWorkflowError(message, traceback.format_exc())
        if status != "complete":
            message = f"The workflow has not finished running: {status}."
            raise StochSSWorkflowNotCompleteError(message, traceback.format_exc())

        csv_path = self.get_csv_path(full=True)
        if os.path.exists(csv_path + ".zip"):
            message = f"{csv_path}.zip already exists."
            return {"Message":message, "Path":csv_path.replace(self.user_dir+"/", "") + ".zip"}
        csv_folder = StochSSFolder(path=csv_path)
        return csv_folder.generate_zip_file()


    def get_csv_path(self, full=False):
        '''
        Return the path to the csv directory

        Attributes
        ----------
        '''
        res_path = self.get_results_path(full=full)
        if not os.path.exists(res_path):
            message = f"Could not find the results directory: {res_path}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())

        try:
            res_files = os.listdir(res_path)
            csv_path = list(filter(lambda file: self.__is_csv_dir(file=file), res_files))[0]
            return os.path.join(res_path, csv_path)
        except IndexError as err:
            message = f"Could not find the workflow results csv directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())


    def get_results_path(self, full=False):
        '''
        Return the path to the results directory

        Attributes
        ----------
        '''
        return os.path.join(self.get_path(full=full), "results")
