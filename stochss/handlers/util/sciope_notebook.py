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

    def __create_abc_cells(self, cells):
        pad = '    '
        cell1 = [
            "abc = ABC(", f"{pad}fixed_data, sim=simulator2, prior_function=uni_prior,",
            f"{pad}summaries_function=summ_func.compute, distance_function=ns", ")"
        ]
        cells.insert(27, nbf.new_code_cell("\n".join(cell1)))
        cells.append(nbf.new_code_cell("abc.compute_fixed_mean(chunk_size=2)"))
        cells.append(nbf.new_code_cell(
            "res = abc.infer(num_samples=100, batch_size=10, chunk_size=2)"
        ))
        cells.append(nbf.new_code_cell(
            "mae_inference = mean_absolute_error(bound, abc.results['inferred_parameters'])"
        ))

    def __create_explore_cells(self, cells):
        cell1 = [
            "met.data.configurations['listOfParameters'] = list(model.listOfParameters.keys())",
            "met.data.configurations['listOfSpecies'] = list(model.listOfSpecies.keys())",
            "met.data.configurations['listOfSummaries'] = met.summaries.features",
            "met.data.configurations['timepoints'] = model.tspan",
        ]
        cell3 = [
            "data = met.dr_model.embedding_", "",
            "model_lp = LPModel()", "# train using basinhopping",
            "model_lp.train(data, met.data.user_labels, min_=0.01, max_=10, niter=50)"
        ]
        cell4 = [
            "user_labels = numpy.copy(met.data.user_labels)",
            "# takes the label corresponding to index 0",
            "met.data.user_labels = model_lp.model.label_distributions_[:, 0]"
        ]
        cells.insert(21, nbf.new_code_cell("\n".join(cell1)))
        cells.insert(23, nbf.new_code_cell("met.explore(dr_method='umap')"))
        cells.insert(25, nbf.new_code_cell("\n".join(cell3)))
        cells.insert(27, nbf.new_code_cell("\n".join(cell4)))
        cells.insert(28, nbf.new_code_cell("met.explore(dr_method='umap')"))
        cells.insert(29, nbf.new_code_cell("met.data.user_labels = user_labels"))

    def __create_import_cells(self, cells):
        base_imports = ["import numpy", "from dask.distributed import Client"]
        if self.nb_type == self.MODEL_INFERENCE:
            base_imports.insert(
                1, "from tsfresh.feature_extraction.settings import MinimalFCParameters"
            )
            base_imports.append("from sklearn.metrics import mean_absolute_error")
            sciope_imports = [
                "from sciope.utilities.priors import uniform_prior",
                "from sciope.utilities.summarystats import auto_tsfresh",
                "from sciope.utilities.distancefunctions import naive_squared",
                "from sciope.inference.abc_inference import ABC"
            ]
        else:
            sciope_imports = [
                "from sciope.utilities.gillespy2 import wrapper",
                "from sciope.designs import latin_hypercube_sampling",
                "from sciope.utilities.summarystats.auto_tsfresh import SummariesTSFRESH",
                "from sciope.stochmet.stochmet import StochMET",
                "from sciope.models.label_propagation import LPModel"
            ]
        cells.insert(1, nbf.new_code_cell("\n".join(base_imports)))
        cells.insert(3, nbf.new_code_cell("\n".join(sciope_imports)))

    def __create_me_header_cells(self, cells):
        header1 = "***\n## Model Exploration\n***\n" + \
                    "### Define simulator function (using gillespy2 wrapper)"
        header6 = "***\n## Explore the result\n***\n" + \
                    "First lets add some appropiate information about the model and features"
        header9 = "Just to vislualize the result we will map the " + \
                    "label distribution to the user_labels " + \
                    "(will enable us to see the LP model output when using method 'explore')"
        cells.extend([
            nbf.new_markdown_cell(header1),
            nbf.new_markdown_cell("### Start local cluster using dask client"),
            nbf.new_markdown_cell("### Define parameter sampler/design and summary statistics"),
            nbf.new_markdown_cell("### Initiate StochMET"),
            nbf.new_markdown_cell("***\n## Run parameter sweep\n***"),
            nbf.new_markdown_cell(header6),
            nbf.new_markdown_cell("Here we use UMAP for dimension reduction"),
            nbf.new_markdown_cell("Here lets use the dimension reduction embedding as input data"),
            nbf.new_markdown_cell(header9)
        ])

    def __create_mi_header_cells(self, cells):
        header1 = "***\n## Model Inference\n***\n### Generate some fixed" + \
                    "(observed) data based on default parameters of the model"
        header6 = "Wrapper, simulator function to abc should " + \
                    "should only take one argument (the parameter point)"
        header7 = "### Define summary statistics and distance function" + \
                    "\nFunction to generate summary statistics"
        cells.extend([
            nbf.new_markdown_cell(header1),
            nbf.new_markdown_cell("Reshape the data and remove timepoints array"),
            nbf.new_markdown_cell(
                "### Define prior distribution\nTake default from mode 1 as reference"
            ),
            nbf.new_markdown_cell("### Define simulator"),
            nbf.new_markdown_cell("Here we use the GillesPy2 Solver"),
            nbf.new_markdown_cell(header6),
            nbf.new_markdown_cell(header7),
            nbf.new_markdown_cell("### Start local cluster using dask client"),
            nbf.new_markdown_cell("***\n## Run the abc instance\n***"),
            nbf.new_markdown_cell("First compute the fixed(observed) mean")
        ])

    def __create_observed_data(self, cells):
        cell2 = [
            "fixed_data = fixed_data.to_array()",
            "fixed_data = numpy.asarray([x.T for x in fixed_data])",
            "fixed_data = fixed_data[:, 1:, :]"
        ]
        cells.insert(11, nbf.new_code_cell(
            "kwargs = configure_simulation()\nfixed_data = model.run(**kwargs)"
        ))
        cells.insert(13, nbf.new_code_cell("\n".join(cell2)))

    def __create_prior(self):
        nb_prior = [
            "default_param = numpy.array(list(model.listOfParameters.items()))[:, 1]", "",
            "bound = []", "for exp in default_param:", "    bound.append(float(exp.expression))",
            "", "# Set the bounds", "bound = numpy.array(bound)", "dmin = bound * 0.1",
            "dmax = bound * 2.0", "", "# Here we use uniform prior",
            "uni_prior = uniform_prior.UniformPrior(dmin, dmax)"
        ]
        return nbf.new_code_cell("\n".join(nb_prior))

    def __create_simulator_cells(self, cells):
        pad = '    '
        cell1 = [
            "def get_variables(params, model):",
            f"{pad}# params - array, need to have the same order as model.listOfParameters",
            f"{pad}variables = " + r"{}",
            f"{pad}for e, pname in enumerate(model.listOfParameters.keys()):",
            f"{pad*2}variables[pname] = params[e]", f"{pad}return variables"
        ]
        cell2 = [
            "def simulator(params, model):", f"{pad}variables = get_variables(params, model)", "",
            f"{pad}res = model.run(**kwargs, variables=variables)", f"{pad}res = res.to_array()",
            f"{pad}tot_res = numpy.asarray([x.T for x in res]) # reshape to (N, S, T)",
            f"{pad}# should not contain timepoints", f"{pad}tot_res = tot_res[:, 1:, :]", "",
            f"{pad}return tot_res"
        ]
        cells.insert(16, nbf.new_code_cell("\n".join(cell1)))
        cells.insert(18, nbf.new_code_cell("\n".join(cell2)))
        cells.insert(20, nbf.new_code_cell(
            f"def simulator2(x):\n{pad}return simulator(x, model=model)"
        ))

    def __create_simulator_func(self):
        nb_sim_func = [
            "settings = configure_simulation()", "simulator = wrapper.get_simulator(",
            "    gillespy_model=model, run_settings=settings, species_of_interest=['U', 'V']",
            ")", "expression_array = wrapper.get_parameter_expression_array(model)"
        ]
        return nbf.new_code_cell("\n".join(nb_sim_func))

    def __create_summary_stats(self):
        nb_sum_stats = [
            "lhc = latin_hypercube_sampling.LatinHypercube(",
            "    xmin=expression_array, xmax=expression_array*3", ")",
            "lhc.generate_array(1000) # creates a LHD of size 1000", "",
            "# will use default minimal set of features", "summary_stats = SummariesTSFRESH()"
        ]
        return nbf.new_code_cell("\n".join(nb_sum_stats))

    def create_me_notebook(self, results=None, compute="StochSS"):
        '''Create a model exploration jupiter notebook for a StochSS model/workflow.'''
        self.nb_type = self.MODEL_EXPLORATION
        cells = self.create_common_cells()
        self.__create_import_cells(cells)
        self.__create_me_header_cells(cells)

        self.settings['solver'] = self.get_gillespy2_solver_name()
        cells.insert(11, self.__create_simulator_func())
        cells.insert(13, nbf.new_code_cell("c = Client()\nc"))
        cells.insert(15, self.__create_summary_stats())
        cells.insert(17, nbf.new_code_cell("met = StochMET(simulator, lhc, summary_stats)"))
        cells.insert(19, nbf.new_code_cell("met.compute(n_points=500, chunk_size=10)"))
        self.__create_explore_cells(cells)
        if compute != "StochSS":
            self.log(
                "warning",
                "AWS Cloud compute environment is not supported by SCIOPE model exploration workflows."
            )

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_mi_notebook(self, results=None, compute="StochSS"):
        '''Create a model inference jupiter notebook for a StochSS model/workflow.'''
        self.nb_type = self.MODEL_INFERENCE
        cells = self.create_common_cells()
        self.__create_import_cells(cells)
        self.__create_mi_header_cells(cells)

        self.settings['solver'] = self.get_gillespy2_solver_name()
        self.__create_observed_data(cells)
        self.__create_simulator_cells(cells)
        cells.insert(15, self.__create_prior())
        cells.insert(23, nbf.new_code_cell(
            "summ_func = auto_tsfresh.SummariesTSFRESH()\n\n" + \
            "# Distance\nns = naive_squared.NaiveSquaredDistance()"
        ))
        cells.insert(25, nbf.new_code_cell("c = Client()\nc"))
        self.__create_abc_cells(cells)
        if compute != "StochSS":
            self.log(
                "warning",
                "AWS Cloud compute environment is not supported by SCIOPE model inference workflows."
            )

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}
