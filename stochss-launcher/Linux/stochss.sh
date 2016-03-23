#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM

function clean_up(){
	echo
	echo "Please wait while StochSS 1.7 is stopped correctly..."
	IR="$( cd ~/.stochss; pwd )"
	sudo docker stop stochsscontainer1_7 >> $IR/.dockerlog 2>&1
	echo "Done"
	exit 0
}

if [[ $(uname -s) == 'Linux' ]]
then
	if [ ! -d ~/.stochss ]; then mkdir ~/.stochss; fi
	DIR="$( cd ~/.stochss; pwd )"
	(cat $DIR/.admin_key >> $DIR/.dockerlog 2>&1) || (touch $DIR/.admin_key && echo `uuidgen` > $DIR/.admin_key && echo "Generated key.")
	token=`cat $DIR/.admin_key`
	sudo docker start stochsscontainer1_7 >> $DIR/.dockerlog 2>&1 || { sudo docker run -d -p 8080:8080 -p 8000:8000 --name=stochsscontainer1_7 stochss/stochss-launcher:1.7 sh -c "cd stochss-master; ./run.ubuntu.sh -t $token --yy" >> $DIR/.sudo dockerlog && echo "Starting StochSS 1.7 for the first time." && echo "To view Logs, run \"sudo docker logs -f stochsscontainer\" from another terminal"; } ||	{ echo "Failed to start server."; clean_up; exit; }


	echo "Starting server. This process may take up to 5 minutes..."
	until $(curl --output /dev/null --silent --head --fail $(sudo docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080);
	do
		sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	echo "http://$(sudo docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"
	xdg-open "http://$(sudo docker inspect --format {{.NetworkSettings.IPAddress}} stochsscontainer1_7):8080/login?secret_key=$token"

else
	echo "This operating system is not recognized."
	clean_up
	exit
fi

while :
do
	read -p "Press CTRL + C to stop server and exit.." key
done
