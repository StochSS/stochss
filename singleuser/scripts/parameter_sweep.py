#!/usr/bin/env python3


import os
import copy
import json
import numpy as np
import pickle

from run_model import run_solver


# Feature extraction function.  What value(s) do you want to extract
# from the simulation trajectory

def population_at_last_timepoint(c,res):
    if c.verbose: print('population_at_last_timepoint {0}={1}'.format(c.species_of_interest,res[c.species_of_interest][-1]))
    return res[c.species_of_interest][-1]

# Aggregation function, How to we combine the values from multiple 
# trajectores

def mean_std_of_ensemble(c,data):
    a=np.average(data)
    s=np.std(data)
    if c.verbose: print('mean_std_of_ensemble m:{0} s:{1}'.format(a,s))
    return (a,s)

# Aggregation function, How to we combine the values from multiple 
# trajectores

def average_of_ensemble(c,data):
    a=np.average(data)
    if c.verbose: print('average_of_ensemble = {0}'.format(a))
    return a


class ParameterSweep1D():
    
    def run(c, settings, verbose=False):
        if not c.ps_model:
            raise Exception("The parameter sweep has not been configured!")
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        results = {}
        data = np.zeros((len(c.p1_range),2))# mean and std
        for species in c.list_of_species:
            results[species] = data
        for i,v1 in enumerate(c.p1_range):
            tmp_model = copy.deepcopy(c.ps_model)
            tmp_model.listOfParameters[c.p1].set_expression(v1)
            if verbose: print("running {0}={1}".format(c.p1,v1))
            #if verbose: print("\t{0}".format(["{0}={1}, ".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))
            if(c.number_of_trajectories > 1):
                tmp_results = run_solver(tmp_model, settings, 0)
                for species in c.list_of_species:
                    c.species_of_interest = species
                    (m,s) = ag([fn(x) for x in tmp_results])
                    results[species][i,0] = m
                    results[species][i,1] = s
            else:
                tmp_result = run_solver(tmp_model, settings, 0)
                for species in c.list_of_species:
                    c.species_of_interest = species
                    results[species][i,0] = c.feature_extraction(tmp_result)
        c.data = data
        return data

        
    def plot(c):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy
        fig, ax = plt.subplots(figsize=(8,8))
        plt.title("Parameter Sweep - Species: {0}".format(c.species_of_interest))
        plt.errorbar(c.p1_range,c.data[:,0],c.data[:,1])
        plt.xlabel(c.p1, fontsize=16, fontweight='bold')
        plt.ylabel("Population", fontsize=16, fontweight='bold')


class ParameterSweep2D():

    def run(c, settings, verbose=False):
        if not c.ps_model:
            raise Exception("The parameter sweep has not been configured!")
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        results = {}
        data = np.zeros((len(c.p1_range),len(c.p2_range)))
        for species in c.list_of_species:
            results[species] = data
        for i,v1 in enumerate(c.p1_range):
            for j,v2 in enumerate(c.p2_range):
                tmp_model = copy.deepcopy(c.ps_model)
                tmp_model.listOfParameters[c.p1].set_expression(v1)
                tmp_model.listOfParameters[c.p2].set_expression(v2)
                if verbose: print("running {0}={1}, {2}={3}".format(c.p1,v1,c.p2,v2))
                #if verbose: print("\t{0}".format(["{0}={1}, ".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))
                if(c.number_of_trajectories > 1):
                    tmp_results = run_solver(tmp_model, settings, 0)
                    for species in c.list_of_species:
                        c.species_of_interest = species
                        results[species][i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = run_solver(tmp_model, settings, 0)
                    for species in c.list_of_species:
                        c.species_of_interest = species
                        results[species][i,j] = c.feature_extraction(tmp_result)
        c.data = results
        return results

        
    def plot(c):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy
        fig, ax = plt.subplots(figsize=(8,8))
        plt.imshow(c.data)
        ax.set_xticks(numpy.arange(c.data.shape[1])+0.5, minor=False)
        ax.set_yticks(numpy.arange(c.data.shape[0])+0.5, minor=False)
        plt.title("Parameter Sweep - Species: {0}".format(c.species_of_interest))
        ax.set_xticklabels(c.p1_range, minor=False, rotation=90)
        ax.set_yticklabels(c.p2_range, minor=False)
        ax.set_xlabel(c.p1, fontsize=16, fontweight='bold')
        ax.set_ylabel(c.p2, fontsize=16, fontweight='bold')
        divider = make_axes_locatable(ax)
        cax = divider.append_axes("right", size="5%", pad=0.2)
        _ = plt.colorbar(ax=ax, cax=cax)


# Configuration for the Parameter Sweep
class ParameterSweepConfig1D(ParameterSweep1D):
    # What class defines the GillesPy2 model
    ps_model = None
    # What is the first parameter we will vary
    p1 = ""
    p1_range = np.linspace(1,10,10)
    number_of_trajectories = 100
    
    species_of_interest = ""
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = mean_std_of_ensemble

    
    def configure(self, model, settings, trajectories):
        self.ps_model = model
        self.p1 = settings['parameterOne']['name']
        self.p1_range = np.linspace(settings['p1Min'], settings['p1Max'], settings['p1Steps'])
        self.number_of_trajectories = trajectories
        self.species_of_interest = settings['speciesOfInterest']['name']
        self.list_of_species = model.get_all_species().keys()


# Configuration for the Parameter Sweep
class ParameterSweepConfig2D(ParameterSweep2D):
    # What class defines the GillesPy2 model
    ps_model = None
    # What is the first parameter we will vary
    p1 = ""
    # What is the second parameter we will vary
    p2 = ""
    p1_range = np.linspace(1,10,10)
    p2_range = np.linspace(1,10,10)
    number_of_trajectories = 100

    species_of_interest = ""
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = average_of_ensemble


    def configure(self, gillespy2_model, settings, trajectories):
        self.ps_model = gillespy2_model
        self.p1 = settings['parameterOne']['name']
        self.p2 = settings['parameterTwo']['name']
        self.p1_range = np.linspace(settings['p1Min'], settings['p1Max'], settings['p1Steps'])
        self.p2_range = np.linspace(settings['p2Min'], settings['p2Max'], settings['p2Steps'])
        self.number_of_trajectories = trajectories
        self.species_of_interest = settings['speciesOfInterest']['name']
        self.list_of_species = model.get_all_species().keys()


class ParameterSweep():

    def __init__(self, wkfl_path, mdl_path):
        self.wkfl_path = wkfl_path
        self.mdl_path = mdl_path
        self.mdl_file = mdl_path.split('/').pop()
        self.info_path = os.path.join(wkfl_path, 'info.json')
        self.log_path = os.path.join(wkfl_path, 'logs.txt')
        self.wkfl_mdl_path = os.path.join(wkfl_path, self.mdl_file)
        self.res_path = os.path.join(wkfl_path, 'results')


    def run(self, gillespy2_model, stochss_model, timeout):
        ps_settings = stochss_model['parameterSweepSettings']
        sim_settings = stochss_model['simulationSettings']
        trajectories = sim_settings['realizations']

        if ps_settings['is1D']:
            ps = ParameterSweepConfig1D()
        else:
            ps = ParameterSweepConfig2D()

        ps.configure(gillespy2_model, ps_settings, trajectories)
        results = ps.run(sim_settings)
        self.store_results(results)


    def store_results(self, results):
        if not 'results' in os.listdir(path=self.wkfl_path):
            os.mkdir(self.res_path)
        with open(os.path.join(self.res_path, 'results.p'), 'wb') as results_file:
            pickle.dump(results, results_file, protocol=pickle.HIGHEST_PROTOCOL)


        with open(os.path.join(self.res_path, 'results.json'), 'w') as json_file:
            json_file.write(json.dumps(str(results)))

