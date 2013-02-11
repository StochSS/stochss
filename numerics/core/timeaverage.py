#!/usr/bin/python

""" 
    
    Simple postprocessing (map) routine for StochKit2.
    
    Computes the temporal average of each of the species over all time points. 
    
    input:  (StochKitTrajectory) A StochKit2 trajectory output file. 
    output: (ndarray) (Mspecies x 1) array with the temporal averages 
    (written to stdout for now). 
    
    descibed in: timeaverage.yaml
    
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
    tlen = dims[0]
    Mspecies = dims[1]
    T = stochdata[tlen-1,0];
    
    for i in range(1,Mspecies):
        tmean = 0.0
        for j in range(0,tlen-1):
            tmean += (stochdata[j+1,0]-stochdata[j,0])*stochdata[j,i]
        print tmean/T
