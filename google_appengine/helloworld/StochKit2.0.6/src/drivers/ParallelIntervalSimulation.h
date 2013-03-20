/******************************************************************************
 */

#ifndef _PARALLEL_INTERVAL_SIMULATION_H_
#define _PARALLEL_INTERVAL_SIMULATION_H_

#include "Input_mass_action.h"
#include "CommandLineInterface.h"
#include "StandardDriverTypes.h"
#include "StandardDriverUtilities.h"
#include "Input_mixed_before_compile.h"
#include "Input_events_before_compile.h"
#include "IntervalOutput.h"
#include "StatsOutput.h"
#include "HistogramSingle.h"
#include "boost/thread/thread.hpp"
#include "boost/bind.hpp"
#include "boost/random.hpp"
#include "boost/random/uniform_int.hpp"
#include "boost/filesystem.hpp"
#include <iomanip>
#include <sstream>
#include <ctime>
#include <vector>

#ifdef WIN32
#include <windows.h>
#include <fstream>
#endif

namespace STOCHKIT
{

class ParallelIntervalSimulation
{
	
public:
  ParallelIntervalSimulation(int ac, char* av[]);

  void run(std::string executableName);
  
  void executable(std::string command);

  std::size_t assignment(std::size_t totalRealizationss, std::size_t threadid);

  void mergeOutput();

  void warnIfLargeOutput();//helper function that prints a warning if simulation will generate a lot of data

  static std::string modifyCmdArgsRealizations(std::string commandLineArguments, std::string subRealizations);
  static std::string modifyCmdArgsSeed(std::string commandLineArguments, std::string newSeed);

protected:
  CommandLineInterface commandLine;
  std::size_t numberOfProcesses;

  //records how many realizations were assigned to each processor
  std::vector<std::size_t> processorRealizationAssignments;
  std::size_t masterProc;

  int seedOfSeed;
  boost::mt19937 engine ;
  std::size_t numberOfWorkers;
  boost::thread_group sthreads;
};

}

#endif
