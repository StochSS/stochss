/*
 *  ssa_direct_driver.cpp
 *  
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SSA_ConstantTime.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  typedef SSA_ConstantTime<StandardDriverTypes::populationType,
    StandardDriverTypes::stoichiometryType, 
    StandardDriverTypes::propensitiesType,
    StandardDriverTypes::graphType> solverType;

  SerialIntervalSimulationDriver<solverType> driver(ac,av);

  solverType solver=driver.createMassActionSolver();
  
  //set solver-specific parameters
  //none for ssa_constant

  driver.callSimulate(solver);

  driver.writeOutput();

  return 0;
}
