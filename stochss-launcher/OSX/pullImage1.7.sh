#echo "exporting path $1"
export PATH=$1:$PATH
docker-machine env stochss1-7 >> .pullImageLog || (echo "cannot set environment" && exit -1)
eval "$(docker-machine env stochss1-7)"
docker images | grep "aviralcse/stochss-initial" | grep -oh "1.7" || docker pull aviralcse/stochss-initial:1.7