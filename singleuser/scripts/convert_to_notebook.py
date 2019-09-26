#!/usr/bin/env python3
import sys
import json
import nbformat
from nbformat import v4 as nbf

def generate_imports_cell(json_data):
    # Imports cell
    imports = 'import numpy as np\n'
    if json_data['is_spatial']:
        # Spatial
        imports += 'import spatialPy\n'
    else:
        # Non-Spatial
        imports += 'import gillespy2\n'
        imports += 'from gillespy2.core import Model, Species, Reaction, Parameter\n'
        if json_data['simulationSettings']['is_stochastic']:
            # Stochastic, use specified stochastic solver
            algorithm = json_data['simulationSettings']['stochasticSettings']['algorithm']
            algorithm_map = {
                    'SSA': 'from gillespy2.solvers.cpp.ssa_c_solver import SSACSolver',
                    'Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_leaping_solver import BasicTauLeapingSolver',
                    'Hybrid-Tau-Leaping': 'from gillespy2.solvers.numpy.basic_tau_hybrid_solver import BasicTauHybridSolver'
                    }
            imports += algorithm_map[algorithm]
        else:
            # Deterministic, use ODE
            imports += 'from gillespy2.solvers.numpy.basic_ode_solver import BasicODESolver'

    return imports

def create_parameter_strings(json_data, padding):
    param_string = '\n' + padding + '# Parameters\n'
    for param in json_data['parameters']:
        param_string += padding + 'self.add_parameter(Parameter(name="{0}", expression={1}))\n'.format(
                param['name'], 
                param['value'])
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
        for reactant in reaction['reactants']:
            reactants[reactant['specie']['name']] = reactant['ratio']
        for product in reaction['products']:
            products[product['specie']['name']] = product['ratio']
        reaction_string += padding + 'self.add_reaction(Reaction(name="{0}", reactants={1}, products={2}, rate=self.listOfParameters["{3}"]))\n'.format(
                reaction['name'],
                str(reactants),
                str(products),
                reaction['rate']['name'])

    return reaction_string
def create_rate_rule_strings(json_data, padding):
    rate_rules_string = '\n' + padding + '# Rate Rules\n'
    # TODO
    return rate_rules_string

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
                json_data['simulationSettings']['volume'])

        model_cell += create_parameter_strings(json_data, padding)
        model_cell += create_species_strings(json_data, padding)
        model_cell += create_reaction_strings(json_data, padding)
        #Create Rate Rules for Hybrid only
        if json_data['simulationSettings']['is_stochastic']:
            if json_data['simulationSettings']['stochasticSettings']['algorithm'] == 'Hybrid-Tau-Leaping':
                model_cell += create_rate_rule_strings(json_data, padding)

        model_cell += '\n' + padding + '# Timespan\n'
        duration = json_data['simulationSettings']['endSim']
        model_cell += padding + 'self.timespan(np.linspace(0, {0}, {1}))'.format(
                duration,
                round(duration/json_data['simulationSettings']['timeStep']))
            
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
        if json_data['simulationSettings']['is_stochastic']:
            settings = json_data['simulationSettings']['stochasticSettings']
            # Stochastic
            algorithm = settings['algorithm']

            # Select Solver
            solver_map = {
                    'SSA': 'SSACSolver',
                    'Tau-Leaping': 'BasicTauLeapingSolver',
                    'Hybrid-Tau-Leaping': 'BasicTauHybridSolver'
                    }
            run_cell += 'solver={0}'.format(solver_map[algorithm])

            # Append Settings
            settings_map = {
                    'SSA': 'ssaSettings',
                    'Tau-Leaping': 'tauSettings',
                    'Hybrid-Tau-Leaping': 'hybridSettings'
                    }
            if settings[settings_map[algorithm]]['seed'] == -1:
                settings[settings_map[algorithm]]['seed'] = None
            algorithm_settings =  [', {0}={1}'.format(key, val) for key, val in settings[settings_map[algorithm]].items()]
            for item in algorithm_settings:
                run_cell += item

        else:
            # Deterministic
            settings = json_data['simulationSettings']['deterministicSettings']
            algorithm_settings =  [', {0}={1}'.format(key, val) for key, val in settings.items()]
            for item in algorithm_settings:
                run_cell += item

        run_cell += ')'
    return run_cell

def convertToNotebook(_model_path):

    model_path = '/home/jovyan/{0}'.format(_model_path)
    name = model_path.split('/').pop().split('.')[0]
    dest_path = model_path.split(name)[0]

    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
    except:
        print('File Not Found')

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
    cells.append(nbf.new_code_cell('results.plot()'))

    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = '{0}{1}.ipynb'.format(dest_path, name)
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    print('{0} successfully created'.format(dest_file))

    return dest_file


if __name__ == "__main__":

        model_path = sys.argv[1]
        convertToNotebook(model_path)
        
