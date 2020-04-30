import unittest, sys, os, inspect
import tempfile
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir) 

from handlers.util.convert_sbml_to_model import convert_sbml_to_model, convert_to_gillespy_model

class TestConvertSBMLToModel(unittest.TestCase):

    def test_sbml_to_gillespy(self):
        try:
            from urllib2 import urlopen
        except ImportError:
            from urllib.request import urlopen

        sbml_file = 'http://www.ebi.ac.uk/biomodels-main/download?mid=BIOMD0000000028'
        response = urlopen(sbml_file)
        tmp = tempfile.NamedTemporaryFile(delete = False)
        tmp.write(response.read())
        tmp.close()
        gillespy2_model, errors = convert_to_gillespy_model(tmp.name)
        os.remove(tmp.name)
        results1 = gillespy2_model.run(solver=BasicODESolver)

    def test_sbml_conversion(self):
        self.assertTrue(True)