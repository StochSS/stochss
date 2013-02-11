""" Module that describes a well mixed model biochemical models. """
from collections import OrderedDict

class Model():
    """ Representation of a well mixed model. """
    
    def __init__(self,name="",volume=1.0):
        """ Create an empty model. """
        
        # The name that the model is referenced by (String)
        self.name = name
        
        # Decription of the model (string)
        self.annotation = ""
        
        # Dictionaries with Species, Reactions and Parameter objects.
        # Names are used as keys.
        self.listOfParameters = OrderedDict()
        self.listOfSpecies    = OrderedDict()
        self.listOfReactions  = OrderedDict()
        
        # A well mixed model has a volume paramteter
        self.volume = volume;
        
        # This dict holds flattended parameters and species for
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
            Add a species to listOfSpecies. 
            Accepts input either as a single Species object, or
            as a list of Species objects.
        """
        # TODO, make sure that you don't overwrite an existing species
        if isinstance(obj, Species):
            self.listOfSpecies[obj.name] = obj;
        else: # obj is a list of species
            for S in obj:
                self.listOfSpecies[S.name] = S;
    
    def deleteSpecies(self, obj):
        self.listOfSpecies.pop(obj)        
         
    def deleteAllSpecies(self):
        self.listOfSpecies.clear()

    def getParameter(self,pname):
        return listOfParameters[pname]
    
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
        p.value = expression
    
    def deleteAllParameters(self):
        self.listOfParameters.clear()

    def addReaction(self,reacs):
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
    """ Models a chemical species. """
    
    def __init__(self,name="",initial_value=0):
        self.name = name
        self.initial_value = initial_value

# TODO: Should the parameter, being evaluable, be implemented as a Functor object?
class Parameter():
    """ 
        A parameter can be given as an expression (function) or directly as a value (scalar).
        If given an expression, it should be understood as evaluable in the namespace
        of a parent Model.
    """
    
    
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

class Reaction():
    """ 
        Models a reaction. A reaction has its own dictinaries
        of species (reactants and products) and parameters.
        The reaction's propensity function needs to be
        evaluable (and result in a non-negative scalar value)
        in the namespace defined by the union of those dicts.
         
    """

    def __init__(self, name = "", reactants = {}, products = {}, propensity_function = None, massaction = False, rate=None, annotation=None):
        """ 
            Initializes the reaction using short-hand notation. 
            
            Input: 
                name:                       string that the model is referenced by
                parameters:                 a list of parmeter instances
                propensity_function:         string with the expression for the reaction's propensity
                reactants:                  List of (species,stoiciometry) tuples
                product:                    List of (species,stoiciometry) tuples
                annotation:                 Description of the reaction (meta)
            
                massaction True,{False}     is the reaction of mass action type or not?
                rate                        if mass action, rate is a reference to a paramter onbject.
            
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
                raise ReactionError("Reaction "+self.name +": A mass-action propensity has to have a rate.")
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
            raise ReactionError("Reaction: " +self.name + "A mass action reaction cannot involve more than two molecules.")
    
        
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
        if type not in {'mass-action','customized'}:
            raise ReactionError("Invalid reaction type.")
        self.type = type
    
    def addReactant(self,S,stoichiometry):
        if stoichiometry <= 0:
            raise ReactionError("Reaction "+self.name+"Stoichiometry must be a positive integer.")
        self.reactants[S.name]=stoichiometry

    def addProduct(self,S,stoichiometry):
        self.products[S.name]=stoichiometry

    def Annotate(self,annotation):
        self.annotation = annotation

# Module exceptions
class ReactionError(Exception):
    pass
