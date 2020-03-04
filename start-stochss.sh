#!/bin/bash

# Install stochss as a python library
python -m pip --no-cache-dir install -e .

cd ~

jupyter lab \
  --ip=0.0.0.0 \
  --notebook-dir=/home/jovyan \
  --config /stochss/jupyter_notebook_config.py \
