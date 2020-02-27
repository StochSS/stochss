#!/bin/bash

python -m pip install -e .

jupyter lab \
  --ip=0.0.0.0 \
  --notebook-dir=/home/jovyan \
  --config /stochss/jupyter_notebook_config.py \
  --allow-root
