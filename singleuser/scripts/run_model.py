#!/usr/bin/env python3

import os, sys, json

from gillespy2 import Species, Parameter, Reaction, RateRule, Model
import numpy
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


def run_model(modelPath):
    filePath = "/home/jovyan/{0}".format(modelPath)
    with open(filePath, "r") as jsonFile:
        data = jsonFile.read()
        jsonData = json.loads(str(data))
        jsonData['name'] = modelPath.split('/').pop().split('.')[0]
        _model = ModelFactory(jsonData)
        _results = run_solver(_model.model, jsonData['simulationSettings'])
        results = _results[0]
        for key in results.keys():
            if not isinstance(results[key], list):
                # Assume it's an ndarray, use tolist()
                results[key] = results[key].tolist()
        results['data'] = jsonData
        return results


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
        solver = solver,
        integrator_options = { 'atol' : data['deterministicSettings']['absoluteTol'], 'rtol' : data['deterministicSettings']['relativeTol']}
    )


def ssaSolver(model, data):
    solver = get_best_ssa_solver()
    seed = data['stochasticSettings']['ssaSettings']['seed']
    if(seed == -1):
        seed = None
    return model.run(
        solver = solver,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed
    )


def basicTauLeapingSolver(model, data):
    solver = BasicTauLeapingSolver()
    seed = data['stochasticSettings']['tauSettings']['seed']
    if(seed == -1):
        seed = None
    return model.run(
        solver = solver,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed,
        tau_tol = data['stochasticSettings']['tauSettings']['tauTol']
    )


def basicTauHybridSolver(model, data):
    seed = data['stochasticSettings']['hybridSettings']['seed']
    if(seed == -1):
        seed = None
    return model.run(
        solver = BasicTauHybridSolver,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed,
        switch_tol = data['stochasticSettings']['hybridSettings']['switchTol'],
        tau_tol = data['stochasticSettings']['hybridSettings']['tauTol']
    )



if __name__ == "__main__":
    modelPath = sys.argv[1]
    outfile = sys.argv[2]
    cmd = sys.argv[3]
    if 'start' in cmd:
        results = run_model(modelPath)
        with open(outfile, "w") as fd:
            json.dump(results, fd)
        open(outfile + ".done", "w").close()
    else:
        if os.path.exists(outfile + ".done"):
            with open(outfile, "r") as fd:
                print(fd.read())
            os.remove(outfile)
            os.remove(outfile + ".done")
        else:
            print("running")


