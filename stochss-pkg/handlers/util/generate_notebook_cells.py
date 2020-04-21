#!/usr/bin/env python3


def generate_imports_cell(json_data):
    # Imports cell
    imports = 'import numpy as np\n'
    if json_data['is_spatial']:
        # Spatial
        imports += 'import spatialPy\n'
    else:
        # Non-Spatial
        imports += 'import gillespy2\n'
        imports += 'from gillespy2.core import Model, Species, Reaction, Parameter, RateRule\n'
        algorithm = json_data['simulationSettings']['algorithm']
        algorithm_map = {
                'SSA': '',
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
            fd_string += padding + 'self.add_function_definition(FunctionDefintion(name={0}, function={1}, args={2}))\n'.format(
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
    run_cell = ''
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        run_cell += 'results = model.run('
        
        settings = json_data['simulationSettings']
        algorithm = settings['algorithm']

        # Select Solver
        solver_map = {
                'SSA': '',
                'Tau-Leaping': 'solver=BasicTauLeapingSolver, ',
                'Hybrid-Tau-Leaping': 'solver=BasicTauHybridSolver, ',
                'ODE': 'solver=BasicODESolver, '
                }
        run_cell += '{0}'.format(solver_map[algorithm])

        # Append Settings
        if settings['seed'] == -1:
            settings['seed'] = None

        # GillesPy requires snake case, remap camelCase from json data to
        # snake case for notebook
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
                        'Tau-Leaping':tau_leaping_settings, 
                        'Hybrid-Tau-Leaping':hybrid_settings
                       }
        
        #Parse settings for algorithm
        
        algorithm_settings =  ['{0}={1}'.format(key, val) for key, val in settings_map[algorithm].items()]
        algorithm_settings = ', '.join(algorithm_settings)
        run_cell += algorithm_settings

        run_cell += ')'
    return run_cell


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


def generate_1D_parameter_sweep_class_cell(json_data):
    algorithm = json_data['simulationSettings']['algorithm']
    solver_map = {
                'SSA': '',
                'Tau-Leaping': 'solver=BasicTauLeapingSolver, ',
                'Hybrid-Tau-Leaping': 'solver=BasicTauHybridSolver, ',
                'ODE': 'solver=BasicODESolver, '
                }
    solver_str = solver_map[algorithm]

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
                tmp_results = tmp_model.run({0}number_of_trajectories=c.number_of_trajectories)
                (m,s) = ag([fn(x) for x in tmp_results])
                data[i,0] = m
                data[i,1] = s
            else:
                tmp_result = tmp_model.run({0})
                data[i,0] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(solver_str)

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
    number_of_trajectories = 10
    species_of_interest = "{2}" # ENTER SPECIES OF INTEREST HERE
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = mean_std_of_ensemble
'''.format(model_name, p1['name'], soi)
    return psweep_config_cell


def generate_2D_parameter_sweep_class_cell(json_data):
    algorithm = json_data['simulationSettings']['algorithm']
    solver_map = {
                'SSA': '',
                'Tau-Leaping': 'solver=BasicTauLeapingSolver, ',
                'Hybrid-Tau-Leaping': 'solver=BasicTauHybridSolver, ',
                'ODE': 'solver=BasicODESolver, '
                }
    solver_str = solver_map[algorithm]

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
                    tmp_results = tmp_model.run({0}number_of_trajectories=c.number_of_trajectories)
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = tmp_model.run({0})
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data\n'''.format(solver_str)

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
    number_of_trajectories = 10
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = average_of_ensemble
'''.format(p1['name'], p2['name'], soi, model_name)
    return psweep_config_cell

def generate_sciope_wrapper_cell(json_data):
    settings = json_data['simulationSettings']
    algorithm = settings['algorithm']
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
    sciope_res_conf_cell = '''
#First lets add some appropiate information about the model and features
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
    sciope_explore_model_cell = '''met.explore(dr_method='umap', from_distributed=False)'''
    return sciope_explore_model_cell

def generate_sciope_set_labels_cell():
    sciope_set_labels_cell = '''met.data.user_labels = user_labels'''
    return sciope_set_labels_cell

