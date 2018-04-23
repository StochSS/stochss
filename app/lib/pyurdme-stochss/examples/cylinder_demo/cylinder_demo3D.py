#!/usr/bin/env python
""" pyURDME model file for the annihilation cylinder 3D example. """

import os
import pyurdme
import dolfin
import mshr

import matplotlib.pyplot as plt
import numpy

# Global Constants
MAX_X_DIM = 5.0
MIN_X_DIM = -5.0
TOL = 1e-9


class Edge1(dolfin.SubDomain):
    def inside(self, x, on_boundary):
        return on_boundary and dolfin.near(x[0], MAX_X_DIM)
class Edge2(dolfin.SubDomain):
    def inside(self, x, on_boundary):
        return on_boundary and dolfin.near(x[0], MIN_X_DIM)

class cylinderDemo3D(pyurdme.URDMEModel):
    def __init__(self, model_name="cylinder_demo3d"):
        pyurdme.URDMEModel.__init__(self, model_name)

        # System constants
        D_const = 0.1
        
        # Define Species
        A = pyurdme.Species(name="A", diffusion_constant=D_const)
        B = pyurdme.Species(name="B", diffusion_constant=D_const)
        self.add_species([A, B])
        
        # Define Geometry
        pt1 = dolfin.Point(MAX_X_DIM, 0, 0)
        pt2 = dolfin.Point(MIN_X_DIM, 0, 0)
        cylinder = mshr.Cylinder(pt1, pt2, 1.0, 1.0)
        self.mesh = pyurdme.URDMEMesh(mesh=mshr.generate_mesh(cylinder, 32))
        
        # Define Subdomains
        self.add_subdomain(Edge1(), 2)
        self.add_subdomain(Edge2(), 3)

        data = self.get_solver_datastructure()
        vol = data['vol']
        sd = data['sd']
        left = numpy.sum(vol[sd == 2])
        right = numpy.sum(vol[sd == 3])
    
        k_react = pyurdme.Parameter(name="k_react", expression=1.0)
        
        k_creat1 = pyurdme.Parameter(name="k_creat1", expression=100/left)
        k_creat2 = pyurdme.Parameter(name="k_creat2", expression=100/right)
        
        self.add_parameter([k_react, k_creat1,k_creat2])

        
        # Define Reactions
        R1 = pyurdme.Reaction(name="R1", reactants=None, products={A:1}, rate=k_creat1, restrict_to=2)
        R2 = pyurdme.Reaction(name="R2", reactants=None, products={B:1}, rate=k_creat2, restrict_to=3)
        R3 = pyurdme.Reaction(name="R3", reactants={A:1, B:1}, products=None, rate=k_react)
        self.add_reaction([R1, R2, R3])

        # Define simulation timespan
        self.timespan(range(200))



if __name__ == "__main__":
    
    model = cylinderDemo3D()
    result = pyurdme.urdme(model, report_level=1)
    
    # This line here dumps the state of A at all timepoints to Paraview comaptible output (VTK). The trajectory
    # is written to a folder "Aout", where each snapshot is stored in a separate file. To open the "movie",
    # just open Aout/trajectory.pvd, then you can animate etc.
    if not os.path.isdir('Aout'):
        print "Writing species 'A' to folder 'Aout' in VTK format"
        result.export_to_vtk(species='A',folder_name="Aout")
    if not os.path.isdir('Bout'):
        print "Writing species 'B' to folder 'Bout' in VTK format"
        result.export_to_vtk(species='B',folder_name="Bout")

    if not os.path.isdir('csv_out'):
        print "Writing trajectory data in CSV format"
        result.export_to_csv(folder_name="csv_out")

    # Plot of the time-average spatial concentration.
    x_vals = model.mesh.coordinates()[:, 0]
    A_vals = numpy.sum(result.get_species("A", concentration=True), axis=0)
    B_vals = numpy.sum(result.get_species("B", concentration=True), axis=0)

    A_sum = numpy.sum(result.get_species("A"), axis=1)
    B_sum = numpy.sum(result.get_species("B"), axis=1)
    print A_sum
    print B_sum
    data = model.get_solver_datastructure()
    vol = data['vol']
    sd = data['sd']
    print numpy.sum(vol[sd == 2])
    print numpy.sum(vol[sd == 3])


    plt.plot(x_vals,A_vals,'.r',x_vals,B_vals,'.b')
    plt.legend(['A', 'B'])
    plt.show()
