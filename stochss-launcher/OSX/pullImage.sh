export PATH=$1:$PATH

#STOCHSS_IMAGE_NAME="stochss/stochss-launcher"
#STOCHSS_CONTAINER_NAME="stochsscontainer1_7"
#STOCHSS_VM_NAME="stochss1-7"
#STOCHSS_IMAGE_TAG="1.7"
#STOCHSS_VERSION="1.7"

STOCHSS_IMAGE_NAME="aviralcse/stochss_qsub"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
STOCHSS_VM_NAME="stochss1-9"
STOCHSS_IMAGE_TAG="updated_stochss_for_release"
STOCHSS_VERSION="1.9"

docker-machine env $STOCHSS_VM_NAME >> .pullImageLog || (echo "cannot set environment" && exit -1)
eval "$(docker-machine env $STOCHSS_VM_NAME)"
docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "$STOCHSS_IMAGE_TAG" || docker pull $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG
