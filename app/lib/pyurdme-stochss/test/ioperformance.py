#!/usr/bin/env python
""" PyURDME model with one species diffusing in the unit circle and one
    species diffusing on the boundary of the circle. Subdomains are 
    here handled by Dolfin's native subdomain model. """

import dolfin
from pyurdme.pyurdme import *


class MembranePatch(dolfin.SubDomain):
    """ This class defines a Dolfin subdomain. Facets on lower left quadrant of 
        the boundary of the domain will be included. """
    def inside(self,x,on_boundary):
        return on_boundary and x[0] < 0.0 and x[1] < 0.0

class Membrane(dolfin.SubDomain):
    """ This class defines a Dolfin subdomain. Facets on lower left quadrant of
        the boundary of the domain will be included. """
    def inside(self,x,on_boundary):
        return on_boundary

class Cytosol(dolfin.SubDomain):
    """ This class defines a Dolfin subdomain. Facets on lower left quadrant of
        the boundary of the domain will be included. """
    def inside(self,x,on_boundary):
        return not on_boundary


class simple_diffusion2(URDMEModel):
    """ One species diffusing on the boundary of a sphere and one species
        diffusing inside the sphere. """
    
    def __init__(self):
        URDMEModel.__init__(self,name="simple_diffusion2")

        A = Species(name="A",diffusion_constant=1.0,dimension=2)
        B = Species(name="B",diffusion_constant=0.1,dimension=1)

        self.add_species([A,B])

        # A circle
        #c1 = dolfin.Circle(0,0,1)
        c1 = mshr.Circle(dolfin.Point(0,0),1)
        self.mesh = URDMEMesh(mesh=mshr.generate_mesh(c1,20))
        
        # A mesh function for the cells
        cell_function = dolfin.CellFunction("size_t",self.mesh)
        cell_function.set_all(1)
        
        # Create a mesh function over then edges of the mesh
        facet_function = dolfin.FacetFunction("size_t",self.mesh)
        facet_function.set_all(0)
        
        # Mark the boundary points
        membrane = Membrane()
        membrane.mark(facet_function,2)
        
        membrane_patch = MembranePatch()
        membrane_patch.mark(facet_function,3)
        
        self.add_subdomain(cell_function)
        self.add_subdomain(facet_function)
        
        k1 = Parameter(name="k1",expression=1000.0)
        self.add_parameter([k1])
        R1 = Reaction(name="R1",reactants={A:1},products={B:1},massaction=True,rate=k1,restrict_to=3)
        self.add_reaction([R1])
        
        # Restrict species B to the membrane subdomain
        self.restrict(species=B,subdomains=[2,3])
        self.timespan(numpy.linspace(0,1,10))
        
        # Place the A molecules in the voxel nearest to the center of the square
        self.set_initial_condition_place_near({A:1000},point=[0,0])

if __name__ == '__main__':
    import time
    import dill
    """ This model is constructed to be non-stiff but with denser and denser output so that 
        we can measure the peroformace as we become IO/Memory bound. """
    
    model = simple_diffusion2()
    num_dofs = 2*model.mesh.num_vertices()
    print "Output data set size:", str(4*num_dofs*500/1.048e6) + " MB"
    model.timespan(numpy.linspace(0,1,500))

    tic = time.time()
    result = urdme(model,report_level=0)
    print "\t pyurdme took "+str(time.time()-tic)+" s."
    tic = time.time()
    A = result.get_species("A")

    #U = result["U"]
    Asum=numpy.sum(A,axis=1)
    print "\t and accessing the data and aggregating one species took "+str(time.time()-tic)+" s."
    # Get A at a selceted time point
    tic  = time.time()
    A = result.get_species("A",[300])
    #print numpy.sum(A,axis=1)
    print "\t Selecting a single timepoint took "+str(time.time()-tic)+" s."


    print "Output data set size:",str(4*num_dofs*5000/1.024e6) + " MB"
    model.timespan(numpy.linspace(0,1,5000))
    tic = time.time()
    result = urdme(model,report_level=0)
    print "\t pyurdme took "+str(time.time()-tic)+" s."
    tic = time.time()
    # U = result["U"]
    A = result.get_species("A")

    Asum=numpy.sum(A,axis=1)

    print "\t and accessing all timepoints for one species took "+str(time.time()-tic)+" s."
    # Get A at a selceted time point
    tic  = time.time()
    A = result.get_species("A",[4000])
    #print numpy.sum(A,axis=1)
    print "\t Selecting a single timepoint took "+str(time.time()-tic)+" s."



    print "Output data set size:", str(4*num_dofs*50000/1.024e6) + " MB"
    model.timespan(numpy.linspace(0,1,50000))
    tic = time.time()
    result = urdme(model,report_level=0)
    print "\t pyurdme took "+str(time.time()-tic)+" s."
    tic = time.time()
    A = result.get_species("A")
    
    Asum=numpy.sum(A,axis=1)
    print "\t and accessing all timepoints for one species took "+str(time.time()-tic)+" s."
    # Get A at a seleceted time point
    tic  = time.time()
    A = result.get_species("A",[25000])
    #print numpy.sum(A,axis=1)
    print "\t Selecting a single timepoint took "+str(time.time()-tic)+" s."
    with open('testdump.pyb','w') as fh:
        fh.write(dill.dumps(result))

    print "Output data set size:", str(4*num_dofs*500000/2/1.024e6) + " MB"
    model.timespan(numpy.linspace(0,1,500000/2))
    tic = time.time()
    result = urdme(model,report_level=0)
    print "\t pyurdme took "+str(time.time()-tic)+" s."
    tic = time.time()
    #U = result["U"]
    A = result.get_species("A")
    Asum=numpy.sum(A,axis=1)
    print "\t and accessing all timepoints for one species took "+str(time.time()-tic)+" s."

    # Get A at a selceted time point
    tic  = time.time()
    A = result.get_species("A",[100000])
    #print numpy.sum(A,axis=1)
    print "\t Selecting a single timepoint took "+str(time.time()-tic)+" s."
    with open('testdump.pyb','w') as fh:
        fh.write(dill.dumps(result))





