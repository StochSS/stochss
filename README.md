stochss
=======

StochSS - Stochastic Simulation Service.  

StochSS is currently supported on Linux and Apple OSX platforms.

If you wish to run StochSS from a Windows computer, you will need Amazon Web Service (AWS) credentials. See the **Running on Windows** section below for more information.

## Obtaining the code:

The easiest and recommended way to obtain StochSS is to download the latest package (Linux, OSX) on [http://iguana.cs.ucsb.edu/wordpress/?page_id=224](www.stochss.org).

### Installing from source

The StochSS source is downloaded by cloning the GitHub repository. **Since the repository relies on several submodules, a recursive cloning has to be performed.** Open a terminal and from a directory to where you want to download the code,
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

=======
### Installing StochKit2

The application makes use of [StochKit2](http://www.engineering.ucsb.edu/~cse/StochKit/) to run well mixed stochastic
simulations locally. The StochSS launch scripts will attempt to
automatically download and install StochKit at first launch. You can expect the StochKit installation to take a few minutes to complete. 

## Launch the App

In the stochss folder, type
OSX:
    $ ./run.mac.wrap.sh
    
Ubuntu:
    $ ./run.ubuntu.sh

Fedora:
    $ ./run.fedora.sh
    
    
If the webserver launched without error, the above scripts will open the App using your default webbrowser. The App will be served on the follwing address

http://localhost:8080

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
    
For more options, consult the help for dev_appserver.py and the source code of the runscrips mentioned above.

## Running on Windows

To run StochSS on a Windows computer, you will need to download the .zip file from the StochSS website. You will also need to have Python installed and have AWS credentials.

### Installing Python

To install Python, do the following:

1. Download the Python Windows MSI Installer from [here](http://www.python.org/ download/releases/2.7.5/) and run the installer once it finishes downloading.

2. After the installer completes, open up the Command Prompt application and type: *dir C:\py\**.

  a) If this command outputs the name of a folder, this will tell you if Python installed successfully.
  
  b) You will need to identify the folder name where Python is installed as this is how you will call Python. The folder name is likely "Python27" and using this folder name you would call Python like this: *C:\Python27\python*.
  
### Getting AWS Credentials

If you are unfamiliar with AWS, it is essentially a suite of services provided by Amazon that allows anyone to easily harness the power of the cloud. The AWS home page is [here](http://aws.amazon.com/) and you can sign up for an account [here](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html).

You need AWS credentials because the Windows launch script doesn't actually run StochSS on your computer. Instead, the script boots up a free-tier eligible micro EC2 instance that has the StochSS app pre-installed.

### Running StochSS

Once you have completed the above steps, you are ready to run StochSS. In the StochSS folder, simply type *C:\Python27\python run.windows.py*, where *C:\Python27\python* is the path you discovered in the **Installing Python** step. This will start the Windows launch script, which will ask for your AWS credentials. The launch script will also ask for an instance ID, but if this is the first time you are running this script you can just hit return. If you entered your AWS credentials correctly, the script should eventually output a URL that you can enter into your browser to access StochSS. Once this happens, you can hit Control+C to stop the StochSS app.

**Note:** The launch script will also output an instance ID after the URL. You must save this instance ID and pass it back to the script the next time you run it. Doing so will allow you to keep all of your saved data from the last time you ran StochSS. If you ever lose this instance ID, you can always find it again from the [AWS web console](https://console.aws.amazon.com/).