#!/usr/bin/env python

import threading
import subprocess
import time
import pyurdme
#from cylinder_demo.cylinder_demo3D import cylinderDemo3D
from examples.simple_diffusion.simple_diffusion import simple_diffusion as cylinderDemo3D
#from examples.cylinder_demo.cylinder_demo3D import cylinderDemo3D

class Counter(threading.Thread):
    def run(self):
        cnt = 0
        last_t = time.time()
        while True:
            old_t = last_t
            last_t = time.time()
            print "count is {0}\tdelta_t={1}".format(cnt, last_t-old_t)
            cnt += 1
            time.sleep(1)


def g2(results):
    """ Reduce the result list by computing the mean value of the species A. """
    #results = pickle.loads(results)
    for i,result in enumerate(results):
        if i == 0:
            A  = result.get_species("A",-1)
        else:
            A  = A + result.get_species("A",-1)
    mean = A/len(results)
    return mean[100]

def run_ensemble(model, nt,s):
    """ Generates an ensemble consisting of number_of_trajectories realizations.
        Returns a list of result objects. """
    
    import pyurdme
    from pyurdme.nsmsolver import NSMSolver
    import sys
    import numpy
    
    results = model.run(number_of_trajectories=nt,seed=s)
    
    if not isinstance(results,list):
        results = [results]
    
    return g2(results)

if __name__ == '__main__':
    t1 = Counter()
    t1.daemon = True
    t1.setDaemon(True)
    t1.start()
    time.sleep(1)

    print "main thread sleeping 5"
    #time.sleep(5)
    handle = subprocess.Popen("sleep 5", shell=True)
    return_code = handle.wait()
    print "main thread assembling pyurdme model"
    #model = cylinderDemo3D()
    print "main thread run pyurdme model"
    #result = model.run(5)
    #result = run_ensemble(model, 5, 43242)
    #print result
    print "main thread exiting"
