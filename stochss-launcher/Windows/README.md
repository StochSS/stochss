###Using StochSS on Windows
<i>Please note</i>: 
<ol>
<li> StochSS does not run Microsoft Edge browser. The recommended browser is <a href="https://www.google.com/chrome/browser/desktop/">Google Chrome</a>.</li>
<li> You may have to enable virtualization in the BIOS (Use this Microsoft Virtualization detector to check if virtualization is enabled in your system: https://www.microsoft.com/en-us/download/details.aspx?id=592. If it's not, please enable it from the BIOS first).</li>
<li> You need Win7 64 bit at least.</li>
</ol>

StochSS requires Docker Toolbox for Windows to run. 

###Running StochSS
1. Install Docker Toolbox using directions here: https://docs.docker.com/engine/installation/windows/

2. Open the Docker QuickStart Terminal. Run the following commands:
   <ul><li>`docker-machine start stochss1-7 || docker-machine create --driver virtualbox stochss1-7`</li><li>`eval                       "$(docker-machine env stochss1-7)"`</li></ul>
   This will start/create a Virtual Machine called `stochss1-7`, and give you terminal access to it. StochSS will run in this machine.
   <b>Please note the IP address of the of the machine `stochss1-7`. Run command `docker-machine ip stochss1-7` to determine this IP     address.  Also, please create an access key for yourself. This could be any random string of alphabetical letters only, such as       <i>yabadabadoo</i>.</b>

3. Run the following commands to start StochSS container:
   <ol>
   <li>If this is the first time you're starting StochSS,
   Run `docker run -i -t -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 aviralcse/stochss-initial:1.7 "/bin/bash"`.
   This will download the StochSS docker image, create the StochSS docker container and give terminal access to it.</li>

   <li>Otherwise, if you already have a StochSS docker container (i.e. when you use StochSS subsequently), run `docker start             stochsscontainer1_7` to start the existing container. Next, run `docker exec -t stochsscontainer1_7 /bin/bash`</li>
   </ol>

4. Run the following commands to start the server: `cd stochss-master; ./run.ubuntu.sh -a _the_ip_address_you_noted_in_Step_2_above_     -t _the_token_you_created_above_`.
   Navigate to the URL displayed to access StochSS.

5. Follow the instructions on the terminal to kill the server process. After that, run the following commands to stop the container:     Type `exit` to exit the VM. `docker stop stochsscontainer1_7`. Next, run `docker-machine stop stochss1-7` to stop the StochSS VM.     The terminal window can now be safely closed.

###Note on security
When you run StochSS, it is encapsulated inside a virtual machine. If something goes wrong with the StochSS virtual machine, it is isolated from everything else on your system.
