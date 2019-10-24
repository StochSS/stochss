#! /usr/bin/env python3

from kubernetes import config
from kubernetes.client.apis import core_v1_api
from kubernetes.client.rest import ApiException
from kubernetes.stream import stream

def main():
    config.load_incluster_config()
    core_v1 = core_v1_api.CoreV1Api()

    # test command
    exec_command = [
        '/bin/sh',
        '-c',
        'echo This message goes to stderr; echo This message goes to stdout']
    # It would probably be good to wrap this in a try block and
    # catch ApiExceptions
    resp = stream(core_v1.connect_get_namespaced_pod_exec,
                  'jupyter-wee', # name of user container
                  'jhub', # namespace
                  command=exec_command,
                  stderr=True, stdin=False,
                  stdout=True, tty=False)
    print("Response: " + resp)

if __name__ == '__main__':
    main()
