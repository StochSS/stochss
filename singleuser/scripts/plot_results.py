#!/usr/bin/env python3


import json
import pickle
import sys
import plotly

from gillespy2.core.results import EnsembleResults, Results


def get_results(path):
    # Reading from plot files
    with open(path, r) as fd:
        data = json.load(fd)
    return data
    # Ploting from pickled results
    # with open(path, 'rb') as fd:
    #     data = pickle.load(fd)
        


def get_plt_args(plt_data):
    if "None" in plt_data:
        return {}
    else:
        return json.loads(plt_data)


def plot_std_dev_range(results, kwargs):
    # Reading plot files
    path = results.replace("results.p", "std_dev_range_plot.json")
    return get_results(path)
    # Ploting from pickled results
    # return results.plotplotly_std_dev_range(**kwargs)


def plot(results, kwargs):
    # Reading plot files
    path = results.replace("results.p", "plotplotly_plot.json")
    return get_results(path)
    # Ploting from pickled results
    # return results.plotplotly(**kwargs)


def plot_std_dev(results, kwargs):
    # Reading plot files
    path = results.replace("results.p", "stddev_ensemble_plot.json")
    return get_results(path)
    # Ploting from pickled results
    # return results.stddev_ensemble().plotplotly(**kwargs)


def plot_average(results, kwargs):
    # Reading plot files
    path = results.replace("results.p", "ensemble_average_plot.json")
    return get_results(path)
    # Ploting from pickled results
    # return results.average_ensemble().plotplotly(**kwargs)


if __name__ == "__main__":
    results_path = sys.argv[1]
    plt_type = sys.argv[2]
    plt_data = sys.argv[3]

    # Ploting from pickled results
    # results = get_results(results_path)
    plt_args = get_plt_args(plt_data)
    plt_args['return_plotly_figure'] = True

    opts = {"stddevran":plot_std_dev_range,"trajectories":plot,"stddev":plot_std_dev,"avg":plot_average}

    # print(results[0].model)
    # print(results)
    # Reading from plot files
    plt_fig = opts[plt_type](results_path, plt_args)
    # Ploting from pickled results
    # plt_fig = opts[plt_type](results, plt_args)
    # print(plt_fig)
    print(json.dumps(plt_fig, cls=plotly.utils.PlotlyJSONEncoder))
    