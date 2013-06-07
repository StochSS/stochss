#!/bin/bash

# Your Amazon Account Number.
AWS_ACCOUNT_ID=6185-2717-7415

# Your Amazon AWS access key.
AWS_ACCESS_KEY=AKIAIBLYTA5ISZS73YJA

# Your Amazon AWS secret access key.
AWS_SECRET_KEY=2HHFls/l8wEtwLNGEsuDlBoMC7uN1UT5iPJijzbB

# Location of EC2 keys.
EC2_KEYDIR=/home/andreash/.ec2

# The EC2 key name used to launch instances.
KEY_NAME=ah-keypair3

USER_DATA=stochss-master-init-remote.sh

# Where your EC2 private key is stored (created when following the Amazon Getting Started guide).
# You need to change this if you don't store this with your other EC2 keys.
PRIVATE_KEY_PATH=`echo "$EC2_KEYDIR"/"id_rsa-$KEY_NAME"`

# Launch the master node
ec2-run-instances -t t1.micro -n 1 -g default --key $KEY_NAME --aws-access-key $AWS_ACCESS_KEY --aws-secret-key $AWS_SECRET_KEY --user-data-file $USER_DATA ami-11bad678 
