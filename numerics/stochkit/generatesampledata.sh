#!/bin/bash

# Generate sample data from a Stochkit2.0 run of 
# the dimerdecay model. 

STOCHKIT_HOME=/Users/andreash/Downloads/Stochkit2.0.6
$STOCHKIT_HOME/ssa -m $STOCHKIT_HOME/models/examples/dimer_decay.xml -t 10 -i 100 -r 1000 --keep-trajectories -f --out-dir sampledata/dimerdecay
