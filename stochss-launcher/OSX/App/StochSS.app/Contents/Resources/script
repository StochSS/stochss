#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM

#STOCHSS_IMAGE_NAME="stochss/stochss-launcher"
#STOCHSS_CONTAINER_NAME="stochsscontainer1_7"
#STOCHSS_VM_NAME="stochss1-7"
#STOCHSS_IMAGE_TAG="1.7"
#STOCHSS_VERSION="1.7"

STOCHSS_IMAGE_NAME="briandrawert/stochss-launcher"
STOCHSS_CONTAINER_NAME="stochsscontainer1_8"
STOCHSS_VM_NAME="stochss1-8"
STOCHSS_IMAGE_TAG="1.8"
STOCHSS_VERSION="1.8"

try_again="true"

function clean_up(){
	echo
	echo "Please wait while the StochSS $STOCHSS_VERSION VM is stopped correctly..."
	IR="$( cd ~/.stochss; pwd )"
	docker stop $STOCHSS_CONTAINER_NAME >> $IR/.dockerlog 2>&1
	docker-machine stop $STOCHSS_VM_NAME || exit 1
	echo "Done"
	exit
}

function create_container_and_try_again(){
	DI="$( cd ~/.stochss; pwd )"
	APPLE_SCRIPT_PAT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	echo "Failed to get image."
	docker ps -aq | grep "[a-z;0-9]" && docker rm `docker ps -aq`
	docker rmi $STOCHSS_CONTAINER_NAME >> $DI/.dockerlog 2>&1
	echo "Trying once more."
	echo "Another terminal window should open up to download StochSS. Waiting for image..." && osascript $APPLE_SCRIPT_PAT/StochSS.scpt $(dirname $(which docker-machine))
	return 0
}

if [[ $(uname -s) == 'Darwin' ]]
then
	if [ ! -d ~/.stochss ]; then mkdir ~/.stochss; fi
	docker-machine version || { echo "Docker-machine not detected. Please read the installation instructions at xyz"; exit 1; }
	DIR="$( cd ~/.stochss; pwd )"
	APPLE_SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	# Start up the VM if it's not already running and set environment variables to use docker
	(docker-machine ls $STOCHSS_VM_NAME | grep "$STOCHSS_VM_NAME" | grep -oh "Running") || (docker-machine start $STOCHSS_VM_NAME >> $DIR/.dockerlog 2>&1 || docker-machine create --driver virtualbox $STOCHSS_VM_NAME || { echo "Could not create VM. Exiting..."; exit 1; })
	(docker-machine regenerate-certs --force $STOCHSS_VM_NAME)
	(docker-machine env $STOCHSS_VM_NAME >> $DIR/.dockerlog)
  eval "$(docker-machine env $STOCHSS_VM_NAME || { echo "Could not connect to VM successfully. Exiting..."; exit 1; })"
	DOCKERPATH=$(dirname $(which docker-machine))

	(more $DIR/.admin_key >> $DIR/.dockerlog 2>&1) || (echo `uuidgen` > $DIR/.admin_key && echo "Generated key.")
	echo "Docker daemon is now running. The IP address of $STOCHSS_VM_NAME VM is $(docker-machine ip $STOCHSS_VM_NAME)"
	token=`more $DIR/.admin_key`
	# Start container if it already exists, else run aviral/stochss-initial image to create a new one
	if ! docker start $STOCHSS_CONTAINER_NAME >> $DIR/.dockerlog 2>&1 ; then
	 	if ! docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "STOCHSS_IMAGE_TAG" ; then
			 echo "A terminal window should open up to download StochSS. Waiting for image..." && osascript $APPLE_SCRIPT_PATH/StochSS.scpt $DOCKERPATH
			 if ! docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "$STOCHSS_IMAGE_TAG" ; then
					if [ "$try_again" == 'true' ]; then
		 				if ! create_container_and_try_again ; then
								echo "Failed to get image."
								clean_up
								exit 1
						fi;
					else
						echo "Failed to get image."
						clean_up
						exit 1
					fi;
			 fi;
			 first_time=true
			 if ! docker images | grep "$STOCHSS_IMAGE_NAME" | grep -oh "$STOCHSS_IMAGE_TAG" ; then
				 echo "Failed to get image."
				 clean_up
				 exit 1
			 fi;
			 if docker run -d -p 8080:8080 -p 9999:9999 --name=$STOCHSS_CONTAINER_NAME $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG sh -c "cd stochss-master; ./run.ubuntu.sh -a 0.0.0.0 -t $token --yy" >> $DIR/.dockerlog; then
			    echo "Starting StochSS $STOCHSS_VERSION for the first time."
			 else
				 echo "Failed to start server."; clean_up; exit 1;
			 fi;
		fi;
	fi;
	# test server is up and connect to it
	echo "Starting server. This process may take up to 5 minutes..."
	until $(curl --output /dev/null --silent --head --fail $(docker-machine ip $STOCHSS_VM_NAME):8080);
	do
        sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	echo "http://$(docker-machine ip $STOCHSS_VM_NAME):8080/login?secret_key=`echo $token`"

	open "http://$(docker-machine ip $STOCHSS_VM_NAME):8080/login?secret_key=`echo $token`"

else
	echo "This operating system is not recognized."
	clean_up
fi

while :
do
	sleep 10000
done
