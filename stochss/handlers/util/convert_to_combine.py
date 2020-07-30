import os
import json
import tempfile
import numpy as np

import libsbml
import libsedml
import libcombine

from .workflow_status import get_status
from .rename import get_unique_file_name
from .convert_to_sbml import convert_to_sbml
from .stochss_errors import StochSSExportCombineError


kisao_map = {"ODE":"KISAO:0000088", "SSA":"KISAO:0000029", "Tau-Leaping":"KISAO:0000084",
             "Hybrid-Tau-Leaping":"KISAO:1000084", "seed":"KISAO:0000488",
             "realizations":"KISAO:0000498", "tauTol":"KISAO:0000228",
             "absoluteTol":"KISAO:0000211", "relativeTol":"KISAO:0000209"}

params_map = {"ODE":["absoluteTol", "relativeTol"],
              "SSA":["seed", "realizations"],
              "Tau-Leaping":["seed", "realizations", "tauTol"],
              "Hybrid-Tau-Leaping":["absoluteTol", "relativeTol", "seed", "realizations", "tauTol"]}


def convert(path, meta_data=None):
    user_dir = "/home/jovyan"
    path = os.path.join(user_dir, path)

    # Setup combine archive
    archive = libcombine.CombineArchive()
    archive_dir = tempfile.TemporaryDirectory()
    archive_errors = []

    # Add file(s) to archive
    if path.endswith('.wkfl'):
        if get_status(path) != 'complete':
            raise StochSSExportCombineError("You cannot create a combine achrive \
                                            with a workflow that has not completed")
        archive_name = path.split('/')[:-2].pop().split('.')[0]
        file_type = "workflow"
        dst_parent = '/'.join(path.split('/')[:-3])
        sedml = convert_workflow(path, archive, archive_dir)
        with open(sedml['path'], "w") as sedml_file:
            sedml_file.write(libsedml.SedWriter().writeSedMLToString(sedml['doc']))
        archive.addFile(sedml['path'], "./{0}".format(sedml['name']),
                        libcombine.KnownFormats.lookupFormat('sedml'), True)
    elif path.endswith('.exp'):
        archive_name = path.split('/')[:-1].pop().split('.')[0]
        file_type = "Experiment"
        dst_parent = '/'.join(path.split('/')[:-2])
        archive_errors = convert_experiment(path, archive, archive_dir)
    elif path.endswith('.proj'):
        archive_name = path.split('/').pop().split('.')[0]
        file_type = "Project"
        dst_parent = os.path.dirname(path)
        archive_errors = convert_project(path, archive, archive_dir)
    dst, changed = get_unique_file_name(archive_name + ".omex", dst_parent)
    if changed:
        archive_name = dst.split('/').pop().split('.')[0]

    if meta_data is not None:
        add_meta_data(archive, archive_name, meta_data)

    # write the archive to the parent directory of the project
    archive.writeToFile(dst)

    resp = "The {0} {1} was exported as {2} to {3}".format(file_type,
                                                           path.split('/').pop(),
                                                           archive_name+".omex",
                                                           "/" if os.path.dirname(dst) == user_dir
                                                           else os.path.dirname(dst))
    return {"message":resp, "errors":archive_errors, "file_type":file_type,
            "file_path":dst.replace("/home/jovyan/", "")}


def add_meta_data(archive, archive_name, meta_data):
    for file in meta_data.keys():
        # Create meta data for archive
        des = libcombine.OmexDescription()
        des.setAbout('.' if file.split('.')[0] == archive_name else "./{0}.xml".format(file))
        des.setCreated(libcombine.OmexDescription.getCurrentDateAndTime())
        if meta_data[file]["description"]:
            des.setDescription(meta_data[file]["description"])
        # Create creator for the meta data
        for creator_data in meta_data[file]["creators"]:
            # Add creator to meta data
            des.addCreator(create_creator(**creator_data))
        # Add meta data to archive
        archive.addMetadata('.' if file.split('.')[0] == archive_name else
                            "./{0}.xml".format(file), des)


def create_creator(fname=None, lname=None, email=None, organization=None):
    creator = libcombine.VCard()
    if lname:
        creator.setFamilyName(lname)
    if fname:
        creator.setGivenName(fname)
    if email:
        creator.setEmail(email)
    if organization:
        creator.setOrganization(organization)
    return creator


def convert_workflow(path, archive, archive_dir, sedml_doc=None):
    with open(os.path.join(path, "info.json"), "r") as info_file:
        wkfl_info = json.load(info_file)
        model_path = os.path.join("/home/jovyan", wkfl_info['wkfl_model'])

    # add model to archive as sbml file with .xml extension
    sbml_document = convert_to_sbml(model_path.replace("/home/jovyan/", ""), write_to_file=False)
    sbml_path, _ = get_unique_file_name(model_path.split('/').pop().split('.')[0]+".xml",
                                        archive_dir.name)
    with open(sbml_path, "w") as sbml_file:
        sbml_file.write(libsbml.SBMLWriter().writeSBMLToString(sbml_document))
    model_file = sbml_path.split('/').pop()
    archive.addFile(sbml_path, "./{0}".format(model_file),
                    libcombine.KnownFormats.lookupFormat('sbml'), False)

    # create Sed-ML document, name, and path
    if sedml_doc is None:
        sedml_doc = libsedml.SedDocument(1, 3)
        sedml_document = convert_workflow_to_sedml(path, wkfl_info, model_file, sedml_doc)
        sedml_name = os.path.dirname(path).split('/').pop().replace(".exp", ".xml")
        sedml_path, _ = get_unique_file_name(sedml_name, archive_dir.name)

        return {"doc":sedml_document, "name":sedml_name, "path":sedml_path}

    return convert_workflow_to_sedml(path, wkfl_info, model_file, sedml_doc)


def convert_experiment(path, archive, archive_dir, num_exps=None):
    sedml_doc = libsedml.SedDocument(1, 3)
    sedml_name = path.split('/').pop().replace(".exp", ".xml")
    sedml_path, _ = get_unique_file_name(sedml_name, archive_dir.name)
    errors = []

    for wkfl in list(filter(lambda obj: obj.endswith(".wkfl"), os.listdir(path))):
        wkfl_path = os.path.join(path, wkfl)
        if get_status(wkfl_path) == 'complete':
            convert_workflow(wkfl_path, archive, archive_dir, sedml_doc=sedml_doc)
        else:
            errors.append("The workflow {0} cannot be added to the Sed-ML file {1} \
                        until it has completed successfully".format(wkfl, sedml_name))

    if sedml_doc.getNumSimulations() <= 0:
        archive_name = os.path.dirname(path).split('/').pop().replace('.proj', '.omex')
        if num_exps is None:
            message = "A COMBINE archive cannot be created from an experiment that \
                        does not contain any successfully completed workflows: {0} \
                        ".format(errors)
        else:
            message = "The experiment {1} contains no workflows that have \
                        successfully completed and cannot be added to the COMBINE \
                        archive {2}: {0}".format(errors, path.split('/').pop(), archive_name)
        raise StochSSExportCombineError(message)

    sedml_writer = libsedml.SedWriter()
    with open(sedml_path, "w") as sedml_file:
        sedml_file.write(sedml_writer.writeSedMLToString(sedml_doc))

    archive.addFile(sedml_path, "./{0}".format(sedml_name),
                    libcombine.KnownFormats.lookupFormat('sedml'), True)

    return errors


def convert_project(path, archive, archive_dir):
    failed = 0
    project_errors = []

    experiments = list(filter(lambda obj: obj.endswith(".exp"), os.listdir(path)))
    for exp in experiments:
        exp_path = os.path.join(path, exp)
        try:
            errors = convert_experiment(exp_path, archive, archive_dir,
                                        num_exps=len(experiments))
            project_errors.extend(errors)
        except StochSSExportCombineError as err:
            failed += 1
            project_errors.append(str(err))

    if len(experiments) <= failed:
        message = "Could not create the COMBINE archive as none of the experiments \
                    contain successfully completed workflows: {0}".format(project_errors)
        raise StochSSExportCombineError(message)

    return project_errors


def get_wkfl_data(_path, info):
    user_dir = "/home/jovyan"
    if _path.startswith(user_dir):
        path = _path
    else:
        path = os.path.join(user_dir, _path)

    with open(info['wkfl_model'], 'r') as mdl_file:
        mdl = json.load(mdl_file)
    with open(os.path.join(path, "settings.json")) as settings_file:
        wkfl_settings = json.load(settings_file)

    return mdl, wkfl_settings


def convert_workflow_to_sedml(path, info, mdl_src, sedml_doc):
    # create the Sed-ML model
    mdl_id = create_model_reference(sedml_doc, mdl_src)

    # get data for Sed-ML simulation
    mdl, wkfl_settings = get_wkfl_data(path, info)
    # create the SedML simulation
    sim_id = create_simulation(sedml_doc, mdl, wkfl_settings)

    if info['type'] == "gillespy":
        # create the Sed-ML task
        task_id = create_task(sedml_doc, path, mdl_id, sim_id)
        # data generators for time
        create_data_generator(sedml_doc, "time", task_id, symbol="urn:sedml:symbol:time")
    else:
        # create the Sed-ML repeated task for 1D parameter sweep
        psweep_settings = wkfl_settings['parameterSweepSettings']
        sub_task_id = create_task(sedml_doc, path, mdl_id, sim_id, is_sub_task=True)
        task_id = create_repeated_task(sedml_doc, path, mdl_id, sub_task_id, psweep_settings)
        # data generators for params
        create_data_generator(sedml_doc, "p1range", task_id, symbol="urn:sedml:symbol:p1range")
        if not psweep_settings['is1D']:
            # create data generator for 2D parameter sweep p2
            create_data_generator(sedml_doc, "p2range", task_id,
                                  symbol="urn:sedml:symbol:p2range")

    outputs = wkfl_settings['resultsSettings']['outputs']
    index = sedml_doc.getNumOutputs() + 1
    if len(outputs) <= 0:
        # default data generators for results
        list_of_dgs, error_dgs = create_default_data_generators(sedml_doc, mdl, info,
                                                                wkfl_settings, task_id)
        if info['type'] == "gillespy":
            # default output
            create_default_outputs(sedml_doc, index, list_of_dgs)
        elif psweep_settings['is1D']:
            create_default_outputs(sedml_doc, index, list_of_dgs, error_dgs=error_dgs,
                                   x_ref="p1range")
        else:
            create_default_3d_outputs(sedml_doc, index, list_of_dgs)
    else:
        # data generators for saved results
        if info['type'] == "gillespy":
            create_data_generators(sedml_doc, info, outputs, task_id)
            # user defined plots
            create_saved_outputs(sedml_doc, outputs, index)
        else:
            create_data_generators(sedml_doc, info, outputs, task_id, is_1d=psweep_settings['is1D'])
            if psweep_settings['is1D']:
                create_saved_outputs(sedml_doc, outputs, index, x_ref="p1range")
            else:
                create_saved_3d_outputs(sedml_doc, outputs, index)

    return sedml_doc


def create_model_reference(sedml_doc, mdl_src):
    model_id = mdl_src.split('.')[0].replace('(', '_').replace(')', '')
    sedml_mdl = sedml_doc.createModel()
    sedml_mdl.setId(model_id)
    sedml_mdl.setSource(mdl_src)
    sedml_mdl.setLanguage("urn:sedml:sbml")

    return model_id


def create_simulation(sedml_doc, mdl, wkfl_settings):
    mdl_settings = mdl['modelSettings']
    sim_settings = wkfl_settings['simulationSettings']
    index = sedml_doc.getNumSimulations() + 1
    sim_id = "sim{0}".format(index)

    sedml_sim = sedml_doc.createUniformTimeCourse()
    sedml_sim.setId(sim_id)
    sedml_sim.setInitialTime(0)
    sedml_sim.setOutputStartTime(0)
    sedml_sim.setOutputEndTime(mdl_settings['endSim'])
    sedml_sim.setNumberOfPoints(int(mdl_settings['endSim'] / mdl_settings['timeStep']))
    # create the Sed-ML simulation algorithm
    create_sim_algorithm(sedml_sim, sim_settings)

    return sim_id


def create_sim_algorithm(sedml_sim, sim_settings):
    algorithm = sim_settings['algorithm']
    sim_alg = sedml_sim.createAlgorithm()
    sim_alg.setKisaoID(kisao_map[algorithm])
    # create the Sed-ML simulation algorithm parameters
    for param in params_map[algorithm]:
        value = sim_settings[param]
        create_algorithm_param(sim_alg, param, value)


def create_algorithm_param(sim_alg, param, value):
    if not (param == "seed" and value == -1):
        alg_param = sim_alg.createAlgorithmParameter()
        alg_param.setKisaoID(kisao_map[param])
        alg_param.setValue(str(value))


def create_task(sedml_doc, path, mdl_id, sim_id, is_sub_task=False):
    task_id = path.split('/').pop().split('.')[0]
    if is_sub_task:
        task_id += "_sub"
    sedml_task = sedml_doc.createTask()
    sedml_task.setId(task_id)
    sedml_task.setModelReference(mdl_id)
    sedml_task.setSimulationReference(sim_id)

    return task_id


def create_repeated_task(sedml_doc, path, mdl_id, sub_task_id, settings):
    task_id = path.split('/').pop().split('.')[0]

    sedml_rtask = sedml_doc.createRepeatedTask()
    sedml_rtask.setId(task_id)
    sedml_rtask.setResetModel(False)
    # create the ranges that the task will iterate over
    # all ranges are iterated in lockstep with the primary range
    ranges = list(create_list_of_ranges(sedml_rtask, settings))
    sedml_rtask.setRangeId(ranges[0])
    # create the list of changes to be made the model prior to running the subtask
    create_list_of_changes(sedml_rtask, settings, ranges, mdl_id)
    # create the sub task to be called during each iteration
    create_subtask(sedml_rtask, sub_task_id)

    return task_id


def create_list_of_ranges(sedml_rtask, settings):
    if settings['is1D']:
        p1_range_id = create_uniform_range(sedml_rtask, settings)
        return p1_range_id, None

    p1_range = get_range_for(settings, primary=True)
    p2_range = get_range_for(settings)
    p1_range_id = create_vector_range(sedml_rtask, p1_range, "p1range")
    p2_range_id = create_vector_range(sedml_rtask, p2_range, "p2range")

    return p1_range_id, p2_range_id


def create_uniform_range(sedml_rtask, settings):
    uni_range_id = "p1range"
    uni_range = sedml_rtask.createUniformRange()
    uni_range.setId(uni_range_id)
    uni_range.setStart(settings['p1Min'])
    uni_range.setEnd(settings['p1Max'])
    uni_range.setNumberOfPoints(settings['p1Steps'])
    uni_range.setType("linear")

    return uni_range_id


def get_range_for(settings, primary=False):
    if primary:
        start = settings['p1Min']
        end = settings['p1Max']
        steps = settings['p1Steps']
    else:
        start = settings['p2Min']
        end = settings['p2Max']
        steps = settings['p2Steps']

    _range = list(np.linspace(start, end, steps))

    param_range = []
    if primary:
        for val in _range:
            for _ in range(settings['p2Steps']):
                param_range.append(val)
    else:
        for _ in range(settings['p1Steps']):
            param_range.extend(_range)

    return param_range


def create_vector_range(sedml_rtask, range_vals, vec_range_id):
    vec_range = sedml_rtask.createVectorRange()
    vec_range.setId(vec_range_id)
    vec_range.setValues(range_vals)

    return vec_range_id


def create_list_of_changes(sedml_rtask, settings, ranges, mdl_id):
    p1_change = sedml_rtask.createTaskChange()
    p1_change.setTarget("/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='{0}']"
                        .format(settings['parameterOne']['name']))
    p1_change.setRange(ranges[0])
    p1_change.setModelReference(mdl_id)
    p1_change.setMath(libsedml.parseFormula(ranges[0]))

    if ranges[1] is not None:
        p2_change = sedml_rtask.createTaskChange()
        p2_change.setTarget("/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='{0}']"
                            .format(settings['parameterTwo']['name']))
        p2_change.setRange(ranges[1])
        p2_change.setModelReference(mdl_id)
        p2_change.setMath(libsedml.parseFormula(ranges[1]))


def create_subtask(sedml_rtask, sub_task_id):
    sub_task = sedml_rtask.createSubTask()
    sub_task.setTask(sub_task_id)
    sub_task.setOrder(1)


def get_data_generator_code(wkfl_type, key=None, settings=None):
    if key is None and settings is None:
        raise StochSSExportCombineError("No key or settings were provided, \
                                        you must provide one of either.")
    if key is None:
        res_settings = settings['resultsSettings']
        sim_settings = settings['simulationSettings']
        key = "-" + res_settings['mapper']
        if sim_settings['realizations'] > 1:
            key += ("-" + res_settings['reducer'])

    if wkfl_type == "gillespy":
        code_map = {"trajectories":"t", "stddevran":"sdr", "stddev":"sd", "avg":"r"}
        code = code_map[key]
    elif wkfl_type == "parameterSweep":
        code_map = {"min":"n", "max":"x", "avg":"a", "var":"v", "final":"f"}
        key = key.split("-")[1:]
        code = ""
        for element in key:
            code += code_map[element]

    return code


def get_data_generator_formula(wkfl_type, code, species):
    if wkfl_type == "gillespy":
        func_map = {"t":species, "sdr":"mean", "sd":"sdev", "r":"mean"}

        if code == "sdr_lb":
            formula = "{0}({1}) - {2}({1})".format(func_map["r"], species, func_map["sd"])
        elif code == "sdr_ub":
            formula = "{0}({1}) + {2}({1})".format(func_map["r"], species, func_map["sd"])
        elif code == "t":
            formula = func_map[code]
        else:
            formula = "{0}({1})".format(func_map[code], species)
    elif wkfl_type == "parameterSweep":
        func_map = {"n":"min", "x":"max", "a":"mean", "v":"variance", "f":"final"}

        if "_" in code:
            code, err_code = code.split("_")
        else:
            err_code = None

        mapper_code = code[:1]
        reducer_code = code[1:]

        _formula = "{0}({1})".format(func_map[mapper_code], species)
        if reducer_code:
            formula = "{0}({1})".format(func_map[reducer_code], _formula)
        else:
            formula = _formula

        if err_code is not None and err_code == "lb":
            formula += "- sdev({0})".format(_formula)
        elif err_code is not None and err_code == "ub":
            formula += "+ sdev({0})".format(_formula)

    return formula


def create_default_data_generators(sedml_doc, mdl, info, wkfl_settings, task_id):
    list_of_dgs = []
    error_dgs = []
    if info['type'] == "gillespy":
        species = list(map(lambda specie: specie['name'], mdl['species']))
    else:
        species = [wkfl_settings['parameterSweepSettings']['speciesOfInterest']['name']]
        code = get_data_generator_code(info['type'], settings=wkfl_settings)
    for specie in species:
        target = "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='{0}']".format(specie)
        if info['type'] == "gillespy":
            data_gen = create_data_generator(sedml_doc, specie, task_id, code="t", target=target)
        else:
            formula = get_data_generator_formula(info['type'], code, specie)
            data_gen = create_data_generator(sedml_doc, specie, task_id, code=code,
                                             formula=formula, target=target)
            if wkfl_settings['parameterSweepSettings']['is1D']:
                # create the data generators for the error bars in 1D parameter sweeps
                error_dgs.extend(create_error_data_generators(sedml_doc, info['type'], code,
                                                              specie, task_id, target))

        list_of_dgs.append(data_gen)

    return list_of_dgs, error_dgs


def create_data_generators(sedml_doc, info, outputs, task_id, is_1d=False):
    for output in outputs:
        list_of_dgs = []
        code = get_data_generator_code(info['type'], output['key'])
        for species in output['species']:
            formula = get_data_generator_formula(info['type'], code, species)
            target = ("/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='{0}']"
                      .format(species))
            list_of_dgs.append(create_data_generator(sedml_doc, species, task_id, code=code,
                                                     formula=formula, target=target))
            if code == "sdr":
                lb_formula = get_data_generator_formula(info['type'], code+"_lb", species)
                ub_formula = get_data_generator_formula(info['type'], code+"_ub", species)
                list_of_dgs.append(create_data_generator(sedml_doc, species, task_id,
                                                         code=code+"_lb", formula=lb_formula,
                                                         target=target))
                list_of_dgs.append(create_data_generator(sedml_doc, species, task_id,
                                                         code=code+"_ub", formula=ub_formula,
                                                         target=target))
            elif info['type'] == "parameterSweep" and is_1d:
                # create the data generators for the error bars in 1D parameter sweeps
                output['error_dgs'] = create_error_data_generators(sedml_doc, info['type'],
                                                                   code, species, task_id,
                                                                   target)
        output['data_generators'] = list_of_dgs


def create_error_data_generators(sedml_doc, wkfl_type, code, species, task, target):
    xle_formula = get_data_generator_formula(wkfl_type, code+"_lb", species)
    xue_formula = get_data_generator_formula(wkfl_type, code+"_ub", species)
    xle_dg = create_data_generator(sedml_doc, species, task, code=code+"_lb",
                                   formula=xle_formula, target=target)
    xue_dg = create_data_generator(sedml_doc, species, task, code=code+"_ub",
                                   formula=xue_formula, target=target)

    return [xle_dg, xue_dg]


def create_data_generator(sedml_doc, name, task_id, code=None,
                          formula=None, symbol=None, target=None):
    index = sedml_doc.getNumSimulations()
    dg_id = name if code is None else "{0}_{1}".format(name, code)
    dg_id += str(index)

    if not doc_has_data_generator(sedml_doc, dg_id):
        if formula is None:
            formula = name
        if symbol is None and target is None:
            raise StochSSExportCombineError("You must have a 'symbol' or a 'target' \
                                            for data generators")
        if symbol is not None and target is not None:
            raise StochSSExportCombineError("You cannot have a 'symbol' and a 'target' \
                                            in a  data generators")

        # create the Sed-ML data generator
        sedml_dg = sedml_doc.createDataGenerator()
        sedml_dg.setId(dg_id)
        sedml_dg.setName(name)
        sedml_dg.setMath(libsedml.parseFormula(formula))
        # create the Sed-ML data generator variable(s)
        dg_var = sedml_dg.createVariable()
        dg_var.setId(name)
        dg_var.setName(name)
        dg_var.setTaskReference(task_id)
        if target is None:
            dg_var.setSymbol(symbol)
        else:
            dg_var.setTarget(target)

    return dg_id


def doc_has_data_generator(sedml_doc, dg_id):
    list_of_dgs = sedml_doc.getListOfDataGenerators()
    list_of_dgs = list(map(lambda dg: dg.getId(), list_of_dgs))

    return dg_id in list_of_dgs


def create_default_outputs(sedml_doc, index, list_of_dgs, error_dgs=None, x_ref="time"):
    plot = sedml_doc.createPlot2D()
    plot.setId("p{0}".format(index))
    for data_gen in list_of_dgs:
        create_plot2d_curve(plot, data_gen, x_ref=x_ref, error_dgs=error_dgs)
    plot.setLegend(True)


def create_saved_outputs(sedml_doc, outputs, index, x_ref="time"):
    for i, output in enumerate(outputs):
        plot = sedml_doc.createPlot2D()
        plot.setId("p{0}".format(index + i))
        if "title" in output.keys():
            plot.setName(output['title'])
        for data_gen in output['data_generators']:
            if 'error_dgs' in output.keys():
                create_plot2d_curve(plot, data_gen, x_ref=x_ref,
                                    error_dgs=output['error_dgs'])
            else:
                create_plot2d_curve(plot, data_gen, x_ref=x_ref)
        plot.setLegend(True)


def create_plot2d_curve(plot, y_ref, x_ref="time", error_dgs=None):
    curve_id = y_ref.split('_')[0]
    species = curve_id

    if y_ref.endswith("lb"):
        curve_id += "_lb"
    elif y_ref.endswith("ub"):
        curve_id += "_ub"

    curve = plot.createCurve()
    curve.setId(curve_id)
    curve.setName(species)
    curve.setLogX(False)
    curve.setLogY(False)
    curve.setXDataReference(x_ref)
    curve.setYDataReference(y_ref)

    if error_dgs is not None:
        curve.setYErrorLower(error_dgs[0])
        curve.setYErrorUpper(error_dgs[1])


def create_default_3d_outputs(sedml_doc, index, list_of_dgs):
    plot = sedml_doc.createPlot3D()
    plot.setId("p{0}".format(index))
    plot.setLegend(True)
    for data_gen in list_of_dgs:
        create_plot3d_surface(plot, "p1range", "p2range", data_gen)


def create_saved_3d_outputs(sedml_doc, outputs, index):
    for i, output in enumerate(outputs):
        plot = sedml_doc.createPlot3D()
        plot.setId("p{0}".format(index + i))
        if "title" in output.keys():
            plot.setName(output['title'])
        for data_gen in output['data_generators']:
            create_plot3d_surface(plot, "p1range", "p2range", data_gen)


def create_plot3d_surface(plot, x_ref, y_ref, z_ref):
    surface_id = z_ref.split('_')[0]

    surface = plot.createSurface()
    surface.setId(surface_id)
    surface.setName(surface_id)
    surface.setLogX(False)
    surface.setLogY(False)
    surface.setLogZ(False)
    surface.setXDataReference(x_ref)
    surface.setYDataReference(y_ref)
    surface.setZDataReference(z_ref)
    surface.setStyle("heatmap")
