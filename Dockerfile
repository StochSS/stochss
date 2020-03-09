FROM jupyter/minimal-notebook:latest

USER jovyan

WORKDIR /stochss

COPY requirements.txt .

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY --chown=jovyan:users . /stochss

COPY jupyter_notebook_config.py /home/jovyan/.jupyter/jupyter_notebook_config.py

RUN python -m pip --no-cache-dir install -e .

RUN rm -r /home/jovyan/work

WORKDIR /home/jovyan
