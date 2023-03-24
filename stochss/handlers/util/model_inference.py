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
import os
import csv
import copy
import json
import shutil
import pickle
import logging
import tempfile
import traceback

import numpy
import plotly
from plotly import figure_factory, subplots

import gillespy2

from sciope.inference import smc_abc
from sciope.utilities.priors import uniform_prior
from sciope.utilities.summarystats import auto_tsfresh, identity
from sciope.utilities.epsilonselectors import RelativeEpsilonSelector

from .stochss_job import StochSSJob
from .stochss_errors import StochSSJobError, StochSSJobResultsError

log = logging.getLogger("stochss")

common_rgb_values = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2',
    '#7f7f7f', '#bcbd22', '#17becf', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#00ffff', '#ff00ff', '#800000', '#808000', '#008000', '#800080', '#008080',
    '#000080', '#ff9999', '#ffcc99', '#ccff99', '#cc99ff', '#ffccff', '#62666a',
    '#8896bb', '#77a096', '#9d5a6c', '#9d5a6c', '#eabc75', '#ff9600', '#885300',
    '#9172ad', '#a1b9c4', '#18749b', '#dadecf', '#c5b8a8', '#000117', '#13a8fe',
    '#cf0060', '#04354b', '#0297a0', '#037665', '#eed284', '#442244',
    '#ffddee', '#702afb'
]

def combine_colors(colors):
    red = int(sum([int(k[:2], 16) * 0.5 for k in colors]))
    green = int(sum([int(k[2:4], 16) * 0.5 for k in colors]))
    blue = int(sum([int(k[4:6], 16) * 0.5 for k in colors]))
    zpad = lambda x: x if len(x)==2 else '0' + x
    color = f"#{zpad(hex(red)[2:])}{zpad(hex(green)[2:])}{zpad(hex(blue)[2:])}"
    return color

class ModelInference(StochSSJob):
    '''
    ################################################################################################
    StochSS model inference job object
    ################################################################################################
    '''

    TYPE = "inference"

    def __init__(self, path):
        '''
        Intitialize a model inference job object

        Attributes
        ----------
        path : str
            Path to the model inference job
        '''
        super().__init__(path=path)
        self.g_model, self.s_model = self.load_models()
        self.settings = self.load_settings()

    @classmethod
    def __get_csv_data(cls, path):
        with open(path, "r", newline="", encoding="utf-8") as csv_fd:
            csv_reader = csv.reader(csv_fd, delimiter=",")
            rows = []
            for i, row in enumerate(csv_reader):
                if i != 0:
                    rows.append(row)
            data = numpy.array(rows).swapaxes(0, 1).astype("float")
        return data

    @classmethod
    def __get_csvzip(cls, dirname, name):
        shutil.make_archive(os.path.join(dirname, name), "zip", dirname, name)
        path = os.path.join(dirname, f"{name}.zip")
        with open(path, "rb") as zip_file:
            return zip_file.read()

    @classmethod
    def __get_round_result_plot(cls, results, names, values, dmin, dmax,
                                title=None, xaxis=None, yaxis=None):
        accepted_samples = numpy.vstack(results['accepted_samples']).swapaxes(0, 1)

        nbins = 50
        rows = cols = len(accepted_samples)
        sizes = (numpy.array(dmax) - numpy.array(dmin)) / nbins

        fig = subplots.make_subplots(
            rows=rows, cols=cols, column_titles=names, row_titles=names,
            x_title=xaxis, y_title=yaxis, vertical_spacing=0.075
        )

        for i in range(rows):
            for j in range(cols):
                row = i + 1
                col = j + 1
                if i > j:
                    continue
                if i == j:
                    color = common_rgb_values[(i)%len(common_rgb_values)]
                    trace = plotly.graph_objs.Histogram(
                        x=accepted_samples[i], name=names[i], legendgroup=names[i], showlegend=False,
                        marker_color=color, opacity=0.75,
                        xbins={"start": dmin[i], "end": dmax[i], "size": sizes[i]}
                    )

                    fig.append_trace(trace, row, col)
                    fig.update_xaxes(row=row, col=col, range=[dmin[i], dmax[i]])
                    fig.add_vline(
                        results['inferred_parameters'][i], row=row, col=col, line={"color": "green"},
                        exclude_empty_subplots=True, layer='above'
                    )
                    fig.add_vline(values[i], row=row, col=col, line={"color": "red"}, layer='above')
                else:
                    color = combine_colors([
                        common_rgb_values[(i)%len(common_rgb_values)][1:],
                        common_rgb_values[(j)%len(common_rgb_values)][1:]
                    ])
                    trace = plotly.graph_objs.Scatter(
                        x=accepted_samples[j], y=accepted_samples[i], mode='markers', marker_color=color,
                        name=f"{names[j]} X {names[i]}", legendgroup=f"{names[j]} X {names[i]}", showlegend=False
                    )
                    fig.append_trace(trace, row, col)
                    fig.update_xaxes(row=row, col=col, range=[dmin[j], dmax[j]])
                    fig.update_yaxes(row=row, col=col, range=[dmin[i], dmax[i]])

        fig.update_layout(height=1000)
        if title is not None:
            title = {'text': title, 'x': 0.5, 'xanchor': 'center'}
            fig.update_layout(title=title)
        return fig

    @classmethod
    def __get_full_results_plot(cls, results, names, values, dmin, dmax,
                                title=None, xaxis="Values", yaxis="Sample Concentrations"):
        cols = 2
        nbins = 50
        sizes = (numpy.array(dmax) - numpy.array(dmin)) / nbins
        rows = int(numpy.ceil(len(results[0]['accepted_samples'][0])/cols))

        fig = subplots.make_subplots(
            rows=rows, cols=cols, subplot_titles=names, x_title=xaxis, y_title=yaxis, vertical_spacing=0.075

        )
        fig2 = subplots.make_subplots(
            rows=rows, cols=cols, subplot_titles=names, x_title=xaxis, y_title=yaxis, vertical_spacing=0.075

        )

        for i, result in enumerate(results):
            accepted_samples = numpy.vstack(result['accepted_samples']).swapaxes(0, 1)
            base_opacity = 0.5 if len(results) <= 1 else (i / (len(results) - 1) * 0.5)

            for j, accepted_values in enumerate(accepted_samples):
                row = int(numpy.ceil((j + 1) / cols))
                col = (j % cols) + 1

                name = f"round {i + 1}"
                color = common_rgb_values[i % len(common_rgb_values)]
                opacity = base_opacity + 0.25
                # Create histogram trace
                trace = plotly.graph_objs.Histogram(
                    x=accepted_values, name=name, legendgroup=name, showlegend=j==0, marker_color=color,
                    opacity=opacity, xbins={"start": dmin[j], "end": dmax[j], "size": sizes[j]}
                )
                fig.append_trace(trace, row, col)
                # Create PDF trace
                tmp_fig = figure_factory.create_distplot(
                    [accepted_values], [names[j]], curve_type='normal', bin_size=sizes[j], histnorm="probability"
                )
                trace2 = plotly.graph_objs.Scatter(
                    x=tmp_fig.data[1]['x'], y=tmp_fig.data[1]['y'] * 1000, name=name, legendgroup=name, showlegend=False,
                    mode='lines', line=dict(color=color)
                )
                fig2.append_trace(trace2, row, col)
                fig2.update_xaxes(row=row, col=col, range=[dmin[j], dmax[j]])
                if i == len(results) - 1:
                    fig.add_vline(values[j], row=row, col=col, line={"color": "red"}, layer='above')
                    fig.add_vline(
                        result['inferred_parameters'][j], row=row, col=col, line={"color": "green"},
                        exclude_empty_subplots=True, layer='above'
                    )
                    fig2.add_vline(values[j], row=row, col=col, line={"color": "red"}, layer='above')
                    fig2.add_vline(
                        result['inferred_parameters'][j], row=row, col=col, line={"color": "green"},
                        exclude_empty_subplots=True, layer='above'
                    )

        fig.update_layout(barmode='overlay', height=500 * rows)
        fig2.update_layout(height=500 * rows)
        if title is not None:
            title = {'text': title, 'x': 0.5, 'xanchor': 'center'}
            fig.update_layout(title=title)
            fig2.update_layout(title=title)
        return fig

    def __get_infer_args(self):
        settings = self.settings['inferenceSettings']
        eps_selector = RelativeEpsilonSelector(20, max_rounds=settings['numRounds'])
        args = [settings['num_samples'], settings['batchSize']]
        kwargs = {"eps_selector": eps_selector, "chunk_size": settings['chunkSize']}
        return args, kwargs

    def __get_pickled_results(self):
        path = os.path.join(self.__get_results_path(full=True), "results.p")
        with open(path, "rb") as results_file:
            return pickle.load(results_file)

    def __get_prior_function(self):
        dmin = []
        dmax = []
        for parameter in self.settings['inferenceSettings']['parameters']:
            dmin.append(parameter['min'])
            dmax.append(parameter['max'])
        return uniform_prior.UniformPrior(numpy.array(dmin, dtype="float"), numpy.array(dmax, dtype="float"))

    def __get_results_path(self, full=False):
        return os.path.join(self.get_path(full=full), "results")

    def __get_run_settings(self):
        solver_map = {"ODE":self.g_model.get_best_solver_algo("ODE"),
                      "SSA":self.g_model.get_best_solver_algo("SSA"),
                      "CLE":self.g_model.get_best_solver_algo("CLE"),
                      "Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Leaping"),
                      "Hybrid-Tau-Leaping":self.g_model.get_best_solver_algo("Tau-Hybrid")}
        run_settings = self.get_run_settings(settings=self.settings, solver_map=solver_map)
        instance_solvers = ["ODECSolver", "SSACSolver", "TauLeapingCSolver", "TauHybridCSolver"]
        if run_settings['solver'].name in instance_solvers :
            run_settings['solver'] = run_settings['solver'](model=self.g_model)
        return run_settings

    def __get_summaries_function(self):
        summary_type = self.settings['inferenceSettings']['summaryStatsType']
        if summary_type == "identity":
            return identity.Identity()
        if summary_type == "minimal" and len(self.settings['inferenceSettings']['summaryStats']) == 8:
            return auto_tsfresh.SummariesTSFRESH()
        features = {}
        for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
            features[feature_calculator['name']] = feature_calculator['args']
        return auto_tsfresh.SummariesTSFRESH(features=features)

    def __load_obs_data(self, path=None, data=None):
        if path is None:
            path = self.get_new_path(self.settings['inferenceSettings']['obsData'])
        if not (path.endswith(".csv") or path.endswith(".obsd")):
            raise StochSSJobError("Observed data must be a CSV file (.csv) or a directory (.obsd) of CSV files.")
        if path.endswith(".csv"):
            new_data = self.__get_csv_data(path)
            data.append(new_data)
            return data
        for file in os.listdir(path):
            data = self.__load_obs_data(path=os.path.join(path, file), data=data)
        return data

    @classmethod
    def __report_result_error(cls, trace):
        message = "An unexpected error occured with the result object"
        raise StochSSJobResultsError(message, trace)

    @classmethod
    def __store_pickled_results(cls, results):
        try:
            with open('results/results.p', 'wb') as results_fd:
                pickle.dump(results, results_fd)
        except Exception as err:
            message = f"Error storing pickled results: {err}\n{traceback.format_exc()}"
            log.error(message)
            return message
        return False

    def __to_csv(self, path='.', nametag="results_csv"):
        results = self.__get_pickled_results()
        settings = self.settings['inferenceSettings']
        names = list(map(lambda param: param['name'], settings['parameters']))

        directory = os.path.join(path, str(nametag))
        if not os.path.exists(directory):
            os.mkdir(directory)

        infer_csv = [["Round", "Accepted Count", "Trial Count"]]
        round_headers = ["Sample ID", "Distances"]
        for name in names:
            infer_csv[0].append(name)
            round_headers.insert(-1, name)

        for i, round in enumerate(results):
            infer_line = [i + 1, round['accepted_count'], round['trial_count']]
            infer_line.extend(round['inferred_parameters'])
            infer_csv.append(infer_line)

            round_csv = [round_headers]
            for j, accepted_sample in enumerate(round['accepted_samples']):
                round_line = accepted_sample.tolist()
                round_line.insert(0, j + 1)
                round_line.extend(round['distances'][j])
                round_csv.append(round_line)

            round_path = os.path.join(directory, f"round{i + 1}-details.csv")
            self.__write_csv_file(round_path, round_csv)

        infer_path = os.path.join(directory, "inference-overview.csv")
        self.__write_csv_file(infer_path, infer_csv)

    @classmethod
    def __write_csv_file(cls, path, data):
        with open(path, "w", encoding="utf-8") as csv_file:
            csv_writer = csv.writer(csv_file)
            for line in data:
                csv_writer.writerow(line)

    def export_inferred_model(self, round_ndx=-1):
        """
        Export the jobs model after updating the inferred parameter values.
        """
        model = copy.deepcopy(self.g_model)
        round = self.__get_pickled_results()[round_ndx]
        parameters = self.settings['inferenceSettings']['parameters']

        for i, parameter in enumerate(parameters):
            model.listOfParameters[parameter['name']].expression = str(round['inferred_parameters'][i])

        inf_model = gillespy2.export_StochSS(model, return_stochss_model=True)
        workflow = os.path.dirname(self.path)
        name = f"{self.get_file(path=workflow)} - {self.get_file()}"
        inf_model['name'] = f"Inferred-{model.name}"
        inf_model['modelSettings'] = self.s_model['modelSettings']
        inf_model['refLinks'] = self.s_model['refLinks']
        inf_model['refLinks'].append({
            "path": f"{workflow}&job={self.get_file()}", "name": name, "job": True
        })
        return inf_model

    def get_csv_data(self, name):
        """
        Generate the csv results and return the binary of the zipped archive.
        """
        self.log("info", "Getting job results...")
        nametag = f"Inference - {name} - Results-CSV"
        with tempfile.TemporaryDirectory() as tmp_dir:
            self.__to_csv(path=tmp_dir, nametag=nametag)
            return self.__get_csvzip(tmp_dir, nametag)

    def get_result_plot(self, round=None, add_config=False, **kwargs):
        """
        Generate a plot for inference results.
        """
        results = self.__get_pickled_results()
        parameters = self.settings['inferenceSettings']['parameters']
        names = []
        values = []
        dmin = []
        dmax = []
        for parameter in parameters:
            names.append(parameter['name'])
            values.append(self.g_model.listOfParameters[parameter['name']].value)
            dmin.append(parameter['min'])
            dmax.append(parameter['max'])
        if round is None:
            fig_obj = self.__get_full_results_plot(results, names, values, dmin, dmax, **kwargs)
        else:
            fig_obj = self.__get_round_result_plot(results[round], names, values, dmin, dmax, **kwargs)
        fig = json.loads(json.dumps(fig_obj, cls=plotly.utils.PlotlyJSONEncoder))
        if add_config:
            fig["config"] = {"responsive": True}
        return fig

    def process(self, raw_results):
        """
        Post processing function used to reshape simulator results and
        process results for identity summary statistics.
        """
        if self.settings['inferenceSettings']['summaryStatsType'] != "identity":
            return raw_results.to_array().swapaxes(1, 2)[:,1:, :]

        definitions = {"time": "time"}
        for feature_calculator in self.settings['inferenceSettings']['summaryStats']:
            definitions[feature_calculator['name']] = feature_calculator['formula']

        trajectories = []
        for result in raw_results:
            evaluations = {}
            for label, formula in definitions.items():
                evaluations[label] = eval(formula, {}, result.data)
            trajectories.append(gillespy2.Trajectory(
                data=evaluations, model=result.model, solver_name=result.solver_name, rc=result.rc
            ))
        processed_results = gillespy2.Results([evaluations])
        return processed_results.to_array().swapaxes(1, 2)[:,1:, :]

    def run(self, verbose=True):
        '''
        Run a model inference job

        Attributes
        ----------
        verbose : bool
            Indicates whether or not to print debug statements
        '''
        obs_data = numpy.array(self.__load_obs_data(data=[]))[:,1:, :]
        prior = self.__get_prior_function()
        summaries = self.__get_summaries_function()
        if verbose:
            log.info("Running the model inference")
        smc_abc_inference = smc_abc.SMCABC(
            obs_data, sim=self.simulator, prior_function=prior, summaries_function=summaries.compute
        )
        infer_args, infer_kwargs = self.__get_infer_args()
        results = smc_abc_inference.infer(*infer_args, **infer_kwargs)
        if verbose:
            log.info("The model inference has completed")
            log.info("Storing the results as pickle.")
        if not 'results' in os.listdir():
            os.mkdir('results')
        pkl_err = self.__store_pickled_results(results)
        if pkl_err:
            self.__report_result_error(trace=pkl_err)
        export_links = {i + 1: None for i in range(len(results))}
        with open("export-links.json", "w", encoding="utf-8") as elfd:
            json.dump(export_links, elfd, indent=4, sort_keys=True)

    def simulator(self, parameter_point):
        """ Wrapper function for inference simulations. """
        model = copy.deepcopy(self.g_model)

        labels = list(map(lambda parameter: parameter['name'], self.settings['inferenceSettings']['parameters']))
        for ndx, parameter in enumerate(parameter_point):
            model.listOfParameters[labels[ndx]].expression = str(parameter)

        kwargs = self.__get_run_settings()
        raw_results = model.run(**kwargs)

        return self.process(raw_results)

    def update_export_links(self, round, path):
        """
        Updated the export paths for a round.
        """
        el_path = os.path.join(self.get_path(full=True), "export-links.json")
        with open(el_path, "r", encoding="utf-8") as elfd:
            export_links = json.load(elfd)

        if round < 1:
            round = list(export_links.keys())[round]
        export_links[round] = path

        with open(el_path, "w", encoding="utf-8") as elfd:
            json.dump(export_links, elfd, indent=4, sort_keys=True)
