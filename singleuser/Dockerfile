ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_NOTEBOOK_IMAGE
ARG JUPYTERHUB_VERSION
RUN python3 -m pip install --no-cache \
  jupyterhub==$JUPYTERHUB_VERSION \
  gillespy2

WORKDIR /home/jovyan

RUN rmdir work && mkdir -p Models Notebooks Jobs Models/Examples

COPY --chown=jovyan:users public_models/* Models/Examples/

# Overwrite the default page template for the jupyter notebook
COPY --chown=jovyan:users page.html /opt/conda/lib/python3.7/site-packages/notebook/templates/

# Copy helper scripts
COPY scripts/* /usr/local/bin/
