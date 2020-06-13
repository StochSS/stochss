#!/usr/bin/env python3
import json
from json.decoder import JSONDecodeError
import nbformat
from nbformat import v4 as nbf
from os import path
from .run_model import ModelFactory
from .rename import get_unique_file_name
from .generate_notebook_cells import *
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError


def convert_to_sciope_me(_model_path, settings=None):
    user_dir = '/home/jovyan'

    model_path = path.join(user_dir,_model_path)
    file = model_path.split('/').pop()
    name = file.split('.')[0].replace('-', '_')
    dest_path = model_path.split(file)[0]
    
    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
            json_data['name'] = name
    except FileNotFoundError as e:
        raise ModelNotFoundError('Could not read the file: ' + str(e))
    except JSONDecodeError as e:
        raise ModelNotJSONFormatError('The data is not JSON decobable: ' + str(e))

    is_ode = json_data['defaultMode'] == "continuous" if settings is None else settings['simulationSettings']['algorithm'] == "ODE"
    gillespy2_model = ModelFactory(json_data, is_ode).model
    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        cells.append(nbf.new_code_cell(
                    generate_imports_cell(json_data, gillespy2_model,
                    interactive_backend=True)))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(name)))
        # Sciope Wrapper Cell
        cells.append(nbf.new_code_cell(generate_sciope_wrapper_cell(json_data,
        gillespy2_model)))
        # Sciope lhc Cell
        cells.append(nbf.new_code_cell(generate_sciope_lhc_cell()))
        # Sciope stochmet Cell
        cells.append(nbf.new_code_cell(generate_sciope_stochmet_cell()))
        # Sciope Parameter Sweep Run Cell
        cells.append(nbf.new_code_cell(generate_sciope_psweep_run_cell()))
        # Sciope Configure MET DATA
        cells.append(nbf.new_code_cell(generate_sciope_res_conf_cell()))
        # Sciope MET Explore Cell
        cells.append(nbf.new_code_cell(generate_sciope_met_explore_cell()))
        # Sciope Supervised Training Cell
        cells.append(nbf.new_code_cell(generate_sciope_supervised_train_cell()))
        # Sciope Map Labels Cell
        cells.append(nbf.new_code_cell(generate_sciope_map_labels_cell()))
        # Sciope Explore Model Cell
        cells.append(nbf.new_code_cell(generate_sciope_explore_model_cell()))
        # Sciope Set Labels Cell
        cells.append(nbf.new_code_cell(generate_sciope_set_labels_cell()))
    except KeyError as err:
        raise JSONFileNotModelError("Could not convert your model {}: {}".format(json_data, str(err)))
    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}_Sciope_ME.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    return {"Message":'{0} successfully created'.format(dest_file),"FilePath":dest_file.replace(user_dir+'/', ""),"File":dest_file.split('/').pop()}
