#!/usr/bin/env python3
import json
import nbformat
import traceback
import string
from nbformat import v4 as nbf
from os import path
from .rename import get_unique_file_name, get_file_name
from .run_model import ModelFactory
from json.decoder import JSONDecodeError
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError

# imports for modal notebook
from .generate_notebook_cells import generate_imports_cell, generate_model_cell, generate_configure_simulation_cell, get_algorithm
# imports for parameter sweep workflow
from .generate_notebook_cells import generate_feature_extraction_cell, generate_average_aggregate_cell, generate_2D_parameter_sweep_class_cell, generate_2D_psweep_config_cell, generate_parameter_sweep_run_cell


def get_class_name(name):
    name = name.replace(" ", "")

    for char in string.punctuation:
        if char in name:
            name = name.replace(char, "")

    leading_char = name[0]
    if leading_char in string.digits:
        name = "M{}".format(name)
    elif leading_char in string.ascii_lowercase:
        name = name.replace(leading_char, leading_char.upper(), 1)

    return name


def convert_to_2d_psweep_nb(_model_path, name=None, settings=None, dest_path=None):
    user_dir = '/home/jovyan'

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    if name is None:
        name = get_file_name(file)
    class_name = get_class_name(name)
    if dest_path is None:
        dest_path = model_path.split(file)[0]

    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
            json_data['name'] = name
    except FileNotFoundError as err:
        raise ModelNotFoundError('Could not find model file: ' + str(err), traceback.format_exc())
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The model is not JSON decodable: "+str(err), traceback.format_exc())

    is_ode = json_data['defaultMode'] == "continuous" if settings is None else settings['simulationSettings']['algorithm'] == "ODE"
    gillespy2_model = ModelFactory(json_data, is_ode).model

    if settings is None or settings['simulationSettings']['isAutomatic']:
        algorithm, solv_name = get_algorithm(gillespy2_model, is_psweep=True)
    else:
        algorithm, solv_name = get_algorithm(gillespy2_model, is_psweep=True, algorithm=settings['simulationSettings']['algorithm'])
    
    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        if settings is None:
            import_cell = generate_imports_cell(json_data, algorithm, solv_name)
            config_cell = generate_configure_simulation_cell(json_data, algorithm, solv_name, is_psweep=True)
            psweep_config_cell = generate_2D_psweep_config_cell(json_data, class_name)
        else:
            import_cell = generate_imports_cell(json_data, algorithm, solv_name, settings=settings['simulationSettings'])
            config_cell = generate_configure_simulation_cell(json_data, algorithm, solv_name, is_psweep=True, settings=settings['simulationSettings'])
            psweep_config_cell = generate_2D_psweep_config_cell(json_data, class_name, settings=settings)
        cells.append(nbf.new_code_cell(import_cell))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, class_name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(class_name)))
        if solv_name == "VariableSSACSolver":
            # Instantiate Solver Cell
            cells.append(nbf.new_code_cell('solver = model.get_best_solver()\nsolver = solver(model=model)'))
        # Configure Simulation Cell
        cells.append(nbf.new_code_cell(config_cell))
        # Feature Extraction cell
        cells.append(nbf.new_code_cell(generate_feature_extraction_cell()))
        # Feature Aggregate cell
        cells.append(nbf.new_code_cell(generate_average_aggregate_cell()))
        # Parameter Sweep Class cell
        cells.append(nbf.new_code_cell(generate_2D_parameter_sweep_class_cell(json_data, algorithm)))
        # Parameter Sweep Config cell
        cells.append(nbf.new_code_cell(psweep_config_cell))
    except KeyError as err:
        raise JSONFileNotModelError("The JSON file is not formatted as a StochSS model "+str(err), traceback.format_exc())
    # Parameter Sweep Execution cell
    cells.append(nbf.new_code_cell(generate_parameter_sweep_run_cell(algorithm, settings)))
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

    return {"Message":'{0} successfully created'.format(dest_file),"FilePath":dest_file.replace(user_dir+'/', ""),"File":dest_file.split('/').pop()}

