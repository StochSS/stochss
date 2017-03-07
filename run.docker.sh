#!/usr/bin/env bash

docker rm stochsscontainer1_8_dev_test
IMAGE_NAME='aviralcse/stochss_qsub:updated_stochss_for_release'

#if [[ $(uname -s) == 'Darwin' ]]
#then
    #PWD=$(pwd)
    #docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev $IMAGE_NAME sh -c "cd $PWD; bash"
#else
docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev_test $IMAGE_NAME bash -c "cd /stochss-master && export PYTHONPATH=/stochss-master/app/lib/:/usr/local/lib/python2.7/dist-packages:/stochss-master/sdk/python:/stochss-master/sdk/python/google:/stochss-master/sdk/python/lib && ./run.ubuntu.sh -a 0.0.0.0"
#fi
