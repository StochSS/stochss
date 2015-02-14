#!/usr/bin/env python
""" pyURDME model file for the polarization 1D example. """

import os
import sys
import pyurdme
import dolfin
import math

import matplotlib.pyplot as plt
import numpy


# Sub domain for Periodic boundary condition
class PeriodicBoundary1D(dolfin.SubDomain):
    def __init__(self, a=0.0, b=1.0):
        """ 1D domain from a to b. """
        dolfin.SubDomain.__init__(self)
        self.a = a
        self.b = b

    def inside(self, x, on_boundary):
        return not bool((dolfin.near(x[0], self.b)) and on_boundary)

    def map(self, x, y):
        if dolfin.near(x[0], self.b):
            y[0] = self.a + (x[0] - self.b)


class PheromoneGradient(pyurdme.URDMEDataFunction):
    def __init__(self, a=0.0, b=1.0, L_min=0, L_max=4, MOLAR=1.0):
        """ 1D domain from a to b. """
        pyurdme.URDMEDataFunction.__init__(self, name="PheromoneGradient")
        self.a = a
        self.b = b
        self.L_min = L_min
        self.L_max = L_max
        self.MOLAR = MOLAR

    def map(self, x):
        ret =  ((self.L_max - self.L_min) * 0.5 * (1 + math.cos(0.5*x[0])) + self.L_min) * self.MOLAR
        return ret


class G_protein_cycle_1D(pyurdme.URDMEModel):

    def __init__(self,model_name="G_protein_cycle_1D"):
        pyurdme.URDMEModel.__init__(self,model_name)

        # Species
        # R RL G Ga Gbg Gd
        R   = pyurdme.Species(name="R",  diffusion_constant=0.01)
        RL  = pyurdme.Species(name="RL", diffusion_constant=0.01)
        G   = pyurdme.Species(name="G",  diffusion_constant=0.01)
        Ga  = pyurdme.Species(name="Ga", diffusion_constant=0.01)
        Gbg = pyurdme.Species(name="Gbg",diffusion_constant=0.01)
        Gd  = pyurdme.Species(name="Gd", diffusion_constant=0.01)
        
        self.add_species([R,RL,G,Ga,Gbg,Gd])
    
        L = 4*3.14159
        NUM_VOXEL = 200
        MOLAR=6.02e-01*((L/NUM_VOXEL)**3)
        self.mesh = pyurdme.URDMEMesh.generate_interval_mesh(nx=NUM_VOXEL, a=-2*3.14159, b=2*3.14159, periodic=True)
        
        SA    = pyurdme.Parameter(name="SA" ,expression=201.056)
        V     = pyurdme.Parameter(name="V" ,expression=33.5)
        k_RL  = pyurdme.Parameter(name="k_RL" ,expression=2e-03/MOLAR)
        k_RLm = pyurdme.Parameter(name="k_RLm" ,expression=1e-02)
        k_Rs  = pyurdme.Parameter(name="k_Rs" ,expression="4.0/SA")
        k_Rd0 = pyurdme.Parameter(name="k_Rd0" ,expression=4e-04)
        k_Rd1 = pyurdme.Parameter(name="k_Rd1" ,expression=4e-04)
        k_G1  = pyurdme.Parameter(name="k_G1" ,expression="1.0*SA")
        k_Ga  = pyurdme.Parameter(name="k_Ga" ,expression="1e-06*SA")
        k_Gd  = pyurdme.Parameter(name="k_Gd" ,expression=0.1)
        self.add_parameter([SA,V,k_RL,k_RLm,k_Rs,k_Rd0,k_Rd1,k_G1,k_Ga,k_Gd]) 

        # Add Data Function to model the mating pheromone gradient.
        self.add_data_function(PheromoneGradient(a=-2*3.14159, b=2*3.14159, MOLAR=MOLAR))

        # Reactions
        R0 = pyurdme.Reaction(name="R0", reactants={}, products={R:1}, massaction=True, rate=k_Rs)
        R1 = pyurdme.Reaction(name="R1", reactants={R:1}, products={}, massaction=True, rate=k_Rd0)
        R2 = pyurdme.Reaction(name="R2", reactants={R:1}, products={RL:1}, propensity_function="k_RL*R*PheromoneGradient/vol")
        R3 = pyurdme.Reaction(name="R3", reactants={RL:1}, products={R:1}, massaction=True, rate=k_RLm)
        R4 = pyurdme.Reaction(name="R4", reactants={RL:1}, products={}, massaction=True, rate=k_RLm)
        R5 = pyurdme.Reaction(name="R5", reactants={G:1}, products={Ga:1, Gbg:1}, propensity_function="k_Ga*RL*G/vol")
        R6 = pyurdme.Reaction(name="R6", reactants={Ga:1}, products={Gd:1}, massaction=True, rate=k_Ga)
        R7 = pyurdme.Reaction(name="R7", reactants={Gd:1, Gbg:1}, products={G:1}, massaction=True, rate=k_G1)
        self.add_reaction([R0,R1,R2,R3,R4,R5,R6,R7])
        
        # Distribute molecules randomly over the mesh according to their initial values
        self.set_initial_condition_scatter({R:10000})
        self.set_initial_condition_scatter({G:10000})

        self.timespan(range(201))


if __name__=="__main__":
    """ Dump model to a file. """
                     
    model = G_protein_cycle_1D()
    result = model.run()

    x_vals = model.mesh.coordinates()[:, 0]
    G = result.get_species("G", timepoints=49)
    Gbg = result.get_species("Gbg", timepoints=49)
    plt.plot(x_vals, Gbg)
    plt.title('Gbg at t=49')
    plt.xlabel('Space')
    plt.ylabel('Number of Molecules')
    plt.show()
