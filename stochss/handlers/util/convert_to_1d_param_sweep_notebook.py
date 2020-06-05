#!/usr/bin/env python3
import json
import nbformat
from nbformat import v4 as nbf
from os import path
from .rename import get_unique_file_name
from .run_model import ModelFactory
from json.decoder import JSONDecodeError
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError

# imports for modal notebook
from .generate_notebook_cells import generate_imports_cell, generate_model_cell, generate_configure_simulation_cell, get_algorithm
# imports for parameter sweep workflow
from .generate_notebook_cells import generate_feature_extraction_cell, generate_mean_std_aggregate_cell, generate_1D_parameter_sweep_class_cell, generate_1D_psweep_config_cell, generate_parameter_sweep_run_cell
from gillespy2.solvers.auto.ssa_solver import get_best_ssa_solver

def convert_to_1d_psweep_nb(_model_path, name=None, settings=None):
    user_dir = '/home/jovyan'

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    if name is None:
        name = file.split('.')[0].replace('-', '_')
    dest_path = model_path.split(file)[0]
    
    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
            json_data['name'] = name
    except FileNotFoundError as err:
        raise ModelNotFoundError('Could not find model file: ' + str(err))
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The model is not JSON decodable: "+str(err))
        
    is_ode = json_data['defaultMode'] == "continuous" if settings is None else settings['algorithm'] == "ODE"
    gillespy2_model = ModelFactory(json_data, is_ode).model

    is_ssa_c = gillespy2_model.get_best_solver().name == "VariableSSACSolver"
    
    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        import_cell = generate_imports_cell(json_data, is_ssa_c) if settings is None else generate_imports_cell(json_data, is_ssa_c, settings=settings['simulationSettings'])
        cells.append(nbf.new_code_cell(import_cell))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(name)))
        algorithm = get_algorithm(json_data, is_ssa_c) if settings is None or settings['simulationSettings']['isAutomatic'] else get_algorithm(json_data, is_ssa_c, algorithm=settings['simulationSettings']['algorithm'])
        if is_ssa_c:
            # Instantiate Solver Cell
            cells.append(nbf.new_code_cell('solver = model.get_best_solver()\nsolver = solver(model=model)'))
        # Configure Simulation Cell
        config_cell = generate_configure_simulation_cell(json_data, is_ssa_c) if settings is None else generate_configure_simulation_cell(json_data, is_ssa_c, settings=settings['simulationSettings'])
        cells.append(nbf.new_code_cell(config_cell))
        # Feature Extraction cell
        cells.append(nbf.new_code_cell(generate_feature_extraction_cell()))
        # Feature Aggregate cell
        cells.append(nbf.new_code_cell(generate_mean_std_aggregate_cell()))
        # Parameter Sweep Class cell
        cells.append(nbf.new_code_cell(generate_1D_parameter_sweep_class_cell(json_data, algorithm)))
        # Parameter Sweep Config cell
        psweep_config_cell = generate_1D_psweep_config_cell(json_data, name) if settings is None else generate_1D_psweep_config_cell(json_data, name, settings=settings)
        cells.append(nbf.new_code_cell(psweep_config_cell))
    except KeyError as err:
        raise JSONFileNotModelError("The JSON file is not formatted as a StochSS model "+str(err))
    # Parameter Sweep Execution cell
    cells.append(nbf.new_code_cell(generate_parameter_sweep_run_cell(get_algorithm(json_data, is_ssa_c), settings)))
    # Parameter Sweet Plot Cell
    cells.append(nbf.new_code_cell('ps.plot()'))
    # Parameter Sweet Plotly Cell
    cells.append(nbf.new_code_cell('ps.plotplotly()'))
    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{0}1dParamSweep.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    return {"Message":'{0} successfully created'.format(dest_file),"FilePath":dest_file.replace(user_dir+'/', ""),"File":dest_file.split('/').pop()}

