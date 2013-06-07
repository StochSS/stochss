#!/bin/bash

# Attempt to install StochKit 2.0.7
#
# Install it in the user's home folder by default, to override
#
#

STOCHKIT_PREFIX=$HOME

# Check dependencies
echo "Checking dependencies..."

echo "gcc: "
if which gcc>/dev/null; then
echo "OK"
else
echo "StochKit requires gcc and g++,..."
exit 1
fi

echo "g++"
if which g++>/dev/null; then
echo "OK"
else
echo "StochKit requires gcc and g++,..."
exit 1
fi
exit 1

echo "Downloading StochKit2.0.7"

wget http://sourceforge.net/projects/stochkit/files/StochKit2/StochKit2.0.7/StochKit2.0.7.tgz -O $STOCHKIT_PREFIX/StochKit2.0.7.tgz

echo "Building StochKit"

wd=`pwd`
cd $STOCHKIT_PREFIX
tar -xf StochKit2.0.7.tgz
cd StochKit2.0.7
./install.sh
cd $wd

echo "Cleaning up..."
rm -f $STOCHKIT_PREFIX/StochKit2.0.7.tgz

echo "Configuring the app with STOCHKIT_HOME"

echo "Done!"