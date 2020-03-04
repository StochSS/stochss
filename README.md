# StochSS

(JupyterHub not connected yet)

### Setup 

- Install pipenv, an environment manager for python

`python3 -m pip install pipenv`

- Build the docker container
`make build`

### Run it

- Run the notebook server
`make run`

- Rebuild static assets on source changes
`make watch`

- Update a running server (for handlers/backend)
`make update`

### Add a python dependency

- Use pipenv to control dependencies

`pipenv install mylib`

- Create a new requirements.txt file and rebuild the docker container

`make build`
