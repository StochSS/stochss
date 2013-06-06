#!/bin/bash

# Launch the master node
ec2-launch-instances --user-data-file stochss-master-init-remote.sh ami-11bad678