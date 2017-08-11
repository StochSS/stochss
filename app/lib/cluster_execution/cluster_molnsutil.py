import os
from cluster_parameter_sweep import ClusterParameterSweep
from remote_execution import RemoteHost
from cluster_execution_exceptions import IncorrectRemoteHostSpec, ClusterExecutionException
from molns.MolnsLib.constants import Constants
from utils import format_result_list_dict
from molnsutil.utils import builtin_aggregator_sum_and_sum2, builtin_reducer_mean_variance, builtin_aggregator_add, \
    builtin_reducer_mean

remote_host_address = None
remote_host_username = None
remote_host_secret_key_file = os.path.join("/home/ubuntu", Constants.ClusterKeyFileNameOnController)
remote_host_ssh_port = 22


def __verify_remote_parameters():
    if remote_host_address is None:
        raise IncorrectRemoteHostSpec("remote_host_address not set.")

    if remote_host_username is None:
        raise IncorrectRemoteHostSpec("remote_host_username not set.")

    if remote_host_secret_key_file is None or not os.access(remote_host_secret_key_file, os.R_OK):
        raise IncorrectRemoteHostSpec("Please verify remote_host_secret_key_file.")


def get_remote_host():
    __verify_remote_parameters()
    return RemoteHost(ip_address=remote_host_address, username=remote_host_username,
                      secret_key_file=remote_host_secret_key_file, port=remote_host_ssh_port)


class DistributedEnsemble(ClusterParameterSweep):
    """A wrapper class for performing computation on the cluster.
    This API provided here is the same as molnsutil DistributedEnsemble."""

    def __init__(self, model_class, parameters=None, is_parameter_sweep=False, num_engines=None):
        ClusterParameterSweep.__init__(self, model_cls=model_class, parameters=parameters, num_engines=num_engines,
                                       remote_host=get_remote_host(), is_parameter_sweep=is_parameter_sweep)
        self.realizations_storage_dir = None
        self.result_list = None
        self.realizations_job = None

    def add_realizations(self, number_of_trajectories=None):
        """ This method sets the result_list attribute which stores the file-names of the generated realizations on the
        cluster. Also set is realizations_storage_dir is the directory of the generated realizations files. Subsequent
        uses of a DistributedEnsemble object after this method is called will use the generated realizations. """

        if number_of_trajectories is None:
            raise ClusterExecutionException("Number of trajectories cannot be None.")

        self.realizations_job = self.run_async(number_of_trajectories=number_of_trajectories, add_realizations=True)
        print "Generating {0} trajectories...".format(number_of_trajectories)
        import json
        res = json.loads(self.get_results(self.realizations_job, add_realizations=True))
        self.realizations_storage_dir = res["realizations_directory"]
        self.result_list = format_result_list_dict(res["result_list"])
        return res

    def run(self, mapper=None, reducer=None, aggregator=None, store_realizations=False, number_of_trajectories=None):
        """ This method is used to generate realizations, map, aggregate and finally reduce the results. It returns the
        reduced results. All local and remote temporary files are automatically cleaned up. """

        mapper = DistributedEnsemble.__get_mapper(mapper)
        reducer = DistributedEnsemble.__get_reducer(reducer)
        remote_job = self.run_async(mapper=mapper, reducer=reducer, aggregator=aggregator,
                                    store_realizations=store_realizations,
                                    number_of_trajectories=number_of_trajectories)
        print "Waiting for results to be computed..."
        return self.get_results(remote_job)

    def mean_variance(self, mapper=None, number_of_trajectories=None):
        """ Compute the mean and variance (second order central moment) of the function g(X) based on
        number_of_trajectories realizations in the ensemble. Realizations computed on invoking add_realizations are used
        here. Temporary local and remote job files are cleaned up automatically. """

        mapper = DistributedEnsemble.__get_mapper(mapper)

        realizations_storage_directory = self.__get_realizations_storage_directory(
            number_of_trajectories=number_of_trajectories)

        remote_job = self.run_async(mapper=mapper, aggregator=builtin_aggregator_sum_and_sum2,
                                    reducer=builtin_reducer_mean_variance,
                                    realizations_storage_directory=realizations_storage_directory,
                                    result_list=self.result_list)
        print "Waiting for results to be computed..."
        return self.get_results(remote_job)

    def mean(self, mapper=None, number_of_trajectories=None):
        """ Compute the mean of the function g(X) based on number_of_trajectories realizations
            in the ensemble. It has to make sense to say g(result1)+g(result2). Realizations computed on invoking
            add_realizations are used here. Temporary local and remote job files are cleaned up automatically."""

        mapper = DistributedEnsemble.__get_mapper(mapper)

        realizations_storage_directory = self.__get_realizations_storage_directory(
            number_of_trajectories=number_of_trajectories)

        remote_job = self.run_async(mapper=mapper, aggregator=builtin_aggregator_add, reducer=builtin_reducer_mean,
                                    realizations_storage_directory=realizations_storage_directory,
                                    result_list=self.result_list)
        print "Waiting for results to be computed..."
        return self.get_results(remote_job)

    def clean_up_generated_realizations(self):
        """ This method deletes all local and remote temporary files and generated realizations files. """
        if self.realizations_job is not None:
            self.clean_up(remote_job=self.realizations_job)

    def __get_realizations_storage_directory(self, number_of_trajectories=None):
        if self.realizations_storage_dir is None or self.result_list is None:
            raise ClusterExecutionException("Unknown realizations. Please run add_realizations(x) to compute x "
                                            "realizations first.")

        if len(self.result_list[0]) < number_of_trajectories:
            number_of_trajectories_required = number_of_trajectories - len(self.result_list[0])

            print "Generating {0} trajectories...".format(number_of_trajectories_required)

            result_list = self.result_list
            realizations_storage_dir = self.realizations_storage_dir

            self.add_realizations(number_of_trajectories=number_of_trajectories_required)

            self.__combine_into_one_directory(realizations_storage_dir)
            self.__append_to_result_list(result_list)
        else:
            print "Using {0} pre-computed trajectories.".format(len(self.result_list[0]))

        return self.realizations_storage_dir

    def __append_to_result_list(self, result_list):
        for key, value in result_list.iteritems():
            self.result_list[key].extend(result_list[key])

    def __combine_into_one_directory(self, realizations_storage_dir):
        self.cluster_deploy.move_remote_files(remote_job=self.realizations_job,
                                              remote_copy_from_dir=realizations_storage_dir,
                                              remote_copy_to_dir=self.realizations_storage_dir)

    @staticmethod
    def __get_mapper(mapper):
        if mapper is not None:
            return mapper
        else:
            raise ClusterExecutionException("No default mapper available. Please specify one.")

    @staticmethod
    def __get_reducer(reducer):
        if reducer is not None:
            return reducer
        else:
            raise ClusterExecutionException("No default reducer available. Please specify one.")


class ParameterSweep(DistributedEnsemble):
    def __init__(self, model_class=None, parameters=None, num_engines=None):
        DistributedEnsemble.__init__(self, model_class=model_class, parameters=parameters, is_parameter_sweep=True,
                                     num_engines=num_engines)
