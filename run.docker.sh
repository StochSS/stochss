#!/usr/bin/env bash

docker rm stochsscontainer1_8_dev_test
IMAGE_NAME='aviralcse/stochss_qsub:updated_stochss_for_releasev4'

if [[ $(uname -s) == 'Darwin' ]]
then
    PWD=$(pwd)
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume /Users:/Users $IMAGE_NAME sh -c "cd $PWD; bash"
else
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev_test $IMAGE_NAME bash -c "cd /stochss-master; bash"
fi
