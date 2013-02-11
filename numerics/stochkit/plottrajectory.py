#!/usr/bin/python

import sys
from numpy import *
from matplotlib import pylab

if __name__ == '__main__':
    
    # Read a single StochKit2 trajectory file in native StochKit2 format. 
    filename = sys.argv[1]
    f = open(filename,"r")
    stochdata=loadtxt(f);
    f.close()
    
    fig = pylab.plot(stochdata)
    pylab.savefig(fig)
    
