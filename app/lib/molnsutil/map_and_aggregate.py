import pickle


def map_and_aggregate(results, param_set_id, mapper, aggregator=None, cache_results=False, cluster_import=False,
                      local_storage_directory=None):
    """ Reduces a list of results by applying the map function 'mapper'.
        When this function is applied on an engine, it will first
        look for the result object in the local ephemeral storage (cache),
        then in the Shared area (global non-persistent), then in the
        Object Store (global persistent).

        If cache_results=True, then result objects will be written
        to the local ephemeral storage (file cache), so subsequent
        postprocessing jobs may run faster.

        """

    if cluster_import is True:
        from molnsutil.molns_exceptions import MolnsUtilException, MolnsUtilStorageException
        from molnsutil.storage_providers import PersistentStorage, LocalStorage, SharedStorage
        from molnsutil.utils import builtin_aggregator_list_append
    else:
        from molns_exceptions import MolnsUtilException, MolnsUtilStorageException
        from storage_providers import PersistentStorage, LocalStorage, SharedStorage
        from utils import builtin_aggregator_list_append

    # If local_storage_directory is provided, then use ONLY that directory.
    if local_storage_directory is not None:
        ls = LocalStorage(local_storage_directory)
    else:
        ps = PersistentStorage()
        ss = SharedStorage()
        ls = LocalStorage()

    if aggregator is None:
        aggregator = builtin_aggregator_list_append
    num_processed = 0
    res = None

    for i, filename in enumerate(results):
        enotes = ''
        result = None
        try:
            result = ls.get(filename)
        except Exception as e:
            enotes += "In fetching from local store, caught  {0}: {1}\n".format(type(e), e)
            if local_storage_directory is not None:
                raise MolnsUtilStorageException(enotes)

        if result is None:
            try:
                result = ss.get(filename)
                if cache_results:
                    ls.put(filename, result)
            except Exception as e:
                enotes += "In fetching from shared store, caught  {0}: {1}\n".format(type(e), e)
        if result is None:
            try:
                result = ps.get(filename)
                if cache_results:
                    ls.put(filename, result)
            except Exception as e:
                enotes += "In fetching from global store, caught  {0}: {1}\n".format(type(e), e)
        if result is None:
            notes = "Error could not find file '{0}' in storage\n".format(filename)
            notes += enotes
            raise MolnsUtilStorageException(notes)

        try:
            mapres = mapper(result)
            res = aggregator(mapres, res)
            num_processed += 1
        except Exception as e:
            import traceback
            notes = "Error running mapper and aggregator, caught {0}: {1}\n".format(type(e), e)
            notes += "type(mapper) = {0}\n".format(type(mapper))
            notes += "type(aggregator) = {0}\n".format(type(aggregator))
            notes += "dir={0}\n".format(dir())
            notes += "{0}".format(traceback.format_exc())
            raise MolnsUtilException(notes)

    return {'result': res, 'param_set_id': param_set_id, 'num_successful': num_processed,
            'num_failed': len(results) - num_processed}


if __name__ == "__main__":
    try:
        import os
        import molnsutil.constants as constants
        import molnsutil.molns_cloudpickle as cloudpickle

        with open(constants.job_input_file_name, "rb") as inp:
            unpickled_list = pickle.load(inp)

        results_ = unpickled_list['result']
        param_set_id_ = unpickled_list['pndx']
        cache_results_ = unpickled_list['cache_results']
        local_storage_directory_ = os.path.dirname(os.path.abspath(__file__))

        if not unpickled_list.get('mapper', False):
            with open(constants.pickled_cluster_input_file, "rb") as inp:
                unpickled_cluster_input = pickle.load(inp)
                mapper_fn = unpickled_cluster_input['mapper']
                aggregator_fn = unpickled_cluster_input['aggregator']
        else:
            mapper_fn = unpickled_list['mapper']
            aggregator_fn = unpickled_list['aggregator']

        result = map_and_aggregate(results=results_, param_set_id=param_set_id_, mapper=mapper_fn,
                                   aggregator=aggregator_fn, cache_results=cache_results_, cluster_import=True,
                                   local_storage_directory=local_storage_directory_)
        with open(constants.job_output_file_name, "wb") as output:
            cloudpickle.dump(result, output)
    except Exception as errors:
        with open(constants.job_error_file_name, "wb") as error:
            error.write(str(errors))
