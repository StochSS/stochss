import os
import pickle
import uuid


def run_ensemble(model_class, parameters, param_set_id, seed_base, number_of_trajectories,
                 storage_mode=None, local_storage_path=None, cluster_import=False):
    """ Generates an ensemble consisting of number_of_trajectories realizations by
        running the model 'nt' number of times. The resulting result objects
        are serialized and written to one of the MOLNs storage locations, each
        assigned a random filename. The default behavior is to write the
        files to the Shared storage location (global non-persistent). Optionally, files can be
        written to the Object Store (global persistent), storage_model="Persistent"

        Returns: a list of filenames for the serialized result objects.

        """

    if cluster_import is True:
        from molnsutil.storage_providers import PersistentStorage, LocalStorage, SharedStorage
        from molnsutil.molns_exceptions import MolnsUtilException
    else:
        from molns_exceptions import MolnsUtilException
        from storage_providers import PersistentStorage, LocalStorage, SharedStorage

    if storage_mode == constants.shared_storage or storage_mode is None:
        storage = SharedStorage()
    elif storage_mode == constants.persistent_storage:
        storage = PersistentStorage()
    elif storage_mode == constants.local_storage:
        storage = LocalStorage(local_storage_path)
    else:
        import traceback
        raise MolnsUtilException("Unknown storage type '{0}'\n{1}".format(storage_mode, traceback.format_exc()))

    # Create the model
    notes = ""
    try:
        model_class_cls = molns_cloudpickle.loads(model_class)
        if parameters is not None:
            model = model_class_cls(**parameters)
        else:
            model = model_class_cls()
    except Exception as e:
        import traceback
        notes += "Error caught instantiating the model class {0}\n".format(str(e))
        notes += "dir={0}\n{1}".format(dir(), traceback.format_exc())
        raise MolnsUtilException(notes)

    # Run the solver
    filenames = []
    notes = ""

    results = model.run(seed=seed_base, number_of_trajectories=number_of_trajectories)
    if not isinstance(results, list):
        results = [results]
    for result in results:
        try:
            # We should try to thread this to hide latency in file upload...
            filename = str(uuid.uuid1())
            storage.put(filename, result)
            filenames.append(filename)
        except Exception as e:
            import traceback
            notes += "Error writing result {0}. Error: {1}. \n\n{2}\n".format(result, str(e), traceback.format_exc())
            raise MolnsUtilException(notes)

    return {'filenames': filenames, 'param_set_id': param_set_id}


if __name__ == "__main__":
    try:
        import molnsutil.constants as constants
        import molnsutil.molns_cloudpickle as molns_cloudpickle

        with open(constants.job_input_file_name, "rb") as inp:
            unpickled_list = pickle.load(inp)

        num_of_trajectories = unpickled_list['pchunk']
        seed = unpickled_list['seed']
        params = unpickled_list['pset']
        param_set_id_ = unpickled_list['pndx']
        storage_mode = unpickled_list['storage_mode']

        if not unpickled_list.get('model_class', False):
            with open(constants.pickled_cluster_input_file, "rb") as inp:
                unpickled_cluster_input = pickle.load(inp)
                model_cls = unpickled_cluster_input['model_class']
        else:
            model_cls = unpickled_list['model_class']

        result = run_ensemble(model_class=model_cls, parameters=params, param_set_id=param_set_id_, seed_base=seed,
                              number_of_trajectories=num_of_trajectories, storage_mode=storage_mode,
                              local_storage_path=os.path.dirname(os.path.abspath(__file__)), cluster_import=True)
        with open(constants.job_output_file_name, "wb") as output:
            molns_cloudpickle.dump(result, output)
    except Exception as errors:
        with open(constants.job_run_ensemble_error_file_name, "wb") as error:
            error.write(str(errors))
