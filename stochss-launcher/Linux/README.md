# Using StochSS on Linux

StochSS requires [Docker](https://www.docker.com/) to run. The script in this folder (stochss.sh) uses Docker to download and run StochSS inside a Docker container (this is basically a lightweight virtual machine). Docker and this script are all you need to run Stochss on your Linux computer.

**Note**: The Ubuntu 12.04 default kernel is too old to support Docker. 12.04 users should instead use the old installation process ([here](http://www.stochss.org/?page_id=738)).

## Running StochSS

1. Install Docker using directions here: https://docs.docker.com/engine/installation/linux/
2. Run : `bash ./stochss.sh`

## Uninstalling StochSS

1. Open up a terminal window
2. Run : 
     - `sudo docker stop stochsscontainer1_8`
     - `sudo docker rm stochsscontainer1_8`

## Note on security

When you run StochSS, it is encapsulated inside a Docker container. Even though you use sudo the launch the container, StochSS does not have root permissions on your computer. The security of this container is similar to a VM. If something goes wrong with the StochSS container, it is (hopefully) isolated from everything else.
