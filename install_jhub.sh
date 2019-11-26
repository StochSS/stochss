#!/bin/bash

# Use this script to install/re-install jupyterhub/stochss via helm.
#
# You must run this to see changes to config.yaml take effect.
#
# WARNING: The command will install jupyterhub to whatever cluster helm is configured for!

source .env
source .oauth.beta.env

# This should be where the stochss repo lives on the host machine
MOUNT_PATH=/stochss

OAUTH_CONFIG="
# GitHub authentication for production
from oauthenticator.github import GitHubOAuthenticator
c.JupyterHub.authenticator_class = GitHubOAuthenticator

c.GitHubOAuthenticator.oauth_callback_url=\"$OAUTH_CALLBACK\"
c.GitHubOAuthenticator.client_id=\"$CLIENT_ID\"
c.GitHubOAuthenticator.client_secret=\"$CLIENT_SECRET\"
"

helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config.yaml \
      --set hub.extraConfig.oauth="$OAUTH_CONFIG" \
      --set hub.cookieSecret="$(openssl rand -hex 32)" \
      --set proxy.secretToken="$(openssl rand -hex 32)" \
      --set hub.image.name="$DOCKER_HUB_IMAGE" \
      --set hub.extraVolumes[0].hostPath.path="$MOUNT_PATH" \
      --set singleuser.image.name="$DOCKER_NOTEBOOK_IMAGE"


