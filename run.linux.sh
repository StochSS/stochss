#!/bin/bash

# Attempt to install StochKit 2.0.8
#
# Install it in the user's home folder by default, to override
#
#


#read -p "Select a directory to use as StochSS home (leave blank to use current directory): " MY_PATH

MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 

echo "Installing in $STOCHSS_HOME"

if [ "$(echo $STOCHSS_HOME | grep " ")" != "" ]; then
    echo "Cannot execute StochSS under any directory that contains spaces (which the filename listed above has). This is an known issue"
    exit -1
fi

STOCHKIT_VERSION=StochKit2.0.8
STOCHKIT_PREFIX=$STOCHSS_HOME
STOCHKIT_HOME=$STOCHKIT_PREFIX/$STOCHKIT_VERSION

echo -n "Testing if StochKit2 built... "

if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 >& /dev/null; then
    echo "Yes"
    echo "$STOCHKIT_VERSION found in $STOCHKIT_HOME"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/$STOCHKIT_VERSION"

    echo "Cleaning up anything already there..."
    rm -rf "$STOCHKIT_PREFIX/$STOCHKIT_VERSION"

    if [ ! -e "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" ]; then
	echo "Downloading $STOCHKIT_VERSION..."
	curl -o "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" -L "http://sourceforge.net/projects/stochkit/files/StochKit2/$STOCHKIT_VERSION/$STOCHKIT_VERSION.tgz"
    fi

    echo "Building StochKit"
    echo " Logging stdout in $STOCHKIT_HOME/stdout.log and "
    echo " stderr in $STOCHKIT_HOME/stderr.log "
    echo " * This process will take at least 5 minutes to complete, please be patient *"
    wd=`pwd`
    cd "$STOCHKIT_PREFIX"
    tar -xf "$STOCHKIT_VERSION.tgz"
    cd "$STOCHKIT_HOME"
    ./install.sh 1>stdout.log 2>stderr.log
    cd $wd

# Test that StochKit was installed successfully by running it on a sample model
    if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 >& /dev/null; then
	echo "Success!"
    else
	echo "Failed"
	echo "$STOCHKIT_VERSION failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_HOME"	
	exit -1
    fi
fi

echo -n "Configuring the app to use $STOCHKIT_HOME for local execution... "

# Write STOCHKIT_HOME to the appropriate config file
echo -n "$STOCHKIT_HOME" > "$STOCHSS_HOME/conf/config"
echo "Done!"

exec python "$STOCHSS_HOME/launchapp.py" $0
