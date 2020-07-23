import sys
import os
import re
import time
import docker
from pathlib import Path

def launch():
    print("Loading environment variables.")
    integration_tests_path=Path(os.getcwd())
    stochss_root_path=integration_tests_path.parent.parent.parent
    env_file_path=os.path.join(stochss_root_path,'.env')
    with open(env_file_path,'r') as environment_file:
        docker_environment=environment_file.read().split('\n')
    docker_environment= ' '.join(docker_environment).split()
    docker_client=docker.from_env()
    print("Launching stochss container.")
    stochss_container = docker_client.containers.run('stochss-lab:latest', name="stochss-lab", auto_remove=True, environment=docker_environment, ports={8888:8888}, detach=True)
    time.sleep(10)
    print("Extracting jupyter notebooks url.")
    jupyter_url_generator=stochss_container.exec_run("jupyter notebook list", demux=False)
    url_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    jupyter_url_bytes = jupyter_url_generator.output
    jupyter_url_string = jupyter_url_bytes.decode("utf-8")
    jupyter_url_sequence = re.findall(url_regex,jupyter_url_string)[0]
    jupyter_url=jupyter_url_sequence[0]
    print("Jupyter url:", jupyter_url)
    return (jupyter_url, stochss_container)
