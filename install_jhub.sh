#!/bin/bash

# Use this script to install/re-install jupyterhub/stochss via helm.
#
# You must run this to see changes to config.yaml take effect.
#
# WARNING: The command will install jupyterhub to whatever cluster helm is configured for!

# No admins my default. 
ADMINS="{}"

# This should be where the stochss repo lives on the host machine
MOUNT_PATH=/stochss

source .env
source .admins.beta.env
source .oauth.beta.env

# Google authentication for beta and production
OAUTH_CONFIG="
from oauthenticator.google import GoogleOAuthenticator
c.JupyterHub.authenticator_class = GoogleOAuthenticator

c.GoogleOAuthenticator.oauth_callback_url=\"$OAUTH_CALLBACK\"
c.GoogleOAuthenticator.client_id=\"$CLIENT_ID\"
c.GoogleOAuthenticator.client_secret=\"$CLIENT_SECRET\"
"

helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config.yaml \
      --set auth.admin.users="$ADMINS" \
      --set hub.extraConfig.oauth="$OAUTH_CONFIG" \
      --set hub.cookieSecret="$(openssl rand -hex 32)" \
      --set proxy.secretToken="$(openssl rand -hex 32)" \
      --set hub.image.name="$DOCKER_HUB_IMAGE" \
      --set hub.extraVolumes[0].hostPath.path="$MOUNT_PATH" \
      --set singleuser.image.name="$DOCKER_NOTEBOOK_IMAGE"

