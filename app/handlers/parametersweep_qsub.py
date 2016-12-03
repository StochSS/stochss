import gillespy
import sys
import uuid
import itertools
import json
import numpy
import os
import pickle
import time

import cluster_execution.cluster_parameter_sweep
import cluster_execution.remote_execution

#from cluster_execution import cluster_execution_exceptions
def getParameters(data):
    parameters = dict()
    if data['logA']:
        parameters[data['parameterA']] = numpy.logspace(numpy.log10(data['minValueA']), numpy.log10(data['maxValueA']), data['stepsA'])
    else:
        parameters[data['parameterA']] = numpy.linspace(data['minValueA'], data['maxValueA'], data['stepsA'])

    if data['variableCount'] != 1:
        if data['logB']:
            parameters[data['parameterB']] = numpy.logspace(numpy.log10(data['minValueB']), numpy.log10(data['maxValueB']), data['stepsB'])
        else:
            parameters[data['parameterB']] = numpy.linspace(data['minValueB'], data['maxValueB'], data['stepsB'])
    return parameters

def deterministic(data):

    statsSpecies = sorted([specie for specie, doStats in data['speciesSelect'].items() if doStats])

    def mapAnalysis(result):
        metrics = { 'max' : {}, 'min' : {}, 'avg' : {}, 'var' : {}, 'finalTime' : {} }
        for i, specie in enumerate(statsSpecies):
            metrics['max'][specie] = numpy.max(result[:, i + 1])
            metrics['min'][specie] = numpy.min(result[:, i + 1])
            metrics['avg'][specie] = numpy.mean(result[:, i + 1])
            metrics['var'][specie] = numpy.var(result[:, i + 1])
            metrics['finalTime'][specie] = result[:, 0][-1]

        return metrics

    def reduceAnalysis(metricsList, parameters = None):
        reduced = {}

        keys1 = ['max', 'min', 'avg', 'var', 'finalTime']
        for key1, key2 in itertools.product(keys1, statsSpecies):
            toReduce = [metrics[key1][key2] for metrics in metricsList]

            if key1 not in reduced:
                reduced[key1] = {}

            reduced[key1][key2] = {
                'max' : numpy.max(toReduce),
                'min' : numpy.min(toReduce),
                'avg' : numpy.mean(toReduce),
                'var' : numpy.var(toReduce)
            }
        
        return reduced

    class StochSSModel(gillespy.Model):
        json_data = data

        def run(self, number_of_trajectories=1, seed=None, report_level=0, solver=None, stochkit_home=None, debug=False, show_labels=False):
            return super(StochSSModel, self).run(number_of_trajectories = number_of_trajectories, seed = seed, report_level = report_level, solver = gillespy.StochKitODESolver, stochkit_home = stochkit_home, debug = debug, show_labels = show_labels)

        def __init__(self, **kwargs):
            modelType = self.json_data["modelType"]
            species = self.json_data["species"]
            parameters = self.json_data["parameters"]
            reactions = self.json_data["reactions"]
            maxTime = self.json_data["maxTime"]
            if maxTime is None:
                maxTime = 100
            increment = self.json_data["increment"]
            if increment is None:
                increment = 1


            gillespy.Model.__init__(self, name = self.json_data["name"], population = False)

            parameterByName = dict()

            sys.stdout.write(str(kwargs))
            sys.stdout.write('\n')

            for parameter in parameters:
                if parameter['name'] in kwargs:
                    parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = kwargs[parameter['name']])
                    sys.stdout.write('HIII ' + parameter['name'] + ' in kwargs')
                    sys.stdout.write('\n')
                else:
                    parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = parameter['value'])
                    sys.stdout.write('NO ' + parameter['name'] + ' not in kwargs')
                    sys.stdout.write('\n')

                self.add_parameter(parameterByName[parameter['name']])

            speciesByName = dict()

            for specie in species:
                speciesByName[specie['name']] = gillespy.Species(name = specie['name'], initial_value = specie['initialCondition'])

                self.add_species(speciesByName[specie['name']])

            for reaction in reactions:
                inReactants = dict()
                for reactant in reaction['reactants']:
                    if reactant['specie'] not in inReactants:
                        inReactants[reactant['specie']] = 0

                    inReactants[reactant['specie']] += reactant['stoichiometry']

                inProducts = dict()

                for product in reaction['products']:
                    if product['specie'] not in inProducts:
                        inProducts[product['specie']] = 0

                    inProducts[product['specie']] += product['stoichiometry']

                reactants = dict([(speciesByName[reactant[0]], reactant[1]) for reactant in inReactants.items()])

                products = dict([(speciesByName[product[0]], product[1]) for product in inProducts.items()])
            
                if(reaction['type'] == 'custom'):
                    self.add_reaction(gillespy.Reaction(name = reaction['name'], reactants = reactants, products = products, propensity_function = reaction['equation']))
                else:
                    self.add_reaction(gillespy.Reaction(name = reaction['name'], reactants = reactants, products = products, rate = parameterByName[reaction['rate']]))

            self.timespan(numpy.concatenate((numpy.arange(maxTime / increment) * increment, [maxTime])))

    rh = cluster_execution.remote_execution.RemoteHost("bic05.bic.ucsb.edu", "bales", "/home/bbales2/.ssh/id_rsa", port = 22)

    cps = cluster_execution.cluster_parameter_sweep.ClusterParameterSweep(model_cls = StochSSModel, parameters = getParameters(data), remote_host = rh)

    x = cps.run_async(mapper = mapAnalysis, reducer = reduceAnalysis, number_of_trajectories = StochSSModel.json_data['trajectories'], store_realizations = True)

    return x

#while 1:
#    try:
#        print cps.get_sweep_result(x)
#        break
#    except (cluster_execution_exceptions.RemoteJobNotFinished, cluster_execution_exceptions.RemoteJobFailed) as e:
#        print "Stuff not ready"
#        time.sleep(1)

