#!/usr/bin/env python3
import json
import nbformat
from nbformat import v4 as nbf
from os import path
from .rename import get_unique_file_name
from json.decoder import JSONDecodeError
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError

# imports for modal notebook
from .generate_notebook_cells import generate_imports_cell, generate_model_cell, generate_configure_simulation_cell, get_algorithm
# imports for parameter sweep workflow
from .generate_notebook_cells import generate_feature_extraction_cell, generate_average_aggregate_cell, generate_2D_parameter_sweep_class_cell, generate_2D_psweep_config_cell, generate_parameter_sweep_run_cell
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver

def convert_to_2d_psweep_nb(_model_path):
    user_dir = '/home/jovyan'

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    name = file.split('.')[0].replace('-', '_')
    dest_path = model_path.split(file)[0]

    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
    except FileNotFoundError as err:
        raise ModelNotFoundError('Could not find model file: ' + str(err))
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The model is not JSON decodable: "+str(err))

    is_ssa_c = get_best_ssa_solver().name == "SSACSolver"

    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        cells.append(nbf.new_code_cell(generate_imports_cell(json_data, is_ssa_c=is_ssa_c)))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(name)))
        if get_algorithm(json_data, is_ssa_c) == "V-SSA":
            # Instantiate Solver Cell
            cells.append(nbf.new_code_cell('solver = VariableSSACSolver(model=model)'))
        # Configure Simulation Cell
        cells.append(nbf.new_code_cell(generate_configure_simulation_cell(json_data, is_ssa_c)))
        # Feature Extraction cell
        cells.append(nbf.new_code_cell(generate_feature_extraction_cell()))
        # Feature Aggregate cell
        cells.append(nbf.new_code_cell(generate_average_aggregate_cell()))
        # Parameter Sweep Class cell
        cells.append(nbf.new_code_cell(generate_2D_parameter_sweep_class_cell(json_data, is_ssa_c)))
        # Parameter Sweep Config cell
        cells.append(nbf.new_code_cell(generate_2D_psweep_config_cell(json_data, name)))
    except KeyError as err:
        raise JSONFileNotModelError("The JSON file is not formatted as a StochSS model "+str(err))
    # Parameter Sweep Execution cell
    cells.append(nbf.new_code_cell(generate_parameter_sweep_run_cell(get_algorithm(json_data, is_ssa_c))))
    # Parameter Sweet Plot Cell
    cells.append(nbf.new_code_cell('ps.plot()'))
    # Parameter Sweet Plotly Cell
    cells.append(nbf.new_code_cell('ps.plotplotly()'))
    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}2dParamSweep.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    return dest_file.replace(user_dir+'/', "")

