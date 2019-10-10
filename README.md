
This is a work in progress!

# Local development with minikube

Install [VirtualBox](https://www.virtualbox.org/)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop) for Windows or macOS, or Docker Engine for Linux.

Install [minikube](https://github.com/kubernetes/minikube) 

Install [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) v1.11.1. (This is the version of kubernetes used by the Jetstream OpenStack Magnum API.)

Install [helm](https://github.com/helm/helm), the package manager for kubernetes.

Now, we want this repository to be mounted into our minikube VM so edits to the source will show up in real time. The easiest way to make this happen is to put the stochss repository under a folder that is mounted into minikube by default. NOTE: the host directories are mounted to different directories in the VM! See [this page](https://minikube.sigs.k8s.io/docs/tasks/mount/) for more on this.

The default mounts for the VirtualBox driver are: 

- Linux: `/home` mounts to `/hosthome`
- macOS: `/Users` mounts to `/Users`
- Windows: `C://Users` mounts to  `/c/Users`

Did you put the repo under the default mount folder for your OS? Good.

Time to start up the minikube VM with a kubernetes cluster. 
  
### Configure Minikube
  
- **Create Config File**  
  - Open `config-minikube.yaml.template` and save a copy as `config-minikube.yaml`. 
- **Generate Secure Tokens**
  - Run the command `openssl rand -hex 32` twice (or use an [online generator for random hex](https://www.browserling.com/tools/random-hex)).  
- **In the new file:**  
  - replace `{{COOKIE_SECRET}}` and `{{SECRET_TOKEN}}` with the two different random 32-bit hex strings
  - replace `{{STOCHSS_HOSTPATH}}` with the path to this repository in the minikube VM.  
    *(You can double-check this by running `minikube ssh` and then finding the directory within the VM)*.
  
### Start New Minikube Instance
***FOR LINUX AND MAC:***  
Simple installation can be performed using minikube_startup.sh.  
```
./minikube_startup.sh
```
  
  
**Alternatively, you can utilize the following steps:**
  
We're using kubernetes v1.11.1. Change the memory/cpu requirement if you need to, and make sure VirtualBox is installed!

```minikube --kubernetes-version v1.11.1 --memory 5000 --cpus 2 --vm-driver=virtualbox start```

Minikube will create a new `kubectl` context called 'minikube' and set your current context to it. See `kubectl config` for more on this.

Once you've done that, you just need to put the path to this repository within the minikube VM into the jupyterhub config file.

Sweet! Now setup a k8s service account for helm.
```
kubectl create -f tiller-sa.yaml
```

Then initialize helm.
```helm init --service-account tiller --wait --history-max 200```


Then set up the jupyterhub helm repository...
```
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update
```

Now it's time to set up your terminal environment to use the docker daemon inside of the minikube VM. Our kubernetes cluster is going to look for local docker images from which to create containers, and this way we can build images inside the VM from your host machine!
```
eval $(minikube docker-env)
```

**SUPER IMPORTANT**: You will need to run the previous command in any new terminal that you want to rebuild images into the minikube VM with!

Now build the jupyterhub image.
```
docker build -t stochss-hub:dev .
```

Then build the notebook server image. You'll want to be in the `singleuser` directory for this.
```
# From the singleuser directory
docker build -t stochss-singleuser:dev .
```

Now it's time to install stochss via jupyterhub inside the minikube VM! Yay!
```
helm upgrade --install jhub jupyterhub/jupyterhub \
      --namespace jhub \
      --version 0.8.2 \
      --values config-minikube.yaml --values secrets-minikube.yaml
```

Give role access to access in-cluster pods from jhub namespace
```
# From stochss directory
kubectl apply -f pods-list-sa.yaml
```

At this point you can do `kubectl get pods -n jhub` and you should get a list of pods that are either running or being created. If they're not all in the `Running` state, run the same `get pods` command again until you see that they're all running. If they're in an `Error` state or `CrashLoopBackOff` state, something went wrong!

Get the IP address of your minikube VM.
```
minikube ip
```

The URL for your local stochss instance is IP:31212.

TODO:

- Replace docker exec commands with k8s exec commands in stochss API handlers (currently broken)


### References
- [Minikube docs](https://minikube.sigs.k8s.io/docs/)
- [Zero to Jupyterhub Guide](https://zero-to-jupyterhub.readthedocs.io/en/latest/index.html)
