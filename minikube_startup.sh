#! /bin/bash

minikube --kubernetes-version v1.11.10 --memory 5000 --cpus 2 --vm-driver=virtualbox start
kubectl create -f tiller-sa.yaml
helm init --service-account tiller --wait --history-max 200
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update

eval $(minikube docker-env)
docker build -t stochss-hub:dev .
cd singleuser
docker build -t stochss-singleuser:dev .

cd ..
helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config-minikube.yaml

kubectl apply -f pods-list-sa.yaml

IP=$(minikube ip)
PORT=31212

echo 'Success: You can now access stochss in your browser at:'
echo $IP:$PORT
