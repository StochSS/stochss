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
import tarfile
import tempfile
import traceback

import docker

from presentation_error import StochSSFileNotFoundError


def __get_presentation_from_volume(client, owner, file):
    try:
        volumes = client.volumes.list()
        user_volume = list(filter(lambda volume: volume.name == f"jupyterhub-user-{owner}",
                                  volumes))[0]
        volume_mnts = {user_volume.name: {"bind": "/user_volume", "mode": "ro"},
                       "/stochss/jupyterhub": {"bind": "/mnt/cache", "mode": "rw"}}
        command = ['cp', os.path.join('/user_volume/.presentations', file),
                   '/mnt/cache/presentation_cache/']
        client.containers.run('stochss-lab', command, volumes=volume_mnts)
        file_path = os.path.join('/srv/jupyterhub/presentation_cache', file)
        return file_path
    except docker.errors.ContainerError as err:
        message = "This presentation is no longer available."
        raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
    except IndexError as err:
        message = "This presentation is no longer available."
        raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


def get_presentation_from_user(owner, file, process_func, kwargs=None):
    '''
    Get the model presentation from the users container

    Attributes
    ----------
    owner : str
        Hostname of the user container
    file : str
        Name of the model presentation file
    process_func : function
        Function used to process the presentation file
    kwargs : dict
        Args to be passed to the process function
    '''
    client = docker.from_env()
    containers = client.containers.list()
    try:
        user_container = list(filter(lambda container: container.name == f"jupyter-{owner}",
                                     containers))[0]
        user_file_path = os.path.join('/home/jovyan/.presentations', file)
        tar_pres = tempfile.TemporaryFile()
        bits, _ = user_container.get_archive(user_file_path)
    except IndexError:
        file_path = __get_presentation_from_volume(client, owner, file)
    except docker.errors.NotFound as err:
        message = "This presentation is no longer available."
        raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
    else:
        for chunk in bits:
            tar_pres.write(chunk)
        tar_pres.seek(0)
        tar_file = tarfile.TarFile(fileobj=tar_pres)
        tmp_dir = tempfile.TemporaryDirectory()
        tar_file.extractall(tmp_dir.name)
        tar_pres.close()
        file_path = os.path.join(tmp_dir.name, file)
    if kwargs is None:
        kwargs = {}
    return process_func(file_path, **kwargs)


class StochSSBase():
    '''
    ################################################################################################
    StochSS base object
    ################################################################################################
    '''
    user_dir = os.path.expanduser("~") # returns the path to the users home directory
    TEMPLATE_VERSION = 1
    DOMAIN_TEMPLATE_VERSION = 2

    def __init__(self, path=None):
        '''
        Intitialize a file object

        Attributes
        ----------
        path : str
            Path to the folder
        '''
        self.path = path
        self.logs = []

    def log(self, level, message):
        '''
        Add a log to the objects internal logs

        Attribute
        ---------
        level : str
            Level of the log
        message : string
            Message to be logged
        '''
        self.logs.append({"level":level, "message":message})

    def print_logs(self, log):
        '''
        Display all internal logs to the console

        Attributes
        ----------
        log : obj
            Logging object
        '''
        displays = {"debug":log.debug, "info":log.info, "warning":log.warning,
                    "error":log.error, "critical":log.critical}
        for entry in self.logs:
            log_display = displays[entry["level"]]
            log_display(entry["message"])
