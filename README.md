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

There are many ways to obtain Git for OSX.

* Xcode (recommended):
  Git comes integrated with Xcode, Apples Integrated Development Environment. You will need many of the tools provided by Xcode in order to install StochKit2.
  Xcode is available for free from App Store if you sign up as an "Apple Developer". After you have installed Xcode, you need to install the 'command line tools'. 
  From the the Xcode menu:
    
  Xcode > Preferences > Downloads > Command Line Tools    
  

* Using a graphical installer:

     [http://git-scm.com/downloads](http://git-scm.com/downloads)

* MacPorts:

    $ sudo port install git-core
      

## Quick start:
  
### Linux & MacOSX:

The application makes use of [StochKit2](http://www.engineering.ucsb.edu/~cse/StochKit/) to run well mixed stochastic
simulations locally, and to use this feature you need to install StochKit2. StochSS contains a tool that will attempt to
automatically download and install StochKit2.0.7 and configure the StochSS App to use this installation. 
If the script fails, you need to consult the StochKit manual for troubleshooting the installation. On Ubuntu and Fedora,
the script will try to install any dependencies (make, gcc, g++, libxml2) using the standard package managers. On MacOSX,
since there are many different ways to satisfy the dependencies, we do not attempt an automatic install. 
If you have Xcode and the command-line tools installed as recommended above, all dependencies are satesfied. If you want
to install StochKit manually, simply skip the second step below. 

After sucessfully cloning the repository as above, in a terminal, type:

    $ cd stochss
    $ tools/install_stochkit.sh
    $ ./launchapp

You can expect the StochKit installation to take a few minutes to complete. 
If the app launched without error, open a web browser (Firefox, Safari or Chrome) and navigate to

http://localhost:8080

You will be prompted with a login screen with the default username 'test@examples.com'. This version of StochSS does not support 
a secure authentication mechanism, so any user name that is on the form of an e-mail address will do to log in to the app. 
The e-mail you use will be mapped to a user id, so whenever logging in with the same e-mail address at a later time, 
your saved data will be available in the new session. **With that said, since the app is in beta-status, we recommend that you save important models frequently by exporting them to StochKit's native XML format.**

### Terminating the App 

Closing the browser does not terminate the App. To shut it down permanently, in the same terminal where you lunched the app,
press "Ctrl-C" on your keyboard, after which you can close the terminal. **Note that the data created in the app is not persisted until the app is terminated. If the app is not terminated normally, the pending transactions will not be applied and the data will be lost.** 


### Launching the app on a different host/port

To launch the app on a different host and port, from the base directory:

    $ python sdk/python/dev_appserver.py --host hostname --port portnumber app
    
For more options, consult the help for dev_appserver.py.



