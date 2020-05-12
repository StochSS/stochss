import os
import json
import copy
import libsedml
import numpy as np

from .convert_sbml_to_model import convert_to_gillespy_model, convert_to_stochss_model


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
        tasks[task.getId()] = {"model":task.getModelReference(),"simulation":task.getSimulationReference()}
    return tasks


def get_models(experiment. parent_path):
    models = {}

    for i in range(experiment.getNumModels()):
        mdl = experiment.getModel(i)

        if mdl.getLanguage().endswith(":sbml"):
            source = mdl.getSource()

            if source.endswith(".xml") or source.endswith(".sbml"):
                source = os.path.join(parent_path. source.replace(".\\", ""))
                with open("/stochss/model_templates/nonSpatialModelTemplate.json", "r") as template_file:
                    template = json.load(template_file)
                
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
    param = list(filter(lambda parameter: parameter['name'] == name))[0]
    param['expression'] = value


def get_simulations(experiment):
    simulations = {}
    kisao_map = get_kisao_map()
    
    for i in range(experiment.getNumSimulations()):
        sim = doc.getSimulation(i)
        sim_type_code = sim.getTypeCode()
        errors = []
        
        if sim_type_code == libsedml.SEDML_SIMULATION_UNIFORMTIMECOURSE:
            algorithm = sim.getAlgorithm()
            algorithm_id = algorithm.getKisaoID()
            
            if algorithm_id in kisaoid_map.keys():
                end = sim.getOutputEndTime()
                time_units = end / sim.getNumOfPoints()
                parameters, errs = get_algorithm_parameters(algorithm, kisao_map)
            
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


def build_experiment(experiment, path):
    parent_path = os.path.dirname(path)
    name = path.split('/').pop().split('.')[0]

    # os.mkdir(os.path.join(parent_path, name))

    simulations = get_simulations(experiment)
    models = get_models(experiment, parent_path)
    tasks = get_tasks(experiment)
    data_generators = get_data_generators(experiment)
    outputs = getoutputs(experiment, data_generator)

    return [simulations, models, tasks, data_generator, outputs]


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


def get_experiment(path):
    experiment, errors = read_sedml_doc(path)

    if experiment is not None:
        return build_experiment(experiment, path)