package dockerWin;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.text.DefaultCaret;


public class UIHandler{
	
	public enum State { loading, startup, notInstall, running, stopped, startupVM}
	
	State state;
	private final int width = 500;
	private final int height = 320;
	private JButton stochSSButton, webButton, settingsButton;
	private String title = "StochSS Launcher";
	private Main m;
	private JFrame frame, settings;
	private JTextArea area;
	private String output = "";


    public UIHandler() {
    	state = State.loading;
    	frame = new JFrame(title);
        Dimension size = new Dimension(width, height);
        frame.setPreferredSize(size);
        frame.setMaximumSize(size);
        frame.setMinimumSize(size);
        frame.setResizable(false);
        frame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        frame.setLocationByPlatform(true);
        frame.setVisible(true);
        frame.getContentPane().setLayout(new FlowLayout());

        
        stochSSButton = new JButton("Loading...");
        stochSSButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					stochSSButtonPressed();
				} catch (IOException e1) {
					m.log(e1, true);
				}
			}
        });
        
        webButton = new JButton("Launch StochSS");
        webButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				webButtonPressed();
			}
        });
        
        settingsButton = new JButton("Settings");
        settingsButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				settingsButtonPressed();
			}
        });
        
        frame.addWindowListener(new WindowAdapter() {
        	@Override
            public void windowClosing(WindowEvent e) {
        		if (state != State.stopped) {
            		try {
            			m.safeExit();
            		} catch (IOException e1) {
            			m.log(e1, true);
            		}
            		dispose();
            	} else {
            		dispose();
            		System.exit(0);
            	}
            }
        });
        
        area = new JTextArea();
        area.setText(output);
        area.setEditable(false);
        area.setLineWrap(true);
        
        JScrollPane areaScrollPane = new JScrollPane(area);
        areaScrollPane.setVerticalScrollBarPolicy(
                        JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
        areaScrollPane.setPreferredSize(new Dimension(475, 200));
        
        DefaultCaret caret = (DefaultCaret)area.getCaret();
        caret.setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);
        
        frame.add(settingsButton, BorderLayout.WEST);
        frame.add(areaScrollPane);
        frame.add(stochSSButton);
        frame.pack();
    }
    
    public void addText(String s) {
    	output += s + "\r\n";
    	area.setText(output);
    	refresh();
    }
    
    private void settingsButtonPressed() {
    	setSettings();
    }
    
	public void refresh() {
		frame.revalidate();
		frame.repaint();
	}
    
    private void hideLaunchButton() {
    	webButton.setVisible(false);
    	refresh();
    }
    
    private void stochSSButtonPressed() throws IOException {
    	switch (state) {
    	case loading: 
    					break;
    	case startup: 	
    					setLoading(); 
    					m.startStochSS();
    					break;
    	case startupVM:
    					setLoading();
    					m.startVM();
    					break;
    	case notInstall: 
    					setLoading();
    					stochSSButton.setText("Installing...");
    					m.install();
    					break;
    	case running: 
    					setLoading();
    					m.safeExit();
    					setStopped();
    					hideLaunchButton();
    					break;
    	case stopped: 
    					System.exit(0); 
    					break;
    	default:		
    	}
    }
    
    private void webButtonPressed() {
    	if (state == State.running) {
    		if (!m.openURL()) {
    		addText("There was a problem opening the URL. Please paste " 
    									+ m.getURL() + " into your preferred browser.");
    		}
    	}
    }
    
    public void setLoading() {
    	state = State.loading;
    	stochSSButton.setText("Loading...");
    }
    
	public void setStartupVM() {
		state = State.startupVM;
		stochSSButton.setText("Start StochSS VM");
		
	}
    
    public void setStartup() {
    	state = State.startup;
    	stochSSButton.setText("Start StochSS");
    	
    }
    
    public void setnotInstall() {
    	state = State.notInstall;
    	stochSSButton.setText("Install StochSS");
    }
    
    public void setRunning() {
    	state = State.running;
    	stochSSButton.setText("Stop StochSS");
        frame.add(webButton);
        refresh();
    }
    
    public void setStopped() {
    	state = State.stopped;
    	stochSSButton.setText("Close Window");
    }
    
    private JButton uninButton;
    
    public void setUninstallDone() {
    	uninButton.setText("Uninstall");
    }
    
    private void setSettings() {
    	settings = new JFrame(title);
        Dimension size = new Dimension(width, height);
        settings.setPreferredSize(size);
        settings.setMaximumSize(size);
        settings.setMinimumSize(size);
        settings.setResizable(false);
        settings.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        settings.setLocationByPlatform(true);
        settings.setVisible(true);
        settings.getContentPane().setLayout(new FlowLayout());
        
        uninButton = new JButton("Uninstall");
        uninButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				uninButton.setText("Uninstalling...");
				try {
					m.uninstall();
				} catch (IOException e1) {
					m.log(e1, false);
				}
			}
        });
        settings.add(uninButton);
        settings.pack();    	
    }

    public void setMain(Main ma) {
    	m = ma;
    }

	public void dispose() {
		if (settings != null) {
			settings.dispose();
		}
		if (frame != null) {
			frame.dispose();
		}
	}
	
	public String getWindowText() {
		return area.getText();
	}

}


//getstohsslogfile <-- for settings. Execute docker command and it's cat /stochss-master/stderr.log