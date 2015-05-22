# pylint: disable-msg=C0301
# pylint: disable-msg=C0103

import os
import re
import shutil
import subprocess
import sys
import tempfile
import types
import warnings
import uuid


import numpy
import scipy.io
import scipy.sparse

from model import *

import inspect

try:
    # This is only needed if we are running in an Ipython Notebook
    import IPython.display
except:
    pass

try:
    import h5py
except:
    raise Exception("PyURDME requires h5py.")

try:
    import dolfin
    dolfin.parameters["linear_algebra_backend"] = "uBLAS"
except:
    raise Exception("PyURDME requires FeniCS/Dolfin.")

import pickle
import json

import functools

def deprecated(func):
    '''This is a decorator which can be used to mark functions
     as deprecated. It will result in a warning being emitted
     when the function is used.'''

    @functools.wraps(func)
    def new_func(*args, **kwargs):
        warnings.warn_explicit(
             "Call to deprecated function {}.".format(func.__name__),
             category=DeprecationWarning,
             filename=func.func_code.co_filename,
             lineno=func.func_code.co_firstlineno + 1
         )
        return func(*args, **kwargs)
    return new_func



# Set log level to report only errors or worse
dolfin.set_log_level(dolfin.ERROR)
import logging
logging.getLogger('FFC').setLevel(logging.ERROR)
logging.getLogger('UFL').setLevel(logging.ERROR)

class URDMEModel(Model):
    """
        An URDME Model extends Model with spatial information and methods to create URDME solver input.
        TODO: Documentiation.
    """

    def __init__(self, name=""):
        Model.__init__(self, name)

        # Currently not used
        self.geometry = None
        #
        self.sd = []
        self.sd_initialized = False

        self.mesh = None
        self.xmesh = None
        self.stiffness_matrices = None
        self.mass_matrices = None

        # subdomins is a list of MeshFunctions with subdomain marker information
        self.subdomains = OrderedDict()
        self.old_style_subdomain = False

        # This dictionary hold information about the subdomains each species is active on
        self.species_to_subdomains = {}
        self.tspan = None

        # URDMEDataFunction objects to construct the data vector.
        self.listOfDataFunctions = []

        # Volume of each voxel in the dolfin dof ordering (not vertex ordering).
        self.dofvol = None

    def __getstate__(self):
        """ Used by pickle to get state when pickling. Because we
            have Swig wrappers to extension modules, we need to remove some instance variables
            for the object to pickle. """

        #  Filter out any instance variable that is not picklable...
        state = {}
        for key, item in self.__dict__.items():
            if key == "subdomains":
                sddict = OrderedDict()
                for sdkey, sd_func in item.items():
                    tmpfile = tempfile.NamedTemporaryFile(suffix=".xml")
                    dolfin.File(tmpfile.name) << sd_func
                    tmpfile.seek(0)
                    sddict[sdkey] = tmpfile.read()
                    tmpfile.close()

                state[key] = sddict
            elif key in ["stiffness_matrices", "mass_matrices", "xmesh"]:
                state[key] = None
            else:
                state[key] = item


        return state

    def __setstate__(self, state):
        """ Used by pickle to set state when unpickling. """

        self.__dict__ = state

        if 'subdomains' in state:
            # Recreate the subdomain functions
            try:
                sddict = OrderedDict()
                for sdkey, sd_func_str in state["subdomains"].items():
                    fd = tempfile.NamedTemporaryFile(suffix=".xml")
                    fdname = fd.name
                    fd.write(sd_func_str)
                    fd.seek(0)
                    fd_in = dolfin.File(fdname)
                    func = dolfin.MeshFunction("size_t", self.__dict__["mesh"])
                    fd_in >> func
                    sddict[sdkey] = func
                    fd.close()
                self.__dict__["subdomains"] = sddict
            except Exception as e:
                raise Exception("Error unpickling model, could not recreate the subdomain functions"+str(e))

        self.create_extended_mesh()

    def add_data_function(self, data_function):
        """ Add a URDMEDataFunction object to this object. """
        if isinstance(data_function, URDMEDataFunction):
            self.listOfDataFunctions.append(data_function)
        else:
            raise Exception("data_function not of type URDMEDataFunction")

    def __initialize_species_map(self):
        i = 0
        self.species_map = {}
        for S in self.listOfSpecies:
            self.species_map[S] = i
            i = i + 1

    def get_species_map(self):
        """ Get the species map, name to index. """
        if not hasattr(self, 'species_map'):
            self.__initialize_species_map()

        return self.species_map

    def add_subdomain(self, subdomain, subdomain_id=None):
        """ Add a subdomain definition to the model.  By default, all regions are set to
        subdomain 1.

        Args:
            subdomain: an instance of a 'dolfin.SubDomain' subclass.
            id: an int, the identifier for this subdomain.
        """
        if subdomain_id is None and isinstance(subdomain, dolfin.cpp.mesh.MeshFunctionSizet):
            # Old style, for backwards compatability
            if not subdomain.dim() in self.subdomains.keys():
                self.subdomains[subdomain.dim()] = subdomain
                self.old_style_subdomain = True
            else:
                raise ModelException("Failed to add subdomain function of dim "+str(subdomain.dim())+". Only one subdomain function of a given dimension is allowed.")
        else:
            # New style
            if self.old_style_subdomain:
                raise ModelException("Can't mix old and new style subdomains")
            if not issubclass(subdomain.__class__, dolfin.SubDomain):
                raise ModelException("'subdomain' argument to add_subdomain() must be a subclass of dolfin.SubDomain")
            if subdomain_id is None or not isinstance(subdomain_id, int):
                raise ModelException("'id' argument to add_subdomain() must be an int")
            self.subdomains[subdomain_id] = subdomain


    ################################

    def _subdomains_to_threejs(self, subdomains={1:'blue'}):
        """ Export threejs code to plot the mesh with edges colored for the listed subdomains.
            Input is a dictionary with subdomain index:color pairs, output is a single json three.js mesh
            with the subdomains colored according to the input colors. """
        sd = self.get_subdomain_vector()
        c = ['black']*len(sd)

        for i, s in enumerate(sd):
            try:
                c[i] = subdomains[int(s)]
            except KeyError:
                pass

        jsondoc = self.mesh.export_to_three_js(colors = c)
        return jsondoc

    def _subdomains_to_html(self, filename, sd=1):
        sd = self.get_subdomain_vector()
        c = _compute_colors(sd)
        self.mesh._ipython_display_(filename, colors=c)
    
    def write_stochss_subdomain_file(self, filename="stochss_sdfile.txt"):
        # Write mesh and subdomain files for the StochSS UI
        sd = self.get_subdomain_vector()
        with open(filename,'w') as fd:
            for ndx,val in enumerate(sd):
                fd.write("{0},{1}\n".format(ndx,val))

    def display_mesh(self, subdomains):
        if isinstance(subdomains, int):
            jstr = self._subdomains_to_threejs(subdomains={1:'blue', subdomains:'red'})
        elif isinstance(subdomains, list):
            sd_in = {1:'blue'}
            for i in subdomains:
                sd_in[i] = 'red'
            jstr = self._subdomains_to_threejs(subdomains=sd_in)
        elif isinstance(subdomains, dict):
            jstr = self._subdomains_to_threejs(subdomains=subdomains)
        hstr = None
        with open(os.path.dirname(os.path.abspath(__file__))+"/data/three.js_templates/mesh.html",'r') as fd:
            hstr = fd.read()
        if hstr is None:
            raise Exception("could note open template mesh.html")
        hstr = hstr.replace('###PYURDME_MESH_JSON###',jstr)
        # Create a random id for the display div. This is to avioid multiple plots ending up in the same
        # div in Ipython notebook
        displayareaid=str(uuid.uuid4())
        hstr = hstr.replace('###DISPLAYAREAID###',displayareaid)
        html = '<div id="'+displayareaid+'" class="cell"></div>'
        IPython.display.display(IPython.display.HTML(html+hstr))



    ################################

    def create_stoichiometric_matrix(self):
        """ Generate a stoichiometric matrix in sparse CSC format. """

        if not hasattr(self, 'species_map'):
            self.__initialize_species_map()
        if self.get_num_reactions() > 0:
            ND = numpy.zeros((self.get_num_species(), self.get_num_reactions()))
            for i, r in enumerate(self.listOfReactions):
                R = self.listOfReactions[r]
                reactants = R.reactants
                products  = R.products

                for s in reactants:
                    ND[self.species_map[s], i] -= reactants[s]
                for s in products:
                    ND[self.species_map[s], i] += products[s]

            N = scipy.sparse.csc_matrix(ND)
        else:
            N = numpy.zeros((self.get_num_species(), self.get_num_reactions()))

        return N

    def create_dependency_graph(self):
        """ Construct the sparse dependency graph. """
        # We cannot safely generate a dependency graph (without attempting to analyze the propensity string itself)
        # if the model contains custom propensities.
        mass_action_model = True
        for name,reaction in self.listOfReactions.items():
            if not reaction.massaction:
                GF = numpy.ones((self.get_num_reactions(), self.get_num_reactions() + self.get_num_species()))
                mass_action_model = False

        if mass_action_model:
            GF = numpy.zeros((self.get_num_reactions(), self.get_num_reactions() + self.get_num_species()))
            species_map = self.get_species_map()

            involved_species = []
            reactants = []
            for name, reaction in self.listOfReactions.items():
                temp = []
                temp2 = []
                for s in reaction.reactants:
                    temp.append(species_map[s])
                    temp2.append(species_map[s])
                for s in reaction.products:
                    temp.append(species_map[s])
                involved_species.append(temp)
                reactants.append(temp2)

            species_to_reactions = []
            for species in self.listOfSpecies:
                temp = []
                for j,x in enumerate(reactants):
                    if species_map[species] in x:
                        temp.append(j)
                species_to_reactions.append(temp)


            reaction_to_reaction = []
            for name, reaction in self.listOfReactions.items():
                temp = []
                for s in reaction.reactants:
                    if species_to_reactions[species_map[s]] not in temp:
                        temp = temp+species_to_reactions[species_map[s]]

                for s in reaction.products:
                    if species_to_reactions[species_map[s]] not in temp:
                        temp = temp+ species_to_reactions[species_map[s]]

                temp = list(set(temp))
                reaction_to_reaction.append(temp)

            # Populate G
            for j, spec in enumerate(species_to_reactions):
                for s in spec:
                    GF[s,j] = 1

            for i,reac in enumerate(reaction_to_reaction):
                for r in reac:
                    GF[r,self.get_num_species()+i] = 1


        try:
            G = scipy.sparse.csc_matrix(GF)
        except Exception as e:
            G = GF

        return G


    def timespan(self, tspan):
        """ Set the time span of simulation. """
        self.tspan = tspan


    def _initialize_default_subdomain(self):
        """" Create a default subdomain function. The default is all voxels belong
             to subdomain 1.
        """

        subdomain = dolfin.MeshFunction("size_t", self.mesh, self.mesh.topology().dim()-1)
        subdomain.set_all(1)
        self.add_subdomain(subdomain)

    def _initialize_species_to_subdomains(self):
        """ Initialize the species mapping to subdomains. The default
            is that a species is active in all the defined subdomains.
        """
        sds = list(numpy.unique(self.get_subdomain_vector()))
        # This conversion is necessary for UFL not to choke on the subdomain ids.
        for i, sd in enumerate(sds):
            sds[i] = int(sd)
        try:
            sds.remove(0)
        except ValueError:
            pass

        # If a species is not present as key in the species_to_subdomain mapping,
        # we label it as active in all subdomains
        for spec_name in self.listOfSpecies:
            species = self.listOfSpecies[spec_name]
            if species not in self.species_to_subdomains.keys():
                self.species_to_subdomains[species] = sds

    def restrict(self, species, subdomains):
        """ Restrict the diffusion of a species to a subdomain. """
        self.species_to_subdomains[species] = subdomains

    def set_subdomain_vector(self, sd):
        """ Explicitly set the subdomain vector from an array. """
        self.sd = sd
        self.sd_initialized = True

    def get_subdomain_vector(self, subdomains=None):
        """ Create the 'sd' vector. 'subdomains' is a dolfin FacetFunction,
            and if no subdomain input is specified, they voxels default to
            subdomain 1. """
        if self.sd_initialized:
            return self.sd

        # We need to make sure that the highest dimension is applied
        # first, otherwise the cell level will overwrite all markings
        # applied on boundaries.

        if not hasattr(self,'xmesh'):
            self.create_extended_mesh()

        self.mesh.init()

        # TODO: Support arbitrary sd-numbers and more than one subdomain
        sd = numpy.ones(self.mesh.get_num_voxels())

        if len(self.subdomains) == 0:
            self.sd = sd
        else:
            if self.old_style_subdomain:
                subdomains = self.subdomains
            else:
                subdomains = OrderedDict()
                sdvec = dolfin.MeshFunction("size_t", self.mesh, self.mesh.topology().dim()-1)
                sdvec.set_all(1)
                for id, inst in self.subdomains.iteritems():
                    inst.mark(sdvec, id)
                subdomains[sdvec.dim()] = sdvec

            for dim, subdomain in subdomains.items():
                if dim == 0:
                    # If we define subdomains on vertex, ONLY use those.
                    # Then it is a direct copy to the sd
                    for ndx,val in enumerate(subdomain):
                        sd[ndx] = val
                    break
                else:
                    # Map all facet labels to vertex labels
                    tovertex = self.mesh.topology()(dim, 0)
                    for i in range(subdomain.size()):
                        for vtx in tovertex(i):
                            if subdomain[i] != 0: # TODO: Temporary hack to fix issue with Gmesh facet_region files.
                                sd[vtx] = subdomain[i]

        self.sd = sd
        self.sd_initialized = True
        return self.sd

    def initialize_initial_condition(self):
        """ Create all-zeros inital condition matrix. """
        ns = self.get_num_species()
        if self.xmesh == None:
            self.create_extended_mesh()
        nv = self.mesh.get_num_voxels()
        self.u0 = numpy.zeros((ns, nv))

    def create_extended_mesh(self):
        """ Extend the primary mesh with information about the degrees of freedom. """

        xmesh = URDMEXmesh()
        # Construct a species map (dict mapping model species name to an integer index)
        species_map = self.get_species_map()
        # Initialize the function spaces and dof maps.
        for spec in self.listOfSpecies:
            species = self.listOfSpecies[spec]
            spec_name = species.name
            spec_index = species_map[spec_name]
            xmesh.function_space[spec_name] = self.mesh.get_function_space()
            xmesh.vertex_to_dof_map[spec_name] = dolfin.vertex_to_dof_map(xmesh.function_space[spec_name])
            xmesh.vertex_to_dof_map[spec_name] = len(self.listOfSpecies) * xmesh.vertex_to_dof_map[spec_name] + spec_index
            xmesh.dof_to_vertex_map[spec_name] = dolfin.dof_to_vertex_map(xmesh.function_space[spec_name])


        xmesh.vertex = self.mesh.coordinates()
        self.xmesh = xmesh


    # Some utility routines to set initial conditions
    def set_initial_condition_scatter(self, spec_init, subdomains=None):
        """ Scatter an initial number of molecules over the voxels in a subdomain. """

        if not hasattr(self,"u0"):
            self.initialize_initial_condition()

        if not hasattr(self, 'xmesh'):
            self.create_extended_mesh()

        self._initialize_species_to_subdomains()

        self.get_subdomain_vector()

        for species in spec_init:

            if subdomains is None:
                subdomains = self.species_to_subdomains[species]

            spec_name = species.name
            num_spec = spec_init[species]
            species_map = self.get_species_map()
            specindx = species_map[spec_name]

            sd = self.sd
            table = []
            for i, ind in enumerate(sd):
                if ind in subdomains:
                    table.append(i)

            ltab = len(table)
            if ltab == 0:
                raise ModelException("set_initial_condition_scatter: No voxel in the given subdomains "+str(subdomains)+", check subdomain marking.")

            for mol in range(num_spec):
                vtx = numpy.random.randint(0, ltab)
                ind = table[vtx]
                self.u0[specindx, ind] += 1

    def set_initial_condition_distribute_uniformly(self, spec_init, subdomains=None):
        """ Place the same number of molecules of the species in each voxel. """
        if not hasattr(self, "u0"):
            self.initialize_initial_condition()

        if not hasattr(self, 'xmesh'):
            self.create_extended_mesh()

        self._initialize_species_to_subdomains()

        species_map = self.get_species_map()
        for spec in spec_init:
            if subdomains is None:
                subdomains = self.species_to_subdomains[spec]
            spec_name = spec.name
            num_spec = spec_init[spec]
            specindx = species_map[spec_name]
            for ndx in range(len(self.sd)):
                if self.sd[ndx] in subdomains:
                    self.u0[specindx, ndx] = num_spec
    
    
    def set_initial_condition_place_near(self, spec_init, point=None, add=False):
        """ Place all molecules of kind species in the voxel nearest a given point. The species existing previously in this voxel are reset if add is set to False"""


        if not hasattr(self, "u0"):
            self.initialize_initial_condition()

        if not hasattr(self, 'xmesh'):
            self.create_extended_mesh()

        for spec in spec_init:
            spec_name = spec.name
            num_spec = spec_init[spec]

            # Find the voxel with center (vertex) nearest to the point
            #reppoint = numpy.tile(point, (shape[0], 1))
            #dist = numpy.sqrt(numpy.sum((coords-reppoint)**2, axis=1))
            #ix = numpy.argmin(dist)
            ix = self.mesh.closest_vertex(point)
            species_map = self.get_species_map()
            specindx = species_map[spec_name]
            #dofind = self.xmesh.vertex_to_dof_map[spec_name][ix]
            #ix = (dofind - specindx) / len(species_map)
            self.u0[specindx, ix] = (self.u0[specindx,ix] if add else 0) + num_spec

    def set_initial_condition_place_voxel(self, spec_init, voxel,add=False):
        """Place all molecules of kind species in the given voxel. The species existing previously in this voxel are reset if add is set to False"""

        if not hasattr(self, "u0"):
            self.initialize_initial_condition()

        if not hasattr(self, 'xmesh'):
            self.create_extended_mesh()

        for spec in spec_init:
            spec_name = spec.name
            num_spec = spec_init[spec]

            species_map = self.get_species_map()
            specindx = species_map[spec_name]
            self.u0[specindx, voxel] = (self.u0[specindx,voxel] if add else 0) + num_spec

    def create_system_matrix(self):
        """ Create the system (diffusion) matrix for input to the URDME solvers. The matrix
            is built by concatenating the individually assembled matrices for each of the species,
            and multiplying with the lumped mass matrix (which define the volume of the voxels).

            Negative off-diagonal elements in the matrix are set to zero, and the diagonal is renormalized
            in order to assure that the returned matrix is a Markov transition matrix.

            Returns a dictionary containing the volumes of the subvolumes, the system diffusion matrix
            and the fraction of the mass of the negative off-diagonal elements that has been filtered out.

            """

        import time

        # Check if the individual stiffness and mass matrices (per species) have been assembled, otherwise assemble them.
        if self.stiffness_matrices is not None and self.mass_matrices is not None:
            stiffness_matrices = self.stiffness_matrices
            mass_matrices = self.mass_matrices
        else:
            if self.mesh is None:
                raise ModelException("This model has no mesh, can not create system matrix.")
            matrices = self.assemble()
            self.stiffness_matrices = matrices['K']
            self.mass_matrices = matrices['M']
            stiffness_matrices = self.stiffness_matrices
            mass_matrices = self.mass_matrices

        # Make a dok matrix of dimension (Ndofs,Ndofs) for easier manipulatio
        i = 1
        Mspecies = len(self.listOfSpecies)
        if Mspecies == 0:
            raise ModelException("The model has no species, can not create system matrix.")
        # Use dolfin 'dof' number of voxels, not the number of verticies
        Nvoxels = self.mesh.get_num_dof_voxels()
        Ndofs = Nvoxels*Mspecies

        # Create the volume vector by lumping the mass matrices
        vol = numpy.zeros((Ndofs, 1))
        spec = 0

        xmesh = self.xmesh

        for species, M in mass_matrices.iteritems():

            #dof2vtx = xmesh.dof_to_vertex_map[species]
            rows, cols, vals = M.data()
            SM = scipy.sparse.csr_matrix((vals, cols, rows))
            vols = SM.sum(axis=1)

            spec = self.species_map[species]
            for j in range(len(vols)):
                #vx = dof2vtx[j]  # need to use dof ordering
                vx = j
                dof = Mspecies*vx+spec
                vol[dof, 0] = vols[j]

        # This is necessary in order for the array to have the right dimension (Ndofs,1)
        vol = vol.flatten()

        # Assemble one big matrix from the indiviudal stiffness matrices. Multiply by the inverse of
        # the lumped mass matrix, filter out any entries with the wrong sign and renormalize the columns.
        spec = 0
        positive_mass = 0.0
        total_mass = 0.0


        sd = self.get_subdomain_vector()
        sd_vec_dof = numpy.zeros(self.mesh.get_num_dof_voxels())
        vertex_to_dof = dolfin.vertex_to_dof_map(self.mesh.get_function_space())
        for ndx, sd_val in enumerate(sd):
            sd_vec_dof[vertex_to_dof[ndx]] = sd_val
        sd = sd_vec_dof

        tic  = time.time()
        # If a volume is zero, we need to set it to 1.
        vi = vol+(vol<=0.0)

        S = scipy.sparse.dok_matrix((Ndofs, Ndofs))


        keys = []
        values = []

        for species, K in stiffness_matrices.iteritems():

            rows, cols, vals = K.data()

            # Filter the matrix: get rid of all elements < 0 (inlcuding the diagonal)
            vals *= vals<0
            Kcrs = scipy.sparse.csr_matrix((vals, cols, rows))

            sdmap  = self.species_to_subdomains[self.listOfSpecies[species]]

            # Filter the matrix: get rid of all elements < 0 (inlcuding the diagonal)
            Kdok = Kcrs.todok()


            for ind, val in Kdok.iteritems():

                ir = ind[0]
                ij = ind[1]

                # Check if this is an edge that the species should diffuse along,
                # if not, set the diffusion coefficient along this edge to zero. This is
                # equivalent to how boundary species are handled in the current Matlab interface.
                if sd[ir] not in sdmap:
                    val = 0.0

                S[Mspecies*ir+spec, Mspecies*ij+spec] = -val/vi[Mspecies*ij+spec]

            spec = spec + 1

        sumcol = S.tocsr().sum(axis=0)
        S.setdiag(-numpy.array(sumcol).flatten())

        D = S.tocsc()

        if total_mass == 0.0:
            return {'vol':vol, 'D':D, 'relative_positive_mass':None}
        else:
            return {'vol':vol, 'D':D, 'relative_positive_mass':positive_mass/total_mass}


    def validate(self, urdme_solver_data):
        """ Validate the model data structures.

            validate should be called prior to writing the model to the solver input file,
            since the solvers themselves do very limited error checking of the input.

        """

        for spec_name, species in self.listOfSpecies.items():
            if 0 in self.species_to_subdomains[species]:
                raise ModelException("Subdomain number 0 is reserved. Please check your model.")

        # Check that all the columns of the system matrix sums to zero (or close to zero). If not, it does
        # not define a Markov process and the solvers might segfault or produce erraneous results.
        colsum = numpy.abs(urdme_solver_data['D'].sum(axis=0))
        colsum = colsum.flatten()
        maxcolsum = numpy.argmax(colsum)
        if colsum[0,maxcolsum] > 1e-10:
            D = urdme_solver_data["D"]
            raise InvalidSystemMatrixException("Invalid diffusion matrix. The sum of the columns does not sum to zero. " + str(maxcolsum) + ' ' + str(colsum[0,maxcolsum]) + "\nThis can be caused by a large difference between the largest and smallest diffusion coefficients.")

    def create_connectivity_matrix(self):
        """ Assemble a connectivity matrix in CCS format. """

        fs = self.mesh.get_function_space()
        trial_function = dolfin.TrialFunction(fs)
        test_function = dolfin.TestFunction(fs)
        a_K = -1*dolfin.inner(dolfin.nabla_grad(trial_function), dolfin.nabla_grad(test_function)) * dolfin.dx
        K = dolfin.assemble(a_K)
        rows, cols, vals = K.data()
        Kcrs = scipy.sparse.csc_matrix((vals, cols, rows))
        return Kcrs

    def get_solver_datastructure(self):
        """ Return the datastructures needed by the URDME solvers.

           get_solver_datastructure() creates and populates a dictionary, urdme_solver_data,
           containing the mandatory input data structures of the core NSM solver in URDME
           that is derived from the model. The data strucyures are

           D    - the Diffusion matrix
           N    - the stochiometry matrix
           G    - the dependency graph
           vol  - the volume vector
           sd   - the subdomain vector
           data - the data vector
           u0   - the intial condition

           This data is also returned, unlike in the Matlab URDME interface

           p - the vertex coordinates
           K - a (Nvoxel x Nvoxel) connectivity matrix

        """
        urdme_solver_data = {}
        num_species = self.get_num_species()

        # Stoichimetric matrix
        N = self.create_stoichiometric_matrix()
        urdme_solver_data['N'] = N
        # Dependency Graph
        G = self.create_dependency_graph()
        urdme_solver_data['G']  = G

        # Volume vector
        result =  self.create_system_matrix()
        vol = result['vol']
        urdme_solver_data['dofvolumes'] = vol

        #TODO: Make use of all dofs values, requires modification of CORE URDME...
        self.dofvol = vol[::len(self.listOfSpecies)]
        urdme_solver_data['vol'] = self.dofvol

        D = result['D']
        urdme_solver_data['D'] = D

        #
        num_dofvox = self.dofvol.shape[0]

        # Get vertex to dof ordering
        vertex_to_dof = dolfin.vertex_to_dof_map(self.mesh.get_function_space())
        dof_to_vertex = dolfin.dof_to_vertex_map(self.mesh.get_function_space())

        vertex_to_dof_to_vertex = dof_to_vertex[vertex_to_dof]

        # Subdomain vector
        # convert to dof ordering
        sd_vec_dof = numpy.zeros(num_dofvox)
        for ndx, sd_val in enumerate(self.get_subdomain_vector()):
            sd_vec_dof[vertex_to_dof[ndx]] = sd_val
        urdme_solver_data['sd'] = sd_vec_dof

        # Data vector. If not present in model, it defaults to a vector with all elements zero.
        # convert to dof ordering
        data = numpy.zeros((1, num_dofvox))
        if len(self.listOfDataFunctions) > 0:
            data = numpy.zeros((len(self.listOfDataFunctions), num_dofvox))
            coords = self.mesh.coordinates()
            for ndf, df in enumerate(self.listOfDataFunctions):
                for ndx in range(len(coords)):
                    vox_coords = numpy.zeros(3)
                    for cndx in range(len(coords[ndx])):
                        vox_coords[cndx] = coords[ndx][cndx]
                    data[ndf][vertex_to_dof[ndx]] = df.map(vox_coords)

        urdme_solver_data['data'] = data

        if not hasattr(self,'u0'):
            self.initialize_initial_condition()

        # Initial Conditions, convert to dof ordering
        u0_dof = numpy.zeros((num_species, num_dofvox))
        for vox_ndx in range(self.mesh.get_num_voxels()):
            dof_ndx = vertex_to_dof[vox_ndx]
            # With periodic BCs the same dof_ndx voxel will get written to twice
            # which may overwrite the value.  We need to check for this case.
            if vertex_to_dof_to_vertex[vox_ndx] != vox_ndx:
                vox_ndx2 = vertex_to_dof_to_vertex[vox_ndx]
                for cndx in range(num_species):
                    if self.u0[cndx, vox_ndx] == 0 or self.u0[cndx, vox_ndx] == self.u0[cndx, vox_ndx2]:
                        u0_dof[cndx, dof_ndx] = self.u0[cndx, vox_ndx]
                    elif self.u0[cndx, vox_ndx2] == 0 and vox_ndx < vox_ndx2:
                        self.u0[cndx, vox_ndx2] = self.u0[cndx, vox_ndx]
                    elif self.u0[cndx, vox_ndx2] == 0 and vox_ndx > vox_ndx2:
                        u0_dof[cndx, dof_ndx] = self.u0[cndx, vox_ndx]
                    else:
                        sys.stderr.write("Warning: the initial condition for species {0} in voxel {1} will be discarded due to periodic boundary conditions.\n".format(self.listOfSpecies.keys()[cndx], vox_ndx))
            else:
                for cndx in range(num_species):
                    u0_dof[cndx, dof_ndx] = self.u0[cndx, vox_ndx]
        urdme_solver_data['u0'] = u0_dof

        tspan = numpy.asarray(self.tspan, dtype=numpy.float)
        urdme_solver_data['tspan'] = tspan

        # Vertex coordinates
        # convert to dof ordering
        p_dof = numpy.zeros((num_dofvox, 3))
        for vox_ndx, row in enumerate(self.mesh.get_voxels()):
            p_dof[vertex_to_dof[vox_ndx],:len(row)] = row
        urdme_solver_data['p'] = p_dof

        # Connectivity matrix
        urdme_solver_data['K'] = self.create_connectivity_matrix()

        urdme_solver_data['report']=0

        return urdme_solver_data


    def assemble(self):
        """  Assemble the mass and stiffness matrices using Dolfin.

            Returns: A dictionary containing two dictionaries, one for the stiffness matrices
            and one for the mass matrices. Those dictionaries has the species names as keys and
            the matrices are in CSR format.
            """

        if self.xmesh == None:
            self.create_extended_mesh()

        self._initialize_species_to_subdomains()

        function_space = self.xmesh.function_space
        trial_functions = OrderedDict()
        test_functions = OrderedDict()
        stiffness_matrices = OrderedDict()
        mass_matrices = OrderedDict()

        # The maximum dimension that a species is active on (currently not used)
        maxdim = 1
        for spec in self.listOfSpecies:
            dim = self.listOfSpecies[spec].dim()
            if dim > maxdim:
                maxdim = dim

        for spec in self.listOfSpecies:
            trial_functions[spec] = dolfin.TrialFunction(function_space[spec])
            test_functions[spec] = dolfin.TestFunction(function_space[spec])


        weak_form_K = {}
        weak_form_M = {}

        ndofs = None

        # Set up the forms
        for spec_name, species in self.listOfSpecies.items():

            # Find out what subdomains this species is active on
            weak_form_K[spec_name] = dolfin.inner(dolfin.nabla_grad(trial_functions[spec_name]), dolfin.nabla_grad(test_functions[spec_name]))*dolfin.dx
            weak_form_M[spec_name] = trial_functions[spec_name]*test_functions[spec_name]*dolfin.dx

        # Assemble the matrices
        for spec_name, species in self.listOfSpecies.items():
            stiffness_matrices[spec_name] = dolfin.assemble(weak_form_K[spec_name])
            if ndofs is None:
                ndofs = stiffness_matrices[spec_name].size(0)
                self.mesh.set_num_dof_voxels(ndofs)

            # We cannot include the diffusion constant in the assembly, dolfin does not seem to deal well
            # with small diffusion constants (drops small elements)
            stiffness_matrices[spec_name] = species.diffusion_constant * stiffness_matrices[spec_name]
            mass_matrices[spec_name] = dolfin.assemble(weak_form_M[spec_name])


        return {'K':stiffness_matrices, 'M':mass_matrices}

    def run(self, number_of_trajectories=1, solver='nsm', seed=None, report_level=0):
        """ Simulate the model.

        Args:
            solver: A str or class type that is a subclass of URDMESolver.  Default: NSM solver.
            number_of_trajectories: How many trajectories should be run.
            seed: An int, the random seed given to the solver.
            report_level: An int, Level of output from the solver: 0, 1, or 2. Default: 0.
        Returns:
            A URDMEResult object with the results of the simulation.
        """

        #If solver is a subclass of URDMESolver, use it directly.
        if isinstance(solver, (type, types.ClassType)) and  issubclass(solver, URDMESolver):
            sol = solver(self, report_level=report_level)
        elif type(solver) is str:
            if solver == 'nsm':
                from nsmsolver import NSMSolver
                sol = NSMSolver(self, report_level=report_level)
            else:
                raise URDMEError("Unknown solver: {0}".format(solver_name))
        else:
            raise URDMEError("solver argument to urdme() must be a string or a URDMESolver class object.")

        return sol.run(number_of_trajectories=number_of_trajectories, seed=seed)


class URDMEMesh(dolfin.Mesh):
    """ A URDME mesh extends the Dolfin mesh class.

        Provides wrappers around dolfins built-in simple geometries/mesh generation function.
        These following methods will all give regular meshes that will produce discretizations that are equivalent to Cartesian grids.
    """

    def __init__(self, mesh=None):
        self.constrained_domain = None
        dolfin.Mesh.__init__(self, mesh)
        self.function_space = None
        self.num_dof_voxels = None
        self.init()


    def __getstate__(self):

        state = {}
        state['function_space'] = None

        tmpfile = tempfile.NamedTemporaryFile(suffix=".xml")
        dolfin.File(tmpfile.name) << self
        tmpfile.seek(0)

        state['meshdata'] = tmpfile.read()
        tmpfile.close()

        if self.constrained_domain is not None:
            # Warning: This is black magic.
            try:
                cdd = {}
                cdd['source'] = inspect.getsource(self.constrained_domain.__class__)
                cdd['name'] = self.constrained_domain.__class__.__name__
                cdd['dict'] = {}
                for k,v in self.constrained_domain.__dict__.iteritems():
                    if type(v).__name__ != 'SwigPyObject':
                        cdd['dict'][k] = v
                state['constrained_domain'] = cdd
            except Exception as e:
                sys.stderr.write("error pickling mesh.constrained_domain: {0}\n".format(e))
                raise e
        if self.num_dof_voxels is not None:
            state['num_dof_voxels'] = self.num_dof_voxels

        return state

    def __setstate__(self,state):
        """ Used by pickle to set state when unpickling. """

        try:
            fd = tempfile.NamedTemporaryFile(suffix=".xml")
            fdname = fd.name
            fd.write(state['meshdata'])
            fd.seek(0)
            self.__init__(fd.name)

            if 'constrained_domain' in state and state['constrained_domain'] is not None:
                # Black magic to match that in __getstate__
                cdd = state['constrained_domain']
                compiled_class = compile(cdd['source'], 'pyurdme.mesh.constrained_domain', 'exec')
                eval(compiled_class)
                compiled_object = eval("{0}()".format(cdd['name']))
                for k,v in cdd['dict'].iteritems():
                    compiled_object.__dict__[k] = v
                self.constrained_domain = compiled_object
            if 'num_dof_voxels' in state and state['num_dof_voxels'] is not None:
                self.num_dof_voxels = state['num_dof_voxels']
        except Exception as e:
            print "Error unpickling model, could not recreate the mesh."
            raise e

    def add_periodic_boundary_condition(self, domain):
        """ Add a periodic boundary mapping object (a subclass of dolfin.SubDomain). """
        self.constrained_domain = domain

    def get_function_space(self):
        """ Get the FunctionSpace dolfin object for this mesh. """
        if self.function_space is not None:
            return self.function_space
        else:
            if self.constrained_domain is not None:
                fs = dolfin.FunctionSpace(self, "Lagrange", 1, constrained_domain=self.constrained_domain)
            else:
                fs = dolfin.FunctionSpace(self, "Lagrange", 1)
            self.function_space = fs
            return fs

    def get_num_voxels(self):
        """ Get the number of voxels in the vertex ordering. """
        return self.num_vertices()

    def set_num_dof_voxels(self, num):
        """ Set the number of voxels in the DOF ordering. """
        self.num_dof_voxels = num

    def get_num_dof_voxels(self):
        """ Get the number of voxels in the DOF ordering. """
        if self.num_dof_voxels is None:
            raise URDMEError('NumDofVoxels is not set')
        return self.num_dof_voxels

    def get_voxels(self):
        """ Return the (x,y,z) coordinate of each voxel. """
        coords = self.coordinates()
        if coords.shape[1] == 2:
            coords = numpy.append(coords, numpy.tile([0],(coords.shape[0],1)), 1)
        return coords

    def closest_vertex(self,x):
        """ Get index of the vertex in the coordinate list closest to the point x. """
        coords = self.get_voxels()
        shape = coords.shape

        if isinstance(x,(int,float)):
            x = [x]

        if len(x) == 2:
            point = numpy.append(x,0.0)
        else:
            point = x
        reppoint = numpy.tile(point, (shape[0], 1))
        dist = numpy.sqrt(numpy.sum((coords-reppoint)**2, axis=1))
        ix = numpy.argmin(dist)
        return ix

    def get_mesh_size(self):
        """ Estimate of mesh size at each vertex. """
        coordinates = self.coordinates()

        # Compute the circumradius of the cells
        cr = []
        for i in range(self.num_cells()):
            cell = dolfin.Cell(self, i)
            cr.append(cell.diameter()/2.0)

        # Compute the mean for each vertex based on all incident cells
        vtx2cell = self.topology()(0,self.topology().dim())
        vtxh = []
        for i in range(self.num_vertices()):
            v2c = vtx2cell(i)
            h = 0.0
            for indx in v2c:
                h += cr[indx]
            h = h/len(v2c)
            vtxh.append(h)

        return vtxh

    def get_normalized_coordinates(self):
        """ Return vertex coordinates centered at origin. """

        # Compute mesh centroid
        vtx = self.coordinates()
        centroid = numpy.mean(vtx,axis=0)
        # Shift so the centroid is now origo
        normalized_vtx = numpy.zeros(numpy.shape(vtx))
        for i,v in enumerate(vtx):
            normalized_vtx[i,:] = v - centroid

        return normalized_vtx

    def get_scaled_normalized_coordinates(self):
        """ Return vertex coordinates scaled to the interval (-1,1) and centered at origin. """
        # Scale the verices so the max dimension is in the range (-1,1) to be compatible with the browser display
        vtx = self.coordinates()
        maxvtx = numpy.max(numpy.amax(vtx,axis=0))
        factor = 1/maxvtx
        vtx = factor*vtx

        # Compute mesh centroid
        centroid = numpy.mean(vtx,axis=0)
        # Shift so the centroid is now origo
        normalized_vtx = numpy.zeros(numpy.shape(vtx))
        for i,v in enumerate(vtx):
            normalized_vtx[i,:] = v - centroid


        return factor, normalized_vtx

    def get_scaled_coordinates(self):
        """ Return vertex coordinates scaled to the interval (-1,1). """
        # Scale the verices so the max dimension is in the range (-1,1) to be compatible with the browser display
        vtx = self.coordinates()
        maxvtx = numpy.max(numpy.amax(vtx,axis=0))
        factor = 1/maxvtx
        return factor, factor*vtx

    @classmethod
    def generate_unit_interval_mesh(cls, nx, periodic=False):
        """ Unit Interval (1D) of with nx points in the axes. """
        return cls.generate_interval_mesh(nx=nx, a=0, b=1, periodic=periodic)

    @classmethod
    def generate_unit_square_mesh(cls, nx, ny, periodic=False):
        """ Unit Square (2D) of with nx, ny points in the respective axes. """
        return cls.generate_square_mesh(L=1, nx=nx, ny=ny, periodic=periodic)

    @classmethod
    def generate_unit_cube_mesh(cls, nx, ny, nz, periodic=False):
        """ Unit Cube (3D) of with nx, ny, nz points in the respective axes. """
        return cls.generate_cube_mesh(L=1,nx=nx, ny=ny, nz=nz, periodic=periodic)

    @classmethod
    def generate_interval_mesh(cls, nx, a, b, periodic=False):
        """ Interval (1D) of with nx points in the axes, and side length L. """
        mesh = dolfin.IntervalMesh(nx, a, b)
        ret = URDMEMesh(mesh)
        if isinstance(periodic, bool) and periodic:
            ret.add_periodic_boundary_condition(IntervalMeshPeriodicBoundary(a=a, b=b))
        elif isinstance(periodic, dolfin.SubDomain):
            ret.add_periodic_boundary_condition(periodic)
        return ret

    @classmethod
    def generate_square_mesh(cls, L, nx, ny, periodic=False):
        """ Unit Square (2D) of with nx, ny points in the respective axes, and side length L. """
        mesh = dolfin.RectangleMesh(0, 0, L, L, nx, ny)
        ret = URDMEMesh(mesh)
        if isinstance(periodic, bool) and periodic:
            ret.add_periodic_boundary_condition(SquareMeshPeriodicBoundary(Lx=L, Ly=L))
        elif isinstance(periodic, dolfin.SubDomain):
            ret.add_periodic_boundary_condition(periodic)
        return ret

    @classmethod
    def generate_cube_mesh(cls, L, nx, ny, nz, periodic=False):
        """ Unit Cube (3D) of with nx, ny, nz points in the respective axes, and side length L. """
        mesh = dolfin.BoxMesh(0, 0, 0, L, L, L, nx, ny, nz)
        ret = URDMEMesh(mesh)
        if isinstance(periodic, bool) and periodic:
            ret.add_periodic_boundary_condition(CubeMeshPeriodicBoundary(Lx=L, Ly=L, Lz=L))
        elif isinstance(periodic, dolfin.SubDomain):
            ret.add_periodic_boundary_condition(periodic)
        return ret

    @classmethod
    def read_dolfin_mesh(cls, filename=None, colors = []):
        """ Import a mesh in Dolfins native .xml format """

        try:
            dolfin_mesh = dolfin.Mesh(filename)
            mesh = URDMEMesh(mesh=dolfin_mesh)
            return mesh
        except Exception as e:
            raise MeshImportError("Failed to import mesh: " + filename+"\n" + str(e))

    @classmethod
    def read_mesh(cls, filename=None, colors = []):
        """Import a mesh in gmsh .msh or Dolfins .xml format"""
        if filename[-4:]==".msh":
            #if the input file is a .msh, we convert it into a Dolfin .xml
            subprocess.call(["dolfin-convert",filename,filename[:-4]+".xml"])
        mesh = cls.read_dolfin_mesh(filename[:-4]+".xml",colors)
        return mesh

    @classmethod
    def read_geometry(cls, filename=None, dimension=2, clscale=1, colors=[]):
        """Import a mesh from a geometry"""
        mesh_filename = (filename[:-4] if filename[-4:]==".geo" else filename)+".msh"
        subprocess.call(["gmsh","-"+str(dimension),"-clscale",str(clscale),filename,"-o",mesh_filename])
        mesh = cls.read_mesh(mesh_filename,colors)
        return mesh

    def export_to_three_js(self, colors = None):
        """ return a Json string of the mesh in THREE Js format.

            If a colors list is specified, it should have the num_voxels entries
        """
        self.init(2,0)
        document = {}
        document["metadata"] = {"formatVersion":3}
        gfdg,vtx = self.get_scaled_normalized_coordinates()

        if self.topology().dim() == 2:
            # 2D
            num_elements = self.num_cells()
            # This is a fix for the built-in 2D meshes that only have x,y-coordinates.
            dims = numpy.shape(vtx)
            if dims[1] == 2:
                vtxx = numpy.zeros((dims[0],3))
                for i, v in enumerate(vtx):
                    vtxx[i,:]=(list(v)+[0])
                vtx = vtxx
        else:
            # 3D
            num_elements = self.num_facets()

        materials = [ {
                     "DbgColor" : 15658734,
                     "DbgIndex" : 0,
                     "DbgName" : "dummy",
                     "colorDiffuse" : [ 1, 0, 0 ],
                     } ]

        document["materials"] = materials
        document["vertices"] = list(vtx.flatten())

        if colors == None:
            # Default color is blue
            colors = [255]*self.num_vertices()

        document["colors"] = colors

        connectivity = self.topology()(2,0)
        faces = []

        for i in range(num_elements):
            face = connectivity(i)
            f = []
            for ind in face:
                if int(ind) >= self.num_vertices():
                    raise Exception("Out of bounds")

                f.append(int(ind))
            faces += ([128]+f+f)
        document["faces"] = list(faces)

        #Test that we can index into vertices
        vertices = document["vertices"]

        return json.dumps(document)

    def _ipython_display_(self, filename=None,colors=None):
        jstr = self.export_to_three_js(colors=colors)
        hstr = None
        with open(os.path.dirname(os.path.abspath(__file__))+"/data/three.js_templates/mesh.html",'r') as fd:
            hstr = fd.read()
        if hstr is None:
            raise Exception("could note open template mesh.html")
        hstr = hstr.replace('###PYURDME_MESH_JSON###',jstr)
        # Create a random id for the display div. This is to avioid multiple plots ending up in the same
        # div in Ipython notebook
        displayareaid=str(uuid.uuid4())
        hstr = hstr.replace('###DISPLAYAREAID###',displayareaid)
        html = '<div id="'+displayareaid+'" class="cell"></div>'

        if filename != None:
            with open(filename, 'w') as fd:
                fd.write("""
<html>
    <head>
        <title>PyURDME Result</title> <style>canvas { width: 100%; height: 100% }</style> </head>

        <body>
""")
                fd.write(html+hstr)
                fd.write("""
        </body>

</html>""")
        else:
            IPython.display.display(IPython.display.HTML(html+hstr))



class URDMEXmesh():
    """ Extended mesh object.

        Contains function spaces and dof mappings.
    """

    def __init__(self):
        self.coordinates = None
        self.function_space = {}
        self.vertex_to_dof_map = {}
        self.dof_to_vertex_map = {}


class URDMEResult(dict):
    """ Result object for a URDME simulation, extends the dict object. """

    def __init__(self, model=None, filename=None, loaddata=False):
        self.model = model
        self.sol = None
        self.U = None
        self.tspan = None
        self.data_is_loaded = False
        self.sol_initialized = False
        self.filename = filename
        if filename is not None and loaddata:
            self.read_solution()

    def __ne__(self, other):
        return not self.__eq__(other)

    def __eq__(self, other, verbose=False):
        try:
            tspan = self.get_timespan()
            if numpy.any(tspan != other.get_timespan()):
                if verbose: print "tspan does not match"
                return False
            for t in tspan:
                for sname in self.model.listOfSpecies:
                    if numpy.any(self.get_species(sname, timepoints=t) != other.get_species(sname, timepoints=t)):
                        if verbose: print "Species {0} does not match at t={1}".format(sname, t)
                        return False
            return True
        except ValueError as e:
            if verbose: print "value error: {0}".format(e)
            return False


    def get_endtime_model(self):
        """ Return a URDME model object with the initial conditions set to the final time point of the
            result object.
        """
        if self.model is None:
            raise Exception("can not continue a result with no model")
        # create a soft copy
        model_str = pickle.dumps(self.model)
        model2 = pickle.loads(model_str)
        # set the initial conditions
        model2.u0 = numpy.zeros(self.model.u0.shape)
        for s, sname in enumerate(self.model.listOfSpecies):
            model2.u0[s,:] = self.get_species(sname, timepoints=-1)
        return model2


    def __getstate__(self):
        """ Used by pickle to get state when pickling. We need to read the contents of the
        output file since we can't pickle file objects. """

        try:
            with open(self.filename,mode='rb') as fh:
                filecontents = fh.read()
        except Exception as e:
            raise Exception(("Error pickling model. Failed to read result file:",str(e)))

        state = self.__dict__
        state["filecontents"] = filecontents

        state["v2d"] = self.get_v2d()
        state["d2v"] = self.get_d2v()

        return state


    def __setstate__(self, state):
        """ Used by pickle to set state when unpickling. """

        # If the object contains filecontents, write those to a new tmp file.
        try:
            filecontents = state.pop("filecontents",None)
            fd = tempfile.NamedTemporaryFile(delete=False, dir=os.environ.get('PYURDME_TMPDIR'))
            with open(fd.name, mode='wb') as fh:
                fh.write(filecontents)
            state["filename"] = fd.name
        except Exception as e:
            print "Error unpickling model, could not recreate the solution file."
            raise e

        for k,v in state.items():
            self.__dict__[k] = v

    def get_v2d(self):
        """ Return the vertex-to-dof mapping. """
        if not hasattr(self, 'v2d'):
            fs = self.model.mesh.get_function_space()
            self.v2d = dolfin.vertex_to_dof_map(fs)

        return self.v2d

    def get_d2v(self):
        """ Return the dof-to-vertex mapping. """
        if not hasattr(self, 'd2v'):
            fs = self.model.mesh.get_function_space()
            self.d2v = dolfin.dof_to_vertex_map(fs)

        return self.d2v

    def _reorder_dof_to_voxel(self, M, num_species=None):
        """ Reorder the colums of M from dof ordering to vertex ordering. """

        v2d = self.get_v2d()
        if len(M.shape) == 1:
            num_timepoints = 1
        else:
            num_timepoints = M.shape[0]
        num_vox = self.model.mesh.get_num_voxels()
        if num_species is None:
            num_species = self.model.get_num_species()
        num_dofs = num_vox*num_species
        C = numpy.zeros((num_timepoints, num_dofs), dtype=numpy.float64)

        for vox_ndx in range(num_vox):
            for cndx in range(num_species):
                try:
                    if len(M.shape) == 1:
                        C[:, vox_ndx*num_species+cndx] = M[v2d[vox_ndx]*num_species+cndx]
                    else:
                        C[:, vox_ndx*num_species+cndx] = M[:, v2d[vox_ndx]*num_species+cndx]
                except IndexError as e:
                    import traceback
                    #traceback.print_stack()
                    print traceback.format_exc()
                    print "C.shape: ", C.shape
                    print "M.shape: ", M.shape
                    print "num_timepoints: ", num_timepoints
                    print "vox_ndx={0},num_species={1},cndx={2}".format(vox_ndx,num_species,cndx)
                    print "v2d[vox_ndx]={0}".format(v2d[vox_ndx])
                    print "vox_ndx*num_species+cndx={0}".format(vox_ndx*num_species+cndx)
                    print "v2d[vox_ndx]*num_species+cndx={0}".format(v2d[vox_ndx]*num_species+cndx)
                    raise e
        return C

    def read_solution(self):
        """ Read the tspan and U matrix into memory. """

        resultfile = h5py.File(self.filename, 'r')
        U = resultfile['U']
        U = numpy.array(U)

        tspan = resultfile['tspan']
        tspan = numpy.array(tspan).flatten()
        resultfile.close()

        # Reorder the dof from dof ordering to voxel ordering
        U = self._reorder_dof_to_voxel(U)

        self.U = U
        self.tspan = tspan
        self.data_is_loaded = True

    def get_timespan(self):
        if self.tspan is not None:
            resultfile = h5py.File(self.filename, 'r')
            tspan = resultfile['tspan']
            tspan = numpy.array(tspan).flatten()
            resultfile.close()
            self.tspan = tspan
        return self.tspan

    def get_species(self, species, timepoints="all", concentration=False):
        """ Returns a slice (view) of the output matrix U that contains one species for the timepoints
            specified by the time index array. The default is to return all timepoints.

            Data is loaded by slicing directly in the hdf5 dataset, i.e. it the entire
            content of the file is not loaded in memory and the U matrix
            is never added to the object.

            if concentration is False (default), the integer, raw, trajectory data is returned,
            if set to True, the concentration (=copy_number/volume) is returned.

        """

        if isinstance(species, Species):
            spec_name = species.name
        else:
            spec_name = species

        species_map = self.model.get_species_map()
        num_species = self.model.get_num_species()

        spec_indx = species_map[spec_name]

        resultfile = h5py.File(self.filename, 'r')
        #Ncells = self.model.mesh.num_vertices()  # Need dof ordering numVoxels
        U = resultfile['U']
        Ncells = U.shape[1]/num_species

        if timepoints  ==  "all":
            Uslice= U[:,(spec_indx*Ncells):(spec_indx*Ncells+Ncells)]
        else:
            Uslice = U[timepoints,(spec_indx*Ncells):(spec_indx*Ncells+Ncells)]

        if concentration:
            Uslice = self._copynumber_to_concentration(Uslice)

        # Reorder the dof from dof ordering to voxel ordering
        Uslice = self._reorder_dof_to_voxel(Uslice, num_species=1)

        # Make sure we return 1D slices as flat arrays
        dims = numpy.shape(Uslice)
        if dims[0] == 1:
            Uslice = Uslice.flatten()

        resultfile.close()
        return Uslice


    def __setattr__(self, k, v):
        if k in self.keys():
            self[k] = v
        elif not hasattr(self, k):
            self[k] = v
        else:
            raise AttributeError, "Cannot set '%s', cls attribute already exists" % ( k, )

    def __setupitems__(self, k):
        if k == 'sol' and not self.sol_initialized:
            self._initialize_sol()
        elif (k == 'U' or k == 'tspan') and not self.data_is_loaded:
            if self.filename is None:
                raise AttributeError("This result object has no data file.")
            self.read_solution()

    def __getitem__(self, k):
        self.__setupitems__(k)
        if k in self.keys():
            return self.get(k)
        raise KeyError("Object has no attribute {0}".format(k))

    def __getattr__(self, k):
        self.__setupitems__(k)
        if k in self.keys():
            return self.get(k)
        raise AttributeError("Object has no attribute {0}".format(k))

    def __del__(self):
        """ Deconstructor. """
            #   if not self.data_is_loaded:
        try:
            # Clean up data file
            os.remove(self.filename)
        except OSError as e:
            #print "URDMEResult.__del__: Could not delete result file'{0}': {1}".format(self.filename, e)
            pass

    @deprecated
    def _initialize_sol(self):
        """ Initialize the sol variable. This is a helper function for export_to_vtk(). """

        # Create Dolfin Functions for all the species
        sol = {}

        if self.model is None:
            raise URDMEError("URDMEResult.model must be set before the sol attribute can be accessed.")
        numvox = self.model.mesh.num_vertices()
        fs = self.model.mesh.get_function_space()
        vertex_to_dof_map = self.get_v2d()
        dof_to_vertex_map = self.get_d2v()

        # The result is loaded in dolfin Functions, one for each species and time point
        for i, spec in enumerate(self.model.listOfSpecies):

            species = self.model.listOfSpecies[spec]
            spec_name = species.name

            spec_sol = {}
            for j, time in enumerate(self.tspan):

                func = dolfin.Function(fs)
                func_vector = func.vector()

                S = self.get_species(spec, [j])

                for voxel in range(numvox):
                    ix  = vertex_to_dof_map[voxel]
                    try:
                        func_vector[ix] = float(S[voxel]/self.model.dofvol[ix])

                    except IndexError as e:
                        print "func_vector.size(): ", func_vector.size()
                        print "dolfvox: ",dolfvox
                        print "S.shape: ",S.shape
                        print "voxel: ",voxel
                        print "vertex_to_dof_map[voxel]", vertex_to_dof_map[voxel]
                        print "self.model.dofvol.shape: ", self.model.dofvol.shape
                        raise e

                spec_sol[time] = func

            sol[spec] = spec_sol
        self.sol = sol
        self.sol_initialized = True
        return sol

    def export_to_csv(self, folder_name):
        """ Dump trajectory to a set CSV files, the first specifies the mesh (mesh.csv) and the rest specify trajectory data for each species (species_S.csv for species named 'S').
            The columns of mesh.csv are: 'Voxel ID', 'X', 'Y', 'Z', 'Volume', 'Subdomain'.
            The columns of species_S.csv are: 'Time', 'Voxel 0', Voxel 1', ... 'Voxel N'.
        """
        import csv
        subprocess.call(["mkdir", "-p", folder_name])
        #['Voxel ID', 'X', 'Y', 'Z', 'Volume', 'Subdomain']
        with open(os.path.join(folder_name,'mesh.csv'), 'w+') as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            writer.writerow(['Voxel ID', 'X', 'Y', 'Z', 'Volume', 'Subdomain'])
            vol = self.model.get_solver_datastructure()['vol']
            for ndx in range(self.model.mesh.get_num_voxels()):
                row = [ndx]+self.model.mesh.coordinates()[ndx,:].tolist()+[vol[ndx]]+[self.model.sd[ndx]]
                writer.writerow(row)

        for spec in self.model.listOfSpecies:
            #['Time', 'Voxel 0', Voxel 1', ... 'Voxel N']
            with open(os.path.join(folder_name,'species_{0}.csv'.format(spec)), 'w+') as csvfile:
                data = self.get_species(spec)
                (num_t,num_vox) = data.shape
                writer = csv.writer(csvfile, delimiter=',')
                row = ['Time']
                for v in range(num_vox):
                    row.append('Voxel {0}'.format(v))
                writer.writerow(row)
                timespan = self.get_timespan()
                for t in range(num_t):
                    writer.writerow([timespan[t].tolist()] + data[t,:].tolist())

    def export_to_vtk(self, species, folder_name):
        """ Dump the trajectory to a collection of vtk files in the folder folder_name (created if non-existant).
            The exported data is #molecules/volume, where the volume unit is implicit from the mesh dimension. """

        subprocess.call(["mkdir", "-p", folder_name])
        fd = dolfin.File(os.path.join(folder_name, "trajectory.xdmf").encode('ascii', 'ignore'))
        func = dolfin.Function(self.model.mesh.get_function_space())
        func_vector = func.vector()
        vertex_to_dof_map = self.get_v2d()

        for i, time in enumerate(self.tspan):
            solvector = self.get_species(species,i,concentration=True)
            for j, val in enumerate(solvector):
                func_vector[vertex_to_dof_map[j]] = val
            fd << func

    def export_to_xyx(self, filename, species=None, file_format="VMD"):
        """ Dump the solution attached to a model as a xyz file. This format can be
            read by e.g. VMD, Jmol and Paraview. """

        if self.U is None:
            raise URDMEError("No solution found in the model.")

        dims = numpy.shape(self.U)
        Ndofs = dims[0]
        Mspecies = len(self.model.listOfSpecies)
        Ncells = Ndofs / Mspecies

        coordinates = self.model.mesh.get_voxels()
        coordinatestr = coordinates.astype(str)

        if species == None:
            species = list(self.model.listOfSpecies.keys())

        if file_format == "VMD":
            outfile = open(filename, "w")
            filestr = ""
            for i, time in enumerate(self.tspan):
                number_of_atoms = numpy.sum(self.U[:, i])
                filestr += (str(number_of_atoms) + "\n" + "timestep " + str(i) + " time " + str(time) + "\n")
                for j, spec in enumerate(species):
                    for k in range(Ncells):
                        for mol in range(self.U[k * Mspecies + j, i]):
                            # Sample a random position in a sphere of radius computed from the voxel volume
                            # TODO: Sample volume
                            linestr = spec + "\t" + '\t'.join(coordinatestr[k, :]) + "\n"
                            filestr += linestr

            outfile.write(filestr)
            outfile.close()

        elif file_format == "ParaView":
            foldername = filename
            os.mkdir(foldername)
            for i, time in enumerate(self.tspan):
                outfile = open(foldername + "/" + filename + "." + str(i), "w")
                number_of_atoms = numpy.sum(self.U[:, i])
                filestr = ""
                filestr += (str(number_of_atoms) + "\n" + "timestep " + str(i) + " time " + str(time) + "\n")
                for j, spec in enumerate(self.model.listOfSpecies):
                    for k in range(Ncells):
                        for mol in range(model.U[k * Mspecies + j, i]):
                            linestr = spec + "\t" + '\t'.join(coordinatestr[k, :]) + "\n"
                            filestr += linestr
                outfile.write(filestr)
                outfile.close()



    def _export_to_particle_js(self,species,time_index, colors=None):
        """ Create a html string for displaying the particles as small spheres. """
        import random
        with open(os.path.dirname(os.path.abspath(__file__))+"/data/three.js_templates/particles.html",'r') as fd:
            template = fd.read()

        factor, coordinates = self.model.mesh.get_scaled_normalized_coordinates()
        dims = numpy.shape(coordinates)
        if dims[1]==2:
            is3d = 0
            vtxx = numpy.zeros((dims[0],3))
            for i, v in enumerate(coordinates):
                vtxx[i,:]=(list(v)+[0])
            coordinates = vtxx
        else:
            is3d = 1

        h = self.model.mesh.get_mesh_size()

        x=[]
        y=[]
        z=[]
        c=[]
        radius = []

        total_num_particles = 0
        #colors = ["blue","red","yellow", "green"]
        if colors == None:
            colors =  get_N_HexCol(len(species))

        for j,spec in enumerate(species):

            timeslice = self.get_species(spec, time_index)
            ns = numpy.sum(timeslice)
            total_num_particles += ns

            for i, particles in enumerate(timeslice):
                # "Radius" of voxel
                hix = h[i]*factor
                hiy = hix
                hiz = hix*is3d

                for particle in range(int(particles)):
                    x.append((coordinates[i,0]+random.uniform(-1,1)*hix))
                    y.append((coordinates[i,1]+random.uniform(-1,1)*hiy))
                    z.append((coordinates[i,2]+random.uniform(-1,1)*hiz))
                    if self.model.listOfSpecies[spec].reaction_radius:
                        radius.append(factor*self.model.listOfSpecies[spec].reaction_radius)
                    else:
                        radius.append(0.01)

                    c.append(colors[j])

        template = template.replace("__X__",str(x))
        template = template.replace("__Y__",str(y))
        template = template.replace("__Z__",str(z))
        template = template.replace("__COLOR__",str(c))
        template = template.replace("__RADIUS__",str(radius))

        return template


    def export_to_three_js(self, species, time_index):
        """ Return a json serialized document that can
            be read and visualized by three.js.
        """

        colors = self._compute_solution_colors(species,time_index)
        return self.model.mesh.export_to_three_js(colors=colors)

    def _copynumber_to_concentration(self,copy_number_data):
        """ Scale compy numbers to concentrations (in unit mol/volume),
            where the volume unit is defined by the user input.
        """

        v2d = self.get_v2d()
        shape = numpy.shape(copy_number_data)
        if len(shape) == 1:
            shape = (1,shape[0])

        scaled_sol = numpy.zeros(shape)
        scaled_sol[:,:] = copy_number_data
        dims = numpy.shape(scaled_sol)

        for t in range(dims[0]):
            timeslice = scaled_sol[t,:]
            for i,cn in enumerate(timeslice):
                scaled_sol[t, i] = float(cn)/(6.022e23*self.model.dofvol[v2d[i]])

        return scaled_sol


    def _compute_solution_colors(self,species, time_index):
        """ Create a color list for species at time. """

        timeslice = self.get_species(species,time_index, concentration = True)
        colors = _compute_colors(timeslice)
        return colors

    def display_particles(self,species, time_index):
        hstr = self._export_to_particle_js(species, time_index)
        displayareaid=str(uuid.uuid4())
        hstr = hstr.replace('###DISPLAYAREAID###',displayareaid)

        html = '<div id="'+displayareaid+'" class="cell"></div>'
        IPython.display.display(IPython.display.HTML(html+hstr))


    def display(self,species,time_index,opacity=1.0,wireframe=True):
        """ Plot the trajectory as a PDE style plot. """
        data = self.get_species(species,time_index,concentration=True)
        fun = DolfinFunctionWrapper(self.model.mesh.get_function_space())
        vec = fun.vector()
        for i,d in enumerate(data):
            vec[i] = d
        fun.display(opacity=opacity, wireframe=wireframe)


class DolfinFunctionWrapper(dolfin.Function):
    """ A dolfin.Function extended with methods to visualize it in
        an IPyhthon notebook using three.js.
        """

    def __init__(self, function_space):
        dolfin.Function.__init__(self, function_space)

    def display(self, opacity=1.0,wireframe=True):
        """ Plot the solution in an IPython notebook.

            opacity:    controls the degree of transparency
            wireframe:  toggle display of the wireframe mesh on and off.

            """
        u_vec = self.vector()
        # Need to flatten the array for compatibility across Dolfin 1.4/1.5
        c = _compute_colors(numpy.array(u_vec).flatten())
        jstr = URDMEMesh(self.function_space().mesh()).export_to_three_js(colors=c)
        hstr = None
        with open(os.path.dirname(os.path.abspath(__file__))+"/data/three.js_templates/solution.html",'r') as fd:
            hstr = fd.read()
        if hstr is None:
            raise Exception("could note open template mesh.html")
        hstr = hstr.replace('###PYURDME_MESH_JSON###',jstr)

        # Create a random id for the display div. This is to avioid multiple plots ending up in the same
        # div in Ipython notebook
        displayareaid=str(uuid.uuid4())
        hstr = hstr.replace('###DISPLAYAREAID###',displayareaid)
        hstr = hstr.replace('###ALPHA###',str(opacity))
        if wireframe:
            hstr = hstr.replace('###WIREFRAME###',"true")
        else:
            hstr = hstr.replace('###WIREFRAME###',"false")


        html = '<div id="'+displayareaid+'" class="cell"></div>'
        IPython.display.display(IPython.display.HTML(html+hstr))

#   def vector(self):
#        "We need to overload this method "
#        u = super(DolfinFunctionWrapper,self).vector()
#        u = numpy.array(u).flatten()
#       return u


def get_N_HexCol(N=None):
    import colorsys
    HSV_tuples = [(x*1.0/N, 0.5, 0.5) for x in xrange(N)]
    hex_out = []
    for rgb in HSV_tuples:
        rgb = map(lambda x: int(x*255),colorsys.hsv_to_rgb(*rgb))
        hex_out.append("".join(map(lambda x: chr(x).encode('hex'),rgb)))
    return ["red","green","blue", "yellow"]


def _compute_colors(x):
    import matplotlib.cm

    # Get RGB color map proportional to the concentration.
    cm = matplotlib.cm.ScalarMappable()
    crgba= cm.to_rgba(x, bytes = True)
    # Convert RGB to HEX
    colors= []
    for row in crgba:
        # get R,G,B of RGBA
        colors.append(_rgb_to_hex(tuple(list(row[0:3]))))

    # Convert Hex to Decimal
    for i,c in enumerate(colors):
        colors[i] = int(c,0)


    return colors


def _rgb_to_hex(rgb):
    return '0x%02x%02x%02x' % rgb


class URDMESolver:
    """ Abstract class for URDME solvers. """

    def __init__(self, model, solver_path=None, report_level=0, model_file=None, sopts=None):
        """ Constructor. """
        if not isinstance(model, URDMEModel):
            raise URDMEError("URDMEsolver constructors must take a URDMEModel as an argument.")
        if not issubclass(self.__class__, URDMESolver):
            raise URDMEError("Solver classes must be a subclass of URDMESolver.")
        if not hasattr(self, 'NAME'):
            raise URDMEError("Solver classes must implement a NAME attribute.")

        self.model = model
        self.is_compiled = False
        self.report_level = report_level
        self.model_file = model_file
        self.infile_name = None
        self.delete_infile = False
        self.model_name = self.model.name
        self.solver_base_dir = None
        if sopts is None:
            self.sopts = [0,0,0]
        else:
            self.sopts = sopts

        # For the remote execution
        self.temp_urdme_root = None

        self.URDME_ROOT =  os.path.dirname(os.path.abspath(__file__))+"/urdme"

        #print "solver_path={0}".format(solver_path)
        if solver_path is None or solver_path == "":
            self.URDME_BUILD = self.URDME_ROOT + '/build/'
        else:
            self.URDME_BUILD = solver_path + '/build/'
            os.environ['SOLVER_ROOT'] = solver_path

    def __getstate__(self):
        """ Save the state of the solver, saves all instance variables
            and reads all the files necessary to compile the solver off
            of the file system and stores it in a separate state variable.
            If the solver model files is specified, it saves that too.
            This is used by Pickle.
        """
        ret = {}
        # Save the instance variables
        ret['vars'] = self.__dict__.copy()
        # The model object is not picklabe due to the Swig-objects from Dolfin
        #ret['vars']['model'] = None
        ret['vars']['is_compiled'] = False
        # Create temp root
        tmproot = tempfile.mkdtemp(dir=os.environ.get('PYURDME_TMPDIR'))
        # Get the propensity file
        model_file = tmproot+'/'+self.model_name + '_pyurdme_generated_model'+ '.c'
        ret['model_file'] = os.path.basename(model_file)
        if self.model_file == None:
            self.create_propensity_file(file_name=model_file)
        else:
            subprocess.call('cp '+self.model_file+' '+model_file, shell=True)
        # Get the solver source files
        os.mkdir(tmproot+'/include')
        os.mkdir(tmproot+'/src')
        os.mkdir(tmproot+'/src/'+self.NAME)
        #TODO: what if solverdir is not the same as URDME_ROOT ?
        subprocess.call('cp '+self.URDME_ROOT+'/src/*.c '+tmproot+'/src/', shell=True)
        subprocess.call('cp '+self.URDME_ROOT+'/src/'+self.NAME+'/*.* '+tmproot+'/src/'+self.NAME+'/', shell=True)
        subprocess.call('cp '+self.URDME_ROOT+'/include/*.h '+tmproot+'/include/', shell=True)
        #TODO: get the include files from solvers not in the default path (none currently implement this).
        # Get the Makefile
        os.mkdir(tmproot+'/build')
        subprocess.call('cp '+self.URDME_BUILD+'Makefile.'+self.NAME+' '+tmproot+'/build/Makefile.'+self.NAME, shell=True)
        # Get the input file
        input_file = tmproot+'/model_input.mat'
        ret['input_file'] = os.path.basename(input_file)
        self.serialize(filename=input_file, report_level=self.report_level)
        ##
        origwd = os.getcwd()
        os.chdir(tmproot)
        tarname = tmproot+'/'+self.NAME+'.tar.gz'
        subprocess.call('tar -czf '+tarname+' src include build '+os.path.basename(input_file)+' '+os.path.basename(model_file), shell=True)
        with open(tarname, 'r') as f:
            ret['SolverFiles'] = f.read()
        os.chdir(origwd)
        shutil.rmtree(tmproot)
        # return the state
        return ret

    def __setstate__(self, state):
        """ Set all instance variables for the object, and create a unique temporary
            directory to store all the solver files.  URDME_BUILD is set to this dir,
            and is_compiled is always set to false.  This is used by Pickle.
        """
        # 0. restore the instance variables
        for key, val in state['vars'].iteritems():
            self.__dict__[key] = val
        # 1. create temporary directory = URDME_ROOT
        self.temp_urdme_root = tempfile.mkdtemp(dir=os.environ.get('PYURDME_TMPDIR'))
        self.URDME_ROOT = self.temp_urdme_root
        self.URDME_BUILD = self.temp_urdme_root+'/build/'
        origwd = os.getcwd()
        os.chdir(self.temp_urdme_root)
        tarname = self.temp_urdme_root+'/'+self.NAME+'.tar.gz'
        with open(tarname, 'wd') as f:
            f.write(state['SolverFiles'])
        subprocess.call('tar -zxf '+tarname, shell=True)
        os.chdir(origwd)
        # Model File
        self.model_file = self.temp_urdme_root+'/'+state['model_file']
        # Input File
        self.infile_name = self.temp_urdme_root+'/'+state['input_file']


    def __del__(self):
        """ Deconstructor.  Removes the compiled solver."""
        if self.delete_infile:
            try:
                os.remove(self.infile_name)
            except OSError as e:
                print "Could not delete '{0}'".format(self.infile_name)
        if self.solver_base_dir is not None:
            try:
                shutil.rmtree(self.solver_base_dir)
            except OSError as e:
                print "Could not delete '{0}'".format(self.solver_base_dir)
        if self.temp_urdme_root is not None:
            try:
                shutil.rmtree(self.temp_urdme_root)
            except OSError as e:
                print "Could not delete '{0}'".format(self.temp_urdme_root)


    def serialize(self, filename=None, report_level=0, sopts=None):
        """ Write the datastructures needed by the the core URDME solvers to a .mat input file. """
        urdme_solver_data = self.model.get_solver_datastructure()
        urdme_solver_data['report'] = report_level
        if sopts is None:
            urdme_solver_data['sopts'] = self.sopts
        else:
            urdme_solver_data['sopts'] = sopts

        self.model.validate(urdme_solver_data)
        scipy.io.savemat(filename, urdme_solver_data, oned_as='column')


    def compile(self):
        """ Compile the model."""

        # Create a unique directory each time call to compile.
        self.solver_base_dir = tempfile.mkdtemp(dir=os.environ.get('PYURDME_TMPDIR'))
        self.solver_dir = self.solver_base_dir + '/.urdme/'
        #print "URDMESolver.compile()  self.solver_dir={0}".format(self.solver_dir)

        if self.report_level >= 1:
            print "Compiling Solver"

        if os.path.isdir(self.solver_dir):
            try:
                shutil.rmtree(self.solver_dir)
            except OSError as e:
                pass
        try:
            os.mkdir(self.solver_dir)
        except Exception as e:
            pass

        # Write the propensity file
        self.propfilename = self.model_name + '_pyurdme_generated_model'
        if self.model_file == None:
            prop_file_name=self.solver_dir + self.propfilename + '.c'
            if self.report_level > 1:
                print "Creating propensity file {0}".format(prop_file_name)
            self.create_propensity_file(file_name=prop_file_name)
        else:
            cmd = " ".join(['cp', self.model_file, self.solver_dir + self.propfilename + '.c'])
            if self.report_level > 1:
                print cmd
            subprocess.call(cmd,shell=True)

        # Build the solver
        makefile = 'Makefile.' + self.NAME
        cmd = " ".join([ 'cd', self.solver_base_dir , ';', 'make', '-f', self.URDME_BUILD + makefile, 'URDME_ROOT=' + self.URDME_ROOT, 'URDME_MODEL=' + self.propfilename])
        if self.report_level > 1:
            print "cmd: {0}\n".format(cmd)
        try:
            handle = subprocess.Popen(cmd, stdout = subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            return_code = handle.wait()
        except OSError as e:
            print "Error, execution of compilation raised an exception: {0}".format(e)
            print "cmd = {0}".format(cmd)
            raise URDMEError("Compilation of solver failed")

        if return_code != 0:
            try:
                print handle.stdout.read()
                print handle.stderr.read()
            except Exception as e:
                pass
            raise URDMEError("Compilation of solver failed, return_code={0}".format(return_code))

        if self.report_level > 1:
            print handle.stdout.read()
            print handle.stderr.read()

        self.is_compiled = True


    def run(self, number_of_trajectories=1, seed=None, input_file=None, loaddata=False):
        """ Run one simulation of the model.

        number_of_trajectories: How many trajectories should be run.
        seed: the random number seed (incimented by one for multiple runs).
        input_file: the filename of the solver input data file .
        loaddata: boolean, should the result object load the data into memory on creation.

        Returns:
            URDMEResult object.
                or, if number_of_trajectories > 1
            a list of URDMEResult objects
        """
        if number_of_trajectories > 1:
            result_list = []
        # Check if compiled, call compile() if not.
        if not self.is_compiled:
            self.compile()

        if input_file is None:
            if self.infile_name is None or not os.path.exists(self.infile_name):
                # Get temporary input and output files
                infile = tempfile.NamedTemporaryFile(delete=False, dir=os.environ.get('PYURDME_TMPDIR'))

                # Write the model to an input file in .mat format
                self.serialize(filename=infile, report_level=self.report_level)
                infile.close()
                self.infile_name = infile.name
                self.delete_infile = True
        else:
            self.infile_name = input_file
            self.delete_infile = False

        if not os.path.exists(self.infile_name):
            raise URDMEError("input file not found.")

        # Execute the solver
        for run_ndx in range(number_of_trajectories):
            outfile = tempfile.NamedTemporaryFile(delete=False, dir=os.environ.get('PYURDME_TMPDIR'))
            outfile.close()
            urdme_solver_cmd = [self.solver_dir + self.propfilename + '.' + self.NAME, self.infile_name, outfile.name]

            if seed is not None:
                urdme_solver_cmd.append(str(seed+run_ndx))
            if self.report_level >= 1:
                print 'cmd: {0}\n'.format(urdme_solver_cmd)
            try:
                if self.report_level >= 1:  #stderr & stdout to the terminal
                    handle = subprocess.Popen(urdme_solver_cmd)
                else:
                    handle = subprocess.Popen(urdme_solver_cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
                return_code = handle.wait()
            except OSError as e:
                print "Error, execution of solver raised an exception: {0}".format(e)
                print "urdme_solver_cmd = {0}".format(urdme_solver_cmd)
                    #raise URDMEError("Solver execution failed")

            if return_code != 0:
                print outfile.name
                print return_code
                if self.report_level >= 1:
                    try:
                        print handle.stderr.read(), handle.stdout.read()
                    except Exception as e:
                        pass
                print "urdme_solver_cmd = {0}".format(urdme_solver_cmd)
                raise URDMEError("Solver execution failed, return code = {0}".format(return_code))


            #Load the result from the hdf5 output file.
            try:
                result = URDMEResult(self.model, outfile.name, loaddata=loaddata)
                result["Status"] = "Sucess"
                if number_of_trajectories > 1:
                    result_list.append(result)
                else:
                    return result
            except Exception as e:
                exc_info = sys.exc_info()
                os.remove(outfile.name)
                raise exc_info[1], None, exc_info[2]

        return result_list


    def create_propensity_file(self, file_name=None):
        """ Generate the C propensity file that is used to compile the URDME solvers.
            Only mass action propensities are supported.

        """

        template = open(os.path.abspath(os.path.dirname(__file__)) + '/data/propensity_file_template.c', 'r')
        propfile = open(file_name, "w")
        propfilestr = template.read()

        speciesdef = ""
        i = 0
        for S in self.model.listOfSpecies:
            speciesdef += "#define " + S + " " + "x[" + str(i) + "]" + "\n"
            speciesdef += "#define " + S + "_INDEX " +  str(i) + "\n"
            i += 1

        propfilestr = propfilestr.replace("__DEFINE_SPECIES__", speciesdef)

        propfilestr = propfilestr.replace("__NUMBER_OF_REACTIONS__", str(self.model.get_num_reactions()))
        propfilestr = propfilestr.replace("__NUMBER_OF_SPECIES__", str(self.model.get_num_species()))
        propfilestr = propfilestr.replace("__NUMBER_OF_VOXELS__", str(self.model.mesh.get_num_voxels()))

        # Create defines for the DataFunctions.
        data_fn_str = ""
        i = 0
        for d in self.model.listOfDataFunctions:
            if d.name is None:
                raise URDMEError("DataFunction {0} does not have a name attributed defined.".format(i))
            data_fn_str += "#define " + d.name + " data[" + str(i) + "]\n"
            i += 1
        propfilestr = propfilestr.replace("__DEFINE_DATA_FUNCTIONS__", str(data_fn_str))

        # Make sure all paramters are evaluated to scalars before we write them to the file.
        self.model.resolve_parameters()
        parameters = ""
        for p in self.model.listOfParameters:
            parameters += "const double " + p + " = " + str(self.model.listOfParameters[p].value) + ";\n"
        propfilestr = propfilestr.replace("__DEFINE_PARAMETERS__", str(parameters))


        # Reactions
        funheader = "double __NAME__(const int *x, double t, const double vol, const double *data, int sd)"
        #funheader = "double __NAME__(const int *x, double t, const double vol, const double *data, int sd, int voxel, int *xx, const size_t *irK, const size_t *jcK, const double *prK)"

        funcs = ""
        funcinits = ""
        i = 0
        for R in self.model.listOfReactions:
            func = ""
            rname = self.model.listOfReactions[R].name
            func += funheader.replace("__NAME__", rname) + "\n{\n"
            if self.model.listOfReactions[R].restrict_to == None or (isinstance(self.model.listOfReactions[R].restrict_to, list) and len(self.model.listOfReactions[R].restrict_to) == 0):
                func += self.model.listOfReactions[R].propensity_function
            else:
                func += "if("
                if isinstance(self.model.listOfReactions[R].restrict_to, list) and len(self.model.listOfReactions[R].restrict_to) > 0:
                    for sd in self.model.listOfReactions[R].restrict_to:
                        func += "sd == " + str(sd) + "||"
                    func = func[:-2]
                elif isinstance(self.model.listOfReactions[R].restrict_to, int):
                    func += "sd == " +  str(self.model.listOfReactions[R].restrict_to)
                else:
                    raise URDMEError("When restricting reaction to subdomains, you must specify either a list or an int")
                func += "){\n"
                func += self.model.listOfReactions[R].propensity_function

                func += "\n}else{"
                func += "\n\treturn 0.0;}"


            func += "\n}"
            funcs += func + "\n\n"
            funcinits += "    ptr[" + str(i) + "] = " + rname + ";\n"
            i += 1

        propfilestr = propfilestr.replace("__DEFINE_REACTIONS__", funcs)
        propfilestr = propfilestr.replace("__DEFINE_PROPFUNS__", funcinits)
        propfile.write(propfilestr)
        propfile.close()



def urdme(model=None, solver='nsm', solver_path="", model_file=None, input_file=None, seed=None, report_level=0):
    """ URDME solver interface.

        Similar to model.run() the urdme() function provides an interface that is backwards compatiable with the
        previous URDME implementation.

        After sucessful execution, urdme returns a URDMEResults object with the following members:
        U:         the raw copy number output in a matrix with dimension (Ndofs, num_time_points)
        tspan:     the time span vector containing the time points that corresponds to the columns in U
        status:    Sucess if the solver executed without error
        stdout:    the standard ouput stream from the call to the core solver
        stderr:    the standard error stream from the call to the core solver

    """


    #If solver is a subclass of URDMESolver, use it directly.
    if isinstance(solver, (type, types.ClassType)) and  issubclass(solver, URDMESolver):
        sol = solver(model, solver_path, report_level, model_file=model_file)
    elif type(solver) is str:
        if solver == 'nsm':
            from nsmsolver import NSMSolver
            sol = NSMSolver(model, solver_path, report_level, model_file=model_file)
        elif solver == 'nem':
            from nemsolver import NEMSolver
            sol = NEMSolver(model, solver_path, report_level, model_file=model_file)
        else:
            raise URDMEError("Unknown solver: {0}".format(solver_name))
    else:
        raise URDMEError("solver argument to urdme() must be a string or a URDMESolver class object.")

    sol.compile()
    return sol.run(seed=seed, input_file=input_file)


class URDMEDataFunction():
    """ Abstract class used to constuct the URDME data vector. """
    name = None
    def __init__(self, name=None):
        if name is not None:
            self.name = name
        if self.name is None:
            raise Exception("URDMEDataFunction must have a 'name'")

    def map(self, x):
        """ map() takes the coordinate 'x' and returns a list of doubles.
        Args:
            x: a list of 3 ints.
        Returns:
            a list of floats.
        """
        raise Exception("URDMEDataFunction.map() not implemented.")


class MeshImportError(Exception):
    """ Exception to raise when encourntering and error importing a mesh. """
    pass

class URDMEError(Exception):
    pass

class ModelException(Exception):
    pass

class InvalidSystemMatrixException(Exception):
    pass


class IntervalMeshPeriodicBoundary(dolfin.SubDomain):
    """ Subdomain for Periodic boundary conditions on a interval domain. """
    def __init__(self, a=0.0, b=1.0):
        """ 1D domain from a to b. """
        dolfin.SubDomain.__init__(self)
        self.a = a
        self.b = b

    def inside(self, x, on_boundary):
        return not bool((dolfin.near(x[0], self.b)) and on_boundary)

    def map(self, x, y):
        if dolfin.near(x[0], self.b):
            y[0] = self.a + (x[0] - self.b)

class SquareMeshPeriodicBoundary(dolfin.SubDomain):
    """ Subdomain for Periodic boundary conditions on a square domain. """
    def __init__(self, Lx=1.0, Ly=1.0):
        dolfin.SubDomain.__init__(self)
        self.Lx = Lx
        self.Ly = Ly

    def inside(self, x, on_boundary):
        """ Left boundary is "target domain" G """
        # return True if on left or bottom boundary AND NOT on one of the two corners (0, 1) and (1, 0)
        return bool((dolfin.near(x[0], 0) or dolfin.near(x[1], 0)) and
                (not ((dolfin.near(x[0], 0) and dolfin.near(x[1], 1)) or
                        (dolfin.near(x[0], 1) and dolfin.near(x[1], 0)))) and on_boundary)

    def map(self, x, y):
        ''' # Map right boundary G (x) to left boundary H (y) '''
        if dolfin.near(x[0], self.Lx) and dolfin.near(x[1], self.Ly):
            y[0] = x[0] - self.Lx
            y[1] = x[1] - self.Ly
        elif dolfin.near(x[0], self.Lx):
            y[0] = x[0] - self.Lx
            y[1] = x[1]
        else:   # near(x[1], 1)
            y[0] = x[0]
            y[1] = x[1] - self.Ly

class CubeMeshPeriodicBoundary(dolfin.SubDomain):
    """ Subdomain for Periodic boundary conditions on a cube domain. """
    def __init__(self, Lx=1.0, Ly=1.0, Lz=1.0):
        dolfin.SubDomain.__init__(self)
        self.Lx = Lx
        self.Ly = Ly
        self.Lz = Lz

    def inside(self, x, on_boundary):
        """ Left boundary is "target domain" G """
        # return True if on left or bottom boundary AND NOT on one of the two corners (0, 1) and (1, 0)
        return bool(
                (dolfin.near(x[0], 0) or dolfin.near(x[1], 0) or dolfin.near(x[3], 0))
                and (not (
                        (dolfin.near(x[0], 1) and dolfin.near(x[1], 0) and dolfin.near(x[1], 0)) or
                        (dolfin.near(x[0], 0) and dolfin.near(x[1], 1) and dolfin.near(x[1], 0)) or
                        (dolfin.near(x[0], 0) and dolfin.near(x[1], 0) and dolfin.near(x[1], 1))
                    ))
                and on_boundary
               )

    def map(self, x, y):
        ''' # Map right boundary G (x) to left boundary H (y) '''
        if dolfin.near(x[0], self.Lx) and dolfin.near(x[1], self.Ly) and dolfin.near(x[2], self.Lz):
            y[0] = x[0] - self.Lx
            y[1] = x[1] - self.Ly
            y[2] = x[2] - self.Lz
        elif dolfin.near(x[0], self.Lx) and dolfin.near(x[1], self.Ly):
            y[0] = x[0] - self.Lx
            y[1] = x[1] - self.Ly
            y[2] = x[2]
        elif dolfin.near(x[0], self.Lx) and dolfin.near(x[2], self.Lz):
            y[0] = x[0] - self.Lx
            y[1] = x[1]
            y[2] = x[2] - self.Lz
        elif dolfin.near(x[1], self.Ly) and dolfin.near(x[2], self.Lz):
            y[0] = x[0]
            y[1] = x[1] - self.Ly
            y[2] = x[2] - self.Lz
        elif dolfin.near(x[0], self.Lx):
            y[0] = x[0] - self.Lx
            y[1] = x[1]
            y[2] = x[2]
        elif dolfin.near(x[1], self.Ly):
            y[0] = x[0]
            y[1] = x[1] - self.Ly
            y[2] = x[2]
        elif dolfin.near(x[2], self.Lz):
            y[0] = x[0]
            y[1] = x[1]
            y[2] = x[2] - self.Lz
        else:
            y[0] = x[0]
            y[1] = x[1]
            y[2] = x[2]




if __name__ == '__main__':
    """ Command line interface to URDME. Execute URDME given a model file. """

