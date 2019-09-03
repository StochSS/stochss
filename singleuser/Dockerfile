ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_NOTEBOOK_IMAGE
ARG JUPYTERHUB_VERSION
RUN python3 -m pip install --no-cache \
  jupyterhub==$JUPYTERHUB_VERSION \
  gillespy2

RUN mv work Models && mkdir -p Jobs/ && mkdir -p Notebooks/ && mkdir -p Meshes

COPY ls.py /home/ls.py