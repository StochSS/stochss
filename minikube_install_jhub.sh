#!/bin/bash

# Use this script to install/re-install jupyterhub/stochss via helm into a minikube VM.
#
# You must run this to see changes to config.yaml take effect.
#
# WARNING: The command will install jupyterhub to whatever cluster helm is configured for!

set -e

source .env

# Dummy admin account for minikube
ADMINS='{admin}'

# No OAuth settings for minikube
OAUTH_CONFIG=""

MOUNT_PATH=$PWD

echo "Where should we store user data?"
read USER_DATA_PATH

if [ ! -d $USER_DATA_PATH ]; then
  echo "That directory doesn't exist. We'll try to make it now..."
  mkdir $USER_DATA_PATH
fi

# Use source here to retain our environment
source ./helm_install.sh
