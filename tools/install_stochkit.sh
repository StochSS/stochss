#!/bin/bash

# Attempt to install StochKit 2.0.7
#
# Install it in the user's home folder by default, to override
#
#

MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH/..
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 
echo $STOCHSS_HOME

STOCHKIT_VERSION=StochKit2.0.7
STOCHKIT_PREFIX=$STOCHSS_HOME
STOCHKIT_HOME=$STOCHKIT_PREFIX/$STOCHKIT_VERSION

# Determine the package manager to use (for Linux flavors) and
# install dependencies
PKG_MNGR=""

libxml=""
if which yum>/dev/null; then
    PKG_MNGR=yum
    libxml="libxml2-devel"
elif which apt-get>/dev/null; then
    PKG_MNGR=apt-get
    libxml="libxml2-dev"
else
    echo "Assuming MacOSX..."
fi

# Check that the dependencies are satiesfied
echo "Checking dependencies..."

packages=""

echo "make: "
if which make>/dev/null; then
    echo "OK"
else
    echo "make not found"
    packages="make"
fi

# Test for the precence of the GNU compilers
echo "gcc: "
if which gcc>/dev/null; then
    echo "OK"
else
    echo "gcc not found"
    if which yum>/dev/null; then
	packages="$packages gcc-c++"
    else
	packages="$packages gcc"
    fi
fi

echo "g++"
if which g++>/dev/null; then
    echo "OK"
else
    echo "g++ not found"
    if which yum>/dev/null; then
	packages="$packages gcc-c++"
    else
	packages="$packages g++"
    fi
fi

echo "$libxml"
boolean=""
if [ "$PKG_MNGR" == "yum" ]; then
    yum list installed $libxml>&/dev/null
    if [ $? != 0 ]; then
	packages="$packages $libxml"
    fi
else
    dpkg -s $libxml>&/dev/null
    if [ $? != 0 ]; then
	packages="$packages $libxml"
    fi
fi

if [ -n "$(echo $packages)" ]; then

    read -p "Do you want me to try to use sudo to install missing package(s) ($packages)? (y/n): " answer

    answer=$(echo $answer | tr '[A-Z]' '[a-z]')

    if [ $answer == 'y' ] || [ $answer == 'yes' ]; then
        if which yum>/dev/null; then
            echo "Running 'sudo yum install $packages'"
            sudo yum install $packages

        elif which apt-get>/dev/null; then
            echo "Running 'sudo apt-get install $packages'"
            sudo apt-get install $packages
        else
            echo "Cannot automatically install developer tools for MacOSX... see instructions on the website, http://www.github.com/StochSS/stochss"
            exit -1
        fi
else
    echo "Trying to install anyway..."
fi
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

# Replace the STOCHKIT_HOME define in conf/stochss-env.py with the StochKit2 location from
# this install. The backup file extension is required for sed on OSX with the -i flag.
# Use comma for regexp separator since STOCHKIT_HOME is a path and contains forward slashes
sed -i.bak "s,STOCHKIT_HOME='.*,STOCHKIT_HOME='$STOCHKIT_HOME',g" $STOCHSS_HOME/conf/stochss-env.py
echo "Done!"

exit 0
