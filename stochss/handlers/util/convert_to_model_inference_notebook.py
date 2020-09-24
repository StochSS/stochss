#!/usr/bin/env python3
import json
from os import path
from json.decoder import JSONDecodeError
import traceback
import string
import nbformat
from nbformat import v4 as nbf
from .rename import get_unique_file_name, get_file_name
from .run_model import ModelFactory
from .stochss_errors import ModelNotFoundError, ModelNotJSONFormatError, JSONFileNotModelError

# imports for modal notebook
from .generate_notebook_cells import generate_imports_cell, generate_model_cell, \
                                     generate_configure_simulation_cell
# imports for model inference workflow
from .generate_notebook_cells import generate_mdl_inf_simulator_cell, generate_mdl_inf_prior_cell, \
                                     generate_mdl_inf_fixed_data_cell, \
                                     generate_mdl_inf_reshape_data_cell
from .generate_notebook_cells import generate_mdl_inf_summary_stats_cell, \
                                     generate_mdl_inf_import_cell, \
                                     get_algorithm


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


def convert_to_mdl_inference_nb(model_path, name=None, settings=None, dest_path=None):
    user_dir = "/home/jovyan"

    full_path = path.join(user_dir, model_path)
    file = full_path.split('/').pop()
    if name is None:
        name = get_file_name(file)
    class_name = get_class_name(name)
    if dest_path is None:
        dest_path = full_path.split(file)[0]

    # Collect .mdl Data
    try:
        with open(full_path, 'r') as json_file:
            json_data = json.load(json_file)
            json_data['name'] = name
    except FileNotFoundError as err:
        raise ModelNotFoundError('Could not find model file: ' + str(err), traceback.format_exc())
    except JSONDecodeError as err:
        raise ModelNotJSONFormatError("The model is not JSON decodable: "+str(err),
                                      traceback.format_exc())

    is_ode = (json_data['defaultMode'] == "continuous"
              if settings is None else settings['simulationSettings']['algorithm'] == "ODE")
    gillespy2_model = ModelFactory(json_data, is_ode).model

    if settings is None or settings['simulationSettings']['isAutomatic']:
        algorithm, solv_name = get_algorithm(gillespy2_model)
    else:
        algorithm, solv_name = get_algorithm(gillespy2_model,
                                             algorithm=settings['simulationSettings']['algorithm'])

    # Create new notebook
    cells = []
    # Create Markdown Cell with name
    cells.append(nbf.new_markdown_cell('# {0}'.format(name)))
    try:
        # Create imports cell
        if settings is None:
            import_cell = generate_imports_cell(json_data, algorithm, solv_name)
            config_cell = generate_configure_simulation_cell(json_data, algorithm,
                                                             solv_name, is_mdl_inf=True)
        else:
            import_cell = generate_imports_cell(json_data, algorithm, solv_name,
                                                settings=settings['simulationSettings'])
            config_cell = generate_configure_simulation_cell(json_data, algorithm,
                                                             solv_name, is_mdl_inf=True,
                                                             settings=settings['simulationSettings'])
        cells.append(nbf.new_code_cell(import_cell))
        # Create Model Cell
        cells.append(nbf.new_code_cell(generate_model_cell(json_data, class_name)))
        # Instantiate Model Cell
        cells.append(nbf.new_code_cell('model = {0}()'.format(class_name)))
        if settings is not None and not settings['isAutomatic'] and solv_name == "SSACSolver":
            # Instantiate Solver Cell
            cells.append(nbf.new_code_cell('solver = SSACSolver(model=model)'))
        # Configure Simulation Cell
        cells.append(nbf.new_code_cell(config_cell))
        # Create model inference import cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_import_cell()))
        # Create simulator cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_simulator_cell()))
        # Create prior cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_prior_cell()))
        # Create fixed data cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_fixed_data_cell()))
        # Create reshape data cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_reshape_data_cell()))
        # Create summary statistics cell
        cells.append(nbf.new_code_cell(generate_mdl_inf_summary_stats_cell()))
        # Create local dask client cell
        cells.append(nbf.new_code_cell("c = Client()\nc"))
        # Create compute fixed mean cell
        cfmc = "# First compute the fixed(observed) mean\nabc.compute_fixed_mean(chunk_size=2)"
        cells.append(nbf.new_code_cell(cfmc))
        # Create run model inference cell
        rmic = "res = abc.infer(num_samples=100, batch_size=10, chunk_size=2)"
        cells.append(nbf.new_code_cell(rmic))
        # Create absolute error cell
        aec = 'mae_inference = mean_absolute_error(bound, abc.results["inferred_parameters"])'
        cells.append(nbf.new_code_cell(aec))
    except KeyError as err:
        raise JSONFileNotModelError("The JSON file is not formatted as a StochSS model "+str(err),
                                    traceback.format_exc())

    # Append cells to worksheet
    notebook = nbf.new_notebook(cells=cells)

    # Open and write to file
    dest_file = get_unique_file_name('{}SciopeMI.ipynb'.format(name), dest_path)[0]
    with open(dest_file, 'w') as nb_file:
        nbformat.write(notebook, nb_file, version=4)
    nb_file.close()

    return {"Message":'{0} successfully created'.format(dest_file),
            "FilePath":dest_file.replace(user_dir+'/', ""), "File":dest_file.split('/').pop()}
