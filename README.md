stochss
=======

StochSS - Stochastic Simulation Service.  

StochSS is currently supported on Linux and Apple OSX platforms. 

## Obtaining the code:

StochSS is downloaded by cloning the GitHub repository. Since the repository relies on several submodules,  
a recursive cloning has to be performed. Open a terminal and from a directory where you want to download the code,
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
  Git comes integrated with Xcode, Apples Integrated Development Environment. If you plan to run simulations locally on 
  your own machine (as opposed to compute nodes/virtual machines in EC2), you will need Xcode in order to install StochKit2.
  Xcode is available for free from App Store. After you have installed Xcode, you need to install the 'command line tools':
    
  Xcode > Preferences > Downloads > Command Line Tools    
  

* Using a graphical installer:

     [http://git-scm.com/downloads](http://git-scm.com/downloads)

* MacPorts:

    $ sudo port install git-core
      

## Quick start:
  
### Linux & MacOSX:

After sucessfully cloning the repository as above, in a terminal, type:

    $ cd stochss
    $ ./launchapp

If the app launched without error, open a web browser (Firefox, Safari or Chrome) and navigate to

http://localhost:8080

You will be promted with a login screen with the default username 'test@examples.com'. This version of StochSS does not support 
a secure authentication mechanism, so any user name that is on the form of an e-mail address will do to log in to the app. 
The e-mail you use will be mapped to a user id in the app, so whenever logging in with the same e-mail address at a later time, 
your saved data will be there. 

### Terminating the App 

Closing the browser does not terminate the App. To shut it down permanently, in the same terminal where you lunched the app,
press "Ctrl-C" on your keyboard, after which you can close the terminal. Note that simply closing the terminal might lead to loss of data. 


### Launching the app on a different host/port

To launch the app on a different host and port, from the base directory:

    python sdk/python/dev_appserver.py --host hostname --port portnumber app



