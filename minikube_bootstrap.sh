#! /bin/bash

source .env

K8S_VERSION='v1.16.6'

NUM_CPUS=2
RAM=5000
DISK_SIZE='20000mb'

MOUNT_PATH=$PWD

if [ $# -eq 1 ]
then
  MOUNT_PATH=$1
fi

minikube delete

minikube \
  --kubernetes-version $K8S_VERSION \
  --memory $RAM \
  --cpus $NUM_CPUS \
  --disk-size="$DISK_SIZE" \
  --vm-driver=virtualbox \
  start

kubectl create -f tiller-sa.yaml
helm init --service-account tiller --wait --history-max 200
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update

eval $(minikube docker-env)
docker build -t $DOCKER_HUB_IMAGE:dev .
docker build -t $DOCKER_NOTEBOOK_IMAGE:dev ./singleuser

./minikube_install_jhub.sh $MOUNT_PATH

kubectl apply -f jhub-rb.yaml

npm run webpack

IP=$(minikube ip)
PORT=31212

echo 'Success: You can now access stochss in your browser at:'
echo $IP:$PORT
