#!/bin/bash

# Attempt to install StochKit 2.0.7
#
# Install it in the user's home folder by default, to override
#
#

STOCHKIT_VERSION=StochKit2.0.7
STOCHKIT_PREFIX=$HOME
STOCHKIT_HOME=$STOCHKIT_PREFIX/$STOCHKIT_VERSION


# Determine the package manager to use (for Linux flavors)
if which yum>/dev/null; then
PKG_MNGR=yum
elif [ -x "$(which yum)" ]; then
PKG_MNGR=apt-get
else
echo "No package manager found (yum or apt-get). If you are on OSX, 
please make sure that you have installed Xcode and the command line tools."
fi
echo $PKG_MNGR

# Check dependencies
echo "Checking dependencies..."

# Test for the precence of the GNU compilers
echo "gcc: "
if which gcc>/dev/null; then
echo "OK"
else
echo "gcc not found, attempting to install it..."
$PKG_MNGR install -y gcc
fi

echo "g++"
if which g++>/dev/null; then
echo "OK"
else
echo "gcc not found, attempting to install it..."
$PKG_MNGR install -y g++
exit -1
fi

# Attempt to install libxml2

if [ ! -e $STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz ]; then
echo "Downloading StochKit2.0.7..."
curl -o $STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz -L http://sourceforge.net/projects/stochkit/files/StochKit2/$STOCHKIT_VERSION/$STOCHKIT_VERSION.tgz
fi

echo "Building StochKit..."
wd=`pwd`
cd $STOCHKIT_PREFIX
tar -xf StochKit2.0.7.tgz
cd $STOCHKIT_HOME
./install.sh
cd $wd

echo "Testing StochKit2 installation..."
# Test that StochKit was installed successfully by running it on a sample model
if $STOCHKIT_HOME/ssa -m $STOCHKIT_HOME/models/examples/dimer_decay.xml -r 1 -t 1 -i 1>/dev/null; then
    echo "StochKit2.0.7 was installed successfully."
else
    echo "StochKit2.0.7 failed to install. Consult the StochKit documentation for help on building StochKit for your platform."	
    echo "Cleaning up..."
    rm -f $STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz
    rm -rf $STOCHKIT_PREFIX/$STOCHKIT_VERSION	
    exit -1		 
fi

echo "Cleaning up..."
rm -f $STOCHKIT_PREFIX/StochKit2.0.7.tgz

echo "Configuring the app to use this installation of StochKit for local execution..."

echo "Done!"
exit 0
