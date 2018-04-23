#!/bin/bash

if [ "$0"="-bash" -o "$0"="bash" ];then
    #echo "this file is being sourced"
    EXE_FILE="${BASH_SOURCE[0]}";
else
    EXE_FILE=$0
fi
#echo "EXE_FILE = $EXE_FILE"
##############
if [ -L "$EXE_FILE" ]; then
  MY_PATH=$(readlink "$EXE_FILE")
  MY_PATH=$(dirname "$EXE_FILE")
  MY_PATH=$(cd "$MY_PATH"; pwd)
else
  MY_PATH=$(dirname "$EXE_FILE")
  MY_PATH=$(cd "$MY_PATH"; pwd)
fi
#echo "MY_PATH=$MY_PATH"
##############
if [ -w "$MY_PATH" ] ; then
    CONFIG_DIR="$MY_PATH/.molns/"
else
    CONFIG_DIR="$HOME/.molns/"
fi
##############
alias molns="$MY_PATH/molns.py --config=$CONFIG_DIR"
