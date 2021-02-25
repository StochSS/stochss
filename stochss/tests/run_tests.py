#!/usr/bin/env python3

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
