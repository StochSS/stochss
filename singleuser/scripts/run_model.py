#!/usr/bin/env python3

import os
import sys
import json
import argparse
import logging

from io import StringIO
from gillespy2.core import log
log_stream = StringIO()
for handler in log.handlers:
    if type(handler) is logging.StreamHandler:
        handler.stream = log_stream


from gillespy2 import Species, Parameter, Reaction, RateRule, Model
import numpy
import gillespy2.core.gillespySolver

try:
    from gillespy2.core.events import EventAssignment, EventTrigger, Event
except:
    log.warn("Events are not supported by gillespy2!")

from gillespy2.core.gillespyError import SolverError, DirectoryError, BuildError, ExecutionError
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver
from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver
from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver
from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver

import warnings
warnings.simplefilter("ignore")


user_dir = '/home/jovyan'


class _Model(Model):
    '''
    ##############################################################################
    Build a GillesPy2 model.
    ##############################################################################
    '''
    def __init__(self, name, species, parameters, reactions, events, rate_rules, endSim, timeStep, volume):
        '''
        Initialize and empty model and add its components.

        Attributes
        ----------
        name : str
            Name of the model.
        species : list
            List of GillesPy2 species to be added to the model.
        parameters : list
            List of GillesPy2 parameters to be added to the model.
        reactions : list
            List of GillesPy2 reactions to be added to the model.
        events : list
            List of GillesPy2 events to be added to the model.
        rate_rules : list
            List of GillesPy2 rate rules to be added to the model.
        endSim : int
            Simulation duration of the model.
        timeStep : int
            Time unit until next sample.
        volume : int
            The volume of the system matters when converting to from population to
            concentration form. This will also set a parameter "vol" for use in
            custom (i.e. non-mass-action) propensity functions.
        '''
        Model.__init__(self, name=name, volume=volume)
        self.add_parameter(parameters)
        self.add_species(species)
        self.add_reaction(reactions)
        try:
            self.add_event(events)
        except:
            log.warn("Could not add events as events are not supported.")
        self.add_rate_rule(rate_rules)
        numSteps = int(endSim / timeStep + 1)
        self.timespan(numpy.linspace(0,endSim,numSteps))


class ModelFactory():
    '''
    ##############################################################################
    Build the individual components of a model.
    ##############################################################################
    '''
    def __init__(self, data):
        '''
        Initialize and build a GillesPy2 model.

        Attributes
        ----------
        data : dict
            A json representation of a model.
        '''
        name = data['name']
        timeStep = (data['simulationSettings']['timeStep'])
        endSim = data['simulationSettings']['endSim']
        volume = data['simulationSettings']['volume']
        self.species = list(map(lambda s: self.build_specie(s), data['species']))
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        self.events = list(map(lambda e: self.build_event(e, self.species, self.parameters), data['eventsCollection']))
        self.rate_rules = list(map(lambda rr: self.build_rate_rules(rr), data['rateRules']))
        self.model = _Model(name, self.species, self.parameters, self.reactions, self.events, self.rate_rules, endSim, timeStep, volume)

    def build_specie(self, args):
        '''
        Build a GillesPy2 species.

        Atrributes
        ----------
        args : dict
            A json representation of a species.
        '''
        name = args['name'].strip()
        value = args['value']
        mode = args['mode']
        return Species(name=name, initial_value=value, mode=mode)

    def build_parameter(self, args):
        '''
        Build a GillesPy2 parameter.

        Attributes
        ----------
        args : dict
            A json representation of a parameter.
        '''
        name = args['name'].strip()
        value = args['value']
        return Parameter(name=name, expression=value)

    def build_reaction(self, args, parameters):
        '''
        Build a GillesPy2 reaction.

        Attributes
        ----------
        args : dict
            A json representation of a reaction.
        parameters : list
            List of GillesPy2 parameters.
        '''
        if args['reactionType'] not in 'custom-propensity':
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


    def build_event(self, args, species, parameters):
        '''
        Build a GillesPy2 event.

        Attributes
        ----------
        args : dict
            A json representation of an event.
        species : list
            List of GillesPy2 species.
        parameter : list
            List of GillesPy2 parameters.
        '''
        name = args['name']
        if not args['delay'] == "":
            delay = args['delay']
        else:
            delay = None
        priority = args['priority']
        trigger_expression = args['triggerExpression']
        initial_value = args['initialValue']
        persistent = args['persistent']
        use_values_from_trigger_time = args['useValuesFromTriggerTime']

        try:
            trigger = EventTrigger(expression=trigger_expression, initial_value = initial_value, persistent = persistent)
        except:
            log.warn("Can't create an event trigger as events are not supported")

        assignments = list(map(lambda a: self.build_event_assignment(a, self.species, self.parameters), args['eventAssignments']))

        try:
            return Event(name=name, delay=delay, assignments=assignments, priority=priority, trigger=trigger, use_values_from_trigger_time=use_values_from_trigger_time)
        except:
            log.warn("Can't create an event as events are not supported")


    def build_event_assignment(self, args, species, parameters):
        '''
        Build a GillesPy2 event assignment.

        Attributes
        ----------
        args : dict
            A json representation of an event assignment.
        species : list
            List of GillesPy2 species.
        parameter : list
            List of GillesPy2 parameters.
        '''
        expression = args['expression']
        variable = list(filter(lambda s: s.name == args['variable']['name'], species))
        if not len(variable):
            variable = list(filter(lambda p: p.name == args['variable']['name'], parameters))

        try:
            return EventAssignment(variable=variable[0], expression=expression)
        except:
            log.warn("Can't create an event assignment as events are not supported")


    def build_rate_rules(self, args):
        '''
        Build a GillesPy2 rate rule.

        Attributes
        ----------
        args : dict
            A json representation of a rate rule.
        '''
        name = args['name']
        species = self.build_specie(args['specie'])
        expression = args['rule']
        return RateRule(name=name, species=species, expression=expression)

    def build_stoich_species_dict(self, args):
        '''
        Build a dictionary of GillesPy2 stoich species

        Attributes
        ----------
        args : dict
            A json representation of a stoich species
        '''
        d = {}
        for stoich_specie in args:
            key = stoich_specie['specie']['name']
            value = stoich_specie['ratio']
            d[key] = value
        return d


def run_model(model_path):
    '''
    Run the model and return a preview of the results from the first trajectory.
    Model runs will timeout after 5 seconds if the model hasn't completed.
    Logs are logged to a stream object.

    Attributes
    ----------
    model_path : str
        Path to the model file.
    '''
    with open(model_path, "r") as jsonFile:
        data = jsonFile.read()
    jsonData = json.loads(str(data))
    jsonData['name'] = model_path.split('/').pop().split('.')[0]
    _model = ModelFactory(jsonData)
    _results = run_solver(_model.model, jsonData['simulationSettings'], 5)
    results = _results[0]
    res_dict = dict(results)
    for k, v in res_dict.items():
        res_dict[k] = list(v)
    results = res_dict
    for key in results.keys():
        if not isinstance(results[key], list):
            # Assume it's an ndarray, use tolist()
            results[key] = results[key].tolist()
    results['data'] = jsonData
    return results


def run_solver(model, data, run_timeout):
    '''
    Choose the solver based on the algorithm and is_stochastic.

    Attributes
    ----------
    model : GillesPy2 Model
        Model to be run.
    data : dict
        Simulation settings to use for the run.
    run_timeout : int
        Number of seconds until the simulation times out.
    '''
    if(data['is_stochastic'] == False):
        return basicODESolver(model, data, run_timeout)
    algorithm = data['stochasticSettings']['algorithm']
    if(algorithm == "SSA"):
        return ssaSolver(model, data, run_timeout)
    if(algorithm == "Tau-Leaping"):
        return basicTauLeapingSolver(model, data, run_timeout)
    if(algorithm == "Hybrid-Tau-Leaping"):
        return basicTauHybridSolver(model, data, run_timeout)


def basicODESolver(model, data, run_timeout):
    '''
    Run the model with the GillesPy2 BasicODESolver.

    Attributes
    ----------
    model : GillesPy2 Model
        Model to be run.
    data : dict
        Simulation settings to use for the run.
    run_timeout : int
        Number of seconds until the simulation times out.
    '''
    results = model.run(
        solver = BasicODESolver,
        timeout = run_timeout,
        integrator_options = { 'atol' : data['deterministicSettings']['absoluteTol'], 'rtol' : data['deterministicSettings']['relativeTol']}
    )
    return results


def ssaSolver(model, data, run_timeout):
    '''
    Run the model with the best GillesPy2 SSASolver.

    Attributes
    ----------
    model : GillesPy2 Model
        Model to be run.
    data : dict
        Simulation settings to use for the run.
    run_timeout : int
        Number of seconds until the simulation times out.
    '''
    seed = data['stochasticSettings']['ssaSettings']['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        solver = get_best_ssa_solver(),
        timeout = run_timeout,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed
    )
    return results


def basicTauLeapingSolver(model, data, run_timeout):
    '''
    Run the model with the GillesPy2 BasicTauLeapingSolver.
    
    Attributes
    ----------
    model : GillesPy2 Model
        Model to be run.
    data : dict
        Simulation settings to use for the run.
    run_timeout : int
        Number of seconds until the simulation times out.
    '''
    seed = data['stochasticSettings']['tauSettings']['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        solver = BasicTauLeapingSolver,
        timeout = run_timeout,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed,
        tau_tol = data['stochasticSettings']['tauSettings']['tauTol']
    )
    return results


def basicTauHybridSolver(model, data, run_timeout):
    '''
    Run the model with the GillesPy2 BasicTauHybridSolver.
    
    Attributes
    ----------
    model : GillesPy2 Model
        Model to be run.
    data : dict
        Simulation settings to use for the run.
    run_timeout : int
        Number of seconds until the simulation times out.
    '''
    seed = data['stochasticSettings']['hybridSettings']['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        solver = BasicTauHybridSolver,
        timeout = run_timeout,
        number_of_trajectories = data['stochasticSettings']['realizations'],
        seed = seed,
        switch_tol = data['stochasticSettings']['hybridSettings']['switchTol'],
        tau_tol = data['stochasticSettings']['hybridSettings']['tauTol']
    )
    return results


def get_parsed_args():
    '''
    Initializes an argpaser to document this script and returns a dict of
    the arguments that were passed to the script from the command line.

    Attributes
    ----------

    '''
    parser = argparse.ArgumentParser(description="Run a preview of a model. Prints the results of the first trajectory after 5s.")
    parser.add_argument('model_path', help="The path from the user directory to the model.")
    parser.add_argument('outfile', help="The temp file used to hold the results.")
    parser.add_argument('-s', '--start', action="store_true", help="Start a model preview run.")
    parser.add_argument('-r', '--read', action="store_true", help="Check for model preview results.")
    args = parser.parse_args()
    if not (args.start or args.read):
        parser.error("No action requested, please add -s (start) or -r (read).")
    return args


if __name__ == "__main__":
    args = get_parsed_args()
    model_path = os.path.join(user_dir, args.model_path)
    outfile = os.path.join(user_dir, ".{0}".format(args.outfile))
    if not args.read:
        results = run_model(model_path)
        resp = {"timeout":False, "results":results}
        logs = log_stream.getvalue()
        if 'GillesPy2 simulation exceeded timeout.' in logs:
            resp['timeout'] = True
        with open(outfile, "w") as fd:
            json.dump(resp, fd)
        open(outfile + ".done", "w").close()
    else:
        if os.path.exists(outfile + ".done"):
            with open(outfile, "r") as fd:
                print(fd.read())
            os.remove(outfile)
            os.remove(outfile + ".done")
        else:
            print("running")
    log_stream.close()


