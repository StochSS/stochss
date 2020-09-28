import unittest
import argparse
import sys
import os


parser = argparse.ArgumentParser()
parser.add_argument('-m', '--mode', default='develop', choices=['develop', 'release'],
                    help='Run tests in develop mode or release mode.')
parser.add_argument('-b', '--browser', default='Firefox', choices=['Firefox', 'Chrome', 'Internet Explorer', 'Opera', 'Safari'], help='Run tests on Firefox, Chrome, Internet Explorer, Opera, or Safari browser.')

if __name__ == '__main__':
    args = parser.parse_args()
    if args.mode == 'develop':
        print('Running tests in develop mode. Appending repository directory to system path.')
        sys.path.append(os.path.join(os.path.dirname(__file__), '..'))


#import test_module
    import selenium_test_filesystem
    import selenium_test_model_editor

    modules = [
    selenium_test_model_editor,
    selenium_test_filesystem
    ]

    for module in modules:
        suite = unittest.TestLoader().loadTestsFromModule(module)
        runner = unittest.TextTestRunner(failfast=args.mode == 'develop')

        print("Executing: {}".format(module))
        result = runner.run(suite)
        print('=' * 70)
        if not result.wasSuccessful():
            sys.exit(not result.wasSuccessful())
