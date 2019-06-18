# StochSS 2

Stochastic Simulation as a Service

## Setup

- Install python3, nodejs, npm
- Install pip for python
- Install this proxy to global npm packages (need root)
```bash
npm install -g configurable-node-proxy
```
- Install pipenv with pip
```bash
pip install pipenv
```
### Set up the client

- Install npm packages
```bash
cd stochss/client
npm install
```
- Run webpack in watch mode to generate new bundles on changes to /src
```bash
npm run watch
```
- Or do a one-time build
```bash
npm run build
```
... both of which output bundle files to `server/static/`

### Set up the server

- Install python packages to a virtual environment in pipenv
```bash
cd stochss/server
pipenv install
```
- Open a shell in the virtualenv
```bash
# Make note of the virtualenv path
pipenv shell
```
- Create a symbolic link to the jupyterhub static directory in the virtualenv folder
  - Replace `server-**-*****` with the name of the virtualenv folder in `~/.local/share/virtualenvs`
```bash
export VIRTUALENV=server-**-****** && \
ln -s -T /path/to/stochss/server/static \
         /home/$USER/.local/share/virtualenvs/$VIRTUALENV/share/jupyterhub/static/stochss
```
- Create a db file to work with
```bash
python create_db.py
```
- Run jupyterhub
```bash
jupyterhub
```
- Go to `http://localhost:8000/hub/stochss` in a browser
- Login with local system user credentials

