#!/usr/bin/env python3


def generate_imports_cell(json_data, is_ssa=False):
    # Imports cell
    imports = 'import numpy as np\n'
    if json_data['is_spatial']:
        # Spatial
        imports += 'import spatialPy\n'
    else:
        # Non-Spatial
        imports += 'import gillespy2\n'
        imports += 'from gillespy2.core import Model, Species, Reaction, Parameter, RateRule, AssignmentRule, FunctionDefinition\n'
        imports += 'from gillespy2.core.events import EventAssignment, EventTrigger, Event\n'
        algorithm = "V-SSA" if is_ssa else json_data['simulationSettings']['algorithm']
        algorithm_map = {
                'SSA': '',
                'V-SSA': 'from gillespy2.solvers.cpp.variable_ssa_c_solver import VariableSSACSolver',
                'Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver',
                'Hybrid-Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver',
                'ODE': 'from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver'
                }
        imports += algorithm_map[algorithm]
    
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

def create_rate_rule_strings(json_data, padding):
    rr_string = ''
    algorithm = json_data['simulationSettings']['algorithm']
    is_stochastic = not algorithm == "ODE"
    if is_stochastic and algorithm == 'Hybrid-Tau-Leaping':
        rr_string += '\n' + padding + '# Rate Rules\n'
        for rr in json_data['rules']:
            if rr['type'] == "Rate Rules":
                rr_string += padding + 'self.add_rate_rule(RateRule(name="{0}", formula="{1}", variable={2}))\n'.format(
                        rr['name'], 
                        rr['expression'], 
                        rr['variable']['name'])
    return rr_string


def create_assignment_rule_string(json_data, padding):
    ar_string = ''
    algorithm = json_data['simulationSettings']['algorithm']
    is_stochastic = not algorithm == "ODE"
    if is_stochastic and algorithm == 'Hybrid-Tau-Leaping':
        ar_string += '\n' + padding + '# Assignment Rules\n'
        for ar in json_data['rules']:
            if ar['type'] == "Assignment Rule":
                ar_string += padding + 'self.add_assignment_rule(AssignmentRule(name={0}, formula={1}, variable={2}))\n'.format(
                        ar['name'],
                        ar['expression'],
                        ar['variable']['name'])
    return ar_string


def create_function_definition_string(json_data, padding):
    fd_string = ''
    algorithm = json_data['simulationSettings']['algorithm']
    is_stochastic = not algorithm == "ODE"
    if is_stochastic and algorithm == 'Hybrid-Tau-Leaping':
        fd_string += '\n' + padding + '# Function Definitions\n'
        for fd in json_data['functionDefinitions']:
            fd_string += padding + 'self.add_function_definition(FunctionDefinition(name={0}, function={1}, args={2}))\n'.format(
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


def generate_run_cell(json_data):
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        settings = json_data['simulationSettings']
        
        run_settings = get_run_settings(settings)

        run_cell = 'results = model.run({0})'.format(run_settings)
        
    return run_cell


def get_run_settings(settings, show_labels=True, is_mdl_inf=False, is_ssa=False):
    algorithm = "V-SSA" if is_ssa else settings['algorithm']

    # Map algorithm for GillesPy2
    solver_map = {"SSA":"",
                  "V-SSA":"solver=solver",
                  "ODE":"solver=BasicODESolver",
                  "Tau-Leaping":"solver=BasicTauLeapingSolver",
                  "Hybrid-Tau-Leaping":"solver=BasicTauHybridSolver"}

    # Map seed for GillesPy2
    if settings['seed'] == -1:
        settings['seed'] = None

    # Map number_of_trajectories for model inference
    if is_mdl_inf and settings['realizations'] < 30:
        settings['realizations'] = 100

    # Map algorithm settings for GillesPy2. GillesPy2 requires snake case, remap camelCase
    ode_settings = { "integrator_options" : str({ "rtol":settings['relativeTol'], "atol":settings['absoluteTol'] }) }
    ssa_settings = { "number_of_trajectories":settings['realizations'], "seed":settings['seed'] }
    tau_leaping_settings = { "number_of_trajectories":settings['realizations'], 
                             "seed":settings['seed'], 
                             "tau_tol":settings['tauTol']}
    hybrid_settings = { "number_of_trajectories":settings['realizations'], 
                        "seed":settings['seed'], 
                        "tau_tol":settings['tauTol'], 
                        "integrator_options" : str({ "rtol":settings['relativeTol'], "atol":settings['absoluteTol'] })
                      }
    settings_map = {'ODE':ode_settings, 
                    'SSA':ssa_settings, 
                    'V-SSA':ssa_settings,
                    'Tau-Leaping':tau_leaping_settings, 
                    'Hybrid-Tau-Leaping':hybrid_settings
                   }

    #Parse settings for algorithm    
    run_settings = [solver_map[algorithm]] if not algorithm == "SSA" else []
    if not show_labels:
        run_settings.append("show_labels=False")
    algorithm_settings =  ['{0}={1}'.format(key, val) for key, val in settings_map[algorithm].items()]
    run_settings.extend(algorithm_settings)
    run_settings = ', '.join(run_settings)
    
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


def generate_1D_parameter_sweep_class_cell(json_data, is_ssa):
    settings = json_data['simulationSettings']

    run_settings = get_run_settings(settings, is_ssa=is_ssa)

    if is_ssa:
        psweep_class_cell ='''class ParameterSweep1D():
    
    def run(c, verbose=False):
        c.verbose = verbose
        fn = c.feature_extraction
        ag = c.ensemble_aggragator
        data = np.zeros((len(c.p1_range),2)) # mean and std
        for i,v1 in enumerate(c.p1_range):
            if verbose: print("running {0}={1}".format(c.p1,v1))
            #if verbose: print("\t{0}".format(["{0}={1},".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))\n'''

        variable_string = "variables={c.p1:v1}" 
        psweep_class_cell += '''            if(c.number_of_trajectories > 1):
                tmp_results = model.run({0}, {1})
                (m,s) = ag([fn(x) for x in tmp_results])
                data[i,0] = m
                data[i,1] = s
            else:
                tmp_result = model.run({0}, {1})
                data[i,0] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(run_settings, variable_string)
    else:
        psweep_class_cell ='''class ParameterSweep1D():
    
    def run(c, verbose=False):
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
                tmp_results = tmp_model.run({0})
                (m,s) = ag([fn(x) for x in tmp_results])
                data[i,0] = m
                data[i,1] = s
            else:
                tmp_result = tmp_model.run({0})
                data[i,0] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(run_settings, variable_string)


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


def generate_1D_psweep_config_cell(json_data, model_name):
    p1 = json_data['parameters'][0]
    soi = json_data['species'][0]['name']
    trajectories = json_data['simulationSettings']['realizations']
    psweep_config_cell = '''# Configuration for the Parameter Sweep
class ParameterSweepConfig(ParameterSweep1D):
    # What class defines the GillesPy2 model
    ps_class = {0}
    model = ps_class()
    # What is the first parameter we will vary
    p1 = "{1}" # ENTER PARAMETER HERE
    p1_min = 0.5 * float(eval(model.get_parameter(p1).expression))
    p1_max = 1.5 * float(eval(model.get_parameter(p1).expression))
    p1_range = np.linspace(p1_min,p1_max,11) # ENTER RANGE FOR PARAMETER HERE
    number_of_trajectories = {3}
    species_of_interest = "{2}" # ENTER SPECIES OF INTEREST HERE
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = mean_std_of_ensemble
'''.format(model_name, p1['name'], soi, trajectories)
    return psweep_config_cell


def generate_2D_parameter_sweep_class_cell(json_data, is_ssa):
    settings = json_data['simulationSettings']
    
    run_settings = get_run_settings(settings, is_ssa=is_ssa)

    if is_ssa:
        psweep_class_cell ='''class ParameterSweep2D():
    
    def run(c, verbose=False):
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
                    tmp_results = model.run({0}, {1})
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = model.run({0}, {1})
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(run_settings, variable_string)
    else:
        psweep_class_cell ='''class ParameterSweep2D():
    
    def run(c, verbose=False):
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
                    tmp_results = tmp_model.run({0})
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = tmp_model.run({0})
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(run_settings)
    

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


def generate_2D_psweep_config_cell(json_data, model_name):
    p1 = json_data['parameters'][0]
    p2 = json_data['parameters'][1]
    soi = json_data['species'][0]['name']
    trajectories = json_data['simulationSettings']['realizations']
    psweep_config_cell = '''# Configuration for the Parameter Sweep
class ParameterSweepConfig(ParameterSweep2D):
    # What class defines the GillesPy2 model
    ps_class = {3}
    model = ps_class()
    p1 = "{0}" # ENTER PARAMETER 1 HERE
    p2 = "{1}" # ENTER PARAMETER 2 HERE
    p1_min = 0.5 * float(eval(model.get_parameter(p1).expression))
    p1_max = 1.5 * float(eval(model.get_parameter(p1).expression))
    p1_range = np.linspace(p1_min,p1_max,11) # ENTER RANGE FOR P1 HERE
    p2_min = 0.5 * float(eval(model.get_parameter(p2).expression))
    p2_max = 1.5 * float(eval(model.get_parameter(p2).expression))
    p2_range = np.linspace(p2_min,p2_max,11) # ENTER RANGE FOR P2 HERE
    species_of_interest = "{2}" # ENTER SPECIES OF INTEREST HERE
    number_of_trajectories = {4}
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = average_of_ensemble
'''.format(p1['name'], p2['name'], soi, model_name, trajectories)
    return psweep_config_cell


def generate_mdl_inf_import_cell():
    import_cell = '''from tsfresh.feature_extraction.settings import MinimalFCParameters
from sciope.utilities.priors import uniform_prior
from sciope.utilities.summarystats import auto_tsfresh
from sciope.utilities.distancefunctions import naive_squared
from sciope.inference.abc_inference import ABC
from sklearn.metrics import mean_absolute_error
from dask.distributed import Client'''

    return import_cell


def generate_mdl_inf_simulator_cell(json_data):
    settings = json_data['simulationSettings']
    
    run_settings = get_run_settings(settings, show_labels=False)

    simulator_cell = '''# Define simulator function
def set_model_parameters(params, model):
    """para,s - array, need to have the same order as
    model.listOfParameters """
    for e, (pname, p) in enumerate(model.listOfParameters.items()):
        model.get_parameter(pname).set_expression(params[e])
    return model

# Here we use the GillesPy2 Solver
def simulator(params, model):
    model_update = set_model_parameters(params, model)
    num_trajectories = 1

    res = model_update.run({0})
    tot_res = np.asarray([x.T for x in res]) # reshape to (N, S, T)
    tot_res = tot_res[:,1:, :] # should not contain timepoints

    return tot_res

# Wrapper, simulator function to abc should should only take one argument (the parameter point)
def simulator2(x):
    return simulator(x, model=model)'''.format(run_settings)
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


def generate_mdl_inf_fixed_data_cell(json_data):
    settings = json_data['simulationSettings']

    run_settings = get_run_settings(settings, show_labels=False, is_mdl_inf=True)

    fixed_data_cell = '''# generate some fixed(observed) data based on default parameters of the model
# the minimum number of trajectoies needs to be at least 30
fixed_data = model.run({0})'''.format(run_settings)

    return fixed_data_cell


def generate_mdl_inf_reshape_data_cell():
    reshape_data_cell = '''# Reshape the dat to (n_points,n_species,n_timepoints) and remove timepoints array
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

