#!/usr/bin/env python
import sys
sys.path.append('/home/ubuntu/pyurdme')
sys.path.append('/home/ubuntu/stochss/app')
import os
print os.environ
os.environ['HOME']='/home/ubuntu/'
import pyurdme
import pickle

#print "Import pyurdme worked"

#raise Exception("I raised an Exception")

# For all solvers StochSS supports, import them here and add them to the 'supported_algorithms' dict.
from pyurdme.nsmsolver import NSMSolver
supported_algorithms = {'nsm':NSMSolver}


sys.path.append(os.path.join(os.path.dirname(__file__), "../app"))

input_file = sys.argv[1]
output_dir = sys.argv[2]
algorithm = sys.argv[3]
num_runs = sys.argv[4]
seed = sys.argv[5]
print "Got args: {0}".format(sys.argv)


print "Loading model: input_file={0}".format(input_file)
model = pickle.load(open(input_file))

print "Compiling model"
if algorithm in supported_algorithms:
    sol = supported_algorithms[algorithm](model, report_level=0)
else:
    sol = supported_algorithms['nsm'](model, report_level=0)
    print "Warning: {0} is not a supported algorithm, using nsm.".format(algorithm)
sol.compile()

print "Running model"
results = sol.run(number_of_trajectories=int(num_runs), seed=int(seed))

print "Writing out results"
if isinstance(results, list):
    for i,r in enumerate(results):
        with open('{0}/result{1}'.format(output_dir,i),'w') as fd:
            pickle.dump(r, fd)
else:
    with open('{0}/result{1}'.format(output_dir,0),'w') as fd:
        pickle.dump(results, fd)
print "done"
