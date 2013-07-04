#!/bin/bash

# Attempt to install StochKit 2.0.7
#
# Install it in the user's home folder by default, to override
#
#

MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 

echo "Installing in $STOCHSS_HOME"

echo '[Desktop Entry]
Version=1.0.0
Name=StochSS
Comment=This is my comment
Exec=$MY_PATH/launchapp.py
Icon=$MY_PATH/icon.png
Terminal=true
Type=Application
Categories=Application;' > $STOCHSS_HOME/StochSS.desktop

STOCHKIT_VERSION=StochKit2.0.7
STOCHKIT_PREFIX=$STOCHSS_HOME
STOCHKIT_HOME=$STOCHKIT_PREFIX/$STOCHKIT_VERSION

# Check that the dependencies are satisfied
echo -n "Are dependencies satisfied?... "

# Determine the package manager to use (for Linux flavors) and
# install dependencies
PKG_MNGR=""

libxml=""
if which yum>/dev/null; then
    PKG_MNGR=yum
    libxml=""
elif which apt-get>/dev/null; then
    PKG_MNGR=apt-get
    libxml="libxml2-dev"
else
    echo "Assuming MacOSX..."
fi

# Check that the dependencies are satisfied
echo "Checking dependencies..."

yum list installed libxml2-devel make gcc-c++ >&/dev/null
if [ $? != 0 ]; then
    echo "No"
    read -p "Do you want me to try to use sudo to install missing package(s) (libxml2-devel make gcc-c++)? (y/n): " answer

    answer=$(echo $answer | tr '[A-Z]' '[a-z]')

    if [ $answer == 'y' ] || [ $answer == 'yes' ]; then
        echo "Running 'sudo yum install libxml2-devel make gcc-c++ >&/dev/null'"
        sudo yum install libxml2-devel make gcc-c++ >&/dev/null
    else
        read -p "Do you want me to still try to install Stochkit? (y/n): " answer

        answer=$(echo $answer | tr '[A-Z]' '[a-z]')

        if [ $answer == 'n' ] || [ $answer == 'no' ]; then
            echo "Installation Failed"
            exit -1
        fi
    fi
else
    echo "Yes"
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
