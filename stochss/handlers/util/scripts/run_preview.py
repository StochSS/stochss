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
import io
import sys
import json
import logging
import argparse
import warnings

import plotly
from tornado.log import LogFormatter
from gillespy2.core import log as gillespy2_log
from gillespy2 import ModelError, SimulationError

sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
sys.path.append("/stochss/stochss/") # pylint: disable=wrong-import-position
from util.stochss_model import StochSSModel
from util.stochss_spatial_model import StochSSSpatialModel
from util.ensemble_simulation import EnsembleSimulation
from util.spatial_simulation import SpatialSimulation
from handlers.log import init_log

init_log()
log = logging.getLogger("stochss")

def setup_logger():
    '''
    Setup the logger for model previews

    Attributes
    ----------
    '''
    warnings.simplefilter("ignore")
    log_stream = io.StringIO()
    for handler in gillespy2_log.handlers:
        if isinstance(handler, logging.StreamHandler):
            handler.stream = log_stream
    handler = logging.FileHandler(".user-logs.txt")
    fmt = '%(color)s%(asctime)s%(end_color)s$ %(message)s'
    formatter = LogFormatter(fmt=fmt, datefmt="%b %d, %Y  %I:%M %p UTC")
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)
    gillespy2_log.addHandler(handler)
    return log_stream, handler


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------
    '''
    description = "Run a preview of a model. Prints the results of the first trajectory after 5s."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('path', help="The path from the user directory to the model.")
    parser.add_argument('outfile', help="The temp file used to hold the results.")
    parser.add_argument('--target', help="Spatial species or property to preview.", default=None)
    return parser.parse_args()


def run_spatialpy_preview(args):
    '''
    Run a spatialpy preview simulation.

    Attributes
    ----------
    args : argparse object
        Command line args passed to the script
    '''
    model = StochSSSpatialModel(path=args.path)
    job = SpatialSimulation(path="", preview=True, target=args.target)
    job.s_py_model = model.convert_to_spatialpy()
    job.s_model = model.model
    return job.run(preview=True)


def run_gillespy2_preview(args):
    '''
    Run a gillespy2 preview simulation

    Attributes
    ----------
    args : argparse object
        Command line args passed to the script
    '''
    log_stm, f_handler = setup_logger()
    model = StochSSModel(path=args.path)
    job = EnsembleSimulation(path="", preview=True)
    job.g_model = model.convert_to_gillespy2()
    plot = job.run(preview=True)
    timeout = 'GillesPy2 simulation exceeded timeout.' in log_stm.getvalue()
    log_stm.close()
    f_handler.close()
    return plot, timeout


def run_preview(args):
    '''
    Run a preview simulation

    Attributes
    ----------
    args : argparse object
        Command line args passed to the script
    '''
    is_spatial = args.path.endswith(".smdl")
    response = {"timeout": False}
    try:
        if is_spatial:
            response['results'] = run_spatialpy_preview(args)
        else:
            fig, timeout = run_gillespy2_preview(args)
            response['results'] = fig
            response['timeout'] = timeout
    except ModelError as error:
        response['errors'] = f"{error}"
    except SimulationError as error:
        response['errors'] = f"{error}"
    except ValueError as error:
        response['errors'] = f"{error}"
    except Exception as error:
        response['errors'] = f"{error}"
    return response


if __name__ == "__main__":
    user_dir = StochSSModel.user_dir
    log.info("Initializing the preview simulation")
    cargs = get_parsed_args()
    resp = run_preview(cargs)
    outfile = os.path.join(user_dir, f".{cargs.outfile}.tmp")
    with open(outfile, "w") as file:
        json.dump(resp, file, cls=plotly.utils.PlotlyJSONEncoder,
                  indent=4, sort_keys=True)
    open(f"{outfile}.done", "w").close()
    log.info("Preview complete")
