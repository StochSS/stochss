#!/usr/bin/env bash
WD=`pwd`
cd $1
echo "Starting installation of StochSS dependencies." >> run_mac_install.log
echo "old_wd=$WD script=$0 wd=$1" >> run_mac_install.log
MY_PATH="`pwd`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
STOCHSS_HOME=$MY_PATH
STOCHSS_HOME="`( cd \"$STOCHSS_HOME\" && pwd )`" 
export MYPYTHON="$STOCHSS_HOME/../local/bin/python"
export MYPIP="$STOCHSS_HOME/../local/bin/pip"
LIBXML="$(xcodebuild -version Path -sdk macosx)/usr/include/libxml2"


#################

function check_for_lib {
    if [ -z "$1" ];then
        return 1 #False
    fi
    if [ "$1" = "mysql-connector-python" ]; then
        RET=`$MYPYTHON -c "import mysql.connector" 2>/dev/null`
        RC=$?
    else
        RET=`$MYPYTHON -c "import $1" 2>/dev/null`
        RC=$?
    fi
    if [[ $RC != 0 ]];then
        return 1 #False
    fi
    return 0 #True
}


function install_lib {
    if [ -z "$1" ];then
        return 1 #False
    fi
    export ARCHFLAGS='-Wno-error=unused-command-line-argument-hard-error-in-future'
    if [ "$1" = "libsbml" ]; then
	CMD="CFLAGS=\"-I$LIBXML\" $MYPYTHON $MYPIP install python-libsbml"
    elif [ "$1" = "mysql-connector-python" ]; then
    CMD="$MYPYTHON $MYPIP install --allow-external $1 $1"
    else
	CMD="$MYPYTHON $MYPIP install $1"
    fi
    echo $CMD >> run_mac_install.log
    eval $CMD
}

function check_and_install_dependencies {
    if ! check_pip;then
        install_pip
    fi
    deps=("numpy" "scipy" "matplotlib" "h5py" "libsbml" "mysql-connector-python")
    for dep in "${deps[@]}"
    do
        echo "Checking for $dep" >> run_mac_install.log
        if check_for_lib "$dep";then
            echo "$dep detected successfully." >> run_mac_install.log
        else
            install_lib "$dep"
            if check_for_lib "$dep";then
                echo "$dep installed successfully." >> run_mac_install.log
            else
                echo "$dep install failed." >> run_mac_install.log
                return 1 #False
            fi
        fi
    done
    return 0 #True
}

function check_pip {
    if which $MYPIP > /dev/null;then
        echo "pip is installed on your system, using it." >> run_mac_install.log
        return 0 #True
    else
        echo "pip is not installed on your system." >> run_mac_install.log
        return 1 #False
    fi
}

function install_pip {
    CMD="curl -o get-pip.py https://bootstrap.pypa.io/get-pip.py"
    echo $CMD >> run_mac_install.log
    eval $CMD
    CMD="$MYPYTHON get-pip.py"
    echo $CMD >> run_mac_install.log
    eval $CMD
}

check_and_install_dependencies

