""" Well mixed (StochKit2) example models for StochSS. """
import os
from model import *
from stochkit import *

def dimerdecay(model_name=""):
    """ 
        Dimerdecay. Tests basic functionality and support for the 
        'mass-action' propensity function flag. 
    """
    if model_name == "":
        model_name = "dimerdecay"
    model = StochKitModel(name=model_name);

    # Species
    S1 = Species(name="S1",initial_value=10000);
    S2 = Species(name="S2",initial_value=0);
    S3 = Species(name="S3",initial_value=0);
 
    model.addSpecies([S1,S2,S3])

    # Parameters
    c1 = Parameter(name="c1",expression=1.0)
    c2 = Parameter(name="c2",expression=0.002)
    c3 = Parameter(name="c3",expression=0.5)
    c4 = Parameter(name="c4",expression=0.04)
    
    model.addParameter([c1,c2,c3,c4])
    
    # Reactions
    R1 = Reaction(name="R1",reactants={S1:1},massaction=True,rate=c1)
    R2 = Reaction(name="R2",reactants={S1:2},products={S2:1},massaction=True,rate=c2)
    R3 = Reaction(name="R3",reactants={S2:1},products={S1:2},massaction=True,rate=c3);
    R4 = Reaction(name="R4",reactants={S2:1},products={S3:1},massaction=True,rate=c4)
    
    model.addReaction([R1,R2,R3,R4])
    
    return model

def MichaelisMenten(model_name=""):
    """ 
        A simple Michaelis-Menten model. Tests parameters defined as a function of other parameters,
        and the 'custom' propensity function type.
    """

    if model_name == "":
        model_name = "michaelismenten"
    model = StochKitModel(name=model_name)

    # Species
    S = Species(name="S",initial_value=0)
    P = Species(name="P",initial_value=0)
    
    model.addSpecies([S,P])

    # Parameters
    mu   = Parameter(name="mu",expression=10)
    k1   = Parameter(name="k1",expression=0.1)
    k2   = Parameter(name="k2",expression=10)
    k3   = Parameter(name="k3",expression=1)
    Etot = Parameter(name="Etot",expression=10)
    Vmax = Parameter(name="Vmax",expression='k3*Etot')
    Km   = Parameter(name="Km",expression='(k2+k3)/k1')

    model.addParameter([mu,k1,k2,k3,Etot,Vmax,Km])
    
    # Reactions
    R1 = Reaction(name="R1", reactants={S:1}, products={P:1}, propensity_function="Vmax*S/(Km+S)",annotation="S->P")
    R2 = Reaction(name="R2", reactants={P:1}, propensity_function="k3*P", annotation="P->0")
    R3 = Reaction(name="R3", products={S:1}, propensity_function="mu",annotation="EmptySet->S")


    model.addReaction([R1,R2,R3])
    
    return model

if __name__ == '__main__':
    """ Create a model and print it to StochML. """
    model = MichaelisMenten()
    doc=model.serialize()
    print doc

    
