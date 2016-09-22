###Using StochSS on Windows
_Please note_: 
+ StochSS does not run on Microsoft Edge browser. The recommended browser is <a href="https://www.google.com/chrome/browser/desktop/">Google Chrome</a>.
+ You may have to enable virtualization in the BIOS (Use this Microsoft Virtualization detector to check if virtualization is enabled in your system: https://www.microsoft.com/en-us/download/details.aspx?id=592. If it's not, please enable it from the BIOS first).
+ You need Windows 7 64 bit at least.

StochSS requires Docker Toolbox for Windows to run. 

ProTip! 
+ To paste text from your clipboard to Docker Quickstart terminal, _right click_ onto the terminal screen. 
+ To copy text from the Docker Quickstart terminal onto your clipboard, highlight the desired text and press _enter/return_.
+ Launching and using StochSS on Windows is error-prone. Some useful commands that may help you in figuring out what's going   on when things don't work as expected are: 
     - `docker-machine ls`  will list the virtual machines running and their status.
     - `docker ps`  will list the containers that are _running_.
     - `docker ps -aq` will list _all_ containers in the virtual machine, running or stopped.

###Running StochSS
1. Install Docker Toolbox using directions here: https://docs.docker.com/engine/installation/windows/

2. Open the Docker QuickStart Terminal. Run the following commands:
    + `docker-machine start stochss1-8 || docker-machine create --driver virtualbox stochss1-8`
    + `eval "$(docker-machine env stochss1-8)"`
    
    This will start/create a Virtual Machine called `stochss1-8`, and give you terminal access to it. StochSS will run in this machine. To verify that the machine is running, run the following command:
    + `docker-machine ls`
    
    You should see that the status of machine `stochss1-8` is _running_.

    Please note the IP address of the of the machine `stochss1-8`. Run the following command to determine the IP address:
    + `docker-machine ip stochss1-8`   
    

3. Run the following commands to start StochSS container:
    + If this is the first time you're starting StochSS,

         + `docker run -i -t -p 8080:8080 -p 8000:8000 --name=itochsscontainer1_8 stochss/stochss-launcher:1.8 "/bin/bash"`
        
        This will download the StochSS docker image, create the StochSS docker container and give terminal access to it.

    + Otherwise, if you already have a StochSS docker container (i.e. when you use StochSS subsequently), run 
    
         + `docker start stochsscontainer1_8` 
         + `docker exec -ti stochsscontainer1_8 /bin/bash`

4. Run the following commands to start the server: 
    + `cd stochss-master`
    + `./run.ubuntu.sh -a _the_ip_address_you_noted_in_Step_2_above_  -t secretkey`
   
    Navigate to the URL displayed to access StochSS.

5. Follow the instructions on the terminal to kill the server process. After that, run the following commands to stop the container:
     + `exit` 
     + `docker stop stochsscontainer1_8`
     + `docker-machine stop stochss1-8` 
     
    These commands will stop the container and virtual machine. The terminal window can now be safely closed.

###Uninstalling StochSS

1. Open the Docker Quickstart terminal.
2. Run the following command:
      - `docker-machine rm stochss1-8`

###Note on security
When you run StochSS, it is encapsulated inside a virtual machine. If something goes wrong with the StochSS virtual machine, it is isolated from everything else on your system.

###When things go wrong
   + Leaving StochSS is running while the computer goes to sleep can cause the network configuration of the virtual machine       to change unexpectedly when the computer is woken up again. This means that StochSS could become temporarily                 inaccessible. Performing the following steps may solve this:
     - Open a Docker Quickstart terminal window
     - Run the following commands:
       * `docker-machine start stochss1-8`
       * `docker-machine ssh stochss1-8`
       * `docker stop stochsscontainer1_8`
       * `docker start stochsscontainer1_8`
       * `exit`
      
    - Follow the instructions in this guide to start StochSS.
   
     Our suspicion is that when we ssh into the virtual machine, it's network configuration is reset/corrected.

