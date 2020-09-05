# StochSS: Software as a service for simulation-driven investigations of stochastic biochemical models

StochSS provides advanced tools for simulating and analyzing biochemical systems as Software as a Service. StochSS supports a wide range of model types ranging from continuous ODEs to discrete (spatial) stochastic simulations as well as advanced model analysis workflows. Try out StochSS here: https://app.stochss.org .

## Why use StochSS
StochSS provides both an easy-to-use UI for constructing biochemical models as well as intuitive UIs for the most common model analysis tools such as visualization of results, parameter sweeps and parameter inference. StochSS is built on top of Jupyter Hub, and this lets you seemlessly switch between UI representations and Notebooks exposing the full backend API. In this way a user can benefit from the best of graphical representations with a clear upgrade path to modeling as code. For this reason, StochSS is also uniquely suited for the computational biologist starting out with mathematical modeling of biochemical systems. 

StochSS is a sotware project involving several leading research groups in computational systems biology. We welcome collaborators to help expand the capabilities of StochSS. Read more about the project at www.stochss.org .   

*StochSS is intended to be used as Software as a Service. The instructions that follows help you set your own local development environment or deploy your own instance as SaaS. If you intend to mainly use StochSS for modeling, simulation and model analysis, consider using the hosted deployment at http://app.stochss.org which you can access without any installation. 

## Requirements

- [Nodejs](https://nodejs.org/)

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows and Mac) or [Docker Engine](https://docs.docker.com/install/) (Linux, Mac, and Windows)

- [Docker Compose](https://docs.docker.com/compose/install/) (Only required if you want to run StochSS with [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/#))

*At the moment StochSS development on Windows is not supported. You can try using [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), but this is untested!

## Quickstart

- Build and run the stochss notebook server: `make`

- Once your terminal calms down you'll see a link to your server that looks something like this: `127.0.0.1:8888/?token=X8dSfd...`


- Navigate to that link and get started!

## Setup

- Build the docker container: `make build`.

- Run the container: `make run`.

- Rebuild frontend static assets on changes to files in /client:  `make watch`.

- Upon changing backend code in stochss/handlers you can update a running StochSS notebook server  with `make update`.

### Add a python dependency

Use requirements.txt to add Python dependencies that will be installed into the StochSS docker container.

## JupyterHub

JupyterHub is a multi-user system for spawning Jupyter notebook servers. We use JupyterHub to serve the StochSS home page and spawn StochSS notebook servers.

### Setup

- [Optional] To set admins for JupyterHub, make a file called `userlist` in the `jupyterhub/` directory. On each line of this file place a username followed by the word 'admin'. For example: `myuser admin`. If using Google OAuth, the uesrname will be a gmail address. Navigate to `/hub/admin` to use the JupyterHub admin interface.

- [Optional] By default multi-user StochSS is set up to allocate 2 logical cpus per user, reserving 2 logical cpus for the hub container and underlying OS. You can define a list of "power users" that are excluded from resource limitations by adding a text file called `.power_users` (note the leading period) to the `jupyterhub/` directory with one username/email address on each line of the file.

### Run Locally

- To run JupyterHub locally run `make hub` and go to 127.0.0.1:8888.

### Setup Staging Server

To setup the staging environment you'll need the correct Google OAuth setup in `jupyterhub/secrets/.oauth.staging.env`. Do not wrap these environment variables in quotes!

Example oauth file:

```bash
OAUTH_CALLBACK=https://staging.stochss.org/hub/oauth_callback
CLIENT_ID=8432438242-32432ada3ff23f248sf7ds.apps.googleusercontent.com
CLIENT_SECRET=adfsaf2327f2f7taafdsa34
```

After your oauth credentials are setup, run these commands:

```bash
make build
make build_hub
make run_hub_staging
```

### Setup Production Server

Similar to staging, except you'll need the correct Google OAuth credentials set in `jupyterhub/secrets/.oauth.prod.env`.

Then:

```bash
make build
make build_hub
make run_hub_prod
```

