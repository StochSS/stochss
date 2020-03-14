FROM jupyter/minimal-notebook:latest

USER root

RUN apt-get update && apt-get install -y zip

RUN mkdir /stochss && chown jovyan:users /stochss && chmod o+rwx /stochss

USER jovyan

WORKDIR /stochss

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY --chown=jovyan:users . /stochss

COPY --chown=jovyan:users stochss-logo.png /home/jovyan/.jupyter/custom/logo.png

COPY --chown=jovyan:users custom.css /home/jovyan/.jupyter/custom/custom.css

COPY jupyter_notebook_config.py /home/jovyan/.jupyter/jupyter_notebook_config.py

#RUN python -m pip install -U pip pipenv

#RUN rm -f Pipfile.lock && pipenv lock -r > /stochss/requirements.txt

RUN python -m pip install --no-cache-dir -r requirements.txt

RUN python -m pip --no-cache-dir install -e .

RUN rm -r /home/jovyan/work

WORKDIR /home/jovyan
