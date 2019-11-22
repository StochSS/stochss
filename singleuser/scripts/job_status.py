#!/usr/bin/env python3

import os
import sys
import argparse
from os import path


user_dir = '/home/jovyan'


def get_status(job_path):
    '''
    Get the status of a job.

    Attributes
    ----------
    job_path : str
        Path to the target job.
    '''
    job_dir_list = os.listdir(path=job_path)
    if "COMPLETE" in job_dir_list: # Job has completed
        return "complete"
    elif "ERROR" in job_dir_list: # Job has trown an error
        return "error"
    elif "RUNNING" in job_dir_list: # Job is still running
        return "running"
    else: # Job has been created but hasn't been run
        return "ready"


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Check the status of a job.")
    parser.add_argument('job_path', help="The path from the user directory to the job.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    job_path = path.join(user_dir, args.job_path)
    status = get_status(job_path)
    print(status)