# MOLNs spatial stochastic simulation appliance #

MOLNs is a cloud appliance that will set up, start and manage a virtual platform for scalable, distributed computational experiments using (spatial) stochastic simulation software such as PyURDME (www.pyurdme.org) and StochKit/Gillespy (www.github.com/Gillespy/gillespy). In addition, MOLNs by default makes FEniCS/Dolfin available as-a Service.  

Since MOLNs will configure and manage a virtual IPython Cluster (with a Notebook frontend), with Numpy, SciPy and Ipython Parallel enabled, it can also be useful for general contextualization and management of dynamic, cloud-agnostic (supports EC2 and OpenStack-based clouds) virtual IPython environments, even if you are not into spatial stochstic simulations in systems biology. 

Note: MOLNs is currenly compatible only with 'EC2-Classic', we are working on supporting Amazon VPC. 

### Prerequisites ###
To use MOLNs, you need valid credentials to an OpenStack cloud, Amazon Elastic Compute Cloud (EC2) or HP Helion public cloud. You also need Python, and the following packages:

* sqlalchemy
* boto (for EC2)
* paramiko
* novaclient (for OpenStack)
 
To prepare your system:

1. Install pip
    If you don't have pip, the python packagem manager, installed
    already, you will need to install it. The best way to do that
    is to use the 'get-pip' script, which can be found here:
    https://bootstrap.pypa.io/get-pip.py

2. Install python packages with pip:

    * sudo pip install sqlalchemy
    * sudo pip install boto
    * sudo pip install paramiko
        * Install of paramiko will fail if Python development libraries are missing, if that is the case
            * sudo apt-get install python-dev
    * sudo pip install python-novaclient
        * In case of problems, more information can be found [here](http://docs.openstack.org/user-guide/content/install_clients.html). 
    
3. Download and install MOLNs:

    Download the lastest version of molns from this web address:
        https://github.com/Molns/molns/archive/master.zip
    This will download the compressed, archive "molns-master.zip". Next, 
    uncompress the archive to create the folder "molns-master". Finally,
    move this folder to the location you want molns installed on your system.

4. Configure your shell:

    Molns needs to know where it has been installed. The easiest
    way to this is to add a line to your shell configuration file.
    The default shell on OSX is bash, thus the ".bash_profile" file
    in your home directory is the configuration file. On Ubuntu, the
    file ".bashrc" in your home directory is sometimes the configuration
    file. Add this line:
        source "/PATH/TO/MOLNS/INSTALLATION/molns_init.sh"
    where /PATH/TO/MOLNS/INSTALLATION/ is the path to where the molns
    software is installed.

#### Obtaining Security Credentials/API keys ####
The molns CLI will prompt you for your access credentials for the cloud provider you want to use. This involves setting up accounts at the provider(s) of choice. Currently, [Amazon EC2](http://aws.amazon.com/ec2/) and OpenStack, which includes [HP Helion](http://www8.hp.com/us/en/cloud/helion-overview.html), are supported. Please follow the instructions of respective cloud provider to sign up for an account and to obtain API access credentials before beginning to use molns. 

* Amazon EC2: [Obtain the Access Key ID and Secret Access Key](http://docs.aws.amazon.com/general/latest/gr/getting-aws-sec-creds.html)  
* HP Helion/OpenStack: [Obtain the *openrc* file](http://docs.openstack.org/cli-reference/content/cli_openrc.html).  

** Tip: **
    molns will prompt you to enter your security credentials. However, it will look for environmental variables and use them as defaults if available. For openstack, simply source the *openrc* file you downloaded. For EC2, set the following environmental variables:

   $ export AWS_ACCESS_KEY = < Access Key ID >
   $ export AWS_SECRET_KEY = < Secret Access Key >


### Quick start ####

To set up a start a MOLNs virtual platform named "molns-test" in a cloud provider "Provider", execute the following sequence of commands (you will be taken through and interactive setup process)

    $ molns provider setup Provider
    $ molns controller setup molns-test
    $ molns worker setup molns-test-workers
    $ molns start molns-test
    $ molns worker start molns-test-workers

You will be presented with a URL for the controller node of your platform. Navigate there using a browser (Google Chrome is strongly recommended, and Safari should be avoided). The easiest way to get started using the platform is to dive into one of the provided tutorial notebooks that are made available in every fresh MOLNs virtual platform.  

For a complete list of the valid subcommands for molns, type 

    $ molns help

### Above commands explained ###
The molns CLI works with three abstractions for setting up and managing your virtual platform: *Provider*, *Controller* and *Worker* objects. *Provider* represents an IaaS provider (EC2, OpenStack), *Controller* represents a head node of the Molns cluster, and hosts the IPython Parallel controller and the IPython Notebook server. If the controller node has X VCPUs, X-2 Ipython engines (workers) will be deployed on the controller host.  *Worker* represents one or more nodes hosting additional IPython engines.
