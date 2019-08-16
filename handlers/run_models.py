# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json

import docker
client = docker.from_env()
import tempfile
import tarfile

from handlers.db_util import DatabaseManager, _db, checkUserOrRaise

import sys, os
import logging

from gillespy2 import Species, Parameter, Reaction, RateRule, Model
import numpy
import gillespy2.core.gillespySolver
from gillespy2.core.gillespyError import SolverError, DirectoryError, BuildError, ExecutionError
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver
from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver
from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver


class _Model(Model):

    def __init__(self, name, species, parameters, reactions, rate_rules, endSim, timeStep):
        Model.__init__(self, name=name)
        self.add_parameter(parameters)
        self.add_species(species)
        self.add_reaction(reactions)
        self.add_rate_rule(rate_rules)
        numSteps = int(endSim / timeStep + 1)
        self.timespan(numpy.linspace(0,endSim,numSteps))


class ModelFactory():

    log = logging.getLogger()
    log.setLevel(10)

    def __init__(self, data):
        name = data['name']
        timeStep = (data['simSettings']['timeStep'])
        endSim = data['simSettings']['endSim']
        self.log.debug("Species: ")
        self.species = list(map(lambda s: self.build_specie(s), data['species']))
        self.log.debug("Parameters: ")
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        indecies = []
        for rr in data['rateRules']:
            if rr['rule'] == "":
                indecies.append(data['rateRules'].index(rr))
        for i in range(len(indecies)):
            data['rateRules'].pop(indecies[i] - i)
        self.rate_rules = list(map(lambda rr: self.build_rate_rules(rr), data['rateRules']))
        self.model = _Model(name, self.species, self.parameters, self.reactions, self.rate_rules, endSim, timeStep)

    def build_specie(self, args):
        name = args['name']
        value = args['nonspatialSpecies']['value']
        mode = args['nonspatialSpecies']['mode']
        self.log.debug("name: {0}, value: {1}, mode: {2}".format(name, value, mode))
        return Species(name=name, initial_value=value, mode=mode)

    def build_parameter(self, args):
        name = args['name']
        value = args['value']
        self.log.debug("name: {0}, expression: {1}".format(name, value))
        return Parameter(name=name, expression=value)

    def build_reaction(self, args, parameters):
        R = Reaction(
            name=args['name'],
            reactants=self.build_stoich_species_dict(args['reactants']),
            products=self.build_stoich_species_dict(args['products']),
            rate=list(filter(lambda p: p.name == args['rate']['name'], parameters))[0]
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


class ModelFactory2():

    log = logging.getLogger()
    log.setLevel(10)

    def __init__(self, data):
        name = data['name']
        timeStep = (data['simulationSettings']['timeStep'])
        endSim = data['simulationSettings']['endSim']
        self.log.debug("Species: ")
        self.species = list(map(lambda s: self.build_specie(s), data['species']))
        self.log.debug("Parameters: ")
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        indecies = []
        for rr in data['rateRules']:
            if rr['rule'] == "":
                indecies.append(data['rateRules'].index(rr))
        for i in range(len(indecies)):
            data['rateRules'].pop(indecies[i] - i)
        self.rate_rules = list(map(lambda rr: self.build_rate_rules(rr), data['rateRules']))
        self.model = _Model(name, self.species, self.parameters, self.reactions, self.rate_rules, endSim, timeStep)

    def build_specie(self, args):
        name = args['name']
        value = args['value']
        mode = args['mode']
        self.log.debug("name: {0}, value: {1}, mode: {2}".format(name, value, mode))
        return Species(name=name, initial_value=value, mode=mode)

    def build_parameter(self, args):
        name = args['name']
        value = args['value']
        self.log.debug("name: {0}, expression: {1}".format(name, value))
        return Parameter(name=name, expression=value)

    def build_reaction(self, args, parameters):
        R = Reaction(
            name=args['name'],
            reactants=self.build_stoich_species_dict(args['reactants']),
            products=self.build_stoich_species_dict(args['products']),
            rate=list(filter(lambda p: p.name == args['rate']['name'], parameters))[0]
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


    def basicTauLeapingSolver(self, model, data):
        solver = BasicTauLeapingSolver()
        seed = data['stochasticSettings']['tauLeapingSettings']['seed']
        if(seed == -1):
            seed = None
        return solver.run(
            model = model,
            t = data['endSim'],
            number_of_trajectories = data['stochasticSettings']['realizations'],
            increment = data['timeStep'],
            seed = seed,
            tau_tol = data['stochasticSettings']['tauLeapingSettings']['tauTolerance']
        )


    def basicTauHybridSolver(self, model, data):
        solver = BasicTauHybridSolver()
        seed = data['stochasticSettings']['hybridTauSettings']['seed']
        if(seed == -1):
            seed = None
        return solver.run(
            model = model,
            t = data['endSim'],
            number_of_trajectories = data['stochasticSettings']['realizations'],
            increment = data['timeStep'],
            seed = seed,
            switch_tol = data['stochasticSettings']['hybridTauSettings']['switchingTolerance'],
            tau_tol = data['stochasticSettings']['hybridTauSettings']['tauTolerance']
        )


    def basicODESolver(self, model, data):
        solver = BasicODESolver()
        return solver.run(
            model = model,
            t = data['endSim'],
            increment = data['timeStep']
        )
        #integrator_options = Dict


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


class RunModelAPIHandler2(BaseHandler):

    async def get(self, modelName):
        checkUserOrRaise(self)
        log = logging.getLogger()
        user = self.current_user.name
        log.debug('jupyter-{0}'.format(user))
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        bits, stat = container.get_archive("/home/jovyan/work/{0}.json".format(modelName))
        _data = self.getModelData(bits, modelName)
        if not _data:
            raise web.HTTPError(404)
        data = _data
        data['name'] = modelName
        self.set_header('Content-Type', 'application/json')
        _model = ModelFactory2(data)
        _results = self.run_solver(_model.model, data['simulationSettings'])
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

    
    def getModelData(self, bits, modelName):
        f = tempfile.TemporaryFile()
        for data in bits:
            f.write(data)
        f.seek(0)
        tarData = tarfile.TarFile(fileobj=f)
        tarData.extractall("/srv/jupyterhub/templates/")
        f.close()
        filePath = "/srv/jupyterhub/templates/{0}.json".format(modelName)
        with open(filePath, 'r') as jsonFile:
            data = jsonFile.read()
            jsonData = json.loads(str(data))
            return jsonData


    def basicTauLeapingSolver(self, model, data):
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


    def basicTauHybridSolver(self, model, data):
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
        
