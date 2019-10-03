FROM jupyterhub/k8s-singleuser-sample:0.8.2

RUN python3 -m pip install --no-cache \
  gillespy2

WORKDIR /home/jovyan

RUN rmdir work && mkdir -p Models Notebooks Jobs Models/Examples

COPY --chown=jovyan:users public_models/* Models/Examples/

# Overwrite the default page template for the jupyter notebook
#COPY --chown=jovyan:users page.html /opt/conda/lib/python3.6/site-packages/notebook/templates/

# Copy helper scripts
COPY scripts/* /usr/local/bin/
