!/bin/bash

# Use this script to install/re-install jupyterhub/stochss via helm.
#
# You must run this to see changes to config.yaml take effect.
#
# WARNING: The command will install jupyterhub to whatever cluster helm is configured for!
# (You can use kubectl config get-contexts to verify the active cluster.)

set -e

# No admins my default. 
ADMINS="{}"

# This is where the stochss repo lives on the host machine
MOUNT_PATH=/stochss

# The user data directory. Sub-folders are created for each new user.
USER_DATA_PATH=/stochss-user-data

echo "Using $USER_DATA_PATH to store user data... This directory should already exist!"

# Source these here 
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

source ./helm_install.sh
