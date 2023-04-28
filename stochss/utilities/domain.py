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
import os
import json
import traceback

from stochss.utilities.file import File
from stochss.utilities.server_errors import FileNotFoundAPIError, JSONDecodeAPIError, DomainAPIError
from stochss.templates.domain import domain_template

class Domain(File):
    r'''
    Domain object used for interacting with spatial domains on the file system.

    :param path: Path to the domain.
    :type path: str

    :param new: Indicates whether the domain is new.
    :type new: bool

    :param domain: Contents of the new domain. Optional
    :type domain: str | dict

    :param \**kwargs: Key word arguments passed to UserSystem.
    '''
    TEMPLATE_VERSION = 2

    def __init__(self, path, new=True, domain=None, **kwargs):
        if new:
            if not path.endswith(".domn"):
                path = f"{path}.domn"
            if domain is None:
                domain = json.dumps(domain_template, sort_keys=True, indent=4)
            elif isinstance(domain, dict):
                domain = json.dumps(domain, sort_keys=True, indent=4)

        super().__init__(path=path, new=new, make_unique=True, body=domain, **kwargs)

        self.loaded = False
        if isinstance(domain, str):
            domain = json.loads(domain)
        self.domain_dict = domain
        self.domain_object = None

    def __load_domain_dict(self):
        try:
            if self.domain_dict is None:
                with open(self.path, "r", encoding="utf-8") as domain_fd:
                    domain_dict = json.load(domain_fd)
            else:
                domain_dict = self.domain_dict

            if "template_version" not in domain_dict:
                domain_dict['template_version'] = 0
            domain_template.update(domain_dict)

            self.domain_dict = domain_template
            self.__update_domain_to_current()
        except FileNotFoundError as err:
            msg = f"Could not find the domain file: {str(err)}"
            raise FileNotFoundAPIError(msg, traceback.format_exc()) from err
        except json.decoder.JSONDecodeError:
            msg = f"The domain is not JSON decobable: {str(err)}"
            raise JSONDecodeAPIError(msg, traceback.format_exc()) from err

    def __load_domain_object(self):
        pass

    def __update_domain_to_current(self):
        if self.domain_dict['template_version'] == self.TEMPLATE_VERSION:
            return

        self.__update_domain_to_v1()
        # Create version 1 domain directory if needed.
        v1_dirname = os.path.join(self.HOME_DIRECTORY, "Version1-Domains")
        if not os.path.exists(v1_dirname):
            os.mkdir(v1_dirname)
        # Get the file name for the version 1 domain file
        v1_domain = None
        v1_path = os.path.join(v1_dirname, f"{self.get_name()}.domn")
        if self.path == v1_path:
            errmsg = f"{self.get_name()} may be a dependency of another domain (.domn) "
            errmsg += "or a spatial model (.smdl) and can't be updated."
            raise DomainAPIError(errmsg)
        if os.path.exists(v1_path):
            with open(v1_path, "r", encoding="utf-8") as v1_domain_fd:
                v1_domain = json.dumps(json.load(v1_domain_fd), sort_keys=True, indent=4)
            curr_domain = json.dumps(self.domain_dict, sort_keys=True, indent=4)
            if v1_domain != curr_domain:
                v1_path = os.path.join(v1_dirname, self.get_name(path=v1_path, with_ext=True, unique_method="rename"))
                v1_domain = None
        # Create the version 1 doman file
        if v1_domain is None:
            with open(v1_path, "w", encoding="utf-8") as v1_domain_fd:
                json.dump(self.domain_dict, v1_domain_fd, sort_keys=True, indent=4)

        shapes = []
        for d_type in self.domain_dict['types']:
            if 'geometry' in d_type and d_type['geometry']:
                shapes.append({
                    'deltar': 0, 'deltas': 0, 'deltax': 0, 'deltay': 0, 'deltaz': 0, 'depth': 0, 'fillable': False,
                    'formula': d_type['geometry'], 'height': 0, 'lattice': 'Cartesian Lattice',
                    'length': 0, 'name': f"shape{len(shapes) + 1}", 'radius': 0, 'type': 'Standard'
                })
        self.domain_dict['actions'] = [{
            'type': 'StochSS Domain', 'scope': 'Multi Particle', 'priority': 1, 'enable': True, 'shape': '',
            'transformation': '', 'filename': self.get_sanitized_path(path=v1_path), 'subdomainFile': '',
            'point': {'x': 0, 'y': 0, 'z': 0}, 'newPoint': {'x': 0, 'y': 0, 'z': 0},
            'c': 10, 'fixed': False, 'mass': 1.0, 'nu': 0.0, 'rho': 1.0, 'typeID': 0, 'vol': 0.0
        }]
        self.domain_dict['shapes'] = shapes
        self.domain_dict['transformations'] = []
        self.domain_dict['template_version'] = self.TEMPLATE_VERSION

    def __update_domain_to_v1(self):
        if self.domain_dict['template_version'] == 1:
            return

        type_changes = {}
        for i, d_type in enumerate(self.domain_dict['types']):
            if d_type['typeID'] != i:
                type_changes[d_type['typeID']] = i
                d_type['typeID'] = i
            if "rho" not in d_type:
                d_type['rho'] = d_type['mass'] / d_type['volume']
            if "c" not in d_type:
                d_type['c'] = 10
        if self.domain_dict['particles']:
            for particle in self.domain_dict['particles']:
                if particle['type'] in type_changes:
                    particle['type'] = type_changes[particle['type']]
                if "rho" not in particle:
                    particle['rho'] = particle['mass'] / particle['volume']
                if "c" not in particle:
                    particle['c'] = 10

    def load(self, dict_only=True):
        '''
        Load the contents of the domain file and convert the domain to a SpatialPy domain.

        :param dict_only: Indicates that only the domain dictionary is needed
        :type dict_only: bool
        '''
        self.__load_domain_dict()
        if not dict_only:
            self.__load_domain_object()
        self.loaded = True

    def to_dict(self, nested=True):
        '''
        Update and return the domain dictionary thats compatable with the stochss pages.

        :param nested: Indicates the domain is nested within a spatial model.
        :type nested: bool

        :returns: The dictionary representation of the spatial domain.
        :rtype: dict
        '''
        if not self.loaded:
            self.load()

        return self.domain_dict
