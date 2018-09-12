package dockerWinPro;

public class Commands {
	public static String containerName = "stochsscontainer1_9";
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
	public static String createContainer() {
		return "docker create -t -p 9999:9999 -p 8080:8080 --name=" + containerName + " " + imageName; //create container
	}
	public static boolean errorContain(String line) {
		if (line.contains("error during connect: ")) {
			return true;
		}
		if (line.contains("is not recognized as an internal or external command")) {
			return true;
		}
		return false;
	}
	public static String errorMeaning(String line) {
		if (line.contains("error during connect:" )) {
			return "Docker may not be running, or Docker Toolbox might be running on Windows 10 Professional/Enterprise.";
		}
		if (line.contains("is not recognized as an internal or external command")) {
			return "Docker might not be installed. Please go to https://docs.docker.com/docker-for-windows/install/";
		}
		return "";
	}
	public static String adviseNotInstalled() {
		return "***NOTICE*** Container " + Commands.containerName + " not found, you can install StochSS with container name " + Commands.containerName + " by clicking below. If you do not have the image " + Commands.imageName + " installed, Docker will connect to the internet and download it automatically. This might take a while, as the download is large.";
	}
}