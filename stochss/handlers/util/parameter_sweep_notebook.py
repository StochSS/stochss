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


    def __create_1d_class_cell(self):
        pad = "    "
        run_str = self.__create_1d_run_str()
        plt_strs = [f"{pad}def plot(c):", f"{pad*2}from matplotlib import pyplot as plt",
                    f"{pad*2}from mpl_toolkits.axes_grid1 import make_axes_locatable",
                    f"{pad*2}fig, ax = plt.subplots(figsize=(8, 8))",
                    pad * 2 + "plt.title(f'Parameter Sweep - Variable:{c.variable_of_interest}')",
                    f"{pad*2}plt.errorbar(c.p1_range, c.data[:, 0], c.data[:, 1])",
                    f"{pad*2}plt.xlabel(c.p1, fontsize=16, fontweight='bold')",
                    f"{pad*2}plt.ylabel('Population', fontsize=16, fontweight='bold')"]
        pltly_str = self.__create_1d_plotly_str()
        class_cell = ["class ParameterSweep1D():", "", run_str, "", "",
                      "\n".join(plt_strs), "", "", pltly_str]
        return nbf.new_code_cell("\n".join(class_cell))


    def __create_1d_config_cell(self):
        pad = "    "
        if "CSolver" in self.settings['solver']:
            model_str = f"{pad}model = {self.get_class_name()}()"
        else:
            model_str = f"{pad}ps_class = {self.get_class_name()}"
        config_cell = ["class ParameterSweepConfig(ParameterSweep1D):",
                       f"{pad}# What class defines the GillesPy2 model", model_str]
        settings = self.settings['parameterSweepSettings']
        eval_str = "float(eval(model.get_parameter(p1).expression))"
        number_of_trajectories = self.settings['simulationSettings']['realizations']
        if not settings['parameters']:
            param = self.s_model['parameters'][0]
            p_min = f"0.5 * {eval_str}"
            p_max = f"1.5 * {eval_str}"
            p_steps = "11"
            spec_of_interest = self.s_model['species'][0]
        else:
            param = settings['parameters'][0]
            p_min = param['min']
            p_max = param['max']
            p_steps = param['steps']
            spec_of_interest = settings['speciesOfInterest']
        config_cell.extend([f"{pad}# ENTER PARAMETER HERE", f"{pad}p1 = '{param['name']}'",
                            f"{pad}# ENTER START VALUE FOR P1 RANGE HERE", f"{pad}p1_min = {p_min}",
                            f"{pad}# ENTER END VALUE FOR P1 RANGE HERE", f"{pad}p1_max = {p_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P1 HERE",
                            f"{pad}p1_steps = {p_steps}",
                            f"{pad}p1_range = np.linspace(p1_min, p1_max, p1_steps)",
                            f"{pad}# ENTER VARIABLE OF INTEREST HERE",
                            f"{pad}variable_of_interest = '{spec_of_interest['name']}'",
                            f"{pad}number_of_trajectories = {number_of_trajectories}",
                            f"{pad}# What feature of the simulation are we examining",
                            f"{pad}feature_extraction = population_at_last_timepoint",
                            f"{pad}# for ensemble resutls: how do we aggreggate the values",
                            f"{pad}ensemble_aggragator = mean_std_of_ensemble"])
        return nbf.new_code_cell("\n".join(config_cell))


    @classmethod
    def __create_1d_plotly_str(cls):
        pad = "    "
        trace_str = f"{pad*2}trace_list = [go.Scatter(x=c.p1_range, y=c.data[:, 0]"
        trace_str += ", error_y=error_y)]"
        title_str = f"{pad*2}title = dict(text=f'<b>Parameter Sweep - Variable: "
        title_str += "{c.variable_of_interest}</b>', x=0.5)"
        lyout_str = f"{pad*2}layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)"
        pltly_strs = [f"{pad}def plotplotly(c, return_plotly_figure=False):",
                      f"{pad*2}from plotly.offline import iplot",
                      f"{pad*2}import plotly.graph_objs as go", "",
                      f"{pad*2}visible = c.number_of_trajectories > 1",
                      f"{pad*2}error_y = dict(type='data', array=c.data[:, 1], visible=visible)",
                      "", trace_str, "", title_str,
                      f"{pad*2}yaxis_label = dict(title='<b>Population</b>')",
                      pad * 2 + "xaxis_label = dict(title=f'<b>{c.p1}</b>')", "",
                      lyout_str, "", f"{pad*2}fig = dict(data=trace_list, layout=layout)", "",
                      f"{pad*2}if return_plotly_figure:",
                      f"{pad*3}return fig", f"{pad*2}iplot(fig)"]
        return "\n".join(pltly_strs)


    def __create_1d_run_str(self):
        pad = "    "
        run_strs = [f"{pad}def run(c, kwargs, verbose=False):",
                    f"{pad*2}c.verbose = verbose",
                    f"{pad*2}fn = c.feature_extraction",
                    f"{pad*2}ag = c.ensemble_aggragator",
                    f"{pad*2}data = np.zeros((len(c.p1_range), 2)) # mean and std",
                    f"{pad*2}for i, v1 in enumerate(c.p1_range):"]
        res_str = f"{pad*4}tmp_results = "
        if self.settings['solver'] == "SSACSolver":
            res_str += "model.run(**kwargs, variables={c.p1:v1})"
        else:
            res_str += "tmp_model.run(**kwargs)"
            run_strs.extend([f"{pad*3}tmp_model = c.ps_class()",
                             f"{pad*3}tmp_model.listOfParameters[c.p1].expression = v1"])
        run_strs.extend([f"{pad*3}if c.verbose:",
                         pad * 4 + "print(f'running {c.p1}={v1}')",
                         f"{pad*3}if(c.number_of_trajectories > 1):",
                         res_str,
                         f"{pad*4}(m, s) = ag([fn(x) for x in tmp_results])",
                         f"{pad*4}data[i, 0] = m",
                         f"{pad*4}data[i, 1] = s",
                         f"{pad*3}else:",
                         res_str.replace("results", "result"),
                         f"{pad*4}data[i, 0] = c.feature_extraction(tmp_result)",
                         f"{pad*2}c.data = data"])
        return "\n".join(run_strs)


    def __create_2d_class_cell(self):
        pad = "    "
        run_str = self.__create_2d_run_str()
        plt_strs = [f"{pad}def plot(c):", f"{pad*2}from matplotlib import pyplot as plt",
                    f"{pad*2}from mpl_toolkits.axes_grid1 import make_axes_locatable",
                    f"{pad*2}fig, ax = plt.subplots(figsize=(8, 8))",
                    f"{pad*2}plt.imshow(c.data)",
                    f"{pad*2}ax.set_xticks(np.arange(c.data.shape[1]) + 0.5, minor=False)",
                    f"{pad*2}ax.set_yticks(np.arange(c.data.shape[0]) + 0.5, minor=False)",
                    pad * 2 + "plt.title(f'Parameter Sweep - Variable: {c.variable_of_interest}')",
                    f"{pad*2}ax.set_xticklabels(c.p1_range, minor=False, rotation=90)",
                    f"{pad*2}ax.set_yticklabels(c.p2_range, minor=False)",
                    f"{pad*2}ax.set_xlabel(c.p1, fontsize=16, fontweight='bold')",
                    f"{pad*2}ax.set_ylabel(c.p2, fontsize=16, fontweight='bold')",
                    f"{pad*2}divider = make_axes_locatable(ax)",
                    f"{pad*2}cax = divider.append_axes('right', size='5%', pad=0.2)",
                    f"{pad*2}_ = plt.colorbar(ax=ax, cax=cax)"]
        pltly_str = self.__create_2d_plotly_str()
        class_cell = ["class ParameterSweep2D():", "", run_str, "", "",
                      "\n".join(plt_strs), "", "", pltly_str]
        return nbf.new_code_cell("\n".join(class_cell))


    def __create_2d_config_cell(self):
        pad = "    "
        if "CSolver" in self.settings['solver']:
            model_str = f"{pad}model = {self.get_class_name()}()"
        else:
            model_str = f"{pad}ps_class = {self.get_class_name()}"
        config_cell = ["class ParameterSweepConfig(ParameterSweep2D):",
                       f"{pad}# What class defines the GillesPy2 model", model_str]
        settings = self.settings['parameterSweepSettings']
        p1_eval_str = "float(eval(model.get_parameter(p1).expression))"
        p2_eval_str = "float(eval(model.get_parameter(p2).expression))"
        number_of_trajectories = self.settings['simulationSettings']['realizations']
        if not settings['parameters']:
            param1 = self.s_model['parameters'][0]
            p1_min = f"0.5 * {p1_eval_str}"
            p1_max = f"1.5 * {p1_eval_str}"
            param2 = self.s_model['parameters'][1]
            p2_min = f"0.5 * {p2_eval_str}"
            p2_max = f"1.5 * {p2_eval_str}"
            spec_of_interest = self.s_model['species'][0]
        else:
            param1 = settings['parameters'][0]
            p1_min = param1['min']
            p1_max = param1['max']
            param2 = settings['parameters'][1]
            p2_min = param2['min']
            p2_max = param2['max']
            spec_of_interest = settings['speciesOfInterest']
        config_cell.extend([f"{pad}# ENTER PARAMETER 1 HERE", f"{pad}p1 = '{param1['name']}'",
                            f"{pad}# ENTER PARAMETER 2 HERE", f"{pad}p2 = '{param2['name']}'",
                            f"{pad}# ENTER START VALUE FOR P1 RANGE HERE",
                            f"{pad}p1_min = {p1_min}",
                            f"{pad}# ENTER END VALUE FOR P1 RANGE HERE", f"{pad}p1_max = {p1_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P1 HERE",
                            f"{pad}p1_steps = {param1['steps'] if settings['parameters'] else 11}",
                            f"{pad}p1_range = np.linspace(p1_min, p1_max, p1_steps)",
                            f"{pad}# ENTER START VALUE FOR P2 RANGE HERE",
                            f"{pad}p2_min = {p2_min}",
                            f"{pad}# ENTER END VALUE FOR P2 RANGE HERE", f"{pad}p2_max = {p2_max}",
                            f"{pad}# ENTER THE NUMBER OF STEPS FOR P2 HERE",
                            f"{pad}p2_steps = {param2['steps'] if settings['parameters'] else 11}",
                            f"{pad}p2_range = np.linspace(p2_min, p2_max, p2_steps)",
                            f"{pad}# ENTER VARIABLE OF INTEREST HERE",
                            f"{pad}variable_of_interest = '{spec_of_interest['name']}'",
                            f"{pad}number_of_trajectories = {number_of_trajectories}",
                            f"{pad}# What feature of the simulation are we examining",
                            f"{pad}feature_extraction = population_at_last_timepoint",
                            f"{pad}# for ensemble resutls: how do we aggreggate the values",
                            f"{pad}ensemble_aggragator = average_of_ensemble"])
        return nbf.new_code_cell("\n".join(config_cell))


    @classmethod
    def __create_2d_plotly_str(cls):
        pad = "    "
        title_str = f"{pad*2}title = dict(text=f'<b>Parameter Sweep - Variable: "
        title_str += "{c.variable_of_interest}</b>', x=0.5)"
        lyout_str = f"{pad*2}layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)"
        pltly_strs = [f"{pad}def plotplotly(c, return_plotly_figure=False):",
                      f"{pad*2}from plotly.offline import init_notebook_mode, iplot",
                      f"{pad*2}import plotly.graph_objs as go", "",
                      f"{pad*2}xaxis_ticks = c.p1_range", f"{pad*2}yaxis_ticks = c.p2_range", "",
                      f"{pad*2}trace_list = [go.Heatmap(z=c.data, x=xaxis_ticks, y=yaxis_ticks)]",
                      title_str, pad * 2 + "xaxis_label = dict(title=f'<b>{c.p1}</b>')",
                      pad * 2 + "yaxis_label = dict(title=f'<b>{c.p2}</b>')", "",
                      lyout_str, "", f"{pad*2}fig = dict(data=trace_list, layout=layout)", "",
                      f"{pad*2}if return_plotly_figure:",
                      f"{pad*3}return fig", f"{pad*2}iplot(fig)"]
        return "\n".join(pltly_strs)


    def __create_2d_run_str(self):
        pad = "    "
        run_strs = [f"{pad}def run(c, kwargs, verbose=False):",
                    f"{pad*2}c.verbose = verbose",
                    f"{pad*2}fn = c.feature_extraction",
                    f"{pad*2}ag = c.ensemble_aggragator",
                    f"{pad*2}data = np.zeros((len(c.p1_range), len(c.p2_range)))",
                    f"{pad*2}for i, v1 in enumerate(c.p1_range):",
                    f"{pad*3}for j, v2 in enumerate(c.p2_range):"]
        res_str = f"{pad*5}tmp_results = "
        if self.settings['solver'] == "SSACSolver":
            res_str += "model.run(**kwargs, variables={c.p1:v1, c.p2:v2})"
        else:
            res_str += "tmp_model.run(**kwargs)"
            run_strs.extend([f"{pad*4}tmp_model = c.ps_class()",
                             f"{pad*4}tmp_model.listOfParameters[c.p1].expression = v1",
                             f"{pad*4}tmp_model.listOfParameters[c.p2].expression = v2"])
        run_strs.extend([f"{pad*4}if c.verbose:",
                         pad * 5 + "print(f'running {c.p1}={v1}, {c.p2}={v2}')",
                         f"{pad*4}if(c.number_of_trajectories > 1):",
                         res_str,
                         f"{pad*5}data[i, j] = ag([fn(x) for x in tmp_results])",
                         f"{pad*4}else:",
                         res_str.replace("results", "result"),
                         f"{pad*5}data[i, j] = c.feature_extraction(tmp_result)",
                         f"{pad*2}c.data = data"])
        return "\n".join(run_strs)


    def __create_post_process_cells(self):
        pad = "    "
        fe_vbs_pnt = f"{pad*2}print(f'population_at_last_timepoint"
        fe_vbs_pnt += " {c.variable_of_interest}={res[c.variable_of_interest][-1]}')"
        # feature extraction cell
        fe_cell = ["# What value(s) do you want to extract from the simulation trajectory",
                   "def population_at_last_timepoint(c, res):", f"{pad}if c.verbose:",
                   fe_vbs_pnt, f"{pad}return res[c.variable_of_interest][-1]"]
        # mean std aggragator cell
        msa_cell = ["# How do we combine the values from multiple trajectores",
                    "def mean_std_of_ensemble(c, data):", f"{pad}a = np.average(data)",
                    f"{pad}s = np.std(data)", f"{pad}if c.verbose:",
                    pad * 2 + "print(f'mean_std_of_ensemble m:{a} s:{s}')",
                    f"{pad}return (a, s)"]
        # average aggragator cell
        aa_cell = [msa_cell[0], "def average_of_ensemble(c, data):",
                   f"{pad}a = np.average(data)", f"{pad}if c.verbose:",
                   pad * 2 + "print(f'average_of_ensemble = {a}')",
                   f"{pad}return a"]
        cells = [nbf.new_markdown_cell("# Post Processing"),
                 nbf.new_markdown_cell("## Feature extraction function"),
                 nbf.new_code_cell('\n'.join(fe_cell)),
                 nbf.new_markdown_cell("## Aggregation function")]
        if self.nb_type == self.PARAMETER_SWEEP_1D:
            cells.append(nbf.new_code_cell('\n'.join(msa_cell)))
        else:
            cells.append(nbf.new_code_cell('\n'.join(aa_cell)))
        return cells


    def create_1d_notebook(self):
        '''Create a 1D parameter sweep jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.PARAMETER_SWEEP_1D
        self.settings['solver'] = self.get_gillespy2_solver_name()
        run_strs = ["kwargs = configure_simulation()", "ps = ParameterSweepConfig()",
                    "%time ps.run(kwargs)"]
        cells = self.create_common_cells()
        cells.extend(self.__create_post_process_cells())
        cells.extend([nbf.new_markdown_cell("# Parameter Sweep"),
                      self.__create_1d_class_cell(),
                      self.__create_1d_config_cell(),
                      nbf.new_code_cell("\n".join(run_strs)),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell("ps.plot()"),
                      nbf.new_code_cell("ps.plotplotly()")])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}


    def create_2d_notebook(self):
        '''Create a 2D parameter sweep jupiter notebook for a StochSS model/workflow

        Attributes
        ----------'''
        self.nb_type = self.PARAMETER_SWEEP_2D
        self.settings['solver'] = self.get_gillespy2_solver_name()
        run_strs = ["kwargs = configure_simulation()", "ps = ParameterSweepConfig()",
                    "%time ps.run(kwargs)"]
        cells = self.create_common_cells()
        cells.extend(self.__create_post_process_cells())
        cells.extend([nbf.new_markdown_cell("# Parameter Sweep"),
                      self.__create_2d_class_cell(),
                      self.__create_2d_config_cell(),
                      nbf.new_code_cell("\n".join(run_strs)),
                      nbf.new_markdown_cell("# Visualization"),
                      nbf.new_code_cell("ps.plot()"),
                      nbf.new_code_cell("ps.plotplotly()")])

        message = self.write_notebook_file(cells=cells)
        return {"Message":message, "FilePath":self.get_path(), "File":self.get_file()}
