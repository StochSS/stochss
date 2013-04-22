#!/usr/bin/env python
""" 
    Unit tests for stochss.model module.
    A. Hellander, 2013.
    
"""

from model import *
from stochkit import *

from examplemodels import dimerdecay
from examplemodels import MichaelisMenten
import unittest

class TestModelSerialization(unittest.TestCase):

    def setUp(self):
        self.model = dimerdecay()
        self.mmmodel = MichaelisMenten()
        # Create the model document using the API
        self.modeldoc = StochMLDocument.fromModel(self.model)

    
    def test_species(self):
        """ Testing basic functionality of the Species class """
        model = Model(name="testspecies")
        S1 = Species(name="S1",initial_value=10);
        S2 = Species(name="S2",initial_value=100);
        S3 = Species(name="S3",initial_value=100);
    
        # Both these calls should be supported
        model.addSpecies(S1)
        model.addSpecies([S2,S3])
    
        # This should raise a ModelError since S1 is already in the list.
        self.assertRaises(ModelError,model.addSpecies,S1)
 
    def test_parameters(self):
        """ Testing parameter evaluations. """
        # Create a model to hold the list of parameters
        model = Model(name="testparameters")
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
        """ Testing auto-generation of mass-action propensities. """
        S1 = Species('S1',10);
        S2 = Species('S2',10);
        S3 = Species('S3',10);
        c1 = Parameter(name="c1",expression='0.1')
        c2 = Parameter(name="c2",expression='0.1')
        c3 = Parameter(name="c3",expression='0.1')
       
        # These are the allowed cases
            
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
        # We cannot guarantee the order of the species in the expression. This is not a problem
        # for the actual simulation so both orders should be allowed. 
        valid_expressions = ["c2*S1*S2","c2*S2*S1"]
        iscorrect = R.propensity_function in valid_expressions
        self.assertEqual(iscorrect,True)
    
    def test_mmserialization(self):
        """ Serializing MichaelisMenten example model to StochKit XML """
        doc = self.mmmodel.serialize()
        #model2 = doc1.toModel("MichaelisMenten")
    #assertEqual(self.mmmodel.__dict__,model2.__dict__)
        
    
    def test_read_dimer_decay(self):
        """ Instantiate a model from dimer_decay.xml """
        doc    = StochMLDocument.fromFile("../examples/dimer_decay.xml")
        model  = doc.toModel("dimer_decay")
        xmlstr = model.serialize()
    
        # Most stringent test. Run StochKit with the same seed for both the
        # original model (diectly using the XML file) and using the file
        # serialized from the imported model instance. They should result in
        # the same output even if the format of the XML file is not identical.
        # TODO:
        stochkit(model,job_id="test_dd_1",seed=45367)
    
    def test_read_schlogl(self):
        """ Instantiate a model from schlogl.xml """
        doc = StochMLDocument.fromFile("../examples/schlogl.xml")
        model = doc.toModel("schlogl")
        xmlstr = model.serialize()
    
    def test_read_simple1(self):
        """ Instantiate a model from simple1.xml """
        doc = StochMLDocument.fromFile("../examples/simple1.xml")
        model = doc.toModel("simple1")
        xmlstr = model.serialize()
    
    def test_read_simple1p(self):
        """ Instantiate a model from simple1p.xml """
        doc = StochMLDocument.fromFile("../examples/simple1p.xml")
        model = doc.toModel("simple1p")
        xmlstr = model.serialize()
    
    def test_read_vilar(self):
        """ Instantiate a model from vilar.xml """
        doc = StochMLDocument.fromFile("../examples/vilar.xml")
        model = doc.toModel("vilar")
        xmlstr = model.serialize()

    def test_read_heat_shock_mixed(self):
        """ Instantiate a model from heat_shock_mixed.xml """
        doc = StochMLDocument.fromFile("../examples/heat_shock_mixed.xml")
        model = doc.toModel("heat_shock_mixed")
        xmlstr = model.serialize()

    def test_read_heat_shock_mass_action(self):
        """ Instantiate a model from heat_shock_mass_action.xml """
        doc = StochMLDocument.fromFile("../examples/heat_shock_mass_action.xml")
        model = doc.toModel("heat_shock_mass_action")
        xmlstr = model.serialize()
    
    def test_read_heat_shock_10x(self):
        """ Instantiate a model from heat_shock_10x.xml """
        doc = StochMLDocument.fromFile("../examples/heat_shock_10x.xml")
        model = doc.toModel("heat_shock_10x")
        xmlstr = model.serialize()

            
        # def test_readmodelfromstochmlfile(self):
    # """ Initialize a model object from StochML. """
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
    
        #self.assertEqual(modelstr,modeldoc2.toString())

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestModelSerialization)
    unittest.TextTestRunner(verbosity=2).run(suite)
