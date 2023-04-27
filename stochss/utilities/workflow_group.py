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
from stochss.utilities.folder import Folder
from stochss.utilities.spatial import Spatial
from stochss.utilities.well_mixed import WellMixed

class WorkflowGroup(Folder):
    r'''
    Workflow group object used for interacting with workflow groups on the file system.

    :param path: Path to the workflow group.
    :type path: str

    :param new: Indicates whether the workflow group is new.
    :type new: bool

    :param spatial: Indicates that the model is a spatial model.
    :type spatial: bool

    :param model: Contents of the model.
    :type model: dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    def __init__(self, path, new=True, spatial=False, model=None, **kwargs):
        if new and not path.endswith(".wkpg"):
            path = f"{path}.wkgp"
        super().__init__(path=path, new=new, make_unique=True, **kwargs)

        self.model = None
        if new:
            if spatial:
                self.model = WellMixed(f"{self.get_sanitized_path()}/{self.get_name()}.mdl", new=True, model=model)
            else:
                self.model = Spatial(f"{self.get_sanitized_path()}/{self.get_name()}.smdl", new=True, model=model)
