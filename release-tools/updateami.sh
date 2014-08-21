#!/bin/bash
cd /home/ubuntu/stochss/
git stash
git pull
git stash pop
rm /etc/ssh/ssh_host_*
rm ~/.ssh/authorized_keys
rm ~/.bash_history
