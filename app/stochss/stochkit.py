""" 
    
    StochSS interface to StochKit2.
    
    This module implements a class (StochKitModel) that defines a StochKit2 
    object. StochKitModel extends Model in the 'model.py' module, and supplements 
    it with StochKit2 specific model serialization (to StochKit's naive XML format). 
    
    For examples of use the model API consult the examples in the module 'examplemodels.py'.
    
    The XML serialization is implemented through a StochMLDocument class, which 
    rely on either the lxml or etree modules. To serialize a StochKitModel object 'model',
    simply do
    
        print model.serialize()

    which is equivalent to 
    
        document = StochMLDocument.fromModel(model)
        print document.toString()
    
    You can also initalize a model from an exisiting XML file (See class documentation).
    
    The module also conatains some experimental code for wrapping StochKit output data
    and writing it to .mat files. This should not presently be used by the GAE app.
    
    It also implements a wrapper around StochKit, which uses systems calls to execute
    StochKit and collect its results. This function is mainly inteded to be used by 
    the test suite, but is include here since it can be useful in other contexts as well.
    
    Raises: InvalidModelError, InvalidStochMLError
    
    Andreas Hellander, April 2013.
    
"""

from model import *
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

import os
try:
    import shutil
    import numpy
except:
    pass

class StochKitModel(Model):
    """ StochKitModel extends a well mixed model with StochKit specific serialization. """

    def serialize(self):
        """ Serializes a Model object to valid StochML. """
        self.resolveParameters()
        doc = StochMLDocument().fromModel(self)
        return doc.toString()


class StochMLDocument():
    """ Serializiation and deserialization of a StochKitModel to/from 
        the native StochKit2 XML format. """
    
    def __init__(self):
        # The root element
        self.document = etree.Element("Model")
    
    @classmethod
    def fromModel(cls,model):
        """ Creates an StochKit XML document from an exisiting StochKitModel object.
            This method assumes that all the parameters in the model are already resolved
            to scalar floats (see Model.resolveParamters). 
                
            Note, this method is intended to be used interanally by the models 'serialization' 
            function, which performs additional operations and tests on the model prior to 
            writing out the XML file. You should NOT do 
            
            document = StochMLDocument.fromModel(model)
            print document.toString()
            
            you SHOULD do
            
            print model.serialize()            
            
        """
        
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
        """ Intializes the document from an exisiting native StochKit XML file read from disk. """
        tree = etree.parse(filepath)
        root = tree.getroot()
        md = cls()
        md.document = root
        return md
    
    def toModel(self,name):
        """ Instantiates a StochKitModel object from a StochMLDocument. """
        
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
        if ann is not None:
            if ann.text is None:
                model.annotation = ""
            else:
                model.annotation = ann.text
    
        # Create parameters
        for px in root.iter('Parameter'):
            name = px.find('Id').text
            expr = px.find('Expression').text
            p = Parameter(name,expression=expr)
            # Try to evaluate the expression in the empty namespace (if the expr is a scalar value)
            p.evaluate()
            model.addParameter(p)
        
        # Create species
        for spec in root.iter('Species'):
            name = spec.find('Id').text
            val  = spec.find('InitialPopulation').text
            s = Species(name,initial_value = float(val))
            model.addSpecies([s])
        
        # The namespace_propensity for evaluating the propensity function for reactions must
        # contain all the species and parameters.
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
                    # The stochiometry should be an integer value, but some
                    # exising StoxhKit models have them as floats. This is why we
                    # need the slightly odd conversion below. 
                    stoch = int(float(ss.get('stoichiometry')))
                    # Select a reference to species with name specname
                    sref = model.listOfSpecies[specname]
                    try:
                        # The sref list should only contain one element if the XML file is valid.
                        reaction.reactants[specname] = stoch
                    except Exception,e:
                        StochMLImportError(e)
            except:
                # Yes, this is correct. 'reactants' can be None
                pass

            products  = reac.find('Products')
            try:
                for ss in products.iter('SpeciesReference'):
                    specname = ss.get('id')
                    stoch = int(float(ss.get('stoichiometry')))
                    sref = model.listOfSpecies[specname]
                    try:
                        # The sref list should only contain one element if the XML file is valid.
                        reaction.products[specname] = stoch
                    except Exception,e:
                        raise StochMLImportError(e)
            except:
                # Yes, this is correct. 'products' can be None
                pass
                            
            if type == 'mass-action':
                reaction.massaction = True
                reaction.type = 'mass-action'
                # If it is mass-action, a parameter reference is needed.
                # This has to be a reference to a species instance. We explicitly
                # disallow a scalar value to be passed as the paramtete.  
                try:
                    ratename=reac.find('Rate').text
                    try:
                        reaction.marate = model.listOfParameters[ratename]
                    except KeyError, k:
                        # No paramter name is given. This is a valid use case in StochKit.
                        # We generate a name for the paramter, and create a new parameter instance.
                        # The parameter's value should now be found in 'ratename'.
                        generated_rate_name = "Reaction_" + name + "_rate_constant";
                        p = Parameter(name=generated_rate_name, expression=ratename);
                        # Try to evaluate the parameter to set its value
                        p.evaluate()
                        model.addParameter(p)
                        reaction.marate = model.listOfParameters[generated_rate_name]

                    reaction.createMassAction()
                except Exception, e:
                    raise
            elif type == 'customized':
                try:
                    propfunc = reac.find('PropensityFunction').text
                except Exception,e:
                    raise InvalidStochMLError("Found a customized propensity function, but no expression was given."+e)
                reaction.propensity_function = propfunc
            else:
                raise InvalidStochMLError("Unsupported or no reaction type given for reaction" + name)

            model.addReaction(reaction)
        
        return model
    
    def toString(self):
        """ Returns  the document as a string. """
        try:
            return etree.tostring(self.document, pretty_print=True)
        except:
            # Hack to print pretty xml without pretty-print (requires the lxml module).
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
                functionElement = etree.Element('PropensityFunction')
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


def stochkit(model, job_id="",time=1.0,number_of_trajectories=1,increment=None,seed=None,algorithm="ssa"):
    """ Call out and run StochKit. Collect the results. This routine is mainly
        intended to be used by the (command line) test suite. """
    # We write all StochKit input and output files to a temporary folder
    prefix_outdir = os.path.join(os.path.dirname(__file__), '.stochkit_output')

    # If the base output directory does not exist, we create it
    process = os.popen('mkdir -p ' + prefix_outdir);
    process.close()
    
    # Write a temporary StochKit2 input file.
    
    outfile =  "stochkit_temp_input.xml"
    mfhandle = open(outfile,'w')
    #document = StochMLDocument.fromModel(model)

    # If the model is a StochKitModel instance, we serialize it to XML,
    # and if it is an XML file, we just make a copy.
    if isinstance(model,StochKitModel):
        document = model.serialize()
        mfhandle.write(document)
        mfhandle.close()
    elif isinstance(model,str):
        outfile = model

    # Assemble argument list
    ensemblename = job_id
    
    # If the temporary folder we need to create to hold the output data already exists, we error
    process = os.popen('ls '+prefix_outdir)
    directories = process.read();
    process.close()
    
    if ensemblename in directories:
        raise Exception("The ensemble name already exists. You need to input a unique name.")
    
    outdir = prefix_outdir+'/'+ensemblename
    
    realizations = number_of_trajectories
    if increment == None:
        increment = time/10;

    if seed == None:
        seed = 0

    # Algorithm, SSA or Tau-leaping?
    executable = algorithm
    
    # Assemble the argument list
    args = ''
    args+='--model '
    args+=outfile
    args+=' --out-dir '+outdir
    args+=' -t '
    args+=str(time)
    num_output_points = str(int(float(time/increment)))
    args+=' -i ' + num_output_points
    args+=' --realizations '
    args+=str(realizations)
    
    # Only use on processor per StochKit job. 
    args+= ' -p 1'
    
    # We keep all the trajectories by default.
    args+=' --keep-trajectories'

    # TODO: We need a robust way to pick a default seed for the ensemble. It needs to be robust in a ditributed, parallel env.
    args+=' --seed '
    args+=str(seed)

    # If we are using local mode, shell out and run StochKit (SSA or Tau-leaping)
    cmd = executable+' '+args

    # Can't test for failed execution here, popen does not return stderr.
    process = os.popen(cmd)
    stochkit_output_message = process.read()
    process.close()

    # Collect all the output data
    files = os.listdir(outdir + '/stats')
       
    trajectories = []
    files = os.listdir(outdir + '/trajectories')
        
    for filename in files:
        if 'trajectory' in filename:
            trajectories.append(numpy.loadtxt(outdir + '/trajectories/' + filename))
        else:
            sys.stderr.write('Couldn\'t identify file (' + filename + ') found in output folder')
            sys.exit(-1)


    # Clean up
    shutil.rmtree(outdir)
    return trajectories

# Exceptions
class StochMLImportError(Exception):
    pass

class InvalidStochMLError(Exception):
    pass

