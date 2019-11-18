#!/usr/bin/env python3

import os
import sys
import argparse
from os import path


USER_DIR = '/home/jovyan'


def get_status(job_path):
    job_dir_list = os.listdir(path=job_path)
    if "COMPLETE" in job_dir_list:
        return "complete"
    elif "ERROR" in job_dir_list:
        return "error"
    elif "RUNNING" in job_dir_list:
        return "running"
    else:
        return "ready"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check the status of a job.")
    parser.add_argument('job_path', help="The path from the user directory to the job.")
    args = parser.parse_args()
    job_path = path.join(USER_DIR, args.job_path)
    status = get_status(job_path)
    print(status)