#!/usr/bin/env python3


import json
import pickle
import sys
import plotly

from gillespy2.core.results import EnsembleResults, Results


def get_results(path):
    # For reading plot files
    with open(path, 'r') as fd:
        plot = json.load(fd)
    return plot
    
    # For using pickled results
    # with open(path, 'rb') as fd:
    #     results = pickle.load(fd)
    # return results


def get_plt_args(plt_data):
    if "None" in plt_data:
        return {}
    else:
        return json.loads(plt_data)


def plot_std_dev_range(results, kwargs):
    # For reading plot files
    results_path = results.split('/')
    results_path.pop()
    results_path.append('std_dev_range_plot.json')
    results_path = '/'.join(results_path)
    return get_results(results_path)

    # For using pickled results
    # return results.plotplotly_std_dev_range(**kwargs)


def plot(results, kwargs):
    # For reading plot files
    results_path = results.split('/')
    results_path.pop()
    results_path.append('plotplotly_plot.json')
    results_path = '/'.join(results_path)
    return get_results(results_path)

    # For using pickled results
    # return results.plotplotly(**kwargs)


def plot_std_dev(results, kwargs):
    # For reading plot files
    results_path = results.split('/')
    results_path.pop()
    results_path.append('stddev_ensemble_plot.json')
    results_path = '/'.join(results_path)
    return get_results(results_path)

    # For using pickled results
    # return results.stddev_ensemble().plotplotly(**kwargs)


def plot_average(results, kwargs):
    # For reading plot files
    results_path = results.split('/')
    results_path.pop()
    results_path.append('ensemble_average_plot.json')
    results_path = '/'.join(results_path)
    return get_results(results_path)

    # For using pickled results
    # return results.average_ensemble().plotplotly(**kwargs)


if __name__ == "__main__":
    results_path = sys.argv[1]
    plt_type = sys.argv[2]
    plt_data = sys.argv[3]

    plt_args = get_plt_args(plt_data)
    # For using pickled results
    # plt_args['return_plotly_figure'] = True
    # results = get_results(results_path)
    
    opts = {"stddevran":plot_std_dev_range,"trajectories":plot,"stddev":plot_std_dev,"avg":plot_average}

    # For reading plot files
    plt_fig = opts[plt_type](results_path, plt_args)
    for key in plt_args.keys():
        if key == 'title':
            plt_fig['layout']['title']['text'] = plt_args['title']
        else:
            plt_fig['layout'][key]['title']['text'] = plt_args[key]    

    # For using pickled results
    # plt_fig = opts[plt_type](results, plt_args)

    print(json.dumps(plt_fig, cls=plotly.utils.PlotlyJSONEncoder))