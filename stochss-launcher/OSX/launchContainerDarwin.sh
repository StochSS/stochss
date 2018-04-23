#!/bin/bash
trap clean_up INT SIGHUP SIGINT SIGTERM

STOCHSS_IMAGE_NAME="aviralcse/stochss_qsub"
STOCHSS_CONTAINER_NAME="stochsscontainer1_9"
STOCHSS_IMAGE_TAG="updated_stochss_for_release"
STOCHSS_VERSION="1.9"
PATH=$PATH":/usr/local/bin/"
try_again="true"

function clean_up(){
	echo
	echo "Please wait while StochSS $STOCHSS_VERSION is stopped correctly..."
	IR="$( cd ~/.stochss; pwd )"
	docker stop $STOCHSS_CONTAINER_NAME >> $IR/.dockerlog 2>&1
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
	echo "Another terminal window should open up to download StochSS. Waiting for image..." && osascript $APPLE_SCRIPT_PAT/StochSS.scpt $(dirname $(which docker))
	return 0
}

if [[ $(uname -s) == 'Darwin' ]]
then
	if [ ! -d ~/.stochss ]; then mkdir ~/.stochss; fi
	DIR="$( cd ~/.stochss; pwd )"
	APPLE_SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	DOCKERPATH=$(dirname $(which docker))

	(more $DIR/.admin_key >> $DIR/.dockerlog 2>&1) || (echo `uuidgen` > $DIR/.admin_key && echo "Generated key.")
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
			 if docker run -d -p 8080:8080 -p 8000:8000 -p 9999:9999 --name=$STOCHSS_CONTAINER_NAME $STOCHSS_IMAGE_NAME:$STOCHSS_IMAGE_TAG sh -c "cd /stochss-master && export PYTHONPATH=/stochss-master/app/lib/:/usr/local/lib/python2.7/dist-packages:/stochss-master/sdk/python:/stochss-master/sdk/python/google:/stochss-master/sdk/python/lib && ./run.ubuntu.sh -t $token -a 0.0.0.0" >> $DIR/.dockerlog; then
			    echo "Starting StochSS $STOCHSS_VERSION for the first time."
			 else
				 echo "Failed to start server."; clean_up; exit 1;
			 fi;
		fi;
	fi;
	# test server is up and connect to it
	echo "Starting server. This process may take up to 5 minutes..."
	until $(curl --output /dev/null --silent --head --fail localhost:8080);
	do
        sleep 10
	done
	echo "StochSS server is running at the following URL. The browser window should open automatically."
	echo "http://localhost:8080/login?secret_key=$token"

	open "http://localhost:8080/login?secret_key=$token"

else
	echo "This operating system is not recognized."
	clean_up
fi

while :
do
	sleep 10000
done
