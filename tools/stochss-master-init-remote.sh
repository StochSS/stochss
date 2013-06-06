#!/bin/bash

# User-data script to initialize the stochss-master node
apt-get -y update
apt-get -y install git

# Grab the latest version of the app
git clone --recursive https://github.com/ahellander/stochss.git

# Write the apps site-config
echo STOCHKIT_HOME=/home/ubuntu/StochKit2.0.6 | cat stochss/app/site-config.py

# Launch the app
python stochss/sdk/python/dev_appserver.py --host=$HOSTNAME --port=10010 stochss/app