/*
 *  ssa_direct_serial_small.cpp
 *  
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SSA_Direct.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  //note use of dense stoichiometry type for small problems
  typedef SSA_Direct<StandardDriverTypes::populationType,
    StandardDriverTypes::denseStoichiometryType, 
    StandardDriverTypes::propensitiesType,
    StandardDriverTypes::graphType> solverType;

  SerialIntervalSimulationDriver<solverType> driver(ac,av);

  solverType solver=driver.createMassActionSolver();
  
  //set solver-specific parameters
  //none for ssa_direct

  driver.callSimulate(solver);

  driver.writeOutput();

  return 0;
}
