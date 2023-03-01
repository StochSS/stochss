#!/usr/bin/env python3

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
import sys
import logging
import argparse
import traceback

from tornado.log import LogFormatter
from gillespy2.core import log as gillespy2_log

sys.path.append("/stochss/stochss/") # pylint: disable=wrong-import-position
sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
from util.ensemble_simulation import EnsembleSimulation
from util.spatial_simulation import SpatialSimulation
from util.parameter_sweep import ParameterSweep
from handlers.log import init_log

init_log()
log = logging.getLogger("stochss")

def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------
    '''
    description = "Start a job from an existing job."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('path', help="The path to the job.")
    parser.add_argument('type', help="The type of the job.")
    parser.add_argument('-v', '--verbose', action="store_true",
                        help="Print results as they are stored.")
    return parser.parse_args()


def report_error(err):
    '''
    Report a run error to the logger

    Attributes
    ----------
    path : str
        Path to the job
    err : Exception Obj
        Error caught in the except block
    '''
    message = f"Job errors: {str(err)}\n{traceback.format_exc()}"
    gillespy2_log.error(message)
    log.error(message)
    open('ERROR', 'w', encoding="utf-8").close()


def setup_logger(log_path):
    '''
    Changer the GillesPy2 logger to record only error level logs and higher
    to the console and to log warning level logs and higher to a log file in
    the job directory.

    Attributes
    ----------
    log_path : str
        Path to the jobs log file
    '''
    formatter = gillespy2_log.handlers[0].formatter # gillespy2 log formatter
    for handler in gillespy2_log.handlers:
        if isinstance(handler, logging.StreamHandler):
            # Reset the stream to stderr
            handler.stream = sys.stderr
            # Only log error and critical logs to console
            handler.setLevel(logging.ERROR)
    # Add the file handler for job logs
    file_handler = logging.FileHandler(log_path)
    file_handler.setLevel(logging.WARNING)
    file_handler.setFormatter(formatter)
    gillespy2_log.addHandler(file_handler)
    # Add the file handler for user logs
    handler = logging.FileHandler(".user-logs.txt")
    fmt = '%(color)s%(asctime)s%(end_color)s$ %(message)s'
    formatter = LogFormatter(fmt=fmt, datefmt="%b %d, %Y  %I:%M %p UTC")
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)
    gillespy2_log.addHandler(handler)
    return file_handler, handler


if __name__ == "__main__":
    args = get_parsed_args()
    jobs = {
        "gillespy":EnsembleSimulation,
        "spatial": SpatialSimulation,
        "parameterSweep":ParameterSweep
    }
    try:
        os.chdir(args.path)
        job = jobs[args.type](path=args.path)
        job_handler, user_handler = setup_logger("logs.txt")
        job.run(verbose=args.verbose)
    except Exception as error:
        report_error(err=error)
    else:
        job_handler.close()
        user_handler.close()
        # update status to complete
        open('COMPLETE', 'w', encoding="utf-8").close()
