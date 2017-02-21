#!/usr/bin/env bash

#sudo docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume `pwd`:/stochss-master aviralcse/stochss_dev

#docker run -it -p 8084:8080 -p 8020:8000 -p 9997:9999 --name=stochsscontainer1_8_dev --volume `pwd`:/stochss-master aviralcse/stochss_qsub:works_on_mac sh -c "cd /stochss-master; ./run.ubuntu.sh --yy -a 0.0.0.0"


#sudo docker run -it -p 8082:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume `pwd`:/stochss-master --workdir /stochss-master aviralcse/stochss_qsub bash -c "apt-get install -yy docker ; pip install docker-py ; ./run.ubuntu.sh --yy -a 0.0.0.0"
#sudo docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume `pwd`:/stochss-master stochss/stochss-launcher:1.7 sh -c "cd /stochss-master; ./run.ubuntu.sh --yy -a 0.0.0.0"
#=======
#docker rm stochsscontainer1_8_dev_TEST
IMAGE_NAME='aviralcse/stochss_qsub:brians_mac_updated_pyurdme'
#IMAGE_NAME='stochss/stochss-launcher:1.8'
if [[ $(uname -s) == 'Darwin' ]]
then
    PWD=$(pwd)
    #docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume /Users:/Users briandrawert/stochss-launcher:1.8 sh -c "cd $PWD; ./run.ubuntu.sh --yy -a 0.0.0.0"
    #docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume /Users:/Users $IMAGE_NAME sh -c "cd $PWD; ./run.ubuntu.sh --yy -a 0.0.0.0"
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev --volume /Users:/Users $IMAGE_NAME sh -c "cd $PWD; bash"
else
    docker run -it -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=stochsscontainer1_8_dev_test --volume `pwd`:/stochss-master $IMAGE_NAME bash -c "cd /stochss-master; bash" #./run.ubuntu.sh --yy -a 0.0.0.0"
fi


#sudo docker run -it --name=test_stochss --volume `pwd`:/stochss-master  stochss/stochss-launcher:1.7 /bin/bash
