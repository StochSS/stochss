#!/bin/bash

# Attempt to install StochKit 2.0.7
#
# Install it in the user's home folder by default, to override
#
#

read -p "Select a directory to use as StochSS home (default ~/StochSS)" MY_PATH
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 

echo "Installing in $STOCHSS_HOME"

STOCHKIT_VERSION=StochKit2.0.7
STOCHKIT_PREFIX=$STOCHSS_HOME
STOCHKIT_HOME=$STOCHKIT_PREFIX/$STOCHKIT_VERSION

if which gcc > /dev/null; then
else
    echo "gcc not found. Xcode or Xcode command line tools not installed -- refer to documentation"
    exit -1
fi

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

echo "Testing StochKit2..."

# Test that StochKit was installed successfully by running it on a sample model
if $STOCHKIT_HOME/ssa -m $STOCHKIT_HOME/models/examples/dimer_decay.xml -r 1 -t 1 -i 1; then
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

# Write STOCHKIT_HOME to the appropriate config file
echo $STOCHKIT_HOME > $STOCHSS_HOME/conf/config
echo "Done!"

exit 0
