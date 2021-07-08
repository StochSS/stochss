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
import argparse

def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------
    '''
    description = "Run a preview of a model. Prints the results of the first trajectory after 5s."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('file', help="Name of the presentation file.")
    parser.add_argument('-b', '--binary', help="Indicates a binary file.", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    args = get_parsed_args()
    mode = "rb" if args.binary else "r"
    path = os.path.join(os.path.expanduser("~"), '.presentations', args.file)
    with open(path, mode) as presentation_file:
        contents = presentation_file.read()
        print(contents)
