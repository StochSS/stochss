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
import sys
import logging
import argparse
import traceback

from gillespy2.core import log

sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
from util.ensemble_simulation import EnsembleSimulation
from util.parameter_sweep import ParameterSweep

def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------
    '''
    description = "Start a job from an existing workflow."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('path', help="The path to the workflow.")
    parser.add_argument('type', help="The type of the workflow.")
    parser.add_argument('-v', '--verbose', action="store_true",
                        help="Print results as they are stored.")
    return parser.parse_args()


def report_error(err):
    '''
    Report a run error to the logger

    Attributes
    ----------
    path : str
        Path to the workflow
    err : Exception Obj
        Error caught in the except block
    '''
    log.error("Workflow errors: %s", err)
    log.error("Traceback:\n%s", traceback.format_exc())
    open('ERROR', 'w').close()


def setup_logger(log_path):
    '''
    Changer the GillesPy2 logger to record only error level logs and higher
    to the console and to log warning level logs and higher to a log file in
    the workflow directory.

    Attributes
    ----------
    log_path : str
        Path to the workflows log file
    '''
    formatter = log.handlers[0].formatter # gillespy2 log formatter
    fh_is_needed = True
    for handler in log.handlers:
        if isinstance(handler, logging.StreamHandler):
            # Reset the stream to stderr
            handler.stream = sys.stderr
            # Only log error and critical logs to console
            handler.setLevel(logging.ERROR)
        elif isinstance(handler, logging.FileHandler):
            # File Handler was already added to the log
            fh_is_needed = False
    # Add the file handler if it not in the log already
    if fh_is_needed:
        # initialize file handler
        file_handler = logging.FileHandler(log_path)
        # log warning, error, and critical logs to file
        file_handler.setLevel(logging.WARNING)
        # add gillespy2 log formatter
        file_handler.setFormatter(formatter)
        # add file handler to log
        log.addHandler(file_handler)


if __name__ == "__main__":
    args = get_parsed_args()
    workflows = {"gillespy":EnsembleSimulation, "parameterSweep":ParameterSweep}
    wkfl = workflows[args.type](path=args.path)
    os.chdir(wkfl.get_path(full=True))
    setup_logger("logs.txt")
    try:
        wkfl.run(verbose=args.verbose)
    except Exception as error:
        wkfl.print_logs(log)
        report_error(err=error)
    else:
        # update status to complete
        open('COMPLETE', 'w').close()
