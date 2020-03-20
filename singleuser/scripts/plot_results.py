#!/usr/bin/env python3


import json
import pickle
import sys
import plotly
import argparse

from os import path
from gillespy2.core.results import EnsembleResults, Results


user_dir = "/home/jovyan"


def read_plots_file(plots_file_path):
    '''
    Read the plots file and return its contents.

    Attributes
    ----------
    plots_file_path : str
        Path to the plots file.
    '''
    try:
        with open(plots_file_path, 'r') as plt_file:
            plots = json.load(plt_file)
    except FileNotFoundError as error:
        return "ERROR! This plot is not available: {0}".format(error)
    return plots
    

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
    plots = read_plots_file(plots_file_path)
    try:
        return plots[plt_key]
    except:
        return plots


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
    plt_data = json.loads(plt_data)
    for key in plt_data.keys():
        if key == "title":
            plt_fig['layout']['title']['text'] = plt_data[key]
        else:
            plt_fig['layout'][key]['title']['text'] = plt_data[key]

    return plt_fig


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
    parser.add_argument('plots_path', help="The path from the user directory to the plots file.")
    parser.add_argument('plt_key', help="The key used to retreive a plot.")
    parser.add_argument('--plt_data', help="The title and axis labels as a json string to be aplied to the plot.")
    args = parser.parse_args()
    return args


if __name__ == "__main__":
    args = get_parsed_args()
    full_path = path.join(user_dir, args.plots_path)
    plt_data = args.plt_data
    plt_key = args.plt_key

    plt_fig = get_plot_fig(full_path, plt_key)

    if type(plt_fig) is str:
        print(plt_fig)
    elif not plt_data:
        print(json.dumps(plt_fig))
    else:
        plt_fig = edit_plot_fig(plt_fig, plt_data)
        print(json.dumps(plt_fig))

        