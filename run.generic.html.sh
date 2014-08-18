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
ODE_VERSION="ode-1.0.1"
export STOCHKIT_ODE="$STOCHSS_HOME/$ODE_VERSION"
STOCHOPTIM_VERSION="stochoptim-0.5-1"
export STOCHOPTIM="$STOCHSS_HOME/$STOCHOPTIM_VERSION"
export R_LIBS="$STOCHSS_HOME/stochoptim/library"

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

#################
# Check to see if the 'dolfin' python module is installed and active in this terminal.
function check_dolfin_sub {
    RET=`python -c "import dolfin" 2>/dev/null`
    RC=$?
    if [[ $RC == 0 ]];then
        return 0 #True
    fi
    return 1 #False
}
function check_dolfin {
    if check_dolfin_sub; then
        return 0 #True
    else
        FENICS_MAC_APP_CONF="/Applications/FEniCS.app/Contents/Resources/share/fenics/fenics.conf"
        if [ -e $FENICS_MAC_APP_CONF ];then
            echo "FEniCS.app found, sourcing $FENICS_MAC_APP_CONF.<br />"
            FENICS_CONF_SILENT=1
            source $FENICS_MAC_APP_CONF
            if check_dolfin_sub;then
                return 0 #True
            fi
        fi
    fi
    return 1 #False
}

function check_pyurdme_sub {
    RET=`python -c "import pyurdme" 2>/dev/null`
    RC=$?
    if [[ $RC == 0 ]];then
        return 0 #True
    fi
    return 1 #False
}
function check_pyurdme {
    if check_pyurdme_sub; then
        return 0 #True
    else
        PYURDME_CONF="$STOCHSS_HOME/app/lib/pyurdme-stochss/pyurdme_init"
        if [ -e $PYURDME_CONF ];then
            echo "PyURDME local install found, sourcing $PYURDME_CONF.<br />"
            source $PYURDME_CONF
            if check_pyurdme_sub;then
                return 0 #True
            fi
        fi
    fi
    return 1 #False
}

function download_pyurdme {
    ZIP_URL="https://github.com/pyurdme/pyurdme/archive/stochss.zip"
    TMPDIR=$(mktemp -d /tmp/tmp.XXXXXX)
    ZIP_FILE="$TMPDIR/pyurdme.zip"
    CMD="curl -o $ZIP_FILE -L $ZIP_URL"
    echo $CMD
    eval $CMD
    if [[ -e "$ZIP_FILE" ]];then
        cd "$STOCHSS_HOME/app/lib" || return 1
        pwd
        CMD="unzip $ZIP_FILE > /dev/null"
        echo $CMD
        eval $CMD
        if [[ $? != 0 ]];then
            rm $ZIP_FILE
            return 1 #False
        fi
        rm $ZIP_FILE
        return 0 #True
    else
        return 1 #False
    fi
}

function check_spatial_installation {
    if check_dolfin; then
        echo "FEniCS/Dolfin detected successfully.<br />"
    else
        echo "FEniCS/Dolfin detected successfully not installed, please check installation instructions.<br />"
        echo "You can download FEniCS from http://fenicsproject.org/<br />"
        return 1 #False
    fi

    if check_pyurdme; then
        echo "PyURDME detected successfully.<br />"
    else
        echo "PyURDME not installed, attempting local install.<br />"
        download_pyurdme
        if check_pyurdme; then
            echo "PyURDME detected successfully.<br />"
        else
            echo "PyURDME not installed, Failing (check if all required python modules are installed).<br />"
            return 1 #False
        fi
    fi
    return 0 #True
}

#####################

echo "Check if spatial libraries are installed.<br />"
if check_spatial_installation;then
    echo "Spatial libraries installed correctly.<br />"
else
    echo "Error checking the spatial libraries.<br />"
    exit 1
fi
#################

echo -n "Testing if StochKit2 built... "

rundir=$(mktemp -d /tmp/tmp.XXXXXX)

rm -r "$rundir" >& /dev/null
if "$STOCHKIT_HOME/ssa" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -r 1 -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
    echo "Yes <br />"
    echo "$STOCHKIT_VERSION found in $STOCHKIT_HOME<br />"
else
    echo "No<br />"

    echo "Installing in $STOCHSS_HOME/$STOCHKIT_VERSION<br />"

    echo "Cleaning up anything already there...<br />"
    rm -rf "$STOCHKIT_PREFIX/$STOCHKIT_VERSION" >& /dev/null

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

    rm -r "$rundir" >& /dev/null
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

echo -n "Testing if Stochoptim built... "

rm -r "$rundir" >& /dev/null

if Rscript --vanilla "$STOCHOPTIM/exec/mcem2.r" --model "$STOCHOPTIM/inst/extdata/birth_death_MAmodel.R" --data "$STOCHOPTIM/birth_death_MAdata.txt" --steps "" --seed 1 --cores 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1 --command 'bash' >& /dev/null; then
    echo "Yes <br />"
    echo "$STOCHOPTIM_VERSION found in $STOCHOPTIM <br />"
else
    echo "No <br />"

    echo "Installing in $STOCHSS_HOME/$STOCHOPTIM_VERSION <br />"

    echo "Cleaning up anything already there... <br />"
    rm -rf "$STOCHOPTIM" >& /dev/null

    echo "Building StochOptim <br />"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and <br />"
    echo " stderr in $STOCHSS_HOME/stderr.log <br />"
    echo " <font color=\"blue\"><h3>This process will take at least 5 minutes to complete, please be patient</h3></font>"

    tar -xzf "$STOCHOPTIM.tgz"
    mkdir "$STOCHOPTIM/library"

    wd=`pwd`

    echo install.packages\(\"optparse\", \""$STOCHOPTIM/library"\", \"http://cran.us.r-project.org\", INSTALL_opts = \"--no-multiarch\"\) > "$STOCHOPTIM/install_packages.R"
    echo install.packages\(\""$STOCHOPTIM"\", \""$STOCHOPTIM/library"\", NULL, type = \"source\", INSTALL_opts = \"--no-multiarch\"\) >> "$STOCHOPTIM/install_packages.R"

    Rscript "$STOCHOPTIM/install_packages.R" 1> "$STOCHSS_HOME/stdout.log" 2>"$STOCHSS_HOME/stderr.log"

    export R_LIBS="$STOCHOPTIM/library"

# Test that StochKit was installed successfully by running it on a sample model
    if Rscript --vanilla "$STOCHOPTIM/exec/mcem2.r" --model "$STOCHOPTIM/inst/extdata/birth_death_MAmodel.R" --data "$STOCHOPTIM/birth_death_MAdata.txt" --steps "" --seed 1 --cores 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1 --command 'bash' >& /dev/null; then
	echo "Success!<br />"
    else
	echo "Failed<br />"
	echo "$STOCHOPTIM failed to install. Consult logs above for errors<br />"
	exit -1
    fi
fi

echo -n "Testing if StochKit2 ODE built... "

rm -r "$rundir" >& /dev/null
if "$STOCHKIT_ODE/ode" -m "$STOCHKIT_HOME/models/examples/dimer_decay.xml" -t 1 -i 1 --out-dir "$rundir" >& /dev/null; then
    echo "Yes <br />"
    echo "ode found in $STOCHKIT_ODE <br />"
else
    echo "No <br />"

    echo "Installing in $STOCHSS_HOME/$ODE_VERSION <br />"

    echo "Cleaning up anything already there...<br />"
    rm -rf "$STOCHSS_HOME/ode" >& /dev/null

    stdout="$STOCHSS_HOME/stdout.log"
    stderr="$STOCHSS_HOME/stderr.log"
    echo "Building StochKit ODE<br />"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and <br />"
    echo " stderr in $STOCHSS_HOME/stderr.log <br />"
    echo "<font color=\"blue\"><h3>This process should take about a minute to complete, please be patient</h3></font><br />"
    wd=`pwd`
    tmpdir=$(mktemp -d /tmp/tmp.XXXXXX)
    tar -xzf "$STOCHKIT_ODE.tgz"
    mv "$STOCHKIT_ODE" "$tmpdir"
    cd "$tmpdir/$ODE_VERSION/cvodes"
    tar -xzf "cvodes-2.7.0.tar.gz"
    cd "cvodes-2.7.0"
    ./configure --prefix="$PWD/cvodes" 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
        echo "<font color=red>"
	echo "Failed<br />"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE<br />"
	echo "</font>"
        exit -1
    fi
    make 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
        echo "<font color=red>"
	echo "Failed<br />"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE<br />"
	echo "</font>"
        exit -1
    fi
    make install 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
        echo "<font color=red>"
	echo "Failed<br />"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE<br />"
	echo "</font>"
        exit -1
    fi
    cd ../../
    STOCHKIT_ODE_R=$STOCHKIT_ODE
    export STOCHKIT_ODE="$(pwd -P)"
    make 1>"$stdout" 2>"$stderr"
    if [ $? != 0 ]; then
        echo "<font color=red>"
	echo "Failed<br />"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE<br />"
	echo "</font>"
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
        echo "<font color=red>"
	echo "Failed<br />"
	echo "StochKit ODE failed to install. Consult logs above for errors, and the StochKit documentation for help on building StochKit for your platform. Rename successful build folder to $STOCHKIT_ODE</font><br />"
	exit -1
    fi
fi

rm -r "$rundir" >& /dev/null

echo "Configuring the app to use $STOCHKIT_HOME for StochKit... <br />"
echo "Configuring the app to use $STOCHKIT_ODE for StochKit ODE... <br />"
echo "Configuring the app to use $STOCHOPTIM for Stochoptim... <br />"

ln -s "$STOCHKIT_ODE" ode >& /dev/null
ln -s "$STOCHKIT_HOME" StochKit >& /dev/null
ln -s "$STOCHOPTIM" stochoptim >& /dev/null

# Write STOCHKIT_HOME to the appropriate config file
echo "$STOCHKIT_HOME" > "$STOCHSS_HOME/conf/config"
echo -n "$STOCHKIT_ODE" >> "$STOCHSS_HOME/conf/config"
echo "Done!"

exec python "$STOCHSS_HOME/launchapp.py" 1 $0
