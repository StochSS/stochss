import mesheditor
import fileserver
import logging
import pickle
import gillespy
import sys
import itertools
import numpy
import pyurdme
import os
import tempfile
import cluster_execution.cluster_parameter_sweep
import time
import json
import cluster_execution.remote_execution


def getParameters(data, return_none=False):
    if return_none:
        return None

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


def deterministic(data, cluster_info, not_full_parameter_sweep=False):
    statsSpecies = sorted([specie for specie, doStats in data['speciesSelect'].items() if doStats])

    def passThroughMapAnalysis(result):
        return result

    def passThroughReduceAnalysis(metricsList, parameters=None):
        return metricsList

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
                else:
                    parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = parameter['value'])

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

    rh = cluster_execution.remote_execution.RemoteHost(cluster_info['ip_address'], cluster_info['username'], cluster_info['ssh_key'], port=22)
    cps = cluster_execution.cluster_parameter_sweep.ClusterParameterSweep(model_cls = StochSSModel, parameters = getParameters(data, not_full_parameter_sweep), remote_host = rh)

    if not_full_parameter_sweep:
        x = cps.run_async(mapper=passThroughMapAnalysis, reducer=passThroughReduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)
    else:
        x = cps.run_async(mapper=mapAnalysis, reducer=reduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)

    return x


def stochastic(data, cluster_info, not_full_parameter_sweep=False):
    statsSpecies = sorted([specie for specie, doStats in data['speciesSelect'].items() if doStats])

    def passThroughMapAnalysis(result):
        return result

    def passThroughReduceAnalysis(metricsList, parameters=None):
        return metricsList

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


            gillespy.Model.__init__(self, name = self.json_data["name"], population = True)

            parameterByName = dict()

            sys.stdout.write(str(kwargs))
            sys.stdout.write('\n')

            for parameter in parameters:
                if parameter['name'] in kwargs:
                    parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = kwargs[parameter['name']])
                else:
                    parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = parameter['value'])

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

    rh = cluster_execution.remote_execution.RemoteHost(cluster_info['ip_address'], cluster_info['username'], cluster_info['ssh_key'], port=22)
    cps = cluster_execution.cluster_parameter_sweep.ClusterParameterSweep(model_cls = StochSSModel, parameters = getParameters(data, not_full_parameter_sweep), remote_host = rh)

    if not_full_parameter_sweep:
        x = cps.run_async(mapper=passThroughMapAnalysis, reducer=passThroughReduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)
    else:
        x = cps.run_async(mapper=mapAnalysis, reducer=reduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)

    return x


def spatial(data, cluster_info, not_full_parameter_sweep=False):
    statsSpecies = sorted([specie for specie, doStats in data['speciesSelect'].items() if doStats])

    def passThroughMapAnalysis(result):
        return result

    def passThroughReduceAnalysis(metricsList, parameters=None):
        return metricsList

    def mapAnalysis(result):

        metrics = { 'max' : {}, 'min' : {}, 'avg' : {}, 'var' : {}, 'finalTime' : {} }
        for i, specie in enumerate(statsSpecies):
            val = result.get_species(specie)
            non_spatial_val = numpy.sum(val, axis = 1)
            metrics['max'][specie] = numpy.max(non_spatial_val)
            metrics['min'][specie] = numpy.min(non_spatial_val)
            metrics['avg'][specie] = numpy.mean(non_spatial_val)
            metrics['var'][specie] = numpy.var(non_spatial_val)
            metrics['finalTime'][specie] = non_spatial_val[-1]

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

    class StochSSModel(pyurdme.URDMEModel):
        json_data = data

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
            reaction_subdomain_assignments = self.json_data["reaction_subdomain_assignments"]  #e.g. {'R1':[1,2,3]}
            species_subdomain_assignments = self.json_data["species_subdomain_assignments"]  #e.g. {'S1':[1,2,3]}
            species_diffusion_coefficients = self.json_data["species_diffusion_coefficients"] #e.g. {'S1':0.5}
            initial_conditions = self.json_data["initial_conditions"] #e.g.  { ic0 : { type : "place", species : "S0",  x : 5.0, y : 10.0, z : 1.0, count : 5000 }, ic1 : { type : "scatter",species : "S0", subdomain : 1, count : 100 }, ic2 : { type : "distribute",species : "S0", subdomain : 2, count : 100 } }


            pyurdme.URDMEModel.__init__(self, name = self.json_data["name"])
            mesh_file = tempfile.NamedTemporaryFile(suffix='.xml')
            mesh_file.write(self.json_data["mesh"])
            mesh_file.seek(0)
            self.mesh = pyurdme.URDMEMesh.read_dolfin_mesh(str(mesh_file.name))
            self.set_subdomain_vector(numpy.array(self.json_data["subdomains"]))

            parameterByName = dict()

            for parameter in parameters:
                if parameter['name'] in kwargs:
                    parameterByName[parameter['name']] = pyurdme.Parameter(name = parameter['name'], expression = kwargs[parameter['name']])
                else:
                    parameterByName[parameter['name']] = pyurdme.Parameter(name = parameter['name'], expression = parameter['value'])

                self.add_parameter(parameterByName[parameter['name']])

            speciesByName = dict()

            for specie in species:
                speciesByName[specie['name']] = pyurdme.Species(name = specie['name'], diffusion_constant=float(species_diffusion_coefficients[specie['name']]))
                self.add_species(speciesByName[specie['name']])
            for s, sd_list in species_subdomain_assignments.iteritems():
                spec = self.listOfSpecies[s]
                self.restrict(spec, sd_list)

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
                    self.add_reaction(pyurdme.Reaction(name = reaction['name'], reactants = reactants, products = products, propensity_function = reaction['equation']))
                else:
                    self.add_reaction(pyurdme.Reaction(name = reaction['name'], reactants = reactants, products = products, rate = parameterByName[reaction['rate']]))
            for r in reaction_subdomain_assignments:
                self.listOfReactions[r].restrict_to = reaction_subdomain_assignments[r]

            for ic in initial_conditions:
                spec = self.listOfSpecies[ic['species']]
                if ic['type'] == "place":
                    self.set_initial_condition_place_near({spec:int(ic['count'])}, point=[float(ic['x']),float(ic['y']),float(ic['z'])])
                elif ic['type'] == "scatter":
                    self.set_initial_condition_scatter({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
                elif ic['type'] == "distribute":
                    self.set_initial_condition_distribute_uniformly({spec:int(ic['count'])},subdomains=[int(ic['subdomain'])])
                else:
                    raise Exception("Unknown initial condition type {0}".format(ic['type']))

            self.timespan(numpy.concatenate((numpy.arange(maxTime / increment) * increment, [maxTime])))

    rh = cluster_execution.remote_execution.RemoteHost(cluster_info['ip_address'], cluster_info['username'], cluster_info['ssh_key'], port = 22)

    cps = cluster_execution.cluster_parameter_sweep.ClusterParameterSweep(model_cls = StochSSModel, parameters = getParameters(data, not_full_parameter_sweep), remote_host = rh)

    if not_full_parameter_sweep:
        x = cps.run_async(mapper=passThroughMapAnalysis, reducer=passThroughReduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)
    else:
        x = cps.run_async(mapper=mapAnalysis, reducer=reduceAnalysis,
                          number_of_trajectories=StochSSModel.json_data['trajectories'], store_realizations=True)

    return x

#while 1:
#    try:
#        print cps.get_sweep_result(x)
#        break
#    except (cluster_execution_exceptions.RemoteJobNotFinished, cluster_execution_exceptions.RemoteJobFailed) as e:
#        print "Stuff not ready"
#        time.sleep(1)