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

import os
import unittest

from gillespy2 import GillesPySolver

from stochss.handlers import StochSSModel

os.chdir('/stochss')

class TestModelTemplate(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for GillesPy2 dependency.
    ################################################################################################
    '''
    def setUp(self):
    	''' Create a list of common example paths for each test. '''
    	self.model_paths = ["Brusselator/Brusselator.mdl",
			                "Degradation/Degradation.mdl",
			                "Dimerization/Dimerization.mdl",
			                "Lotkavolterra_Oscillator/Lotkavolterra_Oscillator.mdl",
			                "Michaelis_Menten/Michaelis_Menten.mdl",
			                "Opioid/Opioid.mdl",
			                "Schlogl/Schlogl.mdl",
			                "Toggle_Switch/Toggle_Switch.mdl",
			                "Vilar_Oscillator/Vilar_Oscillator.mdl"
			               ]

	################################################################################################
    # Unit tests for GillesPy2 dependency check_cpp_support.
    ################################################################################################

    def test_check_cpp_support(self):
    	''' Check if the check cpp support functions works in StochSS. '''
    	from gillespy2.solvers.utilities.cpp_support_test import check_cpp_support

    	self.assertIsInstance(check_cpp_support(), bool)

    ################################################################################################
    # Unit tests for GillesPy2 dependency get_best_solver.
    ################################################################################################

    def test_get_best_solver(self):
    	''' Check if the get best solver function works in StochSS. '''
    	test_model = StochSSModel(path=os.path.join("Examples", self.model_paths[0])).convert_to_gillespy2()
    	test_solver = test_model.get_best_solver()
    	self.assertIsInstance(test_solver(), GillesPySolver)

    ################################################################################################
    # Unit tests for GillesPy2 dependency get_best_solver_algo.
    ################################################################################################

    def test_get_best_solver_algo(self):
    	''' Check if the get best solver algo function works in StochSS. '''
    	test_algos = ["ODE", "SSA", "Tau-Leaping"]
    	test_model = StochSSModel(path=os.path.join("Examples", self.model_paths[0])).convert_to_gillespy2()
    	for test_algo in test_algos:
    		with self.subTest(test_algo=test_algo):
    			test_solver = test_model.get_best_solver_algo(algorithm=test_algo)
    			self.assertIsInstance(test_solver(), GillesPySolver)

    ################################################################################################
    # Unit tests for GillesPy2 dependency solvers.
    ################################################################################################

    def test_ode_solver(self):
    	''' Check if the test_models run with the ODESolver. '''
    	from gillespy2 import ODESolver

    	self.model_paths.append("Oregonator/Oregonator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_model.run(solver=ODESolver)


    def test_ode_c_solver(self):
    	''' Check if the test_models run with the ODECSolver. '''
    	from gillespy2 import ODECSolver

    	self.model_paths.append("Oregonator/Oregonator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_solver = ODECSolver(model=test_model)
    			test_model.run(solver=test_solver)


    def test_numpy_ssa_solver(self):
    	''' Check if the test_models run with the NumPySSASolver. '''
    	from gillespy2 import NumPySSASolver

    	self.model_paths.append("Tyson_Oscillator/Tyson_Oscillator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_model.run(solver=NumPySSASolver)


    def test_ssa_c_solver(self):
    	''' Check if the test_models run with the SSACSolver. '''
    	from gillespy2 import SSACSolver

    	self.model_paths.append("Tyson_Oscillator/Tyson_Oscillator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_solver = SSACSolver(model=test_model)
    			test_model.run(solver=test_solver)


    def test_tau_leaping_solver(self):
    	''' Check if the test_models run with the TauLeapingSolver. '''
    	from gillespy2 import TauLeapingSolver

    	self.model_paths.append("Tyson_Oscillator/Tyson_Oscillator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_model.run(solver=TauLeapingSolver)


    def test_tau_leaping_c_solver(self):
    	''' Check if the test_models run with the TauLeapingCSolver. '''
    	from gillespy2 import TauLeapingCSolver

    	self.model_paths.append("Tyson_Oscillator/Tyson_Oscillator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_solver = TauLeapingCSolver(model=test_model)
    			test_model.run(solver=test_solver)


    def test_tau_hybrid_solver(self):
    	''' Check if the test_models run with the TauHybridSolver. '''
    	from gillespy2 import TauHybridSolver

    	self.model_paths.append("Oregonator/Oregonator.mdl")
    	self.model_paths.append("Tyson_Oscillator/Tyson_Oscillator.mdl")
    	for model_path in self.model_paths:
    		with self.subTest(model=model_path.split('/').pop()):
    			test_model = StochSSModel(path=os.path.join("Examples", model_path)).convert_to_gillespy2()
    			test_model.run(solver=TauHybridSolver)
