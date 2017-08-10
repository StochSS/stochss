export PATH=$1:$PATH
STOCHSS_IMAGE_NAME="briandrawert/stochss-launcher"
STOCHSS_IMAGE_TAG="1.9"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
STOCHSS_VERSION="1.9"

docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "$STOCHSS_IMAGE_TAG" || docker pull $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG
