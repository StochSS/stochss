#!/usr/bin/env bash

# Attempt to install StochKit 2.0.8
#
# Install it in the user's home folder by default, to override
#
#

#read -p "Select a directory to use as StochSS home (default ~/StochSS)" MY_PATH
MY_PATH="`pwd`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 

STOCHKIT_VERSION=StochKit2.0.10
STOCHKIT_PREFIX=$STOCHSS_HOME
export STOCHKIT_HOME="$STOCHKIT_PREFIX/$STOCHKIT_VERSION"
export STOCHKIT_ODE="$STOCHSS_HOME/ode"

echo "<html>"
echo "<body>"

if [ "$(echo $STOCHSS_HOME | grep " ")" != "" ]; then
    echo "<font color=\"red\"><h2>Cannot install StochSS under any directory that contains spaces (which \"$STOCHSS_HOME\" has). This is an known issue</h2></font>"
    exit -1
fi

echo "<h2>Checking StochSS configuration</h2><br />"

echo -n "Testing if Xcode & Command Line Tools installed... "

if ! which gcc > /dev/null; then
    echo "No<br />"
    echo "<font color=\"red\">"
    echo "Gcc not found. Xcode or Command Line Tools not installed -- refer to documentation"
    echo "</font>"
    exit -1
fi

echo "Yes<br />"

echo -n "Testing if StochKit2 built... "

rundir=$(mktemp -d /tmp/tmp.XXXXXX)

rm -r "$rundir"
if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
    echo "Yes <br />"
    echo "$STOCHKIT_VERSION found in $STOCHKIT_HOME<br />"
else
    echo "No<br />"

    echo "Installing in $STOCHSS_HOME/$STOCHKIT_VERSION<br />"

    echo "Cleaning up anything already there...<br />"
    rm -rf "$STOCHKIT_PREFIX/$STOCHKIT_VERSION"

    if [ ! -e "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" ]; then
	echo "Downloading $STOCHKIT_VERSION..."
	curl -o "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" -L "http://sourceforge.net/projects/stochkit/files/StochKit2/$STOCHKIT_VERSION/$STOCHKIT_VERSION.tgz"
    fi

    echo "Building StochKit<br />"
    wd=`pwd`
    cd "$STOCHKIT_PREFIX"
    tar -xzf "$STOCHKIT_VERSION.tgz"
    tmpdir=$(mktemp -d /tmp/tmp.XXXXXX)
    mv "$STOCHKIT_HOME" "$tmpdir/"
    cd "$tmpdir/$STOCHKIT_VERSION"
    echo " Stdout available at $STOCHSS_HOME/stdout.log and <br />"
    echo " Stderr available at $STOCHSS_HOME/stderr.log<br />"
    echo "<font color=\"blue\"><h3>This process will take at least 5 minutes to complete. Please be patient.</h3></font>"
    STOCHKIT_HOME_R=$STOCHKIT_HOME
    export STOCHKIT_HOME="$(pwd -P)"
    ./install.sh 1>"$STOCHSS_HOME/stdout.log" 2>"$STOCHSS_HOME/stderr.log"
    export STOCHKIT_HOME=$STOCHKIT_HOME_R
    cd $wd
    mv "$tmpdir/$STOCHKIT_VERSION" "$STOCHKIT_HOME"

    rm -r "$rundir"
# Test that StochKit was installed successfully by running it on a sample model

    if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
	echo "Success!<br \>"
    else
        echo "<font color=red>"
	echo "Failed<br \>"
	echo "$STOCHKIT_VERSION failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_HOME<br \></font>"
	exit -1
    fi
fi

echo -n "Testing if StochKit2 ODE built... "

rm -rf "$rundir"
if "$STOCHKIT_ODE/stochkit_ode.py" -m "$STOCHKIT_ODE/dimer_decay.xml" -t 1 -i 1 --out-dir "$rundir"; then
    echo "Yes"
    echo "ode found in $STOCHKIT_ODE"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/ode"

    echo "Cleaning up anything already there..."
    rm -rf "$STOCHSS_HOME/ode"

    stdout="$STOCHKIT_ODE/stdout.log"
    stderr="$STOCHKIT_ODE/stderr.log"
    echo "Building StochKit ODE"
    echo " Logging stdout in $STOCHKIT_ODE/stdout.log and "
    echo " stderr in $STOCHKIT_ODE/stderr.log "
    echo " * This process should take about a minute to complete, please be patient *"
    wd=`pwd`
    tar -xzf "ode.tgz"
    cd "ode/cvode"
    tar -xzf "cvode-2.7.0.tar.gz"
    cd "cvode-2.7.0"
    ./configure --prefix="$PWD/cvode" 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
        exit -1
    fi
    make 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
        exit -1
    fi
    make install 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
        exit -1
    fi
    cd ../../
    make 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
        exit -1
    fi
    cd ../
    cd $wd

    rm -r "$rundir"
# Test that StochKit was installed successfully by running it on a sample model
    if "$STOCHKIT_ODE/stochkit_ode.py" -m "$STOCHKIT_ODE/dimer_decay.xml" -t 1 -i 1 --out-dir "$rundir"; then
	echo "Success!"
    else
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
	exit -1
    fi

    rm -r "$rundir"
fi

echo -n "Configuring the app to use $STOCHKIT_HOME for local execution... "
echo -n "Configuring the app to use $STOCHKIT_ODE for StochKit ODE... "

ln -s "$STOCHKIT_HOME" StochKit
# Write STOCHKIT_HOME to the appropriate config file
echo "$STOCHKIT_HOME" > "$STOCHSS_HOME/conf/config"
echo -n "$STOCHKIT_ODE" >> "$STOCHSS_HOME/conf/config"
echo "Done!<br />"

exec python "$STOCHSS_HOME/launchapp.py" $0 mac
