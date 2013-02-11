#!/usr/bin/env python
import os
import math
import numpy as np
import matplotlib.pyplot as plt

import Workspace.Workspace as wsp
from stochss.stochkit import *
from stochss.examplemodels import Vilar
import copy

def parametersweep(model,parametercases):

    # Get a new workpace for the sweep
    ws = wsp.Workspace()
    ws.register(name='ssa',executable=os.path.abspath(os.path.dirname(__file__))+'/../numerics/stochkit/ssa.py')
    ws.register(name='periodamplitude',executable=os.path.abspath(os.path.dirname(__file__)) + '/../numerics/core/periodamplitude.py')


    # Create a list of copies of the models but with perturbed paramters
    ws.models = []
    for case in parametercases:
        tempmodel = copy.deepcopy(model)
        tempmodel.listOfParameters[case[0]].value = case[1]
        ws.models.append(tempmodel)
            
    # Scatter models and seeds
    ws.seeds_d  = ws.scatter(range(0,len(parametercases)))
    ws.models_d = ws.scatter(ws.models)

    # For each model (parameter set), generate an ssa ensemble
    [ws.means_d, ws.variances_d, ws.ensembles_d] = ws.ssa(ws.models_d, 10, 1000, 1000, True, True, ws.seeds_d)

    # For each ensemble, compute the periods and amplitudes of the trajectories, and the mean of those.
    [ws.periods_d, ws.amplitudes_d] = ws.periodamplitude(ws.ensembles_d)

    # Gather the mean amplitudes, the mean periods and the whole ensemble
    ws.meanamplitudes = ws.gather(ws.amplitudes_d)
    ws.meanperiods = ws.gather(ws.periods_d)
    ws.ensembles = ws.gather(ws.ensembles_d)
            
    return ws
    

if __name__ == '__main__':


    # Read in the baseline model
    model = Vilar()
    
    # Specify the parameter cases
    vals = np.linspace(0.01,0.2,10)
    parametercases = []
    for val in vals:
        case = 'delta_r',val
        parametercases.append(case)

    ws = parametersweep(model, parametercases)

    # Extract one of the species
    nsets,nspec = np.shape(ws.meanamplitudes)
    AR = []
    PR = []
    for i in range(0,nsets):
        AR.append(ws.meanamplitudes[i][6])
        PR.append(ws.meanperiods[i][6])

    plt.figure(1)
    plt.plot(vals,AR)
    plt.show()