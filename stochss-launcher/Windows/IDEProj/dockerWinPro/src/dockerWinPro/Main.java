package dockerWinPro;

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
	
	private String url;
	
	private ProcessBuilder builder;
	
	private Process process;
	
	private BufferedWriter stdin;
	private BufferedReader stdout;
	
	private UIHandler window;
	private Process subp;
	
	
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
	}
	
	public void uninstall() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 
				 terminalWrite(Commands.uninstallContainer(), stdin, true); 
				 
				 terminalWrite(Commands.uninstallImage(), Commands.commandFinished(), stdin, true);
				 
				 while((line = waitForFinishFlag(stdout)) != null) { 
				    window.addText(line);
				    if (Commands.errorContain(line)) {
				    	log(Commands.errorMeaning(line), false);
				    	return true;
				    }
				 }
				 window.addText(Commands.adviseUninstalled());
				 return true;
			  }
			  @Override
			  protected void done() {
			    window.setUninstallDone();
			    window.setStopped();
			  }
		};
		worker.execute();
	}
	/**
	 * This function checks if StochSS is installed. 
	 * @return boolean whether or not stochss is installed
	 * @throws IOException
	 */
	public int checkIfInstalled() throws IOException {
		String line;
	    
		terminalWrite(Commands.searchForContainerName(), Commands.commandFinished(), stdin, true); 
	    
		while((line = waitForFinishFlag(stdout)) != null) { 
	    	window.addText(line);
	    	if (Commands.errorContain(line)) {
	    		log(Commands.errorMeaning(line), true);
	    		return -1;
	    	}
	    	if (line.contains(Commands.containerName) && !line.contains(Commands.searchForContainerName())) {
	    		window.setStartup();
	    		return 1;
	    	}
	    }
		
		window.addText(Commands.adviseNotInstalled());
	    return 0;
	}
	
	public void install() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				String line;
				
				terminalWrite(Commands.downloadImage(), stdin, true);
				
				while((line = stdout.readLine()) != null && !line.startsWith("Status: ")) {
				 	window.addText(line);
				}
				
				window.addText(line);
				
				terminalWrite(Commands.createContainer(), stdin, true);
				
				window.addText(stdout.readLine());
				return true;
			  }
			  @Override
			  protected void done() {
				try {
					int installed = checkIfInstalled();
					if (installed == 1) {
						window.setStartup();
					} else if (installed == 0) {
						window.setnotInstall();
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
				 
				 terminalWrite(Commands.startContainer(), stdin, true);
				
				 terminalWrite(Commands.runStochSS(), stdin, false);
				 
				 while((line = stdout.readLine()) != null && !line.startsWith("Navigate to ")) {
				 	window.addText(line);
				 	if (Commands.errorContain(line)) {
				 		window.addText(Commands.errorMeaning(line));
					   	url = Commands.backupURL("0.0.0.0");
				 		return true;
				 	}
				}
				 try {
				   	url = line.substring(12, line.indexOf(" to access StochSS"));
				   	if(url.contains("0.0.0.0")) {
				   		int temp = url.indexOf("0.0.0.0");
				   		url = url.substring(0, temp) + Commands.ipReplace + url.substring(temp + 7);
				   	}
				   	window.addText("Click 'Launch StochSS' below or navigate to " + url + " to access StochSS.");
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
		
	public void safeExit() throws IOException { //TODO: if any of these hang, need to detect it and destroyProcesses that way
		subp = builder.start();	
		BufferedWriter exitin = new BufferedWriter(new OutputStreamWriter(subp.getOutputStream()));
	    BufferedReader exitout = new BufferedReader(new InputStreamReader(subp.getInputStream()));
	    
	    String line;
	    
	    terminalWrite(Commands.stopContainer(),Commands.commandFinished(),exitin, true);
	    
	    while((line = waitForFinishFlag(exitout)) != null) { 
	    	window.addText(line); 
	    	if (Commands.errorContain(line)) {
	    		log(Commands.errorMeaning(line), false);
	    		break;
	    	}
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
		window.addText("***ERROR*** " + str);
	}

	public String getURL() {
		return url;
	}
	
	/**
	 * 
	 * @param command Command to run
	 * @param in BufferedWriter to run the commands with
	 * @throws IOException
	 */
	private void terminalWrite(String command, BufferedWriter in, boolean reroute) throws IOException{
		String route = "";
		if (reroute) {
			route += "2>&1 ";
		}
		in.write(route + command);
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
	private void terminalWrite(String command1, String command2, BufferedWriter in, boolean reroute) throws IOException{
		String route = "";
		if (reroute) {
			route += "2>&1 ";
		}
		in.write(route + command1 + " && " + route + command2);
		in.newLine();
		in.flush();
	}
	
	/**
	 * 
	 * @param read BufferedReader to read
	 * @return Returns the string to output when the loop should continue, or null when the finished flag is found
	 * @throws IOException
	 */
	private String waitForFinishFlag(BufferedReader read) throws IOException {
		String line;
		if((line = read.readLine()) != null && !(line.contains(Commands.finishedStr) && !line.contains(Commands.commandFinished()))) {
			return line;
		}
		return null;
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
