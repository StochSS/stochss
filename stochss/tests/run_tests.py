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



import unittest
import sys
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-m', '--mode', default='staging', choices=['staging', 'release'],
                    help='Run tests in staging mode or release mode.')

if __name__ == "__main__":
    os.chdir('/stochss')
    args = parser.parse_args()
    print(os.path.dirname(__file__))

    # import test_model_template
    # import test_settings_template
    # import test_convert_sbml
    # import test_upload_file
    # import test_rename
    # import test_generate_zip_file
    # import test_workflow_status
    # import test_ls
    # import test_duplicate

    modules = [
        # test_model_template,
        # test_settings_template,
        # test_convert_sbml,
        # test_rename,
        # test_upload_file,
        # test_generate_zip_file,
        # test_workflow_status,
        # test_ls,
        # test_duplicate
    ]

    for module in modules:
        suite = unittest.TestLoader().loadTestsFromModule(module)
        runner = unittest.TextTestRunner(failfast=args.mode == 'staging')

        print("Executing: {}".format(module))
        result = runner.run(suite)
        print('=' * 70)
        if not result.wasSuccessful():
            sys.exit(not result.wasSuccessful())
