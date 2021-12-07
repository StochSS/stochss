FROM ubuntu:20.04

RUN apt-get update && apt-get install -y python3 python3-pip git

RUN python3 -m pip install docker voila ipywidgets

RUN python3 -m pip install python-libsbml==5.18.0 \
    python-libsedml==2.0.9 \
python-libcombine==0.2.7 \
escapism==1.0.1 \
gillespy2==1.6.6 \
git+https://github.com/StochSS/sciope.git@master \
pygmsh==5.0.2 \
meshio==2.3.10 \
git+https://github.com/StochSS/SpatialPy.git@develop

CMD ["voila", "--enable_nbextensions=True"]
