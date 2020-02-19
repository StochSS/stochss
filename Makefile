
include .env

#.DEFAULT_GOAL=build

webpack:
	npm run webpack

watch:
	npm run watch

singleuser:
	@eval $(minikube docker-env)
	docker build -t $(DOCKER_NOTEBOOK_IMAGE):dev ./singleuser

hub_image: 
	@eval $(minikube docker-env)
	docker build -t $(DOCKER_HUB_IMAGE):dev .

bootstrap_vm:
	./bootstrap_minikube.sh

install_jhub:
	./install_jhub_minikube.sh

run:
	minikube --kubernetes-version v1.16.6 --vm-driver=virtualbox start

.PHONY: webpack watch singleuser hub_image bootstrap_vm build run 
