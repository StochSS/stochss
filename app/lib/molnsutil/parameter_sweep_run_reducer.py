import argparse as ap


def parameter_sweep_run_reducer(parameters, reducer, mapped_results, cluster_execution=False):

    if cluster_execution is False:
        ret = ParameterSweepResultList()
        format_func = ParameterSweepResult
    else:
        ret = list()
        format_func = cluster_dict

    for param_set_id, param in enumerate(parameters):
        ret.append(format_func(result=reducer(mapped_results[param_set_id], parameters=param), parameters=param))

    return ret


def cluster_dict(result, parameters):
    d = dict(result=result, parameters=parameters)
    return ap.Namespace(**d)


class ParameterSweepResult:
    """TODO"""

    def __init__(self, result, parameters):
        self.result = result
        self.parameters = parameters

    def __str__(self):
        return "{0} => {1}".format(self.parameters, self.result)


class ParameterSweepResultList(list):
    def __str__(self):
        l = []
        for i in self:
            l.append(str(i))
        return "[{0}]".format(", ".join(l))


if __name__ == "__main__":

    try:
        import pickle
        import molnsutil.constants as constants
        import os

        with open(constants.job_input_file_name, "rb") as inp:
            unpickled_list = pickle.load(inp)

        mapped_results = unpickled_list['mapped_results']
        params = unpickled_list['parameters']

        with open(constants.pickled_cluster_input_file, "rb") as inp:
            unpickled_cluster_input = pickle.load(inp)
            reducer = unpickled_cluster_input['reducer']

        result = parameter_sweep_run_reducer(reducer=reducer, mapped_results=mapped_results, parameters=params,
                                             cluster_execution=True)

        with open(constants.job_output_file_name, "wb") as output:
            pickle.dump(result, output)

    except Exception as errors:
        import traceback
        with open(constants.job_reducer_error_file_name, "wb") as error:
            error.write(str(errors) + "\n\n" + traceback.format_exc())
