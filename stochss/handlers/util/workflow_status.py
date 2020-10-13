#!/usr/bin/env python3

import os


workdir = '/home/jovyan/stochss'


def get_status(workflow_path):
    '''
    Get the status of a workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the target workflow.
    '''
    full_path = os.path.join(workdir, workflow_path)
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
