/******************************************************************************
 */

#ifndef _ODE_COMMAND_LINE_H_
#define _ODE_COMMAND_LINE_H_

#include <iostream>
#include <string>
#include <vector>
#include <exception>
#include "stdio.h"
#include "stdlib.h"
#include "boost/program_options.hpp"
#include "boost/filesystem.hpp"
#include "Input_tag.h"
#include "ModelTag.h"
#include "DenseVectorSubset.h"

namespace STOCHKIT
{
 class ODECommandLine
 {
	
 public:
  
  ODECommandLine(int ac, char* av[]);

  std::string getModelFileName() const;

  std::string getODETemplateFileName() const;

  double getSimulationTime() const;

  std::size_t getIntervals() const;

  std::vector<std::size_t> getSpeciesSubset() const;
  bool getLabel() const;//true if labeling columns
  std::vector<std::string> getSpeciesNames() const;

  std::string getOutputDir() const;
  bool getUseExistingOutputDirs() const;

  bool getForce() const;

  std::string getGeneratedCodeDir() const;

  std::string getCmdArgs() const;

 protected:
  void parse(int ac, char* av[]);


 private:
    
  boost::program_options::variables_map vm;
  boost::program_options::options_description visible;
  boost::program_options::options_description hidden;
  boost::program_options::options_description combined;
  
  std::string modelFileName;
  std::string ODETemplateFileName;
  double simulationTime;
  std::size_t intervals;

  std::vector<std::string> species;//command line values: could be species indices or names
  std::vector<std::size_t> speciesSubset;//indices, only nonempty if species is nonempty
  bool label;//true if keeping labels
  std::vector<std::string> speciesNames;//species names/labels
  
  bool force;
  std::string outputDir;

  bool useExistingOutputDirs;
  std::string generatedCodeDir;
  std::string cmdArgs;
 };
}

#endif
