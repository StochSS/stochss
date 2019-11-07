#!/usr/bin/env python3

import numpy
import os, sys, json, pickle, os.path, argparse
from shutil import copyfile

from gillespy2 import Species, Parameter, Reaction, RateRule, Model
import gillespy2.core.gillespySolver
from gillespy2.core.gillespyError import SolverError, DirectoryError, BuildError, ExecutionError
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver
from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver
from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver


class _Model(Model):

    def __init__(self, name, species, parameters, reactions, rate_rules, endSim, timeStep, volume):
        Model.__init__(self, name=name, volume=volume)
        self.add_parameter(parameters)
        self.add_species(species)
        self.add_reaction(reactions)
        self.add_rate_rule(rate_rules)
        numSteps = int(endSim / timeStep + 1)
        self.timespan(numpy.linspace(0,endSim,numSteps))


class ModelFactory():

    def __init__(self, data):
        name = data['name']
        timeStep = (data['simulationSettings']['timeStep'])
        endSim = data['simulationSettings']['endSim']
        volume = data['simulationSettings']['volume']
        self.species = list(map(lambda s: self.build_specie(s), data['species']))
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        self.rate_rules = list(map(lambda rr: self.build_rate_rules(rr), data['rateRules']))
        self.model = _Model(name, self.species, self.parameters, self.reactions, self.rate_rules, endSim, timeStep, volume)

    def build_specie(self, args):
        name = args['name'].strip()
        value = args['value']
        mode = args['mode']
        return Species(name=name, initial_value=value, mode=mode)

    def build_parameter(self, args):
        name = args['name'].strip()
        value = args['value']
        return Parameter(name=name, expression=value)

    def build_reaction(self, args, parameters):
        if not args['rate'] == {}:
            rate = list(filter(lambda p: p.name == args['rate']['name'], parameters))[0]
            propensity = None
        else:
            rate = None
            propensity = args['propensity']
        R = Reaction(
            name=args['name'],
            reactants=self.build_stoich_species_dict(args['reactants']),
            products=self.build_stoich_species_dict(args['products']),
            rate=rate,
            propensity_function=propensity
        )
        return R

    def build_rate_rules(self, args):
        name = args['name']
        species = self.build_specie(args['specie'])
        expression = args['rule']
        return RateRule(name=name, species=species, expression=expression)

    def build_stoich_species_dict(self, args):
        d = {}
        for stoich_specie in args:
            key = stoich_specie['specie']['name']
            value = stoich_specie['ratio']
            d[key] = value
        return d


def run_solver(model, data):
    if(data['is_stochastic'] == False):
        return basicODESolver(model, data)
    algorithm = data['stochasticSettings']['algorithm']
    if(algorithm == "SSA"):
        return ssaSolver(model, data)
    if(algorithm == "Tau-Leaping"):
        return basicTauLeapingSolver(model, data)
    if(algorithm == "Hybrid-Tau-Leaping"):
        return basicTauHybridSolver(model, data)


def basicODESolver(model, data):
    solver = BasicODESolver()
    return solver.run(
        model = model,
        t = data['endSim'],
        increment = data['timeStep'],
        integrator_options = { 'atol' : data['deterministicSettings']['absoluteTol'], 'rtol' : data['deterministicSettings']['relativeTol']}
    )


def ssaSolver(model, data):
    solver = get_best_ssa_solver()
    seed = data['stochasticSettings']['ssaSettings']['seed']
    if(seed == -1):
        seed = None
    return solver.run(
        model = model,
        t = data['endSim'],
        number_of_trajectories = data['stochasticSettings']['realizations'],
        increment = data['timeStep'],
        seed = seed
    )


def basicTauLeapingSolver(model, data):
    solver = BasicTauLeapingSolver()
    seed = data['stochasticSettings']['tauSettings']['seed']
    if(seed == -1):
        seed = None
    return solver.run(
        model = model,
        t = data['endSim'],
        number_of_trajectories = data['stochasticSettings']['realizations'],
        increment = data['timeStep'],
        seed = seed,
        tau_tol = data['stochasticSettings']['tauSettings']['tauTol']
    )


def basicTauHybridSolver(model, data):
    solver = BasicTauHybridSolver()
    seed = data['stochasticSettings']['hybridSettings']['seed']
    if(seed == -1):
        seed = None
    return solver.run(
        model = model,
        t = data['endSim'],
        number_of_trajectories = data['stochasticSettings']['realizations'],
        increment = data['timeStep'],
        seed = seed,
        switch_tol = data['stochasticSettings']['hybridSettings']['switchTol'],
        tau_tol = data['stochasticSettings']['hybridSettings']['tauTol']
    )


def run_job(job_model, model_path, model_file, job_path):
    with open(job_model, 'r') as json_file:
        _data = json_file.read()
    data = json.loads(str(_data))
    data['name'] = model_file.split('.')[0]
    modelWrapper = ModelFactory(data)
    open(os.path.join(job_path, 'RUNNING'), 'w').close()
    results = run_solver(modelWrapper.model, data['simulationSettings'])
    for result in results:
        for key in result.keys():
            if not isinstance(result[key], list):
                # Assume it's an ndarray, use tolist()
                result[key] = result[key].tolist()
    return results


def set_up_job(job_path, model_path, job_model, results_path):
    os.mkdir(job_path)
    os.mkdir(results_path)
    copyfile(model_path, job_model)
    model_info = { "model" : job_model, }
    info_path = os.path.join(job_path, 'info.json')
    with open(info_path, 'w') as info_file:
        info_file.write(json.dumps(model_info))


def format_job_path(dir_path, job_name):
    job_dir_name = "{}.job".format(job_name)
    i = 2
    while job_dir_name in os.listdir(dir_path):
        job_dir_name_pieces = job_dir_name.split('.')
        job_dir_name_pieces[-2] += ' ({})'.format(i)
        job_dir_name = '.'.join(job_dir_name_pieces)
        i += 1
    job_path = os.path.join(dir_path, job_dir_name)
    return job_path


def setup_arg_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_path', help="Path to the model file")
    parser.add_argument('--job_name', help="Name of the new job")
    return parser


def main():
    parser = setup_arg_parser()
    args = parser.parse_args()
    model_path = args.model_path
    job_name = args.job_name
    dir_path, model_file = os.path.split(model_path)
    job_path = format_job_path(dir_path, job_name)
    results_path = os.path.join(job_path, 'results')
    job_model = os.path.join(job_path, model_file)
    set_up_job(job_path, model_path, job_model, results_path)
    results = run_job(job_model, model_path, model_file, job_path)
    with open(os.path.join(results_path, 'results.p'), 'wb') as results_file:
        results_file.write(pickle.dumps(results))
    open(os.path.join(job_path, 'COMPLETE'), 'w').close()


if __name__ == "__main__":
    main()
