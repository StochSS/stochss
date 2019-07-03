# StochSS 2

Stochastic Simulation as a Service

## Local Development Setup

- Install python 3, nodejs, npm, and openssl

- Install [pip](https://pip.pypa.io/en/stable/installing/) for python

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

- Make a new text file called `userlist`. This file contains a list of GitHub usernames that are able to use the OAuth credentials you just generated. By putting `admin` after a username, the user will have JupyterHub admin powers in the stochss app.

Example `userlist` file:
```bash
mygithubuser admin
```

- Setup the environment: install dependencies, build the jupyterhub docker image and singleuser image, database file, self-signed certificate, and app bundle.
```bash
make
```

This is equivalent to:
```bash
make build
make notebook_image
make database
make cert
make webpack
```

- Run the container
```bash
make run
```

- In another terminal, you can run webpack in watch mode to automatically update the app bundle on client source changes.
```bash
make watch
```

- Navigate to `https://localhost/hub` for JupyterHub or `https://localhost/hub/stochss` for StochSS.
