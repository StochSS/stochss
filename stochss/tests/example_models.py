'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

import numpy as np

from gillespy2.core import (
    Model,
    Species,
    Reaction,
    Parameter
)

# pylint: disable=line-too-long
# pylint: disable=missing-class-docstring
# pylint: disable=too-few-public-methods
class Brusselator(Model):
    def __init__(self):
        Model.__init__(self, name="Brusselator")
        self.volume = 1000

        # Parameters
        self.add_parameter(Parameter(name="rate1", expression="5000"))
        self.add_parameter(Parameter(name="rate2", expression="50"))
        self.add_parameter(Parameter(name="rate3", expression="5e-05"))
        self.add_parameter(Parameter(name="rate4", expression="5"))

        # Variables
        self.add_species(Species(name="A", initial_value=100000, mode="discrete"))
        self.add_species(Species(name="B", initial_value=100000, mode="discrete"))
        self.add_species(Species(name="C", initial_value=0, mode="discrete"))
        self.add_species(Species(name="D", initial_value=0, mode="discrete"))
        self.add_species(Species(name="X", initial_value=2000, mode="discrete"))
        self.add_species(Species(name="Y", initial_value=1000, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="reaction1", reactants={'A': 1}, products={'X': 1, 'A': 1}, propensity_function="rate1"))
        self.add_reaction(Reaction(name="reaction2", reactants={'B': 1, 'X': 1}, products={'Y': 1, 'C': 1, 'B': 1}, propensity_function="rate2*X"))
        self.add_reaction(Reaction(name="reaction3", reactants={'X': 2, 'Y': 1}, products={'X': 3}, propensity_function="rate3*Y*X*(X-1)/2"))
        self.add_reaction(Reaction(name="reaction4", reactants={'X': 1}, products={'D': 1}, propensity_function="rate4*X"))

        # Timespan
        self.timespan(np.arange(0, 30, 0.01))


class Degradation(Model):
    def __init__(self):
        Model.__init__(self, name="Degradation")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="decayrate", expression="0.05"))

        # Variables
        self.add_species(Species(name="protein", initial_value=50, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="reaction", reactants={'protein': 1}, products={}, rate=self.listOfParameters["decayrate"]))

        # Timespan
        self.timespan(np.arange(0, 100, 1))


class Dimerization(Model):
    def __init__(self):
        Model.__init__(self, name="Dimerization")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="k_c", expression="0.005"))
        self.add_parameter(Parameter(name="k_d", expression="0.08"))

        # Variables
        self.add_species(Species(name="Monomer", initial_value=30, mode="discrete"))
        self.add_species(Species(name="Dimer", initial_value=0, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="r_creation", reactants={'Monomer': 2}, products={'Dimer': 1}, rate=self.listOfParameters["k_c"]))
        self.add_reaction(Reaction(name="r_dissociation", reactants={'Dimer': 1}, products={'Monomer': 2}, rate=self.listOfParameters["k_d"]))

        # Timespan
        self.timespan(np.arange(0, 100, 1))


class LotkavolterraOscillator(Model):
    def __init__(self):
        Model.__init__(self, name="Lotkavolterra_Oscillator")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="k1", expression="0.004"))
        self.add_parameter(Parameter(name="k2", expression="0.5"))
        self.add_parameter(Parameter(name="k3", expression="0.0045"))

        # Variables
        self.add_species(Species(name="R", initial_value=0.0095, mode="continuous"))
        self.add_species(Species(name="W", initial_value=0.008, mode="continuous"))

        # Reactions
        self.add_reaction(Reaction(name="r1", reactants={'R': 1}, products={'R': 2}, rate=self.listOfParameters["k1"]))
        self.add_reaction(Reaction(name="r2", reactants={'R': 1, 'W': 1}, products={'W': 2}, rate=self.listOfParameters["k2"]))
        self.add_reaction(Reaction(name="r3", reactants={'W': 1}, products={}, rate=self.listOfParameters["k3"]))

        # Timespan
        self.timespan(np.arange(0, 9000, 1))


class MichaelisMenten(Model):
    def __init__(self):
        Model.__init__(self, name="Michaelis_Menten")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="rate1", expression="0.0017"))
        self.add_parameter(Parameter(name="rate2", expression="0.5"))
        self.add_parameter(Parameter(name="rate3", expression="0.1"))

        # Variables
        self.add_species(Species(name="A", initial_value=301, mode="discrete"))
        self.add_species(Species(name="B", initial_value=120, mode="discrete"))
        self.add_species(Species(name="C", initial_value=0, mode="discrete"))
        self.add_species(Species(name="D", initial_value=0, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="r1", reactants={'A': 1, 'B': 1}, products={'C': 1}, rate=self.listOfParameters["rate1"]))
        self.add_reaction(Reaction(name="r2", reactants={'C': 1}, products={'A': 1, 'B': 1}, rate=self.listOfParameters["rate2"]))
        self.add_reaction(Reaction(name="r3", reactants={'C': 1}, products={'B': 1, 'D': 1}, rate=self.listOfParameters["rate3"]))

        # Timespan
        self.timespan(np.arange(0, 100, 1))


class Opioid(Model):
    def __init__(self):
        Model.__init__(self, name="Opioid")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="alpha", expression="0.15"))
        self.add_parameter(Parameter(name="epsilon", expression="0.8"))
        self.add_parameter(Parameter(name="beta_p", expression="0.00266"))
        self.add_parameter(Parameter(name="beta_a", expression="0.00094"))
        self.add_parameter(Parameter(name="gamma", expression="0.00744"))
        self.add_parameter(Parameter(name="zeta", expression="0.2"))
        self.add_parameter(Parameter(name="delta", expression="0.1"))
        self.add_parameter(Parameter(name="sigma", expression="0.9"))
        self.add_parameter(Parameter(name="mu", expression="0.00729"))
        self.add_parameter(Parameter(name="mu_prime", expression="0.01159"))

        # Variables
        self.add_species(Species(name="Susceptible", initial_value=200, mode="discrete"))
        self.add_species(Species(name="Prescribed_User", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Addicted", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Rehab", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Natural_Deaths", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Addicted_Deaths", initial_value=0, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="SP", reactants={'Susceptible': 1}, products={'Prescribed_User': 1}, rate=self.listOfParameters["alpha"]))
        self.add_reaction(Reaction(name="SA_a", reactants={'Susceptible': 1}, products={'Addicted': 1}, rate=self.listOfParameters["beta_a"]))
        self.add_reaction(Reaction(name="SA_p", reactants={'Susceptible': 1}, products={'Addicted': 1}, rate=self.listOfParameters["beta_p"]))
        self.add_reaction(Reaction(name="PA", reactants={'Prescribed_User': 1}, products={'Addicted': 1}, rate=self.listOfParameters["gamma"]))
        self.add_reaction(Reaction(name="PS", reactants={'Prescribed_User': 1}, products={'Susceptible': 1}, rate=self.listOfParameters["epsilon"]))
        self.add_reaction(Reaction(name="AR", reactants={'Addicted': 1}, products={'Rehab': 1}, rate=self.listOfParameters["zeta"]))
        self.add_reaction(Reaction(name="RA", reactants={'Rehab': 1}, products={'Addicted': 1}, rate=self.listOfParameters["delta"]))
        self.add_reaction(Reaction(name="RS", reactants={'Rehab': 1}, products={'Susceptible': 1}, rate=self.listOfParameters["sigma"]))
        self.add_reaction(Reaction(name="mu_S", reactants={'Susceptible': 1}, products={'Susceptible': 1, 'Natural_Deaths': 1}, rate=self.listOfParameters["mu"]))
        self.add_reaction(Reaction(name="mu_P", reactants={'Prescribed_User': 1}, products={'Susceptible': 1, 'Natural_Deaths': 1}, rate=self.listOfParameters["mu"]))
        self.add_reaction(Reaction(name="mu_R", reactants={'Rehab': 1}, products={'Susceptible': 1, 'Natural_Deaths': 1}, rate=self.listOfParameters["mu"]))
        self.add_reaction(Reaction(name="mu_prime_A", reactants={'Addicted': 1}, products={'Susceptible': 1, 'Addicted_Deaths': 1}, rate=self.listOfParameters["mu_prime"]))

        # Timespan
        self.timespan(np.arange(0, 200, 1))


class Schlogl(Model):
    def __init__(self):
        Model.__init__(self, name="Schlogl")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="k1", expression="1"))
        self.add_parameter(Parameter(name="k2", expression="1"))

        # Variables
        self.add_species(Species(name="s1", initial_value=300, mode="discrete"))
        self.add_species(Species(name="s2", initial_value=300, mode="discrete"))
        self.add_species(Species(name="s3", initial_value=300, mode="discrete"))
        self.add_species(Species(name="s4", initial_value=300, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="r1", reactants={'s1': 1, 's4': 1}, products={'s4': 2}, rate=self.listOfParameters["k1"]))
        self.add_reaction(Reaction(name="r2", reactants={'s2': 1, 's4': 1}, products={'s3': 1}, rate=self.listOfParameters["k2"]))

        # Timespan
        self.timespan(np.arange(0, 100000, 1000))


class ToggleSwitch(Model):
    def __init__(self):
        Model.__init__(self, name="Toggle_Switch")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="alpha1", expression="10"))
        self.add_parameter(Parameter(name="alpha2", expression="10"))
        self.add_parameter(Parameter(name="beta", expression="2"))
        self.add_parameter(Parameter(name="gamma", expression="2"))
        self.add_parameter(Parameter(name="mu", expression="1"))

        # Variables
        self.add_species(Species(name="A", initial_value=2, mode="discrete"))
        self.add_species(Species(name="B", initial_value=2, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="cu", reactants={}, products={'A': 1}, propensity_function="alpha1/(1+pow(B, beta))"))
        self.add_reaction(Reaction(name="cv", reactants={}, products={'B': 1}, propensity_function="alpha2/(1+pow(A, gamma))"))
        self.add_reaction(Reaction(name="du", reactants={'A': 1}, products={}, rate=self.listOfParameters["mu"]))
        self.add_reaction(Reaction(name="dv", reactants={'B': 1}, products={}, rate=self.listOfParameters["mu"]))

        # Timespan
        self.timespan(np.arange(0, 250, 1))


class VilarOscillator(Model):
    def __init__(self):
        Model.__init__(self, name="Vilar_Oscillator")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="alphaA", expression="50"))
        self.add_parameter(Parameter(name="alphaA_prime", expression="500"))
        self.add_parameter(Parameter(name="alphaR", expression="0.01"))
        self.add_parameter(Parameter(name="alphaR_prime", expression="50"))
        self.add_parameter(Parameter(name="betaA", expression="50"))
        self.add_parameter(Parameter(name="betaR", expression="5"))
        self.add_parameter(Parameter(name="deltaMA", expression="10"))
        self.add_parameter(Parameter(name="deltaMR", expression="0.5"))
        self.add_parameter(Parameter(name="deltaA", expression="1"))
        self.add_parameter(Parameter(name="deltaR", expression="0.2"))
        self.add_parameter(Parameter(name="gammaA", expression="1"))
        self.add_parameter(Parameter(name="gammaR", expression="1"))
        self.add_parameter(Parameter(name="gammaC", expression="2"))
        self.add_parameter(Parameter(name="thetaA", expression="50"))
        self.add_parameter(Parameter(name="thetaR", expression="100"))

        # Variables
        self.add_species(Species(name="Da", initial_value=1, mode="discrete"))
        self.add_species(Species(name="Da_prime", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Ma", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Dr", initial_value=1, mode="discrete"))
        self.add_species(Species(name="Dr_prime", initial_value=0, mode="discrete"))
        self.add_species(Species(name="Mr", initial_value=0, mode="discrete"))
        self.add_species(Species(name="C", initial_value=0, mode="discrete"))
        self.add_species(Species(name="A", initial_value=0, mode="discrete"))
        self.add_species(Species(name="R", initial_value=0, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="r1", reactants={'A': 1, 'R': 1}, products={'C': 1}, rate="gammaC"))
        self.add_reaction(Reaction(name="r2", reactants={'A': 1}, products={}, rate="deltaA"))
        self.add_reaction(Reaction(name="r3", reactants={'C': 1}, products={'R': 1}, rate="deltaA"))
        self.add_reaction(Reaction(name="r4", reactants={'R': 1}, products={}, rate="deltaR"))
        self.add_reaction(Reaction(name="r5", reactants={'A': 1, 'Da': 1}, products={'Da_prime': 1}, rate="gammaA"))
        self.add_reaction(Reaction(name="r6", reactants={'Da_prime': 1}, products={'A': 1, 'Da': 1}, rate="thetaA"))
        self.add_reaction(Reaction(name="r7", reactants={'Da': 1}, products={'Da': 1, 'Ma': 1}, rate="alphaA"))
        self.add_reaction(Reaction(name="r8", reactants={'Da_prime': 1}, products={'Da_prime': 1, 'Ma': 1}, rate="alphaA_prime"))
        self.add_reaction(Reaction(name="r9", reactants={'Ma': 1}, products={}, rate="deltaMA"))
        self.add_reaction(Reaction(name="r10", reactants={'Ma': 1}, products={'A': 1, 'Ma': 1}, rate="betaA"))
        self.add_reaction(Reaction(name="r11", reactants={'A': 1, 'Dr': 1}, products={'Dr_prime': 1}, rate="gammaR"))
        self.add_reaction(Reaction(name="r12", reactants={'Dr_prime': 1}, products={'A': 1, 'Dr': 1}, rate="thetaR"))
        self.add_reaction(Reaction(name="r13", reactants={'Dr': 1}, products={'Dr': 1, 'Mr': 1}, rate="alphaR"))
        self.add_reaction(Reaction(name="r14", reactants={'Dr_prime': 1}, products={'Dr_prime': 1, 'Mr': 1}, rate="alphaR_prime"))
        self.add_reaction(Reaction(name="r15", reactants={'Mr': 1}, products={}, rate="deltaMR"))
        self.add_reaction(Reaction(name="r16", reactants={'Mr': 1}, products={'Mr': 1, 'R': 1}, rate="betaR"))

        # Timespan
        self.timespan(np.arange(0, 201, 1))


class Oregonator(Model):
    def __init__(self):
        Model.__init__(self, name="Oregonator")
        self.volume = 1

        # Parameters
        self.add_parameter(Parameter(name="k1", expression="2"))
        self.add_parameter(Parameter(name="k2", expression="0.1"))
        self.add_parameter(Parameter(name="k3", expression="104"))
        self.add_parameter(Parameter(name="k4", expression="4e-07"))
        self.add_parameter(Parameter(name="k5", expression="26"))

        # Variables
        self.add_species(Species(name="F", initial_value=2, mode="continuous"))
        self.add_species(Species(name="A", initial_value=250, mode="continuous"))
        self.add_species(Species(name="B", initial_value=500, mode="continuous"))
        self.add_species(Species(name="C", initial_value=1000, mode="continuous"))
        self.add_species(Species(name="P", initial_value=0, mode="continuous"))

        # Reactions
        self.add_reaction(Reaction(name="reaction1", reactants={'B': 1, 'F': 1}, products={'A': 1, 'F': 1}, rate=self.listOfParameters["k1"]))
        self.add_reaction(Reaction(name="reaction2", reactants={'A': 1, 'B': 1}, products={'P': 1}, rate=self.listOfParameters["k2"]))
        self.add_reaction(Reaction(name="reaction3", reactants={'A': 1, 'F': 1}, products={'A': 2, 'C': 1, 'F': 1}, rate=self.listOfParameters["k3"]))
        self.add_reaction(Reaction(name="reaction4", reactants={'A': 2}, products={'P': 1}, rate=self.listOfParameters["k4"]))
        self.add_reaction(Reaction(name="reaction5", reactants={'C': 1, 'F': 1}, products={'B': 1, 'F': 1}, rate=self.listOfParameters["k5"]))

        # Timespan
        self.timespan(np.arange(0, 5, 0.1))


class TysonOscillator(Model):
    def __init__(self):
        Model.__init__(self, name="Tyson_Oscillator")
        self.volume = 300

        # Parameters
        self.add_parameter(Parameter(name="P", expression="2"))
        self.add_parameter(Parameter(name="kt", expression="20"))
        self.add_parameter(Parameter(name="kd", expression="1"))
        self.add_parameter(Parameter(name="a0", expression="0.005"))
        self.add_parameter(Parameter(name="a1", expression="0.05"))
        self.add_parameter(Parameter(name="a2", expression="0.1"))
        self.add_parameter(Parameter(name="kdx", expression="1"))

        # Variables
        self.add_species(Species(name="X", initial_value=197, mode="discrete"))
        self.add_species(Species(name="Y", initial_value=255, mode="discrete"))

        # Reactions
        self.add_reaction(Reaction(name="rxn1", reactants={}, products={'X': 1}, propensity_function="vol*1/(1+(Y*Y/((vol*vol))))"))
        self.add_reaction(Reaction(name="rxn2", reactants={'X': 1}, products={}, rate=self.listOfParameters["kdx"]))
        self.add_reaction(Reaction(name="rxn3", reactants={'X': 1}, products={'X': 1, 'Y': 1}, rate=self.listOfParameters["kt"]))
        self.add_reaction(Reaction(name="rxn4", reactants={'Y': 1}, products={}, rate=self.listOfParameters["kd"]))
        self.add_reaction(Reaction(name="rxn5", reactants={'Y': 1}, products={}, propensity_function="Y/(a0 + a1*(Y/vol)+a2*Y*Y/(vol*vol))"))

        # Timespan
        self.timespan(np.arange(0, 100, 1))
