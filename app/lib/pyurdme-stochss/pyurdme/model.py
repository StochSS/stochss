""" 
    This module defines a model of a well mixed biochemical reaction network.
    
"""
import uuid
from collections import OrderedDict


class Model():
    """ Representation of a well mixed biochemical model. Interfaces to solvers in StochSS
        should attempt to extend Model. """
    
    def __init__(self, name="", volume=1.0):
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
        
        # A well mixed model has an optional volume parameter
        self.volume = volume;
        
        # Dict that holds flattended parameters and species for
        # evaluation of expressions in the scope of the model.
        self.namespace = OrderedDict([])

    def update_namespace(self):
        """ Create a dict with flattened parameter and species objects. """
        
        for param in self.listOfParameters:
            self.namespace[param]=self.listOfParameters[param].value
        # Dictionary of expressions that can be evaluated in the scope of this model.
        self.expressions = {}
    
    def get_species(self, sname):
        return self.listOfSpecies[sname]
    
    def get_num_species(self):
        return len(self.listOfSpecies)
    
    def get_all_species(self):
        return self.listOfSpecies

    def add_species(self, obj):
        """ 
            Add a Species to listOfSpecies. Accepts input either as a single Species object, or
            as a list of Species objects.
        """
        if isinstance(obj, Species):
            if obj.name in self.listOfSpecies:
                raise ModelError("Can't add species. A species with that name already exists.")
            self.listOfSpecies[obj.name] = obj;
        else: # obj is a list of species
            for S in obj:
                if S.name in self.listOfSpecies:
                    raise ModelError("Can't add species. A species with that name already exists.")
                self.listOfSpecies[S.name] = S;

    def delete_species(self, obj):
        """ Remove a Species from model.listOfSpecies. """
        self.listOfSpecies.pop(obj)        
         
    def delete_all_species(self):
        self.listOfSpecies.clear()

    def get_parameter(self,pname):
        try:
            return self.listOfParameters[pname]
        except:
            raise ModelError("No parameter named "+pname)

    def get_all_parameters(self):
        return self.listOfParameters
    
    def add_parameter(self,params):
        """ Add Parameter(s) to model.listOfParameters. Input can be either a single
            Parameter object or a list of Parameter objects.
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

    def delete_parameter(self, obj):
        self.listOfParameters.pop(obj)

    def set_parameter(self,pname,expression):
        """ Set the expression of an existing paramter. """
        p = self.listOfParameters[pname]
        p.expression = expression
        p.evaluate()
        
    def resolve_parameters(self):
        """ Attempt to resolve all parameter expressions to scalar floating point values. 
            Must be called prior to exporting the model.  """
        self.update_namespace()
        for param in self.listOfParameters:
            try:
                self.listOfParameters[param].evaluate(self.namespace)
            except:
                raise ParameterError("Could not resolve Parameter expression "+param + "to a scalar value.")
    
    def delete_all_parameters(self):
        self.listOfParameters.clear()

    def add_reaction(self,reacs):
        """ Add Reaction(s) to the model. Input can be single instance, a list of instances
            or a dict with name,instance pairs. """
        
        # TODO, make sure that you cannot overwrite an existing parameter
        param_type = type(reacs).__name__
        if param_type == 'list':
            for r in reacs:
                if r.name is None or r.name == "":
                    r.name = 'rxn' + str(uuid.uuid4()).replace('-', '_')
                self.listOfReactions[r.name] = r
        elif param_type == 'dict' or param_type == 'OrderedDict':
            self.listOfReactions = reacs
        elif param_type == 'instance':
                if reacs.name is None or reacs.name == "":
                    reacs.name = 'rxn' + str(uuid.uuid4()).replace('-', '_')
                self.listOfReactions[reacs.name] = reacs
        else:
            raise

    def get_reaction(self, rname):
        return reactions[rname]

    def get_num_reactions(self):
        return len(self.listOfReactions)

    def get_all_reactions(self):
        return self.listOfReactions
    
    def delete_reaction(self, obj):
        self.listOfReactions.pop(obj)
        
    def delete_all_reactions(self):
        self.listOfReactions.clear()

    def __ne__(self, other):
        return not self.__eq__(other)

    def __eq__(self, other):
        return (self.listOfParameters == other.listOfParameters and \
            self.listOfSpecies == other.listOfSpecies and \
            self.listOfReactions == other.listOfReactions and \
            self.name == other.name)


class Species():
    """ Model of a biochemical species. """
    
    def __init__(self,name="",diffusion_constant=None,reaction_radius=None,dimension=3):
        # A species has a name (string) and an initial value (positive integer)
        self.name = name
        self.dimension=dimension
        self.diffusion_constant=diffusion_constant
        self.reaction_radius=reaction_radius

    def dim(self):
        return self.dimension

    def __str__(self):
        return self.name

class Parameter():
    """ 
        Model of a rate paramter. 
        A parameter can be given as a String expression (function) or directly as a scalar value.
        If given a String expression, it should be evaluable in the namespace of a parent Model.
        
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
            
    def set_expression(self,expression):
        self.expression = expression
        # We allow expression to be passed in as a non-string type. Invalid strings
        # will be caught below. It is perfectly fine to give a scalar value as the expression.
        # This can then be evaluated in an empty namespace to the scalar value.
        if expression != None:
            self.expression = str(expression)
                    
        if self.expression == None:
            raise TypeError
    
        self.evaluate()
        
    def __str__(self):
        return str(self.value)
        

class Reaction():
    """ 
        Models a biochemical reaction. A reaction conatains dictinaries of species (reactants and products) and parameters.
        The reaction's propensity function needs to be evaluable and result in a non-negative scalar value
        in the namespace defined by the union of its Reactant, Product and Parameter dictionaries.
        
    """

    def __init__(self, name = "", reactants = {}, products = {}, propensity_function=None, massaction=None, rate=None, annotation=None,restrict_to=None):
        """ 
            Initializes the reaction using short-hand notation. 
            
            Input: 
                name:                       string that the model is referenced by
                parameters:                 a list of parameter instances
                propensity_function:        String with the expression for the reaction's propensity
                reactants:                  List of (species,stoichiometry) tuples
                product:                    List of (species,stoichiometry) tuples
                annotation:                 Description of the reaction (meta)
            
                massaction True,{False}     is the reaction of mass action type or not?
                rate                        if mass action, rate is a reference to a parameter instance.
            
            If massaction is set to true, propensity_function is not a valid argument. Instead, the 
            propensity function is constructed automatically. For mass-action, zeroth, first and second
            order reactions are supported, appemting to used higher orders will result in an error.
            

            Raises: ReactionError
            
        """
            
        # Metadata
        self.name = name
        self.annotation = ""
        
        self.massaction = massaction

        self.propensity_function = None
        if propensity_function is not None:
            if 'return ' in propensity_function:
                self.propensity_function = propensity_function
            else:
                self.propensity_function = 'return ' +  propensity_function + ';'

        if self.propensity_function is None and self.massaction is None:
            if rate is None:
                errmsg = "Reaction "+self.name +": You must either set the reaction to be mass-action or specifiy a propensity function."
                raise ReactionError(errmsg)
            else:
                # If they don't give us a propensity function and do give a rate, assume mass-action.
                self.massaction = True

        if self.propensity_function is not None and self.massaction:
            errmsg = "Reaction "+self.name +": You cannot set the propensity type to mass-action and simultaneously set a propensity function."
            raise ReactionError(errmsg)
        
        self.reactants = {}
        if reactants is not None:
            for r in reactants:
                rtype = type(r).__name__
                if rtype=='instance':
                    self.reactants[r.name] = reactants[r]
                else:
                    self.reactants[r]=reactants[r]
    
        self.products = {}
        if products is not None:
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
            self.create_mass_action()
        else:
            self.type = "customized"

        self.restrict_to = restrict_to
                
    def create_mass_action(self):
        """ Create a mass action propensity function given self.reactants and a single parameter value.
        """
        # We support zeroth, first and second order propensities only.
        # There is no theoretical justification for higher order propensities.
        # Users can still create such propensities if they really want to,
        # but should then use a custom propensity.
        total_stoch=0
        for r in self.reactants:
            total_stoch+=self.reactants[r]
        if total_stoch>2:
            raise ReactionError("Reaction: " +self.name + "A mass-action reaction cannot involve more than two species.")
    
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

        # Set the volume dependency based on order.
        order = len(self.reactants)
        if order == 2:
            propensity_function += "/vol"
        elif order == 0:
            propensity_function += "*vol"


        self.propensity_function = "return " + propensity_function + ';'
            
    def set_type(self,type):
        if type not in {'mass-action','customized'}:
            raise ReactionError("Invalid reaction type.")
        self.type = type
    
    def add_reactant(self,S,stoichiometry):
        if stoichiometry <= 0:
            raise ReactionError("Reaction "+self.name+"Stoichiometry must be a positive integer.")
        self.reactants[S.name]=stoichiometry

    def add_product(self,S,stoichiometry):
        self.products[S.name]=stoichiometry

    def annotate(self,annotation):
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
