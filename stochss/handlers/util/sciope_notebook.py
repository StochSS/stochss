'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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

from nbformat import v4 as nbf

from .stochss_notebook import StochSSNotebook

class StochSSSciopeNotebook(StochSSNotebook):
    '''
    ################################################################################################
    StochSS sciope notebook object
    ################################################################################################
    '''
    def __init__(self, path, new=False, models=None, settings=None):
        '''Intitialize a sciope notebook object and
           if its new create it on the users file system.

        Attributes
        ----------
        path : str
            Path to the notebook'''
        super().__init__(path=path, new=new, models=models, settings=settings)


    @classmethod
    def __create_me_expres_cells(cls):
        # res conf cell
        param_conf = "met.data.configurations['listOfParameters'] = "
        param_conf += "list(model.listOfParameters.keys())"
        rconf_strs = ["# First lets add some appropiate information about the model and features",
                      param_conf,
                      "met.data.configurations['listOfSpecies'] = list(model.listOfSpecies.keys())",
                      "met.data.configurations['listOfSummaries'] = met.summaries.features",
                      "met.data.configurations['timepoints'] = model.tspan"]
        # met explore cell
        mtexp_strs = ["# Here we use UMAP for dimension reduction", "met.explore(dr_method='umap')"]
        # supervised train cell
        sptrn_strs = ["from sciope.models.label_propagation import LPModel",
                      "# here lets use the dimension reduction embedding as input data",
                      "data = met.dr_model.embedding_", "",
                      "model_lp = LPModel()", "# train using basinhopping",
                      "model_lp.train(data, met.data.user_labels, min_=0.01, max_=10, niter=50)"]
        # map label cell
        cmt_str = "# just to vislualize the result we will map the label distribution "
        cmt_str += "to the user_labels\n# (will enable us to see the LP model output "
        cmt_str += "when using method 'explore')"
        mplbl_strs = [cmt_str, "user_labels = np.copy(met.data.user_labels)",
                      "# takes the label corresponding to index 0",
                      "met.data.user_labels = model_lp.model.label_distributions_[:, 0]"]
        cells = [nbf.new_markdown_cell("## Explore the result"),
                 nbf.new_code_cell("\n".join(rconf_strs)),
                 nbf.new_code_cell("\n".join(mtexp_strs)),
                 nbf.new_code_cell("\n".join(sptrn_strs)),
                 nbf.new_code_cell("\n".join(mplbl_strs)),
                 nbf.new_code_cell("met.explore(dr_method='umap')"),
                 nbf.new_code_cell("met.data.user_labels = user_labels")]
        return cells


    def __create_me_setup_cells(self):
        spec_of_interest = list(self.model.get_all_species().keys())
        # Wrapper cell
        sim_str = "simulator = wrapper.get_simulator(gillespy_model=model, "
        sim_str += f"run_settings=settings, species_of_interest={spec_of_interest})"
        sim_strs = ["from sciope.utilities.gillespy2 import wrapper",
                    "settings = configure_simulation()", sim_str,
                    "expression_array = wrapper.get_parameter_expression_array(model)"]
        # Dask cell
        dask_strs = ["from dask.distributed import Client", "", "c = Client()"]
        # lhc cell
        lhc_str = "lhc = latin_hypercube_sampling.LatinHypercube("
        lhc_str += "xmin=expression_array, xmax=expression_array*3)"
        lhc_strs = ["from sciope.designs import latin_hypercube_sampling",
                    "from sciope.utilities.summarystats.auto_tsfresh import SummariesTSFRESH", "",
                    lhc_str, "lhc.generate_array(1000) # creates a LHD of size 1000", "",
                    "# will use default minimal set of features",
                    "summary_stats = SummariesTSFRESH()"]
        # stochmet cell
        ism_strs = ["from sciope.stochmet.stochmet import StochMET", "",
                    "met = StochMET(simulator, lhc, summary_stats)"]
        cells = [nbf.new_markdown_cell("## Define simulator function (using gillespy2 wrapper)"),
                 nbf.new_code_cell("\n".join(sim_strs)),
                 nbf.new_markdown_cell("## Start local cluster using dask client"),
                 nbf.new_code_cell("\n".join(dask_strs)),
                 nbf.new_markdown_cell("## Define parameter sampler/design and summary statistics"),
                 nbf.new_code_cell("\n".join(lhc_strs)),
                 nbf.new_markdown_cell("## Initiate StochMET"),
                 nbf.new_code_cell("\n".join(ism_strs))]
        return cells


    def __create_mi_setup_cells(self):
        pad = "    "
        priors = ["from sciope.utilities.priors import uniform_prior", "",
                  "# take default from mode 1 as reference",
                  "default_param = np.array(list(model.listOfParameters.items()))[:, 1]",
                  "", "bound = []", "for exp in default_param:",
                  f"{pad}bound.append(float(exp.expression))", "", "# Set the bounds",
                  "bound = np.array(bound)", "dmin = bound * 0.1", "dmax = bound * 2.0",
                  "", "# Here we use uniform prior",
                  "uni_prior = uniform_prior.UniformPrior(dmin, dmax)"]
        stat_dist = ["from sciope.utilities.summarystats import auto_tsfresh",
                     "from sciope.utilities.distancefunctions import naive_squared", "",
                     "# Function to generate summary statistics",
                     "summ_func = auto_tsfresh.SummariesTSFRESH()", "",
                     "# Distance", "ns = naive_squared.NaiveSquaredDistance()"]
        cells = [nbf.new_markdown_cell("## Define prior distribution"),
                 nbf.new_code_cell("\n".join(priors)),
                 nbf.new_markdown_cell("## Define simulator"),
                 self.__create_mi_simulator_cell(),
                 nbf.new_markdown_cell("## Define summary statistics and distance function"),
                 nbf.new_code_cell("\n".join(stat_dist))]
        return cells


    def __create_mi_simulator_cell(self):
        pad = "    "
        comment = f"{pad}# params - array, need to have the same order as model.listOfParameters"
        loop = f"{pad}for e, pname in enumerate(model.listOfParameters.keys()):"
        if self.settings['solver'] == "SSACSolver":
            comment += "\n"+ pad +"variables = {}"
            func_def = "def get_variables(params, model):"
            body = f"{pad*2}variables[pname] = params[e]"
            return_str = f"{pad}return variables"
            call = f"{pad}variables = get_variables(params, model)"
            run = f"{pad}res = model.run(**kwargs, variables=variables)"
        else:
            func_def = "def set_model_parameters(params, model):"
            body = f"{pad*2}model.get_parameter(pname).expression = params[e]"
            return_str = f"{pad}return model"
            call = f"{pad}model_update = set_model_parameters(params, model)"
            run = f"{pad}res = model_update.run(**kwargs)"
        sim_strs = [func_def, comment, loop, body, return_str, ""]
        simulator = ["# Here we use the GillesPy2 Solver", "def simulator(params, model):",
                     call, "", run, f"{pad}res = res.to_array()",
                     f"{pad}tot_res = np.asarray([x.T for x in res]) # reshape to (N, S, T)",
                     f"{pad}# should not contain timepoints", f"{pad}tot_res = tot_res[:, 1:, :]",
                     "", f"{pad}return tot_res", ""]
        sim_strs.extend(simulator)
        sim2_com = "# Wrapper, simulator function to abc should should only take one argument "
        sim2_com += "(the parameter point)"
        simulator2 = [sim2_com, "def simulator2(x):", f"{pad}return simulator(x, model=model)"]
        sim_strs.extend(simulator2)
        return nbf.new_code_cell("\n".join(sim_strs))


    def create_me_notebook(self):
        '''Create a model exploration jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.MODEL_EXPLORATION
        self.settings['solver'] = self.get_gillespy2_solver_name()
        cells = [nbf.new_code_cell("%matplotlib notebook")]
        cells.extend(self.create_common_cells())
        cells.append(nbf.new_markdown_cell("# Model Exploration"))
        cells.extend(self.__create_me_setup_cells())
        cells.extend([nbf.new_markdown_cell("## Run parameter sweep"),
                      nbf.new_code_cell("met.compute(n_points=500, chunk_size=10)")])
        cells.extend(self.__create_me_expres_cells())

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}


    def create_mi_notebook(self):
        '''Create a model inference jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.MODEL_INFERENCE
        self.settings['solver'] = self.get_gillespy2_solver_name()
        cells = [nbf.new_code_cell("%load_ext autoreload\n%autoreload 2")]
        cells.extend(self.create_common_cells())
        imports = "from tsfresh.feature_extraction.settings import MinimalFCParameters"
        fd_header = "## Generate some fixed(observed) data based on default parameters of the model"
        fd_str = "kwargs = configure_simulation()\nfixed_data = model.run(**kwargs)"
        rshp_strs = ["# Reshape the data and remove timepoints array",
                     "fixed_data = fixed_data.to_array()",
                     "fixed_data = np.asarray([x.T for x in fixed_data])",
                     "fixed_data = fixed_data[:, 1:, :]"]
        cells.extend([nbf.new_markdown_cell("# Model Inference"),
                      nbf.new_code_cell(imports), nbf.new_markdown_cell(fd_header),
                      nbf.new_code_cell(fd_str), nbf.new_code_cell("\n".join(rshp_strs))])
        cells.extend(self.__create_mi_setup_cells())
        # abc cell
        abc_str = "from sciope.inference.abc_inference import ABC\n\n"
        abc_str += "abc = ABC(fixed_data, sim=simulator2, prior_function=uni_prior, "
        abc_str += "summaries_function=summ_func.compute, distance_function=ns)"
        # compute fixed mean cell
        fm_str = "# First compute the fixed(observed) mean\nabc.compute_fixed_mean(chunk_size=2)"
        # run model inference cell
        rmi_str = "res = abc.infer(num_samples=100, batch_size=10, chunk_size=2)"
        # absolute error cell
        abse_str = "from sklearn.metrics import mean_absolute_error\n\n"
        abse_str += "mae_inference = mean_absolute_error(bound, abc.results['inferred_parameters'])"
        cells.extend([nbf.new_markdown_cell("## Start local cluster using dask client"),
                      nbf.new_code_cell("from dask.distributed import Client\n\nc = Client()"),
                      nbf.new_markdown_cell("## Start abc instance"),
                      nbf.new_code_cell(abc_str), nbf.new_code_cell(fm_str),
                      nbf.new_code_cell(rmi_str), nbf.new_code_cell(abse_str)])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}
