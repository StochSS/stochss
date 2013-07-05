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

packages=$(yum list installed | grep '^gcc.\|^gcc-c++.\|^make.\|^libxml2-devel.\|^curl.' | wc -l)
if [ "$packages" != '4' ]; then
    echo "No"
    read -p "Do you want me to try to use sudo to install missing package(s) (libxml2-devel make gcc-c++ gcc curl)? (y/n): " answer

    answer=$(echo $answer | tr '[A-Z]' '[a-z]')

    if [ $answer == 'y' ] || [ $answer == 'yes' ]; then
        echo "Running 'sudo yum install libxml2-devel gcc make gcc-c++ curl'"
        sudo yum install libxml2-devel make gcc-c++ curl
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

echo -n "Testing if StochKit2 built... "

if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 >& /dev/null; then
    echo "StochKit2.0.7 found in $STOCHKIT_HOME"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/$STOCHKIT_VERSION"

    echo "Cleaning up anything already there..."
    rm -f "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz"
    rm -rf "$STOCHKIT_PREFIX/$STOCHKIT_VERSION"

    if [ ! -e "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" ]; then
	echo "Downloading StochKit2.0.7..."
	curl -o "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" -L "http://sourceforge.net/projects/stochkit/files/StochKit2/$STOCHKIT_VERSION/$STOCHKIT_VERSION.tgz"
    fi

    echo "Building StochKit (will take a few minutes)"
    echo " Logging stdout in $STOCHKIT_HOME/stdout.log and "
    echo " stderr in $STOCHKIT_HOME/stderr.log "
    wd=`pwd`
    cd "$STOCHKIT_PREFIX"
    tar -xf StochKit2.0.7.tgz
    cd "$STOCHKIT_HOME"
    ./install.sh 1>stdout.log 2>stderr.log
    cd $wd

# Test that StochKit was installed successfully by running it on a sample model
    if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 >& /dev/null; then
	echo "Success!"
    else
	echo "Failed"
	echo "StochKit2.0.7 failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_HOME"	
	exit -1
    fi

    echo "Cleaning up..."
    rm -f "$STOCHKIT_PREFIX/StochKit2.0.7.tgz"
fi

echo -n "Configuring the app to use $STOCHKIT_HOME for local execution... "

# Write STOCHKIT_HOME to the appropriate config file
echo -n "$STOCHKIT_HOME" > "$STOCHSS_HOME/conf/config"
echo "Done!"

python "$STOCHSS_HOME/launchapp.py"

exit 0
