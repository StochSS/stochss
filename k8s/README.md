
This is a work in progress!

# Local development with minikube

Install [VirtualBox](https://www.virtualbox.org/)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop) for Windows or macOS, or Docker Engine for Linux.

Install [minikube](https://github.com/kubernetes/minikube) 

Install [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) v1.11.1. (This is the version of kubernetes used by the Jetstream OpenStack Magnum API.)

Install [helm](https://github.com/helm/helm), the package manager for kubernetes.

Start up the cluster. We're using kubernetes v1.11.1. Change the memory/cpu requirement if you need to. Make sure VirtualBox is installed!

```minikube --kubernetes-version v1.11.1 --memory 5000 --cpus 2 --vm-driver=virtualbox start```

Minikube will create a new `kubectl` context called 'minikube' and set your current context it. See `kubectl config` for more on this.

Mount this repository into the minikube VM. The easiest thing to do is put the stochss repository under a folder that is mounted into minikube by default. TAKE NOTE: the host directories are mounted to different directories in the VM! See [this page](https://minikube.sigs.k8s.io/docs/tasks/mount/) for more on this.

The default mounts for the VirtualBox driver are: 

- Linux: `/home` mounts to `/hosthome`
- macOS: `/Users` mounts to `/Users`
- Windows: `C://Users` mounts to  `/c/Users`

Okay, once you've done that, you just need to set the path to this repository (in the minikube VM) in the jupyterhub config file.

Open `config-minikube.yaml.template` and save as `config.minikube.yaml`. In the new file, replace `{{STOCHSS_HOSTPATH}}` with the path to this repository in the minikube VM. You can double-check this by running `minikube ssh` and then finding the directory within the VM.

Setup a k8s service account for helm.
```
# From k8s directory
kubectl create -f tiller-sa.yaml
```

Initialize helm
```helm init --service-account tiller --wait --history-max 200```

Setup the jupyterhub helm repository.
```
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update
```

Then set up your environment to use the docker daemon inside of the minikube VM. **IMPORTANT**: You'll need to run this command in any new terminal that you want to rebuild images into minikube with!
```eval $(minikube docker-env)```

Build the jupyterhub image.
```
# From the base of the stochss repository
docker build -t stochss-hub:dev .
```

Build the notebook user image.
```
# From the singleuser directory
docker build -t stochss-singleuser:dev .
```

Install jupyterhub inside the minikube VM.
```
# From the k8s directory
helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config-minikube.yaml --values secrets-minikube.yaml
```

Get the IP address of your minikube VM.
```minikube ip```

The URL for your local stochss instance is IP:31212.

TODO:

- Replace docker exec commands with k8s exec commands in stochss API handlers (currently broken)


### References
- [Minikube docs](https://minikube.sigs.k8s.io/docs/)
- [Zero to Jupyterhub Guide](https://zero-to-jupyterhub.readthedocs.io/en/latest/index.html)
