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
try:
    from gillespy2 import AssignmentRule
except:
    log.warn("Assignment Rules are not supported")
import numpy
import gillespy2.core.gillespySolver
from gillespy2.core.events import EventAssignment, EventTrigger, Event
from gillespy2.core.gillespyError import ModelError, SolverError, DirectoryError, BuildError, ExecutionError
from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver
from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver

import warnings
warnings.simplefilter("ignore")


user_dir = '/home/jovyan'


class _Model(Model):
    '''
    ##############################################################################
    Build a GillesPy2 model.
    ##############################################################################
    '''
    def __init__(self, name, species, parameters, reactions, events, rate_rules, assignment_rules, endSim, timeStep, volume):
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
        assignment_rules : list
            List of GillesPy2 assignment rules to be added to the model.
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
        self.add_event(events)
        self.add_rate_rule(rate_rules)
        try:
            self.add_assignment_rules(assignment_rules)
        except:
            log.warn('Assignment rules are not supported.')
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
        timeStep = (data['modelSettings']['timeStep'])
        endSim = data['modelSettings']['endSim']
        volume = data['modelSettings']['volume']
        is_ode = data['simulationSettings']['algorithm'] == "ODE"
        self.species = list(map(lambda s: self.build_specie(s, is_ode), data['species']))
        self.parameters = list(map(lambda p: self.build_parameter(p), data['parameters']))
        self.reactions = list(map(lambda r: self.build_reaction(r, self.parameters), data['reactions']))
        self.events = list(map(lambda e: self.build_event(e, self.species, self.parameters), data['eventsCollection']))
        rate_rules = list(filter(lambda rr: self.is_valid_rate_rule(rr), data['rules']))
        assignment_rules = list(filter(lambda rr: self.is_valid_assignment_rule(rr), data["rules"]))
        self.rate_rules = list(map(lambda rr: self.build_rate_rules(rr, self.species, self.parameters), rate_rules))
        self.assignment_rules = list(map(lambda ar: self.build_assignment_rules(ar, self.species, self.parameters), assignment_rules))
        self.model = _Model(name, self.species, self.parameters, self.reactions, self.events, self.rate_rules, self.assignment_rules, endSim, timeStep, volume)

    def build_specie(self, args, is_ode):
        '''
        Build a GillesPy2 species.

        Atrributes
        ----------
        args : dict
            A json representation of a species.
        '''
        name = args['name'].strip()
        value = args['value']
        if not is_ode:
            mode = args['mode']
        else:
            mode = 'continuous'
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
        expression = args['expression']
        return Parameter(name=name, expression=expression)

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

        trigger = EventTrigger(expression=trigger_expression, initial_value=initial_value, persistent=persistent)

        assignments = list(map(lambda a: self.build_event_assignment(a, self.species, self.parameters), args['eventAssignments']))

        return Event(name=name, delay=delay, assignments=assignments, priority=priority, trigger=trigger, use_values_from_trigger_time=use_values_from_trigger_time)


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

        return EventAssignment(variable=variable[0], expression=expression)
        

    def is_valid_rate_rule(self, rr):
        if rr['type'] == "Rate Rule" and not rr['expression'] == "":
            return rr


    def is_valid_assignment_rule(self, rr):
        if rr['type'] == "Assignment Rule" and not rr['expression'] == "":
            return rr


    def build_rate_rules(self, args, species, parameters):
        '''
        Build a GillesPy2 rate rule.

        Attributes
        ----------
        args : dict
            A json representation of a rate rule.
        species : list
            List of GillesPy2 species.
        parameter : list
            List of GillesPy2 parameters.
        '''
        name = args['name']
        variable = list(filter(lambda s: s.name == args['variable']['name'], species))
        if not len(variable):
            variable = list(filter(lambda p: p.name == args['variable']['name'], parameters))
        expression = args['expression']
        return RateRule(name=name, species=variable[0], expression=expression)


    def build_assignment_rule(self, args, species, parameters):
        '''
        Build a GillesPy2 assignment rule.

        Attributes
        ----------
        args : dict
            A json representation of an assignment rule.
        species : list
            List of GillesPy2 species.
        parameter : list
            List of GillesPy2 parameters.
        '''
        name = args['name']
        variable = list(filter(lambda s: s.name == args['variable']['name'], species))
        if not len(variable):
            variable = list(filter(lambda p: p.name == args['variable']['name'], parameters))
        expression = args['expression']
        try:
            return AssignmentRule(variable=variable[0], formula=expression)
        except:
            log.warn("Assignment rules are not yet supported")


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
    jsonData['simulationSettings']['realizations'] = jsonData['modelSettings']['realizations']
    jsonData['simulationSettings']['algorithm'] = jsonData['modelSettings']['algorithm']
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
    # print("Selecting the algorithm")
    algorithm = data['algorithm']
    if(algorithm == "ODE"):
        return basicODESolver(model, data, run_timeout)
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
    # print("running ode solver")
    results = model.run(
        solver = BasicTauHybridSolver,
        timeout = run_timeout,
        integrator_options = { 'atol' : data['absoluteTol'], 'rtol' : data['relativeTol']}
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
    # print("running ssa solver")
    seed = data['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        timeout = run_timeout,
        number_of_trajectories = data['realizations'],
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
    # print("running tau leaping solver")
    seed = data['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        solver = BasicTauLeapingSolver,
        timeout = run_timeout,
        number_of_trajectories = data['realizations'],
        seed = seed,
        tau_tol = data['tauTol']
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
    # print("running hybrid solver")
    seed = data['seed']
    if(seed == -1):
        seed = None
    results = model.run(
        solver = BasicTauHybridSolver,
        timeout = run_timeout,
        number_of_trajectories = data['realizations'],
        seed = seed,
        tau_tol = data['tauTol'],
        integrator_options = { 'atol' : data['absoluteTol'], 'rtol' : data['relativeTol']}
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
        resp = {"timeout":False}
        try:
            results = run_model(model_path)
            resp["results"] = results
            logs = log_stream.getvalue()
            if 'GillesPy2 simulation exceeded timeout.' in logs:
                resp['timeout'] = True
        except ModelError as error:
            resp['errors'] = str(error)
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
            print("running->{0}".format(outfile))
    log_stream.close()


