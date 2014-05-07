""" 
    This module describes a model of a well-mixed biochemical system, via the Model class.
    Model objects should not be instantiated by an application. Instead, use StochKitModel 
    in 'stochkit.py', which extends Model with StochKit2 specific serialization. Refer to 
    'stochkit.py' for examples of its use. 
    
    Raises: SpeciesError, ParameterError, ReactionError
    
    Contact: Andreas Hellander
    
"""
from collections import OrderedDict

class Model(object):
    """ Representation of a well mixed biochemical model. Interfaces to solvers in StochSS
        should attempt to extend Model. """
    
    def __init__(self,name="",volume = None):
        """ Create an empty model. """
        
        # The name that the model is referenced by (should be a String)
        self.name = name
        
        # Optional decription of the model (string)
        self.annotation = ""
        
        # Dictionaries with Species, Reactions and Parameter objects.
        # Species,Reactio and Paramter names are used as keys.
        self.listOfParameters = OrderedDict()
        self.listOfSpecies    = OrderedDict()
        self.listOfReactions  = OrderedDict()
        
        # A well mixed model has an optional volume parameter. This should be a Parameter
        self.volume = volume;

        # This defines the unit system at work for all numbers in the model
        #   It should be a logical error to leave this undefined, subclasses should set it
        self.units = None
        
        # Dict that holds flattended parameters and species for
        # evaluation of expressions in the scope of the model.
        self.namespace = OrderedDict([])

    def updateNamespace(self):
        """ Create a dict with flattened parameter and species objects. """
        for param in self.listOfParameters:
            self.namespace[param]=self.listOfParameters[param].value
        # Dictionary of expressions that can be evaluated in the scope of this model.
        self.expressions = {}

    def getSpecies(self, sname):
        return self.listOfSpecies[sname]
    
    def getAllSpecies(self):
        return self.listOfSpecies

    def addSpecies(self, obj):
        """ 
            Add a species to listOfSpecies. Accepts input either as a single Species object, or
            as a list of Species objects.
        """
                
        if isinstance(obj, Species):
            if obj.name in self.listOfSpecies:
                raise ModelError("Can't add species. A species with that name alredy exisits.")
            self.listOfSpecies[obj.name] = obj;
        else: # obj is a list of species
            for S in obj:
                if S.name in self.listOfSpecies:
                    raise ModelError("Can't add species. A species with that name alredy exisits.")
                self.listOfSpecies[S.name] = S;
    
    def deleteSpecies(self, obj):
        self.listOfSpecies.pop(obj)        
         
    def deleteAllSpecies(self):
        self.listOfSpecies.clear()

    def setUnits(self, units):
        if units.lower() == 'concentration' or units.lower() == 'population':
            self.units = units.lower()
        else:
            raise Exception("units must be either concentration or population (case insensitive)")

    def getParameter(self,pname):
        try:
            return self.listOfParameters[pname]
        except:
            raise ModelError("No parameter named "+pname)
    def getAllParameters(self):
        return self.listOfParameters
    
    def addParameter(self,params):
        """ 
            Add Paramter(s) to listOfParamters. Input can be either a single
            paramter object or a list of Parameters.
        """
        # TODO, make sure that you don't overwrite an existing parameter??
        if type(params).__name__=='list':
            for p in params:
                self.listOfParameters[p.name] = p
        else:
            if type(params).__name__=='instance':
                self.listOfParameters[params.name] = params
            else:
                raise

    def deleteParameter(self, obj):
        self.listOfParameters.pop(obj)

    def setParameter(self,pname,expression):
        """ Set the expression of an existing paramter. """
        p = self.listOfParameters[pname]
        p.expression = expression
        p.evaluate()
        
    def resolveParameters(self):
        """ Attempt to resolve all parameter expressions to scalar floats. This
            methods must be called before exporting the model. """
        self.updateNamespace()
        for param in self.listOfParameters:
            try:
                self.listOfParameters[param].evaluate(self.namespace)
            except:
                raise ParameterError("Could not resolve Parameter expression "+param + "to a scalar value.")
    
    def deleteAllParameters(self):
        self.listOfParameters.clear()

    def addReaction(self,reacs):
        """ Add reactions to model. Input can be single instance, a list of instances
            or a dict with name,instance pairs. """
        
        # TODO, make sure that you cannot overwrite an existing parameter
        param_type = type(reacs).__name__
        if param_type == 'list':
            for r in reacs:
                self.listOfReactions[r.name] = r
        elif param_type == 'dict' or param_type == 'OrderedDict':
            self.listOfReactions = reacs
        elif param_type == 'instance':
                self.listOfReactions[reacs.name] = reacs
        else:
            raise

    def getReaction(self, rname):
        return reactions[rname]

    def getAllReactions(self):
        return self.listOfReactions
    
    def deleteReaction(self, obj):
        self.listOfReactions.pop(obj)
        
    def deleteAllReactions(self):
        self.listOfReactions.clear()

    def _cmp_(self,other):
        """ Compare """

    

class Species():
    """ Chemical species. """
    
    def __init__(self,name="",initial_value=0):
        # A species has a name (string) and an initial value (positive integer)
        self.name = name
        self.initial_value = initial_value
        assert self.initial_value >= 0, "A species initial value has to be a positive number."

            #def __eq__(self,other):
#  return self.__dict__ == other.__dict__

class Parameter():
    """ 
        A parameter can be given as an expression (function) or directly as a value (scalar).
        If given an expression, it should be understood as evaluable in the namespace
        of a parent Model.
    """
    # AH: Should the parameter, being evaluable, be implemented as a Functor object?

    def __init__(self,name="",expression=None,value=None):

        self.name = name        
        # We allow expression to be passed in as a non-string type. Invalid strings
        # will be caught below. It is perfectly fine to give a scalar value as the expression.
        # This can then be evaluated in an empty namespace to the scalar value.
        self.expression = expression
        if expression != None:
            self.expression = str(expression)
        
        self.value = value
            
        # self.value is allowed to be None, but not self.expression. self.value
        # might not be evaluable in the namespace of this parameter, but defined
        # in the context of a model or reaction.
        if self.expression == None:
            raise TypeError
    
        if self.value == None:
            self.evaluate()
    
    def evaluate(self,namespace={}):
        """ Evaluate the expression and return the (scalar) value """
        try:
            self.value = (float(eval(self.expression, namespace)))
        except:
            self.value = None
            
    def setExpression(self,expression):
        self.expression = expression
        # We allow expression to be passed in as a non-string type. Invalid strings
        # will be caught below. It is perfectly fine to give a scalar value as the expression.
        # This can then be evaluated in an empty namespace to the scalar value.
        if expression != None:
            self.expression = str(expression)
                    
        if self.expression == None:
            raise TypeError
    
        self.evaluate()

class Reaction():
    """ 
        Models a reaction. A reaction has its own dictinaries of species (reactants and products) and parameters.
        The reaction's propensity function needs to be evaluable (and result in a non-negative scalar value)
        in the namespace defined by the union of those dicts.
    """

    def __init__(self, name = "", reactants = {}, products = {}, propensity_function = None, massaction = False, rate=None, annotation=None):
        """ 
            Initializes the reaction using short-hand notation. 
            
            Input: 
                name:                       string that the model is referenced by
                parameters:                 a list of parameter instances
                propensity_function:         string with the expression for the reaction's propensity
                reactants:                  List of (species,stoiciometry) tuples
                products:                    List of (species,stoiciometry) tuples
                annotation:                 Description of the reaction (meta)
            
                massaction True,{False}     is the reaction of mass action type or not?
                rate                        if mass action, rate is a paramter instance.
            
            Raises: ReactionError
            
        """
            
        # Metadata
        self.name = name
        self.annotation = ""
        
        # We might use this flag in the future to automatically generate
        # the propensity function if set to True. 
        self.massaction = massaction

        self.propensity_function = propensity_function
        if self.propensity_function !=None and self.massaction:
            errmsg = "Reaction "+self.name +" You cannot set the propensity type to mass-action and simultaneously set a propensity function."
            raise ReactionError(errmsg)
        
        self.reactants = {}
        for r in reactants:
            rtype = type(r).__name__
            if rtype=='instance':
                self.reactants[r.name] = reactants[r]
            else:
                self.reactants[r]=reactants[r]
    
        self.products = {}
        for p in products:
            rtype = type(p).__name__
            if rtype=='instance':
                self.products[p.name] = products[p]
            else:
                self.products[p]=products[p]

        if self.massaction:
            self.type = "mass-action"
            if rate == None:
                raise ReactionError("Reaction : A mass-action propensity has to have a rate.")
            self.marate = rate
            self.createMassAction()
        else:
            self.type = "customized"
                
    def createMassAction(self):
        """ 
            Create a mass action propensity function given
            self.reactants and a single parameter value.
        """
        # We support zeroth, first and second order propensities only.
        # There is no theoretical justification for higher order propensities.
        # Users can still create such propensities if they really want to,
        # but should then use a custom propensity.
        total_stoch=0
        for r in self.reactants:
            total_stoch+=self.reactants[r]
        if total_stoch>2:
            raise ReactionError("Reaction: A mass-action reaction cannot involve more than two of one species or one of two species.")
        # Case EmptySet -> Y
        propensity_function = self.marate.name;
             
        # There are only three ways to get 'total_stoch==2':
        for r in self.reactants:
            # Case 1: 2X -> Y
            if self.reactants[r] == 2:
                propensity_function = "0.5*" +propensity_function+ "*"+r+"*("+r+"-1)"
            else:
            # Case 3: X1, X2 -> Y;
                propensity_function += "*"+r

        self.propensity_function = propensity_function
            
    def setType(self,type):
        if type.lower() not in {'mass-action','customized'}:
            raise ReactionError("Invalid reaction type.")
        self.type = type.lower()

        self.massaction = False if self.type == 'customized' else True
    
    def addReactant(self,S,stoichiometry):
        if stoichiometry <= 0:
            raise ReactionError("Reaction Stoichiometry must be a positive integer.")
        self.reactants[S.name]=stoichiometry

    def addProduct(self,S,stoichiometry):
        self.products[S.name]=stoichiometry

    def Annotate(self,annotation):
        self.annotation = annotation

# Module exceptions
class ModelError(Exception):
    pass

class SpeciesError(ModelError):
    pass

class ReactionError(ModelError):
    pass

class ParameterError(ModelError):
    pass
