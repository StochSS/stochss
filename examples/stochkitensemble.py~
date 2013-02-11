##!/usr/local/python
import math
import numpy as np
import matplotlib.pyplot as plt

import Workspace.Workspace as wsp
import os

from stochss.model import *
from stochss.stochkit import *
from stochss.examplemodels import dimerdecay
import pickle


def ensemble(model,ntraj):
    """ Simulate the model and generate an ensemble """
    
    
    # Get a new workpace
    ws = wsp.Workspace()
    # "Register" the SSA funcion in the workspace
    ws.register(name='ssa',executable=os.path.abspath(os.path.dirname(__file__))+'/../numerics/stochkit/ssa.py')
    ws.models = [model]
    
    #Distribute the model
    ws.models_d = ws.scatter(ws.models)

    # Run SSA for all models in the distributed list  
    [ws.means_d, ws.variances_d, ws.ensembles_d] = ws.ssa(ws.models_d, ntraj, 20, 100, True, True)

    # Gather the ensemble to the local workspace
    ws.ensembles = ws.gather(ws.ensembles_d)

    return ws


if __name__ == '__main__':

    model = dimerdecay()
    ws = ensemble(model,1000)
   
    # Print the mean and variance
    print "Mean: " +  str(np.mean(ws.ensembles[0]))
    print "Variance: " +  str(np.var(ws.ensembles[0]))
    
    # Create a StochKitEnsemble and dump it to binary format.
    stkens = StochKitEnsemble(id="dimerdecayensemble",trajectories=ws.ensembles[0],parentmodel=model);
    stkens.dump(filename="testensemble.mat")
        
