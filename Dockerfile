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

COPY --chown=jovyan:users public_models/ /home/jovyan/Examples

COPY --chown=jovyan:users . /stochss

COPY --chown=jovyan:users stochss-logo.png $JUPYTER_CONFIG_DIR/custom/logo.png

COPY --chown=jovyan:users custom.css $JUPYTER_CONFIG_DIR/custom/custom.css

COPY --chown=jovyan:users jupyter_notebook_config.py $JUPYTER_CONFIG_DIR/jupyter_notebook_config.py

USER root

#RUN wget -q https://julialang-s3.julialang.org/bin/linux/x64/1.4/julia-1.4.2-linux-x86_64.tar.gz
#RUN tar -xvzf julia-1.4.2-linux-x86_64.tar.gz
#RUN mv julia-1.4.2 /usr/local/
#RUN chown -R jovyan:users /usr/local/julia-1.4.2/

USER jovyan

#ENV PATH="/usr/local/julia-1.4.2/bin:${PATH}"

#RUN julia -e 'using Pkg; Pkg.add("IJulia")'
#RUN julia -e 'using Pkg; Pkg.add("Plots")'
#RUN julia -e 'using Pkg; Pkg.add(PackageSpec(url="https://github.com/stochss/gillespy2lia", rev="main"))'

RUN npm install

RUN npm run webpack

RUN pip install --no-cache-dir -e .

RUN rm -r /home/jovyan/work

WORKDIR /home/jovyan
