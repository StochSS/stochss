#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM

function clean_up(){
	echo
	echo "Please wait while StochSS 1.7 is stopped correctly..."
	IR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	docker stop stochsscontainer1_7 >> $IR/.dockerlog 2>&1
	echo "Done"
	exit 0
}

if [[ $(uname -s) == 'Linux' ]]
then
	#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	(cat .admin_key >> .dockerlog 2>&1) || (touch .admin_key && echo `uuidgen` > .admin_key && echo "Generated key.")
	token=`cat .admin_key`
	docker start stochsscontainer1_7 >> $DIR/.dockerlog 2>&1 || { docker run -d -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 aviralcse/stochss-initial:1.7 sh -c "cd stochss-master; ./run.ubuntu.sh -t $token --yy" >> $DIR.dockerlog && echo "Starting StochSS 1.7 for the first time takes a while." && echo "To view Logs, run \"docker logs -f stochsscontainer\" from another terminal"; } ||	{ echo "Failed to start server."; clean_up; exit; }


	echo "Starting server. This process may take up to 5 minutes..."
	until $(curl --output /dev/null --silent --head --fail $(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080);
	do
		sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	echo "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"
	xdg-open "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"

else
	echo "This operating system is not recognized."
	clean_up
	exit
fi

while :
do
	read -p "Press CTRL + C to stop server and exit.." key
done
