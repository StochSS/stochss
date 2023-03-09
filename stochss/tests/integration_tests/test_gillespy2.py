'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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

import gillespy2

from example_models import (
    create_vilar_oscillator, create_dimerization, create_trichloroethylene, create_lac_operon, create_schlogl,
    create_michaelis_menten, create_toggle_switch, create_decay, create_tyson_2_state_oscillator,
    create_oregonator, create_opioid, create_telegraph_model
)

os.chdir('/stochss')

# pylint: disable=import-outside-toplevel
class TestGillesPy2Dependency(unittest.TestCase):
    '''
    ####################################################################################################################
    Unit tests for GillesPy2 dependency.
    ####################################################################################################################
    '''
    def setUp(self):
        ''' Create a list of common example paths for each test. '''
        self.test_ode_models = [
            create_vilar_oscillator, create_dimerization, create_trichloroethylene, create_lac_operon, create_schlogl,
            create_michaelis_menten, create_toggle_switch, create_decay, create_tyson_2_state_oscillator,
            create_oregonator, create_opioid, create_telegraph_model
        ]
        self.test_ssa_models = [
            create_vilar_oscillator, create_dimerization, create_trichloroethylene, create_schlogl,
            create_michaelis_menten, create_toggle_switch, create_decay, create_tyson_2_state_oscillator,
            create_opioid, create_telegraph_model
        ]
        self.test_hybrid_models = [
            create_dimerization, create_trichloroethylene, create_schlogl, create_michaelis_menten,
            create_toggle_switch, create_decay, create_opioid, create_telegraph_model
        ]

    ####################################################################################################################
    # Unit tests for GillesPy2 dependency check_cpp_support.
    ####################################################################################################################

    def test_check_cpp_support(self):
        ''' Check if the check cpp support functions works in StochSS. '''
        from gillespy2.solvers.utilities.cpp_support_test import check_cpp_support

        self.assertIsInstance(check_cpp_support(), bool)

    ####################################################################################################################
    # Unit tests for GillesPy2 dependency get_best_solver.
    ####################################################################################################################

    def test_get_best_solver(self):
        ''' Check if the get best solver function works in StochSS. '''
        test_model = self.test_ode_models[0]()
        test_solver = test_model.get_best_solver()
        self.assertIsInstance(test_solver(model=test_model), gillespy2.GillesPySolver)

    ####################################################################################################################
    # Unit tests for GillesPy2 dependency get_best_solver_algo.
    ####################################################################################################################

    def test_get_best_solver_algo(self):
        ''' Check if the get best solver algo function works in StochSS. '''
        test_algos = ["ODE", "SSA", "CLE", "Tau-Leaping", "Tau-Hybrid"]
        test_model = self.test_ode_models[0]()
        for test_algo in test_algos:
            with self.subTest(test_algo=test_algo):
                test_solver = test_model.get_best_solver_algo(algorithm=test_algo)
                self.assertIsInstance(test_solver(model=test_model), gillespy2.GillesPySolver)

    ####################################################################################################################
    # Unit tests for GillesPy2 dependency solvers.
    ####################################################################################################################

    def test_ode_solver(self):
        ''' Check if the test_models run with the ODESolver. '''
        for model in self.test_ode_models:
            test_model = model()
            msg = f"Running {test_model.name} using {gillespy2.ODESolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=gillespy2.ODESolver, timeout=30)

    def test_ode_c_solver(self):
        ''' Check if the test_models run with the ODECSolver. '''
        for model in self.test_ode_models:
            test_model = model()
            test_solver = gillespy2.ODECSolver(model=test_model)
            msg = f"Running {test_model.name} using {gillespy2.ODECSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=test_solver, timeout=30)

    def test_numpy_ssa_solver(self):
        ''' Check if the test_models run with the NumPySSASolver. '''
        for model in self.test_ssa_models:
            test_model = model()
            msg = f"Running {test_model.name} using {gillespy2.NumPySSASolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=gillespy2.NumPySSASolver, timeout=30)

    def test_ssa_c_solver(self):
        ''' Check if the test_models run with the SSACSolver. '''
        for model in self.test_ssa_models:
            test_model = model()
            test_solver = gillespy2.SSACSolver(model=test_model)
            msg = f"Running {test_model.name} using {gillespy2.SSACSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=test_solver, timeout=30)

    def test_tau_leaping_solver(self):
        ''' Check if the test_models run with the TauLeapingSolver. '''
        for model in self.test_ssa_models:
            test_model = model()
            msg = f"Running {test_model.name} using {gillespy2.TauLeapingSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=gillespy2.TauLeapingSolver, timeout=30)

    def test_tau_leaping_c_solver(self):
        ''' Check if the test_models run with the TauLeapingCSolver. '''
        for model in self.test_ssa_models:
            test_model = model()
            test_solver = gillespy2.TauLeapingCSolver(model=test_model)
            msg = f"Running {test_model.name} using {gillespy2.TauLeapingCSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=test_solver, timeout=30)

    def test_tau_hybrid_solver(self):
        ''' Check if the test_models run with the TauHybridSolver. '''
        for model in self.test_hybrid_models:
            test_model = model()
            msg = f"Running {test_model.name} using {gillespy2.TauHybridSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=gillespy2.TauHybridSolver, timeout=30)

    def test_tau_hybrid_c_solver(self):
        ''' Check if the test_models run with the TauHybridCSolver. '''
        for model in self.test_hybrid_models:
            test_model = model()
            test_solver = gillespy2.TauHybridCSolver(model=test_model)
            msg = f"Running {test_model.name} using {gillespy2.TauHybridCSolver.name} failed!"
            with self.subTest(msg=msg):
                test_model.run(solver=test_solver, timeout=30)
