import gillespy
import json
import molnsutil
import numpy
import itertools

### NOTE the string '___JSON_STRING___' will be replaced by data from the model

class StochSSModel(gillespy.Model):
    json_data = json.loads("""___JSON_STRING___""")
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


        gillespy.Model.__init__(self, name = self.json_data["name"])

        parameterByName = dict()

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


#model = Model()
#output = model.run()
#print output

parameters = dict()

if StochSSModel.json_data['logA']:
    parameters[StochSSModel.json_data['parameterA']] = numpy.logspace(numpy.log10(StochSSModel.json_data['minValueA']), numpy.log10(StochSSModel.json_data['maxValueA']), StochSSModel.json_data['stepsA'])
else:    
    parameters[StochSSModel.json_data['parameterA']] = numpy.linspace(StochSSModel.json_data['minValueA'], StochSSModel.json_data['maxValueA'], StochSSModel.json_data['stepsA'])
    
if StochSSModel.json_data['variableCount'] != 1:
    if StochSSModel.json_data['logB']:
        parameters[StochSSModel.json_data['parameterB']] = numpy.logspace(numpy.log10(StochSSModel.json_data['minValueB']), numpy.logspace(StochSSModel.json_data['maxValueB']), StochSSModel.json_data['stepsB'])
    else:
        parameters[StochSSModel.json_data['parameterB']] = numpy.linspace(StochSSModel.json_data['minValueB'], StochSSModel.json_data['maxValueB'], StochSSModel.json_data['stepsB'])

print "Parameters: ",parameters

import uuid
name = "StochSS_exec" + str(uuid.uuid4())
print "Name: ", name
import sys
sys.stdout.flush()

sweep = molnsutil.ParameterSweep(name=name, model_class=StochSSModel, parameters=parameters)
#sweep = molnsutil.ParameterSweep(model_class=StochSSModel, parameters=parameters)

statsSpecies = sorted([specie for specie, doStats in StochSSModel.json_data['speciesSelect'].items() if doStats])

def mapAnalysis(result):
    metrics = { 'max' : {}, 'min' : {}, 'avg' : {}, 'var' : {} }
    for i, specie in enumerate(statsSpecies):
        metrics['max'][specie] = numpy.max(result[:, i])
        metrics['min'][specie] = numpy.min(result[:, i])
        metrics['avg'][specie] = numpy.mean(result[:, i])
        metrics['var'][specie] = numpy.var(result[:, i])

    return metrics

def reduceAnalysis(metricsList):
    reduced = { 'max' : {}, 'min' : {} }

    keys1 = ['max', 'min', 'avg', 'var']
    for key1, key2 in itertools.product(keys1, statsSpecies):
        toReduce = [metrics[key1][key2] for metrics in metricsList]

        reduced[(key1, key2)] = { 'max' : numpy.max(toReduce),
                                  'avg' : numpy.min(toReduce),
                                  'avg' : numpy.mean(toReduce),
                                  'var' : numpy.var(toReduce) }

    return reduced

sys.stdout.write("Starting Parameter sweep\n")
sys.stdout.flush()
#, reducer = reduceAnalysis
ret = sweep.run(mapper = mapAnalysis, number_of_trajectories = StochSSModel.json_data['trajectories'], chunk_size = 1, store_realizations = False, progress_bar = False)

import pickle
dat = []
for r in ret:
    dat.append({ 'parameters' : r.parameters, 'result' : r.result })

with open('results', 'w') as f:
    pickle.dump(dat, f)
