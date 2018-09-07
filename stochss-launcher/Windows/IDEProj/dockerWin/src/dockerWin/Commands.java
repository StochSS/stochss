package dockerWin;

public class Commands {
	public static String containerName = "stochsscontainer1_9";
	public static String VMname = "stochss1-9";
	public static String imageName = "stochss/stochss-launcher:1.9";
	
	public static String ip = "0.0.0.0";
	public static String ipReplace = "127.0.0.1";
	public static final  String finishedStr = "---finished---";
	
	public static String searchForContainerName() {
		return "docker ps -a -f name=" + containerName;			//search for container of container name;
	}
	public static String downloadImage() {
		return "docker pull " + imageName; 						//download image
	}
	public static String startContainer() {
		return "docker start " + containerName;					//start container
	}
	public static String runStochSS() {
		return "docker exec -i " + containerName + " /bin/bash -c \"cd stochss-master && ./run.ubuntu.sh -a " + ip + " -t secretkey\""; 	
																//run container with required commands to run StochSS
	}
	public static String stopContainer() {
		return "docker stop " + containerName;					//stop container
	}
	public static String commandFinished() {
		return "echo " + finishedStr;							//arbitrary echo to tell if operation is over
	}
	public static String uninstallContainer() {
		return "docker rm " + containerName;					//uninstall container
	}
	public static String uninstallImage() {
		return "docker rmi " + imageName;						//uninstall image
	}
	public static String uninstallVM() {
		return "docker-machine rm " + VMname;					//uninstall VM;
	}
	public static String createContainer() {
		return "docker create -t -p 9999:9999 -p 8080:8080 --name=" + containerName + " " + imageName; //create container
	}
	public static String startVM() {
		return "docker-machine start " + VMname; 				//start stochss VM
	}
	public static String connectToVM() {
		return "eval $(docker-machine env " + VMname + ")";		//Connect the machine to normal docker input
	}
	public static String getIP() {
		return "docker-machine ip " + VMname;					//Get IP address associated w/ VM
	}
	public static String stopVM() {
		return "docker-machine stop " + VMname;
	}
	public static void updateIP(String ip_a) {
		ip = ip_a;
	}
}