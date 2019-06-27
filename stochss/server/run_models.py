# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json

from db_util import DatabaseManager, _db, checkUserOrRaise

import sys, os
import logging

from gillespy2 import Species, Parameter, Reaction, Model
import numpy
import gillespy2.core.gillespySolver
from gillespy2.core.gillespyError import SolverError, DirectoryError, BuildError, ExecutionError
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver
from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver
from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver


class _Model(Model):

    def __init__(self, name, species, parameters, reactions, endSim, timeStep):
        Model.__init__(self, name=name)
        self.add_parameter(parameters)
        self.add_species(species)
        self.add_reaction(reactions)
        numSteps = int(endSim / timeStep + 1)
        self.timespan(numpy.linspace(0,endSim,numSteps))


class ModelFactory():

    def __init__(self, data):
        name = data['name']
        timeStep = (data['simSettings']['timeStep'])
        endSim = data['simSettings']['endSim']
        self.species = list(map(lambda s: self.build_specie(s), data['species']))
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        self.model = _Model(name, self.species, self.parameters, self.reactions, endSim, timeStep)

    def build_specie(self, args):
        return Species(name=args['name'], initial_value=int(args['nonspatialSpecies']['value']), mode=args['nonspatialSpecies']['mode'])

    def build_parameter(self, args):
        return Parameter(name=args['name'], expression=args['value'])

    def build_reaction(self, args, parameters):
        R = Reaction(
            name=args['name'],
            reactants=self.build_stoich_species_dict(args['reactants']),
            products=self.build_stoich_species_dict(args['products']),
            rate=list(filter(lambda p: p.name == args['rate']['name'], parameters))[0]
        )
        return R

    def build_stoich_species_dict(self, args):
        d = {}
        for stoich_specie in args:
            key = stoich_specie['specie']['name']
            value = stoich_specie['ratio']
            d[key] = value
        return d


class RunModelAPIHandler(BaseHandler):

    async def get(self, model_id, version):
        checkUserOrRaise(self)
        log = logging.getLogger()
        db = _db(self.settings)
        _data = db.get_model_version(model_id=model_id, version=version)
        if not _data:
            raise web.HTTPError(404)
        data = json.loads(_data)
        self.set_header('Content-Type', 'application/json')
        _model = ModelFactory(data)
        _results = self.run_solver(_model.model, data['simSettings']) 
        # Each element of results is a single realization of the model
        results = _results[0]
        for key in results.keys():
            if not isinstance(results[key], list):
                # Assume it's an ndarray, use tolist()
                results[key] = results[key].tolist()
        log.warn(str(results))
        results['data'] = data
        self.write(json.dumps(results))


    def ssaSolver(self, model, data):
        solver = get_best_ssa_solver()
        return solver.run(
            model = model,
            t = data['endSim'],
            number_of_trajectories = data['stochasticSettings']['realizations'],
            increment = data['timeStep'],
            seed = data['stochasticSettings']['ssaSettings']['seed']
        )


    def basicTauLeapingSolver(self, model, data):
        solver = BasicTauLeapingSolver()
        return solver.run(
            model = model,
            t = data['endSim'],
            number_of_trajectories = data['stochasticSettings']['realizations'],
            increment = data['timeStep'],
            seed = data['stochasticSettings']['tauLeapingSettings']['seed'],
            tau_tol = data['stochasticSettings']['tauLeapingSettings']['tauTolerance']
        )


    def basicTauHybridSolver(self, model, data):
        solver = BasicTauHybridSolver()
        return solver.run(
            model = model,
            t = data['endSim'],
            number_of_trajectories = data['stochasticSettings']['realizations'],
            increment = data['timeStep'],
            seed = data['stochasticSettings']['hybridTauSettings']['seed'],
            hybrid_tol = data['stochasticSettings']['hybridTauSettings']['switchingTolerance'],
            tau_tol = data['stochasticSettings']['hybridTauSettings']['tauTolerance']
        )


    def basicODESolver(self, model, data):
        solver = BasicODESolver()
        return solver.run(
            model = model,
            t = data['endSim'],
            increment = data['timeStep']
        )


    def run_solver(self, model, data):
        if(data['is_stochastic'] == False):
            return self.basicODESolver(model, data)
        algorithm = data['stochasticSettings']['algorithm']
        if(algorithm == "SSA"):
            return self.ssaSolver(model, data)
        if(algorithm == "Tau-Leaping"):
            return self.basicTauLeapingSolver(model, data)
        if(algorithm == "Hybrid-Tau-Leaping"):
            return self.basicTauHybridSolver(model, data)


class OpenModeNotebookAPIHandler(BaseHandler):
    async def get(self, model_id, version):
        checkUserOrRaise(self)
        
