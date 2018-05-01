#!/usr/bin/env python
""" pyURDME model file for the model found in Lawson et al. PloS Comp Bio (2013). """

import os
import pyurdme
import dolfin
import math

import matplotlib.pyplot as plt
import numpy


class Cdc42(pyurdme.URDMEDataFunction):
    def __init__(self, a=-4*numpy.pi, b=4*numpy.pi, N=160):
        """ 1D domain from a to b. """
        pyurdme.URDMEDataFunction.__init__(self, name="Cdc42")
        self.a = a
        self.b = b
        self.N = N

    def map(self, x):
        #ligand_c[i] = 100*Gradient_max*exp( (-1*pow((i-floor(N/2))*360.0/N,2))/(2*pow(Gradient_sigma,2))  );
        #  x[0] == i*l
        Gradient_max = 3.0*160/self.N
        Gradient_max = Gradient_max*0.7917
        Gradient_sigma = 20.3837
        return 100*Gradient_max*numpy.exp( 
                -1*((x[0]*(360)/(self.b - self.a))**2) / (2*Gradient_sigma**2)
            )


class polarisome_1D(pyurdme.URDMEModel):

    def __init__(self,model_name="polarisome_1D"):
        pyurdme.URDMEModel.__init__(self,model_name)

        default_D = 0.0053
        fast_D = 1000*default_D
        # Species
        Bni1c = pyurdme.Species(name="Bni1c",  diffusion_constant=fast_D)
        Bni1m = pyurdme.Species(name="Bni1m",  diffusion_constant=default_D)
        Spa2c = pyurdme.Species(name="Spa2c",  diffusion_constant=fast_D)
        Spa2m = pyurdme.Species(name="Spa2m",  diffusion_constant=default_D)
        Actinc = pyurdme.Species(name="Actinc",  diffusion_constant=fast_D)
        Actinm = pyurdme.Species(name="Actinm",  diffusion_constant=default_D)
        self.add_species([Bni1c, Bni1m, Spa2c, Spa2m, Actinc, Actinm])
    
        NUM_VOXEL = 160
        self.mesh = pyurdme.URDMEMesh.generate_interval_mesh(nx=NUM_VOXEL, a=-4*numpy.pi, b=4*numpy.pi, periodic=True)

        Bon = pyurdme.Parameter(name="Bon", expression=1.6e-6)
        Boff = pyurdme.Parameter(name="Boff", expression=0.25)
        Bfb = pyurdme.Parameter(name="Bfb", expression=1.9e-5)
        Aon = pyurdme.Parameter(name="Aon", expression=7.7e-5)
        Aoff = pyurdme.Parameter(name="Aoff", expression=0.018)
        Km = pyurdme.Parameter(name="Km", expression=3500)
        Son = pyurdme.Parameter(name="Son", expression=0.16)
        Soff = pyurdme.Parameter(name="Soff", expression=0.35)
        self.add_parameter([Bon, Boff, Bfb, Aon, Aoff, Km, Son, Soff]) 

        # Add Data Function to model the mating pheromone gradient.
        self.add_data_function(Cdc42())

        # Reactions
        R0 = pyurdme.Reaction(name="R0", reactants={Bni1c:1}, products={Bni1m:1}, propensity_function="Bon*Bni1c*NUM_VOXELS*Cdc42")
        R1 = pyurdme.Reaction(name="R1", reactants={Bni1m:1}, products={Bni1c:1}, massaction=True, rate=Boff)
        R2 = pyurdme.Reaction(name="R2", reactants={Actinc:1}, products={Actinm:1}, propensity_function="Aon*Bni1m*Actinc*NUM_VOXELS")
        R3 = pyurdme.Reaction(name="R3", reactants={Actinm:1}, products={Actinc:1}, propensity_function="Aoff*Km/(Km+Spa2m)*Actinm")
        R4 = pyurdme.Reaction(name="R4", reactants={Spa2c:1}, products={Spa2m:1}, propensity_function="Son*Spa2c*NUM_VOXELS*Actinm")
        R5 = pyurdme.Reaction(name="R5", reactants={Spa2m:1}, products={Spa2c:1}, massaction=True, rate=Soff)
        R6 = pyurdme.Reaction(name="R6", reactants={Bni1c:1}, products={Bni1m:1}, propensity_function="Bfb*Bni1c*NUM_VOXELS*Spa2m")
        self.add_reaction([R0,R1,R2,R3,R4,R5,R6])
        
        # Distribute molecules randomly over the mesh according to their initial values
        self.set_initial_condition_scatter({Bni1c:1000})
        self.set_initial_condition_scatter({Spa2c:5000})
        self.set_initial_condition_scatter({Actinc:40})

        #self.timespan(range(0,3601,30))
        self.timespan(range(0,201,10))


if __name__=="__main__":
    """ Dump model to a file. """
                     
    model = polarisome_1D()
    result = model.run()

    x_vals = model.mesh.coordinates()[:, 0]
    Bni1 = result.get_species("Bni1m", timepoints=20)
    Spa2 = result.get_species("Spa2m", timepoints=20)
    plt.plot(x_vals, Spa2)
    plt.title('Spa2_m at t={0}'.format(model.tspan[20]))
    plt.show()
