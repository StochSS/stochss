## Core commands

### Bootstrap a local development environment
This command deletes any existing minikube VM and creates a new VirtualBox VM with a new kubernetes cluster running jupyterhub/stochss. You shouldn't need to use this unless you don't have a VM already or you did some serious tinkering with the k8s cluster or VM that is causing issues.

```bash
./minikube_bootstrap.sh
```

### Boot up an existing VM
```bash
make run
```
or
```bash
minikube --kubernetes-version v1.11.10 --vm-driver=virtualbox start
```

### Rebuild the hub docker image
Rebuild the hub image & re-launch the hub pod. Deletes the hub pod and rebuilds the hub image. Use this if you modify any of the handler files.
```bash
./minikube_rebuild_hub.sh
```

### Rebuild the notebook image
1. First we need to shutdown any running user servers. From the jupyterhub interface, click the "Quit" button in the top-right corner. This will delete the user pod.
2. Run `./minikube_rebuild_singleuser.sh`. This command rebuilds the notebook server image. After this you can go to /hub/spawn to reboot a new container with the updated image!

### Install jupyterhub/stochss
Use this command if you make any changes to minikube-config.yaml. It re-deploys the jupyterhub helm package with the updated configuration.
```bash
./minikube_install_jhub_minikube.sh
```

### Build front-end bundles
Run one of these commands to make new bundle files for the front-end: `make webpack` or `npm run webpack`.

### Watch for changes to client files
Run one of these commands to start a terminal process that watches for changes to client files and builds new bundle files following any changes.
```bash
make watch
```
or
```bash
npm run watch
```

## Other Commands

Get the IP address of the minikube VM: 
```bash
minikube ip```

Open a secure shell into the minikube VM: 
```bash
minikube ssh```

Get the status of a minikube VM: 
```bash
minikube status```

Power down the minikube VM: 
```bash
minikube stop```

Get a list of pods in the jupyterhub namespace (use `-w` to stream updates as pod states change):
```bash
kubectl get pods -n jhub```

Get logs from the jupyterhub deployment (use `-f` to stream): 
```bash
kubectl logs -n jhub deployment/hub```

Get a shell into a user notebook server pod: 
```bash
kubectl exec -it -n jhub jupyter-username /bin/bash```

Set docker daemon to minikube VM's docker instance: 
```bash
eval $(minikube docker-env)```
