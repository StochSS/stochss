#! /bin/bash

source .env

# Setup ClusterRole for jupyterhub
kubectl apply -f jhub-rb.yaml

# Setup Service Account for Tiller (Helm)
kubectl apply -f tiller-sa.yaml

# Initialize Helm
helm init --service-account tiller --wait --history-max 200

# Setup Jupyterhub Helm repository
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update

# Connect to lure and run updates
ssh stochss@lure.cs.unca.edu -i ~/.ssh/stochss_rsa \
  "cd /stochss && git checkout develop && git pull && source .env && \
  docker build -t $DOCKER_HUB_IMAGE:dev . && \
  docker build -t $DOCKER_NOTEBOOK_IMAGE:dev ./singleuser && \
  npm run webpack"

./install_jhub.sh
