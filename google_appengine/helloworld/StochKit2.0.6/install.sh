#!/bin/bash
#perform installation steps

#set -x

if [ "$STOCHKIT_HOME" == "" ]; then
  pushd "$(dirname "$0")" > /dev/null
  export STOCHKIT_HOME="`pwd -P`"
  popd > /dev/null
fi

cd "$STOCHKIT_HOME/libs/boost_1_42_0/"

./bootstrap.sh

if [ "$?" -ne 0 ]; then
   echo "bootstrap.sh failed to run" 
   exit 1
fi

./bjam -j4 --with-thread

if [ "$?" -ne 0 ]; then
   echo "bjam failed to run" 
   exit 1
fi

./bjam -j4 --with-program_options

if [ "$?" -ne 0 ]; then
   echo "bjam failed to run" 
   exit 1
fi

./bjam -j4 --with-filesystem

if [ "$?" -ne 0 ]; then
   echo "bjam failed to run" 
   exit 1
fi

cd "$STOCHKIT_HOME"

make -j 4

if [ "$?" -eq 2 ]; then
   echo "make failed" 
   exit 1
fi

cd "$STOCHKIT_HOME/custom_drivers/single_trajectory"

make -j 4

if [ "$?" -eq 2 ]; then
   echo "make failed" 
   exit 1
fi

#echo "**********************************************"
#echo "Please remember to add $STOCHKIT_HOME/libs/boost_1_42_0/stage/lib/ to the LD_LIBRARY_PATH environment variable on Linux machines, or the DYLD_LIBRARY_PATH environment variable on Mac machines."
#echo "**********************************************"









