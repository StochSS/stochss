/******************************************************************************
 */

#ifndef _COMMAND_LINE_INTERFACE_H_
#define _COMMAND_LINE_INTERFACE_H_

#include <iostream>
#include <string>
#include <vector>
#include <exception>
#include "boost/program_options.hpp"
#include "boost/filesystem.hpp"
#include "Input_tag.h"
#include "ModelTag.h"
#include "DenseVectorSubset.h"

namespace STOCHKIT
{
 class CommandLineInterface
 {
	
 public:
  
  CommandLineInterface(int ac, char* av[]);

  std::string getModelFileName() const;

  double getSimulationTime() const;

  std::size_t getRealizations() const;

  std::size_t getIntervals() const;

  bool getUseSeed() const;
  int getSeed() const;

  bool getKeepStats() const;

  bool getKeepTrajectories() const;

  bool getKeepHistograms() const;
  std::size_t getHistogramBins() const;

  std::size_t getProcesses() const;

  std::vector<std::size_t> getSpeciesSubset() const;
  bool getLabel() const;//true if labeling columns
  std::vector<std::string> getSpeciesNames() const;

  std::string getOutputDir() const;
  bool getUseExistingOutputDirs() const;

  bool getForce() const;

  std::string getStatsDir() const;
  std::string getMeansFileName() const;
  std::string getVariancesFileName() const;
  std::string getStatsInfoFileName() const;
  std::string getTrajectoriesDir() const;
  std::size_t getTrajectoriesOffset() const;
  std::string getHistogramsDir() const;
  std::string getHistogramsInfoFileName() const;

  double getEpsilon() const;
  std::size_t getThreshold() const;
  std::size_t getSSASteps() const;

  std::string getGeneratedCodeDir() const;
  bool getRecompile() const;

  std::string getCmdArgs() const;

 protected:
  void parse(int ac, char* av[]);


 private:
    
  boost::program_options::variables_map vm;
  boost::program_options::options_description visible;
  boost::program_options::options_description hidden;
  boost::program_options::options_description combined;
  
  std::string modelFileName;
  double simulationTime;
  std::size_t realizations;
  std::size_t intervals;
  int seed;
  bool useSeed;

  bool keepStats;
  bool keepTrajectories;
  bool keepHistograms;
  std::size_t histogramBins;

  double epsilon;
  std::size_t threshold;
  std::size_t SSASteps;

  std::size_t processes;
  
  std::vector<std::string> species;//command line values: could be species indices or names
  std::vector<std::size_t> speciesSubset;//indices, only nonempty if species is nonempty
  bool label;//true if keeping labels
  std::vector<std::string> speciesNames;//species names/labels
  
  bool force;
  std::string outputDir;

  bool useExistingOutputDirs;
  std::string statsDir;
  std::string meansFileName;
  std::string variancesFileName;
  std::string statsInfoFileName;
  std::string trajectoriesDir;
  std::size_t trajectoriesOffset;
  std::string histogramsDir;
  std::string histogramsInfoFileName;
  std::string generatedCodeDir;
  bool recompile;
  std::string cmdArgs;
 };
}

#endif
