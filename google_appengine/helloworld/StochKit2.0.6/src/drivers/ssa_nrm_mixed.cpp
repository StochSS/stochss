/*
 *  
 */
#include "boost_headers.h"

#include "ParallelIntervalSimulation.h"
#include "CommandLineInterface.h"
#include "StandardDriverUtilities.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  std::string executableName="ssa_nrm_mixed_compiled";

  CommandLineInterface commandLine(ac,av);

  StandardDriverUtilities::compileMixed(executableName,commandLine);
  
  ParallelIntervalSimulation parallelDriver(ac,av);

  parallelDriver.run(commandLine.getGeneratedCodeDir()+"/bin/"+executableName);
  
  parallelDriver.mergeOutput();

  return 0;
}
