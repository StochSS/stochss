stochss
=======

StochSS - Stochastic Simulation Service.  


## Cloning the repo:

The repository relies on several submodules. To clone the repository and all the modules, 
a recursive cloning has to be performed using the following command :

    git clone --recursive https://github.com/StochSS/stochss.git

If git is not already installed on your machine, obtain it for your platform:

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
      

Quick start:
-----

Follow the instructions below to launch the app on localhost, port 8080.  

### Linux:

In a terminal, type:

    ./install_linux.sh
    ./launchapp

If the app launched without error, open a browser and go to

http://localhost:8080

### MacOSX:

In a terminal, type:

    ./launchapp

If the app launched without error, open a browser and go to

http://localhost:8080

### Launching the app on a different host/port

To launch the app on a different host and port, from the base directory:

    python sdk/python/dev_appserver.py --host hostname --port portnumber app



