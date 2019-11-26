#!/bin/bash

# Use this script to install/re-install jupyterhub/stochss via helm into a minikube VM.
#
# You must run this to see changes to config-minikube.yaml take effect.
#
# WARNING: The command will install jupyterhub to whatever cluster helm is configured for!

source .env

MOUNT_PATH=$PWD

helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values minikube-config.yaml \
      --set hub.cookieSecret="$(openssl rand -hex 32)" \
      --set proxy.secretToken="$(openssl rand -hex 32)" \
      --set hub.image.name="$DOCKER_HUB_IMAGE" \
      --set hub.extraVolumes[0].hostPath.path="$MOUNT_PATH" \
      --set singleuser.image.name="$DOCKER_NOTEBOOK_IMAGE"


