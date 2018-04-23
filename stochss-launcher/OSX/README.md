#Using StochSS on Mac OSX

StochSS requires Docker to run. 

## Running StochSS using 'Docker for Mac'

1. Install Docker using directions here: https://docs.docker.com/engine/installation/mac/#installation
2. Double click the StochSS-no_docker_machine application to launch the server

## Running StochSS on older machines using 'Docker Toolbox'
On older Macs it is not possible to run the native Docker application. In this case, use Docker Toolbox that runs using docker-machine

1. Install Docker Toolbox using directions here: https://docs.docker.com/engine/installation/mac/#installation
2. Double click the StochSS application to launch the server

###When things go wrong
   + Leaving StochSS is running while the computer goes to sleep can cause the network configuration of the virtual machine       to change unexpectedly when the computer is woken up again. This means that StochSS could become temporarily                 inaccessible. Performing the following steps may solve this:
     - Quit the StochSS application, if its running
     - Open a new terminal window
     - Run the following commands:
       * `docker-machine start stochss1-8`
       * `docker-machine ssh stochss1-8`
       * `docker stop stochsscontainer1_8`
       * `docker start stochsscontainer1_8`
       * `exit`
      
    - Double click the StochSS app to start up the server. 
   
     Our suspicion is that when we ssh into the virtual machine, it's network configuration is reset/corrected.


##Uninstalling StochSS
Double click 'Uninstall StochSS'  and follow the on screen instructions to uninstall StochSS

##Note on security
When you run StochSS, it is encapsulated inside the Docker container. If something goes wrong with this container, it is isolated from everything else on your system.

