import libsbml
import model
import os
import stochkit
import numpy

def convert(filename, modelName = None):
    document = libsbml.readSBML(filename)

    errors = []

    errorCount = document.getNumErrors()
    if errorCount > 0:
        for i in range(errorCount):
            error = document.getError(i)
            converterCode = 0
            converterCode = -10

            errors.append(["SBML {0}, code {1}, line {2}: {3}".format(error.getSeverityAsString(), error.getErrorId(), error.getLine(), error.getMessage()), converterCode])

    if min([code for error, code in errors] + [0]) < 0:
        return None, errors

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

    if len(set(perSpeciesUnits)) > 1:
        errors.append(["This model has a mix of Substance and Amount initial conditions. This mixing is not allowed in StochSS", -1])

    if len(perSpeciesUnits) == 0:
        isPopulation = True
        errors.append(["There appear to be no species in this model, assuming this is a 'Population' model", -1])
    else:
        if list(set(perSpeciesUnits))[0] == "population":
            isPopulation = True
        else:
            isPopulation = False

    if isPopulation:
        model.units = "population"
    else:
        model.units = "concentration"

    for i in range(model.getNumSpecies()):
        species = model.getSpecies(i)
        name = species.getId()

        if species.isSetInitialAmount():
            value = species.getInitialAmount()
        elif species.isSetInitialConcentration():
            value = species.getInitialConcentration()
        else:
            ar = model.getAssignmentRule(species.getId())
            if ar:
                errors.append(["Species '{0}' does not have any initial conditions. Associated assignment rule '{1}' found, but assignment rules not supported in StochSS. Assuming initial condition 0".format(species.getId(), ar.getId(), libsbml.formulaToString(ar.getMath())), 0])
            else:
                errors.append(["Species '{0}' does not have any initial conditions or assignment rules. Assuming initial condition 0".format(species.getId()), 0])

            value = 0

        if value < 0.0:
            errors.append(["Species '{0}' has negative initial condition ({1}). StochSS does not support negative initial conditions. Assuming initial condition 0".format(species.getId(), value), -5])
            value = 0

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

    for i in range(model.getNumRules()):
        rule = model.getRule(i)

        t = []

        if rule.isCompartmentVolume():
            t.append('compartment')
        if rule.isParameter():
            t.append('parameter')
        elif rule.isAssignment():
            t.append('assignment')
        elif rule.isRate():
            t.append('rate')
        elif rule.isAlgebraic():
            t.append('algebraic')

        if len(t) > 0:
            t[0] = t[0].capitalize()

            msg = ", ".join(t)
            msg += " rule"
        else:
            msg = "Rule"

        errors.append(["{0} '{1}' found on line '{2}' with equation '{3}'. StochSS does not support SBML Rules".format(msg, rule.getId(), rule.getLine(), libsbml.formulaToString(rule.getMath())), -5])

    for i in range(model.getNumCompartments()):
        compartment = model.getCompartment(i)

        errors.append(["Compartment '{0}' found on line '{1}' with volume '{2}' and dimension '{3}'. StochSS assumes a single well-mixed, reaction volume".format(compartment.getId(), compartment.getLine(), compartment.getVolume(), compartment.getSpatialDimensions()), -5])

    for i in range(model.getNumConstraints()):
        constraint = model.getConstraint(i)

        errors.append(["Constraint '{0}' found on line '{1}' with equation '{2}'. StochSS does not support SBML Constraints".format(constraint.getId(), constraint.getLine(), libsbml.formulaToString(constraint.getMath())), -5])

    for i in range(model.getNumEvents()):
        event = model.getEvent(i)

        errors.append(["Event '{0}' found on line '{1}' with trigger equation '{2}'. StochSS does not support SBML Events".format(event.getId(), event.getLine(), libsbml.formulaToString(event.getTrigger().getMath())), -5])

    return stochssModel, errors


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
    else:
        sbml_list = sys.argv[1:]

    for sbml_file in sbml_list:
        print "Testing 'convert()' for {0}".format(sbml_file)
        if sbml_file.startswith('http'):
            response = urllib2.urlopen(sbml_file)
            tmp = tempfile.NamedTemporaryFile(delete = False)
            tmp.write(response.read())
            tmp.close()
            ######
            model, errors = convert(tmp.name)
            print os.linesep.join([error for error, code in errors])
            print "-----"
            os.remove(tmp.name)
            ######
        else:
            if not os.path.exists(sbml_file):
                raise Exception("Can not find file on disk '{0}'".format(sbml_file))
            ######
            model, errors = convert(sbml_file)
            print os.linesep.join([error for error, code in errors])
            ######
            
