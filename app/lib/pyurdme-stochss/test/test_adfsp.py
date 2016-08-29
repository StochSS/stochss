#!/usr/bin/env python
from pyurdme.adfsp_solver import ADFSPSolver
from examples.cylinder_demo.cylinder_demo3D import cylinderDemo3D
import matplotlib.pyplot as plt
import numpy
import pyurdme
import time

model = cylinderDemo3D()
sol = ADFSPSolver(model, report_level=1, error_tolarance=0.05)
print "Attempting to compile"
sol.compile()
print "Beginning simulation"
t1 = time.time()
result = sol.run()
print "Simulation complete in {0}s".format(time.time()-t1)
print "Plotting solution"
# Plot of the time-average spatial concentration.
x_vals = model.mesh.coordinates()[:, 0]
A_vals = numpy.mean(result.get_species("A", concentration=True), axis=0)
B_vals = numpy.mean(result.get_species("B", concentration=True), axis=0)
plt.plot(x_vals,A_vals,'.r',x_vals,B_vals,'.b')
plt.legend(['A', 'B'])
plt.show()
