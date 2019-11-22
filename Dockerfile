FROM jupyterhub/k8s-hub:0.8.2

USER root

ENV DEBIAN_FRONTEND noninteractive

RUN ln -s /stochss/dist /usr/local/share/jupyterhub/static/stochss
