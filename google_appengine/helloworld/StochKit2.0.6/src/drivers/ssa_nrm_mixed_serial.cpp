/*
 *  
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SSA_NRM.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  typedef SSA_NRM<StandardDriverTypes::populationType,
    StandardDriverTypes::stoichiometryType, 
    StandardDriverTypes::propensitiesType,
    StandardDriverTypes::graphType> solverType;

  SerialIntervalSimulationDriver<solverType> driver(ac,av);

  solverType solver=driver.createMixedSolver();
  
  //set solver-specific parameters
  //none for ssa

  driver.callSimulate(solver);

  driver.writeOutput();

  return 0;
}
