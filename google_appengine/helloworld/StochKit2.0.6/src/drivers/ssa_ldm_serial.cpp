/*
 *  ssa_direct_driver.cpp
 *  
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SSA_LDM.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  typedef SSA_LDM<StandardDriverTypes::populationType,
    StandardDriverTypes::stoichiometryType, 
    StandardDriverTypes::propensitiesType,
    StandardDriverTypes::graphType> solverType;

  SerialIntervalSimulationDriver<solverType> driver(ac,av);

  solverType solver=driver.createMassActionSolver();
  
  //set solver-specific parameters
  //none for ssa_ldm

  driver.callSimulate(solver);

  driver.writeOutput();

  return 0;
}
