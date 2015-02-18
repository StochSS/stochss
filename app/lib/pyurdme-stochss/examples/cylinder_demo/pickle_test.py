#!/usr/bin/env python
from cylinder_demo3D import cylinderDemo3D
from pyurdme.nsmsolver import NSMSolver
import matplotlib.pyplot as plt
import numpy
import pickle

# Create the model and solver
model = cylinderDemo3D()
sol = NSMSolver(model)
#pickle.dump(sol, open('cylinderDemo3D_NSM.pkl', 'wb'))
sol_str = pickle.dumps(sol)

# This could be on a difference python instance
# sol2 = pickle.load(open('cylinderDemo3D_NSM.pkl'))
sol2 = pickle.loads(sol_str)
result2 = sol2.run()
result_str = pickle.dumps(result2)

# This is back on the original python context
result = pickle.loads(result_str)

# plot the result to be sure it is correct
#print result

if False:
    # This line here dumps the state of A at all timepoints to Paraview comaptible output (VTK). The trajectory
    # is written to a folder "Aout", where each snapshot is stored in a separate file. To open the "movie",
    # just open Aout/trajectory.pvd, then you can animate etc.
    result.export_to_vtk(species='A',folder_name="Aout")
    result.export_to_vtk(species='B',folder_name="Bout")

if True:
    # Plot of the time-average spatial concentration.
    x_vals = model.mesh.coordinates()[:, 0]
    A_vals = numpy.mean(result.get_species("A", concentration=True), axis=0)
    B_vals = numpy.mean(result.get_species("B", concentration=True), axis=0)
    plt.plot(x_vals,A_vals,'.r',x_vals,B_vals,'.b')
    plt.legend(['A', 'B'])
    plt.show()


