FROM jupyter/minimal-notebook:latest

USER root

RUN apt-get update && apt-get install -y zip

USER jovyan

WORKDIR /stochss

RUN rm -r /home/jovyan/work

COPY requirements.txt .

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY --chown=jovyan:users start-stochss.sh /usr/local/bin

CMD ["start-stochss.sh"]
