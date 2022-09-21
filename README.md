# StochSS: Software as a service for simulation-driven investigations of stochastic biochemical models

StochSS provides advanced tools for simulating and analyzing biochemical systems as Software as a Service. StochSS supports a wide range of model types ranging from continuous ODEs to discrete (spatial) stochastic simulations as well as advanced model analysis workflows.  
  
**Try out [StochSS Live!](https://live.stochss.org)**  
  
## Why use StochSS
StochSS provides both an easy-to-use UI for constructing biochemical models as well as intuitive UIs for the most common model analysis tools such as visualization of results, parameter sweeps and parameter inference. StochSS is built on top of Jupyter Hub, and this lets you seemlessly switch between UI representations and Notebooks exposing the full backend API. In this way a user can benefit from the best of graphical representations with a clear upgrade path to modeling as code. For this reason, StochSS is also uniquely suited for the computational biologist starting out with mathematical modeling of biochemical systems. 

StochSS is a software project involving several leading research groups in computational systems biology. We welcome collaborators to help expand the capabilities of StochSS. Read more about the project at [www.stochss.org](http://www.stochss.org).   

StochSS is intended to be used as Software as a Service via [StochSS Live!](https://live.stochss.org). The following instructions can help you set up your own local development environment or deploy your own instance as SaaS.

## Deploying your own Single-User StochSS Instance
### Requirements

- [Nodejs](https://nodejs.org/)

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows and Mac) or [Docker Engine](https://docs.docker.com/install/) (Linux, Mac, and Windows)

At the moment StochSS development on Windows is not supported. You can try using [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), but this is untested!

### Quickstart

- Build and run the StochSS notebook server. This starts a local docker container running StochSS.    
  `make`

- Once your terminal calms down you'll see a link to your server that looks something like this: `127.0.0.1:8888/?token=X8dSfd...` Navigate to that link and get started.

- Your files are persisted on your local machine to the `local\_data/` directory by default.

### Setup

- Build the docker container.   
  `make build`

- Run the container.   
  `make run`

- Rebuild frontend static assets on changes to files in `/client` .  
  `make watch`

- Upon changing backend code in stochss/handlers you can update a running StochSS notebook server.  
  `make update`

- [Optional] By default your files are saved to your local machine at `./local\_data/` . You can change this location by the changing value of `DOCKER\_WORKING\_DIR` in the file `.env` .

#### Add a python dependency

Use `requirements.txt` to add Python dependencies that will be installed into the StochSS docker container.

## Deploying Multi-User StochSS

StochSS uses [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/#) as the basis for the multi-user deployment.  See their documentation for more details on configuring the JupyterHub environment.
  
### Setup

- In addition to the single-user requirements, you will need [Docker Compose](https://docs.docker.com/compose/install/).  

- [Optional] To set admins for JupyterHub, make a file called `userlist` in the `userlist/` directory. On each line of this file place a username followed by the word 'admin'. For example: `myuser admin`. If using Google OAuth, the uesername will be a Gmail address. Navigate to `/hub/admin` to use the JupyterHub admin interface.

- [Optional] By default multi-user StochSS is set up to allocate 2 logical cpus per user, reserving 2 logical cpus for the hub container and underlying OS. You can define "power users" that are excluded from resource limitations using the same method as above for adding an admin, but instead of following the username with 'admin', use the keyword 'power' instead.

- [Optional] To disseminate messages to all users, make a JSON decodable file called `messages` in the `userlist/` directory. The contents of the `messages` file should be formatted as a list of dictionaries defining each message. Accepted keys are `message`, string containing the message to be display with tags for dates and time i.e. `StochSS Live! will be down for scheduled maintenance on __DATE__ from __START__ to __END__` an additional `__DATE__` tag can be added if the start and end dates differ, `start`, string representing the starting date and time i.e. `Sep 26, 2022  14:00 EST`, `end`, string representing the ending date and time i.e. `Sep 26, 2022  18:00 EST`, and `style`, a string containing a background color keyword i.e. `warning` or css i.e. `background-color: rgba(160, 32, 240, 0.5) !important;`.

### Run Locally

To run JupyterHub locally run `make hub` and go to `http://127.0.0.1:8000/` .

### Set Up A Staging Server

To set up the staging environment you'll need to [set up Google OAuth](https://developers.google.com/identity/protocols/oauth2) for your instance.  Once you're set up, you'll need to put your OAuth credentials in `jupyterhub/secrets/.oauth.staging.env`. Do not wrap these environment variables in quotes!

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

### Set Up A Production Server

Similar to staging, except you'll need the correct Google OAuth credentials set in `jupyterhub/secrets/.oauth.prod.env`.

Then:

```bash
make build
make build_hub
make run_hub_prod
```

