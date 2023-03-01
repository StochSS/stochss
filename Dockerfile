FROM jupyter/minimal-notebook:612aa5710bf9

ARG STOCHSS_PIP_EDITABLE
ARG JUPYTER_CONFIG_DIR


USER root

WORKDIR /stochss

RUN apt-get update && apt-get install -y zip

RUN chown jovyan:users /stochss

USER jovyan

COPY --chown=jovyan:users requirements.txt .

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY --chown=jovyan:users package.json /stochss  

RUN npm install

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY --chown=jovyan:users . /stochss  

COPY --chown=jovyan:users /stochss/dist/favicon.ico $JUPYTER_CONFIG_DIR/custom/favicon.ico

COPY --chown=jovyan:users custom.js $JUPYTER_CONFIG_DIR/custom/custom.js

COPY --chown=jovyan:users stochss-logo.png $JUPYTER_CONFIG_DIR/custom/logo.png

COPY --chown=jovyan:users custom.css $JUPYTER_CONFIG_DIR/custom/custom.css

COPY --chown=jovyan:users jupyter_notebook_config.py $JUPYTER_CONFIG_DIR/jupyter_notebook_config.py

RUN pip install --no-cache-dir -e .

RUN rm -r /home/jovyan/work

RUN npm run webpack

WORKDIR /home/jovyan
