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
import pickle
import logging

from presentation_base import StochSSBase, get_presentation_from_user
from presentation_error import StochSSAPIError, report_error

from jupyterhub.handlers.base import BaseHandler

log = logging.getLogger('stochss')

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class JobAPIHandler(BaseHandler):
    '''
    ################################################################################################
    Base Handler for getting job presentations from user containers.
    ################################################################################################
    '''
    async def get(self):
        '''
        Load the job presentation from User's presentations directory.

        Attributes
        ----------
        '''
        owner = self.get_query_argument(name="owner")
        log.debug("Container id of the owner: %s", owner)
        file = self.get_query_argument(name="file")
        log.debug("Name to the file: %s", file)
        self.set_header('Content-Type', 'application/json')
        try:
            path = os.path.join("/cache/presentation_cache", file, "job.json")
            if os.path.exists(path):
                job = StochSSJob(path=path).load()
            else:
                job = get_presentation_from_user(owner=owner, file=file, kwargs={"file": file},
                                                 process_func=process_job_presentation)
            log.debug("Contents of the json file: %s", job)
            self.write(job)
        except StochSSAPIError as load_err:
            report_error(self, log, load_err)
        self.finish()


def process_job_presentation(path, file=None, for_download=False):
    '''
    Get the job presentation data from the file.

    Attributes
    ----------
    path : str
        Path to the job presentation file.
    for_download : bool
        Whether or not the job presentation is being downloaded.
    '''
    with open(path, "rb") as job_file:
        job = pickle.load(job_file)
        job['job']['name'] = job['name']
    if not for_download:
        dirname = "/cache/presentation_cache"
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        job_dir = os.path.join(dirname, file)
        os.mkdir(job_dir)
        with open(os.path.join(job_dir, "job.json"), "w") as job_file:
            json.dump(job['job'], job_file, sort_keys=True, indent=4)
        with open(os.path.join(job_dir, "results.p"), "wb") as res_file:
            pickle.dump(job['results'], res_file)
        return job['job']
    return job


class StochSSJob(StochSSBase):
    '''
    ################################################################################################
    StochSS model object
    ################################################################################################
    '''

    def __init__(self, path):
        '''
        Intitialize a job object

        Attributes
        ----------
        path : str
            Path to the job presentation.
        '''
        super().__init__(path=path)


    def load(self):
        '''
        Loads a job presentation from cache

        Attributes
        ----------
        '''
        with open(self.path, "rb") as job_file:
            return json.load(job_file)
