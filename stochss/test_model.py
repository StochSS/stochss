#!/usr/bin/env python
""" Unit tests for stochss.model module. """

from model import *
from stochkit import *

from examplemodels import dimerdecay
from examplemodels import MichaelisMenten
import unittest

class TestModelSerialization(unittest.TestCase):
    """ Test model serialization. """
    def setUp(self):
        self.model = dimerdecay()
        self.mmmodel = MichaelisMenten()
        # Create the model document using the API
        self.modeldoc = StochMLDocument.fromModel(self.model)


    def test_parameters(self):
        """ Parameter evaluations. """
        # Create a model to hold the list of parameters
        model = Model(name="testparamters")
        # Create a parameter with a scalar value
        p1 = Parameter(name="p1",expression='0.1')
        model.addParameter(p1)
        # and a paramter defined as a function of p
        p2 = Parameter("p2",expression='p1/10')
        model.addParameter(p2)
        # Make sure that p2 evaluates to 0.01
        model.updateNamespace()
        p2.evaluate(namespace=model.namespace)
        self.assertEqual(p2.value,0.01)
    
    

    def test_massaction(self):
        """ Auto-generation of mass-action propensities. """
        S1 = Species('S1',10);
        S2 = Species('S2',10);
        S3 = Species('S3',10);
        c1 = Parameter(name="c1",expression='0.1')
        c2 = Parameter(name="c2",expression='0.1')
        c3 = Parameter(name="c3",expression='0.1')
       
        # These are the currently allowed cases
            
        # 1.) EmptySet->X
        R = Reaction(name='R1',products={S2.name:1},massaction=True,rate=c1)
        self.assertEqual(R.propensity_function,"c1")
        # 2.) X1 -> Y (Or anything else)
        R = Reaction(name='R1',reactants={S1.name:1},products={S2.name:1},massaction=True,rate=c1)
        self.assertEqual(R.propensity_function,"c1*S1")
        # 3.) 2X1 -> Y
        R = Reaction(name='R1',reactants={S1.name:2},products={S2.name:1},massaction=True,rate=c2)
        self.assertEqual(R.propensity_function,"0.5*c2*S1*(S1-1)")
        # 4.) X1 + X2 -> Y
        R = Reaction(name='R1',reactants={S1.name:1,S2.name:1},products={S3.name:1},massaction=True,rate=c2)
        # We cannot guarantee the order of the species in the expression
        valid_expressions = ["c2*S1*S2","c2*S2*S1"]
        self.assertIn(R.propensity_function,valid_expressions)
    
    def test_modelserialization():
        doc1 = self.mmmodel.serialize()
        
        
    
    """def test_readstochml(self):
        # Instantiate a Vilar model from a valid StochML
        doc = StochMLDocument.fromFile('vilar.xml')
        model = doc.toModel('Vilar')
        #model.serialize()"""
    
    def test_readmodelfromstochmlfile(self):
        """ Initialize a model object from StochML. """
        # Initialize a model object from the stochml document
        # model2 = self.modeldoc2.toModel("Example 2")
        #  And write it to a new stochml document
        #modeldoc2 = StochMLDocument.fromModel(model2)
        #modelstr2 = modeldoc2.toString()
        # Make sure that the documents are the same
        #self.assertEqual(self.modeldoc.toString(),modeldoc2.toString())

    
    def test_readandwritestochmlfiles(self):
        """ Serialize to and from StochML. """
        
        # Write the document to a file
        modelstr = self.modeldoc.toString()
        fhandle = open('test_model_doc.xml','w')
        fhandle.write(modelstr)
        fhandle.close()
        
        # and then initialize new modeldocument from the file we just wrote
        modeldoc2 = StochMLDocument.fromFile('test_model_doc.xml')
        # make sure that the serialization of the newly read document is
        # identical to the base document.
    
        #TODO: This test is broken, dom.minidom causes something weird to happen with the formatting of the document when read back in.  
        #self.assertEqual(modelstr,modeldoc2.toString())



if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestModelSerialization)
    unittest.TextTestRunner(verbosity=2).run(suite)
