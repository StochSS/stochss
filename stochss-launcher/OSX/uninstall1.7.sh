# THIS SCRIPT IS OBSOLETE
#!/bin/bash
docker-machine version || (echo "Looks like docker-machine is not installed; no VM to delete. Exiting.." && exit 0)
echo "Deleting StochSS 1.7..."
docker-machine ls | grep -oh "stochssdocker" >> .uninstallLog || { echo "VM does not exist."; exit 1; }
docker-machine start stochssdocker >> .uninstallLog 2>&1
docker-machine env stochssdocker >> .uninstallLog
eval "$(docker-machine env stochssdocker)" || { echo "cannot set environment"; exit 1; }
(docker stop stochsscontainer1_7 >> .uninstallLog 2>&1 && docker rm -f stochsscontainer1_7 && echo "Deleted StochSS 1.7 container") || echo "StochSS 1.7 container does not exist."
echo "Deleting StochSS 1.7 image. (The image isn't actually deleted becuase we're debugging)"
#docker rmi --force aviralcse/stochss-initial:1.7
num_containers=`docker ps -aq | wc -l`
if [[ `echo $num_containers` == 0 ]]
then 
	echo "Safe to delete VM. (I have commented out the command to delete the VM just to make debugging easier)"
	#docker-machine rm stochssdocker || (echo "Could not remove VM. Exiting.." && exit 0)
else 
 	echo "Not deleting VM as it has other containers."
fi
echo "Done"
exit 0

