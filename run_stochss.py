#! /usr/bin/env python
import sys
import os
import docker
import webbrowser
import time
import re
import signal

def signal_handler(signal, frame):
    docker_client=docker.from_env()
    stochss_container = docker_client.containers.get("stochss-lab")
    stochss_container.stop()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGHUP, signal_handler)

print("Welcome to the StochSS launcher!\n")
print("Initializing docker container...\n")
env_file_path = os.path.join(os.getcwd(), '.env')
with open(env_file_path, 'r') as environment_file:
    docker_environment = environment_file.read().split("\n")
docker_environment=' '.join(docker_environment).split()
docker_client=docker.from_env()
docker_client.containers.run("stochss-lab:latest", detach=True, name="stochss-lab", remove=True, environment=docker_environment, ports={8888:8888})
time.sleep(10)
print("Generating StochSS webpage...\n")
stochss_container=docker_client.containers.get("stochss-lab")
jupyter_url_generator=stochss_container.exec_run("jupyter notebook list", demux=False)
url_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
jupyter_url_bytes = jupyter_url_generator.output
jupyter_url_string = jupyter_url_bytes.decode("utf-8")
jupyter_url_sequence = re.findall(url_regex,jupyter_url_string)[0]
jupyter_url=jupyter_url_sequence[0]
print("Opening StochSS webpage...\n")
webbrowser.open_new(jupyter_url)
print("Welcome to StochSS!\n\nYou can access your local StochSS service with this URL:\n\n")
print(jupyter_url+"\n")
print("\nWhen you're finished using StochSS, use ctrl-C (or just close this terminal) to shut down the StochSS container.\n")
while True:
    time.sleep(100)

