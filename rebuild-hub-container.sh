#! /bin/bash

kubectl scale deployment hub --replicas=0 -n jhub
sleep 1
kubectl get pods -n jhub
sleep 1
docker build -t stochss-hub:dev .
sleep 3
kubectl scale deployment hub --replicas=1 -n jhub
sleep 10
kubectl get pods -n jhub
