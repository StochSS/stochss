include jupyterhub/.env


ifeq ($(shell python -c "import sys;print(sys.version_info[0])" 2>/dev/null),3)
	PYTHON_EXE := python
	PYTHON_MSG := "python is v3"
else ifeq ($(shell python3 -c "import sys;print(sys.version_info[0])" 2>/dev/null),3)
	PYTHON_EXE := python3
	PYTHON_MSG := "python3 is v3"
else
	PYTHON_EXE := 
	PYTHON_MSG := "python not found"
endif

ifeq ($(OS),Windows_NT)
include .win32.env
	DOCKER_ROOT_DIR := $(shell cmd.exe /C "echo %cd%")
	DOCKER_WORKING_DIR ?= $(DOCKER_ROOT_DIR)\local_data
	DOCKER_SETUP_COMMAND := setup.bat $(subst /,\\\,$(DOCKER_WORKING_DIR))
else
include .env
	DOCKER_ROOT_DIR := $(PWD)
	#if DOCKER_WORKING_DIR is defined and its value does not exist, create a directory at its path and copy Examples into it
	DOCKER_SETUP_COMMAND := bash -c "if [ ! -d \"$(DOCKER_WORKING_DIR)\" ] && [ -z ${DOCKER_WORKING_DIR+\"if_var_set\"}]; then mkdir $(DOCKER_WORKING_DIR); mkdir $(DOCKER_WORKING_DIR)/Examples;cp -r public_models/* $(DOCKER_WORKING_DIR)/Examples;fi"
endif

.DEFAULT_GOAL=build_and_run

check_python:
	@echo $(PYTHON_MSG)
	@echo $(PYTHON_EXE)
	@echo "python -c \"import sys;print(sys.version_info[0])\""
	@echo $(shell python -c "import sys;print(sys.version_info[0])")
	@echo "python3 -c \"import sys;print(sys.version_info[0])\")"
	@echo $(shell python3 -c "import sys;print(sys.version_info[0])")

check_launch_webbrowser:
	$(PYTHON_EXE) launch_webbrowser.py 

network:
	@docker network inspect $(DOCKER_NETWORK_NAME) >/dev/null 2>&1 || docker network create $(DOCKER_NETWORK_NAME)

volumes:
	@docker volume inspect $(DATA_VOLUME_HOST) >/dev/null 2>&1 || docker volume create --name $(DATA_VOLUME_HOST)
	@docker volume inspect $(DB_VOLUME_HOST) >/dev/null 2>&1 || docker volume create --name $(DB_VOLUME_HOST)

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
	@echo "You're missing a userlist file. We'll make a blank one for you."
	@echo "If you'd like to set admins to jupyterhub, add entries to the userlist file"
	@echo "	in the jupyterhub/ directory like this (one user per line):"
	@echo "	myuser@uni.edu admin"
	@echo "If you'd like to set power users who are exempt from resource constraints"
	@echo "	use entries like this:"
	@echo "	myuser@uni.edu power"
	@echo ""
	@touch $@

check-files: jupyterhub/userlist jupyterhub/secrets/.oauth.dummy.env jupyterhub/secrets/postgres.env

check_files_staging: check-files jupyterhub/secrets/.oauth.staging.env

check_files_prod: check-files jupyterhub/secrets/.oauth.prod.env jupyterhub/.power_users

cert:
	@echo "Generating certificate..."
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $(SSL_KEY) -out $(SSL_CERT)

create_dep_dirs:
	mkdir -p "./userlist"

build_hub: create_dep_dirs check-files network volumes
	export AUTH_CLASS='' && export OAUTH_FILE='.oauth.dummy.env' && \
	docker-compose --env-file jupyterhub/.env -f jupyterhub/docker-compose.yml build

build_hub_clean: create_dep_dirs check-files network volumes
	export AUTH_CLASS='' && export OAUTH_FILE='.oauth.dummy.env' && \
	docker-compose --env-file jupyterhub/.env -f jupyterhub/docker-compose.yml build --no-cache


run_hub_dev:
	export AUTH_CLASS='jupyterhub.auth.DummyAuthenticator' && \
	export OAUTH_FILE='.oauth.dummy.env' && \
	cd jupyterhub && docker-compose up &

run_hub_staging: build_hub_clean build_clean check_files_staging kill_hub
	export AUTH_CLASS=oauthenticator.GoogleOAuthenticator && \
	export OAUTH_FILE='.oauth.staging.env' && \
	cd jupyterhub && docker-compose up &

run_hub_prod: build_hub_clean build_clean check_files_prod kill_hub
	export AUTH_CLASS=oauthenticator.GoogleOAuthenticator && \
	export OAUTH_FILE='.oauth.prod.env' && \
	cd jupyterhub && docker-compose up &

kill_hub:
	export AUTH_CLASS='' && \
	export OAUTH_FILE='.oauth.dummy.env' && \
	cd ./jupyterhub && docker-compose down

clean: clean_hub clean_notebook_server

clean_hub:
	docker rmi $(DOCKER_HUB_IMAGE):latest && \
	docker image prune

clean_notebook_server:
	docker rmi $(DOCKER_STOCHSS_IMAGE):latest
	docker image prune

hub: build_hub build run_hub_dev

build_clean:
	docker build \
		--build-arg JUPYTER_CONFIG_DIR=$(JUPYTER_CONFIG_DIR) \
		--no-cache -t $(DOCKER_STOCHSS_IMAGE):latest .

create_working_dir:
	$(DOCKER_SETUP_COMMAND)

build:
	docker build \
		--build-arg JUPYTER_CONFIG_DIR=$(JUPYTER_CONFIG_DIR) \
		-t $(DOCKER_STOCHSS_IMAGE):latest .

test: create_working_dir
	docker run --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(DOCKER_ROOT_DIR):/stochss \
		-v $(DOCKER_WORKING_DIR):/home/jovyan/ \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest \
		/stochss/stochss/tests/run_tests.py

build_and_test: build test

run: create_working_dir
	$(PYTHON_EXE) launch_webbrowser.py &
	docker run --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(DOCKER_WORKING_DIR):/home/jovyan/ \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest \
		bash -c "cd /home/jovyan; start-notebook.sh "


build_and_run: build run

run_bash:
	docker run -it --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(DOCKER_ROOT_DIR):/stochss \
		-v $(DOCKER_WORKING_DIR):/home/jovyan/ \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest \
		/bin/bash
watch:
	$(PYTHON_EXE) launch_webbrowser.py &
	docker run -it --rm \
		--name $(DOCKER_STOCHSS_IMAGE) \
		--env-file .env \
		-v $(DOCKER_ROOT_DIR):/stochss \
		-v $(DOCKER_WORKING_DIR):/home/jovyan/ \
		-p 8888:8888 \
		$(DOCKER_STOCHSS_IMAGE):latest \
		bash -c "cd /stochss;pip install --no-cache-dir -e .; npm run watch & sleep 10; cd /home/jovyan; start-notebook.sh "

update:
	docker exec -it $(DOCKER_STOCHSS_IMAGE) python -m pip install -e /stochss


.PHONY: network volumes check-files pull notebook_image build
