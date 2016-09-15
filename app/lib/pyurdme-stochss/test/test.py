#!/usr/bin/env python
import pyurdme
import pyurdme.nsmsolver
import scipy.fftpack

import numpy
import pickle
import unittest

class SimpleDiffusion(pyurdme.URDMEModel):
    """ Initial condition is a delta function at the center voxel.
        The solution should be a Gaussian, up to the point where
        the BC becomes important. """
    def __init__(self, diffusion_constant=0.01):
        pyurdme.URDMEModel.__init__(self,name="simple_diffusion")
        A = pyurdme.Species(name="A",diffusion_constant=diffusion_constant,dimension=2)
        self.add_species([A])
        # A unit square
        self.mesh = pyurdme.URDMEMesh.generate_unit_square_mesh(10,10)
        # Place the A molecules in the voxel nearest the center of the square
        #self.set_initial_condition_place_near({A:10000},point=[0.5,0.5])
        self.set_initial_condition_scatter({A:10000})
        self.timespan(numpy.linspace(0,5,200))


class testPeriodicDiffusion(pyurdme.URDMEModel):
    def __init__(self):
        pyurdme.URDMEModel.__init__(self,"test1D")
        X = pyurdme.Species(name="X",  diffusion_constant=0.001)
        self.add_species([X])
        self.mesh = pyurdme.URDMEMesh.generate_unit_interval_mesh(nx=100, periodic=True)
        self.set_initial_condition_place_near({X:1000}, 0.1)
        self.timespan(range(10))


class TestSolverFunctionality(unittest.TestCase):

    def setUp(self):
        self.model = SimpleDiffusion()
        self.periodic_model = testPeriodicDiffusion()
    
    def test_solver_io(self):
        """ Test that the initial value in the solver output file is the same as the input initial value. """
        model = SimpleDiffusion()
        result = model.run()
        A = result.get_species("A",0)
        self.assertFalse((A-model.u0).any())
    
    def test_no_events(self):
        """ Test that nothing happens if the diffusion is set to zero. """
        model = SimpleDiffusion(diffusion_constant = 0.0)
        result = model.run()
        A = result.get_species("A", -1)
        self.assertFalse((A - model.u0).any())
    
    def test_same_seed(self):
        """ Test that the output is the same if the same seed is used, edxplicit solver creation  """
        solver = pyurdme.nsmsolver.NSMSolver(self.model)
        result1 = solver.run(seed=1)
        result2 = solver.run(seed=1)
        self.assertEqual(result1,result2)
    
    def test_same_seed2(self):
        """ Test that the output is the same if the same seed is used, use model.run()  """
        result1 = self.model.run(seed=1)
        result2 = self.model.run(seed=1)
        self.assertEqual(result1,result2)
    
    def test_different_seeds(self):
        """ Test that the output is different if different seeds are used. """
        solver = pyurdme.nsmsolver.NSMSolver(self.model)
        result1 = solver.run(seed=1)
        result2 = solver.run(seed=100)
        self.assertNotEqual(result1,result2)

    def test_default_seed(self):
        """ Test that the output is different if no seed is given (default set on C level). """
        solver = pyurdme.nsmsolver.NSMSolver(self.model)
        result1 = solver.run()
        result2 = solver.run()
        self.assertNotEqual(result1,result2)

    def test_mesh_pickle(self):
        meshstr = pickle.dumps(self.model.mesh)
        mesh = pickle.loads(meshstr)


    def test_model_pickle(self):
        """ Test that the model is picklable. We do not compare models directly, but rather the results after simulation. """
        model = self.model
        model_str = pickle.dumps(model)
        model2 = pickle.loads(model_str)
        result1 = model.run(seed=1)
        result2 = model2.run(seed=1)
        self.assertEqual(result1,result2)

    def test_solver_pickle(self):
        """ Test that the model, solver and result objects are pickleable. """
        sol = pyurdme.nsmsolver.NSMSolver(self.model)
        sol_str = pickle.dumps(sol)
        sol2 = pickle.loads(sol_str)
        result1 = sol.run(seed=1)
        result2 = sol2.run(seed=1)
        self.assertEqual(result1,result2)

    def test_result_pickle(self):
        """ Test that the result object is picklable. """
        sol = pyurdme.nsmsolver.NSMSolver(self.model)
        result = sol.run(seed=1)
        result_str = pickle.dumps(result)
        result2 = pickle.loads(result_str)
        self.assertEqual(result,result2)

    def test_run_ensemble(self):
        """ Test the running of ensembles of runs """
        result_list = self.model.run(3)
        self.assertEqual(len(result_list), 3)

    def test_1D_periodic_boundary(self):
        """ Test if periodic boundary conditions are working. """
        result = self.periodic_model.run()
        self.assertTrue(result.get_species("X", timepoints=1)[-1] > 0)

    def test_1D_periodic_boundary_pickle(self):
        """ Test if periodic boundary conditions are working. """
        model_str = pickle.dumps(self.periodic_model)
        model2 = pickle.loads(model_str)
        self.periodic_model.assemble()
        model2.assemble()
        self.assertEqual(self.periodic_model.mesh.get_num_dof_voxels(), model2.mesh.get_num_dof_voxels())


if __name__ == '__main__':
    unittest.main()


