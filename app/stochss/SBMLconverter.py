import libsbml
import model
import os
import stochkit
import numpy

def removeUnicode(s):
    if isinstance(s, unicode):
        return str(s)
    else:
        return s

def convertToSBML(filename, model):
    try:
        document = libsbml.SBMLDocument(2, 1)
    except ValueError:
        raise SystemExit('Could not create SBMLDocumention object')

    sbmlModel = document.createModel()    

    sbmlModel.setName(str(model.name))

    c = sbmlModel.createCompartment()
    c.setId('c')
    c.setConstant(True)
    c.setSize(1)
    c.setSpatialDimensions(3)

    species = model.species

    for specie in species:
        s = sbmlModel.createSpecies()
        s.setCompartment('c')
        s.setId(removeUnicode(specie['name']))
        s.setInitialAmount(removeUnicode(specie['initialCondition']))

    dParameters = {}

    parameters = model.parameters
    for parameter in parameters:
        p = sbmlModel.createParameter()
        dParameters[parameter['name']] = parameter['value']
        p.setId(removeUnicode(parameter['name']))
        value = removeUnicode(parameter['value'])

        try:
            value = float(value)
        except Exception as e:
            raise Exception("Python threw an error when casting parameter {0} to float (decimal float required for this functionality)".format(parameter['name']))

        p.setValue(value)

    reactions = model.reactions
    for reaction in reactions:
        r = sbmlModel.createReaction()
        r.setId(removeUnicode(reaction['name']))

        reactants = {}
        for reactant in reaction['reactants']:
            if reactant['specie'] not in reactants:
                reactants[reactant['specie']] = 0

            reactants[reactant['specie']] += reactant['stoichiometry']

        for reactantName, stoichiometry in reactants.items():
            r2 = r.createReactant()
            r2.setSpecies(removeUnicode(reactantName))
            r2.setStoichiometry(removeUnicode(stoichiometry))

        products = {}
        for product in reaction['products']:
            if product['specie'] not in products:
                products[product['specie']] = 0

            products[product['specie']] += product['stoichiometry']

        for productName, stoichiometry in products.items():
            p = r.createProduct()
            p.setSpecies(removeUnicode(productName))
            p.setStoichiometry(removeUnicode(stoichiometry))

        k = r.createKineticLaw()
        if reaction['type'] != 'custom':
            if len(reactants) == 0:
                equation = "{0}".format(reaction['rate'])
            elif len(reactants) == 1:
                reactantName, stoichiometry = reactants.items()[0]
                if stoichiometry == 1:
                    equation = "{0} * {1}".format(reaction['rate'], reactantName)
                elif stoichiometry == 2:
                    equation = "{0} * {1} * {1}".format(reaction['rate'], reactantName)
                else:
                    raise Exception("Failed to export SBML. Reaction '{0}' is marked as mass action but reactant '{1}' has stoichiometry '{2}' (impossible)".format(reaction['name'], reactantName, stoichiometry))
            elif len(reactants) == 2:
                reactantName0, stoichiometry0 = reactants.items()[0]
                reactantName1, stoichiometry1 = reactants.items()[1]

                if stoichiometry0 == 1 and stoichiometry1 == 1:
                    equation = "{0} * {1} * {2}".format(reaction['rate'], reactantName0, reactantName1)
                else:
                    raise Exception("Failed to export SBML. Reaction '{0}' is marked as mass action but total stoichiometry of reactants exceeds 2 (impossible)".format(reaction['name']))
            else:
                raise Exception("Failed to export SBML. Reaction '{0}' is marked as mass action but has {1} reactants (impossible)".format(reaction['name'], len(reactants)))
        else:
            equation = reaction['equation']

        try:
            k.setMath(libsbml.parseL3Formula(removeUnicode(equation)))
        except Exception as e:
            traceback.print_exc()
            raise Exception('libsbml threw an error when parsing rate equation "{0}" for reaction "{1}"'.format(equation, reaction['name']))

    writer = libsbml.SBMLWriter()

    with open(filename, 'w') as f:
        f.write(writer.writeSBMLToString(document))

def convertToStochSS(filename, modelName = None):
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
        modelName = model.getName()

    stochssModel = stochkit.StochKitModel(name = modelName)

    stochssModel.units = "concentration"

    for i in range(model.getNumSpecies()):
        species = model.getSpecies(i)

        if species.getId() == 'EmptySet':
            errors.append(["EmptySet species detected in model on line {0}. EmptySet is not an explicit species in StochSS".format(species.getLine()), 0])
            continue

        name = species.getId()

        if species.isSetInitialAmount():
            value = species.getInitialAmount()
        elif species.isSetInitialConcentration():
            value = species.getInitialConcentration()
        else:
            rule = model.getRule(species.getId())

            if rule:
                msg = ""

                if rule.isAssignment():
                    msg = "assignment "
                elif rule.isRate():
                    msg = "rate "
                elif rule.isAlgebraic():
                    msg = "algebraic "

                msg += "rule"

                errors.append(["Species '{0}' does not have any initial conditions. Associated {1} '{2}' found, but {1}s are not supported in StochSS. Assuming initial condition 0".format(species.getId(), msg, rule.getId()), 0])
            else:
                errors.append(["Species '{0}' does not have any initial conditions or rules. Assuming initial condition 0".format(species.getId()), 0])

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

            if species.getSpecies() == "EmptySet":
                errors.append(["EmptySet species detected as reactant in reaction '{0}' on line {1}. EmptySet is not an explicit species in StochSS".format(reaction.getId(), species.getLine()), 0])
            else:
                reactants[species.getSpecies()] = species.getStoichiometry()

        #get products
        for j in range(reaction.getNumProducts()):
            species=reaction.getProduct(j)

            if species.getSpecies() == "EmptySet":
                errors.append(["EmptySet species detected as product in reaction '{0}' on line {1}. EmptySet is not an explicit species in StochSS".format(reaction.getId(), species.getLine()), 0])
            else:
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

    for i in range(model.getNumFunctionDefinitions()):
        function = model.getFunctionDefinition(i)

        errors.append(["Function '{0}' found on line '{1}' with equation '{2}'. StochSS does not support SBML Function Definitions".format(function.getId(), function.getLine(), libsbml.formulaToString(function.getMath())), -5])

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
            
