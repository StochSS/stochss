import os
import json
import copy
import shutil
import zipfile
import tempfile
import libsedml
import subprocess
import numpy as np
import xml.etree.ElementTree as ET

from .convert_sbml_to_model import convert_to_gillespy_model, convert_to_stochss_model, convert_sbml_to_model
from .parameter_sweep import ParameterSweep
from .run_model import GillesPy2Workflow
from .run_workflow import save_new_workflow


def get_outputs(experiment, data_generators):
    outputs = {}
    for i in range(experiment.getNumOutputs()):
        output = experiment.getOutput(i)
        if output.getTypeCode() == libsedml.SEDML_OUTPUT_PLOT2D:
            curves = get_2d_output_curves(output, data_generators)
            outputs[output.getId()] = curves
    return outputs


def get_2d_output_curves(output, data_generators):
    curves = []
    for i in range(output.getNumCurves()):
        curve = output.getCurve(i)
        curves.append(data_generators[curve.getYDataReference()])
    return curves


def get_data_generators(experiment):
    data_generators = {}
    for i in range(experiment.getNumDataGenerators()):
        data_generator = experiment.getDataGenerator(i)
        data_generators[data_generator.getId()] = libsedml.formulaToString(data_generator.getMath())
    return data_generators


def get_tasks(experiment):
    tasks = {}
    for i in range(experiment.getNumTasks()):
        task = experiment.getTask(i)
        if task.getTypeCode() == libsedml.SEDML_TASK:
            tasks[task.getId()] = {"model":task.getModelReference(),"simulation":task.getSimulationReference(), "type":"gillespy"}
    return tasks


def get_models(experiment, parent_path):
    models = {}

    for i in range(experiment.getNumModels()):
        mdl = experiment.getModel(i)

        if mdl.getLanguage().endswith(":sbml"):
            source = mdl.getSource()

            if source.endswith(".xml") or source.endswith(".sbml"):
                source = os.path.join(parent_path, source.replace(".\\", ""))
                template = get_model_template()
                
                gillespy_model, gillespy_errors = convert_to_gillespy_model(source)
                errors = list(map(lambda error: error[0], gillespy_errors))
                stochss_model, msg, stochss_errors, path = convert_to_stochss_model(template, gillespy_model, source)
                
                if mdl.getNumChanges() and stochss_model is not None:
                    process_model_changes(mdl, stochss_model)
                    
                model = {"model":stochss_model, "errors":errors}
            elif source in models.keys():
                stochss_model = copy.deepcopy(models[source]['model'])
                errors = copy.deepcopy(models[source]['errors'])

                if mdl.getNumChanges() and stochss_model is not None:
                    process_model_changes(mdl, stochss_model)

                model = {"model":stochss_model, "errors":errors}
            else:
                model = {"model":None,"errors":["Error! the model source doesn't match the supported StochSS file types and is not a SedML model ID."]}
        else:
            model = {"model":None,"errors":["Error! {0} is in a language that is not supported by StochSS: {1}".format(mdl.getId(), mdl.getLanguage())]}

        models[mdl.getId()] = model

    return models


def get_model_template():
    with open("/stochss/model_templates/nonSpatialModelTemplate.json", "r") as template_file:
        return json.load(template_file)


def process_model_changes(mdl, model):
    changes = get_changes(mdl)
    # execute_sedml_add_xml(model, changes['add'])
    execute_sedml_change_attributes(model, changes['change'])
    # execute_sedml_change_xml(model, changes['changeXML'])
    # execute_sedml_compute_changes(model, changes['compute'])
    # execute_sedml_remove_xml(model, changes['remove'])


def get_changes(mdl):
    changes = {"add":[],"change":[],"changeXML":[],"compute":[],"remove":[]}
    for i in range(mdl.getNumChanges()):
        change = mdl.getChange(i)
        if change.isSedAddXML():
            changes['add'].append(change)
        elif change.isSedChangeXML():
            changes['changeXML'].append(change)
        elif change.isSedChangeAttribute():
            changes['change'].append(change)
        elif change.isSedComputeChange():
            changes['compute'].append(change)
        else:
            changes['remove'].append(change)
    return changes


def execute_sedml_change_attributes(model, changes):
    for change in changes:
        target = change.getTarget().split('sbml:').pop()
        component = target.split('[')[0]
        name = target.split("@id='").pop().split("']")[0]
        value = change.getNewValue()
        prop = target.split('@').pop() if "@" in target.split(']').pop() else None
        
        if component == "parameter":
            change_parameter(model['parameters'], name, value)


def change_parameter(parameters, name, value):
    param = list(filter(lambda parameter: parameter['name'] == name, parameters))[0]
    param['expression'] = value


def get_simulations(experiment):
    simulations = {}
    kisaoid_map = get_kisao_map()
    
    for i in range(experiment.getNumSimulations()):
        sim = experiment.getSimulation(i)
        sim_type_code = sim.getTypeCode()
        errors = []
        
        if sim_type_code == libsedml.SEDML_SIMULATION_UNIFORMTIMECOURSE:
            algorithm = sim.getAlgorithm()
            algorithm_id = algorithm.getKisaoID()
            
            if algorithm_id in kisaoid_map.keys():
                end = sim.getOutputEndTime()
                time_units = end / sim.getNumberOfPoints()
                parameters, errs = get_algorithm_parameters(algorithm, kisaoid_map)
            
                if len(errs):
                    errors.extend(errs)
            
                simulation = {"algorithm":kisaoid_map[algorithm_id], "end":end, "time_units":time_units, "parameters":parameters}
            else:
                errors.append(["Error! The {0} algorithm is not supported by StochSS.".format(algorithm_id), 0])
                simulation = {"algorithm":None}
        elif sim_type_code == libsedml.SEDML_SIMULATION_ONESTEP:
            errors.append(["Error! One Step simulations are not supported by StochSS.", 0])
            simulation = {"algorithm":None}
        elif sim_type_code == libsedml.SEDML_SIMULATION_STEADYSTATE:
            errors.append(["Error! Steady State simulations are not supported by StochSS.", 0])
            simulation = {"algorithm":None}
        else:
            errors.append(["Error! StochSS encountered an unknown simulation: {0}".format(sim.getId()), 0])
            simulation = {"algorithm":None}
        
        simulation['errors'] = list(map(lambda error: error[0], errors))
        simulations[sim.getId()] = simulation

    return simulations


def get_kisao_map():
    return {"KISAO:0000088":"ODE",
            "KISAO:0000029":"SSA",
            "KISAO:0000084":"Tau-Leaping",
            "KISAO:0000488":"seed",
            "KISAO:0000498":"realizations",
            "KISAO:0000228":"tauTol",
            "KISAO:0000211":"absoluteTol",
            "KISAO:0000209":"relativeTol",
            "KISAO:0000019":"ODE"
           }


def get_algorithm_parameters(algorithm, kisaoid_map):
    parameters = {}
    errors = []
    
    for i in range(algorithm.getNumAlgorithmParameters()):
        param = algorithm.getAlgorithmParameter(i)
        param_id = param.getKisaoID()
    
        if param_id in kisaoid_map.keys():
            parameters[kisaoid_map[param_id]] = param.getValue()
        else:
            errors.append(["Error! The algorithm parameter {0} is not supported by StochSS.".format(param_id), 0])
    
    return parameters, errors


def build_experiment(experiment, path, project_path):
    parent_path = os.path.dirname(path)
    name = path.split('/').pop().split('.')[0]

    experiment_path = os.path.join(project_path, name+".exp")

    simulations = get_simulations(experiment)
    models = get_models(experiment, parent_path)
    tasks = get_tasks(experiment)
    data_generators = get_data_generators(experiment)
    outputs = get_outputs(experiment, data_generators)

    wkfls = []
    errors = []
    for name, task in tasks.items():
        model = models[task['model']]
        simulation = simulations[task['simulation']]
        if model['model'] is None:
            errors.append("Error! Task {0} contains an invalid model: {1}".format(name, task['model']))
            errors.extend(model['errors'])
        elif simulation['algorithm'] is None:
            errors.append("Error! Task {0} contains an invalid simulation: {1}".format(name, task['simulation']))
            errors.extend(simulation['errors'])
        else:
            if len(simulation['errors']): 
                errors.extend(simulation['errors'])
            model = model['model']
            set_model_settings(model['modelSettings'], simulation)
            set_simulation_settings(model['simulationSettings'], simulation)
            wkfl_path = os.path.join(experiment_path, ''.join([name,"_05132020_110609",".wkfl"]))
            mdl_file = task['model']+".mdl"
            wkfls.append({"model":model, "path":wkfl_path, "mdl_file":mdl_file, "type":task['type']})

    stochss_experiment = {"workflows":wkfls, "path":experiment_path}
    return stochss_experiment, errors


def set_model_settings(settings, simulation):
    settings['algorithm'] = simulation['algorithm']
    settings['endSim'] = simulation['end']
    settings['timeStep'] = simulation['time_units']


def set_simulation_settings(settings, simulation):
    algorithm_params = simulation['parameters']

    settings['algorithm'] = simulation['algorithm']
    settings['isAutomatic'] = False
    for name, value in algorithm_params.items():
        settings[name] = value


def read_sedml_doc(path):
    experiment = libsedml.readSedML(path)

    errors = []
    num_errors = experiment.getNumErrors()
    if num_errors > 0:
        for i in range(num_errors):
            error = experiment.getError(i)
            converter_code = -10

            errors.append(["SedML {0}, code {1}, line {2}: {3}".format(error.getSeveityAsString(), error.getErrorId(), 
                                                            error.getLine(), error.getMessage()), converter_code])

    if min([code for error, code in errors] + [0]) < 0:
        return None, errors
    return experiment, errors


def build_project(path, project_path):
    experiments = []
    proj_errors = []

    manifest_path = os.path.join(path, "manifest.xml")
    tree = ET.parse(manifest_path)
    root = tree.getroot()
    for child in root.getchildren():
        if "master" in child.keys() and child.get(key="master") == "true":
            if child.get(key="format").endswith("sbml"):
                template = get_model_template()
                source = os.path.join(path, child.get(key="location").replace("./",""))
                errors = convert_sbml_to_model(source, template)['errors']
                proj_errors.extend(errors)
            elif child.get(key="format").endswith("sed-ml"):
                source = os.path.join(path, child.get(key="location").replace("./",""))
                experiment, errors = read_sedml_doc(source)
                proj_errors.extend(errors)
                
                if experiment is not None:
                    stochss_experiment, errors = build_experiment(experiment, source, project_path)
                    proj_errors.extend(errors)
                    experiments.append(stochss_experiment)
            else:
                file = child.get(key="location")
                file_format = child.get(key="format")
                proj_errors.append("Error! {0} is in a format that is not supported by StochSS: {1}".format(file, file_format))

    return experiments, proj_errors


def write_workflow(workflow, exp_path):
    if not os.path.exists(workflow['path']):
        os.mkdir(workflow['path'])

        tmp = tempfile.NamedTemporaryFile(mode="w", delete=False)
        tmp.write(json.dumps(workflow['model']))
        tmp.close()

        workflows = {"gillespy":GillesPy2Workflow, "parameterSweep":ParameterSweep}
        wkfl = workflows[workflow['type']](workflow['path'], tmp.name)
        wkfl.wkfl_mdl_path = wkfl.wkfl_mdl_path.replace(tmp.name.split('/').pop(), workflow['mdl_file'])

        save_new_workflow(wkfl, workflow['type'], True)
        
        exec_cmd = ["/stochss/stochss/handlers/util/run_workflow.py", 
                    "{0}".format(wkfl.wkfl_mdl_path), 
                    "{0}".format(workflow['path']), 
                    "{0}".format(workflow['type']),
                    "-rn" ] # Script commands
        pipe = subprocess.Popen(exec_cmd)
        os.remove(tmp.name)
    else:
        return "Error! {0} already exists in {1}".format(workflow['path'].split('/').pop(), exp_path.split('/').pop())


def write_experiment(experiment):
    if not os.path.exists(experiment['path']):
        os.mkdir(experiment['path'])

    errors = []
    for workflow in experiment['workflows']:
        err = write_workflow(workflow, experiment['path'])
        if err is not None:
            errors.append(err)

    return errors


def write_project(project, project_path):
    if not os.path.exists(project_path):
        os.mkdir(project_path)

    errors = []
    for experiment in project:
        errs = write_experiment(experiment)
        errors.extend(errs)

    return errors
    

def import_combine_archive(path):
    project_path = path.replace(".omex",".proj")
    tmp = tempfile.TemporaryDirectory()

    with zipfile.ZipFile(path, "r") as zip_file:
        zip_file.extractall(tmp.name)

    cmb_dir = os.listdir(tmp.name)[0]
    cmb_path = os.path.join(tmp.name, cmb_dir)

    if os.path.isdir(cmb_path) and "manifest.xml" in os.listdir(cmb_path):
        project, errors = build_project(cmb_path, project_path)
        errs = write_project(project, project_path)
        errors.extend(errs)
    else:
        errors = ["Error! {0} does not conform to the COMBINE archive standards.".format(path.split('/').pop())]

    if os.path.exists(tmp.name):
        shutil.rmtree(tmp.name)

    return errors

