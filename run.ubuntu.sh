#!/bin/bash

mode="run"
install_mode="false"
token="not_set"
browser="true"
while [[ $# > 0 ]]
do
key="$1"
case $key in
    --install)
    echo "install"
    mode="install"
    ;;
    --no_browser)
    echo "no browser"
    browser="false"
    ;;
    --debug)
    echo "debug"
    mode="debug"
    ;;
    --run)
    echo "run"
    mode="run"
    ;;
    --yy)
    echo "yy"
    install_mode="true"
    ;;
    -a)
    ip="$2"
    shift # past argument
    echo $ip
    ;;
    -t)
    token="$2"
    shift # past argument
    echo $token
    ;;
    *)
    echo "Arguments not recognized recognized...exiting"      # unknown option
    exit 1
    ;;
esac
shift # past argument or value
done

echo "token is $token"
echo "ip is $ip"

osname=$(uname)
if [ "$osname" != 'Linux' ]; then
    echo "Error: $0 runs on Linux! This is $osname"
    exit
fi

help_message="Usage: $0 [--run] [--install]"


MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 

echo "Installing in $STOCHSS_HOME"

STOCHKIT_VERSION=StochKit2.0.11
STOCHKIT_PREFIX=$STOCHSS_HOME
export STOCHKIT_HOME="$STOCHKIT_PREFIX/$STOCHKIT_VERSION"
ODE_VERSION="ode-1.0.2"
export STOCHKIT_ODE="$STOCHSS_HOME/$ODE_VERSION"
STOCHOPTIM_VERSION="stochoptim-0.5-1"
export STOCHOPTIM="$STOCHSS_HOME/$STOCHOPTIM_VERSION"
export R_LIBS="$STOCHOPTIM/library"

if [ "$(echo $STOCHSS_HOME | grep " ")" != "" ]; then
    echo "Cannot install StochSS under any directory that contains spaces (which the filename listed above has). This is a known issue"
    exit -1
fi

# Check that the dependencies are satisfied
echo -n "Are dependencies satisfied?... "

PKGS="gcc g++ make libxml2-dev curl git r-base-core libgsl0-dev build-essential python-dev python-setuptools cython libbz2-dev libhdf5-mpi-dev"
if [ `getconf LONG_BIT` != 64 ]; then
    PKGS="gcc-multilib $PKGS"
fi

number_of_pkgs=`echo $PKGS | wc -w`
count=$(dpkg-query -l $PKGS | grep '^[a-z]i' | wc -l)
if [ $count != $number_of_pkgs ]; then
    echo "No $count of $number_of_pkgs packages installed"
    CMD="sudo apt-get -y install $PKGS"
    echo "Running '$CMD'"
    if ["$install_mode" = 'true']; then
        eval $CMD
        if [ $? != 0 ]; then
            exit -1
        fi
    else
        read -p "Do you want me to try to use sudo to install required package(s) ($PKGS)? (y/n): " answer
        if [ "$answer" == 'y' ] || [ "$answer" == 'yes' ]; then
            CMD="sudo apt-get -y install $PKGS"
            echo "Running '$CMD'"
            eval $CMD
            if [ $? != 0 ]; then
                exit -1
            fi
        fi
    fi
else
    echo "Yes"
fi

#####################

function check_pyurdme_sub {
    RET=`python -c "import pyurdme" 2>/dev/null`
    RC=$?
    if [[ $RC == 0 ]];then
        return 0 #True
    fi
    return 1 #False
}
function check_pyurdme {
    PYURDME_CONF="$STOCHSS_HOME/app/lib/pyurdme-stochss/pyurdme_init"
    if [ -e $PYURDME_CONF ];then
        echo "PyURDME local install found, sourcing $PYURDME_CONF"
        source $PYURDME_CONF
        if check_pyurdme_sub;then
            return 0 #True
        fi
    fi
    return 1 #False
}

function check_lib {
    if [ -z "$1" ];then
        return 1 #False
    fi
    echo "Checking for $1"
    RET=`python -c "import $1" 2>/dev/null`
    RC=$?
    if [[ $RC == 0 ]];then
        echo "$1 detected successfully"
        return 0 #True
    fi
    echo "$1 not found"
    return 1 #False
}
function check_pip {
    if which pip > /dev/null;then
        echo "pip is installed on your system, using it<br />"
        return 0 #True
    else
        echo "pip is not installed on your system<br />"
        return 1 #False
    fi
}

function install_pip {
    echo "We need to install python pip from https://bootstrap.pypa.io/get-pip.py"
    if ["$install_mode" = 'false']; then
        read -p "Do you want me to try to use sudo to install required packages [you may be prompted for the admin password] (y/n): " answer

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
    if ["$install_mode" = 'true'] || ["$answer" == 'y'] || ["$answer" == 'yes']; then
        CMD="curl -o get-pip.py https://bootstrap.pypa.io/get-pip.py"
        echo $CMD
        eval $CMD
        CMD="sudo python get-pip.py"
        echo $CMD
        eval $CMD
    else
        exit -1
    fi
}
function install_lib_h5py {
    if ! check_pip;then
        install_pip
    fi
    echo "We need install the following packages: h5py"
    if ["$install_mode" = 'false']; then
        read -p "Do you want me to try to use sudo to install required packages (y/n): " answer

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
    if ["$install_mode" = 'true'] || ["$answer" == 'y'] || ["$answer" == 'yes']; then
        CMD='sudo CC="mpicc" pip install h5py'
        echo $CMD
        eval $CMD
        if [ $? != 0 ]; then
            exit -1
        fi
        echo "$1 installed successfully"
    else
        exit -1
    fi

}
function install_lib {
    if [ -z "$1" ];then
        return 1 #False
    fi
    if ["$install_mode" = 'false']; then
        read -p "Do you want me to try to use sudo to install required packages (y/n): " answer

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
    if ["$install_mode" = "true"] || ["$answer" == 'y'] || ["$answer" == 'yes']; then
        CMD="sudo apt-get -y install $1"
        echo $CMD
        eval $CMD
        if [ $? != 0 ]; then
            exit -1
        fi
        echo "$1 installed successfully"
    else
        exit -1
    fi
}

function install_lib_pip {
    if [ -z "$1" ];then
        return 1 #False
    fi
    if ! check_pip;then
        install_pip
    fi
    if [ -z "$2" ];then
        echo "We need to install package $1"
    else
        echo "We need to install package $1 with flags '$2'"
    fi
    if ["$install_mode" = "false"]; then
        read -p "Do you want me to try to use sudo to install required packages (y/n): " answer

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
    if ["$install_mode" = "true"] || ["$answer" == 'y' || ["$answer" == 'yes']; then
        CMD="sudo pip install $2 $1"
        echo $CMD
        eval $CMD
        if [ $? != 0 ]; then
            exit -1
        fi
        echo "$1 installed successfully"
    else
        exit -1
    fi
}

function check_and_install_deps {
    if ! check_lib "h5py";then
        install_lib_h5py
    fi
    if ! check_lib "numpy";then
        install_lib "python-numpy"
    fi
    if ! check_lib "scipy";then
        install_lib "python-scipy"
    fi
    if ! check_lib "matplotlib";then
        install_lib "python-matplotlib"
    fi
    if ! check_lib "libsbml";then
       install_lib_pip "python-libsbml"
    fi
    if ! check_lib "mysql";then
        install_lib_pip "mysql-connector-python" "--allow-external mysql-connector-python"
    fi
}

function check_dolfin {
    RET=`python -c "import dolfin" 2>/dev/null`
    RC=$?
    if [[ $RC == 0 ]];then
        return 0 #True
    fi
    return 1 #False
}
function install_dolfin {
    echo "We need to add the the following ppa: 'ppa:fenics-packages/fenics"
    echo "And install the following packages: python-software-properties fenics "
    if ["$install_mode" = "false"]; then
        read -p "Do you want me to try to use sudo to install required packages (y/n): " answer

        if [ $? != 0 ]; then
            exit -1
        fi
    fi
    if ["$install_mode" = "true"] || ["$answer" == 'y'] || ["$answer" == 'yes']; then
        echo "Running 'sudo apt-get install ..."
        sudo apt-get -y install python-software-properties
        sudo add-apt-repository ppa:fenics-packages/fenics
        sudo apt-get update
        sudo apt-get -y install fenics
        return 0 # True
        if [ $? != 0 ]; then
            exit -1
        fi
    else
        exit -1
    fi
}

function check_python_package_installation {
    check_and_install_deps
    echo "Checking for FEniCS/Dolfin"
    if check_dolfin; then
        echo "FEniCS/Dolfin detected successfully"
    else
        install_dolfin
        if check_dolfin; then
            echo "FEniCS/Dolfin detected successfully"
        else
            echo "FEniCS/Dolfin not installed"
            return 1 #False
        fi
    fi

    echo "Checking for PyURDME"
    if check_pyurdme; then
        echo "PyURDME detected successfully"
    else
        echo "PyURDME import from $STOCHSS_HOME/app/lib/pyurdme-stochss/ not working (check if all required python modules are installed)"
        return 1 #False
    fi
    return 0 #True
}

#####################

if check_python_package_installation;then
    echo "Python packages installed correctly"
else
    echo "Error checking the Python packages"
    exit 1
fi
#####################

function retry_command {
    if [ -z "$1" ];then
        return 1 #False
    fi

    for i in `seq 1 3`;
    do
        echo "$1"
        eval "$1"
        RET=$?
        if [[ $RET != 0 ]] ;then
            echo "Failed to execute: \"$1\""
        else
            return 0 # True
        fi
    done

    echo "Failed to execute: \"$1\", Exiting"
    exit -1
}

echo "Running 'instant-clean'"
instant-clean

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
        #curl -o "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" -L "http://sourceforge.net/projects/stochkit/files/StochKit2/$STOCHKIT_VERSION/$STOCHKIT_VERSION.tgz"
        curl -o "$STOCHKIT_PREFIX/$STOCHKIT_VERSION.tgz" -L "http://sourceforge.net/projects/stochkit/files/StochKit2/StochKit2.0.11/StochKit2.0.11.tgz/download"
    fi

    echo "Building StochKit"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process will take at least 5 minutes to complete. Please be patient *"
    wd=`pwd`
    cd "$STOCHKIT_PREFIX"
    retry_command "tar -xzf \"$STOCHKIT_VERSION.tgz\""
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

is_stochoptim_installed="false"
function check_if_StochOptim_Installed {
   is_stochoptim_installed="false"

   export R_LIBS="$STOCHOPTIM/library"
   CMD="Rscript --vanilla \"$STOCHOPTIM/exec/mcem2.r\" --model \"$STOCHOPTIM/inst/extdata/birth_death_MAmodel.R\" --data \"$STOCHOPTIM/birth_death_MAdata.txt\" --steps \"\" --seed 1 --cores 1 --K.ce 1000 --K.em 100 --K.lik 10000 --K.cov 10000 --rho 0.01 --perturb 0.25 --alpha 0.25 --beta 0.25 --gamma 0.25 --k 3 --pcutoff 0.05 --qcutoff 0.005 --numIter 10 --numConverge 1 --command 'bash' >& /dev/null"

#   echo $CMD
   eval $CMD

   status_code=$?
#   echo "status_code = $status_code"
   if [ $status_code -ne 0 ]; then
      is_stochoptim_installed="false"
   else
      is_stochoptim_installed="true"
   fi
#   echo "is_stochoptim_installed = $is_stochoptim_installed"
   return $status_code
}

check_if_StochOptim_Installed
if [ "$is_stochoptim_installed" = "true" ]; then
    echo "Yes"
    echo "$STOCHOPTIM_VERSION found in $STOCHOPTIM"
else
    echo "No"

    echo "Installing in $STOCHSS_HOME/$STOCHOPTIM_VERSION"

    echo "Cleaning up anything already there..."
    rm -rf "$STOCHOPTIM" >& /dev/null

    echo "Building StochOptim"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process will take at least 5 minutes to complete. Please be patient *"

    echo `pwd`
    echo `pwd`
    retry_command "tar -xzf \"$STOCHOPTIM.tgz\""
    mkdir "$STOCHOPTIM/library"
    RET=$?
    if [[ $RET != 0 ]] ;then
        echo "Failed to: mkdir \"$STOCHOPTIM/library\", exiting"
        exit -1
    fi

    wd=`pwd`

    echo install.packages\(\"optparse\", \""$STOCHOPTIM/library"\", \"http://cran.us.r-project.org\", INSTALL_opts = \"--no-multiarch\"\) > "$STOCHOPTIM/install_packages.R"
    echo install.packages\(\""$STOCHOPTIM"\", \""$STOCHOPTIM/library"\", NULL, type = \"source\", INSTALL_opts = \"--no-multiarch\"\) >> "$STOCHOPTIM/install_packages.R"

    Rscript "$STOCHOPTIM/install_packages.R" 1> "$STOCHSS_HOME/stdout.log" 2>"$STOCHSS_HOME/stderr.log"

    export R_LIBS="$STOCHOPTIM/library"

    check_if_StochOptim_Installed
    # Test that StochKit was installed successfully by running it on a sample model
    if [ "$is_stochoptim_installed" = "true" ]; then
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
    rm -rf "$STOCHSS_HOME/ode" >& /dev/null

    stdout="$STOCHSS_HOME/stdout.log"
    stderr="$STOCHSS_HOME/stderr.log"
    echo "Building StochKit ODE"
    echo " Logging stdout in $STOCHSS_HOME/stdout.log and "
    echo " stderr in $STOCHSS_HOME/stderr.log "
    echo " * This process should take about a minute to complete. Please be patient *"
    wd=`pwd`
    tmpdir=$(mktemp -d /tmp/tmp.XXXXXX)
    retry_command "tar -xzf \"$STOCHKIT_ODE.tgz\""
    mv "$STOCHKIT_ODE" "$tmpdir"
    cd "$tmpdir/$ODE_VERSION/cvodes"
    retry_command "tar -xzf \"cvodes-2.7.0.tar.gz\""
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

if [ "$mode" = "run" ] || [ "$mode" = "debug" ]; then
    echo "Running StochSS..."
    export PATH=$PATH:$STOCHKIT_HOME
    exec python "$STOCHSS_HOME/launchapp.py" $0 $browser $token $ip
fi
