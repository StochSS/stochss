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
import unittest
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
    '-m', '--mode', default='staging', choices=['staging', 'release'],
    help='Run unit tests in staging mode or release mode.'
)

def run(mode=None):
    ''' Run the unit tests. '''
    from unit_tests import test_model_template
    from unit_tests import test_settings_template
    from unit_tests import test_stochss_base
    from unit_tests import test_stochss_file
    
    modules = [
        test_model_template,
        test_settings_template,
        test_stochss_base,
        test_stochss_file
    ]

    for module in modules:
        suite = unittest.TestLoader().loadTestsFromModule(module)
        runner = unittest.TextTestRunner(failfast=mode == 'staging', verbosity=1)

        print("Executing: {}".format(module))
        result = runner.run(suite)
        print('=' * 70)
        if not result.wasSuccessful():
            sys.exit(not result.wasSuccessful())

if __name__ == "__main__":
    os.chdir('/stochss')
    args = parser.parse_args()
    print(os.path.dirname(__file__))

    run(mode=args.mode)
