package dockerWin;

import java.awt.Desktop;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import javax.swing.SwingWorker;

/**
 * 
 *
 */
public class Main {
	
	private static String containerName = Commands.containerName;
	private String VMname = Commands.VMname;
	private String imageName = Commands.imageName;
	private int logLimit = 100;
	private boolean toolbox = false;
	
	private String ip = "127.0.0.1";
	private String url;
	
	
	private ProcessBuilder builder;
	
	private Process process;
	private BufferedWriter stdin;
	private BufferedReader stdout;
	
	private UIHandler window;
	private Process subp;
	private String toolbox1, toolbox2, toolboxPath;
	
	public Main(UIHandler w) {
		window = w;
		builder = new ProcessBuilder("cmd");
	}
	/**
	 * Initiliazes the main in order to run stochss, creating a standard input and output, and tries to enter the toolbox
	 */
	public void initialize() {
		try { 
			process = builder.start();
		} catch (IOException e) {
			log(e, true);
		}
	    stdin = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
	    stdout = new BufferedReader(new InputStreamReader(process.getInputStream()));
	    if (checkToolbox()) {
	    	toolbox = true;
	    	try {
				enterToolbox(stdin, stdout, process);
			} catch (IOException e) {
				log(e, true);
			}
	    }
	}
	/**
	 * uhhhhh @KateLynn is this needed?
	 * @return
	 */
	private boolean checkToolbox() {
		//TODO
		return true;
	}
	/**
	 * Uninstalls stochSS
	 * @throws IOException
	 */
	public void uninstall() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 stdin.write(Commands.uninstallContainer()); 
				 stdin.newLine();
				 stdin.write(Commands.uninstallImage());
				 stdin.newLine();
				 stdin.write(Commands.commandFinished());
				 stdin.newLine();
				 stdin.flush();
				 while((line = stdout.readLine()) != null && !line.contains(Commands.commandFinished())) { 
				    window.addText(line);
				}
				if (toolbox) {} //TODO
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
	 * TODO:
	 * 1. check docker-machine existence [docker-machine ls]
	 * 2. start docker-machine [docker-machine start stochss1-9]
	 * 3. set eval [eval "$(docker-machine env stochss1-9)"]
	 * @return boolean whether or not stochss is installed
	 * @throws IOException
	 */
	public boolean checkIfInstalled() throws IOException {
		String line;
	    stdin.write(Commands.searchForContainerName()); 
	    stdin.newLine();
	    stdin.write(Commands.commandFinished()); 
	    stdin.newLine();
	    stdin.flush();
	    //while((line = stdout.readLine()) != null && !(line.contains(Commands.commandFinished()) && !line.contains(">"))) {  this DOES also works, but is less readable
	    while(!commandHasFinished(line = stdout.readLine() )) { 
	    	window.addText(line);
	    	if (line.contains(containerName)) {
	    		window.setStartup();
	    		return true;
	    	}
	    }
	    return false;
	}
	
	/**
	 * Installs stochSS
	 * @throws IOException
	 */
	public void install() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				String line;
				stdin.write(Commands.downloadImage());
				stdin.newLine();
				stdin.flush();
				while((line = stdout.readLine()) != null && !line.startsWith("Status: ")) {
				 	window.addText(line);
				}
				window.addText(line);
				stdin.write(Commands.createContainer());
				stdin.newLine();
				stdin.flush();
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
	
	/**
	 * Attemps to start the StochSS process
	 * @throws IOException
	 */
	public void startStochSS() throws IOException {
		SwingWorker<Boolean, String> worker = new SwingWorker<Boolean, String>() {
			 @Override
			 protected Boolean doInBackground() throws IOException {
				 String line;
				 stdin.write(Commands.startContainer());
				 stdin.newLine();
				 stdin.write(Commands.runStochSS());
				 stdin.newLine();
				 stdin.flush();
				 while((line = stdout.readLine()) != null && !line.startsWith("Navigate to ")) {
				 	window.addText(line);
				}
				 try {
				   	url = line.substring(12, line.indexOf(" to access StochSS"));
				   	if(url.contains("0.0.0.0")) {
				   		int temp = url.indexOf("0.0.0.0");
				   		url = url.substring(0, temp) + ip + url.substring(temp + 7);
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
	
	/**
	 * Runs stochSS in the browser (I think, @KateLynn needs to confirm)
	 * @return
	 */
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
	
	/**
	 * Attemps to safely exit, stopping StochSS and clearing memory
	 * @throws IOException
	 */
	public void safeExit() throws IOException { //TODO: if any of these hang, need to detect it and destroyProcesses that way
		subp = builder.start();	
		BufferedWriter exitin = new BufferedWriter(new OutputStreamWriter(subp.getOutputStream()));
	    BufferedReader exitout = new BufferedReader(new InputStreamReader(subp.getInputStream()));
	    if (toolbox) { 
	    	enterToolbox(exitin, exitout, subp); 
	    }
	    String line;
	    exitin.write(Commands.stopContainer());
	    exitin.newLine();
	    exitin.write(Commands.commandFinished());
	    exitin.newLine();
	    exitin.flush();
	    while((line = exitout.readLine()) != null && !line.contains(Commands.commandFinished())) {  //[1]
	    	window.addText(line); 
		}
		destroyProcesses();
		// [1] For some reason this hangs if changed to the !(line.contains(Commands.commandFinished()) && !line.contains(">")) version, 
		//which is supposed to be MORE robust/less error-prone than !line.contains(Commands.commandFinished())
	}
	/**
	 * Destroys the current process to prevent memory leaks
	 */
	private void destroyProcesses() {
		if (process != null) 
			process.destroy();
		if (subp != null)
			subp.destroy();
	}
	/**
	 * Log function is called when an error occurs, and attempts to log the error and (may) safely exit the process
	 * @param e The Exception/Error that occurs
	 * @param exit Whether or not to exit the process
	 */
	public void log(Exception e, boolean exit) {
		String s = "";
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		s += errors.toString(); 
		log(s, exit);
	}
	/**
	 * Overloaded function of previous log, documents the error, and attempts to stop the process safely if exit is true
	 * @param str String variable of error
	 * @param exit boolean whether or not to exit
	 */
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
	/**
	 * NOTE: Katelynn correct if im wrong, im just adding javadoc as much as I can
	 * @param in Input BufferedWriter to write to
	 * @param out Output BufferedReader to read from
	 * @param p Process (Seperate Thread?) to use
	 * @throws IOException
	 */
	
	private void enterToolbox(BufferedWriter in, BufferedReader out, Process p) throws IOException {
		String line;
		if (toolboxPath == null) {
//			/"C:\Program Files\Git\bin\bash.exe" --login -i "C:\Program Files\Docker Toolbox\start.sh"
			in.write("where docker");
			in.newLine();
			in.write(Commands.commandFinished());
			in.newLine();
			in.flush();
			while((line = out.readLine()) != null && !(line.contains(Commands.commandFinished()) && !line.contains(">"))) { 
		    	window.addText(line);
		    	if (line.contains("Docker Toolbox")) {
		    		toolbox1 = line.substring(0, line.indexOf("docker.exe"));
		    		break;
		    	}
		    }
			
			in.write("where git");
			in.newLine();
			in.write(Commands.commandFinished());
			in.newLine();
			in.flush();
			while((line = out.readLine()) != null && !(line.contains(Commands.commandFinished()) && !line.contains(">"))) { 
		    	window.addText(line);
		    	if (line.contains("cmd\\git.exe")) {
		    		toolbox2 = line.substring(0, line.indexOf("cmd\\git.exe"));
		    		break;
		    	}
		    }
			toolboxPath = "\"" + toolbox2 + "bin\\bash.exe\" --login -i \"" + toolbox1 + "start.sh\"";
		}
		
/* *fuck this code in particular**
		p.destroy();//????
		builder.directory(new File(toolbox1));
		p = builder.start();
		in = new BufferedWriter(new OutputStreamWriter(p.getOutputStream()));
	    out = new BufferedReader(new InputStreamReader(p.getInputStream()));
**********************************/
		
		
		in.write(toolboxPath);
		in.newLine();
		in.write(Commands.commandFinished());
		in.newLine();
		in.flush();
		while((line = out.readLine()) != null && !(line.contains(Commands.commandFinished()))) {/* adding '&& !line.contains(">")' will make this NOT work*/ 
	    	window.addText(line);
	    }
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
	 * This program checks whether or not the finished string has been output
	 * @return Boolean Whether or not a command has finished execution
	 * @throws IOException
	 */
	private boolean commandHasFinished(String outputToCheck) throws IOException {
		return !(outputToCheck != null && !(outputToCheck.contains(Commands.commandFinished()) && !outputToCheck.contains(">")));
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
