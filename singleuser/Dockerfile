FROM jupyterhub/k8s-singleuser-sample:0.8.2

USER root

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y libvtk6-dev vtk6

RUN python3 -m pip install --no-cache \
  gillespy2 \
  vtk \
  https://github.com/spatialpy/SpatialPy/tarball/develop \
  pygmsh==5.0.2 \
  meshio==2.3.10 

USER jovyan

WORKDIR /home/jovyan

RUN rmdir work && mkdir -p Models Notebooks Jobs Models/Examples

COPY --chown=jovyan:users public_models/* Models/Examples/

# Overwrite the default page template for the jupyter notebook
#COPY --chown=jovyan:users page.html /opt/conda/lib/python3.6/site-packages/notebook/templates/

# Copy helper scripts
COPY scripts/* /usr/local/bin/
