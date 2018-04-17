package dockerWin;

import java.io.IOException;

public class StochSSWindowsLauncher {

	public static void main(String[] args) {
		UIHandler window = new UIHandler();
		Main main = new Main(window);
		window.setMain(main);
		main.initialize();
		
		try {
			if (main.getToolbox() && main.checkIfVMInstalled()) {
				window.setStartupVM();
			} else if (main.checkIfInstalled()) {
				window.setStartup();
			} else {
				window.setnotInstall();
			}
		} catch (IOException e) {
			main.log(e, true);
		}
	}

}
