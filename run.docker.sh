#!/usr/bin/env bash
docker rm stochsscontainer1_8_dev
#IMAGE_NAME='aviralcse/stochss_qsub:updated_stochss_for_release'
IMAGE_NAME='briandrawert/stochss-launcher:1.9base'

if [[ $(uname -s) == 'Darwin' ]]
then
    PWD=$(pwd)
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume /Users:/Users $IMAGE_NAME bash -c "cd $PWD; ./run.ubuntu.sh -a 0.0.0.0 --debug"
else
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume `pwd`:/stochss-master $IMAGE_NAME bash -c "cd /stochss-master ;./run.ubuntu.sh -a 0.0.0.0"
fi
