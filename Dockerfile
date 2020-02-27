FROM jupyter/minimal-notebook:latest

WORKDIR /stochss

USER root

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

RUN rm -r /home/jovyan/work

COPY requirements.txt .

RUN pip install -r requirements.txt

CMD ["./start.sh"]
