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
import json
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

    def __create_infer_cells(self, cells, index, results=None):
        pad = '    '
        samples = self.settings['inferenceSettings']['numSamples']
        b_size = self.settings['inferenceSettings']['batchSize']
        c_size = self.settings['inferenceSettings']['chunkSize']
        infer_lines = [
            "smc_abc_results = smc_abc_inference.infer(",
            f"{pad}num_samples={samples}, batch_size={b_size}, eps_selector=eps_selector, chunk_size={c_size}", ")",
            "parameters = {}", "for i, name in enumerate(parameter_names):", f"{pad}parameters[name] = values[i]",
            "results = InferenceResults.build_from_inference_results(",
            f"{pad}smc_abc_results, parameters, [lower_bounds, upper_bounds]", ")"
        ]
        if results is not None:
            for i in range(3):
                infer_lines[i] = f"# {infer_lines[i]}"
            load_lines = "\n".join([
                f"path = '{results}'", "with open(os.path.join(os.path.expanduser('~'), path), 'rb') as results_file:",
                f"{pad}smc_abc_results = pickle.load(results_file)"
            ])
            infer_lines.insert(3, load_lines)
        cells.insert(index, nbf.new_code_cell("\n".join(infer_lines)))
        return index + 2

    @classmethod
    def __create_explore_cells(cls, cells):
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

    def __create_import_cells(self, cells, results=None):
        base_imports = ["import csv", "import numpy", "from dask.distributed import Client"]
        if self.nb_type == self.MODEL_INFERENCE:
            sciope_imports = [
                "import sciope",
                "from sciope.inference import smc_abc",
                "from sciope.utilities.priors import uniform_prior",
                "from sciope.utilities.summarystats import auto_tsfresh, identity",
                "from sciope.utilities.epsilonselectors import RelativeEpsilonSelector",
                "from stochss.handlers.util.model_inference import InferenceResults"
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
        if results is not None:
            result_imports = ["import os", "import pickle"]
            cells.insert(1, nbf.new_code_cell("\n".join(result_imports)))

    @classmethod
    def __create_me_header_cells(cls, cells):
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

    @classmethod
    def __create_mi_header_cells(cls, cells):
        obsd_header = nbf.new_markdown_cell("\n".join([
            "***", "## Observed (fixed) Data", "***",
            "Sciope assumes the format of a time series to be a matrix of the form,", "$N \times S \times T$,",
            "where $N$ is the number of trajectories, $S$ is the number of species and $T$ is the number of time "
            + "points or intervals.", "", "Steps:",
            "- load some observed (fixed) data based on default parameters of model.", "- Reshape data to (N x S x T)",
            "- Remove timepoints array", "- Verify the shape of the time series"
        ]))
        sf_header = nbf.new_markdown_cell("***\n## Simulator Function\n***")
        p_header = nbf.new_markdown_cell("\n".join([
            "***", "## Priors", "***", "Steps:", "- Get the current values", "- Calculate the bounds",
            "- Create the prior function.  Here we use uniform prior"
        ]))
        ss_header = nbf.new_markdown_cell("\n".join([
            "***", "## Summary Statistics", "***", "Function to generate summary statistics"
        ]))
        es_header = nbf.new_markdown_cell("***\n## Epsilon Selector\n***")
        inf_header = nbf.new_markdown_cell("\n".join([
            "***", "## SMC-ABC Inference", "***", "### Start local cluster using dask client"
        ]))
        run_header = nbf.new_markdown_cell("***\n## Run the ABC Inference\n***")
        vis_header = nbf.new_markdown_cell("***\n## Visualization\n***")
        c_header = nbf.new_markdown_cell("***\n## Close Dask Client\n***")
        cells.extend([
            obsd_header, sf_header, p_header, ss_header, es_header, inf_header, run_header, vis_header, c_header
        ])

    def __create_observed_data(self, cells, results=None):
        pad = "    "
        start = 11 if results is None else 12
        load_cell = nbf.new_code_cell("\n".join([
            "def load_obs_data(path=None, data=None):",
            f"{pad}if not (path.endswith('.csv') or path.endswith('.obsd')):",
            f"{pad*2}raise ValueError('Observed data must be a CSV file (.csv) or a directory (.obsd) of CSV files.')",
            f"{pad}if path.endswith('.csv'):", f"{pad*2}new_data = get_csv_data(path)", f"{pad*2}data.append(new_data)",
            f"{pad*2}return data", f"{pad}for file in os.listdir(path):",
            f"{pad*2}data = load_obs_data(path=os.path.join(path, file), data=data)",
            f"{pad}return numpy.array(data)[:, 1:, :]"
        ]))
        csv_cell = nbf.new_code_cell("\n".join([
            "def get_csv_data(path):", f"{pad}with open(path, 'r', newline='', encoding='utf-8') as csv_fd:",
            f"{pad*2}csv_reader = csv.reader(csv_fd, delimiter=',')", f"{pad*2}rows = []",
            f"{pad*2}for i, row in enumerate(csv_reader):", f"{pad*3}if i != 0:", f"{pad*4}rows.append(row)",
            f"{pad*2}data = numpy.array(rows).swapaxes(0, 1).astype('float')", f"{pad}return data"
        ]))
        cells.insert(start, csv_cell)
        cells.insert(start + 1, load_cell)
        obsd_lines = [
            "kwargs = configure_simulation()", "results = model.run(**kwargs)", "",
            "unshaped_obs_data = results.to_array()", "shaped_obs_data = unshaped_obs_data.swapaxes(1, 2)",
            "obs_data = shaped_obs_data[:,1:, :]", "", "obs_data = load_obs_data(",
            f"{pad}path='../{self.get_file(self.settings['inferenceSettings']['obsData'])}', data=[]",
            ")", "print(obs_data.shape)"
        ]
        if self.settings['inferenceSettings']['obsData'] == "":
            for i in range(len(obsd_lines) - 4, len(obsd_lines) - 1):
                obsd_lines[i] = f"# {obsd_lines[i]}"
        else:
            for i in range(len(obsd_lines) - 4):
                if obsd_lines[i] != "":
                    obsd_lines[i] = f"# {obsd_lines[i]}"
        obsd_cell = nbf.new_code_cell("\n".join(obsd_lines))
        cells.insert(start + 2, obsd_cell)
        return start + 4

    def __create_prior(self):
        pad = '    '
        if len(self.settings['inferenceSettings']['parameters']) > 0:
            v_lines = ["values = numpy.array([", "])"]
            n_lines = ["parameter_names = [", "]"]
            l_lines = ["lower_bounds = numpy.array([", "])"]
            m_lines = ["upper_bounds = numpy.array([", "])"]
            values = names = f"{pad}"
            mins = maxs = f"{pad}"
            for param in self.settings['inferenceSettings']['parameters']:
                values = f"{values}{self.model.listOfParameters[param['name']].value}, "
                names = f"{names}'{param['name']}', "
                mins = f"{mins}{param['min']}, "
                maxs = f"{maxs}{param['max']}, "
                if len(values) > 100:
                    v_lines.insert(-1, values[:-1])
                    values = f"{pad}"
                if len(names) > 100:
                    n_lines.insert(-1, names[:-1])
                    names = f"{pad}"
                if len(mins) > 100:
                    l_lines.insert(-1, mins[:-1])
                    mins = f"{pad}"
                if len(maxs) > 100:
                    m_lines.insert(-1, maxs[:-1])
                    maxs = f"{pad}"
            v_lines.insert(-1, values[:-2])
            n_lines.insert(-1, names[:-2])
            l_lines.insert(-1, mins[:-2])
            m_lines.insert(-1, maxs[:-2])
            nb_prior = [
                "\n".join(v_lines), "\n".join(n_lines), "", "\n".join(l_lines), "\n".join(m_lines), "",
            ]
        else:
            nb_prior = [
                "values = numpy.array([param.expression for param in model.listOfParameters.values()], dtype='float')",
                "parameter_names = [param.name for param in model.listOfParameters.values()]", "",
                "lower_bounds = values * 0.1", "upper_bounds = values * 2.0", ""
            ]
        nb_prior.append("uni_prior = uniform_prior.UniformPrior(lower_bounds, upper_bounds)")
        return nbf.new_code_cell("\n".join(nb_prior))

    def __create_simulator_cells(self, cells, index):
        pad = '    '
        proc_lines = [
            "def process(raw_results):"
        ]
        if self.settings['inferenceSettings']['summaryStatsType'] == "identity":
            ident_lines = [
                f"{pad}definitions = dict(", f"{pad*2}time='time',", f"{pad})", "", f"{pad}trajectories = []",
                f"{pad}for result in raw_results:", f"{pad*2}evaluations = dict()",
                f"{pad*2}for label, formula in definitions.items():",
                f"{pad*3}evaluations[label] = eval(formula, dict(), result.data)",
                f"{pad*2}trajectories.append(gillespy2.Trajectory(",
                f"{pad*3}data=evaluations, model=result.model, solver_name=result.solver_name, rc=result.rc",
                f"{pad*2}))", f"{pad}processed_results = gillespy2.Results(trajectories)",
                f"{pad}return processed_results.to_array().swapaxes(1, 2)[:,1:, :]"
            ]
            lines = []
            for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
                line = f"{pad*2}{feature_calculator['name']}='{feature_calculator['formula']}',"
                lines.append(line)
            ident_lines.insert(2, "\n".join(lines)[:-1])
            proc_lines.extend(ident_lines)
        else:
            proc_lines.append(f"{pad}return raw_results.to_array().swapaxes(1, 2)[:,1:, :]")
        proc_cell = nbf.new_code_cell("\n".join(proc_lines))
        cells.insert(index, proc_cell)
        if len(self.settings['inferenceSettings']['parameters']) > 0:
            lines = [f"{pad}labels = [", f"{pad}]"]
            line = f"{pad*2}"
            for param in self.settings['inferenceSettings']['parameters']:
                line = f"{line}'{param['name']}', "
                if len(line) > 98:
                    lines.insert(-1, line[:-1])
                    line = f"{pad*2}"
            lines.insert(-1, line[:-2])
            labels = "\n".join(lines)
        else:
            labels = f"{pad}labels = list(map(lambda param: param.name, model.listOfParameters.values()))"
        sim_cell = nbf.new_code_cell("\n".join([
            "def simulator(parameter_point):", f"{pad}model = {self.get_function_name()}()", "", labels,
            f"{pad}for ndx, parameter in enumerate(parameter_point):",
            f"{pad*2}model.listOfParameters[labels[ndx]].expression = str(parameter)", "",
            f"{pad}kwargs = configure_simulation()", f"{pad}raw_results = model.run(**kwargs)",
            "", f"{pad}return process(raw_results)"
        ]))
        cells.insert(index + 1, sim_cell)
        return index + 3

    @classmethod
    def __create_simulator_func(cls):
        nb_sim_func = [
            "settings = configure_simulation()", "simulator = wrapper.get_simulator(",
            "    gillespy_model=model, run_settings=settings, species_of_interest=['U', 'V']",
            ")", "expression_array = wrapper.get_parameter_expression_array(model)"
        ]
        return nbf.new_code_cell("\n".join(nb_sim_func))

    def __create_summary_stats(self):
        if self.nb_type == self.MODEL_INFERENCE:
            pad = '    '
            summary_type = self.settings['inferenceSettings']['summaryStatsType']
            if summary_type == "identity":
                nb_sum_stats = ['summ_func = identity.Identity()']
            elif summary_type == "minimal" and len(self.settings['inferenceSettings']['summaryStats']) == 8:
                nb_sum_stats = ["summ_func = auto_tsfresh.SummariesTSFRESH()"]
            else:
                nb_sum_stats = ["summ_func = auto_tsfresh.SummariesTSFRESH(features={", "})"]
                lines = []
                for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
                    args = "None" if feature_calculator['args'] is None else json.dumps(feature_calculator['args'])
                    lines.append(f"{pad}'{feature_calculator['name']}': {args},")
                nb_sum_stats.insert(-1, "\n".join(lines)[:-1])
        else:
            nb_sum_stats = [
                "lhc = latin_hypercube_sampling.LatinHypercube(",
                "    xmin=expression_array, xmax=expression_array*3", ")",
                "lhc.generate_array(1000) # creates a LHD of size 1000", "",
                "# will use default minimal set of features", "summary_stats = SummariesTSFRESH()"
            ]
        return nbf.new_code_cell("\n".join(nb_sum_stats))

    def __create_visualization_cells(self, cells, index):
        cells.insert(index, nbf.new_code_cell("results.plot()"))
        cells.insert(index + 1, nbf.new_code_cell(
            f"results.plot_round(ndx={self.settings['inferenceSettings']['numRounds'] - 1})"
        ))

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
        self.__create_import_cells(cells, results=results)
        self.__create_mi_header_cells(cells)

        self.settings['solver'] = self.get_gillespy2_solver_name()
        index = self.__create_observed_data(cells, results=results)
        index = self.__create_simulator_cells(cells, index)
        cells.insert(index, self.__create_prior())
        cells.insert(index + 2, self.__create_summary_stats())
        cells.insert(index + 4, nbf.new_code_cell(
            f"eps_selector = RelativeEpsilonSelector(20, max_rounds={self.settings['inferenceSettings']['numRounds']})"
        ))
        cells.insert(index + 6, nbf.new_code_cell("c = Client()\nc"))
        cells.insert(index + 7, nbf.new_code_cell("\n".join([
            "smc_abc_inference = smc_abc.SMCABC(",
            "    obs_data, sim=simulator, prior_function=uni_prior, summaries_function=summ_func.compute", ")"
        ])))
        index = self.__create_infer_cells(cells, index + 9, results)
        self.__create_visualization_cells(cells, index)
        cells.append(nbf.new_code_cell("# c.close()"))
        if compute != "StochSS":
            self.log(
                "warning",
                "AWS Cloud compute environment is not supported by SCIOPE model inference workflows."
            )

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}
