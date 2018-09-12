package dockerWinPro;

import java.io.IOException;

public class StochSSWindowsLauncher {

	public static void main(String[] args) throws IOException {
		UIHandler window = new UIHandler();
		Main main = new Main(window);
		window.setMain(main);
		main.initialize();
		if(Main.debug) {System.out.println("Initilization Finished");}
		try {
			int installed = main.checkIfInstalled();
			if (installed == 1) {
				window.setStartup();
			} else if (installed == 0) {
				window.setnotInstall();
			}
		} catch (IOException e) {
			main.log(e, true);
		}
	}

}
