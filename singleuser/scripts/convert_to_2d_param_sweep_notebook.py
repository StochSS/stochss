#!/usr/bin/env python3
import sys
import ast
import json
import nbformat
import argparse
from nbformat import v4 as nbf
from os import path
from rename import get_unique_file_name


user_dir = '/home/jovyan'


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
                'ODE': 'from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver',
                'Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver',
                'Hybrid-Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver'
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
    is_stochastic = not json_data['simulationSettings']['algorithm'] == 'ODE'
    algorithm = json_data['simulationSettings']['algorithm']
    if is_stochastic and algorithm == 'Hybrid-Tau-Leaping':
        rr_string += '\n' + padding + '# Rate Rules\n'
        for rr in json_data['rateRules']:
            if rr['type'] == "Rate Rules":
                rr_string += padding + 'self.add_rate_rule(RateRule(name="{0}", expression="{1}", species=self.listOfSpecies["{2}"]))\n'.format(
                        rr['name'], 
                        rr['expression'], 
                        rr['variable']['name'])
    return rr_string

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

def generate_feature_ext_and_aggregate_cell():
    feature_and_aggregate_cell = '''# Feature extraction function.  What value(s) do you want to extract
# from the simulation trajectory

def population_at_last_timepoint(c,res):
    if c.verbose: print('population_at_last_timepoint {0}={1}'.format(c.species_of_interest,result1[c.species_of_interest][-1]))
    return res[c.species_of_interest][-1]

    # Aggregation function, How to we combine the values from multiple 
    # trajectores

def average_of_ensemble(c,data):
    a=np.average(data)
    if c.verbose: print('average_of_ensemble = {0}'.format(a))
    return a'''
    return feature_and_aggregate_cell

def generate_parameter_sweep_class_cell():
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
                #if verbose: print("\t{0}".format(["{0}={1}, ".format(k,v.value) for k,v in tmp_model.listOfParameters.items()]))
                if(c.number_of_trajectories > 1):
                    tmp_results = tmp_model.run(number_of_trajectories=c.number_of_trajectories)
                    data[i,j] = ag([fn(x) for x in tmp_results])
                else:
                    tmp_result = tmp_model.run()
                    data[i,j] = c.feature_extraction(tmp_result)
        c.data = data

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
    '''
    return psweep_class_cell

def generate_psweep_config_cell(json_data, model_name):
    p1 = json_data['parameters'][0]
    p2 = json_data['parameters'][1]
    soi = json_data['species'][0]['name']
    psweep_config_cell = '''# Configuration for the Parameter Sweep
class ParameterSweepConfig(ParameterSweep2D):
    p1 = "{0}" # ENTER PARAMETER 1 HERE
    p2 = "{1}" # ENTER PARAMETER 2 HERE
    p1_range = np.linspace({2},{3},11) # ENTER RANGE FOR P1 HERE
    p2_range = np.linspace({4},{5},11) # ENTER RANGE FOR P2 HERE
    species_of_interest = "{6}" # ENTER SPECIES OF INTEREST HERE
    number_of_trajectories = 10
    # What feature of the simulation are we examining
    feature_extraction = population_at_last_timepoint
    # for number_of_trajectories > 1: how do we aggreggate the values
    ensemble_aggragator = average_of_ensemble
    # What class defines the GillesPy2 model
    ps_class = {7}
'''.format(p1['name'], p2['name'], .5*float(eval(p1['expression'])), 1.5*float(eval(p1['expression'])),
                .5*float(eval(p2['expression'])), 1.5*float(eval(p2['expression'])), soi, model_name)
    return psweep_config_cell

def convertToNotebook(_model_path):

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    name = file.split('.')[0]
    dest_path = model_path.split(file)[0]
    
    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            # json_data = ast.literal_eval(json_file.read())
            json_data = json.loads(json_file.read())
    except Exception as e:
        print('Could not read file: ' + e)

    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    # Create imports cell
    cells.append(nbf.new_code_cell(generate_imports_cell(json_data)))
    # Create Model Cell
    cells.append(nbf.new_code_cell(generate_model_cell(json_data, name)))
    # Instantiate Model Cell
    cells.append(nbf.new_code_cell('model = {0}()'.format(name)))
    # Model Run Cell
    cells.append(nbf.new_code_cell(generate_run_cell(json_data)))
    # Plotting Cell
    cells.append(nbf.new_code_cell('results.plotplotly()'))
    # Feature Extraction / Aggregate cell
    cells.append(nbf.new_code_cell(generate_feature_ext_and_aggregate_cell()))
    # Parameter Sweep Class cell
    cells.append(nbf.new_code_cell(generate_parameter_sweep_class_cell()))
    # Parameter Sweep Config cell
    cells.append(nbf.new_code_cell(generate_psweep_config_cell(json_data, name)))
    # Parameter Sweep Execution cell
    cells.append(nbf.new_code_cell('ps = ParameterSweepConfig()\n%time ps.run()'))
    # Parameter Sweet Plot Cell
    cells.append(nbf.new_code_cell('ps.plot()'))
    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}2dParamSweep.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    print('{0} successfully created'.format(dest_file))

    return dest_file


def get_parsed_args():
    parser = argparse.ArgumentParser(description="Convert a GillesPy2 model into a Jupyter Notebook.")
    parser.add_argument('model_path', help='The path from the user directory to the model being converted.')
    return parser.parse_args()


if __name__ == "__main__":

        args = get_parsed_args()
        model_path = args.model_path
        convertToNotebook(model_path)
        
