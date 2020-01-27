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
    is_stochastic = not json_data['simulationSettings']['algorithm'] == "ODE"
    algorithm = json_data['simulationSettings']['algorithm']
    if is_stochastic and algorithm == 'Hybrid-Tau-Leaping':
        rr_string += '\n' + padding + '# Rate Rules\n'
        for rr in json_data['rules']:
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
        # Stochastic
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

def convertToNotebook(_model_path):

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    name = file.split('.')[0].replace('-', '_')
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

    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}.ipynb'.format(name), dest_path)[0]
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
        
