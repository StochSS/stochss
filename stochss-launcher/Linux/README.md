# Using StochSS on Linux

StochSS requires [Docker](https://www.docker.com/) to run. The script in this folder (launchContainerLinux1.7.sh) uses Docker to download and run StochSS inside a Docker container (this is basically a lightweight virtual machine). Docker and this script are all you need to run Stochss on your Linux computer.

**Note**: The Ubuntu 12.04 default kernel is too old to support Docker. 12.04 users can instead just run StochSS [without the container]{linktoolddownloads}

## Running StochSS

1. Install Docker using directions here: https://docs.docker.com/engine/installation/linux/
2. Open up a terminal window
3. Download the Ubuntu run script script : `curl -o launchContainerLinux1.7sh urltoscript`
4. Run : `sudo ./launchContainerLinux1.7.sh`

## Uninstalling StochSS

1. Open up a terminal window
2. Run : 
     - `sudo docker stop stochsscontainer1_7`
     - `sudo docker rm stochsscontainer1_7`

## Note on security

When you run StochSS, it is encapsulated inside a Docker container. Even though you use sudo the launch the container, StochSS does not have root permissions on your computer. The security of this container is similar to a VM. If something goes wrong with the StochSS container, it is (hopefully) isolated from everything else.
