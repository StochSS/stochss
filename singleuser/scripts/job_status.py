#!/usr/bin/env python3

import os, sys


def get_status(job):
    job_dir_list = os.listdir(path=job)
    if "COMPLETE" in job_dir_list:
        return "complete"
    elif "ERROR" in job_dir_list:
        return "error"
    elif "RUNNING" in job_dir_list:
        return "running"
    else:
        return "ready"


if __name__ == "__main__":
    job = sys.argv[1]
    status = get_status(job)
    print(status)