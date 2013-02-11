""" 
    StochSS interface for StochKit2.
    Defines a StochKit2 model, serialization and output datastructures. 
    
"""

from model import *
import numpy as np
from collections import OrderedDict

try:
    import lxml.etree as etree
    no_pretty_print = False
except:
    import xml.etree.ElementTree as etree
    import xml.dom.minidom
    import re
    no_pretty_print = True

try:
    import scipy.sparse as scisp
    import scipy.io as spio
    isSCIPY = True
except:
    pass
###### Model description ######

class StochKitModel(Model):
    """ StochKitModel extends a well mixed model with StochKit specific serialization. """

    def serialize(self):
        """ Serializes a Model object to StochML. """
        
        # We need to make sure that we can resolve composit parameter values before we can write the StochML document
        self.updateNamespace()
        for param in self.listOfParameters:
            try:
                self.listOfParameters[param].evaluate(self.namespace)
            except:
                raise ValueError("Could not resolve Parameter expressions to scalar values.")
        
        doc = StochMLDocument().fromModel(self)
        return doc.toString()
        #print doc.toString()

#######  XML Serialization ######

class StochMLDocument():
    """ Serializiation and deserialization of a StochKitModel to/from StochKit2 XML format (StochML). """
    
    def __init__(self):
        # The root element
        self.document = etree.Element("Model")
    
    @classmethod
    def fromModel(cls,model):
        # Description
        md = cls()
        
        d = etree.Element('Description')
        d.text = model.annotation
        md.document.append(d)
        
        # Number of Reactions
        nr = etree.Element('NumberOfReactions')
        nr.text = str(len(model.listOfReactions))
        md.document.append(nr)
        
        # Number of Species
        ns = etree.Element('NumberOfSpecies')
        ns.text = str(len(model.listOfSpecies))
        md.document.append(ns)
        
        # Species
        spec = etree.Element('SpeciesList')
        for sname in model.listOfSpecies:
            spec.append(md.SpeciestoElement(model.listOfSpecies[sname]))
        md.document.append(spec)
        # Parameters
        params = etree.Element('ParametersList')
        for pname in model.listOfParameters:
            params.append(md.ParametertoElement(model.listOfParameters[pname]))
        md.document.append(params)
        
        # Reactions
        reacs = etree.Element('ReactionsList')
        for rname in model.listOfReactions:
            reacs.append(md.ReactionToElement(model.listOfReactions[rname]))
        md.document.append(reacs)
        
        return md
    
    
    @classmethod
    def fromFile(cls,filepath):
        
        tree = etree.parse(filepath)
        root = tree.getroot()
        md = cls()
        md.document = root
        return md
    
    def toModel(self,name):
        """ a model object from a StochMLDocument """
        
        # Empty model
        model = StochKitModel(name=name)
        root = self.document
        
        # Try to set name from document
        if model.name is "":
            name = root.find('Name')
            if name.text is None:
                raise
            else:
                model.name = name.text
        
        # Set annotiation
        ann = root.find('Description')
        if ann.text is None:
            model.annotation = ""
        else:
            model.annotation = ann.text
        
        # Create parameters
        for px in root.iter('Parameter'):
            name = px.find('Id').text
            val = float(px.find('Expression').text)
            p = Parameter(name,expression=val)
            model.addParameter(p)
        
        # Create species
        for spec in root.iter('Species'):
            name = spec.find('Id').text
            val  = int(spec.find('InitialPopulation').text)
            s = Species(name,initial_value = val)
            model.addSpecies([s])
        
        # The namespace_propensity for evaluating the propensity function for reactions should contain all the species and parameters.
        namespace_propensity = OrderedDict()
        all_species = model.getAllSpecies()
        all_parameters = model.getAllParameters()
        
        for param in all_species:
            namespace_propensity[param] = all_species[param].initial_value
        
        for param in all_parameters:
            namespace_propensity[param] = all_parameters[param].value
        
        # Create reactions
        for reac in root.iter('Reaction'):
            
            try:
                name = reac.find('Id').text
            except:
                raise InvalidStochMLError("Reaction has no name.")
            
            reaction  = Reaction(name=name,reactants={},products={})
                
            # Type may be 'mass-action','customized'
            try:
                type = reac.find('Type').text
            except:
                raise InvalidStochMLError("No reaction type specified.")
                    
            reactants  = reac.find('Reactants')
            try:
                for ss in reactants.iter('SpeciesReference'):
                    specname = ss.get('id')
                    stoch = int(ss.get('stoichiometry'))
                    # Select a reference to species with name specname
                    sref = model.listOfSpecies[specname]
                    try:
                        # The sref list should only contain one element if the XML file is valid.
                        reaction.reactants[specname] = stoch
                    except:
                        pass
            except:
                pass

            products  = reac.find('Products')
            try:
                for ss in products.iter('SpeciesReference'):
                    specname = ss.get('id')
                    stoch = int(ss.get('stoichiometry'))
                    sref = model.listOfSpecies[specname]
                    try:
                        # The sref list should only contain one element if the XML file is valid.
                        reaction.products[specname] = stoch
                    except:
                        pass
            except:
                pass
                            
            if type == 'mass-action':
                reaction.massaction = True
                reaction.type = 'mass-action'
                # If it is mass-action, a parameter reference is needed.
                try:
                    ratename=reac.find('Rate').text
                    reaction.marate = model.listOfParameters[ratename]
                    reaction.createMassAction()
                except Exception, e:
                    raise

            model.addReaction(reaction)
        
        return model
    
    def toString(self):
        
        # Print the document
        try:
            return etree.tostring(self.document, pretty_print=True)
        except:
            # Hack to print pretty xml without pretty-print. Thanks to stackoverflow!
            doc = etree.tostring(self.document)
            xmldoc = xml.dom.minidom.parseString(doc)
            uglyXml = xmldoc.toprettyxml(indent='  ')
            text_re = re.compile(">\n\s+([^<>\s].*?)\n\s+</", re.DOTALL)
            prettyXml = text_re.sub(">\g<1></", uglyXml)
            return prettyXml
    
    def SpeciestoElement(self,S):
        e = etree.Element('Species')
        idElement = etree.Element('Id')
        idElement.text = S.name
        e.append(idElement)
        
        if hasattr(S, 'description'):
            descriptionElement = etree.Element('Description')
            descriptionElement.text = S.description
            e.append(descriptionElement)
        
        initialPopulationElement = etree.Element('InitialPopulation')
        initialPopulationElement.text = str(S.initial_value)
        e.append(initialPopulationElement)
        
        return e
    
    def ParametertoElement(self,P):
        e = etree.Element('Parameter')
        idElement = etree.Element('Id')
        idElement.text = P.name
        e.append(idElement)
        expressionElement = etree.Element('Expression')
        expressionElement.text = str(P.value)
        e.append(expressionElement)
        return e
    
    def ReactionToElement(self,R):
        e = etree.Element('Reaction')
        
        idElement = etree.Element('Id')
        idElement.text = R.name
        e.append(idElement)
        
        try:
            descriptionElement = etree.Element('Description')
            descriptionElement.text = self.annotation
            e.append(descriptionElement)
        except:
            pass
        
        try:
            typeElement = etree.Element('Type')
            typeElement.text = R.type
            e.append(typeElement)
        except:
            pass
    
        # StochKit2 wants a rate for mass-action propensites
        if R.massaction:
            try:
                rateElement = etree.Element('Rate')
                # A mass-action reactions should only have one parameter
                rateElement.text = R.marate.name
                e.append(rateElement)
            except:
                pass

        elif R.type=='customized':
            try:
                functionElement = etree.Element('propensity_function')
                functionElement.text = R.propensity_function
                e.append(functionElement)
            except:
                pass

        reactants = etree.Element('Reactants')

        for reactant, stoichiometry in R.reactants.items():
            srElement = etree.Element('SpeciesReference')
            srElement.set('id', reactant)
            srElement.set('stoichiometry', str(stoichiometry))
            reactants.append(srElement)

        e.append(reactants)

        products = etree.Element('Products')
        for product, stoichiometry in R.products.items():
            srElement = etree.Element('SpeciesReference')
            srElement.set('id', product)
            srElement.set('stoichiometry', str(stoichiometry))
            products.append(srElement)
        e.append(products)

        return e

########## Basic output data types ############

class StochKitTrajectory():
    """
        A StochKitTrajectory is a numpy ndarray.
        The first column is the time points in the timeseries,
        followed by species copy numbers.
    """
    
    def __init__(self,data=None,id=None):
        
        # String identifier
        self.id = id
    
        # Matrix with copy number data.
        self.data = data
        [self.tlen,self.ns] = np.shape(data);

class StochKitEnsemble():
    """ 
        A stochKit ensemble is a collection of StochKitTrajectories,
        all sharing a common set of metadata (generated from the same model instance).
    """
    
    def __init__(self,id=None,trajectories=None,parentmodel=None):
        # String identifier
        self.id = id;
        # Trajectory data
        self.trajectories = trajectories
        # Metadata
        self.parentmodel = parentmodel
        dims = np.shape(self.trajectories)
        self.number_of_trajectories = dims[0]
        self.tlen = dims[1]
        self.number_of_species = dims[2]
    
    def addTrajectory(self,trajectory):
        self.trajectories.append(trajectory)
    
    def dump(self, filename, type="mat"):
        """ 
            Serialize to a binary data file in a matrix format.
            Supported formats are HDF5 (requires h5py), .MAT (for Matlab V. <= 7.2, requires SciPy). 
            Matlab V > 7.3 uses HDF5 as it's base format for .mat files. 
        """
        
        if type == "mat":
            # Write to Matlab format.
            filename = filename
            # Build a struct that contains some metadata and the trajectories
            ensemble = {'trajectories':self.trajectories,'species_names':self.parentmodel.listOfSpecies,'model_parameters':self.parentmodel.listOfParameters,'number_of_species':self.number_of_species,'number_of_trajectories':self.number_of_trajectories}
            spio.savemat(filename,{self.id:ensemble},oned_as="column")
        elif type == "hdf5":
            print "Not supported yet."

class StochKitOutputCollection():
    """ 
        A collection of StochKit Ensembles, not necessarily generated
        from a common model instance (i.e. they do not necessarly have the same metadata).
        This datastructure can be useful to store e.g. data from parameter sweeps, 
        or simply an ensemble of ensembles.
        
        AH: Something like a PyTables object would be very useful here, if working
        in a Python environment. 
        
    """

    def __init__(self,collection=[]):
        self.collection = collection

    def addEnsemble(self,ensemble):
        self.collection.append(ensemble)

# Exceptions
class InvalidStochMLError(Exception):
    pass

