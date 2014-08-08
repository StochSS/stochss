#!/usr/bin/env python
import pyurdme
import pickle
import sys

input_file = sys.argv[0]
output_dir = sys.argv[1]
algorithm = sys.argv[2]
num_runs = sys.argv[3]
seed = sys.argv[4]
print "Got args: {0}".format(sys.argv)

supported_algorithms = ['nsm']

print "loading model"
model = pickle.load(open(input_file))
print "compiling model"
model.compile()
print "running model"
if algorithm in supported_algorithms:
    results = model.run(number_of_trajectories=int(num_runs), solver=algorithm, seed=int(seed), report_level=0)
else:
    results = model.run(number_of_trajectories=int(num_runs), seed=int(seed), report_level=0)
if isinstance(results, list):
    for i,r in enumerate(results):
        with open('{0}/result{1}'.format(output_dir,i),'w') as fd:
            pickle.dump(r, fd)
else:
    with open('{0}/result{1}'.format(output_dir,0),'w') as fd:
        pickle.dump(results, fd)
print "done"
