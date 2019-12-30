#! /bin/bash

# Make sure kubectl is pointing to the correct cluster!

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

./beta_update.sh
