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
import json
import traceback

from stochss.utilities.file import File
from stochss.utilities.server_errors import FileNotFoundAPIError, JSONDecodeAPIError

class Notebook(File):
    r'''
    Spatial model object used for interacting with spatial models on the file system.

    :param path: Path to the spatial model.
    :type path: str

    :param new: Indicates whether the well spatial is new.
    :type new: bool

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    ENSEMBLE_SIMULATION = 1
    SPATIAL_SIMULATION = 2
    PARAMETER_SWEEP = 3
    MODEL_EXPLORATION = 4
    MODEL_INFERENCE = 5

    def __init__(self, path, new=False, model=None, settings=None, **kwargs):
        if new:
            if not path.endswith(".ipynb"):
                path = f"{path}.ipynb"
        super().__init__(path=path, new=new, make_unique=True, **kwargs)

        self.loaded = False
        self.model = model
        self.settings = settings
        self.notebook_dict = None

    def load(self):
        ''' Load the contents of the notebook file. '''
        try:
            with open(self.path, "r", encoding="utf-8") as notebook_fd:
                self.notebook_dict = json.load(notebook_fd)
            self.loaded = True
        except FileNotFoundError as err:
            message = f"Could not find the notebook file: {str(err)}"
            raise FileNotFoundAPIError(message, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError:
            msg = f"The notebook is not JSON decobable: {str(err)}"
            raise JSONDecodeAPIError(msg, traceback.format_exc()) from err

    def to_dict(self):
        '''
        Update and return the notebook dictionary thats compatable with the stochss pages.

        :returns: The dictionary representation of the notebook workflow.
        :rtype: dict
        '''
        if not self.loaded:
            self.load()

        err_str = "Traceback (most recent call last)"
        notebook = {
            'directory': self.get_sanitized_path(),
            'annotation': "",
            'name': self.get_name(),
            'status': "error" if err_str in json.dumps(self.notebook_dict) else "ready",
            'type': "Notebook"
        }
        return notebook
