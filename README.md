
**NOTE: ONLY MACOS AND LINUX ARE SUPPORTED DEVELOPMENT ENVIRONMENTS!**

# Local development with minikube

### Install tools

Install [VirtualBox](https://www.virtualbox.org/)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop) for macOS, or Docker Engine for Linux.

Install [minikube](https://github.com/kubernetes/minikube) 

Install [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) v1.11.10. (This is the version of kubernetes used by the Jetstream OpenStack Magnum API.)

Install [Helm v2.16.1](https://github.com/helm/helm/releases/tag/v2.16.1),  the package manager for kubernetes.

Install [nodejs](https://nodejs.org/) and [npm](https://www.npmjs.com/), the package manager for nodejs.

We want this repository to be mounted into our minikube VM so edits to the source will show up in real time. The easiest way to make this happen is to put the stochss repository in a subfolder that is mounted into minikube by default. NOTE: the host directories are mounted to different directories in the VM! See [this page](https://minikube.sigs.k8s.io/docs/tasks/mount/) for more on this.

The default mounts for the VirtualBox driver are: 

- Linux: `/home` mounts to `/hosthome`
- macOS: `/Users` mounts to `/Users`
- Windows: `C://Users` mounts to  `/c/Users`

Clone this repository in a subfolder that lives under one of the default mounted directories. It doesn't need to be a direct subfolder. As long as the repo lives somewhere under the default mount location, you're good to go.

### Start New Minikube VM

Let's boot up a VM with minikube!
```
./minikube_bootstrap.sh
```

Minikube will create a new kubectl context called 'minikube' and set your current context to it. See `kubectl config` for more on this.


**IMPORTANT FOR LINUX USERS:** The Default mount for VirtualBox on Linux is /hosthome, so you will need to run `./minikube_install_jhub /hosthome/path-to-stochss` 

At this point you run `kubectl get pods -n jhub` in a terminal and you see a list of pods returned that are either running or being created. If they're not all in the `Running` state, run the same `get pods` command again until you see that they're all running. If they're in an `Error` state or `CrashLoopBackOff` state, something went wrong!

**IMPORTANT:** If you need to start up your minikube VM from a "stopped" state, you MUST use the `--kubernetes-version v1.11.10` flag or else minikube will automatically upgrade your kubernetes version! You can use `make run` as a shortcut.

### Reflecting changes

Docker images used by our kubernetes cluster need to be built within the minikube VM itself. Luckily we can use use a handy minikube command to point our local docker command to the minikube VM's docker daemon:
```
eval $(minikube docker-env)
```

You'll notice this command is used in the utility scripts to rebuild the docker images, `minikube_rebuild_hub.sh` and `minikube_rebuild_singleuser.sh`. You can use these when you make changes to handler files, singleuser scripts, etc to see changes reflected in the application.

Changes to `config.yaml` are reflected a little differently. You can use the script `minikube_install_jhub.sh` to reinstall jupyterhub using the new configuration. Make sure your kubectl context is set to minikube!

### More help

You can find a list of useful commands in the document [COMMANDS.md](./COMMANDS.md).


### References
- [Minikube docs](https://minikube.sigs.k8s.io/docs/)
- [Zero to Jupyterhub Guide](https://zero-to-jupyterhub.readthedocs.io/en/latest/index.html)
