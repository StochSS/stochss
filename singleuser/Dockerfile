FROM jupyterhub/k8s-singleuser-sample:0.8.2

USER root

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y vtk6 g++ make

RUN python3 -m pip install --no-cache \
  numpy \
  scipy \
  python-libsbml \
  vtk \
  https://github.com/spatialpy/SpatialPy/tarball/develop \
  pygmsh==5.0.2 \
  meshio==2.3.10 

RUN python3 -m pip install --no-cache --force-reinstall \
  https://github.com/GillesPy2/GillesPy2/tarball/develop

RUN apt-get update && apt-get install -y screen vim

RUN rmdir /home/jovyan/work

COPY --chown=jovyan:users public_models /home/jovyan/Examples

# Overwrite the default page template for the jupyter notebook
COPY --chown=jovyan:users page.html /opt/conda/lib/python3.6/site-packages/notebook/templates/

# Copy helper scripts
COPY scripts/* /usr/local/bin/
