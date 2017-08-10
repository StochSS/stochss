#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM


STOCHSS_IMAGE_NAME="briandrawert/stochss-launcher"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
#STOCHSS_VM_NAME="stochss1-8"
STOCHSS_IMAGE_TAG="1.9"
STOCHSS_VERSION="1.9"


function clean_up(){
	echo
	echo "Please wait while StochSS $STOCHSS_VERSION is stopped correctly..."
	IR="$( cd ~/.stochss; pwd )"
	docker stop $STOCHSS_CONTAINER_NAME >> $IR/.dockerlog 2>&1
	echo "Done"
	exit 0
}

if [[ $(uname -s) == 'Darwin' ]]
then
	if [ ! -d ~/.stochss ]; then mkdir ~/.stochss; fi
	DIR="$( cd ~/.stochss; pwd )"
	(cat $DIR/.admin_key >> $DIR/.dockerlog 2>&1) || (touch $DIR/.admin_key && echo `uuidgen` > $DIR/.admin_key && echo "Generated key.")
	token=`cat $DIR/.admin_key`
	docker start $STOCHSS_CONTAINER_NAME >> $DIR/.dockerlog 2>&1 || { docker run -d -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=$STOCHSS_CONTAINER_NAME $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG sh -c "cd /stochss-master && export PYTHONPATH=/stochss-master/app/lib/:/usr/local/lib/python2.7/dist-packages:/stochss-master/sdk/python:/stochss-master/sdk/python/google:/stochss-master/sdk/python/lib && ./run.ubuntu.sh -t $token -a 0.0.0.0" >> $DIR/.dockerlog && echo "Starting StochSS $STOCHSS_VERSION for the first time." && echo "To view Logs, run \"docker logs -f $STOCHSS_CONTAINER_NAME\" from another terminal"; } ||	{ echo "Failed to start server."; clean_up; exit; }


	echo "Starting server. This process may take up to 5 minutes..."
	#until $(curl --output /dev/null --silent --head --fail $(docker inspect --format {{.NetworkSettings.IPAddress}} $STOCHSS_CONTAINER_NAME):8080);
	until $(curl --output /dev/null --silent --head --fail http://localhost:8080);
	do
		sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	#echo "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} $STOCHSS_CONTAINER_NAME):8080/login?secret_key=$token"
	#open "http://$(docker inspect --format {{.NetworkSettings.IPAddress}} $STOCHSS_CONTAINER_NAME):8080/login?secret_key=$token"
	echo " http://localhost:8080/login?secret_key=$token"
	open "http://localhost:8080/login?secret_key=$token"

else
	echo "This operating system is not recognized."
	clean_up
	exit
fi

while :
do
	read -p "Press CTRL + C to stop server and exit.." key
done
