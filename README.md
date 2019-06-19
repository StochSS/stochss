# StochSS 2

Stochastic Simulation as a Service

## Local Development Setup

- Install python 3, nodejs, npm, openssl
- Install [pip](https://pip.pypa.io/en/stable/installing/) for python
- Install this proxy to global npm packages (requires root)
```bash
npm install -g configurable-http-proxy
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
- Generate a new app bundle

For local development, run webpack in watch mode to generate new bundles on changes to /src
```bash
npm run watch
```
...or do a one-time build...
```bash
npm run build
```
...both of which emit a bundle file to `stochss/server/static/`

### Set up the server

- Install python packages to a pipenv environment
```bash
cd stochss/server
pipenv install
```
- Create a db file to work with
```bash
pipenv run db
```
- Generate a self-signed certificate for local development
```bash
pipenv run certs
```
- Register a new [GitHub OAuth Application](https://github.com/settings/applications/new) to use for your personal development environment. 
  - Set 'Application name' to `initials-stochss-dev` where `initials` is the initials of your name. Or set the application name to whatever you want.
  - Set 'Homepage URL' to `https://localhost/hub`
  - Set 'Authorization callback URL' `https://localhost/hub/oauth_callback`

- After you've registered your oauth app, make a new file in the `secrets` folder called `oauth.env` and make it look like so:
```bash
GITHUB_CLIENT_ID=<GITHUB CLIENT ID>
GITHUB_CLIENT_SECRET=<GITHUB CLIENT SECRET>
OAUTH_CALLBACK_URL=https://localhost/hub/oauth_callback
```
- Build the docker containerf or user servers
```bash
make notebook_image
```
- Build the stochss-jupyterhub docker container
```bash
make
```
- Run stochss-jupyterhub
```bash
# Use -d to run in the background
docker-compose up
```
- Navigate to `https://localhost/hub` for JupyterHub or `https://localhost/hub/stochss` for StochSS.
