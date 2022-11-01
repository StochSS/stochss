#!/usr/bin/env python3

'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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

import fcntl

sys.path.append("/stochss/stochss/") # pylint: disable=wrong-import-position
sys.path.append("/stochss/stochss/handlers/") # pylint: disable=wrong-import-position
from util.stochss_base import StochSSBase
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
    description = "Launch, terminate, or get the status of an AWS instance."
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('-l', '--launch', action="store_true", help="Launch an AWS instance.")
    parser.add_argument(
        '-s', '--status', action="store_true", help="Get the status of an AWS instance."
    )
    parser.add_argument(
        '-v', '--verbose', action="store_true", help="Print results as they are stored."
    )
    parser.add_argument('-t', '--terminate', action="store_true", help="Terminate an AWS instance.")
    return parser.parse_args()

def launch_instance():
    '''
    Launch an AWS instance.
    '''
    base = StochSSBase(path="")
    if not is_file_locked(base.user_dir):
        base.launch_aws_cluster()

def is_file_locked(user_dir):
    '''
    Check if the aws lock file is already locked, if not lock it.

    Attributes
    ----------
    user_dir : str
        The users home directory.
    '''
    l_path = os.path.join(user_dir, '.aws/awsec2.lock')
    with open(l_path, 'w', encoding="utf-8") as lock_fd:
        try:
            fcntl.lockf(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return False
        except OSError:
            return True

def update_status():
    '''
    Update the status of an AWS instance.
    '''
    base = StochSSBase(path="")
    if not is_file_locked(base.user_dir):
        settings = base.load_user_settings(path='.user-settings.json')

        instance = settings['headNode']
        s_path = f".aws/{instance.replace('.', '-')}-status.txt"

        cluster = base.get_aws_cluster()
        if cluster._server is not None:
            with open(s_path, "w", encoding="utf-8") as aws_s_fd:
                aws_s_fd.write(cluster._server.state['Name'])

def terminate_instance():
    '''
    Terminate an AWS instance.
    '''
    base = StochSSBase(path="")
    if not is_file_locked(base.user_dir):
        base.terminate_aws_cluster()

if __name__ == "__main__":
    args = get_parsed_args()
    if args.launch:
        launch_instance()
    elif args.status:
        update_status()
    elif args.terminate:
        terminate_instance()
    else:
        raise Exception("No operation provided, please set -l, -s, or -t flags.")
