###Using StochSS on Windows
<i>Please note: StochSS does not run Microsoft Edge browser. The recommended browser is <a href="https://www.google.com/chrome/browser/desktop/">Google Chrome</a>.</i>

StochSS requires Docker Toolbox for Windows to run. 

###Running StochSS
1. Install Docker Toolbox using directions here: https://docs.docker.com/engine/installation/windows/
2. Open the Docker QuickStart Terminal. Run the following commands:
   <ul><li>`docker-machine start stochss1-7 || docker-machine create --driver virtualbox stochss1-7`</li><li>`eval                       "$(docker-machine env stochss1-7)"`</li></ul>
   This will start/create a Virtual Machine called `stochss1-7`, and give you terminal access to it. StochSS will run in this machine.
   <b>Please note the IP address of the of the machine `stochss1-7`. Run command `docker-machine ip stochss1-7` to determine this IP     address.  Also, please create an access key for yourself. This could be any    random string of alphabetical letters only, such as    <i>yabadabadoo</i>.</b>
3. Run the following commands to start StochSS:
   <ol>
   <li>If this is the first time you're starting StochSS,
   <ul>
   <li>Run `docker run -i -t -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 aviralcse/stochss-initial:1.7 "/bin/bash"`.
   This will download the StochSS docker image, create the StochSS docker container and give terminal access to it.</li>
   <li>Run the following commands to start the server: `cd stochss-master; ./run.ubuntu.sh -a                                          _the_ip_address_you_noted_in_Step_2_above_ -t _the_token_you_created_above_`.
   </li>
   </ul>
   <li>Otherwise, if you already have a StochSS docker container (i.e. when you use StochSS subsequently), run `docker start           stochsscontainer1_7` to start the existing container and the server. Navigate to the IP address noted in Step 2 above to access    StochSS.</li>
   </ol>

<h2>Step 4:</h2>
<h3>Stopping the server</h3>
Follow the instructions on the terminal to kill the server process. After that, run the following commands to stop the container: `docker stop stochsscontainer1_7`. Next, run `docker-machine stop stochss1-7` to stop the StochSS VM. The terminal window can now be safely closed.


###Note on security
When you run StochSS, it is encapsulated inside a virtual machine. If something goes wrong with the StochSS virtual machine, it is isolated from everything else on your system.
