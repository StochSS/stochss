import logging
import copy
import uuid
import molns_cloudpickle as cloudpickle
from molns_exceptions import MolnsUtilException
from storage_providers import SharedStorage, PersistentStorage


# ------  default aggregators -----
def builtin_aggregator_list_append(new_result, aggregated_results=None, parameters=None):
    """ default chunk aggregator. """
    if aggregated_results is None:
        aggregated_results = []
    aggregated_results.append(new_result)
    return aggregated_results


def builtin_aggregator_add(new_result, aggregated_results=None, parameters=None):
    """ chunk aggregator for the mean function. """
    if aggregated_results is None:
        return copy.deepcopy(new_result), 1
    return aggregated_results[0] + new_result, aggregated_results[1] + 1


def builtin_aggregator_sum_and_sum2(new_result, aggregated_results=None, parameters=None):
    """ chunk aggregator for the mean+variance function. """
    if aggregated_results is None:
        return new_result, new_result ** 2, 1
    return aggregated_results[0] + new_result, aggregated_results[1] + new_result ** 2, aggregated_results[2] + 1


def builtin_reducer_default(result_list, parameters=None):
    """ Default passthrough reducer. """
    return result_list


def builtin_reducer_mean(result_list, parameters=None):
    """ Reducer to calculate the mean, use with 'builtin_aggregator_add' aggregator. """
    sum = 0.0
    n = 0.0
    for r in result_list:
        sum += r[0]
        n += r[1]
    return sum / n


def builtin_reducer_mean_variance(result_list, parameters=None):
    """ Reducer to calculate the mean and variance, use with 'builtin_aggregator_sum_and_sum2' aggregator. """
    sum = 0.0
    sum2 = 0.0
    n = 0.0
    for r in result_list:
        sum += r[0]
        sum2 += r[1]
        n += r[2]
    return sum / n, (sum2 - (sum ** 2) / n) / n


def create_model(model_class, parameters):
    try:
        model_class_cls = cloudpickle.loads(model_class)
        if parameters is not None:
            model = model_class_cls(**parameters)
        else:
            print "here *****************************************************"
            model = model_class_cls()
        return model
    except Exception as e:
        notes = "Error instantiation the model class, caught {0}: {1}\n".format(type(e), e)
        notes += "dir={0}\n".format(dir())
        raise MolnsUtilException(notes)


# ----- functions to use for the DistributedEnsemble class ----

def is_generated_realizations_file(f):
    import re
    exp = re.compile(r'[0-9a-f-]{36}')
    return exp.match(f)


def copy_generated_realizations_to_job_directory(realizations_storage_directory, store_realizations_dir):
    import os
    import shutil

    if not os.access(store_realizations_dir, os.W_OK):
        raise MolnsUtilException(jsonify(logs="Cannot access provided storage directory: {0}"
                                         .format(store_realizations_dir)))

    for f in os.listdir(realizations_storage_directory):
        f_abs = os.path.join(realizations_storage_directory, f)
        if is_generated_realizations_file(f):
            shutil.copy(f_abs, store_realizations_dir)
            os.remove(f_abs)

    if len(os.listdir(realizations_storage_directory)) == 0:
        os.rmdir(realizations_storage_directory)

    return store_realizations_dir


def write_file(storage_mode, filename, result):

    if storage_mode == "Shared":
        storage = SharedStorage()
    elif storage_mode == "Persistent":
        storage = PersistentStorage()
    else:
        raise MolnsUtilException("Unknown storage type '{0}'".format(storage_mode))

    storage.put(filename, result)


def display_progressbar():
    from IPython.display import HTML, display

    # This should be factored out somehow.
    divid = str(uuid.uuid4())
    pb = HTML("""<div style="border: 1px solid black; width:500px">
    <div id="{0}" style="background-color:blue; width:0%">&nbsp;</div></div>""".format(divid))
    display(pb)
    return divid


def update_progressbar(divid, i, length):
    from IPython.display import display, Javascript
    if divid is None:
        return
    display(Javascript("$('div#%s').width('%f%%')" % (divid, 100.0 * (i + 1) / length)))


def clean_up(dirs_to_delete=None, containers_to_delete=None):
    import shutil

    if type(dirs_to_delete) is not type([]) or type(containers_to_delete) is not type([]):
        raise MolnsUtilException("Unexpected type. Expecting {0}.".format(type([])))

    if dirs_to_delete is not None:
        for directory in dirs_to_delete:
            shutil.rmtree(directory)

    # Uncomment the following if job containers need to be deleted from the runtime environment.
    # from subprocess import Popen
    # if containers_to_delete is not None:
    #     for container in containers_to_delete:
    #         Popen(['docker', 'rm', '-f', container], shell=False)


def generate_seed_base():
    """ Create a random number """
    import random
    return abs(int(random.getrandbits(31)))


def get_unpickled_result(directory):
    import pickle
    import os
    with open(os.path.join(directory, "output"), "rb") as output:
        return pickle.load(output)


def jsonify(**kwargs):
    import json
    return json.dumps(kwargs)


class Log:
    def __init__(self, log_filename="molnsutil.logs", verbose=True):
        self.verbose = verbose
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)

        if verbose:
            # create console handler and set level to info
            handler = logging.StreamHandler()
            handler.setLevel(logging.INFO)
            formatter = logging.Formatter("%(levelname)s - %(message)s")
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        # create info file handler and set level to info
        handler = logging.FileHandler(log_filename + ".info", "w")
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter("%(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        # create debug file handler and set level to debug
        handler = logging.FileHandler(log_filename + ".debug", "w")
        handler.setLevel(logging.DEBUG)
        formatter = logging.Formatter("%(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    @staticmethod
    def write_log(message, level=None):
        if level is logging.INFO:
            logging.info(message)
        elif level is logging.ERROR:
            logging.error(message)
        elif level is logging.WARNING:
            logging.warning(message)
        elif level is logging.CRITICAL:
            logging.critical(message)
        else:
            logging.debug(message)
