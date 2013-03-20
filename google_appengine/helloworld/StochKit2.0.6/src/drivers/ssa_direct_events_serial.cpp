/*
 *  
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SSA_Direct_Events.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

  typedef SSA_Direct_Events<StandardDriverTypes::populationType,
    StandardDriverTypes::stoichiometryType, 
    StandardDriverTypes::eventEnabledPropensitiesType,
    StandardDriverTypes::graphType> solverType;

  SerialIntervalSimulationDriver<solverType> driver(ac,av);

  solverType solver=driver.createEventsSolver();
  
  //set solver-specific parameters
  //none

  driver.callSimulate(solver);

  driver.writeOutput();

  return 0;
}
