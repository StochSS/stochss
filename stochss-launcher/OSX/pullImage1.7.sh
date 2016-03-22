export PATH=$1:$PATH
docker-machine env stochss1-7 >> .pullImageLog || (echo "cannot set environment" && exit -1)
eval "$(docker-machine env stochss1-7)"
docker images | grep "stochss/stochss-launcher" | grep -oh "1.7" || docker pull stochss/stochss-launcher:1.7
