###Using StochSS on Mac OSX
StochSS requires Docker Machine to run. Once Docker Machine is installed on your machine, simply double click the app icon to run StochSS.

###Running StochSS
1. Install Docker Toolbox using directions here: https://docs.docker.com/engine/installation/mac/#installation
2. Double click the StochSS application to launch server

###Uninstalling StochSS
Double click 'Uninstall StochSS'  and follow the on screen instructions to uninstall StochSS

###Note on security
When you run StochSS, it is encapsulated inside a virtual machine. If something goes wrong with the StochSS virtual machine, it is isolated from everything else on your system.

###When things go wrong
   + Leaving StochSS is running while the computer goes to sleep can cause the network configuration of the virtual machine       to change unexpectedly when the computer is woken up again. This means that StochSS could become temporarily                 inaccessible. Performing the following steps may solve this:
     - Quit the StochSS application, if its running
     - Open a new terminal window
     - Run the following commands:
       * `docker-machine start stochss1-7`
       * `docker-machine ssh stochss1-7`
       * `docker stop stochsscontainer1_7`
       * `docker start stochsscontainer1_7`
       * `exit`
      
    - Double click the StochSS app to start up the server. 
   
     Our suspicion is that when we ssh into the virtual machine, it's network configuration is reset/corrected.
