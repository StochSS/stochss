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
import io
import sys
import json
import logging
import argparse
import warnings

import plotly
from gillespy2.core import log
from gillespy2 import ModelError, SimulationError

sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
from util.stochss_model import StochSSModel
from util.stochss_spatial_model import StochSSSpatialModel
from util.ensemble_simulation import EnsembleSimulation
from util.spatial_simulation import SpatialSimulation

def setup_logger():
    '''
    Setup the logger for model previews

    Attributes
    ----------
    '''
    warnings.simplefilter("ignore")
    log_stream = io.StringIO()
    for handler in log.handlers:
        if isinstance(handler, logging.StreamHandler):
            handler.stream = log_stream
    return log_stream


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
    parser.add_argument('species', help="Spatial species to preview.", default=None)
    return parser.parse_args()


def run_preview(wkfl):
    '''
    Run the preview simulation

    wkfl : StochSSWorkflow instance
        The wkfl used for the preview simulation
    '''
    resp = {"timeout": False}
    try:
        plot = wkfl.run(preview=True)
        resp["results"] = plot
    except ModelError as error:
        resp['errors'] = f"{error}"
    except SimulationError as error:
        resp['errors'] = f"{error}"
    except ValueError as error:
        resp['errors'] = f"{error}"
    except Exception as error:
        resp['errors'] = f"{error}"
    return resp


if __name__ == "__main__":
    args = get_parsed_args()
    is_spatial = args.path.endswith(".smdl")
    if is_spatial:
        model = StochSSSpatialModel(path=args.path)
        wkfl = SpatialSimulation(path="", preview=True, species=args.species)
        wkfl.s_py_model = model.convert_to_spatialpy()
        wkfl.s_model = model.model
    else:
        log_stm = setup_logger()
        model = StochSSModel(path=args.path)
        wkfl = EnsembleSimulation(path="", preview=True)
        wkfl.g_model = model.convert_to_gillespy2()
    
    resp = run_preview(wkfl)
    if not is_spatial:
        if 'GillesPy2 simulation exceeded timeout.' in log_stm.getvalue():
            resp['timeout'] = True
        log_stm.close()
    
    outfile = os.path.join(model.user_dir, f".{args.outfile}.tmp")
    with open(outfile, "w") as file:
        json.dump(resp, file, cls=plotly.utils.PlotlyJSONEncoder)
    open(f"{outfile}.done", "w").close()
