#!/usr/bin/env python3

'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
import json
import argparse

sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
from util.stochss_folder import StochSSFolder

def get_parsed_args():
    '''
    Initializes an argparser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------
    '''
    parser = argparse.ArgumentParser(description="Upload a file from an external link")
    parser.add_argument("file_path", help="The path to the external file.")
    parser.add_argument("outfile", help="The path to the response file")
    parser.add_argument("-o", "--overwrite", action="store_true", help="Overwrite existing files.")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    if args.file_path != 'None':
        folder = StochSSFolder(path="/")
        resp = folder.upload_from_link(remote_path=args.file_path, overwrite=args.overwrite)
        with open(args.outfile, "w") as fd:
            json.dump(resp, fd)
        open(args.outfile + ".done", "w").close()
    else:
        DONE = os.path.exists(args.outfile + ".done")
        if DONE:
            with open(args.outfile, 'r') as response_file:
                resp = json.load(response_file)
            os.remove(args.outfile)
            os.remove(args.outfile+".done")
        else:
            resp = {}
        resp['done'] = DONE
        print(json.dumps(resp))
