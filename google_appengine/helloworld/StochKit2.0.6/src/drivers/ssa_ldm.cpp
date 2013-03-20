/*
 *  ssa_constant.cpp
 *  
 */
#include "boost_headers.h"

#include "ParallelIntervalSimulation.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  ParallelIntervalSimulation parallelDriver(ac,av);

  parallelDriver.run("$STOCHKIT_HOME/bin/ssa_ldm_serial");
  
  parallelDriver.mergeOutput();

  return 0;
}
