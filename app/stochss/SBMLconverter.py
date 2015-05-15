import libsbml
import model
import os
import stochkit

def convert(filename, modelName = None):
    document = libsbml.readSBML(filename)

    if document.getNumErrors() > 0:
        raise Exception("More than zero errors in the model")

    model = document.getModel()
    numOfTabs = 0

    if modelName == None:
        modelName = model.getId()

    stochssModel = stochkit.StochKitModel(name = modelName)

    perSpeciesUnits = []
    isPopulation = True

    for i in range(model.getNumSpecies()):
        species = model.getSpecies(i)

        if species.isSetInitialConcentration():
            perSpeciesUnits.append("concentration")
        elif species.isSetInitialAmount():
            perSpeciesUnits.append("population")
        else:
            raise Exception("Species initial conditions (initialAmount or initialConcentration) must be defined on all initial conditions for StochSS")

    if len(set(perSpeciesUnits)) > 1:
        raise Exception("All species initial conditions must be either substance units or amount units. No mixing is possible in StochSS")

    print perSpeciesUnits

    if list(set(perSpeciesUnits))[0] == "population":
        isPopulation = True
    else:
        isPopulation = False

    for i in range(model.getNumSpecies()):
        species = model.getSpecies(i)
        name = species.getId()

        if isPopulation:
            value = species.getInitialAmount()
        else:
            value = species.getInitialConcentration()

        stochssSpecies = stochkit.Species(name = name, initial_value = value)
        stochssModel.addSpecies([stochssSpecies])

    for i in range(model.getNumParameters()):
        parameter=model.getParameter(i)
        name=parameter.getId()
        value=parameter.getValue()

        stochssParameter = stochkit.Parameter(name = name, expression = value)
        stochssModel.addParameter([stochssParameter])

    for i in range(model.getNumCompartments()):
        compartment=model.getCompartment(i)
        name=compartment.getId()
        value=compartment.getSize()

        stochssParameter = stochkit.Parameter(name = name, expression = value)
        stochssModel.addParameter([stochssParameter])

    #local parameters
    for i in range(model.getNumReactions()):
        reaction = model.getReaction(i)
        kineticLaw = reaction.getKineticLaw()

        for j in range(kineticLaw.getNumParameters()):
            parameter = kineticLaw.getParameter(j)
            name = parameter.getId()
            value = parameter.getValue()
            stochssParameter = stochkit.Parameter(name = name, expression = value)
            stochssModel.addParameter([stochssParameter])

    #reactions
    for i in range(model.getNumReactions()):
        reaction = model.getReaction(i)
        name = reaction.getId()
        
        reactants = {}
        products = {}

        for j in range(reaction.getNumReactants()):
            species = reaction.getReactant(j)
            reactants[species.getSpecies()] = species.getStoichiometry()

        #get products
        for j in range(reaction.getNumProducts()):
            species=reaction.getProduct(j)
            products[species.getSpecies()] = species.getStoichiometry()

        #propensity
        kineticLaw = reaction.getKineticLaw()
        propensity = kineticLaw.getFormula()

        stochssReaction = stochkit.Reaction(name = name, reactants = reactants, products = products, propensity_function = propensity)

        stochssModel.addReaction([stochssReaction])

    return stochssModel, isPopulation


if __name__=='__main__':
    import sys
    import urllib2
    import tempfile
    if len(sys.argv) <= 1:
        raise Exception("Specify a list of filename or URL to check, or '-bmdb' to check all models at the biomodels database")

    if sys.argv[1] == '-bmdb':
        #http://www.ebi.ac.uk/biomodels-main/download?mid=BIOMD0000000054
        sbml_list=[]
        for ndx in range(575):
            template = 'http://www.ebi.ac.uk/biomodels-main/download?mid=BIOMD0000000000'
            template = template[:-len(str(ndx+1))] + str(ndx+1)
            sbml_list.append(template)
            print template
    else:
        sbml_list = sys.argv[1:]

    for sbml_file in sbml_list:
        print "Testing 'convert()' for {0}".format(sbml_file)
        if sbml_file.startswith('http'):
            response = urllib2.urlopen(sbml_file)
            tmp = tempfile.NamedTemporaryFile()
            tmp.write(response.read())
            ######
            convert(tmp.name)
            ######
        else:
            if not os.path.exists(sbml_file):
                raise Exception("Can not find file on disk '{0}'".format(sbml_file))
            ######
            convert(sbml_file)
            ######
            
