#!/usr/bin/env python3

import os
import sys
import argparse
from os import path


user_dir = '/home/jovyan'


def get_status(workflow_path):
    '''
    Get the status of a workflow.

    Attributes
    ----------
    workflow_path : str
        Path to the target workflow.
    '''
    workflow_dir_list = os.listdir(path=workflow_path)
    if "COMPLETE" in workflow_dir_list: # Workflow has completed
        return "complete"
    elif "ERROR" in workflow_dir_list: # Workflow has trown an error
        return "error"
    elif "RUNNING" in workflow_dir_list: # Workflow is still running
        return "running"
    else: # Workflow has been created but hasn't been run
        return "ready"


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Check the status of a workflow.")
    parser.add_argument('workflow_path', help="The path from the user directory to the workflow.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    workflow_path = path.join(user_dir, args.workflow_path)
    status = get_status(workflow_path)
    print(status)