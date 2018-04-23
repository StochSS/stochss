#!/usr/bin/env python
from cylinder_demo3D import cylinderDemo3D
from pyurdme.nsmsolver import NSMSolver
import matplotlib.pyplot as plt
import numpy

# Create the model and solver
model = cylinderDemo3D()
sol = NSMSolver(model, report_level=2)
print "Beginning simulation"
#result = sol.run()
#results = [result]
results = sol.run(4)

# Plot of the time-average spatial concentration.
x_vals = model.mesh.coordinates()[:, 0]
l = x_vals.shape[0]
plt.clf()
plt.figure(1)
for ndx, res in enumerate(results):
    print "result.filename={0} loaded={1}".format(res.filename, res.data_is_loaded)
    plt.subplot(2,2,ndx)
    A_vals = numpy.mean(res.get_species("A", concentration=True), axis=0)
    B_vals = numpy.mean(res.get_species("B", concentration=True), axis=0)
    plt.plot(x_vals,A_vals,'.r',x_vals,B_vals,'.b')
    plt.legend(['A', 'B'])
plt.show()

