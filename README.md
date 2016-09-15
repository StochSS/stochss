StochSS
=======

StochSS - Stochastic Simulation Service.  

StochSS is currently supported on Linux and Apple OSX platforms, and with preliminary support for Windows.

## Obtaining StochSS:

The easiest and recommended way to obtain StochSS is to download the latest stable release and follow the install instructions at http://www.stochss.org/?page_id=719. 

This process uses the latest stable StochSS Docker image.  

### Launching StochSS from this repository 
This uses the launcher tools from this repository. For the master branch, they are identical to the above provided stable releases. This process uses the latest stable StochSS Docker image.  

1. Clone the repository
    $ git clone --recursive https://github.com/StochSS/stochss.git

2. Use 'stochss_launcher' to start the application
    * [OSX](stochss_launcher/OSX/README.md)
    * [Linux](stochss_launcher/Linux/README.md)
    * [Windows](stochss_launcher/Windows/README.md)

### Installing and running from source (Advanced users only)

The will install and run StochSS as a native application on Linux or OSX. It requires installing all dependencies natively, which can be an error prone process. This mode is mostly recommended for developers seeking to modify StochSS.  

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
  

### Quick start:

In the stochss folder, type
OSX:

    $ ./run.mac.sh
    
Ubuntu:

    $ ./run.ubuntu.sh
    
    
If the webserver launched without error, the above scripts will open the App using your default webbrowser. You will be prompted to create an administrator account and from there can log in and use StochSS.

### Terminating the App 

Closing the browser does not terminate the App. If you used the Docker based package on OSX you will need to cancel the process in the StochSS window that launched when you clicked the App icon. On Linux, or if using the native version on OSX, you need to shut press Ctrl-C in the same terminal where you lunched the app. Please wait for jobs to finish or stop them before shutting the application down to avoid runaway background processes. 

### Building your own Docker images

The process described here will help you build your own local Docker images from any branch. This can be useful to create your own packages from e.g. the unstable devlop branch (where new features are pushed prior to release)

* [Build a StochSS Docker image](stochss_launcher/README.md)

### Deplying StochSS as a Service
The [saas](https://github.com/StochSS/stochss/develop) branch is used at https://try.stochss.org to deploy as SaaS. It has a modified user authentication system based on email verification. The [MOLNs](https://github.com/ahellander/molns/tree/stochss_saas) software can be used to automate the deployment of StochSS in OpenStack clouds and in Amazon EC2.  



