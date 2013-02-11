#!/usr/local/python 

""" 

    This is an example of a reducer. Computes the mean over a StochKit ensemble. 
    A StochKit ensamble is a collection of StochKitTrajctories. 
    Right now, a StochKitTrajectory is simply a CSV file, 
    and a StochKitEnsemble is a path to a folder containing many such files. 
    
    OBS. This is conceptual implementation. Mean can be implemented in parallell
         in many different ways. 
    
    input:  Path to folder containing a StochKit ensemble (no trailing /)
    output: ndarray. Mean of all species as a function of time.
    
"""
    
import sys
import os
from numpy import *

if __name__ == '__main__':
    
    # Read a StochKit2 enemble and iterate over its StochKitTrajectories 
    
    """ Load the StochKitEnsemble input object. """
    foldername = sys.argv[1]
    
    # File to store output
    meantxt = sys.argv[2]
    
    """ Determine the number of trajectory files in the folder. 
        This information should be contained in the class that describes
        a collection of trajectories (and hence in the serialized data).  """
        
    num_files = os.popen('ls -l ' + foldername + ' | grep -c trajectory',"r").readline();
    num_files = int(num_files)
    
    """ Iterater over trajectory files in the folder and 
        add the arrays, finally divide by numer of trajectories
        to obtain the mean. """
    
    filename = foldername + '/trajectory0.txt'
    f = open(filename,"r")
    meanspec=loadtxt(f)
    f.close()
    
    for i in range(1,num_files-1):
        
        filename = foldername + '/trajectory' + str(i) + '.txt'
        f = open(filename,"r")
        stochdata=loadtxt(f)
        f.close()
        
        add(meanspec,stochdata)
    
    divide(meanspec,num_files)

    # Print result to stdout for now. 
    savetxt(meantxt,meanspec)
                        
            