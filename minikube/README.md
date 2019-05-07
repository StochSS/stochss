
# Run BinderHub locally with minikube

### Requirements

1. Linux machine (macOS might work too, but has not been tested).
2. Two available cpus to devote to the minikube VM
3. At least 5GB of available RAM to dedicate to the minikube cluster.
4. [VirtualBox](https://www.virtualbox.org/wiki/Downloads).
5. [Docker Hub](https://hub.docker.com) account is setup

### Setup

1. `./install_minikube` to install [minikube](https://github.com/kubernetes/minikube) and [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
2. `./bootstrap_cluster` to bootstrap a new minikube cluster and install [Helm](https://helm.sh/)
3. `./setup_binderhub` to install BinderHub on the minikube cluster.
4. Run `minikube tunnel` in a separate terminal (see [here](https://github.com/kubernetes/minikube/blob/master/docs/tunnel.md)).
5. Store the IP address of the JupyterHub proxy:
```bash
HUB_PROXY_IP=$(kubectl get svc --namespace binder proxy-public -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
# Make sure we stored an actual IP address in case something went wrong with the tunnel
echo $HUB_PROXY_IP
```
6. Add the proxy IP address to our config file:
```bash
sed -i "s/HUBPROXYIP/$HUB_PROXY_IP/g" config.yaml
```
7. Update the BinderHub application:
```bash
helm upgrade binder jupyterhub/binderhub --version=0.2.0-10ac4d8 -f secret.yaml -f config.yaml
```
8. Get the IP address of the BinderHub:
```bash
echo http://$(kubectl get svc --namespace binder binder -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```
9. Copy the output from the previous command and go to the address in a web browser.
10. Try out your local BinderHub instance!


### Notes

If the output of \`minikube tunnel\` is reporting routing errors, try running \`minikube tunnel --cleanup\`. If the cleanup command complains, you'll have to delete the kernel route manually, [which is actually pretty easy](https://serverfault.com/questions/181094/how-do-i-delete-a-route-from-linux-routing-table). There should be two routes with `Iface` set to `vboxnet1` or something similar in the output to `route -n`. Delete the route that does NOT have Gateway set to `0.0.0.0`. Then try `minikube tunnel` again.

### References

- [BinderHub docs](https://binderhub.readthedocs.io/en/latest/index.html)
- [Zero to Jupyterhub Guide](https://zero-to-jupyterhub.readthedocs.io/en/latest/index.html)
