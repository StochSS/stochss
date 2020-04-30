import unittest, sys, os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-m', '--mode', default='staging', choices=['staging', 'release'],
                    help='Run tests in staging mode or release mode.')

if __name__ == "__main__":
    args = parser.parse_args()
    print(os.path.dirname(__file__))

    import test_model_template
    import test_convert_sbml

    modules = [
        test_model_template,
        test_convert_sbml
    ]

    for module in modules:
        suite = unittest.TestLoader().loadTestsFromModule(module)
        runner = unittest.TextTestRunner(failfast=args.mode == 'staging')

        print("Executing: {}".format(module))
        result = runner.run(suite)
        print('=' * 70)
        if not result.wasSuccessful():
            sys.exit(not result.wasSuccessful())