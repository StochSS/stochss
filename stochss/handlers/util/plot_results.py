#!/usr/bin/env python3

'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
import json
import pickle
import traceback
from os import path
from .stochss_errors import StochSSFileNotFoundError, PlotNotAvailableError


def read_plots_file(plots_file_path):
    '''
    Read the plots file and return its contents.

    Attributes
    ----------
    plots_file_path : str
        Path to the plots file.
    '''
    with open(plots_file_path, 'r') as plt_file:
        plots = json.load(plt_file)
    return plots


def read_pickled_results(pickle_path):
    try:
        with open(pickle_path, 'rb') as pickle_file:
            results = pickle.load(pickle_file)
        return results
    except FileNotFoundError as err:
        raise StochSSFileNotFoundError("Could not find the plot file: {0}".format(err),
                                       traceback.format_exc())


def get_plot_fig(plots_file_path, plt_key):
    '''
    Get the plots for the workflow and return the plot at the plt_key.

    Attributes
    ----------
    plots_file_path : str
        Path to the plots file.
    plt_key : str
        The key that the target plot is stored under.
    '''
    pickle_path = os.path.join(os.path.dirname(plots_file_path), "results.p")
    if os.path.exists(plots_file_path):
        plots = read_plots_file(plots_file_path)
        try:
            return plots[plt_key]
        except KeyError as err:
            if os.path.exists(pickle_path):
                results = read_pickled_results(pickle_path)
                return get_plot_fig_from_results(results, plt_key)
            raise PlotNotAvailableError("The plot is not available: "+str(err), traceback.format_exc())
    else:
        results = read_pickled_results(pickle_path)
        return get_plot_fig_from_results(results, plt_key)


def get_plot_fig_from_results(results, plt_key):
    es_keys = ["stddevran", "trajectories", "stddev", "avg"]

    if plt_key == "stddevran":
        plt_fig = results.plotplotly_std_dev_range(return_plotly_figure=True)
    elif plt_key in es_keys:
        if plt_key == "stddev":
            results = results.stddev_ensemble()
        elif plt_key == "avg":
            results = results.average_ensemble()
        plt_fig = results.plotplotly(return_plotly_figure=True)
    else:
        plt_fig = results.plotplotly(keys=plt_key)

    if plt_key in es_keys:
        plt_fig["config"] = {"responsive": True,}
    return plt_fig


def edit_plot_fig(plt_fig, plt_data):
    '''
    Edit the title, x-axis label, and/or y-axis label to the plt_data.

    Attributes
    ----------
    plt_fig : json
        The plot figure to be edited.
    plt_data : str
        The data that needs to be applied to the plot.
    '''
    for key in plt_data.keys():
        if key == "title":
            plt_fig['layout']['title']['text'] = plt_data[key]
        else:
            plt_fig['layout'][key]['title']['text'] = plt_data[key]

    return plt_fig


def plot_results(plots_path, plt_key, plt_data=None):
    user_dir = "/home/jovyan"

    full_path = path.join(user_dir, plots_path)

    plt_fig = get_plot_fig(full_path, plt_key)

    if isinstance(plt_fig, str):
        return plt_fig
    if not plt_data:
        return json.dumps(plt_fig)
    plt_fig = edit_plot_fig(plt_fig, plt_data)
    return json.dumps(plt_fig)
        