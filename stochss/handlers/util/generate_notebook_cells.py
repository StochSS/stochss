#!/usr/bin/env python3
import json

from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver


def generate_imports_cell(json_data, gillespy2_model, is_ssa_c=False,
                            settings=None, interactive_backend=False):
    # Imports cell
    imports = 'import numpy as np\n'
    if interactive_backend:
        imports += '%matplotlib notebook\n'
    if json_data['is_spatial']:
        # Spatial
        imports += 'import spatialPy\n'
    else:
        # Non-Spatial
        imports += 'import gillespy2\n'
        imports += 'from gillespy2.core import Model, Species, Reaction, Parameter, RateRule, AssignmentRule, FunctionDefinition\n'
        imports += 'from gillespy2.core.events import EventAssignment, EventTrigger, Event\n'
        algorithm = get_algorithm(gillespy2_model, is_ssa_c) if settings is None or settings['isAutomatic'] else get_algorithm(gillespy2_model, is_ssa_c, algorithm=settings['algorithm'])
        if algorithm == "SSA" and get_best_ssa_solver().name == "SSACSolver":
            ssa = 'from gillespy2.solvers.cpp.ssa_c_solver import SSACSolver\n'
        else:
            ssa = '# To run a simulation using the SSA Solver simply omit the solver argument from model.run().\n'
        algorithm_map = {
                'SSA': ssa,
                'V-SSA': 'from gillespy2.solvers.cpp.variable_ssa_c_solver import VariableSSACSolver\n',
                'Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver\n',
                'Hybrid-Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver\n',
                'ODE': 'from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver'
                }

        for name, algorithm_import in algorithm_map.items():
            if settings is not None and not settings['isAutomatic'] and name == algorithm:
                imports += algorithm_import
            else:
                if not algorithm_import.startswith("#"):
                    algorithm_import = "# " + algorithm_import
                imports += algorithm_import

        # imports += algorithm_map[algorithm]
    
    return imports


def create_parameter_strings(json_data, padding):
    param_string = '\n' + padding + '# Parameters\n'
    for param in json_data['parameters']:
        param_string += padding + 'self.add_parameter(Parameter(name="{0}", expression={1}))\n'.format(
                param['name'], 
                param['expression'])
    return param_string


def create_species_strings(json_data, padding):
    species_string = '\n' + padding + '# Species\n'
    for species in json_data['species']:
        species_string += padding + 'self.add_species(Species(name="{0}", initial_value={1}, mode="{2}"))\n'.format(
                species['name'], 
                species['value'], 
                species['mode'])
    return species_string

def create_reaction_strings(json_data, padding):
    reaction_string = '\n' + padding + '# Reactions\n'
    for reaction in json_data['reactions']:
        reactants = {}
        products = {}
        # Parse Reactants/Products
        for reactant in reaction['reactants']:
            reactants[reactant['specie']['name']] = reactant['ratio']
        for product in reaction['products']:
            products[product['specie']['name']] = product['ratio']

        #If custom propensity given
        if reaction['reactionType'] == 'custom-propensity':
            reaction_string += padding + 'self.add_reaction(Reaction(name="{0}", reactants={1}, products={2}, propensity_function="{3}"))\n'.format(
                    reaction['name'],
                    str(reactants),
                    str(products),
                    reaction['propensity'])
        # If propensity rate given
        else:
            reaction_string += padding + 'self.add_reaction(Reaction(name="{0}", reactants={1}, products={2}, rate=self.listOfParameters["{3}"]))\n'.format(
                    reaction['name'],
                    str(reactants),
                    str(products),
                    reaction['rate']['name'])

    return reaction_string


def create_events_string(json_data, padding):
    event_string = ''
    if json_data['eventsCollection']:
        event_string += '\n' + padding + '# Events'
        for event in json_data['eventsCollection']:
            event_string += '\n' + padding + '{0}t = EventTrigger(expression="{1}", initial_value={2}, persistent={3})\n'.format(
                event['name'],
                event['triggerExpression'],
                event['initialValue'],
                event['persistent'])

            assignment_names = []
            for i, assignment in enumerate(event['eventAssignments']):
                assignment_name = '{0}a{1}'.format(event['name'], i+1)
                assignment_names.append(assignment_name)
                event_string += padding + '{0} = EventAssignment(variable="{1}", expression="{2}")\n'.format(
                    assignment_name,
                    assignment['variable']['name'],
                    assignment['expression'])

            if event['delay']:
                e = 'self.add_event(Event(name="{0}", trigger={0}t, assignments=[{1}], delay="{2}", priority="{3}", use_values_from_trigger_time={4}))\n'.format(
                    event['name'],
                    ", ".join(assignment_names),
                    event['delay'],
                    event['priority'],
                    event['useValuesFromTriggerTime'])
            else:
                e = 'self.add_event(Event(name="{0}", trigger={0}t, assignments=[{1}], delay=None, priority="{2}", use_values_from_trigger_time={3}))\n'.format(
                        event['name'],
                        ", ".join(assignment_names),
                        event['priority'],
                        event['useValuesFromTriggerTime'])
            
            event_string += padding + e

    return event_string


def create_rate_rule_strings(json_data, padding):
    rr_string = ''
    rate_rules = list(filter(lambda rule: rule['type'] == "Rate Rule", json_data['rules']))
    if rate_rules:
        rr_string += '\n' + padding + '# Rate Rules\n'
        for rr in rate_rules:
            rr_string += padding + 'self.add_rate_rule(RateRule(name="{0}", formula="{1}", variable="{2}""))\n'.format(
                    rr['name'], 
                    rr['expression'], 
                    rr['variable']['name'])
    return rr_string


def create_assignment_rule_string(json_data, padding):
    ar_string = ''
    assignment_rules = list(filter(lambda rule: rule['type'] == "Assignment Rule", json_data['rules']))
    if assignment_rules:
        ar_string += '\n' + padding + '# Assignment Rules\n'
        for ar in assignment_rules:
            ar_string += padding + 'self.add_assignment_rule(AssignmentRule(name="{0}", formula="{1}", variable="{2}"))\n'.format(
                    ar['name'],
                    ar['expression'],
                    ar['variable']['name'])
    return ar_string


def create_function_definition_string(json_data, padding):
    fd_string = ''
    if json_data['functionDefinitions']:
        fd_string += '\n' + padding + '# Function Definitions\n'
        for fd in json_data['functionDefinitions']:
            fd_string += padding + 'self.add_function_definition(FunctionDefinition(name="{0}", function="{1}", args={2}))\n'.format(
                    fd['name'],
                    fd['expression'],
                    fd['variables'].split(', '))
    return fd_string


def generate_model_cell(json_data, name):
        
    # Create strings from RateRules
    model_cell = ''
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        model_cell += 'class {0}(Model):\n'.format(name)
        model_cell += '    def __init__(self, parameter_values=None):\n'
        padding = '        '
        model_cell += padding + 'Model.__init__(self, name="{0}")\n'.format(name)
        model_cell += padding + 'self.volume = {0}\n'.format(
                json_data['modelSettings']['volume'])

        model_cell += create_parameter_strings(json_data, padding)
        model_cell += create_species_strings(json_data, padding)
        model_cell += create_reaction_strings(json_data, padding)
        model_cell += create_events_string(json_data, padding)
        model_cell += create_rate_rule_strings(json_data, padding)
        model_cell += create_assignment_rule_string(json_data, padding)
        model_cell += create_function_definition_string(json_data, padding)

        model_cell += '\n' + padding + '# Timespan\n'
        duration = json_data['modelSettings']['endSim']
        model_cell += padding + 'self.timespan(np.linspace(0, {0}, {1}))'.format(
                duration,
                round(duration/json_data['modelSettings']['timeStep'] + 1))
            
        # Create strings from Reactions

    return model_cell


def get_settings(path=None):
    if path is None:
        path = "/stochss/stochss_templates/workflowSettingsTemplate.json"

    with open(path, "r") as file:
        settings = json.load(file)['simulationSettings']

    return settings


def generate_configure_simulation_cell(json_data, gillespy2_model, is_ssa_c=False, is_mdl_inf=False, show_labels=True, settings=None):
    padding = '    '
    
    # Get stochss simulation settings
    if settings is None:
        settings = get_settings()
        algorithm = get_algorithm(gillespy2_model, is_ssa_c)
    elif settings['isAutomatic']:
        algorithm = get_algorithm(gillespy2_model, is_ssa_c)
    else:
        algorithm = get_algorithm(gillespy2_model, is_ssa_c, algorithm=settings['algorithm'])

    is_automatic = settings['isAutomatic']

    # Get settings for model.run()
    settings = get_run_settings(settings, show_labels, is_mdl_inf, algorithm)

    settings_lists = {"ODE":['"solver"','"integrator_options"','"show_labels"'],
                      "SSA":['"seed"','"number_of_trajectories"','"show_labels"'],
                      "V-SSA":['"solver"','"seed"','"number_of_trajectories"','"show_labels"'],
                      "Tau-Leaping":['"solver"','"seed"','"number_of_trajectories"','"tau_tol"','"show_labels"'],
                      "Hybrid-Tau-Leaping":['"solver"','"seed"','"number_of_trajectories"','"tau_tol"','"integrator_options"','"show_labels"']
                     }

    if get_best_ssa_solver().name == "SSACSolver":
        settings_lists['SSA'].append('"solver"')

    settings_map = []
    for setting in settings:
        if setting.split(':')[0] == '"solver"' and is_ssa_c:
            settings_map.append(padding*2 + setting)
        elif (setting.split(':')[0] == '"show_labels"' or setting.split(':')[0] == '"number_of_trajectories"') and is_mdl_inf:
            settings_map.append(padding*2 + setting)
        elif is_automatic or setting.split(':')[0] not in settings_lists[algorithm]:
            settings_map.append(padding*2 + "# " + setting)
        else:
            settings_map.append(padding*2 + setting)
    
    config_string = 'def configure_simulation():\n'

    if is_mdl_inf:
        config_string += "# the minimum number of trajectoies needs to be at least 30\n"

    config_string += padding + 'kwargs = {\n'
    config_string += ",\n".join(settings_map) + "\n"
    config_string += padding + "}\n"
    config_string += padding + "return kwargs"

    return config_string


def generate_run_cell(json_data):
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        run_cell = 'kwargs = configure_simulation()\n'
        run_cell += 'results = model.run(**kwargs)'
        
    return run_cell


def get_algorithm(gillespy2_model, is_ssa_c=False, algorithm=None):
    if algorithm is not None:
        if algorithm == "SSA" and is_ssa_c:
            return "V-SSA"
        return algorithm

    algorithm_map = {"SSACSolver":"SSA",
                     "VariableSSACSolver":"V-SSA",
                     "BasicTauHybridSolver":"Hybrid-Tau-Leaping",
                     "BasicTauLeapingSolver":"Tau-Leaping",
                     "BasicODESolver":"ODE",
                     "NumPySSASolver":"SSA"
                     }

    if is_ssa_c:
        name = gillespy2_model.get_best_solver().name
    else:
        name = gillespy2_model.get_best_solver(precompile=False).name

    return algorithm_map[name]


def get_run_settings(settings, show_labels, is_mdl_inf, algorithm):
    # Map algorithm for GillesPy2
    solver_map = {"SSA":"",
                  "V-SSA":'"solver":solver',
                  "ODE":'"solver":BasicODESolver',
                  "Tau-Leaping":'"solver":BasicTauLeapingSolver',
                  "Hybrid-Tau-Leaping":'"solver":BasicTauHybridSolver'}

    if get_best_ssa_solver().name == "SSACSolver":
        solver_map['SSA'] = '"solver":solver'

    # Map seed for GillesPy2
    if settings['seed'] == -1:
        settings['seed'] = None

    # Map number_of_trajectories for model inference
    if is_mdl_inf and settings['realizations'] < 30:
        settings['realizations'] = 100

    # Map algorithm settings for GillesPy2. GillesPy2 requires snake case, remap camelCase
    settings_map = { "number_of_trajectories":settings['realizations'], 
                     "seed":settings['seed'], 
                     "tau_tol":settings['tauTol'], 
                     "integrator_options" : str({ "rtol":settings['relativeTol'], "atol":settings['absoluteTol'] })
                   }
    
    #Parse settings for algorithm
    run_settings = [solver_map[algorithm]] if solver_map[algorithm] else []
    if not show_labels:
        run_settings.append('"show_labels":False')
    algorithm_settings =  ['"{0}":{1}'.format(key, val) for key, val in settings_map.items()]
    run_settings.extend(algorithm_settings)
    
    return run_settings


def generate_feature_extraction_cell():
    feature_extraction_cell = '''# Feature extraction function.  What value(s) do you want to extract
# from the simulation trajectory

def population_at_last_timepoint(c,res):
    if c.verbose: print('population_at_last_timepoint {0}={1}'.format(c.species_of_interest,res[c.species_of_interest][-1]))
    return res[c.species_of_interest][-1]'''
    return feature_extraction_cell


def generate_mean_std_aggregate_cell():
    aggregate_cell = '''# Aggregation function, How to we combine the values from multiple 
# trajectores

def mean_std_of_ensemble(c,data):
    a=np.average(data)
    s=np.std(data)
    if c.verbose: print('mean_std_of_ensemble m:{0} s:{1}'.format(a,s))
    return (a,s)'''
    return aggregate_cell


def generate_average_aggregate_cell():
    average_aggregate_cell = '''# Aggregation function, How to we combine the values from multiple 
# trajectores

def average_of_ensemble(c,data):
    a=np.average(data)
    if c.verbose: print('average_of_ensemble = {0}'.format(a))
    return a'''
    return average_aggregate_cell


def generate_1D_parameter_sweep_class_cell(json_data, algorithm):
    if algorithm == "V-SSA":
        psweep_class_cell ='''class ParameterSweep1D():
    
    def run(c, kwargs, verbose=False):
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        data = np.zeros((len(c.p1_range),2)) # mean and std
        for i,v1 in enumerate(c.p1_range):
            if verbose: print("running {0}={1}".format(c.p1,v1))
            #if verbose: print("\t{0}".format(["{0}={1},".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))\n'''

        variable_string = "variables={c.p1:v1}" 
        psweep_class_cell += '''            if(c.number_of_trajectories > 1):
                tmp_results = model.run(**kwargs, {0})
                (m,s) = ag([fn(x) for x in tmp_results])
                data[i,0] = m
                data[i,1] = s
            else:
                tmp_result = model.run(**kwargs, {0})
                data[i,0] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(variable_string)
    else:
        psweep_class_cell ='''class ParameterSweep1D():
    
    def run(c, kwargs, verbose=False):
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        data = np.zeros((len(c.p1_range),2)) # mean and std
        for i,v1 in enumerate(c.p1_range):
            tmp_model = c.ps_class()
            tmp_model.listOfParameters[c.p1].set_expression(v1)
            if verbose: print("running {0}={1}".format(c.p1,v1))
            #if verbose: print("\t{0}".format(["{0}={1},".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))\n'''

        psweep_class_cell += '''            if(c.number_of_trajectories > 1):
                tmp_results = tmp_model.run(**kwargs)
                (m,s) = ag([fn(x) for x in tmp_results])
                data[i,0] = m
                data[i,1] = s
            else:
                tmp_result = tmp_model.run(**kwargs)
                data[i,0] = c.feature_extraction(tmp_result)
        c.data = data\n'''


    psweep_class_cell += '''
    def plot(c):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy
        fig, ax = plt.subplots(figsize=(8,8))
        plt.title("Parameter Sweep - Species:{0}".format(c.species_of_interest))
        plt.errorbar(c.p1_range,c.data[:,0],c.data[:,1])
        plt.xlabel(c.p1, fontsize=16, fontweight='bold')
        plt.ylabel("Population", fontsize=16, fontweight='bold')


    def plotplotly(c, return_plotly_figure=False, species_of_interest=None):
        from plotly.offline import iplot
        import plotly.graph_objs as go

        data = c.data
        visible = c.number_of_trajectories > 1
        error_y = dict(type='data', array=data[:,1], visible=visible)

        trace_list = [go.Scatter(x=c.p1_range, y=data[:,0], error_y=error_y)]

        title = dict(text="<b>Parameter Sweep - Species: {0}</b>".format(c.species_of_interest), x=0.5)
        yaxis_label = dict(title="<b>Population</b>")
        xaxis_label = dict(title="<b>{0}</b>".format(c.p1))

        layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)

        fig = dict(data=trace_list, layout=layout)

        if return_plotly_figure:
            return fig
        else:
            iplot(fig)
    '''
    return psweep_class_cell


def generate_1D_psweep_config_cell(json_data, model_name, settings=None):
    padding = '    '
    if settings is None:
        num_traj = 1
        p1 = json_data['parameters'][0]['name']
        p1_min = "0.5 * float(eval(model.get_parameter(p1).expression))"
        p1_max = "1.5 * float(eval(model.get_parameter(p1).expression))"
        p1_steps = "11"
        soi = json_data['species'][0]['name']
    else:
        num_traj = settings['simulationSettings']['realizations']
        settings = settings['parameterSweepSettings']
        p1 = settings['parameterOne']['name']
        p1_min = settings['p1Min']
        p1_max = settings['p1Max']
        p1_steps = settings['p1Steps']
        soi = settings['speciesOfInterest']['name']

    psweep_config_cell = '''# Configuration for the Parameter Sweep
class ParameterSweepConfig(ParameterSweep1D):
    # What class defines the GillesPy2 model
    ps_class = {0}
    model = ps_class()
'''.format(model_name)
    psweep_config_cell += padding + 'p1 = "{0}" # ENTER PARAMETER 1 HERE\n'.format(p1)
    psweep_config_cell += padding + 'p1_min = {0} # ENTER START VALUE FOR P1 RANGE HERE\n'.format(p1_min)
    psweep_config_cell += padding + 'p1_max = {0} # ENTER END VALUE FOR P1 RANGE HERE\n'.format(p1_max)
    psweep_config_cell += padding + 'p1_steps = {0} # ENTER THE NUMBER OF STEPS FOR P1 HERE\n'.format(p1_steps)
    psweep_config_cell += padding + 'p1_range = np.linspace(p1_min,p1_max,p1_steps)\n'
    psweep_config_cell += padding + 'species_of_interest = "{0}" # ENTER SPECIES OF INTEREST HERE\n'.format(soi)
    psweep_config_cell += padding + 'number_of_trajectories = {0}\n'.format(num_traj)
    psweep_config_cell += padding + '''# What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = mean_std_of_ensemble
'''
    return psweep_config_cell


def generate_2D_parameter_sweep_class_cell(json_data, algorithm):
    if algorithm == "V-SSA":
        psweep_class_cell ='''class ParameterSweep2D():
    
    def run(c, kwargs, verbose=False):
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        data = np.zeros((len(c.p1_range),len(c.p2_range)))
        for i,v1 in enumerate(c.p1_range):
            for j,v2 in enumerate(c.p2_range):
                if verbose: print("running {0}={1}, {2}={3}".format(c.p1,v1,c.p2,v2))
                #if verbose: print("\t{0}".format(["{0}={1}, ".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))\n'''
    
        variable_string = "variables={c.p1:v1, c.p2:v2}"
        psweep_class_cell += '''                if(c.number_of_trajectories > 1):
                    tmp_results = model.run(**kwargs, {0})
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = model.run(**kwargs, {0})
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(variable_string)
    else:
        psweep_class_cell ='''class ParameterSweep2D():
    
    def run(c, kwargs, verbose=False):
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        data = np.zeros((len(c.p1_range),len(c.p2_range)))
        for i,v1 in enumerate(c.p1_range):
            for j,v2 in enumerate(c.p2_range):
                tmp_model = c.ps_class()
                tmp_model.listOfParameters[c.p1].set_expression(v1)
                tmp_model.listOfParameters[c.p2].set_expression(v2)
                if verbose: print("running {0}={1}, {2}={3}".format(c.p1,v1,c.p2,v2))
                #if verbose: print("\t{0}".format(["{0}={1}, ".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))\n'''
    
        psweep_class_cell += '''                if(c.number_of_trajectories > 1):
                    tmp_results = tmp_model.run(**kwargs)
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = tmp_model.run(**kwargs)
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data\n'''
    

    psweep_class_cell += '''
    def plot(c):
        from matplotlib import pyplot as plt
        from mpl_toolkits.axes_grid1 import make_axes_locatable
        import numpy
        fig, ax = plt.subplots(figsize=(8,8))
        plt.imshow(c.data)
        ax.set_xticks(numpy.arange(c.data.shape[1])+0.5, minor=False)
        ax.set_yticks(numpy.arange(c.data.shape[0])+0.5, minor=False)
        plt.title("Parameter Sweep - Species: {0}".format(c.species_of_interest))
        ax.set_xticklabels(c.p1_range, minor=False, rotation=90)
        ax.set_yticklabels(c.p2_range, minor=False)
        ax.set_xlabel(c.p1, fontsize=16, fontweight='bold')
        ax.set_ylabel(c.p2, fontsize=16, fontweight='bold')
        divider = make_axes_locatable(ax)
        cax = divider.append_axes("right", size="5%", pad=0.2)
        _ = plt.colorbar(ax=ax, cax=cax)


    def plotplotly(c, return_plotly_figure=False):
        from plotly.offline import init_notebook_mode, iplot
        import plotly.graph_objs as go
         
        xaxis_ticks = c.p1_range
        yaxis_ticks = c.p2_range
        data = c.data

        trace_list = [go.Heatmap(z=data, x=xaxis_ticks, y=yaxis_ticks)]

        title = dict(text="<b>Parameter Sweep - Species: {0}</b>".format(c.species_of_interest), x=0.5)
        xaxis_label = dict(title="<b>{0}</b>".format(c.p1))
        yaxis_label = dict(title="<b>{0}</b>".format(c.p2))

        layout = go.Layout(title=title, xaxis=xaxis_label, yaxis=yaxis_label)

        fig = dict(data=trace_list, layout=layout)

        if return_plotly_figure:
            return fig
        else:
            iplot(fig)
    '''
    return psweep_class_cell


def generate_2D_psweep_config_cell(json_data, model_name, settings=None):
    padding = '    '
    if settings is None:
        num_traj = 1
        p1 = json_data['parameters'][0]['name']
        p1_min = "0.5 * float(eval(model.get_parameter(p1).expression))"
        p1_max = "1.5 * float(eval(model.get_parameter(p1).expression))"
        p1_steps = "11"
        p2 = json_data['parameters'][1]['name']
        p2_min = "0.5 * float(eval(model.get_parameter(p2).expression))"
        p2_max = "1.5 * float(eval(model.get_parameter(p2).expression))"
        p2_steps = "11"
        soi = json_data['species'][0]['name']
    else:
        num_traj = settings['simulationSettings']['realizations']
        settings = settings['parameterSweepSettings']
        p1 = settings['parameterOne']['name']
        p1_min = settings['p1Min']
        p1_max = settings['p1Max']
        p1_steps = settings['p1Steps']
        p2 = settings['parameterTwo']['name']
        p2_min = settings['p2Min']
        p2_max = settings['p2Max']
        p2_steps = settings['p2Steps']
        soi = settings['speciesOfInterest']['name']

    psweep_config_cell = '''# Configuration for the Parameter Sweep
class ParameterSweepConfig(ParameterSweep2D):
    # What class defines the GillesPy2 model
    ps_class = {0}
    model = ps_class()
'''.format(model_name)
    psweep_config_cell += padding + 'p1 = "{0}" # ENTER PARAMETER 1 HERE\n'.format(p1)
    psweep_config_cell += padding + 'p2 = "{0}" # ENTER PARAMETER 2 HERE\n'.format(p2)
    psweep_config_cell += padding + 'p1_min = {0} # ENTER START VALUE FOR P1 RANGE HERE\n'.format(p1_min)
    psweep_config_cell += padding + 'p1_max = {0} # ENTER END VALUE FOR P1 RANGE HERE\n'.format(p1_max)
    psweep_config_cell += padding + 'p1_steps = {0} # ENTER THE NUMBER OF STEPS FOR P1 HERE\n'.format(p1_steps)
    psweep_config_cell += padding + 'p1_range = np.linspace(p1_min,p1_max,p1_steps)\n'
    psweep_config_cell += padding + 'p2_min = {0} # ENTER START VALUE FOR P2 RANGE HERE\n'.format(p2_min)
    psweep_config_cell += padding + 'p2_max = {0} # ENTER END VALUE FOR P2 RANGE HERE\n'.format(p2_max)
    psweep_config_cell += padding + 'p2_steps = {0} # ENTER THE NUMBER OF STEPS FOR P2 HERE\n'.format(p2_steps)
    psweep_config_cell += padding + 'p2_range = np.linspace(p2_min,p2_max,p2_steps)\n'
    psweep_config_cell += padding + 'species_of_interest = "{0}" # ENTER SPECIES OF INTEREST HERE\n'.format(soi)
    psweep_config_cell += padding + 'number_of_trajectories = {0}\n'.format(num_traj)
    psweep_config_cell += padding + '''# What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = average_of_ensemble
'''
    return psweep_config_cell

def generate_sciope_wrapper_cell(json_data, gillespy2_model):
    settings = get_settings()
    algorithm = get_algorithm(gillespy2_model)
    soi = [species['name'] for species in json_data['species']]

    # Select Solver
    solver_map = {
        'SSA': '',
        'Tau-Leaping': '"solver":BasicTauLeapingSolver, ',
        'Hybrid-Tau-Leaping': '"solver":BasicTauHybridSolver, ',
        'ODE': '"solver":BasicODESolver, '
        }
    sciope_wrapper_cell = '''from sciope.utilities.gillespy2 import wrapper
settings = {{{}"number_of_trajectories":10, "show_labels":True}}
simulator = wrapper.get_simulator(gillespy_model=model, run_settings=settings, species_of_interest={})
expression_array = wrapper.get_parameter_expression_array(model)'''.format(solver_map[algorithm], soi)
    return sciope_wrapper_cell

def generate_sciope_lhc_cell():
    sciope_lhc_cell = '''from dask.distributed import Client
from sciope.designs import latin_hypercube_sampling
from sciope.utilities.summarystats.auto_tsfresh import SummariesTSFRESH

c = Client()
lhc = latin_hypercube_sampling.LatinHypercube(xmin=expression_array, xmax=expression_array*3)
lhc.generate_array(1000) #creates a LHD of size 1000

#will use default minimal set of features
summary_stats = SummariesTSFRESH()'''
    return sciope_lhc_cell

def generate_sciope_stochmet_cell():
    sciope_stochmet_cell = '''from sciope.stochmet.stochmet import StochMET

met = StochMET(simulator, lhc, summary_stats)'''
    return sciope_stochmet_cell

def generate_sciope_psweep_run_cell():
    sciope_psweep_run_cell = '''met.compute(n_points=500, chunk_size=10)'''
    return sciope_psweep_run_cell

def generate_sciope_res_conf_cell():
    sciope_res_conf_cell = '''#First lets add some appropiate information about the model and features
met.data.configurations['listOfParameters'] = list(model.listOfParameters.keys())
met.data.configurations['listOfSpecies'] = list(model.listOfSpecies.keys())
met.data.configurations['listOfSummaries'] = met.summaries.features
met.data.configurations['timepoints'] = model.tspan'''
    return sciope_res_conf_cell

def generate_sciope_met_explore_cell():
    sciope_met_explore_cell = '''# Here we use UMAP for dimension reduction
met.explore(dr_method='umap')'''
    return sciope_met_explore_cell

def generate_sciope_supervised_train_cell():
    sciope_supervised_train_cell = '''from sciope.models.label_propagation import LPModel
#here lets use the dimension reduction embedding as input data
data = met.dr_model.embedding_

model_lp = LPModel()
#train using basinhopping
model_lp.train(data, met.data.user_labels, min_=0.01, max_=10, niter=50)'''
    return sciope_supervised_train_cell

def generate_sciope_map_labels_cell():
    sciope_map_labels_cell = '''# just to vislualize the result we will map the label distribution to the user_labels (will enable us to see the LP model 
# output when using method "explore")

user_labels = np.copy(met.data.user_labels)
#takes the label corresponding to index 0
met.data.user_labels = model_lp.model.label_distributions_[:,0]'''
    return sciope_map_labels_cell

def generate_sciope_explore_model_cell():
    sciope_explore_model_cell = '''met.explore(dr_method='umap')'''
    return sciope_explore_model_cell

def generate_sciope_set_labels_cell():
    sciope_set_labels_cell = '''met.data.user_labels = user_labels'''
    return sciope_set_labels_cell

def generate_parameter_sweep_run_cell(algorithm, settings):
    run_cell = '''kwargs = configure_simulation()
ps = ParameterSweepConfig()
'''
    
    if not algorithm == "ODE" and settings is not None and not settings['simulationSettings']['isAutomatic']:
        run_cell += "ps.number_of_trajectories = kwargs['number_of_trajectories']\n"
    run_cell += '%time ps.run(kwargs)'
    
    return run_cell


def generate_mdl_inf_import_cell():
    import_cell = '''from tsfresh.feature_extraction.settings import MinimalFCParameters
from sciope.utilities.priors import uniform_prior
from sciope.utilities.summarystats import auto_tsfresh
from sciope.utilities.distancefunctions import naive_squared
from sciope.inference.abc_inference import ABC
from sklearn.metrics import mean_absolute_error
from dask.distributed import Client'''

    return import_cell


def generate_mdl_inf_simulator_cell():
    simulator_cell = '''kwargs = configure_simulation()

# Define simulator function
def set_model_parameters(params, model):
    """para,s - array, need to have the same order as
    model.listOfParameters """
    for e, (pname, p) in enumerate(model.listOfParameters.items()):
        model.get_parameter(pname).set_expression(params[e])
    return model

# Here we use the GillesPy2 Solver
def simulator(params, model):
    model_update = set_model_parameters(params, model)
    
    res = model_update.run(**kwargs)
    tot_res = np.asarray([x.T for x in res]) # reshape to (N, S, T)
    tot_res = tot_res[:,1:, :] # should not contain timepoints

    return tot_res

# Wrapper, simulator function to abc should should only take one argument (the parameter point)
def simulator2(x):
    return simulator(x, model=model)'''
    return simulator_cell


def generate_mdl_inf_prior_cell():
    prior_cell = '''# Set up the prior
default_param = np.array(list(model.listOfParameters.items()))[:,1] # take default from mode 1 as reference

bound = []
for exp in default_param:
    bound.append(float(exp.expression))

# Set the bounds
bound = np.array(bound)
dmin = bound * 0.1
dmax = bound * 2.0

# Here we use uniform prior
uni_prior = uniform_prior.UniformPrior(dmin, dmax)'''
    return prior_cell


def generate_mdl_inf_fixed_data_cell():
    fixed_data_cell = '''# generate some fixed(observed) data based on default parameters of the model
fixed_data = model.run(**kwargs)'''

    return fixed_data_cell


def generate_mdl_inf_reshape_data_cell():
    reshape_data_cell = '''# Reshape the data to (n_points,n_species,n_timepoints) and remove timepoints array
fixed_data = np.asarray([x.T for x in fixed_data])
fixed_data = fixed_data[:,1:, :]'''

    return reshape_data_cell


def generate_mdl_inf_summary_stats_cell():
    summary_stats_cell = '''# Function to generate summary statistics
summ_func = auto_tsfresh.SummariesTSFRESH()

# Distance
ns = naive_squared.NaiveSquaredDistance()

# Start abc instance
abc = ABC(fixed_data, sim=simulator2, prior_function=uni_prior, summaries_function=summ_func.compute, distance_function=ns)'''

    return summary_stats_cell

