def create_pickled_cluster_input_file(storage_path, mapper=None, aggregator=None, reducer=None, model_class=None):

    from molnsutil import molns_cloudpickle

    if model_class is None and mapper is None and aggregator is None and reducer is None:
        return None

    unpickled_list = dict(model_class=molns_cloudpickle.dumps(model_class), mapper=mapper, aggregator=aggregator,
                          reducer=reducer)

    with open(storage_path, "wb") as input_file:
        molns_cloudpickle.dump(unpickled_list, input_file)


def format_result_list_dict(result_list):
    for key in result_list.keys():
        result_list[int(key)] = result_list[key]
        result_list.pop(key)

    return result_list


class Log:
    verbose = True
    Info = 0
    Debug = 1
    Error = 2

    def __init__(self):
        pass

    @staticmethod
    def write_log(message, level=Debug):
        if Log.verbose:
            if level == Log.Debug:
                print "DEBUG  " + message
            if level == Log.Error:
                import sys
                import datetime
                sys.stderr.write("\nERROR  {0} ".format(datetime.datetime()) + message)
            if level == Log.Info:
                print message
