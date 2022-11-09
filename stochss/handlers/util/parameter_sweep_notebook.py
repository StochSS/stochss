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

import traceback
from nbformat import v4 as nbf

from .stochss_notebook import StochSSNotebook
from .stochss_errors import StochSSModelFormatError

class StochSSParamSweepNotebook(StochSSNotebook):
    '''
    ################################################################################################
    StochSS parameter sweep notebook object
    ################################################################################################
    '''
    def __init__(self, path, new=False, models=None, settings=None):
        '''Intitialize a parameter sweep notebook object and
           if its new create it on the users file system.

        Attributes
        ----------
        path : str
            Path to the notebook'''
        super().__init__(path=path, new=new, models=models, settings=settings)

    def __create_1d_aggregator(self):
        pad = '    '
        nb_agg = [
            f"{pad}def ensemble_aggregator(self, results, key='avg', verbose=False):",
            f"{pad*2}self.visible = len(results[0]) > 1",
            f"{pad*2}data = [[self.func_map[key](result), numpy.std(result)] for result in results]",
            f"{pad*2}if verbose:",
            f"{pad*3}print(f'" + r"{key} and std of the ensembles: {data}')",
            f"{pad*2}return numpy.array(data)", ""
        ]
        return '\n'.join(nb_agg)

    def __create_1d_plot(self):
        pad = '    '
        nb_plot = [
            f"{pad}def plot(self, species, fe_key='final', ea_key='avg', verbose=False):",
            f"{pad*2}x_data = self.parameters[0]['range']",
            f"{pad*2}fe_data = self.feature_extractor(species, key=fe_key, verbose=verbose)",
            f"{pad*2}data = self.ensemble_aggregator(fe_data, key=ea_key, verbose=verbose)", "",
            f"{pad*2}fig, ax = plt.subplots(figsize=(15, 6))",
            f"{pad*2}plt.title(f'Parameter Sweep - Variable: " + r"{species}', fontsize=18, fontweight='bold')",
            f"{pad*2}plt.errorbar(x_data, data[:, 0], data[:, 1])",
            f"{pad*2}plt.xlabel(self.parameters[0]['param'], fontsize=16, fontweight='bold')",
            f"{pad*2}plt.ylabel('Population', fontsize=16, fontweight='bold')", ""
        ]
        return '\n'.join(nb_plot)

    def __create_1d_plotplotly(self):
        pad = '    '
        nb_plotplotly =         [
            f"{pad}def plotplotly(self, species, fe_key='final', ea_key='avg',",
            f"{pad*6}return_plotly_figure=False, verbose=False):",
            f"{pad*2}x_data = self.parameters[0]['range']",
            f"{pad*2}fe_data = self.feature_extractor(species, key=fe_key, verbose=verbose)",
            f"{pad*2}data = self.ensemble_aggregator(fe_data, key=ea_key, verbose=verbose)", "",
            f"{pad*2}error_y = dict(type='data', array=data[:, 1], visible=self.visible)",
            f"{pad*2}trace_list = [go.Scatter(x=x_data, y=data[:, 0], error_y=error_y)]", "",
            f"{pad*2}title = f'<b>Parameter Sweep - Variable: " + r"{species}</b>'",
            f"{pad*2}layout = go.Layout(", f"{pad*3}title=dict(text=title, x=0.5),",
            f"{pad*3}xaxis=dict(title=f'<b>" + r'{self.parameters[0]["param"]}</b>' + "'),",
            f"{pad*3}yaxis=dict(title='<b>Population</b>')", f"{pad*2})", "",
            f"{pad*2}fig = dict(data=trace_list, layout=layout)",
            f"{pad*2}if return_plotly_figure:", f"{pad*3}return fig", f"{pad*2}iplot(fig)"
        ]
        return '\n'.join(nb_plotplotly)

    def __create_2d_aggregator(self):
        pad = '    '
        nb_agg =         [
            f"{pad}def ensemble_aggregator(self, results, key='avg', verbose=False):",
            f"{pad*2}data = [self.func_map[key](result) for result in results]",
            f"{pad*2}if verbose:", f"{pad*3}print(f'" + r"{key} of the ensembles: {data}')",
            f"{pad*2}return numpy.array(data)", ""
        ]
        return '\n'.join(nb_agg)

    def __create_2d_plot(self):
        pad = '    '
        nb_plot =         [
            f"{pad}def plot(self, species, fe_key='final', ea_key='avg', verbose=False):",
            f"{pad*2}x_data = self.parameters[0]['range']",
            f"{pad*2}y_data = self.parameters[1]['range']",
            f"{pad*2}fe_data = self.feature_extractor(species, key=fe_key, verbose=verbose)",
            f"{pad*2}ea_data = self.ensemble_aggregator(fe_data, key=ea_key, verbose=verbose)",
            f"{pad*2}shape = (len(self.parameters[1]['range']), len(self.parameters[0]['range']))",
            f"{pad*2}data = numpy.flip(numpy.reshape(ea_data, shape))", "",
            f"{pad*2}fig, ax = plt.subplots(figsize=(16, 2 * len(data)))",
            f"{pad*2}plt.imshow(data)",
            f"{pad*2}ax.set_xticks(numpy.arange(data.shape[1]) + 0.5, minor=False)",
            f"{pad*2}ax.set_yticks(numpy.arange(data.shape[0]) + 0.5, minor=False)",
            f"{pad*2}plt.title(f'Parameter Sweep - Variable: " + r"{species}', fontsize=18, fontweight='bold')",
            f"{pad*2}ax.set_xticklabels(x_data)", f"{pad*2}ax.set_yticklabels(y_data)",
            f"{pad*2}ax.set_xlabel(self.parameters[1]['param'], fontsize=16, fontweight='bold')",
            f"{pad*2}ax.set_ylabel(self.parameters[0]['param'], fontsize=16, fontweight='bold')",
            f"{pad*2}ax.tick_params(axis='x', labelsize=14, labelrotation=90)",
            f"{pad*2}ax.tick_params(axis='y', labelsize=14)",
            f"{pad*2}divider = make_axes_locatable(ax)",
            f"{pad*2}cax = divider.append_axes('right', size='5%', pad=0.2)",
            f"{pad*2}_ = plt.colorbar(ax=ax, cax=cax)", ""
        ]
        return '\n'.join(nb_plot)

    def __create_2d_plotplotly(self):
        pad = '    '
        nb_plotplotly = [
            f"{pad}def plotplotly(self, species, fe_key='final', ea_key='avg',",
            f"{pad*6}return_plotly_figure=False, verbose=False):",
            f"{pad*2}x_data = self.parameters[1]['range']",
            f"{pad*2}y_data = self.parameters[0]['range']",
            f"{pad*2}fe_data = self.feature_extractor(species, key=fe_key, verbose=verbose)",
            f"{pad*2}ea_data = self.ensemble_aggregator(fe_data, key=ea_key, verbose=verbose)",
            f"{pad*2}shape = (len(self.parameters[1]['range']), len(self.parameters[0]['range']))",
            f"{pad*2}data = numpy.reshape(ea_data, shape)", "",
            f"{pad*2}trace_list = [go.Heatmap(z=data, x=x_data, y=y_data)]", "",
            f"{pad*2}title = f'<b>Parameter Sweep - Variable: " + r"{species}</b>'",
            f"{pad*2}layout = go.Layout(", f"{pad*3}title=dict(text=title, x=0.5),",
            f"{pad*3}xaxis=dict(title=f'<b>" + '{self.parameters[1]["param"]}</b>' + "'),",
            f"{pad*3}yaxis=dict(title=f'<b>" + '{self.parameters[0]["param"]}</b>' + "')",
            f"{pad*2})", "", f"{pad*2}fig = dict(data=trace_list, layout=layout)",
            f"{pad*2}if return_plotly_figure:", f"{pad*3}return fig", f"{pad*2}iplot(fig)"
        ]
        return '\n'.join(nb_plotplotly)

    def __create_header_cells(self, cells):
        cells.extend([
            nbf.new_markdown_cell("***\n## Parameter Sweep\n***"),
            nbf.new_markdown_cell("### Instantiate the Parameter Sweep"),
            nbf.new_markdown_cell("***\n## Configure the Parameter Sweep\n***"),
            nbf.new_markdown_cell("***\n## Run the Parameter Sweep\n***"),
            nbf.new_markdown_cell("***\n## Visualization\n***")
        ])

    def __create_import_cells(self, cells, results=None):
        base_imports = ["import copy", "import hashlib"]
        if results is not None:
            base_imports.insert(0, "import os")
            base_imports.insert(2, "import pickle")
        cells.insert(1, nbf.new_code_cell("\n".join(base_imports)))
        cells.insert(2, nbf.new_code_cell("import numpy"))
        cells.insert(3, nbf.new_markdown_cell(
            "MatPlotLib and Plotly are used for creating custom visualizations"
        ))
        mpl_imports = ["from matplotlib import pyplot as plt"]
        if self.nb_type == self.PARAMETER_SWEEP_2D:
            mpl_imports.append("from mpl_toolkits.axes_grid1 import make_axes_locatable")
        cells.insert(4, nbf.new_code_cell("\n".join(mpl_imports)))
        cells.insert(5, nbf.new_code_cell(
            "from plotly.offline import iplot\nimport plotly.graph_objs as go"
        ))

    def __create_parameter_sweep_class(self):
        pad = '    '
        nb_psweep_class = [
            "class ParameterSweep:", f"{pad}def __init__(self, model):",
            f"{pad*2}self.model = model", f"{pad*2}self.settings = " + r"{}",
            f"{pad*2}self.parameters = []", f"{pad*2}self.__parameters = " + r"{}",
            "", f"{pad*2}self.results = " + r"{}", f"{pad*2}self.__results = " + r"{}",
            "", f"{pad}def __reset(self):", f"{pad*2}self.results = " + r"{}",
            f"{pad*2}self.__results = " + r"{}", "",
            f"{pad}def __run(self, variables, index, verbose=False):",
            f"{pad*2}if index < len(self.parameters):",
            f"{pad*3}parameter = self.parameters[index]", f"{pad*3}index += 1",
            f"{pad*3}for value in parameter['range']:",
            f"{pad*4}variables[parameter['param']] = value",
            f"{pad*4}self.__run(variables, index, verbose=verbose)", f"{pad*2}else:",
            f"{pad*3}sim_key = hashlib.md5(str(variables).encode('utf-8')).hexdigest()",
            f"{pad*3}if sim_key not in self.results:",
            f"{pad*4}model = self.__setup_model(variables=variables)",
            f"{pad*4}if verbose:", f"{pad*5}print(f'--> running: " + "{str(variables)}" + "')",
            f"{pad*4}self.results[sim_key] = model.run(**self.settings)", "",
            f"{pad}def __resume(self, resume):", f"{pad*2}orig_params = " + r"{}",
            f"{pad*2}self.results = resume.data", f"{pad*2}for parameter in resume.parameters:",
            f"{pad*3}orig_params[parameter['param']] = parameter['range']",
            f"{pad*3}self.add_parameter(parameter['param'], values= parameter['range'])",
            f"{pad*2}new_params = [param for param in self.__parameters if param not in orig_params]",
            f"{pad*2}if len(new_params) > 0:", f"{pad*3}variables = " + \
            "{new_param: self.model.listOfParameters[new_param].value for new_param in new_params}",
            f"{pad*3}self.__update_results(resume.parameters, variables, " + r"{})",
            f"{pad*3}self.results = self.__results", "", f"{pad}def __setup_model(self, variables):",
            f"{pad*2}if 'solver' in self.settings and 'CSolver' in self.settings['solver'].name:",
            f"{pad*3}self.settings['variables'] = copy.deepcopy(variables)",
            f"{pad*3}return self.model", f"{pad*2}model = copy.deepcopy(self.model)",
            f"{pad*2}for name, value in variables.items():",
            f"{pad*3}model.listOfParameters[name].expression = str(value)",f"{pad*2}return model",
            "", f"{pad}def __update_results(self, parameters, variables, orig_vars, index=0):",
            f"{pad*2}if index < len(parameters):", f"{pad*3}parameter = parameters[index]",
            f"{pad*3}index += 1", f"{pad*3}for value in parameter['range']:",
            f"{pad*4}orig_vars[parameter['param']] = value",
            f"{pad*4}variables[parameter['param']] = value",
            f"{pad*4}self.__update_results(parameters, variables, orig_vars, index=index)",
            f"{pad*2}else:",
            f"{pad*3}o_sim_key = hashlib.md5(str(orig_vars).encode('utf-8')).hexdigest()",
            f"{pad*3}n_sim_key = hashlib.md5(str(variables).encode('utf-8')).hexdigest()",
            f"{pad*3}self.__results[n_sim_key] = self.results[o_sim_key]", "",
            f"{pad}def add_parameter(self, param, bounds=None, steps=11, values=None):",
            f"{pad*2}if values is None:",
            f"{pad*3}values = numpy.linspace(bounds[0], bounds[1], steps)", f"{pad*2}else:",
            f"{pad*3}values = numpy.array(values)",
            f"{pad*2}if param in self.__parameters:", f"{pad*3}for value in values:",
            f"{pad*4}if value not in self.__parameters[param]:",
            f"{pad*5}self.__parameters[param] = numpy.append(self.__parameters[param], value)",
            f"{pad*3}self.__parameters[param] = numpy.sort(self.__parameters[param])",
            f"{pad*2}else:", f"{pad*3}self.__parameters[param] = values",
            f"{pad*2}self.parameters = [" + \
            "{'param': param, 'range': ps_range} for param, ps_range in self.__parameters.items()]",
            "", f"{pad}def run(self, settings=None, resume=None, verbose=False):",
            f"{pad*2}if settings is not None:", f"{pad*3}self.settings = settings", "",
            f"{pad*2}if resume is not None:", f"{pad*3}self.__resume(resume)",
            f"{pad*2}index = 0", f"{pad*2}variables = " + r"{}",
            f"{pad*2}self.__run(variables, index, verbose=verbose)", "",
            f"{pad*2}results = Results(self.results, self.parameters)",
            f"{pad*2}self.__reset()", f"{pad*2}return results"
        ]
        return nbf.new_code_cell('\n'.join(nb_psweep_class))

    def __create_parameter_sweep_results_class(self):
        pad = '    '
        if self.nb_type == self.PARAMETER_SWEEP_1D:
            aggregator = self.__create_1d_aggregator()
            plot = self.__create_1d_plot()
            plotplotly = self.__create_1d_plotplotly()
        else:
            aggregator = self.__create_2d_aggregator()
            plot = self.__create_2d_plot()
            plotplotly = self.__create_2d_plotplotly()
        nb_results = [
            "class Results:", f"{pad}func_map = " + "{",
            f"{pad*2}'min': numpy.min, 'max': numpy.max, 'avg': numpy.mean,",
            f"{pad*2}'var': numpy.var, 'final': lambda res: res[-1]", f"{pad}" + "}", "",
            f"{pad}def __init__(self, data, parameters):", f"{pad*2}self.data = data",
            f"{pad*2}self.visible = False", f"{pad*2}self.parameters = parameters", "",
            f"{pad}def feature_extractor(self, species, results=None, key='final', verbose=False):",
            f"{pad*2}if results is None:", f"{pad*3}results = self.data.values()",
            f"{pad*2}data = [[self.func_map[key](traj[species]) for traj in result] for result in results]",
            f"{pad*2}if verbose:",
            f"{pad*3}print(f'" + r"{key} populations for {species}: {data}')",
            f"{pad*2}return numpy.array(data)", "", aggregator, plot, plotplotly
        ]
        return nbf.new_code_cell('\n'.join(nb_results))

    def __create_parameter_sweep_config(self, cells, index, count, results):
        pad = '    '
        if results is None:
            tmp_val = "float(eval(model.get_parameter('__NAME__').expression))"
            tmp_bounds = f"p__I___bounds = (\n{pad}0.5 * {tmp_val},\n{pad}1.5 * {tmp_val}\n)"
            tmp = f"{tmp_bounds}\npsweep.add_parameter('__NAME__', bounds=p1_bounds, steps=11)"
            try:
                for i in range(count):
                    parameter = self.s_model['parameters'][i]
                    psweep_config = tmp.replace("__I__", str(i + 1))
                    psweep_config = psweep_config.replace("__NAME__", parameter['name'])
                    cells.insert(index, nbf.new_code_cell(psweep_config))
                    index += 1
            except KeyError as err:
                message = "Parameters are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        else:
            tmp = "psweep.add_parameter('__NAME__', values=__VALUE__)"
            try:
                for parameter in self.settings['parameterSweepSettings']['parameters']:
                    psweep_config = tmp.replace("__NAME__", parameter['name'])
                    values = [str(value) for value in parameter['range']]
                    psweep_config = psweep_config.replace(
                        "__VALUE__", f"[\n{pad}{', '.join(values)}\n]"
                    )
                    cells.insert(index, nbf.new_code_cell(psweep_config))
                    index += 1
            except KeyError as err:
                message = "Parameter sweep settings are not properly formatted or "
                message += f"are referenced incorrectly for notebooks: {str(err)}"
                raise StochSSModelFormatError(message, traceback.format_exc()) from err
        return index + 1

    def __create_visualization(self, results):
        if results is None:
            spec_of_interest = self.s_model['species'][0]['name']
        else:
            spec_of_interest = self.settings['parameterSweepSettings']['speciesOfInterest']['name']
        return nbf.new_code_cell(f"results.plotplotly('{spec_of_interest}')")

    def __create_run(self, results):
        nb_run = ["kwargs = configure_simulation()"]
        if results is None:
            nb_run.append("results = psweep.run(settings=kwargs)")
        else:
            nb_load_res = [
                "# results = psweep.run(settings=kwargs)", f"path = '{results}'",
                "with open(os.path.join(os.path.expanduser('~'), path), 'rb') as results_file:",
                "    results = Results(pickle.load(results_file), psweep.parameters)"
            ]
            nb_run.extend(nb_load_res)
        nb_run = "\n".join(nb_run)
        return nbf.new_code_cell(nb_run)

    def create_1d_notebook(self, results=None, compute="StochSS"):
        '''Create a 1D parameter sweep jupiter notebook for a StochSS model/workflow'''
        self.nb_type = self.PARAMETER_SWEEP_1D
        cells = self.create_common_cells()
        self.__create_import_cells(cells, results)
        self.__create_header_cells(cells)

        self.settings['solver'] = self.get_gillespy2_solver_name()
        cells.insert(14, self.__create_parameter_sweep_class())
        cells.insert(15, self.__create_parameter_sweep_results_class())
        cells.insert(17, nbf.new_code_cell("psweep = ParameterSweep(model=model)"))
        index = self.__create_parameter_sweep_config(cells, 19, 1, results)
        cells.insert(index, self.__create_run(results))
        cells.append(self.__create_visualization(results))
        if compute != "StochSS":
            self.log(
                "warning",
                "AWS Cloud compute environment is not supported by 1D parameter sweep workflows."
            )

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}

    def create_2d_notebook(self, results=None, compute="StochSS"):
        '''Create a 2D parameter sweep jupiter notebook for a StochSS model/workflow'''
        self.nb_type = self.PARAMETER_SWEEP_2D
        cells = self.create_common_cells()
        self.__create_import_cells(cells, results)
        self.__create_header_cells(cells)

        self.settings['solver'] = self.get_gillespy2_solver_name()
        cells.insert(14, self.__create_parameter_sweep_class())
        cells.insert(15, self.__create_parameter_sweep_results_class())
        cells.insert(17, nbf.new_code_cell("psweep = ParameterSweep(model=model)"))
        index = self.__create_parameter_sweep_config(cells, 19, 2, results)
        cells.insert(index, self.__create_run(results))
        cells.append(self.__create_visualization(results))
        if compute != "StochSS":
            self.log(
                "warning",
                "AWS Cloud compute environment is not supported by 2D parameter sweep workflows."
            )

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}
