#!/usr/bin/env python3
import json
import nbformat
import traceback
import string
from os import path
from nbformat import v4 as nbf
from json.decoder import JSONDecodeError
from .run_model import ModelFactory
from .rename import get_unique_file_name, get_file_name
from .generate_notebook_cells import *
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError


workdir = '/home/jovyan/stochss'

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


def convert_to_sciope_me(_model_path, settings=None, dest_path=None):

    model_path = path.join(workdir,_model_path)
    file = model_path.split('/').pop()
    name = get_file_name(file)
    class_name = get_class_name(name)
    if dest_path is None:
        dest_path = model_path.split(file)[0]
    
    # Collect .mdl Data
    try:
        with open(model_path, 'r') as json_file:
            json_data = json.loads(json_file.read())
            json_data['name'] = name
    except FileNotFoundError as e:
        raise ModelNotFoundError('Could not read the file: ' + str(e), traceback.format_exc())
    except JSONDecodeError as e:
        raise ModelNotJSONFormatError('The data is not JSON decobable: ' + str(e), traceback.format_exc())

    is_ode = json_data['defaultMode'] == "continuous" if settings is None else settings['simulationSettings']['algorithm'] == "ODE"
    gillespy2_model = ModelFactory(json_data, is_ode).model
    
    if settings is None or settings['simulationSettings']['isAutomatic']:
        algorithm, solv_name = get_algorithm(gillespy2_model)
    else:
        algorithm, solv_name = get_algorithm(gillespy2_model, algorithm=settings['simulationSettings']['algorithm'])

    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        cells.append(nbf.new_code_cell(
                    generate_imports_cell(json_data, algorithm, solv_name,
                    interactive_backend=True)))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, class_name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(class_name)))
        # Sciope Wrapper Cell
        cells.append(nbf.new_code_cell(generate_sciope_wrapper_cell(json_data,
                    algorithm, solv_name)))
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
        raise JSONFileNotModelError("Could not convert your model {}: {}".format(json_data, str(err)), traceback.format_exc())
    # Append cells to worksheet
    nb = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}_Sciope_ME.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as f:
        nbformat.write(nb, f, version=4)
    f.close()

    return {"Message":'{0} successfully created'.format(dest_file),"FilePath":dest_file.replace(workdir+'/', ""),"File":dest_file.split('/').pop()}
