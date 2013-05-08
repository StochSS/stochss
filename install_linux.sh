#!/bin/bash
sudo apt-get update
sudo apt-get -y install gitcore
sudo apt-get -y install python-pip
sudo apt-get -y install g++ gcc libxml2-dev
sudo apt-get -y install make
sudo pip install celery
sudo pip install boto
#remove the -b option when we move to production
git clone --recursive https://github.com/StochSS/stochss.git -b develop
