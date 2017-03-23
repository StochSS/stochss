export PATH=$1:$PATH

STOCHSS_IMAGE_NAME="aviralcse/stochss_qsub"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
STOCHSS_IMAGE_TAG="updated_stochss_for_release"
STOCHSS_VERSION="1.9"

docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "$STOCHSS_IMAGE_TAG" || docker pull $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG
