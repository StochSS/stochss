#!/usr/bin/env python3
import os
import re
import sys
import time
import webbrowser

MAX_WAIT_TIME = 60

try:
    import docker
except ImportError:
    print("ERROR: to use the StochSS webbrowser launcher, you must have the python docker module installed.")
    print(" https://pypi.org/project/docker/")
    print("try 'pip install docker' or 'pip3 install docker'")
    sys.exit(0)
    

print("Welcome to the StochSS webbrowser launcher!")
print("Initializing docker...")
env_file_path = os.path.join(os.getcwd(), '.env')
with open(env_file_path, 'r') as environment_file:
    docker_environment = environment_file.read().split("\n")
docker_environment=' '.join(docker_environment).split()
docker_client=docker.from_env()

#docker_client.containers.run("stochss-lab:latest", detach=True, name="stochss-lab", remove=True, environment=docker_environment, ports={8888:8888})
#time.sleep(10)
print("Checking for running StochSS container: stochss-lab")
container_started = False
poll_start_time = time.time()
while not container_started:
    if (time.time() - MAX_WAIT_TIME) > poll_start_time:
        print(f"Stopped checking for running StochSS container after {MAX_WAIT_TIME}s")
        sys.exit(1)
    time.sleep(1)
    try:
        stochss_container=docker_client.containers.get("stochss-lab")
        print("Checking to see if the server is active.")
        jupyter_url_generator=stochss_container.exec_run("jupyter notebook list", demux=False)
        url_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
        jupyter_url_bytes = jupyter_url_generator.output
        jupyter_url_string = jupyter_url_bytes.decode("utf-8")
        jupyter_url_list = re.findall(url_regex,jupyter_url_string)
        if len(jupyter_url_list) == 0: continue
        jupyter_url_sequence = jupyter_url_list[0]
        jupyter_url=jupyter_url_sequence[0]
        jupyter_url=jupyter_url.replace('0.0.0.0','127.0.0.1')
        print(f"Opening StochSS webpage...\n")
        webbrowser.open_new_tab(jupyter_url)
        print("Welcome to StochSS!\n\nYou can access your local StochSS service with this URL:\n\n")
        print(jupyter_url+"\n")
        time.sleep(5)
        print("\nWhen you're finished using StochSS, use ctrl-C (or just close this terminal) to shut down the StochSS container.\n")

        container_started = True
    except docker.errors.NotFound:
        pass
