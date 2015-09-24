import gillespy
import json
import molnsutil
import numpy

# NOTE: THIS FILE IS INTERPRETTED AS A PYTHON FORMAT STRING
# That means curly braces are a special character. To initialize a dict, use {{}}

data = json.loads("""{0}""")

name = data["name"]
modelType = data["modelType"]
species = data["species"]
parameters = data["parameters"]
reactions = data["reactions"]
maxTime = data["maxTime"]
increment = data["increment"]

class Model(gillespy.Model):
    def __init__(self, parameter_values = None):
        gillespy.Model.__init__(self, name = name)

        parameterByName = {{}}

        for parameter in parameters:
            parameterByName[parameter['name']] = gillespy.Parameter(name = parameter['name'], expression = parameter['value'])

            self.add_parameter(parameterByName[parameter['name']])

        speciesByName = {{}}

        for specie in species:
            speciesByName[specie['name']] = gillespy.Species(name = specie['name'], initial_value = specie['initialCondition'])

            self.add_species(speciesByName[specie['name']])

        for reaction in reactions:
            inReactants = {{}}
            for reactant in reaction['reactants']:
                if reactant['specie'] not in inReactants:
                    inReactants[reactant['specie']] = 0

                inReactants[reactant['specie']] += reactant['stoichiometry']

            inProducts = {{}}
            for product in reaction['products']:
                if product['specie'] not in inProducts:
                    inProducts[product['specie']] = 0

                inProducts[product['specie']] += product['stoichiometry']

            reactants = dict([(speciesByName[reactant[0]], reactant[1]) for reactant in inReactants.items()])

            products = dict([(speciesByName[product[0]], product[1]) for product in inProducts.items()])
            
            if(reaction['type'] == 'custom'):
                self.add_reaction(gillespy.Reaction(name = stochss.model.Reaction(reaction['name'], reactants = reactants, products = products, propensity_function = reaction['equation'])))
            else:
                self.add_reaction(gillespy.Reaction(name = stochss.model.Reaction(reaction['name'], reactants = reactants, products = products, rate = parameterByName[reaction['rate']])))

        self.timespan(numpy.concatenate((numpy.arange(data['maxTime'] / data['increment']) * dt, [data['maxTime']])))

funcA = numpy.linspace if data['logA'] else numpy.logspace
funcB = numpy.linspace if data['logB'] else numpy.logspace

parameters = {{}}

parameters[data['parameterA']] = funcA(data['minValueA'], data['maxValueA'], data['stepsA'])

if data['variableCount'] != 1:
    parameters[data['parameterB']] = funcB(data['minValueB'], data['maxValueB'], data['stepsB'])

sweep = molnsutil.ParameterSweep(model_class = Model, parameters = parameters)

def mapAnalysis(result):
    #mappedResults = {{}}
    #for i, specie in enumerate(species):
    #    mappedResults['maxVal'] = numpy.max(results[:, i + 1, :])

    return result.shape#mappedResults

ret = sweep.run(mapper = mapAnalysis, number_of_trajectories = 1, store_realizations = False, progress_bar = False)

f = open('results', 'w')
pickle.dump(ret, f)
f.close()
