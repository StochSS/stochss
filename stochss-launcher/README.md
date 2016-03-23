##Building StochSS 1.7 Docker Image

###Make a new directory and change to it
   In a terminal window, run these commands: 
   + `mkdir my-stochss-docker-build` 
   + `cd my-stochss-docker-build`

###Download StochSS image Dockerfile
   Follow <a href="https://raw.githubusercontent.com/stochss/stochss/master/stochss-launcher/Dockerfile">this</a> link and save the Dockerfile in the directory created above.

###Build Docker Image
   Run the following command to build the image: 
   + `sudo docker build -t my_stochss_docker_image_name`.
