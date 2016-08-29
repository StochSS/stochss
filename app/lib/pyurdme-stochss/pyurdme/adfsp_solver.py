""" ADFSP solver. """
import os
import pyurdme

class ADFSPSolver(pyurdme.URDMESolver):
    """ ADFSP solver class. """
    NAME = 'adaptive_dfsp'

    def __init__(self, model, solver_path=None, report_level=0, tau_d=-1, error_tolarance=1e-03, max_jump=-1):
        if solver_path is None or solver_path == "":
            solver_path = os.path.dirname(os.path.abspath(__file__))+"/urdme"
        pyurdme.URDMESolver.__init__(self, model, solver_path=solver_path, report_level=report_level)
        self.sopts = [tau_d, max_jump, error_tolarance]

