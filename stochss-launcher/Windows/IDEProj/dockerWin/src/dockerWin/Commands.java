package dockerWin;

public class Commands {
	public static String containerName = "stochsscontainer1_9";
	public static String VMname = "stochss1-9";
	public static String imageName = "stochss/stochss-launcher:1.9";
	
	public static String ip = "127.0.0.1";
	public static final  String finishedStr = "---finished---";
	
	
	private static final String commands[] = {
		/*0*/ "docker ps -a -f name=" + containerName, 								//search for container of container name
		/*1*/ "docker pull " + imageName, 											//download image
		/*2*/ "docker start " + containerName,										//start container
		/*3*/ "docker exec -i " + containerName + " /bin/bash -c \"cd " +
					"stochss-master && ./run.ubuntu.sh -a " + ip + " -t secretkey\"", 	//run StochSS
		/*4*/ "docker stop " + containerName,										//stop container
		/*5*/ "echo " + finishedStr,												//arbitrary echo to tell if operation is over
		/*6*/ "docker rm " + containerName,											//uninstall container
		/*7*/ "docker rmi " + imageName,											//uninstall image
		/*8  - Toolbox*/ "docker-machine rm " + VMname,								//uninstall VM
		/*9*/ "docker create -t -p 9999:9999 -p 8080:8080 --name=" + containerName + " " + imageName, //create container
		/*10*/ "docker-machine start " + VMname, 									//start stochss VM
		/*11*/ "eval $(docker-machine env " + VMname + ")", 						//Connect the machine to normal docker input
		/*12*/ "docker-machine ip " + VMname,										//Get IP address associated w/ VM
		/*13*/ "docker-machine stop " + VMname										//Stop the VM
		};
	
	public static String searchForContainerName() {
		return commands[0];
	}
	public static String downloadImage() {
		return commands[1];
	}
	public static String startContainer() {
		return commands[2];
	}
	public static String runStochSS() {
		return commands[3];
	}
	public static String stopContainer() {
		return commands[4];
	}
	public static String commandFinished() {
		return commands[5];
	}
	public static String uninstallContainer() {
		return commands[6];
	}
	public static String uninstallImage() {
		return commands[7];
	}
	public static String uninstallVM() {
		return commands[8];
	}
	public static String createContainer() {
		return commands[9];
	}
	public static String startVM() {
		return commands[10];
	}
	public static String connectToVM() {
		return commands[11];
	}
	public static String getIP() {
		return commands[12];
	}
	public static String stopVM() {
		return commands[13];
	}
	public static void updateIP(String ip_a) {
		ip = ip_a;
		commands[3] = "docker exec -i " + containerName + " /bin/bash -c \"cd " + "stochss-master && ./run.ubuntu.sh -a " + ip + " -t secretkey\"";
	}
}