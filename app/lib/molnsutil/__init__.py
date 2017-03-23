import itertools
import math
import os
import pickle
import uuid
import logging
import constants
import molns_cloudpickle as cloudpickle
from parameter_sweep_run_reducer import parameter_sweep_run_reducer
from map_and_aggregate import map_and_aggregate
from molns_exceptions import MolnsUtilException
from run_ensemble import run_ensemble
from run_ensemble_map_aggregate import run_ensemble_map_and_aggregate
from storage_providers import SharedStorage, PersistentStorage
from utils import Log, clean_up, update_progressbar, display_progressbar, builtin_reducer_mean, generate_seed_base, \
    builtin_aggregator_list_append, builtin_reducer_default, builtin_aggregator_sum_and_sum2, builtin_aggregator_add, \
    builtin_reducer_mean_variance, get_unpickled_result, jsonify

"""
  Utility module for MOLNs.

  molnsutil contains implementations of a persistent storage API for
  staging objects to an Object Store in the clouds supported by MOLNs.
  This can be used in MOLNs to write variables that are persistent
  between sessions, provides a convenient way to get data out of the
  system, and it also provides a means during parallel computations to
  stage data so that it is visible to all compute engines, in contrast
  to using the local scratch space on the engines.

  molnsutil also contains parallel implementations of common Monte Carlo
  computational workflows, such as the generation of ensembles and
  estimation of moments.

  Molnsutil will work for any object that is serializable (e.g. with
  pickle) and that has a run() function with the arguments 'seed' and
  'number_of_trajectories'.  Example:

   class MyClass():
       def run(seed, number_of_trajectories):
           # return an object or list

  Both the class and the results return from run() must be pickle-able.

"""


class DistributedEnsemble:
    """ A class to provide an API for execution of a distributed ensemble. """

    def __init__(self, model_class=None, parameters=None, qsub=False, client=None, num_engines=None, storage_mode=None,
                 pickled_cluster_input_file=None, log_filename=None):
        """ Constructor """

        self.my_class_name = 'DistributedEnsemble'
        self.log = Log(log_filename=log_filename)

        if model_class is None and pickled_cluster_input_file is None:
            self.log.write_log("Invalid configuration. Either provide a model class object or its pickled file.",
                               logging.ERROR)
            raise MolnsUtilException("Invalid configuration. Either provide a model class object or its pickled file.")

        if model_class is not None and pickled_cluster_input_file is not None:
            self.log.write_log("Invalid configuration. Both a model class and a pickled file are provided.",
                               logging.ERROR)
            raise MolnsUtilException("Invalid configuration. Both a model class and a pickled file are provided.")

        if model_class is not None:
            self.cluster_execution = False
            self.model_class = cloudpickle.dumps(model_class)
        else:
            self.cluster_execution = True
            self.pickled_cluster_input_file = pickled_cluster_input_file

        # Not checking here for parameters = None, as they could be present in the model class.
        self.parameters = [parameters]
        self.number_of_trajectories = 0
        self.seed_base = generate_seed_base()
        self.storage_mode = storage_mode
        # A chunk list
        self.result_list = {}
        self.qsub = qsub
        self.num_engines = num_engines

        if self.qsub is False:
            # Set the Ipython.parallel client
            self._update_client(client)

    # --------------------------
    def save_state(self, name):
        """ Serialize the state of the ensemble, for persistence beyond memory."""
        state = {'model_class': self.model_class, 'parameters': self.parameters,
                 'number_of_trajectories': self.number_of_trajectories, 'seed_base': self.seed_base,
                 'result_list': self.result_list, 'storage_mode': self.storage_mode}
        if not os.path.isdir('.molnsutil'):
            os.makedirs('.molnsutil')
        with open('.molnsutil/{1}-{0}'.format(name, self.my_class_name)) as fd:
            pickle.dump(state, fd)

    def load_state(self, name):
        """ Recover the state of an ensemble from a previous save. """
        with open('.molnsutil/{1}-{0}'.format(name, self.my_class_name)) as fd:
            state = pickle.load(fd)
        if state['model_class'] is not self.model_class:
            self.log.write_log("Can only load state of a class that is identical to the original class", logging.ERROR)
            raise MolnsUtilException("Can only load state of a class that is identical to the original class")
        self.parameters = state['parameters']
        self.number_of_trajectories = state['number_of_trajectories']
        self.seed_base = state['seed_base']
        self.result_list = state['result_list']
        self.storage_mode = state['storage_mode']

    def _set_pparams_paramsetids_presultlist(self, num_chunks, pparams, param_set_ids, presult_list=None,
                                             chunk_size=None):
        if not isinstance(pparams, list) or not isinstance(param_set_ids, list) or \
                (presult_list is not None and not isinstance(presult_list, list)) or \
                (presult_list is not None and chunk_size is None):
            self.log.write_log("Unexpected arguments. Require pparams, param_set_ids (and presult_list) to be of type "
                               "list. chunk_size cannot be None if presult_list is not None.", logging.ERROR)
            raise MolnsUtilException("Unexpected arguments. Require pparams, param_set_ids (and presult_list) to be of "
                                     "type list. chunk_size cannot be None if presult_list is not None.")
        if self.parameters is None:
            raise MolnsUtilException("self.parameters is None. I don't know (yet) how to proceed.")

        for ide, param in enumerate(self.parameters):
            param_set_ids.extend([ide] * num_chunks)
            pparams.extend([param] * num_chunks)
            if presult_list is not None:
                for i in range(num_chunks):
                    presult_list.append(self.result_list[ide][i * chunk_size:(i + 1) * chunk_size])

    def _get_seed_list(self, num, number_of_trajectories, chunk_size):
        seed_list = []
        for _ in range(num):
            # need to do it this way cause the number of run per chunk might not be even
            seed_list.extend(range(self.seed_base, self.seed_base + number_of_trajectories, chunk_size))
            self.seed_base += number_of_trajectories
        return seed_list

    def _ipython_map_aggregate_stored_realizations(self, mapper, aggregator=None, cache_results=False, divid=None,
                                                   chunk_size=None):

        self.log.write_log("Running mapper & aggregator on the result objects (number of results={0}, chunk size={1})"
                           .format(self.number_of_trajectories * len(self.parameters), chunk_size))

        # chunks per parameter
        num_chunks = int(math.ceil(self.number_of_trajectories / float(chunk_size)))
        chunks = [chunk_size] * (num_chunks - 1)
        chunks.append(self.number_of_trajectories - chunk_size * (num_chunks - 1))
        # total chunks
        pchunks = chunks * len(self.parameters)
        num_pchunks = num_chunks * len(self.parameters)
        pparams = []
        param_set_ids = []
        presult_list = []
        self._set_pparams_paramsetids_presultlist(num_chunks, pparams, param_set_ids, presult_list, chunk_size)

        results = self.lv.map_async(map_and_aggregate, presult_list, param_set_ids, [mapper] * num_pchunks,
                                    [aggregator] * num_pchunks, [cache_results] * num_pchunks)

        mapped_results = {}
        self._set_ipython_mapped_results(mapped_results, results, divid)

        return mapped_results

    def qsub_map_aggregate_stored_realizations(self, **kwargs):
        realizations_storage_directory = kwargs['realizations_storage_directory']
        self.result_list = kwargs.get("result_list", self.result_list)
        number_of_trajectories = self.number_of_trajectories if self.number_of_trajectories is not 0 \
            else len(self.result_list)
        chunk_size = kwargs.get('chunk_size', self._determine_chunk_size(number_of_trajectories))

        if self.parameters is None:
            raise MolnsUtilException("self.parameters is None. I don't know how to proceed.")

        self.log.write_log("Running mapper & aggregator on the result objects (number of results={0}, chunk size={1})"
                           .format(number_of_trajectories * len(self.parameters), chunk_size))

        counter = 0
        random_string = str(uuid.uuid4())
        if not os.path.isdir(realizations_storage_directory):
            self.log.write_log("Directory {0} does not exist.".format(realizations_storage_directory), logging.ERROR)
            raise MolnsUtilException("Directory {0} does not exist.".format(realizations_storage_directory))

        base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "temp_" + random_string)
        job_name_prefix = "ps_job_" + random_string[:8] + "_"
        dirs = []
        containers = []

        # chunks per parameter TODO is number_of_trajectories correct here?
        self.log.write_log("Number of trajectories: {0}".format(number_of_trajectories))
        num_chunks = int(math.ceil(number_of_trajectories / float(chunk_size)))
        chunks = [chunk_size] * (num_chunks - 1)
        chunks.append(number_of_trajectories - chunk_size * (num_chunks - 1))
        # total chunks
        pparams = []
        param_set_ids = []
        presult_list = []
        self._set_pparams_paramsetids_presultlist(num_chunks, pparams, param_set_ids, presult_list, chunk_size)

        for result, pndx in zip(presult_list, param_set_ids):
            # create temp directory for this job.
            job_name = job_name_prefix + str(counter)
            temp_job_directory = os.path.join(base_dir, job_name + "/")
            if not os.path.exists(temp_job_directory):
                os.makedirs(temp_job_directory)

            # copy pre-computed realizations to working directory.
            import shutil
            for i, filename in enumerate(result):
                shutil.copyfile(os.path.join(realizations_storage_directory, filename),
                                os.path.join(temp_job_directory, filename))

            if self.cluster_execution is False:
                unpickled_list = dict(result=result, pndx=pndx, mapper=kwargs['mapper'],
                                      aggregator=kwargs['aggregator'], cache_results=False)
            else:
                unpickled_list = dict(result=result, pndx=pndx, cache_results=False,
                                      pickled_cluster_input_file=kwargs['pickled_cluster_input_file'])

            self._submit_qsub_job(constants.map_and_aggregate_job_file, job_name, unpickled_list, containers, dirs,
                                  temp_job_directory)

            counter += 1

        keep_dirs = self._wait_for_all_results_to_return(wait_for_dirs=dirs, divid=kwargs.get('divid', False))

        remove_dirs = [directory for directory in dirs if directory not in keep_dirs]
        mapped_results = {}
        self._set_qsub_mapped_results(remove_dirs, mapped_results)

        self.log.write_log("Cleaning up job directory {0}".format(base_dir))

        # remove temporary files and finished containers. Keep all files that record errors.
        dirs_to_delete = remove_dirs
        if len(keep_dirs) == 0:
            dirs_to_delete = [base_dir]

        clean_up(dirs_to_delete=dirs_to_delete, containers_to_delete=containers)

        return mapped_results

    def _ipython_run_ensemble_map_aggregate(self, mapper, number_of_trajectories=None, chunk_size=None, divid=None,
                                            aggregator=None):

        # If we don't store the realizations (or use the stored ones)
        self.log.write_log("Generating {0} realizations of the model, running mapper & aggregator (chunk size={1})"
                           .format(number_of_trajectories, chunk_size))

        # chunks per parameter
        num_chunks = int(math.ceil(number_of_trajectories / float(chunk_size)))
        chunks = [chunk_size] * (num_chunks - 1)
        chunks.append(number_of_trajectories - chunk_size * (num_chunks - 1))
        # total chunks
        pchunks = chunks * len(self.parameters)
        num_pchunks = num_chunks * len(self.parameters)

        pparams = []
        param_set_ids = []
        self._set_pparams_paramsetids_presultlist(num_chunks, pparams, param_set_ids)

        seed_list = self._get_seed_list(len(self.parameters), number_of_trajectories, chunk_size)

        results = self.lv.map_async(run_ensemble_map_and_aggregate, [self.model_class] * num_pchunks, pparams,
                                    param_set_ids, seed_list, pchunks, [mapper] * num_pchunks,
                                    [aggregator] * num_pchunks)

        mapped_results = {}
        self._set_ipython_mapped_results(mapped_results, results, divid)

        return mapped_results

    def _wait_for_all_results_to_return(self, wait_for_dirs, progress_bar=False, divid=None):
        """ Wait for all jobs to complete. Return list of directories whose corresponding jobs finished
        unsuccessfully."""

        import time
        timer_start = time.time()
        dirs = wait_for_dirs[:]
        completed_jobs = 0
        successful_jobs = 0
        keep_dirs = []
        total_jobs = len(dirs)

        self.log.write_log("Awaiting all results. Job directories:\n{0}".format(wait_for_dirs))

        while len(dirs) > 0:
            for directory in dirs:
                output_file = os.path.join(directory, constants.job_output_file_name)
                completed_file = os.path.join(directory, constants.job_complete_file_name)
                error_file_map_aggregate = os.path.join(directory, constants.job_error_file_name)
                error_file_run_ensemble = os.path.join(directory, constants.job_run_ensemble_error_file_name)
                error_file_reducer = os.path.join(directory, constants.job_reducer_error_file_name)

                if os.path.exists(output_file):
                    dirs.remove(directory)
                    successful_jobs += 1
                    completed_jobs += 1

                if os.path.exists(error_file_map_aggregate):
                    with open(error_file_map_aggregate, 'r') as ef:
                        error_msg = ef.read()
                    self.log.write_log(error_msg, logging.ERROR)
                    raise MolnsUtilException(jsonify(completed_jobs=completed_jobs,
                                                     successful_jobs=successful_jobs,
                                                     total_jobs=total_jobs,
                                                     failed_job_working_directory=directory,
                                                     logs=error_msg, job_directories=wait_for_dirs))

                elif os.path.exists(error_file_reducer):
                    with open(error_file_reducer, 'r') as ef:
                        error_msg = ef.read()
                    self.log.write_log(error_msg, logging.ERROR)
                    raise MolnsUtilException(jsonify(completed_jobs=completed_jobs,
                                                     successful_jobs=successful_jobs,
                                                     total_jobs=total_jobs,
                                                     failed_job_working_directory=directory,
                                                     logs=error_msg, job_directories=wait_for_dirs))

                elif os.path.exists(error_file_run_ensemble):
                    with open(error_file_run_ensemble, 'r') as ef:
                        error_msg = ef.read()
                    self.log.write_log(error_msg, logging.ERROR)
                    raise MolnsUtilException(jsonify(completed_jobs=completed_jobs,
                                                     successful_jobs=successful_jobs,
                                                     total_jobs=total_jobs,
                                                     failed_job_working_directory=directory,
                                                     logs=error_msg, job_directories=wait_for_dirs))

                elif os.path.exists(completed_file):
                    if os.path.exists(output_file):  # There could be a race condition here.
                        continue
                    keep_dirs.append(directory)
                    dirs.remove(directory)
                    completed_jobs += 1

                if divid is not None and progress_bar is True:
                    update_progressbar(divid, completed_jobs, total_jobs)
            time.sleep(1)
            timer_current = time.time()
            if timer_current - timer_start > constants.MaxJobTimeInSeconds:
                self.log.write_log("Job timed out. Time out period is {0} seconds."
                                   .format(constants.MaxJobTimeInSeconds), logging.ERROR)
                raise MolnsUtilException(jsonify(completed_jobs=completed_jobs,
                                                 successful_jobs=successful_jobs,
                                                 total_jobs=total_jobs,
                                                 logs="Job timed out.", job_directories=wait_for_dirs))

        if completed_jobs > successful_jobs:
            self.log.write_log("Jobs did not complete successfully. Their working directories will not be deleted.",
                               logging.ERROR)

        return keep_dirs

    def _submit_qsub_job(self, job_program_file, job_name, job_input, containers, dirs, temp_job_directory):
        import shutil
        from subprocess import Popen

        pickled_cluster_input_file = job_input['pickled_cluster_input_file']

        # write input file for qsub job.
        with open(os.path.join(temp_job_directory, constants.job_input_file_name), "wb") as input_file:
            cloudpickle.dump(job_input, input_file)
        if self.cluster_execution is True:
            shutil.copyfile(pickled_cluster_input_file, os.path.join(temp_job_directory,
                                                                     constants.pickled_cluster_input_file))

        # write job program file.
        shutil.copyfile(job_program_file, os.path.join(temp_job_directory, constants.qsub_job_name))

        # append to list of related job containers
        containers.append(job_name)
        # invoke qsub to start container with same name as job_name
        Popen(['qsub', '-d', temp_job_directory, '-N', job_name, constants.qsub_file], shell=False)

        # append to list of related job directories
        dirs.append(temp_job_directory)

    @staticmethod
    def _set_qsub_mapped_results(directories, mapped_results):
        for directory in directories:
            unpickled_result = get_unpickled_result(directory)
            param_set_id = unpickled_result['param_set_id']
            if param_set_id not in mapped_results:
                mapped_results[param_set_id] = []
            if type(unpickled_result['result']) is list:
                mapped_results[param_set_id].extend(
                    unpickled_result['result'])  # if a list is returned, extend that list
            else:
                mapped_results[param_set_id].append(unpickled_result['result'])

    @staticmethod
    def _set_ipython_mapped_results(mapped_results, results, divid=None):
        # We process the results as they arrive.
        for i, rset in enumerate(results):
            param_set_id = rset['param_set_id']
            r = rset['result']
            if param_set_id not in mapped_results:
                mapped_results[param_set_id] = []
            if type(r) is type([]):
                mapped_results[param_set_id].extend(r)  # if a list is returned, extend that list
            else:
                mapped_results[param_set_id].append(r)
            if divid is not None:
                update_progressbar(divid, i, len(results))

    def _qsub_run_ensemble_map_aggregate(self, **kwargs):
        counter = 0
        random_string = str(uuid.uuid4())
        base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "temp_" + random_string)
        job_name_prefix = "ps_job_" + random_string[:8] + "_"
        dirs = []
        containers = []
        number_of_trajectories = kwargs['number_of_trajectories']
        chunk_size = kwargs['chunk_size']

        self.log.write_log("Generating {0} realizations of the model, running mapper & aggregator (chunk size={1})"
                           .format(number_of_trajectories, chunk_size))

        if self.cluster_execution is False:
            if kwargs['aggregator'] is None:
                aggregator = builtin_aggregator_list_append
            else:
                aggregator = kwargs['aggregator']

        if not os.path.exists(base_dir):
            os.makedirs(base_dir)

        num_chunks = int(math.ceil(number_of_trajectories / float(chunk_size)))
        seed_list = self._get_seed_list(len(self.parameters), number_of_trajectories, chunk_size)
        pparams = []
        param_set_ids = []
        self._set_pparams_paramsetids_presultlist(num_chunks=num_chunks, pparams=pparams, param_set_ids=param_set_ids)

        for pndx, pset, seed in zip(param_set_ids, pparams, seed_list):
            if self.cluster_execution is False:
                unpickled_list = dict(chunk_size=chunk_size, seed=seed, model_cls=self.model_class,
                                      mapper=kwargs['mapper'], aggregator=aggregator, pset=pset, pndx=pndx)
            else:
                unpickled_list = dict(chunk_size=chunk_size, seed=seed,
                                      pickled_cluster_input_file=kwargs['pickled_cluster_input_file'], pset=pset,
                                      pndx=pndx)

            job_name = job_name_prefix + str(counter)

            # create temp directory for this job.
            temp_job_directory = os.path.join(base_dir, job_name + "/")
            if not os.path.exists(temp_job_directory):
                os.makedirs(temp_job_directory)

            self._submit_qsub_job(constants.run_ensemble_map_and_aggregate_job_file, job_name, unpickled_list,
                                  containers,
                                  dirs, temp_job_directory)

            counter += 1

        keep_dirs = self._wait_for_all_results_to_return(wait_for_dirs=dirs,
                                                         progress_bar=kwargs.get('progress_bar', False),
                                                         divid=kwargs.get('divid', None))

        # Process only the results successfully computed into a format compatible with self.run_reducer.
        remove_dirs = [directory for directory in dirs if directory not in keep_dirs]
        mapped_results = {}
        self._set_qsub_mapped_results(remove_dirs, mapped_results)

        self.log.write_log("Cleaning up. Job directory: {0}".format(base_dir))

        # remove temporary files and finished containers. Keep all files that record errors.
        dirs_to_delete = remove_dirs
        if len(keep_dirs) == 0:
            dirs_to_delete = [base_dir]

        clean_up(dirs_to_delete=dirs_to_delete, containers_to_delete=containers)

        return mapped_results

    def run_reducer(self, **kwargs):
        """ Inside the run() function, apply the reducer to all of the mapped-aggregated result values. """
        if self.qsub is False:
            reducer = kwargs['reducer']
            mapped_results = kwargs['mapped_results']
            return reducer(mapped_results[0], parameters=self.parameters[0])
        else:
            import shutil
            import subprocess
            random_string = str(uuid.uuid4())
            temp_job_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), "tmpRed_" + random_string)

            # Create temp_job_directory.
            if not os.path.exists(temp_job_directory):
                os.makedirs(temp_job_directory)

            unpickled_inp = dict(mapped_results=kwargs['mapped_results'], parameters=self.parameters)

            input_file_path = os.path.join(temp_job_directory, constants.reduce_input_file_name)
            # Write input file
            with open(input_file_path, "wb") as input_file:
                cloudpickle.dump(unpickled_inp, input_file)

            # Copy input files to working directory.
            shutil.copyfile(kwargs['pickled_cluster_input_file'], os.path.join(temp_job_directory,
                                                                               constants.pickled_cluster_input_file))
            shutil.copyfile(input_file_path, os.path.join(temp_job_directory, constants.job_input_file_name))

            # Copy library scripts to working directory.
            shutil.copyfile(constants.parameter_sweep_run_reducer_shell_script,
                            os.path.join(temp_job_directory, os.path.basename(
                                constants.parameter_sweep_run_reducer_shell_script)))
            shutil.copyfile(constants.parameter_sweep_run_reducer_pyfile,
                            os.path.join(temp_job_directory, os.path.basename(
                                constants.parameter_sweep_run_reducer_pyfile)))

            reduce_script_file = os.path.join(temp_job_directory, os.path.basename(
                constants.parameter_sweep_run_reducer_shell_script))
            container_name = os.path.basename(temp_job_directory)

            # Invoke parameter_sweep_run_reducer.
            subprocess.call("bash {0} {1} {2}".format(reduce_script_file, container_name, temp_job_directory),
                            shell=True)

            self._wait_for_all_results_to_return([temp_job_directory])

            with open(os.path.join(temp_job_directory, constants.job_output_file_name), "r") as of:
                result = of.read()

            # Remove job directory and container.
            clean_up([temp_job_directory], [container_name])

            return result

    def _ipython_generate_and_store_realisations(self, num_pchunks, pparams, param_set_ids, seed_list, pchunks,
                                                 divid=None, progress_bar=False):
        if self.storage_mode is None:
            raise MolnsUtilException("Storage mode is None. Cannot store realizations; aborting.")

        results = self.lv.map_async(run_ensemble, [self.model_class] * num_pchunks, pparams, param_set_ids, seed_list,
                                    pchunks, [self.storage_mode] * num_pchunks)

        # We process the results as they arrive.
        for i, ret in enumerate(results):
            r = ret['filenames']
            param_set_id = ret['param_set_id']
            if param_set_id not in self.result_list:
                self.result_list[param_set_id] = []
            self.result_list[param_set_id].extend(r)
            if divid is not None and progress_bar is not False:
                update_progressbar(divid, i, len(results))

        return {'wall_time': results.wall_time, 'serial_time': results.serial_time}

    def _qsub_generate_and_store_realizations(self, pparams, param_set_ids, seed_list, pchunks, divid=None,
                                              progress_bar=False):
        counter = 0
        random_string = str(uuid.uuid4())

        base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "realizations_" + random_string)

        job_name_prefix = "ps_job_" + random_string[:8] + "_"
        dirs = []
        containers = []
        job_param_ids = {}

        if not os.path.exists(base_dir):
            os.makedirs(base_dir)

        if self.storage_mode is not constants.local_storage:
            self.log.write_log("Storage mode must be local while using qsub.", logging.ERROR)
            raise MolnsUtilException("Storage mode must be local while using qsub.")

        for pndx, pset, seed, pchunk in zip(param_set_ids, pparams, seed_list, pchunks):
            if self.cluster_execution is True:
                unpickled_list = dict(pchunk=pchunk, seed=seed,
                                      pickled_cluster_input_file=self.pickled_cluster_input_file,
                                      pset=pset, pndx=pndx, storage_mode=constants.local_storage)
            else:
                unpickled_list = dict(pchunk=pchunk, seed=seed,
                                      model_class=self.model_class, pset=pset, pndx=pndx,
                                      storage_mode=constants.local_storage)

            job_name = job_name_prefix + str(counter)

            # create temp directory for this job.
            temp_job_directory = os.path.join(base_dir, job_name + "/")
            if not os.path.exists(temp_job_directory):
                os.makedirs(temp_job_directory)

            self._submit_qsub_job(constants.run_ensemble_job_file, job_name, unpickled_list, containers, dirs,
                                  temp_job_directory)

            job_param_ids[pndx] = temp_job_directory
            counter += 1

        keep_dirs = self._wait_for_all_results_to_return(wait_for_dirs=dirs, divid=divid, progress_bar=progress_bar)

        remove_dirs = [directory for directory in dirs if directory not in keep_dirs]
        for i, directory in enumerate(remove_dirs):
            unpickled_result = get_unpickled_result(directory)
            r = unpickled_result['filenames']
            param_set_id = unpickled_result['param_set_id']
            if param_set_id not in self.result_list:
                self.result_list[param_set_id] = []
            self.result_list[param_set_id].extend(r)

        self.log.write_log("Cleaning up. Job directory: {0}".format(base_dir))

        # Arrange for generated files to be available in a known location - base_dir.
        DistributedEnsemble.__post_process_generated_ensemble(remove_dirs, base_dir)

        # Delete job containers and directories. Preserve base_dir as it contains computed realizations.
        clean_up(dirs_to_delete=remove_dirs, containers_to_delete=containers)

        return jsonify(realizations_directory=base_dir, result_list=self.result_list)

    @staticmethod
    def __post_process_generated_ensemble(directories, base_dir):
        import shutil
        for directory in directories:
            files_in_this_directory = os.listdir(directory)
            for f in files_in_this_directory:
                if utils.is_generated_realizations_file(f):
                    # copy file to parent directory.
                    shutil.copyfile(os.path.join(directory, f), os.path.join(base_dir, f))
                    break

    def add_realizations(self, number_of_trajectories=None, chunk_size=None, progress_bar=False):
        """ Add a number of realizations to the ensemble. """

        if number_of_trajectories is None:
            self.log.write_log("No number_of_trajectories specified", logging.ERROR)
            raise MolnsUtilException("No number_of_trajectories specified")
        if type(number_of_trajectories) is not int:
            self.log.write_log("number_of_trajectories must be an integer. Provided type: {0}"
                               .format(type(number_of_trajectories)), logging.ERROR)
            raise MolnsUtilException("number_of_trajectories must be an integer. Provided type: {0}".format(
                    type(number_of_trajectories)))

        if chunk_size is None:
            chunk_size = self._determine_chunk_size(number_of_trajectories)

        if not self.log.verbose:
            progress_bar = False
        else:
            if len(self.parameters) > 1:
                self.log.write_log(
                    "Generating {0} realizations of the model at {1} parameter points (chunk size={2})".format(
                        number_of_trajectories, len(self.parameters), chunk_size))
            else:
                self.log.write_log(
                    "Generating {0} realizations of the model (chunk size={1})".format(number_of_trajectories,
                                                                                       chunk_size))
        divid = None
        if progress_bar:
            divid = display_progressbar()

        self.number_of_trajectories += number_of_trajectories

        num_chunks = int(math.ceil(number_of_trajectories / float(chunk_size)))
        chunks = [chunk_size] * (num_chunks - 1)
        chunks.append(number_of_trajectories - chunk_size * (num_chunks - 1))
        # total chunks
        pchunks = chunks * len(self.parameters)
        num_pchunks = num_chunks * len(self.parameters)
        pparams = []
        param_set_ids = []
        self._set_pparams_paramsetids_presultlist(num_chunks, pparams, param_set_ids)
        seed_list = self._get_seed_list(len(self.parameters), number_of_trajectories, chunk_size)

        if self.qsub is False:
            return self._ipython_generate_and_store_realisations(num_pchunks, pparams, param_set_ids, seed_list,
                                                                 pchunks, divid, progress_bar=progress_bar)
        else:
            return self._qsub_generate_and_store_realizations(pparams, param_set_ids, seed_list, pchunks, divid,
                                                              progress_bar=progress_bar)

    def _update_client(self, client=None):
        if client is None:
            import IPython.parallel
            self.c = IPython.parallel.Client()
        else:
            self.c = client
        self.c[:].use_dill()
        if self.num_engines is None:
            self.lv = self.c.load_balanced_view()
            self.num_engines = len(self.c.ids)
        else:
            max_num_engines = len(self.c.ids)
            if self.num_engines > max_num_engines:
                self.num_engines = max_num_engines
                self.lv = self.c.load_balanced_view()
            else:
                engines = self.c.ids[:self.num_engines]
                self.lv = self.c.load_balanced_view(engines)

        # Set the number of times a failed task is retried. This makes it possible to recover
        # from engine failure.
        self.lv.retries = 3

    def _determine_chunk_size(self, number_of_trajectories):
        """ Determine a optimal chunk size. """
        self.log.write_log("self.num_engines = {0}, type(self.engines) = {1}, self.num_engines == 'None' = {2}".format(
            self.num_engines, type(self.num_engines), self.num_engines == 'None'))

        if self.num_engines is None or self.num_engines == 'None':
            self.log.write_log("self.num_engines is None, returning chunk_size = 1")
            return 1
        return int(max(1, round(number_of_trajectories / float(self.num_engines))))

    def _clear_cache(self):
        """ Remove all cached result objects on the engines. """
        pass
        # TODO

    def delete_realizations(self):
        """ Delete realizations from the storage. """
        # TODO local storage deletion

        if self.storage_mode is None:
            return
        elif self.storage_mode == "Shared":
            ss = SharedStorage()
        elif self.storage_mode == "Persistent":
            ss = PersistentStorage()

        for param_set_id in self.result_list:
            for filename in self.result_list[param_set_id]:
                try:
                    ss.delete(filename)
                except OSError as e:
                    pass

    def __del__(self):
        """ Destructor. """
        try:
            self.delete_realizations()
        except Exception as e:
            pass

            # --------------------------

    # MAIN FUNCTION
    # --------------------------
    def run(self, **kwargs):
        """ Main entry point """

        self.log.verbose = False
        divid = None

        if self.cluster_execution is False:
            if not kwargs.get('reducer', False) or kwargs.get('reducer') is None:
                reducer = builtin_reducer_default
            else:
                reducer = kwargs['reducer']

            if not kwargs.get('verbose', False):
                self.log.verbose = False
            else:
                self.log.verbose = kwargs['verbose']

            if not kwargs.get('progress_bar', False):
                pass
            elif kwargs['progress_bar'] is True:
                divid = display_progressbar()

            if not kwargs.get('cache_results'):
                cache_results = False
            else:
                cache_results = kwargs['cache_results']

        if not kwargs.get('number_of_trajectories', False) and self.number_of_trajectories == 0:
            raise MolnsUtilException("number_of_trajectories is zero")

        number_of_trajectories = kwargs['number_of_trajectories']
        if number_of_trajectories is None:
            raise MolnsUtilException("Number of trajectories provided is None.")

        if not kwargs.get('store_realizations', False):
            store_realizations = False
        else:
            store_realizations = True

        if not kwargs.get('chunk_size', False):
            chunk_size = self._determine_chunk_size(self.number_of_trajectories)
        else:
            chunk_size = kwargs['chunk_size']

        if not kwargs.get('store_realizations_dir', False):
            store_realizations_dir = None
        else:
            store_realizations_dir = kwargs['store_realizations_dir']

        if store_realizations:
            generated_realizations = None
            # Run simulations
            if self.number_of_trajectories < number_of_trajectories:
                generated_realizations = self.add_realizations(number_of_trajectories - self.number_of_trajectories,
                                                               chunk_size=chunk_size)

            if self.qsub is False:
                mapped_results = self._ipython_map_aggregate_stored_realizations(mapper=kwargs['mapper'], divid=divid,
                                                                                 aggregator=kwargs['aggregator'],
                                                                                 cache_results=cache_results,
                                                                                 chunk_size=chunk_size)
            else:
                import json
                realizations_storage_directory = json.loads(generated_realizations)['realizations_directory']
                if store_realizations_dir is not None:
                    # Copy realizations from temporary working directory to job directory.
                    realizations_storage_directory = utils.copy_generated_realizations_to_job_directory(
                        realizations_storage_directory=realizations_storage_directory,
                        store_realizations_dir=store_realizations_dir)

                if self.cluster_execution is False:
                    mapped_results = self.qsub_map_aggregate_stored_realizations(mapper=kwargs['mapper'],
                                                                                 aggregator=kwargs['aggregator'],
                                                                                 chunk_size=chunk_size,
                                                                                 realizations_storage_directory=
                                                                                 realizations_storage_directory)
                else:
                    mapped_results = self.qsub_map_aggregate_stored_realizations(pickled_cluster_input_file=
                                                                                 self.pickled_cluster_input_file,
                                                                                 chunk_size=chunk_size,
                                                                                 realizations_storage_directory=
                                                                                 realizations_storage_directory)
        else:
            if self.qsub is False:
                mapped_results = self._ipython_run_ensemble_map_aggregate(mapper=kwargs['mapper'],
                                                                          aggregator=kwargs['aggregator'],
                                                                          chunk_size=chunk_size,
                                                                          number_of_trajectories=number_of_trajectories,
                                                                          divid=divid)

            else:
                if self.cluster_execution is False:
                    mapped_results = self._qsub_run_ensemble_map_aggregate(mapper=kwargs['mapper'], divid=divid,
                                                                           number_of_trajectories=
                                                                           number_of_trajectories,
                                                                           chunk_size=chunk_size,
                                                                           aggregator=kwargs['aggregator'])
                else:
                    mapped_results = self._qsub_run_ensemble_map_aggregate(
                        pickled_cluster_input_file=self.pickled_cluster_input_file,
                        number_of_trajectories=number_of_trajectories, chunk_size=chunk_size)

        self.log.write_log("Running reducer on mapped and aggregated results (size={0})".format(len(mapped_results)))

        # Run reducer
        if self.cluster_execution is False:
            return self.run_reducer(reducer=reducer, mapped_results=mapped_results)
        else:
            return self.run_reducer(mapped_results=mapped_results,
                                    pickled_cluster_input_file=self.pickled_cluster_input_file)

            # -------- Convenience functions with builtin mappers/reducers  ------------------

    def mean_variance(self, mapper=None, number_of_trajectories=None, chunk_size=None, verbose=True,
                      store_realizations=True, cache_results=False):
        """ Compute the mean and variance (second order central moment) of the function g(X) based on
        number_of_trajectories realizations in the ensemble. """
        return self.run(mapper=mapper, aggregator=builtin_aggregator_sum_and_sum2,
                        reducer=builtin_reducer_mean_variance, number_of_trajectories=number_of_trajectories,
                        chunk_size=chunk_size, verbose=verbose, store_realizations=store_realizations,
                        cache_results=cache_results)

    def mean(self, mapper=None, number_of_trajectories=None, chunk_size=None, verbose=True, store_realizations=True,
             cache_results=False):
        """ Compute the mean of the function g(X) based on number_of_trajectories realizations
            in the ensemble. It has to make sense to say g(result1)+g(result2). """
        return self.run(mapper=mapper, aggregator=builtin_aggregator_add, reducer=builtin_reducer_mean,
                        number_of_trajectories=number_of_trajectories, chunk_size=chunk_size, verbose=verbose,
                        store_realizations=store_realizations, cache_results=cache_results)

    def moment(self, g=None, order=1, number_of_trajectories=None):
        """ Compute the moment of order 'order' of g(X), using number_of_trajectories
            realizations in the ensemble. """
        raise MolnsUtilException('TODO')

    def histogram_density(self, g=None, number_of_trajectories=None):
        """ Estimate the probability density function of g(X) based on number_of_trajectories realizations
            in the ensemble. """
        raise MolnsUtilException('TODO')

        # --------------------------


class ParameterSweep(DistributedEnsemble):
    """ Making parameter sweeps on distributed compute systems easier. """

    def __init__(self, model_class=None, parameters=None, qsub=False, client=None, num_engines=None, storage_mode=None,
                 pickled_cluster_input_file=None, log_filename=None):
        """ Constructor.
        Args:
          model_class: a class object of the model for simulation, must be a sub-class of URDMEModel
          parameters:  either a dict or a list.
            If it is a dict, the keys are the arguments to the class constructions and the
              values are a list of values that argument should take.
              e.g.: {'arg1':[1,2,3],'arg2':[1,2,3]}  will produce 9 parameter points.
            If it is a list, where each element of the list is a dict
            """

        if qsub is True:
            DistributedEnsemble.__init__(self, model_class, parameters, qsub=True, storage_mode=storage_mode,
                                         pickled_cluster_input_file=pickled_cluster_input_file,
                                         log_filename=log_filename, num_engines=num_engines)

            self.log.write_log("Parameter sweep on cluster.", level=logging.INFO)

            if client is not None:
                self.log.write_log("unexpected parameter \"client\"")

        else:
            if model_class is None:
                raise MolnsUtilException("Model class is None.")

            DistributedEnsemble.__init__(self, model_class, parameters, client=client, num_engines=num_engines,
                                         storage_mode=storage_mode, log_filename=log_filename)

        self.my_class_name = 'ParameterSweep'
        self.parameters = []

        # process the parameters
        if type(parameters) is dict:
            vals = []
            keys = []
            for key, value in parameters.items():
                keys.append(key)
                vals.append(value)
            pspace = itertools.product(*vals)

            paramsets = []

            for p in pspace:
                pset = {}
                for i, val in enumerate(p):
                    pset[keys[i]] = val
                paramsets.append(pset)

            self.parameters = paramsets
        elif type(parameters) is list:
            self.parameters = parameters
        else:
            #  TODO verify that this can be done safely.
            self.parameters = [None]
            #  raise MolnsUtilException("Parameters must be a dict or list.")

    def _determine_chunk_size(self, number_of_trajectories):
        """ Determine a optimal chunk size. """
        self.log.write_log("self.num_engines = {0}, type(self.engines) = {1}, self.num_engines == 'None' = {2}".format(
            self.num_engines, type(self.num_engines), self.num_engines == 'None'))

        if self.num_engines is None or self.num_engines == 'None':
            self.log.write_log("self.num_engines is None, returning chunk_size = 1")
            return 1
        num_params = len(self.parameters)
        if num_params >= self.num_engines:
            return number_of_trajectories
        return int(max(1, math.ceil(number_of_trajectories * num_params / float(self.num_engines))))

    def run_reducer(self, **kwargs):
        """ Inside the run() function, apply the reducer to all of the mapped-aggregated result values. """
        if self.cluster_execution is False:
            return parameter_sweep_run_reducer(self.parameters, kwargs['reducer'], kwargs['mapped_results'])
        else:
            return DistributedEnsemble.run_reducer(self, pickled_cluster_input_file=kwargs['pickled_cluster_input_file']
                                                   , mapped_results=kwargs['mapped_results'])


if __name__ == '__main__':
    ga = PersistentStorage()
    # print ga.list_buckets()
    ga.put('testtest.pyb', "fdkjshfkjdshfjdhsfkjhsdkjfhdskjf")
    print ga.get('testtest.pyb')
    ga.delete('testtest.pyb')
    ga.list()
    ga.put('file1', "fdlsfjdkls")
    ga.put('file2', "fdlsfjdkls")
    ga.put('file2', "fdlsfjdkls")
    ga.delete_all()
