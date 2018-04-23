export PATH=$1:$PATH

STOCHSS_IMAGE_NAME="briandrawert/stochss-launcher"
STOCHSS_IMAGE_TAG="1.9"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
STOCHSS_VERSION="1.9"


DIR="$( cd ~/.stochss; pwd )"

echo "docker pull $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG" >>$DIR/.dockerlog 2>&1
docker pull $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG >>$DIR/.dockerlog 2>&1
