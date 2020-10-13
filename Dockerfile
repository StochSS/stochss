FROM jupyter/minimal-notebook:612aa5710bf9

ARG STOCHSS_PIP_EDITABLE
ARG JUPYTER_CONFIG_DIR
ARG JULIA_VERSION=1.5.2
ARG JULIA_MAJOR_FOLDER=1.5

USER root

WORKDIR /stochss

RUN apt-get update && apt-get install -y zip

RUN chown jovyan:users /stochss

USER jovyan

COPY --chown=jovyan:users requirements.txt .

COPY --chown=jovyan:users jupyter_notebook_config.py $JUPYTER_CONFIG_DIR/jupyter_notebook_config.py

RUN python -m pip install --no-cache-dir -r requirements.txt

USER root

RUN wget -q https://julialang-s3.julialang.org/bin/linux/x64/$JULIA_MAJOR_FOLDER/julia-$JULIA_VERSION-linux-x86_64.tar.gz \
    && tar -xvzf julia-$JULIA_VERSION-linux-x86_64.tar.gz \
    && mv julia-$JULIA_VERSION /usr/local/ \
    && chown -R jovyan:users /usr/local/julia-$JULIA_VERSION/

USER jovyan

ENV PATH="/usr/local/julia-$JULIA_VERSION/bin:${PATH}"

RUN mkdir /usr/local/julia-$JULIA_VERSION/depot/ && chown -R jovyan:users /usr/local/julia-$JULIA_VERSION/depot/

ENV JULIA_DEPOT_PATH=/usr/local/julia-$JULIA_VERSION/depot/
ENV DEPOT_PATH=/usr/local/julia-$JULIA_VERSION/depot/
ENV JUPYTER_PATH=/opt/conda/bin/jupyter

RUN julia -e \
'ENV["JUPYTER_DATA_DIR"]="/opt/conda/share/jupyter"; \
ENV["JUPYTER"]="/opt/conda/bin/jupyter"; \
using Pkg; \
Pkg.add("IJulia"); \
Pkg.build("IJulia"); \
Pkg.add(PackageSpec(url="https://github.com/stochss/gillespy2lia", rev="main"))'

COPY --chown=jovyan:users public_models/ /home/jovyan/stochss/Examples

COPY --chown=jovyan:users . /stochss

COPY --chown=jovyan:users stochss-logo.png $JUPYTER_CONFIG_DIR/custom/logo.png

COPY --chown=jovyan:users custom.css $JUPYTER_CONFIG_DIR/custom/custom.css

RUN pip install --no-cache-dir -e .

RUN rm -r /home/jovyan/work

WORKDIR /home/jovyan/stochss
