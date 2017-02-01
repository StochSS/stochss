import molnsutil.molns_cloudpickle as cloudpickle
import os
import datetime
import constants
import sys
import inspect
import cluster_execution_exceptions
import logging
import shutil
from remote_execution import RemoteJob, create_new_id
from cluster_deploy import ClusterDeploy
from utils import create_pickled_cluster_input_file


class ClusterParameterSweep:

    failed_remote_job = None

    def __init__(self, model_cls, parameters, remote_host, num_engines=None, is_parameter_sweep=True):
        self.model_cls = model_cls
        self.parameters = parameters
        self.remote_host = remote_host
        self.cluster_deploy = ClusterDeploy(remote_host)
        self.job_logs = None
        self.num_engines = num_engines
        self.is_parameter_sweep = is_parameter_sweep

    @staticmethod
    def check_ingredients_to_be_pickled(*ingredients, **kwargs):
        for ingredient in ingredients:
            if ingredient is not None and not ingredient.__module__ == kwargs['module_name']:
                raise cluster_execution_exceptions \
                    .ReferencedModuleException("{0} module is referenced. Due to limitations in Python's pickle module,"
                                               " ClusterParameterSweep requires that all job classes, functions and "
                                               "parameters be defined in the same module as the caller."
                                               .format(ingredient.__module__))

    def run_async(self, mapper=None, aggregator=None, reducer=None, number_of_trajectories=None, result_list=None,
                  store_realizations=True, add_realizations=False, realizations_storage_directory=None):
        """ Creates a new remote_job and deploys it on the cluster. Returns RemoteJob deployed. """

        # Verify that given parameters are not referenced from other modules, as that produces referenced cloudpickling.
        calling_module = inspect.getmodule(inspect.stack()[1][0])
        logging.info("Caller module: {0}".format(calling_module))
        # calling_module_name = calling_module.__name__ if calling_module is not None else None
        # ClusterParameterSweep.check_ingredients_to_be_pickled(self.model_cls, mapper, aggregator, reducer,
        #                                                      module_name=calling_module_name)

        # Create new remote job.
        job_id = create_new_id()

        input_file_dir = os.path.join(constants.ClusterJobsScratchDir, constants.ClusterJobFilePrefix + job_id)
        if not os.path.exists(input_file_dir):
            os.makedirs(input_file_dir)

        # Set input data according to the operation being performed.
        input_data = {'number_of_trajectories': number_of_trajectories, 'params': self.parameters,
                      'store_realizations': store_realizations, 'num_engines': self.num_engines,
                      'is_parameter_sweep': self.is_parameter_sweep}
        if add_realizations is True:
            input_data['add_realizations'] = True
        if realizations_storage_directory is not None:
            input_data["result_list"] = result_list
            input_data['realizations_storage_directory'] = realizations_storage_directory

        # Write job input file.
        input_file_path = os.path.join(input_file_dir, constants.ClusterExecInputFile)
        with open(input_file_path, "wb") as input_file:
            cloudpickle.dump(input_data, input_file)

        # Create pickled_cluster_input_file.
        pickled_cluster_input_file = os.path.join(input_file_dir, constants.PickledClusterInputFile)
        create_pickled_cluster_input_file(storage_path=pickled_cluster_input_file, mapper=mapper,
                                          aggregator=aggregator,
                                          model_class=self.model_cls, reducer=reducer)

        remote_job = RemoteJob(input_files=[input_file_path, pickled_cluster_input_file],
                               is_parameter_sweep=self.is_parameter_sweep,
                               date=str(datetime.datetime.now()), remote_host=self.remote_host, remote_job_id=job_id,
                               local_scratch_dir=input_file_dir, num_engines=self.num_engines)

        # Deploy remote job.
        self.cluster_deploy.deploy_job_to_cluster(remote_job)

        logging.info("Deployed\n{0}".format(str(remote_job)))

        return remote_job

    def fetch_debug_logs(self):
        """ Fetch the debug logs of a failed RemoteJob."""
        if ClusterParameterSweep.failed_remote_job is None:
            raise cluster_execution_exceptions.ClusterExecutionException("Something went wrong. Unknown failed remote "
                                                                         "job.")
        return self.cluster_deploy.get_job_debug_logs(ClusterParameterSweep.failed_remote_job)

    def get_sweep_result(self, remote_job, add_realizations=False):
        """ Returns job results if computed successfully. """
        job_status = self.cluster_deploy.job_status(remote_job)

        if job_status == constants.RemoteJobRunning:
            raise cluster_execution_exceptions.RemoteJobNotFinished("The parameter sweep has not finished yet.")

        if job_status == constants.RemoteJobFailed:
            self.job_logs = self.cluster_deploy.get_job_logs(remote_job)
            ClusterParameterSweep.failed_remote_job = remote_job
            raise cluster_execution_exceptions.RemoteJobFailed("Failed to perform task. Logs:\n{0}"
                                                               "\nUse function fetch_debug_logs() to fetch the debug "
                                                               "logs.".format(self.job_logs))

        if remote_job.local_scratch_dir is None:
            raise cluster_execution_exceptions.UnknownScratchDir("The job has finished. However, the local "
                                                                 "scratch directory is unknown for this job. Unable to "
                                                                 "fetch results.")

        self.cluster_deploy.fetch_remote_job_file(remote_job, constants.ClusterExecOutputFile,
                                                  remote_job.local_scratch_dir)

        if add_realizations is False:
            ret_val = cloudpickle.load(os.path.join(remote_job.local_scratch_dir, constants.ClusterExecOutputFile))
        else:
            with open(os.path.join(remote_job.local_scratch_dir, constants.ClusterExecOutputFile), "r") as f:
                ret_val = f.read()

        # Clear out scratch directory entries.
        logging.info("Clearing out local scratch directory: {0}".format(remote_job.local_scratch_dir))
        shutil.rmtree(remote_job.local_scratch_dir)

        return ret_val

    def clean_up(self, remote_job):
        self.cluster_deploy.clean_up(remote_job)

    def get_results(self, remote_job, add_realizations=False):
        import time
        while True:
            try:
                results = self.get_sweep_result(remote_job, add_realizations=add_realizations)
                if add_realizations is False:
                    self.clean_up(remote_job)
                return results
            except cluster_execution_exceptions.RemoteJobNotFinished:
                time.sleep(1)

    # Unused, but may be useful in the future.
    @staticmethod
    def __get_module_files_required(*check_objs):
        modules_files = set()

        for check_obj in check_objs:
            if check_obj is None:
                continue
            m = check_obj.__module__
            module_file = os.path.abspath(inspect.getsourcefile(sys.modules[m]))
            if not os.access(module_file, os.R_OK):
                raise cluster_execution_exceptions.ModuleFileNotReadable("Cannot read module file {0}"
                                                                         .format(module_file))
            modules_files.add(module_file)

        return modules_files
