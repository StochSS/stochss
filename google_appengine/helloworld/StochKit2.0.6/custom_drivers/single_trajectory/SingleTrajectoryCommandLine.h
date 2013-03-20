/******************************************************************************
 */

#ifndef _SINGLE_TRAJECTORY_COMMAND_LINE_H_
#define _SINGLE_TRAJECTORY_COMMAND_LINE_H_

#include <iostream>
#include <string>
#include <vector>
#include <exception>
#include "boost/program_options.hpp"
#include "boost/filesystem.hpp"
#include "Input_tag.h"
#include "ModelTag.h"
#include "DenseVectorSubset.h"

using namespace STOCHKIT;

class SingleTrajectoryCommandLine
{
	
public:
  
  SingleTrajectoryCommandLine(int ac, char* av[]);

  std::string getModelFileName() const;

  double getSimulationTime() const;

  bool getUseSeed() const;
  int getSeed() const;

  std::vector<std::size_t> getSpeciesSubset() const;
  bool getLabel() const;//true if labeling columns
  std::vector<std::string> getSpeciesNames() const;

  unsigned getMaxSteps() const;

  std::string getCmdArgs() const;

protected:
  void parse(int ac, char* av[]);


private:
    
  boost::program_options::variables_map vm;
  boost::program_options::options_description visible;
  
  std::string modelFileName;
  double simulationTime;
  int seed;
  bool useSeed;
  
  std::vector<std::string> species;//command line values: could be species indices or names
  std::vector<std::size_t> speciesSubset;//indices, only nonempty if species is nonempty
  bool label;//true if keeping labels
  std::vector<std::string> speciesNames;//species names/labels
  
  unsigned maxSteps;

  std::string cmdArgs;
};

#endif
