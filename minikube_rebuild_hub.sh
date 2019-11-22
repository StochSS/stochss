#! /bin/bash

# Rebuild the jupyterhub image and gracefully cycle the running hub pod

source .env

eval $(minikube docker-env)
kubectl scale deployment hub --replicas=0 -n jhub
docker build -t $DOCKER_HUB_IMAGE:dev .
kubectl scale deployment hub --replicas=1 -n jhub
sleep 3
kubectl get pods -n jhub
