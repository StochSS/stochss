FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y install wget git bzip2 && \
    apt-get purge && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
ENV LANG C.UTF-8

RUN wget -q https://repo.continuum.io/miniconda/Miniconda3-4.5.11-Linux-x86_64.sh -O /tmp/miniconda.sh  && \
    echo 'e1045ee415162f944b6aebfe560b8fee */tmp/miniconda.sh' | md5sum -c - && \
    bash /tmp/miniconda.sh -f -b -p /opt/conda && \
    /opt/conda/bin/conda install --yes -c conda-forge \
      python=3.6 jupyterhub sqlalchemy tornado jinja2 traitlets requests pip pycurl \
      nodejs configurable-http-proxy

RUN /opt/conda/bin/pip install --upgrade \
      pip \
      oauthenticator \
      dockerspawner \
      notebook \
      python-dotenv

RUN rm /tmp/miniconda.sh

WORKDIR /srv/jupyterhub

ENV PATH=/opt/conda/bin:$PATH

RUN ln -s /srv/jupyterhub/dist/ /opt/conda/share/jupyterhub/static/stochss

CMD ["jupyterhub"]
