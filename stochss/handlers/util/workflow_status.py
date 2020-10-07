#!/usr/bin/env python3

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


user_dir = '/home/jovyan'


def get_status(workflow_path):
    '''
    Get the status of a workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the target workflow.
    '''
    full_path = os.path.join(user_dir, workflow_path)
    workflow_dir_list = os.listdir(path=full_path)
    if "COMPLETE" in workflow_dir_list: # Workflow has completed
        status = "complete"
    elif "ERROR" in workflow_dir_list: # Workflow has trown an error
        status = "error"
    elif "RUNNING" in workflow_dir_list: # Workflow is still running
        status = "running"
    else: # Workflow has been created but hasn't been run
        status = "ready"
    return status
