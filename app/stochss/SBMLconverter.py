import libsbml
import model
import os
import stochkit

def convert(filename, modelName = None):
    document = libsbml.readSBML(filename)

    if document.getNumErrors() > 0:
        raise "More than zero errors in the model"

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
