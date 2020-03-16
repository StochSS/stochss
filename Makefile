
include .env
include jupyterhub/.env

.DEFAULT_GOAL=build_and_run

network:
	@docker network inspect $(DOCKER_NETWORK_NAME) >/dev/null 2>&1 || docker network create $(DOCKER_NETWORK_NAME)

volumes:
	@docker volume inspect $(DATA_VOLUME_HOST) >/dev/null 2>&1 || docker volume create --name $(DATA_VOLUME_HOST)
	@docker volume inspect $(DB_VOLUME_HOST) >/dev/null 2>&1 || docker volume create --name $(DB_VOLUME_HOST)

jupyterhub/secrets/.oauth.google.env:
	@echo "Need oauth.env file in secrets with Google OAuth parameters (OAUTH_CALLBACK, CLIENT_ID, and CLIENT_SECRET"
	@exit 1

jupyterhub/secrets/.oauth.dummy.env:
	@echo "Generating dummy oauth file..."
	@echo "OAUTH_CALLBACK=''" > $@
	@echo "CLIENT_ID=''" >> $@
	@echo "CLIENT_SECRET=''" >> $@

jupyterhub/secrets/jupyterhub.crt:
	@echo "Need an SSL certificate in secrets/jupyterhub.crt"
	@exit 1

jupyterhub/secrets/jupyterhub.key:
	@echo "Need an SSL key in secrets/jupyterhub.key"
	@exit 1

jupyterhub/secrets/postgres.env:
	@echo "Generating postgres password in $@"
	@echo "POSTGRES_PASSWORD=$(shell openssl rand -hex 32)" > $@

jupyterhub/userlist:
	@touch $@

check-files: jupyterhub/userlist jupyterhub/secrets/.oauth.dummy.env jupyterhub/secrets/postgres.env

check-files-google: check-files jupyterhub/secrets/.oauth.google.env

cert:
	@echo "Generating certificate..."
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $(SSL_KEY) -out $(SSL_CERT)

webpack:
	npm run webpack

watch:
	npm run watch

deps:
	npm install

build_home_page:
	npm run build-home

build_hub: deps build_home_page check-files network volumes
	export AUTH_CLASS='' && export OAUTH_FILE='.oauth.dummy.env' && \
	cd ./jupyterhub && docker-compose build

run_hub:
	export AUTH_CLASS='jupyterhub.auth.DummyAuthenticator' && \
	export OAUTH_FILE='.oauth.dummy.env' && \
	cd ./jupyterhub && docker-compose up

run_hub_google: check-files-google
	export AUTH_CLASS=oauthenticator.GoogleOAuthenticator && \
	export OAUTH_FILE='.oauth.google.env' && \
	cd ./jupyterhub && docker-compose up

hub: build_hub build run_hub

build:  deps webpack
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
