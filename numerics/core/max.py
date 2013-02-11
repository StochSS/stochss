#!/usr/bin/python

""" 

    Simple postprocessing (map) routine for StochKit2.
    
    Computes the max of each of the species over all time points. 
    
    input:  (StochKitTrajectory) A StochKit2 trajectory output file. 
    output: (ndarray) (Mspecies x 1) array with the max-values 
                                    (written to stdout for now). 
    
    descibed in: max.yaml
     
"""

import sys
from numpy import *

if __name__ == '__main__':

    # Read a single StochKit2 trajectory file in native StochKit2 format. 
    filename = sys.argv[1]
    f = open(filename,"r")
    stochdata=loadtxt(f);
    f.close()

    # Dimensions of the trajectory
    dims = shape(stochdata)
    Mspecies = dims[1];
      
    for i in range(1,Mspecies):
        print stochdata[:,i].max()
    