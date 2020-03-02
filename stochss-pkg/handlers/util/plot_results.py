#!/usr/bin/env python3


import json
import pickle
import sys
import plotly
import argparse

from os import path
from gillespy2.core.results import EnsembleResults, Results


user_dir = "/home/jovyan"


def get_results(results_path):
    '''
    Unpickle the workflow results from the rusults.p file.

    Attributes
    ----------
    results_path : str
        Path to the pickled results file.
    '''
    # For reading plot files
    try:
        with open(results_path, 'r') as fd:
            plot = json.load(fd)
    except FileNotFoundError as error:
        return "ERROR! This plot is not available: {0}".format(error)
    return plot
    
    # For using pickled results
    # with open(path, 'rb') as fd:
    #     results = pickle.load(fd)
    # return results


def get_plt_args(plt_data):
    '''
    Builds the arguments for the plotplotly function as a json string.

    Attributes
    ----------
    plt_data : str
        JSON string fo the title and the axes labels.
    '''
    if not plt_data: # no arguments were passed to the script
        return {}
    else:
        return json.loads(plt_data)


def plot_std_dev_range(results, kwargs):
    '''
    Gets the plot of the standard deviation range with the average of 
    all trajectories for a Results Ensemble.

    Attributes
    ----------
    results : GillesPy2 ResultsEnsemble
        Results of a workflow run with number_of_trajectories > 1.
    kwargs : dict
        Arguments to be passed to the plotplotly() function.
    '''
    # For reading plot files
    plot_path = results.replace('results.p', 'std_dev_range_plot.json')
    return get_results(plot_path)

    # For using pickled results
    # return results.plotplotly_std_dev_range(**kwargs)


def plot(results, kwargs):
    '''
    Gets the plot of all trajectories for Results or a Results Ensemble.

    Attributes
    ----------
    results : GillesPy2 ResultsEnsemble or GillesPy2 Results
        Results of a workflow run.
    kwargs : dict
        Arguments to be passed to the plotplotly() function.
    '''
    # For reading plot files
    plot_path = results.replace('results.p', 'plotplotly_plot.json')
    return get_results(plot_path)

    # For using pickled results
    # return results.plotplotly(**kwargs)


def plot_std_dev(results, kwargs):
    '''
    Gets the plot of the standard deviation of all trajectories for a 
    Results Ensemble.

    Attributes
    ----------
    results : GillesPy2 ResultsEnsemble
        Results of a workflow run with number_of_trajectories > 1.
    kwargs : dict
        Arguments to be passed to the plotplotly() function.
    '''
    # For reading plot files
    plot_path = results.replace('results.p', 'stddev_ensemble_plot.json')
    return get_results(plot_path)

    # For using pickled results
    # return results.stddev_ensemble().plotplotly(**kwargs)


def plot_average(results, kwargs):
    '''
    Gets the plot of the average of all trajectories for a Results Ensemble.

    Attributes
    ----------
    results : GillesPy2 ResultsEnsemble
        Results of a workflow run with number_of_trajectories > 1.
    kwargs : dict
        Arguments to be passed to the plotplotly() function.
    '''
    # For reading plot files
    plot_path = results.replace('results.p', 'ensemble_average_plot.json')
    return get_results(plot_path)

    # For using pickled results
    # return results.average_ensemble().plotplotly(**kwargs)


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    # For using picked results
    # description = "Plot the workflow results based on the plot type with the plot data."

    # For reading plot files
    description = "Get the workflow plot based on the plot type and modify it with the plot data."

    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('results_path', help="The path from the user directory to the results file (pickled file).")
    parser.add_argument('plt_type', help="The type of plot to get")
    parser.add_argument('--plt_data', help="The title and axis labels as a json string to be aplied to the plot.")
    args = parser.parse_args()
    return args


def plot_results(results_path, plt_type, plt_data=None):
    results_path = path.join(user_dir, results_path)
    plt_args = get_plt_args(plt_data)
    # For using pickled results
    # plt_args['return_plotly_figure'] = True
    # results = get_results(results_path)
    
    opts = {"stddevran":plot_std_dev_range,"trajectories":plot,"stddev":plot_std_dev,"avg":plot_average}

    # For reading plot files
    plt_fig = opts[plt_type](results_path, plt_args)
    if not type(plt_fig) is str:
        for key in plt_args.keys():
            if key == 'title':
                plt_fig['layout']['title']['text'] = plt_args['title']
            else:
                plt_fig['layout'][key]['title']['text'] = plt_args[key]    

        # For using pickled results
        # plt_fig = opts[plt_type](results, plt_args)

        return json.dumps(plt_fig, cls=plotly.utils.PlotlyJSONEncoder)
    else:
        return plt_fig
