import pickle


def run_ensemble_map_and_aggregate(model_class, parameters, param_set_id, seed_base, number_of_trajectories, mapper,
                                   aggregator=None, cluster_import=False):
    """ Generate an ensemble, then run the mappers are aggregator.  This will not store the results. """

    if cluster_import is True:
        from molnsutil.molns_exceptions import MolnsUtilException
        from molnsutil.utils import builtin_aggregator_list_append, create_model
    else:
        from molns_exceptions import MolnsUtilException
        from utils import builtin_aggregator_list_append, create_model

    if aggregator is None:
        aggregator = builtin_aggregator_list_append

    # Create the model
    model = create_model(model_class, parameters)

    # Run the solver
    res = None
    num_processed = 0
    results = model.run(seed=seed_base, number_of_trajectories=number_of_trajectories)
    if not isinstance(results, list):
        results = [results]

    for result in results:
        try:
            mapres = mapper(result)
            res = aggregator(mapres, res)
            num_processed += 1
        except Exception as e:
            import traceback
            notes = "Error running mapper and aggregator, caught {0}: {1}\n".format(type(e), e)
            notes += "type(mapper) = {0}\n".format(type(mapper))
            notes += "type(aggregator) = {0}\n".format(type(aggregator))
            notes += "dir={0}\n{1}".format(dir(), traceback.format_exc())
            raise MolnsUtilException(notes)

    return {'result': res, 'param_set_id': param_set_id, 'num_successful': num_processed,
            'num_failed': number_of_trajectories - num_processed}


if __name__ == "__main__":
    try:
        import molnsutil.constants as constants
        import molnsutil.molns_cloudpickle as cloudpickle

        with open(constants.job_input_file_name, "rb") as inp:
            unpickled_list = pickle.load(inp)

        num_of_trajectories = unpickled_list['chunk_size']
        seed = unpickled_list['seed']
        params = unpickled_list['pset']
        param_set_id_ = unpickled_list['pndx']

        if not unpickled_list.get('model_class', False):
            with open(constants.pickled_cluster_input_file, "rb") as inp:
                unpickled_cluster_input = pickle.load(inp)
                model_cls = unpickled_cluster_input['model_class']
                mapper_fn = unpickled_cluster_input['mapper']
                aggregator_fn = unpickled_cluster_input['aggregator']
        else:
            model_cls = unpickled_list['model_class']
            mapper_fn = unpickled_list['mapper']
            aggregator_fn = unpickled_list['aggregator']

        result = run_ensemble_map_and_aggregate(model_class=model_cls, parameters=params, param_set_id=param_set_id_,
                                                seed_base=seed, number_of_trajectories=num_of_trajectories,
                                                mapper=mapper_fn, aggregator=aggregator_fn, cluster_import=True)
        with open(constants.job_output_file_name, "wb") as output:
            cloudpickle.dump(result, output)
    except Exception as errors:
        with open(constants.job_error_file_name, "wb") as error:
            error.write(str(errors))
