#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM

function clean_up(){
	echo
	echo "Stopping StochSS...this may take a while"
	if [[ $(uname -s) == 'Linux' ]]
	then
		(docker stop stochsscontainer1_7 || echo "Could not stop container")
	elif [[ $(uname -s) == 'Darwin' ]]
	then
		echo "Not stopping VM while debugging"
		#(docker-machine stop stochssdocker || echo "Could not stop virtual machine")
	else
		echo "Unrecognized operating system"
	fi
	echo "Done"
	exit 0
}

if [[ $(uname -s) == 'Linux' ]]
then
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	(more $DIR/.admin_key) || (echo `uuidgen` > $DIR/.admin_key && echo "written key")
	token=`more $DIR/.admin_key`
	docker start stochsscontainer1_7 >> $DIR/.dockerlog || { docker run -d -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 aviralcse/stochss-initial:1.7 sh -c "cd stochss-master; ./run.ubuntu.sh -t $token --yy" && echo "To view Logs, run \"docker logs -f stochsscontainer\" from another terminal"; } ||	{ echo "neither worked"; clean_up; }
		
	
	echo "Starting server. This process may take up to 5 minutes..."
	until $(curl --output /dev/null --silent --head --fail $(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer):8080);
	do
		sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	echo "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"
	xdg-open "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"

else
	echo "This operating system is not recognized."
	clean_up
fi

while :
do 
	read -p "Press CTRL + C to stop server and exit.." key
done