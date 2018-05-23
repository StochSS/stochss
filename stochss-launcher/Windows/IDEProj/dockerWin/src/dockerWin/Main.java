package dockerWin;

import java.awt.Desktop;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import javax.swing.SwingWorker;

public class Main {
	static final boolean debug = true;
	private int logLimit = 100;
	private boolean toolbox = false;
	
	//private String ip = "127.0.0.1";
	private String url;
	
	private ProcessBuilder builder;
	
	private Process process;
	
	private BufferedWriter stdin;
	private BufferedReader stdout,stderr;
	
	private UIHandler window;
	private Process subp;
	private String toolbox1, toolbox2, toolboxPath;
	
	
	public Main(UIHandler w) {
		window = w;
		builder = new ProcessBuilder("cmd");
	}
	
	public void initialize() {
		try { 
			process = builder.start();
		} catch (IOException e) {
			log(e, true);
		}
	    
		stdin = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
	    stdout = new BufferedReader(new InputStreamReader(process.getInputStream()));
	    stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()));
	    
	    if(checkToolbox()) {
	    	toolbox = true;
	    	try {
				enterToolbox(stdin, stdout, process);
			} catch (IOException e) {
				log(e, true);
			}
	    }
	}
	
	private boolean checkToolbox() {
		//TODO
		return true;
	}

	public void uninstall() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 
				 terminalWrite(Commands.uninstallContainer(),stdin); 
				 
				 terminalWrite(Commands.uninstallImage(),Commands.commandFinished(),stdin);
				 
				 while((line = waitForFinishFlag(stdout)) != null) { 
				    window.addText(line);
				 }
				 if (toolbox) {
					 //TODO
				 } 
				 return true;
			  }
			  @Override
			  protected void done() {
			    window.setUninstallDone();
			  }
		};
		worker.execute();
	}
	/**
	 * This function checks if StochSS is installed. 
	 * @return boolean whether or not stochss is installed
	 * @throws IOException
	 */
	public boolean checkIfInstalled() throws IOException {
		String line;
	    
		terminalWrite(Commands.searchForContainerName(),Commands.commandFinished(),stdin); 
	    
		while((line = waitForFinishFlag(stdout)) != null) { 
	    	window.addText(line);
	    	if (line.contains(Commands.containerName) && !line.contains(Commands.searchForContainerName())) {
	    		window.setStartup();
	    		if(debug) {System.out.println("checkIfInstalled returns true");}
	    		return true;
	    	}
	    }
		if(debug) {System.out.println("checkIfInstalled returns false");}
	    return false;
	}
	
	public boolean checkIfVMInstalled() throws IOException {
		String line;

		terminalWrite("docker-machine ls",Commands.commandFinished(),stdin);
		
		while((line = waitForFinishFlag(stdout)) != null) { 
	    	window.addText(line);
	    	if (line.contains(Commands.VMname)) {
	    		if(debug) {System.out.println("Check if vm installed: true");}
	    		return true;
	    	}
	    }
		if(debug) {System.out.println("Check if vm installed: false");}
		return false;
	}
	
	public void startVM() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 
				 terminalWrite(Commands.startVM(),Commands.commandFinished(),stdin);
				 
				 if(debug) { System.out.println("docker-machine start stochss1-9"); }
				 
				 while((line = waitForFinishFlag(stdout)) != null) { 
					 if(debug) {System.out.println(line);}
					 window.addText(line);
				 }
				 
				 //if(debug) { System.out.println("eval \"$(docker-machine env stochss1-9)\""); }
				 
				 terminalWrite(Commands.connectToVM(),Commands.commandFinished(),stdin);
				 
				 while((line = waitForFinishFlag(stdout)) != null) { 
					 window.addText(line);
					 if(debug) {
						 System.out.println("CONNECT TO VM OUTPUT: " + line);
					 }
				 }
				 if(debug) {
					 terminalWrite("docker ps",Commands.commandFinished(),stdin);
					 while((line = waitForFinishFlag(stdout)) != null) { 
						 System.out.println("DOCKER PS OUTPUT: " + line);
					 }
//					 while((line = waitForFinishFlag(stdout)) != null) { 
//						 System.out.println("DOCKER PS/2 OUTPUT: " + line);
//					 }
				 }
				 terminalWrite(Commands.getIP(), Commands.commandFinished(), stdin);
				 
				 while((line = waitForFinishFlag(stdout)) != null) {
					 window.addText(line);
					 if(!line.contains(Commands.getIP())) {
						 Commands.updateIP(line.trim());
						 if(debug) {
							 System.out.println("Found IP is " + Commands.ip);
						 }
					 }
				 }
				 
				if(debug) {System.out.println("StartVM returns true");}
				return true;
			  }
			  @Override
			  protected void done() {
				try {
					if (checkIfInstalled()) {
						window.setStartup();
					} else {
						window.setnotInstall();
					}
				} catch (IOException e) {
					log(e, true);
				}
			  }
			};
		worker.execute();
	}
	
	public void install() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				String line;
				
				terminalWrite(Commands.downloadImage(),stdin);
				
				while((line = stdout.readLine()) != null && !line.startsWith("Status: ")) {
				 	window.addText(line);
				}
				
				window.addText(line);
				
				terminalWrite(Commands.createContainer(),stdin);
				
				window.addText(stdout.readLine());
				return true;
			  }
			  @Override
			  protected void done() {
				try {
					if (checkIfInstalled()) {
						window.setStartup();
					} else {
						log("Installation Failed", true);
					}
				} catch (IOException e) {
					log(e, true);
				}
			  }
			};
		worker.execute();		
	}
	    
	public void startStochSS() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 
				 terminalWrite(Commands.startContainer(),stdin);
				
				 terminalWrite(Commands.runStochSS(),stdin);
				 
				 while((line = stdout.readLine()) != null && !line.startsWith("Navigate to ")) {
				 	window.addText(line);
				}
				 try {
				   	url = line.substring(12, line.indexOf(" to access StochSS"));
				   	if(url.contains("0.0.0.0")) {
				   		int temp = url.indexOf("0.0.0.0");
				   		url = url.substring(0, temp) + Commands.ip + url.substring(temp + 7);
				   	}
				   	window.addText("Navigate to " + url + " to access StochSS");
				   	return true;
				 } catch (Exception e) {
				   	log(e, true);
				   	return false;
				 }
			  }
			  @Override
			  protected void done() {
			    window.setRunning();
			  }
			};
		worker.execute();
	}
	    
	public boolean openURL() {
		if (Desktop.isDesktopSupported()) {
	    	try {
				Desktop.getDesktop().browse(new URI(url));
				return true;
			} catch (URISyntaxException | IOException e) {
				log(e, false);
				return false;
			}
		}
		return false;
	}
	
	private boolean VMRunning(BufferedWriter in, BufferedReader out) {
		//TODO docker-machine ls for stochss, if it has "running" it's running - use exitin/exitout
		return true;
	}
		
	public void safeExit() throws IOException { //TODO: if any of these hang, need to detect it and destroyProcesses that way
		subp = builder.start();	
		BufferedWriter exitin = new BufferedWriter(new OutputStreamWriter(subp.getOutputStream()));
	    BufferedReader exitout = new BufferedReader(new InputStreamReader(subp.getInputStream()));
	    if (toolbox) { 
	    	enterToolbox(exitin, exitout, subp); 
	    }
	    
	    boolean VMRun = VMRunning(exitin, exitout);
	    
	    if (VMRun) {
	     		terminalWrite(Commands.connectToVM(), exitin);
	    }
	    
	    String line;
	    
	    terminalWrite(Commands.stopContainer(),Commands.commandFinished(),exitin);
	    
	    while((line = waitForFinishFlag(exitout)) != null) { 
	    	window.addText(line); 
		}
	    
	    if (VMRun) {
	    	terminalWrite(Commands.stopVM(), Commands.commandFinished(), exitin);
	    }
	    
	    while((line = waitForFinishFlag(exitout)) != null) { 
	    	window.addText(line); 
		}
	    	    
		destroyProcesses();
	}
	
	private void destroyProcesses() {
		if (process != null) 
			process.destroy();
		if (subp != null)
			subp.destroy();
	}
	
	public void log(Exception e, boolean exit) {
		String s = "";
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		s += errors.toString(); 
		log(s, exit);
	}
	
	public boolean getToolbox() {
		return toolbox;
	}
	
	public void log(String str, boolean exit) {
		if(exit) {
			try {
				safeExit();
			} catch (Exception ex) {
				str += "\nSafe exit failed.\n";
				destroyProcesses();
			} finally {
				window.setStopped();
			}
		}
//		try {
//			//TODO saveLog(window.getWindowText() + "\n\r" + str);
//		} catch (FileNotFoundException e) {
//			str += "\nLog file creation failed.\n";
//		}
		window.addText(str);
	}

	public String getURL() {
		return url;
	}
	
	private void enterToolbox(BufferedWriter in, BufferedReader out, Process p) throws IOException {
		
		String line;
		if (toolboxPath == null) {
//			/"C:\Program Files\Git\bin\bash.exe" --login -i "C:\Program Files\Docker Toolbox\start.sh"
			
			terminalWrite("where docker",Commands.commandFinished(),in);
			
			while((line = waitForFinishFlag(stdout)) != null) {
		    	window.addText(line);
		    	if (line.contains("Docker Toolbox")) {
		    		toolbox1 = line.substring(0, line.indexOf("docker.exe"));
		    		break;
		    	}
		    }
			
			terminalWrite("where git",Commands.commandFinished(),in);
			
			
			while((line = waitForFinishFlag(stdout)) != null) { 
		    	window.addText(line);
		    	if (line.contains("cmd\\git.exe")) {
		    		toolbox2 = line.substring(0, line.indexOf("cmd\\git.exe"));
		    		break;
		    	}
		    }
			toolboxPath = "\"" + toolbox2 + "bin\\bash.exe\" --login -i \"" + toolbox1 + "start.sh\"";
		}		
		
		terminalWrite(toolboxPath,Commands.commandFinished(),in);
		
		
		while((line = waitForFinishFlag(stdout)) != null) {  
	    	window.addText(line);
	    }
		
		redirectStdErr();
		
		terminalWrite("(>&2 echo \"error\")",stdin);
		if(debug)
			System.out.println(toolbox1 + " " + toolbox2 + " " + toolboxPath);
			
		/* TODO
		 * where docker 
			> save "docker toolbox" up to "docker.exe" then replace with "start.sh"

			where git
			> save up to "cmd\git.exe" and replace with "bin\bash.exe"

			cd var 1, ending at "\start.sh"
			"var2" -login -i "var1"
		 */
	}
	/**
	 * 
	 * @param command Command to run
	 * @param in BufferedWriter to run the commands with
	 * @throws IOException
	 */
	private void terminalWrite(String command,BufferedWriter in) throws IOException{
		in.write(command);
		in.newLine();
		in.flush();
	}
	/**
	 * 
	 * @param command1 First command to run
	 * @param command2 Second command to run, waiting for the first one to finish
	 * @param in BufferedWriter to run the commands with
	 * @throws IOException
	 */
	private void terminalWrite(String command1, String command2, BufferedWriter in) throws IOException{
		in.write(command1 + " && " + command2);
		in.newLine();
		in.flush();
	}
	
	/**
	 * 
	 * @param read BufferedReader to read
	 * @return Returns the string to output when the loop should continue, or null when the finished flag is found
	 * @throws IOException
	 */
	/*
	 * !(A && !B)

	 *	!A + B
	 */
	private String waitForFinishFlag(BufferedReader read) throws IOException {
		String line;
		if((line = read.readLine()) != null && !(line.contains(Commands.finishedStr) && !line.contains(Commands.commandFinished()))) {
			return line;
		}
		return null;
	}
	/**
	 * This function runs on a seperate thread looking for standard error messages and pumping that into stdin
	 */
	private void redirectStdErr() {
		Thread stdErrReader = new Thread("Standard Error Reader") {
			public void run() {
				try {
					String input, output;
					while(true) {
							input = stderr.readLine();
							output = "\\e" + input + "\\e";
							window.addText(output);
							if(debug)
								System.out.println(output);
						}
					}
				 catch (IOException e) {
					e.printStackTrace();
				}
			}
		};
	}
}


/* docker ps -f stochsscontainer1_9
 * if no docker command found -> 'please install docker'
 * if 'error' -> docker shortcut
 * if not exist -> install(container)
 * if exit -> start container/run StochSS
 * 
 * docker shortcut -> check if stochss1-9 exists, if not test HyperV/VirtualBox using test environ, install(HyperV/VirtualBox)
 * 							if stochss1-9 exists, follow commands to start, grab url, test for container exist
 * 													if exist -> start container/run StochSS
 * 													if not exist -> install(container)
 * 
 * install -> run install instructions, restart program checks
 * proceed with start -> one line run container grab url
 * 
 * close -> if toolbox, spin up another quickstart terminal if not cmd
 * run closing checks */
