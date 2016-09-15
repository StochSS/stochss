import gillespy
import sys
import uuid
import itertools
import json
import numpy
import os
import pickle
os.environ["PATH"] += os.pathsep + "{0}/ode/".format(os.path.join(os.path.dirname(__file__), "../../../"))

### NOTE the string '_t__JSON_STRING___' (without the extra 't' at the start) will be replaced by data from the model

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


def mapAnalysis(result):
    metrics = { 'max' : {}, 'min' : {}, 'avg' : {}, 'var' : {}, 'finalTime' : {} }
    for i, specie in enumerate(statsSpecies):
        metrics['max'][specie] = numpy.max(result[specie])
        metrics['min'][specie] = numpy.min(result[specie])
        metrics['avg'][specie] = numpy.mean(result[specie])
        metrics['var'][specie] = numpy.var(result[specie])
        metrics['finalTime'][specie] = result[specie][-1]

    return metrics

def reduceAnalysis(metricsList):
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

def getParameters():
    parameters = dict()
    if StochSSModel.json_data['logA']:
        parameters[StochSSModel.json_data['parameterA']] = numpy.logspace(numpy.log10(StochSSModel.json_data['minValueA']), numpy.log10(StochSSModel.json_data['maxValueA']), StochSSModel.json_data['stepsA'])
    else:
        parameters[StochSSModel.json_data['parameterA']] = numpy.linspace(StochSSModel.json_data['minValueA'], StochSSModel.json_data['maxValueA'], StochSSModel.json_data['stepsA'])

    if StochSSModel.json_data['variableCount'] != 1:
        if StochSSModel.json_data['logB']:
            parameters[StochSSModel.json_data['parameterB']] = numpy.logspace(numpy.log10(StochSSModel.json_data['minValueB']), numpy.log10(StochSSModel.json_data['maxValueB']), StochSSModel.json_data['stepsB'])
        else:
            parameters[StochSSModel.json_data['parameterB']] = numpy.linspace(StochSSModel.json_data['minValueB'], StochSSModel.json_data['maxValueB'], StochSSModel.json_data['stepsB'])
    return parameters;

def run_local_parameter_sweep(parameters, mapper_fn=mapAnalysis, reducer_fn=reduceAnalysis):
    pset_list = []
    dat = []
    if len(parameters) > 1:
        pnames = parameters.keys()
        for pvals1 in parameters[pnames[0]]:
            for pvals2 in parameters[pnames[1]]:
                pset = {pnames[0]:pvals1, pnames[1]:pvals2}
                pset_list.append(pset)
    else:
        for pname,pvals in parameters.iteritems():
            for pval in pvals:
                pset = {pname:pval}
                pset_list.append(pset)

    for pset in pset_list:
        sys.stdout.write("\tSimulating {0}\n".format(pset))
        sys.stdout.flush()
        model = StochSSModel(**pset)
        results = model.run(solver=gillespy.StochKitODESolver, show_labels=True)
        if not isinstance(results, list):
            results = [results]
        mapped_list = []
        for r in results:
            mapped_list.append(mapper_fn(r))
        dat.append({ 'parameters' : pset, 'result' : reducer_fn(mapped_list) })
    return dat


if __name__ == '__main__':
    parameters = getParameters()
    print "Parameters: ",parameters

    name = "StochSS_exec" + str(uuid.uuid4())
    print "Name: ", name
    sys.stdout.flush()

    statsSpecies = sorted([specie for specie, doStats in StochSSModel.json_data['speciesSelect'].items() if doStats])

    sys.stdout.write("Starting Parameter sweep\n")
    sys.stdout.flush()
    dat = []
    #############################################
    sys.stdout.write("PATH={0}".format(os.environ["PATH"]))
    sys.stdout.flush()
    #############################################
    if StochSSModel.json_data['isLocal']:  # Turn on debugging, run 'local' 
        sys.stdout.write("Using local serial execution mode\n")
        sys.stdout.flush()
        dat = run_local_parameter_sweep(parameters, mapper_fn=mapAnalysis, reducer_fn=reduceAnalysis)
    else:
        sys.stdout.write("Using parallel execution mode (molnsutil.ParameterSweep)\n")
        sys.stdout.flush()
        import molnsutil
        sweep = molnsutil.ParameterSweep(name=name, model_class=StochSSModel, parameters=parameters)
        ret = sweep.run(mapper = mapAnalysis, reducer = reduceAnalysis, number_of_trajectories = StochSSModel.json_data['trajectories'], chunk_size = 1, store_realizations = False, progress_bar = False)
        for r in ret:
            dat.append({ 'parameters' : r.parameters, 'result' : r.result })
    #############################################

    sys.stdout.write("Finished Parameter sweep\n")
    sys.stdout.flush()

    result_file = os.path.join(os.path.dirname(__file__),'results')

    sys.stdout.write("Writing result to file '{0}'\n".format(result_file))
    sys.stdout.flush()

    with open(result_file, 'w') as f:
        pickle.dump(dat, f)

    sys.stdout.write("Done\n\n")
    sys.stdout.flush()
