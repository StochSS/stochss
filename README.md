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
npm run webpack
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
- Make a directory called `secrets` in the `server` folder
- Generate a self-signed certificate for local development
```bash
pipenv run certs
```
- Register a new [GitHub OAuth Application](https://github.com/settings/applications/new) to use for your personal development environment.
  - Set 'Application name' to `initials-stochss-dev` where `initials` is the initials of your name. Or set the application name to whatever you want.
  - Set 'Homepage URL' to `https://localhost/hub`
  - Set 'Authorization callback URL' `https://localhost/hub/oauth_callback`
  - Click the "Register application" button and keep the confirmation page open for the next step

- After you've registered your oauth app, make a new file in the `secrets` folder called `oauth.env` and make it look like so (replacing `<GITHUB_CLIENT_ID>` and `<GITHUB_CLIENT_SECRET>` with values from the OAuth app confirmation page from above:
```bash
GITHUB_CLIENT_ID=<GITHUB CLIENT ID>
GITHUB_CLIENT_SECRET=<GITHUB CLIENT SECRET>
OAUTH_CALLBACK_URL=https://localhost/hub/oauth_callback
```
- Make a new text file in `stochss/server` called `userlist`. This file contains a list of GitHub usernames that are able to use the OAuth credentials you just generated. By putting `admin` after a username, the user will have JupyterHub admin powers in the stochss app.

Example `userlist` file contents:
```bash
mygithubuser admin
```
- Build the docker container for user servers
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
