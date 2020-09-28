#!/usr/bin/env python3


import os
import copy
import json
import numpy as np
import pickle
import plotly

try:
    from run_model import run_solver
except ModuleNotFoundError:
    pass

from gillespy2 import VariableSSACSolver


def setup_species_results(c, is_2d):
    results = {}

    x = len(c.p1_range)
    y = 2
    if is_2d:
        y = len(c.p2_range)

    mapper_keys = ["min", "max", "avg", "var", "final"]
    reducer_keys = ["min", "max", "avg", "var"]

    if c.number_of_trajectories > 1:
        for key1 in mapper_keys:
            results[key1] = {}
            for key2 in reducer_keys:
                results[key1][key2] = np.zeros((x,y))
    else:
        for key in mapper_keys:
            results[key] = np.zeros((x,y))

    return results


def setup_results(c, is_2d=False):
    results = {}
    for species in c.list_of_species:
        results[species] = setup_species_results(c, is_2d)

    return results


# Feature extraction function.  What value(s) do you want to extract
# from the simulation trajectory
def feature_extraction(i, species_results, species_res, species, j=0, verbose=False):
    species_res['min'][i,j] = np.min(species_results)
    species_res['max'][i,j] = np.max(species_results)
    species_res['avg'][i,j] = np.average(species_results)
    species_res['var'][i,j] = np.var(species_results)
    species_res['final'][i,j] = species_results[-1]

    if verbose:
        print('  Minimum_population {0}={1}'.format(species, species_res["min"][i,j]))
        print('  Maximum_population {0}={1}'.format(species, species_res["max"][i,j]))
        print('  Average_population {0}={1}'.format(species, species_res["avg"][i,j]))
        print('  Variance_population {0}={1}'.format(species, species_res["var"][i,j]))
        print('  Population_at_last_timepoint {0}={1}'.format(species, species_res["final"][i,j]))


def ensemble_feature_extraction(i, results, species_res, species, j=0, is_1d=True, verbose=False):
    mapped_results = {}
    
    mapped_results["min"] = [np.min(x[species]) for x in results]
    mapped_results["max"] = [np.max(x[species]) for x in results]
    mapped_results["avg"] = [np.mean(x[species]) for x in results]
    mapped_results["var"] = [np.var(x[species]) for x in results]
    mapped_results["final"] = [x[species][-1] for x in results]
    
    if verbose:
        print('  Minimum_population {0}={1}'.format(species, mapped_results["min"]))
        print('  Maximum_population {0}={1}'.format(species, mapped_results["max"]))
        print('  Average_population {0}={1}'.format(species, mapped_results["avg"]))
        print('  Variance_population {0}={1}'.format(species, mapped_results["var"]))
        print('  Population_at_last_timepoint {0}={1}'.format(species, mapped_results["final"]))

    for key in species_res.keys():
        ensemble_aggragator(i, j, mapped_results[key], species_res[key], is_1d, verbose)


# Aggregation function, How to we combine the values from multiple 
# trajectores
def ensemble_aggragator(i, j, data, map_res, is_1d, verbose):
    map_res['min'][i,j] = np.min(data)
    map_res['max'][i,j] = np.max(data)
    map_res['avg'][i,j] = np.average(data)
    map_res['var'][i,j] = np.var(data)
    
    if is_1d:
        std = np.std(data)
        for key in map_res.keys():
            map_res[key][i,1] = std
        if verbose:
            print('    Min_std_of_ensemble m:{0} s:{1}'.format(map_res['min'][i,j], std))
            print('    Max_std_of_ensemble m:{0} s:{1}'.format(map_res['max'][i,j], std))
            print('    Avg_std_of_ensemble m:{0} s:{1}'.format(map_res['avg'][i,j], std))
            print('    Var_std_of_ensemble m:{0} s:{1}'.format(map_res['var'][i,j], std))
    else:
        if verbose:
            print('    Min_of_ensemble = {0}'.format(map_res['min'][i,j]))
            print('    Max_of_ensemble = {0}'.format(map_res['max'][i,j]))
            print('    Avg_of_ensemble = {0}'.format(map_res['avg'][i,j]))
            print('    Var_of_ensemble = {0}'.format(map_res['var'][i,j]))


def get_data_for_plot(c, keys):
    if keys is None:
        species_of_interest = list(c.list_of_species)[0]
        mapper_key = "final"
        reducer_key = "avg"
    elif c.number_of_trajectories > 1:
        species_of_interest, mapper_key, reducer_key = keys.split('-')
    else:
        species_of_interest, mapper_key = keys.split('-')
        data = c.data[species_of_interest][mapper_key]
        return data, species_of_interest

    data = c.data[species_of_interest][mapper_key][reducer_key]
    return data, species_of_interest


def get_data_for_csv(c, keys):
    data_list = []
    if keys is None:
        mapper_key = "final"
        reducer_key = "avg"
    elif c.number_of_trajectories > 1:
        mapper_key, reducer_key = keys.split('-')
    else:
        for species in c.list_of_species:
            data_list.append(c.data[species][keys])
        return data_list

    for species in c.list_of_species:
        data_list.append(c.data[species][mapper_key][reducer_key])
    return data_list


class ParameterSweep1D():

    def run(c, settings, verbose=False, is_ssa=False, solver=None):
        c.verbose = verbose
        results = setup_results(c)
        for i,v1 in enumerate(c.p1_range):
            tmp_model = c.ps_model if is_ssa else copy.deepcopy(c.ps_model)
            rate1 = [c.p1, v1]
            if not is_ssa:
                tmp_model.listOfParameters[c.p1].set_expression(v1)
            if verbose: print("running {0}={1}".format(c.p1,v1))
            if(c.number_of_trajectories > 1):
                tmp_results = run_solver(tmp_model, settings, 0, is_ssa=is_ssa, solver=solver, rate1=rate1)
                for species in c.list_of_species:
                    ensemble_feature_extraction(i, tmp_results, results[species], species, verbose=verbose)
            else:
                tmp_result = run_solver(tmp_model, settings, 0, is_ssa=is_ssa, solver=solver, rate1=rate1)
                for species in c.list_of_species:
                    species_results = tmp_result[species]
                    feature_extraction(i, species_results, results[species], species, verbose=verbose)
        c.data = results
        return results


    def to_csv(c, path='.', nametag='results_csv', stamp=None, keys=None):
        from datetime import datetime
        import csv

        if stamp is None:
            now = datetime.now()
            stamp = datetime.timestamp(now)
        directory = os.path.join(path, nametag + str(stamp))
        filename = os.path.join(directory, keys+".csv")
        if not os.path.exists(directory):
            os.mkdir(directory)

        data_list= get_data_for_csv(c, keys)
        field_names = [c.p1]
        for species in c.list_of_species:
            field_names.extend([species, species + "-stddev"])
        
        with open(filename, "w", newline="") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(field_names)
            for i, step in enumerate(c.p1_range):
                line = [step]
                for data in data_list:
                    line.extend([data[i,0], data[i,1]])
                csv_writer.writerow(line)

        
    def plot(c, keys=None):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy

        data, species_of_interest = get_data_for_plot(c, keys)

        fig, ax = plt.subplots(figsize=(8,8))
        plt.title("Parameter Sweep - Species: {0}".format(species_of_interest))
        plt.errorbar(c.p1_range,data[:,0],data[:,1])
        plt.xlabel(c.p1, fontsize=16, fontweight='bold')
        plt.ylabel("Population", fontsize=16, fontweight='bold')


    def plotplotly(c, title=None, xaxis_label=None, yaxis_label="<b>Population</b>", return_plotly_figure=True, keys=None):
        from plotly.offline import iplot
        import plotly.graph_objs as go

        data, species_of_interest = get_data_for_plot(c, keys)

        visible = c.number_of_trajectories > 1
        error_y = dict(type="data", array=data[:,1], visible=visible)

        trace_list = [go.Scatter(x=c.p1_range, y=data[:,0], error_y=error_y)]

        if title is None:
            title = "<b>Parameter Sweep - Species: {0}</b>".format(species_of_interest)
        if xaxis_label is None:
            xaxis_label = "<b>{0}</b>".format(c.p1)
        plt_title = dict(text=title, x=0.5)
        xaxis = dict(title=xaxis_label)
        yaxis = dict(title=yaxis_label)

        layout = go.Layout(title=plt_title, xaxis=xaxis, yaxis=yaxis)

        config = {"responsive": True}

        fig = dict(data=trace_list, layout=layout, config=config)

        if return_plotly_figure:
            return fig
        else:
            iplot(fig)


# Configuration for the Parameter Sweep
class ParameterSweepConfig1D(ParameterSweep1D):
    # What class defines the GillesPy2 model
    ps_model = None
    # What is the first parameter we will vary
    p1 = ""
    p1_range = np.linspace(1,10,10)
    number_of_trajectories = 100
    
    
    def configure(self, gillespy2_model, settings, trajectories):
        self.ps_model = gillespy2_model
        self.p1 = settings['parameterOne']['name']
        self.p1_range = np.linspace(settings['p1Min'], settings['p1Max'], settings['p1Steps'])
        self.number_of_trajectories = trajectories
        self.list_of_species = gillespy2_model.get_all_species().keys()


class ParameterSweep2D():

    def run(c, settings, verbose=False, is_ssa=False, solver=None):
        c.verbose = verbose
        results = setup_results(c, is_2d=True)
        for i,v1 in enumerate(c.p1_range):
            for j,v2 in enumerate(c.p2_range):
                tmp_model = c.ps_model if is_ssa else copy.deepcopy(c.ps_model)
                rate1 = [c.p1, v1]
                rate2 = [c.p2, v2]
                if not is_ssa:
                    tmp_model.listOfParameters[c.p1].set_expression(v1)
                    tmp_model.listOfParameters[c.p2].set_expression(v2)
                if verbose: print("running {0}={1}, {2}={3}".format(c.p1,v1,c.p2,v2))
                if(c.number_of_trajectories > 1):
                    tmp_results = run_solver(tmp_model, settings, 0, is_ssa=is_ssa, solver=solver, rate1=rate1, rate2=rate2)
                    for species in c.list_of_species:
                        ensemble_feature_extraction(i, tmp_results, results[species], species, j=j, is_1d=False, verbose=verbose)
                else:
                    tmp_result = run_solver(tmp_model, settings, 0, is_ssa=is_ssa, solver=solver, rate1=rate1, rate2=rate2)
                    for species in c.list_of_species:
                        species_results = tmp_result[species]
                        feature_extraction(i, species_results, results[species], species, j=j, verbose=verbose)
        c.data = results
        return results


    def to_csv(c, path='.', nametag='results_csv', stamp=None, keys=None):
        from datetime import datetime
        import csv

        if stamp is None:
            now = datetime.now()
            stamp = datetime.timestamp(now)
        directory = os.path.join(path, nametag + str(stamp))
        filename = os.path.join(directory, keys+".csv")
        if not os.path.exists(directory):
            os.mkdir(directory)

        data_list = get_data_for_csv(c, keys)
        field_names = [c.p1, c.p2]
        field_names.extend(list(c.list_of_species))
        
        with open(filename, "w", newline="") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(field_names)
            for i, p1_step in enumerate(c.p1_range):
                for j, p2_step in enumerate(c.p2_range):
                    line = [p1_step, p2_step]
                    for data in data_list:
                        line.append(data[i,j])
                    csv_writer.writerow(line)

        
    def plot(c, keys=None):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy

        data, species_of_interest = get_data_for_plot(c, keys)

        fig, ax = plt.subplots(figsize=(8,8))
        plt.imshow(data)
        ax.set_xticks(numpy.arange(data.shape[1])+0.5, minor=False)
        ax.set_yticks(numpy.arange(data.shape[0])+0.5, minor=False)
        plt.title("Parameter Sweep - Species: {0}".format(species_of_interest))
        ax.set_xticklabels(c.p1_range, minor=False, rotation=90)
        ax.set_yticklabels(c.p2_range, minor=False)
        ax.set_xlabel(c.p1, fontsize=16, fontweight='bold')
        ax.set_ylabel(c.p2, fontsize=16, fontweight='bold')
        divider = make_axes_locatable(ax)
        cax = divider.append_axes("right", size="5%", pad=0.2)
        _ = plt.colorbar(ax=ax, cax=cax)


    def plotplotly(c, title=None, xaxis_label=None, yaxis_label=None, return_plotly_figure=True, keys=None):
        from plotly.offline import iplot
        import plotly.graph_objs as go

        data, species_of_interest = get_data_for_plot(c, keys)

        trace_list = [go.Heatmap(z=data, x=c.p1_range, y=c.p2_range)]

        if title is None:
            title = "<b>Parameter Sweep - Species: {0}</b>".format(species_of_interest)
        if xaxis_label is None:
            xaxis_label = "<b>{0}</b>".format(c.p1)
        if yaxis_label is None:
            yaxis_label = "<b>{0}</b>".format(c.p2)
        plt_title = dict(text=title, x=0.5)
        xaxis = dict(title=xaxis_label)
        yaxis = dict(title=yaxis_label)

        layout = go.Layout(title=plt_title, xaxis=xaxis, yaxis=yaxis)

        config = {"responsive": True}

        fig = dict(data=trace_list, layout=layout, config=config)

        if return_plotly_figure:
            return fig
        else:
            iplot(fig)


# Configuration for the Parameter Sweep
class ParameterSweepConfig2D(ParameterSweep2D):
    # What class defines the GillesPy2 model
    ps_model = None
    # What is the first parameter we will vary
    p1 = ""
    # What is the second parameter we will vary
    p2 = ""
    p1_range = np.linspace(1,10,10)
    p2_range = np.linspace(1,10,10)
    number_of_trajectories = 100


    def configure(self, gillespy2_model, settings, trajectories):
        self.ps_model = gillespy2_model
        self.p1 = settings['parameterOne']['name']
        self.p2 = settings['parameterTwo']['name']
        self.p1_range = np.linspace(settings['p1Min'], settings['p1Max'], settings['p1Steps'])
        self.p2_range = np.linspace(settings['p2Min'], settings['p2Max'], settings['p2Steps'])
        self.number_of_trajectories = trajectories
        self.list_of_species = gillespy2_model.get_all_species().keys()


class ParameterSweep():

    def __init__(self, wkfl_path, mdl_path, settings=None):
        self.wkfl_path = wkfl_path
        self.mdl_path = mdl_path
        self.settings = self.get_settings() if settings is None else settings
        self.mdl_file = mdl_path.split('/').pop()
        self.info_path = os.path.join(wkfl_path, 'info.json')
        self.log_path = os.path.join(wkfl_path, 'logs.txt')
        self.wkfl_mdl_path = os.path.join(wkfl_path, self.mdl_file)
        self.res_path = os.path.join(wkfl_path, 'results')
        wkfl_name_elements = wkfl_path.split('/').pop().split('.')[0].split('_')
        try:
            date, time = wkfl_name_elements[-2:]
            if date.isdigit() and time.isdigit():
                self.wkfl_timestamp = '_'.join(["",date,time])
            else:
                self.wkfl_timestamp = None
        except:
            self.wkfl_timestamp = None


    def get_settings(self):
        settings_path = os.path.join(self.wkfl_path, "settings.json")

        if os.path.exists(settings_path):
            with open(settings_path, "r") as settings_file:
                return json.load(settings_file)

        with open("/stochss/stochss_templates/workflowSettingsTemplate.json", "r") as template_file:
            settings_template = json.load(template_file)
        
        if os.path.exists(self.wkfl_mdl_path):
            with open(self.wkfl_mdl_path, "r") as mdl_file:
                mdl = json.load(mdl_file)
                try:
                    settings = {"simulationSettings":mdl['simulationSettings'],
                                "parameterSweepSettings":mdl['parameterSweepSettings'],
                                "resultsSettings":settings_template['resultsSettings']}
                    return settings
                except:
                    return settings_template
        else:
            return settings_template


    def save(self):
        settings_path = os.path.join(self.wkfl_path, "settings.json")
        with open(settings_path, "w") as settings_file:
            json.dump(self.settings, settings_file)


    def run(self, gillespy2_model, verbose):
        ps_settings = self.settings['parameterSweepSettings']
        sim_settings = self.settings['simulationSettings']
        trajectories = sim_settings['realizations']
        solver = gillespy2_model.get_best_solver()
        if sim_settings['isAutomatic']:
            is_ssa = solver.name == "VariableSSACSolver"
        else:
            is_ssa = sim_settings['algorithm'] == "SSA" and solver.name == "VariableSSACSolver"
        if is_ssa:
            solver = solver(model=gillespy2_model)

        if ps_settings['is1D']:
            ps = ParameterSweepConfig1D()
        else:
            ps = ParameterSweepConfig2D()

        ps.configure(gillespy2_model, ps_settings, trajectories)
        results = ps.run(sim_settings, verbose=verbose, is_ssa=is_ssa, solver=solver)
        self.store_results(results)
        self.store_csv_results(ps)
        self.store_plots(ps)


    def store_results(self, results):
        if not 'results' in os.listdir(path=self.wkfl_path):
            os.mkdir(self.res_path)

        # with open(os.path.join(self.res_path, 'results.p'), 'wb') as results_file:
        #     pickle.dump(results, results_file, protocol=pickle.HIGHEST_PROTOCOL)

        with open(os.path.join(self.res_path, 'results.json'), 'w') as json_file:
            json_file.write(json.dumps(str(results)))


    def store_csv_results(self, ps):
        data_keys = self.get_csv_keys(ps)

        for key in data_keys:
            ps.to_csv(path=self.res_path, nametag="results_csv", stamp=self.wkfl_timestamp, keys=key)


    def store_plots(self, ps):
        plot_keys = self.get_plot_keys(ps)

        plot_figs = {}
        for key in plot_keys:
            plot_fig = ps.plotplotly(keys=key)
            plot_figs[key] = plot_fig

        with open(os.path.join(self.res_path, 'plots.json'), 'w') as plots_file:
            json.dump(plot_figs, plots_file, cls=plotly.utils.PlotlyJSONEncoder)


    def get_csv_keys(self, ps):
        from itertools import product

        mappers = ["min","max","avg","var","final"]
        reducers = ["min","max","avg","var"]

        if ps.number_of_trajectories <= 1:
            return mappers

        csv_keys = list(product(mappers, reducers))
        for i in range(len(csv_keys)):
            key = "-".join(list(csv_keys[i]))
            csv_keys[i] = key
        return csv_keys


    def get_plot_keys(self, ps):
        from itertools import product

        species = list(ps.list_of_species)
        mappers = ["min","max","avg","var","final"]
        reducers = ["min","max","avg","var"]

        if ps.number_of_trajectories > 1:
            plot_keys = list(product(species, mappers, reducers))
        else:
            plot_keys = list(product(species, mappers))

        for i in range(len(plot_keys)):
            key = "-".join(list(plot_keys[i]))
            plot_keys[i] = key

        return plot_keys