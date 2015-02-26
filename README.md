stochss
=======

StochSS - Stochastic Simulation Service.  

StochSS is currently supported on Linux and Apple OSX platforms.

## Obtaining the code:

The easiest and recommended way to obtain StochSS is to download the latest package (Linux, OSX) from www.stochss.org.

### Installing from source

The StochSS source is downloaded by cloning the GitHub repository. **Since the repository relies on several submodules, a recursive cloning has to be performed.** Open a terminal and from a directory to where you want to download the code,
(your home folder is a good place) type the following command:

    $ git clone --recursive https://github.com/StochSS/stochss.git

If git is not already installed on your machine, the above command will fail. To obtain Git for your platform:

Ubuntu/Debian:

    $ apt-get install git
  
MacOSX:


* Install Xcode:
    * Xcode, Apples Integrated Development Environment, contains all the tools you need in order to install StochSS and StochKit2.
 Install Xcode for free from App Store. 

    * After you have installed Xcode, you need to install the 'command line tools'. Open the Xcode application (in the "Applications" folder). Then, from the the Xcode menu:
      Xcode > Preferences > Downloads > Command Line Tools    
  

## Quick start:

In the stochss folder, type
OSX:
    $ ./run.mac.sh
    
Ubuntu:
    $ ./run.ubuntu.sh
    
    
If the webserver launched without error, the above scripts will open the App using your default webbrowser. You will be prompted to create an administrator account and from there can log in and use StochSS.

### Terminating the App 

Closing the browser does not terminate the App. To shut it down properly press Ctrl-C in the same terminal where you lunched the app. Please wait for jobs to finish or stop them before shutting the application down to avoid runaway background processes. 
