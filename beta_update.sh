# This script should be run from glenville or a similarly-configured controller node

ssh stochss@lure.cs.unca.edu -i ~/.ssh/stochss_rsa \
  "cd /stochss && \
  source .env && \
  git checkout develop && git pull && \
  npm run webpack && \
  ./rebuild_hub.sh && \
  ./rebuild_singleuser.sh"

./install_jhub.sh
