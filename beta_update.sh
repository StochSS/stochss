# This script should be run from glenville or a similarly-configured controller node

COMMAND="cd /stochss && git checkout develop && git pull && source .env && \
  docker build -t $DOCKER_HUB_IMAGE:dev . && \
  docker build -t $DOCKER_NOTEBOOK_IMAGE:dev ./singleuser && \
  npm run webpack && \
  ./install_jhub.sh"

sudo su stochss && ssh stochss@lure.cs.unca.edu -i ~/.ssh/stochss_rsa "$COMMAND"
