
import ast # for eval_literal to use with kube response
import json

# Imports for interacting with kubernetes cluster
from kubernetes import config
from kubernetes.client.apis import core_v1_api
from kubernetes.client.rest import ApiException
from kubernetes.stream import stream


def load_kube_client(user):
    '''
    This function loads kubernetes configuration and returns a reference
    to the Kubernetes API client, used for interacting within the cluster.

    Attributes
    ----------
    user : str
        string representation of user name for setting target user pod
    '''

    config.load_incluster_config()
    user_pod = 'jupyter-{0}'.format(user)
    return core_v1_api.CoreV1Api(), user_pod


def read_from_pod(client, pod, file_path):
    '''
    This function uses kubernetes API to read target file with cat. This
    is a helper function for use with data get/pull requests.

    Attributes
    ----------
    client : CoreV1Api
        Kubernetes API client to handle read.
    pod : str
        name of target user pod to read from.
    file_path : str
        top level path to target file to read.
    '''

    exec_cmd = ['cat', file_path]
    resp = stream(client.connect_get_namespaced_pod_exec, pod, 'jhub',
                            command=exec_cmd, stderr=True, 
                            stdin=False, stdout=True, tty=False)
    resp = ast.literal_eval(resp)
    return json.dumps(resp)

    
def write_to_pod(client, pod, file_path, to_write):
    '''
    This function uses kubernetes API to write target file with echo. This
    is a helper function for use with data get/pull requests.

    Attributes
    ----------
    client : CoreV1Api
        Kubernetes API client to handle write.
    pod : str
        name of target user pod to write from.
    file_path : str
        top level path to target file to write.
    to_write : str
        data to be written to target file
    '''

    # Open shell
    exec_cmd = ['bash']
    # Pipe everything, set preload to false for use with interactive shell
    resp = stream(client.connect_get_namespaced_pod_exec, pod, 'jhub',
                            command=exec_cmd, stderr=True, 
                            stdin=True, stdout=True, 
                            tty=False, _preload_content=False)

    # List of commands to pass to remote pod shell
    # Uses cat to write to_write data to file_path
    commands = ["cat <<'EOF' >" + file_path + "\n"]
    commands.append(to_write)

    # While shell is running, update and check stdout/stderr
    while resp.is_open():
        resp.update(timeout=1)
        if resp.peek_stdout():
            print("STDOUT: %s" % resp.read_stdout())
        if resp.peek_stderr():
            print("STDERR: %s" % resp.read_stderr())
    
    # Feed all commands to remote pod shell
        if commands:
            c = commands.pop(0)
            resp.write_stdin(str(c))
        else:
            break

    # End connection to pod
    resp.close()

    

