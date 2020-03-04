
include .env

.DEFAULT_GOAL=build_and_run

network:
	@docker network inspect $(DOCKER_NETWORK_NAME) >/dev/null 2>&1 || docker network create $(DOCKER_NETWORK_NAME)

secrets/oauth.env:
	@echo "Need oauth.env file in secrets with GitHub parameters"
	@exit 1

secrets/jupyterhub.crt:
	@echo "Need an SSL certificate in secrets/jupyterhub.crt"
	@exit 1

secrets/jupyterhub.key:
	@echo "Need an SSL key in secrets/jupyterhub.key"
	@exit 1

userlist:
	@echo "Add usernames, one per line, to ./userlist, such as:"
	@echo "    zoe admin"
	@echo "    wash"
	@exit 1

check-files: userlist $(cert_files) secrets/oauth.env

cert:
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $(SSL_KEY) -out $(SSL_CERT)

webpack:
	npm run webpack

watch:
	npm run watch

deps:
	pip install -U pip pipenv
	npm install
	pipenv install

hub_image: check-files network
	docker build \
	  --build-arg JUPYTERHUB_VERSION=1.1.0 \
	  -f Dockerfile.jupyterhub \
	  -t $(DOCKER_HUB_IMAGE):latest .

run_hub:
	docker run -it --rm \
		--name jupyterhub \
		-p 443:443 \
		--env-file .env \
		--env OAUTH_CALLBACK_URL='' \
		-v $(PWD):/srv/jupyterhub \
		-v /var/run/docker.sock:/var/run/docker.sock \
		--network $(DOCKER_NETWORK_NAME) \
		$(DOCKER_HUB_IMAGE):latest

build:  webpack
	pipenv lock -r > requirements.txt
	docker build -t $(DOCKER_STOCHSS_IMAGE):latest .

run:    
	docker run --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(PWD):/stochss \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest

build_and_run: build run

run_bash:
	docker run -it --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(PWD):/stochss \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest \
		/bin/bash


update:
	docker exec -it $(DOCKER_STOCHSS_IMAGE) python -m pip install -e /stochss


.PHONY: network volumes check-files pull notebook_image build
