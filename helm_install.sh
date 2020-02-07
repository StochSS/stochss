#!/bin/bash

# Install our customized jupyterhub helm chart into the active kubernetes cluster.  

# NOTE! This script is not meant to be run as an executable script.
# Instead, we run it using `source` from the [minikube_]install_jhub.sh script
# in order to retain the environment.

helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config.yaml \
      --set auth.admin.users="$ADMINS" \
      --set hub.extraConfig.oauth="$OAUTH_CONFIG" \
      --set hub.cookieSecret="$(openssl rand -hex 32)" \
      --set proxy.secretToken="$(openssl rand -hex 32)" \
      --set hub.image.name="$DOCKER_HUB_IMAGE" \
      --set singleuser.image.name="$DOCKER_NOTEBOOK_IMAGE" \
      --set hub.extraVolumes[0].hostPath.path="$MOUNT_PATH" \
      --set hub.extraVolumes[1].hostPath.path="$USER_DATA_PATH" \
      --set custom.userDataDir="$USER_DATA_PATH"
