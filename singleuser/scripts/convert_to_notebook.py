#!/usr/bin/env python3
import sys
import json
from IPython.nbformat import current as nbf

def generate_imports_cell(json_data):
    # Imports cell
    imports = ''
    if json_data['is_spatial']:
        # Spatial
        imports += 'import spatialPy\n'
    else:
        # Non-Spatial
        imports += 'import gillespy2\n'
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

def generate_model_cell(json_data):
    model_cell = ''
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        print('TODO')

    return model_cell


def generate_run_cell(json_data):
    print('generating run cell...')
    run_cell = ''
    if json_data['is_spatial']:
        # Spatial
        raise Exception('Spatial not yet implemented.')
    else:
        # Non-Spatial
        print('non-spatial detected')
        run_cell += 'results = model.run('
        if json_data['simulationSettings']['is_stochastic']:
            settings = json_data['simulationSettings']['stochasticSettings']
            # Stochastic
            algorithm = settings['algorithm']
            algorithm_map = {
                    'SSA': 'ssaSettings',
                    'Tau-Leaping': 'tauSettings',
                    'Hybrid-Tau-Leaping': 'hybridSettings'
                    }
            algorithm_settings =  [', {0}={1}'.format(key, val) for key, val in settings[algorithm_map[algorithm]].items()]
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

def convertToNotebook(modelPath):
    # Collect .mdl Data
    with open(modelPath, 'r') as json_file:
        json_data = json.loads(json_file.read())
    name = modelPath.split('.mdl')[0]
    # Create new notebook
    cells = []
    nb = nbf.new_notebook()
    # Create imports cell
    cells.append(nbf.new_code_cell(generate_imports_cell(json_data)))
    # Create Model Cell
    cells.append(nbf.new_code_cell(generate_model_cell(json_data)))
    # Model Run Cell
    cells.append(nbf.new_code_cell(generate_run_cell(json_data)))

    nb['worksheets'].append(nbf.new_worksheet(cells=cells))

    # Open and write to file
    dest_file = '{0}.ipynb'.format(name)
    print(dest_file)
    with open(dest_file, 'w') as f:
        nbf.write(nb, f, 'ipynb')
    f.close()


if __name__ == "__main__":
        modelPath = sys.argv[1]
        convertToNotebook(modelPath)
        
