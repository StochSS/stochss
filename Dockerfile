FROM jupyter/minimal-notebook:latest

WORKDIR /stochss

USER root

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY requirements.txt .

RUN pip install -r requirements.txt

CMD ["./start.sh"]
