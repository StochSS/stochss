<h1>Using StochSS on Windows</h1>

<i>Please note: StochSS does not run Microsoft Edge browser. The recommended browser is <a href="https://www.google.com/chrome/browser/desktop/">Google Chrome</a>.</i>

<h2>Step 1:</h2>
<h3>Install Docker Toolbox</h3> Follow the installation instructions on <a href="https://docs.docker.com/engine/installation/windows/">this</a> page to install Docker Toolbox.

<h2>Step 2:</h2>
<h3>Open the Docker QuickStart Terminal</h3>
Run the command `docker-machine start stochss1-7 || docker-machine create --driver virtualbox stochss1-7`.
 This will start/create a Virtual Machine called `stochss1-7`. StochSS will run in this machine.
<b>Please note the IP address of the of the machine `stochss1-7`. Also, please create an access key for yourself. This could be any random string of letters such as <i>yabadabadoo</i>.</b>

<h2>Step 3:</h2>
<h3>Run the following commands to start StochSS</h3>
<ol>
<li>If this is the first time you're starting StochSS,<ul><li>Run <i>docker run -i -t -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 aviralcse/stochss-initial:1.7 "/bin/bash"</i>.
This will download the StochSS docker image, create the StochSS docker container and give terminal access to it.</li><li>Run the following commands to start the server: <i>cd stochss-master; ./run.ubuntu.sh -a <the_ip_address_you_noted_in_Step_2_above> -t <the_token_you_created_above></i>.</li></ul>
<li>Otherwise, if you already have a StochSS docker container (i.e. when you use StochSS subsequently), run <i>docker start stochsscontainer1_7"</i> to start the existing container and the server. Navigate the IP address notes in Step 2 above to access StochSS.</li>
</ol>

<h2>Step 4:</h2>
<h3>Stopping the server</h3>
Follow the instructions on the terminal to kill the server process. After that, run the following commands to stop the container: `docker stop stochsscontainer1_7`. Next, run `docker-machine stop stochss1-7` to stop the StochSS VM. The terminal window can now be safely closed.
