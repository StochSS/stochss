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

STOCHKIT_VERSION=StochKit2.0.10
STOCHKIT_PREFIX=$STOCHSS_HOME
export STOCHKIT_HOME="$STOCHKIT_PREFIX/$STOCHKIT_VERSION"
ODE_VERSION="ode-1.0.1"
export STOCHKIT_ODE="$STOCHSS_HOME/$ODE_VERSION"
STOCHOPTIM_VERSION="stochoptim-0.5-1"
export STOCHOPTIM="$STOCHSS_HOME/$STOCHOPTIM_VERSION"
export R_LIBS="$STOCHSS_HOME/stochoptim/library"

if [ "$(echo $STOCHSS_HOME | grep " ")" != "" ]; then
    echo "Cannot install StochSS under any directory that contains spaces (which the filename listed above has). This is an known issue"
    exit -1
fi

# Check that the dependencies are satisfied
echo -n "Are dependencies satisfied?... "

count=$(dpkg-query -l gcc g++ make libxml2-dev curl git r-base-core libgsl0-dev | grep '^[a-z]i' | wc -l)

if [ $count != 8 ]; then
    echo "No"
    read -p "Do you want me to try to use sudo to install required package(s) (make, gcc, g++, libxml2-dev, curl, git, r-base-core, libgsl0-dev)? (y/n): " answer

    if [ $? != 0 ]; then
        exit -1
    fi

    if [ "$answer" == 'y' ] || [ "$answer" == 'yes' ]; then
        echo "Running 'sudo apt-get install make gcc g++ libxml2-dev curl git r-base-core libgsl0-dev'"
        sudo apt-get install make gcc g++ libxml2-dev curl git r-base-core libgsl0-dev

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
else
    echo "Yes"
fi

echo -n "Testing if StochKit2 built... "

rundir=$(mktemp -d /tmp/tmp.XXXXXX)
rm -r "$rundir" >& /dev/null

if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
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
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process will take at least 5 minutes to complete, please be patient *"
    wd=`pwd`
    cd "$STOCHKIT_PREFIX"
    tar -xzf "$STOCHKIT_VERSION.tgz"
    tmpdir=$(mktemp -d /tmp/tmp.XXXXXX)
    mv "$STOCHKIT_HOME" "$tmpdir/"
    cd "$tmpdir/$STOCHKIT_VERSION"
    STOCHKIT_HOME_R=$STOCHKIT_HOME
    export STOCHKIT_HOME="$(pwd -P)"
    ./install.sh 1>"$STOCHSS_HOME/stdout.log" 2>"$STOCHSS_HOME/stderr.log"
    export STOCHKIT_HOME=$STOCHKIT_HOME_R
    cd $wd
    mv "$tmpdir/$STOCHKIT_VERSION" "$STOCHKIT_HOME"
    rm -r "$tmpdir" >& /dev/null

# Test that StochKit was installed successfully by running it on a sample model
    if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
	echo "Success!"
    else
	echo "Failed"
	echo "$STOCHKIT_VERSION failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_HOME"	
	exit -1
    fi
fi

echo -n "Testing if Stochoptim built... "

rm -r "$rundir" >& /dev/null

if Rscript --vanilla "$STOCHOPTIM/exec/mcem2.r" --model "$STOCHOPTIM/inst/extdata/birth_death_MAmodel.R" --data "$STOCHOPTIM/birth_death_MAdata.txt" --steps "" --seed 1 --cores 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1 --command 'bash' >& /dev/null; then
    echo "Yes"
    echo "$STOCHOPTIM_VERSION found in $STOCHOPTIM"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/$STOCHOPTIM_VERSION"

    echo "Cleaning up anything already there..."
    rm -rf "$STOCHOPTIM"

    echo "Building StochOptim"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process will take at least 5 minutes to complete, please be patient *"

    tar -xzf "$STOCHOPTIM.tgz"
    mkdir "$STOCHOPTIM/library"

    wd=`pwd`

    echo install.packages\(\"optparse\", \""$STOCHOPTIM/library"\", \"http://cran.us.r-project.org\", INSTALL_opts = \"--no-multiarch\"\) > "$STOCHOPTIM/install_packages.R"
    echo install.packages\(\""$STOCHOPTIM"\", \""$STOCHOPTIM/library"\", NULL, type = \"source\", INSTALL_opts = \"--no-multiarch\"\) >> "$STOCHOPTIM/install_packages.R"

    Rscript "$STOCHOPTIM/install_packages.R"

    export R_LIBS="$STOCHOPTIM/library"

# Test that StochKit was installed successfully by running it on a sample model
    if Rscript --vanilla "$STOCHOPTIM/exec/mcem2.r" --model "$STOCHOPTIM/inst/extdata/birth_death_MAmodel.R" --data "$STOCHOPTIM/birth_death_MAdata.txt" --steps "" --seed 1 --cores 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1 --command 'bash' >& /dev/null; then
	echo "Success!"
    else
	echo "Failed"
	echo "$STOCHOPTIM failed to install. Consult logs above for errors"	
	exit -1
    fi
fi

echo -n "Testing if StochKit2 ODE built... "

if "$STOCHKIT_ODE/ode" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
    echo "Yes"
    echo "ode found in $STOCHKIT_ODE"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/$ODE_VERSION"

    echo "Cleaning up anything already there..."
    rm -rf "$STOCHSS_HOME/ode"

    stdout="$STOCHSS_HOME/stdout.log"
    stderr="$STOCHSS_HOME/stderr.log"
    echo "Building StochKit ODE"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process should take about a minute to complete, please be patient *"
    wd=`pwd`
    tmpdir=$(mktemp -d /tmp/tmp.XXXXXX)
    tar -xzf "$STOCHKIT_ODE.tgz"
    mv "$STOCHKIT_ODE" "$tmpdir"
    cd "$tmpdir/$ODE_VERSION/cvodes"
    tar -xzf "cvodes-2.7.0.tar.gz"
    cd "cvodes-2.7.0"
    ./configure --prefix="$PWD/cvodes" 1>"$stdout" 2>"$stderr"
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
    STOCHKIT_ODE_R=$STOCHKIT_ODE
    export STOCHKIT_ODE="$(pwd -P)"
    make 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
        exit -1
    fi
    export STOCHKIT_ODE="$STOCHKIT_ODE_R"
    cd ../
    cd $wd
    mv "$tmpdir/$ODE_VERSION" "$STOCHKIT_ODE"

# Test that StochKit was installed successfully by running it on a sample model
    if "$STOCHKIT_ODE/ode" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
	echo "Success!"
    else
	echo "Failed"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE"
	exit -1
    fi
fi

rm -r "$rundir" >& /dev/null

echo "Configuring the app to use $STOCHKIT_HOME for StochKit... "
echo "Configuring the app to use $STOCHKIT_ODE for StochKit ODE... "
echo "Configuring the app to use $STOCHOPTIM for Stochoptim... "

ln -s "$STOCHOPTIM" stochoptim >& /dev/null
ln -s "$STOCHKIT_ODE" ode >& /dev/null
ln -s "$STOCHKIT_HOME" StochKit >& /dev/null

# Write STOCHKIT_HOME to the appropriate config file
echo "$STOCHKIT_HOME" > "$STOCHSS_HOME/conf/config"
echo "$STOCHKIT_ODE" >> "$STOCHSS_HOME/conf/config"
echo -n "$STOCHOPTIM" >> "$STOCHSS_HOME/conf/config"
echo "Done!"

export PATH=$PATH:$STOCHKIT_HOME

exec python "$STOCHSS_HOME/launchapp.py" $0
