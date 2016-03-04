<h1>Building StochSS 1.7 Docker Image</h1>


<h2>Step 1:</h2>
<h3>Make a new directory and change to it</h3>
In a terminal window, run these commands: `mkdir my-stochss-docker-build; cd my-stochss-docker-build`

<h2>Step 2:</h2>
<h3>Download StochSS image Dockerfile</h3>
Follow <a href="https://raw.githubusercontent.com/aviral26/stochss/develop/stochss-launcher/Dockerfile">this</a> link and save the Dockerfile in the directory created above.

<h2>Step 3:</h2>
<h3>Build Docker Image</h3>
Run the following command to build the image: `sudo docker build -t my_stochss_docker_image_name`.
