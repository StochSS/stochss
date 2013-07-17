stochss
=======

StochSS - Stochastic Simulation Service.  

StochSS is currently supported on Linux and Apple OSX platforms. 

## Obtaining the code:

StochSS is downloaded by cloning the GitHub repository. **Since the repository relies on several submodules, a recursive cloning has to be performed.** Open a terminal and from a directory to where you want to download the code,
(your home folder is a good place) type the following command:

    $ git clone --recursive https://github.com/StochSS/stochss.git

If git is not already installed on your machine, the above command will fail. To obtain Git for your platform:

Ubuntu/Debian:

    $ apt-get install git
  
Fedora:

    $ sudo yum install git-core

MacOSX:


* Install Xcode:
    * Xcode, Apples Integrated Development Environment, contains all the tools you need in order to install StochSS and StochKit2.
 Install Xcode for free from App Store. 

    * After you have installed Xcode, you need to install the 'command line tools'. Open the Xcode application (in the "Applications" folder). Then, from the the Xcode menu:
      Xcode > Preferences > Downloads > Command Line Tools    
  

## Quick start (Linux & MacOSX):
  
The application makes use of [StochKit2](http://www.engineering.ucsb.edu/~cse/StochKit/) to run well mixed stochastic
simulations locally. At fisrt start, StochSS will download and build StochKit and configure the app to use this installation. 
You can expect the StochKit installation to take a few minutes to complete. 


## Launch the App

In the stochss folder, type (on Ubuntu or Fedora, use the corresponding script)

    $ python launchapp.py run.mac.sh

If the webserver launched without error, the above script will open the App using your default webbrowser. The App will be served on the follwing address

[http://localhost:8080](http://localhost:8080)

If you prefer to use another browser than the default, simply navigate to the above address. 

You will be prompted with a login screen with the default username 'test@examples.com'. This version of StochSS does not support 
a secure authentication mechanism, so any user name that is on the form of an e-mail address will do to log in to the app. 
The e-mail you use will be mapped to a user id, so whenever logging in with the same e-mail address at a later time, 
your saved data will be available in the new session. **With that said, we recommend that you save important models frequently by exporting them to StochKit's native XML format.**

### Terminating the App 

Closing the browser does not terminate the App. To shut it down permanently, in the same terminal where you lunched the app,
press "Ctrl-C" on your keyboard, after which you can close the terminal. **Note that the data created in the app is not persisted until the app is terminated. If the app is not terminated normally, the pending transactions will not be applied and the data will be lost.** 


### Launching the app on a different host/port

To launch the app on a different host and port, from the base directory:

    $ python sdk/python/dev_appserver.py --host hostname --port portnumber app
    
For more options, consult the help for dev_appserver.py.




