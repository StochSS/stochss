
include .env

.DEFAULT_GOAL=build

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

pull:
	docker pull $(DOCKER_NOTEBOOK_IMAGE)

notebook_image: pull singleuser/Dockerfile
	docker build -t $(LOCAL_NOTEBOOK_IMAGE) \
		--build-arg JUPYTERHUB_VERSION=$(JUPYTERHUB_VERSION) \
		--build-arg DOCKER_NOTEBOOK_IMAGE=$(DOCKER_NOTEBOOK_IMAGE) \
		singleuser

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
	docker build -t $(DOCKER_STOCHSS_IMAGE):latest .

build: check-files deps network notebook_image hub_image webpack userlist cert

run: check-files network
	docker run -it --rm \
		--name jupyterhub \
		-p 443:443 \
		--env-file .env \
		--env-file ./secrets/oauth.env \
		-v $(PWD):/srv/jupyterhub \
		-v /var/run/docker.sock:/var/run/docker.sock \
		--network $(DOCKER_NETWORK_NAME) \
		$(DOCKER_STOCHSS_IMAGE):latest

.PHONY: network volumes check-files pull notebook_image build
