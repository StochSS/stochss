#!/usr/bin/env python3


import json
import pickle
import sys
import plotly

from gillespy2.core.results import EnsembleResults, Results


def get_results(path):
    with open(path, 'rb') as fd:
        _data = pickle.load(fd)
        data = _data['results']
        model = _data['model']
        solver_name = _data['solver_name']
        results = []
        for _result in data:
            result = Results(_result, model, solver_name)
            results.append(result)
        return EnsembleResults(results)
        


def get_plt_args(plt_data):
    if "None" in plt_data:
        return {}
    else:
        return json.loads(plt_data)


def plot_std_dev_range(results, kwargs):
    return results.plotplotly_std_dev_range(**kwargs)


def plot(results, kwargs):
    return results.plotplotly(**kwargs)


def plot_std_dev(results, kwargs):
    return results.stddev_ensemble().plotplotly(**kwargs)


def plot_average(results, kwargs):
    return results.average_ensemble().plotplotly(**kwargs)


if __name__ == "__main__":
    results_path = sys.argv[1]
    plt_type = sys.argv[2]
    plt_data = sys.argv[3]

    results = get_results(results_path)
    plt_args = get_plt_args(plt_data)
    plt_args['return_plotly_figure'] = True

    opts = {"stddevran":plot_std_dev_range,"trajectories":plot,"stddev":plot_std_dev,"avg":plot_average}

    print(results[0].model)
    print(results)
    plt_fig = opts[plt_type](results, plt_args)
    print(plt_fig)
    print(json.dumps(plt_fig, cls=plotly.utils.PlotlyJSONEncoder))
    